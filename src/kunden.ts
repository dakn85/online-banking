/* Demo-Kunden für die Anmeldung. Es gibt noch kein Kernbanksystem: Kennung und PIN sind feste Testwerte.
   Im Testbetrieb kommen die Lastkunden lasttest-001 bis lasttest-300 dazu (testdaten.ts). */

export interface Kunde {
  kennung: string;
  pin: string;
  vorname: string;
  nachname: string;
  kundennummer: string;
  /** Nur Lastkunden: so viele jüngste Umsätze je Konto und Auftrags-Kennungen hält der Dienst, ältere fallen weg. */
  speichergrenze?: number;
}

export const KUNDEN: readonly Kunde[] = [
  { kennung: 'lena.hoffmann', pin: '24680', vorname: 'Lena', nachname: 'Hoffmann', kundennummer: 'K-104 233' },
  { kennung: 'jonas.weber', pin: '13579', vorname: 'Jonas', nachname: 'Weber', kundennummer: 'K-104 871' },
];

/** Kennungen der Lastkunden beginnen so. Ihre Daten setzt nur der Last-Reset zurück, alle anderen nur der Demo-Reset. */
export const LAST_PRAEFIX = 'lasttest-';

export type Auswahl = (kennung: string) => boolean;
export const istLastkunde: Auswahl = kennung => kennung.startsWith(LAST_PRAEFIX);
export const istDemokunde: Auswahl = kennung => !istLastkunde(kennung);

/** Weitere Kunden nach Kennung; nur im Testbetrieb gefüllt (Lastkunden). */
const weitere = new Map<string, Kunde>();

export function kundenHinzufuegen(liste: readonly Kunde[]): void {
  for (const kunde of liste) weitere.set(kunde.kennung, kunde);
}

export function kundeMitKennung(kennung: string): Kunde | undefined {
  const gesucht = kennung.trim().toLowerCase();
  return KUNDEN.find(k => k.kennung === gesucht) ?? weitere.get(gesucht);
}
