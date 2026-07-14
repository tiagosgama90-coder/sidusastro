#!/bin/bash
# Gera ZIP para upload no BuiltByBit
cd "$(dirname "$0")"
OUT="BalancedSurvival-Shop-v1.zip"
rm -f "$OUT"
cd EconomyShopGUI-BalancedSurvival
zip -r "../$OUT" sections shops INSTALL.md
cd ..
echo "Created: $(pwd)/$OUT"
ls -lh "$OUT"
