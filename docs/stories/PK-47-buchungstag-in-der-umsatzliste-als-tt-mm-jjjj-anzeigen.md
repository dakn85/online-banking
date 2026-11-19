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

## Aufgaben für die Umsetzung

- [ ] Umsatz: Attribut buchungstag neu
- [ ] Umsätze: Skizze geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-47 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-47 grün
