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
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Schritt 11 neu, BR-0011 geändert |
| BR-0011 Umsätze und Rückgaben nur für Konten der Kundin | Geändert | Text geändert |
| UC-024 Kontoauszug als PDF herunterladen | Neu | Use Case neu |
| BR-0098 Inhalt und Salden des Kontoauszugs | Neu | Neu in UC-024 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/kontoauszug.spec`: A1 Nicht angemeldet: Der Abruf des Kontoauszugs ohne Sitzung wird mit Status 401 beantwortet
- `acceptance/specs/kontoauszug.spec`: A1 Nicht angemeldet: Eine bis zum Herunterladen abgelaufene Sitzung führt zur Anmeldeseite
- `acceptance/specs/kontoauszug.spec`: A4 Monat ungültig: Ein Monat nach dem laufenden Monat wird mit Status 400 abgelehnt
- `acceptance/specs/kontoauszug.spec`: A5 Kontoauszug fehlgeschlagen: Die Maske zeigt die Fehlermeldung und liefert keine Datei
- `acceptance/specs/kontoauszug.spec`: Der Kontoauszug wird als Datei mit festem Namen heruntergeladen
- `acceptance/specs/kontoauszug.spec`: Der Kontoauszug zeigt Anfangssaldo, Endsaldo und alle Umsätze des Monats, neueste zuerst
- `acceptance/specs/kontoauszug.spec`: Der laufende Monat zeigt den Zwischenstand bis heute
- `acceptance/specs/kontoauszug.spec`: Der Monat des ersten Umsatzes zeigt den Saldo vor dem ersten Umsatz als Anfangssaldo
- `acceptance/specs/kontoauszug.spec`: Die Kreditkarte zeigt einen negativen Anfangssaldo aus dem Saldo vor dem ersten Umsatz
- `acceptance/specs/kontoauszug.spec`: Ein Konto, das nicht zur Kundin gehört, hat keinen Kontoauszug
- `acceptance/specs/kontoauszug.spec`: Ein Monat ohne Umsätze ergibt einen leeren Auszug mit Saldo
- `acceptance/specs/kontoauszug.spec`: Ein Monat vor dem ersten Umsatz zeigt den Saldo vor dem ersten Umsatz
- `acceptance/specs/kontoauszug.spec`: Ohne Anmeldung ist die Kontoauszugsseite nicht erreichbar

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine
- **Online-Banking-Dienst** (`src/`): neues Modul `kontoauszug.ts` (Monatsprüfung, Salden nach BR-0098, PDF-Erzeugung); neue Route `GET /api/konten/:iban/kontoauszug` in `main.ts`; neue Seite `/kontoauszug` in der Seitenliste.
- **Oberfläche** (`public/`): neue Seite `public/seiten/kontoauszug.js` (Maske Kontoauszug), Schaltfläche „Kontoauszug“ auf den Umsätzen (UC-003 Schritt 11).
- **Akzeptanztests**: fehlende Steps in `acceptance/tests/StepImplementation.ts`, PDF-Text wird mit pdfjs-dist gelesen.

## Schritte
1. UC-024 Schritt 4 / BR-0011: Prüfreihenfolge 401, Konto 404 (ohne Monatsprüfung), Monat 400 (Muster JJJJ-MM, höchstens laufender Monat), sonst PDF.
2. BR-0098 / BR-0008: Umsätze mit Buchungstag im Monat, neueste zuerst; Endsaldo = Saldo danach des neuesten Monatsumsatzes, sonst Saldo am Monatsende nach derselben Ableitung; Anfangssaldo = Saldo danach des neuesten Umsatzes vor dem Monatsersten, sonst Saldo vor dem ersten Umsatz, sonst Kontosaldo. Laufender Monat: Endsaldo = aktueller Saldo. Cent-Rundung (ADR-005).
3. UC-024 Schritt 5 / ADR-008: PDF beim Abruf aus den Umsätzen im Speicher, nicht gespeichert; Content-Disposition `attachment; filename="Kontoauszug_<IBAN ohne Leerzeichen>_<monat>.pdf"`; Beträge als Euro mit Tausenderpunkt und Komma.
4. UC-024 A5: Fehler beim Erzeugen ergibt 500 mit `fehler`; die Maske zeigt unabhängig davon die feste Meldung, auch bei nicht erreichbarem Dienst.
5. UC-024 A1/A3/A4: Maske zeigt die Meldungen aus der Spezifikation; 401 leitet auf die Anmeldeseite um.
6. Unit-Tests für BR-0098 und BR-0011 mit ID im Testnamen.

## Rahmenänderung
- Neue Bibliothek `pdfkit` (reines JavaScript, keine native Abhängigkeit) im Dienst, gemäß ADR-008; `pdfjs-dist` nur in den Akzeptanztests zum Lesen des PDF-Texts.

## Offene Fragen

- [ ] Soll die Meldung „Der Kontoauszug konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.“ für alle unerwarteten Fehler und den nicht erreichbaren Dienst gelten?

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
- Was sieht die Kundin, wenn der Auszug beim Herunterladen nicht erzeugt werden kann oder der Dienst nicht erreichbar ist, und was passiert, wenn die Sitzung bis dahin abgelaufen ist?
  **Antwort:** Neue Alternative A5 „Kontoauszug fehlgeschlagen“: Der Dienst antwortet mit 500 und dem Feld fehler, die Maske zeigt „Der Kontoauszug konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.“ und liefert keine Datei; läuft die Sitzung bis zum Herunterladen ab, antwortet der Dienst mit 401 und die Maske leitet auf die Anmeldeseite um (wie UC-003 A1). Vertrag, Maske und je ein Szenario wer
  _→ noch nicht in der Spezifikation_
