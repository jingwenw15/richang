# Vocabulary sources and regeneration

The app contains 1,200 unique simplified headwords. The original 144 entries and IDs remain unchanged. The other 1,056 are a curated selection for conversation, household needs, family, work, travel, food, time, and basic sentence building. Some entries are multi-character expressions or grammar particles; this is not a corpus-ranked list or an HSK syllabus.

## Dictionary attribution and data license

The spellings and pronunciations in `src/expanded-vocabulary.js` are adapted from **CC-CEDICT**, by the CC-CEDICT contributors, published by MDBG, continuing the CEDICT project originally created by Paul Andrew Denisowski (CEDICT copyright 1997, 1998).

- Source and download: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
- Contributor project: https://cc-cedict.org/
- License: **Creative Commons Attribution-ShareAlike 4.0 International**, https://creativecommons.org/licenses/by-sa/4.0/
- Legal code: https://creativecommons.org/licenses/by-sa/4.0/legalcode.en

The adapted dataset in `src/expanded-vocabulary.js` and its curated selection, glosses, and example text in `data/vocabulary-selection.tsv` are distributed under **CC BY-SA 4.0**. Preserve this attribution and license when reusing or modifying that dataset. This notice does not assign that license to the application's code or to the pre-existing lessons and vocabulary.

Richang's modifications include selection, topic grouping, short English learning glosses, marked-tone pinyin, normal spoken changes of 一/不, simplified/traditional example pairs, usage notes, and sentence examples. We normalize 裏 to 裡 for consistency and exclude purely archaic variant entries. Traditional forms with different meanings are chosen explicitly: home is 家 rather than 傢, clouds are 雲 rather than the classical 云, and sleepy is 睏 rather than the trapped or stranded sense of 困. Ambiguous pronunciations are explicitly selected for the sense taught, such as 背 bèi, 妻子 qīzi, 老公 lǎogōng, and 看 kàn.

The exact downloaded archive is identified by its SHA-256 in the generated module's `vocabularySource` object. Its snapshot date is November 5, 2026. The full dictionary archive is not redistributed in this repository.

## Examples and practical limits

The original 144 entries keep their individual conversational examples. Most additions demonstrate reusable patterns such as asking where something is, ordering food, describing a quality, or offering to handle a task. Core pronouns, question words, particles, modal verbs, and exceptions have individual examples. English articles, number expressions, and past-time examples are adjusted explicitly. The latest 200 entries add team coordination, software delivery, connectors, scheduling, social conversations, decisions, nuanced descriptions, and errands. Connectors and most abstract words have individual examples to demonstrate their sentence patterns.

These examples teach one use of a word, not all of its possible meanings. Pronunciation checks cover dictionary readings, tone-mark conversion, neutral tones, and selected spoken changes. Third tones retain their lexical marks. This does not constitute independent review of every sentence or verification of every synthesized voice output.

## Regenerate without network access

Normal builds and `npm test` use the checked-in module and require no dictionary download or runtime request. To edit the selection or its examples:

1. Download the CC-CEDICT UTF-8 gzip release from the source page above.
2. Edit `data/vocabulary-selection.tsv`. Each topic header supplies its ID, title and category. Rows choose a sentence pattern, headword, English gloss, and optional English wording. `custom` rows supply complete sentence pairs, pinyin, English, and a note.
3. Run `npm run vocab:generate -- /absolute/path/to/cedict.txt.gz`.
4. Inspect the generated diff and run `npm test`.

The generator refuses unresolved readings, missing entries, a different license, or a total other than 1,200. A new dictionary release can change pronunciations or spelling; review those changes rather than treating regeneration as an automatic content update. Keep existing IDs stable: original IDs are preserved, and expansion IDs derive from the headword's Unicode code points rather than its position in the list.
