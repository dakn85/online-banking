# PK-19: Daueraufträge vom Girokonto einrichten, anzeigen und löschen

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich vom Girokonto einen monatlichen Dauerauftrag an einen Empfänger im SEPA-Raum einrichten, meine Daueraufträge in einer Liste sehen und einen Dauerauftrag löschen, damit regelmäßige Zahlungen wie die Miete festgelegt sind, ohne sie jeden Monat neu zu überweisen.

## Nicht im Scope

Ausführen und Buchen fälliger Daueraufträge, Ändern eines bestehenden Dauerauftrags, Terminaufträge, Prüfung des Betrags gegen den verfügbaren Betrag des Girokontos, Rücksicht auf Wochenende und Feiertage beim Ausführungstag, eine Empfängervorlage als Vorlage für einen Dauerauftrag wählen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Daueraufträge der angemeldeten Kundin | Neu | Endpunkt neu |
| Dauerauftrag einrichten | Neu | Endpunkt neu |
| Dauerauftrag löschen | Neu | Endpunkt neu |
| Dauerauftrag | Neu | Schema neu, Entität neu |
| NeuerDauerauftrag | Neu | Schema neu |
| Zugriffsschutz des Finanzstatus | Geändert | Gilt für geändert |
| Daueraufträge | Neu | Maske neu |
| UC-006 Daueraufträge verwalten | Neu | Use Case neu |
| BR-0027 Ausführungstag im Monat | Neu | Neu in UC-006 |
| BR-0028 Erste Ausführung | Neu | Neu in UC-006 |
| BR-0029 Betrag des Dauerauftrags | Neu | Neu in UC-006 |
| BR-0030 Löschen wirkt sofort | Neu | Neu in UC-006 |
| BR-0031 Daueraufträge der angemeldeten Kundin | Neu | Neu in UC-006 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/dauerauftraege.spec`: Die Daueraufträge sind ohne Anmeldung nicht erreichbar
- `acceptance/specs/dauerauftraege.spec`: Ein Ausführungstag außerhalb von 1 bis 28 wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Betrag von 0 Euro wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag einer anderen Kundin erscheint nicht in der Liste
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird eingerichtet und steht in der Liste
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/dauerauftraege.spec`: Eine erste Ausführung vor heute wird abgelehnt

## Aufgaben für die Umsetzung

- [ ] Daueraufträge der angemeldeten Kundin: Endpunkt neu
- [ ] Dauerauftrag einrichten: Endpunkt neu
- [ ] Dauerauftrag löschen: Endpunkt neu
- [ ] Dauerauftrag: Schema neu
- [ ] NeuerDauerauftrag: Schema neu
- [ ] Dauerauftrag: Entität neu
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Daueraufträge: Maske neu
- [ ] UC-006: Use Case neu
- [ ] BR-0027: Neu in UC-006
- [ ] BR-0028: Neu in UC-006
- [ ] BR-0029: Neu in UC-006
- [ ] BR-0030: Neu in UC-006
- [ ] BR-0031: Neu in UC-006
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-19 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-19 grün

## Entscheidungen

- Führt der Dienst fällige Daueraufträge auch aus und bucht sie, oder deckt die Story nur Einrichten, Liste und Löschen ab?
  **Antwort:** Die Story deckt nur Einrichten, Anzeigen und Löschen; Ausführung und Buchung folgen in einer späteren Story.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Was gilt, wenn am Ausführungstag der verfügbare Betrag des Girokontos für den Dauerauftrag nicht reicht?
  **Antwort:** Entfällt in dieser Story, sie führt nichts aus. Beim Einrichten wird der Betrag nicht gegen den verfügbaren Betrag geprüft.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Welcher Tag wird gebucht, wenn der Ausführungstag im Monat nicht existiert (31.) oder auf ein Wochenende beziehungsweise einen Feiertag fällt?
  **Antwort:** Der Ausführungstag ist auf 1 bis 28 begrenzt, damit er in jedem Monat existiert; auf Wochenende und Feiertage wird keine Rücksicht genommen.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Bis wann wirkt das Löschen eines Dauerauftrags vor dem nächsten Ausführungstag?
  **Antwort:** Das Löschen wirkt sofort: eine noch nicht gebuchte Ausführung, auch am selben Tag, unterbleibt.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Ab wann darf die erste Ausführung eines neu eingerichteten Dauerauftrags liegen?
  **Antwort:** Ab heute, frei wählbares Datum, es darf vom Ausführungstag abweichen. Gebucht wird in dieser Story nichts.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Soll der Ausgangsstand schon Daueraufträge für eine Kundin enthalten?
  **Antwort:** Keine Daueraufträge im Ausgangsstand; die Liste ist zu Beginn leer.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Soll die Kundin das Auftraggeberkonto beim Einrichten wählen können?
  **Antwort:** Nein, das Girokonto ist fest das Auftraggeberkonto.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Nach welchem Merkmal sortiert die Liste der Daueraufträge?
  **Antwort:** Nach Ausführungstag aufsteigend, bei gleichem Tag nach Empfänger.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Braucht der Dauerauftrag einen Empfängernamen oder genügt die IBAN des Empfängers?
  **Antwort:** Empfängername ist Pflicht, wie bei der Überweisung.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
- Soll es eine Höchstzahl von Daueraufträgen je Kundin geben, wie bei den Empfängervorlagen 50?
  **Antwort:** Keine Höchstzahl in dieser Story.
  _→ eingearbeitet in vision, Dauerauftrag, NFR-001, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragId}, Schema Dauerauftrag, Schema NeuerDauerauftrag, dauerauftraege, UC-006, BR-0027, BR-0028, BR-0029, BR-0030, BR-0031_
