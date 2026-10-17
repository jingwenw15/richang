import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios } from '../src/content.js';
import { hydrate } from '../src/model.js';
import { createOfflinePreparation, suggestRehearsalTopic, makeRehearsal, offlineRehearsalReply, rehearsalPhrases, completeRehearsal, retryRehearsal, restoreRehearsals, validatePreparation, validateRehearsalResponse } from '../src/rehearsal.js';

const sampleSession = () => makeRehearsal({ goal: 'Explain that I am waiting for a coworker.', audience: 'manager', source: 'offline', topic: 'dependency', plan: createOfflinePreparation('dependency') }, 1700000000000);

test('offline topic matching is transparent and every lesson supports a three-expression rehearsal', () => {
  assert.equal(suggestRehearsalTopic('I am waiting on someone before I finish'), 'dependency');
  assert.equal(suggestRehearsalTopic('I need to reschedule because I will be late'), 'changing-plans');
  assert.equal(suggestRehearsalTopic('An unrelated legal document'), '');
  assert.throws(() => createOfflinePreparation('missing'), /Choose an offline topic/);
  for (const topic of ['dependency', ...scenarios.map(s => s.id)]) {
    const plan = createOfflinePreparation(topic);
    assert.equal(plan.expressions.length, 3); assert.equal(plan.goals.length, 3);
    assert.ok(plan.expressions.every(p => p.zh && p.traditional && p.pinyin && p.en && p.note));
  }
});
test('offline replies are not judged by matching a reference string', () => {
  const session = sampleSession(); session.phase = 'talk';
  assert.throws(() => offlineRehearsalReply(session, '  '), /reply first/);
  for (const answer of ['我在等设计师的反馈。', 'I need the review before I can continue.', 'Different valid wording, but offline cannot assess it.']) {
    const result = offlineRehearsalReply(session, answer);
    assert.equal(result.feedback.status, 'compare'); assert.equal(result.goalMet, false);
    assert.match(result.feedback.message, /does not judge/);
  }
});
test('only finished conversations get a reminder, and retries retain the previous attempt', () => {
  const session = sampleSession(); session.phase = 'talk';
  assert.throws(() => completeRehearsal(session), /three replies/);
  for (let i = 0; i < 3; i++) {
    const result = offlineRehearsalReply(session, '我的回复');
    session.turns.push({ answer: '我的回复', prompt: session.plan.opening, result });
  }
  completeRehearsal(session, 1700000000000);
  assert.equal(session.revisitAt, 1700000000000 + 86400000);
  assert.equal(session.phase, 'done');
  const restored = restoreRehearsals(JSON.parse(JSON.stringify([session])))[0];
  assert.equal(restored.turns.length, 3);
  retryRehearsal(restored); assert.equal(restored.phase, 'talk'); assert.equal(restored.turns.length, 0);
  assert.equal(restored.attempts.length, 1); assert.equal(restored.attempts[0].turns.length, 3);
});
test('new storage fields do not erase old progress and invalid saved plans are rejected', () => {
  const old = hydrate({ version: 1, saved: ['u1'], completed: ['updates'] });
  assert.deepEqual(old.saved, ['u1']); assert.deepEqual(old.rehearsals, []);
  const s = sampleSession(); const personal = rehearsalPhrases(s);
  assert.equal(new Set(personal.map(p => p.id)).size, 3);
  const restored = hydrate({ ...old, rehearsals: [s], personalPhrases: personal });
  assert.equal(restored.rehearsals.length, 1); assert.equal(restored.personalPhrases.length, 3);
  assert.equal(restored.personalPhrases[0].category, 'At work');
  assert.deepEqual(restoreRehearsals([{ ...s, plan: {} }]), []);
  assert.deepEqual(restoreRehearsals([{ ...s, phase: 'done', turns: [] }]), []);
  assert.throws(() => validatePreparation({ ...s.plan, expressions: [] }), /incomplete/);
  assert.throws(() => validateRehearsalResponse({}), /incomplete/);
});
