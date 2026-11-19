# PK-47: Buchungstag in der Umsatzliste als TT.MM.JJJJ anzeigen

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich in der Umsatzliste den Buchungstag als 19.11.2026 statt als 2026-11-19 sehen, damit ich das Datum so lese wie überall im Online-Banking.

## Nicht im Scope

Datumsformat in anderen Masken (z. B. Finanzstatus, Überweisung bestätigen): Die Idee nennt nur die Umsatzliste. Änderung des Datumsformats in der API: Die Schnittstelle liefert das Datum weiter wie bisher, nur die Anzeige ändert sich. Format der Zeitraum-Eingabe im Filter: Die Idee betrifft nur die Anzeige des Buchungstags, nicht die Eingabe des Zeitraums (BR-0010). Sortierung oder Berechnung des Saldos: Reihenfolge und Saldo danach (BR-0008) bleiben unverändert.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsatz | Geändert | Attribut buchungstag neu |
| Umsätze | Geändert | Skizze geändert |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Die Umsatzliste zeigt den Buchungstag als TT.MM.JJJJ

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-19_

## Bausteine
- Oberfläche im Browser (`public/seiten/umsaetze.js`): keine Änderung nötig.
- Online-Banking-Dienst (`src/`): keine Änderung; die API liefert `buchungstag` weiter als ISO-Datum (out of scope).

## Befund
Die Umsatzliste formatiert den Buchungstag schon seit PK-6 (Commit d3d8216) als TT.MM.JJJJ: `public/seiten/umsaetze.js:4` (`datum()` mit `toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'}, UTC)`), angewendet in Zeile 52. Die Story bringt die Spezifikation (Attribut Umsatz.buchungstag, Skizze in docs/ui/umsaetze.html) auf den Stand der Umsetzung.

## Schritte
1. UC-003 Schritt 5 / Umsatz.buchungstag: Anzeige TT.MM.JJJJ ist umgesetzt, Formatierung in UTC, damit sich der Tag nicht durch die Zeitzone des Browsers verschiebt. Filter (BR-0010), Sortierung und Saldo danach (BR-0008) bleiben unverändert.
2. Akzeptanztest „Die Umsatzliste zeigt den Buchungstag als TT.MM.JJJJ“: Der Step „Die Umsätze zeigen die Zeilen <tabelle>“ ist vorhanden und liest die Spalte „Buchungstag“ über die Kopfzeile.
3. Weil die Story keinen Produktcode ändert, wird sie in der Stufe Entwicklung auf der Plattform geprüft (start_acceptance_tests).

## Änderung am Rahmen
Keine.
