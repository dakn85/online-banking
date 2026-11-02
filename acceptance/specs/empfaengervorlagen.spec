# Empfängervorlagen

## Die Höchstzahl von 50 Empfängervorlagen wird beim Anlegen geprüft

Tags: UC-004, PK-13, BR-0015

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin legt die Vorlage "Vorlage 51" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Der Dialog "Neue Vorlage" zeigt die Meldung "Sie haben die Höchstzahl von 50 Empfängervorlagen erreicht."

## Eine Vorlage mit schon vergebenem Namen wird abgelehnt

Tags: UC-004, PK-13, BR-0013

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE44 5001 0517 5407 3249 31" und Verwendungszweck "Rechnung 4712" an
* Der Dialog "Neue Vorlage" zeigt die Meldung "Eine Vorlage mit diesem Namen gibt es bereits."

## Eine Vorlage wird erst nach der Sicherheitsabfrage gelöscht

Tags: UC-004, PK-13

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin wählt die Vorlage "Möbel Nord GmbH" zum Löschen
* Die Kundin bestätigt den Dialog "Vorlage löschen"
* Die Empfängervorlagen zeigen die Meldung "Empfängervorlage gelöscht."

## Eine Vorlage mit IBAN außerhalb des SEPA-Raums wird abgelehnt

Tags: UC-004, PK-13, BR-0014

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "TR33 0006 1005 1978 6457 8413 26" und Verwendungszweck "Rechnung 4711" an
* Der Dialog "Neue Vorlage" zeigt die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."

## Eine Vorlage wird umbenannt und behält IBAN und Verwendungszweck

Tags: UC-004, PK-13, BR-0013

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin wählt die Vorlage "Möbel Nord GmbH" zum Bearbeiten
* Die Kundin ändert im Dialog "Vorlage bearbeiten" den Namen in "Möbel Nord GmbH (Filiale Süd)", wählt „Umbenennen“ und sieht IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711"
* Die Empfängervorlagen zeigen die Meldung "Empfängervorlage umbenannt."

## Ein Name, der sich nur in der Groß-/Kleinschreibung unterscheidet, gilt als vergeben

Tags: UC-004, PK-13, BR-0013

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin legt die Vorlage "möbel nord gmbh" mit IBAN "DE44 5001 0517 5407 3249 31" und Verwendungszweck "Rechnung 4712" an
* Der Dialog "Neue Vorlage" zeigt die Meldung "Eine Vorlage mit diesem Namen gibt es bereits."

## Ein vergebener Name wird auch bei 50 Vorlagen als Konflikt abgelehnt

Tags: UC-004, PK-13, BR-0013, BR-0015

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin legt die Vorlage "Vorlage 1" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Der Dialog "Neue Vorlage" zeigt die Meldung "Eine Vorlage mit diesem Namen gibt es bereits."

## Ein Verwendungszweck aus Leerzeichen gilt als kein Verwendungszweck

Tags: UC-004, PK-7

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck " " an
* Die Kundin wählt in der Überweisung die Vorlage "Möbel Nord GmbH" und sieht Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00" und einen leeren Verwendungszweck

## Eine Vorlage lässt sich auf ihren eigenen Namen umbenennen

Tags: UC-004, PK-13, BR-0013

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin wählt die Vorlage "Möbel Nord GmbH" zum Bearbeiten
* Die Kundin ändert im Dialog "Vorlage bearbeiten" den Namen in "Möbel Nord GmbH", wählt „Umbenennen“ und sieht IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711"
* Die Empfängervorlagen zeigen die Meldung "Empfängervorlage umbenannt."

## Jede Empfängervorlage zeigt die Aktionen Bearbeiten und Löschen in ihrer Zeile

Tags: UC-004, PK-13

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Empfängervorlagen zeigen zu jeder Vorlage die Aktionen "Bearbeiten" und "Löschen"

## Eine abgebrochene Neuanlage legt keine Vorlage an

Tags: UC-004, PK-13

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet den Dialog "Neue Vorlage"
* Die Kundin bricht den Dialog "Neue Vorlage" ab
* Die Empfängervorlagen zeigen die Zahl der belegten Vorlagen "0 von 50"

## Der Löschdialog nennt die gewählte Vorlage mit ihrem Namen

Tags: UC-004, PK-13

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin wählt die Vorlage "Möbel Nord GmbH" zum Löschen
* Der Dialog "Vorlage löschen" nennt die Vorlage "Möbel Nord GmbH"

## Der Dialog „Vorlage bearbeiten“ führt nur das Feld Name

Tags: UC-004, PK-13

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin wählt die Vorlage "Möbel Nord GmbH" zum Bearbeiten
* Der Dialog "Vorlage bearbeiten" führt nur das Feld "Name"

## Der Abbruch der Löschabfrage lässt die Vorlage bestehen

Tags: UC-004, PK-13

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin wählt die Vorlage "Möbel Nord GmbH" zum Löschen
* Die Kundin bricht den Dialog "Vorlage löschen" ab
* Die Empfängervorlagen zeigen die Zahl der belegten Vorlagen "1 von 50"

## Der Abbruch im Dialog „Vorlage bearbeiten“ ändert den Namen nicht

Tags: UC-004, PK-13

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin wählt die Vorlage "Möbel Nord GmbH" zum Bearbeiten
* Die Kundin bricht den Dialog "Vorlage bearbeiten" ab
* Die Kundin wählt in der Überweisung die Vorlage "Möbel Nord GmbH" und sieht Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711"
