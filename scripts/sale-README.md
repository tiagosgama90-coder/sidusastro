# Sidus Astro — Astrology SaaS (sale package)

Production-ready bilingual (PT/EN) astrology web application: natal charts, AI oracle, synastry, tarot, and Stripe monetization.

**This repository is a clean handover package** — no seller Firebase, Stripe, or AdSense accounts are included. Follow [SETUP.md](./SETUP.md) to deploy on your own infrastructure.

## Live product (seller demo)

The seller may keep their deployment running until sale completes. After purchase, you receive the domain (see [DOMAIN-TRANSFER.md](./DOMAIN-TRANSFER.md)) and deploy this code to your accounts.

## Quick start

```bash
npm install
cp .env.example .env.local   # local dev only — production uses Netlify env vars
npm run dev                    # http://localhost:5173
```

Deploy: Netlify (recommended) — see **SETUP.md**.

## What's included

- React 19 + Vite frontend
- 9 Netlify serverless functions (oracle, dreams, Stripe, geocoding, daily content)
- Firebase Auth + Firestore
- Stripe Checkout + webhooks
- Swiss Ephemeris (WASM) + astronomy-engine fallback
- Full i18n (Portuguese + English)

## Documentation

| File | Purpose |
|------|---------|
| [SETUP.md](./SETUP.md) | Deploy Firebase, Netlify, Stripe, reCAPTCHA, optional AdSense |
| [DOMAIN-TRANSFER.md](./DOMAIN-TRANSFER.md) | Transfer sidusastro.com from Namecheap |
| [SALE-NOTES.md](./SALE-NOTES.md) | What was sanitized in this package |

## Monetization (configured in code)

| Product | Price |
|---------|-------|
| Tarot reading | €2 |
| Full natal chart | €10 |
| Premium subscription | €9.99/month |

## Support

7 days email support after purchase (as agreed with seller). Deployment questions only — not ongoing product development.

## License

Full source code transfer to buyer upon completed sale. All rights assigned per purchase agreement.
