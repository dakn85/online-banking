# Umsätze eines Kontos

## Die Umsätze zeigen die Buchungen mit Betrag und Saldo danach, neueste zuerst

Tags: UC-003, PK-6, BR-0008, BR-0012

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "12,00 €", Verwendungszweck "Rechnung 4712" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
| Möbel    |              |              | Alle         |
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Verwendungszweck | Betrag   | Saldo danach |
|-----------------|------------------|----------|--------------|
| Möbel Nord GmbH | Rechnung 4712    | -12,00 € | 2.083,30 €   |
| Möbel Nord GmbH | Rechnung 4711    | -50,00 € | 2.095,30 €   |

## Die Textsuche zeigt nur Umsätze mit dem Suchtext

Tags: UC-003, PK-6, BR-0010

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Stadtwerke Süd", IBAN "DE89 3704 0044 0532 0130 00", Betrag "12,00 €", Verwendungszweck "Abschlag März" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
| Möbel    |              |              | Alle         |
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Verwendungszweck | Betrag   | Saldo danach |
|-----------------|------------------|----------|--------------|
| Möbel Nord GmbH | Rechnung 4711    | -50,00 € | 2.095,30 €   |

## Ein Zeitraum in der Vergangenheit zeigt keine Umsätze

Tags: UC-003, PK-6, BR-0010

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
| Möbel    | 2020-01-01   | 2020-12-31   | Alle         |
* Die Umsätze zeigen die Zeilen
| Gegenpartei | Verwendungszweck | Betrag | Saldo danach |
|-------------|------------------|--------|--------------|

## Der Filter Ein-/Ausgang blendet die Gegenrichtung aus

Tags: UC-003, PK-6, BR-0009

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
| Möbel    |              |              | Eingang      |
* Die Umsätze zeigen die Zeilen
| Gegenpartei | Verwendungszweck | Betrag | Saldo danach |
|-------------|------------------|--------|--------------|
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
| Möbel    |              |              | Ausgang      |
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Verwendungszweck | Betrag   | Saldo danach |
|-----------------|------------------|----------|--------------|
| Möbel Nord GmbH | Rechnung 4711    | -50,00 € | 2.095,30 €   |
