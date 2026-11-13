# Architektur: Online-Banking

## 1. Einführung und Ziele

Aufgabe, Ziele und Stakeholder stehen in `docs/vision.md`.

Das Online-Banking der Aventa Bank ist ein einzelner Dienst, der die Oberfläche für Privatkundinnen mit ausliefert: Anmeldung mit Kennung und PIN, Finanzstatus (UC-001) und einmalige Überweisung vom Girokonto (UC-002). Konten und Kunden sind Demo-Daten (C-001), ein Kernbanksystem gibt es nicht. Oberfläche und API liegen in einem Dienst, damit der Demo-Betrieb ohne getrenntes Frontend auskommt (ADR-001).

## 2. Randbedingungen

Die Leitplanken des Hauses stehen in `docs/leitplanken.md`, die Randbedingungen des Systems (C-…) in `docs/requirements.md`.

- **Auslieferung:** Der Dienst wird als Container ausgeliefert, spricht HTTP und beendet kein TLS; die Verschlüsselung endet vor dem Dienst.

## 3. Kontextabgrenzung

```mermaid
C4Context
    title "Systemkontext Online-Banking"
    Person(kundin, "Privatkundin", "meldet sich mit Kennung und PIN an, sieht ihren Finanzstatus, überweist vom Girokonto")
    System(banking, "Online-Banking", "Dienst mit ausgelieferter Oberfläche: Anmeldung, Sitzung, Konten, Überweisung")
    Rel(kundin, banking, "nutzt im Browser", "HTTP, HTML und JSON")
```

| Gegenüber | Richtung | Daten | Schnittstelle |
| --- | --- | --- | --- |
| Privatkundin | beide | Kennung und PIN; Konten, Salden, Gesamtvermögen; Überweisungsauftrag | Browser, HTML und JSON unter /api |

Es gibt kein Kernbanksystem, keine Marktdatenquelle, kein Messaging und keinen weiteren Dienst; der Dienst arbeitet allein und führt den Kontenbestand selbst.

## 4. Lösungsstrategie

| Schicht | Technik | Hauptversion |
| --- | --- | --- |
| Laufzeit | Node, LTS-Alpine-Image | 22 |
| Sprache | TypeScript, strict, ES2022, CommonJS | 5.9 |
| HTTP | Express | 4 |
| Oberfläche | HTML, CSS, JavaScript ohne Bibliothek und ohne Bundler | keine |
| Test | Gauge mit Playwright im Browser, node:test für die Module | Gauge 0.3 |
| Auslieferung | Mehrstufiges Container-Image, Laufzeit nur mit Produktionsabhängigkeiten | Node 22 |

Prägende Grundentscheidungen:

1. Ein Dienst liefert Oberfläche und API aus, kein getrenntes Frontend und kein Bundler (ADR-001).
2. Zustand liegt nur im Speicher, ein fester Ausgangsstand ist über den Testbetrieb wiederherstellbar (ADR-002).
3. Genau einmalige Ausführung bucht über die von der Oberfläche vergebene Auftrags-Kennung (ADR-003).
4. Fachliche Prüfungen stehen doppelt, im Browser und im Dienst; maßgeblich ist der Dienst (ADR-004).
5. Geldbeträge sind Zahlen in Euro, jede Rechnung wird auf Cent gerundet (ADR-005).
6. Akzeptanztests laufen mit Gauge und Playwright gegen eine laufende Testumgebung und prüfen den Stand über die Versionsantwort (ADR-006).

## 5. Bausteinsicht

```mermaid
C4Container
    title "Container des Online-Bankings"
    Person(kundin, "Privatkundin", "Browser")
    System_Boundary(banking, "Online-Banking") {
        Container(oberflaeche, "Oberfläche im Browser", "HTML, CSS, JavaScript ohne Bibliothek", "Anmeldung, Finanzstatus, Überweisung, Prüfungen im Browser, Anzeige")
        Container(dienst, "Online-Banking-Dienst", "Node 22, TypeScript, Express", "Anmeldung, Sitzung, Konten, Überweisung, Auslieferung der Seiten")
    }
    Rel(kundin, oberflaeche, "bedient", "Browser")
    Rel(kundin, dienst, "lädt Seiten", "HTTP")
    Rel(oberflaeche, dienst, "ruft", "REST laut OpenAPI")
```

| Baustein | Verantwortung | Schnittstellen | Ort |
| --- | --- | --- | --- |
| Online-Banking-Dienst | Führt Anmeldung, Sitzung, Konten und Überweisung und liefert die Oberfläche aus | REST laut OpenAPI als Server; HTTP für Seiten und Dateien | `src/` |
| Oberfläche im Browser | Baut die Seiten für Anmeldung, Finanzstatus und Überweisung zusammen, prüft Eingaben vorab und zeigt Ergebnisse an | REST laut OpenAPI als Client | `public/` |

Die Oberfläche kennt nur das JSON der API und keine Entität; der Dienst kennt kein Markup der Seiten; keine fachliche Component kennt HTTP.

### Online-Banking-Dienst

Der Dienst besteht aus vier Components; die fachlichen Teile kennen kein HTTP, die Seitenauslieferung enthält keine Regel.

```mermaid
C4Component
    title "Components im Online-Banking-Dienst"
    Container_Ext(oberflaeche, "Oberfläche im Browser", "HTML, CSS, JavaScript", "ruft Seiten und API")
    Container_Boundary(dienst, "Online-Banking-Dienst") {
        Component(seiten, "Seitenauslieferung", "HTTP-Routing", "nimmt alle Anfragen an, prüft Pflichtfelder, liefert Seiten und Dateien")
        Component(sitzung, "Anmeldung und Sitzung", "Sitzungsverwaltung", "Anmeldung gegen Demo-Kunden, Sitzungscookie, Zugriffsschutz")
        Component(konten, "Konten und Finanzstatus", "Kontenbestand im Speicher", "Salden, Gesamtvermögen, verfügbarer Betrag, Belastung")
        Component(auftrag, "Überweisungsauftrag", "Auftragsannahme", "IBAN, Betragsgrenze, Auftraggeberkonto, genau einmalige Ausführung")
    }
    Rel(oberflaeche, seiten, "ruft Seiten und API", "HTTP, REST laut OpenAPI")
    Rel(seiten, sitzung, "meldet an, prüft Sitzung", "intern")
    Rel(seiten, konten, "liest Finanzstatus", "intern")
    Rel(seiten, auftrag, "gibt Auftrag weiter", "intern")
    Rel(auftrag, konten, "belastet Girokonto", "intern")
```

| Component | Verantwortung | Regeln |
| --- | --- | --- |
| Seitenauslieferung | Nimmt jede Anfrage von außen an, prüft die Pflichtfelder eines Auftrags und liefert Seiten und Dateien aus | keine |
| Anmeldung und Sitzung | Prüft Kennung und PIN gegen die Demo-Kunden (im Testbetrieb auch die Lastkunden), legt Sitzungen an, schützt Seiten wie API und nennt jeder Anfrage die angemeldete Kundin | keine |
| Konten und Finanzstatus | Führt die Konten je Kundin mit Salden und verfügbarem Betrag und bucht Belastungen; jede Abfrage nennt die Kennung der Sitzung | BR-0001, BR-0002, BR-0006 |
| Überweisungsauftrag | Nimmt Aufträge an, prüft Empfänger, Betrag und Auftraggeberkonto und führt sie genau einmal aus | BR-0003, BR-0004, BR-0005, BR-0007 |

Keine Component greift an der Seitenauslieferung vorbei; der Überweisungsauftrag kennt Konten und Finanzstatus, aber nicht umgekehrt.

## 6. Laufzeitsicht

### Anmeldung und Sitzung

```mermaid
sequenceDiagram
    autonumber
    participant Kundin
    participant Oberflaeche as Oberfläche
    participant Seiten as Seitenauslieferung
    participant Sitzung as Anmeldung und Sitzung
    Kundin->>Oberflaeche: Kennung und PIN
    Oberflaeche->>Seiten: POST /api/anmeldung
    Seiten->>Sitzung: Kennung und PIN prüfen
    alt Kennung unbekannt oder PIN falsch
        Sitzung-->>Seiten: keine Sitzung
        Seiten-->>Oberflaeche: 401
    else passt
        Sitzung-->>Seiten: Sitzung angelegt
        Seiten-->>Oberflaeche: 200 und Sitzungscookie
        Oberflaeche->>Seiten: GET /finanzstatus
        Seiten->>Sitzung: Sitzung prüfen
        Sitzung-->>Seiten: gültig
        Seiten-->>Oberflaeche: Finanzstatusseite
    end
```

Der Ablauf zeigt, dass die Sitzung im Dienst entsteht und jede angemeldete Seite sie erneut prüft; ohne gültige Sitzung sieht die Kundin nur die Anmeldung (NFR-001).

Die Anmeldung ist `POST /api/anmeldung` mit JSON `{kennung, pin}`. Passt beides, antwortet der Dienst mit 200 und `{name}` und setzt das Cookie `aventa_sitzung`; sonst kommt 401 mit `{fehler: "Kennung oder PIN ist falsch."}`, gleich ob die Kennung unbekannt oder die PIN falsch ist. `GET /api/sitzung` nennt Name und Kundennummer für den Rahmen, `POST /api/abmeldung` beendet die Sitzung und antwortet immer mit 204. Jeder geschützte Endpunkt holt die Kundin aus der Sitzung; Konten, Umsätze, Überweisungen und Empfängervorlagen gehen nur über ihre Kennung, eine Kennung im Auftrag oder in der Adresse gibt es nicht.

### Überweisung mit genau einmaliger Ausführung

```mermaid
sequenceDiagram
    autonumber
    participant Oberflaeche as Oberfläche
    participant Seiten as Seitenauslieferung
    participant Auftrag as Überweisungsauftrag
    participant Konten as Konten und Finanzstatus
    Oberflaeche->>Seiten: POST /api/ueberweisungen mit Auftrags-Kennung
    Seiten->>Auftrag: Auftrag ausführen
    alt Kennung schon gebucht
        Auftrag-->>Seiten: erster Vorgang, nicht neu
        Seiten-->>Oberflaeche: 200 mit der Überweisung
    else neuer Auftrag
        Note over Auftrag: prüft BR-0003, BR-0004, BR-0007
        Auftrag->>Konten: Girokonto belasten
        Konten-->>Auftrag: neuer Saldo
        Auftrag-->>Seiten: ausgeführt
        Seiten-->>Oberflaeche: 201 mit der Überweisung
    end
```

Der Ablauf zeigt, dass eine wiederholte Bestätigung derselben Auftrags-Kennung keine zweite Belastung auslöst und das erste Ergebnis zurückkommt (BR-0005, NFR-002), während die maßgeblichen Prüfungen im Dienst liegen (ADR-004).

## 7. Verteilungssicht

```mermaid
C4Deployment
    title "Verteilung: Entwicklungsbetrieb und Testumgebung"
    Deployment_Node(rechner, "Rechner der Entwicklerin", "Node ab 22, npm") {
        Container(devdienst, "Online-Banking-Dienst", "Start aus dem Quellstand, Testbetrieb aktiv")
    }
    Deployment_Node(host, "Host mit Container-Laufzeit") {
        Deployment_Node(container, "Container der Testumgebung", "aus dem Image des Arbeitsstands") {
            Container(testdienst, "Online-Banking-Dienst", "Start aus dem Image, Testbetrieb aktiv")
        }
    }
    Deployment_Node(browser, "Browser der Kundin") {
        Container(oberflaeche, "Oberfläche im Browser", "HTML, CSS, JavaScript")
    }
    Rel(oberflaeche, testdienst, "ruft", "HTTP")
```

- **Bauen:** Mehrstufig; die Baustufe übersetzt die Quellen und prüft die Typen, die Laufzeitstufe enthält nur die Produktionsabhängigkeiten, die Seiten kommen unverändert aus dem Arbeitsstand.
- **Ausliefern:** Ein Image, ein Container je Umgebung; Oberfläche und API kommen aus demselben Prozess.
- **Konfiguration:** Netz-Port, Betriebsart, Version und im Testbetrieb die PIN der Lastkunden kommen aus der Umgebung, sonst ist nichts einstellbar.
- **Skalierung:** Ein Container, der Zustand liegt im Prozess; eine zweite Instanz teilt nichts (siehe Risiken).
- Ein Produktivbetrieb ist im Repo nicht beschrieben.

## 8. Querschnittliche Konzepte

### Fehlerbehandlung

Der Dienst antwortet auf jeden erwarteten Fehlerfall mit einem HTTP-Status und einem deutschsprachigen Satz im Fehlerfeld. Unterschieden werden fehlende Sitzung, unvollständiger Auftrag, fachlich abgelehnter Auftrag mit Grund und ein Datenfehler des Kontenbestands. Zentral gefangen werden nur die beiden fachlichen Fehlerarten; ein unerwarteter Fehler erreicht die Kundin nicht als gestaltete Antwort. Die Oberfläche bildet den Status auf eine Feldmeldung oder die allgemeine Meldung ab und leitet bei fehlender Sitzung auf die Anmeldung (siehe Risiken).

### Sicherheit

Die Anmeldung prüft Kennung und PIN gegen die Demo-Kundenliste, ein Zähler und eine Sperre fehlen. Eine Sitzung ist eine Zufallskennung im Speicher des Dienstes, die über ein HttpOnly-Cookie mit SameSite Lax gefunden wird; das Cookie trägt kein Secure, weil der Dienst kein TLS beendet. Der Zugriffsschutz sitzt an einer Stelle: Seiten werden ohne Sitzung auf die Anmeldung umgeleitet, API-Aufrufe mit 401 beantwortet (NFR-001). Jedes Konto gehört genau einer Kennung, und der Dienst sucht Konten nur unter der Kennung der Sitzung: Ein fremdes Konto ist für die Kundin nicht vorhanden, als Auftraggeberkonto antwortet der Dienst mit 403, bei den Umsätzen mit 404 (BR-0007, BR-0011). Auch die Auftrags-Kennungen gelten je Kundin, eine fremde Kennung liefert keinen fremden Auftrag zurück.

### Persistenz und Transaktionen

Der Dienst hält keinen dauerhaften Zustand: Kontenbestand, Sitzungen und gebuchte Auftrags-Kennungen liegen im Speicher des Prozesses, ein Neustart setzt alles auf den Ausgangsstand zurück (ADR-002). Im Testbetrieb setzen zwei zusätzliche Routen getrennt die Demo-Daten und die Lastdaten zurück (siehe Testbetrieb und Daten je Kundin); außerhalb des Testbetriebs sind sie nicht vorhanden. Belastung und Idempotenz-Ablage werden ohne Sperre nacheinander im selben Prozess verändert, mehrere Instanzen teilen nichts (siehe Risiken).

### Testbetrieb und Daten je Kundin

Der Bestand ist nach Kennung geordnet: Konten, Umsätze (über die IBAN der eigenen Konten), Idempotenz-Ablage, Empfängervorlagen und Sitzungen gehören je einer Kundin. Es gibt zwei Gruppen von Kundinnen:

| Gruppe | Kennungen | Bestand | Zurückgesetzt von |
| --- | --- | --- | --- |
| Demo-Kundinnen | `lena.hoffmann` (PIN 24680), `jonas.weber` (PIN 13579) | je ein Girokonto (2.145,30 Euro, Rahmen 1.000 Euro) und eine Kreditkarte (-387,45 Euro) mit Demo-Umsätzen; Jonas hat eine eigene Kopie von Lenas Bestand mit eigenen IBANs und dazu 50 Empfängervorlagen | `POST /api/test/reset` |
| Lastkunden, nur im Testbetrieb | `lasttest-001` bis `lasttest-300`, alle mit der PIN aus `LASTTEST_PIN` (Vorgabe `97531`, öffentliche Testdaten) | je ein Girokonto mit 10.000 Euro und Rahmen 1.000 Euro, ohne Umsätze; IBAN `DEpp500105179900000nnn`, nnn die Nummer, pp die Prüfziffer nach MOD 97-10 | `POST /api/test/lasttest/reset` |

Jeder Reset beendet die Sitzungen seiner Gruppe und setzt Konten, Umsätze, Idempotenz-Ablage und Empfängervorlagen nur dieser Gruppe zurück; die andere bleibt, wie sie ist. So stören sich ein Akzeptanzlauf und ein Lastlauf gegen dieselbe Testumgebung nicht. Beide Routen antworten mit 204 und brauchen keine Anmeldung.

Speicher: Jede Überweisung legt einen Umsatz und einen Eintrag in der Idempotenz-Ablage an. Für Lastkunden hält der Dienst je Konto nur die jüngsten 200 Umsätze und je Kundin die jüngsten 200 Auftrags-Kennungen, ältere fallen weg; bei 300 Lastkunden bleibt der Bestand damit bei höchstens je 60.000 Umsätzen und Aufträgen. Eine Wiederholung derselben Auftrags-Kennung kommt im Lasttest sofort und liegt damit im Fenster. Die Demo-Kundinnen haben keine Grenze, ihr Bestand wächst nur in Akzeptanzläufen und wird je Szenario zurückgesetzt. Sitzungen laufen nicht ab: Ein Lastskript meldet sich je virtuellem Nutzer einmal an und nicht je Iteration, sonst wächst die Sitzungsablage bis zum nächsten Last-Reset.

### Logging und Telemetrie

Der Dienst schreibt eine Startmeldung und protokolliert einen Datenfehler; eigene Metriken, Zugriffsprotokoll und Traces gibt es im Dienst nicht, und er bleibt dafür unverändert. Die Meldung eines Datenfehlers nennt nur Ort und Art, also den fehlenden Dispositionsrahmen beim Girokonto, und keinen Kontobezug wie die IBAN. In der Testumgebung läuft er als Image online-banking-otel: Ein Aufsatz außerhalb des Repos instrumentiert den Dienst mit der Autoinstrumentierung von OpenTelemetry für Node und exportiert per OTLP an den Collector der Umgebung; die Metrik http.server.request.duration trägt Route, Methode, Statuscode und service.version, und daraus misst der Betrieb Antwortzeit und 5xx-Anteil je Operation und Version (NFR-003, NFR-004). Ein Produktivbetrieb mit solcher Messung ist im Repo nicht beschrieben.

### Konfiguration

Der Dienst liest nur Netz-Port, Betriebsart, Version und im Testbetrieb die PIN der Lastkunden (`LASTTEST_PIN`) aus der Umgebung, alles andere steht im Image. Die Version kommt beim Bauen ins Image und wird über eine offene Route gemeldet, damit die Akzeptanztests den geprüften Stand erkennen. Der Testbetrieb (`TEST_MODE=1`) legt die Lastkunden an und schaltet die beiden Reset-Routen frei; sonst sind sie unbekannt und eine Anmeldung als Lastkunde scheitert.

### Formate

JSON in camelCase, Beträge als Zahl in Euro mit zwei Nachkommastellen, Zeitpunkte in UTC nach ISO 8601, die Währung nach ISO 4217 steht im Auftrag (ADR-005). Die IBAN wird vor Prüfung und Ablage normalisiert und in der Oberfläche in Vierergruppen gezeigt. Die Anzeige nutzt die Formatierung der Standardbibliothek für de-DE und EUR. Die Auftrags-Kennung ist eine Zufallskennung in Hexform, die die Oberfläche je Zusammenfassung vergibt.

### Testkonzept

Unit-Tests in `test/` prüfen die Geschäftsregeln am Modul ohne HTTP und setzen den Ausgangsstand je Test zurück; sie laufen als Teil des Baus. Akzeptanztests in `acceptance/` laufen als Gauge-Szenarien über Playwright im Browser gegen eine laufende Testumgebung; ein Szenario prüft ein Akzeptanzkriterium, je Szenario werden Cookies gelöscht und der Ausgangsstand über den Testbetrieb zurückgesetzt. Die Testumgebung entsteht aus dem Arbeitsstand: Image bauen, Container mit Testbetrieb starten, auf die Versionsantwort warten; die Tests starten den Dienst nicht selbst. Vor einem Lauf vergleichen sie die gemeldete Version mit einer freigegebenen Commit-Liste, sofern eine gesetzt ist.

## 9. Architekturentscheidungen

Die Entscheidungen stehen einzeln unter `docs/adr/`.

## 10. Qualitätsanforderungen

Die Qualitätsanforderungen (NFR-…) stehen in `docs/requirements.md`.

- **NFR-001 Zugriffsschutz des Finanzstatus:** Anmeldung und Sitzung tragen den Schutz zentral, die Seitenauslieferung wendet ihn auf jede Seite und jeden API-Aufruf an, ohne ihn in den Seiten zu wiederholen.
- **NFR-002 Genau einmalige Ausführung einer Überweisung:** Der Überweisungsauftrag bucht über die von der Oberfläche vergebene Auftrags-Kennung; eine Wiederholung liefert das erste Ergebnis, ohne erneut zu belasten.

## 11. Risiken und technische Schulden

| Risiko | Wirkung | Maßnahme |
| --- | --- | --- |
| Kein TLS im Dienst, kein Secure am Sitzungscookie, kein Zähler und keine Sperre bei der Anmeldung | Kennung, PIN und Sitzung sind im Netz abgreifbar, Anmeldeversuche sind unbegrenzt | TLS vor dem Dienst, Secure am Cookie, Zähler mit Sperre vor einer Öffnung nach außen |
| Zustand nur im Speicher (ADR-002) | Ein Neustart verliert Sitzungen, Salden und den Schutz nach BR-0005; eine zweite Instanz teilt nichts | Persistenz und gemeinsamer Speicher vor einem Produktivbetrieb |
| Geldbeträge als Gleitkommazahl, gegen die Leitplanke dezimal ohne Gleitkomma (ADR-005) | Rundungsdrift bei vielen Buchungen, Grenzfälle beim Vergleich mit dem verfügbaren Betrag | Dezimalbetrag mit Währung, Umstellung vor dem Anschluss einer Kernbank |
| Fehlerformat ohne Problem Details, gegen die Leitplanke REST | Clients brauchen eine Sonderbehandlung, ein späterer Wechsel ändert die Schnittstelle | Problem Details in der OpenAPI beschreiben, dann einführen |
| Die Auftrags-Kennung kommt vom Browser | Sie gilt je Kundin; doppelte Kennungen einer Kundin aus zwei Fenstern buchen nur einmal | Kennung im Dienst ausstellen |
| Demo-PINs stehen im Klartext im Repo, gegen die Leitplanke zu Geheimnissen | Für den Demo-Betrieb nach C-001 hinnehmbar, für eine echte Anmeldung unzulässig | Anmeldung über eine Kernbank, PINs nur aus der Umgebung |
| Die Zuordnung von Konto zu Kundin steht im Dienst statt in einer Kernbank | Für Demo und Test richtig, für echte Kundinnen keine Quelle | Zuordnung aus der Kernbank übernehmen |
| Lastkunden mit öffentlicher PIN, sobald `TEST_MODE=1` gesetzt ist | Wer einen Dienst im Testbetrieb erreicht, meldet sich als Lastkunde an und setzt Daten zurück | Testbetrieb nur in der Testumgebung; `LASTTEST_PIN` dort setzen, wo die Vorgabe nicht reicht |
| Sitzungen laufen nicht ab | Ein Lastskript, das sich je Iteration neu anmeldet, füllt den Speicher bis zum nächsten Reset | Einmal je virtuellem Nutzer anmelden; Ablauf der Sitzung vor einem Produktivbetrieb |

## 12. Glossar

| Begriff | Bedeutung |
| --- | --- |
| Sitzung | Zufallskennung im Speicher des Dienstes, über ein HttpOnly-Cookie gefunden; maßgeblich für den Zugriffsschutz |
| Testbetrieb | Betriebsart (`TEST_MODE=1`) mit Lastkunden und den Routen für Demo-Reset und Last-Reset |
| Ausgangsstand | Fester Anfangsbestand an Konten und Kunden je Kennung, auf den Tests zurücksetzen |
| Lastkunde | Kundin `lasttest-001` bis `lasttest-300`, nur im Testbetrieb, mit eigenem Girokonto für Lasttests |
| Demo-Reset, Last-Reset | Zurücksetzen nur der Demo-Kundinnen (`/api/test/reset`) oder nur der Lastkunden (`/api/test/lasttest/reset`) |
| Auftrags-Kennung | Zufallskennung der Oberfläche je Zusammenfassung, Schlüssel der genau einmaligen Ausführung |
| Idempotenz-Ablage | Zuordnung einer Auftrags-Kennung zum ersten Ergebnis, im Speicher des Dienstes |
| Datenfehler | Fehlender Dispositionsrahmen im Kontenbestand, der den Finanzstatus als Ganzes scheitern lässt |
| Ablehnung | Fachlich abgelehnter Auftrag mit Grund, den der Dienst als Fehlerantwort meldet |
| Seitenauslieferung | Baustein, der jede Anfrage von außen annimmt und Seiten wie API bedient |
| Seitenstand | Version, die der Dienst meldet und gegen die die Akzeptanztests prüfen |
| Auslieferungsimage | Image mit übersetztem Dienst und Seiten, das je Umgebung als ein Container läuft |
