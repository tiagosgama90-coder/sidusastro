# DOMAIN-TRANSFER.md — sidusastro.com handover

This document describes how the **seller** transfers the domain **sidusastro.com** to you after payment. The seller keeps their hosting until the sale is complete; you deploy this codebase on your own Netlify/Firebase accounts.

---

## What is being transferred

| Asset | Registrar (seller) | Included in sale |
|-------|-------------------|------------------|
| Domain `sidusastro.com` | Namecheap | Yes |
| DNS configuration | Namecheap or Netlify | Instructions below |
| Seller's Netlify site | Seller account | No — you create a new site |
| Seller's Firebase data | Seller project | No — fresh project recommended |
| Email `@sidusastro.com` | If any | Not included unless agreed separately |

---

## Recommended transfer flow

### Step 1 — Payment

Agree payment via Escrow.com, bank transfer, or PayPal (as per sale agreement).  
**Do not request the Auth/EPP code before payment is secured.**

### Step 2 — Seller prepares domain (Namecheap)

Seller logs into [Namecheap](https://www.namecheap.com/):

1. Domain List → **sidusastro.com** → **Manage**
2. **Sharing & Transfer** → ensure domain is **unlocked** (Registrar Lock OFF)
3. Confirm registrant email is valid (transfer approval may be sent there)
4. **Sharing & Transfer** → **Auth Code** → generate and send to buyer securely

### Step 3 — Buyer initiates transfer

1. At your registrar (Namecheap or other), choose **Transfer domain**
2. Enter `sidusastro.com` and the Auth/EPP code
3. Pay transfer fee if required (often includes 1 year renewal)
4. Approve transfer emails from both registrars

Transfer usually completes in **5–7 days** (ICANN rules).

### Step 4 — Point domain to your Netlify site

After you deploy on Netlify (see SETUP.md):

**Option A — Netlify DNS (simplest)**

1. Netlify → Domain management → Add `sidusastro.com`
2. At Namecheap (after transfer), set nameservers to Netlify's (shown in Netlify UI)

**Option B — Keep Namecheap DNS**

Add records Netlify provides, typically:

| Type | Host | Value |
|------|------|--------|
| A | `@` | Netlify load balancer IP (from Netlify docs) |
| CNAME | `www` | `your-site.netlify.app` |

Enable HTTPS in Netlify after DNS propagates (up to 48h).

### Step 5 — Seller decommissions old deployment

After your site is live and domain resolves correctly:

1. Seller removes custom domain from their Netlify site (or deletes site)
2. Seller does **not** need to delete Firebase immediately — no buyer data should exist in seller project
3. Update Firebase Authorized domains and reCAPTCHA to **your** project only

---

## What you must update after transfer

Replace placeholder domains in your fork if you use a different brand:

- `scripts/add-firebase-auth-domains.mjs` — domain list
- `public/sitemap.xml` — base URL
- `public/robots.txt` — sitemap URL
- Privacy contact email in `src/lib/i18n/privacy.js` and `public/privacy.html`
- Marketing strings referencing `sidusastro.com` (optional rebrand)

If you keep **sidusastro.com**, most references in code are already correct.

---

## SSL / HTTPS

Netlify provisions Let's Encrypt certificates automatically once DNS points to Netlify and the domain is verified.

---

## WHOIS / privacy

Buyer becomes registrant after transfer completes. Enable WHOIS privacy at your registrar if desired.

---

## Problems?

| Situation | Action |
|-----------|--------|
| Auth code expired | Seller generates a new code |
| Transfer rejected | Unlock domain; confirm no transfer lock / recent registration |
| Site still shows old version | DNS cache — wait or lower TTL before cutover |
| Email to @sidusastro.com needed | Set up Google Workspace or forwarding separately — not part of default sale |

---

## Checklist

**Seller**

- [ ] Payment received / escrow released
- [ ] Domain unlocked at Namecheap
- [ ] Auth code sent securely to buyer
- [ ] GitHub repo access granted (private transfer)
- [ ] Remove custom domain from seller Netlify after buyer confirms go-live

**Buyer**

- [ ] Transfer initiated with Auth code
- [ ] Netlify site deployed with own Firebase + Stripe
- [ ] DNS pointed to buyer Netlify
- [ ] HTTPS working on sidusastro.com
- [ ] Firebase + reCAPTCHA domains updated
- [ ] Stripe webhook URL updated to new domain
