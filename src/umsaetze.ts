/* UC-003 Umsätze eines Kontos: Demo-Umsätze (C-001), Reihenfolge und Saldo danach (BR-0008), Filter (BR-0009, BR-0010). */
import { kontoMitIban } from './konten';

export interface Umsatz {
  buchungstag: string;
  /** Zeitpunkt der Buchung in UTC; bei gleichem Buchungstag steht der jüngere oben (BR-0008). */
  gebuchtAm: string;
  gegenpartei: string;
  verwendungszweck: string;
  /** Eingang positiv, Ausgang negativ (BR-0009). */
  betrag: number;
  waehrung: 'EUR';
  saldoDanach: number;
}

export type Richtung = 'alle' | 'eingang' | 'ausgang';

export interface Filter {
  suchtext?: string;
  von?: string;
  bis?: string;
  richtung?: Richtung;
}

export const ZEITRAUM_FEHLER = 'Der Zeitraum ist ungültig: von liegt nach bis.';

/** Ungültige Abfrage (Vertrag: 400). */
export class Abfragefehler extends Error {}

type Demo = Omit<Umsatz, 'waehrung' | 'saldoDanach'>;

/**
 * Demo-Umsätze je IBAN, neueste zuerst (C-001). Gegenparteien und Verwendungszwecke kommen in keinem Szenario
 * als Suchtext vor. Der Saldo danach ergibt sich rückwärts aus dem Kontosaldo: Der jüngste trägt ihn (BR-0008).
 */
const DEMO: Record<string, Demo[]> = {
  DE02500105175407324931: [
    { buchungstag: '2026-02-12', gebuchtAm: '2026-02-12T09:30:00.000Z', gegenpartei: 'Bäckerei Krause', verwendungszweck: 'Einkauf', betrag: -12 },
    { buchungstag: '2026-02-10', gebuchtAm: '2026-02-10T07:15:00.000Z', gegenpartei: 'Energieversorgung Nord', verwendungszweck: 'Abschlag Februar', betrag: -86 },
    { buchungstag: '2026-02-01', gebuchtAm: '2026-02-01T06:00:00.000Z', gegenpartei: 'Lindner Logistik GmbH', verwendungszweck: 'Gehalt Januar', betrag: 2640 },
    { buchungstag: '2026-01-28', gebuchtAm: '2026-01-28T14:20:00.000Z', gegenpartei: 'Hausverwaltung Berger', verwendungszweck: 'Miete Februar', betrag: -950 },
  ],
  DE44500105175407324955: [
    { buchungstag: '2026-02-11', gebuchtAm: '2026-02-11T18:45:00.000Z', gegenpartei: 'Buchhandlung Seitenweise', verwendungszweck: 'Kartenzahlung', betrag: -42.95 },
    { buchungstag: '2026-02-05', gebuchtAm: '2026-02-05T12:10:00.000Z', gegenpartei: 'Reisebüro Fernweh', verwendungszweck: 'Bahnticket', betrag: -129.5 },
    { buchungstag: '2026-02-02', gebuchtAm: '2026-02-02T08:00:00.000Z', gegenpartei: 'Aventa Bank', verwendungszweck: 'Ausgleich Abrechnung Januar', betrag: 500 },
  ],
};

const runden = (betrag: number) => Math.round(betrag * 100) / 100;

let umsaetze = new Map<string, Umsatz[]>();

export function zuruecksetzen(): void {
  umsaetze = new Map();
  for (const [iban, liste] of Object.entries(DEMO)) {
    let saldo = kontoMitIban(iban)?.saldo ?? 0;
    const mitSaldo: Umsatz[] = [];
    for (const u of liste) {
      mitSaldo.push({ ...u, waehrung: 'EUR', saldoDanach: runden(saldo) });
      saldo -= u.betrag;
    }
    umsaetze.set(iban, mitSaldo);
  }
}
zuruecksetzen();

/** BR-0012: der Umsatz einer ausgeführten Überweisung. */
export function buchen(iban: string, umsatz: Omit<Umsatz, 'waehrung'>): void {
  umsaetze.set(iban, [...(umsaetze.get(iban) ?? []), { ...umsatz, waehrung: 'EUR' }]);
}

const DATUM = /^\d{4}-\d{2}-\d{2}$/;

/** Prüft die Abfrage (400 bei Fehlern) und gibt den Filter zurück. */
export function filterAus(abfrage: Record<string, unknown>): Filter {
  const wert = (name: string) => (typeof abfrage[name] === 'string' ? (abfrage[name] as string).trim() : '');
  const von = wert('von');
  const bis = wert('bis');
  const richtung = (wert('richtung') || 'alle').toLowerCase();
  for (const datum of [von, bis]) {
    if (datum && (!DATUM.test(datum) || Number.isNaN(Date.parse(`${datum}T00:00:00Z`)))) throw new Abfragefehler('Das Datum ist ungültig: erwartet JJJJ-MM-TT.');
  }
  if (!['alle', 'eingang', 'ausgang'].includes(richtung)) throw new Abfragefehler('Die Richtung ist ungültig: alle, eingang oder ausgang.');
  if (von && bis && von > bis) throw new Abfragefehler(ZEITRAUM_FEHLER);
  return { suchtext: wert('suchtext') || undefined, von: von || undefined, bis: bis || undefined, richtung: richtung as Richtung };
}

/** Umsätze des Kontos, neueste zuerst (BR-0008), gefiltert (BR-0009, BR-0010); `undefined`, wenn es das Konto nicht gibt. */
export function umsaetzeVon(iban: string, filter: Filter = {}): Umsatz[] | undefined {
  const konto = kontoMitIban(iban);
  if (!konto) return undefined;
  const suche = filter.suchtext?.toLocaleLowerCase('de-DE');
  // Gleicher Zeitpunkt (zwei Buchungen in derselben Millisekunde): die später gebuchte oben.
  return (umsaetze.get(konto.iban) ?? []).map((u, nr) => ({ u, nr }))
    .filter(({ u }) => !suche || u.gegenpartei.toLocaleLowerCase('de-DE').includes(suche) || u.verwendungszweck.toLocaleLowerCase('de-DE').includes(suche))
    .filter(({ u }) => (!filter.von || u.buchungstag >= filter.von) && (!filter.bis || u.buchungstag <= filter.bis))
    .filter(({ u }) => filter.richtung === 'eingang' ? u.betrag > 0 : filter.richtung === 'ausgang' ? u.betrag < 0 : true)
    .sort((a, b) => b.u.buchungstag.localeCompare(a.u.buchungstag) || b.u.gebuchtAm.localeCompare(a.u.gebuchtAm) || b.nr - a.nr)
    .map(({ u }) => ({ ...u }));
}
