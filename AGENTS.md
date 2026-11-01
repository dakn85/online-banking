# AGENTS.md: Online-Banking

Online-Banking der Aventa Bank für Privatkunden: Anmeldung, Finanzstatus und Überweisung.

Dieses Repo wird mit KnippQAi spezifiziert. Jede Änderung gehört zu einer Story (PK-…) und hat in jedem berührten Repo einen eigenen Zweig, der mit `story/<key>` beginnt; welcher, steht in `story_lesen`. `main` enthält nur, was umgesetzt und durch Akzeptanztests belegt ist.

## Anbindung

KnippQAi ist als MCP-Server angebunden. Den Agenten-Schlüssel legst du in KnippQAi am System „Online-Banking“ unter „Agenten“ an; er gilt nur für dieses System.

```
claude mcp add --transport http knippqai http://localhost/api/agent/mcp --header "Authorization: Bearer <Agenten-Schlüssel>"
```

Werkzeuge:

| Werkzeug | Wofür |
|---|---|
| `story_lesen` {key} | Story mit Satz, Änderungen in diesem System und Akzeptanztests |
| `story_aenderungen` {key, path?} | Was die Story an der Spezifikation unter docs/ ändert (vorher/nachher); bei vielen Änderungen erst eine Übersicht, Details mit path |
| `use_case_lesen` {key, story?} | Ein Use Case, auf main oder im Stand der Story |
| `tests_zu_element` {key, story?} | Welche Szenarien einen Use Case oder eine Regel prüfen, über ihre Tags (UC-…, BR-…) |
| `warum_rot` {spec, szenario} | Warum ein Szenario auf main bricht: letzter grüner Stand, was seither kam, Nachbarsysteme, Ursache (ohne KI) |
| `akzeptanztests` {key} | Szenarien der Story mit Schritten und ob sie implementiert sind |
| `akzeptanztests_starten` {key} | Akzeptanztests der Story auf dem Zweig starten, Stufe Entwicklung; mit Produktcode im Zweig läuft die ganze Suite |
| `akzeptanztests_melden` {key, commit, bericht} | Lokalen Lauf als Stufe Entwicklung melden: JUnit-Bericht von Gauge, gepushter Kopf des Zweigs |
| `pull_request_oeffnen` {key} | Umsetzung fertig und in der Entwicklung grün: Pull Request öffnen; Review, Pipeline und Merge im Git |
| `rueckfrage_stellen` {key, text} | Frage an den Fachbereich; die Antwort erscheint an der Story |
| `rueckfragen_lesen` {key, id?} | Nur der Stand der Rückfragen (offen/beantwortet) mit Antwort; zum Warten auf eine Antwort |
| `rueckmeldung_geben` {key, text, vorschlag?, beleg?, art?, element?} | Melden, was an der Spezifikation nicht stimmt und im Code anders gelöst ist; wartet auf nichts |
| `katalog_suchen` {q?, kinds?, story?} | Elemente der Spezifikation finden (Use Cases, Regeln, Entitäten, Endpunkte, Masken, NFR) |
| `modell_lesen` {q?, bereich?, story?} | Ausschnitt des Modells: was mit einem Element zusammenhängt (Use Case → Operation → Entität, NFR) |
| `api_lesen` {endpoint?, q?, vollstaendig?, abZeile?, story?} | Ein Endpunkt („POST /uebertraege“) als YAML mit seinen Schemas, ein Ereignis („SEND depot.uebertrag.erfasst“) oder die Datei abschnittsweise |
| `datenmodell_lesen` {entity?, tiefe?, story?} | Eine Entität mit ihren Nachbarn |
| `regel_lesen` {key, story?} | Eine Geschäftsregel (BR-…) mit den Use Cases, die sie nennen |
| `maske_lesen` {name?, html?, story?} | Eine Maske mit Feldern, Bindungen, Aktionen und Aufbau; das HTML mit html=true |
| `anforderungen_lesen` {id?, q?, kategorie?, story?} | Qualitätsanforderungen (NFR-…) und Randbedingungen (C-…): ohne Filter eine Übersicht, mit id ganz |
| `vision_lesen` {teil?, story?} | Zweck, Ziele, Nachbarsysteme; teil begrenzt auf einen Abschnitt |
| `verlauf_lesen` {story, path?, key?} | Die Stände der Story aus Git: wer wann welches Element geändert hat |
| `steps_suchen` {q?, offset?, limit?, story?} | Vorhandene Gauge-Steps mit Muster, Parametern, Nutzung und ob sie implementiert sind |
| `stories_am_element` {kind, key} | Welche anderen offenen Stories dasselbe Element ändern (Konflikte früh sehen) |
| `entwurf_abgeben` {key, entwurf} | Vor dem Code: wie du die Story umsetzt (Bausteine aus technik_lesen, Schritte mit UC/BR, Änderung am Rahmen); KnippQAi schreibt ihn in die Story-Datei unter docs/stories/, danach git pull |
| `technik_lesen` {adr?, teil?, story?} | Technischer Rahmen: docs/architecture.md (arc42), Entscheidungen unter docs/adr/ und Leitplanken des Hauses; was hier steht, gilt beim Bauen und Testen |
| `betrieb_fehler` {stunden?, umgebung?} | Fehlergruppen im Betrieb mit Zustand, Vorkommen, Nutzern, Ort im Code und Story |
| `betrieb_fehlergruppe` {id?, story?} | Eine Fehlergruppe mit Befund, Stacktrace, Logzeilen (maskiert), Bezug zu Operation, Use Cases und Stories; Zustand „beobachten“ heißt behoben, noch keine 24 Stunden ohne Vorkommen |

## Ablauf

1. Zweig holen: `git fetch origin && git switch <Zweig aus story_lesen>`.
2. `story_lesen` mit dem Schlüssel (etwa "PK-17"), dann `story_aenderungen`.
   Lies danach gezielt nur, was die Änderungen berühren: `modell_lesen` mit der Kennung zeigt die Nachbarschaft, dann den einzelnen Endpunkt, das Ereignis oder die Entität. Nicht ganze Dateien oder den ganzen Katalog lesen.
   Legt die Story vor allem Neues an, ist `story_aenderungen` fast die ganze Spezifikation: Dann lies die Dateien unter `docs/` im Zweig direkt.
3. Code ändern, bis das Verhalten der Spezifikation entspricht.
4. Fehlende Steps der Akzeptanztests unter `acceptance/` implementieren.
5. Committen und pushen. Die Entwicklungsumgebung ist lokal: `scripts/akzeptanztests.sh` baut den Dienst aus dem Arbeitsstand, startet ihn unter http://localhost:18300 und lässt `gauge run` dagegen laufen (Argument: einzelne Specs, ohne alle). Der JUnit-Bericht liegt danach unter `acceptance/reports/xml-report/result.xml`.
6. Akzeptanztests in der Stufe Entwicklung, und so lange weiterarbeiten, bis alle Akzeptanztests der Story grün sind. Nachbarsysteme dürfen hier Testdoppel sein.
   - Lokal: Lauf auf dem gepushten Stand ohne ungespeicherte Änderungen (das Skript nennt den Stand), dann `akzeptanztests_melden` mit Commit und Bericht. KnippQAi nimmt nur den Kopf des Zweigs an.
   - Auf der Plattform: `akzeptanztests_starten` (Stufe Entwicklung) nimmt Specs und Steps aus dem gepushten Zweig und prüft den Dienst der Testumgebung, die `main` hält. Das trägt nur, wenn die Story keinen Produktcode ändert. Das Ergebnis nennt den Commit der Steps.
7. `pull_request_oeffnen`. Review, CI-Pipeline (mit den Tests gegen Testdoppel) und Merge laufen im Git. Nach dem Merge bringt die Pipeline den Stand in die Testumgebung; dort führt KnippQAi die Akzeptanztests aus (Stufe Abnahme), und der Prüfer nimmt ab. Passt es fachlich nicht, gibt er die Story mit Grund an die Entwicklung zurück: Der Zweig steht dann auf main, `story_lesen` nennt den Grund, du besserst nach und öffnest einen neuen Pull Request. Testpflege ist mit dem Merge fertig, ohne fachliche Abnahme.
8. Bei der Abnahme entscheidet der Prüfer, welche Szenarien als Regressionstests weiterlaufen. Wird eines davon in der Regression rot, kommt es als Rückmeldung an die Story.

## Regeln

- `docs/` ist maßgeblich. Ändere dort nichts: keine Use Cases, Regeln, Entitäten, keine OpenAPI, keine Masken, keine Story-Datei unter `docs/stories/`. Passt die Spezifikation nicht und du kannst ohne Entscheidung nicht weiter, stelle eine Rückfrage mit `rueckfrage_stellen`. Hast du es im Code schon sinnvoll gelöst (falscher Wert, fehlender Fall, Nachbarsystem verhält sich anders), gib eine Rückmeldung mit `rueckmeldung_geben` und arbeite weiter; der Fachbereich zieht die Spezifikation nach, wenn er Zeit hat.
- Ändere die Szenarien unter `acceptance/specs/` nicht. Implementiere nur fehlende Steps.
- Kennungen (UC-…, BR-…, NFR-…) vergibt KnippQAi. Verweise im Code und in Unit-Tests auf sie, etwa mit `@UseCase("UC-003")`, wenn ein Kriterium als Unit- oder Lasttest geprüft wird.
- Commit-Nachrichten beginnen mit dem Story-Schlüssel: `PK-17: Teilausführung storniert den Rest`.
- Arbeite nur auf dem Story-Zweig, nie auf `main`.
- Ein Plattformlauf prüft den Dienst, der in seiner Umgebung läuft: in der Entwicklung muss er den Stand des Zweigs haben, in der Abnahme den von `main` nach dem Deploy. In `KNIPPQ_ACCEPTED_COMMITS` (kommagetrennt) steht, aus welchen Commits der Dienst gebaut sein darf: ab dem letzten Commit, der Code ändert (nicht `docs/`, `acceptance/` oder Markdown wie diese Datei). Lege in den Akzeptanztests einen BeforeSuite-Hook an, der den Build-Commit des Dienstes liest (etwa `GET /api/version`) und den Lauf mit einer klaren Meldung abbricht („Testumgebung läuft mit <commit>, erwartet einer von …; Testumgebung neu bauen“), wenn er zu keinem dieser Commits passt. Ohne die Variable (lokaler Lauf) prüft der Hook nicht.
- Ruft das System ein anderes System per REST auf, liegt dessen Vertrag als Kopie unter `docs/api/extern/<anbieter>.openapi.yaml`: nur die genutzten Operationen, wörtlich vom Anbieter, Herkunft in `info.x-anbieter`. Baue den Aufruf genau gegen diese Kopie, mit der Basis-URL aus einer Umgebungsvariable. In den Akzeptanztests spielt ein Testdoppel den Anbieter. Der Dienst muss es auch im Plattformlauf erreichen, wo Steps und Dienst in verschiedenen Containern laufen: Ein Server im Step-Prozess reicht dafür nicht. Die Steps setzen die Antworten des Doppels (auch keine Antwort und 404) vor dem Aufruf, und `POST /api/test/reset` leert sie. Nennt die Kopie eine Anmeldung (`security`, 401), meldet sich der Aufruf so an, wie die Spezifikation es beschreibt, und das Doppel verlangt dieselbe Anmeldung und antwortet ohne sie mit 401 wie das Original.
- Schärft der Fachbereich die Spezifikation nach Ready nach, steht das oben in `story_lesen` („Spezifikation nach Ready nachgeschärft“ mit Grund, Commit und betroffenen Elementen). Hol den Zweig neu und gleiche Code und Steps daran an.

## Dieses Repo

- Testumgebung: `scripts/testumgebung.sh` baut den Dienst aus dem Arbeitsstand und startet ihn unter http://localhost:18300 (im Netz der Plattform `http://online-banking:8080`).
- Oberfläche: Der Rahmen (`public/app.html`, `public/app.js`) bleibt. Eine neue Seite ist ein Skript unter `public/seiten/`, das sich mit `Aventa.seite('/pfad', { titel, zeigen(flaeche, kunde, parameter) })` anmeldet und in `app.html` hinter `app.js` eingebunden wird; die Adresse kommt in `src/main.ts` zu den Seiten. Farben, Abstände und Bausteine stehen als Variablen und Klassen in `public/styles.css`; neue Seiten nutzen sie.
- Beträge zeigt `Aventa.euro(betrag)` im deutschen Format.
