# PK-3: Anforderung prüfen: Eine unbekannte IBAN wird durchgeführt

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Ein Akzeptanztest erwartet ein Verhalten, das die Anforderung heute ausschließt. Zu klären: Soll sich die Anforderung ändern, oder ist der Test falsch?

**Diagnose:** Die Anwendung hat die IBAN HR99 … korrekt nach BR-0003 abgelehnt (Länderkennzeichen HR steht nicht in der SEPA-Länderliste) und zeigt die Meldung im Formular; eine Zusammenfassung entsteht daher nicht. Das Szenario „Eine unbekannte IBAN wird durchgeführt“ erwartet aber genau das, was UC-002/A1 ausschließt: Es prüft die Zusammenfassung für eine IBAN, die laut Anforderung nie bis zur Zusammenfassung kommt. Der Test widerspricht der Anforderung, nicht die Anwendung dem Test.

**Heute gilt:** „Die IBAN des Empfängers ist gültig: 15 bis 34 Stellen, gültige Prüfziffer nach ISO 7064 MOD 97-10, und ihr Länderkennzeichen steht in der SEPA-Länderliste. Sonst führt das System den Auftrag nicht aus und zeigt „Die IBAN ist ungültig oder gehört zu keinem SEPA-Land.“.“

**Betrifft:** BR-0003, UC-002

## Herkunft

Ein roter Akzeptanztest.

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
| Fachliche Prüfungen doppelt, maßgeblich ist der Dienst | Geändert | Kontext geändert, Entscheidung geändert, Folgen geändert |
| Überweisung | Geändert | Feld Betrag in Euro geändert, Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | A1 geändert, BR-0003 geändert |
| BR-0003 IBAN des Empfängers | Geändert | Text geändert |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Eine IBAN außerhalb der SEPA-Länderliste wird abgelehnt und keine Zusammenfassung gezeigt
- `acceptance/specs/ueberweisung.spec`: Eine IBAN mit weniger als 15 Stellen wird abgelehnt

## Technischer Entwurf

_Goran Art (Agent „PK-3 Online-Banking“), 2026-11-01_

**Bausteine:** Dienst `src/ueberweisung.ts`, Oberfläche `public/seiten/ueberweisung.js`, Akzeptanztests `acceptance/tests/StepImplementation.ts`.

**Schritte**
1. UC-002/A1, BR-0003: Die SEPA-Länderliste in Dienst und Oberfläche mit der Referenzliste in BR-0003 abgleichen (37 Kennzeichen, HR eingeschlossen). Sie stimmt bereits überein, darum ist kein Produktcode zu ändern.
2. BR-0003: Länge 15–34 und Prüfziffer MOD 97-10 werden schon an beiden Stellen geprüft (Regex `[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}`). Ist die IBAN abgelehnt, bleibt das Formular mit der Meldung stehen, eine Zusammenfassung entsteht nicht.
3. Maske `ueberweisung`, Betrag 0.01 bis verfügbar: Das ist durch BR-0004 abgedeckt (höchstens zwei Nachkommastellen, Cent > 0).
4. Step „Die Überweisung zeigt keine Zusammenfassung“: Er sucht die Region „Zusammenfassung“ auf der ganzen Seite statt nur im Formular, das sie ersetzt.

**Änderung am Rahmen:** keine.

## Entscheidungen

- Soll BR-0003/A1 so bleiben und der Akzeptanztest korrigiert werden?
  **Antwort:** Ja, Anforderung bleibt, das Szenario wird entfernt oder auf die Ablehnung umgestellt.
  _→ noch nicht in der Spezifikation_
- Ist die im Code hinterlegte SEPA-Länderliste einschließlich „HR“ maßgeblich, und soll sie in der Anforderung benannt werden?
  **Antwort:** Ja, maßgeblich, aber die Liste soll in BR-0003 als Anhang/Referenz genannt werden.
  _→ eingearbeitet in UC-002, BR-0003 · 25d6880_
- Soll BR-0003 unverändert bleiben und der Akzeptanztest die SEPA-Grenze prüfen?
  **Antwort:** Ja, die Regel bleibt wörtlich; der Test erwartet die Ablehnung und keine Zusammenfassung.
  _→ eingearbeitet · 74da1a4_
- Welche IBAN soll den Fall „Länderkennzeichen außerhalb der SEPA-Länderliste“ im Akzeptanztest belegen?
  **Antwort:** TR33 0006 1005 1978 6457 8413 26 (gültige Prüfziffer, außerhalb des SEPA-Raums).
  _→ ohne Änderung: Warum kein Vorschlag: Das Szenario „Eine IBAN außerhalb der SEPA-Länderliste wird abgelehnt und keine Zusammenfassung gezeigt“ steht in `acceptance/specs/ueberweisung.spec` schon mit der entschiedenen IBAN `"TR33 0006 1005 1978 6457 8413 26"`, der Meldung und dem Tag BR-0003, und UC-002/A1 samt BR-0003 sind ebenso gefasst; ein Vorschlag würde diese Stellen nur unverändert neu schreiben. Was du tun kannst: 1. Die Entscheidung als eingearbeitet abhaken und die Story schließen. 2. Die Step-Bindung für „Die Überweisung zeigt keine Zusammenfassung“ in `acceptance/tests/StepImplementation.ts` ergänzen, damit das Szenario lauffähig ist. 3. Für die noch offene Rückfrage, ob TR33 zusätzlich als Beispiel in BR-0003 stehen soll, entscheiden und BR-0003 dafür in den Umfang nehmen._
- Welche IBAN soll den Fall „Länderkennzeichen außerhalb der SEPA-Länderliste“ im Akzeptanztest belegen?
  **Antwort:** TR33 0006 1005 1978 6457 8413 26 (Türkei) wie im Vorschlag
  _→ noch nicht in der Spezifikation_
- Ist diese Test-IBAN als Beleg der Längengrenze richtig, oder soll die Länge mit einem anderen Wert geprüft werden?
  **Antwort:** ist schon eingearbeitet
  _→ noch nicht in der Spezifikation_
- Der Belegfall „Länderkennzeichen außerhalb der SEPA-Länderliste“ ist im Szenario „Eine IBAN mit gültiger Prüfziffer außerhalb des SEPA-Raums wird abgelehnt“ bereits mit IBAN „TR33 0006 1005 1978 6457 8413 26“ umgesetzt. Soll ich darüber hinaus nichts ändern, oder soll dieser Testwert zusätzlich in BR-0003 als Beispiel stehen?
  **Antwort:** nichts ändern
  _→ noch nicht in der Spezifikation_
- Soll die IBAN „TR33 0006 1005 1978 6457 8413 26“ in BR-0003 als Beispiel stehen oder nur im Akzeptanztest?
  **Antwort:** Nein, der Wert steht nur im Szenario; BR-0003 bleibt wörtlich.
  _→ noch nicht in der Spezifikation_
