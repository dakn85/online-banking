# PK-73: Umsätze nach Betrag und Kategorie filtern und seitenweise blättern

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich die Umsätze eines Kontos nach Betrag von/bis und nach Kategorie filtern und seitenweise mit der Gesamtzahl der Treffer blättern, damit ich auch bei vielen Buchungen die gesuchten Umsätze schnell finde.

## Nicht im Scope

Filter zurücksetzen als eigener Bedienschritt: Die Idee nennt kein Zurücksetzen; die Filterfelder leeren zu können ist nicht gefordert.
Sortierung der Treffer wählen: Die Idee verlangt nur Betragsfilter, Kategoriefilter und Blättern, keine wählbare Sortierung.
Export der gefilterten Liste als CSV: Der Export ist ein eigener Use Case (UC-024/BR-0075) und nicht Teil dieser Story.
Kategorieauswertung mit Summe und Anteil zur gefilterten Liste: Die Ausgabenanalyse (UC-019/BR-0083) ist ein eigener Use Case; die Story fordert nur die Trefferliste.
Seitengröße einstellbar oder gemerkt: Die Idee nennt nur seitenweises Blättern, keine Einstellung der Seitengröße.
Filter merken oder als Vorlage speichern: Nicht in der Idee genannt; wäre eine spätere Stufe.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Ziel geändert, Schritt 4 geändert, Schritt 7 geändert, und 5 weitere |
| BR-0104 Betragsfilter und Kategoriefilter der Umsatzliste | Neu | Neu in UC-003 |
| BR-0105 Seitenweise Ausgabe der Umsatzliste mit Gesamtzahl | Neu | Neu in UC-003 |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Betragsfilter, Kategorie und Textsuche wirken zusammen
- `acceptance/specs/umsaetze.spec`: Der Betragsfilter zeigt Ausgänge nach ihrer Höhe ohne Vorzeichen
- `acceptance/specs/umsaetze.spec`: Der CSV-Export bleibt bei Suchtext, Zeitraum und Ein-/Ausgang
- `acceptance/specs/umsaetze.spec`: Der Filter Ein-/Ausgang blendet die Gegenrichtung aus
- `acceptance/specs/umsaetze.spec`: Der Kategoriefilter zeigt nur Umsätze der gewählten Kategorie
- `acceptance/specs/umsaetze.spec`: Die Umsätze nennen die Gesamtzahl der Treffer
- `acceptance/specs/umsaetze.spec`: Ein Betrag von über Betrag bis zeigt die Meldung zum ungültigen Betragsbereich
- `acceptance/specs/umsaetze.spec`: Eine Seite hinter der letzten Trefferseite zeigt keine Zeile, aber die Gesamtzahl

## Aufgaben für die Umsetzung

- [ ] UC-003: Ziel geändert
- [ ] UC-003: Schritt 4 geändert
- [ ] UC-003: Schritt 7 geändert
- [ ] UC-003: Schritt 8 geändert
- [ ] UC-003: A9 neu: Betragsbereich ungültig
- [ ] UC-003: A10 neu: Seite hinter der letzten Trefferseite
- [ ] UC-003: BR-0104 neu: Betragsfilter und Kategoriefilter der Umsatzliste
- [ ] UC-003: BR-0105 neu: Seitenweise Ausgabe der Umsatzliste mit Gesamtzahl
- [ ] BR-0104: Neu in UC-003
- [ ] BR-0105: Neu in UC-003
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-73 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-73 grün

## Entscheidungen

- Wogegen prüft der Filter Betrag von/bis den Umsatz: gegen die Höhe des Betrags ohne Vorzeichen oder gegen den Betrag mit Vorzeichen?
  **Antwort:** Gegen die Höhe ohne Vorzeichen: -950,00 € liegt zwischen 100 und 1.000; Ein-/Ausgang bleibt der eigene Filter.
  _→ eingearbeitet in UC-003, BR-0104, BR-0105_
- Wie viele Umsätze zeigt eine Seite der Umsatzliste?
  **Antwort:** 20 Umsätze je Seite, fest von der Maske mitgeschickt.
  _→ eingearbeitet in UC-003, BR-0104, BR-0105_
- Was antwortet der Dienst, wenn die angefragte Seite hinter der letzten Trefferseite liegt?
  **Antwort:** Eine leere Trefferseite mit der Gesamtzahl und ohne Meldung.
  _→ eingearbeitet in UC-003, BR-0104, BR-0105_
