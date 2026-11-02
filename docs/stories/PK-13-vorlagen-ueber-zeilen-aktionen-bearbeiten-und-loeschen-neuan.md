# PK-13: Vorlagen über Zeilen-Aktionen bearbeiten und löschen, Neuanlage im Dialog

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich jede Empfängervorlage über Symbole in ihrer Zeile bearbeiten und löschen und neue Vorlagen über „Neue Vorlage“ in einem Dialog anlegen, damit ich nicht mit Auswahlfeldern und drei Formularen auf der Seite arbeiten muss.

## Nicht im Scope

Keine Änderung an den Regeln BR-0013 bis BR-0018, an der Entität Empfaengervorlage und an den Endpunkten; kein Bearbeiten von IBAN oder Verwendungszweck; keine Änderung an der Überweisung (BR-0017).

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Empfängervorlagen | Geändert | Feld Vorlage zum Umbenennen entfällt, Feld Neuer Name entfällt, Feld Vorlage zum Löschen entfällt, und 3 weitere |
| UC-004 Empfängervorlagen verwalten | Geändert | Notizen geändert, Schritt 2 geändert, Schritt 3 geändert, und 5 weitere |

## Akzeptanztests

- `acceptance/specs/empfaengervorlagen.spec`: Der Löschdialog nennt die gewählte Vorlage mit ihrem Namen
- `acceptance/specs/empfaengervorlagen.spec`: Eine abgebrochene Neuanlage legt keine Vorlage an
- `acceptance/specs/empfaengervorlagen.spec`: Jede Empfängervorlage zeigt die Aktionen Bearbeiten und Löschen in ihrer Zeile

## Aufgaben für die Umsetzung

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
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-13 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-13 grün

## Entscheidungen

- Soll der Dialog „Vorlage bearbeiten“ auch IBAN und Verwendungszweck änderbar machen?
  **Antwort:** Nur der Name ist änderbar, PATCH bleibt wie heute.
  _→ eingearbeitet in UC-004 · 88a26fd_
- Wie sollen die Dialoge in der Spezifikation geführt werden?
  **Antwort:** Als Gruppen auf der Seite „Empfängervorlagen“, im Bau als Modale.
  _→ eingearbeitet in UC-004_
- Wo erscheinen die Fehlermeldungen zu Name, IBAN und Höchstzahl?
  **Antwort:** Im geöffneten Dialog, der offen bleibt.
  _→ eingearbeitet in UC-004 · 37840b3_
- Soll der Löschdialog die gewählte Vorlage mit Namen nennen?
  **Antwort:** Ja, mit dem Namen der Vorlage.
  _→ eingearbeitet in UC-004, empfaengervorlagen · b742cd3_
