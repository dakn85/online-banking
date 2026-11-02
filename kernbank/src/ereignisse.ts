import { Kafka, Producer } from 'kafkajs';
import { beimZuruecksetzen } from './daten';

/*
  Platzhalter für Kafka-Ereignisse (etwa Buchungsereignisse an das Online-Banking).
  Topics beginnen mit "kernbank.". Ohne KAFKA_BROKERS wird nur geloggt.
*/

export const TOPIC_PRAEFIX = 'kernbank.';

export interface Ereignis {
  topic: string;
  schluessel: string;
  inhalt: unknown;
}

const broker = (process.env.KAFKA_BROKERS ?? '').split(',').map(s => s.trim()).filter(Boolean);
let produzent: Promise<Producer> | undefined;
const gesendet: Ereignis[] = [];
beimZuruecksetzen(() => { gesendet.length = 0; });

function verbinden(): Promise<Producer> {
  produzent ??= (async () => {
    const p = new Kafka({ clientId: 'kernbank', brokers: broker }).producer();
    await p.connect();
    return p;
  })().catch(fehler => { produzent = undefined; throw fehler; });
  return produzent;
}

/** Sendet ein Ereignis an das Topic kernbank.<thema>, etwa senden('buchung.ausgefuehrt', kontoId, buchung). */
export async function senden(thema: string, schluessel: string, inhalt: unknown): Promise<void> {
  const ereignis: Ereignis = { topic: TOPIC_PRAEFIX + thema, schluessel, inhalt };
  gesendet.push(ereignis);
  if (!broker.length) {
    console.log(`Ereignis ${ereignis.topic} (${schluessel}), ohne KAFKA_BROKERS nur geloggt: ${JSON.stringify(inhalt)}`);
    return;
  }
  await (await verbinden()).send({ topic: ereignis.topic, messages: [{ key: schluessel, value: JSON.stringify(inhalt) }] });
}

/** Die seit dem letzten Zurücksetzen gesendeten Ereignisse (für Tests). */
export function gesendeteEreignisse(): readonly Ereignis[] {
  return gesendet;
}

export async function ereignisseBeenden(): Promise<void> {
  const p = produzent;
  produzent = undefined;
  if (p) await (await p).disconnect().catch(() => undefined);
}
