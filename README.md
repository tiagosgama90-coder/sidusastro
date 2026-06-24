# Sidus — Astrology Web App

Bilingual (Portuguese + English) astrology SaaS: natal chart, tarot, AI oracle, synastry, numerology, Stripe payments.

## Stack

- **Frontend:** React 19, Vite, React Router
- **Backend:** Netlify Functions
- **Auth / DB:** Firebase Authentication + Firestore
- **Payments:** Stripe Checkout + webhooks
- **AI:** Pollinations (free default) + optional Groq / Gemini / OpenRouter

## Quick start (local)

```bash
npm install
cp .env.example .env
# Fill .env with your Firebase keys (see docs/SETUP.md)
npm run dev
```

## Production deploy

1. Create accounts: Firebase, Stripe, Netlify, reCAPTCHA
2. Connect this repo to Netlify (or `netlify deploy`)
3. Set all variables from `.env.example` in Netlify → Environment variables
4. Point your domain DNS to Netlify
5. Configure Stripe webhook: `https://your-domain.com/api/stripe-webhook`

**Full guide:** [docs/SETUP.md](./docs/SETUP.md)

## Domain transfer (included in sale)

If you purchased this package with domain **sidusastro.com**, see [docs/DOMAIN-TRANSFER.md](./docs/DOMAIN-TRANSFER.md).

## Customize before launch

| Item | Where |
|------|--------|
| Support email | `src/lib/i18n/privacy.js`, `pt.js`, `en.js`, `public/privacy.html` |
| Brand name | UI strings, `index.html`, `manifest.json` |
| Admin premium emails | `src/lib/premiumAccess.js` |
| Domain in sitemap/robots | `public/sitemap.xml`, `public/robots.txt` |
| AdSense | `VITE_ADSENSE_*` + `public/ads.txt` |
| Analytics | `VITE_GA_MEASUREMENT_ID` — see `docs/ANALYTICS.md` |

## Pricing (defaults in code)

- Tarot: €2
- Full natal chart: €10
- Premium subscription: €9.99/month

Edit `src/lib/pricing.js` and Stripe products as needed.

## License

Sold as a transferable license to the buyer. Redistribution of source code is not permitted unless agreed with the seller.
