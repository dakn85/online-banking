# PK-1: Finanzstatus: Nach der Anmeldung landet die Kundin auf dem Finanzstatus.

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Finanzstatus: Nach der Anmeldung landet die Kundin auf dem Finanzstatus. Er zeigt alle ihre Konten in einer Tabelle mit Kontoname, IBAN und Saldo in Euro, darüber das Gesamtvermögen als Summe aller Salden.
Eine Kreditkarte mit offenem Betrag hat einen negativen Saldo und mindert das Gesamtvermögen. Nur das Girokonto hat einen Dispositionsrahmen; dort stehen zusätzlich der Rahmen und der verfügbare Betrag (Saldo plus Rahmen).
In der Zeile des Girokontos steht der Knopf „Überweisen“. Die Überweisung selbst kommt als nächste Story, bis dahin führt der Knopf auf den Platzhalter.
Die Konten liefert vorerst der Dienst als Demo-Daten, ein Kernbanksystem gibt es noch nicht. Ohne Anmeldung ist die Seite nicht erreichbar.

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-1 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-1 grün
