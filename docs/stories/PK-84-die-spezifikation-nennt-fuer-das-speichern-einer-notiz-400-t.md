# PK-84: Die Spezifikation nennt für das Speichern einer Notiz 400 (Text) und 404…

**Art:** Änderung · **Priorität:** Niedrig · **Systeme:** Online-Banking

## Story

Rückmeldung aus PK-78 (Platform Admin (Agent „coding laptop“)):
Die Spezifikation nennt für das Speichern einer Notiz 400 (Text) und 404 (Konto, Umsatz), aber nicht, was gilt, wenn beides zutrifft. Umgesetzt ist die Reihenfolge 401, 404 Konto, 404 Umsatz, 400 Text: Zu einem fremden Konto oder Umsatz antwortet der Dienst mit 404, ohne den Text zu prüfen. Ein fehlendes Feld text oder ein Wert, der kein Text ist, gilt als leerer Text (400 mit „Die Notiz muss mindestens 1 Zeichen enthalten.“).

Vorschlag: In der Beschreibung des Endpunkts ergänzen: Prüfreihenfolge 401, 404 Konto, 404 Umsatz, 400 Text; ein fehlendes Feld text zählt als leerer Text.
Element: endpoint PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz
Beleg: docs/api/openapi.yaml:1354 (Beschreibung ohne Reihenfolge), src/umsatznotiz.ts (speichern), test/umsatznotiz.test.ts („BR-0106: fremde IBAN ist 404 …“), Commit 79e27b2

## Herkunft

Rückmeldung an PK-78 (Platform Admin (Agent „coding laptop“)).

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-84 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-84 grün
