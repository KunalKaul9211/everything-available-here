# EAH Backend MVP (Cloudflare Worker, Free)

This backend handles **order capture + notifications + fulfillment routing** for Everything Available Here.

## What it supports

- `POST /api/orders` — capture order, store in KV, notify owner via ntfy, return fulfillment plan
- `GET /api/orders` — admin list (Bearer `ADMIN_TOKEN`)
- `GET /api/orders/:id` — admin order detail
- `GET /api/health`

## Honest model

- **Affiliate mode** (`supplier.type: "affiliate"` + `productUrl`): customer completes purchase on official partner/retailer link; you earn commission. This is the legit "partner with retailer / get margin" path.
- **Manual/COD mode**: customer places order request on your site; you confirm and fulfill via supplier manually or official supplier API later.
- **Not included / not safe**: bot auto-purchasing from random retail sites, using owner card automatically, or collecting raw card data on static frontend.

## Free deploy

1. Install Wrangler: `npm i -g wrangler`
2. `cd worker`
3. `wrangler login`
4. Create KV: `wrangler kv namespace create ORDERS_KV` and `wrangler kv namespace create ORDERS_KV --preview`
5. Put IDs into `wrangler.toml`
6. Set secrets:
   - `wrangler secret put ADMIN_TOKEN`
   - `wrangler secret put NTFY_TOPIC` (value: `eah-orders-kunal-pw12foy6i4j90ax3ev58` or your own)
7. Deploy: `wrangler deploy`

Set frontend `CONFIG.orderApiEndpoint` to your deployed worker URL + `/api/orders`.

## Prepaid cards/UPI on-site

For real on-site prepaid payments, integrate **Razorpay/Stripe Checkout** (PCI-compliant). Add webhook verification in backend before marking order paid. COD can be kept as manual confirmation.