import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_IMAGES_DIR = path.join(__dirname, 'public', 'images');

const BASE_URL = 'https://jaecootangerang.com';
const API_ENDPOINTS = ['models', 'news', 'dealers', 'testimonials', 'gallery', 'settings'];
const CATEGORIES_API = 'news/categories';

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}, status: ${res.statusCode}`));
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      return resolve(); // Skip if exists
    }
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download image ${url}, status: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

function extractImageUrls(obj, urls = new Set()) {
  if (typeof obj === 'string') {
    if (obj.startsWith('/images/upload-')) {
      urls.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractImageUrls(item, urls));
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(val => extractImageUrls(val, urls));
  }
  return urls;
}

async function sync() {
  console.log('Starting sync from', BASE_URL);
  
  let allImageUrls = new Set();
  
  // Sync endpoints
  for (const endpoint of API_ENDPOINTS) {
    try {
      console.log(`Fetching API: ${endpoint}...`);
      const data = await fetchUrl(`${BASE_URL}/api/${endpoint}`);
      const json = JSON.parse(data);
      
      // Save JSON
      const filePath = path.join(DATA_DIR, `${endpoint}.json`);
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
      console.log(`Saved ${endpoint}.json`);
      
      // Extract images
      extractImageUrls(json, allImageUrls);
    } catch (e) {
      console.error(`Error syncing ${endpoint}:`, e.message);
    }
  }
  
  // Also fetch news categories
  try {
    console.log(`Fetching API: news/categories...`);
    const data = await fetchUrl(`${BASE_URL}/api/news/categories`);
    const json = JSON.parse(data);
    const filePath = path.join(DATA_DIR, `news-categories.json`);
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log(`Saved news-categories.json`);
  } catch(e) {
      console.error(`Error syncing news/categories:`, e.message);
  }

  // Download images
  console.log(`\nFound ${allImageUrls.size} images to sync.`);
  let count = 0;
  for (const imageUrl of allImageUrls) {
    const fileName = path.basename(imageUrl);
    const destPath = path.join(PUBLIC_IMAGES_DIR, fileName);
    const fullUrl = `${BASE_URL}${imageUrl}`;
    
    try {
      await downloadImage(fullUrl, destPath);
      count++;
      if (count % 10 === 0) console.log(`Downloaded ${count}/${allImageUrls.size} images`);
    } catch (e) {
      console.error(`Error downloading ${imageUrl}:`, e.message);
    }
  }
  
  console.log(`\nSync completed! Downloaded ${count} images successfully.`);
}

sync();
