# Everything Available Here 🛍️

A free, zero-dependency trending-products storefront. Owner / brand name: **Everything Available Here**.

Pure HTML + CSS + JavaScript. No framework, no build step, no monthly fee, no database.

---

## 1. Preview it right now

**Option A — easiest:** double-click `index.html`.

**Option B — local server** (recommended, from this folder):

```powershell
python -m http.server 8080
```

Then open <http://localhost:8080>.

---

## 2. Go live for $0

### ⭐ Recommended: Cloudflare Pages (fastest, no signup friction for static sites)

1. Push this folder to a GitHub repo (free).
2. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the repo. Build settings:
   - Build command: **leave empty**
   - Build output directory: **`/`** (root)
4. Deploy. You get a free `*.pages.dev` URL instantly.
5. Add your own domain later (free SSL included).

### Alternative: Netlify Drop (no Git needed)

1. Go to <https://app.netlify.com/drop>.
2. Drag the **entire `everything-available-here` folder** onto the page.
3. Instant live URL. `netlify.toml` is already included.

### Alternative: GitHub Pages

1. Push to GitHub → repo **Settings** → **Pages**.
2. Source: **Deploy from a branch** → `main` → `/ (root)` → Save.
3. You get `username.github.io/repo-name`.
4. Add a `CNAME` file with your custom domain if you buy one later.

> `.nojekyll` is included so GitHub Pages serves the `data/` folder correctly.

---

## 3. Make it yours

### Site settings — `app.js`, top of file

```js
const CONFIG = {
  contactEmail: "you@yourdomain.com",   // replace
  newsletterEndpoint: "",               // see below
  showDemoNotice: true,                 // set false when links are real
  perPage: 12,
  currency: "USD"
};
```

### Newsletter (free)

- Create a free list at **Beehiiv** (2,500 subscribers free), **MailerLite** (1,000 free), or **Buttondown**.
- Grab your signup form's POST endpoint and paste it into `newsletterEndpoint`.
- Until then, the form falls back to a `mailto:` so it still works.

### Add products — `data/products.js`

Copy an object, change the fields:

```js
{
  id: "unique-001",
  name: "Product name",
  category: "Tech & Gadgets",
  emoji: "🔋",              // used for auto-generated art
  price: 29.99,
  oldPrice: 39.99,          // 0 or delete if none
  rating: 4.7,
  reviews: 1240,
  badge: "trending",        // trending | new | value | ""
  image: "",                // real image URL, or "" for auto art
  affiliateUrl: "https://your-tracked-link…",
  description: "One-line reason to click.",
  added: "2026-11-25"
}
```

**Owner shortcut:** click **＋ Add** in the site header. Items save in your browser instantly. Hit **Export JSON** and paste the result into `data/products.js` to publish them for everyone.

---

## 4. Get free affiliate links (no paid platform needed)

| Network | Use it for |
|---|---|
| **ClickBank** / **Digistore24** | Digital products, often 40–75% commission |
| **Amazon Associates** | Physical products, easiest approval, lower % |
| **PartnerStack** | SaaS with recurring monthly commission |
| **Impact / Awin / ShareASale** | Real brand offers |
| **TikTok Shop Affiliate** | No website required |

Sign up free → find the product → copy your tracked link → paste into `affiliateUrl`.

---

## 5. Free traffic plan (because links alone do nothing)

1. Post short "best X for Y under $Z" videos on TikTok / Shorts / Reels.
2. Pin one Pinterest board per category — Pinterest is search, not social.
3. Answer real questions on Reddit/Quora *with* the catalog link only when relevant.
4. Send every visitor through the free newsletter form so you own the audience.
5. Use the **Trend radar** section on the site daily to refill the catalog.

---

## ⚠️ Before you go live

- [ ] Replace **every** placeholder `affiliateUrl` in `data/products.js` with your real tracked link.
- [ ] Verify prices / stock / descriptions on the seller's site.
- [ ] Set `showDemoNotice: false` in `app.js`.
- [ ] Set your real `contactEmail`.
- [ ] Keep the **Affiliate disclosure** section — legally required in most countries.
- [ ] Don't invent fake reviews or ratings. The `rating`/`reviews` fields are for demo only until you have real data.

The seed products are illustrative placeholders, not verified live offers.

---

Built with 🧠 and $0.
