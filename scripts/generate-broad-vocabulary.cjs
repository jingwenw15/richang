// Offline import: HSK headword selection (MIT), definitions/readings (CC-CEDICT, CC BY-SA 4.0).
// Never invent sentence examples or collapse different readings into one definition.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { spokenPinyin, toneMark } = require('./generate-vocabulary.cjs');
const root = path.resolve(__dirname, '..');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const preferred = {
  哦:'o4', 嗯:'en5', 呵:'he1', 曾:'ceng2', 朝:'chao2', 模样:'mu2 yang4', 哪怕:'na3 pa4', 几乎:'ji1 hu1', 似的:'shi4 de5', 得了:'de2 le5',
  比:'bi3', 打:'da3', 号:'hao4', 上:'shang4', 行:'xing2', 页:'ye4', 正:'zheng4', 场:'chang3', 称:'cheng1', 当:'dang1', 弄:'nong4', 片:'pian4', 骑:'qi2', 喂:'wei4',
  占:'zhan4', 厂:'chang3', 合:'he2', 派:'pai4', 胖:'pang4', 强:'qiang2', 追:'zhui1', 尺:'chi3', 刺:'ci4', 底:'di3', 结:'jie2', 落:'luo4', 浅:'qian3', 圈:'quan1', 折:'zhe2', 答:'da2', 广:'guang3', 令:'ling4', 拾:'shi2', 档:'dang4', 佛:'fo2', 混:'hun4', 泡:'pao4', 炮:'pao4', 趟:'tang4', 足:'zu2', 斗:'dou4', 秤:'cheng4', 幢:'zhuang4', 扛:'kang2', 眯:'mi1', 抹:'mo3', 哑:'ya3', 涌:'yong3', 熨:'yun4', 兹:'zi1', 调:'tiao2', 数:'shu4', 咳:'ke2', 率:'lu:4', 劲:'jin4', 啦:'la5'
};
const traditionalPreferences = { 周:'週', 钟:'鐘', 当:'當', 松:'鬆', 台:'臺', 于:'於' };
const titles = ['Everyday foundations · 1', 'Everyday foundations · 2', 'Everyday foundations · 3', 'Wider conversations · 4', 'Wider conversations · 5', 'Wider conversations · 6', 'Reading, news & advanced topics'];
function dictionaryPinyin(zh, numeric) {
  const spoken = spokenPinyin(zh,numeric);
  let offset = 0;
  return numeric.toLowerCase().split(/\s+/).map((syllable,i) => {
    const length = toneMark(syllable).length;
    const marked = spoken.slice(offset,offset+length);
    offset += length;
    return `${i && /^[aeo]/.test(syllable) ? "'" : ''}${marked}`;
  }).join('');
}
function cleanDefinition(text) {
  return text.replace(/([\p{Script=Han}·]+)\|([\p{Script=Han}·]+)/gu, '$2')
    .replace(/\[([a-zA-Zü:1-5 ]+)\]/g, (match, numeric) => {
      try { return ` (${dictionaryPinyin('', numeric)})`; } catch { return match; }
    });
}
function dictionaryForms(entries = []) {
  const forms = new Map();
  // Keep ordinary standalone senses ahead of names, bound forms, and literary uses.
  const score = entry => (/^[A-Z]/.test(entry.numeric) ? 10 : 0) + (/^\((?:literary|archaic|old|dialect)/.test(entry.gloss) ? 8 : 0) + (/^(?:used in |see |abbr\.|\(bound form\))/.test(entry.gloss) ? 5 : 0);
  for (const entry of [...entries].sort((a,b)=>score(a)-score(b))) {
    const meanings = entry.gloss.split('/').filter(text => text &&
      !/^surname [A-Z][A-Za-zü-]*(?: \([^)]*\))?$/.test(text) &&
      !/variant of |^(?:CL:|(?:old|archaic) form of )/.test(text));
    if (!meanings.length) continue;
    const traditional = entry.traditional.replace(/裏/g, '裡');
    const numeric = entry.numeric.toLowerCase();
    const pinyin = dictionaryPinyin(entry.zh, numeric);
    const key = `${traditional}:${numeric}`;
    const form = forms.get(key) || { traditional, pinyin, numeric, meanings: [], score:score(entry) };
    form.meanings = [...new Set([...form.meanings, ...meanings.map(cleanDefinition)])];
    forms.set(key, form);
  }
  return [...forms.values()].sort((a,b) => a.score-b.score).map(({score,...form}) => form);
}
async function generate(dictionaryPath) {
  if (!dictionaryPath) throw new Error('Usage: node scripts/generate-broad-vocabulary.cjs /path/to/cedict.txt.gz');
  const selectionBytes = fs.readFileSync(path.join(root, 'data/broad-vocabulary-selection.json'));
  const selection = JSON.parse(selectionBytes);
  const archive = fs.readFileSync(dictionaryPath);
  const raw = zlib.gunzipSync(archive).toString('utf8');
  if (!raw.includes('Attribution-ShareAlike 4.0')) throw new Error('Review the dictionary license before importing.');
  const { vocabularySource } = await import(path.join(root, 'src/expanded-vocabulary.js'));
  if (hash(archive) !== vocabularySource.sha256) throw new Error('Use the same pinned dictionary snapshot as the guided vocabulary.');
  const dictionary = new Map();
  for (const line of raw.split('\n')) {
    const match = line.trimEnd().match(/^(\S+) (\S+) \[([^\]]+)\] \/(.+)\/$/);
    if (!match) continue;
    const [,traditional,zh,numeric,gloss] = match;
    dictionary.set(zh, [...(dictionary.get(zh) || []), {traditional,zh,numeric,gloss}]);
  }
  const { vocabulary } = await import(path.join(root, 'src/vocabulary.js'));
  const existing = new Set(vocabulary.filter(word => word.source !== 'broad-cedict').map(word => word.zh));
  const seen = new Set(existing);
  const groups = titles.map((title,i) => ({ id:`broad-${i+1}`, title, category:'Broader vocabulary', words:[] }));
  const excluded = [];
  for (const [zh, level, traditionalPreference] of selection.words) {
    if (seen.has(zh)) continue;
    if (!Number.isInteger(level) || level < 1 || level > 7) throw new Error(`Invalid band for ${zh}`);
    const forms = dictionaryForms(dictionary.get(zh));
    if (!forms.length) { excluded.push({zh,reason:'No non-variant dictionary definition in the pinned snapshot'}); continue; }
    const desiredTraditional = traditionalPreferences[zh] || traditionalPreference;
    const traditionalIndex = forms.findIndex(form=>form.traditional===desiredTraditional);
    if (traditionalIndex > 0) forms.unshift(...forms.splice(traditionalIndex,1));
    if (preferred[zh]) {
      let index = forms.findIndex(form => form.numeric === preferred[zh] && form.traditional===desiredTraditional);
      if (index < 0) index = forms.findIndex(form => form.numeric === preferred[zh]);
      if (index < 0) throw new Error(`Preferred reading not found: ${zh}`);
      forms.unshift(...forms.splice(index,1));
    }
    const first = forms[0];
    groups[level-1].words.push({id:`v_broad-${[...zh].map(c=>c.codePointAt(0).toString(16)).join('-')}`,
      zh, traditional:first.traditional, pinyin:first.pinyin, en:first.meanings.slice(0,3).join('; '),
      note:forms.length > 1 ? 'This spelling has several readings or traditional forms. Match the reading to its meaning below.' : 'Dictionary meanings describe possible uses; context determines the sense.',
      readings:forms.map(({numeric,...form})=>form),
      collection:level<=3?'foundations':level<=6?'range':'advanced',
      kind:'vocabulary', register:'Dictionary vocabulary', source:'broad-cedict'});
    seen.add(zh);
  }
  const added = groups.reduce((n,g)=>n+g.words.length,0);
  const metadata = { name:'Complete HSK Vocabulary + CC-CEDICT', selectionUrl:selection.url, revision:selection.revision,
    upstreamSha256:selection.sha256, selectionSha256:hash(selectionBytes), traditionalPreferences:selection.traditionalPreferences, dictionarySha256:hash(archive),
    dictionaryDate:vocabularySource.date, license:'CC-BY-SA-4.0', selectionLicense:'MIT', added, excluded,
    notes:'New-HSK membership supplies study bands, not a frequency ranking or native-speaker vocabulary target. No sentence examples are generated.' };
  // One entry per line keeps future generated diffs readable.
  const serializedGroups = groups.map(({words,...group})=>`${JSON.stringify(group).slice(0,-1)},"words":[\n${words.map(word=>JSON.stringify(word)).join(',\n')}\n]}`).join(',\n');
  fs.writeFileSync(path.join(root,'src/broad-vocabulary.js'), `// SPDX-License-Identifier: CC-BY-SA-4.0 AND MIT AND Apache-2.0\n// CC-CEDICT contributors / MDBG; selection adapted from Complete HSK Vocabulary (MIT).\n// Traditional-form preferences adapted from OpenCC (Apache-2.0).\n// See docs/vocabulary-sources.md and data/licenses/.\n// Generated offline by scripts/generate-broad-vocabulary.cjs.\nexport const broadVocabularySource = ${JSON.stringify(metadata)};\nexport const broadVocabularyGroups = [\n${serializedGroups}\n];\n`);
  console.log(`Added ${added} dictionary words; ${seen.size} total; ${excluded.length} unmatched/variant-only headwords excluded.`);
}
module.exports = { cleanDefinition, dictionaryForms, dictionaryPinyin };
if (require.main === module) generate(process.argv[2]).catch(error=>{console.error(error.message);process.exitCode=1;});
