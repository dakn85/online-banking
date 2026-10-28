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
cd acceptance && npm ci && gauge run specs
```

`env/default` zielt auf die lokale Testumgebung, `env/platform` auf den Dienst im Netz der Plattform.
