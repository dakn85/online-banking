# PK-7: Empfängervorlagen für die Überweisung

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich Empfänger als Vorlage mit Name, IBAN und optional Verwendungszweck speichern, umbenennen und löschen und sie bei der Überweisung auswählen, damit ich wiederkehrende Empfänger nicht neu eintippe.

## Nicht im Scope

Termin- und Daueraufträge; Adressbuch mit mehreren Konten je Empfänger; Teilen von Vorlagen zwischen Kundinnen; Import und Export von Vorlagen; Vorlagen aus einer Kernbank; Umsätze und Kontobewegungen (Story PK-6).

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Empfängervorlagen der angemeldeten Kundin | Neu | Endpunkt neu |
| Empfängervorlage anlegen | Neu | Endpunkt neu |
| Empfängervorlage umbenennen | Neu | Endpunkt neu |
| Empfängervorlage löschen | Neu | Endpunkt neu |
| Empfaengervorlage | Neu | Schema neu, Entität neu |
| NeueEmpfaengervorlage | Neu | Schema neu |
| EmpfaengervorlageName | Neu | Schema neu |
| Empfängervorlagen | Neu | Maske neu |
| Überweisung | Geändert | Feld Vorlage neu, Aktion Vorlagen verwalten neu, Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | Schritt 2 geändert, A7 neu: Empfänger aus Vorlage wählen, Sequenzdiagramm geändert, und 1 weitere |
| BR-0017 Empfänger aus Vorlage übernehmen | Neu | Neu in UC-002 |
| UC-004 Empfängervorlagen verwalten | Neu | Use Case neu |
| BR-0013 Name der Empfängervorlage | Neu | Neu in UC-004 |
| BR-0014 IBAN der Empfängervorlage | Neu | Neu in UC-004 |
| BR-0015 Höchstzahl von 50 Empfängervorlagen | Neu | Neu in UC-004 |
| BR-0016 Vorlagen der angemeldeten Kundin | Neu | Neu in UC-004 |
| Vision | Geändert | Abschnitt „Ziele“ geändert |

## Akzeptanztests

- `acceptance/specs/empfaengervorlagen.spec`: Die Höchstzahl von 50 Empfängervorlagen wird beim Anlegen geprüft
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage mit IBAN außerhalb des SEPA-Raums wird abgelehnt
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage mit schon vergebenem Namen wird abgelehnt
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage wird umbenannt und behält IBAN und Verwendungszweck
- `acceptance/specs/ueberweisung.spec`: Eine gewählte Empfängervorlage belegt Empfänger, IBAN und Verwendungszweck
- `acceptance/specs/ueberweisung.spec`: Eine Vorlage ohne Verwendungszweck lässt das Feld Verwendungszweck leer

## Aufgaben für die Umsetzung

- [ ] Empfängervorlagen der angemeldeten Kundin: Endpunkt neu
- [ ] Empfängervorlage anlegen: Endpunkt neu
- [ ] Empfängervorlage umbenennen: Endpunkt neu
- [ ] Empfängervorlage löschen: Endpunkt neu
- [ ] Empfaengervorlage: Schema neu
- [ ] NeueEmpfaengervorlage: Schema neu
- [ ] EmpfaengervorlageName: Schema neu
- [ ] Empfaengervorlage: Entität neu
- [ ] Empfängervorlagen: Maske neu
- [ ] Überweisung: Feld Vorlage neu
- [ ] Überweisung: Aktion Vorlagen verwalten neu
- [ ] Überweisung: Skizze geändert
- [ ] UC-002: Schritt 2 geändert
- [ ] UC-002: A7 neu: Empfänger aus Vorlage wählen
- [ ] UC-002: Sequenzdiagramm geändert
- [ ] UC-002: BR-0017 neu: Empfänger aus Vorlage übernehmen
- [ ] BR-0017: Neu in UC-002
- [ ] UC-004: Use Case neu
- [ ] BR-0013: Neu in UC-004
- [ ] BR-0014: Neu in UC-004
- [ ] BR-0015: Neu in UC-004
- [ ] BR-0016: Neu in UC-004
- [ ] Vision: Z-6 neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-7 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-7 grün

## Entscheidungen

- Wo speichert die Kundin einen Empfänger als Vorlage?
  **Antwort:** Nur in der Maske „Empfängervorlagen“, die Überweisung wählt nur aus.
  _→ eingearbeitet in vision, UC-004, BR-0013, BR-0014, BR-0015, BR-0016, UC-002, BR-0017, Empfaengervorlage, GET /api/empfaengervorlagen, POST /api/empfaengervorlagen, PATCH /api/empfaengervorlagen/{vorlagenId}, DELETE /api/empfaengervorlagen/{vorlagenId}, Schema Empfaengervorlage, Schema NeueEmpfaengervorlage, Schema EmpfaengervorlageName, empfaengervorlagen, ueberweisung · 126f2d4_
- Darf eine Kundin zwei Vorlagen mit demselben Namen führen?
  **Antwort:** Nein, der Name ist je Kundin eindeutig und eine Doppelung wird abgelehnt.
  _→ eingearbeitet in vision, UC-004, BR-0013, BR-0014, BR-0015, BR-0016, UC-002, BR-0017, Empfaengervorlage, GET /api/empfaengervorlagen, POST /api/empfaengervorlagen, PATCH /api/empfaengervorlagen/{vorlagenId}, DELETE /api/empfaengervorlagen/{vorlagenId}, Schema Empfaengervorlage, Schema NeueEmpfaengervorlage, Schema EmpfaengervorlageName, empfaengervorlagen, ueberweisung · 126f2d4_
- Wie wird die Höchstzahl durchgesetzt und wie wird sie im Test erreichbar?
  **Antwort:** Der Dienst lehnt die 51. Vorlage ab; der Ausgangsstand führt für jonas.weber 50 Vorlagen.
  _→ eingearbeitet in vision, UC-004, BR-0013, BR-0014, BR-0015, BR-0016, UC-002, BR-0017, Empfaengervorlage, GET /api/empfaengervorlagen, POST /api/empfaengervorlagen, PATCH /api/empfaengervorlagen/{vorlagenId}, DELETE /api/empfaengervorlagen/{vorlagenId}, Schema Empfaengervorlage, Schema NeueEmpfaengervorlage, Schema EmpfaengervorlageName, empfaengervorlagen, ueberweisung · 126f2d4_
- Bleibt der Verwendungszweck in der Überweisung Pflicht, wenn die Vorlage keinen hat?
  **Antwort:** Ja, der Verwendungszweck bleibt Pflicht; das Feld bleibt leer und wird gefüllt.
  _→ eingearbeitet in vision, UC-004, BR-0013, BR-0014, BR-0015, BR-0016, UC-002, BR-0017, Empfaengervorlage, GET /api/empfaengervorlagen, POST /api/empfaengervorlagen, PATCH /api/empfaengervorlagen/{vorlagenId}, DELETE /api/empfaengervorlagen/{vorlagenId}, Schema Empfaengervorlage, Schema NeueEmpfaengervorlage, Schema EmpfaengervorlageName, empfaengervorlagen, ueberweisung · 126f2d4_
- Soll das Löschen einer Vorlage ohne Sicherheitsabfrage geschehen?
  **Antwort:** Erst nach einer Sicherheitsabfrage „Vorlage löschen?“.
  _→ eingearbeitet in UC-004, empfaengervorlagen · 45d8caa_
- Wie vergleicht der Dienst den Namen auf Eindeutigkeit je Kundin – gelten „Möbel Nord GmbH“, „möbel nord gmbh“ und „Möbel Nord GmbH “ als derselbe Name, und was wird gespeichert? (POST /api/empfaengervorlagen, name)
  **Antwort:** Vergleich normalisiert: führende und folgende Leerzeichen entfernt, Groß-/Kleinschreibung nicht beachtet; gespeichert und angezeigt wird die Eingabe der Kundin. Bei Gleichheit antwortet der Dienst 409 mit „Eine Vorlage mit diesem Namen gibt es bereits.“, die bestehende Vorlage bleibt unverändert; gilt für Anlegen und Umbenennen.
  _→ noch nicht in der Spezifikation_
- In welcher Reihenfolge prüft der Dienst beim Anlegen, wenn der Name bereits vergeben ist und die Kundin schon 50 Vorlagen hat – 409 oder 422? (POST /api/empfaengervorlagen, name)
  **Antwort:** Pflicht-/Formatprüfungen zuerst (400), dann Eindeutigkeit (409), zuletzt Höchstzahl (422): ein vergebener Name ergibt auch bei 50 Vorlagen 409 mit „Eine Vorlage mit diesem Namen gibt es bereits.“
  _→ noch nicht in der Spezifikation_
- Was gilt, wenn die Kundin den Verwendungszweck leer lässt oder nur Leerzeichen eingibt? (POST /api/empfaengervorlagen, verwendungszweck)
  **Antwort:** Leer oder nur Leerzeichen = kein Verwendungszweck: der Dienst speichert keinen Wert, das Feld verwendungszweck fehlt in der Antwort und in der Liste; wird bei der Überweisung aus der Vorlage belegt, bleibt das Feld leer und die Kundin muss es füllen.
  _→ noch nicht in der Spezifikation_
- Was antwortet der Dienst, wenn die Kundin eine Vorlage auf den Namen umbenennt, den sie selbst schon trägt? (PATCH /api/empfaengervorlagen/{vorlagenId}, name)
  **Antwort:** 200 mit der unveränderten Vorlage: die Eindeutigkeitsprüfung schließt die eigene Vorlage aus, Umbenennen auf denselben Namen ist kein Konflikt.
  _→ noch nicht in der Spezifikation_
