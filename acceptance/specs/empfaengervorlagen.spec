# Empfängervorlagen

## Die Höchstzahl von 50 Empfängervorlagen wird beim Anlegen geprüft

Tags: UC-004, PK-7, BR-0015

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin legt die Vorlage "Vorlage 51" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Empfängervorlagen zeigen die Meldung "Sie haben die Höchstzahl von 50 Empfängervorlagen erreicht."

## Eine Vorlage mit schon vergebenem Namen wird abgelehnt

Tags: UC-004, PK-7, BR-0013

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE02 5001 0517 5407 3249 31" und Verwendungszweck "Rechnung 4712" an
* Die Empfängervorlagen zeigen die Meldung "Eine Vorlage mit diesem Namen gibt es bereits."

## Eine Vorlage wird erst nach der Sicherheitsabfrage gelöscht

Tags: UC-004, PK-7

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin wählt die Vorlage "Möbel Nord GmbH" zum Löschen und antwortet auf die Sicherheitsabfrage "Ja"
* Die Empfängervorlagen zeigen die Meldung "Empfängervorlage gelöscht."

## Eine Vorlage mit IBAN außerhalb des SEPA-Raums wird abgelehnt

Tags: UC-004, PK-7, BR-0014

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "TR33 0006 1005 1978 6457 8413 26" und Verwendungszweck "Rechnung 4711" an
* Die Empfängervorlagen zeigen die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."

## Eine Vorlage wird umbenannt und behält IBAN und Verwendungszweck

Tags: UC-004, PK-7, BR-0013

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin benennt die Vorlage "Möbel Nord GmbH" in "Möbel Nord GmbH (Filiale Süd)" um und sieht IBAN "DE89 3704 0044 0532 0130 00", Verwendungszweck "Rechnung 4711" und die Meldung "Empfängervorlage umbenannt."

## Ein Name, der sich nur in der Groß-/Kleinschreibung unterscheidet, gilt als vergeben

Tags: UC-004, PK-7, BR-0013

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin legt die Vorlage "möbel nord gmbh" mit IBAN "DE02 5001 0517 5407 3249 31" und Verwendungszweck "Rechnung 4712" an
* Die Empfängervorlagen zeigen die Meldung "Eine Vorlage mit diesem Namen gibt es bereits."

## Ein vergebener Name wird auch bei 50 Vorlagen als Konflikt abgelehnt

Tags: UC-004, PK-7, BR-0013, BR-0015

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin legt die Vorlage "Vorlage 1" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Empfängervorlagen zeigen die Meldung "Eine Vorlage mit diesem Namen gibt es bereits."
