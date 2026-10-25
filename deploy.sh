#!/usr/bin/env bash
#
# Despliega ArnoTienda al VPS de producción (https://tienda.arno.services).
#
# Uso (desde la raíz del proyecto):
#   ./deploy.sh              # sube y reinicia todo: web + servidor de la tienda
#   ./deploy.sh frontend     # solo la web (más rápido)
#   ./deploy.sh backend      # solo el servidor de la tienda
#   ./deploy.sh check        # revisa que todo esté listo SIN cambiar nada
#
# Requisitos: tu clave SSH autorizada en el servidor. Explicación completa en DEPLOY.md.

set -euo pipefail

SERVER="${DEPLOY_SERVER:-root@169.58.235.118}"
REMOTE_DIR="${DEPLOY_REMOTE_DIR:-/root/arnotienda}"
URL="${DEPLOY_URL:-https://tienda.arno.services}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Lo que sube cada parte. docker-compose.yml NO está aquí a propósito: el del
# servidor es el que manda (ahí viven las claves) y el deploy nunca lo pisa.
FRONT_PATHS=(src index.html package.json package-lock.json vite.config.ts tsconfig.json nginx.conf Dockerfile)
BACK_PATHS=(server Dockerfile.backend)

EXCLUDES=(
  --exclude='node_modules'
  --exclude='dist'
  --exclude='*.sqlite'
  --exclude='*.sqlite3'
  --exclude='*.tsbuildinfo'
  --exclude='.git'
)

UNHEALTHY=0

say()  { printf '==> %s\n' "$*"; }
fail() { printf '❌ %s\n' "$*" >&2; exit 1; }

ssh_run() { ssh -o BatchMode=yes -o ConnectTimeout=15 "$SERVER" "$@"; }

# Antes de tocar nada: que existan los archivos locales y que el servidor responda.
# (Sin esto, un deploy desde una carpeta incompleta subiría una carpeta vacía.)
preflight() {
  local p
  for p in "$@"; do
    [ -e "$p" ] || fail "Falta '$p' en $(pwd). Ejecuta el deploy desde la carpeta completa del proyecto."
  done
  ssh_run "test -f '$REMOTE_DIR/docker-compose.yml'" \
    || fail "No pude entrar a $SERVER o no existe $REMOTE_DIR/docker-compose.yml. Revisa tu clave SSH."
}

# Sube los archivos a una carpeta temporal del servidor y SOLO si llegaron
# completos reemplaza los de producción. La versión anterior queda en .previous.
sync_files() {
  local paths=("$@")
  say "Subiendo (${paths[*]}) a $SERVER:$REMOTE_DIR ..."

  tar czf - "${EXCLUDES[@]}" "${paths[@]}" \
    | ssh_run "rm -rf '$REMOTE_DIR/.incoming' && mkdir -p '$REMOTE_DIR/.incoming' && tar xzf - -C '$REMOTE_DIR/.incoming'"

  ssh_run "cd '$REMOTE_DIR' && mkdir -p .previous && for p in ${paths[*]}; do rm -rf \".previous/\$p\"; if [ -e \"\$p\" ]; then mv \"\$p\" \".previous/\$p\"; fi; mv \".incoming/\$p\" \"\$p\"; done && rm -rf .incoming"
}

build_frontend() {
  say "Reconstruyendo la WEB ..."
  ssh_run "cd '$REMOTE_DIR' && docker compose up -d --build --no-deps tienda-frontend"
}

build_backend() {
  say "Reconstruyendo el SERVIDOR de la tienda ..."
  ssh_run "cd '$REMOTE_DIR' && docker compose up -d --build --no-deps tienda-backend"
  # El nginx de la web memoriza dónde está el servidor al arrancar; si este se
  # recreó, hay que reiniciarlo o respondería 502 hasta el próximo reinicio.
  ssh_run "cd '$REMOTE_DIR' && docker compose restart tienda-frontend"
}

check_health() {
  local check_url="$1" name="$2" code="error" i
  say "Verificando $name en $check_url ..."
  for i in 1 2 3 4 5 6 7 8; do
    code="$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$check_url" 2>/dev/null || true)"
    [ "$code" = "200" ] && break
    sleep 3
  done
  echo "    $check_url -> HTTP $code"
  if [ "$code" = "200" ]; then
    echo "✅ $name responde bien (HTTP 200)."
  else
    echo "⚠️  $name no respondió HTTP 200."
    UNHEALTHY=1
  fi
}

check_only() {
  preflight "${FRONT_PATHS[@]}" "${BACK_PATHS[@]}"
  say "El servidor responde y la carpeta $REMOTE_DIR existe."
  ssh_run "cd '$REMOTE_DIR' && docker compose config -q" && say "El docker-compose del servidor es válido."
  ssh_run "docker ps --format '    {{.Names}}: {{.Status}}' | grep -i tienda" || true
  check_health "$URL" "La web"
  check_health "$URL/api/products" "El servidor de la tienda"
  say "Revisión terminada. No se cambió nada."
}

tidy_images() {
  # Cada build deja la imagen anterior sin nombre; se borran para no llenar el disco.
  ssh_run "docker image prune -f >/dev/null" || true
}

main() {
  local target="${1:-all}"
  cd "$ROOT"

  case "$target" in
    frontend)
      preflight "${FRONT_PATHS[@]}"
      sync_files "${FRONT_PATHS[@]}"
      build_frontend
      check_health "$URL" "La web"
      ;;
    backend)
      preflight "${BACK_PATHS[@]}"
      sync_files "${BACK_PATHS[@]}"
      build_backend
      check_health "$URL/api/products" "El servidor de la tienda"
      ;;
    all)
      preflight "${FRONT_PATHS[@]}" "${BACK_PATHS[@]}"
      sync_files "${FRONT_PATHS[@]}"
      sync_files "${BACK_PATHS[@]}"
      build_backend
      build_frontend
      check_health "$URL" "La web"
      check_health "$URL/api/products" "El servidor de la tienda"
      ;;
    check)
      check_only
      return 0
      ;;
    *)
      echo "Uso: ./deploy.sh [all|frontend|backend|check]"
      exit 1
      ;;
  esac

  tidy_images
  echo ""
  if [ "$UNHEALTHY" -eq 0 ]; then
    echo "✅ Proceso finalizado. Si no ves los cambios, recarga con Ctrl+F5."
  else
    echo "⚠️  Proceso finalizado, pero algo no respondió bien. Mira DEPLOY.md > 'Si algo falla'."
    exit 1
  fi
}

# Solo se ejecuta si lo corres tú; si otro script lo importa, no hace nada solo.
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
