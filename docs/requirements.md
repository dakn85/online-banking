# Anforderungen

## Qualitätsanforderungen

| ID | Titel | Kategorie | Anforderung | Maß | Zielwert | Gilt für | Herkunft | Prüfung | Priorität | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| NFR-001 | Zugriffsschutz des Finanzstatus | Sicherheit | Der Finanzstatus und seine Kontendaten sind nur mit gültiger Sitzung erreichbar. | Anteil der Aufrufe des Finanzstatus ohne gültige Sitzung, die auf die Anmeldeseite umgeleitet werden | 100 % | System, Maske:finanzstatus | Stakeholder STK-1 | Akzeptanztest | Hoch | Entwurf |

## Randbedingungen

| ID | Titel | Kategorie | Beschreibung | Herkunft | Gilt für | Priorität | Status |
|---|---|---|---|---|---|---|---|
| C-001 | Demo-Konten statt Kernbank | Technisch | Es gibt noch kein Kernbanksystem. Der Dienst führt die Konten der Kundin als Demo-Daten und liefert sie über seine eigene Schnittstelle. | Regulatorik: Story PK-1 | System, GET /api/konten | Mittel | Entwurf |
