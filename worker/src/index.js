/**
 * Everything Available Here — MVP backend (Cloudflare Worker, free tier)
 *
 * What it does:
 * - Accepts order requests from the storefront
 * - Stores orders in KV (if bound) or returns a durable receipt payload
 * - Sends owner notification via ntfy (free) if NTFY_TOPIC/secret configured
 * - Returns fulfillment instructions:
 *    - affiliate: customer completes purchase on official partner/retailer link (you earn commission)
 *    - manual/cod: you confirm and fulfill via supplier manually
 *
 * What it intentionally does NOT do:
 * - Take payments from the store owner's card
 * - Bot/auto-purchase from retail sites that forbid automation
 * - Collect raw card data (use a PCI-compliant gateway for prepaid)
 */

const json = (data, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders }
  });

function corsHeaders(env, request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGIN || "*").split(",").map(s => s.trim()).filter(Boolean);
  const allowOrigin = allowed.includes("*") ? "*" : (allowed.includes(origin) ? origin : allowed[0] || "*");
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function uid() {
  return "EAH-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomUUID().slice(0, 8).toUpperCase();
}

function money(n, currency = "INR") {
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(n)||0); }
  catch { return `${currency} ${Number(n)||0}`; }
}

function cleanStr(v, max = 300) { return String(v ?? "").trim().slice(0, max); }
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isPincode(v) { return /^[0-9]{6}$/.test(v); }
function isPhone(v) { return /^[0-9+\-\s]{8,15}$/.test(v); }

function normalizeItem(i = {}) {
  const sellPrice = Number(i.sellPrice ?? i.price ?? 0);
  const supplierCost = Number(i.supplierCost ?? 0);
  const shipping = Number(i.shipping ?? 0);
  const qty = Math.max(1, Math.min(10, Number(i.qty || 1)));
  const supplier = i.supplier && typeof i.supplier === "object" ? i.supplier : {};
  return {
    id: cleanStr(i.id, 80),
    name: cleanStr(i.name, 160),
    qty,
    sellPrice,
    supplierCost,
    shipping,
    supplier: {
      name: cleanStr(supplier.name || "Unassigned", 120),
      type: cleanStr(supplier.type || "manual", 40).toLowerCase(), // affiliate | cj | printify | spocket | manual
      sku: cleanStr(supplier.sku || "", 120),
      productUrl: cleanStr(supplier.productUrl || i.affiliateUrl || i.url || "", 1000),
      autoFulfill: Boolean(supplier.autoFulfill)
    }
  };
}

function validateOrder(body) {
  const errors = [];
  const customer = body?.customer && typeof body.customer === "object" ? body.customer : {};
  const itemsIn = Array.isArray(body?.items) ? body.items : [];
  if (!itemsIn.length) errors.push("Cart is empty.");

  const items = itemsIn.map(normalizeItem).filter(i => i.name && i.sellPrice >= 0);
  if (!items.length) errors.push("No valid items.");

  const c = {
    name: cleanStr(customer.name, 120),
    phone: cleanStr(customer.phone, 30),
    email: cleanStr(customer.email, 160).toLowerCase(),
    address: cleanStr(customer.address, 300),
    city: cleanStr(customer.city, 80),
    state: cleanStr(customer.state, 80),
    pincode: cleanStr(customer.pincode, 12),
    note: cleanStr(customer.note, 500)
  };

  if (!c.name) errors.push("Name is required.");
  if (!isPhone(c.phone)) errors.push("Valid phone is required.");
  if (!isEmail(c.email)) errors.push("Valid email is required.");
  if (!c.address) errors.push("Address is required.");
  if (!c.city) errors.push("City is required.");
  if (!c.state) errors.push("State is required.");
  if (!isPincode(c.pincode)) errors.push("Valid 6-digit pincode is required.");

  const paymentMethod = cleanStr(body?.paymentMethod || "cod", 30).toLowerCase();
  const allowedPayments = new Set(["cod", "upi", "prepaid", "affiliate"]);
  if (!allowedPayments.has(paymentMethod)) errors.push("Invalid payment method.");

  const total = items.reduce((n, i) => n + i.sellPrice * i.qty, 0);
  return { errors, orderInput: { customer: c, items, paymentMethod, total, currency: cleanStr(body?.currency || "INR", 8).toUpperCase() } };
}

function fulfillmentPlan(order) {
  // Honest routing: affiliate => customer pays retailer; manual/cod => you fulfill.
  return order.items.map(item => {
    const marginPerUnit = item.sellPrice - item.supplierCost - item.shipping;
    const affiliate = item.supplier.type === "affiliate" && /^https?:\/\//i.test(item.supplier.productUrl);
    return {
      productId: item.id,
      name: item.name,
      qty: item.qty,
      supplier: item.supplier.name,
      supplierType: item.supplier.type,
      mode: affiliate ? "affiliate_redirect" : "manual_fulfillment",
      action: affiliate
        ? "Send customer to official partner link after order capture; commission tracked by partner network."
        : "Confirm order, collect payment (COD/UPI/prepaid gateway), then place supplier order manually or via official supplier API.",
      partnerUrl: affiliate ? item.supplier.productUrl : "",
      marginPerUnit,
      marginTotal: marginPerUnit * item.qty,
      autoFulfill: !affiliate && Boolean(item.supplier.autoFulfill)
    };
  });
}

async function notifyNtfy(env, order) {
  const topic = env.NTFY_TOPIC || "";
  if (!topic) return { sent: false, reason: "NTFY_TOPIC not configured" };
  const url = topic.startsWith("http") ? topic : `https://ntfy.sh/${topic}`;
  const text = [
    `NEW ORDER ${order.id}`,
    `Status: ${order.status}`,
    `Payment: ${order.paymentMethod}`,
    `Total: ${money(order.total, order.currency)}`,
    `Customer: ${order.customer.name} (${order.customer.phone})`,
    `Email: ${order.customer.email}`,
    `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
    `Items: ${order.items.map(i => `${i.qty}x ${i.name} [${i.supplier.name}]`).join("; ")}`,
    `Note: ${order.customer.note || "-"}`
  ].join("\n");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Title": `EAH Order ${order.id}`, "Priority": "high", "Tags": "shopping_cart,moneybag" },
    body: text
  });
  return { sent: res.ok, status: res.status };
}

async function saveOrder(env, order) {
  if (!env.ORDERS_KV) return { saved: false, reason: "ORDERS_KV not bound" };
  await env.ORDERS_KV.put(`order:${order.id}`, JSON.stringify(order), { expirationTtl: 60 * 60 * 24 * 90 });
  // Index for admin list (simple MVP; replace with D1/Postgres later)
  const indexKey = "orders:index";
  const idx = JSON.parse(await env.ORDERS_KV.get(indexKey) || "[]");
  idx.unshift({ id: order.id, createdAt: order.createdAt, status: order.status, total: order.total, currency: order.currency, name: order.customer.name });
  await env.ORDERS_KV.put(indexKey, JSON.stringify(idx.slice(0, 200)), { expirationTtl: 60 * 60 * 24 * 90 });
  return { saved: true };
}

function requireAdmin(request, env) {
  const token = env.ADMIN_TOKEN || "";
  if (!token) return true; // MVP convenience; set ADMIN_TOKEN in production.
  const auth = request.headers.get("Authorization") || "";
  return auth === `Bearer ${token}`;
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env, request);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/api/health") {
        return json({ ok: true, service: "eah-backend", time: new Date().toISOString(), kv: Boolean(env.ORDERS_KV) }, 200, cors);
      }

      if (request.method === "POST" && url.pathname === "/api/orders") {
        const body = await request.json().catch(() => null);
        const { errors, orderInput } = validateOrder(body);
        if (errors.length) return json({ ok: false, errors }, 400, cors);

        const order = {
          id: uid(),
          createdAt: new Date().toISOString(),
          status: orderInput.paymentMethod === "cod" ? "pending_confirmation" : "pending_payment",
          ...orderInput,
          fulfillment: fulfillmentPlan(orderInput),
          source: { origin: request.headers.get("Origin") || "", ua: cleanStr(request.headers.get("User-Agent"), 200) }
        };

        const [saved, notified] = await Promise.all([saveOrder(env, order), notifyNtfy(env, order).catch(e => ({ sent:false, error:String(e) }))]);

        return json({
          ok: true,
          orderId: order.id,
          status: order.status,
          total: order.total,
          currency: order.currency,
          fulfillment: order.fulfillment,
          notification: notified,
          storage: saved,
          message: order.fulfillment.some(f => f.mode === "affiliate_redirect")
            ? "Order captured. For affiliate items, complete purchase via official partner links so commission is attributed."
            : "Order captured. Confirm payment/COD and fulfill via supplier queue."
        }, 201, cors);
      }

      if (request.method === "GET" && url.pathname === "/api/orders") {
        if (!requireAdmin(request, env)) return json({ ok: false, error: "Unauthorized" }, 401, cors);
        if (!env.ORDERS_KV) return json({ ok: false, error: "ORDERS_KV not bound" }, 501, cors);
        const idx = JSON.parse(await env.ORDERS_KV.get("orders:index") || "[]");
        return json({ ok: true, orders: idx }, 200, cors);
      }

      if (request.method === "GET" && url.pathname.startsWith("/api/orders/")) {
        if (!requireAdmin(request, env)) return json({ ok: false, error: "Unauthorized" }, 401, cors);
        if (!env.ORDERS_KV) return json({ ok: false, error: "ORDERS_KV not bound" }, 501, cors);
        const id = url.pathname.split("/").pop() || "";
        const raw = await env.ORDERS_KV.get(`order:${id}`);
        if (!raw) return json({ ok: false, error: "Not found" }, 404, cors);
        return json({ ok: true, order: JSON.parse(raw) }, 200, cors);
      }

      return json({ ok: false, error: "Not found" }, 404, cors);
    } catch (err) {
      return json({ ok: false, error: "Server error", detail: String(err?.message || err) }, 500, cors);
    }
  }
};
