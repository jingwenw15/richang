# Vocabulary sources and regeneration

The app contains **11,585 unique simplified headwords**: 1,225 entries with conversation examples and 10,360 broader dictionary entries. All previous 1,200 vocabulary records and IDs are unchanged. Headword counts include expressions, particles, and single characters as well as multi-character words. They do not estimate a native speaker’s vocabulary or certify fluency.

The conversation set has 57 topics. The broader bank has seven study groups based on `new-1` through `new-7` membership in Complete HSK Vocabulary. Groups 1–3 form Everyday foundations, 4–6 Wider conversations, and 7 Reading & advanced topics. Entries present only in other source editions enter group 7. These are organizational bands, not a frequency ranking or an official exam-level assessment of the app’s lessons.

## Dictionary attribution and data license

The spellings and pronunciations in `src/expanded-vocabulary.js` are adapted from **CC-CEDICT**, by the CC-CEDICT contributors, published by MDBG, continuing the CEDICT project originally created by Paul Andrew Denisowski (CEDICT copyright 1997, 1998).

- Source and download: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
- Contributor project: https://cc-cedict.org/
- License: **Creative Commons Attribution-ShareAlike 4.0 International**, https://creativecommons.org/licenses/by-sa/4.0/
- Legal code: https://creativecommons.org/licenses/by-sa/4.0/legalcode.en

The adapted dictionary data in `src/expanded-vocabulary.js` and `src/broad-vocabulary.js`, and the curated selection, glosses, and example text in `data/vocabulary-selection.tsv`, are distributed under **CC BY-SA 4.0**. The broader module also incorporates separately credited MIT selection data and Apache-2.0 traditional-form preferences; preserve their notices too. Preserve this attribution and license when reusing or modifying that dataset. This notice does not assign that license to the application's code or to the pre-existing lessons and vocabulary.

Richang's modifications include selection, topic grouping, short English learning glosses, marked-tone pinyin, normal spoken changes of 一/不, simplified/traditional example pairs, usage notes, and sentence examples. We normalize 裏 to 裡 for consistency and exclude purely archaic variant entries. Traditional forms with different meanings are chosen explicitly: home is 家 rather than 傢, clouds are 雲 rather than the classical 云, and sleepy is 睏 rather than the trapped or stranded sense of 困. Ambiguous pronunciations are explicitly selected for the sense taught, such as 背 bèi, 妻子 qīzi, 老公 lǎogōng, and 看 kàn.

The exact downloaded archive is identified by its SHA-256 in the generated module's `vocabularySource` object. Its snapshot date is November 5, 2026. The full dictionary archive is not redistributed in this repository.

## Examples and practical limits

The original 144 entries keep their individual conversational examples. Most curated additions demonstrate reusable patterns such as asking where something is, ordering food, describing a quality, or offering to handle a task. Core pronouns, question words, particles, modal verbs, connectors, and exceptions have individual examples. The latest 25 curated additions cover casual expressions; 拿不准 uses the light potential-complement 不 in both its headword display and sentence.

The 10,360 broader entries have **no generated sentence examples**. They keep full dictionary meanings, separate readings, and traditional forms. The card shows the first three dictionary meaning segments; All meanings exposes the complete record. Surname-only and variant-only senses are excluded. Traditional-form preferences favor modern forms such as 後 for “after/behind” and 藥 for medicine. Explicit pronunciation choices protect everyday readings such as 比 bǐ, 打 dǎ, 单 dān, 厂 chǎng, and 骑 qí. Other readings remain accessible with their own definitions. Apostrophes separate syllables before a/e/o when needed, such as 反而 fǎn'ér; search accepts those spellings without apostrophes too.

This broader bank is dictionary material, including formal, technical, literary, regional, and colloquial senses. Source usage labels are retained. It has not received sentence-by-sentence teaching review, and it does not imply that every entry is appropriate in casual conversation.

These examples teach one use of a word, not all of its possible meanings. Pronunciation checks cover dictionary readings, tone-mark conversion, neutral tones, and selected spoken changes. Third tones retain their lexical marks. This does not constitute independent review of every sentence or verification of every synthesized voice output.

## Regenerate without network access

Normal builds and `npm test` use the checked-in module and require no dictionary download or runtime request. To edit the selection or its examples:

1. Download the CC-CEDICT UTF-8 gzip release from the source page above.
2. Edit `data/vocabulary-selection.tsv`. Each topic header supplies its ID, title and category. Rows choose a sentence pattern, headword, English gloss, and optional English wording. `custom` rows supply complete sentence pairs, pinyin, English, and a note.
3. Run `npm run vocab:generate -- /absolute/path/to/cedict.txt.gz`.
4. Inspect the generated diff and run `npm test`.

The generator refuses unresolved readings, missing entries, a different license, or a total other than 1,225. A new dictionary release can change pronunciations or spelling; review those changes rather than treating regeneration as an automatic content update. Keep existing IDs stable: original IDs are preserved, and expansion IDs derive from the headword's Unicode code points rather than its position in the list.

## Broader selection and traditional spelling attribution

The headwords and study-band membership in `data/broad-vocabulary-selection.json` are adapted from **Complete HSK Vocabulary**, Copyright (c) 2026 Yanis Zafirópulos, under the **MIT License**. Source: https://github.com/drkameleon/complete-hsk-vocabulary, revision `7ac65bf1a6387d35f1ade478906172a19311c7f9`, file `complete.json`. The original file’s SHA-256 is recorded in the selection and generated metadata. No upstream frequency rankings, part-of-speech annotations, or radical data are imported. The full permission notice is in `data/licenses/complete-hsk-vocabulary-MIT.txt`. Dictionary definitions and pronunciations are independently read from the pinned CC-CEDICT archive, retaining their CC BY-SA 4.0 attribution.

Traditional-spelling preferences in that selection are adapted from **Open Chinese Convert (OpenCC)**, by Carbo Kuo and contributors, using the Apache-2.0 `STCharacters.txt` and `STPhrases.txt` mappings. Source: https://github.com/BYVoid/OpenCC. Their downloaded file hashes are recorded in `traditionalPreferences`. The derived preferences use longest phrase matches before character mappings, normalize 裏 to 裡, and are supplemented by explicit teaching choices in the importer. They only order matching CC-CEDICT forms; they do not invent a dictionary reading or definition. See `data/licenses/OpenCC-Apache-2.0.txt` and `data/licenses/OpenCC-AUTHORS.txt`.

The source selection contains 11,470 headwords. The importer skips words already in the conversation set and records 64 unmatched or variant-only exclusions in `broadVocabularySource.excluded`. It does not manufacture definitions for unmatched compounds or count extra pronunciations as extra headwords.

### Regenerating the broader bank

With the pinned dictionary archive available locally:

```sh
npm run vocab:generate -- /absolute/path/to/cedict.txt.gz
npm run vocab:broader -- /absolute/path/to/cedict.txt.gz
npm test
```

Both imports run without network access. The broader importer verifies that its archive hash matches the guided set’s dictionary snapshot. Normal builds use the checked-in modules.

To rebuild the source selection itself, obtain `complete.json` at the revision above and the OpenCC tables matching the recorded hashes, then run:

```sh
node scripts/prepare-broad-selection.cjs /path/to/complete.json /path/to/STCharacters.txt /path/to/STPhrases.txt 7ac65bf1a6387d35f1ade478906172a19311c7f9
```

Review the selection diff, explicit pronunciation and traditional-form choices, and exclusions before importing a different source snapshot. Generated IDs derive from Unicode headwords, so reordering entries does not erase progress.
