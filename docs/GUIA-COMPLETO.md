# Guia completo Sidus — venda, analytics, pagamentos

> **Como aceder noutro computador:** abre o repositório GitHub  
> `https://github.com/tiagosgama90-coder/sidusastro`  
> e vai a `docs/GUIA-COMPLETO.md` (este ficheiro).  
> Também existem: `docs/VENDA.md`, `docs/ANALYTICS.md`  
> No Cursor: painel esquerdo → Chat → conversas anteriores (mesma conta).

---

## Índice

1. [O que é o projeto Sidus](#1-o-que-é-o-projeto-sidus)
2. [Onde e a quanto vender](#2-onde-e-a-quanto-vender)
3. [O que vendes vs o que NÃO vendes](#3-o-que-vendes-vs-o-que-não-vendes)
4. [Google Analytics — o que é e como configurar](#4-google-analytics)
5. [Receber dinheiro da VENDA do site (não confundir com Stripe do Sidus)](#5-receber-dinheiro-da-venda-do-site)
6. [Flippa — conta e payout](#6-flippa)
7. [Não podes usar conta bancária — alternativas](#7-sem-conta-bancária)
8. [Plano URGENTE — vender esta semana](#8-plano-urgente)
9. [Textos prontos a copiar](#9-textos-prontos)
10. [Perguntas frequentes](#10-faq)

---

## 1. O que é o projeto Sidus

App web completa de astrologia / bem-estar espiritual:

| Área | Detalhe |
|------|---------|
| Frontend | ~16.000 linhas React + Vite |
| Backend | 9 Netlify Functions |
| Funcionalidades | Mapa astral, tarot, sinastria, numerologia, oráculo IA, sonhos, biorritmo, horas iguais, PDF |
| Monetização no site | Stripe (€2 tarot, €10 mapa, €9,99/mês premium) + AdSense |
| Infra | Firebase Auth/Firestore, Netlify, i18n PT/EN |
| Demo | https://sidusastro.com |

**Situação actual:** sem tráfego, sem utilizadores, Stripe do site já configurado pelo vendedor.

---

## 2. Onde e a quanto vender

### Preços realistas (sem tráfego/receita)

| Cenário | Preço |
|---------|-------|
| Venda rápida (1–3 semanas) | **€750 – €990** |
| Venda normal | €1.200 – €1.500 |
| Venda paciente (Flippa só) | €2.000 – €2.500 (2–4+ meses) |
| Com receita futura (ex. €500/mês) | €12.000 – €24.000 |

### Onde publicar

| Canal | Velocidade | Notas |
|-------|------------|-------|
| **Venda directa** (Instagram, OLX, Facebook) | **Mais rápido** | Contactar pessoas directamente |
| SideProjectors.com | Médio | Grátis, inglês |
| Flippa.com | Lento | 1–4 meses típico |
| Reddit r/SideProject | Médio | Inglês, $USD |
| LinkedIn | Médio | Coaches / astrologia |

---

## 3. O que vendes vs o que NÃO vendes

### ✅ Incluído na venda
- Código-fonte (GitHub ou ZIP)
- Design UI completo
- Integração Stripe (código)
- Firebase rules, Netlify config
- i18n PT + EN
- `docs/`, `.env.example`

### ❌ NÃO incluído (fica contigo)
- Conta Firebase do vendedor
- Conta Stripe do vendedor
- Conta Netlify / AdSense do vendedor
- Chaves API pessoais
- Dados de utilizadores (não há nenhuns)
- Conta Google Analytics do vendedor
- Instagram / TikTok do vendedor
- Marca "Sidus" (negociável)

**O comprador cria contas novas** e preenche `.env.example` — o site funciona igual.

**Não estás a vender dados pessoais** — só código.

---

## 4. Google Analytics

### O que consegues perceber
- Quantas pessoas visitam
- De onde vêm (Instagram, TikTok, Google)
- Que páginas vêem
- País, dispositivo (telemóvel/PC)
- Tempo real

### O que NÃO vês
- Nomes, emails (isso é Firebase)
- Quem comprou

### O ID que precisas
Formato: `G-XXXXXXXXXX` (ID de medição GA4)

### Como criar (resumo)
1. [analytics.google.com](https://analytics.google.com)
2. ⚙️ Administrador → **+ Criar propriedade** → "Sidus Astro"
3. Fluxo de dados → **Web** → URL `https://sidusastro.com`
4. Copiar **ID de medição** `G-...`
5. Netlify → Environment variables → `VITE_GA_MEASUREMENT_ID` = `G-...`
6. **Redeploy** obrigatório
7. Testar: janela anónima → Aceitar todos cookies → GA4 → Tempo real

> O teu email pode já ter outro projeto no Analytics — **não apagues**. Cria propriedade **nova** só para Sidus.

### Analytics na venda
- A **tua conta** Analytics **não vai** com a venda
- O comprador cria a conta dele e põe o ID dele
- Remove `VITE_GA_MEASUREMENT_ID` do Netlify quando venderes

Ver também: `docs/ANALYTICS.md`

---

## 5. Receber dinheiro da VENDA do site

⚠️ **Isto é diferente da Stripe do Sidus** (pagamentos de clientes no site).

| | Venda do código | Pagamentos no Sidus |
|--|-----------------|-------------------|
| Quem paga | Comprador do site | Visitantes |
| Onde recebes | PayPal / Flippa / MB Way / Stripe Link | Tua Stripe (já configurada) |

### Flippa (escrow)
1. Comprador paga → dinheiro em conta segura Flippa
2. Tu entregas código
3. Comprador confirma → dinheiro vai para PayPal ou IBAN ligado ao Flippa
4. **Precisas de método de payout ANTES** de aceitar pagamento

### Venda directa (mais rápido)
- PayPal
- Stripe Payment Link (na tua Stripe)
- MB Way / IBAN (combinado com comprador)
- **50% antes, 50% depois** de dar acesso GitHub

**Nunca entregues código antes de pagamento confirmado.**

---

## 6. Flippa

### Criar conta (30 min)
1. [flippa.com](https://flippa.com) → Sign Up
2. Account Settings → nome, país Portugal, telefone
3. **Payout** → PayPal **ou** transferência bancária (IBAN)

### Publicar
- Tipo: Website / SaaS
- Preço rápido: Starting $999, Buy It Now $1.499
- Screenshots + demo sidusastro.com
- Escrever: "Source code only. Accounts NOT included."

### Tempo típico Flippa só
**1–4 meses** (não serve para venda urgente)

Ver texto completo: `docs/VENDA.md`

---

## 7. Sem conta bancária

Se não podes receber no banco tradicional:

| Opção | Como |
|-------|------|
| **PayPal** | Flippa payout PayPal; levantar para cartão ou banco depois |
| **Revolut / Wise** | App, IBAN novo em 15 min, usar no Flippa ou PayPal |
| **Stripe Payment Link** | Criar link €990 na Stripe que já tens |
| **Venda directa PayPal** | Sem Flippa, sem wire internacional |
| **Familiar de confiança** | Último recurso, combinado por escrito |

**No Flippa:** usa **PayPal** em vez de transferência bancária.

---

## 8. Plano URGENTE — vender esta semana

### Preço
- Anunciar: **€990**
- Aceitar: **€750+** se pagarem rápido
- Quinta sem contactos: baixar para **€799**
- Fim de semana: **€699 última oportunidade**

### Hoje (60–180 min)

- [ ] Criar **Stripe Payment Link** €990  
  (dashboard.stripe.com → Payment Links → New)
- [ ] OU criar **PayPal** e link paypal.me
- [ ] Publicar **OLX**
- [ ] Publicar **2 grupos Facebook** PT
- [ ] Listing **SideProjectors.com** ($999)
- [ ] **10 DMs Instagram** (perfis astrologia/tarot/coach)

### Dias 2–7
- Mais 10 DMs/dia
- Repost Facebook
- LinkedIn: 5 mensagens
- Baixar preço se zero respostas

### O que entregar após pagamento
1. Acesso GitHub privado ou ZIP
2. `docs/VENDA.md` + `.env.example`
3. Nota: contas não incluídas

### Tempo realista

| Meta | Probabilidade |
|------|---------------|
| Vender hoje | Baixa — só se alguém responder já |
| Vender esta semana | **Possível** com €799–990 + 20+ contactos |
| Só Flippa à espera | Não fecha esta semana |

---

## 9. Textos prontos

### OLX
```
Vendo código-fonte app web astrologia completa (React).
Mapa astral, tarot, IA, pagamentos Stripe, PT+EN.
Demo: sidusastro.com
Preço: 990€ (negociável). Entrega imediata.
Não inclui contas Firebase/Stripe — só código.
```

### Facebook (grupos empreendedorismo PT)
```
Vendo código-fonte de app web de astrologia que desenvolvi.

Inclui: mapa astral (Placidus, PDF), tarot, sinastria, numerologia,
oráculo IA, sonhos, pagamentos Stripe (subscrição €9,99/mês), PT+EN.

Demo: https://sidusastro.com
Preço: 990€ (negociável). Entrega hoje via GitHub.

NÃO inclui as minhas contas (Firebase, Stripe, Netlify).
O comprador cria as suas — o código está preparado (.env.example).

Contacto: [teu email / WhatsApp]
```

### Instagram DM
```
Olá! Vi o teu perfil no nicho astrologia.
Desenvolvi uma app web completa (mapa astral, tarot, IA, Stripe, PT+EN)
e estou a vender o código para quem queira lançar rápido.
Demo: sidusastro.com — 990€, entrega hoje. Interessa ver?
```

### SideProjectors / Reddit (inglês)
```
Title: [Selling] Complete astrology web app - React, Stripe, AI - $999

Selling source code for Sidus — a full astrology/wellness web app.

Stack: React 19, Vite, Firebase, Netlify Functions, Stripe
Features: Natal chart (Swiss Ephemeris, Placidus, PDF), Tarot, Synastry,
Numerology, AI Oracle chat, Dream interpretation, Biorhythm, i18n PT+EN

Demo: https://sidusastro.com
Price: $999 (negotiable). Instant delivery via GitHub.

NOT included: seller's Firebase, Stripe, Netlify accounts.
Buyer creates own accounts — .env.example provided.

DM or email: [your email]
```

### Stories TikTok / Instagram
```
App de astrologia completa à venda — código-fonte.
Mapa astral, tarot, IA, Stripe. Demo sidusastro.com. 990€. DM!
```

### Mensagem ao fechar negócio
```
Obrigado pelo interesse!

Incluído: código-fonte completo, documentação, .env.example
NÃO incluído: minhas contas Firebase, Stripe, Netlify, Analytics

Demo: https://sidusastro.com
Preço: 990€ — pagamento via [link Stripe/PayPal]

Após confirmação do pagamento envio acesso GitHub em menos de 1 hora.
```

---

## 10. FAQ

**P: Perco os meus dados se vender?**  
R: Não. Vendes código. Firebase, Analytics e dados ficam contigo (ou apagas).

**P: O Analytics vai com a venda?**  
R: Não. Só o código. Comprador cria GA4 dele.

**P: Quanto tempo para vender?**  
R: Flippa só: 1–4 meses. Venda directa €800–990: 1–3 semanas possível.

**P: Não tenho conta bancária para receber da venda?**  
R: PayPal no Flippa, ou Revolut/Wise, ou Stripe Payment Link, ou venda directa PayPal.

**P: O dinheiro fica guardado no site de compras?**  
R: Flippa: escrow até entregares. Precisas PayPal/IBAN ligado para receber. Não fica para sempre.

**P: Stripe do Sidus serve para vender o site?**  
R: Sim — Payment Link na Stripe. Flippa usa PayPal/banco, não a Stripe do site.

**P: Posso adicionar método de receber depois?**  
R: No Flippa: configura ANTES de aceitar pagamento. Venda directa: combinas no momento.

**P: Onde está esta conversa?**  
R: Este ficheiro no GitHub + Cursor chat (mesma conta) + PR #8.

---

## Links úteis

| Recurso | URL |
|---------|-----|
| Repositório | https://github.com/tiagosgama90-coder/sidusastro |
| Demo | https://sidusastro.com |
| Google Analytics | https://analytics.google.com |
| Stripe Dashboard | https://dashboard.stripe.com |
| Flippa | https://flippa.com |
| SideProjectors | https://sideprojectors.com |
| PayPal | https://paypal.com |

---

## Ficheiros no projeto

| Ficheiro | Conteúdo |
|----------|----------|
| `docs/GUIA-COMPLETO.md` | Este guia (resumo de toda a conversa) |
| `docs/VENDA.md` | Anúncio Flippa, preços, FAQ venda |
| `docs/ANALYTICS.md` | Setup GA4 passo a passo |
| `.env.example` | Variáveis que o comprador precisa criar |

---

*Última actualização: Junho 2026 — gerado a partir da conversa Cursor Cloud Agent.*
