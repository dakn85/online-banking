# PK-76: Seitengröße der Umsatzliste nach oben begrenzen

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Betreiberin des Online-Bankings möchte ich, dass ein Abruf der Umsatzliste höchstens 100 Umsätze je Seite liefert, damit ein einzelner Abruf nicht beliebig viele Umsätze auf einmal lädt.

## Nicht im Scope

Konfigurierbare Seitengröße: Die Idee nennt nur eine Obergrenze, keine Einstellung dafür.
Cursor-basierte Pagination: Die Idee verlangt nur die Begrenzung der Seitengröße, keinen Wechsel des Paginierungsverfahrens.
Anpassung des CSV-Exports: Der Export ist ein eigener Abruf und nicht Teil der Umsatzliste-Seite.
Warnung oder Hinweis an den Nutzer bei Erreichen der Obergrenze: Die Idee nennt keine Meldung an den Kunden.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl | Geändert | Beschreibung geändert, Parameter seitengroesse (query) geändert |
| Umsätze | Geändert | Skizze geändert |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Notizen geändert, A14 neu: Seitengröße über der Obergrenze, BR-0105 geändert |
| BR-0105 Seitenweise Ausgabe der Umsatzliste mit Gesamtzahl | Geändert | Text geändert |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Die Umsätze eines Kontos sind ohne Anmeldung nicht erreichbar
- `acceptance/specs/umsaetze.spec`: Eine angefragte Seitengröße über der Obergrenze liefert höchstens 100 Umsätze je Seite
- `acceptance/specs/umsaetze.spec`: Mehr als 20 Treffer blättern auf Seite 1 mit 20 Umsätzen und Seite 2 mit dem Rest, beide mit der Gesamtzahl

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-24_

**Bausteine:** Online-Banking-Dienst, Modul Umsätze (`src/umsaetze.ts`, Auswertung der Abfrage für GET /api/konten/{iban}/umsaetze); Akzeptanztest-Steps (`acceptance/tests/StepImplementation.ts`). Oberfläche (`public/`) bleibt unverändert, die Maske schickt weiter 20.

**Schritte:**
1. `src/umsaetze.ts`: neue Konstante `SEITENGROESSE_MAX = 100`; `seiteAus` begrenzt eine gültige angefragte Seitengröße mit `Math.min` auf 100, ohne Fehler und ohne Meldung (BR-0105, UC-003 A14). Ungültige Werte (0, negativ, keine ganze Zahl) bleiben 400 wie bisher. `trefferseite` bleibt unverändert, Reihenfolge nach BR-0008 und `gesamt` über alle Treffer bleiben unberührt.
2. Unit-Test in `test/umsaetze.test.ts` (BR-0105, UC-003 A14): seitengroesse 1000 und 101 ergeben 100, 100 bleibt 100. An den 200 Umsätzen eines Lastkunden liefert Seite 1 genau 100 Umsätze und Seite 2 die nächsten 100, `gesamt` ist 200.
3. Fehlender Step „Die angemeldete Kundin ruft die Umsätze des Kontos <konto> mit dem Parameter <name> <wert> ab und erhält höchstens <anzahl> Umsätze“: ruft die API mit der Sitzung der Seite auf und prüft Status 200, höchstens `<anzahl>` Umsätze und `gesamt` über der Anzahl. So ist belegt, dass die Grenze greift.

**Rahmenänderung:** keine (keine neue Bibliothek, kein neues Muster).

## Entscheidungen

- Wie hoch ist die feste Obergrenze der Seitengröße im Abruf der Umsatzliste?
  **Antwort:** 100 Umsätze je Seite; größerer Kopfraum für andere Aufrufer, die Maske bleibt bei 20
  _→ eingearbeitet in UC-003, BR-0105, GET /api/konten/{iban}/umsaetze, umsaetze · 5186ffa_
- Wie soll der Befund „Der neue Test zur Obergrenze erreicht die Begrenzung nie: kein Konto hat mehr als 100 Umsätze“ gelöst werden?
  **Antwort:** Die Demo-Konten der anderen Szenarien bleiben unverändert; die zusätzlichen Umsätze nur für dieses Szenario.
  _→ eingearbeitet in UC-003 · 8a81f12_
