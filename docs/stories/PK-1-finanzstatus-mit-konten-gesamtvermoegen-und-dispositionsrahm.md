# PK-1: Finanzstatus mit Konten, Gesamtvermögen und Dispositionsrahmen

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Kundin im Online-Banking möchte ich nach der Anmeldung auf dem Finanzstatus alle meine Konten mit Kontoname, IBAN und Saldo in Euro und darüber mein Gesamtvermögen sehen, damit ich mein Vermögen und den verfügbaren Betrag meines Girokontos auf einen Blick überblicke.

## Nicht im Scope

Die Überweisung selbst kommt als eigene Story; der Knopf „Überweisen“ führt bis dahin auf den Platzhalter. Anbindung an ein Kernbanksystem: Die Konten liefert der Dienst als Demo-Daten. Konten anlegen, ändern oder schließen, Umsätze und Kontobewegungen.

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
- [x] Die Zeile des Girokontos trägt Knopf „Überweisen“ und verfügbaren Betrag, die Kreditkarte nicht (UC-001 Schritt 6/7). Die Maske finanzstatus führt dafür kein Feld. Woran erkennt die Oberfläche die Girokonto-Zeile? (GET /api/konten, art)
  **Antwort:** Über art aus der Antwort; art wird als Feld in die Maske aufgenommen (unsichtbar, nur zur Steuerung).
- [x] Für den Dispositionsrahmen ist nur „nur beim Girokonto belegt“ festgelegt, nicht ob ein Girokonto ihn haben muss. Was gilt, wenn einem Girokonto der Rahmen fehlt? (GET /api/konten, dispositionsrahmen)
  **Antwort:** Pflicht beim Girokonto; die Entität bekommt diese Validierungsregel, die Demo-Daten halten sie ein, ein Girokonto ohne Rahmen ist ein Datenfehler.
- [x] Das ER-Diagramm sagt Konto }o--|| Kunde, der Entität Konto fehlt aber jedes Attribut, das ein Konto einer Kundin zuordnet — und der Dienst kennt zwei Demo-Kunden (lena.hoffmann, jonas.weber). Welche Konten sieht eine angemeldete Kundin? (Aussage „Jedes Konto ist genau einer Kundin zugeordnet (Konto }o--|| Kunde), sodass der D“)
  **Antwort:** Die zwei Demo-Konten gelten für jede angemeldete Kundin; die Demo-Daten tragen keinen Kundenbezug.
- [x] Wo wird der verfügbare Betrag gebildet und wie heißt das Feld in der Antwort?
  **Antwort:** Im Dienst als Feld verfuegbarerBetrag, nur beim Girokonto vorhanden.
- [x] Wie ist der Platzhalter hinter dem Knopf „Überweisen“ festgelegt?
  **Antwort:** Der Knopf führt auf die vorhandene Seite /ueberweisung der Projektvorlage; dort steht bis zur Überweisungs-Story der Platzhalter „In Vorbereitung“. Keine eigene Maske.
- [x] Die zwei Demo-Konten gelten laut Rückfrage für jede angemeldete Kundin und tragen keinen Kundenbezug; Konto.iban ist laut Entität eindeutig. Wie werden die Konten geführt? (GET /api/konten, konten)
  **Antwort:** Ein gemeinsamer Demo-Bestand ohne Kundenbezug: beide Kundinnen sehen dieselben zwei Konten, die IBANs bleiben eindeutig
- [x] In welcher Reihenfolge liefert GET /api/konten die Konten im Array konten? (GET /api/konten, konten)
  **Antwort:** Girokonto zuerst, dann Kreditkarte — wie in der Maske der Vorlage
- [x] Was liefert der Finanzstatus, wenn die angemeldete Kundin keine Konten hat? BR-0001 und der Vertrag sagen dazu nichts, gesamtvermoegen ist aber Pflichtfeld. (GET /api/konten, gesamtvermoegen)
  **Antwort:** 200 mit leerem konten-Array und gesamtvermoegen 0; die Tabelle bleibt leer, ohne Hinweis
- [x] Ein Girokonto ohne Dispositionsrahmen ist laut Rückfrage ein Datenfehler (Pflicht beim Girokonto) — die Entitätsänderung enthält diese Pflichtregel aber nicht, und der Vertrag kennt nur 200 und 401. Was liefert GET /api/konten in diesem Fall? (GET /api/konten, Konto.art Girokonto)
  **Antwort:** 500 mit fehler — die Pflichtverletzung ist ein Datenfehler; der Vertrag wird um 500 ergänzt
