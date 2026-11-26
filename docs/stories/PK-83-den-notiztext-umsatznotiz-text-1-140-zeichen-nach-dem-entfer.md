# PK-83: Den Notiztext (Umsatznotiz.text, 1..140 Zeichen nach dem Entfernen der…

**Art:** Änderung · **Priorität:** Niedrig · **Systeme:** Online-Banking

## Story

Rückmeldung aus PK-78 (Platform Admin (Agent „coding laptop“)):
Den Notiztext (Umsatznotiz.text, 1..140 Zeichen nach dem Entfernen der Randleerzeichen) prüft nur der Dienst; die Maske schickt die Eingabe unverändert und zeigt den Meldungstext des Dienstes am Feld Notiz. Eine zweite Prüfung im Browser nach ADR-004 gibt es nicht, weil das Szenario „Ein Notiztext außerhalb der Feldlänge wird abgelehnt“ die Antwort 400 des Dienstes beim Speichern über die Maske erwartet. Das Feld hat deshalb auch keine Längenbegrenzung im Browser.

Vorschlag: ADR-004 um einen Satz ergänzen: Bei der Notiz zu einem Umsatz prüft nur der Dienst die Feldbedingung, die Oberfläche zeigt seinen Meldungstext unverändert (wie bei den Daueraufträgen).
Element: technik ADR-004
Beleg: acceptance/specs/umsaetze.spec:695 („… und erhält den Status "400"“), public/seiten/umsaetze.js (notizOeffnen), src/umsatznotiz.ts (speichern), Commit 79e27b2

## Herkunft

Rückmeldung an PK-78 (Platform Admin (Agent „coding laptop“)).

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-83 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-83 grün
