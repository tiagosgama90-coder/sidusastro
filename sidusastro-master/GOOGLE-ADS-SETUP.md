# Google Ads - Sidus Astro (sidusastro.com)

Guia para começar a trazer visitantes com orçamento baixo (~5 €/dia) enquanto o site cresce.

---

## O que já tens no site

| Ferramenta | ID / estado |
|---|---|
| **Google Analytics 4** | `G-18FPC8HYE8` (activo após cookies) |
| **Google AdSense** | `ca-pub-2807052149540484` (anúncios no site) |
| **Google Ads (tag)** | Preparado no código - falta o teu ID `AW-...` no Netlify |

**AdSense ≠ Google Ads**

- **AdSense** = Google paga-te quando alguém vê/clica anúncios *no teu* site.
- **Google Ads** = tu pagas ao Google para apareceres nos resultados de pesquisa e na rede de parceiros.

Para trazer pessoas novas, precisas de **Google Ads**.

---

## Passo 1 - Criar conta Google Ads

1. Abre [https://ads.google.com](https://ads.google.com)
2. Usa a mesma conta Google do Analytics/AdSense (facilita ligações).
3. País: **Portugal** | Fuso: **Lisboa**
4. Moeda: **EUR (€)**

---

## Passo 2 - Ligar ao Google Analytics 4

1. Google Ads → **Ferramentas e definições** (ícone chave inglesa) → **Gestor de ligações**
2. **Nova ligação** → **Google Analytics (GA4)** → propriedade `G-18FPC8HYE8`
3. Activa **Importação de conversões do Analytics** (opcional mas útil)

Assim vês no Ads o que acontece no site (registos, mapas calculados, compras).

---

## Passo 3 - Orçamento de 5 €

Com 5 € por dia (~150 €/mês) é um teste controlado. O Google pode gastar até ao limite diário.

**Recomendação para começar:**

| Definição | Valor sugerido |
|---|---|
| Tipo de campanha | **Pesquisa** (Search) - intenção alta |
| Orçamento diário | **5,00 €** |
| Localização | Portugal (ou Portugal + Brasil se quiseres PT) |
| Idioma | Português |
| URL final | `https://sidusastro.com/login` |
| Estratégia de lances | Maximizar conversões (depois de criares conversões) ou **Cliques** no 1.º dia |

**Se quiseres gastar menos:** define **3 €/dia** - o mínimo prático em Portugal costuma ser ~1-2 €/dia.

---

## Passo 4 - Criar campanha (Pesquisa)

1. **Nova campanha** → Objectivo: **Leads** ou **Tráfego do site**
2. Tipo: **Pesquisa**
3. Nome: `Sidus - Mapa Astral PT`
4. Redes: desactiva **Parceiros de pesquisa** no início (só Google Search) - mais controlo
5. **Palavras-chave** (correspondência de frase):

```
"mapa astral grátis"
"calcular mapa astral"
"mapa astral online"
"descobrir ascendente"
"horóscopo personalizado"
"mapa natal"
```

6. **Anúncios** (exemplo - 3 títulos + 2 descrições):

**Títulos (máx. 30 caracteres cada):**
- Mapa Astral Grátis Online
- Sidus - Astrologia Precisa
- Descobre Sol, Lua e Ascendente

**Descrições:**
- Calcula o teu mapa natal com precisão astronómica. Registo grátis.
- Tarot, Oráculo IA e mapa astral completo. Experimenta o Sidus hoje.

**URL:** `https://sidusastro.com/login`

---

## Passo 5 - Conversões (medir resultados)

No Google Ads → **Metas** → **Conversões** → **Nova conversão** → **Website**

Cria 3 acções (tipo **Enviar formulário de lead** ou **Página**):

| Nome | Quando dispara no site |
|---|---|
| `Registo Sidus` | Utilizador cria conta |
| `Mapa calculado` | Onboarding completo (1.º mapa) |
| `Compra` | Pagamento Stripe concluído |

Para cada uma, o Google dá:
- **ID de conversão:** `AW-XXXXXXXXX` (igual para todas)
- **Etiqueta de conversão:** string diferente por acção (ex. `AbCdEfGhIj`)

### Variáveis no Netlify

Site settings → Environment variables → **Production**:

```
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXX
VITE_GOOGLE_ADS_LABEL_SIGNUP=etiqueta_registo
VITE_GOOGLE_ADS_LABEL_MAPA=etiqueta_mapa
VITE_GOOGLE_ADS_LABEL_PURCHASE=etiqueta_compra
```

Depois: **Deploy** → **Trigger deploy** (rebuild).

O código já envia conversões quando o visitante aceita cookies analíticos.

---

## Passo 6 - Verificar que a tag funciona

1. Instala a extensão [Tag Assistant](https://tagassistant.google.com/) no Chrome
2. Abre `https://sidusastro.com` → aceita cookies
3. Confirma que aparecem `G-18FPC8HYE8` e `AW-...`
4. No Google Ads → Conversões → estado **Recentemente activa** (pode demorar 24-48 h)

---

## Passo 7 - O que optimizar na 1.ª semana

Com 5 €/dia espera ~5-15 cliques/dia (astrologia em PT: CPC ~0,30-1,50 €).

**Métricas a vigiar:**

| Métrica | Bom sinal |
|---|---|
| CTR (taxa de cliques) | > 3% em pesquisa |
| Taxa de registo | > 5% dos cliques |
| Custo por registo | < 3 € (ideal < 1,50 €) |
| Mapas calculados | Utilizadores completam onboarding |

**Pausa palavras-chave** que gastam sem registos (Relatórios → Termos de pesquisa).

**Não uses Performance Max** com orçamento tão baixo no início - Pesquisa dá mais controlo.

---

## Alternativa gratuita / complementar

Enquanto testas Ads, continua conteúdo orgânico:

- TikTok / Reels: «Descobre o teu ascendente em 2 minutos → sidusastro.com»
- Pinterest: infográficos por signo
- SEO: páginas `/horoscopo`, blog com signos

O inventário em `scripts/DEPLOY-INVENTORY.md` já lista estas ideias.

---

## Checklist rápido

- [ ] Conta Google Ads criada
- [ ] GA4 ligado (`G-18FPC8HYE8`)
- [ ] Campanha Pesquisa PT, 5 €/dia
- [ ] URL `https://sidusastro.com/login`
- [ ] 3 conversões criadas no Ads
- [ ] `VITE_GOOGLE_ADS_ID` + labels no Netlify
- [ ] Redeploy Netlify
- [ ] Tag Assistant a confirmar `AW-...`

---

## Suporte

- [Centro de ajuda Google Ads](https://support.google.com/google-ads)
- [Política de anúncios - astrologia](https://support.google.com/adspolicy/answer/6008942) - astrologia é permitida; evita promessas médicas/financeiras absolutas
