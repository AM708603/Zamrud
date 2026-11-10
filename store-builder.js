/* Zamrud Store Builder v3: storefront renderer (window.ZStore) + editor (window.ZB)
   - No emoji: all icons are inline SVG (incl. the official WhatsApp glyph)
   - Fully customisable theme, layout, animation, product / cart / checkout pages */
(function () {
const API = "https://zamrud.borntow2.workers.dev", DOM = "zamrud.co/";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const J = x => JSON.stringify(x).replace(/</g, "\\u003c");
const clone = x => JSON.parse(JSON.stringify(x));

/* ---------- defaults ---------- */
const SEC = {
  announcement: { type: "announcement", text: "Free delivery across the UAE. Pay cash on delivery.", bg: "" },
  hero: { type: "hero", fx: "fade", h: 480, ov: 35, al: "center", slides: [
    { t: "Welcome to our store", s: "Quality products, delivered fast", b: "Shop now", img: "", bg: "#0d9488", cat: "" },
    { t: "New arrivals", s: "Fresh picks every week", b: "Explore", img: "", bg: "#0f766e", cat: "" },
    { t: "Cash on delivery", s: "Pay when you receive your order", b: "Order now", img: "", bg: "#115e59", cat: "" }] },
  features: { type: "features", title: "", items: [
    { i: "truck", t: "Fast delivery", d: "Across all emirates" },
    { i: "cash", t: "Cash on delivery", d: "Pay when it arrives" },
    { i: "refresh", t: "Easy returns", d: "Simple, no-fuss process" }] },
  cats: { type: "cats", title: "Shop by category" },
  products: { type: "products", title: "Featured products", cat: "", n: 8 },
  promo: { type: "promo", title: "Special offer", text: "Limited-time deals on our best sellers", cat: "", bg: "#0d9488" },
  faq: { type: "faq", title: "Questions and answers", items: [
    { q: "How does cash on delivery work?", a: "Place your order, we call to confirm, and you pay the courier when your parcel arrives." },
    { q: "How long does delivery take?", a: "Most orders arrive within 2 to 4 working days." }] },
  text: { type: "text", title: "About us", body: "Tell your customers your story." },
  testimonials: { type: "testimonials", title: "Loved by our customers", items: [{name:"Happy customer",quote:"Beautiful quality and a smooth shopping experience.",stars:5},{name:"Verified shopper",quote:"Easy to order and delivered with care.",stars:5},{name:"Returning customer",quote:"Great selection and excellent service.",stars:5}] },
  stats: {type:"stats", title:"Why shop with us", items:[{value:"7",label:"Emirates served"},{value:"COD",label:"Pay at your door"},{value:"24/7",label:"Shop online"}]},
  editorial: {type:"editorial", title:"Made for your everyday", body:"Explore carefully selected pieces designed to bring a little more beauty to every day.", button:"Explore collection", image:"", cat:"", reverse:0},
  marquee: {type:"marquee", text:"New arrivals • Carefully curated • Cash on delivery • Fast dispatch", bg:"#111827"}
};
const mk = (t, id) => Object.assign(clone(SEC[t]), { id });
const DEF = {
  slug: "", name: "My Store", logo: "", cur: "AED", dir: "ltr",
  wa: "", waShow: 1, waPos: "right", waMsg: "Hello, I have a question about", email: "", phone: "", ig: "", fb: "", tt: "",
  footer: "Quality products delivered across the UAE. Cash on delivery.", hdr: "left", sticky: 1,
  trust: "Cash on delivery\nFast delivery across the UAE\nEasy returns", related: 1, quick: 1,
  ckNote: "We will call you to confirm your order before dispatch.", cartNote: "Delivery is free. You pay cash when you receive your order.",
  theme: { c: "#0d9488", bg: "#ffffff", f: "Inter", hf: "", r: 12, dark: 0, btn: "solid", card: "border", cols: 4, ratio: "1/1",
    hover: "lift", anim: 1, width: 1180, ft: "dark" },
  wishlist: 1, search: 1, scrollTop: 1,
  sections: [mk("announcement", "s1"), mk("hero", "s2"), mk("features", "s3"), mk("cats", "s4"), mk("products", "s5"), mk("promo", "s6"), mk("text", "s7")]
};
const sl = (t, s2, b, bg) => ({ t, s: s2, b, img: "", bg, cat: "" });
const FEAT = (a, b2, c) => ({ type: "features", title: "", items: [{ i: "truck", t: a[0], d: a[1] }, { i: "cash", t: b2[0], d: b2[1] }, { i: "refresh", t: c[0], d: c[1] }] });
const FAQ = (t) => ({ type: "faq", title: t, items: [
  { q: "How does cash on delivery work?", a: "Place your order, we call to confirm, and you pay the courier when your parcel arrives." },
  { q: "How long does delivery take?", a: "Most orders arrive within 2 to 4 working days across the UAE." },
  { q: "Can I return an item?", a: "Yes. Contact us on WhatsApp within 7 days and we will arrange a return or exchange." }] });
/* Each template is a complete store: theme + header + ordered sections. Name, logo and contact details are never touched. */
const TPL = {
  emerald: { label: "Emerald", desc: "Clean and bright, all-round", hdr: "left",
    theme: { c: "#0d9488", bg: "#ffffff", f: "Inter", hf: "", r: 12, dark: 0, btn: "solid", card: "border", cols: 4, ratio: "1/1", hover: "lift", anim: 1, width: 1180, ft: "dark" },
    sections: [
      { type: "announcement", text: "Free delivery across the UAE. Pay cash on delivery.", bg: "" },
      { type: "hero", fx: "fade", h: 480, ov: 35, al: "center", slides: [sl("Everything you need, delivered", "Quality products at honest prices", "Shop now", "#0d9488"), sl("New arrivals every week", "Be the first to see what is new", "Explore", "#0f766e"), sl("Pay when it arrives", "Cash on delivery across all emirates", "Order now", "#115e59")] },
      FEAT(["Fast delivery", "Across all emirates"], ["Cash on delivery", "Pay when it arrives"], ["Easy returns", "Simple, no-fuss process"]),
      { type: "cats", title: "Shop by category" },
      { type: "products", title: "Featured products", cat: "", n: 8 },
      { type: "promo", title: "Special offer", text: "Limited-time deals on our best sellers", cat: "", bg: "#0d9488" },
      FAQ("Questions and answers")] },
  midnight: { label: "Midnight", desc: "Dark, bold, high contrast", hdr: "left",
    theme: { c: "#f97316", bg: "#0f172a", f: "Poppins", hf: "", r: 8, dark: 1, btn: "solid", card: "shadow", cols: 4, ratio: "4/5", hover: "zoom", anim: 2, width: 1240, ft: "dark" },
    sections: [
      { type: "announcement", text: "Free delivery on every order. Cash on delivery.", bg: "#f97316" },
      { type: "hero", fx: "slide", h: 540, ov: 45, al: "left", slides: [sl("Built to stand out", "Gear and gadgets that make a statement", "Shop the drop", "#1e293b"), sl("New drops every week", "Limited stock, move fast", "See what is new", "#7c2d12"), sl("Order now, pay later", "Cash on delivery, no card needed", "Start shopping", "#0b1220")] },
      { type: "products", title: "Trending now", cat: "", n: 8 },
      { type: "cats", title: "Browse categories" },
      FEAT(["Express delivery", "Dubai to Fujairah"], ["Pay on delivery", "No online payment"], ["7-day returns", "Message us on WhatsApp"]),
      { type: "promo", title: "Weekend sale", text: "Extra savings on selected products", cat: "", bg: "#ea580c" },
      FAQ("Good to know")] },
  linen: { label: "Linen", desc: "Warm, editorial, serif headings", hdr: "center",
    theme: { c: "#92400e", bg: "#faf7f2", f: "Inter", hf: "Playfair Display", r: 2, dark: 0, btn: "outline", card: "flat", cols: 3, ratio: "3/4", hover: "zoom", anim: 1, width: 1180, ft: "light" },
    sections: [
      { type: "announcement", text: "Complimentary delivery across the UAE", bg: "#78350f" },
      { type: "hero", fx: "zoom", h: 520, ov: 30, al: "center", slides: [sl("Considered pieces for everyday living", "Thoughtfully chosen, beautifully simple", "Discover the collection", "#e7dccb"), sl("The new season edit", "Fresh arrivals, now in store", "View the edit", "#d9c9b0")] },
      { type: "cats", title: "Collections" },
      { type: "products", title: "The edit", cat: "", n: 6 },
      { type: "text", title: "Our story", body: "We started with a simple idea: fewer, better things. Every product in our shop is chosen for quality, design and value, then delivered to your door with care.\nTell customers who you are and why you started." },
      FEAT(["Free delivery", "Anywhere in the UAE"], ["Cash on delivery", "Pay at your door"], ["Easy exchanges", "Within 7 days"]),
      FAQ("Good to know")] },
  blush: { label: "Blush", desc: "Soft, rounded, friendly", hdr: "left",
    theme: { c: "#db2777", bg: "#fff7fa", f: "DM Sans", hf: "", r: 20, dark: 0, btn: "pill", card: "shadow", cols: 4, ratio: "1/1", hover: "lift", anim: 1, width: 1180, ft: "brand" },
    sections: [
      { type: "announcement", text: "Free delivery today. Pay cash when it arrives.", bg: "" },
      { type: "hero", fx: "fade", h: 460, ov: 30, al: "center", slides: [sl("Little things, big smiles", "Find something you will love", "Shop favourites", "#db2777"), sl("Fresh in this week", "New arrivals just landed", "See new in", "#be185d"), sl("Gifts she will adore", "Easy, thoughtful and delivered fast", "Find a gift", "#9d174d")] },
      FEAT(["Fast delivery", "Right to your door"], ["Cash on delivery", "No card needed"], ["Easy returns", "No questions asked"]),
      { type: "cats", title: "Shop by category" },
      { type: "products", title: "Customer favourites", cat: "", n: 8 },
      { type: "promo", title: "Treat yourself", text: "Save on selected best sellers this week", cat: "", bg: "#be185d" },
      FAQ("Your questions")] },
  mono: { label: "Mono", desc: "Sharp, minimal, black and white", hdr: "center",
    theme: { c: "#111827", bg: "#ffffff", f: "Manrope", hf: "", r: 0, dark: 0, btn: "solid", card: "flat", cols: 4, ratio: "4/5", hover: "zoom", anim: 1, width: 1280, ft: "dark" },
    sections: [
      { type: "hero", fx: "fade", h: 560, ov: 40, al: "left", slides: [sl("Less, but better", "Essentials chosen with care", "Shop now", "#111827"), sl("The new collection", "Just landed, limited quantities", "View collection", "#1f2937"), sl("Pay on delivery", "Simple, secure, cash at your door", "Order today", "#374151")] },
      { type: "products", title: "Latest", cat: "", n: 8 },
      { type: "promo", title: "Free delivery on every order", text: "Across the UAE, with cash on delivery", cat: "", bg: "#111827" },
      { type: "cats", title: "Categories" },
      FEAT(["Free delivery", "All emirates"], ["Cash on delivery", "Pay at your door"], ["Easy returns", "Within 7 days"]),
      { type: "text", title: "About", body: "A short, honest introduction to your brand goes here." }] }
};

/* Premium editions share the same reliable storefront, checkout, and backend. */
const premium = [
 ["obsidian","Obsidian Gold","Black and champagne luxury","#c9a96e","#101014",1,"Cormorant Garamond","Inter",0,"4/5","center"],
 ["ivory","Ivory Atelier","Quiet luxury boutique","#9b7657","#fcfaf6",0,"Playfair Display","DM Sans",2,"3/4","center"],
 ["sapphire","Royal Sapphire","Deep blue, refined accents","#d8b56a","#101e35",1,"Playfair Display","Manrope",6,"4/5","left"],
 ["rose","Rose Couture","Romantic editorial fashion","#ae687e","#fff7f5",0,"Cormorant Garamond","DM Sans",16,"3/4","center"],
 ["noir","Noir Editorial","Minimal fashion campaign","#e5e0d7","#171717",1,"Montserrat","Inter",0,"4/5","center"],
 ["sage","Sage & Stone","Organic, calm, contemporary","#617b67","#f6f5ed",0,"Playfair Display","Inter",12,"1/1","left"],
 ["terracotta","Terra Studio","Warm Mediterranean lifestyle","#b35d3e","#fff8f1",0,"Cormorant Garamond","DM Sans",14,"3/4","left"],
 ["amethyst","Amethyst","Modern purple prestige","#bfa0ff","#1c1530",1,"Poppins","Manrope",18,"4/5","left"],
 ["pearl","Pearl Maison","Elegant pearl and muted gold","#987b55","#f8f6f1",0,"Cormorant Garamond","Manrope",4,"3/4","center"],
 ["ocean","Ocean Luxe","Coastal premium, serene blue","#156b82","#f2f9fa",0,"Playfair Display","DM Sans",12,"4/5","left"]
];
for (const [key,label,desc,c,bg,dark,hf,f,r,ratio,hdr] of premium) {
  const light = !dark;
  TPL[key] = { label, desc, hdr, theme:{c,bg,dark,hf,f,r,ratio,btn: light ? "outline":"solid",card:"flat",cols:3,hover:"zoom",anim:1,width:1280,ft:dark?"dark":"light"}, sections:[
    {type:"announcement",text:"Thoughtfully selected. Beautifully delivered.",bg:c},
    {type:"hero",fx:"zoom",h:570,ov:35,al:hdr==="center"?"center":"left",slides:[sl("An elevated everyday","Discover pieces with character and purpose","Explore the collection",dark?"#30283a":c),sl("The new season edit","Timeless finds, freshly curated","Shop new arrivals",bg)]},
    {type:"marquee",text:"THE NEW EDIT  •  CURATED WITH CARE  •  DELIVERY ACROSS THE UAE",bg:dark?"#28252c":c},
    {type:"cats",title:"Discover collections"},
    {type:"products",title:"The curated edit",cat:"",n:8},
    {type:"editorial",title:"Considered in every detail",body:"Discover a collection of everyday favorites, handpicked for style, quality and effortless living.",button:"Browse the collection",image:"",cat:"",reverse:0},
    FEAT(["Fast delivery","Across the UAE"],["Cash on delivery","Shop with confidence"],["Friendly support","We're here to help"]),
    {type:"testimonials",title:"Words from our customers",items:clone(SEC.testimonials.items)},
    FAQ("Your questions answered")
  ]};
}

const PAL = ["#0d9488", "#2563eb", "#7c3aed", "#db2777", "#f97316", "#16a34a", "#111827"];
const FONTS = ["Inter", "Poppins", "DM Sans", "Manrope", "Montserrat", "Playfair Display", "Cormorant Garamond", "Lora", "Libre Baskerville", "Outfit", "Cairo", "system-ui"];
const NAMES = { testimonials:"Customer reviews", stats:"Brand statistics", editorial:"Editorial image + text", marquee:"Scrolling message", announcement: "Announcement bar", hero: "Hero slideshow", features: "Feature badges", cats: "Category grid", products: "Product grid", promo: "Promotion banner", faq: "FAQ", text: "Text block" };

const norm = c => {
  c = Object.assign(clone(DEF), c || {});
  c.theme = Object.assign({}, DEF.theme, c.theme);
  const f = (c.sections || []).find(s => s.type === "footer");
  if (f) { c.wa = c.wa || f.wa || ""; c.footer = c.footer || f.text; }
  c.sections = (c.sections || []).filter(s => s.type !== "footer" && SEC[s.type]).map(s => s.type === "hero" && !s.slides
    ? Object.assign(mk("hero", s.id), { slides: [{ t: s.title, s: s.sub, b: s.btn, img: s.img, bg: s.bg }] }) : s);
  return c;
};

/* ---------- storefront runtime (stringified into the store page / preview iframe) ---------- */
function app(C, P, E, slug, API) {
  const D = document, T = C.theme, AN = +T.anim || 0;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tc = h => { h = String(h || "").replace("#", ""); if (h.length == 3) h = h.replace(/./g, "$&$&"); const n = parseInt(h, 16); if (isNaN(n)) return "#fff"; return (((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000) > 150 ? "#111827" : "#fff"; };
  const IC = {
    cart: '<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z"/><path d="M9 12l2.2 2.2L15 10"/>',
    refresh: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
    box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
    left: '<path d="M15 5l-7 7 7 7"/>', right: '<path d="M9 5l7 7-7 7"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>', search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>', star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'
  };
  const ic = (n, s) => `<svg class="ic" width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || IC.check}</svg>`;
  /* official WhatsApp glyph */
  const waI = (s, f) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="${f || "currentColor"}" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

  const cats = [...new Set(P.map(p => p.category).filter(Boolean))], pm = {}; P.forEach(p => pm[p.id] = p);
  const money = n => Number(n).toLocaleString("en", { maximumFractionDigits: 2 }) + " " + (C.cur || "AED");
  let cart = [], tm = [], q = "", so = "new", fc = "", last = "", io = null, rt = "#/", wish = []; try { wish = JSON.parse(localStorage["zw_" + slug] || "[]"); } catch(e) {}
  /* In the editor preview (srcdoc iframe) real #links would load the dashboard, so routing is kept in memory there */
  const cur = () => E ? rt : location.hash, nav = h => { if (E) { rt = h; R(); scrollTo(0, 0); } else location.hash = h; };
  try { cart = JSON.parse(localStorage["zc_" + slug] || "[]"); } catch (e) {}
  cart = cart.filter(i => pm[i.id]);
  const sv = () => { try { localStorage["zc_" + slug] = JSON.stringify(cart); } catch (e) {} };
  const cnt = () => cart.reduce((a, i) => a + i.q, 0), tot = () => cart.reduce((a, i) => a + pm[i.id].sell_price_aed * i.q, 0);
  const wad = String(C.wa || "").replace(/\D/g, ""), cl = c => "#/c/" + encodeURIComponent(c);
  const img = p => p.image_key ? `<img src="${API}/images/${esc(p.image_key)}" alt="${esc(p.name)}" loading="lazy">` : `<div class="ph">${ic("box", 40)}</div>`;
  const card = p => `<div class="c"><div class="imw"><a class="im" href="#/p/${esc(p.id)}">${img(p)}${p.tag ? `<span class="tg">${esc(p.tag)}</span>` : ""}</a>${+C.wishlist ? `<button class="wish" data-wish="${esc(p.id)}" aria-label="Save ${esc(p.name)} to wishlist">${ic("star",17)}</button>` : ""}${+C.quick ? `<button class="qa" data-add="${esc(p.id)}" aria-label="Add ${esc(p.name)} to cart">${ic("plus", 18)}</button>` : ""}</div><a class="cb" href="#/p/${esc(p.id)}"><h3>${esc(p.name)}</h3><b>${money(p.sell_price_aed)}</b></a></div>`;
  const grid = l => `<div class="g">${l.map(card).join("") || '<p class="m">No products yet.</p>'}</div>`;
  const head = (t, more) => `<div class="sh"><h2>${esc(t)}</h2>${more ? `<a class="lk" href="#/shop">View all</a>` : ""}</div>`;

  const S = {
    hero: s => { const o = (s.ov == null ? 35 : s.ov) / 100; return `<div class="hero" style="height:${s.h || 480}px">${s.slides.map((x, i) => { const bg = x.bg || "#0d9488"; return `<div class="sl ${s.fx || "fade"}${s.al == "left" ? " left" : ""}${i ? "" : " on"}" style="background-color:${esc(bg)};color:${x.img ? "#fff" : tc(bg)}${x.img ? `;background-image:linear-gradient(rgba(0,0,0,${o}),rgba(0,0,0,${o})),url('${esc(x.img)}')` : ""}"><div class="hi"><h1>${esc(x.t)}</h1><p>${esc(x.s)}</p>${x.b ? `<a class="b w2" href="${x.cat ? cl(x.cat) : "#/shop"}">${esc(x.b)}</a>` : ""}</div></div>`; }).join("")}${s.slides.length > 1 ? `<button class="ar l" data-ar="-1" aria-label="Previous slide">${ic("left", 22)}</button><button class="ar r" data-ar="1" aria-label="Next slide">${ic("right", 22)}</button><div class="dt">${s.slides.map((_, i) => `<button data-dot="${i}" class="${i ? "" : "on"}" aria-label="Slide ${i + 1}"></button>`).join("")}</div>` : ""}</div>`; },
    features: s => `<div class="w">${s.title ? head(s.title) : ""}<div class="fts">${(s.items || []).map(i => `<div class="fi"><span class="fic">${ic(i.i, 22)}</span><div><b>${esc(i.t)}</b><p class="m">${esc(i.d)}</p></div></div>`).join("")}</div></div>`,
    cats: s => `<div class="w">${head(s.title)}<div class="g">${cats.map(c => { const p = P.find(x => x.category == c); return `<a class="c cc" href="${cl(c)}"><span class="im">${p ? img(p) : `<div class="ph">${ic("box", 40)}</div>`}</span><span class="cb"><h3>${esc(c)}</h3></span></a>`; }).join("") || '<p class="m">Categories appear once you add products.</p>'}</div></div>`,
    products: s => `<div class="w">${head(s.title, 1)}${grid(P.filter(p => !s.cat || p.category == s.cat).slice(0, s.n || 8))}</div>`,
    promo: s => `<div class="w"><a class="pm" style="background:${esc(s.bg)};color:${tc(s.bg)}" href="${s.cat ? cl(s.cat) : "#/shop"}"><div><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></div><span class="b w2">Shop now</span></a></div>`,
    faq: s => `<div class="w nrw">${head(s.title)}${(s.items || []).map(i => `<details class="fq"><summary>${esc(i.q)}</summary><p class="m">${esc(i.a)}</p></details>`).join("")}</div>`,
    testimonials: s => `<div class="w">${head(s.title || "Customer reviews")}<div class="reviews">${(s.items || []).map(x => `<figure class="review"><div class="review-stars" aria-label="${Math.max(0,Math.min(5,+x.stars||5))} out of 5 stars">${"★".repeat(Math.max(0,Math.min(5,+x.stars||5)))}</div><blockquote>${esc(x.quote)}</blockquote><figcaption>${esc(x.name)}</figcaption></figure>`).join("")}</div></div>`,
    stats: s => `<div class="w">${s.title ? head(s.title) : ""}<div class="stats">${(s.items||[]).map(x => `<div><strong>${esc(x.value)}</strong><span>${esc(x.label)}</span></div>`).join("")}</div></div>`,
    marquee: s => `<div class="marquee" style="background:${esc(s.bg||T.c)};color:${tc(s.bg||T.c)}"><div>${Array(4).fill(`<span>${esc(s.text||"")}</span>`).join("")}</div></div>`,
    editorial: s => `<div class="w"><div class="editorial ${+s.reverse ? "reverse" : ""}"><div class="editorial-image">${s.image ? `<img src="${esc(s.image)}" alt="${esc(s.title)}" loading="lazy">` : `<div class="editorial-fallback">${ic("star",52)}</div>`}</div><div class="editorial-copy"><span class="eyebrow">THE COLLECTION</span><h2>${esc(s.title)}</h2><p>${esc(s.body)}</p><a class="b" href="${s.cat ? cl(s.cat) : "#/shop"}">${esc(s.button||"Explore collection")}</a></div></div></div>`,
    text: s => `<div class="w nrw">${head(s.title)}<p class="m body">${esc(s.body).replace(/\n/g, "<br>")}</p></div>`
  };

  const flt = c => { let l = P.filter(p => (!c || p.category == c) && (!q || p.name.toLowerCase().includes(q.toLowerCase()))); if (so == "lo") l = l.slice().sort((a, b) => a.sell_price_aed - b.sell_price_aed); if (so == "hi") l = l.slice().sort((a, b) => b.sell_price_aed - a.sell_price_aed); if (so == "az") l = l.slice().sort((a,b) => a.name.localeCompare(b.name)); return l; };
  const sumLines = () => cart.map(i => { const p = pm[i.id]; return `<div class="sl2"><span class="th">${img(p)}<i>${i.q}</i></span><span>${esc(p.name)}</span><b>${money(p.sell_price_aed * i.q)}</b></div>`; }).join("");
  const summary = (btn, short) => `<aside class="sm"><h3>Order summary</h3>${short ? "" : `<div class="sls">${sumLines()}</div>`}<div class="rw"><span>Subtotal (${cnt()} item${cnt() > 1 ? "s" : ""})</span><b>${money(tot())}</b></div><div class="rw"><span>Delivery</span><b>Free</b></div><div class="rw tt"><span>Total</span><b>${money(tot())}</b></div><p class="m sn">Payment: cash on delivery</p>${btn || ""}</aside>`;

  const V = {
    home: () => C.sections.filter(s => s.type != "announcement").map(s => `<section data-s="${esc(s.id)}">${S[s.type] ? S[s.type](s) : ""}</section>`).join(""),
    shop: c => {
      fc = c || "";
      const pr = c && C.sections.find(s => s.type == "promo" && s.cat == c);
      return `<div class="w">${pr ? `<div class="pm" style="background:${esc(pr.bg)};color:${tc(pr.bg)}"><div><h2>${esc(pr.title)}</h2><p>${esc(pr.text)}</p></div></div>` : ""}${head(c || "All products")}
<div class="tb"><div class="chips"><a class="${c ? "" : "on"}" href="#/shop">All</a>${cats.map(x => `<a class="${x == c ? "on" : ""}" href="${cl(x)}">${esc(x)}</a>`).join("")}</div>
<div class="tr2"><label class="se">${ic("search", 16)}<input data-sq placeholder="Search products" value="${esc(q)}" aria-label="Search products"></label>
<select data-so aria-label="Sort"><option value="new"${so == "new" ? " selected" : ""}>Newest</option><option value="lo"${so == "lo" ? " selected" : ""}>Price: low to high</option><option value="hi"${so == "hi" ? " selected" : ""}>Price: high to low</option><option value="az"${so == "az" ? " selected" : ""}>Name: A to Z</option></select></div></div>
<div id="sg">${grid(flt(c))}</div></div>`;
    },
    p: id => {
      const p = pm[id]; if (!p) return V.shop("");
      const low = p.stock != null && p.stock > 0 && p.stock <= 5, rel = +C.related ? P.filter(x => x.category == p.category && x.id != p.id).slice(0, 4) : [];
      const tr = String(C.trust || "").split("\n").filter(x => x.trim()), ti = ["cash", "truck", "refresh", "shield"];
      const wl = wad && +C.waShow ? `<a class="b o full" target="_blank" rel="noopener" href="https://wa.me/${wad}?text=${encodeURIComponent((C.waMsg || "Hello, I have a question about") + " " + p.name)}">${waI(18)}Ask on WhatsApp</a>` : "";
      return `<div class="w pd"><div class="pgl"><div class="im big">${img(p)}</div></div><div class="pi">
<nav class="bc"><a href="#/">Home</a>${ic("right", 14)}${p.category ? `<a href="${cl(p.category)}">${esc(p.category)}</a>${ic("right", 14)}` : ""}<span>${esc(p.name)}</span></nav>
<h1>${esc(p.name)}</h1><div class="prw"><span class="pr">${money(p.sell_price_aed)}</span>${low ? `<span class="lw">Only ${p.stock} left</span>` : `<span class="ok2">${ic("check", 14)}In stock</span>`}</div>
<div class="ac"><div class="qt lg2"><button data-q="-1" aria-label="Decrease">${ic("minus", 16)}</button><b id="q">1</b><button data-q="1" aria-label="Increase">${ic("plus", 16)}</button></div><button class="b grow" data-add="${esc(p.id)}">Add to cart</button></div>
<button class="b o full" data-buy="${esc(p.id)}">Buy now</button>${wl}
<ul class="trl">${tr.map((x, i) => `<li>${ic(ti[i % 4], 18)}<span>${esc(x)}</span></li>`).join("")}</ul></div></div>
${rel.length ? `<div class="w">${head("You may also like")}${grid(rel)}</div>` : ""}
<div class="sb"><b>${money(p.sell_price_aed)}</b><button class="b" data-add="${esc(p.id)}">Add to cart</button></div>`;
    },
    wishlist: () => `<div class="w">${head("My wishlist")} ${grid(P.filter(p => wish.includes(String(p.id))))}</div>`,
    cart: () => !cart.length ? `<div class="w em"><span class="big-ic">${ic("cart", 34)}</span><h2>Your cart is empty</h2><p class="m">Add something you like and it will show up here.</p><a class="b" href="#/shop">Browse products</a></div>`
      : `<div class="w"><h1 class="pt">Shopping cart</h1><div class="two"><div><div class="cc2"><div class="ch"><span>Product</span><span>Quantity</span><span class="te">Total</span></div>${cart.map(i => { const p = pm[i.id]; return `<div class="cr"><div class="cp"><a class="th" href="#/p/${esc(p.id)}">${img(p)}</a><div class="cn"><a href="#/p/${esc(p.id)}"><b>${esc(p.name)}</b></a><span class="m">${money(p.sell_price_aed)}</span><button class="rm2" data-rm="${esc(i.id)}">Remove</button></div></div><div class="qt sm2"><button data-ci="${esc(i.id)}" data-dd="-1" aria-label="Decrease">${ic("minus", 14)}</button><b>${i.q}</b><button data-ci="${esc(i.id)}" data-dd="1" aria-label="Increase">${ic("plus", 14)}</button></div><b class="te">${money(p.sell_price_aed * i.q)}</b></div>`; }).join("")}</div><p class="m sn">${esc(C.cartNote)}</p><a class="lk bk" href="#/shop">${ic("left", 14)}Continue shopping</a></div>
${summary('<a class="b full" href="#/checkout">Continue to checkout</a>', 1)}</div></div>`,
    checkout: () => !cart.length ? V.cart() : `<div class="w"><h1 class="pt">Checkout</h1><div class="two"><form id="cf" class="fm"><div class="fs"><h3>Contact</h3><div class="f2"><div class="fd"><label for="n">Full name</label><input id="n" name="n" autocomplete="name" required></div>
<div class="fd"><label for="p">Phone number</label><input id="p" name="p" type="tel" inputmode="tel" placeholder="+971 50 123 4567" autocomplete="tel" required></div></div></div>
<div class="fs"><h3>Delivery address</h3><div class="fd"><label for="c">Emirate</label><select id="c" name="c" required><option value="">Select emirate</option>${["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah", "Al Ain"].map(x => `<option>${x}</option>`).join("")}</select></div>
<div class="fd"><label for="a">Address</label><input id="a" name="a" autocomplete="street-address" placeholder="Building, street, area" required></div></div>
<div class="fs"><h3>Payment</h3><div class="pay"><span class="fic">${ic("cash", 20)}</span><div><b>Cash on delivery</b><p class="m">${esc(C.ckNote)}</p></div></div></div>
<p id="er" class="er" role="alert"></p><button class="b full" id="pl">Place order</button><a class="lk bk" href="#/cart">${ic("left", 14)}Back to cart</a></form>${summary()}</div></div>`,
    done: () => `<div class="w em"><span class="big-ic ok">${ic("check", 34)}</span><h2>Order received</h2><p class="m">Thank you. Your order number is <b>${esc(last)}</b>.<br>We will call you shortly to confirm it.</p><a class="b" href="#/">Continue shopping</a></div>`
  };

  const go = (h, n) => { const sl = [...h.querySelectorAll(".sl")], dt = [...h.querySelectorAll(".dt button")]; const i = sl.findIndex(x => x.classList.contains("on")); sl[i].classList.remove("on"); dt[i] && dt[i].classList.remove("on"); n = (n + sl.length) % sl.length; sl[n].classList.add("on"); dt[n] && dt[n].classList.add("on"); };
  const step = (h, d) => go(h, [...h.querySelectorAll(".sl")].findIndex(x => x.classList.contains("on")) + d);
  const uc = () => { const i = D.querySelector(".ct i"); if (!i) return; i.textContent = cnt(); i.classList.toggle("z", !cnt()); i.classList.remove("pop"); void i.offsetWidth; i.classList.add("pop"); };
  const toast = m => { D.querySelectorAll(".ts").forEach(x => x.remove()); const t = D.createElement("div"); t.className = "ts"; t.innerHTML = ic("check", 16) + `<span>${esc(m)}</span><a href="#/cart">View cart</a>`; D.body.appendChild(t); setTimeout(() => t.remove(), 2600); };

  function R() {
    tm.forEach(clearInterval); tm = []; if (io) io.disconnect();
    const [, k, a] = (cur().slice(1) || "/").split("/"), key = k || "home";
    const v = key == "c" ? V.shop(decodeURIComponent(a || "")) : key == "p" ? V.p(a || "") : key == "shop" ? V.shop("") : (V[key] ? V[key]() : V.home());
    D.body.className = key == "p" ? "pdp" : "";
    const links = cats.map(c => `<a href="${cl(c)}">${esc(c)}</a>`).join(""), soc = [["ig", "Instagram"], ["fb", "Facebook"], ["tt", "TikTok"]].filter(x => C[x[0]]).map(x => `<a href="${esc(C[x[0]])}" target="_blank" rel="noopener">${x[1]}</a>`).join("");
    D.getElementById("app").innerHTML =
      C.sections.filter(s => s.type == "announcement").map(s => `<section data-s="${esc(s.id)}"><div class="an" style="${s.bg ? `background:${esc(s.bg)};color:${tc(s.bg)}` : ""}">${esc(s.text)}</div></section>`).join("") +
      `<header class="hd ${esc(C.hdr)}${+C.sticky ? " st" : ""}"><div class="hi2"><a href="#/" class="br">${C.logo ? `<img src="${esc(C.logo)}" class="lg" alt="">` : ""}<span>${esc(C.name)}</span></a><nav>${cats.slice(0, 6).map(c => `<a href="${cl(c)}">${esc(c)}</a>`).join("")}<a href="#/shop">All products</a></nav>${+C.wishlist ? `<a href="#/wishlist" class="wish-link" aria-label="Wishlist">${ic("star",21)}<span>Wishlist</span></a>` : ""}<a href="#/cart" class="ct" aria-label="Cart">${ic("cart", 22)}<i class="${cnt() ? "" : "z"}">${cnt()}</i></a></div></header>` +
      `<main class="pg">${v}</main><footer><div class="fc"><div class="fg"><div><b>${esc(C.name)}</b><p>${esc(C.footer)}</p></div><div><b>Shop</b>${links || '<a href="#/shop">All products</a>'}</div><div><b>Contact</b>${wad ? `<a href="https://wa.me/${wad}" target="_blank" rel="noopener" class="fw">${waI(16)}WhatsApp</a>` : ""}${C.phone ? `<a href="tel:${esc(C.phone)}">${esc(C.phone)}</a>` : ""}${C.email ? `<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>` : ""}${soc}</div></div><small>&copy; ${new Date().getFullYear()} ${esc(C.name)}. Cash on delivery across the UAE.</small></div></footer>` +
      (wad && +C.waShow ? `<a class="wa ${C.waPos == "left" ? "wl" : ""}" href="https://wa.me/${wad}?text=${encodeURIComponent(C.waMsg || "Hello")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${waI(32, "#fff")}</a>` : "");
    D.querySelectorAll("[data-wish]").forEach(b => { const saved=wish.includes(String(b.dataset.wish)); b.classList.toggle("saved",saved);b.setAttribute("aria-pressed",String(saved)); });
    D.querySelectorAll(".hero").forEach(h => { if (h.querySelectorAll(".sl").length > 1) tm.push(setInterval(() => step(h, 1), 5500)); });
    if (AN && "IntersectionObserver" in window) {
      io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
      D.querySelectorAll(AN > 1 ? "main .sh,main .c,main .fi,main .fq,main .pm,main .pi,main .pgl,main .sm,main .fm" : "main .w > .sh,main .w > .g,main .pm,main .pi,main .pgl,main .fts,main .sm,main .fm").forEach((el, i) => { el.classList.add("rv"); if (AN > 1) el.style.transitionDelay = (i % 6) * 70 + "ms"; io.observe(el); });
    }
  }
  const keyFromHash = () => (cur().split("/")[1] || "home");
  D.onclick = e => {
    const t = e.target; let x;
    const s = t.closest("[data-s]"); if (E && s) parent.postMessage({ zbSel: s.dataset.s }, "*");
    const an = t.closest("a[href^='#']"); if (an) { e.preventDefault(); nav(an.getAttribute("href")); return; }
    const g = a => t.closest("[" + a + "]");
    if (x = g("data-wish")) { const id=String(x.dataset.wish); wish = wish.includes(id) ? wish.filter(y=>y!==id) : wish.concat(id); try { localStorage["zw_"+slug]=JSON.stringify(wish); } catch(e) {} x.classList.toggle("saved",wish.includes(id)); x.setAttribute("aria-pressed",String(wish.includes(id))); if (keyFromHash()==="wishlist") R(); }
    else if (x = g("data-q")) { const el = D.getElementById("q"); el.textContent = Math.max(1, +el.textContent + +x.dataset.q); }
    else if (x = g("data-add") || g("data-buy")) {
      const id = x.dataset.add || x.dataset.buy, el = D.getElementById("q"), n = x.closest(".c") || !el ? 1 : +el.textContent || 1, i = cart.find(y => y.id == id);
      i ? i.q += n : cart.push({ id, q: n }); sv();
      if (x.dataset.buy) nav("#/checkout"); else { uc(); toast(pm[id].name + " added"); }
    }
    else if (x = g("data-ci")) { const i = cart.find(y => y.id == x.dataset.ci); i.q += +x.dataset.dd; if (i.q < 1) cart = cart.filter(y => y != i); sv(); R(); }
    else if (x = g("data-rm")) { cart = cart.filter(y => y.id != x.dataset.rm); sv(); R(); }
    else if (x = g("data-dot")) go(x.closest(".hero"), +x.dataset.dot);
    else if (x = g("data-ar")) step(x.closest(".hero"), +x.dataset.ar);
  };
  D.oninput = e => { if (e.target.dataset.sq != null) { q = e.target.value; D.getElementById("sg").innerHTML = grid(flt(fc)); } };
  D.onchange = e => { if (e.target.dataset.so != null) { so = e.target.value; D.getElementById("sg").innerHTML = grid(flt(fc)); } };
  D.onsubmit = e => {
    e.preventDefault(); const f = e.target, er = D.getElementById("er"), b = D.getElementById("pl"); er.textContent = "";
    if (E) { er.textContent = "Preview only. Orders are disabled here."; return; }
    b.disabled = true; b.textContent = "Placing order";
    fetch(API + "/public/store/" + slug + "/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cart.map(i => ({ product_id: i.id, quantity: i.q })), customer_name: f.n.value, customer_phone: f.p.value, customer_city: f.c.value, customer_address: f.a.value }) })
      .then(r => r.json().then(d => { if (!r.ok) throw Error(d.error || "Something went wrong. Please try again."); return d; }))
      .then(d => { cart = []; sv(); last = d.order_number; nav("#/done"); })
      .catch(x => { er.textContent = x.message; b.disabled = false; b.textContent = "Place order"; });
  };
  window.addEventListener("message", e => { if (e.data && e.data.go) nav(e.data.go); });
  window.addEventListener("hashchange", () => { R(); scrollTo(0, 0); });
  R();
}

function css(t) {
  const dk = +t.dark, cols = Math.min(5, Math.max(2, +t.cols || 4)), W = +t.width || 1180, r = +t.r || 0, out = t.btn == "outline";
  const tc = h => { h = String(h || "").replace("#", ""); if (h.length == 3) h = h.replace(/./g, "$&$&"); const n = parseInt(h, 16); if (isNaN(n)) return "#fff"; return (((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000) > 150 ? "#111827" : "#fff"; };
  const F = { dark: ["#0f172a", "#e2e8f0", "#94a3b8"], light: [dk ? "#1e293b" : "#f1f5f9", "var(--t)", "var(--mu)"], brand: [t.c, tc(t.c), tc(t.c)] }[t.ft] || ["#0f172a", "#e2e8f0", "#94a3b8"];
  const cardCss = t.card == "shadow" ? ".c{background:var(--cd);box-shadow:0 2px 16px rgba(15,23,42,.1);padding:10px}"
    : t.card == "flat" ? ".c{padding:0}.cb{padding:10px 2px}" : ".c{background:var(--cd);border:1px solid var(--bd);padding:10px}";
  const hov = t.hover == "lift" ? ".c:hover{transform:translateY(-4px)}" : t.hover == "zoom" ? ".c:hover .im img{transform:scale(1.07)}" : "";
  const hf = t.hf || t.f, an = +t.anim || 0;
  return `:root{--c:${esc(t.c)};--on:${tc(t.c)};--bg:${esc(t.bg)};--t:${dk ? "#f1f5f9" : "#1e293b"};--cd:${dk ? "#1e293b" : "#fff"};--bd:${dk ? "#334155" : "#e2e8f0"};--mu:${dk ? "#94a3b8" : "#64748b"};--sf:${dk ? "#273449" : "#f1f5f9"};--r:${r}px;--br:${t.btn == "pill" ? "999px" : r + "px"};--ar:${esc(t.ratio || "1/1")};--hf:'${esc(hf)}',system-ui,sans-serif;--ft:${F[0]};--fx:${F[1]};--fm:${F[2]}}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:'${esc(t.f)}',system-ui,sans-serif;background:var(--bg);color:var(--t);line-height:1.5;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}h1,h2,h3{font-family:var(--hf);margin-top:0;line-height:1.2}button,input,select{font-family:inherit}.ic{flex-shrink:0;vertical-align:middle}.m{color:var(--mu)}
:focus-visible{outline:2px solid var(--c);outline-offset:2px}
.hd{background:var(--cd);border-bottom:1px solid var(--bd)}.hd.st{position:sticky;top:0;z-index:20}.hi2{max-width:${W}px;margin:auto;padding:14px 20px;display:flex;align-items:center;gap:28px;flex-wrap:wrap;position:relative}.hd nav{display:flex;gap:24px;flex:1;overflow-x:auto;font-size:14px;font-weight:600;white-space:nowrap;scrollbar-width:none}.hd nav a{color:var(--mu);transition:color .2s}.hd nav a:hover{color:var(--t)}.hd.center .hi2{flex-direction:column;gap:10px}.hd.center nav{flex:none}.hd.center .ct{position:absolute;inset-inline-end:20px;top:50%;margin-top:-17px}.ct{margin-inline-start:auto}
.br{display:flex;align-items:center;gap:10px;font-family:var(--hf);font-weight:800;font-size:20px}.lg{height:36px;width:auto;border-radius:6px}.ct{position:relative;display:flex;padding:6px;border-radius:50%}.ct i{position:absolute;top:-2px;inset-inline-end:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--c);color:var(--on);font:700 11px/18px sans-serif;text-align:center}.ct i.z{display:none}.ct i.pop{animation:pop .4s}
.an{background:var(--c);color:var(--on);text-align:center;padding:9px 16px;font-size:13px;font-weight:500}
.hero{position:relative;overflow:hidden}.sl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;background-size:cover;background-position:center;opacity:0;transition:opacity .9s,transform 1.2s;pointer-events:none}.sl.on{opacity:1;pointer-events:auto;transform:none}.sl.slide{transform:translateX(6%)}.sl.zoom{transform:scale(1.1)}.hi{max-width:720px;padding:24px}.hi h1{font-size:clamp(30px,5vw,56px);margin:0 0 12px;letter-spacing:-.02em}.hi p{margin:0 0 26px;font-size:18px;opacity:.92}.sl.left{justify-content:flex-start;text-align:start}.sl.left .hi{margin-inline-start:max(0px,calc((100% - ${W}px)/2))}${an ? ".sl.on .hi{animation:up .8s .15s both}" : ""}
.ar{position:absolute;top:50%;margin-top:-20px;background:rgba(0,0,0,.35);color:#fff;border:0;width:40px;height:40px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;transition:background .2s}.ar:hover{background:rgba(0,0,0,.6)}.ar.l{left:14px}.ar.r{right:14px}.dt{position:absolute;bottom:14px;left:0;right:0;display:flex;justify-content:center;gap:6px;z-index:2}.dt button{width:8px;height:8px;border-radius:5px;border:0;padding:0;cursor:pointer;background:rgba(255,255,255,.5);transition:all .3s}.dt button.on{background:#fff;width:24px}
.w{max-width:${W}px;margin:auto;padding:44px 20px}.nrw{max-width:760px}.sh{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:20px}.sh h2{font-size:clamp(22px,3vw,30px);margin:0;letter-spacing:-.01em}.lk{font-size:14px;font-weight:600;color:var(--c)}.lk:hover{text-decoration:underline}.body{font-size:16px;max-width:65ch}
.g{display:grid;gap:18px;grid-template-columns:repeat(${cols},1fr)}@media(max-width:900px){.g{grid-template-columns:repeat(${Math.min(cols, 3)},1fr)}}@media(max-width:600px){.g{grid-template-columns:repeat(2,1fr);gap:12px}}
.c{position:relative;display:block;border-radius:var(--r);transition:transform .25s,box-shadow .25s}${cardCss}${hov}
.im{position:relative;display:block;overflow:hidden;aspect-ratio:var(--ar);background:var(--sf);border-radius:max(0px,calc(var(--r) - 2px))}.im img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}.ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--mu);opacity:.6}
.cb{display:block;padding:10px 4px 2px}.cb h3{font-size:14px;font-weight:600;margin:0 0 4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cb b{font-size:15px;color:var(--c)}.cc .im{aspect-ratio:4/3}.cc .cb{text-align:center}.cc .cb h3{font-size:16px;margin:0}
.tg{position:absolute;top:10px;inset-inline-start:10px;background:var(--c);color:var(--on);font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px}
.imw{position:relative}.qa{position:absolute;inset-inline-end:10px;bottom:10px;width:36px;height:36px;border-radius:50%;border:0;background:var(--c);color:var(--on);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.2);opacity:0;transform:translateY(6px);transition:all .2s;z-index:2}.c:hover .qa,.qa:focus-visible{opacity:1;transform:none}@media(hover:none){.qa{opacity:1;transform:none}}
.b{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:${out ? "transparent" : "var(--c)"};color:${out ? "var(--c)" : "var(--on)"};border:2px solid var(--c);padding:12px 24px;border-radius:var(--br);font-weight:600;font-size:14px;cursor:pointer;transition:transform .15s,filter .2s,background .2s}.b:hover{filter:brightness(1.08)}.b:active{transform:scale(.97)}.b:disabled{opacity:.6;cursor:wait}.b.o{background:transparent;color:var(--c)}.b.w2{background:#fff;color:#111;border-color:#fff}.b.full{width:100%}.b.grow{flex:1}
.pm{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:32px;border-radius:var(--r);flex-wrap:wrap;margin-bottom:8px}.pm h2{margin:0 0 6px;font-size:28px}.pm p{margin:0;opacity:.92}
.fts{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.fi{display:flex;gap:14px;align-items:center;padding:16px;border:1px solid var(--bd);border-radius:var(--r);background:var(--cd)}.fi b{font-size:15px}.fi p{margin:2px 0 0;font-size:13px}.fic{width:44px;height:44px;border-radius:50%;background:var(--sf);color:var(--c);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.fq{border-bottom:1px solid var(--bd);padding:16px 0}.fq summary{font-weight:600;cursor:pointer;list-style:none;display:flex;justify-content:space-between}.fq summary::after{content:"+";font-size:20px;color:var(--c);line-height:1}.fq[open] summary::after{content:"\\2212"}.fq p{margin:10px 0 0}
.tb{display:flex;gap:14px;justify-content:space-between;flex-wrap:wrap;margin-bottom:20px}.chips{display:flex;gap:8px;flex-wrap:wrap}.chips a{padding:7px 16px;border:1px solid var(--bd);border-radius:999px;font-size:13px;font-weight:600;background:var(--cd);transition:all .2s}.chips a:hover{border-color:var(--c)}.chips a.on{background:var(--c);color:var(--on);border-color:var(--c)}.tr2{display:flex;gap:10px;flex-wrap:wrap}.se{display:flex;align-items:center;gap:8px;padding:0 12px;border:1px solid var(--bd);border-radius:var(--br);background:var(--cd);color:var(--mu)}.se input{border:0;outline:0;background:transparent;color:var(--t);padding:10px 0;width:170px;font-size:14px}.se:focus-within{border-color:var(--c)}
.pd{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:56px;align-items:start;padding-top:36px}.pgl{position:sticky;top:90px}.im.big{--ar:${esc(t.ratio || "1/1")};border-radius:var(--r)}.bc{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--mu);margin-bottom:14px;flex-wrap:wrap}.bc a:hover{color:var(--c)}.bc span{color:var(--t)}.pi h1{font-size:clamp(26px,3.5vw,38px);margin-bottom:10px;letter-spacing:-.01em}.prw{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-bottom:22px;border-bottom:1px solid var(--bd)}.pr{font-size:30px;font-weight:800;color:var(--c);line-height:1}.lw,.ok2{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:5px 10px;border-radius:999px}.lw{background:#fef3c7;color:#92400e}.ok2{background:#dcfce7;color:#166534}.ac{display:flex;gap:12px;margin:24px 0 12px;align-items:stretch}.ac .b{min-height:48px}.pi .b.full{margin-bottom:10px}
.qt{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--bd);border-radius:var(--br);background:var(--cd)}.qt.lg2{min-height:48px}.qt button{width:40px;height:100%;min-height:40px;border:0;background:transparent;color:var(--t);cursor:pointer;display:flex;align-items:center;justify-content:center}.qt b{min-width:28px;text-align:center}.qt.sm2 button{width:30px;height:32px}
.trl{list-style:none;margin:24px 0 0;padding:18px 20px;background:var(--cd);border:1px solid var(--bd);border-radius:var(--r);display:grid;gap:14px}.trl li{display:flex;align-items:center;gap:12px;font-size:14px}.trl .ic{color:var(--c)}
.sb{display:none}
.pt{font-size:clamp(26px,3vw,34px);margin:0 0 26px;letter-spacing:-.01em}.two{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:32px;align-items:start}
.cc2{background:var(--cd);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden}.ch,.cr{display:grid;grid-template-columns:minmax(0,1fr) 120px 120px;gap:16px;align-items:center;padding:18px 22px}.ch{font-size:12px;font-weight:600;color:var(--mu);background:var(--sf);padding-top:12px;padding-bottom:12px}.cr+.cr{border-top:1px solid var(--bd)}.te{text-align:end}.cr .qt{justify-self:center}.cp{display:flex;align-items:center;gap:16px;min-width:0}.cn{display:grid;gap:4px;justify-items:start;min-width:0}.cn b{font-size:15px}.rm2{border:0;background:none;padding:0;color:var(--mu);font-size:13px;cursor:pointer;text-decoration:underline}.rm2:hover{color:#dc2626}
.th{position:relative;width:84px;height:84px;flex-shrink:0;border-radius:max(0px,calc(var(--r) - 2px));overflow:hidden;background:var(--sf);display:block}.th img{width:100%;height:100%;object-fit:cover;display:block}.th .ph svg{width:26px;height:26px}.th i{position:absolute;top:0;inset-inline-end:0;background:var(--t);color:var(--bg);font:700 11px/18px sans-serif;min-width:18px;text-align:center;border-radius:0 0 0 6px}.qt.sm2 button{width:32px;min-height:34px}.sn{font-size:13px;margin:16px 0 8px}.bk{display:inline-flex;align-items:center;gap:6px}
.sm{background:var(--cd);border:1px solid var(--bd);border-radius:var(--r);padding:24px;position:sticky;top:96px}.sm h3{font-size:18px;margin-bottom:16px}.sls{border-bottom:1px solid var(--bd);margin-bottom:10px;padding-bottom:8px}.sl2{display:flex;align-items:center;gap:14px;padding:8px 0;font-size:14px}.sl2 .th{width:52px;height:52px}.sl2 span:nth-child(2){flex:1;min-width:0}.rw{display:flex;justify-content:space-between;gap:12px;padding:8px 0;font-size:14px}.rw.tt{border-top:1px solid var(--bd);margin-top:8px;padding-top:16px;font-size:18px;font-weight:700}.sm .sn{margin:10px 0 0}.sm .b{margin-top:18px}
.fm{display:grid;gap:26px;background:var(--cd);border:1px solid var(--bd);border-radius:var(--r);padding:28px}.fs{display:grid;gap:14px}.fs h3{margin:0;font-size:16px;padding-bottom:10px;border-bottom:1px solid var(--bd)}.f2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.fd{display:grid;gap:6px;min-width:0}.fd label{font-size:13px;font-weight:600}input,select{padding:13px 14px;border:1px solid var(--bd);border-radius:max(0px,calc(var(--r) - 2px));background:var(--bg);color:var(--t);font-size:15px;width:100%;min-height:48px}input:focus,select:focus{outline:2px solid var(--c);outline-offset:-1px;border-color:var(--c)}.pay{display:flex;gap:14px;align-items:center;padding:16px;border:1.5px solid var(--c);border-radius:var(--r);background:var(--sf)}.pay p{margin:2px 0 0;font-size:13px}.er{color:#dc2626;font-size:13px;margin:-10px 0 0}.fm .bk{justify-self:center;margin-top:-10px}
.em{text-align:center;padding:90px 20px;display:grid;justify-items:center;gap:10px}.em h2{margin:0}.em p{margin:0 0 12px}.big-ic{width:72px;height:72px;border-radius:50%;background:var(--sf);color:var(--c);display:flex;align-items:center;justify-content:center}.big-ic.ok{background:var(--c);color:var(--on)}
footer{background:var(--ft);color:var(--fx);padding:48px 0 22px;margin-top:40px;font-size:14px}.fc{max-width:${W}px;margin:auto;padding:0 20px}.fg{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:40px}.fg p{color:var(--fm);max-width:38ch}.fg a{display:flex;align-items:center;gap:8px;margin-top:8px;color:var(--fm);transition:color .2s}.fg a:hover{color:var(--fx)}.fg b{display:block;color:var(--fx);font-family:var(--hf);font-size:15px}footer small{display:block;text-align:center;margin-top:32px;padding-top:18px;border-top:1px solid rgba(148,163,184,.25);color:var(--fm)}.fw svg{color:#25D366}
.wa{position:fixed;inset-inline-end:20px;bottom:20px;width:58px;height:58px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.28);z-index:30;transition:transform .2s}.wa.wl{inset-inline-end:auto;inset-inline-start:20px}.wa:hover{transform:scale(1.08)}${an ? ".wa{animation:pop .6s 1.2s both}" : ""}
.ts{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--t);color:var(--bg);padding:12px 18px;border-radius:var(--br);display:flex;align-items:center;gap:10px;font-size:14px;z-index:40;box-shadow:0 8px 24px rgba(0,0,0,.25);animation:up .3s both}.ts a{font-weight:700;text-decoration:underline;margin-inline-start:6px}
${an ? ".pg{animation:fi .45s both}.rv{opacity:0;transform:translateY(18px);transition:opacity .6s,transform .6s}.rv.in{opacity:1;transform:none}" : ""}
@keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes pop{50%{transform:scale(1.25)}}
@media(max-width:800px){.pd,.two{grid-template-columns:1fr;gap:24px}.pd{padding-top:16px}.pgl,.sm{position:static}.fg{grid-template-columns:1fr 1fr;gap:28px}.fg>div:first-child{grid-column:1/-1}.hi2{padding:12px 16px;gap:10px 16px}.hd nav{order:3;width:100%;flex:none;gap:20px}.hd.center .hi2{flex-direction:row;flex-wrap:wrap}.hd.center .ct{position:static;margin-top:0;margin-inline-start:auto}.hd.center .br{flex:1}.fc{padding:0 16px}.w{padding:32px 16px}.hero .ar{display:none}.ch{display:none}.cr{grid-template-columns:1fr auto;grid-template-areas:"p p" "q t";gap:12px 16px;padding:16px}.cp{grid-area:p}.cr .qt{grid-area:q;justify-self:start}.cr .te{grid-area:t}.f2{grid-template-columns:1fr}.fm{padding:20px}.th{width:72px;height:72px}
.pdp .sb{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:25;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;background:var(--cd);border-top:1px solid var(--bd)}.pdp .sb b{font-size:17px}.pdp .wa{bottom:80px}.pdp footer{padding-bottom:80px}.ts{bottom:80px}}

.reviews{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.review{margin:0;padding:32px;background:var(--cd);border:1px solid var(--bd);border-radius:var(--r)}.review-stars{letter-spacing:3px;color:var(--c);margin-bottom:12px}.review blockquote{font-family:var(--hf);font-size:19px;line-height:1.55;margin:0 0 20px}.review figcaption{font-size:13px;font-weight:700;color:var(--mu)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:18px;text-align:center}.stats>div{padding:26px 12px;border-block:1px solid var(--bd);display:grid;gap:5px}.stats strong{font:700 clamp(26px,3vw,40px)/1.2 var(--hf);color:var(--c)}.stats span{font-size:13px;color:var(--mu)}
.editorial{display:grid;grid-template-columns:1fr 1fr;min-height:440px;background:var(--cd);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden}.editorial.reverse .editorial-image{order:2}.editorial-image img{width:100%;height:100%;object-fit:cover;display:block}.editorial-fallback{height:100%;min-height:380px;display:grid;place-items:center;background:var(--sf);color:var(--c)}.editorial-copy{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:clamp(28px,5vw,70px)}.editorial-copy .eyebrow{font-size:11px;letter-spacing:.2em;color:var(--c);font-weight:800}.editorial-copy h2{font-size:clamp(30px,4vw,54px);margin:16px 0}.editorial-copy p{color:var(--mu);line-height:1.8;margin:0 0 26px}.marquee{overflow:hidden;padding:15px 0;font-weight:700;font-size:12px;letter-spacing:.15em}.marquee>div{display:flex;width:max-content;gap:55px;animation:marquee-scroll 34s linear infinite}.marquee span{white-space:nowrap}@keyframes marquee-scroll{to{transform:translateX(-50%)}}
.wish{position:absolute;top:10px;right:10px;z-index:4;width:34px;height:34px;border:1px solid var(--bd);background:var(--cd);color:var(--mu);border-radius:50%;display:grid;place-items:center;cursor:pointer}.wish.saved{background:var(--c);color:var(--on);border-color:var(--c)}.wish-link{display:flex;gap:6px;align-items:center;font-size:12px;font-weight:700}.wish-link svg{color:var(--c)}
@media(max-width:700px){.reviews{grid-template-columns:1fr}.editorial{grid-template-columns:1fr}.editorial.reverse .editorial-image{order:0}.editorial-image{max-height:360px}.editorial-copy{padding:28px}.wish-link span{display:none}}

@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.rv{opacity:1!important;transform:none!important}html{scroll-behavior:auto}}`;
}

function render(cfg, prods, edit, slug) {
  const C = norm(cfg), t = C.theme;
  const fam = [...new Set([t.f, t.hf].filter(f => f && f !== "system-ui"))];
  const font = fam.length ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?${fam.map(f => "family=" + encodeURIComponent(f).replace(/%20/g, "+") + ":wght@400;500;600;700;800").join("&")}&display=swap" rel="stylesheet">` : "";
  return `<!DOCTYPE html><html lang="${C.dir == "rtl" ? "ar" : "en"}" dir="${C.dir == "rtl" ? "rtl" : "ltr"}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="${esc(t.c)}"><title>${esc(C.name)}</title>${C.logo ? `<link rel="icon" href="${esc(C.logo)}">` : ""}${font}<style>${css(t)}</style></head><body><div id="app"></div><script>(${app.toString()})(${J(C)},${J(prods)},${!!edit},${J(slug || "")},${J(API)})<\/script></body></html>`;
}
const applyTpl = (c, n) => {
  const t = TPL[n], stamp = Date.now();
  c.theme = Object.assign({}, DEF.theme, t.theme); c.hdr = t.hdr; c.sticky = 1; c.quick = 1; c.related = 1;
  c.sections = t.sections.map((x, i) => Object.assign(clone(SEC[x.type]), clone(x), { id: "t" + stamp + i }));
  return c;
};
window.ZStore = { render, API, templates: Object.keys(TPL), fromTemplate: n => applyTpl(norm({}), n) };

/* ---------- editor ---------- */
const ZB = window.ZB = {};
let cfg, sel = null, prods = [], tm, ready = false;
const OPEN = {};
const $ = id => document.getElementById(id);
const slugify = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
const msg = (t, ok) => { const m = $("zb-msg"); if (m) { m.textContent = t; m.className = "text-xs mt-2 " + (ok ? "text-green-600" : "text-red-600"); } };
const prev = () => { clearTimeout(tm); tm = setTimeout(() => { const f = $("zb-frame"); if (f) f.srcdoc = render(cfg, prods, true, cfg.slug); try { localStorage.zb_draft = JSON.stringify(cfg); } catch (e) {} }, 200); };
const idx = () => cfg.sections.findIndex(s => s.id === sel);
const cats = () => [...new Set(prods.map(p => p.category).filter(Boolean))];
const L = (l, h) => `<label class="block text-xs font-medium text-slate-500 mb-3">${l}${h}</label>`;
const IN = (l, v, fn, t) => L(l, `<input type="${t || "text"}" value="${esc(v)}" oninput="${fn}" class="w-full mt-1 px-3 py-2 text-sm border rounded-xl ${t == "color" ? "h-10 p-1" : ""}"/>`);
const SEL = (l, v, o, fn) => L(l, `<select onchange="${fn}" class="w-full mt-1 px-3 py-2 text-sm border rounded-xl">${o.map(x => `<option value="${esc(x[0])}" ${x[0] == v ? "selected" : ""}>${esc(x[1])}</option>`).join("")}</select>`);
const CK = (l, v, fn) => `<label class="flex items-center justify-between text-xs font-medium text-slate-500 mb-3">${l}<input type="checkbox" ${+v ? "checked" : ""} onchange="${fn}"/></label>`;
const RG = (l, v, a, b, fn) => L(l, `<input type="range" min="${a}" max="${b}" value="${v}" oninput="${fn}" class="w-full mt-1"/>`);
const TA = (l, v, fn, r) => L(l, `<textarea rows="${r || 3}" oninput="${fn}" class="w-full mt-1 px-3 py-2 text-sm border rounded-xl">${esc(v)}</textarea>`);
const AC = (t, b, o) => `<details ${(t in OPEN ? OPEN[t] : o) ? "open" : ""} ontoggle="ZB.tg('${t}',this.open)" class="border-b"><summary class="px-4 py-3 text-sm font-bold cursor-pointer">${t}</summary><div class="px-4 pb-4">${b}</div></details>`;
const CATOPT = () => [["", "All products"]].concat(cats().map(c => [c, c]));
ZB.tg = (t, o) => { OPEN[t] = o; };

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
<a id="zb-view" target="_blank" class="text-xs text-brand-600 font-semibold hidden">View live</a><div class="flex-1"></div>
<select onchange="ZB.go(this.value)" class="text-xs border rounded-xl px-2 py-2"><option value="#/">Home</option><option value="#/shop">All products</option>${p1}<option value="#/wishlist">Wishlist</option><option value="#/cart">Cart</option><option value="#/checkout">Checkout</option><option value="#/done">Order confirmation</option></select>
<button onclick="ZB.dev('d')" title="Desktop" class="px-3 py-2 border rounded-xl text-sm"><i class="fas fa-desktop"></i></button><button onclick="ZB.dev('m')" title="Mobile" class="px-3 py-2 border rounded-xl text-sm"><i class="fas fa-mobile-alt"></i></button>
<button onclick="ZB.save(0)" class="px-3 py-2 text-xs font-bold border rounded-xl">Save draft</button><button onclick="ZB.save(1)" class="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl">Publish</button></div>
<div class="flex flex-col lg:flex-row gap-3" style="min-height:560px;height:calc(100vh - 190px)">
<div id="zb-panel" class="lg:w-80 flex-shrink-0 bg-white border rounded-2xl overflow-y-auto max-h-[60vh] lg:max-h-none"></div>
<div class="flex-1 bg-slate-200 rounded-2xl p-3 flex justify-center min-h-[400px]"><iframe id="zb-frame" class="bg-white rounded-xl h-full shadow" style="width:100%;max-width:1280px;transition:max-width .3s"></iframe></div></div><p id="zb-msg" class="text-xs mt-2"></p>`;
  panel(); prev();
}

function items(k, fields, s) {
  return (s[k] || []).map((x, n) => `<div class="border rounded-xl p-2 mb-2"><div class="flex justify-between text-xs font-bold mb-1"><span>Item ${n + 1}</span><button onclick="ZB.itd('${k}',${n})" class="text-red-500">Remove</button></div>${fields.map(f => f[2] == "icon"
    ? SEL("Icon", x[f[0]], [["truck", "Delivery"], ["cash", "Cash"], ["shield", "Secure"], ["refresh", "Returns"], ["check", "Tick"], ["star", "Star"]], `ZB.it('${k}',${n},'${f[0]}',this.value)`)
    : IN(f[1], x[f[0]], `ZB.it('${k}',${n},'${f[0]}',this.value)`)).join("")}</div>`).join("") + `<button onclick="ZB.ita('${k}')" class="w-full py-2 text-xs font-bold border rounded-xl text-brand-700">Add item</button>`;
}

function panel() {
  const p = $("zb-panel"), i = idx(), th = cfg.theme, T = (k, v) => `ZB.th('${k}',${v})`;
  if (i < 0) {
    sel = null;
    p.innerHTML =
      AC("Templates", `<p class="text-[11px] text-slate-400 mb-3">Pick a ready-made store. Your logo, name and contact details stay as they are.</p><div class="grid grid-cols-2 gap-2">${Object.keys(TPL).map(n => { const t = TPL[n], h = t.sections.find(x => x.type == "hero"), hb = h ? h.slides[0].bg : t.theme.c, dk = +t.theme.dark, cd = dk ? "#1e293b" : "#fff"; return `<button onclick="ZB.tpl('${n}')" class="text-left border rounded-xl overflow-hidden hover:border-slate-400 transition"><div style="background:${t.theme.bg};padding:8px"><div style="display:flex;justify-content:${t.hdr == "center" ? "center" : "space-between"};align-items:center;margin-bottom:6px"><i style="width:26px;height:5px;background:${dk ? "#f1f5f9" : "#1e293b"};border-radius:3px"></i></div><div style="height:38px;background:${hb};border-radius:${Math.min(t.theme.r, 8)}px"></div><div style="display:flex;gap:4px;margin-top:6px">${[1, 2, 3].map(() => `<i style="flex:1;height:22px;background:${cd};border:1px solid ${dk ? "#334155" : "#e2e8f0"};border-radius:${Math.min(t.theme.r, 6)}px"></i>`).join("")}</div><div style="height:7px;width:46%;background:${t.theme.c};border-radius:${t.theme.btn == "pill" ? 9 : Math.min(t.theme.r, 4)}px;margin-top:7px"></div></div><div class="p-2"><b class="text-xs">${t.label}</b><p class="text-[10px] text-slate-400 leading-tight">${t.desc}</p></div></button>`; }).join("")}</div>`, 1) +
      AC("Branding", IN("Store name", cfg.name, "ZB.g('name',this.value)") + L("Logo (also the browser tab icon)", `<input type="file" accept="image/*" onchange="ZB.logo(this.files[0])" class="block text-xs mt-1"/>`) + (cfg.logo ? `<img src="${cfg.logo}" class="h-10 my-2"/><button onclick="ZB.g('logo','');ZB.re()" class="text-xs text-red-500">Remove logo</button>` : "") + SEL("Currency label", cfg.cur, [["AED", "AED"], ["SAR", "SAR"], ["USD", "USD"]], "ZB.g('cur',this.value)") + SEL("Text direction", cfg.dir, [["ltr", "Left to right"], ["rtl", "Right to left (Arabic)"]], "ZB.g('dir',this.value)"), 1) +
      AC("Contact", IN("WhatsApp number with country code", cfg.wa, "ZB.g('wa',this.value)") + IN("Email", cfg.email, "ZB.g('email',this.value)") + IN("Phone", cfg.phone, "ZB.g('phone',this.value)"), 1) +
      AC("Colors", `<div class="flex gap-1.5 mb-3">${PAL.map(c => `<button onclick="ZB.th('c','${c}');ZB.re()" class="w-7 h-7 rounded-full border-2 border-white shadow" style="background:${c}"></button>`).join("")}</div>` +
        IN("Brand color", th.c, T("c", "this.value"), "color") + IN("Page background", th.bg, T("bg", "this.value"), "color") + CK("Dark mode", th.dark, T("dark", "this.checked?1:0")) +
        SEL("Footer style", th.ft, [["dark", "Dark"], ["light", "Light"], ["brand", "Brand color"]], T("ft", "this.value"))) +
      AC("Typography", SEL("Body font", th.f, FONTS.map(f => [f, f]), T("f", "this.value")) + SEL("Heading font", th.hf || "", [["", "Same as body"]].concat(FONTS.map(f => [f, f])), T("hf", "this.value"))) +
      AC("Style", SEL("Buttons", th.btn, [["solid", "Solid"], ["outline", "Outline"], ["pill", "Pill"]], T("btn", "this.value")) + RG("Corner roundness", th.r, 0, 24, T("r", "this.value")) +
        SEL("Content width", th.width, [[1000, "Narrow"], [1180, "Standard"], [1360, "Wide"]], T("width", "+this.value"))) +
      AC("Products and cards", SEL("Card style", th.card, [["border", "Outlined"], ["shadow", "Shadow"], ["flat", "Flat"]], T("card", "this.value")) + SEL("Products per row", th.cols, [[2, "2"], [3, "3"], [4, "4"], [5, "5"]], T("cols", "+this.value")) +
        SEL("Image shape", th.ratio, [["1/1", "Square"], ["4/5", "Portrait"], ["3/4", "Tall portrait"], ["4/3", "Landscape"]], T("ratio", "this.value")) + SEL("Hover effect", th.hover, [["lift", "Lift card"], ["zoom", "Zoom image"], ["none", "None"]], T("hover", "this.value")) + CK("Quick add button on cards", cfg.quick, "ZB.g('quick',this.checked?1:0)")) +
      AC("Animations", SEL("Page animation", th.anim, [[0, "Off"], [1, "Subtle"], [2, "Lively (staggered)"]], T("anim", "+this.value")) + `<p class="text-[11px] text-slate-400">Includes fade-in on scroll, page transitions, hero text, cart badge and toast. Respects the visitor's reduce-motion setting.</p>`) +
      AC("Header", SEL("Layout", cfg.hdr, [["left", "Logo left, menu beside"], ["center", "Centered"]], "ZB.g('hdr',this.value)") + CK("Sticky header", cfg.sticky, "ZB.g('sticky',this.checked?1:0)")) +
      AC("Shopping features", CK("Enable wishlist / saved products",cfg.wishlist,"ZB.g('wishlist',this.checked?1:0)") + CK("Show wishlist page link",cfg.wishlist,"ZB.g('wishlist',this.checked?1:0)") + `<p class="text-[11px] text-slate-400">Wishlists are saved on the visitor's device. No backend changes required.</p>`) +
      AC("Product page", CK("Show related products", cfg.related, "ZB.g('related',this.checked?1:0)") + TA("Trust points (one per line)", cfg.trust, "ZB.g('trust',this.value)", 4)) +
      AC("Cart and checkout", TA("Cart note", cfg.cartNote, "ZB.g('cartNote',this.value)") + TA("Checkout note", cfg.ckNote, "ZB.g('ckNote',this.value)")) +
      AC("WhatsApp", CK("Show floating WhatsApp button", cfg.waShow, "ZB.g('waShow',this.checked?1:0)") + SEL("Button position", cfg.waPos, [["right", "Bottom right"], ["left", "Bottom left"]], "ZB.g('waPos',this.value)") + IN("Pre-filled message", cfg.waMsg, "ZB.g('waMsg',this.value)")) +
      AC("Footer and social", IN("Instagram link", cfg.ig, "ZB.g('ig',this.value)") + IN("Facebook link", cfg.fb, "ZB.g('fb',this.value)") + IN("TikTok link", cfg.tt, "ZB.g('tt',this.value)") + TA("Footer text", cfg.footer, "ZB.g('footer',this.value)")) +
      AC("Sections", `<div class="space-y-1.5">${cfg.sections.map((s, n) => `<div class="flex items-center gap-1 border rounded-xl px-2 py-1.5 text-sm hover:bg-slate-50"><button class="flex-1 text-left font-medium" onclick="ZB.sel('${s.id}')">${NAMES[s.type]}</button><button onclick="ZB.mv(${n},-1)" class="px-1.5 text-slate-400" title="Move up"><i class="fas fa-arrow-up text-xs"></i></button><button onclick="ZB.mv(${n},1)" class="px-1.5 text-slate-400" title="Move down"><i class="fas fa-arrow-down text-xs"></i></button><button onclick="ZB.del(${n})" class="px-1.5 text-red-400" title="Remove"><i class="fas fa-trash-alt text-xs"></i></button></div>`).join("")}</div>
<select onchange="ZB.add(this.value);this.value=''" class="mt-3 w-full px-3 py-2 text-sm border rounded-xl text-brand-700 font-semibold"><option value="">Add section</option>${Object.keys(NAMES).map(k => `<option value="${k}">${NAMES[k]}</option>`).join("")}</select>`, 1);
    return;
  }
  const s = cfg.sections[i], t = s.type, S = (k, l, ty) => IN(l, s[k], `ZB.set('${k}',this.value)`, ty);
  let b = "";
  if (t == "testimonials") b = S("title","Section title") + items("items",[["name","Customer name"],["quote","Review"],["stars","Stars (1–5)"]],s);
  if (t == "stats") b = S("title","Section title") + items("items",[["value","Big number / value"],["label","Description"]],s);
  if (t == "marquee") b = S("text","Scrolling message") + S("bg","Background","color");
  if (t == "editorial") b = S("title","Heading") + TA("Description",s.body,"ZB.set('body',this.value)") + S("button","Button text") + S("image","Image URL") + SEL("Link to category",s.cat,CATOPT(),"ZB.set('cat',this.value)") + CK("Image on right",s.reverse,"ZB.set('reverse',this.checked?1:0)");
  if (t == "announcement") b = S("text", "Text") + S("bg", "Background (leave as brand color if unsure)", "color");
  if (t == "cats") b = S("title", "Title");
  if (t == "text") b = S("title", "Title") + TA("Text", s.body, "ZB.set('body',this.value)", 5);
  if (t == "features") b = S("title", "Title (optional)") + items("items", [["i", "", "icon"], ["t", "Heading"], ["d", "Description"]], s);
  if (t == "faq") b = S("title", "Title") + items("items", [["q", "Question"], ["a", "Answer"]], s);
  if (t == "products") b = S("title", "Title") + SEL("Category", s.cat, CATOPT(), "ZB.set('cat',this.value)") + RG("How many", s.n || 8, 2, 12, "ZB.set('n',+this.value)");
  if (t == "promo") b = S("title", "Headline") + S("text", "Text") + SEL("Promotes category", s.cat, CATOPT(), "ZB.set('cat',this.value)") + S("bg", "Color", "color") + `<p class="text-[11px] text-slate-400">This banner also shows at the top of its category page.</p>`;
  if (t == "hero") b = SEL("Transition", s.fx, [["fade", "Fade"], ["slide", "Slide in"], ["zoom", "Zoom"]], "ZB.set('fx',this.value)") + SEL("Text alignment", s.al || "center", [["center", "Center"], ["left", "Start"]], "ZB.set('al',this.value)") + RG("Height", s.h || 480, 260, 680, "ZB.set('h',+this.value)") + RG("Image darkness", s.ov == null ? 35 : s.ov, 0, 70, "ZB.set('ov',+this.value)") +
    s.slides.map((x, n) => `<div class="border rounded-xl p-2 mb-2"><div class="flex justify-between text-xs font-bold mb-1"><span>Slide ${n + 1}</span><button onclick="ZB.sld(${n})" class="text-red-500">Remove</button></div>${IN("Heading", x.t, `ZB.sl(${n},'t',this.value)`)}${IN("Subheading", x.s, `ZB.sl(${n},'s',this.value)`)}${IN("Button text", x.b, `ZB.sl(${n},'b',this.value)`)}${SEL("Button opens", x.cat || "", CATOPT(), `ZB.sl(${n},'cat',this.value)`)}${IN("Image URL", x.img, `ZB.sl(${n},'img',this.value)`)}${IN("Background", x.bg || "#0d9488", `ZB.sl(${n},'bg',this.value)`, "color")}</div>`).join("") +
    `<button onclick="ZB.sla()" class="w-full py-2 text-xs font-bold border rounded-xl text-brand-700">Add slide</button>`;
  p.innerHTML = `<div class="p-4 border-b flex items-center gap-2"><button onclick="ZB.sel(null)" class="text-slate-500" title="Back"><i class="fas fa-arrow-left"></i></button><b class="text-sm">${NAMES[t]}</b></div><div class="p-4">${b}</div>`;
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
ZB.it = (k, n, f, v) => { sec()[k][n][f] = v; prev(); };
ZB.ita = k => { const s = sec(); s[k] = s[k] || []; s[k].push(s.type == "faq" ? { q: "New question", a: "Answer" } : s.type == "testimonials" ? {name:"Customer",quote:"Share your customer feedback",stars:5} : s.type == "stats" ? {value:"100+",label:"Happy orders"} : { i: "check", t: "New feature", d: "Short description" }); ZB.re(); };
ZB.itd = (k, n) => { sec()[k].splice(n, 1); ZB.re(); };
ZB.sel = id => { sel = id; panel(); };
ZB.add = t => { if (!t || !SEC[t]) return; const d = mk(t, "s" + Date.now()); cfg.sections.push(d); sel = d.id; ZB.re(); };
ZB.mv = (n, d) => { const m = n + d; if (m < 0 || m >= cfg.sections.length) return; cfg.sections.splice(m, 0, cfg.sections.splice(n, 1)[0]); ZB.re(); };
ZB.del = n => { if (confirm("Remove this section?")) { cfg.sections.splice(n, 1); ZB.re(); } };
ZB.tpl = n => {
  const t = TPL[n];
  if (!confirm("Apply the " + t.label + " template? Your logo, store name and contact details are kept. Styling and sections will be replaced.")) return;
  applyTpl(cfg, n);
  sel = null; ZB.re();
};
ZB.logo = f => {
  if (!f) return; const r = new FileReader();
  r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 256 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = im.width * k; c.height = im.height * k; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); cfg.logo = c.toDataURL("image/png"); ZB.re(); }; im.src = r.result; };
  r.readAsDataURL(f);
};
ZB.save = async function (pub) {
  if (!/^[a-z0-9-]{3,30}$/.test(cfg.slug || "")) return msg("Store address must be 3 to 30 letters, numbers or dashes.", 0);
  msg("Saving", 1);
  try {
    await api("/me/store", { method: "PUT", body: JSON.stringify({ slug: cfg.slug, config: cfg, published: pub ? 1 : 0 }) });
    msg(pub ? "Published. Your store is live." : "Draft saved.", 1);
    if (pub) { const a = $("zb-view"); a.href = "https://" + DOM + cfg.slug; a.classList.remove("hidden"); }
  } catch (e) { msg(e.message, 0); }
};
})();
