# Anforderungen

## Qualitätsanforderungen

| ID | Titel | Kategorie | Anforderung | Maß | Zielwert | Gilt für | Herkunft | Prüfung | Priorität | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| NFR-001 | Zugriffsschutz des Finanzstatus | Sicherheit | Der Finanzstatus und seine Kontendaten sind nur mit gültiger Sitzung erreichbar. | Anteil der Aufrufe des Finanzstatus ohne gültige Sitzung, die auf die Anmeldeseite umgeleitet werden | 100 % | System, Maske:finanzstatus | Stakeholder STK-1 | Akzeptanztest | Hoch | Entwurf |
| NFR-002 | Genau einmalige Ausführung einer Überweisung | Zuverlässigkeit | Eine bestätigte Überweisung bucht genau einmal, auch wenn die Kundin mehrfach bestätigt. | Anteil der Überweisungen, die mehrfach bestätigt wurden und den Saldo des Girokontos dennoch genau einmal mindern | 100 % | System, POST /api/ueberweisungen, Maske:ueberweisung-bestaetigen | Stakeholder STK-1 | Akzeptanztest | Hoch | Entwurf |
| NFR-003 | Antwortzeit des Finanzstatus | Leistungseffizienz | Der Finanzstatus antwortet in mindestens 95 % der Aufrufe in höchstens 500 ms. | Anteil der Aufrufe von GET /api/konten, deren Antwortzeit höchstens 500 ms beträgt, gemessen über 28 Tage im Betrieb | ≥ 95 % | System, GET /api/konten | Betrieb: Story PK-8 | Monitoring | Hoch | Entwurf |
| NFR-004 | Verfügbarkeit von Finanzstatus und Überweisung | Zuverlässigkeit | Finanzstatus und Überweisung antworten in mindestens 99,5 % der Aufrufe ohne Serverfehler (5xx). | Anteil der Aufrufe von GET /api/konten und POST /api/ueberweisungen, die ohne Antwort mit Status 5xx beantwortet werden, gemessen über 28 Tage im Betrieb | ≥ 99,5 % | System, GET /api/konten, POST /api/ueberweisungen | Betrieb: Story PK-8 | Monitoring | Hoch | Entwurf |

## Randbedingungen

| ID | Titel | Kategorie | Beschreibung | Herkunft | Gilt für | Priorität | Status |
|---|---|---|---|---|---|---|---|
| C-001 | Demo-Konten statt Kernbank | Technisch | Es gibt noch kein Kernbanksystem. Der Dienst führt die Konten der Kundin als Demo-Daten und liefert sie über seine eigene Schnittstelle. | Regulatorik: Story PK-1 | System, GET /api/konten | Mittel | Entwurf |
