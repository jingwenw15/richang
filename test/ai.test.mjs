import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createOfflinePreparation, makeRehearsal } from '../src/rehearsal.js';
const { createAiService } = createRequire(import.meta.url)('../electron/ai.cjs');
const fakeStorage = {
  isEncryptionAvailable: () => true,
  encryptString: value => Buffer.from('test-cipher:' + value),
  decryptString: value => value.toString().replace('test-cipher:', '')
};
async function service(t, request, safeStorage = fakeStorage) {
  const directory = await mkdtemp(path.join(tmpdir(), 'richang-ai-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const ai = await createAiService({ directory, safeStorage, request });
  return { ai, directory };
}
const jsonResponse = (data, status = 200) => new Response(JSON.stringify(data), { status });
const responseEnvelope = value => ({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(value) }] }] });

test('API keys stay out of status and are not persisted without an explicit remember choice', async t => {
  const { ai, directory } = await service(t, () => { throw new Error('Unexpected network request'); });
  await ai.configure({ provider: 'openai', apiKey: 'test-key-only', rememberKey: false });
  assert.equal(ai.status().hasKey, true); assert.equal(ai.status().keyStored, false);
  assert.ok(!JSON.stringify(ai.status()).includes('test-key-only'));
  assert.ok(!(await readFile(path.join(directory, 'ai-connection.json'), 'utf8')).includes('test-key-only'));
  const reopened = await createAiService({ directory, safeStorage: fakeStorage });
  assert.equal(reopened.status().hasKey, false);
});
test('remembered keys use protected storage, survive a restart, and can be forgotten', async t => {
  const { ai, directory } = await service(t, () => {});
  await ai.configure({ provider: 'openai', apiKey: 'test-key-only', rememberKey: true });
  assert.equal(ai.status().keyStored, true);
  const stored = await readFile(path.join(directory, 'ai-connection.json'), 'utf8');
  assert.ok(!stored.includes('test-key-only')); assert.ok(JSON.parse(stored).encryptedKey);
  const reopened = await createAiService({ directory, safeStorage: fakeStorage });
  assert.equal(reopened.status().hasKey, true);
  await reopened.configure({ provider: 'offline', forgetKey: true, rememberKey: false });
  assert.equal(reopened.status().hasKey, false);
  assert.equal(JSON.parse(await readFile(path.join(directory, 'ai-connection.json'), 'utf8')).encryptedKey, '');
});
test('unavailable secure storage does not silently save a key in plaintext', async t => {
  const { ai } = await service(t, () => {}, { ...fakeStorage, isEncryptionAvailable: () => false });
  await assert.rejects(ai.configure({ provider: 'openai', apiKey: 'test-key-only', rememberKey: true }), /Secure key storage is unavailable/);
  assert.equal(ai.status().provider, 'offline'); assert.equal(ai.status().hasKey, false);
});
test('OpenAI preparation uses the Responses schema and validates returned lesson data', async t => {
  const plan = createOfflinePreparation('dependency');
  const calls = [];
  const { ai } = await service(t, async (url, options) => { calls.push({ url, options }); return jsonResponse(responseEnvelope(plan)); });
  await ai.configure({ provider: 'openai', apiKey: 'test-key-only', rememberKey: false });
  const result = await ai.prepare({ goal: 'Explain I am waiting on someone else.', audience: 'manager' });
  assert.equal(result.provider, 'openai'); assert.equal(result.plan.expressions.length, 3);
  assert.equal(calls[0].url, 'https://api.openai.com/v1/responses');
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.store, false); assert.equal(body.text.format.type, 'json_schema'); assert.equal(body.text.format.strict, true);
  assert.match(body.instructions, /never claim to hear pronunciation/i);
  assert.match(body.instructions, /Accept multiple valid answers/);
  assert.ok(!body.input.includes('test-key-only'));
});
test('open-answer feedback receives the real reply and previous conversation without exact matching', async t => {
  let sent;
  const reply = { next: { zh: '那你打算怎么办？', traditional: '那你打算怎麼辦？', pinyin: 'Nà nǐ dǎsuàn zěnme bàn?', en: 'What will you do then?' }, feedback: { status: 'understood', message: 'You explained the dependency clearly.', tip: 'Add who you are waiting for if it is useful.', suggestion: null }, goalMet: true };
  const { ai } = await service(t, async (_url, options) => { sent = JSON.parse(options.body); return jsonResponse(responseEnvelope(reply)); });
  await ai.configure({ provider: 'openai', apiKey: 'test-key-only', rememberKey: false });
  const session = makeRehearsal({ goal: 'Explain a blocker.', audience: 'teammate', source: 'openai', plan: createOfflinePreparation('dependency') }); session.phase = 'talk';
  const result = await ai.reply(session, '设计那边还没给我反馈。');
  assert.equal(result.goalMet, true); assert.equal(result.feedback.suggestion, null);
  assert.equal(JSON.parse(sent.input).answer, '设计那边还没给我反馈。');
  assert.match(sent.instructions, /REACTS to what they said/);
});
test('provider failures, invalid plans, refusals, and cut-off outputs produce usable errors', async t => {
  let response = jsonResponse({}, 401);
  const { ai } = await service(t, async () => response);
  await ai.configure({ provider: 'openai', apiKey: 'test-key-only', rememberKey: false });
  const input = { goal: 'Talk about my day.', audience: 'friend' };
  await assert.rejects(ai.prepare(input), /key was not accepted/);
  response = jsonResponse({ status: 'incomplete' }); await assert.rejects(ai.prepare(input), /cut short/);
  response = jsonResponse(responseEnvelope({})); await assert.rejects(ai.prepare(input), /plan was incomplete/);
  response = jsonResponse({ output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'No' }] }] }); await assert.rejects(ai.prepare(input), /could not make this practice/);
});
test('Ollama uses a fixed local endpoint, checks the selected model, and never sends an OpenAI key', async t => {
  const calls = [];
  const { ai } = await service(t, async (url, options) => {
    calls.push({ url, options });
    return jsonResponse(url.endsWith('/tags') ? { models: [{ name: 'local-test:latest' }] } : { message: { content: JSON.stringify(createOfflinePreparation('your-day')) } });
  });
  await assert.rejects(ai.configure({ provider: 'ollama' }), /installed/);
  await ai.configure({ provider: 'ollama', ollamaModel: 'local-test' });
  await ai.check(); await ai.prepare({ goal: 'Tell a friend about my day.', audience: 'friend' });
  assert.ok(calls.every(call => call.url.startsWith('http://127.0.0.1:11434/')));
  assert.equal(calls[1].options.headers.Authorization, undefined);
  assert.equal(JSON.parse(calls[1].options.body).stream, false);
});
test('transcription accepts only explicit bounded audio uploads and returns editable text', async t => {
  let upload;
  const { ai } = await service(t, async (url, options) => { upload = { url, options }; return jsonResponse({ text: '我再 ping 一下。' }); });
  await assert.rejects(ai.transcribe({ bytes: new Uint8Array([1]), mime: 'audio/webm' }), /OpenAI connection/);
  await ai.configure({ provider: 'openai', apiKey: 'test-key-only', rememberKey: false });
  await assert.rejects(ai.transcribe({ bytes: new Uint8Array([1]), mime: 'text/plain' }), /audio format/);
  const text = await ai.transcribe({ bytes: new Uint8Array([1, 2, 3]), mime: 'audio/webm;codecs=opus' });
  assert.equal(text, '我再 ping 一下。');
  assert.equal(upload.url, 'https://api.openai.com/v1/audio/transcriptions');
  assert.equal(upload.options.body.get('model'), 'gpt-4o-mini-transcribe');
  assert.equal(upload.options.body.get('file').size, 3);
});
