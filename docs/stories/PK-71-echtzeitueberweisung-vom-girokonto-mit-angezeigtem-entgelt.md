# PK-71: Echtzeitüberweisung vom Girokonto mit angezeigtem Entgelt

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich bei der Überweisung vom Girokonto die Ausführungsart „Echtzeit“ wählen und das anfallende Entgelt vor dem Absenden sehen, damit der Betrag in Sekunden beim Empfänger ist und ich die Kosten vorher kenne.

## Nicht im Scope

Echtzeit bei Terminüberweisung und Dauerauftrag: Die Idee nennt nur die Überweisung vom Girokonto; Echtzeit zu einem späteren Termin ist ein eigener Fall.
Echtzeit bei Umbuchung zwischen eigenen Konten: Nicht gefordert; die Umbuchung ist ein eigener Ablauf.
Entgeltverwaltung, Entgelttabelle oder Entgeltänderung durch die Bank: Die Idee nennt kein Pflegen der Höhe des Entgelts; die Höhe wird als feste Vorgabe behandelt.
Benachrichtigung im Postfach über die Echtzeitüberweisung: Nicht gefordert.
Echtzeit-Empfang, Empfängerprüfung (Verification of Payee) und Erreichbarkeitsprüfung der Empfängerbank: Nicht gefordert; Constraint C-001 sieht Demo-Konten statt Kernbank vor.
Eigenes Limit für Echtzeitüberweisungen: Die Idee nennt kein eigenes Limit; es gelten die bestehenden Grenzen.
Auswertung der Entgelte (z. B. Entgeltübersicht oder Ausgabenanalyse): Nicht gefordert.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Überweisung vom Girokonto ausführen | Geändert | Beschreibung geändert, Antwort 201 geändert, Antwort 400 geändert, und 1 weitere |
| Ueberweisung | Geändert | Eigenschaft ausfuehrungsart neu, Eigenschaft entgelt neu |
| Ueberweisungsauftrag | Geändert | Eigenschaft betrag geändert, Eigenschaft ausfuehrungsart neu, Eigenschaft ausfuehrungstag neu |
| Architektur | Geändert | Bausteinsicht geändert |
| Überweisung | Geändert | Beschreibung geändert, Attribut ausfuehrungsart neu, Attribut entgelt neu, Feld Betrag in Euro geändert, Feld Ausführungsart neu, Feld Entgelt neu, und 1 weitere |
| Finanzstatus | Geändert | Skizze geändert |
| Überweisung bestätigen | Geändert | Feld Ausführungsart neu, Feld Entgelt neu, Feld Gesamtbetrag neu, und 1 weitere |
| UC-002 Überweisung vom Girokonto | Geändert | A2 geändert, A3 geändert, A13 neu: Echtzeitüberweisung mit Entgeltanzeige vor dem Absenden, und 7 weitere |
| BR-0004 Betragsgrenze des Girokontos | Geändert | Text geändert |
| BR-0006 Saldo nach der Überweisung | Geändert | Text geändert |
| BR-0012 Umsatz einer ausgeführten Überweisung | Geändert | Text geändert |
| BR-0099 Entgelt der Echtzeitüberweisung | Neu | Neu in UC-002 |
| BR-0100 Ausführungsart der Überweisung | Neu | Neu in UC-002 |
| Vision | Geändert | Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/echtzeitueberweisung.spec`: Das Tageslimit von 0,00 € lehnt auch eine Echtzeitüberweisung mit 422 ab
- `acceptance/specs/echtzeitueberweisung.spec`: Die Zusammenfassung zeigt bei Echtzeit Entgelt und Gesamtbetrag vor dem Absenden
- `acceptance/specs/echtzeitueberweisung.spec`: Echtzeit zusammen mit einem Ausführungstag wird mit 422 und Meldung abgelehnt
- `acceptance/specs/echtzeitueberweisung.spec`: Ein Betrag, der mit dem Entgelt den verfügbaren Betrag übersteigt, wird bei Echtzeit abgelehnt und keine Zusammenfassung gezeigt
- `acceptance/specs/echtzeitueberweisung.spec`: Ein doppelter Klick auf Bestätigen belastet das Entgelt nur einmal
- `acceptance/specs/echtzeitueberweisung.spec`: Eine Echtzeitüberweisung belastet Betrag und Entgelt und meldet beide
- `acceptance/specs/echtzeitueberweisung.spec`: Eine Echtzeitüberweisung erzeugt einen Umsatz über den Betrag und einen über das Entgelt

## Aufgaben für die Umsetzung

- [ ] Überweisung vom Girokonto ausführen: Beschreibung geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 201 geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 400 geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 422 geändert
- [ ] Ueberweisung: Eigenschaft ausfuehrungsart neu
- [ ] Ueberweisung: Eigenschaft entgelt neu
- [ ] Ueberweisungsauftrag: Eigenschaft betrag geändert
- [ ] Ueberweisungsauftrag: Eigenschaft ausfuehrungsart neu
- [ ] Ueberweisungsauftrag: Eigenschaft ausfuehrungstag neu
- [ ] Architektur: Bausteinsicht geändert
- [ ] Überweisung: Beschreibung geändert
- [ ] Überweisung: Attribut ausfuehrungsart neu
- [ ] Überweisung: Attribut entgelt neu
- [ ] Finanzstatus: Skizze geändert
- [ ] Überweisung bestätigen: Feld Ausführungsart neu
- [ ] Überweisung bestätigen: Feld Entgelt neu
- [ ] Überweisung bestätigen: Feld Gesamtbetrag neu
- [ ] Überweisung bestätigen: Skizze geändert
- [ ] Überweisung: Feld Betrag in Euro geändert
- [ ] Überweisung: Feld Ausführungsart neu
- [ ] Überweisung: Feld Entgelt neu
- [ ] Überweisung: Feld Gesamtbetrag der Belastung neu
- [ ] UC-002: A2 geändert
- [ ] UC-002: A3 geändert
- [ ] UC-002: A13 neu: Echtzeitüberweisung mit Entgeltanzeige vor dem Absenden
- [ ] UC-002: A14 neu: Echtzeit zusammen mit Ausführungstag
- [ ] UC-002: Erfolg 5 neu
- [ ] UC-002: BR-0004 geändert
- [ ] UC-002: BR-0006 geändert
- [ ] UC-002: BR-0012 geändert
- [ ] UC-002: BR-0099 neu: Entgelt der Echtzeitüberweisung
- [ ] UC-002: BR-0100 neu: Ausführungsart der Überweisung
- [ ] BR-0004: Text geändert
- [ ] BR-0006: Text geändert
- [ ] BR-0012: Text geändert
- [ ] BR-0099: Neu in UC-002
- [ ] BR-0100: Neu in UC-002
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-71 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-71 grün

## Entscheidungen

- Wie hoch ist das Entgelt einer Echtzeitüberweisung und wie wird es bestimmt?
  **Antwort:** Fester Betrag je Echtzeitüberweisung, unabhängig vom Überweisungsbetrag: 0,50 €
  _→ eingearbeitet in Überweisung, UC-002, BR-0004, BR-0006, BR-0012, BR-0099, BR-0100, POST /api/ueberweisungen, Schema Ueberweisung, Schema Ueberweisungsauftrag, ueberweisung, ueberweisung-bestaetigen, finanzstatus, vision, architektur_
- Wie erscheint das Entgelt in den Umsätzen des Girokontos?
  **Antwort:** Zwei Umsätze: einer über den Überweisungsbetrag mit dem Empfänger, ein eigener über das Entgelt
  _→ eingearbeitet in Überweisung, UC-002, BR-0004, BR-0006, BR-0012, BR-0099, BR-0100, POST /api/ueberweisungen, Schema Ueberweisung, Schema Ueberweisungsauftrag, ueberweisung, ueberweisung-bestaetigen, finanzstatus, vision, architektur_
- Was geschieht, wenn die Kundin „Echtzeit“ wählt und zugleich einen Ausführungstag einträgt?
  **Antwort:** Die Maske sperrt den Ausführungstag, solange „Echtzeit“ gewählt ist; der Dienst lehnt die Kombination mit 422 und einer Meldung ab
  _→ eingearbeitet in Überweisung, UC-002, BR-0004, BR-0006, BR-0012, BR-0099, BR-0100, POST /api/ueberweisungen, Schema Ueberweisung, Schema Ueberweisungsauftrag, ueberweisung, ueberweisung-bestaetigen, finanzstatus, vision, architektur_
