# PK-2: Überweisung erfassen: Im Finanzstatus führt der Knopf „Überweisen“ beim Girokonto auf die Überweisung, das …

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Überweisung erfassen: Im Finanzstatus führt der Knopf „Überweisen“ beim Girokonto auf die Überweisung, das Auftraggeberkonto ist vorbelegt.
Die Kundin gibt Empfänger, IBAN, Betrag in Euro und einen Verwendungszweck ein. Die IBAN muss gültig sein und zu einem SEPA-Land gehören, der Betrag darf den verfügbaren Betrag des Girokontos nicht übersteigen.
Vor dem Absenden sieht sie eine Zusammenfassung und bestätigt. Danach steht sie wieder auf dem Finanzstatus mit dem neuen Saldo und der Meldung „Überweisung ausgeführt.“
Wer doppelt auf Bestätigen klickt, bucht trotzdem nur einmal. Termin- und Daueraufträge kommen später.

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-2 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-2 grün
