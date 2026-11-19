# PK-46: Tageslimit für Überweisungen selbst senken und wieder anheben

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich mein Tageslimit für Überweisungen selbst senken und später wieder bis zum Standardlimit anheben, damit ich meine Überweisungen je Kalendertag selbst begrenzen kann.

## Nicht im Scope

- Limit über das Standardlimit hinaus erhöhen: Die Idee erlaubt das Anheben nur bis zum Standardlimit.
- Freigabe/Bestätigung per TAN oder zweitem Faktor bei Limitänderung: Wird in der Idee nicht verlangt.
- Benachrichtigung der Kundin über Limitänderung: Keine Benachrichtigung in der Idee genannt.
- Verwaltung der Standardlimits durch die Bank: Das Standardlimit wird als gegeben angenommen, Administration ist nicht gefordert.
- Historie / Protokoll der Limitänderungen: Nicht gefordert; Bericht bzw. Audit gehört nicht zur Idee.
- Zeitlich befristetes Limit oder automatisches Zurücksetzen: Kein Hintergrundprozess in der Idee genannt.
- Limit je Konto oder je Empfänger: Die Idee spricht nur von einem Tageslimit der Kundin.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Demo-Testdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert |
| Lastdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert |
| Tageslimit der angemeldeten Kundin | Neu | Endpunkt neu |
| Tageslimit der angemeldeten Kundin setzen | Neu | Endpunkt neu |
| Tageslimit | Neu | Schema neu, Maske neu |
| Tageslimitauftrag | Neu | Schema neu |
| Architektur | Geändert | Querschnittliche Konzepte geändert |
| Kunde | Geändert | Attribut tageslimit neu, Attribut standardlimit neu, Einschränkungen neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Use Case UC-015 neu, Aktion Tageslimit neu, Skizze geändert |
| Überweisung | Geändert | Use Case UC-015 neu, Aktion Tageslimit neu, Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | Notizen geändert |
| UC-015 Tageslimit für Überweisungen festlegen | Neu | Use Case neu |
| BR-0070 Tageslimit der Kundin | Neu | Neu in UC-015 |
| Vision | Geändert | Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/tageslimit.spec`: Das Tageslimit ist ohne Anmeldung nicht erreichbar
- `acceptance/specs/tageslimit.spec`: Das Tageslimit zeigt anfangs das Standardlimit
- `acceptance/specs/tageslimit.spec`: Die Kundin hebt ihr gesenktes Tageslimit bis zum Standardlimit an
- `acceptance/specs/tageslimit.spec`: Die Kundin senkt ihr Tageslimit
- `acceptance/specs/tageslimit.spec`: Ein Tageslimit über dem Standardlimit wird abgelehnt

## Aufgaben für die Umsetzung

- [ ] Demo-Testdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Lastdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Tageslimit der angemeldeten Kundin: Endpunkt neu
- [ ] Tageslimit der angemeldeten Kundin setzen: Endpunkt neu
- [ ] Tageslimit: Schema neu
- [ ] Tageslimitauftrag: Schema neu
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Kunde: Attribut tageslimit neu
- [ ] Kunde: Attribut standardlimit neu
- [ ] Kunde: Einschränkungen neu
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Finanzstatus: Use Case UC-015 neu
- [ ] Finanzstatus: Aktion Tageslimit neu
- [ ] Finanzstatus: Skizze geändert
- [ ] Tageslimit: Maske neu
- [ ] Überweisung: Use Case UC-015 neu
- [ ] Überweisung: Aktion Tageslimit neu
- [ ] Überweisung: Skizze geändert
- [ ] UC-002: Notizen geändert
- [ ] UC-015: Use Case neu
- [ ] BR-0070: Neu in UC-015
- [ ] Vision: Abgrenzung neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-46 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-46 grün

## Entscheidungen

- Wie verhält sich PK-46 zu PK-12 („Tageslimit von 5.000 EUR je Kalendertag beim Überweisen“, ready), das die Tageslimit-Prüfung in UC-002 und der Maske ueberweisung schon einführt?
  **Antwort:** PK-46 baut auf PK-12 auf: Standardlimit ist 5.000 EUR je Kalendertag für alle Kundinnen, Prüfung und Meldung kommen aus PK-12, PK-46 ersetzt nur die feste Grenze durch das von der Kundin gesetzte Limit.
  _→ eingearbeitet in UC-015, BR-0070, UC-002, Kunde, POST /api/test/reset, POST /api/test/lasttest/reset, GET /api/tageslimit, PUT /api/tageslimit, Schema Tageslimit, Schema Tageslimitauftrag, tageslimit, finanzstatus, ueberweisung, NFR-001, architektur, vision · 5078028_
- Welchen kleinsten Wert darf die Kundin als Tageslimit setzen?
  **Antwort:** 0 EUR ist erlaubt: das Limit 0 sperrt alle Überweisungen der Kundin.
  _→ eingearbeitet in UC-015, BR-0070, UC-002, Kunde, POST /api/test/reset, POST /api/test/lasttest/reset, GET /api/tageslimit, PUT /api/tageslimit, Schema Tageslimit, Schema Tageslimitauftrag, tageslimit, finanzstatus, ueberweisung, NFR-001, architektur, vision · 5078028_
