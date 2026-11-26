# PK-86: Nacharbeit zu PK-85: Spezifikation an die Umsetzung angleichen

**Art:** Änderung · **Priorität:** Niedrig · **Systeme:** Online-Banking

## Story

Als Fachbereich möchte ich, dass die Spezifikation von „Konten eigene Namen geben“ beschreibt, was umgesetzt ist, damit Tests und Doku stimmen.

Aus den Rückmeldungen der Entwicklung zu PK-85 (Bank-PR #43):
1. Das Szenario „Ein unverändert gespeicherter eigener Name wird mit 200 bestätigt“ erwartet bei PUT /api/konten/{iban}/name die Meldung „Eigener Name gespeichert.“. Die Antwort 200 liefert laut OpenAPI das Schema Konto ohne Meldungsfeld; die Meldung gehört zur Oberfläche (UC-001 A3 Schritt 5). Der Erfolgsfall soll Status 200 und den gespeicherten Namen belegen.
2. Die Maske finanzstatus beschreibt den eigenen Namen als eigene Tabellenspalte und „Name vergeben“ als Textknopf. Umgesetzt sind Kontokarten: der eigene Name als Etikett unter dem Kontonamen (ohne Namen leer), „Name vergeben“ als Stift-Symbolknopf im Kopf der Karte.

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-86 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-86 grün
