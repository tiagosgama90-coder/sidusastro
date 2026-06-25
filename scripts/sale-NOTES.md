# SALE-NOTES.md — What was sanitized in this package

This folder was generated from the seller's private development repo for **handover only**. Your production deployment uses **your** accounts.

## Removed / replaced

| Item | In sale package |
|------|-----------------|
| Seller personal emails (premium whitelist) | Empty list in `premiumAccess.js` |
| Seller AdSense publisher ID | Env vars only — no hardcoded IDs |
| Seller Firebase project ID in `.firebaserc` | Placeholder `your-firebase-project-id` |
| Seller support email | `support@yourdomain.com` (replace after purchase) |
| `.env` / secrets | Not included — use `.env.example` |
| `node_modules`, `dist`, `.netlify` | Not included — run `npm install` |

## Not removed (intentional)

- References to **sidusastro.com** in marketing copy and SEO — domain is part of the sale
- Product features and Stripe price points in code
- `public/google-ads/` brand images if present — optional marketing assets

## Seller production

The seller may keep **sidusastro.com** live on their stack until you complete purchase and DNS cutover. This package does not connect to their Firebase or Stripe.

## Regenerate this package (seller only)

From the original dev repo:

```bash
node scripts/export-sale-package.mjs
```

Output: `../sidusastro-sale/` (sibling folder — does not overwrite production).
