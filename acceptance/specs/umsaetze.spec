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

Tags: UC-003, PK-73, BR-0009, NFR-001

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und wählt „Weiter“
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

## Ein Konto, das nicht zur Kundin gehört, zeigt keine Umsätze

Tags: UC-003, PK-6, BR-0011

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos mit der IBAN "DE00 1234 5678 9012 3456 78"
* Die Umsätze zeigen die Meldung "Das Konto wurde nicht gefunden."
* Die Umsätze zeigen die Zeilen
| Gegenpartei | Verwendungszweck | Betrag | Saldo danach |
|-------------|------------------|--------|--------------|

## Ein Von-Datum nach dem Bis-Datum zeigt die Meldung zum ungültigen Zeitraum

Tags: UC-003, PK-6, BR-0010

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
|          | 2026-03-31   | 2026-03-01   | Alle         |
* Die Umsätze zeigen die Meldung "Der Zeitraum ist ungültig: von liegt nach bis."
* Die Umsätze zeigen den Hinweis "Für diese Auswahl gibt es keine Umsätze." nicht
* Die Umsätze zeigen die Zeilen
| Gegenpartei | Verwendungszweck | Betrag | Saldo danach |
|-------------|------------------|--------|--------------|

## Ohne Anmeldung ist die Umsatzseite nicht erreichbar

Tags: UC-003, PK-6

* Testdaten sind zurückgesetzt
* Die Umsatzseite ist ohne Anmeldung nicht erreichbar
* Die Anmeldeseite ist zu sehen

## Die Umsatzliste zeigt den Buchungstag als TT.MM.JJJJ

Tags: UC-003, PK-73, BR-0008

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
|          |              |              | Alle         |
* Die Umsätze zeigen die Zeilen
| Buchungstag | Gegenpartei            | Betrag     |
|-------------|------------------------|------------|
| 12.02.2026  | Bäckerei Krause        | -12,00 €   |
| 10.02.2026  | Energieversorgung Nord | -86,00 €   |
| 01.02.2026  | Lindner Logistik GmbH  | 2.640,00 € |
| 28.01.2026  | Hausverwaltung Berger  | -950,00 €  |

## Die CSV-Datei ist UTF-8 mit BOM, durch Semikolon getrennt und nach dem Konto benannt

Tags: UC-003, PK-54

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin exportiert die Umsätze als CSV-Datei
* Die CSV-Datei "umsaetze-DE02500105175407324911.csv" beginnt mit dem UTF-8-BOM und der Kopfzeile "Buchungstag;Gegenpartei;Verwendungszweck;Betrag;Saldo danach"

## Der CSV-Export enthält die gefilterten Umsätze, neueste zuerst, mit Saldo danach

Tags: UC-003, PK-54, BR-0075

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
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "200"
* Die CSV-Datei enthält die Zeilen
| Gegenpartei     | Verwendungszweck | Betrag | Saldo danach |
|-----------------|------------------|--------|--------------|
| Möbel Nord GmbH | Rechnung 4712    | -12,00 | 2083,30      |
| Möbel Nord GmbH | Rechnung 4711    | -50,00 | 2095,30      |

## Die CSV-Datei schreibt den Buchungstag als TT.MM.JJJJ und Beträge mit Dezimalkomma

Tags: UC-003, PK-59, BR-0008

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
|          | 2026-02-12   | 2026-02-12   | Alle         |
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "200"
* Die CSV-Datei enthält die Zeilen
| Buchungstag | Gegenpartei     | Betrag | Saldo danach |
|-------------|-----------------|--------|--------------|
| 12.02.2026  | Bäckerei Krause | -12,00 | 2190,10      |

## Die CSV-Datei setzt einen Text mit Semikolon in Anführungszeichen, sodass die Spalten stimmen

Tags: UC-003, PK-54

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Teil 1; Rest 2" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
| Teil 1   |              |              | Alle         |
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "200"
* Die CSV-Datei enthält die Zeilen
| Gegenpartei     | Verwendungszweck | Betrag | Saldo danach |
|-----------------|------------------|--------|--------------|
| Möbel Nord GmbH | Teil 1; Rest 2   | -50,00 | 2095,30      |

## Der CSV-Export einer leeren Auswahl liefert keine Datei und zeigt die Meldung

Tags: UC-003, PK-54, BR-0076

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
| Möbel    |              |              | Alle         |
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "422"
* Die Umsätze zeigen die Meldung "Für diese Auswahl gibt es keine Umsätze zum Export."

## Der CSV-Export eines fremden Kontos zeigt, dass das Konto nicht gefunden wurde

Tags: UC-003, PK-54, BR-0011

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos mit der IBAN "DE00 1234 5678 9012 3456 78"
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "404"

## Der CSV-Export mit Von-Datum nach dem Bis-Datum zeigt die Meldung zum ungültigen Zeitraum

Tags: UC-003, PK-54, BR-0010

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
|          | 2026-03-31   | 2026-03-01   | Alle         |
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "400"

## Ohne Anmeldung ist der CSV-Export nicht erreichbar

Tags: UC-003, PK-54

* Testdaten sind zurückgesetzt
* Der CSV-Export antwortet ohne Anmeldung mit dem Status "401"

## Ein fehlgeschlagener Export zeigt die Fehlermeldung

Tags: UC-003, PK-54

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Der Export-Dienst antwortet mit einem Fehler
* Die Kundin exportiert die Umsätze als CSV-Datei
* Die Umsätze zeigen die Meldung "Der Export ist fehlgeschlagen. Bitte versuchen Sie es später erneut."

## Der CSV-Export berücksichtigt den Filter Ein-/Ausgang

Tags: UC-003, PK-54, BR-0075, BR-0009

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
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "422"

## Die CSV-Datei hat den Content-Type text/csv und Zeilenende CRLF

Tags: UC-003, PK-54

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin exportiert die Umsätze als CSV-Datei
* Die CSV-Datei hat den Content-Type "text/csv" und das Zeilenende "CRLF"

## Die Umsätze nennen die Gesamtzahl der Treffer

Tags: UC-003, PK-73, BR-0105, NFR-001

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         |            |            | Freizeit  |
* Die Umsätze zeigen die Zeilen
| Gegenpartei         | Betrag   |
|---------------------|----------|
| Fitnessstudio Vital | -29,90 € |
| Zeitungsverlag Nord | -14,90 € |
* Die Umsätze zeigen "2" Treffer

## Eine Seite hinter der letzten Trefferseite zeigt keine Zeile, aber die Gesamtzahl

Tags: UC-003, PK-73, BR-0105

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         |            |            | Freizeit  |
* Die Kundin blättert in den Umsätzen "vor"
* Die Umsätze zeigen die Zeilen
| Gegenpartei | Betrag |
|-------------|--------|
* Die Umsätze zeigen "2" Treffer
* Die Umsätze zeigen den Hinweis "Für diese Auswahl gibt es keine Umsätze." nicht

## Der Betragsfilter zeigt Ausgänge nach ihrer Höhe ohne Vorzeichen

Tags: UC-003, PK-73, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         | 100,00     | 1.000,00   | Alle      |
* Die Umsätze zeigen die Zeilen
| Gegenpartei           | Betrag    |
|-----------------------|-----------|
| Hausverwaltung Berger | -950,00 € |

## Der Kategoriefilter zeigt nur Umsätze der gewählten Kategorie

Tags: UC-003, PK-73, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie    |
|----------|--------------|--------------|--------------|------------|------------|--------------|
|          |              |              | Alle         |            |            | Lebensmittel |
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Betrag   |
|-----------------|----------|
| Bäckerei Krause | -12,00 € |

## Ein Betrag von über Betrag bis zeigt die Meldung zum ungültigen Betragsbereich

Tags: UC-003, PK-73, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         | 100,00     | 50,00      | Alle      |
* Die Abfrage der Umsätze antwortet mit dem Status "400"
* Die Umsätze zeigen die Meldung "Der Betragsbereich ist ungültig: von liegt über bis."
* Die Umsätze zeigen den Hinweis "Für diese Auswahl gibt es keine Umsätze." nicht
* Die Umsätze zeigen die Zeilen
| Gegenpartei | Betrag |
|-------------|--------|

## Betragsfilter, Kategorie und Textsuche wirken zusammen

Tags: UC-003, PK-73, BR-0010, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Nord     |              |              | Alle         | 10,00      | 20,00      | Freizeit  |
* Die Umsätze zeigen die Zeilen
| Gegenpartei         | Verwendungszweck | Betrag   |
|---------------------|------------------|----------|
| Zeitungsverlag Nord | Zeitungsabo      | -14,90 € |

## Der CSV-Export enthält genau die Umsätze der gefilterten Liste

Tags: UC-003, PK-73, BR-0075

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie    |
|----------|--------------|--------------|--------------|------------|------------|--------------|
|          |              |              | Alle         | 10,00      | 20,00      | Lebensmittel |
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Betrag   |
|-----------------|----------|
| Bäckerei Krause | -12,00 € |
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "200"
* Die CSV-Datei enthält die Zeilen
| Gegenpartei     | Betrag | Saldo danach |
|-----------------|--------|--------------|
| Bäckerei Krause | -12,00 | 2190,10      |

## Seite vor und Seite zurück blättern die Umsatzliste

Tags: UC-003, PK-73, BR-0105

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         |            |            | Freizeit  |
* Die Kundin blättert in den Umsätzen "vor"
* Die Kundin blättert in den Umsätzen "zurück"
* Die Umsätze zeigen die Zeilen
| Gegenpartei         | Betrag   |
|---------------------|----------|
| Fitnessstudio Vital | -29,90 € |
| Zeitungsverlag Nord | -14,90 € |
* Die Umsätze zeigen "2" Treffer
