# PK-58: Umbuchung zwischen eigenen Konten

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich Geld zwischen meinem Girokonto und meinem Tagesgeldkonto sofort umbuchen, ohne TAN und ohne IBAN-Eingabe, damit ich mein Geld schnell dort habe, wo ich es brauche.

## Nicht im Scope

- Terminierte oder wiederkehrende Umbuchung: Die Idee verlangt nur die sofortige Umbuchung.
- Umbuchung zu fremden Konten oder per IBAN: Die Idee beschränkt sich auf eigene Konten ohne IBAN-Eingabe; Fremdüberweisungen deckt UC-002 ab.
- Tageslimit für Umbuchungen: Das Tageslimit (UC-015) gilt für Überweisungen; die Idee nennt es für Umbuchungen nicht.
- Benachrichtigungen zur Umbuchung: Keine Benachrichtigung in der Idee gefordert.
- Stornierung oder Änderung einer Umbuchung: Die Idee nennt nur das Ausführen.
- Zusätzliche Bestätigungsmaske: Die Idee verlangt eine sofortige Umbuchung; eine Zwischenbestätigung wäre nicht angefragt.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umbuchung zwischen eigenen Konten ausführen | Neu | Endpunkt neu |
| Konto | Geändert | Eigenschaft art geändert, Beschreibung geändert, Attribut art geändert, Einschränkungen neu |
| Umbuchungsauftrag | Neu | Schema neu |
| Umbuchung | Neu | Schema neu, Entität neu, Maske neu |
| Architektur | Geändert | Einführung und Ziele geändert, Kontextabgrenzung geändert, Bausteinsicht geändert, und 1 weitere |
| Umsatz | Geändert | Beschreibung geändert |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Genau einmalige Ausführung einer Überweisung oder Umbuchung | Geändert | Titel geändert, Anforderung geändert, Maß geändert, und 1 weitere |
| Finanzstatus | Geändert | Use Case UC-021 neu, Aktion Umbuchen neu, Skizze geändert |
| UC-001 Finanzstatus anzeigen | Geändert | Schritt 10 neu |
| UC-021 Umbuchung zwischen eigenen Konten | Neu | Use Case neu |
| BR-0088 Umbuchung nur zwischen verschiedenen eigenen Konten | Neu | Neu in UC-021 |
| BR-0089 Betragsgrenze des Quellkontos | Neu | Neu in UC-021 |
| BR-0090 Umsatz einer Umbuchung | Neu | Neu in UC-021 |
| BR-0091 Saldo nach der Umbuchung | Neu | Neu in UC-021 |
| BR-0092 Genau einmalige Ausführung der Umbuchung | Neu | Neu in UC-021 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/umbuchung.spec`: Dasselbe Konto als Quell- und Zielkonto wird abgelehnt
- `acceptance/specs/umbuchung.spec`: Der Finanzstatus zeigt das Tagesgeldkonto mit Saldo 0,00 € und unverändertem Gesamtvermögen
- `acceptance/specs/umbuchung.spec`: Die Schnittstelle lehnt dasselbe Konto als Quell- und Zielkonto mit 422 ab
- `acceptance/specs/umbuchung.spec`: Die Schnittstelle lehnt einen Betrag unter 0,10 € mit 400 ab
- `acceptance/specs/umbuchung.spec`: Ein Betrag über dem Saldo des Tagesgeldkontos wird abgelehnt
- `acceptance/specs/umbuchung.spec`: Ein Betrag über dem verfügbaren Betrag des Girokontos wird abgelehnt
- `acceptance/specs/umbuchung.spec`: Ein Betrag unter 0,10 € wird bei der Umbuchung abgelehnt
- `acceptance/specs/umbuchung.spec`: Ein doppelter Klick auf Umbuchen bucht nur einmal um
- `acceptance/specs/umbuchung.spec`: Ein Quellkonto, das nicht zur Kundin gehört, wird abgelehnt
- `acceptance/specs/umbuchung.spec`: Eine abgelehnte Umbuchung zeigt die Meldung und gibt den Knopf wieder frei
- `acceptance/specs/umbuchung.spec`: Eine Umbuchung erzeugt einen Umsatz auf beiden Konten
- `acceptance/specs/umbuchung.spec`: Eine Umbuchung vom Girokonto aufs Tagesgeldkonto bucht sofort um
- `acceptance/specs/umbuchung.spec`: Eine Umbuchung vom Tagesgeldkonto zurück aufs Girokonto bucht sofort um
- `acceptance/specs/umbuchung.spec`: Eine wiederholte Anfrage mit derselben Auftrags-Kennung ändert die Salden nicht erneut
- `acceptance/specs/umbuchung.spec`: Nach einer abgelehnten Umbuchung bucht die korrigierte Umbuchung genau einmal um
- `acceptance/specs/umbuchung.spec`: Ohne Anmeldung ist die Umbuchung nicht erreichbar
- `acceptance/specs/umbuchung.spec`: Umbuchen öffnet die Umbuchung aus dem Finanzstatus

## Aufgaben für die Umsetzung

- [ ] Umbuchung zwischen eigenen Konten ausführen: Endpunkt neu
- [ ] Konto: Eigenschaft art geändert
- [ ] Umbuchungsauftrag: Schema neu
- [ ] Umbuchung: Schema neu
- [ ] Architektur: Einführung und Ziele geändert
- [ ] Architektur: Kontextabgrenzung geändert
- [ ] Architektur: Bausteinsicht geändert
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Konto: Beschreibung geändert
- [ ] Konto: Attribut art geändert
- [ ] Konto: Einschränkungen neu
- [ ] Umsatz: Beschreibung geändert
- [ ] Umbuchung: Entität neu
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Genau einmalige Ausführung einer Überweisung oder Umbuchung: Titel geändert
- [ ] Genau einmalige Ausführung einer Überweisung oder Umbuchung: Anforderung geändert
- [ ] Genau einmalige Ausführung einer Überweisung oder Umbuchung: Maß geändert
- [ ] Genau einmalige Ausführung einer Überweisung oder Umbuchung: Gilt für geändert
- [ ] Finanzstatus: Use Case UC-021 neu
- [ ] Finanzstatus: Aktion Umbuchen neu
- [ ] Finanzstatus: Skizze geändert
- [ ] Umbuchung: Maske neu
- [ ] UC-001: Schritt 10 neu
- [ ] UC-021: Use Case neu
- [ ] BR-0088: Neu in UC-021
- [ ] BR-0089: Neu in UC-021
- [ ] BR-0090: Neu in UC-021
- [ ] BR-0091: Neu in UC-021
- [ ] BR-0092: Neu in UC-021
- [ ] Vision: Zweck geändert
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-58 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-58 grün

## Entscheidungen

- Das Tagesgeldkonto gibt es im System noch nicht (Kontoart nur Girokonto und Kreditkarte). Wie ist es im Ausgangsstand der Testdaten vorhanden?
  **Antwort:** Neue Kontoart Tagesgeldkonto, bei beiden Demo-Kundinnen mit Saldo 0,00 €; das Gesamtvermögen im Ausgangsstand und die bestehenden Tests bleiben unverändert, Lastkunden bekommen keins.
  _→ eingearbeitet in UC-021, BR-0088, BR-0089, BR-0090, BR-0091, BR-0092, UC-001, Konto, Umsatz, Umbuchung, POST /api/umbuchungen, Schema Konto, Schema Umbuchungsauftrag, Schema Umbuchung, umbuchung, finanzstatus, NFR-001, NFR-002, vision, architektur · c664082_
- Wie weit darf das Quellkonto bei einer Umbuchung belastet werden?
  **Antwort:** Girokonto bis zum verfügbaren Betrag (Saldo plus Dispositionsrahmen, wie bei der Überweisung), Tagesgeldkonto nur bis zum Saldo, da es keinen Dispositionsrahmen hat.
  _→ eingearbeitet in UC-021, BR-0088, BR-0089, BR-0090, BR-0091, BR-0092, UC-001, Konto, Umsatz, Umbuchung, POST /api/umbuchungen, Schema Konto, Schema Umbuchungsauftrag, Schema Umbuchung, umbuchung, finanzstatus, NFR-001, NFR-002, vision, architektur · c664082_
- Gegenpartei und Verwendungszweck sind beim Umsatz Pflicht. Was steht bei den beiden Umsätzen einer Umbuchung dort?
  **Antwort:** Fester Text: Gegenpartei ist der Kontoname des anderen eigenen Kontos, Verwendungszweck ist „Umbuchung“; die Kundin gibt keinen Text ein.
  _→ eingearbeitet in UC-021, BR-0088, BR-0089, BR-0090, BR-0091, BR-0092, UC-001, Konto, Umsatz, Umbuchung, POST /api/umbuchungen, Schema Konto, Schema Umbuchungsauftrag, Schema Umbuchung, umbuchung, finanzstatus, NFR-001, NFR-002, vision, architektur · c664082_
- In welcher Reihenfolge prüft der Dienst bei POST /api/umbuchungen, und welchen Text zeigt die Oberfläche bei 400 und 422? Das betrifft vor allem Anfragen, die mehrere Regeln verletzen (z. B. Betrag unter 0,10 € bei gleichem Konto, fremde IBAN mit zu hohem Betrag, Kreditkarte mit zu hohem Betrag).
  **Antwort:** Reihenfolge: 401, 400 (Format inkl. Betrag unter 0,10 €), 403 (Konto nicht der Kundin), 422 BR-0088 (Kontenpaarung), 422 BR-0089 (Betragsgrenze). Der Dienst liefert im Feld fehler jeweils den Fachtext aus UC-021, die Oberfläche zeigt bei 400 und 422 diesen Text im Formular und ordnet nicht nach Status zu. 400 ohne Mindestbetrag-Ursache (Formatfehler von IBAN oder auftragsId) zeigt die allgemeine M
  _→ noch nicht in der Spezifikation_
