# PK-6: Die Kundin sieht zu jedem Konto im Finanzstatus die Umsätze (Buchungstag, Gegenpartei, Verwendungszweck, Betrag, …

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Die Kundin sieht zu jedem Konto im Finanzstatus die Umsätze (Buchungstag, Gegenpartei, Verwendungszweck, Betrag, Saldo danach), neueste zuerst, kann nach Text suchen und nach Zeitraum und Ein-/Ausgang filtern; eine ausgeführte Überweisung erscheint dort sofort als Umsatz.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos mit Saldo danach, neueste zuerst | Neu | Endpunkt neu |
| Umsaetze | Neu | Schema neu |
| Umsatz | Neu | Schema neu, Entität neu |
| Finanzstatus | Geändert | Use Case UC-003 neu, Aktion Umsätze neu, Skizze geändert |
| Umsätze | Neu | Maske neu |
| UC-001 Finanzstatus anzeigen | Geändert | Schritt 8 neu |
| UC-002 Überweisung vom Girokonto | Geändert | Schritt 10 neu, Erfolg 3 neu, BR-0012 neu: Umsatz einer ausgeführten Überweisung |
| BR-0012 Umsatz einer ausgeführten Überweisung | Neu | Neu in UC-002 |
| UC-003 Umsätze eines Kontos anzeigen | Neu | Use Case neu |
| BR-0008 Reihenfolge der Umsätze und Saldo danach | Neu | Neu in UC-003 |
| BR-0009 Ein- und Ausgang | Neu | Neu in UC-003 |
| BR-0010 Zeitraum und Textsuche | Neu | Neu in UC-003 |
| BR-0011 Umsätze nur für Konten der Kundin | Neu | Neu in UC-003 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Stakeholder“ geändert, Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Der Filter Ein-/Ausgang blendet die Gegenrichtung aus
- `acceptance/specs/umsaetze.spec`: Die Textsuche zeigt nur Umsätze mit dem Suchtext
- `acceptance/specs/umsaetze.spec`: Die Umsätze zeigen die Buchungen mit Betrag und Saldo danach, neueste zuerst
- `acceptance/specs/umsaetze.spec`: Ein Zeitraum in der Vergangenheit zeigt keine Umsätze

## Aufgaben für die Umsetzung

- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst: Endpunkt neu
- [ ] Umsaetze: Schema neu
- [ ] Umsatz: Schema neu
- [ ] Umsatz: Entität neu
- [ ] Finanzstatus: Use Case UC-003 neu
- [ ] Finanzstatus: Aktion Umsätze neu
- [ ] Finanzstatus: Skizze geändert
- [ ] Umsätze: Maske neu
- [ ] UC-001: Schritt 8 neu
- [ ] UC-002: Schritt 10 neu
- [ ] UC-002: Erfolg 3 neu
- [ ] UC-002: BR-0012 neu: Umsatz einer ausgeführten Überweisung
- [ ] BR-0012: Neu in UC-002
- [ ] UC-003: Use Case neu
- [ ] BR-0008: Neu in UC-003
- [ ] BR-0009: Neu in UC-003
- [ ] BR-0010: Neu in UC-003
- [ ] BR-0011: Neu in UC-003
- [ ] Vision: Zweck geändert
- [ ] Vision: STK-1 geändert
- [ ] Vision: Z-5 geändert
- [ ] Vision: Z-6 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-6 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-6 grün

## Offene Fragen

- [ ] Sollen die festen Buchungstage der Demo-Umsätze in der Spezifikation stehen?

## Entscheidungen

- Sollen die Demo-Konten im Ausgangsstand bereits Umsätze tragen?
  **Antwort:** Ja: Je Konto einige Demo-Umsätze mit festen Buchungstagen, der jüngste mit Saldo danach gleich dem Kontosaldo.
  _→ noch nicht in der Spezifikation_
- Wo erscheinen die Umsätze eines Kontos?
  **Antwort:** Eigene Maske „Umsätze“, je Konto über den Knopf in der Finanzstatus-Zeile geöffnet.
  _→ noch nicht in der Spezifikation_
- Woran erkennt das System Ein- und Ausgang eines Umsatzes?
  **Antwort:** Am Vorzeichen des Betrags: Ausgang negativ, Eingang positiv.
  _→ noch nicht in der Spezifikation_
- Wie wirkt der Zeitraumfilter an den Grenzen?
  **Antwort:** Beide Grenzen eingeschlossen, fehlende Grenze offen.
  _→ noch nicht in der Spezifikation_
- Wo werden Textsuche und Filter ausgeführt?
  **Antwort:** Im Dienst über Abfrageparameter suchtext, von, bis und richtung.
  _→ noch nicht in der Spezifikation_
