# PK-87: Kartendaten im Online-Banking selbst pflegen

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Kartendaten im Online-Banking selbst pflegen

Ausgangslage, so wie es heute ist (aus „Fragen“ in Privatkunden; KI-Zusammenfassung mit Fundstellen, vor dem Umsetzen am Code bzw. Element zu prüfen):

Frage: „Erkläre das Programm COCRDUPC im Altsystem CardDemo: Was tut es fachlich, von Anfang bis Ende?“
COCRDUPC (Transaktion CCUP) ist die Kreditkarten-Pflegemaske des Altsystems: Es liest einen Kartensatz aus der Datei CARDDAT, zeigt die Kartendaten an, prüft geänderte Eingaben, fragt eine Bestätigung ab und schreibt den Satz nach einer Sperre und einer Prüfung auf Fremdänderungen zurück.
- Einstieg: Kommt der Benutzer aus der Kreditkartenliste (COCRDLIC), übernimmt das Programm Konto- und Kartennummer aus dem Aufrufkontext und liest den Kartensatz direkt; kommt er vom Menü oder ohne Kontext, zeigt es eine Suchmaske und verlangt als Suchschlüssel eine nicht leere, 11-stellige numerische Kontonummer und eine 16-stellige numerische Kartennummer. (Beleg: app/cbl/COCRDUPC.cbl:482-497, app/cbl/COCRDUPC.cbl:502-511, app/cbl/COCRDUPC.cbl:1343-1367) (am Code gegengelesen)
- Der Kartensatz wird über die Kartennummer gelesen (Satzschlüssel der Datei CARDDAT), nicht über das Konto; die Kontonummer wird nur als Feld geführt. (Beleg: app/cbl/COCRDUPC.cbl:721-800, app/cbl/COCRDUPC.cbl:1380-1394) (am Code gegengelesen)
- Sind die Details geholt, werden die neuen mit den gemerkten alten Werten ohne Rücksicht auf Groß-/Kleinschreibung verglichen. Sind sie gleich, gilt „keine Änderung festgestellt“; die vier Prüfungen werden übersprungen, eine schon offene Bestätigung bleibt aber offen. Auch wenn keine Änderung festgestellt ist oder die Bestätigung schon offen oder die Änderung schon erledigt ist, werden die Gültigkeitskennzeichen gesetzt und nicht geprüft. Nur wenn die Werte abweichen und weder Bestätigung offen noch Änderung erledigt ist, gelten Name (nicht leer, nur Buchstaben und Leerzeichen), Kartenstatus (Y oder N), Ablaufmonat (1 bis 12) und Ablaufjahr (1950 bis 2099) als gültig, und nur wenn alle vier Prüfungen fehlerfrei sind, wird die Bestätigung angefordert. (Beleg: app/cbl/COCRDUPC.cbl:1343-1367, app/cbl/COCRDUPC.cbl:641-715) (beim Gegenlesen am Code korrigiert)
- Beim Speichern (Taste PF05) sperrt das Programm den Satz zum Ändern, meldet andernfalls „Could not lock record for update“, prüft danach, ob jemand CVV, Kartenname, Ablaufdatum oder Kartenstatus inzwischen geändert hat (dann „Record changed by some one else. Please review“ und kein Schreiben) und baut den Satz anschließend vollständig neu auf, bevor es ihn zurückschreibt; ein fehlgeschlagenes Schreiben meldet „Update of record failed“. (Beleg: app/cbl/COCRDUPC.cbl:806-943, app/cbl/COCRDUPC.cbl:1420-1493) (am Code gegengelesen)
- Auffällig im Altsystem: Die Kontonummer des Kartensatzes ist an der Fremdänderungsprüfung nicht beteiligt: Sie wird beim Zurückschreiben aus dem beim Einlesen übernommenen Wert gesetzt, sodass eine zwischenzeitliche Änderung der Konto-Zuordnung unbemerkt überschrieben würde. (Beleg: app/cbl/COCRDUPC.cbl:806-943, app/cbl/COCRDUPC.cbl:1420-1493) (am Code gegengelesen)
Heute nicht beschrieben:
- Die Bildschirmaufbereitung (3000-SEND-MAP) und die Tastenauswertung des Einstiegs sind nicht gelesen, daher ist unbekannt, welche Felder die Detailmaske zur Eingabe freigibt und wie die Bildschirmausgabe die alten und neuen Werte darstellt.
- Ob eine in der Detailmaske eingegebene Änderung von Konto- oder Kartennummer überhaupt zugelassen wird, sagt der gelesene Code nicht; geprüft werden dort nur Name, Status, Ablaufmonat und Ablaufjahr.

Anpassungen für das neue System (Vorgabe der Person, gilt vor der Ausgangslage):
Im neuen System pflegt die Kundin Name auf der Karte, Kartenstatus und Ablaufdatum selbst im Online-Banking. Das Ablaufjahr gilt ab dem laufenden Jahr bis zehn Jahre voraus statt fest 1950 bis 2099. Die Prüfung auf Fremdänderung umfasst auch die Kontozuordnung. Meldungen auf Deutsch.

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-87 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-87 grün
