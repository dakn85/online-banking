# PK-78: Notiz zu einem Umsatz merken

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich zu einem Umsatz eine eigene Notiz erfassen, anzeigen, ändern und wieder löschen, damit ich mir den Grund einer Buchung selbst festhalten kann, ohne die Bank zu fragen.

## Nicht im Scope

Notizen zu Daueraufträgen, Überweisungen oder Nachrichten: Die Idee nennt nur Umsätze; andere Objekte sind ein späterer Ausbau.
Suche und Filter über Notizen: Die Idee verlangt nur das Merken einer Notiz, keine Auswertung oder Suche.
Export der Notizen (CSV/PDF): Nicht gefordert; der bestehende Umsatzexport betrifft nur Umsätze.
Erinnerungen oder Benachrichtigungen zu Notizen: Kein Hintergrundprozess und keine Benachrichtigung in der Idee genannt.
Notiz mit TAN bestätigen: Die Idee fordert keine TAN-Bestätigung; nur bei Datenänderungen wie persönlichen Daten vorgesehen.
Administration oder Reporting über Notizen: Kein administrativer oder berichtender Bedarf in der Idee.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl | Geändert | Beschreibung geändert |
| Eigene Notiz zu einem Umsatz speichern oder überschreiben | Neu | Endpunkt neu |
| Eigene Notiz zu einem Umsatz löschen | Neu | Endpunkt neu |
| Umsatz | Geändert | Eigenschaft notiz neu |
| Notiz | Neu | Schema neu |
| Umsatznotiz | Neu | Entität neu |
| Zugriffsschutz des Finanzstatus | Geändert | Gilt für geändert |
| Umsätze | Geändert | Feld Notiz neu, Aktion Bestätigen geändert, Aktion Abbrechen geändert, und 5 weitere |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Ziel geändert, Schritt 12 neu, Schritt 13 neu, und 10 weitere |
| BR-0106 Notiz zu Umsätzen der angemeldeten Kundin | Neu | Neu in UC-003 |
| BR-0107 Löschen nur einer vorhandenen Notiz | Neu | Neu in UC-003 |

## Akzeptanztests

- `acceptance/specs/ausgabenanalyse.spec`: Ohne Anmeldung ist die Ausgabenanalyse nicht erreichbar
- `acceptance/specs/dauerauftraege.spec`: Die Daueraufträge sind ohne Anmeldung nicht erreichbar
- `acceptance/specs/debitkarte.spec`: Die Debitkarte ist ohne Anmeldung nicht erreichbar
- `acceptance/specs/finanzstatus.spec`: Ohne Anmeldung ist der Finanzstatus nicht erreichbar
- `acceptance/specs/kontoauszug.spec`: Ohne Anmeldung ist die Kontoauszugsseite nicht erreichbar
- `acceptance/specs/tageslimit.spec`: Das Tageslimit ist ohne Anmeldung nicht erreichbar
- `acceptance/specs/umbuchung.spec`: Ohne Anmeldung ist die Umbuchung nicht erreichbar
- `acceptance/specs/umsaetze.spec`: Das Abbrechen der Rückfrage behält die Notiz
- `acceptance/specs/umsaetze.spec`: Das Löschen einer nicht vorhandenen Notiz wird mit 404 abgewiesen
- `acceptance/specs/umsaetze.spec`: Das Löschen einer Notiz ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/umsaetze.spec`: Das Speichern einer Notiz ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/umsaetze.spec`: Das Speichern einer Notiz zu einem fremden Umsatz meldet "Der Umsatz wurde nicht gefunden."
- `acceptance/specs/umsaetze.spec`: Das Speichern einer Notiz zu einem Umsatz eines fremden Kontos meldet "Das Konto wurde nicht gefunden."
- `acceptance/specs/umsaetze.spec`: Die Notiz wird nach der Bestätigung gelöscht
- `acceptance/specs/umsaetze.spec`: Ein leerer Notiztext wird abgelehnt
- `acceptance/specs/umsaetze.spec`: Ein neuer Notiztext überschreibt die vorhandene Notiz
- `acceptance/specs/umsaetze.spec`: Ein Notiztext außerhalb der Feldlänge wird abgelehnt
- `acceptance/specs/umsaetze.spec`: Ein Notiztext über 140 Zeichen wird abgelehnt
- `acceptance/specs/umsaetze.spec`: Eine Notiz zu einem Umsatz wird gespeichert und in der Liste angezeigt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne Anmeldung sind die vorgemerkten Überweisungen nicht erreichbar

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-26_

## Bausteine

- **Online-Banking-Dienst, Component „Konten und Finanzstatus“** (`src/`): neues Modul `src/umsatznotiz.ts` (kennt kein HTTP), Erweiterung von `src/umsaetze.ts` (Feld `notiz` am Umsatz), zwei Routen in `src/main.ts` (Seitenauslieferung).
- **Oberfläche im Browser** (`public/seiten/umsaetze.js`, `public/styles.css`, `public/app.js` für ein Symbol): Notiz in der Zeile, Zeilenaktion, Seitenblatt „Notiz zum Umsatz“, Rückfrage.
- **Tests**: `test/umsatznotiz.test.ts` (node:test), fehlende Steps in `acceptance/tests/StepImplementation.ts`.

## Schritte

1. **Umsatznotiz im Speicher (Umsatznotiz, ADR-002):** Die Notiz hängt als optionales Feld am gespeicherten Umsatz. Damit trägt nach einem Reset kein Umsatz eine Notiz, und bei Lastkunden fällt sie mit dem verdrängten Umsatz weg. Reihenfolge, Saldo danach, Filter, Trefferzahl und CSV-Export lesen das Feld nicht (BR-0008, BR-0075, BR-0104, BR-0105).
2. **GET /api/konten/{iban}/umsaetze (UC-003 Schritt 12, BR-0106):** Jeder Umsatz liefert `notiz`, wenn er eine hat; sonst fehlt das Feld.
3. **PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz (UC-003 Schritt 15, A15 bis A17, BR-0106):** Sitzung (401, NFR-001), Konto der Kundin (404 „Das Konto wurde nicht gefunden.“), Umsatz des Kontos (404 „Der Umsatz wurde nicht gefunden.“), Text nach dem Entfernen der Randleerzeichen 1..140 Zeichen (400 mit „Die Notiz muss mindestens 1 Zeichen enthalten.“ oder „Die Notiz darf höchstens 140 Zeichen lang sein.“); dann speichern oder überschreiben, Antwort 200 mit `{ text }`.
4. **DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz (UC-003 Schritt 16, A18, BR-0107):** 401, 404 Konto, 404 Umsatz, 404 „Die Notiz wurde nicht gefunden.“ bei einem Umsatz ohne Notiz; sonst löschen, Antwort 204.
5. **Maske Umsätze (UC-003 Schritte 12 bis 16):** In der Zeile die Notiz (Feld „Notiz“) und genau eine Aktion „Notiz erfassen“ oder „Notiz ändern“. Die Aktion öffnet das Seitenblatt „Notiz zum Umsatz“ für diesen Umsatz (Gegenpartei sichtbar, umsatzId festgehalten), mit dem bisherigen Text, „Speichern“ und, nur bei vorhandener Notiz, „Notiz löschen“. „Notiz löschen“ zeigt die Rückfrage „Notiz zu <Gegenpartei> löschen? Die Notiz lässt sich nicht wiederherstellen.“ mit „Bestätigen“ und „Abbrechen“ (BR-0107). Meldungen „Notiz gespeichert.“ und „Notiz gelöscht.“ sowie die 404-Texte stehen über der Liste; die Meldung nach A15 steht am Feld Notiz im Blatt, die Eingabe bleibt stehen.
6. **Prüfung des Notiztexts (A15):** Die Oberfläche schickt den Text unverändert, der Dienst prüft und liefert den Meldungstext; die Seite zeigt ihn unverändert (wie bei den Daueraufträgen). Eine zweite Prüfung im Browser gibt es nicht, weil das Szenario „Ein Notiztext außerhalb der Feldlänge wird abgelehnt“ die Antwort 400 des Dienstes an der Maske erwartet.
7. **Unit-Tests** für BR-0106 und BR-0107 am Modul, **Steps** für die 16 fehlenden Schritte, darunter „Die Debitkarte ist ohne Anmeldung nicht erreichbar“ (NFR-001).

## Rahmenänderung

Keine neue Bibliothek, kein neues Muster. Abweichung von ADR-004 nur in Schritt 6 (Prüfung allein im Dienst); dazu folgt eine Rückmeldung.

## Offen

- Prüfreihenfolge 404 vor 400 beim PUT ist nicht festgelegt; umgesetzt wie oben (Rückmeldung folgt).
- Zwei Szenarien passen nicht zum Bestand (umsatzId `U-0007` existiert im Dienst nicht; „Ein Notiztext außerhalb der Feldlänge wird abgelehnt“ prüft ohne Filterschritt die erste Zeile). Dazu folgen Rückfragen.

## Entscheidungen

- Wie lang darf der Notiztext zu einem Umsatz höchstens sein?
  **Antwort:** Höchstens 140 Zeichen, wie der Verwendungszweck des Umsatzes.
  _→ eingearbeitet durch „UC-003: Eigene Notiz je Umsatz merken, ändern und löschen“ in UC-003, BR-NEU1, BR-NEU2, umsaetze, Umsatznotiz, GET /api/konten/{iban}/umsaetze, PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz, DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz, Schema Umsatz, Schema Notiz · e11fbce_
- Was passiert, wenn die Kundin einen leeren Notiztext speichert?
  **Antwort:** Der Dienst lehnt ab und meldet, dass mindestens 1 Zeichen nötig ist; entfernt wird eine Notiz nur über das Löschen.
  _→ eingearbeitet durch „UC-003: Eigene Notiz je Umsatz merken, ändern und löschen“ in UC-003, BR-NEU1, BR-NEU2, umsaetze, Umsatznotiz, GET /api/konten/{iban}/umsaetze, PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz, DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz, Schema Umsatz, Schema Notiz · e11fbce_
- Soll die Kundin das Löschen einer Notiz vorher bestätigen?
  **Antwort:** Ja, eine Rückfrage mit „Bestätigen“ und „Abbrechen“ wie bei der Rückgabe einer Lastschrift, erst danach ist die Notiz weg.
  _→ eingearbeitet in UC-003, BR-0106, BR-0107, umsaetze, Umsatznotiz, GET /api/konten/{iban}/umsaetze, PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz, DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz, Schema Umsatz, Schema Notiz · e11fbce_
- Wie antwortet der Dienst, wenn die Kundin die Notiz eines Umsatzes löscht, der gar keine Notiz hat?
  **Antwort:** Mit 404 und der Meldung „Die Notiz wurde nicht gefunden.“
  _→ eingearbeitet in UC-003, BR-0106, BR-0107, umsaetze, Umsatznotiz, GET /api/konten/{iban}/umsaetze, PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz, DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz, Schema Umsatz, Schema Notiz · e11fbce_
- Wie meldet der Dienst beim Speichern und Löschen einer Notiz die drei 404-Fälle, und was zeigt die Maske je Fall?
  **Antwort:** Je Fall eigener Text im Feld fehler: fremde IBAN „Das Konto wurde nicht gefunden.“, fremde umsatzId „Der Umsatz wurde nicht gefunden.“, Umsatz ohne Notiz beim Löschen „Die Notiz wurde nicht gefunden.“; die Maske zeigt genau diesen Text.
  _→ eingearbeitet in UC-003 · 3f6eb86_
- Wie öffnet die Kundin das Notizformular je Umsatz, und welche Aktion steht in der Zeile?
  **Antwort:** Je Zeile eine Aktion: „Notiz erfassen“ ohne Notiz, „Notiz ändern“ mit Notiz; beide öffnen das Formular für genau diesen Umsatz, „Speichern“ schickt PUT mit dessen umsatzId.
  _→ eingearbeitet in UC-003 · 3f6eb86_
- Wo soll die Kundin „Notiz löschen“ wählen?
  **Antwort:** Im Formular Notiz zum Umsatz, das den Umsatz festhält
  _→ eingearbeitet in UC-003, NFR-001 · a8cffa3_
- Welchen Text zeigt die Maske bei einem Notiztext außerhalb von 1 bis 140 Zeichen?
  **Antwort:** Es gelten die zwei Texte, die die Akzeptanztests der Story schon erwarten: „Die Notiz muss mindestens 1 Zeichen enthalten.“ bei leerem Text und „Die Notiz darf höchstens 140 Zeichen lang sein.“ bei zu langem Text. Beide stehen als Meldung im Ablauf von UC-003.
  _→ eingearbeitet durch „UC-003: Doppelte Notiz-Alternativen zusammenführen, Meldungen führen, Maskenverweise und Sitzungspflicht belegen“ in UC-003, umsaetze_
- Zeigt das Szenario die nicht einschränkende Auswahl „Alle“ an genau einer Zeile einer anderen Kategorie, oder soll es dafür die Gesamtzahl der Treffer vergleichen?
  **Antwort:** Genau eine Zeile einer anderen Kategorie, über Betrag bis „12,00“ eingegrenzt, wie vorgeschlagen.
  _→ ohne Änderung: Betrifft das Szenario zum Kategoriefilter; der Vorschlag dazu ist abgelehnt, die Notiz-Story ändert daran nichts._
- Soll der Hinweis des Feldes Notiz bei einem zu langen Text als Meldung im Bereich der Umsätze erscheinen?
  **Antwort:** Ja, als Meldung im Bereich der Umsätze, wie es die bestehenden Notiz-Meldungen tun.
  _→ eingearbeitet · e7adbcd_
- Soll der Dienst einen ausdrücklich mitgeschickten Wert „Alle“ als Formatfehler mit 400 abweisen und dabei keinen eigenen Text liefern?
  **Antwort:** Ja, 400 nach der Werteliste, ohne eigenen Text.
  _→ ohne Änderung: Der Vertrag weist Werte außerhalb der Werteliste schon mit 400 ab; die Antwort bestätigt den Bestand._
- Wie soll der Befund „UC-003: 1 Fall hat kein Szenario“ gelöst werden?
  **Antwort:** Das Szenario „Das Löschen einer nicht vorhandenen Notiz wird mit 404 abgewiesen“ prüft zusätzlich die Meldung „Die Notiz wurde nicht gefunden.“, so wie die beiden anderen 404-Szenarien ihre Meldung prüfen.
  _→ eingearbeitet durch „UC-003 A18: Szenario prüft die Meldung „Die Notiz wurde nicht gefunden.““_
