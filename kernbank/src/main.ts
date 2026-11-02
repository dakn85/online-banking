import { dienst } from './app';
import { ereignisseBeenden } from './ereignisse';

const port = Number(process.env.PORT ?? 8080);
const testbetrieb = process.env.TEST_MODE === '1';

const server = dienst({ testbetrieb }).listen(port, () =>
  console.log(`Kernbank läuft auf Port ${port}${testbetrieb ? ' (Testbetrieb)' : ''}`));

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    server.close();
    ereignisseBeenden().finally(() => process.exit(0));
  });
}
