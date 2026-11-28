import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const base = 'https://kunalkaul9211.github.io/everything-available-here';
const dataSrc = fs.readFileSync(path.join(root, 'data/products.js'), 'utf8');
const window = {};
eval(dataSrc);
const products = window.EAH_PRODUCTS;
const categories = [...new Set(products.map(p => p.category))];
const slug = s => s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const catInfo = Object.fromEntries(categories.map(c => [c, {slug: slug(c), items: products.filter(p=>p.category===c)}]));

const nav = (active='') => `
<header class="site-header"><div class="wrap header-inner">
  <a class="brand" href="${base}/"><img class="brand-mark" src="${base}/assets/logo.svg" alt="" width="42" height="42" /><span class="brand-text"><strong>EVERYTHING</strong><em>AVAILABLE HERE</em></span></a>
  <button class="ghost-btn nav-toggle" data-nav-toggle aria-label="Open menu">Menu</button>
  <nav class="nav" data-nav aria-label="Main navigation">
    <a href="${base}/" data-path="/">Home</a>
    <a href="${base}/categories/" data-path="/categories">Categories</a>
    <a href="${base}/areas/" data-path="/areas">Areas</a>
    <a href="${base}/reviews/" data-path="/reviews">Reviews</a>
    <a href="${base}/about/" data-path="/about">About</a>
  </nav>
</div></header>`;

const head = (title, desc, canonical, extra='') => `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${base}/assets/og.svg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${base}/assets/og.svg">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="${base}/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}/styles.css">${extra}
</head><body>`;

const footer = () => `<footer class="site-footer"><div class="wrap footer-inner">
  <div class="footer-brand"><img class="brand-mark" src="${base}/assets/logo.svg" alt="" width="42" height="42" loading="lazy" /><div><strong>EVERYTHING AVAILABLE HERE</strong><p>Curated deals across every category.</p></div></div>
  <div class="footer-links"><a href="${base}/categories/">Categories</a><a href="${base}/areas/">Areas</a><a href="${base}/reviews/">Reviews</a><a href="${base}/about/">About</a><a href="${base}/contact/">Contact</a><a href="${base}/privacy/">Privacy</a><a href="${base}/terms/">Terms</a><a href="${base}/sitemap.xml">Sitemap</a></div>
</div><div class="wrap footer-bottom"><span>© <span data-year></span> Everything Available Here.</span><span>As an Amazon Associate I earn from qualifying purchases.</span></div></footer><script src="${base}/assets/site.js" defer></script></body></html>`;

const card = p => `<article class="card"><div class="card-media"><div class="img-ph" aria-hidden="true">${p.emoji||'🛍️'}</div>${p.badge?`<span class="badge ${p.badge}">${p.badge==='trending'?'🔥 Trending':p.badge==='new'?'⚡ New':'💸 Best value'}</span>`:''}</div><div class="card-body"><div class="card-cat">${p.category}</div><h3>${p.name}</h3><p class="card-desc">${p.description||''}</p><div class="price-row"><span class="price">₹${p.sellPrice}</span>${p.mrp?`<s>₹${p.mrp}</s>`:''}</div><a class="deal-btn" href="${p.supplier.productUrl}" target="_blank" rel="sponsored nofollow noopener noreferrer">Get deal at Amazon ↗</a></div></article>`;

const pageWrap = (title, intro, body) => `<main class="simple-page wrap"><div class="section-head"><div><span class="section-tag">EVERYTHING AVAILABLE HERE</span><h1>${title}</h1><p>${intro}</p></div></div>${body}</main>`;

function write(file, content) { fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, content, 'utf8'); }

// Categories index
const catCards = categories.map(c => { const i = catInfo[c]; return `<a class="tool-card" href="${base}/category/${i.slug}/"><span>${i.items[0].emoji}</span><h3>${c}</h3><p>${i.items.length} curated picks</p><b>Browse ${c} ↗</b></a>`; }).join('');
write(path.join(root,'categories/index.html'), head('Browse Categories | Everything Available Here','Browse all product categories on Everything Available Here.',`${base}/categories/`) + nav() + pageWrap('Browse by <span>category</span>.','Find curated trending deals across every major category.','<div class="tool-grid">'+catCards+'</div>') + footer());

// Category pages
for (const c of categories) {
  const i = catInfo[c];
  const url = `${base}/category/${i.slug}/`;
  const ld = `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":`${c} Deals | Everything Available Here`,"url":url,"description":`Curated ${c} deals and trending picks.`})}</script>`;
  write(path.join(root,`category/${i.slug}/index.html`), head(`${c} Deals | Everything Available Here`,`Browse curated ${c} deals and trending picks on Everything Available Here.`,url,ld) + nav() + pageWrap(`${c} <span>deals</span>.`,`Curated ${c} picks from Amazon India. We may earn a commission from qualifying purchases.`,'<div class="product-grid">'+i.items.map(card).join('')+'</div><div class="notice-card" style="margin-top:24px;color:#374151;background:#f8fafc;border:1px solid #e5e7eb"><strong>Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. Prices and availability may change on Amazon.</div>') + footer());
}

// Areas / expansion pages
const areas = [
  {slug:'india', name:'India', desc:'Trending deals and shopping picks for customers across India.', body:'We curate products available on Amazon India with fast delivery options, popular categories, and value picks for Indian shoppers.'},
  {slug:'electronics-hub', name:'Electronics Hub', desc:'Gadgets, accessories, and tech essentials.', body:'Explore electronics, mobile accessories, and computer essentials curated for everyday use, work, and creators.'},
  {slug:'home-living', name:'Home & Living', desc:'Home, kitchen, and improvement essentials.', body:'Find practical home and kitchen products, decor, storage, and improvement tools.'},
  {slug:'fashion-style', name:'Fashion & Style', desc:'Fashion picks for men, women, and everyday style.', body:'Browse trending fashion, accessories, and style essentials with partner links to official stores.'},
  {slug:'health-wellness', name:'Health & Wellness', desc:'Fitness, beauty, and personal care picks.', body:'Discover fitness gear, wellness essentials, and personal care products from trusted partner listings.'},
];
const areaCards = areas.map(a=>`<a class="tool-card" href="${base}/areas/${a.slug}/"><span>📍</span><h3>${a.name}</h3><p>${a.desc}</p><b>Explore ↗</b></a>`).join('');
write(path.join(root,'areas/index.html'), head('Areas & Expansion | Everything Available Here','Explore Everything Available Here by areas and shopping interests.',`${base}/areas/`) + nav() + pageWrap('Areas & <span>expansion</span>.','Browse by focus area and shopping interest.','<div class="tool-grid">'+areaCards+'</div>') + footer());
for (const a of areas) {
  const url = `${base}/areas/${a.slug}/`;
  write(path.join(root,`areas/${a.slug}/index.html`), head(`${a.name} | Everything Available Here`,a.desc,url) + nav() + pageWrap(`${a.name}.`,a.desc,`<div class="notice-card" style="color:#374151;background:#f8fafc;border:1px solid #e5e7eb"><p>${a.body}</p><p><a class="deal-btn" href="${base}/categories/" style="display:inline-flex;margin-top:12px">Browse categories</a></p></div>`) + footer());
}

// Simple pages
const simple = (dir,title,desc,body) => write(path.join(root,`${dir}/index.html`), head(`${title} | Everything Available Here`,desc,`${base}/${dir}/`) + nav() + pageWrap(title,desc,body) + footer());
simple('about','About','About Everything Available Here.','<div class="notice-card" style="color:#374151;background:#f8fafc;border:1px solid #e5e7eb"><p>Everything Available Here is a curated deals and trending-products discovery site. We help shoppers find useful products across major categories and buy from official partner stores.</p><p><strong>Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases.</p></div>');
simple('contact','Contact','Contact Everything Available Here.','<div class="notice-card" style="color:#374151;background:#f8fafc;border:1px solid #e5e7eb"><p>Email: <a href="mailto:kunalkaul09@gmail.com">kunalkaul09@gmail.com</a></p><p>For deal suggestions, partnership inquiries, or corrections, reach out by email.</p></div>');
simple('privacy','Privacy Policy','Privacy policy for Everything Available Here.','<div class="notice-card" style="color:#374151;background:#f8fafc;border:1px solid #e5e7eb"><p>We collect minimal information needed to operate this site. If you submit a review form, your submitted name/message may be processed by the form provider you configure. Affiliate links may track referrals through partner networks such as Amazon.</p><p>Contact: <a href="mailto:kunalkaul09@gmail.com">kunalkaul09@gmail.com</a></p></div>');
simple('terms','Terms','Terms for using Everything Available Here.','<div class="notice-card" style="color:#374151;background:#f8fafc;border:1px solid #e5e7eb"><p>Product prices, availability, and details are provided by partner stores and may change. Always verify final details on the partner store before purchasing. Everything Available Here provides curated links and information for convenience.</p></div>');

// Reviews page
const reviewBody = `<div class="review-layout"><div class="notice-card" style="color:#374151;background:#f8fafc;border:1px solid #e5e7eb"><h2>Customer reviews</h2><p>Real reviews build trust. After you add a form endpoint, customers can submit reviews here.</p><div class="reviews-list"><article class="order-card"><div class="order-head"><strong>Sample Reviewer</strong><span class="status submitted">Example</span></div><div class="order-meta">"Found a useful product quickly and the Amazon link worked perfectly."</div></article></div></div>
<form class="checkout-form" action="https://formspree.io/f/REPLACE_WITH_FORM_ID" method="POST"><h3>Leave a review</h3><label class="field">Name <input name="name" required></label><label class="field">Email <input name="email" type="email" required></label><label class="field">Product/Category <input name="subject"></label><label class="field">Rating <select name="rating"><option>5 - Excellent</option><option>4 - Good</option><option>3 - Okay</option><option>2 - Poor</option><option>1 - Bad</option></select></label><label class="field full">Review <textarea name="message" rows="5" required style="border:1px solid #e5e7eb;border-radius:9px;padding:11px;font:inherit"></textarea></label><button class="primary-btn full-btn" type="submit">Submit review</button><p class="form-msg">Replace the Formspree action with your real form endpoint to collect reviews.</p></form></div>`;
write(path.join(root,'reviews/index.html'), head('Reviews | Everything Available Here','Read and submit reviews for Everything Available Here.',`${base}/reviews/`) + nav() + pageWrap('Customer <span>reviews</span>.','Honest feedback helps shoppers trust the site.',reviewBody) + footer());

// Sitemap
const urls = ['/', '/categories/', '/areas/', '/reviews/', '/about/', '/contact/', '/privacy/', '/terms/', ...categories.map(c=>`/category/${catInfo[c].slug}/`), ...areas.map(a=>`/areas/${a.slug}/`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${base}${u}</loc><changefreq>weekly</changefreq><priority>${u==='/'?'1.0':'0.7'}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root,'sitemap.xml'), xml);
console.log({pages: urls.length, categories: categories.length});