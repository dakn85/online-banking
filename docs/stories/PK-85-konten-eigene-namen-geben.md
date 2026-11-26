# PK-85: Konten eigene Namen geben

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich meinen Konten eigene Namen geben können, etwa dem Tagesgeldkonto „Urlaubskasse“, damit ich sie im Finanzstatus besser auseinanderhalte.

## Nicht im Scope

- Kontonamen wieder entfernen/zurücksetzen: Die Idee nennt nur das Vergeben eines Namens, kein Löschen oder Zurücksetzen auf die Standardbezeichnung.
- Namensänderung mit TAN bestätigen: Die Idee verlangt keine TAN-Bestätigung; ob eine Datenänderung bestätigt werden muss, ist nicht gefordert.
- Bestätigungsnachricht im Postfach: Die Idee erwähnt keine Benachrichtigung über die Umbenennung.
- Eigene Namen für Empfängervorlagen oder Daueraufträge: Die Idee betrifft nur eigene Konten, nicht andere Objekte.
- Verwaltung/Report über vergebene Kontonamen: Kein administrativer oder berichtender Bedarf in der Idee.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Konten der angemeldeten Kundin mit Salden und Gesamtvermögen | Geändert | Beschreibung geändert |
| Eigenen Namen eines Kontos der angemeldeten Kundin setzen | Neu | Endpunkt neu |
| Konto | Geändert | Eigenschaft eigenerName neu, Attribut eigenerName neu |
| KontonameEingabe | Neu | Schema neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Antwortzeit von Finanzstatus und Überweisung | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Verfügbarkeit von Finanzstatus und Überweisung | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Feld Eigener Name neu, Aktion Umsätze geändert, Aktion Umbuchen geändert, und 4 weitere |
| UC-001 Finanzstatus anzeigen | Geändert | Ziele geändert, Notizen geändert, Schritt 5 geändert, und 6 weitere |
| BR-0108 Eigener Kontoname nur für Konten der angemeldeten Kundin | Neu | Neu in UC-001 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/finanzstatus.spec`: Das Vergeben eines eigenen Kontonamens ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/finanzstatus.spec`: Die Kundin vergibt dem Tagesgeldkonto den eigenen Namen Urlaubskasse
- `acceptance/specs/finanzstatus.spec`: Ein eigener Name aus nur Leerzeichen wird mit 400 abgelehnt
- `acceptance/specs/finanzstatus.spec`: Ein Konto einer fremden IBAN lässt sich nicht benennen
- `acceptance/specs/finanzstatus.spec`: Ein leerer eigener Name wird mit 400 abgelehnt
- `acceptance/specs/finanzstatus.spec`: Ein unverändert gespeicherter eigener Name wird mit 200 bestätigt
- `acceptance/specs/finanzstatus.spec`: Ein zu langer eigener Name wird mit 400 abgelehnt
- `acceptance/specs/finanzstatus.spec`: Eine IBAN mit falscher Länge wird mit 400 abgelehnt
- `acceptance/specs/finanzstatus.spec`: Ohne vergebenen eigenen Namen bleibt die Spalte leer
- `acceptance/specs/finanzstatus.spec`: Ohne vergebenen eigenen Namen liefert der Dienst für das Konto eigenerName als null
- `acceptance/specs/finanzstatus.spec`: Zwei Konten dürfen denselben eigenen Namen tragen

## Aufgaben für die Umsetzung

- [ ] Konten der angemeldeten Kundin mit Salden und Gesamtvermögen: Beschreibung geändert
- [ ] Eigenen Namen eines Kontos der angemeldeten Kundin setzen: Endpunkt neu
- [ ] Konto: Eigenschaft eigenerName neu
- [ ] KontonameEingabe: Schema neu
- [ ] Konto: Attribut eigenerName neu
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Antwortzeit von Finanzstatus und Überweisung: Anforderung geändert
- [ ] Antwortzeit von Finanzstatus und Überweisung: Maß geändert
- [ ] Antwortzeit von Finanzstatus und Überweisung: Gilt für geändert
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Anforderung geändert
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Maß geändert
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Gilt für geändert
- [ ] Finanzstatus: Feld Eigener Name neu
- [ ] Finanzstatus: Aktion Umsätze geändert
- [ ] Finanzstatus: Aktion Umbuchen geändert
- [ ] Finanzstatus: Aktion Name vergeben neu
- [ ] Finanzstatus: Aktion Speichern neu
- [ ] Finanzstatus: Aktion Abbrechen neu
- [ ] Finanzstatus: Skizze geändert
- [ ] UC-001: Ziele geändert
- [ ] UC-001: Notizen geändert
- [ ] UC-001: Schritt 5 geändert
- [ ] UC-001: Schritt 9 neu
- [ ] UC-001: A1 geändert
- [ ] UC-001: A3 neu: Konto benennen
- [ ] UC-001: A4 neu: Eingabe ungültig
- [ ] UC-001: A5 neu: Konto nicht gefunden
- [ ] UC-001: BR-0108 neu: Eigener Kontoname nur für Konten der angemeldeten Kundin
- [ ] BR-0108: Neu in UC-001
- [ ] Vision: Z-17 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-85 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-85 grün

## Entscheidungen

- Wo erscheint der eigene Kontoname im Finanzstatus: als zusätzliche Spalte neben dem Kontonamen oder an dessen Stelle?
  **Antwort:** Zusätzliche Spalte „Eigener Name“ neben „Kontoname“; ohne vergebenen Namen bleibt die Zelle leer.
  _→ eingearbeitet durch „UC-001: Eigenen Namen je Konto vergeben und im Finanzstatus zeigen“ in Konto, UC-001, BR-NEU1, GET /api/konten, PUT /api/konten/{iban}/name, Schema Konto, Schema KontonameEingabe, finanzstatus, NFR-001, NFR-003, NFR-004, vision_
- Dürfen zwei Konten derselben Kundin denselben eigenen Namen tragen?
  **Antwort:** Ja, gleiche eigene Namen sind erlaubt; die Konten bleiben über Art und IBAN unterscheidbar.
  _→ eingearbeitet durch „UC-001: Eigenen Namen je Konto vergeben und im Finanzstatus zeigen“ in Konto, UC-001, BR-NEU1, GET /api/konten, PUT /api/konten/{iban}/name, Schema Konto, Schema KontonameEingabe, finanzstatus, NFR-001, NFR-003, NFR-004, vision_
- Was passiert, wenn die Kundin im Blatt „Eigenen Namen vergeben“ den bisherigen eigenen Namen unverändert speichert oder nur Leerzeichen eingibt?
  **Antwort:** Unverändert speichern ist erlaubt und antwortet 200 mit „Eigener Name gespeichert.“; nur Leerzeichen ergibt nach dem Entfernen einen leeren Namen und damit 400 „Bitte geben Sie den eigenen Namen an.“.
  _→ eingearbeitet in UC-001, PUT /api/konten/{iban}/name · ca59002_
- Wie verhält sich PUT /api/konten/{iban}/name, wenn die IBAN im Pfad keine 22 Zeichen hat oder der Rumpf kein gültiges JSON ist?
  **Antwort:** Formatfehler nach Datenmodell: 400 mit der Meldung zum Feld, nichts gespeichert (wie bei leerem oder zu langem Namen).
  _→ eingearbeitet in UC-001, PUT /api/konten/{iban}/name · ca59002_
- Soll eigenerName ohne vergebenen Namen als null geliefert werden, als leere Zeichenkette oder das Feld ganz entfallen?
  **Antwort:** Als null; das Feld ist immer vorhanden (Marktstandard für ein Pflichtfeld ohne Wert).
  _→ eingearbeitet in GET /api/konten, Schema Konto, UC-001 · d7293c1_
