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

## Akzeptanztests

- `acceptance/specs/tageslimit.spec`: Das Tageslimit ist ohne Anmeldung nicht erreichbar
- `acceptance/specs/tageslimit.spec`: Das Tageslimit zeigt anfangs das Standardlimit
- `acceptance/specs/tageslimit.spec`: Die Kundin hebt ihr gesenktes Tageslimit bis zum Standardlimit an
- `acceptance/specs/tageslimit.spec`: Die Kundin senkt ihr Tageslimit
- `acceptance/specs/tageslimit.spec`: Ein Tageslimit über dem Standardlimit wird abgelehnt

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-19_

**Bausteine:** Online-Banking-Dienst (`src/`), Component „Anmeldung und Sitzung“ (Zugriffsschutz), neue fachliche Component „Tageslimit“ (`src/tageslimit.ts`, ohne HTTP), Seitenauslieferung (`src/main.ts`), Testbetrieb (`src/testdaten.ts`), Oberfläche im Browser (`public/seiten/tageslimit.js`, Rahmen `public/app.html`, Seiten Finanzstatus und Überweisung).

**Schritte**
1. `src/tageslimit.ts`: Tageslimit je Kennung im Speicher (ADR-002), Standardlimit 5.000,00 EUR für alle gleich; `lesen(kennung)` liefert `{tageslimit, standardlimit}`, `setzen(kennung, wert)` prüft Zahl, 0 bis Standardlimit, höchstens zwei Nachkommastellen über Cent (ADR-005) und lehnt sonst mit 400 „Das Tageslimit muss zwischen 0,00 EUR und 5.000,00 EUR liegen.“ ab (UC-015 Schritt 4, A1, BR-0070). `zuruecksetzen(auswahl)` setzt auf das Standardlimit.
2. `src/main.ts`: `GET /api/tageslimit` und `PUT /api/tageslimit` hinter `nurAngemeldet('api')`, nur für die Kundin aus der Sitzung (BR-0070, NFR-001, UC-015 A2); Seite `/tageslimit` hinter `nurAngemeldet('seite')`.
3. `src/testdaten.ts`: Demo-Reset und Last-Reset setzen das Tageslimit ihrer Gruppe zurück (POST /api/test/reset, POST /api/test/lasttest/reset, BR-0070).
4. Oberfläche: Seite `/tageslimit` nach Maske tageslimit (Kennzahlen „Aktuelles Tageslimit“, „Standardlimit“, Formular „Tageslimit ändern“ mit „Neues Tageslimit in Euro“ und „Speichern“, Meldungen status/alert); Eingabe im deutschen Format wie bei der Überweisung, Vorprüfung im Browser, maßgeblich der Dienst (ADR-004) (UC-015 Schritte 2 bis 5, A1). Aktion „Tageslimit“ im Finanzstatus und in der Überweisung sowie in der Navigation (UC-015 Schritt 1).
5. Unit-Tests `test/tageslimit.test.ts` zu BR-0070 und Kunde.tageslimit; Gauge-Steps für `acceptance/specs/tageslimit.spec`.

**Rahmen:** keine neue Bibliothek, kein neues Muster. Die Tageslimit-Prüfung bei der Überweisung (PK-12) ist auf main nicht umgesetzt; `src/tageslimit.ts` bietet das Limit je Kundin für sie an (siehe Rückmeldung).

## Entscheidungen

- Wie verhält sich PK-46 zu PK-12 („Tageslimit von 5.000 EUR je Kalendertag beim Überweisen“, ready), das die Tageslimit-Prüfung in UC-002 und der Maske ueberweisung schon einführt?
  **Antwort:** PK-46 baut auf PK-12 auf: Standardlimit ist 5.000 EUR je Kalendertag für alle Kundinnen, Prüfung und Meldung kommen aus PK-12, PK-46 ersetzt nur die feste Grenze durch das von der Kundin gesetzte Limit.
  _→ eingearbeitet in UC-015, BR-0070, UC-002, Kunde, POST /api/test/reset, POST /api/test/lasttest/reset, GET /api/tageslimit, PUT /api/tageslimit, Schema Tageslimit, Schema Tageslimitauftrag, tageslimit, finanzstatus, ueberweisung, NFR-001, architektur, vision · 5078028_
- Welchen kleinsten Wert darf die Kundin als Tageslimit setzen?
  **Antwort:** 0 EUR ist erlaubt: das Limit 0 sperrt alle Überweisungen der Kundin.
  _→ eingearbeitet in UC-015, BR-0070, UC-002, Kunde, POST /api/test/reset, POST /api/test/lasttest/reset, GET /api/tageslimit, PUT /api/tageslimit, Schema Tageslimit, Schema Tageslimitauftrag, tageslimit, finanzstatus, ueberweisung, NFR-001, architektur, vision · 5078028_
