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

## Aufgaben für die Umsetzung

- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Beschreibung geändert
- [ ] Eigene Notiz zu einem Umsatz speichern oder überschreiben: Endpunkt neu
- [ ] Eigene Notiz zu einem Umsatz löschen: Endpunkt neu
- [ ] Umsatz: Eigenschaft notiz neu
- [ ] Notiz: Schema neu
- [ ] Umsatznotiz: Entität neu
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Umsätze: Feld Notiz neu
- [ ] Umsätze: Aktion Bestätigen geändert
- [ ] Umsätze: Aktion Abbrechen geändert
- [ ] Umsätze: Aktion Notiz erfassen neu
- [ ] Umsätze: Aktion Notiz ändern neu
- [ ] Umsätze: Aktion Speichern neu
- [ ] Umsätze: Aktion Notiz löschen neu
- [ ] Umsätze: Skizze geändert
- [ ] UC-003: Ziel geändert
- [ ] UC-003: Schritt 12 neu
- [ ] UC-003: Schritt 13 neu
- [ ] UC-003: Schritt 14 neu
- [ ] UC-003: Schritt 15 neu
- [ ] UC-003: Schritt 16 neu
- [ ] UC-003: A15 neu: Notiztext außerhalb der Feldbedingung
- [ ] UC-003: A16 neu: Konto nicht gefunden beim Speichern der Notiz
- [ ] UC-003: A17 neu: Umsatz nicht gefunden beim Speichern der Notiz
- [ ] UC-003: A18 neu: Notiz nicht gefunden beim Löschen
- [ ] UC-003: Erfolg 4 neu
- [ ] UC-003: BR-0106 neu: Notiz zu Umsätzen der angemeldeten Kundin
- [ ] UC-003: BR-0107 neu: Löschen nur einer vorhandenen Notiz
- [ ] BR-0106: Neu in UC-003
- [ ] BR-0107: Neu in UC-003
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-78 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-78 grün

## Offene Fragen

- [ ] Soll die Kontenprüfung der Ausgabenanalyse in BR-0084 stehen (wie bisher im Ablauf von UC-019) oder soll BR-0011 ausdrücklich auch für die Ausgabenanalyse gelten?
- [ ] Zeigt das Szenario die nicht einschränkende Auswahl „Alle“ an genau einer Zeile einer anderen Kategorie, über Betrag bis „12,00“ eingegrenzt?
- [ ] Soll der Dienst einen ausdrücklich mitgeschickten Wert „Alle“ als Formatfehler mit 400 abweisen und dabei keinen eigenen Text liefern?
- [ ] Welches Szenario soll die genau einmalige Ausführung für die Maske Umbuchung belegen?

## Entscheidungen

- Wie lang darf der Notiztext zu einem Umsatz höchstens sein?
  **Antwort:** Höchstens 140 Zeichen, wie der Verwendungszweck des Umsatzes.
  _→ noch nicht in der Spezifikation_
- Was passiert, wenn die Kundin einen leeren Notiztext speichert?
  **Antwort:** Der Dienst lehnt ab und meldet, dass mindestens 1 Zeichen nötig ist; entfernt wird eine Notiz nur über das Löschen.
  _→ noch nicht in der Spezifikation_
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
  _→ noch nicht in der Spezifikation_
- Zeigt das Szenario die nicht einschränkende Auswahl „Alle“ an genau einer Zeile einer anderen Kategorie, oder soll es dafür die Gesamtzahl der Treffer vergleichen?
  **Antwort:** Genau eine Zeile einer anderen Kategorie, über Betrag bis „12,00“ eingegrenzt, wie vorgeschlagen.
  _→ noch nicht in der Spezifikation_
- Soll der Hinweis des Feldes Notiz bei einem zu langen Text als Meldung im Bereich der Umsätze erscheinen?
  **Antwort:** Ja, als Meldung im Bereich der Umsätze, wie es die bestehenden Notiz-Meldungen tun.
  _→ eingearbeitet_
