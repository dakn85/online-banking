# PK-60: Überweisung prüft das Tageslimit (BR-0070)

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich, dass eine Überweisung abgelehnt wird, die zusammen mit meinen heutigen Ausgängen mein selbst gesetztes Tageslimit übersteigt, auch bei einem Limit von 0,00 €, damit mein Tageslimit meine Überweisungen je Kalendertag wirklich begrenzt.

## Nicht im Scope

- Tageslimit festlegen oder ändern: Das Festlegen ist bereits in UC-015 mit PUT /api/tageslimit und der Maske tageslimit beschrieben; die Idee verlangt nur die Prüfung.
- Anzeige des heute noch verfügbaren Restbetrags auf der Überweisungsmaske: Die Idee nennt nur die Ablehnung mit Meldung, keine zusätzliche Anzeige.
- Benachrichtigung der Kundin oder Hinweis bei Annäherung ans Limit: Die Idee verlangt keine Benachrichtigungen.
- Erhöhung des Limits direkt aus der Ablehnungsmeldung: Die Idee nennt keinen Sprung zur Maske tageslimit; im Zweifel nicht im Scope.
- Bericht oder Verlauf der Limitablehnungen: Berichte werden nicht verlangt.
- Andere Ausgänge als ausgeführte Überweisungen nach UC-002 (Umbuchungen, Lastschriften, Kartenzahlungen, Daueraufträge): Sie zählen nicht zu den heutigen Ausgängen des Tageslimits.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Fachliche Prüfungen doppelt, maßgeblich ist der Dienst | Geändert | Kontext geändert, Entscheidung geändert, Folgen geändert |
| Überweisung vom Girokonto ausführen | Geändert | Beschreibung geändert, Antwort 422 geändert |
| Architektur | Geändert | Bausteinsicht geändert, Laufzeitsicht geändert |
| Überweisung | Geändert | Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | Notizen geändert, Schritt 7 geändert, A9 neu: Tageslimit überschritten, und 1 weitere |
| UC-015 Tageslimit für Überweisungen festlegen | Geändert | Notizen geändert, BR-0070 geändert |
| BR-0070 Tageslimit der Kundin | Geändert | Text geändert |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Ein Betrag genau in Höhe des Tageslimits wird ausgeführt
- `acceptance/specs/ueberweisung.spec`: Ein gesenktes Tageslimit zählt frühere Ausgänge des Tages mit
- `acceptance/specs/ueberweisung.spec`: Ein Tageslimit von 0,00 € lehnt jede Überweisung ab
- `acceptance/specs/ueberweisung.spec`: Eine abgelehnte Überweisung zählt nicht zu den Ausgängen des Tages
- `acceptance/specs/ueberweisung.spec`: Eine Überweisung über dem Tageslimit wird abgelehnt und der Saldo bleibt unverändert
- `acceptance/specs/ueberweisung.spec`: Eine wiederholte Bestätigung wird bei ausgeschöpftem Tageslimit nicht erneut geprüft
- `acceptance/specs/ueberweisung.spec`: Heutige Ausgänge zählen zum Tageslimit

## Aufgaben für die Umsetzung

- [ ] Fachliche Prüfungen doppelt, maßgeblich ist der Dienst: Kontext geändert
- [ ] Fachliche Prüfungen doppelt, maßgeblich ist der Dienst: Entscheidung geändert
- [ ] Fachliche Prüfungen doppelt, maßgeblich ist der Dienst: Folgen geändert
- [ ] Überweisung vom Girokonto ausführen: Beschreibung geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 422 geändert
- [ ] Architektur: Bausteinsicht geändert
- [ ] Architektur: Laufzeitsicht geändert
- [ ] Überweisung: Skizze geändert
- [ ] UC-002: Notizen geändert
- [ ] UC-002: Schritt 7 geändert
- [ ] UC-002: A9 neu: Tageslimit überschritten
- [ ] UC-002: Sequenzdiagramm neu
- [ ] UC-015: Notizen geändert
- [ ] UC-015: BR-0070 geändert
- [ ] BR-0070: Text geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-60 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-60 grün

## Offene Fragen

- [ ] Welche Ablehnung gilt, wenn ein Betrag zugleich den verfügbaren Betrag des Girokontos (BR-0004) und das Tageslimit (BR-0070) übersteigt?
- [ ] Gilt das Tageslimit auch für die Lastkunden (lasttest-001 bis lasttest-300), und setzt POST /api/test/lasttest/reset deren Tageslimit und Tagesausgänge zurück?

## Entscheidungen

- Soll die Maske Überweisung das Tageslimit schon bei „Weiter“ prüfen, oder prüft nur der Dienst beim Bestätigen?
  **Antwort:** Nur der Dienst prüft beim Bestätigen (POST /api/ueberweisungen, 422); die Maske springt zurück auf die Überweisung und zeigt die Meldung im Formular mit den bisherigen Eingaben, ohne neue Schnittstellendaten.
  _→ eingearbeitet in UC-015, BR-0070, UC-002, POST /api/ueberweisungen, ueberweisung, architektur · 495ae6c_
- Zählen zu den „heutigen Ausgängen“ nur die am laufenden UTC-Tag ausgeführten Überweisungen vom Girokonto (UC-002), oder auch andere Ausgänge wie Umbuchungen, Lastschriften, Kartenzahlungen und Daueraufträge?
  **Antwort:** Nur ausgeführte Überweisungen nach UC-002; andere Ausgänge zählen nicht und werden als „Nicht im Scope“ benannt.
  _→ eingearbeitet in UC-015, BR-0070, UC-002 · b1d1336_
