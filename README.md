# 日常 · Richang

A Mac desktop app for moving from family Chinese to everyday conversational fluency. Built with Electron and plain JavaScript, HTML, and CSS. The core lessons and offline rehearsal need no account or API key. Optional OpenAI or local Ollama connections enable custom conversations and text feedback.

The initial curriculum is **Mandarin** with simplified or traditional characters. It assumes you already know some Chinese and focuses on useful phrases, context, and natural phrasing rather than starting with an alphabet or basic greetings.

Work lessons use friendly, polite language for an informal tech team: quick feature updates, asking a teammate to look at code, checking what someone means, and suggesting an experiment. Short requests, 一下, and simple thanks keep the tone considerate. The material is written for conversations with coworkers and managers you speak with regularly.

## Rehearse something you want to say

**Quit and restart the app with `npm start` after this update.** Rehearsal adds desktop connection methods, so reloading the window alone is not enough to activate AI connections.

Choose **Rehearsal** or the home screen’s **Rehearse it** button:

1. Describe an upcoming conversation in English, Chinese, or a mix. Choose whether you are speaking to your manager, a teammate, a friend, or family.
2. Prepare three useful expressions with pinyin, meanings, listening, and usage notes.
3. Answer three prompts in your own words. Type, use macOS Dictation, or record and listen back. In OpenAI mode, an explicit **Transcribe with OpenAI** button uploads the recording and returns an editable transcript.
4. Get focused feedback, keep a note, and retry without the preparation screen. The conversation returns in Review the next day, and you can mark when you used it in real life.

Your goals, drafts, transcripts, notes, and personal expressions are saved locally. Personal expressions can be bookmarked, searched, listened to, and practiced in spaced review alongside the original phrasebook. Existing lesson progress is preserved.

| Mode | Preparation and feedback | Setup |
| --- | --- | --- |
| Offline practice | Prepared material for a selected topic, open replies, and example-based self-review. It does not assess meaning or grammar. | Ready immediately. Choose the closest topic; there is also a dedicated example for waiting on someone before you can finish work. |
| OpenAI | A custom plan for your exact goal, replies that react to your answer, and feedback on meaning, wording, and register. Optional audio transcription. | Preferences → AI connection → OpenAI. Enter an API key, save, and check the connection. API usage is billed to your API account. |
| Local Ollama | Custom plans and adaptive text conversations using your locally installed model. Type or use Dictation for your reply. | Run Ollama with a Mandarin-capable model installed. Enter its name from `ollama list` in Preferences and check the connection. |

No pronunciation grade is produced: the coach evaluates the submitted text, including any edited transcript. AI-generated Chinese can contain mistakes. See the [rehearsal implementation and verification notes](docs/rehearsal.md).

## Run on your Mac

Install Node.js 22 or newer, then run these commands in this folder:

```sh
npm install
npm start
```

The first install needs an internet connection to download Electron. Dependencies resolve npm's `latest` tags; npm records the resolved versions in `package-lock.json` when you install. Once installed, the app content and progress work offline. Listening uses an installed Mandarin system voice, preferring Tingting on macOS. If a voice is missing, the app explains how to add one.

For a quick browser preview without installing dependencies:

```sh
npm run preview
```

This opens the local app in your default browser. For browser development with a local server, run `npm run dev` and visit http://127.0.0.1:5173. Browser previews use browser speech synthesis; voice availability and microphone behavior can differ from Electron. Browser and desktop progress are separate.

## What you can do

- Practice **96 phrases in 16 situations**: five conversations for work and 11 for everyday life.
- Listen at normal or slower speed, read optional pinyin and English, and switch character scripts.
- Record yourself for up to 30 seconds and listen back against the example. This is self-listening practice, with no automated pronunciation grading.
- Try the original three-turn guided lessons, or use Rehearsal for open responses. Connected rehearsal adds adaptive AI conversation and wording feedback.
- Search the phrasebook in English, Chinese, or pinyin and bookmark useful phrases.
- Recall learned phrases in spaced review. “Again” returns in ten minutes, “Hard” in one day, “Got it” starts at two days, and “Easy” starts at four. Stronger recall increases the interval.
- Track unique phrases practiced per day, completed conversations, streaks, and a configurable daily goal.
- Export progress as JSON. Export is a manual backup; importing backups is not implemented in this version.

Advancing past a phrase logs it as practiced and schedules review; this measures practice activity, not proven fluency. Closing a lesson early keeps phrases you practiced, but does not mark the conversation completed.

Progress and settings use local storage. Recordings stay in memory and are discarded when you leave the practice. There are no external fonts or telemetry. The original lessons and offline rehearsal work without network requests. When you choose OpenAI, the goal and conversation text are sent to OpenAI; recording uploads happen only when you click transcription. Ollama requests go only to `127.0.0.1:11434`. Avoid treating local storage as your only long-term backup.

API keys are held in the desktop main process. A newly entered key lasts only until you quit unless you explicitly select **Remember key securely on this Mac**, which uses Electron’s OS-protected encryption. Keys are not included in progress exports. **Forget API key** removes the stored key and returns to offline mode; resetting lesson progress does not remove the separate connection settings.

## Pronunciation and lesson review

Pinyin shows the usual spoken tone changes of 一 and 不, retains lexical third-tone marks, and uses unmarked syllables for common neutral tones. The daily phrase explains why 一下 is shown as **yíxià**, while Preferences includes a short guide to the notation. Traditional characters change the script, not the Mandarin pronunciation variety.

The [lesson text audit](docs/content-audit.md) covers all 96 phrases and 48 roleplay prompts, explains the notation choices and refinements, and links the pronunciation references.

## Everyday conversations

Choose **Conversations → Everyday life** to find these lessons. The home screen also features daily conversation starters.

| Lesson | What you practice |
| --- | --- |
| How was your day? | Sharing a small update, talking about your energy, and asking about their day. |
| Making plans | Inviting a friend for coffee, picking a time, and choosing a meeting place. |
| Running late & rescheduling | Explaining a delay, giving an estimate, and finding another time. |
| Shows, hobbies & recommendations | Asking about a show, getting an opinion, and following up on a recommendation. |
| Shopping & exchanging things | Trying on clothes, asking for a size, and checking the exchange policy. |
| Groceries & cooking | Planning dinner, checking ingredients, and sharing cooking tasks. |
| Visiting someone’s home | Asking about shoes, offering to help, and thanking your host. |
| Asking for a little help | Borrowing a charger, explaining a connection problem, and acknowledging a fix. |

These join the existing weekend chat, cafés and restaurants, and getting-around lessons. Each lesson has six phrases with pinyin, both character scripts, English meanings, usage notes, and a three-turn guided conversation. New phrases use the same saved phrasebook, recording, review, and progress features. Existing progress and bookmarks are preserved.

## Build a Mac app

```sh
npm run pack:mac
```

The Apple Silicon app is generated at `dist/Richang-darwin-arm64/Richang.app`. For an Intel Mac, replace `--arch=arm64` with `--arch=x64` in the `pack:mac` script before packaging. The microphone usage description is included in the packaged app; macOS may ask for microphone permission the first time you record.

Packaging produces an unsigned personal-use app. Developer ID signing, notarization, an installer, and automatic updates are not included.

## Development

```sh
npm test
```

The build uses a small dependency-free bundler to assemble the three renderer modules. Electron and the packager are the only third-party development dependencies.

- `src/content.js`: phrases, pinyin, translations, usage notes, and roleplay prompts.
- `src/model.js`: progress data, review intervals, daily activity, and streaks.
- `src/rehearsal.js`: preparation schemas, offline practice, validation, and saved rehearsal data.
- `src/app.js`: screens, learning sessions, listening, and recording.
- `src/styles.css`: responsive desktop interface using system fonts.
- `electron/main.cjs`: sandboxed desktop window, local protocol, native Mac speech, and media permissions.
- `electron/ai.cjs`: desktop-only provider connections, encrypted optional key storage, structured plans and feedback, and audio transcription.
- `test/`: content checks, model tests, and renderer flow tests using DOM and storage doubles.

The renderer has no Node access. A restricted preload exposes speech and specific AI actions; it never exposes the configured API key, arbitrary URLs, or filesystem operations. The desktop loads bundled files through a local secure protocol, denies new windows and external navigation, and restricts requested media access to audio. All lesson and model-generated text is escaped before rendering.

## Verification status

The automated tests cover curriculum integrity, all 16 original lesson flows, personal rehearsal from preparation through completion, review, reminders, persistence, retry behavior, escaping, provider response handling, key storage, transcription request construction, daily goals, review timing, and streaks. Provider tests use mocked responses and never make paid API calls.

The installed Electron executable exited during macOS application initialization (`SIGABRT`) when launched by this development environment. Packaging also failed because its download request could not complete. An existing running window was reachable, but reloading it did not load the current renderer. Consequently, the new desktop UI, live audio playback, microphone recording, and live provider calls remain unverified here. Restart the app from your terminal to complete those checks.

Electron setup follows the [official security guidance](https://www.electronjs.org/docs/latest/tutorial/security).
