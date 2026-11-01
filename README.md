# Online-Banking

Das Online-Banking der Aventa Bank für Privatkunden. Der Stand der Vorlage: Anmeldung mit Kennung und PIN (Demo-Kunden, noch ohne Kernbanksystem), der Rahmen mit Navigation und je ein Platzhalter für Finanzstatus und Überweisung.

## Starten

```sh
npm ci
npm run dev                    # http://localhost:8080, Testbetrieb
scripts/testumgebung.sh        # Docker, http://localhost:18300
```

Demo-Zugang: Kennung `lena.hoffmann`, PIN `24680` (weitere in `src/kunden.ts`).

## Aufbau

| Ordner | Inhalt |
|---|---|
| `src/` | Dienst (Node, Express): Anmeldung, Sitzung, Seiten und API |
| `public/` | Oberfläche: `anmelden.html`, der Rahmen `app.html` mit `app.js`; jede Seite meldet sich mit `Aventa.seite(pfad, …)` an |
| `acceptance/` | Gauge-Akzeptanztests (TypeScript, Playwright) |
| `docs/` | Spezifikation, entsteht mit den Stories in KnippQAi |

## Akzeptanztests

```sh
scripts/akzeptanztests.sh                          # Dienst bauen und starten, alle Specs
scripts/akzeptanztests.sh specs/ueberweisung.spec  # nur diese Spec
```

Voraussetzungen: Node 22, [Gauge](https://docs.gauge.org/getting_started/installing-gauge) (die Plugins aus `acceptance/manifest.json` installiert Gauge beim ersten Lauf) und Docker; ohne Docker startet der Dienst mit Node. Das Skript nennt am Ende den Stand und den JUnit-Bericht `acceptance/reports/xml-report/result.xml`, den KnippQAi mit `akzeptanztests_melden` als Stufe Entwicklung annimmt.

`env/default` zielt auf die lokale Testumgebung, `env/platform` auf den Dienst im Netz der Plattform. Die Testumgebung der Plattform hält `main`; ein Story-Zweig mit Produktcode wird lokal geprüft.
