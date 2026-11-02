# Empfängervorlagen

## Die Höchstzahl von 50 Empfängervorlagen wird beim Anlegen geprüft

Tags: UC-004, PK-7

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin legt die Vorlage "Vorlage 51" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Empfängervorlagen zeigen die Meldung "Sie haben die Höchstzahl von 50 Empfängervorlagen erreicht."

## Eine Vorlage mit schon vergebenem Namen wird abgelehnt

Tags: UC-004, PK-7

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE02 5001 0517 5407 3249 31" und Verwendungszweck "Rechnung 4712" an
* Die Empfängervorlagen zeigen die Meldung "Eine Vorlage mit diesem Namen gibt es bereits."
