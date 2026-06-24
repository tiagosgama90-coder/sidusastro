# Setup guide — Sidus (buyer)

Complete checklist to deploy on **your** accounts.

## 1. Firebase

1. [console.firebase.google.com](https://console.firebase.google.com) → Create project
2. Enable **Authentication** → Email/Password + Google
3. Create **Firestore** database
4. Project Settings → Web app → copy config to `.env` / Netlify:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Service Accounts → Generate private key → `FIREBASE_SERVICE_ACCOUNT` (one-line JSON on Netlify)
6. Authentication → Settings → Authorized domains → add:
   - `your-domain.com`
   - `www.your-domain.com`
   - `your-site.netlify.app`
7. Deploy rules: `npm run deploy:rules` (after `firebase login` and updating `.firebaserc`)

## 2. Stripe

1. [dashboard.stripe.com](https://dashboard.stripe.com) → activate account
2. Developers → API keys → `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`
3. Webhooks → Add endpoint:
   - URL: `https://your-domain.com/api/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy `STRIPE_WEBHOOK_SECRET`

## 3. reCAPTCHA

1. [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) → v2 Checkbox
2. Add your domains
3. `VITE_RECAPTCHA_SITE_KEY`

## 4. Netlify

1. Import this GitHub repo
2. Build: `npm run build` | Publish: `dist`
3. Add **all** variables from `.env.example`
4. Set `SITE_URL=https://your-domain.com`
5. Deploy

## 5. Domain DNS

At your registrar (e.g. Namecheap):

| Type | Host | Value |
|------|------|-------|
| A | @ | Netlify load balancer IP (from Netlify docs) |
| CNAME | www | your-site.netlify.app |

Or use Netlify DNS nameservers if you transfer DNS.

## 6. Optional

- **Google Analytics:** `VITE_GA_MEASUREMENT_ID` — see `docs/ANALYTICS.md`
- **AdSense:** after approval, `VITE_ADSENSE_CLIENT`, `VITE_ADSENSE_SLOT`, update `public/ads.txt`
- **AI keys:** `GROQ_API_KEY` or `GEMINI_API_KEY` for better oracle quality (free tiers available)

## 7. Post-launch

- Replace `support@example.com` in privacy files with your email
- Update `public/sitemap.xml` and `public/robots.txt` with your domain
- Test: register → natal chart → Stripe test payment → oracle chat

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Firebase auth fails | Authorized domains + correct `VITE_FIREBASE_*` |
| Payments error | `STRIPE_SECRET_KEY` + webhook URL |
| Email verification | `FIREBASE_WEB_API_KEY` + authorized domain |
| Blank after deploy | Check Netlify build log; env vars need redeploy |
