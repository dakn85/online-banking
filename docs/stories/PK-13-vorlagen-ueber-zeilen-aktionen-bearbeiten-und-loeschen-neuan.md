# PK-13: Vorlagen über Zeilen-Aktionen bearbeiten und löschen, Neuanlage im Dialog

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich jede Empfängervorlage über Symbole in ihrer Zeile bearbeiten und löschen und neue Vorlagen über „Neue Vorlage“ in einem Dialog anlegen, damit ich nicht mit Auswahlfeldern und drei Formularen auf der Seite arbeiten muss. In der Maske Empfängervorlagen entfallen dafür der Abschnitt „Vorlage umbenennen“ mit den Feldern „Vorlage zum Umbenennen“ und „Neuer Name“ und das Feld „Vorlage zum Löschen“.

## Nicht im Scope

Keine Änderung an den Regeln BR-0013 bis BR-0018, an der Entität Empfaengervorlage und an den Endpunkten; kein Bearbeiten von IBAN oder Verwendungszweck; keine Änderung an der Überweisung (BR-0017). In der Maske Empfängervorlagen entfallen der Abschnitt „Vorlage umbenennen“ mit den Feldern „Vorlage zum Umbenennen“ und „Neuer Name“ und das Feld „Vorlage zum Löschen“: Die Vorlage wird über die Aktionen in ihrer Zeile gewählt, der Dialog „Vorlage bearbeiten“ führt nur das Feld Name, und der Dialog „Vorlage löschen“ nennt die gewählte Vorlage mit ihrem Namen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Empfängervorlage umbenennen | Geändert | Antwort 404 geändert |
| Empfängervorlage löschen | Geändert | Antwort 404 geändert |
| Empfängervorlagen | Geändert | Feld Vorlage zum Umbenennen entfällt, Feld Neuer Name entfällt, Feld Vorlage zum Löschen entfällt, und 3 weitere |
| UC-004 Empfängervorlagen verwalten | Geändert | Notizen geändert, Schritt 2 geändert, Schritt 3 geändert, und 6 weitere |

## Akzeptanztests

- `acceptance/specs/empfaengervorlagen.spec`: Der Abbruch der Löschabfrage lässt die Vorlage bestehen
- `acceptance/specs/empfaengervorlagen.spec`: Der Abbruch im Dialog „Vorlage bearbeiten“ ändert den Namen nicht
- `acceptance/specs/empfaengervorlagen.spec`: Der Dialog „Vorlage bearbeiten“ führt nur das Feld Name
- `acceptance/specs/empfaengervorlagen.spec`: Der Löschdialog nennt die gewählte Vorlage mit ihrem Namen
- `acceptance/specs/empfaengervorlagen.spec`: Die Empfängervorlagen zeigen weder Auswahlfeld noch Umbenennen-Formular
- `acceptance/specs/empfaengervorlagen.spec`: Die Höchstzahl von 50 Empfängervorlagen wird beim Anlegen geprüft
- `acceptance/specs/empfaengervorlagen.spec`: Ein Name, der sich nur in der Groß-/Kleinschreibung unterscheidet, gilt als vergeben
- `acceptance/specs/empfaengervorlagen.spec`: Ein vergebener Name wird auch bei 50 Vorlagen als Konflikt abgelehnt
- `acceptance/specs/empfaengervorlagen.spec`: Eine abgebrochene Neuanlage legt keine Vorlage an
- `acceptance/specs/empfaengervorlagen.spec`: Eine inzwischen gelöschte Vorlage lässt sich nicht löschen
- `acceptance/specs/empfaengervorlagen.spec`: Eine inzwischen gelöschte Vorlage lässt sich nicht umbenennen
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage lässt sich auf ihren eigenen Namen umbenennen
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage mit IBAN außerhalb des SEPA-Raums wird abgelehnt
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage mit schon vergebenem Namen wird abgelehnt
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/empfaengervorlagen.spec`: Eine Vorlage wird umbenannt und behält IBAN und Verwendungszweck
- `acceptance/specs/empfaengervorlagen.spec`: Jede Empfängervorlage zeigt die Aktionen Bearbeiten und Löschen in ihrer Zeile
- `acceptance/specs/umsaetze.spec`: Die Umsätze der Kreditkarte zeigen drei Buchungen

## Aufgaben für die Umsetzung

- [ ] Empfängervorlage umbenennen: Antwort 404 geändert
- [ ] Empfängervorlage löschen: Antwort 404 geändert
- [ ] Empfängervorlagen: Feld Vorlage zum Umbenennen entfällt
- [ ] Empfängervorlagen: Feld Neuer Name entfällt
- [ ] Empfängervorlagen: Feld Vorlage zum Löschen entfällt
- [ ] Empfängervorlagen: Aktion Neue Vorlage neu
- [ ] Empfängervorlagen: Aktion Bearbeiten neu
- [ ] Empfängervorlagen: Skizze geändert
- [ ] UC-004: Notizen geändert
- [ ] UC-004: Schritt 2 geändert
- [ ] UC-004: Schritt 3 geändert
- [ ] UC-004: Schritt 4 geändert
- [ ] UC-004: Schritt 5 geändert
- [ ] UC-004: A4 geändert
- [ ] UC-004: A5 geändert
- [ ] UC-004: A7 neu: Dialog ohne Speichern schließen
- [ ] UC-004: A8 neu: Vorlage der Zeile gibt es nicht mehr
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-13 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-13 grün

## Entscheidungen

- Soll der Dialog „Vorlage bearbeiten“ auch IBAN und Verwendungszweck änderbar machen?
  **Antwort:** Nur der Name ist änderbar, PATCH bleibt wie heute.
  _→ eingearbeitet in UC-004 · 88a26fd_
- Wie sollen die Dialoge in der Spezifikation geführt werden?
  **Antwort:** Als Gruppen auf der Seite „Empfängervorlagen“, im Bau als Modale.
  _→ eingearbeitet in UC-004 · 41debc7_
- Wo erscheinen die Fehlermeldungen zu Name, IBAN und Höchstzahl?
  **Antwort:** Im geöffneten Dialog, der offen bleibt.
  _→ eingearbeitet in UC-004 · 37840b3_
- Soll der Löschdialog die gewählte Vorlage mit Namen nennen?
  **Antwort:** Ja, mit dem Namen der Vorlage.
  _→ eingearbeitet in UC-004, empfaengervorlagen · b742cd3_
- Der Dialog „Vorlage bearbeiten“ wird aus der Zeile einer Vorlage geöffnet; die angezeigte Liste kann veraltet sein (Vorlage in einem anderen Tab gelöscht) oder die Zeile stammt aus einer fremden Sitzung. Was tut das System, wenn PATCH /api/empfaengervorlagen/{vorlagenId} mit 404 antwortet („Keine Vorlage der Kundin mit dieser Kennung“)? (PATCH /api/empfaengervorlagen/{vorlagenId}, vorlagenId)
  **Antwort:** Der Dialog schließt sich ohne Speichern, die Liste wird neu geladen (die Zeile verschwindet) und die Seite zeigt die Meldung des Dienstes „Diese Empfängervorlage gibt es nicht.“; die Namenseingabe geht verloren, „Empfängervorlage umbenannt.“ erscheint nicht.
  _→ eingearbeitet in UC-004, PATCH /api/empfaengervorlagen/{vorlagenId}, empfaengervorlagen · 1606169_
- Der Dialog „Vorlage löschen“ bestätigt die Vorlage aus der Zeile. Was tut das System, wenn DELETE /api/empfaengervorlagen/{vorlagenId} mit 404 antwortet – die Vorlage wurde inzwischen gelöscht oder die Bestätigung doppelt ausgelöst, oder die Kennung gehört einer anderen Kundin? (DELETE /api/empfaengervorlagen/{vorlagenId}, vorlagenId)
  **Antwort:** Der Knopf „Löschen“ wird nach dem ersten Klick gesperrt, sodass je Bestätigung genau ein DELETE gesendet wird. Antwortet der Dienst dennoch 404, schließt sich der Dialog, die Liste wird neu geladen und die Seite zeigt „Diese Empfängervorlage gibt es nicht.“; „Empfängervorlage gelöscht.“ erscheint nicht.
  _→ eingearbeitet in UC-004, empfaengervorlagen · a07ebfd_
- Zeigt die Seite bei 404 im Löschfall wörtlich „Diese Empfängervorlage gibt es nicht.“?
  **Antwort:** Ja, den Text des Dienstes aus dem Feld fehler anzeigen.
  _→ eingearbeitet in UC-004 · ec00118_
- Die Story verlangt, dass die Seite bei 404 im Löschfall wörtlich den Text des Dienstes aus fehler anzeigt („Diese Empfängervorlage gibt es nicht.“). Der Vertrag von DELETE beschreibt die 404-Antwort nur als „Keine Vorlage der Kundin mit dieser Kennung“ und legt keinen Text fest, anders als PATCH, dessen 404 die Meldung ausdrücklich trägt. Welchen Text soll der Dienst im Feld fehler der 404-Antwort auf DELETE liefern? (Aussage „Die 404-Antwort auf DELETE trägt als fehler wörtlich „Diese Empfängervorlage gib“)
  **Antwort:** DELETE-404 trägt wie PATCH wörtlich „Diese Empfängervorlage gibt es nicht.“; die Seite zeigt diesen Text unverändert an (empfohlen)
  _→ eingearbeitet in DELETE /api/empfaengervorlagen/{vorlagenId} · 3d527c9_
