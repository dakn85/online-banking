# PK-65: Online-Banking: neues Layout statt nachgebauter Masken (Navigation, Finanzstatus, mobil)

**Art:** Technik · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Kundin möchte ich ein aufgeräumtes, zeitgemäßes Online-Banking, in dem ich jede Funktion über die Navigation finde und das auch auf dem Telefon bedienbar ist, damit ich meine Bankgeschäfte schnell erledige. Die Masken legen Inhalt und Felder fest, nicht Anordnung und Optik; Verhalten, Texte und Akzeptanztests bleiben unverändert.

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

Hinweis: Der Code entstand vor diesem Entwurf (Technik-Story ohne Spezifikationsänderung); der Entwurf beschreibt, was im Zweig steht.

**Bausteine:** nur die Oberfläche unter `public/` (app.html, app.js, styles.css, seiten/finanzstatus.js, seiten/ueberweisung.js, seiten/umsaetze.js). Dienst, API und Daten unverändert.

**Schritte**
1. Rahmen: Leiste fest über die ganze Höhe, alle Funktionen in drei Gruppen (Finanzstatus; Zahlungen: Überweisung, Umbuchung, Daueraufträge, Empfängervorlagen; Service: Postfach mit Zahl nach BR-0086, Tageslimit, Persönliche Daten). Konto-Seiten (UC-003 Umsätze, Ausgabenanalyse, Debitkarte, Kontoauszug) markieren den Finanzstatus, UC-017 die Überweisung. Telefon: Kopfzeile mit Menü-Knopf (aria-expanded) statt waagerecht scrollender Leiste.
2. Kopf: Begrüßung nur auf dem Finanzstatus; Kundin mit Kürzel unten in der Leiste.
3. UC-001 Finanzstatus: Schnellzugriff im Gesamtvermögen (UC-015 Tageslimit, UC-021 Umbuchen, Daueraufträge, Persönliche Daten, Überweisen) statt Knopfreihe; je Konto eine Zeile (Name, Art, IBAN links, Saldo/Dispositionsrahmen/Verfügbar rechts, Aktionen darunter). Die Tabelle bleibt semantisch eine Tabelle mit denselben Spaltenköpfen.
4. UC-002 Überweisung: Felder paarweise (Betrag und Ausführungstag nebeneinander), vorgemerkte Überweisungen und Tageslimit als Verweise im Formularkopf; Auftraggeberkonto-Karte bleibt beim Scrollen stehen.
5. UC-003 Umsätze: Export als gestylter Knopf; Formfelder schrumpfen auf schmalen Fenstern.

**Rahmen:** keine neue Bibliothek, keine Webfonts von außen (Inter liegt im Repo). Alle sichtbaren Namen (Beschriftungen, Knöpfe, Verweise, Spaltenköpfe) bleiben wörtlich. AGENTS.md bekommt die Regel, dass Masken Drahtmodelle sind.

**Offen für eine eigene Story:** ein Gestaltungsleitbild in docs/architecture.md (Abschnitt 8), damit künftige Seiten demselben Muster folgen; Daueraufträge mit drei Formularen untereinander bleibt fachlich wie in der Maske.
