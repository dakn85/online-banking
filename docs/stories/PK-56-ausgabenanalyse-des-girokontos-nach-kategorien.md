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
| Umsätze eines Kontos mit Saldo danach, neueste zuerst | Geändert | Beschreibung geändert |
| Ausgaben des Girokontos eines Monats nach Kategorien mit Summe und Anteil | Neu | Endpunkt neu |
| Umsatz | Geändert | Eigenschaft kategorie neu, Attribut kategorie neu |
| Ausgabenanalyse | Neu | Schema neu, Entität neu, Maske neu |
| Kategorieausgabe | Neu | Schema neu, Entität neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Use Case UC-019 neu, Aktion Ausgabenanalyse neu, Skizze geändert |
| Umsätze | Geändert | Use Case UC-019 neu, Feld Kategorie neu, Aktion Ausgabenanalyse neu, und 1 weitere |
| UC-002 Überweisung vom Girokonto | Geändert | BR-0012 geändert |
| BR-0012 Umsatz einer ausgeführten Überweisung | Geändert | Text geändert |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Ziel geändert, Schritt 5 geändert, Erfolg 1 geändert |
| UC-019 Ausgabenanalyse des Girokontos anzeigen | Neu | Use Case neu |
| BR-0083 Gruppierung, Summe und Anteil der Ausgaben je Kategorie | Neu | Neu in UC-019 |
| BR-0084 Ausgabenanalyse nur für das Girokonto der Kundin | Neu | Neu in UC-019 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/ausgabenanalyse.spec`: Die Ausgabenanalyse öffnet mit dem laufenden Monat
- `acceptance/specs/ausgabenanalyse.spec`: Die Ausgabenanalyse zeigt die Ausgaben eines Monats je Kategorie mit Summe und Anteil
- `acceptance/specs/ausgabenanalyse.spec`: Die Kreditkarte hat keine Ausgabenanalyse
- `acceptance/specs/ausgabenanalyse.spec`: Ein anderer Monat zeigt dessen Ausgaben
- `acceptance/specs/ausgabenanalyse.spec`: Ein Konto, das nicht zur Kundin gehört, zeigt keine Ausgabenanalyse
- `acceptance/specs/ausgabenanalyse.spec`: Ein Monat ohne Ausgaben zeigt den Hinweis
- `acceptance/specs/ausgabenanalyse.spec`: Ein ungültiger Monat geht der Prüfung der Kreditkarte voraus
- `acceptance/specs/ausgabenanalyse.spec`: Ein ungültiger Monat geht der Prüfung des Kontos voraus
- `acceptance/specs/ausgabenanalyse.spec`: Ein ungültiger Monat zeigt die Meldung zum Monat
- `acceptance/specs/ausgabenanalyse.spec`: Eine neue Überweisung erscheint in der Kategorie Sonstiges
- `acceptance/specs/ausgabenanalyse.spec`: Eingänge zählen in der Ausgabenanalyse nicht
- `acceptance/specs/ausgabenanalyse.spec`: Ohne Anmeldung ist die Ausgabenanalyse nicht erreichbar

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine
- **Konten und Finanzstatus / Umsätze** (`src/umsaetze.ts`): Umsatz erhält `kategorie` (Demo-Umsätze fest, Überweisung „Sonstiges“, BR-0012). Neue Funktion `ausgabenanalyse` rechnet aus einem ungekürzten Bestand je IBAN, damit die 200er-Grenze der Lastkunden nicht greift (BR-0083).
- **Seitenauslieferung** (`src/main.ts`): `GET /api/konten/:iban/ausgabenanalyse`, Prüfreihenfolge 401, Monat 400, Konto 404, Kreditkarte 422 (BR-0084); Seite `/ausgabenanalyse` hinter Sitzung (NFR-001).
- **Oberfläche** (`public/seiten/ausgabenanalyse.js`): Monatsfeld mit laufendem Monat, Tabelle, Hinweis und Meldungen (UC-019). Knopf „Ausgabenanalyse“ im Finanzstatus (Girokonto) und in den Umsätzen (nur Girokonto); Spalte Kategorie in der Umsatzliste (UC-003).
- **Akzeptanztests**: fehlende Steps in `StepImplementation.ts`; Unit-Tests für BR-0083 und BR-0084.

## Schritte
1. Kategorie im Umsatz, Demo-Kategorien, Überweisung „Sonstiges“ (BR-0012).
2. Berechnung: Ausgänge (BR-0009) im Monat inkl. Grenztage, Summe auf Cent (ADR-005), Anteil kaufmännisch auf 0,1, Sortierung Summe absteigend, dann alphabetisch (BR-0083).
3. Endpunkt und Fehlerreihenfolge (BR-0084).
4. Oberfläche und Steps.

## Rahmenänderung
Keine neue Bibliothek, kein neues Muster.

## Offene Fragen

- [ ] Die Umsatzabfrage hält je Konto nur die jüngsten 200 Umsätze (Lastkunden im Testbetrieb). Die Ausgabenanalyse wird bei jeder Abfrage aus den Umsätzen berechnet. Welche Umsätze zählen, wenn ein Konto mehr als 200 hat und der gewählte Monat weiter zurückliegt?

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
- Soll die Kategorie in der Umsatzliste (API und Maske) erscheinen oder nur intern für die Ausgabenanalyse gelten?
  **Antwort:** Antwort und Spalte in der Umsatzliste
  _→ eingearbeitet in GET /api/konten/{iban}/umsaetze, Schema Umsatz, UC-003, umsaetze · e5a0dd3_
