# Online-Banking

Das Online-Banking der Aventa Bank für Privatkunden. Der Stand der Vorlage: Anmeldung mit Kennung und PIN (Demo-Kunden, noch ohne Kernbanksystem), der Rahmen mit Navigation und je ein Platzhalter für Finanzstatus und Überweisung.

## Starten

```sh
npm ci
npm run dev                    # http://localhost:8080, Testbetrieb
scripts/testumgebung.sh        # Docker, http://localhost:18300
```

## Zugänge

Alle Zugänge sind öffentliche Testdaten, es gibt noch kein Kernbanksystem.

| Kennung | PIN | Wofür |
|---|---|---|
| `lena.hoffmann` | `24680` | Demo und Akzeptanztests: Girokonto, Kreditkarte, Demo-Umsätze |
| `jonas.weber` | `13579` | Demo und Akzeptanztests: eigene Kopie von Lenas Konten (eigene IBANs), 50 Empfängervorlagen |
| `lasttest-001` … `lasttest-300` | `LASTTEST_PIN`, Vorgabe `97531` | Lasttests, nur mit `TEST_MODE=1`: je ein Girokonto mit 10.000 € und Dispositionsrahmen 1.000 €, ohne Umsätze |

Die Vorgabe-PIN der Lastkunden ist öffentlich und nur für die Testumgebung gedacht; wer sie dort ändern will, setzt `LASTTEST_PIN`. Ohne `TEST_MODE=1` gibt es die Lastkunden nicht.

Im Testbetrieb setzt `POST /api/test/reset` nur die Demo-Kundinnen zurück (Akzeptanztests) und `POST /api/test/lasttest/reset` nur die Lastkunden (vor und nach einem Lastlauf); beide antworten mit 204 und lassen die andere Gruppe stehen. Für Lastkunden hält der Dienst je Konto die jüngsten 200 Umsätze und je Kundin die jüngsten 200 Auftrags-Kennungen. Sitzungen laufen nicht ab: Ein Lastskript meldet sich je virtuellem Nutzer einmal an (`POST /api/anmeldung`, Cookie `aventa_sitzung`), nicht je Iteration. Einzelheiten in `docs/architecture.md` unter „Testbetrieb und Daten je Kundin“.

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
