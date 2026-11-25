/* ============================================================
   EVERYTHING AVAILABLE HERE — app logic
   Zero dependencies. Edit CONFIG to make it yours.
   ============================================================ */

const CONFIG = {
  siteName: "Everything Available Here",
  contactEmail: "hello@example.com",      // ← change to your real email
  newsletterEndpoint: "",                 // ← paste Beehiiv / Formspree / Buttondown URL here
  showDemoNotice: true,                   // ← set false when links are real
  perPage: 12,
  currency: "USD"
};

const LOCAL_KEY = "eah_custom_products";
const NOTICE_KEY = "eah_demo_dismissed";

const $ = (sel) => document.querySelector(sel);
const state = {
  products: [],
  search: "",
  category: "All",
  sort: "trending",
  visible: CONFIG.perPage
};

/* ---------- helpers ---------- */
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

function safeUrl(u) {
  try {
    const parsed = new URL(u, location.href);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "#";
  } catch { return "#"; }
}

function money(n) {
  const value = Number(n) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: CONFIG.currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(value);
}

function discount(p) {
  if (!p.oldPrice || p.oldPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

function placeholderImage(p) {
  const palettes = [
    ["#ff4d17", "#ff9a5c"], ["#6d28d9", "#a78bfa"], ["#0284c7", "#67e8f9"],
    ["#059669", "#6ee7b7"], ["#e11d48", "#fda4af"], ["#d97706", "#fde68a"],
    ["#4f46e5", "#a5b4fc"], ["#0f766e", "#5eead4"]
  ];
  const sum = [...String(p.id || p.name || "")].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [a, b] = palettes[sum % palettes.length];
  const emoji = String(p.emoji || "🛍️").replace(/[<>&"']/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="500" fill="url(#g)"/><circle cx="470" cy="70" r="130" fill="#fff" opacity=".08"/><circle cx="90" cy="450" r="160" fill="#000" opacity=".06"/><text x="300" y="270" font-size="190" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); }
  catch { return []; }
}

function saveLocal(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
}

/* ---------- data ---------- */
function allProducts() {
  return [...loadLocal(), ...(window.EAH_PRODUCTS || [])];
}

function categories() {
  return ["All", ...new Set(state.products.map((p) => p.category).filter(Boolean))];
}

/* ---------- filtering ---------- */
function filtered() {
  const q = state.search.trim().toLowerCase();
  let list = state.products.filter((p) => {
    const matchCat = state.category === "All" || p.category === state.category;
    const matchQ = !q || [p.name, p.category, p.description, p.emoji]
      .join(" ").toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const byTrend = (a, b) =>
    (["trending", "new", "value", ""].indexOf(a.badge || "") -
     ["trending", "new", "value", ""].indexOf(b.badge || "")) ||
    ((b.reviews || 0) - (a.reviews || 0));

  switch (state.sort) {
    case "newest":    list.sort((a, b) => String(b.added || "").localeCompare(String(a.added || ""))); break;
    case "price-asc": list.sort((a, b) => a.price - b.price); break;
    case "price-desc":list.sort((a, b) => b.price - a.price); break;
    case "rating":    list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    case "discount":  list.sort((a, b) => discount(b) - discount(a)); break;
    default:          list.sort(byTrend);
  }
  return list;
}

/* ---------- rendering ---------- */
function renderChips() {
  $("#categoryChips").innerHTML = categories().map((c) =>
    `<button type="button" class="chip ${c === state.category ? "active" : ""}" data-cat="${esc(c)}">${esc(c === "All" ? "✦ All finds" : c)}</button>`
  ).join("");

  $("#catList").innerHTML = categories().filter((c) => c !== "All")
    .map((c) => `<option value="${esc(c)}"></option>`).join("");
}

function cardHtml(p) {
  const fallback = placeholderImage(p);
  const img = p.image ? esc(p.image) : fallback;
  const pct = discount(p);
  const badgeMap = { trending: "🔥 Trending", new: "⚡ Just added", value: "💸 Best value" };
  const badge = p.badge && badgeMap[p.badge]
    ? `<span class="badge ${esc(p.badge)}">${badgeMap[p.badge]}</span>` : "";
  const off = pct ? `<span class="discount">-${pct}%</span>` : "";
  const stars = p.rating ? "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating)) : "";

  return `<article class="card">
    <div class="card-media">
      <img src="${img}" alt="${esc(p.name)}" loading="lazy"
           data-fallback="${esc(fallback)}"
           onerror="this.onerror=null;this.src=this.dataset.fallback" />
      ${badge}${off}
    </div>
    <div class="card-body">
      <div class="card-cat">${esc(p.category)}</div>
      <h3>${esc(p.name)}</h3>
      ${p.description ? `<p class="card-desc">${esc(p.description)}</p>` : ""}
      ${p.rating ? `<div class="rating"><span class="stars">${stars}</span> ${esc(p.rating)} <span>(${Number(p.reviews || 0).toLocaleString()})</span></div>` : ""}
      <div class="price-row"><span class="price">${money(p.price)}</span>${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ""}</div>
      <a class="deal-btn" href="${esc(safeUrl(p.affiliateUrl))}" target="_blank" rel="sponsored nofollow noopener noreferrer">View deal <span>↗</span></a>
    </div>
  </article>`;
}

function render() {
  const list = filtered();
  const shown = list.slice(0, state.visible);

  $("#productGrid").innerHTML = shown.map(cardHtml).join("");
  $("#emptyState").hidden = list.length !== 0;
  $("#loadMore").hidden = list.length <= state.visible;
  $("#resultBar").innerHTML = `Showing <b>${shown.length}</b> of <b>${list.length}</b> finds${state.category !== "All" ? ` in <b>${esc(state.category)}</b>` : ""}`;

  $("#statProducts").textContent = state.products.length;
  $("#statCats").textContent = categories().length - 1;
  renderChips();
}

/* ---------- events ---------- */
function syncSearchForms(value) {
  $("#catalogSearch").value = value;
  $("#heroSearch").value = value;
}

function bind() {
  $("#catalogSearch").addEventListener("input", (e) => {
    state.search = e.target.value;
    state.visible = CONFIG.perPage;
    $("#heroSearch").value = state.search;
    render();
  });

  $("#heroSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.search = $("#heroSearch").value;
    state.visible = CONFIG.perPage;
    syncSearchForms(state.search);
    render();
    $("#catalog").scrollIntoView({ behavior: "smooth" });
  });

  $("#categoryChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.category = chip.dataset.cat;
    state.visible = CONFIG.perPage;
    render();
  });

  $("#sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  $("#loadMore").addEventListener("click", () => {
    state.visible += CONFIG.perPage;
    render();
  });

  $("#clearFilters").addEventListener("click", () => {
    state.search = ""; state.category = "All"; state.visible = CONFIG.perPage;
    syncSearchForms(""); $("#sortSelect").value = "trending"; state.sort = "trending";
    render();
  });

  // Newsletter — paste your free Beehiiv / Formspree endpoint in CONFIG
  $("#newsletterForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#newsletterEmail").value.trim();
    if (!email) return;
    if (!CONFIG.newsletterEndpoint) {
      window.location.href = `mailto:${CONFIG.contactEmail}?subject=Join%20the%20drop%20list&body=${encodeURIComponent("Please add " + email + " to the drop list.")}`;
      toast("Opening your email app…");
      return;
    }
    try {
      const res = await fetch(CONFIG.newsletterEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("Signup failed");
      $("#newsletterForm").reset();
      toast("You're on the list. Welcome! 🎉");
    } catch {
      toast("Couldn't sign you up right now — try again.");
    }
  });

  // Quick add
  const dialog = $("#quickAddDialog");
  $("#openQuickAdd").addEventListener("click", () => dialog.showModal());
  $("#closeQuickAdd").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  $("#quickAddForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const num = (k) => Number(f.get(k)) || 0;
    const custom = loadLocal();
    custom.unshift({
      id: "local-" + Date.now(),
      name: String(f.get("name")).trim(),
      category: String(f.get("category") || "Other").trim(),
      emoji: String(f.get("emoji") || "🛍️").trim(),
      price: num("price"),
      oldPrice: num("oldPrice"),
      rating: num("rating"),
      reviews: 0,
      badge: String(f.get("badge") || ""),
      image: String(f.get("image") || "").trim(),
      affiliateUrl: String(f.get("affiliateUrl") || "").trim(),
      description: String(f.get("description") || "").trim(),
      added: new Date().toISOString().slice(0, 10)
    });
    saveLocal(custom);
    state.products = allProducts();
    state.category = "All"; state.search = ""; state.visible = CONFIG.perPage;
    syncSearchForms("");
    e.target.reset();
    dialog.close();
    render();
    toast("Find added to your local catalog ✓");
  });

  $("#exportProducts").addEventListener("click", async () => {
    const box = $("#exportBox");
    const items = loadLocal();
    if (!items.length) { toast("Nothing to export yet."); return; }
    box.hidden = false;
    box.value = "Paste these objects into data/products.js:\n\n" +
      items.map((p) => JSON.stringify(p, null, 2)).join(",\n") + ",\n";
    box.select();
    try { await navigator.clipboard.writeText(box.value); toast("Exported JSON copied ✓"); }
    catch { toast("Export ready — select and copy the box below."); }
  });

  $("#clearLocal").addEventListener("click", () => {
    if (!confirm("Remove all locally-added products from this browser?")) return;
    localStorage.removeItem(LOCAL_KEY);
    state.products = allProducts();
    render();
    toast("Local items cleared.");
  });

  // Demo notice
  if (localStorage.getItem(NOTICE_KEY) === "1") $("#demoNotice").hidden = true;
  else if (!CONFIG.showDemoNotice) $("#demoNotice").hidden = true;
  $("#dismissDemo").addEventListener("click", () => {
    $("#demoNotice").hidden = true;
    localStorage.setItem(NOTICE_KEY, "1");
  });
}

/* ---------- init ---------- */
function init() {
  state.products = allProducts();
  $("#year").textContent = new Date().getFullYear();
  $("#footerContact").href = `mailto:${CONFIG.contactEmail}`;
  render();
  bind();
}

document.addEventListener("DOMContentLoaded", init);
