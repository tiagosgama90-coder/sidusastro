# Google Analytics 4 — Setup

Analytics only loads after visitors click **Accept all** on the cookie banner (GDPR).

## Steps

1. [analytics.google.com](https://analytics.google.com) → Create property → Web stream
2. Copy Measurement ID (`G-XXXXXXXXXX`)
3. Netlify → Environment variables → `VITE_GA_MEASUREMENT_ID`
4. Redeploy
5. Test in incognito → Accept cookies → Reports → Realtime

See cookie banner and `src/lib/analytics.js` for implementation details.
