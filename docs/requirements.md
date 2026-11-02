# Anforderungen

## Qualitätsanforderungen

| ID | Titel | Kategorie | Anforderung | Maß | Zielwert | Gilt für | Herkunft | Prüfung | Priorität | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| NFR-001 | Zugriffsschutz des Finanzstatus | Sicherheit | Der Finanzstatus und seine Kontendaten sind nur mit gültiger Sitzung erreichbar. | Anteil der Aufrufe des Finanzstatus ohne gültige Sitzung, die auf die Anmeldeseite umgeleitet werden | 100 % | System, Maske:finanzstatus, Maske:umsaetze | Stakeholder STK-1 | Akzeptanztest | Hoch | Entwurf |
| NFR-002 | Genau einmalige Ausführung einer Überweisung | Zuverlässigkeit | Eine bestätigte Überweisung bucht genau einmal, auch wenn die Kundin mehrfach bestätigt. | Anteil der Überweisungen, die mehrfach bestätigt wurden und den Saldo des Girokontos dennoch genau einmal mindern | 100 % | System, POST /api/ueberweisungen, Maske:ueberweisung-bestaetigen | Stakeholder STK-1 | Akzeptanztest | Hoch | Entwurf |

## Randbedingungen

| ID | Titel | Kategorie | Beschreibung | Herkunft | Gilt für | Priorität | Status |
|---|---|---|---|---|---|---|---|
| C-001 | Demo-Konten statt Kernbank | Technisch | Es gibt noch kein Kernbanksystem. Der Dienst führt die Konten der Kundin und je Konto einige Demo-Umsätze als Demo-Daten und liefert sie über seine eigene Schnittstelle. | Regulatorik: Story PK-1 | System, GET /api/konten, GET /api/konten/{iban}/umsaetze | Mittel | Entwurf |
