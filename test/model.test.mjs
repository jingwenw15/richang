import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, hydrate, dateKey, dueIds, logPractice, scheduleReview, streak } from '../src/model.js';
import { scenarios, phrases, phraseById } from '../src/content.js';

test('curriculum has 96 unique, bilingual phrases and valid roleplay choices', () => {
  assert.equal(scenarios.length, 16); assert.equal(phrases.length, 96);
  assert.equal(new Set(scenarios.map(s => s.id)).size, scenarios.length);
  assert.equal(new Set(phrases.map(p => p.id)).size, phrases.length);
  for (const scene of scenarios) {
    assert.equal(scene.phrases.length, 6, scene.id);
    assert.equal(scene.turns.length, 3, scene.id);
    for (const p of scene.phrases) for (const key of ['zh', 'traditional', 'pinyin', 'en', 'note']) assert.ok(p[key], `${p.id}: ${key}`);
    for (const turn of scene.turns) {
      assert.ok(turn.options.includes(turn.correct));
      assert.equal(new Set(turn.options).size, 3);
      for (const id of turn.options) assert.ok(scene.phrases.some(p => p.id === id));
      assert.ok(turn.why);
      assert.ok(turn.goal, `${scene.id}: roleplay needs an explicit speaking goal`);
    }
  }
  assert.equal(phraseById('u1').category, 'At work');
  assert.equal(scenarios.filter(s => s.category === 'Everyday life').length, 11);
});
test('hydration safely recovers from missing or malformed stored progress', () => {
  assert.deepEqual(hydrate(null), defaultState());
  assert.deepEqual(hydrate({ version: 20 }), defaultState());
  const result = hydrate({ version: 1, saved: 'bad', completed: ['updates', 12], reviews: [], activity: null, settings: { goal: -1, pinyin: 'false', slow: true } });
  assert.deepEqual(result.saved, []); assert.deepEqual(result.completed, ['updates']);
  assert.equal(result.settings.goal, 6); assert.equal(result.settings.pinyin, true); assert.equal(result.settings.slow, true);
});
test('review scheduling returns forgotten words in 10 minutes and spaces stronger recall', () => {
  const now = 1700000000000;
  assert.equal(scheduleReview(null, 'again', now).due, now + 600000);
  assert.equal(scheduleReview(null, 'hard', now).interval, 1);
  assert.equal(scheduleReview(null, 'good', now).interval, 2);
  assert.equal(scheduleReview({ interval: 4, repetitions: 3 }, 'easy', now).interval, 12);
  assert.equal(scheduleReview({ interval: 4, repetitions: 3 }, 'easy', now).repetitions, 4);
});
test('daily goal counts distinct phrases and due phrases are ordered', () => {
  const state = defaultState(); const now = new Date(2026, 9, 13, 10).getTime();
  logPractice(state, 'u1', 'again', now); logPractice(state, 'u1', 'good', now); logPractice(state, 'u2', 'hard', now);
  assert.equal(state.activity[dateKey(new Date(now))].length, 2);
  assert.deepEqual(dueIds(state, now), []);
  assert.deepEqual(dueIds(state, now + 2 * 86400000), ['u2', 'u1']);
});
test('streak allows today to be unfinished, breaks on a missed day, and crosses months', () => {
  const state = defaultState(); const today = new Date(2026, 10, 1, 0, 30);
  state.activity = { '2026-10-31': ['u1'], '2026-10-30': ['u2'] };
  assert.equal(streak(state, today), 2);
  state.activity['2026-11-01'] = ['c1']; assert.equal(streak(state, today), 3);
  delete state.activity['2026-10-31']; assert.equal(streak(state, today), 1);
});
