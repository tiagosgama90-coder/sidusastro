#!/usr/bin/env bash
# Netlify: exit 0 = cancelar build, exit 1 = fazer build.
# Se só mudaram regras Firebase / workflow CI, poupa um deploy Netlify.

set -euo pipefail

if [ -z "${CACHED_COMMIT_REF:-}" ] || [ -z "${COMMIT_REF:-}" ]; then
  exit 1
fi

changed="$(git diff --name-only "$CACHED_COMMIT_REF" "$COMMIT_REF" || true)"

if [ -z "$changed" ]; then
  exit 0
fi

while IFS= read -r file; do
  [ -z "$file" ] && continue
  case "$file" in
    firestore.rules|firebase.json|.firebaserc|.github/workflows/deploy-firestore-rules.yml)
      ;;
    *)
      exit 1
      ;;
  esac
done <<< "$changed"

exit 0
