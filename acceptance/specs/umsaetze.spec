# Umsätze eines Kontos

## Die Umsätze zeigen die Buchungen mit Betrag und Saldo danach, neueste zuerst

Tags: UC-003, PK-73, BR-0008, BR-0012, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "12,00 €", Verwendungszweck "Rechnung 4712" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Möbel    |              |              | Alle         | 10,00      | 60,00      | Sonstiges |
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Verwendungszweck | Betrag   | Saldo danach |
|-----------------|------------------|----------|--------------|
| Möbel Nord GmbH | Rechnung 4712    | -12,00 € | 2.083,30 €   |
| Möbel Nord GmbH | Rechnung 4711    | -50,00 € | 2.095,30 €   |
* Die Umsätze zeigen "2" Treffer

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

Tags: UC-003, PK-73, BR-0009, BR-0104, NFR-001

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Möbel    |              |              | Eingang      | 10,00      | 60,00      | Sonstiges |
* Die Umsätze zeigen die Zeilen
| Gegenpartei | Verwendungszweck | Betrag | Saldo danach |
|-------------|------------------|--------|--------------|
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Möbel    |              |              | Ausgang      | 10,00      | 60,00      | Sonstiges |
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
|          | 2026-01-01   | 2026-02-28   | Alle         |
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

Tags: UC-003, PK-73, BR-0075

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
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Möbel    |              |              | Alle         | 10,00      | 60,00      | Sonstiges |
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

Tags: UC-003, PK-73, BR-0076

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie    |
|----------|--------------|--------------|--------------|------------|------------|--------------|
| Möbel    |              |              | Alle         | 10,00      | 60,00      | Lebensmittel |
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

Tags: UC-003, PK-73, BR-0075, BR-0009

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Möbel    |              |              | Eingang      | 10,00      | 60,00      | Sonstiges |
* Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status "422"

## Die CSV-Datei hat den Content-Type text/csv und Zeilenende CRLF

Tags: UC-003, PK-54

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin exportiert die Umsätze als CSV-Datei
* Die CSV-Datei hat den Content-Type "text/csv" und das Zeilenende "CRLF"

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
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         | 10,00      | 60,00      | Sonstiges |
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Verwendungszweck | Betrag   | Saldo danach |
|-----------------|------------------|----------|--------------|
| Möbel Nord GmbH | Rechnung 4711    | -50,00 € | 2.095,30 €   |
* Die Kundin exportiert die Umsätze als CSV-Datei
* Die CSV-Datei enthält die Zeilen
| Gegenpartei     | Verwendungszweck | Betrag | Saldo danach |
|-----------------|------------------|--------|--------------|
| Möbel Nord GmbH | Rechnung 4711    | -50,00 | 2095,30      |

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

## Mehr als 20 Treffer blättern auf Seite 1 mit 20 Umsätzen und Seite 2 mit dem Rest, beide mit der Gesamtzahl

Tags: UC-003, PK-73, BR-0105, NFR-001

* Testdaten sind zurückgesetzt
* "maria.schulz" meldet sich mit der PIN "11223" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Umsätze zeigen "25" Treffer
* Die Umsätze zeigen auf der Seite "1" "20" Umsätze
* Die Kundin blättert in den Umsätzen "vor"
* Die Umsätze zeigen auf der Seite "2" "5" Umsätze
* Die Umsätze zeigen die Seite "2"
* Die Umsätze zeigen "25" Treffer

## Der Filter Ein-/Ausgang ohne Knopf Weiter

Tags: UC-003, PK-73, BR-0105, BR-0009

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------|--------------|--------------|--------------|
|          |              |              | Eingang      |
* Die Umsätze zeigen den Knopf "Weiter" nicht

## Ein Filterwechsel führt die Umsätze auf Seite 1 zurück

Tags: UC-003, PK-73, BR-0105

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         |            |            | Freizeit  |
* Die Umsätze zeigen "2" Treffer
* Die Kundin blättert in den Umsätzen "vor"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie    |
|----------|--------------|--------------|--------------|------------|------------|--------------|
|          |              |              | Alle         |            |            | Lebensmittel |
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Betrag   |
|-----------------|----------|
| Bäckerei Krause | -12,00 € |
* Die Umsätze zeigen "1" Treffer
* Die Umsätze zeigen den Hinweis "Für diese Auswahl gibt es keine Umsätze." nicht

## Der Dienst weist die Kategorie Alle als Formatfehler ab

Tags: UC-003, PK-73, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft die Umsätze des Kontos "Girokonto" mit dem Parameter "kategorie" "Alle" ab und erhält den Status "400"

## Der Betragsfilter zeigt einen Eingang, dessen Höhe im Betragsbereich liegt

Tags: UC-003, PK-73, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Eingang      | 500,00     | 3.000,00   | Alle      |
* Die Umsätze zeigen die Zeilen
| Gegenpartei           | Verwendungszweck |
|-----------------------|------------------|
| Lindner Logistik GmbH | Gehalt Januar    |

## Der Betragsfilter schließt Betrag von und Betrag bis ein

Tags: UC-003, PK-73, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         | 950,00     | 950,00     | Alle      |
* Die Umsätze zeigen die Zeilen
| Gegenpartei           | Verwendungszweck |
|-----------------------|------------------|
| Hausverwaltung Berger | Miete Februar    |

## Die beiden SEPA-Lastschriften stehen als jüngste Buchungen mit ihrem Saldo danach oben

Tags: UC-003, PK-73, BR-0008, BR-0104

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
|          |              |              | Alle         |            |            | Freizeit  |
* Die Umsätze zeigen die Zeilen
| Gegenpartei         | Verwendungszweck | Betrag   | Saldo danach |
|---------------------|------------------|----------|--------------|
| Fitnessstudio Vital | Mitgliedsbeitrag | -29,90 € | 2.145,30 €   |
| Zeitungsverlag Nord | Zeitungsabo      | -14,90 € | 2.175,20 €   |

## Eine angefragte Seitengröße über der Obergrenze liefert höchstens 100 Umsätze je Seite

Tags: UC-003, PK-76, BR-0105

* Testdaten sind zurückgesetzt
* "lasttest-001" meldet sich mit der Vorgabe-PIN der Lastkunden an
* Die angemeldete Kundin ruft die Umsätze des Kontos "Girokonto" mit dem Parameter "seitengroesse" "1000" ab und erhält höchstens "100" Umsätze

## Die Umsätze eines Kontos sind ohne Anmeldung nicht erreichbar

Tags: UC-003, PK-76, NFR-001

* Die Umsatzseite ist ohne Anmeldung nicht erreichbar

## Eine Notiz zu einem Umsatz wird gespeichert und in der Liste angezeigt

Tags: UC-003, PK-78, BR-0106

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Bäckerei |              |              | Alle         |            |            | Alle      |
* Die Kundin erfasst bei dem Umsatz von "Bäckerei Krause" die Notiz "Frühstück mit dem Team" und wählt „Speichern“
* Die Umsätze zeigen die Meldung "Notiz gespeichert."
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Notiz                  |
|-----------------|------------------------|
| Bäckerei Krause | Frühstück mit dem Team |

## Ein neuer Notiztext überschreibt die vorhandene Notiz

Tags: UC-003, PK-78, BR-0106

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Bäckerei |              |              | Alle         |            |            | Alle      |
* Die Kundin erfasst bei dem Umsatz von "Bäckerei Krause" die Notiz "Erste Notiz" und wählt „Speichern“
* Die Umsätze zeigen die Meldung "Notiz gespeichert."
* Die Kundin erfasst bei dem Umsatz von "Bäckerei Krause" die Notiz "Zweite Notiz" und wählt „Speichern“
* Die Umsätze zeigen die Meldung "Notiz gespeichert."
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Notiz        |
|-----------------|--------------|
| Bäckerei Krause | Zweite Notiz |

## Die Notiz wird nach der Bestätigung gelöscht

Tags: UC-003, PK-78, BR-0107

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Bäckerei |              |              | Alle         |            |            | Alle      |
* Die Kundin erfasst bei dem Umsatz von "Bäckerei Krause" die Notiz "Frühstück mit dem Team" und wählt „Speichern“
* Die Kundin wählt bei dem Umsatz von "Bäckerei Krause" die Aktion "Notiz löschen"
* Die Umsätze zeigen die Rückfrage "Notiz zu Bäckerei Krause löschen? Die Notiz lässt sich nicht wiederherstellen."
* Die Kundin wählt in der Rückfrage der Notiz "Bestätigen"
* Die Umsätze zeigen die Meldung "Notiz gelöscht."
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Notiz |
|-----------------|-------|
| Bäckerei Krause |       |

## Das Abbrechen der Rückfrage behält die Notiz

Tags: UC-003, PK-78, BR-0107

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Bäckerei |              |              | Alle         |            |            | Alle      |
* Die Kundin erfasst bei dem Umsatz von "Bäckerei Krause" die Notiz "Frühstück mit dem Team" und wählt „Speichern“
* Die Kundin wählt bei dem Umsatz von "Bäckerei Krause" die Aktion "Notiz löschen"
* Die Umsätze zeigen die Rückfrage "Notiz zu Bäckerei Krause löschen? Die Notiz lässt sich nicht wiederherstellen."
* Die Kundin wählt in der Rückfrage der Notiz "Abbrechen"
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Notiz                  |
|-----------------|------------------------|
| Bäckerei Krause | Frühstück mit dem Team |

## Ein Notiztext über 140 Zeichen wird abgelehnt

Tags: UC-003, PK-78

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Bäckerei |              |              | Alle         |            |            | Alle      |
* Die Kundin erfasst bei dem Umsatz von "Bäckerei Krause" die Notiz "Rückfrage an die Hausverwaltung wegen der Nebenkostenabrechnung 2025: Nachzahlung, Aufteilung der Heizkosten sowie der Positionen für Wasser, Müllabfuhr und die Gartenpflege im Detail prüfen lassen" und wählt „Speichern“
* Die Umsätze zeigen die Meldung "Die Notiz darf höchstens 140 Zeichen lang sein."
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Notiz |
|-----------------|-------|
| Bäckerei Krause |       |

## Ein leerer Notiztext wird abgelehnt

Tags: UC-003, PK-78

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext | Zeitraum von | Zeitraum bis | Ein-/Ausgang | Betrag von | Betrag bis | Kategorie |
|----------|--------------|--------------|--------------|------------|------------|-----------|
| Bäckerei |              |              | Alle         |            |            | Alle      |
* Die Kundin erfasst bei dem Umsatz von "Bäckerei Krause" die Notiz "" und wählt „Speichern“
* Die Umsätze zeigen die Meldung "Die Notiz muss mindestens 1 Zeichen enthalten."
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Notiz |
|-----------------|-------|
| Bäckerei Krause |       |

## Das Löschen einer nicht vorhandenen Notiz wird mit 404 abgewiesen

Tags: UC-003, PK-78, BR-0107

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz" mit den Angaben auf und erhält den Status "404" und die Meldung "Die Notiz wurde nicht gefunden."
| feld     | wert   |
|----------|--------|
| umsatzId | U-0007 |

## Das Speichern einer Notiz ohne Anmeldung wird mit 401 beantwortet

Tags: UC-003, PK-78, NFR-001

* Der Aufruf "PUT" "/api/konten/DE02500105175407324911/umsaetze/U-0007/notiz" ohne Anmeldung antwortet mit dem Status "401"

## Das Löschen einer Notiz ohne Anmeldung wird mit 401 beantwortet

Tags: UC-003, PK-78, NFR-001

* Der Aufruf "DELETE" "/api/konten/DE02500105175407324911/umsaetze/U-0007/notiz" ohne Anmeldung antwortet mit dem Status "401"

## Ein Notiztext außerhalb der Feldlänge wird abgelehnt

Tags: UC-003, PK-78, BR-0106

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin speichert bei dem Umsatz von "Bäckerei Krause" einen Notiztext mit "141" Zeichen und erhält den Status "400"
* Die Umsätze zeigen die Meldung "Die Notiz darf höchstens 140 Zeichen lang sein."
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Notiz |
|-----------------|-------|
| Bäckerei Krause |       |

## Das Speichern einer Notiz zu einem Umsatz eines fremden Kontos meldet "Das Konto wurde nicht gefunden."

Tags: UC-003, PK-78, BR-0106

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz" mit den Angaben auf und erhält den Status "404" und die Meldung "Das Konto wurde nicht gefunden."
| feld     | wert                        |
|----------|-----------------------------|
| iban     | DE00 1234 5678 9012 3456 78 |
| umsatzId | U-0007                      |
| text     | Rückfrage Termin            |

## Das Speichern einer Notiz zu einem fremden Umsatz meldet "Der Umsatz wurde nicht gefunden."

Tags: UC-003, PK-78, BR-0106

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz" mit den Angaben auf und erhält den Status "404" und die Meldung "Der Umsatz wurde nicht gefunden."
| feld     | wert             |
|----------|------------------|
| umsatzId | U-9999           |
| text     | Rückfrage Termin |
