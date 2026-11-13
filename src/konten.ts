/* Konten je Kundin (C-001: noch kein Kernbanksystem). Jedes Konto gehört genau einer Kennung; jede Abfrage nennt die Kennung der Sitzung. */
import { Auswahl, istDemokunde } from './kunden';

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

/** Demo-Bestand je Kennung, Girokonto zuerst, dann Kreditkarte. Jonas hat eine eigene Kopie von Lenas Bestand mit eigenen IBANs. */
const DEMO: Record<string, Konto[]> = {
  'lena.hoffmann': [
    { kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE02500105175407324931', saldo: 2145.30, waehrung: 'EUR', dispositionsrahmen: 1000 },
    { kontoname: 'Kreditkarte', art: 'Kreditkarte', iban: 'DE44500105175407324955', saldo: -387.45, waehrung: 'EUR' },
  ],
  'jonas.weber': [
    { kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE61500105175407325013', saldo: 2145.30, waehrung: 'EUR', dispositionsrahmen: 1000 },
    { kontoname: 'Kreditkarte', art: 'Kreditkarte', iban: 'DE39500105175407325021', saldo: -387.45, waehrung: 'EUR' },
  ],
};

/** Ausgangsstand je Kennung: die Demo-Kundinnen fest, Lastkunden kommen über `ausgangsstandSetzen` dazu. */
const ausgangsstand = new Map<string, readonly Konto[]>(Object.entries(DEMO));

/** Aktueller Bestand je Kennung. */
const konten = new Map<string, Konto[]>();

/** Setzt die Konten der ausgewählten Kennungen auf ihren Ausgangsstand; ohne Auswahl die Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const [kennung, bestand] of ausgangsstand) {
    if (auswahl(kennung)) konten.set(kennung, bestand.map(k => ({ ...k })));
  }
}
zuruecksetzen();

/** Legt den Ausgangsstand einer Kennung fest und setzt ihre Konten darauf. */
export function ausgangsstandSetzen(kennung: string, bestand: readonly Konto[]): void {
  ausgangsstand.set(kennung, bestand.map(k => ({ ...k })));
  konten.set(kennung, bestand.map(k => ({ ...k })));
}

/** Kennungen mit Konten und ihre IBANs, für das Zurücksetzen der Umsätze. */
export function ibansJeKennung(): [string, string[]][] {
  return [...ausgangsstand.keys()].map(kennung => [kennung, (konten.get(kennung) ?? []).map(k => k.iban)]);
}

const eigene = (kennung: string) => konten.get(kennung) ?? [];

/** Ein Girokonto ohne Dispositionsrahmen ist ein Datenfehler (Vertrag: 500). Die Meldung landet im Log und nennt nur Ort und Art, keinen Kontobezug (PK-9). */
export class Datenfehler extends Error {}

const runden = (betrag: number) => Math.round(betrag * 100) / 100;

/** UC-001: Konten der Kundin mit verfügbarem Betrag (BR-0002) und Gesamtvermögen (BR-0001). */
export function finanzstatus(kennung: string): { gesamtvermoegen: number; konten: (Konto & { verfuegbarerBetrag?: number })[] } {
  const bestand = eigene(kennung);
  return {
    gesamtvermoegen: runden(bestand.reduce((summe, k) => summe + k.saldo, 0)),
    konten: bestand.map(k => {
      if (k.art !== 'Girokonto') return { ...k };
      if (k.dispositionsrahmen === undefined) throw new Datenfehler('Finanzstatus: Girokonto ohne Dispositionsrahmen');
      return { ...k, verfuegbarerBetrag: runden(k.saldo + k.dispositionsrahmen) };
    }),
  };
}

/** BR-0007: das Girokonto der Kundin mit dieser IBAN, sonst nichts. */
export function girokonto(kennung: string, iban: string): (Konto & { dispositionsrahmen: number }) | undefined {
  const konto = eigene(kennung).find(k => k.art === 'Girokonto' && k.iban === iban);
  return konto && konto.dispositionsrahmen !== undefined ? konto as Konto & { dispositionsrahmen: number } : undefined;
}

/** BR-0011: ein Konto der Kundin mit dieser IBAN (Leerzeichen zählen nicht), sonst nichts; fremde Konten gibt es für sie nicht. */
export function kontoMitIban(kennung: string, iban: string): Konto | undefined {
  const gesucht = iban.replace(/\s+/g, '').toUpperCase();
  const konto = eigene(kennung).find(k => k.iban === gesucht);
  return konto && { ...konto };
}

/** BR-0006: den Saldo eines Kontos der Kundin um den Betrag mindern. */
export function belasten(kennung: string, iban: string, betrag: number): void {
  const konto = eigene(kennung).find(k => k.iban === iban);
  if (!konto) throw new Error('Belastung: Konto gehört nicht zur Kundin');
  konto.saldo = runden(konto.saldo - betrag);
}

/** Nur für Tests: Konten einer Kennung setzen, ohne den Ausgangsstand zu ändern. */
export function kontenSetzen(kennung: string, neu: Konto[]): void {
  konten.set(kennung, neu.map(k => ({ ...k })));
}
