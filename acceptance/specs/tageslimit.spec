# Tageslimit für Überweisungen festlegen

## Das Tageslimit zeigt anfangs das Standardlimit

Tags: UC-015, PK-46, BR-0070

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Tageslimit
* Das Tageslimit zeigt das aktuelle Limit "5.000,00 €" und das Standardlimit "5.000,00 €"

## Die Kundin senkt ihr Tageslimit

Tags: UC-015, PK-46, BR-0070

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Tageslimit
* Die Kundin setzt das Tageslimit auf "1.000,00 €"
* Das Tageslimit zeigt die Meldung "Tageslimit gespeichert."
* Das Tageslimit zeigt das aktuelle Limit "1.000,00 €" und das Standardlimit "5.000,00 €"

## Die Kundin hebt ihr gesenktes Tageslimit bis zum Standardlimit an

Tags: UC-015, PK-46, BR-0070

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Tageslimit
* Die Kundin setzt das Tageslimit auf "1.000,00 €"
* Die Kundin setzt das Tageslimit auf "5.000,00 €"
* Das Tageslimit zeigt die Meldung "Tageslimit gespeichert."
* Das Tageslimit zeigt das aktuelle Limit "5.000,00 €" und das Standardlimit "5.000,00 €"

## Ein Tageslimit über dem Standardlimit wird abgelehnt

Tags: UC-015, PK-46

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Tageslimit
* Die Kundin setzt das Tageslimit auf "5.000,01 €"
* Das Tageslimit zeigt die Meldung "Das Tageslimit muss zwischen 0,00 EUR und 5.000,00 EUR liegen."
* Das Tageslimit zeigt das aktuelle Limit "5.000,00 €" und das Standardlimit "5.000,00 €"

## Das Tageslimit ist ohne Anmeldung nicht erreichbar

Tags: UC-015, PK-46

* Testdaten sind zurückgesetzt
* Das Tageslimit ist ohne Anmeldung nicht erreichbar
