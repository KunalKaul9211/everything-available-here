# Affiliate Signup Kit — Everything Available Here

Use this while signing up. **Do not share passwords/OTP/bank details in chat.** I can guide you, but you must complete verification/KYC yourself.

## Your site details (copy-paste)

- **Website/Brand name:** Everything Available Here
- **Live URL:** https://kunalkaul9211.github.io/everything-available-here/
- **GitHub:** https://github.com/KunalKaul9211/everything-available-here
- **Owner:** Kunal Kaul
- **Email:** kunalkaul09@gmail.com
- **Country:** India
- **Niche:** Trending products across tech, home, fitness, beauty, fashion, gaming, pets
- **Promotion methods:** Website/content, social media (Instagram/YouTube Shorts/TikTok where applicable), deal curation, price comparison
- **Description (short):** Everything Available Here is a curated trending-products discovery site that helps users find popular, available products and deals across categories.
- **Description (long):** Everything Available Here curates trending and in-demand products across multiple categories. We publish product roundups, comparisons, and deal finds, and direct users to official retailer/partner stores through tracked affiliate links. We focus on honest recommendations, availability, and value.

## Recommended signup order (India-first)

| Priority | Program | Why | Signup | Notes |
|---|---|---|---|---|
| 1 | **EarnKaro** | Easiest start, aggregates many brands, low payout threshold | https://earnkaro.com/ | Good for beginners; no complex website approval like some networks. |
| 2 | **Amazon Associates (India)** | Huge catalog, trusted | https://affiliate-program.amazon.in/ | Needs website/app/social handle; make 3 qualifying sales in 180 days to keep account active. Follow disclosure rules strictly. |
| 3 | **Flipkart Affiliate** | Big Indian retailer | https://affiliate.flipkart.com/ | Direct program; good for India pricing/deals. |
| 4 | **Cuelinks** | Aggregator for many Indian merchants | https://www.cuelinks.com/ | Useful when direct programs are hard to get. |
| 5 | **Admitad India** | Global + India campaigns | https://www.admitad.com/in/ | Good after basics are set. |
| 6 | **vCommission** | India affiliate network | https://www.vcommission.com/ | Apply as publisher/affiliate. |
| 7 | **Impact.com** | Premium/global brands | https://impact.com/ | Apply after site has content/traffic. |
| 8 | **CJ Affiliate** | Global brands | https://www.cj.com/ | Good for global offers. |
| 9 | **Awin** | Global brands | https://www.awin.com/in | Some programs may have deposit/approval requirements. |

## Before applying (important)

- [ ] Add clear **Affiliate Disclosure** on every page/footer (already present - verify wording).
- [ ] Add **Contact** page/email (kunalkaul09@gmail.com).
- [ ] Add **Privacy Policy** and **Terms** pages - many programs require them.
- [ ] Add original content: buying guides/comparisons, not just copied product listings.
- [ ] Do not promise fake prices/reviews/stock. Verify before publishing.
- [ ] For Amazon: clearly state "As an Amazon Associate I earn from qualifying purchases."

## After approval

When you get affiliate IDs/links, paste them into `data/products.js`:

```js
{
  supplier: {
    name: "Amazon",
    type: "affiliate",
    productUrl: "https://amzn.to/your-tracked-link",
    autoFulfill: false
  }
}
```

For the current MVP, affiliate items should open the official partner link. COD/on-site checkout should be used only where **you** are the seller of record.

## Payout/KYC you'll likely need

- PAN card
- Bank account / UPI (depends on network)
- GST may be needed depending on payout/scale (check with CA)
- Address/phone/email verification

I can help format product listings, disclosures, and routing code — but I cannot submit KYC or log into your accounts.