# PK-3: Anforderung prüfen: Eine unbekannte IBAN wird durchgeführt

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Ein Akzeptanztest erwartet ein Verhalten, das die Anforderung heute ausschließt. Zu klären: Soll sich die Anforderung ändern, oder ist der Test falsch?

**Diagnose:** Die Anwendung hat die IBAN HR99 … korrekt nach BR-0003 abgelehnt (Länderkennzeichen HR steht nicht in der SEPA-Länderliste) und zeigt die Meldung im Formular; eine Zusammenfassung entsteht daher nicht. Das Szenario „Eine unbekannte IBAN wird durchgeführt“ erwartet aber genau das, was UC-002/A1 ausschließt: Es prüft die Zusammenfassung für eine IBAN, die laut Anforderung nie bis zur Zusammenfassung kommt. Der Test widerspricht der Anforderung, nicht die Anwendung dem Test.

**Heute gilt:** „Die IBAN des Empfängers ist gültig: 15 bis 34 Stellen, gültige Prüfziffer nach ISO 7064 MOD 97-10, und ihr Länderkennzeichen steht in der SEPA-Länderliste. Sonst führt das System den Auftrag nicht aus und zeigt „Die IBAN ist ungültig oder gehört zu keinem SEPA-Land.“.“

**Betrifft:** BR-0003, UC-002

### Beleg aus dem Akzeptanztest

**Szenario:** Eine unbekannte IBAN wird durchgeführt

**Spec:** `specs/ueberweisung.spec`

**Meldung des Tests:**

```
locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('region', { name: 'Zusammenfassung' }) to be visible

    at /adapter-sdk/dist/index.js:129:142
    at ToolRuntime.operation (/adapter-sdk/dist/index.js:24:34)
    at async StepImplementation.erfassenUndPruefen (/work/d536cdc7-e21b-4de6-8a3a-d0206065747d/Online-Banking/tests/StepImplementation.ts:159:5)
    at async StepExecutionProcessor.executeMethod (/environments/typescript-live/environments/ddea6669492b7192f7d7518c05fc3674457d87d92ce82c1a772418b442c6376c/node_modules/gauge-ts/dist/processors/ExecutionProcessor.js:12:9)
    at async StepExecutionProcessor.execute (/environments/typescript-live/environments/ddea6669492b7192f7d7518c05fc3674457d87d92ce82c1a772418b442c6376c/node_modules/gauge-ts/dist/processors/StepExecutionProcessor.js:35:13)
    at async StepExecutionProcessor.process (/environments/typescript-live/environments/ddea6669492b7192f7d7518c05fc3674457d87d92ce82c1a772418b442c6376c/node_modules/gauge-ts/dist/processors/StepExecutionProcessor.js:16:24)
```

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| UC-002 Überweisung vom Girokonto | Geändert | A1 geändert |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Eine IBAN mit gültiger Prüfziffer außerhalb des SEPA-Raums wird abgelehnt

## Aufgaben für die Umsetzung

- [ ] UC-002: A1 geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-3 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-3 grün

## Offene Fragen

- [ ] Ist die im Code hinterlegte SEPA-Länderliste einschließlich „HR“ maßgeblich, und soll sie in der Anforderung benannt werden?
- [ ] Soll BR-0003 unverändert bleiben und der Akzeptanztest die SEPA-Grenze prüfen?
- [ ] Welche IBAN soll den Fall „Länderkennzeichen außerhalb der SEPA-Länderliste“ im Akzeptanztest belegen?

## Entscheidungen

- Soll BR-0003/A1 so bleiben und der Akzeptanztest korrigiert werden?
  **Antwort:** Ja, Anforderung bleibt, das Szenario wird entfernt oder auf die Ablehnung umgestellt.
  _→ noch nicht in der Spezifikation_
