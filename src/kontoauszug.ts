/* UC-024 Kontoauszug als PDF: Monat prüfen, Salden nach BR-0098, PDF beim Abruf erzeugen und nicht speichern (ADR-008). */
import PDFDocument from 'pdfkit';
import { Konto } from './konten';
import { Umsatz, heuteUtc } from './umsaetze';

export const MONAT_UNGUELTIG = 'Der Monat ist ungültig: JJJJ-MM, höchstens der laufende Monat.';
const MONAT = /^[0-9]{4}-(0[1-9]|1[0-2])$/;

/** Ungültiger Monat (Vertrag: 400). */
export class Monatsfehler extends Error {}

/** Prüft Format und Obergrenze (höchstens der laufende Monat, UTC); sonst Monatsfehler. */
export function monatPruefen(monat: unknown): string {
  if (typeof monat !== 'string' || !MONAT.test(monat) || monat > heuteUtc().slice(0, 7)) throw new Monatsfehler(MONAT_UNGUELTIG);
  return monat;
}

export interface Auszug { monat: string; anfangssaldo: number; endsaldo: number; umsaetze: Umsatz[] }

const runden = (betrag: number) => Math.round(betrag * 100) / 100;

/**
 * BR-0098: `umsaetze` sind alle Umsätze des Kontos, neueste zuerst (BR-0008). Endsaldo und Anfangssaldo sind der
 * Saldo danach des neuesten Umsatzes bis zum Monatsende beziehungsweise vor dem Monatsersten; gibt es keinen,
 * gilt der Saldo vor dem ersten Umsatz, bei einem Konto ohne Umsätze der Kontosaldo.
 */
export function auszugAus(konto: Pick<Konto, 'saldo'>, umsaetze: Umsatz[], monat: string): Auszug {
  const saldoBis = (grenze: (u: Umsatz) => boolean) => {
    const u = umsaetze.find(grenze);
    if (u) return u.saldoDanach;
    const erster = umsaetze[umsaetze.length - 1];
    return erster ? runden(erster.saldoDanach - erster.betrag) : konto.saldo;
  };
  return {
    monat,
    anfangssaldo: runden(saldoBis(u => u.buchungstag < `${monat}-01`)),
    endsaldo: runden(saldoBis(u => u.buchungstag.slice(0, 7) <= monat)),
    umsaetze: umsaetze.filter(u => u.buchungstag.startsWith(monat)),
  };
}

const eurofmt = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
const euro = (betrag: number) => eurofmt.format(betrag).replace(/[  ]/g, ' ').replace(/−/g, '-');
const tag = (wert: string) => wert.split('-').reverse().join('.');

/** UC-024 Schritt 5: das PDF mit Kopf, Salden und allen Umsätzen des Monats. */
export function pdfAus(konto: Pick<Konto, 'kontoname' | 'iban'>, auszug: Auszug): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const dok = new PDFDocument({ size: 'A4', margin: 40, info: { Title: `Kontoauszug ${auszug.monat}` } });
    const teile: Buffer[] = [];
    dok.on('data', (t: Buffer) => teile.push(t));
    dok.on('end', () => resolve(Buffer.concat(teile)));
    dok.on('error', reject);

    const spalten = [
      { text: 'Buchungstag', x: 40, w: 62, rechts: false }, { text: 'Gegenpartei', x: 105, w: 110, rechts: false },
      { text: 'Verwendungszweck', x: 218, w: 130, rechts: false }, { text: 'Betrag', x: 351, w: 90, rechts: true }, { text: 'Saldo danach', x: 444, w: 111, rechts: true },
    ];
    const zeile = (werte: string[], fett = false) => {
      dok.font(fett ? 'Helvetica-Bold' : 'Helvetica').fontSize(9);
      const hoehe = Math.max(...werte.map((w, i) => dok.heightOfString(w, { width: spalten[i].w })));
      if (dok.y + hoehe > dok.page.height - 60) dok.addPage();
      const y = dok.y;
      werte.forEach((w, i) => dok.text(w, spalten[i].x, y, { width: spalten[i].w, align: spalten[i].rechts ? 'right' : 'left' }));
      dok.x = 40;
      dok.y = y + hoehe + 4;
    };

    dok.font('Helvetica-Bold').fontSize(16).text('Kontoauszug');
    dok.font('Helvetica').fontSize(10).moveDown(0.5);
    dok.text(`Kontoname: ${konto.kontoname}`);
    dok.text(`IBAN: ${konto.iban.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim()}`);
    dok.text(`Monat: ${auszug.monat}`);
    dok.moveDown(0.5);
    dok.text(`Anfangssaldo: ${euro(auszug.anfangssaldo)}`);
    dok.text(`Endsaldo: ${euro(auszug.endsaldo)}`);
    dok.moveDown();
    zeile(spalten.map(s => s.text), true);
    for (const u of auszug.umsaetze) zeile([tag(u.buchungstag), u.gegenpartei, u.verwendungszweck, euro(u.betrag), euro(u.saldoDanach)]);
    dok.end();
  });
}
