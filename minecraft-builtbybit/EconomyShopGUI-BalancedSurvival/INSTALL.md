# Balanced Survival Shop — EconomyShopGUI Config Pack

**150+ items** · **5 categories** · **Balanced economy** (sell ≈ 30% of buy)

## Requirements

- [EconomyShopGUI](https://www.spigotmc.org/resources/economyshopgui.69927/) v6+ (or Premium v5+)
- Economy plugin: **Vault** + EssentialsX / CMI / etc.
- Minecraft **1.18 – 1.21** (material names)

## Installation

1. **Backup** your current shop files:
   ```
   plugins/EconomyShopGUI/sections/
   plugins/EconomyShopGUI/shops/
   ```

2. Copy files from this pack:
   - `sections/*.yml` → `plugins/EconomyShopGUI/sections/`
   - `shops/*.yml` → `plugins/EconomyShopGUI/shops/`

3. **Remove or rename** old section/shop files with the same names if they conflict:
   - Blocks.yml, Ores.yml, Farming.yml, Tools.yml, Redstone.yml

4. Restart server or run:
   ```
   /eshop reload
   ```
   (command may vary by version — check plugin docs)

5. Open shop in-game:
   ```
   /shop
   ```

## Categories

| Category | Items | Main menu slot |
|----------|-------|----------------|
| Blocks | 35 | 10 |
| Ores & Minerals | 22 | 12 |
| Farming & Food | 27 | 14 |
| Tools & Armor | 32 | 16 |
| Redstone & Misc | 32 | 22 |

## Customization

- Edit `buy` and `sell` prices in any `shops/*.yml` file
- Change category icons in `sections/*.yml` under `item:`
- Validate YAML at https://yamlchecker.com before uploading to live server

## Support

Config pack only — no plugin included. For EconomyShopGUI plugin support, see GPPlugins wiki.

## License

Single-server license per purchase. Do not redistribute.
