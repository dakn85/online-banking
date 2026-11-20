# PK-61: Persönliche Daten im Online-Banking anzeigen und ändern

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich meine Anschrift, E-Mail-Adresse und Telefonnummer im Online-Banking sehen und ändern, jede Änderung mit einer TAN (Mock) bestätigen und eine Bestätigungsnachricht im Postfach erhalten, damit meine Kontaktdaten bei der Bank aktuell sind und ich jede Änderung nachvollziehen kann.

## Nicht im Scope

Änderung des Namens, der Kennung oder der PIN. Postfach anzeigen, lesen oder löschen (PK-57). Benachrichtigung per E-Mail oder SMS. Echte TAN-Verfahren (SMS-TAN, pushTAN, Generator). Historie oder Protokoll der Datenänderungen. Prüfung der neuen E-Mail-Adresse oder Telefonnummer durch Bestätigungslink oder Code. Anschriften außerhalb Deutschlands.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos mit Saldo danach, neueste zuerst | Geändert | Beschreibung geändert |
| Demo-Testdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert, Use Cases geändert |
| Lastdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert |
| Lastschrift zurückgeben und Betrag gutschreiben | Entfällt | Endpunkt entfällt |
| Persönliche Daten der angemeldeten Kundin | Neu | Endpunkt neu |
| Persönliche Daten mit TAN ändern | Neu | Endpunkt neu |
| Postfachnachrichten der angemeldeten Kundin (nur Testbetrieb) | Neu | Endpunkt neu |
| Rueckgabe | Entfällt | Schema entfällt |
| Umsatz | Geändert | Eigenschaft umsatzId entfällt, Eigenschaft sepaLastschrift entfällt, Eigenschaft zurueckgegeben entfällt, Beschreibung geändert, Attribut umsatzId entfällt, Attribut sepaLastschrift entfällt, und 2 weitere |
| Kundendaten | Neu | Schema neu |
| Kundendatenauftrag | Neu | Schema neu |
| Architektur | Geändert | Einführung und Ziele geändert, Bausteinsicht geändert, Laufzeitsicht geändert, und 1 weitere |
| Kunde | Geändert | Attribut strasse neu, Attribut postleitzahl neu, Attribut ort neu, und 4 weitere |
| Nachricht | Geändert | Einschränkungen geändert |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Use Case UC-023 neu, Aktion Persönliche Daten neu, Skizze geändert |
| Persönliche Daten | Neu | Maske neu |
| UC-023 Persönliche Daten anzeigen und ändern | Neu | Use Case neu |
| BR-0096 TAN-Bestätigung (Mock) einer Datenänderung | Neu | Neu in UC-023 |
| BR-0097 Bestätigungsnachricht im Postfach | Neu | Neu in UC-023 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/persoenliche-daten.spec`: Das Ändern der persönlichen Daten ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Das Lesen der persönlichen Daten ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Das Lesen der Postfachnachrichten ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Die Bestätigungsnachricht kommt von der Aventa Bank und trägt das Datum der Änderung
- `acceptance/specs/persoenliche-daten.spec`: Die Kundin ändert ihre E-Mail-Adresse mit richtiger TAN
- `acceptance/specs/persoenliche-daten.spec`: Die Maske Persönliche Daten führt ohne Anmeldung auf die Anmeldeseite
- `acceptance/specs/persoenliche-daten.spec`: Die persönlichen Daten zeigen die gespeicherten Angaben
- `acceptance/specs/persoenliche-daten.spec`: Eine Änderung der Anschrift legt eine Bestätigungsnachricht im Postfach an
- `acceptance/specs/persoenliche-daten.spec`: Eine falsche TAN speichert nichts und legt keine Nachricht an
- `acceptance/specs/persoenliche-daten.spec`: Eine falsche TAN wird vom Dienst mit 422 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Eine Postleitzahl ohne 5 Ziffern wird abgelehnt
- `acceptance/specs/persoenliche-daten.spec`: Eine TAN ohne 6 Ziffern wird abgelehnt
- `acceptance/specs/persoenliche-daten.spec`: Eine ungültige Postleitzahl wird vom Dienst mit 400 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Mehrere geänderte Angaben ergeben genau eine Nachricht in fester Reihenfolge
- `acceptance/specs/persoenliche-daten.spec`: Ungültiges Feld und falsche TAN werden mit 400 beantwortet, die TAN wird erst danach geprüft
- `acceptance/specs/persoenliche-daten.spec`: Unveränderte Angaben legen keine Bestätigungsnachricht an

## Aufgaben für die Umsetzung

- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst: Beschreibung geändert
- [ ] Demo-Testdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Demo-Testdaten zurücksetzen (nur Testbetrieb): Use Cases geändert
- [ ] Lastdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Lastschrift zurückgeben und Betrag gutschreiben: Endpunkt entfällt
- [ ] Persönliche Daten der angemeldeten Kundin: Endpunkt neu
- [ ] Persönliche Daten mit TAN ändern: Endpunkt neu
- [ ] Postfachnachrichten der angemeldeten Kundin (nur Testbetrieb): Endpunkt neu
- [ ] Rueckgabe: Schema entfällt
- [ ] Umsatz: Eigenschaft umsatzId entfällt
- [ ] Umsatz: Eigenschaft sepaLastschrift entfällt
- [ ] Umsatz: Eigenschaft zurueckgegeben entfällt
- [ ] Kundendaten: Schema neu
- [ ] Kundendatenauftrag: Schema neu
- [ ] Architektur: Einführung und Ziele geändert
- [ ] Architektur: Bausteinsicht geändert
- [ ] Architektur: Laufzeitsicht geändert
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Kunde: Attribut strasse neu
- [ ] Kunde: Attribut postleitzahl neu
- [ ] Kunde: Attribut ort neu
- [ ] Kunde: Attribut email neu
- [ ] Kunde: Attribut telefonnummer neu
- [ ] Kunde: Attribut tan neu
- [ ] Kunde: Einschränkungen geändert
- [ ] Umsatz: Beschreibung geändert
- [ ] Umsatz: Attribut umsatzId entfällt
- [ ] Umsatz: Attribut sepaLastschrift entfällt
- [ ] Umsatz: Attribut zurueckgegeben entfällt
- [ ] Umsatz: Einschränkungen geändert
- [ ] Nachricht: Einschränkungen geändert
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Finanzstatus: Use Case UC-023 neu
- [ ] Finanzstatus: Aktion Persönliche Daten neu
- [ ] Finanzstatus: Skizze geändert
- [ ] Persönliche Daten: Maske neu
- [ ] UC-023: Use Case neu
- [ ] BR-0096: Neu in UC-023
- [ ] BR-0097: Neu in UC-023
- [ ] Vision: Zweck geändert
- [ ] Vision: Z-14 geändert
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-61 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-61 grün

## Entscheidungen

- Wie wird die Anschrift gespeichert und geprüft?
  **Antwort:** Strukturiert in vier Feldern: Straße mit Hausnummer, Postleitzahl (5 Ziffern), Ort, ohne Land; Anschrift nur in Deutschland.
  _→ eingearbeitet in Kunde, Postfachnachricht, UC-023, BR-0096, BR-0097, GET /api/kunde, PUT /api/kunde, GET /api/test/postfachnachrichten, Schema Kundendaten, Schema Kundendatenauftrag, Schema Postfachnachricht, persoenliche-daten, finanzstatus, NFR-001, vision, architektur · 5cc6839_
- Welche TAN (Mock) gilt für die Bestätigung einer Datenänderung?
  **Antwort:** Eine feste TAN für alle Kundinnen und alle Änderungen (6 Ziffern, zum Beispiel 123456), in der Regel dokumentiert.
  _→ eingearbeitet in Kunde, Postfachnachricht, UC-023, BR-0096, BR-0097, GET /api/kunde, PUT /api/kunde, GET /api/test/postfachnachrichten, Schema Kundendaten, Schema Kundendatenauftrag, Schema Postfachnachricht, persoenliche-daten, finanzstatus, NFR-001, vision, architektur · 5cc6839_
- Was nennt die Bestätigungsnachricht im Postfach von den geänderten Daten?
  **Antwort:** Nur, welche Angaben geändert wurden (zum Beispiel „Ihre E-Mail-Adresse wurde geändert.“), ohne Werte.
  _→ eingearbeitet in Kunde, Postfachnachricht, UC-023, BR-0096, BR-0097, GET /api/kunde, PUT /api/kunde, GET /api/test/postfachnachrichten, Schema Kundendaten, Schema Kundendatenauftrag, Schema Postfachnachricht, persoenliche-daten, finanzstatus, NFR-001, vision, architektur · 5cc6839_
- Wie verhält sich PK-61 zu PK-57 (Postfach: Nachrichten lesen und löschen), das ebenfalls Nachrichten im Postfach braucht?
  **Antwort:** PK-61 legt die Entität Postfachnachricht mit den nötigen Attributen an und prüft die Nachricht nur über den Testbetrieb; Lesen und Löschen bleiben bei PK-57.
  _→ eingearbeitet in Kunde, Postfachnachricht, UC-023, BR-0096, BR-0097, GET /api/kunde, PUT /api/kunde, GET /api/test/postfachnachrichten, Schema Kundendaten, Schema Kundendatenauftrag, Schema Postfachnachricht, persoenliche-daten, finanzstatus, NFR-001, vision, architektur · 5cc6839_
- Wie behandelt der Dienst Leerzeichen am Rand der Eingaben (Straße, Ort, E-Mail, Telefonnummer), und was gilt als „geändert“ für die Bestätigungsnachricht (BR-0097)?
  **Antwort:** Der Dienst entfernt führende und folgende Leerzeichen vor Prüfung, Speicherung und Vergleich. Nur Leerzeichen gilt als leer und ergibt 400 mit der Feldmeldung. Verglichen wird genau, auch Groß-/Kleinschreibung; eine reine Schreibweisenänderung der E-Mail-Adresse ist eine Änderung und löst die Nachricht aus.
  _→ noch nicht in der Spezifikation_
- Der Zweig story/pk-61 liegt 158 Commits hinter main. Das Mergen von origin/main ergibt Konflikte in docs/api/openapi.yaml, docs/architecture.md, docs/entity_model.md, docs/requirements.md, docs/ui/finanzstatus.html und docs/vision.md. Ich löse sie nicht selbst, weil docs/ nicht von mir geändert wird und der Kern ein fachlicher Widerspruch ist: PK-57 hat auf main bereits ein Postfach mit der Entität „Nachricht“ eingeführt (absender, betreff, text bis 2000 Zeichen, versendetAm als Datum, gelesen). PK-61 definiert daneben eine eigene Entität „Postfachnachricht“ (kein absender, text bis 500 Zeichen, erstelltAm als Zeitstempel) mit GET /api/test/postfachnachrichten. Beide beschreiben dieselbe Sache im Postfach. Wie soll die Bestätigungsnachricht (BR-0097) im Postfach modelliert werden?
  **Antwort:** Die Bestätigungsnachricht ist eine „Nachricht“ aus PK-57 (Absender „Aventa Bank“, versendetAm = Tag der Änderung); „Postfachnachricht“ und ihr Schema entfallen, die Testschnittstelle liest die Nachrichtenliste des Postfachs.
  _→ eingearbeitet in architektur, UC-023, BR-0097 · f669333_
