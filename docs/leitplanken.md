# Leitplanken des Hauses

> Vorgaben, die jedes System des Mandanten erfüllt. Gepflegt in KnippQAi (Technik eines Systems, Karte „Leitplanken des Hauses“); KnippQAi schreibt diese Datei. Eine Änderung hier geht beim nächsten Einspielen verloren.

- **Zeiten:** in UTC, auf dem Draht als ISO 8601.
- **Geldbeträge:** dezimal, nie als Gleitkommazahl; die Währung steht immer dabei (ISO 4217).
- **Geheimnisse:** keine im Repo; Zugangsdaten kommen aus der Umgebung.
- **Logs und Traces:** keine Kontonummern, IBANs, Namen oder Tokens.
- **REST:** zuerst in OpenAPI beschrieben, dann gebaut; Fehler als Problem Details (RFC 9457).
- **Ereignisse:** jedes Kafka-Ereignis hat ein Schema in der Registry, Änderungen nur rückwärtskompatibel; Konsumenten verarbeiten doppelte Nachrichten ohne Schaden.
- **Abhängigkeiten:** nur freigegebene Lizenzen, keine bekannte kritische Schwachstelle beim Merge.
