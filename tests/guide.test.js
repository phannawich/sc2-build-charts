import assert from 'node:assert/strict';
import test from 'node:test';
import pvt from '../src/guides/pvt.js';
import { validateGuide } from '../src/guides/validate.js';

const guide = (ids, edges = []) => ({
  slug: 'fixture', cards: ids.map(id => ({ id })), edges: edges.map(([from, to]) => ({ from, to })),
});

test('rejects duplicate card IDs', () => {
  assert.throws(() => validateGuide(guide(['opening', 'opening'])), /duplicate card ID "opening"/);
});

test('rejects a dangling endpoint at either end of a connection', () => {
  for (const pair of [['start', 'missing'], ['missing', 'start']]) {
    assert.throws(() => validateGuide(guide(['start'], [pair])), /unknown card "missing"/);
  }
});

test('PvT contains all original directed connections', () => {
  assert.doesNotThrow(() => validateGuide(pvt));
  assert.equal(pvt.cards.length, 14);
  assert.deepEqual(pvt.edges.map(({ from, to }) => `${from}:${to}`).sort(), [
    'opening:proxy', 'opening:twilight', 'twilight:first-scout',
    'first-scout:mine', 'first-scout:cyclone', 'first-scout:reapers', 'first-scout:hellion', 'first-scout:push',
    'mine:robo', 'cyclone:robo', 'reapers:robo', 'hellion:robo', 'robo:followup',
    'followup:aggression', 'followup:setup', 'aggression:setup', 'push:setup', 'setup:midgame',
  ].sort());
});
