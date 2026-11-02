import assert from 'node:assert/strict';
import { AddressInfo } from 'node:net';
import test from 'node:test';
import { dienst } from '../src/app';

async function mitDienst(testbetrieb: boolean, pruefen: (basis: string) => Promise<void>) {
  const server = dienst({ testbetrieb }).listen(0);
  await new Promise(fertig => server.once('listening', fertig));
  try {
    await pruefen(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
  } finally {
    server.close();
  }
}

test('GET /api/version nennt den Commit aus VERSION', async () => {
  process.env.VERSION = 'abc1234';
  await mitDienst(false, async basis => {
    const antwort = await fetch(`${basis}/api/version`);
    assert.equal(antwort.status, 200);
    assert.deepEqual(await antwort.json(), { version: 'abc1234' });
  });
});

test('Zurücksetzen gibt es nur im Testbetrieb', async () => {
  await mitDienst(false, async basis => {
    assert.equal((await fetch(`${basis}/api/test/reset`, { method: 'POST' })).status, 404);
  });
  await mitDienst(true, async basis => {
    assert.equal((await fetch(`${basis}/api/test/reset`, { method: 'POST' })).status, 204);
  });
});
