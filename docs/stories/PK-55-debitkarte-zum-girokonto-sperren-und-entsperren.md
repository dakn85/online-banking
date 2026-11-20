# PK-55: Debitkarte zum Girokonto sperren und entsperren

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich die Debitkarte zu meinem Girokonto vorübergehend sperren und wieder entsperren und sie bei Verlust oder Diebstahl endgültig sperren, damit niemand meine Karte missbrauchen kann und ich die Sperre selbst verwalte.

## Nicht im Scope

- Ersatzkarte bestellen: Bei endgültiger Sperre bieten Banken oft eine Neubestellung an, die Idee verlangt sie aber nicht.
- Benachrichtigung per E-Mail, SMS oder Push: Die Idee nennt keine Benachrichtigung außerhalb der Maske.
- Automatische Entsperrung nach Zeit: Zeitgesteuerter Prozess, in der Idee nicht genannt.
- Sperre durch Bank oder Support: Administration, die Idee beschreibt nur Aktionen der Kundin.
- Auswirkung der Sperre auf Zahlungen und Überweisungen: Die Idee nennt nur die Sperre der Karte, nicht Folgen für Überweisungen oder Kartenzahlungen.
- Kartenlimits und Kartenumsätze: Weitere Kartenfunktionen, nicht Teil der Idee.
- Sperrhistorie oder Bericht: Nicht verlangt.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Demo-Testdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert, Use Cases neu |
| Debitkarte des Girokontos der angemeldeten Kundin abrufen | Neu | Endpunkt neu |
| Status der Debitkarte setzen: sperren, entsperren, endgültig sperren | Neu | Endpunkt neu |
| Debitkarte | Neu | Schema neu, Entität neu, Maske neu |
| Debitkartenauftrag | Neu | Schema neu |
| Architektur | Geändert | Querschnittliche Konzepte geändert |
| Konto | Geändert | Einschränkungen neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Use Case UC-018 neu, Aktion Debitkarte neu, Skizze geändert |
| UC-018 Debitkarte sperren und entsperren | Neu | Use Case neu |
| BR-0081 Zulässige Statuswechsel der Debitkarte | Neu | Neu in UC-018 |
| BR-0082 Debitkarte nur zum Girokonto der Kundin | Neu | Neu in UC-018 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/debitkarte.spec`: Die Debitkarte zeigt anfangs Kartennummer und Status aktiv
- `acceptance/specs/debitkarte.spec`: Die endgültige Sperre wird erst nach der Sicherheitsabfrage ausgeführt
- `acceptance/specs/debitkarte.spec`: Die Kundin entsperrt ihre vorübergehend gesperrte Debitkarte
- `acceptance/specs/debitkarte.spec`: Die Kundin sperrt ihre Debitkarte bei Verlust endgültig
- `acceptance/specs/debitkarte.spec`: Die Kundin sperrt ihre Debitkarte vorübergehend
- `acceptance/specs/debitkarte.spec`: Eine vorübergehend gesperrte Debitkarte lässt sich direkt endgültig sperren
- `acceptance/specs/debitkarte.spec`: GET Debitkarte 401: Der Abruf der Debitkarte ohne Anmeldung wird abgelehnt
- `acceptance/specs/debitkarte.spec`: GET Debitkarte 404: Zu einer Kreditkarte gibt es keine Debitkarte
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 200: Ein Sperrgrund beim vorübergehenden Sperren wird ignoriert
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 400: Die endgültige Sperre ohne Sperrgrund wird abgelehnt
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 401: Das Sperren der Debitkarte ohne Anmeldung wird abgelehnt
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 404: Eine Kreditkarte lässt sich nicht sperren
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 409: Eine aktive Debitkarte lässt sich nicht entsperren
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 409: Eine endgültig gesperrte Debitkarte lässt sich nicht entsperren
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 409: Eine vorübergehend gesperrte Debitkarte lässt sich nicht noch einmal sperren

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine (docs/architecture.md)
- **Konten und Finanzstatus / neues Modul `src/debitkarte.ts`** (ohne HTTP): Debitkarte je Kennung im Speicher (ADR-002), Ausgangsstand lena `**** 4821`, jonas `**** 7305`, Status aktiv, ohne Sperrgrund; Reset für die Demo-Gruppe in `testdaten.ts`.
- **Seitenauslieferung (`src/main.ts`)**: `GET` und `PUT /api/konten/{iban}/debitkarte` hinter `nurAngemeldet('api')`, Seite `/debitkarte`.
- **Oberfläche (`public/`)**: neue Seite `seiten/debitkarte.js`, Knopf „Debitkarte“ beim Girokonto im Finanzstatus.
- **Akzeptanztests**: die fehlenden Schritte in `StepImplementation.ts`.

## Schritte
1. Modul: Karte nur zu einem Girokonto der Kundin mit Karte (BR-0082, sonst 404). Prüfreihenfolge Sitzung 401, Konto 404, Format 400, Statuswechsel 409 (BR-0081, UC-018 A3/A4).
2. Statuswechsel nach BR-0081 mit den Meldungen je Status; der Sperrgrund wird nur bei Zielstatus „endgültig gesperrt“ geprüft und gespeichert, sonst ignoriert; bei 409 bleibt alles unverändert.
3. Endpunkte nach OpenAPI (Debitkarte, Debitkartenauftrag, Fehler als `{fehler}`).
4. Seite: Karte mit Status und Sperrgrund, Aktionen „Vorübergehend sperren“, „Entsperren“, „Endgültig sperren“ mit Auswahl (leere Vorauswahl, keine Vorabprüfung) und Sicherheitsabfrage „Bestätigen“/„Abbrechen“; Meldungen aus der Antwort des Dienstes (UC-018 Standardablauf, A1 bis A5).
5. Unit-Test WP-1 (BR-0081, BR-0082) in `test/debitkarte.test.ts`.
6. Schritte der 15 Szenarien implementieren; Prüfung der Statusseiten im Browser, 400/401/404/409 per HTTP.

## Rahmenänderung
Keine neue Bibliothek, kein neues Muster.

## Entscheidungen

- Woran erkennt die Kundin ihre Debitkarte in der Maske und im Datenmodell?
  **Antwort:** Maskierte Kartennummer (nur die letzten vier Stellen, z. B. „•••• 4821“) als Attribut der Debitkarte, dazu der Status.
  _→ eingearbeitet in vision, Konto, Debitkarte, UC-018, BR-0081, BR-0082, POST /api/test/reset, GET /api/konten/{iban}/debitkarte, PUT /api/konten/{iban}/debitkarte, Schema Debitkarte, Schema Debitkartenauftrag, debitkarte, finanzstatus, NFR-001, architektur · 72dd413_
- Was antwortet der Dienst, wenn die Kundin eine Aktion auslöst, die im aktuellen Status nicht möglich ist (z. B. Entsperren einer endgültig gesperrten Karte, Sperren einer schon gesperrten Karte)?
  **Antwort:** Immer Ablehnung mit 409 und einer Meldung zum Status; der Status bleibt unverändert, auch wenn das Ziel schon erreicht ist.
  _→ eingearbeitet in vision, Konto, Debitkarte, UC-018, BR-0081, BR-0082, POST /api/test/reset, GET /api/konten/{iban}/debitkarte, PUT /api/konten/{iban}/debitkarte, Schema Debitkarte, Schema Debitkartenauftrag, debitkarte, finanzstatus, NFR-001, architektur · 72dd413_
- Was geschieht bei PUT /api/konten/{iban}/debitkarte, wenn ein Sperrgrund mitgeschickt wird, der Zielstatus aber „aktiv“ oder „vorübergehend gesperrt“ ist?
  **Antwort:** Der Sperrgrund wird ignoriert und nicht gespeichert; die Antwort ist 200 oder bei unzulässigem Wechsel 409, die Debitkarte hat keinen Sperrgrund.
  _→ eingearbeitet in Debitkarte, PUT /api/konten/{iban}/debitkarte, Schema Debitkartenauftrag, UC-018, BR-0081 · d263edd_
