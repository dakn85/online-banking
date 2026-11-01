# Kernbank

> Vorerst als Ordner `kernbank/` im Repo des Online-Bankings: eigenes System und eigene Domäne in KnippQAi, eigener Dienst und eigene Akzeptanztests; nur das Repo (und sein Zugang) ist geteilt. Zieht die Kernbank in ein eigenes Repo um, bleibt der Inhalt dieses Ordners gleich.

Das Kernbanksystem der Aventa Bank: Es führt die Konten und Buchungen der Privatkunden und liefert sie an das Online-Banking, über REST und als Kafka-Ereignisse. Der Stand der Vorlage ist nur der Rahmen ohne Fachlichkeit: ein Dienst ohne Oberfläche mit `GET /api/version` und `GET /health`, Daten im Speicher und ein Platzhalter für Ereignisse. Konten, Buchungen, Termin- und Daueraufträge kommen mit den Stories.

## Starten

```sh
npm ci
npm run dev                    # http://localhost:8080, Testbetrieb
npm test                       # Unit-Tests (node:test)
scripts/testumgebung.sh        # Docker, http://localhost:18400
```

| Variable | Bedeutung |
|---|---|
| `PORT` | Port des Dienstes, Standard 8080 |
| `VERSION` | Commit des Stands, den `GET /api/version` nennt (im Image per `--build-arg VERSION`) |
| `TEST_MODE` | `1` erlaubt `POST /api/test/reset`: alle Daten im Speicher auf den Ausgangsstand |
| `KAFKA_BROKERS` | Broker, kommagetrennt; ohne die Variable werden Ereignisse nur geloggt. Topics beginnen mit `kernbank.` |

## Aufbau

| Ordner | Inhalt |
|---|---|
| `src/` | Dienst (Node, Express): `app.ts` Routen, `main.ts` Start, `daten.ts` Zurücksetzen, `ereignisse.ts` Kafka |
| `test/` | Unit-Tests mit `node:test` |
| `acceptance/` | Gauge-Akzeptanztests (TypeScript, HTTP ohne Browser) |
| `docs/` | Spezifikation, entsteht mit den Stories in KnippQAi |

## Akzeptanztests

```sh
cd acceptance && npm ci
KERNBANK_URL=http://localhost:18400 gauge run specs
```

`env/default` zielt auf den Dienst im Netz der Plattform (`http://kernbank:8080`); lokal setzt `KERNBANK_URL` die Testumgebung.
