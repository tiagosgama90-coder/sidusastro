# Publicar o pacote de venda (repo separado)

O código limpo está na branch **`cursor/sale-package-1ca8`**.

O teu site original **não é afectado**.

## Criar repo novo no GitHub

1. GitHub → **New repository** → nome: `sidusastro-sale` → **Private** → sem README
2. No terminal:

```bash
git clone https://github.com/tiagosgama90-coder/sidusastro.git
cd sidusastro
git fetch origin cursor/sale-package-1ca8
git checkout cursor/sale-package-1ca8

git remote add sale https://github.com/tiagosgama90-coder/sidusastro-sale.git
git push sale cursor/sale-package-1ca8:main
```

3. Link do pacote de venda: `https://github.com/tiagosgama90-coder/sidusastro-sale`

## Quando venderes

1. Receber pagamento (Flippa escrow / PayPal / Stripe Link)
2. Namecheap → sidusastro.com → Unlock → Auth code ao comprador
3. Repo `sidusastro-sale` → Settings → Invite collaborator (ou Transfer)
4. Apagar env vars no **teu** Netlify + remover domínio

## Branches

| Branch | Uso |
|--------|-----|
| `master` | O teu site actual (manténs) |
| `cursor/analytics-venda-docs-1ca8` | Docs teus (Flippa, guias) |
| `cursor/sale-package-1ca8` | **Só para o comprador** |

Anúncio Flippa: `docs/SELLER-FLIPPA-LISTING.md`
