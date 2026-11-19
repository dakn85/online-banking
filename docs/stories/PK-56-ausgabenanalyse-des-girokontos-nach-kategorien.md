# PK-56: Ausgabenanalyse des Girokontos nach Kategorien

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich die Ausgaben meines Girokontos eines Monats nach Kategorien gruppiert mit Summe und Anteil sehen und den Monat wählen, damit ich verstehe, wofür ich mein Geld ausgebe.

## Nicht im Scope

Kategorien manuell ändern oder zuordnen: Die Idee verlangt nur die Anzeige, keine Pflege der Kategorien durch die Kundin.
Eigene Kategorien anlegen und verwalten: Nicht gefordert; die Kategorien sind vorgegeben.
Budgets und Warnungen bei Überschreitung: Gehört zu einer späteren Ausbaustufe der Ausgabenanalyse, nicht zur Idee.
Analyse weiterer Konten oder Einnahmen: Die Idee nennt nur Ausgaben des Girokontos.
Vergleich mehrerer Monate und Trend: Die Idee nennt nur einen wählbaren Monat.
Export als PDF oder CSV: Nicht gefordert.
Automatische Kategorisierung per Regeln im Hintergrund: Unklar, ob nötig. Die Herkunft der Kategorie ist offen, siehe Research.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Ausgaben des Girokontos eines Monats nach Kategorien mit Summe und Anteil | Neu | Endpunkt neu |
| Ausgabenanalyse | Neu | Schema neu, Entität neu, Maske neu |
| Kategorieausgabe | Neu | Schema neu, Entität neu |
| Umsatz | Geändert | Attribut kategorie neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Use Case UC-019 neu, Aktion Ausgabenanalyse neu, Skizze geändert |
| Umsätze | Geändert | Use Case UC-019 neu, Aktion Ausgabenanalyse neu, Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | BR-0012 geändert |
| BR-0012 Umsatz einer ausgeführten Überweisung | Geändert | Text geändert |
| UC-019 Ausgabenanalyse des Girokontos anzeigen | Neu | Use Case neu |
| BR-0083 Gruppierung, Summe und Anteil der Ausgaben je Kategorie | Neu | Neu in UC-019 |
| BR-0084 Ausgabenanalyse nur für das Girokonto | Neu | Neu in UC-019 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/ausgabenanalyse.spec`: Die Ausgabenanalyse öffnet mit dem laufenden Monat
- `acceptance/specs/ausgabenanalyse.spec`: Die Ausgabenanalyse zeigt die Ausgaben eines Monats je Kategorie mit Summe und Anteil
- `acceptance/specs/ausgabenanalyse.spec`: Die Kreditkarte hat keine Ausgabenanalyse
- `acceptance/specs/ausgabenanalyse.spec`: Ein anderer Monat zeigt dessen Ausgaben
- `acceptance/specs/ausgabenanalyse.spec`: Ein Konto, das nicht zur Kundin gehört, zeigt keine Ausgabenanalyse
- `acceptance/specs/ausgabenanalyse.spec`: Ein Monat ohne Ausgaben zeigt den Hinweis
- `acceptance/specs/ausgabenanalyse.spec`: Ein ungültiger Monat zeigt die Meldung zum Monat
- `acceptance/specs/ausgabenanalyse.spec`: Eine neue Überweisung erscheint in der Kategorie Sonstiges
- `acceptance/specs/ausgabenanalyse.spec`: Eingänge zählen in der Ausgabenanalyse nicht
- `acceptance/specs/ausgabenanalyse.spec`: Ohne Anmeldung ist die Ausgabenanalyse nicht erreichbar

## Aufgaben für die Umsetzung

- [ ] Ausgaben des Girokontos eines Monats nach Kategorien mit Summe und Anteil: Endpunkt neu
- [ ] Ausgabenanalyse: Schema neu
- [ ] Kategorieausgabe: Schema neu
- [ ] Umsatz: Attribut kategorie neu
- [ ] Ausgabenanalyse: Entität neu
- [ ] Kategorieausgabe: Entität neu
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Ausgabenanalyse: Maske neu
- [ ] Finanzstatus: Use Case UC-019 neu
- [ ] Finanzstatus: Aktion Ausgabenanalyse neu
- [ ] Finanzstatus: Skizze geändert
- [ ] Umsätze: Use Case UC-019 neu
- [ ] Umsätze: Aktion Ausgabenanalyse neu
- [ ] Umsätze: Skizze geändert
- [ ] UC-002: BR-0012 geändert
- [ ] BR-0012: Text geändert
- [ ] UC-019: Use Case neu
- [ ] BR-0083: Neu in UC-019
- [ ] BR-0084: Neu in UC-019
- [ ] Vision: Zweck geändert
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-56 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-56 grün

## Entscheidungen

- Woher bekommt ein Ausgang seine Kategorie, vor allem der Umsatz einer neu ausgeführten Überweisung (BR-0012)? Die Überweisung kennt bisher keine Kategorie.
  **Antwort:** Die Demo-Umsätze bringen ihre Kategorie fest mit; jeder Umsatz einer neuen Überweisung bekommt die Kategorie „Sonstiges“.
  _→ eingearbeitet in vision, Umsatz, Ausgabenanalyse, Kategorieausgabe, UC-019, BR-0083, BR-0084, UC-002, BR-0012, GET /api/konten/{iban}/ausgabenanalyse, Schema Ausgabenanalyse, Schema Kategorieausgabe, ausgabenanalyse, finanzstatus, umsaetze, NFR-001 · fa4130d_
- Welche Kategorien gibt es? Die Idee nennt nur Beispiele (Wohnen, Lebensmittel, Mobilität).
  **Antwort:** Erweiterte feste Liste, etwa mit Freizeit, Versicherungen und Gesundheit zusätzlich zu den vier.
  _→ eingearbeitet in vision, Umsatz, Ausgabenanalyse, Kategorieausgabe, UC-019, BR-0083, BR-0084, UC-002, BR-0012, GET /api/konten/{iban}/ausgabenanalyse, Schema Ausgabenanalyse, Schema Kategorieausgabe, ausgabenanalyse, finanzstatus, umsaetze, NFR-001 · fa4130d_
- Wie wird der Anteil je Kategorie an den Gesamtausgaben angezeigt und gerundet?
  **Antwort:** Prozent mit einer Nachkommastelle (z. B. 37,5 %), kaufmännisch gerundet, ohne Ausgleich auf 100 %.
  _→ eingearbeitet in vision, Umsatz, Ausgabenanalyse, Kategorieausgabe, UC-019, BR-0083, BR-0084, UC-002, BR-0012, GET /api/konten/{iban}/ausgabenanalyse, Schema Ausgabenanalyse, Schema Kategorieausgabe, ausgabenanalyse, finanzstatus, umsaetze, NFR-001 · fa4130d_
- Was antwortet die Abfrage der Ausgabenanalyse, wenn die IBAN zur Kreditkarte der Kundin gehört? Die Idee nennt nur das Girokonto.
  **Antwort:** Eigener Fehler (422) mit der Meldung „Die Ausgabenanalyse gibt es nur für das Girokonto.“
  _→ eingearbeitet in vision, Umsatz, Ausgabenanalyse, Kategorieausgabe, UC-019, BR-0083, BR-0084, UC-002, BR-0012, GET /api/konten/{iban}/ausgabenanalyse, Schema Ausgabenanalyse, Schema Kategorieausgabe, ausgabenanalyse, finanzstatus, umsaetze, NFR-001 · fa4130d_
- Welcher Fehler gilt, wenn bei der Abfrage der Ausgabenanalyse mehrere Fälle zugleich zutreffen, etwa ungültiger oder fehlender Monat zusammen mit einer fremden IBAN oder der IBAN der Kreditkarte?
  **Antwort:** Zuerst Format des Monats (400, „Der Monat ist ungültig: erwartet JJJJ-MM.“), dann Konto nicht gefunden (404), dann Kreditkarte (422). Ein fehlender Monat ist ebenfalls 400 mit derselben Meldung.
  _→ noch nicht in der Spezifikation_
