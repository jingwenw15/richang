import { scenarios, phraseById } from './content.js';

const rehearsalTextSchema = { type: 'string' };
const rehearsalObject = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
export const utteranceSchema = rehearsalObject({ zh: rehearsalTextSchema, traditional: rehearsalTextSchema, pinyin: rehearsalTextSchema, en: rehearsalTextSchema });
export const preparationSchema = rehearsalObject({
  title: rehearsalTextSchema,
  situation: rehearsalTextSchema,
  expressions: { type: 'array', minItems: 3, maxItems: 3, items: rehearsalObject({ ...utteranceSchema.properties, note: rehearsalTextSchema }) },
  opening: utteranceSchema,
  goals: { type: 'array', minItems: 3, maxItems: 3, items: rehearsalTextSchema }
});
export const responseSchema = rehearsalObject({
  next: utteranceSchema,
  feedback: rehearsalObject({
    status: { type: 'string', enum: ['understood', 'partial', 'try-again', 'compare'] },
    message: rehearsalTextSchema, tip: rehearsalTextSchema,
    suggestion: { anyOf: [utteranceSchema, { type: 'null' }] }
  }),
  goalMet: { type: 'boolean' }
});

const rehearsalString = (value, max = 1500) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
export function validUtterance(value) {
  return value && ['zh', 'traditional', 'pinyin', 'en'].every(key => rehearsalString(value[key], 700)) &&
    /\p{Script=Han}/u.test(value.zh) && /\p{Script=Han}/u.test(value.traditional) && /\p{Script=Latin}/u.test(value.pinyin);
}
export function validatePreparation(value) {
  if (!value || !rehearsalString(value.title, 100) || !rehearsalString(value.situation) ||
    !Array.isArray(value.expressions) || value.expressions.length !== 3 || !value.expressions.every(p => validUtterance(p) && rehearsalString(p.note)) ||
    !validUtterance(value.opening) || !Array.isArray(value.goals) || value.goals.length !== 3 || !value.goals.every(goal => rehearsalString(goal, 500))) {
    throw new Error('The practice plan was incomplete. Try preparing it again.');
  }
  return value;
}
export function validateRehearsalResponse(value) {
  if (!value || !validUtterance(value.next) || !value.feedback || !['understood', 'partial', 'try-again', 'compare'].includes(value.feedback.status) ||
    !rehearsalString(value.feedback.message) || !rehearsalString(value.feedback.tip) ||
    (value.feedback.suggestion !== null && !validUtterance(value.feedback.suggestion)) || typeof value.goalMet !== 'boolean') {
    throw new Error('The feedback was incomplete. Your answer is still here; try again.');
  }
  return value;
}

const dependencyExpressions = [
  { zh: '我在等同事的回复。', traditional: '我在等同事的回覆。', pinyin: 'Wǒ zài děng tóngshì de huífù.', en: 'I’m waiting for a reply from a coworker.', note: '等… names what you are waiting for. Replace 同事 with the person or team involved.' },
  { zh: '拿到结果以后，我就能继续了。', traditional: '拿到結果以後，我就能繼續了。', pinyin: 'Ná dào jiéguǒ yǐhòu, wǒ jiù néng jìxù le.', en: 'Once I have the result, I can keep going.', note: '…以后，我就能… explains the dependency and what you can do after it is resolved.' },
  { zh: '我再问一下，有消息就跟你说。', traditional: '我再問一下，有消息就跟你說。', pinyin: 'Wǒ zài wèn yíxià, yǒu xiāoxi jiù gēn nǐ shuō.', en: 'I’ll check again and let you know when I hear back.', note: 'A short, friendly next step. 一下 is yíxià, and 消息 commonly has a neutral final syllable.' }
];
const dependencyQuestions = [
  { zh: '这块现在怎么样了？', traditional: '這塊現在怎麼樣了？', pinyin: 'Zhè kuài xiànzài zěnmeyàng le?', en: 'How’s this part going?' },
  { zh: '那拿到回复之后呢？', traditional: '那拿到回覆之後呢？', pinyin: 'Nà ná dào huífù zhīhòu ne?', en: 'And once you get the reply?' },
  { zh: '要是今天还没消息，你打算怎么办？', traditional: '要是今天還沒消息，你打算怎麼辦？', pinyin: 'Yàoshi jīntiān hái méi xiāoxi, nǐ dǎsuàn zěnme bàn?', en: 'If you still haven’t heard back today, what will you do?' }
];

export const rehearsalExamples = [
  { goal: 'Tell my manager I’m waiting on a coworker before I can finish.', audience: 'manager', topic: 'dependency' },
  { goal: 'Catch up with a friend about my day and ask about theirs.', audience: 'friend', topic: 'your-day' },
  { goal: 'Invite a friend for coffee and figure out when and where to meet.', audience: 'friend', topic: 'making-plans' }
];
export function suggestRehearsalTopic(goal) {
  const rules = [
    ['dependency', /\b(?:waiting|wait for|depend\w*|blocked by)\b|等.*回|依赖|等同事/i],
    ['video-calls', /\b(?:video calls?|muted|screen shar\w*|choppy|zoom call)\b|静音|共享.*屏幕|视频会议/i],
    ['priorities', /\b(?:priorit\w*|urgent|capacity|deadline\w*)\b|优先|哪个.*急|来不及/i],
    ['weather', /\b(?:weather|rain\w*|umbrella\w*|forecast)\b|天气|下雨|带伞/i],
    ['deliveries', /\b(?:deliver\w*|packages?|parcels?|couriers?)\b|快递|包裹/i],
    ['routines', /\b(?:routines?|commut\w*|work(?:ing)? from home|wake up)\b|起床|通勤|在家办公/i],
    ['declining', /\b(?:declin\w*|turn down|can[’']t make it)\b|拒绝|去不了/i],
    ['catching-up', /\b(?:catch(?:ing)? up|keep in touch|stay in touch|new job)\b|好久没见|换工作/i],
    ['misunderstandings', /\b(?:misunderstand\w*|misheard|mix.up|apolog\w*)\b|听错|误会|说清楚/i],
    ['changing-plans', /\b(?:late|reschedul\w*|delay\w*)\b|改天|迟到|晚点|改时间/i],
    ['making-plans', /\b(?:invite\w*|coffee|meet.*friend|plans)\b|约|咖啡|见面/i],
    ['your-day', /\b(?:my day|their day|how.*day|tired|after work)\b|一天|下班|今天过|累/i],
    ['interests', /\b(?:shows?|movies?|watch\w*|hobb\w*|recommend\w*)\b|电视剧|电影|推荐|爱好/i],
    ['cooking', /\b(?:cook\w*|grocer\w*|ingredients?|dinner.*home)\b|做饭|买菜|晚饭/i],
    ['visiting', /\b(?:visit\w*|host|their home|friend.*home)\b|做客|串门|换鞋/i],
    ['shopping', /\b(?:shop\w*|jacket|sizes?|exchang\w*)\b|买衣|尺码|换货|试穿/i],
    ['small-problems', /\b(?:chargers?|battery|wi.?fi|phone)\b|充电|手机|上网/i],
    ['updates', /\b(?:manager|progress|projects?|features?|finish\w*)\b|经理|进度|项目|做完/i],
    ['clarify', /\b(?:clarif\w*|repeat\w*|understand\w*)\b|解释|没听|明白/i],
    ['lunch', /\b(?:lunch|coworkers?)\b|午饭|同事/i]
  ];
  return rules.find(([, pattern]) => pattern.test(goal))?.[0] || '';
}
export function createOfflinePreparation(topic) {
  if (topic === 'dependency') return validatePreparation({
    title: 'Explain what you’re waiting on', situation: 'A teammate checks on your work. Explain the dependency, what happens next, and how you will follow up.',
    expressions: dependencyExpressions.map(p => ({ ...p })), opening: dependencyQuestions[0],
    goals: ['Explain what you are waiting for.', 'Say what you can do once you get the reply.', 'Give a practical next step if there is still no reply.']
  });
  const scene = scenarios.find(s => s.id === topic);
  if (!scene) throw new Error('Choose an offline topic that fits your conversation, or connect AI for a custom plan.');
  return validatePreparation({ title: scene.short, situation: scene.situation,
    expressions: scene.turns.map(turn => { const p = phraseById(turn.correct); return { zh: p.zh, traditional: p.traditional, pinyin: p.pinyin, en: p.en, note: p.note }; }),
    opening: { zh: scene.turns[0].zh, traditional: scene.turns[0].traditional, pinyin: scene.turns[0].pinyin, en: scene.turns[0].en }, goals: scene.turns.map(turn => turn.goal) });
}
export function offlineRehearsalReply(session, answer) {
  if (!rehearsalString(answer, 2000)) throw new Error('Say or type a reply first.');
  const index = session.turns.length;
  const plan = session.plan;
  const nextIndex = Math.min(index + 1, 2);
  const scene = scenarios.find(s => s.id === session.topic);
  const next = index === 2 ? { zh: '好，那回头再聊。', traditional: '好，那回頭再聊。', pinyin: 'Hǎo, nà huítóu zài liáo.', en: 'Okay, let’s talk again later.' } : (session.topic === 'dependency' ? dependencyQuestions[nextIndex] : scene?.turns[nextIndex]);
  if (!next) throw new Error('This offline conversation is unavailable. Prepare it again.');
  return validateRehearsalResponse({ next: { zh: next.zh, traditional: next.traditional, pinyin: next.pinyin, en: next.en },
    feedback: { status: 'compare', message: 'Compare your reply with one natural way to say it. Offline practice does not judge meaning or grammar.',
      tip: plan.expressions[index].note, suggestion: { ...plan.expressions[index] } }, goalMet: false });
}
export function makeRehearsal({ goal, audience, source, topic = '', plan }, now = Date.now()) {
  if (!rehearsalString(goal, 1000) || !['manager', 'teammate', 'friend', 'family'].includes(audience) || !['offline', 'openai', 'ollama'].includes(source)) throw new Error('Add a conversation goal and choose who you are speaking with.');
  validatePreparation(plan);
  const id = `r${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return { id, goal: goal.trim(), audience, source, topic, createdAt: now, plan, phase: 'prep', turns: [], attempts: [], revisitAt: null, completedAt: null, reflection: '' };
}
export function rehearsalPhrases(session) {
  return session.plan.expressions.map((p, i) => ({ ...p, id: `${session.id}_${i}`, sceneId: session.id, sceneTitle: session.plan.title,
    category: ['manager', 'teammate'].includes(session.audience) ? 'At work' : 'Everyday life', register: 'Friendly & polite', source: session.source }));
}
export function completeRehearsal(session, now = Date.now()) {
  if (session.turns.length !== 3) throw new Error('Finish the three replies before completing your rehearsal.');
  session.phase = 'done'; session.completedAt = now; session.revisitAt = now + 86400000;
  return session;
}
export function retryRehearsal(session) {
  if (session.turns.length) session.attempts = [...session.attempts, { turns: session.turns, completedAt: session.completedAt, reflection: session.reflection }].slice(-5);
  session.turns = []; session.phase = 'talk'; session.completedAt = null; session.reflection = ''; session.revisitAt = null;
  return session;
}
export function restoreRehearsals(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(s => {
    try {
      if (!s || !/^r[a-z0-9]{6,40}$/.test(s.id) || !rehearsalString(s.goal, 1000) || !['prep', 'talk', 'done'].includes(s.phase) ||
        !['offline', 'openai', 'ollama'].includes(s.source) || !['manager', 'teammate', 'friend', 'family'].includes(s.audience) ||
        !Number.isFinite(s.createdAt) || !Array.isArray(s.turns) || s.turns.length > 3 ||
        (s.phase === 'done' && s.turns.length !== 3) || (s.phase === 'prep' && s.turns.length !== 0) || (s.phase === 'talk' && s.turns.length >= 3) ||
        !s.turns.every(t => rehearsalString(t.answer, 2000) && validUtterance(t.prompt) && validateRehearsalResponse(t.result))) return false;
      validatePreparation(s.plan); return true;
    } catch { return false; }
  }).map(s => ({ ...s, attempts: Array.isArray(s.attempts) ? s.attempts.slice(-5) : [], draft: typeof s.draft === 'string' ? s.draft.slice(0, 2000) : '', reflection: typeof s.reflection === 'string' ? s.reflection.slice(0, 1000) : '',
    realUsedAt: Number.isFinite(s.realUsedAt) ? s.realUsedAt : null, revisitAt: Number.isFinite(s.revisitAt) ? s.revisitAt : null, completedAt: Number.isFinite(s.completedAt) ? s.completedAt : null }));
}
export function restorePersonalPhrases(value) {
  return Array.isArray(value) ? value.filter(p => p && /^r[a-z0-9]{6,40}_[0-2]$/.test(p.id) && validUtterance(p) && rehearsalString(p.note) && rehearsalString(p.sceneTitle, 100) && ['At work', 'Everyday life'].includes(p.category)) : [];
}
