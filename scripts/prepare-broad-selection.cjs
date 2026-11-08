// Extract headwords and study bands from a pinned Complete HSK Vocabulary release.
// Traditional preferences are adapted from OpenCC's STCharacters/STPhrases tables.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname,'..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function table(bytes) {
  return new Map(bytes.toString('utf8').split('\n').filter(line=>line && !line.startsWith('#')).map(line=>{
    const [key, values] = line.split('\t');
    if (!values) throw new Error(`Malformed OpenCC mapping: ${key}`);
    return [key,values.split(' ')[0]];
  }));
}
function convert(zh, characters, phrases) {
  let result = '';
  for (let i=0;i<zh.length;) {
    let matched = false;
    for (let length=zh.length-i;length>1;length--) {
      const word=zh.slice(i,i+length);
      if (phrases.has(word)) { result+=phrases.get(word); i+=length; matched=true; break; }
    }
    if (!matched) { result+=characters.get(zh[i]) || zh[i];i++; }
  }
  return result.replace(/裏/g,'裡');
}
function prepare(sourcePath, characterPath, phrasePath, revision) {
  if (!sourcePath || !characterPath || !phrasePath || !/^[a-f0-9]{40}$/.test(revision || '')) throw new Error('Usage: node scripts/prepare-broad-selection.cjs complete.json STCharacters.txt STPhrases.txt upstream-commit-sha');
  const sourceBytes=fs.readFileSync(sourcePath), characterBytes=fs.readFileSync(characterPath), phraseBytes=fs.readFileSync(phrasePath);
  const source=JSON.parse(sourceBytes), characters=table(characterBytes), phrases=table(phraseBytes);
  const selection={source:'Complete HSK Vocabulary',url:'https://github.com/drkameleon/complete-hsk-vocabulary',revision,file:'complete.json',sha256:hash(sourceBytes),selectionLicense:'MIT',dictionaryLicense:'CC-BY-SA-4.0',
    selection:'Headwords and new-1 through new-7 memberships only. Words without new-* membership enter the wider range (7). Third column: OpenCC preferred traditional form. No frequency ranking or native vocabulary size is implied.',
    traditionalPreferences:{source:'OpenCC',url:'https://github.com/BYVoid/OpenCC',license:'Apache-2.0',charactersSha256:hash(characterBytes),phrasesSha256:hash(phraseBytes)},
    words:source.map(word=>[word.simplified,Math.min(...(word.level.filter(level=>/^new-[1-7]$/.test(level)).map(level=>Number(level.slice(4))).concat(7))),convert(word.simplified,characters,phrases)])};
  fs.writeFileSync(path.join(root,'data/broad-vocabulary-selection.json'),JSON.stringify(selection,null,2)+'\n');
  console.log(`Prepared ${selection.words.length} headwords and traditional preferences.`);
}
module.exports={convert,table};
if(require.main===module)try{prepare(...process.argv.slice(2));}catch(error){console.error(error.message);process.exitCode=1;}
