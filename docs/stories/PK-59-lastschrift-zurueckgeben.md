# PK-59: Lastschrift zurückgeben

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich eine SEPA-Lastschrift aus den Umsätzen meines Girokontos innerhalb von 8 Wochen nach der Belastung zurückgeben, damit der Betrag wieder auf meinem Girokonto gutgeschrieben wird.

## Nicht im Scope

- Widerspruch/Rückgabe mit Begründung oder Rückgabegrund-Auswahl: Die Idee nennt keinen Grund; die Rückgabe ist nur Frist und Gutschrift.
- Rückgabe von Lastschriften anderer Kontoarten oder Kartenzahlungen: Die Idee nennt nur SEPA-Lastschriften aus dem Girokonto.
- Benachrichtigung per E-Mail/Push: Nicht gefordert; Rückmeldung nur auf der Maske.
- Rückgängig machen einer Rückgabe: Keine weitere Aktion genannt.
- Rückgabe-Übersicht oder Bericht: Nicht gefordert; die Rückgabe erscheint nur in den Umsätzen.
- Rückbuchung der Lastschrift beim Zahlungsempfänger / Kernbank-Anbindung: C-001 nutzt Demo-Konten statt Kernbank; Abwicklung mit dem Einreicher gehört nicht zur Idee.
- Sonderfristen (z. B. 13 Monate bei nicht autorisierter Lastschrift): Die Idee nennt nur 8 Wochen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos mit Saldo danach, neueste zuerst | Geändert | Beschreibung geändert |
| Lastschrift zurückgeben und Betrag gutschreiben | Neu | Endpunkt neu |
| Umsatz | Geändert | Eigenschaft umsatzId neu, Eigenschaft sepaLastschrift neu, Eigenschaft zurueckgegeben neu, Beschreibung geändert, Attribut umsatzId neu, Attribut sepaLastschrift neu, und 2 weitere |
| Rueckgabe | Neu | Schema neu |
| Architektur | Geändert | Bausteinsicht geändert, Querschnittliche Konzepte geändert |
| Zugriffsschutz des Finanzstatus | Geändert | Maß geändert, Gilt für geändert |
| Umsätze | Geändert | Use Case UC-022 neu, Feld Rückgabe neu, Aktion Zurückgeben neu, und 3 weitere |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Notizen geändert, Schritt 5 geändert, BR-0011 geändert |
| BR-0011 Umsätze und Rückgaben nur für Konten der Kundin | Geändert | Titel geändert, Text geändert |
| UC-022 Lastschrift zurückgeben | Neu | Use Case neu |
| BR-0093 Rückgabefrist von 8 Wochen | Neu | Neu in UC-022 |
| BR-0094 Nur SEPA-Lastschriften des Girokontos und nur einmal zurückgebbar | Neu | Neu in UC-022 |
| BR-0095 Gutschrift und Umsatz einer Rückgabe | Neu | Neu in UC-022 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/lastschrift-zurueckgeben.spec`: Das Abbrechen der Rückfrage bucht nichts
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Die bestätigte Rückgabe schreibt den Betrag gut und zeigt die Gutschrift als Umsatz
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Ein Umsatz ohne SEPA-Lastschrift wird abgelehnt
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Ein unbekannter Umsatz wird mit Umsatz nicht gefunden abgewiesen
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Eine fremde IBAN wird bei der Rückgabe mit Konto nicht gefunden abgewiesen
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Eine Lastschrift nach Ablauf der Frist von 8 Wochen wird abgelehnt
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Eine umsatzId, die die Feldbedingung verletzt, wird bei der Rückgabe mit 400 abgewiesen
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Eine zurückgegebene Lastschrift lässt sich nicht erneut zurückgeben
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Ohne gültige Sitzung weist der Dienst die Rückgabe mit 401 ab
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Umsätze der Kreditkarte bieten keine Rückgabe an
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei schreibt den Buchungstag als TT.MM.JJJJ und Beträge mit Dezimalkomma
- `acceptance/specs/umsaetze.spec`: Die Umsatzliste zeigt den Buchungstag als TT.MM.JJJJ

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine (docs/architecture.md)
- **Konten und Finanzstatus** (`src/konten.ts`, `src/umsaetze.ts`): neue Funktion zum Gutschreiben auf dem Girokonto; der Umsatz bekommt `umsatzId`, `sepaLastschrift`, `zurueckgegeben`. Die neue Rückgabe-Logik liegt in `src/lastschrift.ts` (kein HTTP, Speicherzustand nach ADR-002).
- **Seitenauslieferung**: `POST /api/konten/:iban/umsaetze/:umsatzId/rueckgaben` in `src/main.ts` hinter `nurAngemeldet('api')` (NFR-001).
- **Oberfläche** (`public/seiten/umsaetze.js`): Spalte Rückgabe mit „Zurückgeben“ / „Zurückgegeben“, Rückfrage mit Bestätigen/Abbrechen (Bestätigen bis zur Antwort gesperrt), Meldungen aus dem Feld `fehler`, danach Umsätze neu laden.
- **Testdaten** (`src/umsaetze.ts`, Reset): Girokonto bekommt zwei SEPA-Lastschriften (Fitnessstudio Vital, 14 Tage vor Reset-Tag, -29,90; Zeitungsverlag Nord, 70 Tage davor, -14,90) mit Salden nach C-001; ältere Demo-Umsätze rutschen um 44,80 nach oben.
- **Akzeptanztests**: fehlende Steps in `acceptance/tests/StepImplementation.ts` (Rückgabe wählen, bestätigen, abbrechen, Rückfrage, keine Rückgabe angeboten, Dienst weist Rückgabe ab per HTTP mit Sitzung).

## Schritte
1. Umsatz um `umsatzId` (1..36, vom Dienst vergeben), `sepaLastschrift`, `zurueckgegeben` erweitern; GET liefert sie (UC-003, UC-022).
2. Rückgabe prüft in der Reihenfolge Konto 404 (BR-0011), Umsatz 404, keine Lastschrift 422, schon zurückgegeben 422 (BR-0094), Frist 56 Tage gegen heutigen UTC-Tag 422 (BR-0093); umsatzId-Länge vorab 400.
3. Gutschrift: Saldo erhöhen, genau ein Umsatz (Verwendungszweck „Rückgabe Lastschrift“, Gegenpartei der Lastschrift, Eingang, nicht Lastschrift), Lastschrift als zurückgegeben markieren; Beträge auf Cent (BR-0095, ADR-005). Unit-Tests mit BR-0093/0094/0095 im Namen.
4. Umsatzseite und Steps wie oben (UC-022, UC-003).

## Rahmenänderung
Keine neue Bibliothek, kein neues Muster. Hinweis: Merge von origin/main in den Story-Zweig hatte Konflikte in docs/; sie sind durch Vereinigung beider Seiten gelöst. Die Ziel-ID Z-8 der Story kollidiert mit Z-8 (Debitkarte) auf main; dazu Rückmeldung mit Vorschlag Z-14.

## Entscheidungen

- Welche SEPA-Lastschriften trägt das Girokonto im Ausgangsstand? Heute gibt es keine; alle Demo-Umsätze sind älter als 8 Wochen, und die Rückgabe lässt sich ohne Lastschrift in der Frist nicht prüfen.
  **Antwort:** Zwei neue Demo-Lastschriften auf dem Girokonto: eine mit Buchungstag relativ zum Reset-Tag (in der Frist), eine mit Buchungstag über 8 Wochen zurück; die bestehenden Szenarien mit fester Zeilenliste der Umsätze werden angepasst.
  _→ eingearbeitet in UC-022, BR-0093, BR-0094, BR-0095, UC-003, Umsatz, GET /api/konten/{iban}/umsaetze, POST /api/konten/{iban}/umsaetze/{umsatzId}/rueckgaben, Schema Umsatz, Schema Rueckgabe, umsaetze, NFR-001, vision, architektur · d9654e1_
- Gibt die Kundin die Lastschrift mit einem Klick zurück, oder muss sie die Rückgabe vorher bestätigen? Die Rückgabe lässt sich danach nicht rückgängig machen.
  **Antwort:** Rückfrage mit Betrag und Gegenpartei auf der Maske Umsätze, erst „Bestätigen“ bucht die Gutschrift; keine neue Maske.
  _→ eingearbeitet in UC-022, BR-0093, BR-0094, BR-0095, UC-003, Umsatz, GET /api/konten/{iban}/umsaetze, POST /api/konten/{iban}/umsaetze/{umsatzId}/rueckgaben, Schema Umsatz, Schema Rueckgabe, umsaetze, NFR-001, vision, architektur · d9654e1_
- Wie verhält sich die Umsatzseite nach einer abgelehnten oder wiederholten Bestätigung der Rückgabe?
  **Antwort:** Die Rückfrage schließt, die Umsätze werden neu geladen, und die Meldung des Dienstes steht (404, 422); „Bestätigen“ ist während des Absendens gesperrt. Eine zweite Anfrage liefert 422 „Die Lastschrift wurde bereits zurückgegeben.“ und bucht nichts; die Zeile zeigt danach den aktuellen Stand.
  _→ eingearbeitet in UC-022 · 356ac64_
- Die Demo-Lastschrift Fitnessstudio Vital (14 Tage vor dem Reset-Tag, -29,90 €, UC-022/Umsatz) ist ein Ausgang des Girokontos. Liegt dieser Tag im aktuellen Monat (heute ab dem 15.), zählt sie nach BR-0083 in der Ausgabenanalyse. Das Szenario „Eine neue Überweisung erscheint in der Kategorie Sonstiges“ (acceptance/specs/ausgabenanalyse.spec:26, PK-56) erwartet für den aktuellen Monat aber nur Sonstiges 50,00 € / 100,0 %; heute (20.11.) kommt zusätzlich eine Zeile mit 29,90 € und 37,4 % hinzu. Das Szenario ist also vom Tag des Monats abhängig und wird rot. Die Umsetzung folgt der Spezifikation (Lastschrift 14 Tage vor dem Reset-Tag, Kategorie nicht vorgegeben), die Szenarien darf ich nicht ändern.
  **Antwort:** Die Demo-Lastschrift liegt immer im Vormonat: Buchungstag ist der letzte Tag des Vormonats (relativ zum Reset-Tag), nicht 14 Tage vor dem Reset-Tag. Der liegt immer im Vormonat und höchstens 31 Tage zurück, also innerhalb der 8-Wochen-Frist. Keine Sonderregel in BR-0083; das Szenario der Ausgabenanalyse bleibt unverändert.
  _→ eingearbeitet in Umsatz, umsaetze_
