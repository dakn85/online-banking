# Persönliche Daten anzeigen und ändern

## Die persönlichen Daten zeigen die gespeicherten Angaben

Tags: UC-023, PK-61

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die persönlichen Daten zeigen bei "Straße und Hausnummer" den Wert "Lindenallee 12"
* Die persönlichen Daten zeigen bei "Postleitzahl" den Wert "50667"
* Die persönlichen Daten zeigen bei "Ort" den Wert "Köln"
* Die persönlichen Daten zeigen bei "E-Mail-Adresse" den Wert "lena.hoffmann@example.org"
* Die persönlichen Daten zeigen bei "Telefonnummer" den Wert "+49 221 1234567"

## Die Kundin ändert ihre E-Mail-Adresse mit richtiger TAN

Tags: UC-023, PK-61, BR-0096

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die Kundin ändert in den persönlichen Daten "E-Mail-Adresse" auf "lena.neu@example.org" und bestätigt mit der TAN "123456"
* Die persönlichen Daten zeigen die Meldung "Persönliche Daten gespeichert."
* Die persönlichen Daten zeigen bei "E-Mail-Adresse" den Wert "lena.neu@example.org"

## Eine falsche TAN speichert nichts und legt keine Nachricht an

Tags: UC-023, PK-61, BR-0096

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die Kundin ändert in den persönlichen Daten "E-Mail-Adresse" auf "lena.neu@example.org" und bestätigt mit der TAN "000000"
* Die persönlichen Daten zeigen die Meldung "Die TAN ist falsch. Die Änderung wurde nicht gespeichert."
* Die Kundin öffnet die persönlichen Daten
* Die persönlichen Daten zeigen bei "E-Mail-Adresse" den Wert "lena.hoffmann@example.org"
* Das Postfach der Kundin enthält "3" Nachrichten

## Eine falsche TAN wird vom Dienst mit 422 beantwortet

Tags: UC-023, PK-61, BR-0096

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Änderung der persönlichen Daten mit Postleitzahl "50667" und TAN "000000" antwortet mit dem Status "422"

## Eine Änderung der Anschrift legt eine Bestätigungsnachricht im Postfach an

Tags: UC-023, PK-61, BR-0097

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die Kundin ändert in den persönlichen Daten "Straße und Hausnummer" auf "Rosenweg 3" und bestätigt mit der TAN "123456"
* Das Postfach der Kundin enthält die Nachricht "Ihre Anschrift wurde geändert."

## Unveränderte Angaben legen keine Bestätigungsnachricht an

Tags: UC-023, PK-61, BR-0097

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die Kundin ändert in den persönlichen Daten "Telefonnummer" auf "+49 221 1234567" und bestätigt mit der TAN "123456"
* Die persönlichen Daten zeigen die Meldung "Persönliche Daten gespeichert."
* Das Postfach der Kundin enthält "3" Nachrichten

## Eine Postleitzahl ohne 5 Ziffern wird abgelehnt

Tags: UC-023, PK-61

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die Kundin ändert in den persönlichen Daten "Postleitzahl" auf "5066" und bestätigt mit der TAN "123456"
* Die persönlichen Daten zeigen die Meldung "Die Postleitzahl muss aus 5 Ziffern bestehen."

## Eine ungültige Postleitzahl wird vom Dienst mit 400 beantwortet

Tags: UC-023, PK-61

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Änderung der persönlichen Daten mit Postleitzahl "5066" und TAN "123456" antwortet mit dem Status "400"

## Das Lesen der persönlichen Daten ohne Anmeldung wird mit 401 beantwortet

Tags: UC-023, PK-61

* Testdaten sind zurückgesetzt
* Der Aufruf "GET" "/api/kunde" ohne Anmeldung antwortet mit dem Status "401"

## Das Ändern der persönlichen Daten ohne Anmeldung wird mit 401 beantwortet

Tags: UC-023, PK-61

* Testdaten sind zurückgesetzt
* Der Aufruf "PUT" "/api/kunde" ohne Anmeldung antwortet mit dem Status "401"

## Eine TAN ohne 6 Ziffern wird abgelehnt

Tags: UC-023, PK-61

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die Kundin ändert in den persönlichen Daten "E-Mail-Adresse" auf "lena.neu@example.org" und bestätigt mit der TAN "12345"
* Die persönlichen Daten zeigen die Meldung "Die TAN muss aus 6 Ziffern bestehen."

## Das Lesen der Postfachnachrichten ohne Anmeldung wird mit 401 beantwortet

Tags: UC-023, PK-61

* Testdaten sind zurückgesetzt
* Der Aufruf "GET" "/api/test/postfachnachrichten" ohne Anmeldung antwortet mit dem Status "401"

## Die Maske Persönliche Daten führt ohne Anmeldung auf die Anmeldeseite

Tags: UC-023, PK-61, NFR-001

* Die persönlichen Daten sind ohne Anmeldung nicht erreichbar

## Ungültiges Feld und falsche TAN werden mit 400 beantwortet, die TAN wird erst danach geprüft

Tags: UC-023, PK-61, BR-0096

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Änderung der persönlichen Daten mit Postleitzahl "5066" und TAN "000000" antwortet mit dem Status "400"

## Mehrere geänderte Angaben ergeben genau eine Nachricht in fester Reihenfolge

Tags: UC-023, PK-61, BR-0097

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die Kundin ändert mehrere Angaben der persönlichen Daten und bestätigt mit der TAN "123456"
| feld                  | wert           |
|-----------------------|----------------|
| Telefonnummer         | +49 30 7654321 |
| Straße und Hausnummer | Rosenweg 3     |
* Das Postfach der Kundin enthält "4" Nachrichten
* Die neueste Nachricht im Postfach der Kundin ist ungelesen und hat den Betreff "Ihre persönlichen Daten wurden geändert"
* Die neueste Nachricht im Postfach der Kundin hat den Text "Ihre Anschrift wurde geändert. Ihre Telefonnummer wurde geändert."

## Die Bestätigungsnachricht kommt von der Aventa Bank und trägt das Datum der Änderung

Tags: UC-023, PK-61, BR-0097

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die persönlichen Daten
* Die Kundin ändert in den persönlichen Daten "Straße und Hausnummer" auf "Rosenweg 3" und bestätigt mit der TAN "123456"
* Die neueste Nachricht im Postfach der Kundin stammt von "Aventa Bank" und wurde "heute" versendet
