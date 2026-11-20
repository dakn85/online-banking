# Lastschrift zurückgeben

## Die bestätigte Rückgabe schreibt den Betrag gut und zeigt die Gutschrift als Umsatz

Tags: UC-022, PK-59, BR-0095

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin wählt bei der Lastschrift von "Fitnessstudio Vital" die Rückgabe
* Die Umsätze zeigen die Rückfrage "Lastschrift über 29,90 € von Fitnessstudio Vital zurückgeben? Die Rückgabe lässt sich nicht rückgängig machen."
* Die Kundin bestätigt die Rückgabe
* Die Umsätze zeigen die Meldung "Lastschrift zurückgegeben: 29,90 € gutgeschrieben, neuer Saldo 2.175,20 €."
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext      | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|---------------|--------------|--------------|--------------|
| Fitnessstudio |              |              | Alle         |
* Die Umsätze zeigen die Zeilen
| Gegenpartei         | Verwendungszweck     | Betrag   | Saldo danach | Rückgabe      |
|---------------------|----------------------|----------|--------------|---------------|
| Fitnessstudio Vital | Rückgabe Lastschrift | 29,90 €  | 2.175,20 €   |               |
| Fitnessstudio Vital | Mitgliedsbeitrag     | -29,90 € | 2.145,30 €   | Zurückgegeben |

## Das Abbrechen der Rückfrage bucht nichts

Tags: UC-022, PK-59

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin wählt bei der Lastschrift von "Fitnessstudio Vital" die Rückgabe
* Die Kundin bricht die Rückgabe ab
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext      | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|---------------|--------------|--------------|--------------|
| Fitnessstudio |              |              | Alle         |
* Die Umsätze zeigen die Zeilen
| Gegenpartei         | Verwendungszweck | Betrag   | Saldo danach | Rückgabe    |
|---------------------|------------------|----------|--------------|-------------|
| Fitnessstudio Vital | Mitgliedsbeitrag | -29,90 € | 2.145,30 €   | Zurückgeben |

## Eine Lastschrift nach Ablauf der Frist von 8 Wochen wird abgelehnt

Tags: UC-022, PK-59, BR-0093

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin wählt bei der Lastschrift von "Zeitungsverlag Nord" die Rückgabe
* Die Kundin bestätigt die Rückgabe
* Die Umsätze zeigen die Meldung "Die Rückgabefrist von 8 Wochen ist abgelaufen."
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext       | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|----------------|--------------|--------------|--------------|
| Zeitungsverlag |              |              | Alle         |
* Die Umsätze zeigen die Zeilen
| Gegenpartei         | Verwendungszweck | Betrag   | Saldo danach | Rückgabe    |
|---------------------|------------------|----------|--------------|-------------|
| Zeitungsverlag Nord | Zeitungsabo      | -14,90 € | 2.175,20 €   | Zurückgeben |

## Ein Umsatz ohne SEPA-Lastschrift wird abgelehnt

Tags: UC-022, PK-59, BR-0094

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Der Dienst weist die Rückgabe der Lastschrift von "Bäckerei Krause" mit Status "422" und der Meldung "Dieser Umsatz ist keine SEPA-Lastschrift." ab

## Eine zurückgegebene Lastschrift lässt sich nicht erneut zurückgeben

Tags: UC-022, PK-59, BR-0094

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin wählt bei der Lastschrift von "Fitnessstudio Vital" die Rückgabe
* Die Kundin bestätigt die Rückgabe
* Der Dienst weist die Rückgabe der Lastschrift von "Fitnessstudio Vital" mit Status "422" und der Meldung "Die Lastschrift wurde bereits zurückgegeben." ab
* Die Kundin filtert die Umsätze mit den Einträgen
| Suchtext      | Zeitraum von | Zeitraum bis | Ein-/Ausgang |
|---------------|--------------|--------------|--------------|
| Fitnessstudio |              |              | Alle         |
* Die Umsätze zeigen die Zeilen
| Gegenpartei         | Verwendungszweck     | Betrag   | Saldo danach | Rückgabe      |
|---------------------|----------------------|----------|--------------|---------------|
| Fitnessstudio Vital | Rückgabe Lastschrift | 29,90 €  | 2.175,20 €   |               |
| Fitnessstudio Vital | Mitgliedsbeitrag     | -29,90 € | 2.145,30 €   | Zurückgegeben |

## Ein unbekannter Umsatz wird mit Umsatz nicht gefunden abgewiesen

Tags: UC-022, PK-59, BR-0094

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Der Dienst weist die Rückgabe der Lastschrift von "Unbekannte Gegenpartei" mit Status "404" und der Meldung "Der Umsatz wurde nicht gefunden." ab

## Eine fremde IBAN wird bei der Rückgabe mit Konto nicht gefunden abgewiesen

Tags: UC-022, PK-59, BR-0011

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Der Dienst weist die Rückgabe auf dem Konto mit der IBAN "DE00 1234 5678 9012 3456 78" mit Status "404" und der Meldung "Das Konto wurde nicht gefunden." ab

## Umsätze der Kreditkarte bieten keine Rückgabe an

Tags: UC-022, PK-59, BR-0094

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Kreditkarte"
* Die Umsätze zeigen keine Rückgabe

## Ohne gültige Sitzung weist der Dienst die Rückgabe mit 401 ab

Tags: UC-022, PK-59

* Testdaten sind zurückgesetzt
* Ohne Anmeldung weist der Dienst die Rückgabe einer Lastschrift mit Status "401" ab

## Eine umsatzId, die die Feldbedingung verletzt, wird bei der Rückgabe mit 400 abgewiesen

Tags: UC-022, PK-59

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Der Dienst weist die Rückgabe mit einer umsatzId von "37" Zeichen mit Status "400" ab
