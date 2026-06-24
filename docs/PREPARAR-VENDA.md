# Preparar o Sidus para venda (sem os teus dados)

> Usa este checklist **no dia em que fores vender**. Não é preciso fazer agora.

---

## Visão geral

Vendes **código limpo**. Manténs **contas, domínio e segredos**.

```
TU FICAS COM:                    COMPRADOR RECEBE:
├── Conta Firebase               ├── Código GitHub (limpo)
├── Conta Stripe                 ├── .env.example (sem chaves reais)
├── Conta Netlify                ├── README de instalação
├── Google Analytics             └── Instruções de deploy
├── AdSense
├── Domínio (se não incluíres)
└── Instagram / TikTok
```

---

## Fase 1 — Contas e serviços (painéis web)

### 1. Netlify
1. [app.netlify.com](https://app.netlify.com) → teu site
2. **Site configuration** → **Environment variables**
3. **Apaga todas** (ou anota e apaga):
   - `VITE_FIREBASE_*`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `FIREBASE_SERVICE_ACCOUNT`
   - `VITE_GA_MEASUREMENT_ID`
   - `GROQ_API_KEY`, `GEMINI_API_KEY`, etc.
4. Opções:
   - **A)** Desligar o site (delete site) — recomendado se vendes só código
   - **B)** Manter demo offline até vender
   - **C)** Transferir site Netlify ao comprador (raro)

### 2. Firebase
1. [console.firebase.google.com](https://console.firebase.google.com) → projeto `sidus-app`
2. Se **não há utilizadores**: **Apagar projeto** (definitivo)
3. Se há utilizadores: exportar o que precisas → apagar dados → depois apagar projeto
4. O comprador cria **projeto Firebase novo**

### 3. Stripe
1. [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Desactiva** webhooks apontados a `sidusastro.com/api/stripe-webhook`
3. A tua conta Stripe **não passa** — o comprador cria a dele
4. (Opcional) Muda para modo só teste até vender

### 4. Google Analytics
1. Apaga propriedade "Sidus" **ou** deixa na tua conta (não interfere)
2. Remove `VITE_GA_MEASUREMENT_ID` do Netlify

### 5. AdSense
1. Remove o site `sidusastro.com` do painel AdSense **ou** deixa (domínio é teu)
2. O comprador cria conta AdSense dele

### 6. reCAPTCHA
1. [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Remove domínios `sidusastro.com` da chave **ou** deixa (comprador cria chave nova)

### 7. Domínio
- **Não incluído na venda:** mantém `sidusastro.com`, comprador usa domínio dele
- **Incluído:** transferência no registrador (GoDaddy, etc.) após pagamento

---

## Fase 2 — Limpar o código (GitHub)

### Ficheiros a APAGAR antes de entregar

| Ficheiro | Porquê |
|----------|--------|
| `docs/GUIA-COMPLETO.md` | Os teus planos pessoais de venda |
| `docs/VENDA.md` | Anúncio e preços (opcional apagar) |
| `.env` (se existir) | Chaves secretas — **nunca entregar** |

### Ficheiros a EDITAR (dados teus no código)

| Ficheiro | O que mudar |
|----------|-------------|
| `src/lib/premiumAccess.js` | **Apagar** emails `tiagosgama90@gmail.com` e `helenaccprieto@gmail.com` — lista vazia `[]` |
| `src/lib/i18n/privacy.js` | Trocar `suporte.sidusapp@gmail.com` → `support@example.com` (placeholder) |
| `src/lib/i18n/pt.js` e `en.js` | Trocar email de suporte nos textos de pagamento |
| `public/privacy.html` | Email e domínio → placeholders |
| `index.html` | Remover meta `google-adsense-account` com o teu `ca-pub-...` |
| `netlify.toml` | Remover `VITE_ADSENSE_CLIENT` e `VITE_ADSENSE_SLOT` (valores teus) |
| `src/lib/adsense.js` | Remover `ADSENSE_PUBLISHER` hardcoded — só usar env |
| `public/ads.txt` | Apagar ou substituir pelo publisher ID do comprador |
| `.env.example` | Valores genéricos (`your-project.firebaseapp.com`, `ca-pub-XXXX`) |
| `.firebaserc` | `default` → `your-firebase-project` |
| `scripts/add-firebase-auth-domains.mjs` | Domínios exemplo em vez de sidusastro.com |

### Referências ao domínio `sidusastro.com`

Estão em vários ficheiros (fallbacks de URL). O comprador põe o domínio dele nas env vars `URL` no Netlify. Opcional: substituir por `https://example.com` nos fallbacks.

### Histórico Git

Se alguma vez commitaste `.env` ou chaves:
```bash
# Verificar se há segredos no histórico
git log --all -- .env
```
Se houver: o comprador não deve ter acesso a commits antigos com segredos. Opções:
- Repo **novo** só com código limpo (recomendado)
- Ou `git filter-repo` para apagar ficheiros do histórico

**Mais simples:** criar repositório GitHub **novo** `sidusastro-sale`, push só do código limpo, entregar esse.

---

## Fase 3 — O que entregar ao comprador

### Pacote mínimo
- [ ] Repositório GitHub (privado → convite → transfer ownership após pagamento)
- [ ] `.env.example` preenchido com **placeholders**, não chaves reais
- [ ] `README.md` curto: `npm install`, `npm run build`, variáveis Netlify, criar Firebase/Stripe
- [ ] Screenshots ou vídeo demo (opcional)

### Mensagem padrão na entrega
```
Incluído: código-fonte, netlify.toml, firestore.rules, .env.example

NÃO incluído:
- Contas Firebase, Stripe, Netlify, AdSense, Analytics
- Domínio sidusastro.com (a menos que combinado)
- Dados de utilizadores

O comprador cria contas novas e segue .env.example.
Suporte: [X dias] por email para dúvidas de instalação.
```

---

## Fase 4 — Verificação final (antes de enviar GitHub)

- [ ] `grep -r "tiagosgama" .` → zero resultados
- [ ] `grep -r "suporte.sidusapp" .` → zero ou só placeholders
- [ ] `grep -r "ca-pub-2807052149540484" .` → zero
- [ ] `grep -r "sk_live\|sk_test" .` → zero
- [ ] Ficheiro `.env` não existe no repo
- [ ] `docs/GUIA-COMPLETO.md` apagado
- [ ] `premiumAccess.js` sem emails pessoais
- [ ] Netlify sem env vars tuas (ou site apagado)

---

## Ordem recomendada no dia da venda

```
1. Receber pagamento (Stripe Link / PayPal)
2. Limpar código (checklist acima)
3. Push para repo novo ou branch clean
4. Convidar comprador no GitHub
5. Apagar env vars Netlify / desligar site teu
6. Apagar projeto Firebase (se vazio)
7. Transferir domínio (só se vendido)
8. Confirmar ao comprador — fim
```

---

## O que a conversa Cursor NÃO inclui

A conversa do Cursor **não vai** no GitHub. Só os ficheiros `docs/*.md` se não os apagares. Apaga `GUIA-COMPLETO.md` e `VENDA.md` antes de vender se não quiseres que o comprador veja.

---

## Resumo em 3 frases

1. **Tiras** chaves do Netlify e emails teus do código.
2. **Entregas** repo limpo + `.env.example` — comprador cria contas.
3. **Ficas** com Firebase, Stripe, domínio e Analytics (ou apagas o que não precisas).
