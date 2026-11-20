/* UC-020 Postfach der Bank lesen und verwalten: BR-0085 bis BR-0087, je Kundin im Speicher (ADR-002). Kennt kein HTTP. */
import { Auswahl, istDemokunde } from './kunden';

export interface Nachricht {
  nachrichtId: string;
  absender: string;
  betreff: string;
  text: string;
  /** Datum JJJJ-MM-TT. */
  versendetAm: string;
  gelesen: boolean;
}

export interface Nachrichtenliste {
  nachrichten: Nachricht[];
  anzahlUngelesen: number;
}

export const ID_FEHLER = 'Die Kennung der Nachricht ist ungültig.';
export const NICHT_GEFUNDEN = 'Diese Nachricht gibt es nicht.';

/** Abgelehnte Anfrage mit dem Status, den der Vertrag nennt. */
export class Nachrichtenfehler extends Error {
  constructor(readonly status: 400 | 404, meldung: string) { super(meldung); }
}

/** Je Kennung der Kundin ihre Nachrichten (BR-0085). */
const nachrichten = new Map<string, Nachricht[]>();

/** Ausgangsstand (UC-020 Notizen); Lastkunden und alle anderen haben keine Nachrichten. */
const AUSGANGSSTAND: Record<string, () => Nachricht[]> = {
  'lena.hoffmann': () => [
    { nachrichtId: 'N-2026-00003', absender: 'Aventa Bank Kartenservice', betreff: 'Ihre Kreditkartenabrechnung liegt vor', text: 'Ihre Kreditkartenabrechnung liegt zum Abruf bereit.', versendetAm: '2026-11-17', gelesen: false },
    { nachrichtId: 'N-2026-00002', absender: 'Aventa Bank', betreff: 'Neue Sicherheitshinweise zum Online-Banking', text: 'Bitte geben Sie Ihre PIN niemals an Dritte weiter. Die Bank fragt sie nie per E-Mail oder Telefon ab.', versendetAm: '2026-11-12', gelesen: false },
    { nachrichtId: 'N-2026-00001', absender: 'Aventa Bank', betreff: 'Ihr Kontoauszug für Oktober', text: 'Ihr Kontoauszug für Oktober liegt zum Abruf bereit.', versendetAm: '2026-11-02', gelesen: true },
  ],
  'jonas.weber': () => [
    { nachrichtId: 'N-2026-00004', absender: 'Aventa Bank', betreff: 'Willkommen im Postfach', text: 'Willkommen im Postfach der Aventa Bank.', versendetAm: '2026-11-10', gelesen: true },
  ],
};

/** Setzt die Nachrichten der ausgewählten Kennungen auf den Ausgangsstand; ohne Auswahl die der Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const kennung of [...nachrichten.keys()]) if (auswahl(kennung)) nachrichten.delete(kennung);
  for (const [kennung, erzeugen] of Object.entries(AUSGANGSSTAND)) if (auswahl(kennung)) nachrichten.set(kennung, erzeugen());
}
zuruecksetzen();

const eigene = (kennung: string) => nachrichten.get(kennung) ?? [];

/** BR-0085, BR-0086: Nachrichten der Kundin, neueste zuerst, und Zahl der ungelesenen. */
export function liste(kennung: string): Nachrichtenliste {
  const alle = [...eigene(kennung)].sort((a, b) => b.versendetAm.localeCompare(a.versendetAm));
  return { nachrichten: alle.map(n => ({ ...n })), anzahlUngelesen: alle.filter(n => !n.gelesen).length };
}

/** Kennung 1 bis 36 Zeichen (400), danach nur eigene Nachrichten (404, BR-0085). */
function eigeneNachricht(kennung: string, nachrichtId: string): Nachricht {
  if (nachrichtId.length < 1 || nachrichtId.length > 36) throw new Nachrichtenfehler(400, ID_FEHLER);
  const nachricht = eigene(kennung).find(n => n.nachrichtId === nachrichtId);
  if (!nachricht) throw new Nachrichtenfehler(404, NICHT_GEFUNDEN);
  return nachricht;
}

/** BR-0087: Öffnen setzt den Lesestatus auf gelesen; erneutes Öffnen ändert nichts. */
export function oeffnen(kennung: string, nachrichtId: string): Nachricht {
  const nachricht = eigeneNachricht(kennung, nachrichtId);
  nachricht.gelesen = true;
  return { ...nachricht };
}

/** Löscht endgültig; die Sicherheitsabfrage stellt die Seite (UC-020 A1). */
export function loeschen(kennung: string, nachrichtId: string): void {
  const nachricht = eigeneNachricht(kennung, nachrichtId);
  nachrichten.set(kennung, eigene(kennung).filter(n => n !== nachricht));
}
