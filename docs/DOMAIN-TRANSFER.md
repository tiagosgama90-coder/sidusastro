# Domain transfer — sidusastro.com (Namecheap)

This package may include the domain **sidusastro.com** registered at Namecheap.

## Seller steps (after payment)

1. Log in to [namecheap.com](https://www.namecheap.com)
2. Domain List → **sidusastro.com** → **Manage**
3. **Sharing & Transfer** tab:
   - Turn **OFF** Domain Lock (temporarily)
   - Click **Auth Code** → copy EPP code
4. Send buyer:
   - Auth/EPP code
   - Confirmation that domain is unlocked
5. Approve transfer emails from Namecheap when prompted
6. Remove domain from your Netlify site (Domain management → Remove)

Transfer usually completes in **5–7 days**.

## Buyer steps

1. At your registrar (or Namecheap account): **Transfer domain**
2. Enter: `sidusastro.com` + Auth code from seller
3. Pay transfer fee if required (~$10–15 first year at some registrars)
4. After transfer completes:
   - Point DNS to **your** Netlify site
   - Or add domain in Netlify → follow DNS instructions

## DNS after transfer (Netlify)

In Namecheap → Advanced DNS:

| Type | Host | Value |
|------|------|-------|
| ALIAS or A | @ | Netlify (see Netlify domain setup) |
| CNAME | www | `your-site.netlify.app` |

In Netlify → Domain management → Add `sidusastro.com`

## Important

- Seller's Firebase, Stripe, and Netlify accounts are **not** transferred
- You deploy this codebase on **your** Netlify with **your** env vars
- Update support email in privacy files after takeover
