# Postfach

## Das Postfach zeigt die Nachrichten der Kundin, neueste zuerst

Tags: UC-020, PK-57

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Postfach
* Das Postfach zeigt die Nachrichten
| Absender                  | Betreff                                     | Datum      | Status    |
|---------------------------|---------------------------------------------|------------|-----------|
| Aventa Bank Kartenservice | Ihre Kreditkartenabrechnung liegt vor       | 17.11.2026 | ungelesen |
| Aventa Bank               | Neue Sicherheitshinweise zum Online-Banking | 12.11.2026 | ungelesen |
| Aventa Bank               | Ihr Kontoauszug für Oktober                 | 02.11.2026 | gelesen   |

## Eine ungelesene Nachricht gilt nach dem Öffnen als gelesen

Tags: UC-020, PK-57, BR-0087

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Postfach
* Die Kundin öffnet die Nachricht "Neue Sicherheitshinweise zum Online-Banking" und sieht den Text "Bitte geben Sie Ihre PIN niemals an Dritte weiter. Die Bank fragt sie nie per E-Mail oder Telefon ab."
* Das Postfach zeigt die Nachrichten
| Absender                  | Betreff                                     | Datum      | Status    |
|---------------------------|---------------------------------------------|------------|-----------|
| Aventa Bank Kartenservice | Ihre Kreditkartenabrechnung liegt vor       | 17.11.2026 | ungelesen |
| Aventa Bank               | Neue Sicherheitshinweise zum Online-Banking | 12.11.2026 | gelesen   |
| Aventa Bank               | Ihr Kontoauszug für Oktober                 | 02.11.2026 | gelesen   |

## Das erneute Öffnen einer gelesenen Nachricht ändert nichts

Tags: UC-020, PK-57, BR-0087

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Postfach
* Die Kundin öffnet die Nachricht "Ihr Kontoauszug für Oktober" und sieht den Text "Ihr Kontoauszug für Oktober liegt zum Abruf bereit."
* Die Navigation zeigt am Eintrag Postfach "2"
* Das Postfach zeigt die Nachrichten
| Absender                  | Betreff                                     | Datum      | Status    |
|---------------------------|---------------------------------------------|------------|-----------|
| Aventa Bank Kartenservice | Ihre Kreditkartenabrechnung liegt vor       | 17.11.2026 | ungelesen |
| Aventa Bank               | Neue Sicherheitshinweise zum Online-Banking | 12.11.2026 | ungelesen |
| Aventa Bank               | Ihr Kontoauszug für Oktober                 | 02.11.2026 | gelesen   |

## Die Zahl ungelesener Nachrichten in der Navigation sinkt beim Öffnen

Tags: UC-020, PK-57, BR-0086

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Navigation zeigt am Eintrag Postfach "2"
* Die Kundin öffnet das Postfach
* Die Kundin öffnet die Nachricht "Neue Sicherheitshinweise zum Online-Banking" und sieht den Text "Bitte geben Sie Ihre PIN niemals an Dritte weiter. Die Bank fragt sie nie per E-Mail oder Telefon ab."
* Die Navigation zeigt am Eintrag Postfach "1"

## Ohne ungelesene Nachricht zeigt die Navigation keine Zahl

Tags: UC-020, PK-57, BR-0086

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Navigation zeigt am Eintrag Postfach "keine Zahl"

## Eine gelöschte Nachricht erscheint nicht mehr und zählt nicht als ungelesen

Tags: UC-020, PK-57, BR-0086

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Postfach
* Die Kundin löscht die Nachricht "Ihre Kreditkartenabrechnung liegt vor" und antwortet auf die Sicherheitsabfrage "Ja"
* Das Postfach zeigt die Meldung "Nachricht gelöscht."
* Das Postfach zeigt die Nachrichten
| Absender    | Betreff                                     | Datum      | Status    |
|-------------|---------------------------------------------|------------|-----------|
| Aventa Bank | Neue Sicherheitshinweise zum Online-Banking | 12.11.2026 | ungelesen |
| Aventa Bank | Ihr Kontoauszug für Oktober                 | 02.11.2026 | gelesen   |
* Die Navigation zeigt am Eintrag Postfach "1"

## Eine Nachricht bleibt, wenn die Kundin die Sicherheitsabfrage verneint

Tags: UC-020, PK-57

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Postfach
* Die Kundin löscht die Nachricht "Ihre Kreditkartenabrechnung liegt vor" und antwortet auf die Sicherheitsabfrage "Nein"
* Das Postfach zeigt die Nachrichten
| Absender                  | Betreff                                     | Datum      | Status    |
|---------------------------|---------------------------------------------|------------|-----------|
| Aventa Bank Kartenservice | Ihre Kreditkartenabrechnung liegt vor       | 17.11.2026 | ungelesen |
| Aventa Bank               | Neue Sicherheitshinweise zum Online-Banking | 12.11.2026 | ungelesen |
| Aventa Bank               | Ihr Kontoauszug für Oktober                 | 02.11.2026 | gelesen   |
* Die Navigation zeigt am Eintrag Postfach "2"

## Das Postfach zeigt nur die Nachrichten der angemeldeten Kundin

Tags: UC-020, PK-57, BR-0085

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin öffnet das Postfach
* Das Postfach zeigt die Nachrichten
| Absender    | Betreff                | Datum      | Status  |
|-------------|------------------------|------------|---------|
| Aventa Bank | Willkommen im Postfach | 10.11.2026 | gelesen |

## GET /api/nachrichten ohne Anmeldung antwortet mit 401

Tags: UC-020, PK-57, NFR-001

* Ohne Anmeldung wird der Aufruf "GET /api/nachrichten" mit Status "401" abgelehnt

## PATCH /api/nachrichten/{nachrichtId} ohne Anmeldung antwortet mit 401

Tags: UC-020, PK-57, NFR-001

* Ohne Anmeldung wird der Aufruf "PATCH /api/nachrichten/N-2026-00001" mit Status "401" abgelehnt

## DELETE /api/nachrichten/{nachrichtId} ohne Anmeldung antwortet mit 401

Tags: UC-020, PK-57, NFR-001

* Ohne Anmeldung wird der Aufruf "DELETE /api/nachrichten/N-2026-00001" mit Status "401" abgelehnt

## PATCH /api/nachrichten/{nachrichtId} mit unbekannter Kennung antwortet mit 404

Tags: UC-020, PK-57, BR-0085

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin ruft "PATCH /api/nachrichten/N-unbekannt" mit einer unbekannten Nachrichten-Kennung auf und erhält Status "404"

## DELETE /api/nachrichten/{nachrichtId} mit unbekannter Kennung antwortet mit 404

Tags: UC-020, PK-57, BR-0085

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin ruft "DELETE /api/nachrichten/N-unbekannt" mit einer unbekannten Nachrichten-Kennung auf und erhält Status "404"

## Ohne Anmeldung ist das Postfach nicht erreichbar

Tags: UC-020, PK-57, NFR-001

* Testdaten sind zurückgesetzt
* Das Postfach ist ohne Anmeldung nicht erreichbar
* Die Anmeldeseite ist zu sehen
