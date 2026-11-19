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

- `acceptance/specs/dauerauftraege.spec`: Bei vergangenem ersten Ausführungstag lässt sich der Betrag trotzdem ändern
- `acceptance/specs/dauerauftraege.spec`: Bricht die Kundin die Sicherheitsabfrage ab, bleibt der Dauerauftrag bestehen
- `acceptance/specs/dauerauftraege.spec`: Die Daueraufträge sind nach erstem Ausführungstag aufsteigend sortiert
- `acceptance/specs/dauerauftraege.spec`: Die Daueraufträge sind ohne Anmeldung nicht erreichbar
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit Betrag unter 0,10 € wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit IBAN außerhalb des SEPA-Raums wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag ohne Verwendungszweck wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird angelegt und in der Liste gezeigt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird geändert
- `acceptance/specs/dauerauftraege.spec`: Ein Enddatum vor dem ersten Ausführungstag wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Enddatum vor dem unveränderten ersten Ausführungstag wird beim Ändern abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein erster Ausführungstag in der Vergangenheit wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein geänderter erster Ausführungstag in der Vergangenheit wird abgelehnt

## Aufgaben für die Umsetzung

- [ ] Zustand nur im Speicher, Ausgangsstand über den Test-Reset: Entscheidung geändert
- [ ] Demo-Testdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Demo-Testdaten zurücksetzen (nur Testbetrieb): Intern neu
- [ ] Daueraufträge der angemeldeten Kundin: Endpunkt neu
- [ ] Dauerauftrag anlegen: Endpunkt neu
- [ ] Dauerauftrag ändern: Endpunkt neu
- [ ] Dauerauftrag löschen: Endpunkt neu
- [ ] Dauerauftrag: Schema neu
- [ ] NeuerDauerauftrag: Schema neu
- [ ] Architektur: Laufzeitsicht geändert
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Dauerauftrag: Entität neu
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Daueraufträge: Maske neu
- [ ] Finanzstatus: Use Case UC-016 neu
- [ ] Finanzstatus: Aktion Daueraufträge neu
- [ ] Finanzstatus: Skizze geändert
- [ ] UC-016: Use Case neu
- [ ] BR-0077: Neu in UC-016
- [ ] BR-0078: Neu in UC-016
- [ ] Vision: Zweck geändert
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-52 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-52 grün

## Offene Fragen

- [ ] ADR-002 und UC-016 nennen die Daueraufträge im Ausgangsstand von POST /api/test/reset (jonas.weber hat „Hausverwaltung Weber“, lena.hoffmann keinen). Die Beschreibung von POST /api/test/reset im Vertrag nennt sie nicht, und für den Lastbetrieb (POST /api/test/lasttest/reset) ist offen, ob die Lastkunden Daueraufträge anlegen dürfen und ob dieser Reset sie löscht. Was gilt? (Aussage „POST /api/test/reset setzt auch die Daueraufträge der Demo-Kundinnen zurück.“)
- [ ] Was sieht die Kundin, wenn ein Dauerauftrag beim Ändern oder Löschen nicht mehr existiert (404, zum Beispiel in einer zweiten Sitzung bereits gelöscht)?
- [ ] Bei Dauerauftrag gibt es unter 400 drei verschiedene Meldungen (allgemein unvollständig oder ungültig, IBAN ungültig, Betrag unter 0,10 €) und unter 422 zwei (erster Ausführungstag, Enddatum). Die Zuordnung 400 gleich IBAN und 422 gleich Betrag aus ADR-004 passt dazu nicht. Woran erkennt die Oberfläche beim Antworten des Dienstes, welche Meldung sie zeigt? (Aussage „Die Oberfläche ordnet eine 400-Antwort dem IBAN-Feld und eine 422-Antwort dem Be“)

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
