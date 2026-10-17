# Personal conversation rehearsal

The Rehearsal area implements a complete preparation → open response → feedback → retry loop. It adds personal context while keeping the original 96-phrase curriculum usable offline.

## Behavior

- A goal can be written in English, Mandarin, or both, and includes the relationship with the conversation partner.
- Preparation provides exactly three expressions and three speaking goals.
- Offline practice uses one of the 16 existing lesson topics or a dedicated dependency conversation. It clearly labels its responses as self-review, accepts open text without exact matching, and shows a reference expression. It never claims to assess an answer.
- Connected practice generates a plan for the actual goal and sends the conversation so far with each reply. The partner is asked to respond to what the learner said and introduce plausible follow-ups. The coach accepts different valid phrasings and code-switching.
- Each reply produces a short feedback message, one practical tip, and an optional natural phrasing. Meaning, wording, and register are assessed from submitted text. Pronunciation is not scored or inferred from transcripts.
- The learner can revise their last reply, retry the conversation without preparation, save a reflection, and mark a real-life use. The five most recent previous attempts are retained with that conversation.
- Completing three replies schedules the conversation to return in Review after 24 hours. This is a practice reminder, not a claim of fluency. Offline responses never contribute AI-assessed success counts.
- Prepared expressions become personal phrasebook entries and can be bookmarked and reviewed using the existing recall flow. Reviewing them, rather than merely generating a plan, records phrase review activity.

## Desktop connections

Quit and restart `npm start` to load the updated main process and preload. Connection settings are under Preferences.

**OpenAI:** The default conversation model is `gpt-4.1-mini`, and the model name is editable. Plans and feedback use the [Responses API with structured output](https://developers.openai.com/api/docs/guides/structured-outputs). The app validates returned fields before saving or displaying them. Requests set `store: false`. An explicit audio-transcription action uses [`gpt-4o-mini-transcribe`](https://developers.openai.com/api/docs/guides/speech-to-text), accepts a short recording up to 12 MB, and returns a transcript for the learner to edit before submitting.

**Ollama:** The model must already be installed and capable of useful Mandarin generation. No model is automatically downloaded. Requests use the [local chat endpoint](https://docs.ollama.com/api/chat), with a [JSON schema supplied as the output format](https://docs.ollama.com/capabilities/structured-outputs). The endpoint is fixed at `http://127.0.0.1:11434`; arbitrary remote endpoints are not accepted. Local mode does not provide audio transcription; the reply field works with typing or macOS Dictation.

The connection check verifies that the provider and configured model can be reached. It does not guarantee the quality of that model’s Mandarin or availability for all request types.

## Storage and data flow

- `richang.v1` keeps the existing progress fields and adds `rehearsals` and `personalPhrases`. Old progress migrates without losing lesson IDs, bookmarks, or reviews.
- Goals, drafts, transcripts, notes, and personal expressions stay in local storage and are included in the progress JSON export. Raw recordings are temporary in-memory blobs and are not exported.
- Navigation, session changes, resubmission, and window unload stop capture, release microphone tracks, and revoke recording URLs. Pending permission or transcription results are ignored if the user has left that turn.
- Connected preparation sends the goal and relationship to the selected provider. Submitting a reply sends the plan, prior turns, and edited answer. OpenAI receives audio only when the learner clicks **Transcribe with OpenAI**.
- API keys are never returned by the preload, embedded in prompts, stored in lesson progress, or exported. An entered key is held in the main process for the app session by default. The optional remember setting encrypts it using Electron `safeStorage`, saves the encrypted value in the app’s user-data directory, and requires encryption to be available. The app never falls back to plaintext persistence.
- Removing a key is separate from resetting study progress. The main process accepts only the defined actions from its trusted app window, and provider request destinations are fixed.
- Both reviewed and generated text are HTML-escaped in preparation, conversation, phrasebook, and review screens.

## Verification

Automated tests exercise preparation and all offline topics, open responses, three-turn completion, reminders, persistence, revision/retry state, personal expression review, escaping, malformed saved data, failed AI requests, structured provider payloads, response validation, protected key storage, and bounded transcription uploads. Provider calls are mocked; no real API key or paid request is used in the suite.

The full desktop launch and packaging could not be completed in this environment. Live cloud/local model conversations, OS microphone prompts, actual recording and transcription, OS-protected key persistence, and visual layout still need an on-device check.

Core lesson text has its own [content audit](content-audit.md). Generated plans and feedback are not part of that reviewed curriculum and can contain language or assessment errors. The additional offline dependency example uses matching scripts and the same pinyin convention, including **yíxià** and neutral **xiāoxi**.
