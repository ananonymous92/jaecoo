# 🚀 Panduan Deployment JAECOO Website ke VPS Domainesia

## Arsitektur Production

```
Browser → Nginx :80/:443 → Node.js :3001
                              ├── dist/ (Static Frontend)
                              ├── data/ (JSON Database)
                              └── public/images/ (Uploads)
```

> **Satu server Express** yang melayani frontend (static build) + API + admin panel.

---

## 1️⃣ Persiapan di Lokal (Sebelum Upload)

```bash
# 1. Build production
npm run build

# 2. Pastikan ada file-file ini:
#    ✅ dist/            → Frontend build
#    ✅ data/            → JSON database
#    ✅ public/images/   → Gambar yang di-upload
#    ✅ server.js        → Backend server
#    ✅ package.json     → Dependencies
#    ✅ .env.example     → Template environment
#    ✅ ecosystem.config.cjs → PM2 config
```

---

## 2️⃣ Setup VPS Domainesia

### Login ke VPS
```bash
ssh root@IP_VPS_ANDA
```

### Install Node.js 20 LTS
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm alias default 20
node -v
```

### Install PM2 & Nginx
```bash
npm install -g pm2
sudo apt update && sudo apt install -y nginx
```

---

## 3️⃣ Upload Project ke VPS

### Opsi A: Git (Recommended)
```bash
cd /var/www
git clone https://github.com/USERNAME/jaecoo-website.git jaecoo
cd jaecoo
npm install --omit=dev
```

### Opsi B: SCP / FileZilla
```bash
# Di lokal - upload file (EXCLUDE node_modules)
scp -r dist/ data/ public/ server.js package.json ecosystem.config.cjs .env.example deploy/ root@IP_VPS:/var/www/jaecoo/

# Di VPS
cd /var/www/jaecoo
npm install --omit=dev
```

**PENTING:** Jangan upload `node_modules/`. Install ulang di VPS.

---

## 4️⃣ Konfigurasi Environment

```bash
cd /var/www/jaecoo
cp .env.example .env
nano .env
```

Edit file `.env`:
```env
PORT=3001
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=GANTI_DENGAN_PASSWORD_KUAT
SESSION_SECRET=GANTI_DENGAN_STRING_RANDOM_PANJANG
CORS_ORIGINS=
```

Generate random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 5️⃣ Buat Direktori yang Diperlukan

```bash
mkdir -p data public/images logs
chmod -R 755 /var/www/jaecoo
chown -R www-data:www-data /var/www/jaecoo
```

---

## 6️⃣ Jalankan dengan PM2

```bash
cd /var/www/jaecoo
pm2 start ecosystem.config.cjs
pm2 status
pm2 save
pm2 startup
```

---

## 7️⃣ Konfigurasi Nginx

```bash
sudo cp /var/www/jaecoo/deploy/nginx.conf /etc/nginx/sites-available/jaecoo
sudo nano /etc/nginx/sites-available/jaecoo
# Ganti yourdomain.com dengan domain Anda

sudo ln -s /etc/nginx/sites-available/jaecoo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8️⃣ SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run
```

---

## 9️⃣ Verifikasi

```bash
curl http://localhost:3001/api/health
# Browser: https://yourdomain.com
# Admin:   https://yourdomain.com/admin
```

---

## 🔄 Update Website

```bash
cd /var/www/jaecoo
git pull origin main
npm install --omit=dev
npm run build       # Hanya jika ada perubahan di src/
pm2 restart jaecoo-web
```

Perubahan konten via admin panel TIDAK perlu rebuild.

---

## 🛠️ PM2 Commands

```bash
pm2 restart jaecoo-web
pm2 stop jaecoo-web
pm2 logs jaecoo-web
pm2 monit
```
