# PK-14: Dauerauftrag: Die Kundin richtet vom Girokonto einen monatlichen Dauerauftrag an einen Empfänger im SEPA-Raum ein …

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Dauerauftrag: Die Kundin richtet vom Girokonto einen monatlichen Dauerauftrag an einen Empfänger im SEPA-Raum ein (Betrag, Ausführungstag im Monat, erste Ausführung, Verwendungszweck), sieht ihre Daueraufträge in einer Liste und kann einen Dauerauftrag löschen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Daueraufträge der angemeldeten Kundin | Neu | Endpunkt neu |
| Dauerauftrag einrichten | Neu | Endpunkt neu |
| Dauerauftrag löschen | Neu | Endpunkt neu |
| Dauerauftrag | Neu | Schema neu, Entität neu |
| DauerauftragAnlegen | Neu | Schema neu |
| Daueraufträge | Neu | Maske neu |
| Finanzstatus | Geändert | Aktion Daueraufträge neu, Skizze geändert |
| UC-001 Finanzstatus anzeigen | Geändert | Schritt 8 neu |
| UC-005 Dauerauftrag einrichten, ansehen und löschen | Neu | Use Case neu |
| BR-0020 IBAN des Empfängers im Dauerauftrag | Neu | Neu in UC-005 |
| BR-0021 Betrag des Dauerauftrags | Neu | Neu in UC-005 |
| BR-0022 Ausführungstag im Monat | Neu | Neu in UC-005 |
| BR-0023 Erste Ausführung des Dauerauftrags | Neu | Neu in UC-005 |
| BR-0024 Daueraufträge der angemeldeten Kundin | Neu | Neu in UC-005 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/dauerauftraege.spec`: Die Daueraufträge sind über den Knopf in der Zeile des Girokontos erreichbar
- `acceptance/specs/dauerauftraege.spec`: Ein abgelehntes Auftraggeberkonto zeigt die allgemeine Fehlermeldung
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit Ausführungstag außerhalb von 1 bis 28 wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit einem Betrag unter 0,01 Euro wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit einer ersten Ausführung in der Vergangenheit wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit IBAN außerhalb des SEPA-Raums wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/dauerauftraege.spec`: Ein monatlicher Dauerauftrag wird angelegt

## Aufgaben für die Umsetzung

- [ ] Daueraufträge der angemeldeten Kundin: Endpunkt neu
- [ ] Dauerauftrag einrichten: Endpunkt neu
- [ ] Dauerauftrag löschen: Endpunkt neu
- [ ] Dauerauftrag: Schema neu
- [ ] DauerauftragAnlegen: Schema neu
- [ ] Dauerauftrag: Entität neu
- [ ] Daueraufträge: Maske neu
- [ ] Finanzstatus: Aktion Daueraufträge neu
- [ ] Finanzstatus: Skizze geändert
- [ ] UC-001: Schritt 8 neu
- [ ] UC-005: Use Case neu
- [ ] BR-0020: Neu in UC-005
- [ ] BR-0021: Neu in UC-005
- [ ] BR-0022: Neu in UC-005
- [ ] BR-0023: Neu in UC-005
- [ ] BR-0024: Neu in UC-005
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-14 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-14 grün

## Entscheidungen

- Welchen Bereich soll der Ausführungstag im Monat haben?
  **Antwort:** 1 bis 28, damit der Termin in jedem Monat vorkommt
  _→ eingearbeitet in vision, UC-005, BR-0020, BR-0021, BR-0022, BR-0023, BR-0024, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, Schema DauerauftragAnlegen, dauerauftraege · 0d1e631_
- Soll der Betrag eines Dauerauftrags beim Anlegen gegen den verfügbaren Betrag des Girokontos geprüft werden?
  **Antwort:** Nein, nur größer als 0, weil die Ausführung erst später fällig wird
  _→ eingearbeitet in vision, UC-005, BR-0020, BR-0021, BR-0022, BR-0023, BR-0024, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, Schema DauerauftragAnlegen, dauerauftraege · 0d1e631_
- Wie soll sich die erste Ausführung zum Ausführungstag im Monat verhalten?
  **Antwort:** Frei wählbares Datum ab heute, darf vom Ausführungstag abweichen
  _→ eingearbeitet in vision, UC-005, BR-0020, BR-0021, BR-0022, BR-0023, BR-0024, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, Schema DauerauftragAnlegen, dauerauftraege · 0d1e631_
- Soll ein fälliger Dauerauftrag in dieser Story schon buchen (Saldo und Umsatz)?
  **Antwort:** Nein, nur Einrichten, Anzeigen und Löschen; die Ausführung folgt in einer eigenen Story
  _→ eingearbeitet in vision, UC-005, BR-0020, BR-0021, BR-0022, BR-0023, BR-0024, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, Schema DauerauftragAnlegen, dauerauftraege · 0d1e631_
- Wo soll die Kundin die Daueraufträge öffnen?
  **Antwort:** Über einen Knopf „Daueraufträge“ in der Zeile des Girokontos im Finanzstatus
  _→ eingearbeitet in finanzstatus, UC-005 · fccbabc_
- Woran erkennt das System beim Löschen den gewählten Dauerauftrag, wenn zwei Daueraufträge denselben Empfänger haben?
  **Antwort:** Die Liste und das Auswahlfeld führen je Dauerauftrag die dauerauftragsId als Wert mit; die Aktion Löschen übergibt sie im Pfad, die Anzeige bleibt der Empfänger.
  _→ ohne Änderung: Steht schon in der Maske dauerauftraege: Der übernommene Blocker-Vorschlag bindet die Löschauswahl an die dauerauftragsId._
- Was zeigt das System, wenn der Dienst beim Anlegen mit 403 antwortet, weil das Auftraggeberkonto kein Girokonto der Kundin ist?
  **Antwort:** Der Fall tritt in der Oberfläche nicht auf, weil das Auftraggeberkonto fest das Girokonto der Kundin ist; der Dienst antwortet 403, die Seite zeigt die allgemeine Fehlermeldung.
  _→ eingearbeitet in UC-005, BR-0024, dauerauftraege · c884c2c_
- Soll der Vertrag den Betrag auf mindestens 0.01 festlegen (wie das Datenmodell) oder bei „größer als 0“ bleiben?
  **Antwort:** Mindestens 0.01, also 0.01 zulässig und 0.00 abgelehnt.
  _→ eingearbeitet in POST /api/dauerauftraege, Schema DauerauftragAnlegen · 13d231b_
- Welche Meldung zeigt das System, wenn der Betrag zwischen 0 und 0,01 liegt?
  **Antwort:** Meldung aus BR-0021 beibehalten: „Der Betrag muss größer als 0 sein.“
  _→ eingearbeitet in POST /api/dauerauftraege, Schema DauerauftragAnlegen · 13d231b_
