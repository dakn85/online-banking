# PK-59: Lastschrift zurückgeben

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich eine SEPA-Lastschrift aus den Umsätzen meines Girokontos innerhalb von 8 Wochen nach der Belastung zurückgeben, damit der Betrag wieder auf meinem Girokonto gutgeschrieben wird.

## Nicht im Scope

- Widerspruch/Rückgabe mit Begründung oder Rückgabegrund-Auswahl: Die Idee nennt keinen Grund; die Rückgabe ist nur Frist und Gutschrift.
- Rückgabe von Lastschriften anderer Kontoarten oder Kartenzahlungen: Die Idee nennt nur SEPA-Lastschriften aus dem Girokonto.
- Benachrichtigung per E-Mail/Push: Nicht gefordert; Rückmeldung nur auf der Maske.
- Rückgängig machen einer Rückgabe: Keine weitere Aktion genannt.
- Rückgabe-Übersicht oder Bericht: Nicht gefordert; die Rückgabe erscheint nur in den Umsätzen.
- Rückbuchung der Lastschrift beim Zahlungsempfänger / Kernbank-Anbindung: C-001 nutzt Demo-Konten statt Kernbank; Abwicklung mit dem Einreicher gehört nicht zur Idee.
- Sonderfristen (z. B. 13 Monate bei nicht autorisierter Lastschrift): Die Idee nennt nur 8 Wochen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos mit Saldo danach, neueste zuerst | Geändert | Beschreibung geändert |
| Lastschrift zurückgeben und Betrag gutschreiben | Neu | Endpunkt neu |
| Umsatz | Geändert | Eigenschaft umsatzId neu, Eigenschaft sepaLastschrift neu, Eigenschaft zurueckgegeben neu, Beschreibung geändert, Attribut umsatzId neu, Attribut sepaLastschrift neu, und 2 weitere |
| Rueckgabe | Neu | Schema neu |
| Architektur | Geändert | Bausteinsicht geändert, Querschnittliche Konzepte geändert |
| Zugriffsschutz des Finanzstatus | Geändert | Maß geändert, Gilt für geändert |
| Umsätze | Geändert | Use Case UC-022 neu, Feld Rückgabe neu, Aktion Zurückgeben neu, und 3 weitere |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Notizen geändert, Schritt 5 geändert, BR-0011 geändert |
| BR-0011 Umsätze und Rückgaben nur für Konten der Kundin | Geändert | Titel geändert, Text geändert |
| UC-022 Lastschrift zurückgeben | Neu | Use Case neu |
| BR-0093 Rückgabefrist von 8 Wochen | Neu | Neu in UC-022 |
| BR-0094 Nur SEPA-Lastschriften des Girokontos und nur einmal zurückgebbar | Neu | Neu in UC-022 |
| BR-0095 Gutschrift und Umsatz einer Rückgabe | Neu | Neu in UC-022 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/lastschrift-zurueckgeben.spec`: Das Abbrechen der Rückfrage bucht nichts
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Die bestätigte Rückgabe schreibt den Betrag gut und zeigt die Gutschrift als Umsatz
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Ein Umsatz ohne SEPA-Lastschrift wird abgelehnt
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Ein unbekannter Umsatz wird mit Umsatz nicht gefunden abgewiesen
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Eine fremde IBAN wird bei der Rückgabe mit Konto nicht gefunden abgewiesen
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Eine Lastschrift nach Ablauf der Frist von 8 Wochen wird abgelehnt
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Eine zurückgegebene Lastschrift lässt sich nicht erneut zurückgeben
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Ohne Anmeldung ist die Rückgabe nicht möglich
- `acceptance/specs/lastschrift-zurueckgeben.spec`: Umsätze der Kreditkarte bieten keine Rückgabe an
- `acceptance/specs/umsaetze.spec`: Die Umsatzliste zeigt den Buchungstag als TT.MM.JJJJ

## Aufgaben für die Umsetzung

- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst: Beschreibung geändert
- [ ] Lastschrift zurückgeben und Betrag gutschreiben: Endpunkt neu
- [ ] Umsatz: Eigenschaft umsatzId neu
- [ ] Umsatz: Eigenschaft sepaLastschrift neu
- [ ] Umsatz: Eigenschaft zurueckgegeben neu
- [ ] Rueckgabe: Schema neu
- [ ] Architektur: Bausteinsicht geändert
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Umsatz: Beschreibung geändert
- [ ] Umsatz: Attribut umsatzId neu
- [ ] Umsatz: Attribut sepaLastschrift neu
- [ ] Umsatz: Attribut zurueckgegeben neu
- [ ] Umsatz: Einschränkungen geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Umsätze: Use Case UC-022 neu
- [ ] Umsätze: Feld Rückgabe neu
- [ ] Umsätze: Aktion Zurückgeben neu
- [ ] Umsätze: Aktion Bestätigen neu
- [ ] Umsätze: Aktion Abbrechen neu
- [ ] Umsätze: Skizze geändert
- [ ] UC-003: Notizen geändert
- [ ] UC-003: Schritt 5 geändert
- [ ] UC-003: BR-0011 geändert
- [ ] BR-0011: Titel geändert
- [ ] BR-0011: Text geändert
- [ ] UC-022: Use Case neu
- [ ] BR-0093: Neu in UC-022
- [ ] BR-0094: Neu in UC-022
- [ ] BR-0095: Neu in UC-022
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-59 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-59 grün

## Entscheidungen

- Welche SEPA-Lastschriften trägt das Girokonto im Ausgangsstand? Heute gibt es keine; alle Demo-Umsätze sind älter als 8 Wochen, und die Rückgabe lässt sich ohne Lastschrift in der Frist nicht prüfen.
  **Antwort:** Zwei neue Demo-Lastschriften auf dem Girokonto: eine mit Buchungstag relativ zum Reset-Tag (in der Frist), eine mit Buchungstag über 8 Wochen zurück; die bestehenden Szenarien mit fester Zeilenliste der Umsätze werden angepasst.
  _→ eingearbeitet in UC-022, BR-0093, BR-0094, BR-0095, UC-003, Umsatz, GET /api/konten/{iban}/umsaetze, POST /api/konten/{iban}/umsaetze/{umsatzId}/rueckgaben, Schema Umsatz, Schema Rueckgabe, umsaetze, NFR-001, vision, architektur · d9654e1_
- Gibt die Kundin die Lastschrift mit einem Klick zurück, oder muss sie die Rückgabe vorher bestätigen? Die Rückgabe lässt sich danach nicht rückgängig machen.
  **Antwort:** Rückfrage mit Betrag und Gegenpartei auf der Maske Umsätze, erst „Bestätigen“ bucht die Gutschrift; keine neue Maske.
  _→ eingearbeitet in UC-022, BR-0093, BR-0094, BR-0095, UC-003, Umsatz, GET /api/konten/{iban}/umsaetze, POST /api/konten/{iban}/umsaetze/{umsatzId}/rueckgaben, Schema Umsatz, Schema Rueckgabe, umsaetze, NFR-001, vision, architektur · d9654e1_
- Wie verhält sich die Umsatzseite nach einer abgelehnten oder wiederholten Bestätigung der Rückgabe?
  **Antwort:** Die Rückfrage schließt, die Umsätze werden neu geladen, und die Meldung des Dienstes steht (404, 422); „Bestätigen“ ist während des Absendens gesperrt. Eine zweite Anfrage liefert 422 „Die Lastschrift wurde bereits zurückgegeben.“ und bucht nichts; die Zeile zeigt danach den aktuellen Stand.
  _→ noch nicht in der Spezifikation_
