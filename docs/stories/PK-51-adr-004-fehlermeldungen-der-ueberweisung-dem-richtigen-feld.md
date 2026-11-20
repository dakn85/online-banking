# PK-51: ADR-004: Fehlermeldungen der Überweisung dem richtigen Feld zuordnen

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Rückmeldung aus PK-43 (Platform Admin (Agent „coding laptop“)):
ADR-004 sagt, die Oberfläche ordne 400 dem IBAN-Feld und 422 dem Betrag zu. Mit PK-43 antwortet der Dienst auch beim Betrag unter 0,10 € mit 400 (OpenAPI, UC-002 A8.2), und die Meldung gehört an den Betrag. Im Code unterscheidet die Oberfläche bei 400 jetzt nach dem Fehlertext des Dienstes: „Der Betrag muss mindestens 0,10 € betragen.“ → Feld Betrag, jede andere 400 → IBAN-Feld.

Vorschlag: ADR-004 ergänzen: 400 mit der Mindestbetrags-Meldung ordnet die Oberfläche dem Betrag zu, jede andere 400 dem IBAN-Feld. Alternativ einen eigenen Fehlercode im Schema Fehler vorsehen, statt über den Text zu unterscheiden.
Element: technik ADR-004
Beleg: public/seiten/ueberweisung.js (catch-Zweig in bestaetigen), Commit a88f4a5

## Herkunft

Rückmeldung an PK-43 (Platform Admin (Agent „coding laptop“)).

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Fachliche Prüfungen doppelt, maßgeblich ist der Dienst | Geändert | Kontext geändert, Entscheidung geändert, Folgen geändert |

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-19_

**Bausteine:** Oberfläche (public/seiten/ueberweisung.js, Seite Überweisung), Dienst (src/ueberweisung.ts, Ablehnung beim Bestätigen). Keine Änderung an OpenAPI, Datenmodell oder Akzeptanztests.

**Schritte**
1. Abgleich Oberfläche mit ADR-004 (UC-002 A8.2, BR-0003, BR-0004): Der catch-Zweig in `bestaetigen` ordnet bereits seit PK-43 (Commit a88f4a5, auf main) eine 400 mit „Der Betrag muss mindestens 0,10 € betragen.“ dem Feld Betrag zu, jede andere 400 dem IBAN-Feld, 422 dem Betrag (BR-0004) und jeden anderen Status der allgemeinen Meldung (UC-002 A6). Das entspricht der geänderten Entscheidung, Code-Änderung ist nicht nötig.
2. Abgleich Dienst (UC-002 A8): `MINDESTBETRAG_FEHLER` in src/ueberweisung.ts hat denselben Text wie die Oberfläche; die Zuordnung über den Text funktioniert also.
3. Nachweis: `npm test`, `npm run build` und die Akzeptanztests lokal auf dem Zweig (Regression UC-002, Szenarien mit PK-43 für den Mindestbetrag). PK-51 hat keine eigenen Szenarien.

**Rahmenänderung:** keine; die Story ändert nur die Dokumentation (ADR-004).

## Entscheidungen

- Wie ordnet die Oberfläche eine 400-Antwort des Dienstes dem Feld Betrag oder IBAN zu: über den Fehlertext „Der Betrag muss mindestens 0,10 € betragen.“ oder über einen eigenen Fehlercode im Schema „Fehler“ der OpenAPI?
  **Antwort:** ADR-004 ergänzen: 400 mit der Mindestbetrags-Meldung gehört zum Betrag, jede andere 400 zum IBAN-Feld (Zuordnung über den Text, wie im Code)
  _→ eingearbeitet in ADR-004 · 8238971_
