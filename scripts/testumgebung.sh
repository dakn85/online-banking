#!/bin/sh
# Baut das Online-Banking aus dem Arbeitsstand und startet die Testumgebung neu: http://localhost:18300.
# Läuft die Plattform lokal (Docker-Netz knippqai-test-targets), erreicht sie den Dienst dort als http://online-banking:8080.
# Ohne Docker startet der Dienst direkt mit Node (OHNE_DOCKER=1 erzwingt das).
# PORT, NAME (Container) und NETZ (Docker-Netz der Plattform, leer = keins) lassen sich setzen.
set -e
cd "$(dirname "$0")/.."
VERSION=$(git rev-parse --short HEAD)$(git diff --quiet HEAD -- src public package.json package-lock.json Dockerfile || echo "+lokal")
PORT=${PORT:-18300}
NAME=${NAME:-banking_online-banking_1}
NETZ=${NETZ-knippqai-test-targets}

bereit() {
  for i in $(seq 1 30); do
    if [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/api/version || true)" = 200 ]; then
      echo "Testumgebung läuft mit $VERSION: http://localhost:$PORT"
      return 0
    fi
    sleep 1
  done
  return 1
}

if [ -z "$OHNE_DOCKER" ] && docker info >/dev/null 2>&1; then
  docker build -q --build-arg VERSION="$VERSION" -t banking/online-banking:dev . >/dev/null
  docker rm -f "$NAME" >/dev/null 2>&1 || true
  ANSCHLUSS=""
  if [ -n "$NETZ" ] && docker network inspect "$NETZ" >/dev/null 2>&1; then
    ANSCHLUSS="--network $NETZ --network-alias online-banking"
  fi
  # shellcheck disable=SC2086
  docker run -d --name "$NAME" $ANSCHLUSS -p "$PORT":8080 -e TEST_MODE=1 banking/online-banking:dev >/dev/null
  bereit && exit 0
  echo "Online-Banking antwortet nicht" >&2
  docker logs --tail 30 "$NAME" >&2
  exit 1
fi

# Ohne Docker: bauen und im Hintergrund starten; die PID liegt in .testumgebung.pid.
[ -f .testumgebung.pid ] && kill "$(cat .testumgebung.pid)" 2>/dev/null || true
[ -d node_modules ] || npm ci --no-audit --no-fund
npm run build >/dev/null
PORT=$PORT TEST_MODE=1 VERSION="$VERSION" nohup node dist/main.js > .testumgebung.log 2>&1 &
echo $! > .testumgebung.pid
bereit && exit 0
echo "Online-Banking antwortet nicht" >&2
tail -30 .testumgebung.log >&2
exit 1
