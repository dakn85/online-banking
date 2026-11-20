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
| Fachliche Prüfungen doppelt, maßgeblich ist der Dienst | Geändert | Kontext geändert, Entscheidung geändert, Folgen geändert |
| Umbuchung zwischen eigenen Konten ausführen | Neu | Endpunkt neu |
| Konto | Geändert | Eigenschaft art geändert, Beschreibung geändert, Attribut art geändert, Einschränkungen geändert |
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
- `acceptance/specs/umbuchung.spec`: Die Schnittstelle prüft die Kontenpaarung vor der Betragsgrenze und nennt die Meldung zu BR-0088
- `acceptance/specs/umbuchung.spec`: Die Schnittstelle prüft die Zugehörigkeit des Quellkontos vor der Betragsgrenze und lehnt mit 403 ab
- `acceptance/specs/umbuchung.spec`: Ein Betrag über dem Saldo des Tagesgeldkontos wird abgelehnt
- `acceptance/specs/umbuchung.spec`: Ein Betrag über dem verfügbaren Betrag des Girokontos wird abgelehnt
- `acceptance/specs/umbuchung.spec`: Ein Betrag unter 0,10 € wird bei der Umbuchung abgelehnt
- `acceptance/specs/umbuchung.spec`: Ein doppelter Klick auf Umbuchen bucht nur einmal um
- `acceptance/specs/umbuchung.spec`: Ein Quellkonto, das nicht zur Kundin gehört, wird abgelehnt
- `acceptance/specs/umbuchung.spec`: Eine abgelehnte Umbuchung zeigt die Meldung und gibt den Knopf wieder frei
- `acceptance/specs/umbuchung.spec`: Eine Kundin ohne Tagesgeldkonto wird bei der Umbuchung abgelehnt
- `acceptance/specs/umbuchung.spec`: Eine Umbuchung erzeugt einen Umsatz auf beiden Konten
- `acceptance/specs/umbuchung.spec`: Eine Umbuchung vom Girokonto aufs Tagesgeldkonto bucht sofort um
- `acceptance/specs/umbuchung.spec`: Eine Umbuchung vom Tagesgeldkonto zurück aufs Girokonto bucht sofort um
- `acceptance/specs/umbuchung.spec`: Eine wiederholte Anfrage mit derselben Auftrags-Kennung ändert die Salden nicht erneut
- `acceptance/specs/umbuchung.spec`: Nach einer abgelehnten Umbuchung bucht die korrigierte Umbuchung genau einmal um
- `acceptance/specs/umbuchung.spec`: Ohne Anmeldung ist die Umbuchung nicht erreichbar
- `acceptance/specs/umbuchung.spec`: Umbuchen öffnet die Umbuchung aus dem Finanzstatus

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine (docs/architecture.md)
- **Konten und Finanzstatus** (`src/konten.ts`): neue Kontoart Tagesgeldkonto (Demo-Bestand 0,00 €, ohne Dispositionsrahmen), Funktion `umbuchen` mindert Quellsaldo und erhöht Zielsaldo gemeinsam (BR-0091). Gesamtvermögen bleibt Summe aller Salden (BR-0001).
- **Umbuchungsauftrag** (neu `src/umbuchung.ts`, `POST /api/umbuchungen` in `src/main.ts`): Prüfreihenfolge 401, 400 (Format, Mindestbetrag 0,10 €), Wiederholung derselben auftragsId → 200 ohne Buchung (BR-0092), 403 Konto nicht der Kundin, 422 Kontenpaarung (BR-0088), 422 Betragsgrenze (BR-0089). Ablage der Auftrags-Kennungen je Kundin, getrennt von Überweisungen; Reset über `testdaten.ts`.
- **Umsätze** (`src/umsaetze.ts`): je ein Umsatz auf Quell- und Zielkonto (BR-0090) über die vorhandene `buchen`-Funktion.
- **Seitenauslieferung/Oberfläche**: neue Seite `/umbuchung` (`public/seiten/umbuchung.js`) mit Auswahl Quell-/Zielkonto und Betrag, Prüfung im Formular (ADR-004), Knopf während des Absendens gesperrt, neue Auftrags-Kennung nach jeder Ablehnung (BR-0092); Finanzstatus zeigt „Umbuchen“ im Kopf, das Tagesgeldkonto und die Meldung „Umbuchung ausgeführt.“ (UC-001, UC-021).

## Schritte
1. Konten: Tagesgeldkonto je Demo-Kundin, `umbuchen` (UC-001, BR-0091).
2. `umbuchung.ts` und Endpunkt (UC-021, BR-0088, BR-0089, BR-0090, BR-0092, NFR-001, NFR-002).
3. Oberfläche Umbuchung und Finanzstatus (UC-021 Schritte 1–8, A1–A6).
4. Gauge-Schritte in `acceptance/tests/StepImplementation.ts`; Unit-Tests `test/umbuchung.test.ts` mit BR-IDs im Namen.

## Rahmenänderung
Keine neuen Bibliotheken oder Muster.

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
- Das Szenario „Eine Kundin ohne Tagesgeldkonto wird bei der Umbuchung abgelehnt“ (acceptance/specs/umbuchung.spec:201) meldet "lasttest-001" mit der PIN "24680" an. Nach docs/architecture.md (Abschnitt Testdaten) haben die Lastkunden aber die PIN aus LASTTEST_PIN, Vorgabe 97531; 24680 ist die PIN von Lena. Die Anmeldung scheitert, die Umbuchung ist nicht erreichbar, das Szenario bleibt rot. Die Szenarien dürfen wir nicht ändern. Wie soll es grün werden? Alles andere (19 von 20 Szenarien, 163 von 164 im ganzen Lauf) ist grün.
  **Antwort:** Szenario ändern: PIN "97531" (Vorgabe der Lastkunden) statt "24680"
  _→ eingearbeitet_
