/* UC-022 Lastschrift zurückgeben: BR-0093 bis BR-0095. Je Kundin im Speicher (ADR-002), kennt kein HTTP. */
import { gutschreiben, kontoMitIban } from './konten';
import { Kunde } from './kunden';
import { buchen, heuteUtc, Umsatz, umsatzMitId } from './umsaetze';

export const KONTO_FEHLER = 'Das Konto wurde nicht gefunden.';
export const UMSATZ_FEHLER = 'Der Umsatz wurde nicht gefunden.';
export const KEINE_LASTSCHRIFT_FEHLER = 'Dieser Umsatz ist keine SEPA-Lastschrift.';
export const SCHON_ZURUECK_FEHLER = 'Die Lastschrift wurde bereits zurückgegeben.';
export const FRIST_FEHLER = 'Die Rückgabefrist von 8 Wochen ist abgelaufen.';
export const FORMAT_FEHLER = 'Die Kennung des Umsatzes ist ungültig.';
/** BR-0093: höchstens 56 Tage seit dem Buchungstag, der Buchungstag zählt als Tag 0. */
export const FRIST_TAGE = 56;
export const VERWENDUNGSZWECK = 'Rückgabe Lastschrift';

export interface Rueckgabe { lastschriftUmsatzId: string; gutschrift: Umsatz }

/** Abgelehnte Rückgabe mit dem Status, den der Vertrag dafür nennt. */
export class Rueckgabefehler extends Error {
  constructor(readonly status: 400 | 404 | 422, meldung: string) { super(meldung); }
}

const tage = (tag: string) => Date.parse(`${tag}T00:00:00Z`) / 86_400_000;

/**
 * UC-022 Schritt 5: Prüfreihenfolge Format (400), Konto (404, BR-0011), Umsatz (404), Lastschrift (422), schon zurückgegeben (422),
 * Frist (422, BR-0093); dann Gutschrift, Umsatz und Rückgabestatus (BR-0095).
 */
export function zurueckgeben(kunde: Pick<Kunde, 'kennung' | 'speichergrenze'>, iban: string, umsatzId: string): Rueckgabe {
  if (umsatzId.length < 1 || umsatzId.length > 36) throw new Rueckgabefehler(400, FORMAT_FEHLER);
  const konto = kontoMitIban(kunde.kennung, iban);
  if (!konto) throw new Rueckgabefehler(404, KONTO_FEHLER);
  const lastschrift = umsatzMitId(konto.iban, umsatzId);
  if (!lastschrift) throw new Rueckgabefehler(404, UMSATZ_FEHLER);
  if (!lastschrift.sepaLastschrift) throw new Rueckgabefehler(422, KEINE_LASTSCHRIFT_FEHLER);
  if (lastschrift.zurueckgegeben) throw new Rueckgabefehler(422, SCHON_ZURUECK_FEHLER);
  const heute = heuteUtc();
  if (tage(heute) - tage(lastschrift.buchungstag) > FRIST_TAGE) throw new Rueckgabefehler(422, FRIST_FEHLER);
  const betrag = Math.abs(lastschrift.betrag);
  const saldo = gutschreiben(kunde.kennung, konto.iban, betrag);
  lastschrift.zurueckgegeben = true;
  const gutschrift = buchen(konto.iban, {
    buchungstag: heute, gebuchtAm: new Date().toISOString(), gegenpartei: lastschrift.gegenpartei, verwendungszweck: VERWENDUNGSZWECK,
    betrag, kategorie: lastschrift.kategorie, saldoDanach: saldo,
  }, kunde.speichergrenze);
  return { lastschriftUmsatzId: lastschrift.umsatzId, gutschrift };
}
