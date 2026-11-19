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

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-51 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-51 grün
