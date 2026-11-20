# Kontoauszug

## Ein Monat ohne Umsätze ergibt einen leeren Auszug mit Saldo

Tags: UC-024, PK-62, BR-0098

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin öffnet den Kontoauszug
* Die Kundin lädt den Kontoauszug für den Monat "2026-06" herunter
* Der Kontoauszug zeigt Anfangssaldo "2.145,30 €" und Endsaldo "2.145,30 €"
* Der Kontoauszug zeigt die Zeilen
| Buchungstag | Gegenpartei |
|-------------|-------------|

## Der Kontoauszug zeigt Anfangssaldo, Endsaldo und alle Umsätze des Monats, neueste zuerst

Tags: UC-024, PK-62, BR-0098

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin öffnet den Kontoauszug
* Die Kundin lädt den Kontoauszug für den Monat "2026-02" herunter
* Der Kontoauszug zeigt Anfangssaldo "-396,70 €" und Endsaldo "2.145,30 €"
* Der Kontoauszug zeigt die Zeilen
| Buchungstag | Gegenpartei            |
|-------------|------------------------|
| 12.02.2026  | Bäckerei Krause        |
| 10.02.2026  | Energieversorgung Nord |
| 01.02.2026  | Lindner Logistik GmbH  |

## Ein Monat ohne Umsätze nach dem letzten Umsatz ergibt einen leeren Auszug mit Saldo

Tags: UC-024, PK-62, BR-0098

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin öffnet den Kontoauszug
* Die Kundin lädt den Kontoauszug für den Monat "2026-06" herunter
* Der Kontoauszug zeigt Anfangssaldo "2.145,30 €" und Endsaldo "2.145,30 €"
* Der Kontoauszug zeigt die Zeilen
| Buchungstag | Gegenpartei |
|-------------|-------------|

## Ein Monat vor dem ersten Umsatz zeigt den Saldo vor dem ersten Umsatz

Tags: UC-024, PK-62, BR-0098

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin öffnet den Kontoauszug
* Die Kundin lädt den Kontoauszug für den Monat "2025-12" herunter
* Der Kontoauszug zeigt Anfangssaldo "553,30 €" und Endsaldo "553,30 €"
* Der Kontoauszug zeigt die Zeilen
| Buchungstag | Gegenpartei |
|-------------|-------------|

## Der laufende Monat zeigt den Zwischenstand bis heute

Tags: UC-024, PK-62, BR-0098

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin öffnet den Kontoauszug
* Die Kundin lädt den Kontoauszug für den Monat "dieser Monat" herunter
* Der Kontoauszug zeigt Anfangssaldo "2.145,30 €" und Endsaldo "2.095,30 €"
* Der Kontoauszug zeigt die Zeilen
| Gegenpartei     |
|-----------------|
| Möbel Nord GmbH |

## Ein Konto, das nicht zur Kundin gehört, hat keinen Kontoauszug

Tags: UC-024, PK-62, BR-0011

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet den Kontoauszug des Kontos mit der IBAN "DE00 1234 5678 9012 3456 78"
* Die Kundin lädt den Kontoauszug für den Monat "2026-02" herunter
* Der Kontoauszug wird mit dem Status "404" und der Meldung "Das Konto wurde nicht gefunden." abgelehnt

## A4 Monat ungültig: Ein Monat nach dem laufenden Monat wird mit Status 400 abgelehnt

Tags: UC-024, PK-62

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin öffnet den Kontoauszug
* Die Kundin lädt den Kontoauszug für den Monat "in 1 Monat" herunter
* Der Kontoauszug wird mit dem Status "400" und der Meldung "Der Monat ist ungültig: JJJJ-MM, höchstens der laufende Monat." abgelehnt

## A1 Nicht angemeldet: Der Abruf des Kontoauszugs ohne Sitzung wird mit Status 401 beantwortet

Tags: UC-024, PK-62

* Testdaten sind zurückgesetzt
* Der Kontoauszug antwortet ohne Anmeldung mit dem Status "401"

## Ohne Anmeldung ist die Kontoauszugsseite nicht erreichbar

Tags: UC-024, PK-62

* Testdaten sind zurückgesetzt
* Die Kontoauszugsseite ist ohne Anmeldung nicht erreichbar
* Die Anmeldeseite ist zu sehen
