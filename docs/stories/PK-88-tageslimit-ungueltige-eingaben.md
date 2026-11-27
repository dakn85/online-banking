# PK-88: Tageslimit: ungültige Eingaben

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Ein ungültiges Tageslimit (leer, negativ, mehr als zwei Nachkommastellen) wird mit der Meldung im Formular abgelehnt, und das aktuelle Tageslimit bleibt unverändert.

## Akzeptanztests

- `acceptance/specs/tageslimit.spec`: Ein ungültiges Tageslimit wird abgelehnt und das bisherige Limit bleibt

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-88 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-88 grün
