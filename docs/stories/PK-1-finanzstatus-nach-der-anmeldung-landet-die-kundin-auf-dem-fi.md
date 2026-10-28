# PK-1: Finanzstatus: Nach der Anmeldung landet die Kundin auf dem Finanzstatus.

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Finanzstatus: Nach der Anmeldung landet die Kundin auf dem Finanzstatus. Er zeigt alle ihre Konten in einer Tabelle mit Kontoname, IBAN und Saldo in Euro, darüber das Gesamtvermögen als Summe aller Salden.
Eine Kreditkarte mit offenem Betrag hat einen negativen Saldo und mindert das Gesamtvermögen. Nur das Girokonto hat einen Dispositionsrahmen; dort stehen zusätzlich der Rahmen und der verfügbare Betrag (Saldo plus Rahmen).
In der Zeile des Girokontos steht der Knopf „Überweisen“. Die Überweisung selbst kommt als nächste Story, bis dahin führt der Knopf auf den Platzhalter.
Die Konten liefert vorerst der Dienst als Demo-Daten, ein Kernbanksystem gibt es noch nicht. Ohne Anmeldung ist die Seite nicht erreichbar.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Konten der angemeldeten Kundin mit Salden und Gesamtvermögen | Neu | Endpunkt neu |
| Fehler | Neu | Schema neu |
| Konto | Neu | Schema neu, Entität neu |
| Kontenuebersicht | Neu | Schema neu |
| Kunde | Neu | Entität neu |
| Zugriffsschutz des Finanzstatus | Neu | Qualitätsanforderung neu |
| Demo-Konten statt Kernbank | Neu | Randbedingung neu |
| Finanzstatus | Neu | Maske neu |
| UC-001 Finanzstatus anzeigen | Neu | Use Case neu |
| BR-0001 Gesamtvermögen | Neu | Neu in UC-001 |
| BR-0002 Dispositionsrahmen nur beim Girokonto | Neu | Neu in UC-001 |
| Vision | Neu | Vision neu |

## Akzeptanztests

- `acceptance/specs/finanzstatus.spec`: Das Gesamtvermögen ist die Summe aller Salden
- `acceptance/specs/finanzstatus.spec`: Das Girokonto zeigt Dispositionsrahmen und verfügbaren Betrag
- `acceptance/specs/finanzstatus.spec`: Der Finanzstatus zeigt alle Konten mit IBAN und Saldo
- `acceptance/specs/finanzstatus.spec`: Ohne Anmeldung ist der Finanzstatus nicht erreichbar

## Aufgaben für die Umsetzung

- [ ] Konten der angemeldeten Kundin mit Salden und Gesamtvermögen: Endpunkt neu
- [ ] Fehler: Schema neu
- [ ] Konto: Schema neu
- [ ] Kontenuebersicht: Schema neu
- [ ] Kunde: Entität neu
- [ ] Konto: Entität neu
- [ ] Zugriffsschutz des Finanzstatus: Qualitätsanforderung neu
- [ ] Demo-Konten statt Kernbank: Randbedingung neu
- [ ] Finanzstatus: Maske neu
- [ ] UC-001: Use Case neu
- [ ] BR-0001: Neu in UC-001
- [ ] BR-0002: Neu in UC-001
- [ ] Vision: Vision neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-1 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-1 grün

## Offene Fragen

- [x] Welche Demo-Konten und Salden soll der Finanzstatus zeigen?
  **Antwort:** Girokonto 2.145,30 € mit Rahmen 1.000,00 € und Kreditkarte −387,45 €, wie in den Szenarien.
- [x] Wo wird das Gesamtvermögen gebildet?
  **Antwort:** Im Dienst; die Oberfläche zeigt den gelieferten Wert.
- [x] Wie zeigt die Tabelle bei Konten ohne Dispositionsrahmen die beiden Spalten?
  **Antwort:** Die Spalten bleiben, die Zellen sind leer.
- [x] In welcher Form führt die API Geldbeträge?
  **Antwort:** Dezimalzahl in Euro.
- [x] In welcher Form führt die API Geldbeträge?
  **Antwort:** Als Zahl in Euro mit zwei Nachkommastellen (etwa 2145.30).
- [x] Sollen die Felder für Konten ohne Dispositionsrahmen in der Antwort fehlen oder mit einem Ersatzwert kommen?
  **Antwort:** Die Felder fehlen (nur das Girokonto trägt sie).
- [x] Sind diese Feldnamen für die Antwort von GET /api/konten verbindlich?
  **Antwort:** Ja, so wie vorgeschlagen.
