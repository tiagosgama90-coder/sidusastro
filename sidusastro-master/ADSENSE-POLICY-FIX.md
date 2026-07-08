# AdSense — Correção de violações de política

Documento para pedir **revisão do site** no painel Google AdSense após deploy.

## O que o Google reportou

1. **Anúncios em telas sem conteúdo do editor** — login, navegação da app, ecrãs de carregamento
2. **Conteúdo de baixo valor** — site principalmente app SPA sem artigos públicos suficientes

## O que foi corrigido (Julho 2026)

| Antes | Depois |
|-------|--------|
| AdSense na app (utilizador logado: tarot, mapa, chat…) | **Removido** da SPA inteira |
| AdSense após aceitar cookies em qualquer ecrã | **Removido** de `/login`, `/tarot`, etc. |
| Pouco conteúdo indexável | **4 guias editoriais** em HTML estático |
| FAQ curto na landing | FAQ expandido (6 perguntas) + secção «Guias de Astrologia» |

## Onde os anúncios aparecem agora

**Apenas** em páginas com artigo completo (conteúdo editorial):

- https://sidusastro.com/guia/mapa-astral.html
- https://sidusastro.com/guia/ascendente.html
- https://sidusastro.com/guia/signos-zodiaco.html
- https://sidusastro.com/guia/tarot-guia.html

Cada página tem 700–1200 palavras, navegação entre guias, CTA para `/login` e **um** bloco AdSense **depois** do artigo (nunca em formulários ou menus).

## Passos para ti

1. **Fazer deploy** — push para `sidusastro` `master` (Netlify rebuild)
2. **Verificar** que as 4 URLs abrem com texto completo (não redireccionam para login)
3. **AdSense** → Sites → sidusastro.com → **Pedir revisão**
4. Marcar **«Confirmo que corrigi os problemas»**
5. Na mensagem opcional, escrever:

   > Removemos anúncios da aplicação (login, navegação, ferramentas). Os anúncios estão apenas em páginas editoriais estáticas em /guia/ com artigos sobre astrologia. A homepage inclui guias e FAQ expandido.

6. Aguardar **3–14 dias** (revisão manual)

## URLs para o revisor Google

Envia estas páginas como exemplos de **conteúdo de qualidade**:

```
https://sidusastro.com/guia/mapa-astral.html
https://sidusastro.com/login
```

A `/login` **não tem anúncios** — mostra valor editorial (FAQ, testemunhos, links para guias).

## Não fazer antes da aprovação

- ❌ Voltar a colocar AdSense dentro da app (tarot, dashboard, chat)
- ❌ Auto Ads em `index.html` sem controlar páginas
- ❌ Anúncios em ecrãs de paywall, onboarding ou verificação de email

## Depois da aprovação

Podes criar mais guias em `public/guia/` (numerologia, sinastria, etc.) e adicionar ao `sitemap.xml`. Mantém a regra: **anúncio só após conteúdo editorial substancial**.
