#!/bin/sh
# Baut die Kernbank aus dem Arbeitsstand und startet die Testumgebung neu.
# Die Akzeptanztests der Plattform erreichen sie unter http://kernbank:8080,
# lokal läuft sie unter http://localhost:18400.
set -e
cd "$(dirname "$0")/.."
VERSION=$(git rev-parse --short HEAD)$(git diff --quiet HEAD -- src package.json package-lock.json Dockerfile || echo "+lokal")
docker build -q --build-arg VERSION="$VERSION" -t banking/kernbank:dev . >/dev/null
docker network inspect knippqai-test-targets >/dev/null 2>&1 || docker network create knippqai-test-targets >/dev/null
docker rm -f banking_kernbank_1 >/dev/null 2>&1 || true
docker run -d --name banking_kernbank_1 \
  --network knippqai-test-targets --network-alias kernbank \
  -p 18400:8080 -e TEST_MODE=1 \
  ${KAFKA_BROKERS:+-e KAFKA_BROKERS="$KAFKA_BROKERS"} \
  banking/kernbank:dev >/dev/null
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:18400/api/version || true)
  if [ "$code" = 200 ]; then
    echo "Testumgebung läuft mit $VERSION: http://localhost:18400"
    exit 0
  fi
  sleep 1
done
echo "Kernbank antwortet nicht" >&2
docker logs --tail 30 banking_kernbank_1 >&2
exit 1
