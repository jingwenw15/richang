import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios, phraseById, pinyinGuide } from '../src/content.js';

const entries = scenarios.flatMap(scene => [...scene.phrases, ...scene.turns]);
const compact = text => text.toLowerCase().replace(/\s+/g, '');

test('daily phrase uses rising yí before fourth-tone xià and explains the choice', () => {
  const daily = phraseById('c3');
  assert.equal(daily.pinyin, 'Wǒ quèrèn yíxià, nǐ shì shuō…');
  assert.match(daily.note, /yī to rising yí/);
  assert.match(pinyinGuide.yi, /Dictionaries may show the original yī/);
});

test('every curriculum occurrence follows the chosen spoken 一 and 不 convention', () => {
  const patterns = [
    ['一下', 'yíxià'], ['一点', 'yìdiǎn'], ['一起', 'yìqǐ'],
    ['一家', 'yìjiā'], ['一杯', 'yìbēi'], ['一块', 'yíkuài'],
    ['一遍', 'yíbiàn'], ['一直', 'yìzhí'], ['一天', 'yìtiān'],
    ['一部', 'yíbù'], ['一说', 'yìshuō'], ['一号', 'yíhào'],
    ['不错', 'búcuò'], ['不够', 'búgòu'], ['不过', 'búguò'],
    ['不着急', 'bùzháojí'], ['不好意思', 'bùhǎoyìsi'],
    ['一般', 'yìbān'], ['不在', 'búzài'], ['不是', 'búshì']
  ];
  for (const [zh, expected] of patterns) {
    const matches = entries.filter(entry => entry.zh.includes(zh));
    assert.ok(matches.length, `${zh} must be exercised`);
    for (const entry of matches) assert.ok(compact(entry.pinyin).includes(expected), `${entry.zh}: expected ${expected}`);
  }
});

test('neutral syllables and lexical third tones remain distinct', () => {
  assert.match(phraseById('l1').pinyin, /yào bu yào/);
  assert.match(phraseById('f4').pinyin, /là bu là/);
  assert.match(phraseById('o5').pinyin, /^Yàobu /);
  assert.match(phraseById('w4').pinyin, /qǐlai/);
  assert.match(phraseById('f6').pinyin, /^Nǐ hǎo/);
  const leftovers = entries.find(entry => entry.zh.startsWith('吃不完'));
  assert.match(leftovers.pinyin, /^Chī bu wán/);
  assert.match(pinyinGuide.third, /nǐ hǎo/);
  assert.match(phraseById('plan2').pinyin, /^Yào bu yào/);
  assert.match(phraseById('change4').pinyin, /^Yàobu/);
  assert.match(phraseById('help4').pinyin, /lián bu shàng/);
  assert.match(phraseById('prio5').pinyin, /lái bu jí/);
  assert.match(phraseById('decline1').pinyin, /qù bu liǎo/);
  assert.match(phraseById('decline5').pinyin, /yǒu kòng/);
});
