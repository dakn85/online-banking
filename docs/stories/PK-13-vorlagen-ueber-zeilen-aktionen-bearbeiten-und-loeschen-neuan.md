# PK-13: Vorlagen über Zeilen-Aktionen bearbeiten und löschen, Neuanlage im Dialog

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich jede Empfängervorlage über Symbole in ihrer Zeile bearbeiten und löschen und neue Vorlagen über „Neue Vorlage“ in einem Dialog anlegen, damit ich nicht mit Auswahlfeldern und drei Formularen auf der Seite arbeiten muss.

## Nicht im Scope

Keine Änderung an den Regeln BR-0013 bis BR-0018, an der Entität Empfaengervorlage und an den Endpunkten; kein Bearbeiten von IBAN oder Verwendungszweck; keine Änderung an der Überweisung (BR-0017).

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-13 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-13 grün

## Offene Fragen

- [ ] Wie sollen die Dialoge in der Spezifikation geführt werden?
- [ ] Wo erscheinen die Fehlermeldungen zu Name, IBAN und Höchstzahl?
- [ ] Soll der Löschdialog die gewählte Vorlage mit Namen nennen?

## Entscheidungen

- Soll der Dialog „Vorlage bearbeiten“ auch IBAN und Verwendungszweck änderbar machen?
  **Antwort:** Nur der Name ist änderbar, PATCH bleibt wie heute.
  _→ eingearbeitet in UC-004, empfaengervorlagen_
