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
| Umsatz | Geändert | Attribut buchungstag geändert, Attribut betrag geändert, Attribut saldoDanach geändert |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Umsätze | Geändert | Aktion Als CSV exportieren neu, Skizze geändert |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Ziel geändert, Notizen geändert, Schritt 9 neu, und 10 weitere |
| BR-0075 Export mit den Umsätzen der Liste | Neu | Neu in UC-003 |
| BR-0076 Export nur mit Umsätzen | Neu | Neu in UC-003 |
| Vision | Geändert | Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Der CSV-Export berücksichtigt den Filter Ein-/Ausgang
- `acceptance/specs/umsaetze.spec`: Der CSV-Export einer leeren Auswahl liefert keine Datei und zeigt die Meldung
- `acceptance/specs/umsaetze.spec`: Der CSV-Export eines fremden Kontos zeigt, dass das Konto nicht gefunden wurde
- `acceptance/specs/umsaetze.spec`: Der CSV-Export enthält die gefilterten Umsätze, neueste zuerst, mit Saldo danach
- `acceptance/specs/umsaetze.spec`: Der CSV-Export mit Von-Datum nach dem Bis-Datum zeigt die Meldung zum ungültigen Zeitraum
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei hat den Content-Type text/csv und Zeilenende CRLF
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei ist UTF-8 mit BOM, durch Semikolon getrennt und nach dem Konto benannt
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei schreibt den Buchungstag als TT.MM.JJJJ und Beträge mit Dezimalkomma
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei setzt einen Text mit Semikolon in Anführungszeichen, sodass die Spalten stimmen
- `acceptance/specs/umsaetze.spec`: Ein fehlgeschlagener Export zeigt die Fehlermeldung
- `acceptance/specs/umsaetze.spec`: Ohne Anmeldung ist der CSV-Export nicht erreichbar

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-19_

## Bausteine
- Konten und Finanzstatus (`src/umsaetze.ts`): neue Funktion `exportCsv` baut aus den gefilterten Umsätzen der Liste die CSV-Datei (UC-003, BR-0075). Es gibt keine eigene Auswahl, die Datei nutzt `umsaetzeVon` und damit dieselbe Auswahl, Reihenfolge und denselben Saldo danach (BR-0008, BR-0009, BR-0010).
- Seitenauslieferung (`src/main.ts`): neue Route `GET /api/konten/:iban/umsaetze/export` hinter `nurAngemeldet('api')` (NFR-001). Die Reihenfolge der Prüfungen ist 404 für eine fremde IBAN (BR-0011), 400 für einen ungültigen Zeitraum (BR-0010), 422 für eine leere Auswahl (BR-0076). Antwort mit `text/csv; charset=utf-8` und `Content-Disposition: attachment; filename="umsaetze-<IBAN>.csv"`. Es wird nichts gespeichert.
- Oberfläche (`public/seiten/umsaetze.js`): Knopf „Als CSV exportieren“ mit den aktuellen Filterwerten. Die Seite ruft per fetch auf und lädt bei 200 den Blob herunter; bei 401 geht es zur Anmeldung, bei 400, 404 und 422 erscheint die Fehlermeldung des Dienstes, sonst „Der Export ist fehlgeschlagen. Bitte versuchen Sie es später erneut.“ (A1 bis A4).
- Akzeptanztests (`acceptance/tests/StepImplementation.ts`): die 17 fehlenden Steps. Sie klicken den Knopf, prüfen den Status der Export-Antwort und die Datei. Der Fehlerfall wird per Playwright-Route simuliert.

## Schritte
1. CSV-Format nach UC-003 Notizen: BOM, Semikolon, CRLF, Kopfzeile, Datum TT.MM.JJJJ, Beträge mit Dezimalkomma ohne Tausenderpunkt, Quoting bei Semikolon, Anführungszeichen und Zeilenumbruch (UC-003).
2. Route mit Fehlerreihenfolge (BR-0011, BR-0010, BR-0076, NFR-001).
3. Knopf und Fehleranzeige in der Oberfläche.
4. Unit-Tests in `test/umsaetze.test.ts` mit BR-0075 und BR-0076 im Namen.
5. Steps implementieren.

## Rahmenänderung
Keine neue Bibliothek, das CSV wird von Hand geschrieben.

## Entscheidungen

- Mit welchem Trennzeichen und Zeichensatz soll die CSV-Datei erzeugt werden?
  **Antwort:** Semikolon als Trennzeichen, UTF-8 mit BOM, damit Excel in Deutschland die Datei direkt richtig öffnet
  _→ eingearbeitet in UC-003, BR-0075, BR-0076, GET /api/konten/{iban}/umsaetze/export, umsaetze, vision, NFR-001 · deaed2d_
- In welcher Schreibweise stehen Buchungstag und Beträge (Betrag, Saldo danach) in der CSV-Datei?
  **Antwort:** Wie in der Umsatzliste: Buchungstag TT.MM.JJJJ, Beträge in Euro mit Dezimalkomma, ohne Tausenderpunkt und ohne Währungszeichen, Ausgang negativ (Beispiel -50,00)
  _→ eingearbeitet in UC-003, BR-0075, BR-0076, GET /api/konten/{iban}/umsaetze/export, umsaetze, vision, NFR-001 · deaed2d_
