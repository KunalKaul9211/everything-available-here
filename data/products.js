/* ============================================================
   EVERYTHING AVAILABLE HERE — CATALOG DATA
   ------------------------------------------------------------
   These are DEMO/PLACEHOLDER listings so the site looks alive.
   Before going live:
     1. Replace every `affiliateUrl` with YOUR real tracked link.
     2. Replace `price`, `oldPrice` and descriptions with verified
        live details from the seller.
     3. Replace `image` with a real product image URL (or leave
        blank for the auto-generated art).
   Add new objects any time — the site reads this file on load.
   ============================================================ */

window.EAH_PRODUCTS = [
  // ── Tech & Gadgets ──────────────────────────────────────────
  {
    id: "tech-001", name: "Magnetic Wireless Power Bank", category: "Tech & Gadgets",
    emoji: "🔋", price: 39.99, oldPrice: 59.99, rating: 4.7, reviews: 1240,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=magnetic+wireless+power+bank",
    description: "Snap-on 10,000mAh battery that charges without a cable.", added: "2026-11-24"
  },
  {
    id: "tech-002", name: "Portable Mini Blender", category: "Tech & Gadgets",
    emoji: "🥤", price: 28.5, oldPrice: 44.99, rating: 4.5, reviews: 892,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=portable+mini+blender",
    description: "USB-rechargeable smoothie blender that fits in a bag.", added: "2026-11-23"
  },
  {
    id: "tech-003", name: "Foldable LED Desk Lamp", category: "Tech & Gadgets",
    emoji: "💡", price: 24.99, oldPrice: 39.99, rating: 4.6, reviews: 634,
    badge: "new", image: "", affiliateUrl: "https://www.amazon.com/s?k=foldable+led+desk+lamp",
    description: "Dimmable, eye-friendly light with a phone stand base.", added: "2026-11-25"
  },

  // ── Gaming ──────────────────────────────────────────────────
  {
    id: "game-001", name: "RGB Gaming Headset Stand", category: "Gaming",
    emoji: "🎧", price: 19.99, oldPrice: 32.0, rating: 4.4, reviews: 418,
    badge: "value", image: "", affiliateUrl: "https://www.amazon.com/s?k=rgb+gaming+headset+stand",
    description: "Desk organizer with 7-color lighting and a USB hub.", added: "2026-11-22"
  },
  {
    id: "game-002", name: "Hall Effect Gaming Keyboard", category: "Gaming",
    emoji: "⌨️", price: 89.0, oldPrice: 119.0, rating: 4.8, reviews: 1560,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=hall+effect+gaming+keyboard",
    description: "Analog switches with adjustable actuation for FPS play.", added: "2026-11-24"
  },
  {
    id: "game-003", name: "Cooling Phone Clip for Gaming", category: "Gaming",
    emoji: "❄️", price: 22.99, oldPrice: 0, rating: 4.3, reviews: 307,
    badge: "new", image: "", affiliateUrl: "https://www.amazon.com/s?k=phone+cooling+clip+gaming",
    description: "Thermoelectric clip that keeps your phone cool mid-match.", added: "2026-11-25"
  },

  // ── Home & Kitchen ──────────────────────────────────────────
  {
    id: "home-001", name: "Silicone Utensil Rest", category: "Home & Kitchen",
    emoji: "🍳", price: 9.99, oldPrice: 16.99, rating: 4.6, reviews: 2210,
    badge: "value", image: "", affiliateUrl: "https://www.amazon.com/s?k=silicone+utensil+rest",
    description: "Heat-resistant spoon rest that keeps counters clean.", added: "2026-11-20"
  },
  {
    id: "home-002", name: "Vacuum Compression Bags", category: "Home & Kitchen",
    emoji: "🧳", price: 17.99, oldPrice: 29.99, rating: 4.5, reviews: 987,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=vacuum+compression+travel+bags",
    description: "Pump-free travel bags that halve your luggage volume.", added: "2026-11-24"
  },
  {
    id: "home-003", name: "Automaticsoap Dispenser", category: "Home & Kitchen",
    emoji: "🧴", price: 26.0, oldPrice: 38.0, rating: 4.4, reviews: 512,
    badge: "", image: "", affiliateUrl: "https://www.amazon.com/s?k=automatic+soap+dispenser",
    description: "Touchless infrared dispenser for kitchen and bathroom.", added: "2026-11-19"
  },

  // ── Fitness & Health ────────────────────────────────────────
  {
    id: "fit-001", name: "Resistance Band Set", category: "Fitness & Health",
    emoji: "🏋️", price: 21.99, oldPrice: 35.0, rating: 4.7, reviews: 3400,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=resistance+bands+set",
    description: "Five stackable bands for home workouts and mobility.", added: "2026-11-23"
  },
  {
    id: "fit-002", name: "Posture Corrector Brace", category: "Fitness & Health",
    emoji: "🧍", price: 18.5, oldPrice: 29.99, rating: 4.2, reviews: 1180,
    badge: "value", image: "", affiliateUrl: "https://www.amazon.com/s?k=posture+corrector+brace",
    description: "Lightweight adjustable support for desk-day posture.", added: "2026-11-21"
  },
  {
    id: "fit-003", name: "Insulated Water Bottle with Time Marker", category: "Fitness & Health",
    emoji: "💧", price: 15.99, oldPrice: 24.99, rating: 4.6, reviews: 2760,
    badge: "new", image: "", affiliateUrl: "https://www.amazon.com/s?k=insulated+water+bottle+time+marker",
    description: "Leakproof 32oz bottle with hourly hydration markings.", added: "2026-11-25"
  },

  // ── Beauty & Care ───────────────────────────────────────────
  {
    id: "beauty-001", name: "LED Makeup Mirror", category: "Beauty & Care",
    emoji: "🪞", price: 32.99, oldPrice: 49.99, rating: 4.7, reviews: 1450,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=led+makeup+mirror",
    description: "Tri-color dimmable light and 10x magnification spot mirror.", added: "2026-11-24"
  },
  {
    id: "beauty-002", name: "Silicone Scalp Massager", category: "Beauty & Care",
    emoji: "💆", price: 8.99, oldPrice: 14.99, rating: 4.5, reviews: 1920,
    badge: "value", image: "", affiliateUrl: "https://www.amazon.com/s?k=silicone+scalp+massager",
    description: "Soft bristles for a better shampoo routine.", added: "2026-11-18"
  },
  {
    id: "beauty-003", name: "Hair Heat Protectant Spray", category: "Beauty & Care",
    emoji: "💇", price: 13.5, oldPrice: 19.0, rating: 4.4, reviews: 770,
    badge: "", image: "", affiliateUrl: "https://www.amazon.com/s?k=hair+heat+protectant+spray",
    description: "Lightweight mist that shields hair up to 450°F.", added: "2026-11-17"
  },

  // ── Pet Supplies ────────────────────────────────────────────
  {
    id: "pet-001", name: "Slow Feeder Dog Bowl", category: "Pet Supplies",
    emoji: "🐶", price: 12.99, oldPrice: 19.99, rating: 4.6, reviews: 2040,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=slow+feeder+dog+bowl",
    description: "Maze design that slows fast eaters and aids digestion.", added: "2026-11-23"
  },
  {
    id: "pet-002", name: "Interactive Cat Laser Toy", category: "Pet Supplies",
    emoji: "🐱", price: 16.99, oldPrice: 27.0, rating: 4.3, reviews: 860,
    badge: "new", image: "", affiliateUrl: "https://www.amazon.com/s?k=interactive+cat+laser+toy",
    description: "Automatic motion laser that keeps indoor cats busy.", added: "2026-11-25"
  },

  // ── Fashion ─────────────────────────────────────────────────
  {
    id: "fash-001", name: "Crossbody Sling Bag", category: "Fashion",
    emoji: "🎒", price: 27.99, oldPrice: 45.0, rating: 4.5, reviews: 1330,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=crossbody+sling+bag",
    description: "Anti-theft everyday bag with a hidden back pocket.", added: "2026-11-24"
  },
  {
    id: "fash-002", name: "Blue Light Blocking Glasses", category: "Fashion",
    emoji: "👓", price: 14.99, oldPrice: 24.99, rating: 4.2, reviews: 510,
    badge: "value", image: "", affiliateUrl: "https://www.amazon.com/s?k=blue+light+blocking+glasses",
    description: "Lightweight frames for long screen sessions.", added: "2026-11-16"
  },

  // ── Tools & DIY ─────────────────────────────────────────────
  {
    id: "tool-001", name: "Cordless Mini Impact Driver", category: "Tools & DIY",
    emoji: "🔧", price: 59.0, oldPrice: 89.0, rating: 4.7, reviews: 690,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=cordless+mini+impact+driver",
    description: "Compact 12V driver with a bit set and USB charging.", added: "2026-11-22"
  },
  {
    id: "tool-002", name: "Magnetic Wristband", category: "Tools & DIY",
    emoji: "🧲", price: 11.99, oldPrice: 18.99, rating: 4.4, reviews: 1120,
    badge: "value", image: "", affiliateUrl: "https://www.amazon.com/s?k=magnetic+wristband+tools",
    description: "Holds screws and bits right where you need them.", added: "2026-11-15"
  },

  // ── Baby & Kids ─────────────────────────────────────────────
  {
    id: "kids-001", name: "Silicone Baby Feeding Set", category: "Baby & Kids",
    emoji: "🍼", price: 19.99, oldPrice: 31.0, rating: 4.8, reviews: 1640,
    badge: "trending", image: "", affiliateUrl: "https://www.amazon.com/s?k=silicone+baby+feeding+set",
    description: "Bib, bowl and spoon with a strong suction base.", added: "2026-11-24"
  },
  {
    id: "kids-002", name: "Reusable Sticker Activity Book", category: "Baby & Kids",
    emoji: "🧸", price: 9.5, oldPrice: 15.99, rating: 4.6, reviews: 430,
    badge: "new", image: "", affiliateUrl: "https://www.amazon.com/s?k=reusable+sticker+activity+book",
    description: "Peel-and-stick scenes for screen-free quiet time.", added: "2026-11-25"
  },

  // ── Digital Products ────────────────────────────────────────
  {
    id: "digi-001", name: "Notion Life Dashboard Template", category: "Digital Products",
    emoji: "📓", price: 7.0, oldPrice: 19.0, rating: 4.9, reviews: 312,
    badge: "trending", image: "", affiliateUrl: "https://www.etsy.com/search?q=notion+dashboard+template",
    description: "Instant-download setup for tasks, habits and goals.", added: "2026-11-23"
  },
  {
    id: "digi-002", name: "AI Prompt Pack for Creators", category: "Digital Products",
    emoji: "🤖", price: 12.0, oldPrice: 29.0, rating: 4.7, reviews: 188,
    badge: "new", image: "", affiliateUrl: "https://www.etsy.com/search?q=ai+prompt+pack",
    description: "200 ready-to-use prompts for content and marketing.", added: "2026-11-25"
  }
];
