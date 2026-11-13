/* Testbetrieb (ADR-002): Ausgangsstand der Demo-Kundinnen und, getrennt davon, Lastkunden für Lasttests.
   Der Demo-Reset berührt keine Lastkunden, der Last-Reset keine Demo-Kundinnen; so stören sich ein Akzeptanzlauf und ein Lastlauf nicht. */
import { ausgangsstandSetzen, zuruecksetzen as kontenZuruecksetzen } from './konten';
import { Auswahl, istDemokunde, istLastkunde, Kunde, kundenHinzufuegen, LAST_PRAEFIX } from './kunden';
import { beendenFuer } from './sitzung';
import { zuruecksetzen as auftraegeZuruecksetzen } from './ueberweisung';
import { zuruecksetzen as umsaetzeZuruecksetzen } from './umsaetze';
import { zuruecksetzen as vorlagenZuruecksetzen } from './empfaengervorlagen';

export const LASTKUNDEN_ANZAHL = 300;
/** Öffentliche Testdaten: die PIN aller Lastkunden, wenn LASTTEST_PIN nicht gesetzt ist. */
export const LASTTEST_PIN_STANDARD = '97531';
/** Je Lastkunde hält der Dienst nur die jüngsten so vielen Umsätze je Konto und Auftrags-Kennungen. */
export const LAST_SPEICHERGRENZE = 200;
/** Saldo und Dispositionsrahmen des Girokontos eines Lastkunden in Euro. */
export const LAST_SALDO = 10000;
export const LAST_DISPOSITIONSRAHMEN = 1000;

/** Bankleitzahl der Demo-Konten; die Kontonummern der Lastkunden liegen bei 99000000nn, fern der Demo-Konten. */
const BLZ = '50010517';

/** Kennung des Lastkunden mit dieser Nummer (1 bis 300): lasttest-001 bis lasttest-300. */
export const lastKennung = (nr: number) => `${LAST_PRAEFIX}${String(nr).padStart(3, '0')}`;

/** Deutsche IBAN aus Bankleitzahl und Kontonummer, Prüfziffer nach ISO 7064 MOD 97-10. */
export function deutscheIban(blz: string, kontonummer: string): string {
  const bban = blz + kontonummer.padStart(10, '0');
  let rest = 0;
  for (const ziffer of `${bban}131400`) rest = (rest * 10 + Number(ziffer)) % 97; // „DE00“ hinten: D=13, E=14
  return `DE${String(98 - rest).padStart(2, '0')}${bban}`;
}

/** IBAN des Girokontos des Lastkunden mit dieser Nummer, eindeutig je Nummer. */
export const lastIban = (nr: number) => deutscheIban(BLZ, String(9900000000 + nr));

/** Demo-Reset (POST /api/test/reset): Sitzungen, Konten, Umsätze, Aufträge und Vorlagen der Demo-Kundinnen. */
export function demoZuruecksetzen(): void {
  zuruecksetzenFuer(istDemokunde);
}

/** Last-Reset (POST /api/test/lasttest/reset): dasselbe nur für die Lastkunden. */
export function lastdatenZuruecksetzen(): void {
  zuruecksetzenFuer(istLastkunde);
}

function zuruecksetzenFuer(auswahl: Auswahl): void {
  beendenFuer(auswahl);
  kontenZuruecksetzen(auswahl);
  auftraegeZuruecksetzen(auswahl);
  umsaetzeZuruecksetzen(auswahl); // nach den Konten: der Saldo danach ergibt sich aus dem Kontosaldo
  vorlagenZuruecksetzen(auswahl);
}

/** Legt im Testbetrieb die Lastkunden mit einem Girokonto ohne Umsätze an. */
export function lastkundenAnlegen(pin: string = LASTTEST_PIN_STANDARD): Kunde[] {
  const kunden: Kunde[] = [];
  for (let nr = 1; nr <= LASTKUNDEN_ANZAHL; nr++) {
    const kennung = lastKennung(nr);
    const nummer = String(nr).padStart(3, '0');
    kunden.push({ kennung, pin, vorname: 'Last', nachname: `Test ${nummer}`, kundennummer: `L-000 ${nummer}`, speichergrenze: LAST_SPEICHERGRENZE });
    ausgangsstandSetzen(kennung, [
      { kontoname: 'Girokonto', art: 'Girokonto', iban: lastIban(nr), saldo: LAST_SALDO, waehrung: 'EUR', dispositionsrahmen: LAST_DISPOSITIONSRAHMEN },
    ]);
  }
  kundenHinzufuegen(kunden);
  lastdatenZuruecksetzen();
  return kunden;
}
