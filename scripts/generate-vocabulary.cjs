// Builds the checked-in expansion from our curated selection and a local CC-CEDICT release.
// No network access is performed. Normal app builds use the generated module directly.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const readings = {
  尽快:'jin3 kuai4', 当天:'dang1 tian1', 当时:'dang1 shi2', 约:'yue1', 会:'hui4', 要:'yao4', 能:'neng2', 离:'li2', 和:'he2', 给:'gei3', 从:'cong2', 为:'wei4', 的:'de5', 了:'le5', 过:'guo5', 着:'zhe5', 吗:'ma5', 呢:'ne5', 吧:'ba5', 把:'ba3', 被:'bei4', 得:'de5', 地:'de5', 零:'ling2', 千:'qian1', 万:'wan4', 红:'hong2', 绿:'lu:4', 多少:'duo1 shao5', 几:'ji3', 妻子:'qi1 zi5', 老公:'lao3 gong1', 切:'qie1', 洗:'xi3', 粥:'zhou1', 汤:'tang1', 虾:'xia1', 好吃:'hao3 chi1',
  头:'tou2', 背:'bei4', 脚:'jiao3', 雨:'yu3', 草:'cao3', 鸟:'niao3', 猫:'mao1', 结果:'jie2 guo3', 重点:'zhong4 dian3',
  跑:'pao3', 出来:'chu1 lai2', 拉:'la1', 盖:'gai4', 说:'shuo1', 读:'du2', 写:'xie3', 听:'ting1', 看:'kan4',
  好:'hao3', 大:'da4', 长:'chang2', 薄:'bao2', 重:'zhong4', 远:'yuan3', 少:'shao3', 脏:'zang1', 难:'nan2', 故事:'gu4 shi5',
  谁:'shei2', 哪:'na3', 什么:'shen2 me5', 哪儿:'na3 r5', 不:'bu4', 没:'mei2', 都:'dou1', 只:'zhi3', 请:'qing3',
  一:'yi1', 二:'er4', 三:'san1', 四:'si4', 五:'wu3', 六:'liu4', 七:'qi1', 八:'ba1', 九:'jiu3', 十:'shi2', 两:'liang3', 百:'bai3'
};
const traditionalForms = { 尽快:'儘快', 夸:'誇', 家:'家', 腿:'腿', 困:'睏', 云:'雲', 你:'你', 它:'它', 哪里:'哪裡', 才:'才', 千:'千', 和:'和', 向:'向' };
function toneMark(syllable) {
  const m = syllable.toLowerCase().match(/^([a-zü:]+)([1-5])$/);
  if (!m) throw new Error(`Unsupported dictionary syllable: ${syllable}`);
  let plain = m[1].replace(/u:/g,'ü').replace(/v/g,'ü');
  const tone = Number(m[2]);
  if (tone === 5) return plain;
  let index = plain.indexOf('a');
  if (index < 0) index = plain.indexOf('e');
  if (index < 0 && plain.includes('ou')) index = plain.indexOf('o');
  if (index < 0) index = Math.max(...[...plain].map((c,i)=>'aeiouü'.includes(c)?i:-1));
  if (index < 0) throw new Error(`No vowel in ${syllable}`);
  const marks = { a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù',ü:'ǖǘǚǜ' };
  return plain.slice(0,index)+marks[plain[index]][tone-1]+plain.slice(index+1);
}
function spokenPinyin(zh, numeric) {
  const syllables = numeric.toLowerCase().split(/\s+/);
  // Preserve standalone and ordinal 一. Show normal 一/不 tone changes within a word.
  for (let i=0;i<syllables.length-1;i++) {
    if (zh[i] === '一' && zh[i-1] !== '第' && syllables[i] === 'yi1') syllables[i] = /4$/.test(syllables[i+1]) ? 'yi2':'yi4';
    if (zh[i] === '不' && syllables[i] === 'bu4' && /4$/.test(syllables[i+1])) syllables[i] = 'bu2';
  }
  return syllables.map(toneMark).join('');
}
const article = value => /^(a |an |some |the )/i.test(value) ? value : `${/^[aeiou]/i.test(value)?'an':'a'} ${value}`;
const cap = text => text.charAt(0).toUpperCase()+text.slice(1);
// Every frame has explicit Chinese, traditional Chinese, pinyin and matching English.
// The optional insert handles English articles, plurals and prepositions.
const frames = {
  family: ['这是我的','這是我的','Zhè shì wǒ de','。','.',e=>`This is my ${e}.`,'Use this relationship word when introducing someone.'],
  job: ['我朋友是','我朋友是','Wǒ péngyou shì','。','.',e=>`My friend is ${article(e)}.`,'Use 是 before a job title when saying what someone does.'],
  location: ['我们在','我們在','Wǒmen zài','见吧。','jiàn ba.',e=>`Let’s meet ${e}.`,'Use 在 with a place to say where to meet.'],
  buy: ['我想买','我想買','Wǒ xiǎng mǎi','。','.',e=>`I’d like to buy ${e}.`,'Use 想买 to say what you would like to buy.'],
  order: ['我想点','我想點','Wǒ xiǎng diǎn','。','.',e=>`I’d like to order ${e}.`,'Use 点 when placing a food or drink order.'],
  object: ['这个我来','這個我來','Zhège wǒ lái','吧。','ba.',e=>`I’ll ${e} this.`,'这个 refers to something already being discussed; 我来 offers to handle it.'],
  topic: ['我想了解一下','我想了解一下','Wǒ xiǎng liǎojiě yíxià','。','.',e=>`I’d like to learn a little about ${e}.`,'Use 了解一下 when asking to learn a little about a topic.'],
  adjective: ['这个','這個','Zhège','吗？','ma?',e=>`Is this ${e}?`,'Use this description after the thing you are describing. The example asks about something already in view.'],
  state: ['我今天有点','我今天有點','Wǒ jīntiān yǒudiǎn','。','.',e=>`I feel a little ${e} today.`,'有点 often introduces a mild feeling or less-than-ideal state.'],
  trait: ['他很','他很','Tā hěn','。','.',e=>`He’s very ${e}.`,'Use this word to describe a person. 很 can connect the subject to the description.'],
  see: ['我看到','我看到','Wǒ kàn dào','了。','le.',e=>`I saw ${e}.`,'看到 means seeing or noticing something; 了 marks the observation here.'],
  time: ['我','我','Wǒ','有空。','yǒu kòng.',e=>['usually','sometimes','occasionally','often'].includes(e)?`I’m ${e} free.`:`I’m free ${e}.`,'Place a time expression before the action or state. 有空 means being available.'],
  transport: ['我们坐','我們坐','Wǒmen zuò','去吧。','qù ba.',e=>`Let’s go by ${e}.`,'坐 is used for traveling by many forms of transport.'],
  ride: ['我们骑','我們騎','Wǒmen qí','去吧。','qù ba.',e=>`Let’s go by ${e}.`,'骑 is used for riding a bicycle or motorcycle.'],
  where: ['你知道','你知道','Nǐ zhīdào','在哪儿吗？','zài nǎr ma?',e=>`Do you know where to find ${e}?`,'Use 你知道…在哪儿吗 to ask where something is.'],
  body: ['我的','我的','Wǒ de','有点不舒服。','yǒudiǎn bù shūfu.',e=>`My ${e} ${/^(eyes|ears|teeth|shoulders|hands|fingers|arms|legs|knees|feet|ankles)$/.test(e)?'feel':'feels'} a little uncomfortable.`,'Use this body word to name the area that feels uncomfortable. '],
  health: ['我好像有点','我好像有點','Wǒ hǎoxiàng yǒudiǎn','。','.',e=>`I think I have ${e}.`,'好像 presents a tentative description of how you feel.'],
  action: ['我想先','我想先','Wǒ xiǎng xiān','。','.',e=>`I’d like to ${e} first.`,'Use 想 before an action to say what you would like to do.'],
  activity: ['你喜欢','你喜歡','Nǐ xǐhuan','吗？','ma?',e=>`Do you like ${e}?`,'Ask about a hobby to start a conversation and invite a follow-up.'],
  number: ['我要','我要','Wǒ yào','个。','ge.',e=>`I’d like ${e} of them.`,'Numbers normally go before a measure word and noun. 个 works here because the item is already understood.']
};
function makeExample(pattern, zh, traditional, pinyin, english, insert) {
  const frame = frames[pattern];
  if (!frame) throw new Error(`Unknown frame: ${pattern}`);
  let slot = insert || english;
  if (!insert && pattern === 'buy') slot = article(english);
  if (!insert && pattern === 'location') slot = `at the ${english}`;
  if (!insert && pattern === 'where') slot = `the ${english}`;
  let spoken = pinyin;
  if (pattern === 'number' && zh === '一') spoken = 'yí';
  const gap = /^\p{Script=Latin}/u.test(frame[4]) ? ' ' : '';
  const example = { zh:frame[0]+zh+frame[3],traditional:frame[1]+traditional+({'见吧。':'見吧。','吗？':'嗎？','在哪儿吗？':'在哪兒嗎？','有点不舒服。':'有點不舒服。','个。':'個。'}[frame[3]] || frame[3]),
    pinyin:cap(`${frame[2]} ${spoken}${gap}${frame[4]}`),en:frame[5](slot) };
  // Explicit idiomatic exceptions to a reusable frame.
  const overrides = {
    坐:['我想先坐一下。','我想先坐一下。','Wǒ xiǎng xiān zuò yíxià.','I’d like to sit down for a moment first.'],
    站:['我想先站一会儿。','我想先站一會兒。','Wǒ xiǎng xiān zhàn yíhuìr.','I’d like to stand for a little while first.'],
    反对:['我不反对这个安排。','我不反對這個安排。','Wǒ bù fǎnduì zhège ānpái.','I don’t object to this arrangement.'],
    理解:['我还不太理解这个意思。','我還不太理解這個意思。','Wǒ hái bú tài lǐjiě zhège yìsi.','I don’t quite understand what this means yet.'],
    注意:['这个细节要注意。','這個細節要注意。','Zhège xìjié yào zhùyì.','This detail needs attention.'],
    二:['二加三等于五。','二加三等於五。','Èr jiā sān děngyú wǔ.','Two plus three is five.'],
    百:['我要一百个。','我要一百個。','Wǒ yào yì bǎi ge.','I’d like a hundred of them.'],
    千:['一千够吗？','一千夠嗎？','Yì qiān gòu ma?','Is a thousand enough?'],
    万:['这里有一万个人。','這裡有一萬個人。','Zhèlǐ yǒu yí wàn ge rén.','There are ten thousand people here.'],
    零:['现在是零度。','現在是零度。','Xiànzài shì líng dù.','It’s zero degrees now.'],
    昨天:['我昨天有空。','我昨天有空。','Wǒ zuótiān yǒu kòng.','I was free yesterday.'],
    前天:['我前天有空。','我前天有空。','Wǒ qiántiān yǒu kòng.','I was free the day before yesterday.'],
    一直:['我一直有空。','我一直有空。','Wǒ yìzhí yǒu kòng.','I’ve been available all along.'],
    记住:['这个我会记住的。','這個我會記住的。','Zhège wǒ huì jìzhu de.','I’ll remember this.'],
    忘记:['我忘记带钥匙了。','我忘記帶鑰匙了。','Wǒ wàngjì dài yàoshi le.','I forgot to bring my keys.'],
    发现:['我刚发现一个问题。','我剛發現一個問題。','Wǒ gāng fāxiàn yí ge wèntí.','I just noticed an issue.'],
    多:['今天人很多。','今天人很多。','Jīntiān rén hěn duō.','There are a lot of people today.'],
    少:['这家店人很少。','這家店人很少。','Zhè jiā diàn rén hěn shǎo.','There are very few people in this shop.'],
    年轻:['他很年轻。','他很年輕。','Tā hěn niánqīng.','He’s young.'],
    同意:['这个安排我同意。','這個安排我同意。','Zhège ānpái wǒ tóngyì.','I agree to this arrangement.'],
    提问:['有问题可以提问。','有問題可以提問。','Yǒu wèntí kěyǐ tíwèn.','Feel free to ask questions.'],
    秒:['还有五秒。','還有五秒。','Hái yǒu wǔ miǎo.','There are five seconds left.'],
    分钟:['还有五分钟。','還有五分鐘。','Hái yǒu wǔ fēnzhōng.','There are five minutes left.'],
    小时:['还有两个小时。','還有兩個小時。','Hái yǒu liǎng ge xiǎoshí.','There are two hours left.']
  };
  return overrides[zh] ? Object.fromEntries(['zh','traditional','pinyin','en'].map((key,i)=>[key,overrides[zh][i]])) : example;
}
async function generate(dictionaryPath) {
  if (!dictionaryPath) throw new Error('Usage: node scripts/generate-vocabulary.cjs /path/to/cedict.txt.gz');
  const archive = fs.readFileSync(dictionaryPath);
  const raw = zlib.gunzipSync(archive).toString('utf8');
  if (!raw.includes('Attribution-ShareAlike 4.0')) throw new Error('Review the dictionary license before regenerating.');
  const dictionary = new Map();
  for (const line of raw.split('\n')) {
    const match = line.trimEnd().match(/^(\S+) (\S+) \[([^\]]+)\] \/(.+)\/$/);
    if (!match) continue;
    const [,traditional,zh,numeric,gloss] = match;
    const entries = dictionary.get(zh) || [];entries.push({traditional,numeric,gloss});dictionary.set(zh,entries);
  }
  const { vocabulary: existing } = await import(path.join(root,'src/vocabulary.js'));
  const existingWords = new Set(existing.filter(w=>!w.source).map(w=>w.zh));
  const seen = new Set(existingWords);
  const groups=[];let group;const skipped=[];
  for (const line of fs.readFileSync(path.join(root,'data/vocabulary-selection.tsv'),'utf8').split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const parts=line.split('|');
    if (line.startsWith('@')) { group={id:`core-${parts[0].slice(1)}`,title:parts[1],category:parts[2],words:[]};groups.push(group);continue; }
    const [pattern,zh,en,insert]=parts;
    if (seen.has(zh)) { skipped.push(zh);continue; }
    if (!group) throw new Error('Missing topic header');
    let candidates=(dictionary.get(zh)||[]).filter(x=>!/^(?:\([^)]*\)\s*)?(?:old |archaic )?variant of/.test(x.gloss)&&!x.gloss.startsWith('surname'));
    if (readings[zh]) candidates=candidates.filter(x=>x.numeric.toLowerCase()===readings[zh]);
    if (traditionalForms[zh]) candidates=candidates.filter(x=>x.traditional.replace(/裏/g,'裡')===traditionalForms[zh]);
    if (new Set(candidates.map(x=>x.traditional.replace(/裏/g,'裡'))).size>1) throw new Error(`Choose an explicit traditional form for ${zh}`);
    if (!candidates.length) throw new Error(`No matching dictionary entry: ${zh}`);
    if (new Set(candidates.map(x=>x.numeric.toLowerCase())).size!==1) throw new Error(`Choose an explicit reading for ${zh}: ${candidates.map(x=>x.numeric).join(', ')}`);
    const selected=candidates[0];
    const pinyin=spokenPinyin(zh,selected.numeric);
    const example=pattern==='custom' ? {zh:parts[3],traditional:parts[4],pinyin:parts[5],en:parts[6]} : makeExample(pattern,zh,selected.traditional,pinyin,en,insert);
    const note=pattern==='custom' ? parts[7] : frames[pattern][6];
    group.words.push({id:`v_core-${[...zh].map(c=>c.codePointAt(0).toString(16)).join('-')}`,zh,traditional:selected.traditional.replace(/裏/g,'裡'),pinyin,en,note,example,kind:'vocabulary',register:'Common word',source:'cc-cedict'});
    seen.add(zh);
  }
  const count=groups.reduce((n,g)=>n+g.words.length,0);
  if (existingWords.size+count!==1200) throw new Error(`Expected 1,200 words; found ${existingWords.size}+${count}=${existingWords.size+count}`);
  const metadata={name:'CC-CEDICT',url:'https://www.mdbg.net/chinese/dictionary?page=cc-cedict',license:'CC-BY-SA-4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',sha256:crypto.createHash('sha256').update(archive).digest('hex'),date:'2026-11-05',added:count};
  fs.writeFileSync(path.join(root,'src/expanded-vocabulary.js'),`// SPDX-License-Identifier: CC-BY-SA-4.0\n// Dictionary spellings adapted from CC-CEDICT contributors, published by MDBG.\n// Curated meanings and pattern-based examples added by Richang. See docs/vocabulary-sources.md.\n// Generated by scripts/generate-vocabulary.cjs; edit data/vocabulary-selection.tsv and regenerate.\nexport const vocabularySource = ${JSON.stringify(metadata)};\nexport const expandedVocabularyGroups = ${JSON.stringify(groups,null,2)};\n`);
  console.log(`Generated ${count} additions in ${groups.filter(g=>g.words.length).length} topics. Total: ${seen.size}. Skipped existing headwords: ${skipped.join(', ')}`);
}
module.exports={toneMark,spokenPinyin,makeExample};
if(require.main===module)generate(process.argv[2]).catch(error=>{console.error(error.message);process.exitCode=1;});
