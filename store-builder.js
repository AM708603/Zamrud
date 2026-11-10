/* Zamrud Store Builder: editor (window.ZB) + shared storefront renderer (window.ZStore) */
(function () {
const API = "https://zamrud.borntow2.workers.dev", DOM = "zamrud.co/";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DEF = { slug: "", name: "My Store", theme: { c: "#0d9488", bg: "#ffffff", f: "Inter", r: 12 }, sections: [
  { id: "s1", type: "announcement", text: "Free delivery across UAE · Cash on delivery" },
  { id: "s2", type: "hero", title: "Welcome to my store", sub: "Quality products, delivered fast", btn: "Shop now", img: "", bg: "#f0fdfa" },
  { id: "s3", type: "products", title: "Featured products", ids: [], cols: 3 },
  { id: "s4", type: "text", title: "About us", body: "Tell your customers your story." },
  { id: "s5", type: "footer", text: "© My Store", wa: "" }] };
const NAMES = { announcement: "Announcement bar", hero: "Hero banner", products: "Product grid", text: "Text block", footer: "Footer" };
const F = {
  announcement: [["text", "Text"]],
  hero: [["title", "Heading"], ["sub", "Subheading"], ["btn", "Button text"], ["img", "Background image URL"], ["bg", "Background color", "color"]],
  products: [["title", "Title"], ["cols", "Columns", "range"], ["ids", "Products", "pick"]],
  text: [["title", "Title"], ["body", "Text", "area"]],
  footer: [["text", "Footer text"], ["wa", "WhatsApp number (+971…)"]] };

/* ---------- shared renderer (editor preview + public store) ---------- */
function render(cfg, prods, edit, slug) {
  const t = cfg.theme, pm = {}; prods.forEach(p => pm[p.id] = p);
  const img = p => p.image_key ? `<img src="${API}/images/${esc(p.image_key)}" alt="">` : `<div class="e">${p.emoji || "📦"}</div>`;
  const sec = s => {
    let h = "";
    if (s.type === "announcement") h = `<div class="an">${esc(s.text)}</div>`;
    else if (s.type === "hero") h = `<div class="hero" style="background:${esc(s.bg)}${s.img ? `;background-image:url('${esc(s.img)}');background-size:cover;background-position:center` : ""}"><h1>${esc(s.title)}</h1><p>${esc(s.sub)}</p>${s.btn ? `<a class="b" href="#p">${esc(s.btn)}</a>` : ""}</div>`;
    else if (s.type === "products") {
      const list = (s.ids && s.ids.length ? s.ids.map(i => pm[i]).filter(Boolean) : prods.slice(0, 6));
      h = `<div class="w" id="p"><h2>${esc(s.title)}</h2><div class="g" style="grid-template-columns:repeat(auto-fill,minmax(${s.cols >= 4 ? 150 : s.cols == 2 ? 260 : 200}px,1fr))">` +
        (list.map(p => `<div class="c">${img(p)}<h3>${esc(p.name)}</h3><div class="pr">${esc(p.sell_price_aed)} AED</div><button class="b" onclick="buy('${esc(p.id)}')">Order now</button></div>`).join("") || `<p class="m">Add products to this section from the editor.</p>`) + `</div></div>`;
    } else if (s.type === "text") h = `<div class="w"><h2>${esc(s.title)}</h2><p class="m">${esc(s.body).replace(/\n/g, "<br>")}</p></div>`;
    else if (s.type === "footer") h = `<footer>${esc(s.text)}${s.wa ? ` · <a href="https://wa.me/${esc(String(s.wa).replace(/\D/g, ""))}">WhatsApp</a>` : ""}</footer>`;
    return `<section data-s="${esc(s.id)}">${h}</section>`;
  };
  const css = `*{box-sizing:border-box}body{margin:0;font-family:'${esc(t.f)}',system-ui,sans-serif;background:${esc(t.bg)};color:#1e293b}header{padding:14px 20px;font-weight:800;font-size:18px;border-bottom:1px solid #e2e8f0}.an{background:${esc(t.c)};color:#fff;text-align:center;padding:8px;font-size:13px}.hero{padding:70px 20px;text-align:center}.hero h1{font-size:clamp(28px,5vw,48px);margin:0 0 10px}.hero p{margin:0 0 20px;color:#475569}.w{max-width:1100px;margin:auto;padding:36px 20px}h2{margin:0 0 18px}.g{display:grid;gap:16px}.c{border:1px solid #e2e8f0;border-radius:${+t.r}px;padding:12px;background:#fff}.c img,.e{width:100%;aspect-ratio:1;object-fit:cover;border-radius:${Math.max(0, t.r - 4)}px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:48px}.c h3{font-size:14px;margin:10px 0 4px}.pr{font-weight:700;margin-bottom:8px}.b{display:inline-block;background:${esc(t.c)};color:#fff;border:0;padding:10px 18px;border-radius:${+t.r}px;font-weight:700;cursor:pointer;text-decoration:none;font-size:13px}.c .b{width:100%}.m{color:#64748b}footer{text-align:center;padding:28px;background:#0f172a;color:#cbd5e1;font-size:13px}footer a{color:#fff}#md{position:fixed;inset:0;background:#0008;display:none;align-items:center;justify-content:center;padding:16px}#md.o{display:flex}#md form{background:#fff;border-radius:16px;padding:20px;width:100%;max-width:360px;display:grid;gap:10px}#md input{padding:10px;border:1px solid #cbd5e1;border-radius:10px}`;
  const font = t.f && t.f !== "system-ui" ? `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(t.f)}:wght@400;600;800&display=swap" rel="stylesheet">` : "";
  const js = edit
    ? `document.addEventListener("click",function(e){e.preventDefault();var s=e.target.closest("[data-s]");if(s)parent.postMessage({zbSel:s.dataset.s},"*")},true)`
    : `var P=${JSON.stringify(pm).replace(/</g, "\\u003c")},cur;function buy(i){cur=i;document.getElementById("pn").textContent=P[i].name+" · "+P[i].sell_price_aed+" AED";document.getElementById("md").classList.add("o")}
function cl(){document.getElementById("md").classList.remove("o")}
function go(e){e.preventDefault();var f=e.target,b=f.querySelector("button");b.disabled=true;
fetch("${API}/public/store/${esc(slug)}/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({product_id:cur,customer_name:f.n.value,customer_phone:f.p.value,customer_city:f.c.value,quantity:+f.q.value||1})})
.then(function(r){return r.json().then(function(d){if(!r.ok)throw new Error(d.error||"Failed");return d})}).then(function(){f.innerHTML="<h3>Thank you! We will call you to confirm your order.</h3>"}).catch(function(x){alert(x.message);b.disabled=false})}`;
  const modal = edit ? "" : `<div id="md" onclick="if(event.target==this)cl()"><form onsubmit="go(event)"><b id="pn"></b><input name="n" placeholder="Full name" required><input name="p" placeholder="Phone +971…" required><input name="c" placeholder="City" required><input name="q" type="number" min="1" value="1"><button class="b">Place order (Cash on delivery)</button></form></div>`;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(cfg.name)}</title>${font}<style>${css}</style></head><body><header>${esc(cfg.name)}</header>${cfg.sections.map(sec).join("")}${modal}<script>${js}<\/script></body></html>`;
}
window.ZStore = { render, API };

/* ---------- editor ---------- */
const ZB = window.ZB = {};
let cfg, sel = null, prods = [], dev = "d", tm, ready = false;
const $ = id => document.getElementById(id);
const slugify = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
const msg = (t, ok) => { const m = $("zb-msg"); if (m) { m.textContent = t; m.className = "text-xs mt-2 " + (ok ? "text-green-600" : "text-red-600"); } };
const prev = () => { clearTimeout(tm); tm = setTimeout(() => { const f = $("zb-frame"); if (f) f.srcdoc = render(cfg, prods, true, cfg.slug); try { localStorage.zb_draft = JSON.stringify(cfg); } catch (e) {} }, 150); };
const idx = () => cfg.sections.findIndex(s => s.id === sel);

ZB.open = async function () {
  try { prods = (await api("/me/products")).products || []; } catch (e) { prods = []; }
  if (!ready) {
    ready = true;
    try { const d = await api("/me/store"); if (d.store) { cfg = d.store.config; } } catch (e) {}
    if (!cfg) try { cfg = JSON.parse(localStorage.zb_draft); } catch (e) {}
    if (!cfg) cfg = JSON.parse(JSON.stringify(DEF));
    if (!cfg.slug) { const u = currentUser(); cfg.slug = slugify(u && u.name); if (u && cfg.name === "My Store") cfg.name = u.name + "'s Store"; }
    window.addEventListener("message", e => { if (e.data && e.data.zbSel) { sel = e.data.zbSel; panel(); } });
    draw();
  } else prev();
};

function draw() {
  $("store-builder").innerHTML = `<div class="bg-white border rounded-2xl p-3 flex flex-wrap items-center gap-2 mb-3">
<div class="flex items-center border rounded-xl text-sm overflow-hidden"><span class="px-2 py-1.5 bg-slate-50 text-slate-500">${DOM}</span><input value="${esc(cfg.slug)}" oninput="ZB.slug(this.value)" placeholder="yourstore" class="px-2 py-1.5 outline-none w-36"/></div>
<a id="zb-view" target="_blank" class="text-xs text-brand-600 font-semibold hidden">View live store ↗</a><div class="flex-1"></div>
<button onclick="ZB.dev('d')" class="px-3 py-2 border rounded-xl text-sm"><i class="fas fa-desktop"></i></button>
<button onclick="ZB.dev('m')" class="px-3 py-2 border rounded-xl text-sm"><i class="fas fa-mobile-alt"></i></button>
<button onclick="ZB.save(0)" class="px-3 py-2 text-xs font-bold border rounded-xl">Save draft</button>
<button onclick="ZB.save(1)" class="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl">Publish</button></div>
<div class="flex flex-col lg:flex-row gap-3" style="min-height:560px;height:calc(100vh - 190px)">
<div id="zb-panel" class="lg:w-80 flex-shrink-0 bg-white border rounded-2xl overflow-y-auto max-h-[60vh] lg:max-h-none"></div>
<div class="flex-1 bg-slate-200 rounded-2xl p-3 flex justify-center min-h-[400px]"><iframe id="zb-frame" class="bg-white rounded-xl h-full shadow" style="width:100%;max-width:1280px"></iframe></div></div><p id="zb-msg" class="text-xs mt-2"></p>`;
  panel(); prev();
}

function panel() {
  const p = $("zb-panel"), i = idx(), th = cfg.theme;
  if (i < 0) {
    sel = null;
    p.innerHTML = `<div class="p-4 border-b"><div class="text-xs font-bold text-slate-500 uppercase mb-2">Store</div>
<input value="${esc(cfg.name)}" oninput="ZB.name(this.value)" class="w-full px-3 py-2 text-sm border rounded-xl" placeholder="Store name"/></div>
<div class="p-4 border-b"><div class="text-xs font-bold text-slate-500 uppercase mb-2">Sections</div><div class="space-y-1.5">` +
      cfg.sections.map((s, n) => `<div class="flex items-center gap-1 border rounded-xl px-2 py-1.5 text-sm hover:bg-slate-50"><button class="flex-1 text-left font-medium" onclick="ZB.sel('${s.id}')">${NAMES[s.type]}</button>
<button onclick="ZB.mv(${n},-1)" class="px-1 text-slate-400">↑</button><button onclick="ZB.mv(${n},1)" class="px-1 text-slate-400">↓</button><button onclick="ZB.del(${n})" class="px-1 text-red-400"><i class="fas fa-trash-alt text-xs"></i></button></div>`).join("") +
      `</div><select onchange="ZB.add(this.value);this.value=''" class="mt-3 w-full px-3 py-2 text-sm border rounded-xl text-brand-700 font-semibold"><option value="">+ Add section</option>${Object.keys(NAMES).map(k => `<option value="${k}">${NAMES[k]}</option>`).join("")}</select></div>
<div class="p-4"><div class="text-xs font-bold text-slate-500 uppercase mb-2">Theme</div><div class="grid grid-cols-2 gap-3 text-xs text-slate-500">
<label>Brand color<input type="color" value="${th.c}" oninput="ZB.th('c',this.value)" class="w-full h-9 border rounded-lg"/></label>
<label>Background<input type="color" value="${th.bg}" oninput="ZB.th('bg',this.value)" class="w-full h-9 border rounded-lg"/></label>
<label>Font<select onchange="ZB.th('f',this.value)" class="w-full px-2 py-2 border rounded-lg text-sm">${["Inter", "Poppins", "Playfair Display", "Montserrat", "Cairo", "system-ui"].map(f => `<option ${f == th.f ? "selected" : ""}>${f}</option>`).join("")}</select></label>
<label>Roundness<input type="range" min="0" max="24" value="${th.r}" oninput="ZB.th('r',this.value)" class="w-full"/></label></div></div>`;
    return;
  }
  const s = cfg.sections[i];
  p.innerHTML = `<div class="p-4 border-b flex items-center gap-2"><button onclick="ZB.sel(null)" class="text-slate-500">←</button><b class="text-sm">${NAMES[s.type]}</b></div><div class="p-4 space-y-3">` +
    F[s.type].map(([k, l, ty]) => {
      const lb = `<label class="text-xs font-medium text-slate-500 block mb-1">${l}</label>`, cls = 'class="w-full px-3 py-2 text-sm border rounded-xl"';
      if (ty === "pick") return lb + `<div class="border rounded-xl max-h-52 overflow-y-auto divide-y">` + (prods.map(x => `<label class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"><input type="checkbox" ${(s.ids || []).includes(x.id) ? "checked" : ""} onchange="ZB.pick('${esc(x.id)}',this.checked)"/> ${esc(x.name)}</label>`).join("") || `<p class="p-3 text-xs text-slate-400">Add products from the Catalog first.</p>`) + `</div><p class="text-[11px] text-slate-400 mt-1">None selected = shows your first 6 products.</p>`;
      if (ty === "color") return lb + `<input type="color" value="${s[k]}" oninput="ZB.set('${k}',this.value)" class="w-full h-9 border rounded-lg"/>`;
      if (ty === "range") return lb + `<input type="range" min="2" max="4" value="${s[k]}" oninput="ZB.set('${k}',+this.value)" class="w-full"/>`;
      if (ty === "area") return lb + `<textarea rows="5" ${cls} oninput="ZB.set('${k}',this.value)">${esc(s[k])}</textarea>`;
      return lb + `<input value="${esc(s[k])}" ${cls} oninput="ZB.set('${k}',this.value)"/>`;
    }).join("") + `</div>`;
}

ZB.dev = d => { dev = d; $("zb-frame").style.maxWidth = d == "m" ? "390px" : "1280px"; };
ZB.slug = v => { cfg.slug = slugify(v); prev(); };
ZB.name = v => { cfg.name = v; prev(); };
ZB.th = (k, v) => { cfg.theme[k] = v; prev(); };
ZB.set = (k, v) => { cfg.sections[idx()][k] = v; prev(); };
ZB.pick = (id, on) => { const s = cfg.sections[idx()], a = s.ids || (s.ids = []); const n = a.indexOf(id); if (on && n < 0) a.push(id); if (!on && n >= 0) a.splice(n, 1); prev(); };
ZB.sel = id => { sel = id; panel(); };
ZB.add = t => { if (!t) return; const d = JSON.parse(JSON.stringify(DEF.sections.find(s => s.type === t) || { type: t, title: "New section", body: "" })); d.id = "s" + Date.now(); const f = cfg.sections.findIndex(s => s.type === "footer"); cfg.sections.splice(f < 0 ? cfg.sections.length : f, 0, d); sel = d.id; panel(); prev(); };
ZB.mv = (n, d) => { const m = n + d; if (m < 0 || m >= cfg.sections.length) return; cfg.sections.splice(m, 0, cfg.sections.splice(n, 1)[0]); panel(); prev(); };
ZB.del = n => { if (confirm("Remove this section?")) { cfg.sections.splice(n, 1); panel(); prev(); } };
ZB.save = async function (pub) {
  if (!/^[a-z0-9-]{3,30}$/.test(cfg.slug || "")) return msg("Store address must be 3–30 letters, numbers or dashes.", 0);
  msg("Saving…", 1);
  try {
    await api("/me/store", { method: "PUT", body: JSON.stringify({ slug: cfg.slug, config: cfg, published: pub ? 1 : 0 }) });
    msg(pub ? "Published! Your store is live." : "Draft saved.", 1);
    if (pub) { const a = $("zb-view"); a.href = "https://" + DOM + cfg.slug; a.classList.remove("hidden"); }
  } catch (e) { msg(e.message, 0); }
};
})();
