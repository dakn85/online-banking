#!/bin/sh
# Stufe Entwicklung: Dienst aus dem Arbeitsstand bauen und starten, dann die Akzeptanztests dagegen.
#   scripts/akzeptanztests.sh                          alle Specs
#   scripts/akzeptanztests.sh specs/ueberweisung.spec  nur diese
# Voraussetzung: Node 22, Gauge (die Plugins aus acceptance/manifest.json installiert Gauge beim ersten Lauf),
# Docker (sonst startet der Dienst mit Node).
# Ergebnis: acceptance/reports/xml-report/result.xml (JUnit); KnippQAi nimmt es mit akzeptanztests_melden an.
set -e
cd "$(dirname "$0")/.."
command -v gauge >/dev/null || { echo "Gauge fehlt: https://docs.gauge.org/getting_started/installing-gauge" >&2; exit 2; }
scripts/testumgebung.sh

cd acceptance
[ -d node_modules ] || npm ci --no-audit --no-fund
npx --no-install playwright install chromium >/dev/null
rm -rf reports
status=0
BANKING_URL=http://localhost:${PORT:-18300} gauge run --env default "${@:-specs}" || status=$?

echo
echo "Stand: $(git rev-parse HEAD)$(git diff --quiet HEAD || echo ' (mit ungespeicherten Änderungen: nicht melden)')"
echo "Ergebnis: acceptance/$(find reports -name '*.xml' -path '*xml-report*' | head -1)"
exit $status
