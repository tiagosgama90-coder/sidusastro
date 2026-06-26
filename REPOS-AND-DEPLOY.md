# Sidus — tudo online (não dependes do PC)

Guia rápido: onde vive cada coisa e como fazer alterações sem perder o site.

## Repositórios GitHub (código)

| Repo | URL | Para quê |
|------|-----|----------|
| **sidusastro** | https://github.com/tiagosgama90-coder/sidusastro | **Produção** — Netlify faz deploy da branch `master` |
| **sidus-app** | https://github.com/tiagosgama90-coder/sidus-app | Cópia de desenvolvimento (mesmo código) |
| **sidusastro-handover** | https://github.com/tiagosgama90-coder/sidusastro-handover | **Venda** — pacote limpo para compradores (privado) |

Podes apagar as pastas locais e recuperar tudo com:

```bash
git clone https://github.com/tiagosgama90-coder/sidusastro.git
git clone https://github.com/tiagosgama90-coder/sidus-app.git
git clone https://github.com/tiagosgama90-coder/sidusastro-handover.git
```

## O que mantém o site no ar (nuvem)

| Serviço | O que guarda |
|---------|----------------|
| **Netlify** | Hosting + build + variáveis de ambiente (Stripe, Firebase, GA4, reCAPTCHA) |
| **Firebase** | Utilizadores, Firestore, Auth |
| **Stripe** | Pagamentos |
| **Namecheap** | Domínio sidusastro.com |
| **Google Analytics** | Métricas (G-18FPC8HYE8) |

O site **não corre no teu computador**. Apagar a pasta local **não desliga** sidusastro.com.

## Como fazer alterações no futuro

1. `git clone` do repo **sidusastro** (ou sidus-app)
2. Editar código
3. `git add` → `git commit` → `git push` para **sidusastro** `master`
4. Netlify faz deploy automático (2–5 min)

**Sim — as alterações devem sempre passar pelo repositório + push.** Editar só no PC sem push **não** atualiza o site.

## Pacote de venda (regenerar)

```bash
cd sidus-app
node scripts/export-sale-package.mjs
cd ../sidusastro-sale
git add . && git commit -m "Update handover" && git push
```

## Segredos (nunca no Git)

Chaves reais estão em **Netlify → Environment variables** e nas consolas Firebase/Stripe. O repo só tem `.env.example`.

## Checklist antes de apagar o PC local

- [ ] `git push` feito em sidusastro e sidus-app
- [ ] sidusastro-handover actualizado na venda
- [ ] Netlify deploy verde em https://app.netlify.com
- [ ] Site abre: https://sidusastro.com
- [ ] Tens acesso a Namecheap, Netlify, Firebase, Stripe, GitHub (browser)
