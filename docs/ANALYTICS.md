# Google Analytics 4 — Sidus

Este guia explica como activar o analytics no teu site e onde ver os dados.

## O que já está feito no código

- O analytics **só carrega** quando o visitante clica em **"Aceitar todos"** no banner de cookies (RGPD).
- Se escolher **"Só cookies essenciais"**, não há tracking — é o comportamento correcto.
- Cada mudança de página na app é registada automaticamente (SPA).

## Passo a passo (15 minutos)

### 1. Criar conta Google Analytics

1. Vai a [analytics.google.com](https://analytics.google.com)
2. Clica **Começar a medir** (ou **Admin** se já tens conta)
3. Cria uma **Conta** (ex.: "Sidus")
4. Cria uma **Propriedade** (ex.: "Sidus Astro")
5. Escolhe **Portugal**, moeda **EUR**
6. Em **Fluxos de dados** → **Web**
7. URL do site: `https://sidusastro.com` (ou o teu domínio)
8. Copia o **ID de medição** — formato `G-XXXXXXXXXX`

### 2. Adicionar o ID no Netlify

1. [app.netlify.com](https://app.netlify.com) → o teu site Sidus
2. **Site configuration** → **Environment variables**
3. Adiciona:
   - **Key:** `VITE_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX` (o teu ID real)
   - **Scopes:** Production (e Deploy Previews se quiseres)
4. Faz **Redeploy** do site (Deploys → Trigger deploy)

### 3. Testar

1. Abre o site em janela anónima
2. Clica **Aceitar todos** no banner de cookies
3. Navega por 2–3 páginas
4. No Google Analytics → **Relatórios** → **Tempo real**
5. Deves ver **1 utilizador activo** em ~30 segundos

> Se não aparecer: confirma que fizeste redeploy depois de adicionar a variável.

## Onde ver os números importantes

| O que queres saber | Onde no GA4 |
|--------------------|-------------|
| Quantas pessoas visitam agora | Relatórios → Tempo real |
| Visitas por dia/semana | Relatórios → Aquisição → Aquisição de tráfego |
| De onde vêm (Instagram, TikTok, Google) | Relatórios → Aquisição → Aquisição de tráfego → Origem/meio da sessão |
| Páginas mais vistas | Relatórios → Engajamento → Páginas e ecrãs |
| País dos visitantes | Relatórios → Utilizador → Dados demográficos |

## Ligação Instagram / TikTok

Para saber se os anúncios trazem tráfego:

1. Nos posts/anúncios, usa sempre o **mesmo link** (ex.: `https://sidusastro.com`)
2. Opcional — links com etiqueta para ver a origem exacta:
   - Instagram: `https://sidusastro.com?utm_source=instagram&utm_medium=social`
   - TikTok: `https://sidusastro.com?utm_source=tiktok&utm_medium=social`
3. No GA4, filtra por **origem/meio da sessão** → verás `instagram / social` ou `tiktok / social`

## Metas mínimas (sugestão)

| Prazo | Meta |
|-------|------|
| 30 dias | 100+ visitas |
| 60 dias | 500+ visitas ou 20+ registos |
| 90 dias | Decidir: continuar marketing ou vender |

## Privacidade

- IP anonimizado activado no código
- Analytics só com consentimento explícito
- Política de privacidade já menciona Google Analytics

## Problemas comuns

| Problema | Solução |
|----------|---------|
| Zero dados | Variável `VITE_GA_MEASUREMENT_ID` no Netlify + redeploy |
| Só eu apareço | Normal no início; partilha o link nas redes |
| Adblocker | Alguns visitantes bloqueiam GA — normal, ~10–30% |
| Dados atrasados | Tempo real é imediato; relatórios completos demoram 24–48h |
