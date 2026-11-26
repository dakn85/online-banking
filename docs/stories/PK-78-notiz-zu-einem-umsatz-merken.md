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
| Umsätze | Geändert | Feld Notiz neu, Aktion Bestätigen geändert, Aktion Abbrechen geändert, und 5 weitere |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Ziel geändert, Erfolg 4 neu, BR-0106 neu: Notiz zu Umsätzen der angemeldeten Kundin, und 1 weitere |
| BR-0106 Notiz zu Umsätzen der angemeldeten Kundin | Neu | Neu in UC-003 |
| BR-0107 Löschen nur einer vorhandenen Notiz | Neu | Neu in UC-003 |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Das Abbrechen der Rückfrage behält die Notiz
- `acceptance/specs/umsaetze.spec`: Das Löschen einer nicht vorhandenen Notiz wird mit 404 abgewiesen
- `acceptance/specs/umsaetze.spec`: Das Löschen einer Notiz ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/umsaetze.spec`: Das Speichern einer Notiz ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/umsaetze.spec`: Die Notiz eines fremden Umsatzes wird mit 404 abgewiesen
- `acceptance/specs/umsaetze.spec`: Die Notiz wird nach der Bestätigung gelöscht
- `acceptance/specs/umsaetze.spec`: Ein leerer Notiztext wird abgelehnt
- `acceptance/specs/umsaetze.spec`: Ein neuer Notiztext überschreibt die vorhandene Notiz
- `acceptance/specs/umsaetze.spec`: Ein Notiztext über 140 Zeichen wird abgelehnt
- `acceptance/specs/umsaetze.spec`: Eine Notiz zu einem Umsatz wird gespeichert und in der Liste angezeigt

## Aufgaben für die Umsetzung

- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Beschreibung geändert
- [ ] Eigene Notiz zu einem Umsatz speichern oder überschreiben: Endpunkt neu
- [ ] Eigene Notiz zu einem Umsatz löschen: Endpunkt neu
- [ ] Umsatz: Eigenschaft notiz neu
- [ ] Notiz: Schema neu
- [ ] Umsatznotiz: Entität neu
- [ ] Umsätze: Feld Notiz neu
- [ ] Umsätze: Aktion Bestätigen geändert
- [ ] Umsätze: Aktion Abbrechen geändert
- [ ] Umsätze: Aktion Notiz erfassen neu
- [ ] Umsätze: Aktion Notiz ändern neu
- [ ] Umsätze: Aktion Speichern neu
- [ ] Umsätze: Aktion Notiz löschen neu
- [ ] Umsätze: Skizze geändert
- [ ] UC-003: Ziel geändert
- [ ] UC-003: Erfolg 4 neu
- [ ] UC-003: BR-0106 neu: Notiz zu Umsätzen der angemeldeten Kundin
- [ ] UC-003: BR-0107 neu: Löschen nur einer vorhandenen Notiz
- [ ] BR-0106: Neu in UC-003
- [ ] BR-0107: Neu in UC-003
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-78 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-78 grün

## Entscheidungen

- Wie lang darf der Notiztext zu einem Umsatz höchstens sein?
  **Antwort:** Höchstens 140 Zeichen, wie der Verwendungszweck des Umsatzes.
  _→ noch nicht in der Spezifikation_
- Was passiert, wenn die Kundin einen leeren Notiztext speichert?
  **Antwort:** Der Dienst lehnt ab und meldet, dass mindestens 1 Zeichen nötig ist; entfernt wird eine Notiz nur über das Löschen.
  _→ noch nicht in der Spezifikation_
- Soll die Kundin das Löschen einer Notiz vorher bestätigen?
  **Antwort:** Ja, eine Rückfrage mit „Bestätigen“ und „Abbrechen“ wie bei der Rückgabe einer Lastschrift, erst danach ist die Notiz weg.
  _→ eingearbeitet in UC-003, BR-0106, BR-0107, umsaetze, Umsatznotiz, GET /api/konten/{iban}/umsaetze, PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz, DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz, Schema Umsatz, Schema Notiz_
- Wie antwortet der Dienst, wenn die Kundin die Notiz eines Umsatzes löscht, der gar keine Notiz hat?
  **Antwort:** Mit 404 und der Meldung „Die Notiz wurde nicht gefunden.“
  _→ eingearbeitet in UC-003, BR-0106, BR-0107, umsaetze, Umsatznotiz, GET /api/konten/{iban}/umsaetze, PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz, DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz, Schema Umsatz, Schema Notiz_
