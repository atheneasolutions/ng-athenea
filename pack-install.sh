#!/usr/bin/env bash
set -euo pipefail

# === Config según tu repo ===
BUILD_CMD="${BUILD_CMD:-npm run build @components/atheneaform}"   # comando de build en raíz
LIB_DIST_DIR="${LIB_DIST_DIR:-./dist/components/atheneaform}" # carpeta de la lib ya construida
PLAYGROUND_DIR="${PLAYGROUND_DIR:-./playground}"               # carpeta del playground

log() { printf "\033[1;34m[pack]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[err]\033[0m %s\n" "$*" >&2; exit 1; }

get_pkg_field() {
  local pj="$1" field="$2" val=""
  if command -v jq >/dev/null 2>&1; then
    val="$(jq -r ".${field} // empty" "$pj" 2>/dev/null || true)"
  else
    val="$(grep -E "\"$field\" *:" "$pj" | head -n1 | sed -E 's/.*"'$field'"\s*:\s*"([^"]+)".*/\1/')"
  fi
  echo "$val"
}

# 1) Limpiar dist en raíz y caché angular
log "Limpiando ./dist y caché Angular (raíz)…"
rm -rf ./dist ./.angular/cache || true

# 2) Build de la librería
log "Build de la librería → $BUILD_CMD"
bash -lc "$BUILD_CMD"

# 3) Empaquetar en dist
[[ -d "$LIB_DIST_DIR" ]] || err "No existe $LIB_DIST_DIR. ¿Build correcto?"
PKG_JSON="$LIB_DIST_DIR/package.json"
[[ -f "$PKG_JSON" ]] || err "No existe $PKG_JSON."

PKG_NAME="$(get_pkg_field "$PKG_JSON" name)"
[[ -n "$PKG_NAME" ]] || err "No pude leer 'name' en $PKG_JSON"

# versión única y pack
( cd "$LIB_DIST_DIR" && npm version prerelease --preid="dev.$(date +%s)" --no-git-tag-version >/dev/null )
TARBALL_NAME="$(cd "$LIB_DIST_DIR" && npm pack --silent)"
[[ -n "$TARBALL_NAME" ]] || err "npm pack no devolvió nombre de archivo."
LIB_DIST_ABS="$(cd "$LIB_DIST_DIR" && pwd)"
TARBALL_ABS="$LIB_DIST_ABS/$TARBALL_NAME"
log "Tarball generado: $TARBALL_ABS"

# 4) Instalar en playground
[[ -d "$PLAYGROUND_DIR" ]] || err "No existe $PLAYGROUND_DIR"
log "Instalando en $PLAYGROUND_DIR …"
(
  cd "$PLAYGROUND_DIR"
  npm remove "$PKG_NAME" >/dev/null 2>&1 || true

  # si apuntaba a file:../dist, rehacer lock + node_modules
  if [[ -f package.json ]] && grep -q 'file:\.\./dist/components' package.json; then
    rm -f package-lock.json
    rm -rf node_modules
    npm i
  fi

  npm i "$TARBALL_ABS"

  # limpiar cachés del playground
  npx ng cache clean || true
  rm -rf .angular/cache node_modules/.vite node_modules/.cache || true
)

# 5) cd al playground y lanzar ionic serve sin depender del PATH
log "Arrancando ionic serve desde $PLAYGROUND_DIR … (Ctrl+C para salir)"
cd "$PLAYGROUND_DIR"

if [[ -x "./node_modules/.bin/ionic" ]]; then
  ./node_modules/.bin/ionic serve
else
  npx -y ionic@latest serve
fi
