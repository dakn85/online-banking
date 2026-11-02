/* Konten der Demo-Kundinnen (C-001: noch kein Kernbanksystem). Alle Kundinnen sehen denselben Demo-Bestand. */

export type Kontoart = 'Girokonto' | 'Kreditkarte';

export interface Konto {
  kontoname: string;
  art: Kontoart;
  iban: string;
  saldo: number;
  waehrung: 'EUR';
  /** BR-0002: nur beim Girokonto, dort Pflicht. */
  dispositionsrahmen?: number;
}

/** Girokonto zuerst, dann Kreditkarte. */
const AUSGANGSSTAND: Konto[] = [
  { kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE02500105175407324931', saldo: 2145.30, waehrung: 'EUR', dispositionsrahmen: 1000 },
  { kontoname: 'Kreditkarte', art: 'Kreditkarte', iban: 'DE44500105175407324955', saldo: -387.45, waehrung: 'EUR' },
];

let konten: Konto[] = [];

export function zuruecksetzen(): void {
  konten = AUSGANGSSTAND.map(k => ({ ...k }));
}
zuruecksetzen();

/** Ein Girokonto ohne Dispositionsrahmen ist ein Datenfehler (Vertrag: 500). Die Meldung landet im Log und nennt nur Ort und Art, keinen Kontobezug (PK-9). */
export class Datenfehler extends Error {}

const runden = (betrag: number) => Math.round(betrag * 100) / 100;

/** UC-001: Konten mit verfügbarem Betrag (BR-0002) und Gesamtvermögen (BR-0001). */
export function finanzstatus(): { gesamtvermoegen: number; konten: (Konto & { verfuegbarerBetrag?: number })[] } {
  return {
    gesamtvermoegen: runden(konten.reduce((summe, k) => summe + k.saldo, 0)),
    konten: konten.map(k => {
      if (k.art !== 'Girokonto') return { ...k };
      if (k.dispositionsrahmen === undefined) throw new Datenfehler('Finanzstatus: Girokonto ohne Dispositionsrahmen');
      return { ...k, verfuegbarerBetrag: runden(k.saldo + k.dispositionsrahmen) };
    }),
  };
}

/** BR-0007: das Girokonto mit dieser IBAN, sonst nichts. */
export function girokonto(iban: string): (Konto & { dispositionsrahmen: number }) | undefined {
  const konto = konten.find(k => k.art === 'Girokonto' && k.iban === iban);
  return konto && konto.dispositionsrahmen !== undefined ? konto as Konto & { dispositionsrahmen: number } : undefined;
}

/** BR-0006: den Saldo eines Kontos um den Betrag mindern. */
export function belasten(iban: string, betrag: number): void {
  const konto = konten.find(k => k.iban === iban);
  if (!konto) throw new Error(`Konto ${iban} unbekannt`);
  konto.saldo = runden(konto.saldo - betrag);
}

/** Nur für Tests: Konten setzen. */
export function kontenSetzen(neu: Konto[]): void {
  konten = neu.map(k => ({ ...k }));
}
