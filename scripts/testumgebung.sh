#!/bin/sh
# Baut das Online-Banking aus dem Arbeitsstand und startet die Testumgebung neu.
# Die Akzeptanztests der Plattform erreichen sie unter http://online-banking:8080,
# lokal läuft sie unter http://localhost:18300.
set -e
cd "$(dirname "$0")/.."
VERSION=$(git rev-parse --short HEAD)$(git diff --quiet HEAD -- src public package.json package-lock.json Dockerfile || echo "+lokal")
docker build -q --build-arg VERSION="$VERSION" -t banking/online-banking:dev . >/dev/null
docker rm -f banking_online-banking_1 >/dev/null 2>&1 || true
docker run -d --name banking_online-banking_1 \
  --network knippqai-test-targets --network-alias online-banking \
  -p 18300:8080 -e TEST_MODE=1 \
  banking/online-banking:dev >/dev/null
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:18300/api/version || true)
  if [ "$code" = 200 ]; then
    echo "Testumgebung läuft mit $VERSION: http://localhost:18300"
    exit 0
  fi
  sleep 1
done
echo "Online-Banking antwortet nicht" >&2
docker logs --tail 30 banking_online-banking_1 >&2
exit 1
