import{a as s}from"./apiClient-lyAnOTD-.js";import{c as M,i as T}from"./vendor-icons-BJpMaZcN.js";const te=[{id:"dashboard",label:"Dashboard",icon:"layout-dashboard"},{id:"banner",label:"Banner & Settings",icon:"image"},{id:"models",label:"Our Models",icon:"car"},{id:"news",label:"News & Updates",icon:"newspaper"},{id:"gallery",label:"Gallery",icon:"images"},{id:"dealers",label:"Dealers Location",icon:"map-pin"},{id:"reservation",label:"Reservations",icon:"calendar-check"},{id:"contacts",label:"Contact Messages",icon:"mail"}];let D="dashboard",y=[],B=[],w=[],$=[],p={},S=-1;function _(){const e=document.getElementById("login-form"),t=document.getElementById("login-screen"),a=document.getElementById("admin-app"),l=document.getElementById("logout-btn");s.isLoggedIn()?s.checkAuth().then(i=>{i.authenticated?r():(s.clearToken(),n())}).catch(()=>n()):n(),e.addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("login-username").value,d=document.getElementById("login-password").value,u=document.getElementById("login-error"),b=document.getElementById("login-btn");try{b.disabled=!0,b.textContent="Logging in...",u.style.display="none",await s.login(o,d),r()}catch(E){u.textContent=E.message||"Login gagal. Periksa username dan password.",u.style.display="block"}finally{b.disabled=!1,b.textContent="Login"}}),l.addEventListener("click",async()=>{await s.logout(),n()}),window.onAuthExpired=()=>{alert("Sesi Anda telah berakhir. Silakan login kembali."),n()};function n(){t.style.display="flex",a.style.display="none"}function r(){t.style.display="none",a.style.display="",ae()}}function ae(){le(),ee()}function le(){const e=document.getElementById("sidebar-nav");e.innerHTML="",te.forEach(t=>{const a=document.createElement("a");a.href=`#${t.id}`,a.className=`nav-item ${D===t.id?"active":""}`,a.innerHTML=`<i data-lucide="${t.icon}"></i><span>${t.label}</span>`,a.addEventListener("click",l=>{l.preventDefault(),D=t.id,document.getElementById("current-page-title").textContent=t.label,document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active")),a.classList.add("active"),ee()}),e.appendChild(a)}),M({icons:T})}function ee(){const e=document.getElementById("content-area");switch(D){case"dashboard":oe();break;case"banner":be();break;case"news":H();break;case"models":j();break;case"gallery":pe();break;case"dealers":me();break;case"reservation":ge();break;case"contacts":ue();break;default:e.innerHTML=x(D,"Loading...")}M({icons:T})}function x(e,t){return`
    <div class="dashboard-card">
      <div class="card-header"><h3 class="card-title">Manage ${e}</h3></div>
      <div class="empty-state">
        <i data-lucide="loader" class="empty-icon" style="animation: spin 2s linear infinite"></i>
        <h4 style="margin-bottom: 8px; color: var(--text-main);">${t}</h4>
      </div>
    </div>
  `}async function oe(){const e=document.getElementById("content-area");try{const t=await s.getStats();e.innerHTML=`
      <div class="dashboard-card">
        <div class="card-header"><h3 class="card-title">Welcome to JAECOO Admin</h3></div>
        <p style="color: var(--text-muted); margin-bottom: 20px;">
          Panel administrasi JAECOO Indonesia. Semua perubahan langsung tersimpan dan terlihat di website.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
          ${[{label:"Models",value:t.models,icon:"car",color:"#00D2C4"},{label:"News",value:t.news,icon:"newspaper",color:"#0077FF"},{label:"Gallery",value:t.gallery,icon:"images",color:"#FFB800"},{label:"Dealers",value:t.dealers,icon:"map-pin",color:"#FF5722"},{label:"Reservations",value:t.reservations,icon:"calendar-check",color:"#9C27B0"},{label:"Contacts",value:t.contacts,icon:"mail",color:"#4CAF50"}].map(a=>`
            <div style="background: rgba(255,255,255,0.04); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom: 12px;">
                <div style="width:36px;height:36px;background:${a.color}15;color:${a.color};border-radius:8px;display:flex;align-items:center;justify-content:center;">
                  <i data-lucide="${a.icon}" style="width:18px;height:18px;"></i>
                </div>
                <span style="color:var(--text-muted);font-size:0.85rem;">${a.label}</span>
              </div>
              <div style="font-size: 2rem; font-weight: 700;">${a.value}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}catch(t){e.innerHTML=`<div class="dashboard-card"><p style="color:var(--danger);">Error loading dashboard: ${t.message}</p></div>`}M({icons:T})}async function H(){const e=document.getElementById("content-area");e.innerHTML=x("News","Loading news data...");try{y=await(await fetch("/api/news")).json(),ne()}catch{e.innerHTML=x("News","Error loading news data.")}}function ne(){var a;const e=document.getElementById("content-area");let t=y.map((l,n)=>`
    <tr>
      <td><img src="${l.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td><strong>${l.title}</strong><br><small style="color: var(--text-muted)">${l.date} - ${l.category}</small></td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px;" data-action="edit-news" data-index="${n}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-news" data-index="${n}">Delete</button>
      </td>
    </tr>
  `).join("");e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage News & Updates</h3>
        <button class="btn btn-primary" id="add-news-btn"><i data-lucide="plus"></i> Add News</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Image</th><th>Title & Info</th><th width="150">Actions</th></tr></thead>
        <tbody>${t.length?t:'<tr><td colspan="3" class="empty-state">No news found</td></tr>'}</tbody>
      </table>
    </div>
  `,M({icons:T}),(a=document.getElementById("add-news-btn"))==null||a.addEventListener("click",()=>X(-1)),e.querySelectorAll('[data-action="edit-news"]').forEach(l=>{l.addEventListener("click",()=>X(parseInt(l.dataset.index)))}),e.querySelectorAll('[data-action="delete-news"]').forEach(l=>{l.addEventListener("click",()=>de(parseInt(l.dataset.index)))})}function X(e){const t=document.getElementById("content-area"),a=e===-1,l=a?{title:"",category:"NEWS",date:"",excerpt:"",content:"",image:""}:y[e];t.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${a?"Add New Article":"Edit Article"}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-news-btn">Cancel</button>
          <button class="btn btn-primary" id="save-news-btn">Save Changes</button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Title</label><input type="text" id="news-title" class="form-control" value="${l.title}"></div>
      <div class="form-group" style="display: flex; gap: 20px;">
        <div style="flex: 1"><label class="form-label">Category</label><input type="text" id="news-cat" class="form-control" value="${l.category}"></div>
        <div style="flex: 1"><label class="form-label">Date</label><input type="text" id="news-date" class="form-control" value="${l.date}" placeholder="e.g. 14 September 2026"></div>
      </div>
      <div class="form-group"><label class="form-label">Image URL</label>
        <div style="display:flex;gap:5px;"><input type="text" id="news-img" class="form-control" value="${l.image}"><button class="btn btn-outline" style="padding:0 10px;" id="upload-news-img">Upload</button></div>
      </div>
      <div class="form-group"><label class="form-label">Excerpt</label><textarea id="news-excerpt" class="form-control" style="min-height: 60px;">${l.excerpt}</textarea></div>
      <div class="form-group"><label class="form-label">Content (HTML allowed)</label><textarea id="news-content" class="form-control" style="min-height: 200px;">${l.content}</textarea></div>
    </div>
  `,document.getElementById("cancel-news-btn").addEventListener("click",()=>H()),document.getElementById("save-news-btn").addEventListener("click",()=>re(e)),document.getElementById("upload-news-img").addEventListener("click",()=>F("news-img"))}async function re(e){const t=document.getElementById("news-title").value,a=t.toLowerCase().replace(/[^a-z0-9]+/g,"-"),l={id:e===-1?a:y[e].id,slug:a,category:document.getElementById("news-cat").value,date:document.getElementById("news-date").value,title:t,excerpt:document.getElementById("news-excerpt").value,content:document.getElementById("news-content").value,image:document.getElementById("news-img").value,readTime:e===-1?"3 min read":y[e].readTime};e===-1?y.unshift(l):y[e]=l;try{await s.saveNews(y),H()}catch(n){alert("Error saving: "+n.message)}}async function de(e){if(confirm("Are you sure you want to delete this news?")){y.splice(e,1);try{await s.saveNews(y),H()}catch(t){alert("Error deleting: "+t.message)}}}async function j(){const e=document.getElementById("content-area");e.innerHTML=x("Models","Loading models...");try{B=await(await fetch("/api/models")).json(),se()}catch(t){console.error(t)}}function se(){var a;const e=document.getElementById("content-area");let t=B.map((l,n)=>`
    <tr>
      <td><img src="${l.heroImage}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td><strong>${l.name}</strong><br><small>${l.category}</small></td>
      <td>${l.price}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px;" data-action="edit-model" data-index="${n}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-model" data-index="${n}">Delete</button>
      </td>
    </tr>
  `).join("");e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage Models</h3>
        <button class="btn btn-primary" id="add-model-btn"><i data-lucide="plus"></i> Add Model</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Image</th><th>Name & Category</th><th>Price</th><th width="150">Actions</th></tr></thead>
        <tbody>${t.length?t:'<tr><td colspan="4" class="empty-state">No models found</td></tr>'}</tbody>
      </table>
    </div>
  `,M({icons:T}),(a=document.getElementById("add-model-btn"))==null||a.addEventListener("click",()=>Y(-1)),e.querySelectorAll('[data-action="edit-model"]').forEach(l=>{l.addEventListener("click",()=>Y(parseInt(l.dataset.index)))}),e.querySelectorAll('[data-action="delete-model"]').forEach(l=>{l.addEventListener("click",()=>ce(parseInt(l.dataset.index)))})}function Y(e){S=e;const a=e===-1?{id:"",slug:"",name:"",category:"",tagline:"",shortDesc:"",price:"",badge:"",heroImage:"",cardImage:"",interiorImage:"",specs:{power:"",torque:"",groundClearance:"",wadingDepth:""},colors:[],trims:[],hotspots:[],keyFeatures:[],interiorFeatures:[],exteriorFeatures:[],gallery:[]}:JSON.parse(JSON.stringify(B[e]));a.specs||(a.specs={}),a.colors||(a.colors=[]),a.trims||(a.trims=[]),a.hotspots||(a.hotspots=[]),window._editingModelData=a,h()}function f(){var t,a,l,n,r,i,o,d,u,b,E,A,U,q,z,G,P,V,O,J;const e=window._editingModelData;e&&(e.name=((t=document.getElementById("mod-name"))==null?void 0:t.value)||"",e.category=((a=document.getElementById("mod-cat"))==null?void 0:a.value)||"",e.price=((l=document.getElementById("mod-price"))==null?void 0:l.value)||"",e.badge=((n=document.getElementById("mod-badge"))==null?void 0:n.value)||"",e.tagline=((r=document.getElementById("mod-tagline"))==null?void 0:r.value)||"",e.shortDesc=((i=document.getElementById("mod-desc"))==null?void 0:i.value)||"",e.heroImage=((o=document.getElementById("mod-hero"))==null?void 0:o.value)||"",e.cardImage=((d=document.getElementById("mod-card"))==null?void 0:d.value)||"",e.interiorImage=((u=document.getElementById("mod-interior"))==null?void 0:u.value)||"",e.specs.power=((b=document.getElementById("mod-spec-power"))==null?void 0:b.value)||"",e.specs.torque=((E=document.getElementById("mod-spec-torque"))==null?void 0:E.value)||"",e.specs.groundClearance=((A=document.getElementById("mod-spec-gc"))==null?void 0:A.value)||"",e.specs.wadingDepth=((U=document.getElementById("mod-spec-wd"))==null?void 0:U.value)||"",e.specs.battery=((q=document.getElementById("mod-spec-battery"))==null?void 0:q.value)||"",e.specs.evRange=((z=document.getElementById("mod-spec-ev"))==null?void 0:z.value)||"",e.specs.drivingRange=((G=document.getElementById("mod-spec-dr"))==null?void 0:G.value)||"",e.specs.acceleration=((P=document.getElementById("mod-spec-accel"))==null?void 0:P.value)||"",e.specs.driveSystem=((V=document.getElementById("mod-spec-ds"))==null?void 0:V.value)||"",e.specs.chargingTime=((O=document.getElementById("mod-spec-charge"))==null?void 0:O.value)||"",e.specs.energyEfficiency=((J=document.getElementById("mod-spec-eff"))==null?void 0:J.value)||"",e.colors.forEach((c,m)=>{var v,g,I;c.name=((v=document.getElementById(`mod-col-name-${m}`))==null?void 0:v.value)||"",c.hex=((g=document.getElementById(`mod-col-hex-${m}`))==null?void 0:g.value)||"",c.img=((I=document.getElementById(`mod-col-img-${m}`))==null?void 0:I.value)||""}),e.trims.forEach((c,m)=>{var g,I,W,K;c.name=((g=document.getElementById(`mod-trim-name-${m}`))==null?void 0:g.value)||"",c.price=((I=document.getElementById(`mod-trim-price-${m}`))==null?void 0:I.value)||"",c.img=((W=document.getElementById(`mod-trim-img-${m}`))==null?void 0:W.value)||"";const v=((K=document.getElementById(`mod-trim-feat-${m}`))==null?void 0:K.value)||"";c.features=v.split(`
`).map(R=>R.trim()).filter(R=>R)}),e.hotspots.forEach((c,m)=>{var v,g,I;c.label=((v=document.getElementById(`mod-hs-label-${m}`))==null?void 0:v.value)||"",c.top=((g=document.getElementById(`mod-hs-top-${m}`))==null?void 0:g.value)||50,c.left=((I=document.getElementById(`mod-hs-left-${m}`))==null?void 0:I.value)||50}),e.keyFeatures.forEach((c,m)=>{var v,g;c.title=((v=document.getElementById(`mod-kf-title-${m}`))==null?void 0:v.value)||"",c.desc=((g=document.getElementById(`mod-kf-desc-${m}`))==null?void 0:g.value)||""}))}function h(){var l,n,r,i;const e=window._editingModelData,t=document.getElementById("content-area"),a=S===-1;t.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header" style="position: sticky; top: 0; background: var(--color-surface-1); z-index: 10; padding: 15px 0; border-bottom: 1px solid var(--color-border-light);">
        <h3 class="card-title">${a?"Add New Model":"Edit Model: "+e.name}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-model-btn">Cancel</button>
          <button class="btn btn-primary" id="save-model-btn">Save Changes</button>
        </div>
      </div>
      <div style="padding-top: 20px;">
        <h4 style="margin-bottom:15px; color:var(--color-accent-cyan);">General Info</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div class="form-group"><label class="form-label">Model Name</label><input type="text" id="mod-name" class="form-control" value="${e.name}"></div>
          <div class="form-group"><label class="form-label">Category</label><input type="text" id="mod-cat" class="form-control" value="${e.category}"></div>
          <div class="form-group"><label class="form-label">Price</label><input type="text" id="mod-price" class="form-control" value="${e.price}"></div>
          <div class="form-group"><label class="form-label">Badge</label><input type="text" id="mod-badge" class="form-control" value="${e.badge||""}"></div>
        </div>
        <div class="form-group"><label class="form-label">Tagline</label><input type="text" id="mod-tagline" class="form-control" value="${e.tagline||""}"></div>
        <div class="form-group"><label class="form-label">Short Description</label><textarea id="mod-desc" class="form-control" style="min-height: 60px;">${e.shortDesc||""}</textarea></div>
        
        <h4 style="margin:25px 0 15px 0; color:var(--color-accent-cyan);">Images</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
          <div class="form-group"><label class="form-label">Hero Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-hero" class="form-control" value="${e.heroImage||""}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-hero">Upload</button></div></div>
          <div class="form-group"><label class="form-label">Card Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-card" class="form-control" value="${e.cardImage||""}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-card">Upload</button></div></div>
          <div class="form-group"><label class="form-label">Interior Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-interior" class="form-control" value="${e.interiorImage||""}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-interior">Upload</button></div></div>
        </div>

        <h4 style="margin:25px 0 15px 0; color:var(--color-accent-cyan);">Specs</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px;">
          <div class="form-group"><label class="form-label">Max Power</label><input type="text" id="mod-spec-power" class="form-control" value="${e.specs.power||""}"></div>
          <div class="form-group"><label class="form-label">Torque</label><input type="text" id="mod-spec-torque" class="form-control" value="${e.specs.torque||""}"></div>
          <div class="form-group"><label class="form-label">Ground Clearance</label><input type="text" id="mod-spec-gc" class="form-control" value="${e.specs.groundClearance||""}"></div>
          <div class="form-group"><label class="form-label">Wading Depth</label><input type="text" id="mod-spec-wd" class="form-control" value="${e.specs.wadingDepth||""}"></div>
          <div class="form-group"><label class="form-label">Battery</label><input type="text" id="mod-spec-battery" class="form-control" value="${e.specs.battery||""}"></div>
          <div class="form-group"><label class="form-label">EV Range</label><input type="text" id="mod-spec-ev" class="form-control" value="${e.specs.evRange||""}"></div>
          <div class="form-group"><label class="form-label">Driving Range</label><input type="text" id="mod-spec-dr" class="form-control" value="${e.specs.drivingRange||""}"></div>
          <div class="form-group"><label class="form-label">Acceleration</label><input type="text" id="mod-spec-accel" class="form-control" value="${e.specs.acceleration||""}"></div>
          <div class="form-group"><label class="form-label">Drive System</label><input type="text" id="mod-spec-ds" class="form-control" value="${e.specs.driveSystem||""}"></div>
          <div class="form-group"><label class="form-label">Charging</label><input type="text" id="mod-spec-charge" class="form-control" value="${e.specs.chargingTime||""}"></div>
          <div class="form-group"><label class="form-label">Efficiency</label><input type="text" id="mod-spec-eff" class="form-control" value="${e.specs.energyEfficiency||""}"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Colors</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-color-btn">+ Add Color</button>
        </div>
        <div id="colors-container">
        ${e.colors.map((o,d)=>`
          <div style="display: grid; grid-template-columns: 1fr 100px 2fr auto; gap: 10px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px; align-items:end;">
            <div class="form-group" style="margin:0;"><label class="form-label">Color Name</label><input type="text" id="mod-col-name-${d}" class="form-control" value="${o.name}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">HEX</label><input type="color" id="mod-col-hex-${d}" class="form-control" value="${o.hex}" style="height:38px; padding:2px;"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Car Image URL</label><div style="display:flex;gap:5px;"><input type="text" id="mod-col-img-${d}" class="form-control" value="${o.img}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-col-img-${d}">Upload</button></div></div>
            <button class="btn btn-outline remove-color-btn" style="border-color:var(--danger); color:var(--danger); padding:8px 12px;" data-index="${d}">Remove</button>
          </div>
        `).join("")}
        </div>
        ${e.colors.length===0?'<p style="color:#666; font-size:0.9rem;">No colors added yet.</p>':""}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Trims / Tipe Mobil</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-trim-btn">+ Add Trim</button>
        </div>
        <div id="trims-container">
        ${e.trims.map((o,d)=>`
          <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div class="form-group" style="margin:0;"><label class="form-label">Trim Name</label><input type="text" id="mod-trim-name-${d}" class="form-control" value="${o.name}"></div>
              <div class="form-group" style="margin:0;"><label class="form-label">Price</label><input type="text" id="mod-trim-price-${d}" class="form-control" value="${o.price}"></div>
              <div class="form-group" style="margin:0;"><label class="form-label">Trim Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-trim-img-${d}" class="form-control" value="${o.img}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-trim-img-${d}">Upload</button></div></div>
            </div>
            <div class="form-group" style="margin-top:15px;"><label class="form-label">Features (satu per baris)</label><textarea id="mod-trim-feat-${d}" class="form-control" style="min-height: 80px;">${(o.features||[]).join(`
`)}</textarea></div>
            <button class="btn btn-outline remove-trim-btn" style="border-color:var(--danger); color:var(--danger); padding:4px 12px; margin-top:5px; font-size:0.85rem;" data-index="${d}">Remove Trim</button>
          </div>
        `).join("")}
        </div>
        ${e.trims.length===0?'<p style="color:#666; font-size:0.9rem;">No trims added yet.</p>':""}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Key Features</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-kf-btn">+ Add Feature</button>
        </div>
        <div id="kf-container">
        ${e.keyFeatures.map((o,d)=>`
          <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div class="form-group" style="margin:0 0 10px 0;"><label class="form-label">Feature Title</label><input type="text" id="mod-kf-title-${d}" class="form-control" value="${o.title}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Description</label><textarea id="mod-kf-desc-${d}" class="form-control" style="min-height: 60px;">${o.desc}</textarea></div>
            <button class="btn btn-outline remove-kf-btn" style="border-color:var(--danger); color:var(--danger); padding:4px 12px; margin-top:10px; font-size:0.85rem;" data-index="${d}">Remove Feature</button>
          </div>
        `).join("")}
        </div>
        ${e.keyFeatures.length===0?'<p style="color:#666; font-size:0.9rem;">No key features added yet.</p>':""}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Interior Hotspots</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-hotspot-btn">+ Add Hotspot</button>
        </div>
        <div id="hotspots-container">
        ${e.hotspots.map((o,d)=>`
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px; align-items:end;">
            <div class="form-group" style="margin:0;"><label class="form-label">Label</label><input type="text" id="mod-hs-label-${d}" class="form-control" value="${o.label}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Top (%)</label><input type="number" id="mod-hs-top-${d}" class="form-control" value="${o.top}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Left (%)</label><input type="number" id="mod-hs-left-${d}" class="form-control" value="${o.left}"></div>
            <button class="btn btn-outline remove-hotspot-btn" style="border-color:var(--danger); color:var(--danger); padding:8px 12px;" data-index="${d}">Remove</button>
          </div>
        `).join("")}
        </div>
        ${e.hotspots.length===0?'<p style="color:#666; font-size:0.9rem;">No hotspots added yet.</p>':""}
      </div>
    </div>
  `,document.getElementById("cancel-model-btn").addEventListener("click",()=>j()),document.getElementById("save-model-btn").addEventListener("click",ie),(l=document.getElementById("add-color-btn"))==null||l.addEventListener("click",()=>{f(),e.colors.push({name:"",hex:"#ffffff",img:""}),h()}),(n=document.getElementById("add-trim-btn"))==null||n.addEventListener("click",()=>{f(),e.trims.push({name:"",price:"",img:"",features:[]}),h()}),(r=document.getElementById("add-hotspot-btn"))==null||r.addEventListener("click",()=>{f(),e.hotspots.push({label:"",top:50,left:50}),h()}),(i=document.getElementById("add-kf-btn"))==null||i.addEventListener("click",()=>{f(),e.keyFeatures.push({title:"",desc:""}),h()}),t.querySelectorAll(".remove-color-btn").forEach(o=>{o.addEventListener("click",()=>{f(),e.colors.splice(parseInt(o.dataset.index),1),h()})}),t.querySelectorAll(".remove-trim-btn").forEach(o=>{o.addEventListener("click",()=>{f(),e.trims.splice(parseInt(o.dataset.index),1),h()})}),t.querySelectorAll(".remove-hotspot-btn").forEach(o=>{o.addEventListener("click",()=>{f(),e.hotspots.splice(parseInt(o.dataset.index),1),h()})}),t.querySelectorAll(".remove-kf-btn").forEach(o=>{o.addEventListener("click",()=>{f(),e.keyFeatures.splice(parseInt(o.dataset.index),1),h()})}),t.querySelectorAll(".upload-btn").forEach(o=>{o.addEventListener("click",()=>F(o.dataset.target))}),M({icons:T})}async function ie(){f();const e=window._editingModelData;if(!e.name){alert("Model Name is required!");return}const t=e.name.toLowerCase().replace(/[^a-z0-9]+/g,"-");e.slug=t,e.id=t,S===-1?B.push(e):B[S]=e;try{await s.saveModels(B),j()}catch(a){alert("Error saving: "+a.message)}}async function ce(e){if(confirm("Are you sure you want to delete this model?")){B.splice(e,1);try{await s.saveModels(B),j()}catch(t){alert("Error deleting: "+t.message)}}}async function me(){const e=document.getElementById("content-area");e.innerHTML=x("Dealers","Loading...");try{w=await(await fetch("/api/dealers")).json(),C()}catch(t){console.error(t)}}let L=-1;function C(){const e=document.getElementById("content-area");let t=w.map((a,l)=>`
    <tr>
      <td><strong>${a.name}</strong><br><small>${a.city||""}</small></td>
      <td>${a.address||""}</td>
      <td>${a.phone||""}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px; margin-right: 5px;" data-action="edit-dealer" data-index="${l}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-dealer" data-index="${l}">Delete</button>
      </td>
    </tr>
  `).join("");e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage Dealers</h3>
        <button class="btn btn-primary" id="add-dealer-btn">+ Add Dealer</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Dealer Info</th><th>Address</th><th>Phone</th><th width="120">Actions</th></tr></thead>
        <tbody>${t.length?t:'<tr><td colspan="4" class="empty-state">No dealers found</td></tr>'}</tbody>
      </table>
    </div>
  `,document.getElementById("add-dealer-btn").addEventListener("click",()=>{L=-1,Q()}),e.querySelectorAll('[data-action="edit-dealer"]').forEach(a=>{a.addEventListener("click",()=>{L=parseInt(a.dataset.index),Q()})}),e.querySelectorAll('[data-action="delete-dealer"]').forEach(a=>{a.addEventListener("click",async()=>{if(confirm("Delete this dealer?")){w.splice(parseInt(a.dataset.index),1);try{await s.saveDealers(w),C()}catch(l){alert("Error: "+l.message)}}})})}function Q(){const e=document.getElementById("content-area"),t=L===-1?{name:"",city:"",address:"",phone:"",lat:"",lng:"",whatsapp:""}:w[L];e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${L===-1?"Add Dealer":"Edit Dealer"}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-dealer-btn">Cancel</button>
          <button class="btn btn-primary" id="save-dealer-btn">Save</button>
        </div>
      </div>
      <div style="padding-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="form-group"><label class="form-label">Dealer Name</label><input type="text" id="dlr-name" class="form-control" value="${t.name||""}"></div>
        <div class="form-group"><label class="form-label">City</label><input type="text" id="dlr-city" class="form-control" value="${t.city||""}"></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="text" id="dlr-phone" class="form-control" value="${t.phone||""}"></div>
        <div class="form-group"><label class="form-label">WhatsApp</label><input type="text" id="dlr-wa" class="form-control" value="${t.whatsapp||""}"></div>
        <div class="form-group" style="grid-column: 1 / -1;"><label class="form-label">Address</label><input type="text" id="dlr-address" class="form-control" value="${t.address||""}"></div>
        <div class="form-group"><label class="form-label">Latitude</label><input type="text" id="dlr-lat" class="form-control" value="${t.lat||""}"></div>
        <div class="form-group"><label class="form-label">Longitude</label><input type="text" id="dlr-lng" class="form-control" value="${t.lng||""}"></div>
      </div>
    </div>
  `,document.getElementById("cancel-dealer-btn").addEventListener("click",C),document.getElementById("save-dealer-btn").addEventListener("click",async()=>{const a={name:document.getElementById("dlr-name").value,city:document.getElementById("dlr-city").value,phone:document.getElementById("dlr-phone").value,whatsapp:document.getElementById("dlr-wa").value,address:document.getElementById("dlr-address").value,lat:document.getElementById("dlr-lat").value,lng:document.getElementById("dlr-lng").value};if(!a.name)return alert("Name is required");L===-1?w.push(a):w[L]=a;try{await s.saveDealers(w),C()}catch(l){alert("Error: "+l.message)}})}async function pe(){const e=document.getElementById("content-area");e.innerHTML=x("Gallery","Loading...");try{$=await(await fetch("/api/gallery")).json(),N()}catch(t){console.error(t)}}let k=-1;function N(){const e=document.getElementById("content-area");let t=$.map((a,l)=>`
    <tr>
      <td><img src="${a.thumb||a.src}" style="width: 80px; border-radius: 4px;"></td>
      <td><strong>${a.title}</strong><br><small>${a.category}</small></td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px; margin-right: 5px;" data-action="edit-gallery" data-index="${l}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-gallery" data-index="${l}">Delete</button>
      </td>
    </tr>
  `).join("");e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage Gallery</h3>
        <button class="btn btn-primary" id="add-gallery-btn">+ Add Image</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Image</th><th>Details</th><th width="120">Actions</th></tr></thead>
        <tbody>${t}</tbody>
      </table>
    </div>
  `,document.getElementById("add-gallery-btn").addEventListener("click",()=>{k=-1,Z()}),e.querySelectorAll('[data-action="edit-gallery"]').forEach(a=>{a.addEventListener("click",()=>{k=parseInt(a.dataset.index),Z()})}),e.querySelectorAll('[data-action="delete-gallery"]').forEach(a=>{a.addEventListener("click",async()=>{if(confirm("Delete this gallery item?")){$.splice(parseInt(a.dataset.index),1);try{await s.saveGallery($),N()}catch(l){alert("Error: "+l.message)}}})})}function Z(){const e=document.getElementById("content-area"),t=k===-1?{title:"",category:"exterior",src:"",thumb:"",width:1200,height:800}:$[k];e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${k===-1?"Add Gallery Image":"Edit Gallery Image"}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-gallery-btn">Cancel</button>
          <button class="btn btn-primary" id="save-gallery-btn">Save</button>
        </div>
      </div>
      <div style="padding-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="form-group"><label class="form-label">Title</label><input type="text" id="gal-title" class="form-control" value="${t.title||""}"></div>
        <div class="form-group"><label class="form-label">Category</label>
          <select id="gal-cat" class="form-control">
            <option value="exterior" ${t.category==="exterior"?"selected":""}>Exterior</option>
            <option value="interior" ${t.category==="interior"?"selected":""}>Interior</option>
            <option value="performance" ${t.category==="performance"?"selected":""}>Performance</option>
            <option value="technology" ${t.category==="technology"?"selected":""}>Technology</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Image URL</label>
          <div style="display:flex;gap:5px;">
            <input type="text" id="gal-src" class="form-control" value="${t.src||""}">
            <button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="gal-src">Upload</button>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Thumbnail URL</label>
          <div style="display:flex;gap:5px;">
            <input type="text" id="gal-thumb" class="form-control" value="${t.thumb||t.src||""}">
            <button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="gal-thumb">Upload</button>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Width</label><input type="number" id="gal-w" class="form-control" value="${t.width||1200}"></div>
        <div class="form-group"><label class="form-label">Height</label><input type="number" id="gal-h" class="form-control" value="${t.height||800}"></div>
      </div>
    </div>
  `,e.querySelectorAll(".upload-btn").forEach(a=>{a.addEventListener("click",()=>F(a.dataset.target))}),document.getElementById("cancel-gallery-btn").addEventListener("click",N),document.getElementById("save-gallery-btn").addEventListener("click",async()=>{const a={title:document.getElementById("gal-title").value,category:document.getElementById("gal-cat").value,src:document.getElementById("gal-src").value,thumb:document.getElementById("gal-thumb").value,width:parseInt(document.getElementById("gal-w").value)||1200,height:parseInt(document.getElementById("gal-h").value)||800};if(!a.title||!a.src)return alert("Title and Image URL are required");k===-1?$.push(a):$[k]=a;try{await s.saveGallery($),N()}catch(l){alert("Error: "+l.message)}})}async function ue(){const e=document.getElementById("content-area");e.innerHTML=x("Contacts","Loading...");try{let a=(await s.getContacts()).map(l=>`
      <tr>
        <td><strong>${l.name}</strong><br><small>${l.email||"-"}</small></td>
        <td>${l.phone}</td>
        <td>${(l.message||"").substring(0,50)}...</td>
        <td><small>${l.date?new Date(l.date).toLocaleString():"-"}</small></td>
      </tr>
    `).join("");e.innerHTML=`
      <div class="dashboard-card">
        <div class="card-header"><h3 class="card-title">Contact Messages</h3></div>
        <table class="data-table">
          <thead><tr><th>Sender</th><th>Phone</th><th>Message</th><th>Date</th></tr></thead>
          <tbody>${a.length?a:'<tr><td colspan="4" class="empty-state">No messages yet</td></tr>'}</tbody>
        </table>
      </div>
    `}catch{e.innerHTML='<div class="dashboard-card"><p style="color:var(--danger);">Error loading contacts.</p></div>'}}async function ge(){var t,a;const e=document.getElementById("content-area");e.innerHTML=x("Reservations","Loading...");try{let n=(await s.getReservations()).map(r=>`
      <tr>
        <td><strong>${r.name}</strong><br><small>${r.phone}</small></td>
        <td><span class="badge badge-active">${r.model}</span></td>
        <td>${r.dealer}</td>
        <td>${r.date||"-"} ${r.time||""}</td>
      </tr>
    `).join("");e.innerHTML=`
      <div class="dashboard-card" style="margin-bottom: 2rem;">
        <div class="card-header"><h3 class="card-title">Reservation Form Settings</h3></div>
        <div class="form-group">
          <label class="form-label">Gambar Latar Reservasi (Reservation Image)</label>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" id="res-image-url" class="form-control" placeholder="https://..." value="">
            <button class="btn btn-outline" id="btn-upload-res-image"><i data-lucide="upload"></i> Upload</button>
            <button class="btn btn-primary" id="save-res-settings">Save</button>
          </div>
        </div>
      </div>
      
      <div class="dashboard-card">
        <div class="card-header"><h3 class="card-title">Test Drive Reservations</h3></div>
        <table class="data-table">
          <thead><tr><th>Customer</th><th>Model</th><th>Dealer</th><th>Schedule</th></tr></thead>
          <tbody>${n.length?n:'<tr><td colspan="4" class="empty-state">No reservations yet</td></tr>'}</tbody>
        </table>
      </div>
    `,fetch("/api/settings").then(r=>r.json()).then(r=>{r.reservationImage&&(document.getElementById("res-image-url").value=r.reservationImage)}),(t=document.getElementById("btn-upload-res-image"))==null||t.addEventListener("click",()=>{F("res-image-url")}),(a=document.getElementById("save-res-settings"))==null||a.addEventListener("click",async()=>{try{const r=await fetch("/api/settings").then(i=>i.json());r.reservationImage=document.getElementById("res-image-url").value,await s.saveSettings(r),alert("Pengaturan reservasi berhasil disimpan!")}catch(r){alert("Gagal menyimpan: "+r.message)}})}catch{e.innerHTML='<div class="dashboard-card"><p style="color:var(--danger);">Error loading reservations.</p></div>'}}async function be(){const e=document.getElementById("content-area");e.innerHTML=x("Settings","Loading...");try{p=await(await fetch("/api/settings")).json(),ve()}catch(t){console.error(t)}}function ve(){var t,a,l,n,r,i,o,d;const e=document.getElementById("content-area");e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Media & Settings</h3>
        <button class="btn btn-primary" id="save-settings-btn"><i data-lucide="save"></i> Save Changes</button>
      </div>
      <div class="form-group">
        <label class="form-label">Video "Tentang Kami" (About Us Video URL)</label>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Masukkan link video MP4 atau unggah langsung.</p>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <input type="text" id="setting-about-video" class="form-control" value="${p.aboutVideoUrl||""}" placeholder="https://.../video.mp4">
        </div>
        <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px dashed var(--border-color);">
          <label class="form-label" style="margin-bottom: 10px; display: block;">Unggah Video Baru (MP4, WebM)</label>
          <div style="display: flex; align-items: center; gap: 15px;">
            <input type="file" id="video-upload-input" accept="video/mp4,video/webm" style="color: var(--text-main);">
            <button class="btn btn-outline" id="btn-upload-video"><i data-lucide="upload"></i> Unggah Video</button>
          </div>
          <div id="video-upload-status" style="margin-top: 10px; font-size: 0.85rem; color: var(--success); display: none;">Video berhasil diunggah!</div>
        </div>
      </div>
      
      <h3 class="card-title" style="margin-top: 30px; margin-bottom: 15px; font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Pengaturan Footer (Informasi Kontak & Sosial Media)</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Contact Info -->
        <div>
          <h4 style="margin-bottom: 15px; color: var(--text-muted); font-size: 0.9rem;">Informasi Kontak</h4>
          <div class="form-group">
            <label class="form-label">Alamat Kantor</label>
            <textarea id="setting-footer-address" class="form-control" rows="3" placeholder="Gunakan <br> untuk baris baru">${((t=p.footer)==null?void 0:t.address)||"Wisma JAECOO Indonesia<br>Jl. TB Simatupang Kav. 88<br>Jakarta Selatan 12430"}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Nomor Telepon</label>
            <input type="text" id="setting-footer-phone" class="form-control" value="${((a=p.footer)==null?void 0:a.phone)||"1-500-000"}">
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp</label>
            <input type="text" id="setting-footer-whatsapp" class="form-control" value="${((l=p.footer)==null?void 0:l.whatsapp)||"+62 811 8800 991"}">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="text" id="setting-footer-email" class="form-control" value="${((n=p.footer)==null?void 0:n.email)||"customercare@jaecoo.id"}">
          </div>
        </div>
        
        <!-- Social Media -->
        <div>
          <h4 style="margin-bottom: 15px; color: var(--text-muted); font-size: 0.9rem;">Sosial Media (URL)</h4>
          <div class="form-group">
            <label class="form-label">Instagram Link</label>
            <input type="text" id="setting-footer-instagram" class="form-control" value="${((r=p.footer)==null?void 0:r.instagram)||"https://www.instagram.com/jaecootangerangofficial"}">
          </div>
          <div class="form-group">
            <label class="form-label">Facebook Link</label>
            <input type="text" id="setting-footer-facebook" class="form-control" value="${((i=p.footer)==null?void 0:i.facebook)||"https://web.facebook.com/profile.php?id=61584045292756"}">
          </div>
          <div class="form-group">
            <label class="form-label">Youtube Link</label>
            <input type="text" id="setting-footer-youtube" class="form-control" value="${((o=p.footer)==null?void 0:o.youtube)||"https://www.youtube.com/@RiriJaecooTangerang"}">
          </div>
          <div class="form-group">
            <label class="form-label">Twitter / X Link</label>
            <input type="text" id="setting-footer-twitter" class="form-control" value="${((d=p.footer)==null?void 0:d.twitter)||"#"}">
          </div>
        </div>
      </div>
    </div>
  `,M({icons:T}),document.getElementById("save-settings-btn").addEventListener("click",async()=>{p.aboutVideoUrl=document.getElementById("setting-about-video").value,p.footer={address:document.getElementById("setting-footer-address").value,phone:document.getElementById("setting-footer-phone").value,whatsapp:document.getElementById("setting-footer-whatsapp").value,email:document.getElementById("setting-footer-email").value,facebook:document.getElementById("setting-footer-facebook").value,twitter:document.getElementById("setting-footer-twitter").value,instagram:document.getElementById("setting-footer-instagram").value,youtube:document.getElementById("setting-footer-youtube").value};try{await s.saveSettings(p),alert("Settings saved!")}catch(u){alert("Error: "+u.message)}}),document.getElementById("btn-upload-video").addEventListener("click",async()=>{var b;const u=document.getElementById("video-upload-input");if(!((b=u.files)!=null&&b.length)){alert("Pilih file video terlebih dahulu!");return}try{const E=await s.upload(u.files[0]);document.getElementById("setting-about-video").value=E.url;const A=document.getElementById("video-upload-status");A.style.display="block",setTimeout(()=>A.style.display="none",5e3)}catch(E){alert("Upload error: "+E.message)}})}function F(e){const t=document.createElement("input");t.type="file",t.accept="image/*,video/*",t.onchange=async a=>{const l=a.target.files[0];if(!l)return;const n=document.getElementById(e);if(!n)return;const r=n.value;n.value="Uploading...";try{const i=await s.upload(l);n.value=i.url}catch(i){alert("Upload error: "+i.message),n.value=r}},t.click()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_();
