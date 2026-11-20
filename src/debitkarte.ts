/* UC-018 Debitkarte sperren und entsperren: BR-0081, BR-0082. Je Kundin im Speicher (ADR-002), kennt kein HTTP. */
import { girokonto } from './konten';
import { Auswahl, istDemokunde } from './kunden';

export type Kartenstatus = 'aktiv' | 'vorübergehend gesperrt' | 'endgültig gesperrt';
export type Sperrgrund = 'Verlust' | 'Diebstahl';

export interface Debitkarte {
  kartennummerMaskiert: string;
  status: Kartenstatus;
  /** Nur bei Status endgültig gesperrt. */
  sperrgrund?: Sperrgrund;
}

/** Fehler mit HTTP-Status und Satz für die Kundin: 400, 404 oder 409. */
export class Kartenfehler extends Error {
  constructor(readonly status: 400 | 404 | 409, message: string) { super(message); }
}

export const KEINE_KARTE = 'Zu diesem Konto gibt es keine Debitkarte.';
export const SPERRGRUND_FEHLER = 'Bitte wählen Sie den Sperrgrund Verlust oder Diebstahl.';
const STATUS: readonly string[] = ['aktiv', 'vorübergehend gesperrt', 'endgültig gesperrt'];
const GRUENDE: readonly string[] = ['Verlust', 'Diebstahl'];

/** Ausgangsstand der Demo-Kundinnen: eine aktive Karte zum Girokonto. */
const AUSGANGSSTAND: Record<string, string> = { 'lena.hoffmann': '**** 4821', 'jonas.weber': '**** 7305' };

const karten = new Map<string, Debitkarte>();

export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const [kennung, nummer] of Object.entries(AUSGANGSSTAND)) {
    if (auswahl(kennung)) karten.set(kennung, { kartennummerMaskiert: nummer, status: 'aktiv' });
  }
}
zuruecksetzen();

/** BR-0082: die Karte zum Girokonto der Kundin mit dieser IBAN, sonst 404. */
function karteZu(kennung: string, iban: string): Debitkarte {
  const normal = String(iban).replace(/\s+/g, '').toUpperCase();
  const karte = karten.get(kennung);
  if (!karte || !girokonto(kennung, normal)) throw new Kartenfehler(404, KEINE_KARTE);
  return karte;
}

export function lesen(kennung: string, iban: string): Debitkarte {
  return { ...karteZu(kennung, iban) };
}

/** BR-0081: Meldung, wenn die Aktion im Status nicht zulässig ist; sonst undefined. */
function unzulaessig(von: Kartenstatus, ziel: Kartenstatus): string | undefined {
  if (von === 'endgültig gesperrt') {
    return ziel === 'aktiv' ? 'Die Debitkarte ist endgültig gesperrt und lässt sich nicht entsperren.'
      : ziel === 'vorübergehend gesperrt' ? 'Die Debitkarte ist endgültig gesperrt und lässt sich nicht vorübergehend sperren.'
      : 'Die Debitkarte ist bereits endgültig gesperrt.';
  }
  if (von === 'aktiv' && ziel === 'aktiv') return 'Die Debitkarte ist nicht gesperrt.';
  if (von === 'vorübergehend gesperrt' && ziel === 'vorübergehend gesperrt') return 'Die Debitkarte ist bereits vorübergehend gesperrt.';
  return undefined;
}

/** Prüfreihenfolge: Konto (404), Format von Zielstatus und, nur bei endgültig gesperrt, Sperrgrund (400), Statuswechsel (409). */
export function setzen(kennung: string, iban: string, ziel: unknown, sperrgrund?: unknown): Debitkarte {
  const karte = karteZu(kennung, iban);
  if (typeof ziel !== 'string' || !STATUS.includes(ziel)) throw new Kartenfehler(400, 'Der Zielstatus ist ungültig.');
  const zielstatus = ziel as Kartenstatus;
  if (zielstatus === 'endgültig gesperrt' && (typeof sperrgrund !== 'string' || !GRUENDE.includes(sperrgrund))) {
    throw new Kartenfehler(400, SPERRGRUND_FEHLER);
  }
  const meldung = unzulaessig(karte.status, zielstatus);
  if (meldung) throw new Kartenfehler(409, meldung);
  karte.status = zielstatus;
  if (zielstatus === 'endgültig gesperrt') karte.sperrgrund = sperrgrund as Sperrgrund;
  else delete karte.sperrgrund;
  return { ...karte };
}
