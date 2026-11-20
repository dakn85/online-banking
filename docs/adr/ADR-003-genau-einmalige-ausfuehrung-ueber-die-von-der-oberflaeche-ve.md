# ADR-003: Genau einmalige Ausführung über die von der Oberfläche vergebene Auftrags-Kennung

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

BR-0005 verlangt genau eine Buchung je Auftrag, auch bei doppeltem Klick auf Bestätigen. Der Dienst hat keine eigene Transaktionskennung und keine Datenbank mit eindeutigem Schlüssel. Die Oberfläche erzeugt je Zusammenfassung und nach jeder Ablehnung eine neue Kennung aus crypto.getRandomValues und lässt den Knopf während des Absendens gesperrt.

## Entscheidung

Die Oberfläche schickt die Auftrags-Kennung als auftragsId mit. Der Dienst merkt jede ausgeführte Überweisung unter dieser Kennung in der Map ausgefuehrt und antwortet auf eine Wiederholung mit 200 und dem zuerst gespeicherten Ergebnis, auf einen neuen Auftrag mit 201. Dasselbe gilt für POST /api/terminueberweisungen: Der Dienst merkt jeden vorgemerkten Auftrag unter seiner Kennung in einer eigenen Ablage und antwortet auf die Wiederholung des noch vorgemerkten Auftrags mit 200 und dem gespeicherten Auftrag, auf einen neuen Auftrag mit 201. Die Wiederholung wird nur im eigenen Endpunkt als solche erkannt; die auftragsId ist je Kundin und je Endpunkt eindeutig. Je Kundin bleibt eine Kennung für beide Überweisungsarten dauerhaft verbraucht: Wird sie am anderen Endpunkt oder nach dem Löschen des vorgemerkten Auftrags erneut gesendet, lehnt der Dienst mit 422 ab und legt keinen Auftrag an (BR-0005).

## Folgen

Leichter: ein doppelter Absenden-Vorgang bucht nur einmal, ohne Sperrtabelle und ohne Datenbank, und der Wiederholungsaufruf ist für den Client unschädlich. Schwerer: der Schutz endet mit dem Prozess, die Ablage wächst unbegrenzt, und die Kennung ist eine ungeprüfte Client-Angabe.
