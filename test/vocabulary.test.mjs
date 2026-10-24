import test from 'node:test';
import assert from 'node:assert/strict';
import { vocabulary, vocabularyGroups, vocabularyById, selectVocabulary } from '../src/vocabulary.js';
import { phrases } from '../src/content.js';

test('vocabulary contains 48 distinct words in six topics, each with a complete example', () => {
  assert.equal(vocabulary.length, 48);
  assert.equal(vocabularyGroups.length, 6);
  assert.equal(new Set([...vocabulary, ...phrases].map(p => p.id)).size, vocabulary.length + phrases.length);
  for (const group of vocabularyGroups) assert.equal(group.words.length, 8);
  for (const word of vocabulary) {
    assert.match(word.id, /^v_[a-z-]+$/);
    assert.equal(word.kind, 'vocabulary');
    for (const key of ['zh', 'traditional', 'pinyin', 'en', 'note', 'sceneTitle', 'topic', 'category']) assert.ok(word[key], `${word.id}: ${key}`);
    for (const key of ['zh', 'traditional', 'pinyin', 'en']) assert.ok(word.example[key], `${word.id} example: ${key}`);
    assert.ok(word.example.zh.includes(word.zh), `${word.id} example should demonstrate the word`);
    assert.ok(word.example.traditional.includes(word.traditional), `${word.id} traditional example should demonstrate the word`);
  }
});

test('vocabulary search accepts Chinese, traditional characters, meanings, and pinyin with or without tones', () => {
  for (const query of ['反馈', '反饋', 'feedback', 'fankui', 'fǎn kuì', 'FANKUI']) {
    assert.ok(selectVocabulary({ query }).some(word => word.id === 'v_feedback'), query);
  }
  assert.equal(selectVocabulary({ topic: 'work' }).length, 8);
  assert.deepEqual(selectVocabulary({ topic: 'food', query: 'feedback' }), []);
  assert.deepEqual(selectVocabulary({ savedOnly: true }), []);
  assert.deepEqual(selectVocabulary({ topic: 'work', savedOnly: true, saved: ['u1', 'v_feedback', 'v_busy'] }).map(word => word.id), ['v_feedback']);
  assert.deepEqual(selectVocabulary({ query: '<script>unmatched</script>' }), []);
  assert.equal(vocabularyById('not-a-word'), undefined);
});

test('ambiguous readings, neutral syllables, and spoken tone changes are explained consistently', () => {
  assert.equal(vocabularyById('v_still').pinyin, 'hái');
  assert.match(vocabularyById('v_still').note, /huán/);
  assert.equal(vocabularyById('v_free-time').pinyin, 'yǒu kòng');
  assert.equal(vocabularyById('v_usually').pinyin, 'yìbān');
  assert.equal(vocabularyById('v_think').pinyin, 'juéde');
  assert.equal(vocabularyById('v_comfortable').pinyin, 'shūfu');
  assert.match(vocabularyById('v_portion').example.pinyin, /yí fèn/);
  assert.match(vocabularyById('v_get-off').example.pinyin, /xià yí zhàn/);
  assert.match(vocabularyById('v_actually').example.pinyin, /bú tài/);
  assert.match(vocabularyById('v_worry').example.pinyin, /bú gòu/);
  assert.match(vocabularyById('v_or-question').note, /choice question/);
  assert.match(vocabularyById('v_or-statement').note, /statement/);
  assert.match(vocabularyById('v_again').note, /又/);
});
