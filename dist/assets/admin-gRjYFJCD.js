import{a as s}from"./apiClient-lyAnOTD-.js";import{c as k,i as T}from"./vendor-icons-BJpMaZcN.js";const de=[{id:"dashboard",label:"Dashboard",icon:"layout-dashboard"},{id:"banner",label:"Banner & Settings",icon:"image"},{id:"models",label:"Our Models",icon:"car"},{id:"news",label:"News & Updates",icon:"newspaper"},{id:"gallery",label:"Gallery",icon:"images"},{id:"dealers",label:"Dealers Location",icon:"map-pin"},{id:"testimonials",label:"Testimonials",icon:"message-square"},{id:"reservation",label:"Reservations",icon:"calendar-check"},{id:"contacts",label:"Contact Messages",icon:"mail"}];let N="dashboard",h=[],L=[],$=[],w=[],B=[],p={},q=-1;function Z(){const e=document.getElementById("login-form"),t=document.getElementById("login-screen"),a=document.getElementById("admin-app"),l=document.getElementById("logout-btn");s.isLoggedIn()?s.checkAuth().then(c=>{c.authenticated?r():(s.clearToken(),d())}).catch(()=>d()):d(),e.addEventListener("submit",async c=>{c.preventDefault();const v=document.getElementById("login-username").value,o=document.getElementById("login-password").value,n=document.getElementById("login-error"),y=document.getElementById("login-btn");try{y.disabled=!0,y.textContent="Logging in...",n.style.display="none",await s.login(v,o),r()}catch(E){n.textContent=E.message||"Login gagal. Periksa username dan password.",n.style.display="block"}finally{y.disabled=!1,y.textContent="Login"}}),l.addEventListener("click",async()=>{await s.logout(),d()}),window.onAuthExpired=()=>{alert("Sesi Anda telah berakhir. Silakan login kembali."),d()};function d(){t.style.display="flex",a.style.display="none"}function r(){t.style.display="none",a.style.display="",re()}}function re(){se(),ne()}function se(){const e=document.getElementById("sidebar-nav");e.innerHTML="",de.forEach(t=>{const a=document.createElement("a");a.href=`#${t.id}`,a.className=`nav-item ${N===t.id?"active":""}`,a.innerHTML=`<i data-lucide="${t.icon}"></i><span>${t.label}</span>`,a.addEventListener("click",l=>{l.preventDefault(),N=t.id,document.getElementById("current-page-title").textContent=t.label,document.querySelectorAll(".nav-item").forEach(d=>d.classList.remove("active")),a.classList.add("active"),ne()}),e.appendChild(a)}),k({icons:T})}function ne(){const e=document.getElementById("content-area");switch(N){case"dashboard":ie();break;case"banner":Ee();break;case"news":U();break;case"models":F();break;case"gallery":fe();break;case"dealers":ve();break;case"testimonials":ye();break;case"reservation":xe();break;case"contacts":he();break;default:e.innerHTML=x(N,"Loading...")}k({icons:T})}function x(e,t){return`
    <div class="dashboard-card">
      <div class="card-header"><h3 class="card-title">Manage ${e}</h3></div>
      <div class="empty-state">
        <i data-lucide="loader" class="empty-icon" style="animation: spin 2s linear infinite"></i>
        <h4 style="margin-bottom: 8px; color: var(--text-main);">${t}</h4>
      </div>
    </div>
  `}async function ie(){const e=document.getElementById("content-area");try{const t=await s.getStats();e.innerHTML=`
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
    `}catch(t){e.innerHTML=`<div class="dashboard-card"><p style="color:var(--danger);">Error loading dashboard: ${t.message}</p></div>`}k({icons:T})}async function U(){const e=document.getElementById("content-area");e.innerHTML=x("News","Loading news data...");try{h=await(await fetch("/api/news")).json(),ce()}catch{e.innerHTML=x("News","Error loading news data.")}}function ce(){var a;const e=document.getElementById("content-area");let t=h.map((l,d)=>`
    <tr>
      <td><img src="${l.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td><strong>${l.title}</strong><br><small style="color: var(--text-muted)">${l.date} - ${l.category}</small></td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px;" data-action="edit-news" data-index="${d}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-news" data-index="${d}">Delete</button>
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
  `,k({icons:T}),(a=document.getElementById("add-news-btn"))==null||a.addEventListener("click",()=>ee(-1)),e.querySelectorAll('[data-action="edit-news"]').forEach(l=>{l.addEventListener("click",()=>ee(parseInt(l.dataset.index)))}),e.querySelectorAll('[data-action="delete-news"]').forEach(l=>{l.addEventListener("click",()=>pe(parseInt(l.dataset.index)))})}function ee(e){const t=document.getElementById("content-area"),a=e===-1,l=a?{title:"",category:"NEWS",date:"",excerpt:"",content:"",image:""}:h[e];t.innerHTML=`
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
  `,document.getElementById("cancel-news-btn").addEventListener("click",()=>U()),document.getElementById("save-news-btn").addEventListener("click",()=>me(e)),document.getElementById("upload-news-img").addEventListener("click",()=>C("news-img"))}async function me(e){const t=document.getElementById("news-title").value,a=t.toLowerCase().replace(/[^a-z0-9]+/g,"-"),l={id:e===-1?a:h[e].id,slug:a,category:document.getElementById("news-cat").value,date:document.getElementById("news-date").value,title:t,excerpt:document.getElementById("news-excerpt").value,content:document.getElementById("news-content").value,image:document.getElementById("news-img").value,readTime:e===-1?"3 min read":h[e].readTime};e===-1?h.unshift(l):h[e]=l;try{await s.saveNews(h),U()}catch(d){alert("Error saving: "+d.message)}}async function pe(e){if(confirm("Are you sure you want to delete this news?")){h.splice(e,1);try{await s.saveNews(h),U()}catch(t){alert("Error deleting: "+t.message)}}}async function F(){const e=document.getElementById("content-area");e.innerHTML=x("Models","Loading models...");try{L=await(await fetch("/api/models")).json(),ue()}catch(t){console.error(t)}}function ue(){var a;const e=document.getElementById("content-area");let t=L.map((l,d)=>`
    <tr>
      <td><img src="${l.heroImage}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td><strong>${l.name}</strong><br><small>${l.category}</small></td>
      <td>${l.price}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px;" data-action="edit-model" data-index="${d}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-model" data-index="${d}">Delete</button>
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
  `,k({icons:T}),(a=document.getElementById("add-model-btn"))==null||a.addEventListener("click",()=>te(-1)),e.querySelectorAll('[data-action="edit-model"]').forEach(l=>{l.addEventListener("click",()=>te(parseInt(l.dataset.index)))}),e.querySelectorAll('[data-action="delete-model"]').forEach(l=>{l.addEventListener("click",()=>be(parseInt(l.dataset.index)))})}function te(e){q=e;const a=e===-1?{id:"",slug:"",name:"",category:"",tagline:"",shortDesc:"",price:"",badge:"",heroImage:"",cardImage:"",interiorImage:"",specs:{power:"",torque:"",groundClearance:"",wadingDepth:""},colors:[],trims:[],hotspots:[],keyFeatures:[],interiorFeatures:[],exteriorFeatures:[],gallery:[]}:JSON.parse(JSON.stringify(L[e]));a.specs||(a.specs={}),a.colors||(a.colors=[]),a.trims||(a.trims=[]),a.hotspots||(a.hotspots=[]),a.gallery||(a.gallery=[]),window._editingModelData=a,b()}function g(){var t,a,l,d,r,c,v,o,n,y,E,D,G,P,O,V,J,W,K,_,X;const e=window._editingModelData;if(e){e.name=((t=document.getElementById("mod-name"))==null?void 0:t.value)||"",e.category=((a=document.getElementById("mod-cat"))==null?void 0:a.value)||"",e.price=((l=document.getElementById("mod-price"))==null?void 0:l.value)||"",e.badge=((d=document.getElementById("mod-badge"))==null?void 0:d.value)||"",e.tagline=((r=document.getElementById("mod-tagline"))==null?void 0:r.value)||"",e.shortDesc=((c=document.getElementById("mod-desc"))==null?void 0:c.value)||"",e.heroImage=((v=document.getElementById("mod-hero"))==null?void 0:v.value)||"",e.cardImage=((o=document.getElementById("mod-card"))==null?void 0:o.value)||"",e.interiorImage=((n=document.getElementById("mod-interior"))==null?void 0:n.value)||"",e.specs.power=((y=document.getElementById("mod-spec-power"))==null?void 0:y.value)||"",e.specs.torque=((E=document.getElementById("mod-spec-torque"))==null?void 0:E.value)||"",e.specs.groundClearance=((D=document.getElementById("mod-spec-gc"))==null?void 0:D.value)||"",e.specs.wadingDepth=((G=document.getElementById("mod-spec-wd"))==null?void 0:G.value)||"",e.specs.battery=((P=document.getElementById("mod-spec-battery"))==null?void 0:P.value)||"",e.specs.evRange=((O=document.getElementById("mod-spec-ev"))==null?void 0:O.value)||"",e.specs.drivingRange=((V=document.getElementById("mod-spec-dr"))==null?void 0:V.value)||"",e.specs.acceleration=((J=document.getElementById("mod-spec-accel"))==null?void 0:J.value)||"",e.specs.driveSystem=((W=document.getElementById("mod-spec-ds"))==null?void 0:W.value)||"",e.specs.chargingTime=((K=document.getElementById("mod-spec-charge"))==null?void 0:K.value)||"",e.specs.energyEfficiency=((_=document.getElementById("mod-spec-eff"))==null?void 0:_.value)||"",e.colors.forEach((i,m)=>{var f,u,I;i.name=((f=document.getElementById(`mod-col-name-${m}`))==null?void 0:f.value)||"",i.hex=((u=document.getElementById(`mod-col-hex-${m}`))==null?void 0:u.value)||"",i.img=((I=document.getElementById(`mod-col-img-${m}`))==null?void 0:I.value)||""}),e.trims.forEach((i,m)=>{var u,I,Q,Y;i.name=((u=document.getElementById(`mod-trim-name-${m}`))==null?void 0:u.value)||"",i.price=((I=document.getElementById(`mod-trim-price-${m}`))==null?void 0:I.value)||"",i.img=((Q=document.getElementById(`mod-trim-img-${m}`))==null?void 0:Q.value)||"";const f=((Y=document.getElementById(`mod-trim-feat-${m}`))==null?void 0:Y.value)||"";i.features=f.split(`
`).map(z=>z.trim()).filter(z=>z)}),e.hotspots.forEach((i,m)=>{var f,u,I;i.label=((f=document.getElementById(`mod-hs-label-${m}`))==null?void 0:f.value)||"",i.top=((u=document.getElementById(`mod-hs-top-${m}`))==null?void 0:u.value)||50,i.left=((I=document.getElementById(`mod-hs-left-${m}`))==null?void 0:I.value)||50}),e.keyFeatures.forEach((i,m)=>{var f,u;i.title=((f=document.getElementById(`mod-kf-title-${m}`))==null?void 0:f.value)||"",i.desc=((u=document.getElementById(`mod-kf-desc-${m}`))==null?void 0:u.value)||""}),e.gallery||(e.gallery=[]);for(let i=0;i<e.gallery.length;i++)e.gallery[i]=((X=document.getElementById(`mod-gal-img-${i}`))==null?void 0:X.value)||""}}function b(){var l,d,r,c,v;const e=window._editingModelData,t=document.getElementById("content-area"),a=q===-1;t.innerHTML=`
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
        ${e.colors.map((o,n)=>`
          <div style="display: grid; grid-template-columns: 1fr 100px 2fr auto; gap: 10px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px; align-items:end;">
            <div class="form-group" style="margin:0;"><label class="form-label">Color Name</label><input type="text" id="mod-col-name-${n}" class="form-control" value="${o.name}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">HEX</label><input type="color" id="mod-col-hex-${n}" class="form-control" value="${o.hex}" style="height:38px; padding:2px;"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Car Image URL</label><div style="display:flex;gap:5px;"><input type="text" id="mod-col-img-${n}" class="form-control" value="${o.img}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-col-img-${n}">Upload</button></div></div>
            <button class="btn btn-outline remove-color-btn" style="border-color:var(--danger); color:var(--danger); padding:8px 12px;" data-index="${n}">Remove</button>
          </div>
        `).join("")}
        </div>
        ${e.colors.length===0?'<p style="color:#666; font-size:0.9rem;">No colors added yet.</p>':""}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Trims / Tipe Mobil</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-trim-btn">+ Add Trim</button>
        </div>
        <div id="trims-container">
        ${e.trims.map((o,n)=>`
          <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div class="form-group" style="margin:0;"><label class="form-label">Trim Name</label><input type="text" id="mod-trim-name-${n}" class="form-control" value="${o.name}"></div>
              <div class="form-group" style="margin:0;"><label class="form-label">Price</label><input type="text" id="mod-trim-price-${n}" class="form-control" value="${o.price}"></div>
              <div class="form-group" style="margin:0;"><label class="form-label">Trim Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-trim-img-${n}" class="form-control" value="${o.img}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-trim-img-${n}">Upload</button></div></div>
            </div>
            <div class="form-group" style="margin-top:15px;"><label class="form-label">Features (satu per baris)</label><textarea id="mod-trim-feat-${n}" class="form-control" style="min-height: 80px;">${(o.features||[]).join(`
`)}</textarea></div>
            <button class="btn btn-outline remove-trim-btn" style="border-color:var(--danger); color:var(--danger); padding:4px 12px; margin-top:5px; font-size:0.85rem;" data-index="${n}">Remove Trim</button>
          </div>
        `).join("")}
        </div>
        ${e.trims.length===0?'<p style="color:#666; font-size:0.9rem;">No trims added yet.</p>':""}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Key Features</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-kf-btn">+ Add Feature</button>
        </div>
        <div id="kf-container">
        ${e.keyFeatures.map((o,n)=>`
          <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div class="form-group" style="margin:0 0 10px 0;"><label class="form-label">Feature Title</label><input type="text" id="mod-kf-title-${n}" class="form-control" value="${o.title}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Description</label><textarea id="mod-kf-desc-${n}" class="form-control" style="min-height: 60px;">${o.desc}</textarea></div>
            <button class="btn btn-outline remove-kf-btn" style="border-color:var(--danger); color:var(--danger); padding:4px 12px; margin-top:10px; font-size:0.85rem;" data-index="${n}">Remove Feature</button>
          </div>
        `).join("")}
        </div>
        ${e.keyFeatures.length===0?'<p style="color:#666; font-size:0.9rem;">No key features added yet.</p>':""}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Interior Hotspots</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-hotspot-btn">+ Add Hotspot</button>
        </div>
        <div id="hotspots-container">
        ${e.hotspots.map((o,n)=>`
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px; align-items:end;">
            <div class="form-group" style="margin:0;"><label class="form-label">Label</label><input type="text" id="mod-hs-label-${n}" class="form-control" value="${o.label}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Top (%)</label><input type="number" id="mod-hs-top-${n}" class="form-control" value="${o.top}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Left (%)</label><input type="number" id="mod-hs-left-${n}" class="form-control" value="${o.left}"></div>
            <button class="btn btn-outline remove-hotspot-btn" style="border-color:var(--danger); color:var(--danger); padding:8px 12px;" data-index="${n}">Remove</button>
          </div>
        `).join("")}
        </div>
        ${e.hotspots.length===0?'<p style="color:#666; font-size:0.9rem;">No hotspots added yet.</p>':""}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Model Gallery (Explore Every Angle)</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-mod-gal-btn">+ Add Image</button>
        </div>
        <div id="mod-gallery-container">
        ${(e.gallery||[]).map((o,n)=>`
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px; align-items:end;">
            <div class="form-group" style="margin:0;"><label class="form-label">Image URL</label><div style="display:flex;gap:5px;"><input type="text" id="mod-gal-img-${n}" class="form-control" value="${o}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-gal-img-${n}">Upload</button></div></div>
            <button class="btn btn-outline remove-mod-gal-btn" style="border-color:var(--danger); color:var(--danger); padding:8px 12px;" data-index="${n}">Remove</button>
          </div>
        `).join("")}
        </div>
        ${(e.gallery||[]).length===0?'<p style="color:#666; font-size:0.9rem;">No gallery images added yet.</p>':""}
      </div>
    </div>
  `,document.getElementById("cancel-model-btn").addEventListener("click",()=>F()),document.getElementById("save-model-btn").addEventListener("click",ge),(l=document.getElementById("add-color-btn"))==null||l.addEventListener("click",()=>{g(),e.colors.push({name:"",hex:"#ffffff",img:""}),b()}),(d=document.getElementById("add-trim-btn"))==null||d.addEventListener("click",()=>{g(),e.trims.push({name:"",price:"",img:"",features:[]}),b()}),(r=document.getElementById("add-hotspot-btn"))==null||r.addEventListener("click",()=>{g(),e.hotspots.push({label:"",top:50,left:50}),b()}),(c=document.getElementById("add-kf-btn"))==null||c.addEventListener("click",()=>{g(),e.keyFeatures.push({title:"",desc:""}),b()}),(v=document.getElementById("add-mod-gal-btn"))==null||v.addEventListener("click",()=>{g(),e.gallery=e.gallery||[],e.gallery.push(""),b()}),t.querySelectorAll(".remove-color-btn").forEach(o=>{o.addEventListener("click",()=>{g(),e.colors.splice(parseInt(o.dataset.index),1),b()})}),t.querySelectorAll(".remove-trim-btn").forEach(o=>{o.addEventListener("click",()=>{g(),e.trims.splice(parseInt(o.dataset.index),1),b()})}),t.querySelectorAll(".remove-hotspot-btn").forEach(o=>{o.addEventListener("click",()=>{g(),e.hotspots.splice(parseInt(o.dataset.index),1),b()})}),t.querySelectorAll(".remove-kf-btn").forEach(o=>{o.addEventListener("click",()=>{g(),e.keyFeatures.splice(parseInt(o.dataset.index),1),b()})}),t.querySelectorAll(".remove-mod-gal-btn").forEach(o=>{o.addEventListener("click",()=>{g(),e.gallery.splice(parseInt(o.dataset.index),1),b()})}),t.querySelectorAll(".upload-btn").forEach(o=>{o.addEventListener("click",()=>C(o.dataset.target))}),k({icons:T})}async function ge(){g();const e=window._editingModelData;if(!e.name){alert("Model Name is required!");return}const t=e.name.toLowerCase().replace(/[^a-z0-9]+/g,"-");e.slug=t,e.id=t,q===-1?L.push(e):L[q]=e;try{await s.saveModels(L),F()}catch(a){alert("Error saving: "+a.message)}}async function be(e){if(confirm("Are you sure you want to delete this model?")){L.splice(e,1);try{await s.saveModels(L),F()}catch(t){alert("Error deleting: "+t.message)}}}async function ve(){const e=document.getElementById("content-area");e.innerHTML=x("Dealers","Loading...");try{$=await(await fetch("/api/dealers")).json(),H()}catch(t){console.error(t)}}let M=-1;function H(){const e=document.getElementById("content-area");let t=$.map((a,l)=>`
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
  `,document.getElementById("add-dealer-btn").addEventListener("click",()=>{M=-1,ae()}),e.querySelectorAll('[data-action="edit-dealer"]').forEach(a=>{a.addEventListener("click",()=>{M=parseInt(a.dataset.index),ae()})}),e.querySelectorAll('[data-action="delete-dealer"]').forEach(a=>{a.addEventListener("click",async()=>{if(confirm("Delete this dealer?")){$.splice(parseInt(a.dataset.index),1);try{await s.saveDealers($),H()}catch(l){alert("Error: "+l.message)}}})})}function ae(){const e=document.getElementById("content-area"),t=M===-1?{name:"",city:"",address:"",phone:"",lat:"",lng:"",whatsapp:""}:$[M];e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${M===-1?"Add Dealer":"Edit Dealer"}</h3>
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
  `,document.getElementById("cancel-dealer-btn").addEventListener("click",H),document.getElementById("save-dealer-btn").addEventListener("click",async()=>{const a={name:document.getElementById("dlr-name").value,city:document.getElementById("dlr-city").value,phone:document.getElementById("dlr-phone").value,whatsapp:document.getElementById("dlr-wa").value,address:document.getElementById("dlr-address").value,lat:document.getElementById("dlr-lat").value,lng:document.getElementById("dlr-lng").value};if(!a.name)return alert("Name is required");M===-1?$.push(a):$[M]=a;try{await s.saveDealers($),H()}catch(l){alert("Error: "+l.message)}})}async function ye(){const e=document.getElementById("content-area");e.innerHTML=x("Testimonials","Loading...");try{B=await(await fetch("/api/testimonials")).json(),j()}catch(t){console.error(t)}}let A=-1;function j(){const e=document.getElementById("content-area");let t=B.map((a,l)=>`
    <tr>
      <td><img src="${a.avatar||""}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"></td>
      <td><strong>${a.name}</strong><br><small>${a.role||""} - ${a.model||""}</small></td>
      <td>${"★".repeat(a.rating||5)}${"☆".repeat(5-(a.rating||5))}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px; margin-right: 5px;" data-action="edit-testimonial" data-index="${l}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-testimonial" data-index="${l}">Delete</button>
      </td>
    </tr>
  `).join("");e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage Testimonials</h3>
        <button class="btn btn-primary" id="add-testimonial-btn">+ Add Testimonial</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Avatar</th><th>Info</th><th>Rating</th><th width="120">Actions</th></tr></thead>
        <tbody>${t.length?t:'<tr><td colspan="4" class="empty-state">No testimonials found</td></tr>'}</tbody>
      </table>
    </div>
  `,document.getElementById("add-testimonial-btn").addEventListener("click",()=>{A=-1,le()}),e.querySelectorAll('[data-action="edit-testimonial"]').forEach(a=>{a.addEventListener("click",()=>{A=parseInt(a.dataset.index),le()})}),e.querySelectorAll('[data-action="delete-testimonial"]').forEach(a=>{a.addEventListener("click",async()=>{if(confirm("Delete this testimonial?")){B.splice(parseInt(a.dataset.index),1);try{await s.saveTestimonials(B),j()}catch(l){alert("Error: "+l.message)}}})}),k({icons:T})}function le(){const e=document.getElementById("content-area"),t=A===-1?{name:"",role:"",avatar:"",model:"",rating:5,quote:""}:B[A];e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${A===-1?"Add Testimonial":"Edit Testimonial"}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-testimonial-btn">Cancel</button>
          <button class="btn btn-primary" id="save-testimonial-btn">Save</button>
        </div>
      </div>
      <div style="padding-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="form-group"><label class="form-label">Customer Name</label><input type="text" id="t-name" class="form-control" value="${t.name||""}"></div>
        <div class="form-group"><label class="form-label">Role / Job</label><input type="text" id="t-role" class="form-control" value="${t.role||""}" placeholder="e.g. Entrepreneur"></div>
        <div class="form-group"><label class="form-label">Car Model</label><input type="text" id="t-model" class="form-control" value="${t.model||""}" placeholder="e.g. JAECOO J7"></div>
        <div class="form-group"><label class="form-label">Rating (1-5)</label><input type="number" id="t-rating" class="form-control" min="1" max="5" value="${t.rating||5}"></div>
        <div class="form-group" style="grid-column: 1 / -1;"><label class="form-label">Avatar Image URL</label>
           <div style="display:flex;gap:5px;"><input type="text" id="t-avatar" class="form-control" value="${t.avatar||""}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="t-avatar">Upload</button></div>
        </div>
        <div class="form-group" style="grid-column: 1 / -1;"><label class="form-label">Testimony Text (Quote)</label><textarea id="t-quote" class="form-control" style="min-height: 80px;">${t.quote||""}</textarea></div>
      </div>
    </div>
  `,document.getElementById("cancel-testimonial-btn").addEventListener("click",j),document.getElementById("save-testimonial-btn").addEventListener("click",async()=>{const a={id:t.id||Date.now(),name:document.getElementById("t-name").value,role:document.getElementById("t-role").value,model:document.getElementById("t-model").value,rating:parseInt(document.getElementById("t-rating").value)||5,avatar:document.getElementById("t-avatar").value,quote:document.getElementById("t-quote").value};if(!a.name)return alert("Name is required");A===-1?B.push(a):B[A]=a;try{await s.saveTestimonials(B),j()}catch(l){alert("Error: "+l.message)}}),e.querySelectorAll(".upload-btn").forEach(a=>{a.addEventListener("click",()=>C(a.dataset.target))})}async function fe(){const e=document.getElementById("content-area");e.innerHTML=x("Gallery","Loading...");try{w=await(await fetch("/api/gallery")).json(),R()}catch(t){console.error(t)}}let S=-1;function R(){const e=document.getElementById("content-area");let t=w.map((a,l)=>`
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
  `,document.getElementById("add-gallery-btn").addEventListener("click",()=>{S=-1,oe()}),e.querySelectorAll('[data-action="edit-gallery"]').forEach(a=>{a.addEventListener("click",()=>{S=parseInt(a.dataset.index),oe()})}),e.querySelectorAll('[data-action="delete-gallery"]').forEach(a=>{a.addEventListener("click",async()=>{if(confirm("Delete this gallery item?")){w.splice(parseInt(a.dataset.index),1);try{await s.saveGallery(w),R()}catch(l){alert("Error: "+l.message)}}})})}function oe(){const e=document.getElementById("content-area"),t=S===-1?{title:"",category:"exterior",src:"",thumb:"",width:1200,height:800}:w[S];e.innerHTML=`
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${S===-1?"Add Gallery Image":"Edit Gallery Image"}</h3>
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
  `,e.querySelectorAll(".upload-btn").forEach(a=>{a.addEventListener("click",()=>C(a.dataset.target))}),document.getElementById("cancel-gallery-btn").addEventListener("click",R),document.getElementById("save-gallery-btn").addEventListener("click",async()=>{const a={title:document.getElementById("gal-title").value,category:document.getElementById("gal-cat").value,src:document.getElementById("gal-src").value,thumb:document.getElementById("gal-thumb").value,width:parseInt(document.getElementById("gal-w").value)||1200,height:parseInt(document.getElementById("gal-h").value)||800};if(!a.title||!a.src)return alert("Title and Image URL are required");S===-1?w.push(a):w[S]=a;try{await s.saveGallery(w),R()}catch(l){alert("Error: "+l.message)}})}async function he(){const e=document.getElementById("content-area");e.innerHTML=x("Contacts","Loading...");try{let a=(await s.getContacts()).map(l=>`
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
    `}catch{e.innerHTML='<div class="dashboard-card"><p style="color:var(--danger);">Error loading contacts.</p></div>'}}async function xe(){var t,a;const e=document.getElementById("content-area");e.innerHTML=x("Reservations","Loading...");try{let d=(await s.getReservations()).map(r=>`
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
          <tbody>${d.length?d:'<tr><td colspan="4" class="empty-state">No reservations yet</td></tr>'}</tbody>
        </table>
      </div>
    `,fetch("/api/settings").then(r=>r.json()).then(r=>{r.reservationImage&&(document.getElementById("res-image-url").value=r.reservationImage)}),(t=document.getElementById("btn-upload-res-image"))==null||t.addEventListener("click",()=>{C("res-image-url")}),(a=document.getElementById("save-res-settings"))==null||a.addEventListener("click",async()=>{try{const r=await fetch("/api/settings").then(c=>c.json());r.reservationImage=document.getElementById("res-image-url").value,await s.saveSettings(r),alert("Pengaturan reservasi berhasil disimpan!")}catch(r){alert("Gagal menyimpan: "+r.message)}})}catch{e.innerHTML='<div class="dashboard-card"><p style="color:var(--danger);">Error loading reservations.</p></div>'}}async function Ee(){const e=document.getElementById("content-area");e.innerHTML=x("Settings","Loading...");try{p=await(await fetch("/api/settings")).json(),Ie()}catch(t){console.error(t)}}function Ie(){var t,a,l,d,r,c,v,o;const e=document.getElementById("content-area");e.innerHTML=`
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
            <input type="text" id="setting-footer-email" class="form-control" value="${((d=p.footer)==null?void 0:d.email)||"customercare@jaecoo.id"}">
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
            <input type="text" id="setting-footer-facebook" class="form-control" value="${((c=p.footer)==null?void 0:c.facebook)||"https://web.facebook.com/profile.php?id=61584045292756"}">
          </div>
          <div class="form-group">
            <label class="form-label">Youtube Link</label>
            <input type="text" id="setting-footer-youtube" class="form-control" value="${((v=p.footer)==null?void 0:v.youtube)||"https://www.youtube.com/@RiriJaecooTangerang"}">
          </div>
          <div class="form-group">
            <label class="form-label">Twitter / X Link</label>
            <input type="text" id="setting-footer-twitter" class="form-control" value="${((o=p.footer)==null?void 0:o.twitter)||"#"}">
          </div>
        </div>
      </div>
    </div>
  `,k({icons:T}),document.getElementById("save-settings-btn").addEventListener("click",async()=>{p.aboutVideoUrl=document.getElementById("setting-about-video").value,p.footer={address:document.getElementById("setting-footer-address").value,phone:document.getElementById("setting-footer-phone").value,whatsapp:document.getElementById("setting-footer-whatsapp").value,email:document.getElementById("setting-footer-email").value,facebook:document.getElementById("setting-footer-facebook").value,twitter:document.getElementById("setting-footer-twitter").value,instagram:document.getElementById("setting-footer-instagram").value,youtube:document.getElementById("setting-footer-youtube").value};try{await s.saveSettings(p),alert("Settings saved!")}catch(n){alert("Error: "+n.message)}}),document.getElementById("btn-upload-video").addEventListener("click",async()=>{var y;const n=document.getElementById("video-upload-input");if(!((y=n.files)!=null&&y.length)){alert("Pilih file video terlebih dahulu!");return}try{const E=await s.upload(n.files[0]);document.getElementById("setting-about-video").value=E.url;const D=document.getElementById("video-upload-status");D.style.display="block",setTimeout(()=>D.style.display="none",5e3)}catch(E){alert("Upload error: "+E.message)}})}function C(e){const t=document.createElement("input");t.type="file",t.accept="image/*,video/*",t.onchange=async a=>{const l=a.target.files[0];if(!l)return;const d=document.getElementById(e);if(!d)return;const r=d.value;d.value="Uploading...";try{const c=await s.upload(l);d.value=c.url}catch(c){alert("Upload error: "+c.message),d.value=r}},t.click()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Z):Z();
