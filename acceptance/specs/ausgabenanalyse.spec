# Ausgabenanalyse des Girokontos

## Ein anderer Monat zeigt dessen Ausgaben

Tags: UC-019, PK-56

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Ausgabenanalyse des Kontos "Girokonto" für den Monat "2026-02"
* Die Kundin wählt in der Ausgabenanalyse den Monat "2026-01"
* Die Ausgabenanalyse zeigt die Kategorien
| Kategorie | Summe    | Anteil  |
|-----------|----------|---------|
| Wohnen    | 950,00 € | 100,0 % |

## Eine neue Überweisung erscheint in der Kategorie Sonstiges

Tags: UC-019, PK-56, BR-0012

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Ausgabenanalyse des Kontos "Girokonto" für den Monat "aktueller Monat"
* Die Ausgabenanalyse zeigt die Kategorien
| Kategorie | Summe   | Anteil  |
|-----------|---------|---------|
| Sonstiges | 50,00 € | 100,0 % |

## Ohne Anmeldung ist die Ausgabenanalyse nicht erreichbar

Tags: UC-019, PK-56

* Testdaten sind zurückgesetzt
* Die Ausgabenanalyse ist ohne Anmeldung nicht erreichbar
* Die Abfrage der Ausgabenanalyse antwortet mit dem Status "401"
* Die Anmeldeseite ist zu sehen

## Die Ausgabenanalyse zeigt die Ausgaben eines Monats je Kategorie mit Summe und Anteil

Tags: UC-019, PK-56, BR-0083

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Ausgabenanalyse des Kontos "Girokonto" für den Monat "2026-02"
* Die Ausgabenanalyse zeigt die Kategorien
| Kategorie    | Summe   | Anteil |
|--------------|---------|--------|
| Wohnen       | 86,00 € | 87,8 % |
| Lebensmittel | 12,00 € | 12,2 % |
* Die Ausgabenanalyse zeigt "Gesamtausgaben" mit dem Text "98,00 €"

## Ein Monat ohne Ausgaben zeigt den Hinweis

Tags: UC-019, PK-56

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Ausgabenanalyse des Kontos "Girokonto" für den Monat "2020-01"
* Die Ausgabenanalyse zeigt "Hinweis" mit dem Text "Für diesen Monat gibt es keine Ausgaben."
* Die Ausgabenanalyse zeigt die Kategorien
| Kategorie | Summe | Anteil |
|-----------|-------|--------|
* Die Ausgabenanalyse zeigt "Gesamtausgaben" mit dem Text "0,00 €"

## Ein ungültiger Monat zeigt die Meldung zum Monat

Tags: UC-019, PK-56

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Ausgabenanalyse des Kontos "Girokonto" für den Monat "2026-13"
* Die Abfrage der Ausgabenanalyse antwortet mit dem Status "400"
* Die Ausgabenanalyse zeigt "Meldung" mit dem Text "Der Monat ist ungültig: erwartet JJJJ-MM."
* Die Ausgabenanalyse zeigt "Hinweis" nicht
* Die Ausgabenanalyse zeigt die Kategorien

## Ein Konto, das nicht zur Kundin gehört, zeigt keine Ausgabenanalyse

Tags: UC-019, PK-56, BR-0084

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Ausgabenanalyse des Kontos "DE00 1234 5678 9012 3456 78" für den Monat "2026-02"
* Die Abfrage der Ausgabenanalyse antwortet mit dem Status "404"
* Die Ausgabenanalyse zeigt "Meldung" mit dem Text "Das Konto wurde nicht gefunden."
* Die Ausgabenanalyse zeigt "Hinweis" nicht
* Die Ausgabenanalyse zeigt die Kategorien

## Die Kreditkarte hat keine Ausgabenanalyse

Tags: UC-019, PK-56, BR-0084

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Ausgabenanalyse des Kontos "Kreditkarte" für den Monat "2026-02"
* Die Abfrage der Ausgabenanalyse antwortet mit dem Status "422"
* Die Ausgabenanalyse zeigt "Meldung" mit dem Text "Die Ausgabenanalyse gibt es nur für das Girokonto."
* Die Ausgabenanalyse zeigt "Hinweis" nicht
* Die Ausgabenanalyse zeigt die Kategorien

## Die Ausgabenanalyse öffnet mit dem laufenden Monat

Tags: UC-019, PK-56

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin wählt im Finanzstatus in der Zeile des Kontos "Girokonto" die Ausgabenanalyse
* Das Feld Monat der Ausgabenanalyse enthält den laufenden Monat

## Eingänge zählen in der Ausgabenanalyse nicht

Tags: UC-019, PK-56, BR-0083

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Ausgabenanalyse des Kontos "Girokonto" für den Monat "2026-02"
* Die Ausgabenanalyse zeigt die Kategorien
| Kategorie    | Summe   | Anteil |
|--------------|---------|--------|
| Wohnen       | 86,00 € | 87,8 % |
| Lebensmittel | 12,00 € | 12,2 % |
* Die Ausgabenanalyse zeigt "Gesamtausgaben" mit dem Text "98,00 €"
