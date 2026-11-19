# Debitkarte sperren und entsperren

## Die Kundin sperrt ihre Debitkarte vorübergehend

Tags: UC-018, PK-55, BR-0081

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin sperrt die Debitkarte vorübergehend
* Die Debitkarte zeigt die Meldung "Die Debitkarte ist vorübergehend gesperrt."
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "vorübergehend gesperrt"

## Die Kundin entsperrt ihre vorübergehend gesperrte Debitkarte

Tags: UC-018, PK-55, BR-0081

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin sperrt die Debitkarte vorübergehend
* Die Kundin entsperrt die Debitkarte
* Die Debitkarte zeigt die Meldung "Die Debitkarte ist wieder aktiv."
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "aktiv"

## Die Kundin sperrt ihre Debitkarte bei Verlust endgültig

Tags: UC-018, PK-55, BR-0081

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin sperrt die Debitkarte endgültig wegen "Verlust" und antwortet auf die Sicherheitsabfrage "Bestätigen"
* Die Debitkarte zeigt die Meldung "Die Debitkarte ist endgültig gesperrt. Grund: Verlust."
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "endgültig gesperrt"

## Die endgültige Sperre wird erst nach der Sicherheitsabfrage ausgeführt

Tags: UC-018, PK-55

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin sperrt die Debitkarte endgültig wegen "Diebstahl" und antwortet auf die Sicherheitsabfrage "Abbrechen"
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "aktiv"

## PUT Debitkarte 400: Die endgültige Sperre ohne Sperrgrund wird abgelehnt

Tags: UC-018, PK-55, A3, 400

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin sperrt die Debitkarte endgültig wegen "" und antwortet auf die Sicherheitsabfrage "Bestätigen"
* Die Debitkarte zeigt die Meldung "Bitte wählen Sie den Sperrgrund Verlust oder Diebstahl."

## PUT Debitkarte 409: Eine endgültig gesperrte Debitkarte lässt sich nicht entsperren

Tags: UC-018, PK-55, A4, 409, BR-0081

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin sperrt die Debitkarte endgültig wegen "Verlust" und antwortet auf die Sicherheitsabfrage "Bestätigen"
* Die Kundin entsperrt die Debitkarte
* Die Debitkarte zeigt die Meldung "Die Debitkarte ist endgültig gesperrt und lässt sich nicht entsperren."
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "endgültig gesperrt"

## GET und PUT Debitkarte 404: Zu einer Kreditkarte gibt es keine Debitkarte

Tags: UC-018, PK-55, A5, 404, BR-0082

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Debitkarte des Kontos mit der IBAN "DE44 5001 0517 5407 3249 55" zeigt die Meldung "Zu diesem Konto gibt es keine Debitkarte."

## GET und PUT Debitkarte 401: Die Debitkarte ist ohne Anmeldung nicht erreichbar

Tags: UC-018, PK-55, A6, 401

* Testdaten sind zurückgesetzt
* Die Debitkarte ist ohne Anmeldung nicht erreichbar

## Die Debitkarte zeigt anfangs Kartennummer und Status aktiv

Tags: UC-018, PK-55

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "aktiv"

## PUT Debitkarte 409: Eine vorübergehend gesperrte Debitkarte lässt sich nicht noch einmal sperren

Tags: UC-018, PK-55, A4, 409, BR-0081

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin sperrt die Debitkarte vorübergehend
* Die Kundin sperrt die Debitkarte vorübergehend
* Die Debitkarte zeigt die Meldung "Die Debitkarte ist bereits vorübergehend gesperrt."
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "vorübergehend gesperrt"

## PUT Debitkarte 409: Eine aktive Debitkarte lässt sich nicht entsperren

Tags: UC-018, PK-55, A4, 409, BR-0081

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin entsperrt die Debitkarte
* Die Debitkarte zeigt die Meldung "Die Debitkarte ist nicht gesperrt."
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "aktiv"

## Eine vorübergehend gesperrte Debitkarte lässt sich direkt endgültig sperren

Tags: UC-018, PK-55, BR-0081

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Debitkarte des Girokontos
* Die Kundin sperrt die Debitkarte vorübergehend
* Die Kundin sperrt die Debitkarte endgültig wegen "Verlust" und antwortet auf die Sicherheitsabfrage "Bestätigen"
* Die Debitkarte zeigt die Kartennummer "**** 4821" und den Status "endgültig gesperrt"
