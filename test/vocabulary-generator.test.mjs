import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { vocabulary } from '../src/vocabulary.js';
import { vocabularySource } from '../src/expanded-vocabulary.js';
const { toneMark, spokenPinyin, makeExample } = createRequire(import.meta.url)('../scripts/generate-vocabulary.cjs');

test('dictionary tone conversion handles compound vowels, ü, neutral tones, and spoken 一/不', () => {
  assert.equal(toneMark('shui3'), 'shuǐ');
  assert.equal(toneMark('liu2'), 'liú');
  assert.equal(toneMark('lu:4'), 'lǜ');
  assert.equal(toneMark('r5'), 'r');
  assert.equal(spokenPinyin('哪儿', 'na3 r5'), 'nǎr');
  assert.equal(spokenPinyin('一起', 'yi1 qi3'), 'yìqǐ');
  assert.equal(spokenPinyin('一下', 'yi1 xia4'), 'yíxià');
  assert.equal(spokenPinyin('第一', 'di4 yi1'), 'dìyī');
  assert.equal(spokenPinyin('不客气', 'bu4 ke4 qi5'), 'búkèqi');
  assert.equal(spokenPinyin('不好', 'bu4 hao3'), 'bùhǎo');
  assert.throws(() => toneMark('unknown'), /Unsupported/);
});

test('example frames keep full traditional sentences and idiomatic numeric exceptions', () => {
  assert.equal(makeExample('location','书店','書店','shūdiàn','bookstore').traditional, '我們在書店見吧。');
  assert.equal(makeExample('where','钱包','錢包','qiánbāo','wallet').traditional, '你知道錢包在哪兒嗎？');
  assert.equal(makeExample('number','一','一','yī','one').pinyin, 'Wǒ yào yí ge.');
  assert.equal(makeExample('number','二','二','èr','two').zh, '二加三等于五。');
  assert.equal(makeExample('number','百','百','bǎi','a hundred').zh, '我要一百个。');
});

test('the sourced expansion has provenance and excludes inappropriate alternate readings', () => {
  assert.equal(vocabularySource.added, 1081);
  assert.equal(vocabularySource.license, 'CC-BY-SA-4.0');
  assert.match(vocabularySource.sha256, /^[a-f0-9]{64}$/);
  const get = zh => vocabulary.find(word => word.zh === zh);
  for (const [zh, pinyin] of [['背','bèi'],['鸟','niǎo'],['猫','māo'],['妻子','qīzi'],['老公','lǎogōng'],['绿','lǜ'],['薄','báo'],['只','zhǐ'],['得','de'],['尽快','jǐnkuài'],['当天','dāngtiān'],['当时','dāngshí'],['约','yuē'],['空闲','kòngxián'],['一致','yízhì']]) assert.equal(get(zh).pinyin, pinyin, zh);
  for (const [zh, traditional] of [['家','家'],['困','睏'],['云','雲'],['和','和'],['只','只'],['千','千'],['尽快','儘快'],['夸','誇']]) assert.equal(get(zh).traditional, traditional, zh);
  assert.equal(vocabulary.filter(word => word.source === 'cc-cedict').length, 1081);
});
