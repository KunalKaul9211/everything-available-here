/* ============================================================
   EVERYTHING AVAILABLE HERE — Dropship MVP
   ------------------------------------------------------------
   What this DOES now:
   - Shows products with your sell price (INR)
   - Cart + checkout form on your site (no redirect)
   - Creates local order records
   - Sends owner notification via webhook (ntfy/Formspree/custom) if configured
   - Builds a supplier-fulfillment payload for backend processing

   What this DOES NOT safely/legit do by itself:
   - Auto-purchase from random retail sites with your card
   - Store payments securely without a payment gateway/backend
   - Guarantee lowest price across every supplier without connectors

   Configure CONFIG before going live.
   ============================================================ */

const CONFIG = {
  siteName: "Everything Available Here",
  contactEmail: "kunalkaul09@gmail.com",
  currency: "INR",
  country: "IN",
  showDemoNotice: true,

  // FREE notification options:
  // 1) ntfy.sh: create a unique topic at https://ntfy.sh and set:
  //    notificationWebhook: "https://ntfy.sh/your-private-topic"
  //    notificationType: "ntfy"
  // 2) Formspree/Make/Zapier/custom endpoint expecting JSON POST:
  //    notificationWebhook: "https://..."
  //    notificationType: "json"
  notificationWebhook: "https://ntfy.sh/eah-orders-kunal-pw12foy6i4j90ax3ev58",
  notificationType: "ntfy", // "ntfy" | "json"

  // Optional backend endpoint (Cloudflare Worker/Supabase Edge Function/etc.)
  // Expected to: validate order, create payment session, route to cheapest verified supplier, fulfill.
  // Example after deploy: "https://eah-backend.<your-subdomain>.workers.dev/api/orders"
  orderApiEndpoint: "",

  perPage: 12
};

const CART_KEY = "eah_cart_v1";
const ORDERS_KEY = "eah_orders_v1";
const NOTICE_KEY = "eah_demo_dismissed_v2";

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const state = { products: [], search: "", category: "All", sort: "trending", visible: CONFIG.perPage, cart: load(CART_KEY, []), orders: load(ORDERS_KEY, []) };

function load(k, fallback) { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback)); } catch { return fallback; } }
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function esc(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }
function money(n) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: CONFIG.currency, maximumFractionDigits: 0 }).format(Number(n) || 0); }
function uid() { return "EAH-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(); }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2800); }

function placeholderImage(p) {
  const palettes = [["#ff4d17","#ff9a5c"],["#6d28d9","#a78bfa"],["#0284c7","#67e8f9"],["#059669","#6ee7b7"],["#e11d48","#fda4af"],["#d97706","#fde68a"]];
  const sum = [...String(p.id || p.name)].reduce((a,c)=>a+c.charCodeAt(0),0);
  const [a,b] = palettes[sum % palettes.length];
  const emoji = String(p.emoji || "🛍️").replace(/[<>&"']/g,"");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="500" fill="url(#g)"/><text x="300" y="270" font-size="170" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function normalize(p) {
  const sellPrice = Number(p.sellPrice ?? p.price ?? 0);
  const mrp = Number(p.mrp ?? p.oldPrice ?? 0);
  const supplierCost = Number(p.supplierCost ?? 0);
  const shipping = Number(p.shipping ?? 0);
  const supplier = { ...(p.supplier || { name: "Unassigned", type: "manual", sku: "", autoFulfill: false }) };
  if (!supplier.productUrl && p.affiliateUrl) supplier.productUrl = p.affiliateUrl;
  return { ...p, sellPrice, mrp, supplierCost, shipping, stock: Number(p.stock ?? 99), supplier };
}

function margin(p) { return p.sellPrice - p.supplierCost - p.shipping; }
function discountPct(p) { return p.mrp > p.sellPrice ? Math.round((1 - p.sellPrice / p.mrp) * 100) : 0; }
function categories() { return ["All", ...new Set(state.products.map(p => p.category).filter(Boolean))]; }

function filtered() {
  const q = state.search.trim().toLowerCase();
  let list = state.products.filter(p => {
    const cat = state.category === "All" || p.category === state.category;
    const mq = !q || [p.name, p.category, p.description, p.supplier?.name].join(" ").toLowerCase().includes(q);
    return cat && mq;
  });
  switch (state.sort) {
    case "newest": list.sort((a,b)=>String(b.added||"").localeCompare(String(a.added||""))); break;
    case "price-asc": list.sort((a,b)=>a.sellPrice-b.sellPrice); break;
    case "price-desc": list.sort((a,b)=>b.sellPrice-a.sellPrice); break;
    case "margin": list.sort((a,b)=>margin(b)-margin(a)); break;
    default: list.sort((a,b)=>((b.badge==="trending")-(a.badge==="trending")) || (b.reviews||0)-(a.reviews||0));
  }
  return list;
}

/* ---------- cart ---------- */
function cartCount() { return state.cart.reduce((n,i)=>n+i.qty,0); }
function cartTotal() { return state.cart.reduce((n,i)=>n + i.qty * i.sellPrice,0); }
function addToCart(id) {
  const p = state.products.find(x=>x.id===id); if(!p) return;
  const line = state.cart.find(x=>x.id===id);
  if (line) line.qty = Math.min(line.qty + 1, 10); else state.cart.push({ id:p.id, name:p.name, sellPrice:p.sellPrice, qty:1, emoji:p.emoji, supplier:p.supplier, supplierCost:p.supplierCost, shipping:p.shipping });
  save(CART_KEY, state.cart); renderCartBadge(); renderCart(); toast("Added to cart ✓");
}
function setQty(id, delta) {
  const line = state.cart.find(x=>x.id===id); if(!line) return;
  line.qty += delta; if (line.qty <= 0) state.cart = state.cart.filter(x=>x.id!==id);
  save(CART_KEY, state.cart); renderCartBadge(); renderCart();
}
function renderCartBadge() { $("#cartCount").textContent = String(cartCount()); }

function renderCart() {
  const wrap = $("#cartItems");
  if (!state.cart.length) { wrap.innerHTML = `<div class="empty-mini">Your cart is empty.</div>`; $("#cartTotal").textContent = money(0); return; }
  wrap.innerHTML = state.cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-main"><span class="cart-emoji">${esc(i.emoji||"🛍️")}</span>
        <div><strong>${esc(i.name)}</strong><small>${esc(i.supplier?.name||"Supplier")} · ${money(i.sellPrice)}</small></div>
      </div>
      <div class="qty"><button type="button" data-qty="${esc(i.id)}" data-d="-1">−</button><span>${i.qty}</span><button type="button" data-qty="${esc(i.id)}" data-d="1">+</button></div>
    </div>`).join("");
  $("#cartTotal").textContent = money(cartTotal());
}

/* ---------- orders / notifications ---------- */
function saveOrder(order) { state.orders.unshift(order); state.orders = state.orders.slice(0, 50); save(ORDERS_KEY, state.orders); renderOrders(); }

function buildSupplierPayload(order) {
  // Backend should replace this with real "lowest verified supplier" routing.
  return order.items.map(i => ({
    orderId: order.id,
    productId: i.id,
    sku: i.supplier?.sku || "",
    supplier: i.supplier?.name || "Unassigned",
    supplierType: i.supplier?.type || "manual",
    autoFulfill: !!i.supplier?.autoFulfill,
    qty: i.qty,
    sellPrice: i.sellPrice,
    supplierCost: i.supplierCost,
    shipping: i.shipping,
    marginPerUnit: i.sellPrice - i.supplierCost - i.shipping,
    shipTo: order.customer
  }));
}

async function notifyOwner(order) {
  const text = [
    `NEW ORDER ${order.id}`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
    `Payment: ${order.paymentMethod}`,
    `Total: ${money(order.total)}`,
    `Items: ${order.items.map(i=>`${i.qty}x ${i.name} [${i.supplier?.name||"?"}]`).join("; ")}`,
    `Note: ${order.customer.note || "-"}`
  ].join("\n");

  const payload = { type: "order.created", order, supplierQueue: buildSupplierPayload(order) };

  if (CONFIG.orderApiEndpoint) {
    const res = await fetch(CONFIG.orderApiEndpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("Order API failed");
    return { mode: "api" };
  }

  if (!CONFIG.notificationWebhook) {
    console.info("ORDER_NOTIFICATION", payload);
    return { mode: "local-only" };
  }

  if (CONFIG.notificationType === "ntfy") {
    const res = await fetch(CONFIG.notificationWebhook, { method:"POST", headers:{ "Title":`New Order ${order.id}`, "Priority":"high", "Tags":"shopping_cart" }, body: text });
    if (!res.ok) throw new Error("ntfy failed");
    return { mode: "ntfy" };
  }

  const res = await fetch(CONFIG.notificationWebhook, { method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"}, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Webhook failed");
  return { mode: "webhook" };
}

/* ---------- render ---------- */
function renderChips() {
  $("#categoryChips").innerHTML = categories().map(c => `<button type="button" class="chip ${c===state.category?"active":""}" data-cat="${esc(c)}">${esc(c==="All"?"✦ All":c)}</button>`).join("");
}

function cardHtml(p) {
  const fallback = placeholderImage(p);
  const img = p.image ? esc(p.image) : fallback;
  const off = discountPct(p);
  const badgeMap = { trending:"🔥 Trending", new:"⚡ New", value:"💸 Best value" };
  const badge = p.badge && badgeMap[p.badge] ? `<span class="badge ${esc(p.badge)}">${badgeMap[p.badge]}</span>` : "";
  const isAffiliate = p.supplier?.type === "affiliate" && /^https?:\/\//i.test(p.supplier?.productUrl || "");
  const m = margin(p);
  const action = isAffiliate
    ? `<a class="deal-btn" href="${esc(p.supplier.productUrl)}" target="_blank" rel="sponsored nofollow noopener noreferrer">Get deal at ${esc(p.supplier.name||"partner")} ↗</a>`
    : `<button class="deal-btn" type="button" data-add="${esc(p.id)}">Add to cart</button>`;
  return `<article class="card">
    <div class="card-media">
      <img src="${img}" alt="${esc(p.name)}" loading="lazy" data-fallback="${esc(fallback)}" onerror="this.onerror=null;this.src=this.dataset.fallback" />
      ${badge}${off?`<span class="discount">-${off}%</span>`:""}
    </div>
    <div class="card-body">
      <div class="card-cat">${esc(p.category)}</div>
      <h3>${esc(p.name)}</h3>
      <p class="card-desc">${esc(p.description||"")}</p>
      <div class="meta-row"><span>${isAffiliate ? "Partner" : "Supplier"}: ${esc(p.supplier?.name||"TBD")}</span><span>${isAffiliate ? "Commission via partner" : `Margin: ${money(m)}`}</span></div>
      <div class="price-row"><span class="price">${money(p.sellPrice)}</span>${p.mrp?`<s>${money(p.mrp)}</s>`:""}</div>
      ${action}
    </div>
  </article>`;
}

function render() {
  const list = filtered();
  const shown = list.slice(0, state.visible);
  $("#productGrid").innerHTML = shown.map(cardHtml).join("");
  $("#emptyState").hidden = list.length !== 0;
  $("#loadMore").hidden = list.length <= state.visible;
  $("#resultBar").innerHTML = `Showing <b>${shown.length}</b> of <b>${list.length}</b> products`;
  $("#statProducts").textContent = state.products.length;
  $("#statCats").textContent = categories().length - 1;
  renderChips();
}

function renderOrders() {
  const el = $("#ordersList");
  if (!state.orders.length) { el.innerHTML = `<div class="empty-mini">No orders yet. Place a test order to verify notifications.</div>`; return; }
  el.innerHTML = state.orders.map(o => `
    <article class="order-card">
      <div class="order-head"><strong>${esc(o.id)}</strong><span class="status ${esc(o.status)}">${esc(o.status)}</span></div>
      <div class="order-meta">${new Date(o.createdAt).toLocaleString()} · ${money(o.total)} · ${esc(o.paymentMethod)}</div>
      <div class="order-meta">${esc(o.customer.name)} · ${esc(o.customer.phone)} · ${esc(o.customer.city)}, ${esc(o.customer.state)} ${esc(o.customer.pincode)}</div>
      <div class="order-items">${o.items.map(i=>`<span>${i.qty}× ${esc(i.name)}</span>`).join("")}</div>
      <div class="order-meta">Fulfillment: ${o.items.map(i=>`${esc(i.supplier?.name||"Manual")} ${i.supplier?.autoFulfill?"(auto)":"(manual/notify)"}`).join(", ")}</div>
    </article>`).join("");
}

/* ---------- events ---------- */
function bind() {
  $("#catalogSearch").addEventListener("input", e => { state.search = e.target.value; $("#heroSearch").value = state.search; state.visible = CONFIG.perPage; render(); });
  $("#heroSearchForm").addEventListener("submit", e => { e.preventDefault(); state.search = $("#heroSearch").value; state.visible = CONFIG.perPage; $("#catalogSearch").value = state.search; render(); $("#catalog").scrollIntoView({behavior:"smooth"}); });
  $("#categoryChips").addEventListener("click", e => { const b=e.target.closest(".chip"); if(!b) return; state.category=b.dataset.cat; state.visible=CONFIG.perPage; render(); });
  $("#sortSelect").addEventListener("change", e => { state.sort = e.target.value; render(); });
  $("#loadMore").addEventListener("click", () => { state.visible += CONFIG.perPage; render(); });
  $("#clearFilters").addEventListener("click", () => { state.search=""; state.category="All"; state.sort="trending"; state.visible=CONFIG.perPage; $("#catalogSearch").value=""; $("#heroSearch").value=""; $("#sortSelect").value="trending"; render(); });

  document.body.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add) addToCart(add.dataset.add);
    const qty = e.target.closest("[data-qty]");
    if (qty) setQty(qty.dataset.qty, Number(qty.dataset.d));
  });

  const cartDialog = $("#cartDialog");
  $("#openCart").addEventListener("click", () => { renderCart(); cartDialog.showModal(); });
  $("#closeCart").addEventListener("click", () => cartDialog.close());
  cartDialog.addEventListener("click", e => { if (e.target === cartDialog) cartDialog.close(); });

  $("#openOrders").addEventListener("click", () => $("#orders").scrollIntoView({behavior:"smooth"}));
  $("#clearOrders").addEventListener("click", () => { if(!confirm("Clear local order history?")) return; state.orders=[]; save(ORDERS_KEY,state.orders); renderOrders(); });

  $("#checkoutForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!state.cart.length) { toast("Cart is empty"); return; }
    const f = new FormData(e.target);
    const customer = {
      name: String(f.get("name")||"").trim(), phone: String(f.get("phone")||"").trim(),
      email: String(f.get("email")||"").trim(), address: String(f.get("address")||"").trim(),
      city: String(f.get("city")||"").trim(), state: String(f.get("state")||"").trim(),
      pincode: String(f.get("pincode")||"").trim(), note: String(f.get("note")||"").trim()
    };
    if (!/^[0-9]{6}$/.test(customer.pincode)) { $("#checkoutMsg").textContent = "Enter a valid 6-digit pincode."; return; }

    const order = {
      id: uid(), createdAt: new Date().toISOString(), status: "pending",
      paymentMethod: String(f.get("paymentMethod")||"cod"), currency: CONFIG.currency,
      total: cartTotal(), customer, items: state.cart.map(i => ({...i}))
    };

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = "Placing order…"; $("#checkoutMsg").textContent = "";
    try {
      const result = await notifyOwner(order);
      order.status = CONFIG.orderApiEndpoint ? "submitted" : "queued";
      saveOrder(order);
      state.cart = []; save(CART_KEY, state.cart); renderCartBadge(); renderCart();
      e.target.reset();
      $("#checkoutMsg").textContent = result.mode === "local-only"
        ? `Order ${order.id} saved locally. Configure CONFIG.notificationWebhook to get notified.`
        : `Order ${order.id} placed. Notification sent (${result.mode}).`;
      toast(`Order placed: ${order.id}`);
    } catch (err) {
      console.error(err);
      $("#checkoutMsg").textContent = "Could not send order notification. Check webhook/API config. Order not cleared.";
      toast("Order failed — check config");
    } finally {
      btn.disabled = false; btn.textContent = "Place order";
    }
  });

  if (localStorage.getItem(NOTICE_KEY) === "1" || !CONFIG.showDemoNotice) $("#demoNotice").style.display = "none";
  $("#dismissDemo").addEventListener("click", () => { $("#demoNotice").style.display = "none"; localStorage.setItem(NOTICE_KEY, "1"); });
}

function init() {
  state.products = (window.EAH_PRODUCTS || []).map(normalize);
  $("#year").textContent = new Date().getFullYear();
  $("#footerContact").href = `mailto:${CONFIG.contactEmail}`;
  render(); renderCartBadge(); renderCart(); renderOrders(); bind();
}

document.addEventListener("DOMContentLoaded", init);
