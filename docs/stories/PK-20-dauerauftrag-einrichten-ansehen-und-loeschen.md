# PK-20: Dauerauftrag einrichten, ansehen und löschen

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich vom Girokonto einen monatlichen Dauerauftrag an einen Empfänger im SEPA-Raum einrichten, meine Daueraufträge in einer Liste sehen und einen Dauerauftrag löschen, damit regelmäßige Zahlungen ohne neue Erfassung feststehen.

## Nicht im Scope

Ausführen von Daueraufträgen und jede Buchung daraus; Ändern eines bestehenden Dauerauftrags (löschen und neu anlegen); Prüfung des Betrags gegen den verfügbaren Betrag des Girokontos; Terminaufträge; Daueraufträge über ein anderes Konto als das Girokonto; Empfänger aus Empfängervorlagen; Benachrichtigung vor der Ausführung.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Daueraufträge der angemeldeten Kundin | Neu | Endpunkt neu |
| Dauerauftrag vom Girokonto anlegen | Neu | Endpunkt neu |
| Dauerauftrag löschen | Neu | Endpunkt neu |
| Dauerauftrag | Neu | Schema neu, Entität neu |
| Daueraufträge | Neu | Maske neu |
| UC-007 Daueraufträge verwalten | Neu | Use Case neu |
| BR-0032 Auftraggeberkonto des Dauerauftrags | Neu | Neu in UC-007 |
| BR-0033 Betrag des Dauerauftrags | Neu | Neu in UC-007 |
| BR-0034 Ausführungstag im Monat | Neu | Neu in UC-007 |
| BR-0035 Erste Ausführung des Dauerauftrags | Neu | Neu in UC-007 |
| BR-0036 IBAN des Empfängers beim Dauerauftrag | Neu | Neu in UC-007 |
| BR-0037 Daueraufträge der angemeldeten Kundin | Neu | Neu in UC-007 |
| BR-0038 Dauerauftrag löschen | Neu | Neu in UC-007 |
| BR-0039 Verwendungszweck des Dauerauftrags | Neu | Neu in UC-007 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/dauerauftraege.spec`: Die Dauerauftragsliste zeigt nur Daueraufträge der angemeldeten Kundin
- `acceptance/specs/dauerauftraege.spec`: Ein Ausführungstag über 28 wird nicht angenommen
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag an eine ungültige IBAN wird nicht angelegt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag ohne Verwendungszweck steht ohne Verwendungszweck in der Liste
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag über einen Betrag von 0 Euro wird nicht angelegt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag vom Girokonto steht danach in der Dauerauftragsliste
- `acceptance/specs/dauerauftraege.spec`: Ein gelöschter Dauerauftrag fehlt danach in der Liste
- `acceptance/specs/dauerauftraege.spec`: Eine erste Ausführung vor heute wird nicht angenommen

## Aufgaben für die Umsetzung

- [ ] Daueraufträge der angemeldeten Kundin: Endpunkt neu
- [ ] Dauerauftrag vom Girokonto anlegen: Endpunkt neu
- [ ] Dauerauftrag löschen: Endpunkt neu
- [ ] Dauerauftrag: Schema neu
- [ ] Dauerauftrag: Entität neu
- [ ] Daueraufträge: Maske neu
- [ ] UC-007: Use Case neu
- [ ] BR-0032: Neu in UC-007
- [ ] BR-0033: Neu in UC-007
- [ ] BR-0034: Neu in UC-007
- [ ] BR-0035: Neu in UC-007
- [ ] BR-0036: Neu in UC-007
- [ ] BR-0037: Neu in UC-007
- [ ] BR-0038: Neu in UC-007
- [ ] BR-0039: Neu in UC-007
- [ ] Vision: Zweck geändert
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-20 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-20 grün

## Offene Fragen

- [ ] Wann bucht der Dienst einen fälligen Dauerauftrag, sodass die Kundin Umsatz und neuen Saldo sieht?

## Entscheidungen

- Ein Dauerauftrag läuft monatlich: Reicht am Ausführungstag der verfügbare Betrag des Girokontos nicht, was macht das System mit dem Termin?
  **Antwort:** Entfällt in dieser Story, sie führt nichts aus und bucht nichts. Beim Einrichten wird der Betrag nicht gegen den verfügbaren Betrag geprüft.
  _→ noch nicht in der Spezifikation_
- Soll die Kundin einen bestehenden Dauerauftrag ändern können, oder nur löschen und neu anlegen?
  **Antwort:** Nur anlegen, ansehen und löschen. Wer etwas ändern will, löscht und legt neu an. Die Story führt keine Daueraufträge aus und bucht nichts.
  _→ noch nicht in der Spezifikation_
- Was gilt, wenn der gewählte Ausführungstag im Monat nicht existiert oder auf ein Wochenende fällt?
  **Antwort:** Nur Ausführungstage 1 bis 28 sind zulässig, damit jeder Monat den Tag hat; Wochenende und Feiertage verschieben nichts.
  _→ noch nicht in der Spezifikation_
- Welche Daueraufträge soll der Ausgangsstand der Testdaten enthalten?
  **Antwort:** Je ein Dauerauftrag für lena.hoffmann und jonas.weber, damit Liste und Abgrenzung je Kundin prüfbar sind
  _→ eingearbeitet in vision, UC-007, BR-0032, BR-0033, BR-0034, BR-0035, BR-0036, BR-0037, BR-0038, BR-0039, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, dauerauftraege_
- Darf die erste Ausführung heute liegen?
  **Antwort:** Ja, heute ist zulässig, nur frühere Tage nicht
  _→ eingearbeitet in vision, UC-007, BR-0032, BR-0033, BR-0034, BR-0035, BR-0036, BR-0037, BR-0038, BR-0039, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, dauerauftraege_
- Wie soll die Dauerauftragsliste sortiert sein?
  **Antwort:** Nach Empfänger aufsteigend
  _→ eingearbeitet in vision, UC-007, BR-0032, BR-0033, BR-0034, BR-0035, BR-0036, BR-0037, BR-0038, BR-0039, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, dauerauftraege_
- Soll es eine Höchstzahl an Daueraufträgen je Kundin geben?
  **Antwort:** Nein, keine Höchstzahl
  _→ eingearbeitet in vision, UC-007, BR-0032, BR-0033, BR-0034, BR-0035, BR-0036, BR-0037, BR-0038, BR-0039, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, dauerauftraege_
- Soll das Löschen eines Dauerauftrags eine Sicherheitsabfrage haben?
  **Antwort:** Ja, wie bei den Empfängervorlagen
  _→ eingearbeitet in vision, UC-007, BR-0032, BR-0033, BR-0034, BR-0035, BR-0036, BR-0037, BR-0038, BR-0039, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, dauerauftraege_
