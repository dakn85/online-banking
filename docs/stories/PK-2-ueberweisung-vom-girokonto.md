# PK-2: Überweisung vom Girokonto

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich vom Finanzstatus aus eine Überweisung von meinem Girokonto erfassen, in einer Zusammenfassung prüfen und bestätigen, damit ich ohne Filiale Geld überweise und sofort den neuen Saldo sehe.

## Nicht im Scope

Termin- und Daueraufträge; Überweisungen von anderen Konten als dem Girokonto; Zahlungen außerhalb des SEPA-Raums; Umsatzanzeige und Kontobewegungen; Empfängerverwaltung oder Kontaktbuch.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Überweisung vom Girokonto ausführen | Neu | Endpunkt neu |
| Ueberweisung | Neu | Schema neu |
| Ueberweisungsauftrag | Neu | Schema neu |
| Überweisung | Neu | Entität neu, Maske neu |
| Genau einmalige Ausführung einer Überweisung | Neu | Qualitätsanforderung neu |
| Finanzstatus | Geändert | Aktion Überweisen neu |
| Überweisung bestätigen | Neu | Maske neu |
| UC-001 Finanzstatus anzeigen | Geändert | Notizen geändert, Schritt 7 geändert |
| UC-002 Überweisung vom Girokonto | Neu | Use Case neu |
| BR-0003 IBAN des Empfängers | Neu | Neu in UC-002 |
| BR-0004 Betragsgrenze des Girokontos | Neu | Neu in UC-002 |
| BR-0005 Genau einmalige Ausführung | Neu | Neu in UC-002 |
| BR-0006 Saldo nach der Überweisung | Neu | Neu in UC-002 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Die Zusammenfassung zeigt die erfasste Überweisung vor dem Absenden
- `acceptance/specs/ueberweisung.spec`: Ein Betrag über dem verfügbaren Betrag wird abgelehnt
- `acceptance/specs/ueberweisung.spec`: Ein doppelter Klick auf Bestätigen bucht nur einmal
- `acceptance/specs/ueberweisung.spec`: Eine bestätigte Überweisung mindert den Saldo des Girokontos
- `acceptance/specs/ueberweisung.spec`: Eine ungültige IBAN wird abgelehnt
- `acceptance/specs/ueberweisung.spec`: Überweisen öffnet die Überweisung mit vorbelegtem Girokonto

## Aufgaben für die Umsetzung

- [ ] Überweisung vom Girokonto ausführen: Endpunkt neu
- [ ] Ueberweisung: Schema neu
- [ ] Ueberweisungsauftrag: Schema neu
- [ ] Überweisung: Entität neu
- [ ] Genau einmalige Ausführung einer Überweisung: Qualitätsanforderung neu
- [ ] Finanzstatus: Aktion Überweisen neu
- [ ] Überweisung bestätigen: Maske neu
- [ ] Überweisung: Maske neu
- [ ] UC-001: Notizen geändert
- [ ] UC-001: Schritt 7 geändert
- [ ] UC-002: Use Case neu
- [ ] BR-0003: Neu in UC-002
- [ ] BR-0004: Neu in UC-002
- [ ] BR-0005: Neu in UC-002
- [ ] BR-0006: Neu in UC-002
- [ ] Vision: Z-5 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-2 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-2 grün

## Offene Fragen

- [x] Wann sollen IBAN und Betrag geprüft werden?
  **Antwort:** Beim „Weiter“ vor der Zusammenfassung, mit Meldung im Formular. Den Betrag prüft der Dienst beim Bestätigen noch einmal.
- [x] Sind das die Texte für die beiden Ablehnungen?
  **Antwort:** Ja, beide Texte so verwenden.
- [x] Wie soll der doppelte Klick abgefangen werden?
  **Antwort:** Beides: Kennung im Dienst und Sperre der Seite.
- [x] Eigene Bestätigungsmaske oder Zusammenfassung auf der Überweisungsseite, und braucht es „Abbrechen“?
  **Antwort:** Eigene Maske mit „Bestätigen“ und „Abbrechen“.
- [x] Woher kommt der neue Saldo nach dem Bestätigen?
  **Antwort:** Die Seite liest den Finanzstatus neu.
- [x] Bekommt die Überweisung einen eigenen Use Case „Überweisung erfassen“, auf den die Operation verweist?
  **Antwort:** Ja, eigener Use Case UC-002: Die Kundin hat das Ziel, Geld zu überweisen.
- [x] Braucht die Antwort auf POST /api/ueberweisungen eine Auftragsreferenz oder ein Statusfeld?
  **Antwort:** Nein, die Antwort spiegelt die Überweisung; den Erfolg zeigt die Meldung „Überweisung ausgeführt.“ auf dem Finanzstatus.
- [ ] Die Seite vergibt je Überweisung eine auftragsId; der Vertrag sagt nichts über den Fall, dass dieselbe Kennung erneut bestätigt wird, während Betrag, Empfänger oder Empfänger-IBAN abweichend sind (etwa nach der Korrektur in A1/A2). Wie soll der Dienst dann reagieren? (POST /api/ueberweisungen, auftragsId)
- [ ] Der Vertrag hat für POST /api/ueberweisungen keinen Fehlerfall, wenn auftraggeberIban nicht das Girokonto der angemeldeten Kundin ist (Kreditkarte oder fremde IBAN); Überweisungen von anderen Konten sind ausdrücklich nicht im Scope. Wie soll der Dienst reagieren? (POST /api/ueberweisungen, auftraggeberIban)
- [ ] Lehnt der Dienst die IBAN beim Bestätigen ab (400), braucht die Kundin die Meldung „Die IBAN ist ungültig oder gehört zu keinem SEPA-Land.“ und korrigierbare Felder. Die Bestätigungsmaske ueberweisung-bestaetigen hat kein Meldungsfeld und keine Eingabefelder; UC-002 A1/A2 führt bei Schritt 2 weiter. Wo erscheint die Ablehnung? (POST /api/ueberweisungen, empfaengerIban)
- [ ] BR-0004 und A2 behandeln „Betrag nicht größer als 0“ und „Betrag über dem verfügbaren Betrag“ gleich und zeigen den Text „Der Betrag übersteigt den verfügbaren Betrag des Girokontos.“ Das Anfrageschema schließt 0 aber schon formal aus (exclusiveMinimum 0) — das wäre eine Schemaprüfung mit 400. Welcher Weg und Text gilt für einen Betrag von 0 oder darunter? (POST /api/ueberweisungen, betrag)
- [ ] UC-002 Schritt 1 und die Rückfrage verlangen, dass die Seite den verfügbaren Betrag anzeigt und den Betrag bereits beim „Weiter“ prüft. Die Maske ueberweisung führt den verfügbaren Betrag nur als Beispieltext, nicht als Feld mit Konto.verfuegbarerBetrag, und am Betragsfeld steht keine Grenze. Wird der verfügbare Betrag ein eigenes Anzeigefeld, gegen das die Seite beim „Weiter“ prüft? (GET /api/konten, verfuegbarerBetrag)
- [ ] Wie soll die Operation ein Auftraggeberkonto abweisen, das nicht der angemeldeten Kundin gehört oder kein Girokonto ist?
- [ ] Braucht die Ablehnung eines fremden Auftraggeberkontos einen Text in der Oberfläche oder nur die Abweisung der Schnittstelle?
