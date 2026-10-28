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
| UC-001 Finanzstatus anzeigen | Geändert | Notizen geändert, Schritt 7 geändert, A2 neu: Finanzstatus nicht verfügbar |
| UC-002 Überweisung vom Girokonto | Neu | Use Case neu |
| BR-0003 IBAN des Empfängers | Neu | Neu in UC-002 |
| BR-0004 Betragsgrenze des Girokontos | Neu | Neu in UC-002 |
| BR-0005 Genau einmalige Ausführung | Neu | Neu in UC-002 |
| BR-0006 Saldo nach der Überweisung | Neu | Neu in UC-002 |
| BR-0007 Auftraggeberkonto der Kundin | Neu | Neu in UC-002 |
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
- [ ] UC-001: A2 neu: Finanzstatus nicht verfügbar
- [ ] UC-002: Use Case neu
- [ ] BR-0003: Neu in UC-002
- [ ] BR-0004: Neu in UC-002
- [ ] BR-0005: Neu in UC-002
- [ ] BR-0006: Neu in UC-002
- [ ] BR-0007: Neu in UC-002
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
- [x] Die Seite vergibt je Überweisung eine auftragsId; der Vertrag sagt nichts über den Fall, dass dieselbe Kennung erneut bestätigt wird, während Betrag, Empfänger oder Empfänger-IBAN abweichend sind (etwa nach der Korrektur in A1/A2). Wie soll der Dienst dann reagieren? (POST /api/ueberweisungen, auftragsId)
  **Antwort:** 200 mit dem gespeicherten Auftrag, keine Buchung, keine Abweichungsmeldung — dafür muss die Seite nach jeder Ablehnung eine neue auftragsId vergeben
- [x] Der Vertrag hat für POST /api/ueberweisungen keinen Fehlerfall, wenn auftraggeberIban nicht das Girokonto der angemeldeten Kundin ist (Kreditkarte oder fremde IBAN); Überweisungen von anderen Konten sind ausdrücklich nicht im Scope. Wie soll der Dienst reagieren? (POST /api/ueberweisungen, auftraggeberIban)
  **Antwort:** 400 mit dem Text „Das Auftraggeberkonto ist kein Girokonto der Kundin.“ (400 im Vertrag um diesen Grund ergänzen)
- [x] Lehnt der Dienst die IBAN beim Bestätigen ab (400), braucht die Kundin die Meldung „Die IBAN ist ungültig oder gehört zu keinem SEPA-Land.“ und korrigierbare Felder. Die Bestätigungsmaske ueberweisung-bestaetigen hat kein Meldungsfeld und keine Eingabefelder; UC-002 A1/A2 führt bei Schritt 2 weiter. Wo erscheint die Ablehnung? (POST /api/ueberweisungen, empfaengerIban)
  **Antwort:** Rücksprung auf die Überweisungsseite mit Meldung im Formular und den bisherigen Eingaben; „Bestätigen“ wird wieder frei
- [x] BR-0004 und A2 behandeln „Betrag nicht größer als 0“ und „Betrag über dem verfügbaren Betrag“ gleich und zeigen den Text „Der Betrag übersteigt den verfügbaren Betrag des Girokontos.“ Das Anfrageschema schließt 0 aber schon formal aus (exclusiveMinimum 0) — das wäre eine Schemaprüfung mit 400. Welcher Weg und Text gilt für einen Betrag von 0 oder darunter? (POST /api/ueberweisungen, betrag)
  **Antwort:** 422 mit dem A2-Text (Texte laut Rückfrage so verwenden); exclusiveMinimum bleibt nur Schutz der Schemaprüfung
- [x] UC-002 Schritt 1 und die Rückfrage verlangen, dass die Seite den verfügbaren Betrag anzeigt und den Betrag bereits beim „Weiter“ prüft. Die Maske ueberweisung führt den verfügbaren Betrag nur als Beispieltext, nicht als Feld mit Konto.verfuegbarerBetrag, und am Betragsfeld steht keine Grenze. Wird der verfügbare Betrag ein eigenes Anzeigefeld, gegen das die Seite beim „Weiter“ prüft? (GET /api/konten, verfuegbarerBetrag)
  **Antwort:** Ja: Anzeigefeld Konto.verfuegbarerBetrag plus Regel am Betragsfeld (Betrag ≤ verfügbarer Betrag), Meldung im Formular
- [x] Wie soll die Operation ein Auftraggeberkonto abweisen, das nicht der angemeldeten Kundin gehört oder kein Girokonto ist?
  **Antwort:** 403 mit der Fehlerstruktur, wie im Vorschlag
- [x] Braucht die Ablehnung eines fremden Auftraggeberkontos einen Text in der Oberfläche oder nur die Abweisung der Schnittstelle?
  **Antwort:** Nur die Abweisung der Schnittstelle, kein neuer Kundentext
- [x] Der Vertrag macht verfuegbarerBetrag und dispositionsrahmen nicht zur Pflicht (required nur kontoname, iban, art, saldo, waehrung), obwohl die Entität beide für Art Girokonto als Pflicht führt, UC-001 Schritt 6 sie in der Girokonto-Zeile zeigt und die Story daraus das Anzeigefeld und die Betragsregel „Betrag ≤ verfügbarer Betrag“ ableitet. Wie ist der Wert verbindlich zu liefern? (GET /api/konten, verfuegbarerBetrag)
  **Antwort:** Für art=Girokonto werden verfuegbarerBetrag und dispositionsrahmen im Schema Pflicht; fehlt der Wert, antwortet der Dienst 500 wie beim fehlenden Dispositionsrahmen.
- [x] GET /api/konten sieht 500 („ein Girokonto ohne Dispositionsrahmen“) vor; UC-001 kennt nur den Alternativablauf „nicht angemeldet“. Was zeigt die Seite in diesem Datenfehlerfall? (GET /api/konten, Konto.art Girokonto)
  **Antwort:** Finanzstatus zeigt die Meldung „Der Finanzstatus ist derzeit nicht verfügbar.“, keine Zeile ohne Dispositionsrahmen, kein „Überweisen“; UC-001 bekommt dafür einen Alternativablauf.
- [x] Das Prüfpaket legt „Betrag nicht größer als 0“ in die 400-Antwort, während BR-0004/A2 und die Rückfrage dafür 422 mit dem Text „Der Betrag übersteigt den verfügbaren Betrag des Girokontos.“ verlangen. Welche Antwort gilt beim Bestätigen für einen Betrag ≤ 0? (Aussage „Ein Betrag von 0 oder kleiner wird mit 400 beantwortet.“)
  **Antwort:** 422 mit dem A2-Text; die 400-Beschreibung wird um „Betrag nicht größer als 0“ bereinigt, exclusiveMinimum bleibt reiner Schemaschutz.
- [x] Die Bestätigungsmaske hat kein Meldungsfeld, für 403 ist ausdrücklich kein Kundentext vorgesehen, und einen Fehlerfall außerhalb von 400/401/403/422 nennt der Vertrag nicht. Was sieht die Kundin dann? (Aussage „Für 403 (Auftraggeberkonto ist kein Girokonto der Kundin) und für einen unerwart“)
  **Antwort:** Rücksprung auf die Überweisung mit allgemeiner Meldung „Die Überweisung konnte nicht ausgeführt werden.“, Eingaben bleiben, „Bestätigen“ wieder frei.
- [x] Die Maske ueberweisung führt den verfügbaren Betrag nur als statischen Meldungstext („3.145,30 €“) und hat keine Regel am Betragsfeld, obwohl die Rückfrage Anzeigefeld Konto.verfuegbarerBetrag plus Regel „Betrag ≤ verfügbarer Betrag“ verlangt. Wie ist die Maske zu führen? (Aussage „Die Überweisungsseite zeigt den verfügbaren Betrag des Girokontos und prüft den “)
  **Antwort:** Anzeigefeld auf Konto.verfuegbarerBetrag (statt statischem Text) und Regel am Betragsfeld mit der Meldung A2 im Formular – Maske entsprechend nachziehen.
- [x] UC-002 Schritt 1 zeigt beim Öffnen der Überweisung den verfügbaren Betrag des Girokontos, die Sequenz von UC-002 ruft GET /api/konten aber erst nach der Buchung auf. Woher kommt der Wert beim Öffnen? (GET /api/konten, verfuegbarerBetrag)
  **Antwort:** Die Seite liest beim Öffnen der Überweisung GET /api/konten und zeigt den aktuellen verfügbaren Betrag (Sequenz von UC-002 um diesen Aufruf ergänzen)
- [x] Welche Antwort gilt, wenn beim Bestätigen mehrere Bedingungen zugleich verletzt sind (etwa fremdes Auftraggeberkonto und ungültige Empfänger-IBAN und Betrag über dem verfügbaren Betrag), und geht die Antwort 200 bei bereits bekannter auftragsId allen Prüfungen vor? (POST /api/ueberweisungen, Überweisung.status nicht vorhanden (neue Kennung, Auftrag noch nicht gespeichert))
  **Antwort:** Feste Reihenfolge: erst 200/201 nach auftragsId, dann 401, 403 (BR-0007), 400 (BR-0003), 422 (BR-0004) – die erste verletzte Bedingung gewinnt
- [x] Die Buchung ist erfolgt, das anschließende Neulesen des Finanzstatus scheitert aber (500 oder abgelaufene Sitzung). Welche Meldung sieht die Kundin? (POST /api/ueberweisungen, Überweisung.status nicht vorhanden (neue Kennung, Auftrag noch nicht gespeichert))
  **Antwort:** „Überweisung ausgeführt.“ bleibt stehen, anstelle der Tabelle erscheint „Der Finanzstatus ist derzeit nicht verfügbar.“
- [x] UC-002 A5 kennt „keine gültige Sitzung“ nur beim Aufruf der Überweisung. Was passiert, wenn die Sitzung erst beim Bestätigen abgelaufen ist? (POST /api/ueberweisungen, Überweisung.status keine gültige Sitzung)
  **Antwort:** Umleitung auf die Anmeldeseite; nach der Anmeldung wird der Auftrag mit derselben auftragsId erneut gesendet (BR-0005 verhindert die Doppelbuchung)
- [x] Das Anfrageschema schließt einen Betrag von 0 mit exclusiveMinimum aus, die 422-Antwort und BR-0004 sollen „Betrag nicht größer als 0“ aber mit dem A2-Text beantworten. Welcher Weg gilt beim Bestätigen für einen Betrag ≤ 0? (Aussage „Ein Betrag von 0 oder kleiner erreicht die 422-Antwort, weil das Anfrageschema 0“)
  **Antwort:** 422 mit dem A2-Text: exclusiveMinimum aus dem Anfrageschema entfernen, damit der Dienst den Betrag prüft
- [x] Welche gültige Empfänger-IBAN sollen die Szenarien verwenden?
  **Antwort:** DE89 3704 0044 0532 0130 00, eine gültige deutsche Beispiel-IBAN.
