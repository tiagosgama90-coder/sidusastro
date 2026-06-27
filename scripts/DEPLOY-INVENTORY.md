# Inventário de produção — sidusastro.com (vendedor)

Documento de referência para venda / handover. **Segredos reais** (Stripe secret, Firebase service account) ficam só no **Netlify → Environment variables** — nunca no Git.

Última actualização: Junho 2026

---

## Repositórios GitHub

| Repo | URL | Função |
|------|-----|--------|
| **sidusastro** | https://github.com/tiagosgama90-coder/sidusastro | Produção — Netlify deploy `master` |
| **sidusastro-handover** | https://github.com/tiagosgama90-coder/sidusastro-handover | Pacote venda (privado) |
| **sidus-app** | https://github.com/tiagosgama90-coder/sidus-app | Cópia desenvolvimento |

Regenerar handover:

```bash
cd sidusastro
node scripts/export-sale-package.mjs
robocopy ..\sidusastro-sale ..\sidusastro-handover-review /MIR /XD .git
cd ..\sidusastro-handover-review
git add -A && git commit -m "Sync handover" && git push
```

---

## Hosting e domínio

| Serviço | Detalhe |
|---------|---------|
| **Netlify** | Build: `npm run build` · Publish: `dist` · `netlify.toml` |
| **Domínio** | sidusastro.com (+ www) — Namecheap |
| **Deploy** | Push para `sidusastro` `master` → auto-deploy 2–5 min |

---

## Contas Google (IDs públicos — no repo)

| Serviço | Valor | Estado |
|---------|-------|--------|
| **Google Analytics 4** | `G-18FPC8HYE8` | Activo — carrega após consentimento cookies |
| **Google AdSense Publisher** | `ca-pub-2807052149540484` | Conta ligada — site **em aprovação** |
| **AdSense slot (Display horizontal)** | `7205155875` | Unidade criada |
| **ads.txt** | `public/ads.txt` | Publicado em sidusastro.com/ads.txt |
| **reCAPTCHA v2** | `VITE_RECAPTCHA_SITE_KEY` no Netlify | Domínios: sidusastro.com, netlify.app |

### AdSense no código

- Script carrega após cookies (`App.jsx` → `initAdSense()`)
- Banner só para utilizadores **logados**, **não Premium**, fora login/onboarding/paywall
- Env Netlify (também em `netlify.toml` production): `VITE_ADSENSE_CLIENT`, `VITE_ADSENSE_SLOT`

---

## Firebase

| Item | Valor |
|------|-------|
| **Project ID** | `sidus-app` |
| **Auth** | Email/password + Google |
| **Firestore** | Regras em `firestore.rules` |
| **Domínios autorizados** | sidusastro.com, www, netlify.app, localhost |

Variáveis: `VITE_FIREBASE_*`, `FIREBASE_WEB_API_KEY`, `FIREBASE_SERVICE_ACCOUNT` (Netlify only).

---

## Stripe

- Checkout hosted + webhook Netlify function
- Preços em `src/lib/pricing.js` (Tarot €2, Mapa €10, Premium €9.99/mês)
- Chaves: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY` (Netlify)

---

## Funcionalidades recentes (código)

- **Landing portal** (`/login`) — formulário nascimento + `localStorage` → pré-preenche onboarding
- **Navbar desktop** — uma linha, FAB perfil, PT/ENG
- **Cookie consent** RGPD — AdSense + GA4 só após aceitar
- **i18n** PT/EN completo

---

## Próximo passo comercial: tráfego

1. Manter site **sempre online** (AdSense aprova mais rápido)
2. SEO: `/login` indexável, sitemap.xml, meta OG
3. Conteúdo: posts mapa astral, numerologia, horóscopo (PT + EN)
4. Redes: TikTok/Instagram reels com CTA sidusastro.com/login
5. Google Search Console — submeter sitemap
6. Quando AdSense aprovar, considerar ads também na landing pública

---

## Checklist venda

- [ ] Handover GitHub actualizado (`sidusastro-handover`)
- [ ] Comprador recebe acesso Netlify / Firebase / Stripe / Namecheap (transferência)
- [ ] Remover emails whitelist em `premiumAccess.js` antes de entregar OU entregar já sanitizado (export script)
- [ ] 7 dias suporte deploy (conforme listing)
