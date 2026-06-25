# SETUP.md — Deploy Sidus Astro (buyer guide)

This guide walks you through deploying the app on **your own** accounts. Estimated time: **1–2 hours** for someone familiar with Firebase and Netlify.

The seller's production site can stay online until you complete payment and domain transfer. You will not use their credentials.

---

## 1. Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Netlify](https://www.netlify.com/) account (free tier works)
- [Firebase](https://console.firebase.google.com/) project (Blaze plan recommended for Functions if you scale; Spark works for Auth + Firestore at low volume)
- [Stripe](https://stripe.com/) account
- Domain (e.g. sidusastro.com after transfer) or temporary `*.netlify.app` URL for testing

---

## 2. Firebase

### 2.1 Create project

1. Firebase Console → **Add project** → note `project-id`
2. **Authentication** → Sign-in method → enable **Email/Password** and **Google**
3. **Authentication** → Settings → **Authorized domains** → add:
   - `localhost`
   - `your-site.netlify.app`
   - `yourdomain.com` and `www.yourdomain.com` (after domain is yours)

Optional helper script (after setting `FIREBASE_PROJECT_ID`):

```bash
node scripts/add-firebase-auth-domains.mjs
```

### 2.2 Firestore

1. Create database (production mode)
2. Deploy security rules from this repo:

```bash
npx firebase-tools@latest login
npx firebase-tools@latest use your-firebase-project-id
npm run deploy:rules
```

Rules file: `firestore.rules` — users can only read/write their own `/users/{uid}` document; premium fields are server-only.

### 2.3 Web app credentials

Project Settings → Your apps → Web app → copy config into Netlify env vars (see section 4).

### 2.4 Service account (server)

Project Settings → Service accounts → **Generate new private key**

- Copy the entire JSON
- In Netlify, set `FIREBASE_SERVICE_ACCOUNT` to that JSON **on one line** (minified)

Also set `FIREBASE_WEB_API_KEY` to the same Web API key as `VITE_FIREBASE_API_KEY`.

---

## 3. Stripe

### 3.1 Products

Create in Stripe Dashboard (or let Checkout use dynamic `price_data` — already implemented):

| Type | Suggested price | Code reference |
|------|-----------------|----------------|
| Tarot | €2 one-time | `PRECO_TAROT` in `src/lib/pricing.js` |
| Full natal chart | €10 one-time | `PRECO_MAPA_COMPLETO` |
| Premium | €9.99/month | `PRECO_PREMIUM_MENSAL` |

### 3.2 API keys

- **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY` (optional; Checkout is hosted)
- **Secret key** → `STRIPE_SECRET_KEY` (Netlify only)

### 3.3 Webhook

1. Stripe → Developers → Webhooks → Add endpoint
2. URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` (and related)
4. Signing secret → `STRIPE_WEBHOOK_SECRET` in Netlify

Test locally with Stripe CLI:

```bash
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
```

---

## 4. Netlify

### 4.1 Import site

1. Push this repo to **your** GitHub (private)
2. Netlify → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`

`netlify.toml` is already configured.

### 4.2 Environment variables

Set in Netlify → Site settings → Environment variables (copy from `.env.example`):

| Variable | Where |
|----------|--------|
| `VITE_FIREBASE_*` | Firebase web config |
| `FIREBASE_WEB_API_KEY` | Same as API key |
| `FIREBASE_SERVICE_ACCOUNT` | Service account JSON (one line) |
| `STRIPE_SECRET_KEY` | Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v2 site key |
| `VITE_ADSENSE_CLIENT` / `VITE_ADSENSE_SLOT` | Optional AdSense |
| `GROQ_API_KEY` / `GEMINI_API_KEY` | Optional AI (free tiers) |

**Never commit real secrets.** Use Netlify env vars for production.

### 4.3 Custom domain

After domain transfer (see DOMAIN-TRANSFER.md):

1. Netlify → Domain management → Add `yourdomain.com`
2. Update DNS at registrar (or use Netlify DNS)
3. Enable HTTPS (automatic)
4. Add domain to Firebase Authorized domains and reCAPTCHA domains

### 4.4 Local dev with functions

```bash
npm install -g netlify-cli   # or npx netlify
netlify dev
```

Opens app + functions at `http://localhost:8888`.

---

## 5. reCAPTCHA

1. [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin) → v2 Checkbox
2. Domains: `localhost`, Netlify URL, production domain
3. Site key → `VITE_RECAPTCHA_SITE_KEY`
4. Secret key → Netlify if required by your setup (verification is primarily client-side checkbox)

---

## 6. Optional: Google AdSense

1. Apply with your domain after it is live
2. Create ad unit → get `ca-pub-...` and slot ID
3. Set `VITE_ADSENSE_CLIENT` and `VITE_ADSENSE_SLOT` in Netlify
4. Update `public/ads.txt` with your publisher line
5. Ads load only after cookie consent (GDPR banner in app)

Leave AdSense vars **empty** to disable ads completely.

---

## 7. Optional: Admin premium emails

Edit `src/lib/premiumAccess.js` — add emails to `EMAILS_PREMIUM_PRIVILEGIADOS` for lifetime premium (optional).

---

## 8. Post-deploy checklist

- [ ] Sign up / login (email + Google)
- [ ] Generate natal chart
- [ ] Oracle chat (3 free questions)
- [ ] Stripe test payment (use test keys first)
- [ ] Premium tools unlock after subscription
- [ ] `/pt/...` and `/en/...` routes work
- [ ] Privacy page and cookie banner display
- [ ] Webhook updates Firestore `isPremium` / `mapaCompleto`

---

## 9. AI backends (no OpenAI required)

Netlify Functions use free providers by default:

1. **Pollinations** — no key
2. **Groq** — free tier at console.groq.com
3. **Gemini** — free quota at aistudio.google.com

Set keys in Netlify env. Paid OpenAI is opt-in via `ALLOW_PAID_OPENAI=true`.

---

## 10. Troubleshooting

| Issue | Fix |
|-------|-----|
| Firebase auth domain error | Add domain to Authorized domains |
| Stripe webhook 400 | Check `STRIPE_WEBHOOK_SECRET` and endpoint URL |
| Oracle returns error | Add `GROQ_API_KEY` or `GEMINI_API_KEY` |
| Blank map / ephemeris | Check browser console; WASM may need HTTPS |
| CORS on functions | Use `netlify dev` or deployed URL, not raw Vite port for API |

---

## Support window

Seller provides **7 days email support** for deployment questions after sale (per listing agreement).
