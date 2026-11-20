# PK-62: Kontoauszug als PDF herunterladen

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich zu einem meiner Konten den Kontoauszug eines Monats als PDF herunterladen, damit ich Anfangssaldo, Endsaldo und alle Umsätze des Monats auch außerhalb des Online-Bankings vorliegen habe.

## Nicht im Scope

- Versand des Kontoauszugs per E-Mail oder Postfach: Die Idee nennt nur den Download.
- Automatische monatliche Erstellung und Benachrichtigung: Kein Hintergrundprozess oder Benachrichtigung genannt; Auszug wird nur auf Abruf erzeugt.
- Auszug für frei wählbaren Zeitraum oder andere Formate (CSV): Gefordert ist nur ein Kalendermonat als PDF.
- Archiv bereits erzeugter Auszüge: Keine Ablage oder Verwaltung gefordert.
- Auszug für mehrere Konten in einem Dokument: Die Idee nennt genau ein Konto je Auszug.
- CSV-Export der Umsätze (UC-003 Schritte 9 und 10, A5 bis A8, BR-0075, BR-0076, GET /api/konten/{iban}/umsaetze/export, „Als CSV exportieren“): gehört zu PK-54; PK-62 ergänzt auf den Umsätzen nur „Kontoauszug“ (UC-003 Schritt 11).

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Kontoauszug wird beim Abruf im Dienst als PDF erzeugt | Neu | Entscheidung neu |
| Kontoauszug eines Kontos für einen Monat als PDF | Neu | Endpunkt neu |
| Umsatz | Geändert | Attribut buchungstag geändert, Attribut betrag neu, Attribut saldoDanach neu |
| Kontoauszug | Neu | Entität neu, Maske neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Umsätze | Geändert | Use Case UC-024 neu, Aktion Kontoauszug neu, Skizze geändert |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Schritt 11 neu |
| UC-024 Kontoauszug als PDF herunterladen | Neu | Use Case neu |
| BR-0098 Inhalt und Salden des Kontoauszugs | Neu | Neu in UC-024 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/kontoauszug.spec`: A1 Nicht angemeldet: Der Abruf des Kontoauszugs ohne Sitzung wird mit Status 401 beantwortet
- `acceptance/specs/kontoauszug.spec`: A4 Monat ungültig: Ein Monat nach dem laufenden Monat wird mit Status 400 abgelehnt
- `acceptance/specs/kontoauszug.spec`: Der Kontoauszug wird als Datei mit festem Namen heruntergeladen
- `acceptance/specs/kontoauszug.spec`: Der Kontoauszug zeigt Anfangssaldo, Endsaldo und alle Umsätze des Monats, neueste zuerst
- `acceptance/specs/kontoauszug.spec`: Der laufende Monat zeigt den Zwischenstand bis heute
- `acceptance/specs/kontoauszug.spec`: Der Monat des ersten Umsatzes zeigt den Saldo vor dem ersten Umsatz als Anfangssaldo
- `acceptance/specs/kontoauszug.spec`: Die Kreditkarte zeigt einen negativen Anfangssaldo aus dem Saldo vor dem ersten Umsatz
- `acceptance/specs/kontoauszug.spec`: Ein Konto, das nicht zur Kundin gehört, hat keinen Kontoauszug
- `acceptance/specs/kontoauszug.spec`: Ein Monat ohne Umsätze ergibt einen leeren Auszug mit Saldo
- `acceptance/specs/kontoauszug.spec`: Ein Monat vor dem ersten Umsatz zeigt den Saldo vor dem ersten Umsatz
- `acceptance/specs/kontoauszug.spec`: Ohne Anmeldung ist die Kontoauszugsseite nicht erreichbar

## Aufgaben für die Umsetzung

- [ ] Kontoauszug wird beim Abruf im Dienst als PDF erzeugt: Entscheidung neu
- [ ] Kontoauszug eines Kontos für einen Monat als PDF: Endpunkt neu
- [ ] Umsatz: Attribut buchungstag geändert
- [ ] Umsatz: Attribut betrag neu
- [ ] Umsatz: Attribut saldoDanach neu
- [ ] Kontoauszug: Entität neu
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Kontoauszug: Maske neu
- [ ] Umsätze: Use Case UC-024 neu
- [ ] Umsätze: Aktion Kontoauszug neu
- [ ] Umsätze: Skizze geändert
- [ ] UC-003: Schritt 11 neu
- [ ] UC-024: Use Case neu
- [ ] BR-0098: Neu in UC-024
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-62 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-62 grün

## Entscheidungen

- Welchen Saldo zeigt der leere Auszug eines Monats vor dem ersten Umsatz des Kontos, etwa Januar 2026 bei der Kreditkarte? Der Demo-Bestand beginnt am 28.01.2026.
  **Antwort:** Der Saldo vor dem ersten Umsatz (Saldo danach minus Betrag) gilt als Anfangs- und Endsaldo aller früheren Monate; der Auszug ist leer.
  _→ eingearbeitet in vision, Kontoauszug, UC-024, BR-0098, GET /api/konten/{iban}/kontoauszug, umsaetze, kontoauszug, NFR-001, ADR-008 · 3ae9325_
- Welche Monate darf die Kundin wählen: den laufenden Monat und Monate in der Zukunft?
  **Antwort:** Vergangene Monate und der laufende Monat (Zwischenstand bis heute); zukünftige Monate lehnt der Dienst mit 400 und einer Meldung ab.
  _→ eingearbeitet in vision, Kontoauszug, UC-024, BR-0098, GET /api/konten/{iban}/kontoauszug, umsaetze, kontoauszug, NFR-001, ADR-008 · 3ae9325_
- In welcher Reihenfolge stehen die Umsätze im Kontoauszug?
  **Antwort:** Neueste zuerst wie in den Umsätzen (BR-0008); der Endsaldo steht oben bei der ersten Zeile.
  _→ eingearbeitet in vision, Kontoauszug, UC-024, BR-0098, GET /api/konten/{iban}/kontoauszug, umsaetze, kontoauszug, NFR-001, ADR-008 · 3ae9325_
- Gehört der CSV-Export der Umsätze (UC-003 Schritte 9 und 10, A5 bis A8, BR-0075, BR-0076, GET /api/konten/{iban}/umsaetze/export, Schaltfläche „Als CSV exportieren“, Erweiterung von NFR-001 um den Export) zu PK-62 oder nur der Kontoauszug als PDF?
  **Antwort:** Nur der Kontoauszug: Der Export gehört zu PK-54 und wird aus dem Änderungsumfang von PK-62 genommen. Von UC-003 bleiben Schritt 11 (Kontoauszug öffnen) und die Schaltfläche „Kontoauszug“ auf den Umsätzen. Die Export-Operation wird mit „untouched“ gemeldet. Die Formatangaben zu Betrag und Saldo danach in der Entität Umsatz bleiben auf die Anzeige im Kontoauszug beschränkt, die CSV-Formate entfallen
  _→ noch nicht in der Spezifikation_
