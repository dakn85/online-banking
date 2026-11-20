# PK-66: Oberfläche als Vorzeigeanwendung: Listen, Seitenblatt, Rückfrage, Leitbild als Skill

**Art:** Technik · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Kundin der Aventa Bank möchte ich eine moderne, aufgeräumte Online-Banking-Oberfläche – Listen statt Tabellen, Anlegen und Ändern im Seitenblatt, Löschen über eine Rückfrage, auf dem Telefon eine Tab-Leiste –, damit ich meine Bankgeschäfte schnell und sicher erledige. Das Gestaltungsleitbild liegt als Skill im Repo (.claude/skills/oberflaeche), damit jede künftige Seite demselben Muster folgt.

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

Hinweis: Der Code entstand vor diesem Entwurf (Technik-Story ohne Spezifikationsänderung); der Entwurf beschreibt, was im Zweig steht.

**Bausteine:** Oberfläche unter `public/` (app.html, app.js, styles.css, alle Seiten unter seiten/), Steps in acceptance/tests/StepImplementation.ts, neu `.claude/skills/oberflaeche/SKILL.md` und `scripts/fotos.cjs`, ein Satz in AGENTS.md. Dienst, API, Daten und Szenarien unverändert.

**Schritte**
1. Bausteine in app.js: Listenzeile, Seitenblatt (Aventa.blatt), Rückfrage „Sicherheitsabfrage“ (Aventa.rueckfrage), Meldungen, Symbole, Formatierer; Abrufe für Vorschau und Zähler ohne Umleitung zur Anmeldung.
2. Rahmen: helle Leiste in Gruppen, auf dem Telefon Tab-Leiste (Übersicht, Überweisen, Aufträge, Postfach, Mehr) und schwebende Hauptaktion.
3. Listen statt Tabellen: UC-003 Umsätze nach Tagen gruppiert mit Segmentschalter Ein-/Ausgang, Daueraufträge, UC-004 Empfängervorlagen (mit „Überweisen“ an der Vorlage), Vorgemerkte Überweisungen, Postfach (Liste und Lesebereich), UC-019 Ausgabenanalyse mit Verteilungsbalken.
4. Anlegen und Ändern im Seitenblatt, Löschen nach Rückfrage; Ablehnungen des Dienstes erscheinen im Blatt, Eingaben bleiben stehen.
5. Formularseiten (Überweisung, Umbuchung, Tageslimit, Persönliche Daten, Kontoauszug, Debitkarte) mit Formkarte und Kontextkarte.
6. Leitbild als Skill im Repo; Steps lesen Listen über data-felder/data-zeile/data-feld mit denselben Werten, Reihenfolgen und Meldungen.

**Rahmen:** keine neue Bibliothek, alle sichtbaren Namen aus den Masken wörtlich.
