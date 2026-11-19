# PK-54: Umsätze eines Kontos als CSV-Datei exportieren

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich die Umsätze eines Kontos mit den Filtern der Umsatzliste als CSV-Datei herunterladen, damit ich sie in Excel oder meiner Buchhaltung weiterverwenden kann.

## Nicht im Scope

- Weitere Exportformate (PDF, Excel, MT940): Die Idee nennt nur CSV.
- Export über die Filter der Liste hinaus: Es sind nur die Filter der Umsatzliste verlangt, keine zusätzlichen Filter oder Spalten zur Auswahl.
- Export mehrerer Konten auf einmal: Die Idee spricht von den Umsätzen eines Kontos.
- Geplanter oder wiederkehrender Export, Versand per E-Mail: Kein Hintergrundprozess und keine Benachrichtigung verlangt.
- Protokollierung der Exporte: Nicht verlangt; wäre eine eigene Fachlichkeit.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos als CSV-Datei exportieren | Neu | Endpunkt neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Umsätze | Geändert | Aktion Als CSV exportieren neu, Skizze geändert |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Ziel geändert, Notizen geändert, Schritt 9 neu, und 9 weitere |
| BR-0075 Export mit den Umsätzen der Liste | Neu | Neu in UC-003 |
| BR-0076 Export nur mit Umsätzen | Neu | Neu in UC-003 |
| Vision | Geändert | Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Der CSV-Export einer leeren Auswahl liefert keine Datei und zeigt die Meldung
- `acceptance/specs/umsaetze.spec`: Der CSV-Export eines fremden Kontos zeigt, dass das Konto nicht gefunden wurde
- `acceptance/specs/umsaetze.spec`: Der CSV-Export enthält die gefilterten Umsätze, neueste zuerst, mit Saldo danach
- `acceptance/specs/umsaetze.spec`: Der CSV-Export mit Von-Datum nach dem Bis-Datum zeigt die Meldung zum ungültigen Zeitraum
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei ist UTF-8 mit BOM, durch Semikolon getrennt und nach dem Konto benannt
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei schreibt den Buchungstag als TT.MM.JJJJ und Beträge mit Dezimalkomma
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei setzt einen Text mit Semikolon in Anführungszeichen, sodass die Spalten stimmen
- `acceptance/specs/umsaetze.spec`: Ohne Anmeldung ist der CSV-Export nicht erreichbar

## Aufgaben für die Umsetzung

- [ ] Umsätze eines Kontos als CSV-Datei exportieren: Endpunkt neu
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Umsätze: Aktion Als CSV exportieren neu
- [ ] Umsätze: Skizze geändert
- [ ] UC-003: Ziel geändert
- [ ] UC-003: Notizen geändert
- [ ] UC-003: Schritt 9 neu
- [ ] UC-003: Schritt 10 neu
- [ ] UC-003: A5 neu: Keine Umsätze zum Export
- [ ] UC-003: A6 neu: Konto nicht gefunden beim Export
- [ ] UC-003: A7 neu: Zeitraum ungültig beim Export
- [ ] UC-003: A8 neu: Export fehlgeschlagen
- [ ] UC-003: Sequenzdiagramm neu
- [ ] UC-003: Erfolg 3 neu
- [ ] UC-003: BR-0075 neu: Export mit den Umsätzen der Liste
- [ ] UC-003: BR-0076 neu: Export nur mit Umsätzen
- [ ] BR-0075: Neu in UC-003
- [ ] BR-0076: Neu in UC-003
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-54 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-54 grün

## Entscheidungen

- Mit welchem Trennzeichen und Zeichensatz soll die CSV-Datei erzeugt werden?
  **Antwort:** Semikolon als Trennzeichen, UTF-8 mit BOM, damit Excel in Deutschland die Datei direkt richtig öffnet
  _→ eingearbeitet in UC-003, BR-0075, BR-0076, GET /api/konten/{iban}/umsaetze/export, umsaetze, vision, NFR-001_
- In welcher Schreibweise stehen Buchungstag und Beträge (Betrag, Saldo danach) in der CSV-Datei?
  **Antwort:** Wie in der Umsatzliste: Buchungstag TT.MM.JJJJ, Beträge in Euro mit Dezimalkomma, ohne Tausenderpunkt und ohne Währungszeichen, Ausgang negativ (Beispiel -50,00)
  _→ eingearbeitet in UC-003, BR-0075, BR-0076, GET /api/konten/{iban}/umsaetze/export, umsaetze, vision, NFR-001_
