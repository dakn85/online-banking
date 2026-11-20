# PK-52: Daueraufträge vom Girokonto verwalten

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich Daueraufträge von meinem Girokonto anlegen, anzeigen, ändern und löschen (monatlich, vierteljährlich oder jährlich, mit erstem Ausführungstag und optionalem Enddatum), damit ich wiederkehrende Zahlungen einmal einrichte und selbst pflege.

## Nicht im Scope

Automatische Ausführung der Daueraufträge zum Fälligkeitstermin: Die Idee nennt nur Anlegen, Anzeigen, Ändern und Löschen; ein zeitgesteuerter Ausführungsprozess mit Umsatzbuchung wird nicht verlangt.
Prüfung von Deckung, Dispositionsrahmen und Tageslimit bei Ausführung: Hängt an der Ausführung, die nicht gefordert ist.
Benachrichtigung bei Anlage, Änderung, Löschung oder fehlgeschlagener Ausführung: Benachrichtigungen werden in der Idee nicht genannt.
Aussetzen oder Pausieren eines Dauerauftrags: Weitere Aktion, die die Idee nicht nennt.
Weitere Turnus-Arten (z. B. wöchentlich, halbjährlich): Die Idee nennt nur monatlich, vierteljährlich und jährlich.
Daueraufträge aus Empfängervorlage anlegen: Naheliegend, aber nicht gefordert; unsicher, ob nötig.
Anzeige ausgeführter Daueraufträge in den Umsätzen: Setzt die Ausführung voraus, die nicht im Scope ist.
Höchstzahl von Daueraufträgen je Kundin: Begrenzung wird in der Idee nicht verlangt.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Zustand nur im Speicher, Ausgangsstand über den Test-Reset | Geändert | Entscheidung geändert |
| Demo-Testdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert, Intern neu |
| Lastdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert, Intern neu |
| Daueraufträge der angemeldeten Kundin | Neu | Endpunkt neu |
| Dauerauftrag anlegen | Neu | Endpunkt neu |
| Dauerauftrag ändern | Neu | Endpunkt neu |
| Dauerauftrag löschen | Neu | Endpunkt neu |
| Dauerauftrag | Neu | Schema neu, Entität neu |
| NeuerDauerauftrag | Neu | Schema neu |
| Architektur | Geändert | Laufzeitsicht geändert, Querschnittliche Konzepte geändert |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Daueraufträge | Neu | Maske neu |
| Finanzstatus | Geändert | Use Case UC-016 neu, Aktion Daueraufträge neu, Skizze geändert |
| UC-016 Daueraufträge vom Girokonto verwalten | Neu | Use Case neu |
| BR-0077 Erster Ausführungstag und Enddatum eines Dauerauftrags | Neu | Neu in UC-016 |
| BR-0078 Daueraufträge der angemeldeten Kundin | Neu | Neu in UC-016 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/dauerauftraege.spec`: Bei gleichem ersten Ausführungstag sind die Daueraufträge nach Empfänger aufsteigend sortiert
- `acceptance/specs/dauerauftraege.spec`: Bei vergangenem ersten Ausführungstag lässt sich der Betrag trotzdem ändern
- `acceptance/specs/dauerauftraege.spec`: Bricht die Kundin die Sicherheitsabfrage ab, bleibt der Dauerauftrag bestehen
- `acceptance/specs/dauerauftraege.spec`: Die Daueraufträge sind nach erstem Ausführungstag aufsteigend sortiert
- `acceptance/specs/dauerauftraege.spec`: Die Daueraufträge sind ohne Anmeldung nicht erreichbar
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit Betrag unter 0,10 € wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit IBAN außerhalb des SEPA-Raums wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit mehr als zwei Nachkommastellen im Betrag wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag ohne Verwendungszweck wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird angelegt und in der Liste gezeigt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird geändert
- `acceptance/specs/dauerauftraege.spec`: Ein Enddatum gleich dem ersten Ausführungstag wird akzeptiert
- `acceptance/specs/dauerauftraege.spec`: Ein Enddatum vor dem ersten Ausführungstag wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Enddatum vor dem unveränderten ersten Ausführungstag wird beim Ändern abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein erster Ausführungstag heute wird akzeptiert
- `acceptance/specs/dauerauftraege.spec`: Ein erster Ausführungstag in der Vergangenheit wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein geänderter erster Ausführungstag in der Vergangenheit wird abgelehnt

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine (docs/architecture.md)
- **Neue Component „Dauerauftrag“** (`src/dauerauftraege.ts`, ohne HTTP, wie `empfaengervorlagen.ts`): Bestand je Kennung im Speicher (ADR-002), Prüfungen, Liste, Anlegen, Ändern, Löschen.
- **Seitenauslieferung** (`src/main.ts`): Routen GET/POST `/api/dauerauftraege`, PUT/DELETE `/api/dauerauftraege/{id}` hinter `nurAngemeldet('api')` (NFR-001, BR-0078); Seite `/dauerauftraege` hinter `nurAngemeldet('seite')`.
- **Testbetrieb** (`src/testdaten.ts`): Daueraufträge gehören zum Demo- und Last-Reset; Ausgangsstand jonas.weber „Hausverwaltung Weber“ (650,00 €, Miete, monatlich, erster Ausführungstag 30 Tage vor dem Zurücksetzen, UTC), lena.hoffmann keiner.
- **Oberfläche** (`public/seiten/dauerauftraege.js`, Navigation, Link „Daueraufträge“ im Kopf des Finanzstatus) nach `docs/ui/dauerauftraege.html`; zeigt die Meldung des Dienstes unverändert.
- **Akzeptanztests**: fehlende Steps in `acceptance/tests/StepImplementation.ts` (Datumsangaben „in 5 Tagen“, „gestern“ usw. relativ zu heute in UTC).

## Schritte
1. Modell und Prüfung (UC-016 Schritt 4, A1–A5): zuerst Pflicht/Format inkl. Turnus, Länge, Betrag > 2 Nachkommastellen, Datumsformat (400, A1), dann IBAN (BR-0003, 400, A2), Betrag < 0,10 oder fehlend/keine Zahl (400, A3); danach BR-0077 (422): erster Ausführungstag nicht vor heute (UTC), Enddatum nicht vor erstem Ausführungstag. Auftraggeberkonto = Girokonto der Kundin (BR-0007).
2. Ändern (A6): Tag nur bei Abweichung vom gespeicherten Wert gegen heute prüfen, Enddatum immer gegen den geltenden ersten Ausführungstag (BR-0077).
3. BR-0078: fremde/unbekannte Kennung → 404 „Der Dauerauftrag existiert nicht mehr.“, ohne Sitzung 401.
4. Liste sortiert nach erstem Ausführungstag, dann Empfänger.
5. Unit-Tests: WP-1 (BR-0078) und WP-2 (BR-0077, Prüfreihenfolge) mit den IDs im Testnamen; `report_unit_tests`.
6. Oberfläche mit Formularen „Neuer Dauerauftrag“, „Dauerauftrag ändern“ (Auswahl übernimmt gespeicherte Angaben), „Dauerauftrag löschen“ mit Sicherheitsabfrage „Dauerauftrag löschen?“ (Ja/Nein), Leerzustand A11, 404 lädt die Liste neu (A10).
7. Steps implementieren, `scripts/akzeptanztests.sh`, Lauf melden.

## Rahmenänderung
Keine neue Bibliothek, kein neues Muster.

## Entscheidungen

- Ist der Verwendungszweck eines Dauerauftrags Pflicht oder optional?
  **Antwort:** Pflicht, 1 bis 140 Zeichen, wie bei der Überweisung (UC-002).
  _→ eingearbeitet in vision, UC-016, BR-0077, BR-0078, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, PUT /api/dauerauftraege/{dauerauftragId}, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, finanzstatus, NFR-001, architektur, ADR-002 · e5abd35_
- Wird der Betrag eines Dauerauftrags beim Anlegen und Ändern gegen den aktuellen verfügbaren Betrag des Girokontos geprüft (BR-0004)?
  **Antwort:** Nein, der Dauerauftrag prüft nur den Mindestbetrag von 0,10 €; eine Deckungsprüfung gehört zur Ausführung, die nicht im Scope ist.
  _→ eingearbeitet in vision, UC-016, BR-0077, BR-0078, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, PUT /api/dauerauftraege/{dauerauftragId}, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, finanzstatus, NFR-001, architektur, ADR-002 · e5abd35_
- Gilt beim Ändern eines Dauerauftrags die Regel „erster Ausführungstag nicht vor heute“ immer oder nur, wenn die Kundin den ersten Ausführungstag selbst ändert? Der gespeicherte erste Ausführungstag kann inzwischen in der Vergangenheit liegen.
  **Antwort:** Nur wenn die Kundin den ersten Ausführungstag ändert; bleibt er unverändert, kann sie Betrag, Verwendungszweck oder Enddatum trotz vergangenem ersten Ausführungstag ändern.
  _→ eingearbeitet in vision, UC-016, BR-0077, BR-0078, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, PUT /api/dauerauftraege/{dauerauftragId}, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, finanzstatus, NFR-001, architektur, ADR-002 · e5abd35_
- ADR-002 und UC-016 nennen die Daueraufträge im Ausgangsstand von POST /api/test/reset (jonas.weber hat „Hausverwaltung Weber“, lena.hoffmann keinen). Die Beschreibung von POST /api/test/reset im Vertrag nennt sie nicht, und für den Lastbetrieb (POST /api/test/lasttest/reset) ist offen, ob die Lastkunden Daueraufträge anlegen dürfen und ob dieser Reset sie löscht. Was gilt? (Aussage „POST /api/test/reset setzt auch die Daueraufträge der Demo-Kundinnen zurück.“)
  **Antwort:** Der Vertrag von POST /api/test/reset nennt Daueraufträge und den Ausgangsstand von jonas.weber; POST /api/test/lasttest/reset löscht zusätzlich die Daueraufträge der Lastkunden, Ausgangsstand ohne Daueraufträge.
  _→ eingearbeitet in UC-016, BR-0078, dauerauftraege, POST /api/test/lasttest/reset, POST /api/dauerauftraege, PUT /api/dauerauftraege/{dauerauftragId}, DELETE /api/dauerauftraege/{dauerauftragId} · 14e1e5b_
- Was sieht die Kundin, wenn ein Dauerauftrag beim Ändern oder Löschen nicht mehr existiert (404, zum Beispiel in einer zweiten Sitzung bereits gelöscht)?
  **Antwort:** Neue Meldung „Der Dauerauftrag existiert nicht mehr.“, die Liste wird neu geladen, die Eingaben der Änderung entfallen
  _→ eingearbeitet in UC-016, BR-0078, dauerauftraege, POST /api/test/lasttest/reset, POST /api/dauerauftraege, PUT /api/dauerauftraege/{dauerauftragId}, DELETE /api/dauerauftraege/{dauerauftragId} · 14e1e5b_
- Bei Dauerauftrag gibt es unter 400 drei verschiedene Meldungen (allgemein unvollständig oder ungültig, IBAN ungültig, Betrag unter 0,10 €) und unter 422 zwei (erster Ausführungstag, Enddatum). Die Zuordnung 400 gleich IBAN und 422 gleich Betrag aus ADR-004 passt dazu nicht. Woran erkennt die Oberfläche beim Antworten des Dienstes, welche Meldung sie zeigt? (Aussage „Die Oberfläche ordnet eine 400-Antwort dem IBAN-Feld und eine 422-Antwort dem Be“)
  **Antwort:** Der Dienst liefert im Feld fehler genau den Meldungstext aus UC-016 A1 bis A5, die Oberfläche zeigt ihn unverändert.
  _→ eingearbeitet in UC-016, BR-0078, dauerauftraege, POST /api/test/lasttest/reset, POST /api/dauerauftraege, PUT /api/dauerauftraege/{dauerauftragId}, DELETE /api/dauerauftraege/{dauerauftragId} · 14e1e5b_
- Was geschieht bei einem Betrag mit mehr als zwei Nachkommastellen (z. B. 10,555 €): lehnt der Dienst ihn mit 400 ab, oder rundet er nach ADR-005 auf Cent? Wenn er ablehnt: welche Meldung sieht die Kundin?
  **Antwort:** Ablehnen mit 400 und der Meldung „Die Angaben zum Dauerauftrag sind unvollständig oder ungültig.“
  _→ eingearbeitet in UC-016, POST /api/dauerauftraege, PUT /api/dauerauftraege/{dauerauftragId}, Schema NeuerDauerauftrag · 5db28ce_
- Drei Szenarien in acceptance/specs/dauerauftraege.spec (Zeilen 26, 133 und 178: „sortiert nach erstem Ausführungstag“, „Dauerauftrag erst nach der Sicherheitsabfrage gelöscht“, „bei gleichem ersten Ausführungstag nach Empfänger sortiert“) legen einen Dauerauftrag „Stadtwerke Nord“ mit der Empfänger-IBAN „DE02 5001 0517 5407 3249 31“ an. Diese IBAN hat keine gültige Prüfziffer (ISO 7064 MOD 97-10 ergibt Rest 56 statt 1). BR-0003 und UC-016 A2 verlangen aber eine gültige Prüfziffer; der Dienst lehnt den Dauerauftrag deshalb mit „Die IBAN ist ungültig oder gehört zu keinem SEPA-Land.“ ab. Die Szenarien dürfen wir nicht ändern. Wie soll das aufgelöst werden? Die Demo-IBAN des Girokontos (DE02 5001 0517 5407 3249 31) ist dieselbe und ebenfalls prüfziffernungültig; Empfängervorlagen-Szenarien nutzen deshalb DE44 5001 0517 5407 3249 31.
  **Antwort:** Die drei Szenarien (und die Beispiele in docs/ui/dauerauftraege.html) auf eine prüfziffernrichtige IBAN umstellen, z. B. DE44 5001 0517 5407 3249 31; der Dienst bleibt bei BR-0003.
  _→ eingearbeitet in dauerauftraege_
