# PK-57: Postfach: Nachrichten der Bank lesen und löschen

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich die Nachrichten der Bank in einem Postfach lesen und löschen und in der Navigation sehen, wie viele ungelesen sind, damit ich keine Nachricht der Bank übersehe.

## Nicht im Scope

Nachrichten durch die Bank erstellen oder versenden: Die Idee nennt nur das Lesen, Markieren und Löschen durch die Kundin, nicht das Erzeugen der Nachrichten durch die Bank.
Antworten der Kundin an die Bank: Die Idee beschreibt nur Nachrichten der Bank an die Kundin, nicht die Gegenrichtung.
Als ungelesen zurücksetzen: Gefordert ist nur das Markieren als gelesen.
Benachrichtigung außerhalb des Online-Bankings (E-Mail, Push): Die Idee nennt nur die Zahl in der Navigation.
Suche, Filter, Archiv und Anhänge im Postfach: Nicht gefordert; übliche Erweiterung eines Postfachs.
Automatisches Löschen oder Aufbewahrungsfristen: Ein zeitgesteuerter Prozess ist nicht gefordert.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Zustand nur im Speicher, Ausgangsstand über den Test-Reset | Geändert | Entscheidung geändert |
| Demo-Testdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert, Use Cases neu |
| Lastdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert, Intern neu |
| Nachrichten der angemeldeten Kundin mit Zahl ungelesener | Neu | Endpunkt neu |
| Nachricht öffnen und als gelesen markieren | Neu | Endpunkt neu |
| Nachricht löschen | Neu | Endpunkt neu |
| Nachricht | Neu | Schema neu, Entität neu |
| Nachrichtenliste | Neu | Schema neu |
| Architektur | Geändert | Querschnittliche Konzepte geändert |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Empfängervorlagen | Geändert | Skizze geändert |
| Finanzstatus | Geändert | Skizze geändert |
| Postfach | Neu | Maske neu |
| Tageslimit | Geändert | Skizze geändert |
| Überweisung bestätigen | Geändert | Skizze geändert |
| Überweisung | Geändert | Skizze geändert |
| Umsätze | Geändert | Skizze geändert |
| UC-020 Postfach der Bank lesen und verwalten | Neu | Use Case neu |
| BR-0085 Nachrichten der angemeldeten Kundin | Neu | Neu in UC-020 |
| BR-0086 Zahl ungelesener Nachrichten | Neu | Neu in UC-020 |
| BR-0087 Lesestatus beim Öffnen | Neu | Neu in UC-020 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/postfach.spec`: Das erneute Öffnen einer gelesenen Nachricht ändert nichts
- `acceptance/specs/postfach.spec`: Das Postfach zeigt die Nachrichten der Kundin, neueste zuerst
- `acceptance/specs/postfach.spec`: Das Postfach zeigt nur die Nachrichten der angemeldeten Kundin
- `acceptance/specs/postfach.spec`: DELETE /api/nachrichten/{nachrichtId} mit unbekannter Kennung antwortet mit 404
- `acceptance/specs/postfach.spec`: DELETE /api/nachrichten/{nachrichtId} mit ungültiger Kennung antwortet mit 400
- `acceptance/specs/postfach.spec`: DELETE /api/nachrichten/{nachrichtId} ohne Anmeldung antwortet mit 401
- `acceptance/specs/postfach.spec`: Die Navigation zeigt die Zahl ungelesener Nachrichten auch auf Überweisung und Umsätzen
- `acceptance/specs/postfach.spec`: Die Zahl ungelesener Nachrichten in der Navigation sinkt beim Öffnen
- `acceptance/specs/postfach.spec`: Eine gelöschte Nachricht erscheint nicht mehr und zählt nicht als ungelesen
- `acceptance/specs/postfach.spec`: Eine Nachricht bleibt, wenn die Kundin die Sicherheitsabfrage verneint
- `acceptance/specs/postfach.spec`: Eine ungelesene Nachricht gilt nach dem Öffnen als gelesen
- `acceptance/specs/postfach.spec`: GET /api/nachrichten ohne Anmeldung antwortet mit 401
- `acceptance/specs/postfach.spec`: Ohne Anmeldung ist das Postfach nicht erreichbar
- `acceptance/specs/postfach.spec`: Ohne Nachricht zeigt das Postfach einen Hinweis und die Navigation keine Zahl
- `acceptance/specs/postfach.spec`: Ohne ungelesene Nachricht zeigt die Navigation keine Zahl
- `acceptance/specs/postfach.spec`: PATCH /api/nachrichten/{nachrichtId} mit unbekannter Kennung antwortet mit 404
- `acceptance/specs/postfach.spec`: PATCH /api/nachrichten/{nachrichtId} mit ungültiger Kennung antwortet mit 400
- `acceptance/specs/postfach.spec`: PATCH /api/nachrichten/{nachrichtId} ohne Anmeldung antwortet mit 401

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine (docs/architecture.md)
- Dienst (`src/`): neues Modul `nachrichten.ts` mit Speicher je Kundin (ADR-002), Ausgangsstand und Reset; Routen in `src/main.ts`; Anbindung an `testdaten.ts` (Demo-Reset setzt Nachrichten zurück, Lastkunden haben keine).
- Oberfläche (`public/`): neue Seite `seiten/postfach.js` (Maske postfach), Navigationseintrag „Postfach“ mit Zahl ungelesener Nachrichten in `app.html`/`app.js` für jede angemeldete Seite; Seitenroute `/postfach` mit Sitzungsschutz.
- Akzeptanztests: fehlende Schritte in `acceptance/tests/StepImplementation.ts`; Szenarien unverändert.

## Schritte
1. GET /api/nachrichten: Nachrichten der Kundin, neueste zuerst, mit `anzahlUngelesen` (UC-020, BR-0085, BR-0086); ohne Sitzung 401 (NFR-001).
2. PATCH /api/nachrichten/{id}: Öffnen setzt `gelesen` auf true, idempotent, 200 (BR-0087); Kennung nicht 1..36 Zeichen → 400, unbekannt oder fremd → 404 (BR-0085).
3. DELETE /api/nachrichten/{id}: endgültig löschen, 204, gleiche Fehlerfälle (BR-0085, BR-0086).
4. Ausgangsstand: Lena drei Nachrichten (zwei ungelesen), Jonas eine gelesene; Demo-Reset stellt sie wieder her (ADR-002, UC-020 Notizen).
5. Seite Postfach mit Tabelle, Auswahl „Nachricht zum Öffnen“/„zum Löschen“, Text, Sicherheitsabfrage „Nachricht löschen?“, Meldungen „Nachricht gelöscht.“ und „Keine Nachrichten.“ (UC-020 A1, A2, A6).
6. Navigation lädt die Zahl über GET /api/nachrichten und zeigt sie nur ab 1 (BR-0086).
7. Unit-Tests für WP-1 (BR-0085) in `test/nachrichten.test.ts`.

## Rahmenänderung
Keine neuen Bibliotheken oder Muster.

## Entscheidungen

- Wann gilt eine Nachricht als gelesen: sobald die Kundin sie öffnet, oder erst, wenn sie die Nachricht ausdrücklich als gelesen markiert?
  **Antwort:** Automatisch beim Öffnen: Die Kundin öffnet die Nachricht, der Dienst setzt den Lesestatus auf gelesen, eine eigene Aktion gibt es nicht.
  _→ eingearbeitet in vision, Nachricht, UC-020, BR-0085, BR-0086, BR-0087, POST /api/test/reset, GET /api/nachrichten, PATCH /api/nachrichten/{nachrichtId}, DELETE /api/nachrichten/{nachrichtId}, Schema Nachricht, Schema Nachrichtenliste, postfach, finanzstatus, empfaengervorlagen, NFR-001, ADR-002, architektur · c456f2f_
- Was zeigt die Navigation, wenn die Kundin keine ungelesene Nachricht hat?
  **Antwort:** Nur der Eintrag „Postfach“ ohne Zahl; die Zahl erscheint erst ab 1 ungelesenen Nachricht.
  _→ eingearbeitet in vision, Nachricht, UC-020, BR-0085, BR-0086, BR-0087, POST /api/test/reset, GET /api/nachrichten, PATCH /api/nachrichten/{nachrichtId}, DELETE /api/nachrichten/{nachrichtId}, Schema Nachricht, Schema Nachrichtenliste, postfach, finanzstatus, empfaengervorlagen, NFR-001, ADR-002, architektur · c456f2f_
- Der Use Case verlangt den Eintrag „Postfach“ mit der Zahl ungelesener Nachrichten in der Navigation „jeder angemeldeten Seite“. Die Skizzen zeigen ihn nur auf Finanzstatus, Empfängervorlagen und Postfach. Auf welchen Seiten erscheint der Eintrag mit der Zahl? (GET /api/nachrichten, anzahlUngelesen)
  **Antwort:** Auf jeder angemeldeten Seite, auch Überweisung, Überweisung bestätigen, Umsätze und Tageslimit: Skizzen dieser Seiten ergänzen, UC-020 Schritt 1 bleibt.
  _→ eingearbeitet in UC-020, postfach, umsaetze, ueberweisung-bestaetigen · 71560c8_
- Was zeigt das Postfach, wenn die Kundin keine Nachricht (mehr) hat, etwa nach dem Löschen der letzten, und wie verhalten sich dann „Öffnen“ und „Löschen“?
  **Antwort:** Die Tabelle zeigt statt Zeilen den Hinweis „Keine Nachrichten.“, die Zahl ungelesener steht auf 0, die Auswahllisten sind leer und „Öffnen“ und „Löschen“ sind nicht auswählbar; ein vorher angezeigter Text wird geleert.
  _→ eingearbeitet in UC-020, postfach, umsaetze, ueberweisung-bestaetigen · 71560c8_
