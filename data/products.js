/* ============================================================
   EVERYTHING AVAILABLE HERE — CATALOG DATA
   Amazon Associates tag: everythinObb6-21
   Replace search URLs with exact SiteStripe product links for best tracking/conversion.
   ============================================================ */

const TAG = "everythinObb6-21";
const amz = (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}&tag=${TAG}`;

const P = (id, name, category, emoji, price, mrp, query, badge = "trending", desc = "") => ({
  id, name, category, emoji,
  sellPrice: price, mrp, supplierCost: 0, shipping: 0,
  currency: "INR", rating: 4.4, reviews: 0, badge, image: "", stock: 99,
  supplier: { name: "Amazon", type: "affiliate", sku: id.toUpperCase(), productUrl: amz(query), autoFulfill: false },
  description: desc || `Shop ${name} on Amazon India.`,
  added: "2026-11-27"
});

window.EAH_PRODUCTS = [
  // Electronics & Gadgets
  P("el-001","Wireless Bluetooth Earbuds","Electronics","🎧",1499,2999,"wireless bluetooth earbuds","trending","True wireless earbuds for music, calls, and workouts."),
  P("el-002","Smart Watch Fitness Tracker","Electronics","⌚",1999,4999,"smart watch fitness tracker","trending","Track steps, heart rate, sleep, and notifications."),
  P("el-003","Magnetic Wireless Power Bank 10000mAh","Electronics","🔋",1499,2499,"magnetic wireless power bank 10000mah","trending","Portable charging for phones and gadgets."),
  P("el-004","Portable Bluetooth Speaker","Electronics","🔊",1299,2499,"portable bluetooth speaker","value","Compact speaker for home, travel, and outdoors."),

  // Computers & Accessories
  P("pc-001","Laptop Stand Adjustable","Computers & Accessories","💻",899,1999,"adjustable laptop stand","trending","Ergonomic aluminum stand for desk setup."),
  P("pc-002","Wireless Mouse & Keyboard Combo","Computers & Accessories","⌨️",1199,2499,"wireless keyboard mouse combo","value","Comfortable wireless combo for work and study."),
  P("pc-003","USB-C Hub Multiport Adapter","Computers & Accessories","🔌",1499,2999,"usb c hub multiport adapter","new","Expand ports for laptop, monitor, and storage."),
  P("pc-004","Webcam 1080p with Mic","Computers & Accessories","📷",1799,3499,"1080p webcam with microphone","trending","Clear video calls, streaming, and meetings."),

  // Mobile Accessories
  P("mo-001","Fast Charging USB-C Cable","Mobile Accessories","⚡",299,699,"usb c fast charging cable","value","Durable fast-charge cable for daily use."),
  P("mo-002","Phone Tripod with Ring Light","Mobile Accessories","📱",799,1599,"phone tripod ring light","trending","Content creation setup for reels and video calls."),
  P("mo-003","Car Phone Holder Mount","Mobile Accessories","🚗",499,999,"car phone holder mount","value","Secure dashboard/windshield mount for navigation."),
  P("mo-004","Screen Protector Tempered Glass","Mobile Accessories","🛡️",249,599,"tempered glass screen protector","value","Protect your phone screen from scratches and drops."),

  // Home & Kitchen
  P("hk-001","Portable Mini USB Blender","Home & Kitchen","🥤",999,1699,"portable mini usb blender","trending","Quick smoothies and shakes anywhere."),
  P("hk-002","Vacuum Compression Travel Bags","Home & Kitchen","🧳",699,1299,"vacuum compression storage bags","trending","Save space in closets and luggage."),
  P("hk-003","Silicone Kitchen Utensil Set","Home & Kitchen","🍳",799,1499,"silicone kitchen utensil set","value","Heat-resistant tools for everyday cooking."),
  P("hk-004","Electric Kettle Stainless Steel","Home & Kitchen","🫖",899,1699,"electric kettle stainless steel","trending","Fast boiling for tea, coffee, and instant meals."),

  // Fashion - Men
  P("fm-001","Men's Casual Sneakers","Fashion - Men","👟",1499,2999,"mens casual sneakers","trending","Everyday sneakers for comfort and style."),
  P("fm-002","Men's Slim Fit T-Shirt Pack","Fashion - Men","👕",699,1299,"mens slim fit t shirt pack","value","Basic tees for daily wear."),
  P("fm-003","Men's Analog Wrist Watch","Fashion - Men","⌚",1299,2499,"mens analog wrist watch","new","Classic watch for casual and formal looks."),
  P("fm-004","Men's Wallet Leather","Fashion - Men","👛",599,1199,"mens leather wallet","value","Compact wallet with card and cash slots."),

  // Fashion - Women
  P("fw-001","Women's Tote Bag","Fashion - Women","👜",1199,2499,"womens tote bag","trending","Stylish everyday bag for work and travel."),
  P("fw-002","Women's Casual Kurti","Fashion - Women","👗",899,1799,"womens casual kurti","trending","Comfortable kurti for daily and office wear."),
  P("fw-003","Women's Sunglasses","Fashion - Women","🕶️",699,1499,"womens sunglasses uv protection","new","UV-protected sunglasses for style and comfort."),
  P("fw-004","Women's Sneakers","Fashion - Women","👟",1399,2799,"womens sneakers","value","Lightweight sneakers for daily use."),
  {
    id: "fw-005",
    name: "Women's Embroidered Kurti with Floral Design",
    category: "Fashion - Women",
    emoji: "👗",
    sellPrice: 0,
    mrp: 0,
    supplierCost: 0,
    shipping: 0,
    currency: "INR",
    rating: 4.3,
    reviews: 0,
    badge: "new",
    image: "",
    stock: 99,
    supplier: { name: "Amazon", type: "affiliate", sku: "FW-005", productUrl: "https://www.amazon.in/dp/B0H8FNJKYH?tag=everythinObb6-21", autoFulfill: false },
    description: "Embroidered floral kurti for everyday and casual wear. Check size, fabric, and current price on Amazon before ordering.",
    added: "2026-11-28"
  },

  // Beauty & Personal Care
  P("be-001","LED Makeup Mirror","Beauty & Personal Care","🪞",1199,1999,"led makeup mirror","trending","Bright mirror for grooming and makeup."),
  P("be-002","Hair Dryer Compact","Beauty & Personal Care","💇",999,1999,"hair dryer compact","value","Quick drying for home and travel."),
  P("be-003","Face Serum Vitamin C","Beauty & Personal Care","✨",599,1199,"vitamin c face serum","trending","Popular skincare pick — check ingredients/reviews."),
  P("be-004","Electric Trimmer for Men","Beauty & Personal Care","🪒",1299,2499,"electric beard trimmer men","trending","Grooming trimmer for beard and styling."),

  // Health & Fitness
  P("hf-001","Resistance Band Set","Health & Fitness","🏋️",799,1499,"resistance band set","trending","Home workout bands for strength and mobility."),
  P("hf-002","Yoga Mat Anti-Slip","Health & Fitness","🧘",699,1399,"anti slip yoga mat","value","Comfortable mat for yoga and exercise."),
  P("hf-003","Digital Weighing Scale","Health & Fitness","⚖️",899,1799,"digital body weighing scale","trending","Track body weight at home."),
  P("hf-004","Protein Shaker Bottle","Health & Fitness","🥛",399,799,"protein shaker bottle","value","Leakproof shaker for gym and travel."),

  // Baby & Kids
  P("bk-001","Baby Diaper Bag Backpack","Baby & Kids","🎒",1499,2999,"baby diaper bag backpack","trending","Organized bag for baby essentials."),
  P("bk-002","Kids Educational Toy Set","Baby & Kids","🧸",799,1599,"kids educational toys","value","Learning toys for fun and development."),
  P("bk-003","Baby Feeding Bottle Set","Baby & Kids","🍼",599,1199,"baby feeding bottle set","trending","Feeding essentials — check age suitability."),
  P("bk-004","Kids Water Bottle Leakproof","Baby & Kids","💧",499,999,"kids leakproof water bottle","new","School-friendly bottle for daily use."),

  // Toys & Games
  P("tg-001","Remote Control Car","Toys & Games","🚗",1299,2499,"remote control car toy","trending","Fun RC car for kids and hobby play."),
  P("tg-002","Building Blocks Set","Toys & Games","🧱",899,1799,"building blocks toy set","value","Creative blocks for kids."),
  P("tg-003","Board Game Family","Toys & Games","🎲",699,1399,"family board game","trending","Family game night pick."),
  P("tg-004","Puzzle Set 1000 Pieces","Toys & Games","🧩",599,1199,"1000 piece puzzle","new","Challenging puzzle for adults and teens."),

  // Books
  P("bo-001","Atomic Habits Book","Books","📚",499,799,"atomic habits book james clear","trending","Popular self-improvement book."),
  P("bo-002","Rich Dad Poor Dad","Books","📘",399,699,"rich dad poor dad book","trending","Personal finance classic."),
  P("bo-003","The Psychology of Money","Books","📗",349,599,"psychology of money book","value","Money mindset and behavior insights."),
  P("bo-004","Bhagavad Gita English","Books","📙",299,599,"bhagavad gita english book","value","Spiritual classic in English."),

  // Grocery & Gourmet
  P("gr-001","Dry Fruits Combo Pack","Grocery & Gourmet","🥜",899,1499,"dry fruits combo pack","trending","Popular snack and gifting option."),
  P("gr-002","Green Tea Bags","Grocery & Gourmet","🍵",399,699,"green tea bags","value","Daily wellness tea option."),
  P("gr-003","Peanut Butter High Protein","Grocery & Gourmet","🥜",499,899,"high protein peanut butter","trending","Breakfast and fitness staple."),
  P("gr-004","Instant Coffee Jar","Grocery & Gourmet","☕",449,799,"instant coffee jar","value","Quick coffee for home and office."),

  // Pet Supplies
  P("pt-001","Slow Feeder Dog Bowl","Pet Supplies","🐶",499,899,"slow feeder dog bowl","trending","Helps dogs eat slower and healthier."),
  P("pt-002","Cat Litter Tray","Pet Supplies","🐱",699,1299,"cat litter tray","value","Easy-clean litter tray for cats."),
  P("pt-003","Pet Grooming Brush","Pet Supplies","🐾",399,799,"pet grooming brush","new","Removes loose fur and keeps coat clean."),
  P("pt-004","Dog Chew Toy","Pet Supplies","🦴",349,699,"dog chew toy durable","value","Durable chew toy for playtime."),

  // Home Improvement & Tools
  P("hi-001","Cordless Drill Machine","Home Improvement","🔧",2499,4999,"cordless drill machine","trending","DIY and home repair essential."),
  P("hi-002","LED Strip Lights","Home Improvement","💡",599,1199,"led strip lights room","trending","Ambient lighting for room decor."),
  P("hi-003","Tool Kit Set","Home Improvement","🧰",1299,2499,"home tool kit set","value","Basic toolkit for household fixes."),
  P("hi-004","Water Tap Filter","Home Improvement","🚰",499,999,"water tap filter","new","Simple tap filter attachment."),

  // Automotive
  P("au-001","Car Vacuum Cleaner Portable","Automotive","🚘",1499,2999,"portable car vacuum cleaner","trending","Keep car interiors clean."),
  P("au-002","Car Dash Camera","Automotive","📹",2999,5999,"car dash camera","trending","Record drives for safety and evidence."),
  P("au-003","Tyre Inflator Portable","Automotive","🛞",1999,3999,"portable tyre inflator","value","Emergency inflation for car/bike tyres."),
  P("au-004","Car Seat Cover Set","Automotive","🪑",2499,4999,"car seat cover set","new","Protect and refresh car seats."),

  // Office & Stationery
  P("of-001","Ergonomic Office Chair Cushion","Office Products","🪑",999,1999,"ergonomic seat cushion office","value","Better comfort for long desk hours."),
  P("of-002","Desk Organizer","Office Products","🗂️",699,1399,"desk organizer office","trending","Keep workspace tidy."),
  P("of-003","Notebook Journal Set","Office Products","📓",499,999,"notebook journal set","value","For notes, planning, and journaling."),
  P("of-004","Whiteboard with Markers","Office Products","🧑‍🏫",899,1699,"whiteboard with markers","new","Planning board for home/office."),

  // Sports & Outdoors
  P("sp-001","Badminton Racket Set","Sports & Outdoors","🏸",1299,2499,"badminton racket set","trending","Backyard and club play set."),
  P("sp-002","Cricket Bat Tennis Ball","Sports & Outdoors","🏏",999,1999,"tennis cricket bat","value","Popular pick for casual cricket."),
  P("sp-003","Camping Lantern Rechargeable","Sports & Outdoors","🏕️",899,1799,"rechargeable camping lantern","new","Useful for camping and power cuts."),
  P("sp-004","Football Size 5","Sports & Outdoors","⚽",799,1499,"football size 5","value","Training and match ball option."),

  // Musical Instruments
  P("mu-001","Acoustic Guitar Beginner","Musical Instruments","🎸",3999,6999,"acoustic guitar beginner","trending","Starter guitar for learning."),
  P("mu-002","Digital Keyboard 61 Keys","Musical Instruments","🎹",4999,8999,"61 key digital keyboard","new","Beginner keyboard for practice."),
  P("mu-003","Ukulele Soprano","Musical Instruments","🪕",1999,3499,"soprano ukulele beginner","value","Compact instrument for beginners."),
  P("mu-004","Studio Microphone USB","Musical Instruments","🎙️",2499,4999,"usb studio microphone","trending","For singing, podcasting, and streaming.")
];
