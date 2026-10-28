/* Demo-Kunden für die Anmeldung. Es gibt noch kein Kernbanksystem: Kennung und PIN sind feste Testwerte. */

export interface Kunde {
  kennung: string;
  pin: string;
  vorname: string;
  nachname: string;
  kundennummer: string;
}

export const KUNDEN: readonly Kunde[] = [
  { kennung: 'lena.hoffmann', pin: '24680', vorname: 'Lena', nachname: 'Hoffmann', kundennummer: 'K-104 233' },
  { kennung: 'jonas.weber', pin: '13579', vorname: 'Jonas', nachname: 'Weber', kundennummer: 'K-104 871' },
];

export function kundeMitKennung(kennung: string): Kunde | undefined {
  return KUNDEN.find(k => k.kennung === kennung.trim().toLowerCase());
}
