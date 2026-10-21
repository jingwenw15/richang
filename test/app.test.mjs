import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { scenarios } from '../src/content.js';

// Run the actual bundled renderer with small DOM/storage doubles. Browser layout,
// microphone permissions, and OS speech need a real Mac and are documented separately.
function app(stored = {}, desktop = undefined) {
  const listeners = {};
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      innerHTML: '', textContent: '', open: false,
      classList: { add() {}, remove() {}, toggle() {} },
      addEventListener(name, callback) { listeners[selector + ':' + name] = callback; },
      querySelector: child => element(selector + ' ' + child),
      showModal() { this.open = true; }, close() { this.open = false; }
    });
    return elements.get(selector);
  };
  const context = vm.createContext({
    console, Date, Set, Map, JSON, Object, Array, String, Number, Math, Blob, URL,
    setTimeout: () => 0, clearTimeout() {},
    localStorage: { getItem: key => stored[key] || null, setItem: (key, value) => { stored[key] = value; } },
    document: { querySelector: element, querySelectorAll: () => [], addEventListener: (name, fn) => { listeners[name] = fn; }, body: element('body') },
    window: { desktop, addEventListener() {}, scrollTo() {} }
  });
  vm.runInContext(readFileSync(new URL('../src/app.bundle.js', import.meta.url), 'utf8'), context);
  return {
    click: async dataset => { await listeners.click({ target: { closest: () => ({ dataset, disabled: false }) }, preventDefault() {} }); },
    input: (id, value) => listeners.input({ target: { id, value } }),
    change: (id, value) => listeners.change({ target: { id, value } }),
    html: () => element('#app').innerHTML,
    modal: () => element('#practice-dialog').innerHTML,
    isOpen: () => element('#practice-dialog').open,
    stored, state: () => JSON.parse(stored['richang.v1']), element
  };
}
test('a full lesson saves phrases and completes a roleplay with accurate first-try scoring', async () => {
  const ui = app(); assert.match(ui.html(), /A little more fluent/);
  await ui.click({ start: 'updates' }); assert.ok(ui.isOpen()); assert.match(ui.modal(), /进度/);
  await ui.click({ save: 'u1' }); assert.deepEqual(ui.state().saved, ['u1']);
  for (let i = 0; i < 6; i++) await ui.click({ action: 'next-phrase' });
  assert.equal(Object.keys(ui.state().reviews).length, 6);
  await ui.click({ reply: 'u6' }); assert.match(ui.modal(), /try a different reply/);
  await ui.click({ reply: 'u2' }); assert.match(ui.modal(), /That fits/);
  await ui.click({ action: 'next-turn' }); await ui.click({ reply: 'u4' });
  await ui.click({ action: 'next-turn' }); await ui.click({ reply: 'u5' });
  await ui.click({ action: 'next-turn' }); assert.match(ui.modal(), /2 of 3 replies/);
  assert.deepEqual(ui.state().completed, ['updates']);
  await ui.click({ action: 'close-practice' }); assert.equal(ui.isOpen(), false);
  assert.match(ui.html(), /6<small> \/ 6/);
  const restored = app(ui.stored); assert.match(restored.html(), /6<small> \/ 6/);
});
test('closing an unpracticed lesson does not award progress', async () => {
  const ui = app(); await ui.click({ start: 'clarify' }); await ui.click({ action: 'close-practice' });
  assert.deepEqual(ui.state().reviews, {}); assert.deepEqual(ui.state().completed, []);
});
test('pronunciation explanations appear alongside the daily phrase and in preferences', async () => {
  const ui = app();
  assert.match(ui.html(), /Why yí in 一下\?/);
  assert.match(ui.html(), /Before a fourth tone it becomes rising yí/);
  await ui.click({ action: 'pinyin' });
  assert.doesNotMatch(ui.html(), /Why yí in 一下\?/);
  await ui.click({ page: 'settings' });
  assert.match(ui.html(), /How to read the tone marks/);
  assert.match(ui.html(), /Third-tone spelling keeps the original tone/);
  await ui.click({ start: 'clarify' });
  for (let i = 0; i < 6; i++) await ui.click({ action: 'next-phrase' });
  assert.match(ui.modal(), /You missed the last sentence/);
});
test('every scenario can be practiced to completion and all screens render afterward', async () => {
  const ui = app();
  for (const scene of scenarios) {
    await ui.click({ start: scene.id });
    for (const phrase of scene.phrases) await ui.click({ action: 'next-phrase' });
    for (const turn of scene.turns) {
      await ui.click({ reply: turn.correct });
      assert.match(ui.modal(), /That fits/);
      await ui.click({ action: 'next-turn' });
    }
    assert.match(ui.modal(), /3 of 3 replies/);
    await ui.click({ action: 'close-practice' });
  }
  assert.equal(Object.keys(ui.state().reviews).length, scenarios.flatMap(s => s.phrases).length);
  assert.equal(ui.state().completed.length, scenarios.length);
  for (const page of ['today', 'scenarios', 'review', 'library', 'progress', 'settings']) {
    await ui.click({ page }); assert.doesNotMatch(ui.html(), /undefined|NaN/);
  }
  assert.match(ui.html(), /Your data stays here/);
});
test('new everyday lessons are discoverable and existing progress survives the expansion', async () => {
  const originalIds = scenarios.slice(0, 8).map(s => s.id);
  const ui = app({ 'richang.v1': JSON.stringify({ version: 1, completed: originalIds, saved: ['u1'], reviews: { u1: { due: Date.now() + 86400000, interval: 2, repetitions: 1 } } }) });
  assert.match(ui.html(), /data-start="your-day"/);
  assert.match(ui.html(), /data-start="making-plans"/);
  await ui.click({ page: 'scenarios' });
  await ui.click({ filter: 'Everyday life' });
  for (const scene of scenarios.filter(s => s.category === 'Everyday life')) assert.ok(ui.html().includes(`data-start="${scene.id}"`));
  assert.doesNotMatch(ui.html(), /data-start="updates"/);
  await ui.click({ start: 'your-day' });
  assert.match(ui.modal(), /今天过得怎么样/);
  await ui.click({ action: 'close-practice' });
  assert.deepEqual(ui.state().completed, originalIds);
  assert.deepEqual(ui.state().saved, ['u1']);
  assert.equal(ui.state().reviews.u1.repetitions, 1);
  await ui.click({ page: 'library' });
  ui.input('phrase-search', 'charger');
  assert.match(ui.element('#phrase-results').innerHTML, /充电器/);
  assert.equal(ui.element('#library-count').textContent, '1 phrases');
});
test('search handles user text as text, saved filtering, and pinyin preferences persist', async () => {
  const ui = app(); await ui.click({ page: 'library' });
  ui.input('phrase-search', 'latte'); assert.match(ui.element('#phrase-results').innerHTML, /拿铁/);
  assert.equal(ui.element('#library-count').textContent, '1 phrases');
  ui.input('phrase-search', '<img src=x onerror=alert(1)>');
  await ui.click({ filter: 'All situations' }); assert.doesNotMatch(ui.html(), /<img src=x/);
  await ui.click({ action: 'pinyin' }); assert.equal(ui.state().settings.pinyin, false);
  await ui.click({ page: 'settings' }); await ui.click({ setting: 'traditional' });
  await ui.click({ start: 'updates' }); assert.match(ui.modal(), /進度/); assert.doesNotMatch(ui.modal(), /class="pinyin"/);
});
test('review reveals only on request, rates recall, and does not count a phrase twice in a day', async () => {
  const now = Date.now();
  const stored = { 'richang.v1': JSON.stringify({ version: 1, reviews: { u1: { due: now - 1000, interval: 2, repetitions: 1 } } }) };
  const ui = app(stored); await ui.click({ page: 'review' }); await ui.click({ action: 'review-due' });
  assert.doesNotMatch(ui.modal(), /我跟你说一下/);
  await ui.click({ action: 'reveal' }); assert.match(ui.modal(), /我跟你说一下/);
  await ui.click({ rating: 'again' }); assert.match(ui.modal(), /You reviewed 1 phrase/);
  assert.equal(ui.state().reviews.u1.lastRating, 'again');
  assert.ok(ui.state().reviews.u1.due > now && ui.state().reviews.u1.due < now + 610000);
});
test('reset requires a deliberate second click and settings validate daily goals', async () => {
  const ui = app(); await ui.click({ page: 'settings' }); ui.change('daily-goal', '10');
  assert.equal(ui.state().settings.goal, 10);
  await ui.click({ action: 'reset' }); assert.equal(ui.state().settings.goal, 10);
  await ui.click({ action: 'cancel-reset' }); assert.equal(ui.state().settings.goal, 10);
  await ui.click({ action: 'reset' }); await ui.click({ action: 'confirm-reset' }); assert.equal(ui.state().settings.goal, 6);
});

test('personal rehearsal supports free replies, persistence, review, and a next-day reminder without claiming offline grading', async () => {
  const ui = app();
  await ui.click({ page: 'rehearsal' });
  assert.match(ui.html(), /What do you want to say/);
  await ui.click({ rexample: '0' });
  await ui.click({ action: 'r-prepare' });
  assert.match(ui.html(), /我在等同事的回复/);
  let session = ui.state().rehearsals[0];
  assert.equal(session.source, 'offline');
  assert.equal(ui.state().personalPhrases.length, 3);
  await ui.click({ save: `${session.id}_0` });
  await ui.click({ action: 'r-begin' });
  assert.doesNotMatch(ui.html(), /Which reply fits best/);
  for (const answer of ['我在等设计那边的反馈。', '有结果我就接着做。', '我再 ping 一下，有消息跟你说。']) {
    ui.input('rehearsal-answer', answer);
    await ui.click({ action: 'r-send' });
  }
  session = ui.state().rehearsals[0];
  assert.equal(session.phase, 'done'); assert.equal(session.turns.length, 3);
  assert.ok(session.revisitAt > Date.now());
  assert.ok(session.turns.every(t => t.result.feedback.status === 'compare' && !t.result.goalMet));
  assert.match(ui.html(), /Three replies practiced with self-review/);
  ui.input('rehearsal-reflection', 'Remember 回复.');
  await ui.click({ action: 'r-used' });
  const reopened = app(ui.stored);
  await reopened.click({ page: 'rehearsal' }); await reopened.click({ rresume: session.id });
  assert.match(reopened.html(), /Remember 回复/);
  assert.match(reopened.html(), /Used in a real conversation/);
  await reopened.click({ action: 'r-review' });
  assert.match(reopened.modal(), /Reveal phrase/);
  await reopened.click({ action: 'reveal' });
  assert.match(reopened.modal(), /我在等同事的回复/);
  await reopened.click({ rating: 'good' });
  assert.ok(reopened.state().reviews[`${session.id}_0`]);
  await reopened.click({ action: 'close-practice' });
  await reopened.click({ page: 'library' });
  reopened.input('phrase-search', 'reply from a coworker');
  assert.match(reopened.element('#phrase-results').innerHTML, /我在等同事的回复/);
  const data = reopened.state(); data.rehearsals[0].revisitAt = Date.now() - 1;
  const dueUI = app({ 'richang.v1': JSON.stringify(data) });
  await dueUI.click({ page: 'review' }); assert.match(dueUI.html(), /Try these conversations again/);
});

test('rehearsal preserves drafts on failed AI requests and accepts a valid answer with different wording', async () => {
  let fail = false;
  const ai = {
    status: async () => ({ ok: true, data: { provider: 'openai', hasKey: true, keyStored: false, configured: true, openaiModel: 'gpt-4.1-mini' } }),
    prepare: async () => ({ ok: true, data: { provider: 'openai', plan: {
      title: 'A custom coffee chat', situation: 'Make a plan with a friend.',
      expressions: [0, 1, 2].map(() => ({ zh: '周六可以吗？', traditional: '週六可以嗎？', pinyin: 'Zhōuliù kěyǐ ma?', en: 'Does Saturday work?', note: 'Ask about a day.' })),
      opening: { zh: '你想哪天见？', traditional: '你想哪天見？', pinyin: 'Nǐ xiǎng nǎ tiān jiàn?', en: 'Which day would you like to meet?' }, goals: ['Suggest a day.', 'Agree on a time.', 'Choose a place.']
    } } }),
    reply: async (_session, answer) => fail ? ({ ok: false, error: 'Connection dropped.' }) : ({ ok: true, data: {
      goalMet: true, next: { zh: '下午还是晚上？', traditional: '下午還是晚上？', pinyin: 'Xiàwǔ háishi wǎnshang?', en: 'Afternoon or evening?' },
      feedback: { status: 'understood', message: 'Your alternative phrasing clearly suggests Saturday.', tip: 'You can name the day directly.', suggestion: null }
    } })
  };
  const ui = app({}, { ai, speechAvailable: async () => false });
  await ui.click({ page: 'rehearsal' }); await ui.click({ rexample: '1' }); await ui.click({ action: 'r-prepare' }); await ui.click({ action: 'r-begin' });
  fail = true; ui.input('rehearsal-answer', '这周六我都行。'); await ui.click({ action: 'r-send' });
  assert.match(ui.html(), /Connection dropped/); assert.match(ui.html(), /这周六我都行/);
  assert.equal(ui.state().rehearsals[0].turns.length, 0);
  fail = false; await ui.click({ action: 'r-send' });
  assert.match(ui.html(), /下午还是晚上/); assert.match(ui.html(), /Meaning came through/);
  assert.equal(ui.state().rehearsals[0].turns[0].answer, '这周六我都行。');
});

test('unknown offline goals require a topic and user text is escaped throughout rehearsal', async () => {
  const ui = app(); await ui.click({ page: 'rehearsal' });
  ui.input('rehearsal-goal', '<img src=x onerror=alert(1)> a completely different situation');
  await ui.click({ action: 'r-prepare' });
  assert.match(ui.html(), /Choose an offline topic/);
  assert.doesNotMatch(ui.html(), /<img src=x/);
  ui.change('rehearsal-topic', 'your-day');
  await ui.click({ action: 'r-prepare' }); await ui.click({ action: 'r-begin' });
  ui.input('rehearsal-answer', '<script>alert(1)</script>'); await ui.click({ action: 'r-send' });
  assert.doesNotMatch(ui.html(), /<script>alert/);
  assert.match(ui.html(), /&lt;script&gt;/);
});
test('personal expressions remain escaped in the phrasebook and spaced review', async () => {
  const expression = { id: 'rtest123456_0', zh: '<img src=x onerror=alert(1)>中文', traditional: '<img src=x>中文', pinyin: '<b>Zhōngwén</b>', en: '<button data-action="confirm-reset">Reset</button>', note: 'A note.', sceneTitle: '<img src=x>Title', category: 'Everyday life', register: 'Friendly' };
  const ui = app({ 'richang.v1': JSON.stringify({ version: 1, personalPhrases: [expression], reviews: { [expression.id]: { due: 1, interval: 1, repetitions: 1 } } }) });
  await ui.click({ page: 'library' });
  assert.doesNotMatch(ui.html(), /<img src=x|<b>Zhōngwén/);
  assert.match(ui.html(), /&lt;img src=x/);
  await ui.click({ page: 'review' }); await ui.click({ action: 'review-due' }); await ui.click({ action: 'reveal' });
  assert.doesNotMatch(ui.modal(), /<img src=x|<b>Zhōngwén|<button data-action="confirm-reset"/);
  assert.match(ui.modal(), /&lt;button/);
});

test('listening hides the answer, plays normal and slow audio, and preserves recall progress', async () => {
  const now = Date.now();
  const stored = { 'richang.v1': JSON.stringify({ version: 1, reviews: {
    u1: { due: now - 1000, interval: 2, repetitions: 1 },
    c3: { due: now - 2000, interval: 4, repetitions: 3 }
  }, saved: ['u1'], activity: {} }) };
  const spoken = [];
  const ui = app(stored, { speechAvailable: async () => true, speak: async (text, slow) => { spoken.push([text, slow]); return true; }, stopSpeech() {} });
  await ui.click({ page: 'review' });
  assert.match(ui.html(), /Practice listening/);
  const before = ui.state();
  await ui.click({ action: 'listen-learned' });
  assert.match(ui.modal(), /WHAT DID YOU HEAR/);
  assert.doesNotMatch(ui.modal(), /我确认一下|Wǒ quèrèn|Just checking|data-rating/);
  await ui.click({ speak: 'c3' }); await ui.click({ slow: 'c3' });
  assert.deepEqual(spoken, [['我确认一下，你是说……', false], ['我确认一下，你是说……', true]]);
  await ui.click({ action: 'next-listening' }); // No skipping without revealing.
  assert.match(ui.modal(), /data-speak="c3"/);
  await ui.click({ action: 'reveal' });
  assert.match(ui.modal(), /我确认一下/);
  assert.match(ui.modal(), /Just checking/);
  await ui.click({ rating: 'easy' }); // Listening must never reschedule speaking recall.
  assert.match(ui.modal(), /我确认一下/);
  await ui.click({ action: 'next-listening' });
  assert.doesNotMatch(ui.modal(), /我跟你说一下|Quick update/);
  await ui.click({ action: 'reveal' }); await ui.click({ action: 'next-listening' });
  assert.match(ui.modal(), /You listened to 2 phrases/);
  assert.match(ui.modal(), /recall schedule is unchanged/);
  assert.deepEqual(ui.state(), before);
  await ui.click({ action: 'close-practice' }); await ui.click({ action: 'review-due' });
  await ui.click({ action: 'reveal' }); await ui.click({ rating: 'good' });
  assert.equal(ui.state().reviews.c3.repetitions, 4);
});

test('listening includes personal expressions, caps the drill, and respects script preferences', async () => {
  const reviews = Object.fromEntries(scenarios.flatMap(s => s.phrases).slice(0, 12).map(p => [p.id, { due: Date.now() + 100000, interval: 2, repetitions: 1 }]));
  const personal = { id: 'rlisten123_0', zh: '我想喝茶。', traditional: '我想喝茶。', pinyin: 'Wǒ xiǎng hē chá.', en: 'I would like tea.', note: 'A polite preference.', sceneTitle: 'A tea break', category: 'Everyday life', register: 'Friendly' };
  reviews[personal.id] = { due: 1, interval: 1, repetitions: 1 };
  const ui = app({ 'richang.v1': JSON.stringify({ version: 1, reviews, personalPhrases: [personal], settings: { traditional: true, pinyin: false, english: true } }) });
  await ui.click({ page: 'review' }); await ui.click({ action: 'listen-learned' });
  assert.doesNotMatch(ui.modal(), /我想喝茶|I would like tea/);
  await ui.click({ action: 'reveal' }); assert.match(ui.modal(), /我想喝茶/);
  assert.doesNotMatch(ui.modal(), /class="pinyin"/);
  await ui.click({ action: 'next-listening' }); await ui.click({ action: 'reveal' });
  assert.match(ui.modal(), /我跟你說一下/);
  for (let i = 1; i < 10; i++) {
    await ui.click({ action: 'reveal' }); await ui.click({ action: 'next-listening' });
  }
  assert.match(ui.modal(), /You listened to 10 phrases/);
});

test('new lessons appear in both conversation filters and support offline rehearsal', async () => {
  const ui = app(); await ui.click({ page: 'scenarios' });
  await ui.click({ filter: 'At work' });
  assert.match(ui.html(), /data-start="video-calls"/);
  assert.match(ui.html(), /data-start="priorities"/);
  assert.doesNotMatch(ui.html(), /data-start="deliveries"/);
  await ui.click({ filter: 'Everyday life' });
  for (const id of ['weather', 'deliveries', 'routines', 'declining', 'catching-up', 'misunderstandings']) assert.ok(ui.html().includes(`data-start="${id}"`));
  await ui.click({ page: 'rehearsal' });
  ui.input('rehearsal-goal', 'Explain that my video call is choppy.');
  await ui.click({ action: 'r-prepare' }); assert.match(ui.html(), /我这边有点卡/);
});

test('successive listening drills rotate through learned phrases beyond the first ten', async () => {
  const ids = scenarios.flatMap(s => s.phrases).slice(0, 12).map(p => p.id);
  const reviews = Object.fromEntries(ids.map(id => [id, { due: Date.now() + 86400000, interval: 1, repetitions: 1 }]));
  const ui = app({ 'richang.v1': JSON.stringify({ version: 1, reviews }) });
  await ui.click({ page: 'review' }); await ui.click({ action: 'listen-learned' });
  assert.match(ui.modal(), /data-speak="u1"/);
  for (let i = 0; i < 10; i++) {
    await ui.click({ action: 'reveal' }); await ui.click({ action: 'next-listening' });
  }
  await ui.click({ action: 'close-practice' }); await ui.click({ action: 'listen-learned' });
  assert.match(ui.modal(), /data-speak="c5"/);
  await ui.click({ action: 'reveal' }); await ui.click({ action: 'next-listening' });
  assert.match(ui.modal(), /data-speak="c6"/);
});
