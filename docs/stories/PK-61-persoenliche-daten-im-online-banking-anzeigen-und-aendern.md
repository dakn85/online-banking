# PK-61: Persönliche Daten im Online-Banking anzeigen und ändern

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich meine Anschrift, E-Mail-Adresse und Telefonnummer im Online-Banking sehen und ändern, jede Änderung mit einer TAN (Mock) bestätigen und eine Bestätigungsnachricht im Postfach erhalten, damit meine Kontaktdaten bei der Bank aktuell sind und ich jede Änderung nachvollziehen kann.

## Nicht im Scope

Änderung des Namens, der Kennung oder der PIN. Postfach anzeigen, lesen oder löschen (PK-57). Benachrichtigung per E-Mail oder SMS. Echte TAN-Verfahren (SMS-TAN, pushTAN, Generator). Historie oder Protokoll der Datenänderungen. Prüfung der neuen E-Mail-Adresse oder Telefonnummer durch Bestätigungslink oder Code. Anschriften außerhalb Deutschlands.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Demo-Testdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert, Intern neu |
| Lastdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert, Intern neu |
| Persönliche Daten der angemeldeten Kundin | Neu | Endpunkt neu |
| Persönliche Daten mit TAN ändern | Neu | Endpunkt neu |
| Postfachnachrichten der angemeldeten Kundin (nur Testbetrieb) | Neu | Endpunkt neu |
| Kundendaten | Neu | Schema neu |
| Kundendatenauftrag | Neu | Schema neu |
| Postfachnachricht | Neu | Schema neu, Entität neu |
| Architektur | Geändert | Bausteinsicht geändert, Querschnittliche Konzepte geändert |
| Kunde | Geändert | Attribut strasse neu, Attribut postleitzahl neu, Attribut ort neu, und 4 weitere |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Use Case UC-023 neu, Aktion Persönliche Daten neu, Skizze geändert |
| Persönliche Daten | Neu | Maske neu |
| UC-023 Persönliche Daten anzeigen und ändern | Neu | Use Case neu |
| BR-0096 TAN-Bestätigung (Mock) einer Datenänderung | Neu | Neu in UC-023 |
| BR-0097 Bestätigungsnachricht im Postfach | Neu | Neu in UC-023 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/persoenliche-daten.spec`: Das Ändern der persönlichen Daten ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Das Lesen der persönlichen Daten ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Das Lesen der Postfachnachrichten ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Die Kundin ändert ihre E-Mail-Adresse mit richtiger TAN
- `acceptance/specs/persoenliche-daten.spec`: Die Maske Persönliche Daten führt ohne Anmeldung auf die Anmeldeseite
- `acceptance/specs/persoenliche-daten.spec`: Die persönlichen Daten zeigen die gespeicherten Angaben
- `acceptance/specs/persoenliche-daten.spec`: Eine Änderung der Anschrift legt eine Bestätigungsnachricht im Postfach an
- `acceptance/specs/persoenliche-daten.spec`: Eine falsche TAN speichert nichts und legt keine Nachricht an
- `acceptance/specs/persoenliche-daten.spec`: Eine falsche TAN wird vom Dienst mit 422 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Eine Postleitzahl ohne 5 Ziffern wird abgelehnt
- `acceptance/specs/persoenliche-daten.spec`: Eine TAN ohne 6 Ziffern wird abgelehnt
- `acceptance/specs/persoenliche-daten.spec`: Eine ungültige Postleitzahl wird vom Dienst mit 400 beantwortet
- `acceptance/specs/persoenliche-daten.spec`: Ungültiges Feld und falsche TAN werden mit 400 beantwortet, die TAN wird erst danach geprüft
- `acceptance/specs/persoenliche-daten.spec`: Unveränderte Angaben legen keine Bestätigungsnachricht an

## Aufgaben für die Umsetzung

- [ ] Demo-Testdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Demo-Testdaten zurücksetzen (nur Testbetrieb): Intern neu
- [ ] Lastdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Lastdaten zurücksetzen (nur Testbetrieb): Intern neu
- [ ] Persönliche Daten der angemeldeten Kundin: Endpunkt neu
- [ ] Persönliche Daten mit TAN ändern: Endpunkt neu
- [ ] Postfachnachrichten der angemeldeten Kundin (nur Testbetrieb): Endpunkt neu
- [ ] Kundendaten: Schema neu
- [ ] Kundendatenauftrag: Schema neu
- [ ] Postfachnachricht: Schema neu
- [ ] Architektur: Bausteinsicht geändert
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Kunde: Attribut strasse neu
- [ ] Kunde: Attribut postleitzahl neu
- [ ] Kunde: Attribut ort neu
- [ ] Kunde: Attribut email neu
- [ ] Kunde: Attribut telefonnummer neu
- [ ] Kunde: Attribut tan neu
- [ ] Kunde: Einschränkungen geändert
- [ ] Postfachnachricht: Entität neu
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
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung neu
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
