/* Zamrud Store Builder v2: storefront renderer (window.ZStore) + editor (window.ZB) */
(function () {
const API = "https://zamrud.borntow2.workers.dev", DOM = "zamrud.co/";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const J = x => JSON.stringify(x).replace(/</g, "\\u003c");
const DEF = { slug: "", name: "My Store", logo: "", wa: "", email: "", footer: "Quality products delivered across the UAE. Cash on delivery.", hdr: "left",
  theme: { c: "#0d9488", bg: "#ffffff", f: "Inter", r: 12, dark: 0 },
  sections: [
    { id: "s1", type: "announcement", text: "Free delivery across UAE · Cash on delivery" },
    { id: "s2", type: "hero", fx: "fade", h: 460, slides: [
      { t: "Welcome to our store", s: "Quality products, delivered fast", b: "Shop now", img: "", bg: "#0d9488" },
      { t: "New arrivals", s: "Fresh picks every week", b: "Explore", img: "", bg: "#0f766e" },
      { t: "Cash on delivery", s: "Pay when you receive", b: "Order now", img: "", bg: "#115e59" }] },
    { id: "s3", type: "cats", title: "Shop by category" },
    { id: "s4", type: "products", title: "Featured products", cat: "", n: 8 },
    { id: "s5", type: "promo", title: "Special offer", text: "Limited time deals on our best sellers", cat: "", bg: "#0d9488" },
    { id: "s6", type: "text", title: "About us", body: "Tell your customers your story." }] };
const TPL = { classic: { c: "#0d9488", bg: "#ffffff", f: "Inter", r: 12, dark: 0, hdr: "left", fx: "fade" },
  bold: { c: "#f97316", bg: "#0f172a", f: "Poppins", r: 6, dark: 1, hdr: "left", fx: "slide" },
  elegant: { c: "#92400e", bg: "#faf7f2", f: "Playfair Display", r: 2, dark: 0, hdr: "center", fx: "zoom" } };
const PAL = ["#0d9488", "#2563eb", "#7c3aed", "#db2777", "#f97316", "#16a34a", "#111827"];
const NAMES = { announcement: "Announcement bar", hero: "Hero slideshow", cats: "Category grid", products: "Featured products", promo: "Promotion banner", text: "Text block" };
const norm = c => {
  c = Object.assign(JSON.parse(JSON.stringify(DEF)), c || {});
  c.theme = Object.assign({}, DEF.theme, c.theme);
  const f = (c.sections || []).find(s => s.type === "footer");
  if (f) { c.wa = c.wa || f.wa || ""; c.footer = c.footer || f.text; }
  c.sections = (c.sections || []).filter(s => s.type !== "footer").map(s => s.type === "hero" && !s.slides ? { id: s.id, type: "hero", fx: "fade", h: 460, slides: [{ t: s.title, s: s.sub, b: s.btn, img: s.img, bg: s.bg }] } : s);
  return c;
};

/* ---------- storefront runtime (runs inside the store page / preview iframe) ---------- */
function app(C, P, E, slug, API) {
  const D = document, esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cats = [...new Set(P.map(p => p.category).filter(Boolean))], pm = {}; P.forEach(p => pm[p.id] = p);
  let cart = [], tm = [];
  try { cart = JSON.parse(localStorage["zc_" + slug] || "[]"); } catch (e) {}
  const sv = () => { try { localStorage["zc_" + slug] = JSON.stringify(cart); } catch (e) {} };
  const cnt = () => cart.reduce((a, i) => a + i.q, 0), tot = () => cart.reduce((a, i) => a + (pm[i.id] ? pm[i.id].sell_price_aed * i.q : 0), 0);
  const wad = String(C.wa || "").replace(/\D/g, ""), cl = c => "#/c/" + encodeURIComponent(c);
  const im = p => p.image_key ? `<img src="${API}/images/${esc(p.image_key)}" alt="">` : `<div class="e">${p.emoji || "📦"}</div>`;
  const card = p => `<a class="c" href="#/p/${esc(p.id)}">${im(p)}<h3>${esc(p.name)}</h3><b>${p.sell_price_aed} AED</b></a>`;
  const grid = l => `<div class="g">${l.map(card).join("") || '<p class="m">No products yet.</p>'}</div>`;
  const S = {
    hero: s => `<div class="hero" style="height:${s.h || 460}px">${s.slides.map((x, i) => `<div class="sl ${s.fx || "fade"}${i ? "" : " on"}" style="background-color:${esc(x.bg || "#0d9488")}${x.img ? `;background-image:linear-gradient(#0004,#0004),url('${esc(x.img)}')` : ""}"><div class="hi"><h1>${esc(x.t)}</h1><p>${esc(x.s)}</p>${x.b ? `<a class="b w2" href="${x.cat ? cl(x.cat) : "#/shop"}">${esc(x.b)}</a>` : ""}</div></div>`).join("")}${s.slides.length > 1 ? `<button class="ar l" data-ar="-1">‹</button><button class="ar r" data-ar="1">›</button><div class="dt">${s.slides.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}</div>`,
    cats: s => `<div class="w"><h2>${esc(s.title)}</h2><div class="g">${cats.map(c => { const p = P.find(x => x.category == c); return `<a class="c cc" href="${cl(c)}">${p ? im(p) : ""}<h3>${esc(c)}</h3></a>`; }).join("") || '<p class="m">Categories appear once you add products.</p>'}</div></div>`,
    products: s => `<div class="w"><h2>${esc(s.title)}</h2>${grid(P.filter(p => !s.cat || p.category == s.cat).slice(0, s.n || 8))}</div>`,
    promo: s => `<div class="w"><a class="pm" style="background:${esc(s.bg)}" href="${s.cat ? cl(s.cat) : "#/shop"}"><div><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></div><span class="b w2">Shop now</span></a></div>`,
    text: s => `<div class="w"><h2>${esc(s.title)}</h2><p class="m">${esc(s.body).replace(/\n/g, "<br>")}</p></div>` };
  const V = {
    home: () => C.sections.filter(s => s.type != "announcement").map(s => `<section data-s="${esc(s.id)}">${S[s.type] ? S[s.type](s) : ""}</section>`).join(""),
    shop: () => `<div class="w"><h2>All products</h2>${grid(P)}</div>`,
    c: n => { n = decodeURIComponent(n); const pr = C.sections.find(s => s.type == "promo" && s.cat == n); return `<div class="w">${pr ? `<div class="pm" style="background:${esc(pr.bg)}"><div><h2>${esc(pr.title)}</h2><p>${esc(pr.text)}</p></div></div><br>` : ""}<h2>${esc(n)}</h2>${grid(P.filter(p => p.category == n))}</div>`; },
    p: id => { const p = pm[id]; if (!p) return V.shop(); return `<div class="w pp"><div>${im(p)}</div><div><p class="m">${esc(p.category)}</p><h1>${esc(p.name)}</h1><h2>${p.sell_price_aed} AED</h2><p class="m">✔ Cash on delivery · ✔ Fast UAE delivery</p><div class="qr"><button data-q="-1">−</button><b id="q">1</b><button data-q="1">+</button></div><button class="b" data-add="${esc(p.id)}">Add to cart</button> <button class="b o" data-buy="${esc(p.id)}">Buy now</button></div></div><div class="w"><h2>You may also like</h2>${grid(P.filter(x => x.category == p.category && x.id != p.id).slice(0, 4))}</div>`; },
    cart: () => `<div class="w"><h2>Your cart</h2>${cart.length ? cart.map(i => { const p = pm[i.id]; return p ? `<div class="ln">${im(p)}<div><b>${esc(p.name)}</b><br>${p.sell_price_aed} AED</div><div class="qr"><button data-ci="${esc(i.id)}" data-dd="-1">−</button><b>${i.q}</b><button data-ci="${esc(i.id)}" data-dd="1">+</button></div></div>` : ""; }).join("") + `<h3>Total: ${tot()} AED</h3><a class="b" href="#/checkout">Checkout</a>` : '<p class="m">Your cart is empty.</p>'}</div>`,
    checkout: () => !cart.length ? V.cart() : `<div class="w co"><form id="cf"><h2>Checkout</h2><input name="n" placeholder="Full name" required><input name="p" placeholder="Phone +971…" required><input name="c" placeholder="City" required><input name="a" placeholder="Address"><p class="m">${cnt()} item(s) · ${tot()} AED · Cash on delivery</p><button class="b">Place order</button></form></div>` };
  const slide = (h, d) => { const sl = [...h.querySelectorAll(".sl")], dt = [...h.querySelectorAll(".dt i")]; let i = sl.findIndex(x => x.classList.contains("on")); sl[i].classList.remove("on"); dt[i] && dt[i].classList.remove("on"); i = (i + d + sl.length) % sl.length; sl[i].classList.add("on"); dt[i] && dt[i].classList.add("on"); };
  function R() {
    tm.forEach(clearInterval); tm = [];
    const [, k, a] = (location.hash.slice(1) || "/").split("/"), key = k || "home";
    const v = (key == "c" || key == "p") ? V[key](a || "") : (V[key] ? V[key]() : V.home());
    const links = cats.map(c => `<a href="${cl(c)}">${esc(c)}</a>`).join("");
    D.getElementById("app").innerHTML =
      C.sections.filter(s => s.type == "announcement").map(s => `<section data-s="${esc(s.id)}"><div class="an">${esc(s.text)}</div></section>`).join("") +
      `<header class="${esc(C.hdr)}"><a href="#/" class="br">${C.logo ? `<img src="${esc(C.logo)}" class="lg" alt="">` : ""}<span>${esc(C.name)}</span></a><nav><a href="#/">Home</a>${cats.slice(0, 5).map(c => `<a href="${cl(c)}">${esc(c)}</a>`).join("")}<a href="#/shop">Shop</a></nav><a href="#/cart" class="ct">🛒<i>${cnt()}</i></a></header>` +
      `<main>${v}</main><footer><div class="fg"><div><b>${esc(C.name)}</b><p>${esc(C.footer)}</p></div><div><b>Shop</b>${links}</div><div><b>Contact</b>${wad ? `<a href="https://wa.me/${wad}">WhatsApp</a>` : ""}${C.email ? `<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>` : ""}</div></div><small>© ${new Date().getFullYear()} ${esc(C.name)}</small></footer>` +
      (wad ? `<a class="wa" href="https://wa.me/${wad}" target="_blank">💬</a>` : "");
    D.querySelectorAll(".hero").forEach(h => { if (h.querySelectorAll(".sl").length > 1) tm.push(setInterval(() => slide(h, 1), 5000)); });
  }
  D.onclick = e => {
    const t = e.target; let x;
    const s = t.closest("[data-s]"); if (E && s) parent.postMessage({ zbSel: s.dataset.s }, "*");
    const g = a => t.closest("[" + a + "]");
    if (x = g("data-q")) { const q = D.getElementById("q"); q.textContent = Math.max(1, +q.textContent + +x.dataset.q); }
    else if (x = g("data-add") || g("data-buy")) { const q = +D.getElementById("q").textContent || 1, id = x.dataset.add || x.dataset.buy, i = cart.find(y => y.id == id); i ? i.q += q : cart.push({ id, q }); sv(); x.dataset.buy ? location.hash = "#/checkout" : R(); }
    else if (x = g("data-ci")) { const i = cart.find(y => y.id == x.dataset.ci); i.q += +x.dataset.dd; if (i.q < 1) cart = cart.filter(y => y != i); sv(); R(); }
    else if (x = g("data-ar")) slide(x.closest(".hero"), +x.dataset.ar);
  };
  D.onsubmit = e => {
    e.preventDefault(); if (E) return alert("Preview only");
    const f = e.target, b = f.querySelector("button"); b.disabled = true;
    fetch(API + "/public/store/" + slug + "/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cart.map(i => ({ product_id: i.id, quantity: i.q })), customer_name: f.n.value, customer_phone: f.p.value, customer_city: f.c.value, customer_address: f.a.value }) })
      .then(r => r.json().then(d => { if (!r.ok) throw Error(d.error || "Failed"); return d; }))
      .then(d => { cart = []; sv(); D.querySelector("main").innerHTML = `<div class="w"><h2>Thank you! 🎉</h2><p>Order ${esc(d.order_number)} received. We will call you to confirm.</p><a class="b" href="#/">Continue shopping</a></div>`; })
      .catch(x => { alert(x.message); b.disabled = false; });
  };
  window.addEventListener("message", e => { if (e.data && e.data.go) location.hash = e.data.go; });
  window.addEventListener("hashchange", () => { R(); scrollTo(0, 0); });
  R();
}

function css(t) {
  const dk = +t.dark;
  return `:root{--c:${esc(t.c)};--bg:${esc(t.bg)};--t:${dk ? "#f1f5f9" : "#1e293b"};--cd:${dk ? "#1e293b" : "#fff"};--bd:${dk ? "#334155" : "#e2e8f0"};--mu:${dk ? "#94a3b8" : "#64748b"};--r:${+t.r}px}*{box-sizing:border-box}body{margin:0;font-family:'${esc(t.f)}',system-ui,sans-serif;background:var(--bg);color:var(--t)}a{color:inherit;text-decoration:none}h1,h2,h3{margin-top:0}
header{display:flex;align-items:center;gap:16px;padding:12px 20px;background:var(--cd);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:20;flex-wrap:wrap}header nav{display:flex;gap:16px;flex:1;overflow-x:auto;font-size:14px;font-weight:600;white-space:nowrap}header.center{flex-direction:column}header.center nav{flex:none}.br{display:flex;align-items:center;gap:8px;font-weight:800;font-size:18px}.lg{height:36px;width:auto;border-radius:6px}.ct{position:relative;font-size:20px}.ct i{position:absolute;top:-6px;right:-10px;background:var(--c);color:#fff;font:700 10px sans-serif;border-radius:9px;padding:2px 5px}
.an{background:var(--c);color:#fff;text-align:center;padding:8px;font-size:13px}
.hero{position:relative;overflow:hidden;color:#fff}.sl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;background-size:cover;background-position:center;opacity:0;transition:opacity .9s,transform 1.2s;pointer-events:none}.sl.on{opacity:1;pointer-events:auto;transform:none}.sl.slide{transform:translateX(8%)}.sl.zoom{transform:scale(1.12)}.hi{max-width:700px;padding:20px}.hi h1{font-size:clamp(28px,5vw,52px);margin:0 0 10px}.hi p{margin:0 0 20px;opacity:.9}
.ar{position:absolute;top:50%;background:#0006;color:#fff;border:0;width:38px;height:38px;border-radius:50%;font-size:22px;cursor:pointer;z-index:2}.ar.l{left:12px}.ar.r{right:12px}.dt{position:absolute;bottom:12px;left:0;right:0;display:flex;justify-content:center;gap:6px;z-index:2}.dt i{width:8px;height:8px;border-radius:5px;background:#fff6;transition:.3s}.dt i.on{background:#fff;width:22px}
.w{max-width:1100px;margin:auto;padding:32px 20px}.g{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(170px,1fr))}.c{display:block;background:var(--cd);border:1px solid var(--bd);border-radius:var(--r);padding:10px;transition:transform .2s,box-shadow .2s}.c:hover{transform:translateY(-3px);box-shadow:0 8px 20px #0002}.c img,.e{width:100%;aspect-ratio:1;object-fit:cover;border-radius:max(0px,calc(var(--r) - 2px));background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:48px}.c h3{font-size:14px;margin:8px 0 2px}.cc h3{text-align:center;font-size:16px}
.b{display:inline-block;background:var(--c);color:#fff;border:2px solid var(--c);padding:10px 20px;border-radius:var(--r);font-weight:700;cursor:pointer;font-size:14px}.b.o{background:transparent;color:var(--c)}.b.w2{background:#fff;color:#111;border-color:#fff}
.pm{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:28px;border-radius:var(--r);color:#fff;flex-wrap:wrap}.pm h2{margin:0 0 6px;font-size:28px}.pm p{margin:0}
.pp{display:grid;grid-template-columns:1fr 1fr;gap:28px}@media(max-width:700px){.pp{grid-template-columns:1fr}}
.qr{display:inline-flex;align-items:center;gap:10px;margin:12px 12px 12px 0}.qr button{width:32px;height:32px;border-radius:50%;border:1px solid var(--bd);background:var(--cd);color:var(--t);cursor:pointer}
.ln{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--bd)}.ln img,.ln .e{width:60px;height:60px;font-size:24px;flex-shrink:0}.ln>div:nth-child(2){flex:1}
.co form{max-width:420px;display:grid;gap:10px}input{padding:11px;border:1px solid var(--bd);border-radius:var(--r);background:var(--cd);color:var(--t)}.m{color:var(--mu)}
footer{background:#0f172a;color:#cbd5e1;padding:32px 20px 16px;margin-top:20px;font-size:14px}.fg{max-width:1100px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px}.fg a{display:block;margin-top:6px}.fg b{color:#fff}footer small{display:block;text-align:center;margin-top:20px;opacity:.6}
.wa{position:fixed;right:16px;bottom:16px;width:54px;height:54px;border-radius:50%;background:#25d366;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 4px 14px #0004;z-index:30}`;
}

function render(cfg, prods, edit, slug) {
  const C = norm(cfg), t = C.theme;
  const font = t.f && t.f !== "system-ui" ? `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(t.f)}:wght@400;600;800&display=swap" rel="stylesheet">` : "";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(C.name)}</title>${C.logo ? `<link rel="icon" href="${esc(C.logo)}">` : ""}${font}<style>${css(t)}</style></head><body><div id="app"></div><script>(${app.toString()})(${J(C)},${J(prods)},${!!edit},${J(slug || "")},${J(API)})<\/script></body></html>`;
}
window.ZStore = { render, API };

/* ---------- editor ---------- */
const ZB = window.ZB = {};
let cfg, sel = null, prods = [], tm, ready = false;
const $ = id => document.getElementById(id);
const slugify = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
const msg = (t, ok) => { const m = $("zb-msg"); if (m) { m.textContent = t; m.className = "text-xs mt-2 " + (ok ? "text-green-600" : "text-red-600"); } };
const prev = () => { clearTimeout(tm); tm = setTimeout(() => { const f = $("zb-frame"); if (f) f.srcdoc = render(cfg, prods, true, cfg.slug); try { localStorage.zb_draft = JSON.stringify(cfg); } catch (e) {} }, 200); };
const idx = () => cfg.sections.findIndex(s => s.id === sel);
const cats = () => [...new Set(prods.map(p => p.category).filter(Boolean))];
const L = (l, h) => `<label class="block text-xs font-medium text-slate-500 mb-2">${l}${h}</label>`;
const IN = (l, v, fn, t) => L(l, `<input type="${t || "text"}" value="${esc(v)}" oninput="${fn}" class="w-full mt-1 px-3 py-2 text-sm border rounded-xl ${t == "color" ? "h-10 p-1" : ""}"/>`);
const SEL = (l, v, o, fn) => L(l, `<select onchange="${fn}" class="w-full mt-1 px-3 py-2 text-sm border rounded-xl">${o.map(x => `<option value="${esc(x[0])}" ${x[0] == v ? "selected" : ""}>${esc(x[1])}</option>`).join("")}</select>`);
const AC = (t, b, o) => `<details ${o ? "open" : ""} class="border-b"><summary class="px-4 py-3 text-sm font-bold cursor-pointer">${t}</summary><div class="px-4 pb-4">${b}</div></details>`;
const CATOPT = () => [["", "All products"]].concat(cats().map(c => [c, c]));

ZB.open = async function () {
  try { prods = (await api("/me/products")).products || []; } catch (e) { prods = []; }
  if (!ready) {
    ready = true;
    try { const d = await api("/me/store"); if (d.store) cfg = d.store.config; } catch (e) {}
    if (!cfg) try { cfg = JSON.parse(localStorage.zb_draft); } catch (e) {}
    cfg = norm(cfg);
    if (!cfg.slug) { const u = currentUser(); cfg.slug = slugify(u && u.name); if (u && cfg.name === "My Store") cfg.name = u.name + "'s Store"; }
    window.addEventListener("message", e => { if (e.data && e.data.zbSel) { sel = e.data.zbSel; panel(); } });
  }
  draw();
};

function draw() {
  const p1 = prods[0] ? `<option value="#/p/${esc(prods[0].id)}">Product page</option>` : "";
  $("store-builder").innerHTML = `<div class="bg-white border rounded-2xl p-3 flex flex-wrap items-center gap-2 mb-3">
<div class="flex items-center border rounded-xl text-sm overflow-hidden"><span class="px-2 py-1.5 bg-slate-50 text-slate-500">${DOM}</span><input value="${esc(cfg.slug)}" oninput="ZB.slug(this.value)" placeholder="yourstore" class="px-2 py-1.5 outline-none w-32"/></div>
<a id="zb-view" target="_blank" class="text-xs text-brand-600 font-semibold hidden">View live ↗</a><div class="flex-1"></div>
<select onchange="ZB.go(this.value)" class="text-xs border rounded-xl px-2 py-2"><option value="#/">Home</option><option value="#/shop">All products</option>${p1}<option value="#/cart">Cart</option><option value="#/checkout">Checkout</option></select>
<button onclick="ZB.dev('d')" class="px-3 py-2 border rounded-xl text-sm"><i class="fas fa-desktop"></i></button><button onclick="ZB.dev('m')" class="px-3 py-2 border rounded-xl text-sm"><i class="fas fa-mobile-alt"></i></button>
<button onclick="ZB.save(0)" class="px-3 py-2 text-xs font-bold border rounded-xl">Save draft</button><button onclick="ZB.save(1)" class="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl">Publish</button></div>
<div class="flex flex-col lg:flex-row gap-3" style="min-height:560px;height:calc(100vh - 190px)">
<div id="zb-panel" class="lg:w-80 flex-shrink-0 bg-white border rounded-2xl overflow-y-auto max-h-[60vh] lg:max-h-none"></div>
<div class="flex-1 bg-slate-200 rounded-2xl p-3 flex justify-center min-h-[400px]"><iframe id="zb-frame" class="bg-white rounded-xl h-full shadow" style="width:100%;max-width:1280px"></iframe></div></div><p id="zb-msg" class="text-xs mt-2"></p>`;
  panel(); prev();
}

function panel() {
  const p = $("zb-panel"), i = idx(), th = cfg.theme;
  if (i < 0) {
    sel = null;
    p.innerHTML =
      AC("Branding", IN("Store name", cfg.name, "ZB.g('name',this.value)") + L("Logo (also becomes the browser tab icon)", `<input type="file" accept="image/*" onchange="ZB.logo(this.files[0])" class="block text-xs mt-1"/>`) + (cfg.logo ? `<img src="${cfg.logo}" class="h-10 my-2"/><button onclick="ZB.g('logo','');ZB.re()" class="text-xs text-red-500">Remove logo</button>` : ""), 1) +
      AC("Templates", `<div class="flex gap-2">${Object.keys(TPL).map(n => `<button onclick="ZB.tpl('${n}')" class="flex-1 py-2 text-xs font-bold border rounded-xl capitalize hover:bg-slate-50">${n}</button>`).join("")}</div>`) +
      AC("Theme & header", `<div class="flex gap-1.5 mb-3">${PAL.map(c => `<button onclick="ZB.th('c','${c}');ZB.re()" class="w-7 h-7 rounded-full border-2 border-white shadow" style="background:${c}"></button>`).join("")}</div>` +
        IN("Brand color", th.c, "ZB.th('c',this.value)", "color") + IN("Background", th.bg, "ZB.th('bg',this.value)", "color") +
        L("Dark mode", `<input type="checkbox" ${+th.dark ? "checked" : ""} onchange="ZB.th('dark',this.checked?1:0)" class="ml-2"/>`) +
        SEL("Font", th.f, ["Inter", "Poppins", "Playfair Display", "Montserrat", "Cairo", "system-ui"].map(f => [f, f]), "ZB.th('f',this.value)") +
        L("Roundness", `<input type="range" min="0" max="24" value="${th.r}" oninput="ZB.th('r',this.value)" class="w-full"/>`) +
        SEL("Header layout", cfg.hdr, [["left", "Logo left, menu beside"], ["center", "Centered"]], "ZB.g('hdr',this.value)")) +
      AC("Contact & footer", IN("WhatsApp number (shows floating button)", cfg.wa, "ZB.g('wa',this.value)") + IN("Email", cfg.email, "ZB.g('email',this.value)") + IN("Footer text", cfg.footer, "ZB.g('footer',this.value)")) +
      AC("Sections", `<div class="space-y-1.5">${cfg.sections.map((s, n) => `<div class="flex items-center gap-1 border rounded-xl px-2 py-1.5 text-sm hover:bg-slate-50"><button class="flex-1 text-left font-medium" onclick="ZB.sel('${s.id}')">${NAMES[s.type]}</button><button onclick="ZB.mv(${n},-1)" class="px-1 text-slate-400">↑</button><button onclick="ZB.mv(${n},1)" class="px-1 text-slate-400">↓</button><button onclick="ZB.del(${n})" class="px-1 text-red-400"><i class="fas fa-trash-alt text-xs"></i></button></div>`).join("")}</div>
<select onchange="ZB.add(this.value);this.value=''" class="mt-3 w-full px-3 py-2 text-sm border rounded-xl text-brand-700 font-semibold"><option value="">+ Add section</option>${Object.keys(NAMES).map(k => `<option value="${k}">${NAMES[k]}</option>`).join("")}</select>`, 1);
    return;
  }
  const s = cfg.sections[i], t = s.type, S = (k, l, ty) => IN(l, s[k], `ZB.set('${k}',this.value)`, ty);
  let b = "";
  if (t == "announcement") b = S("text", "Text");
  if (t == "cats") b = S("title", "Title");
  if (t == "text") b = S("title", "Title") + L("Text", `<textarea rows="5" oninput="ZB.set('body',this.value)" class="w-full mt-1 px-3 py-2 text-sm border rounded-xl">${esc(s.body)}</textarea>`);
  if (t == "products") b = S("title", "Title") + SEL("Category (featured by category)", s.cat, CATOPT(), "ZB.set('cat',this.value)") + L("How many", `<input type="range" min="2" max="12" value="${s.n || 8}" oninput="ZB.set('n',+this.value)" class="w-full"/>`);
  if (t == "promo") b = S("title", "Headline") + S("text", "Text") + SEL("Promotes category", s.cat, CATOPT(), "ZB.set('cat',this.value)") + S("bg", "Color", "color") + `<p class="text-[11px] text-slate-400">This banner also shows at the top of its category page.</p>`;
  if (t == "hero") b = SEL("Transition", s.fx, [["fade", "Fade"], ["slide", "Slide in"], ["zoom", "Zoom"]], "ZB.set('fx',this.value)") + L("Height", `<input type="range" min="260" max="640" value="${s.h || 460}" oninput="ZB.set('h',+this.value)" class="w-full"/>`) +
    s.slides.map((x, n) => `<div class="border rounded-xl p-2 mb-2"><div class="flex justify-between text-xs font-bold"><span>Slide ${n + 1}</span><button onclick="ZB.sld(${n})" class="text-red-500">Remove</button></div>${IN("Heading", x.t, `ZB.sl(${n},'t',this.value)`)}${IN("Subheading", x.s, `ZB.sl(${n},'s',this.value)`)}${IN("Button text", x.b, `ZB.sl(${n},'b',this.value)`)}${SEL("Button opens", x.cat || "", CATOPT(), `ZB.sl(${n},'cat',this.value)`)}${IN("Image URL", x.img, `ZB.sl(${n},'img',this.value)`)}${IN("Background", x.bg || "#0d9488", `ZB.sl(${n},'bg',this.value)`, "color")}</div>`).join("") +
    `<button onclick="ZB.sla()" class="w-full py-2 text-xs font-bold border rounded-xl text-brand-700">+ Add slide</button>`;
  p.innerHTML = `<div class="p-4 border-b flex items-center gap-2"><button onclick="ZB.sel(null)" class="text-slate-500">←</button><b class="text-sm">${NAMES[t]}</b></div><div class="p-4">${b}</div>`;
}

const sec = () => cfg.sections[idx()];
ZB.re = () => { panel(); prev(); };
ZB.go = h => { const f = $("zb-frame"); f && f.contentWindow.postMessage({ go: h }, "*"); };
ZB.dev = d => { $("zb-frame").style.maxWidth = d == "m" ? "390px" : "1280px"; };
ZB.slug = v => { cfg.slug = slugify(v); prev(); };
ZB.g = (k, v) => { cfg[k] = v; prev(); };
ZB.th = (k, v) => { cfg.theme[k] = v; prev(); };
ZB.set = (k, v) => { sec()[k] = v; prev(); };
ZB.sl = (n, k, v) => { sec().slides[n][k] = v; prev(); };
ZB.sla = () => { sec().slides.push({ t: "New slide", s: "", b: "Shop now", img: "", bg: cfg.theme.c }); ZB.re(); };
ZB.sld = n => { const s = sec(); if (s.slides.length > 1) { s.slides.splice(n, 1); ZB.re(); } };
ZB.sel = id => { sel = id; panel(); };
ZB.add = t => { if (!t) return; const d = JSON.parse(JSON.stringify(DEF.sections.find(s => s.type === t))); d.id = "s" + Date.now(); cfg.sections.push(d); sel = d.id; ZB.re(); };
ZB.mv = (n, d) => { const m = n + d; if (m < 0 || m >= cfg.sections.length) return; cfg.sections.splice(m, 0, cfg.sections.splice(n, 1)[0]); ZB.re(); };
ZB.del = n => { if (confirm("Remove this section?")) { cfg.sections.splice(n, 1); ZB.re(); } };
ZB.tpl = n => {
  if (!confirm("Apply the " + n + " template? Your sections will be reset.")) return;
  const t = TPL[n], d = JSON.parse(JSON.stringify(DEF));
  cfg.theme = { c: t.c, bg: t.bg, f: t.f, r: t.r, dark: t.dark }; cfg.hdr = t.hdr;
  d.sections.forEach(s => { if (s.type == "hero") s.fx = t.fx; if (s.type == "promo") s.bg = t.c; });
  cfg.sections = d.sections; sel = null; ZB.re();
};
ZB.logo = f => {
  if (!f) return; const r = new FileReader();
  r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 256 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = im.width * k; c.height = im.height * k; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); cfg.logo = c.toDataURL("image/png"); ZB.re(); }; im.src = r.result; };
  r.readAsDataURL(f);
};
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
