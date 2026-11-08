import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {broadVocabularySource, broadVocabularyGroups} from '../src/broad-vocabulary.js';
import {vocabularySource} from '../src/expanded-vocabulary.js';
const {dictionaryForms, dictionaryPinyin, cleanDefinition} = createRequire(import.meta.url)('../scripts/generate-broad-vocabulary.cjs');
const {convert} = createRequire(import.meta.url)('../scripts/prepare-broad-selection.cjs');

test('broader vocabulary is pinned to licensed inputs and preserves exclusions rather than inventing definitions', () => {
  const bytes = readFileSync(new URL('../data/broad-vocabulary-selection.json',import.meta.url));
  const selection = JSON.parse(bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),broadVocabularySource.selectionSha256);
  assert.match(selection.revision,/^[a-f0-9]{40}$/);
  assert.equal(selection.revision,broadVocabularySource.revision);
  assert.equal(broadVocabularySource.dictionarySha256,vocabularySource.sha256);
  assert.equal(broadVocabularySource.license,'CC-BY-SA-4.0');
  assert.equal(broadVocabularySource.selectionLicense,'MIT');
  assert.equal(broadVocabularySource.traditionalPreferences.license,'Apache-2.0');
  assert.equal(broadVocabularySource.added,10360);
  assert.equal(broadVocabularyGroups.flatMap(g=>g.words).length,10360);
  assert.ok(broadVocabularySource.excluded.some(word=>word.zh==='不肯'));
  assert.ok(broadVocabularyGroups.every(group=>group.words.every(word=>!word.example)));
  const get=zh=>broadVocabularyGroups.flatMap(group=>group.words).find(word=>word.zh===zh);
  for(const [zh,pinyin] of [['比','bǐ'],['打','dǎ'],['单','dān'],['厂','chǎng'],['骑','qí'],['上','shàng'],['广','guǎng'],['页','yè']]) assert.equal(get(zh).pinyin,pinyin,zh);
  for(const [zh,traditional] of [['后','後'],['药','藥'],['考','考'],['当','當'],['钟','鐘'],['里','裡']]) assert.equal(get(zh).traditional,traditional,zh);
});

test('dictionary adaptation keeps readings with their definitions and avoids surname/variant-only senses', () => {
  const forms = dictionaryForms([
    {zh:'曾',traditional:'曾',numeric:'Zeng1',gloss:'surname Zeng'},
    {zh:'曾',traditional:'曾',numeric:'ceng2',gloss:'once/already/CL:次[ci4]'},
    {zh:'曾',traditional:'曾',numeric:'zeng1',gloss:'great- (grandfather, grandchild etc)'}
  ]);
  assert.deepEqual(forms.map(f=>[f.pinyin,f.meanings]),[['céng',['once','already']],['zēng',['great- (grandfather, grandchild etc)']]]);
  assert.deepEqual(dictionaryForms([{zh:'姓名',traditional:'姓名',numeric:'xing4 ming2',gloss:'surname and given name; full name'}])[0].meanings,['surname and given name; full name']);
  assert.deepEqual(dictionaryForms([{zh:'桔子',traditional:'桔子',numeric:'ju2 zi5',gloss:'variant of 橘子[ju2 zi5]'}]),[]);
  assert.equal(cleanDefinition('variant of 電腦|电脑[dian4 nao3]'),'variant of 电脑 (diànnǎo)');
  assert.equal(dictionaryPinyin('反而','fan3 er2'),"fǎn'ér");
  assert.equal(dictionaryPinyin('一转眼','yi1 zhuan3 yan3'),'yìzhuǎnyǎn');
  assert.equal(dictionaryPinyin('不见得','bu4 jian4 de5'),'bújiànde');
  assert.equal(convert('面条里面',new Map([['里','裏']]),new Map([['面条','麵條']])),'麵條裡面');
});
