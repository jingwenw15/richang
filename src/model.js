import { restoreRehearsals, restorePersonalPhrases } from './rehearsal.js';

export const defaultState = () => ({ version: 1, saved: [], reviews: {}, completed: [], activity: {}, rehearsals: [], personalPhrases: [], settings: { pinyin: true, english: true, traditional: false, slow: false, goal: 6 }, lastScene: 'updates' });
export function hydrate(raw) {
  const base = defaultState();
  if (!raw || raw.version !== 1) return base;
  return {
    ...base,
    saved: Array.isArray(raw.saved) ? raw.saved.filter(x => typeof x === 'string') : [],
    completed: Array.isArray(raw.completed) ? raw.completed.filter(x => typeof x === 'string') : [],
    reviews: raw.reviews && typeof raw.reviews === 'object' && !Array.isArray(raw.reviews) ? raw.reviews : {},
    activity: raw.activity && typeof raw.activity === 'object' && !Array.isArray(raw.activity) ? raw.activity : {},
    rehearsals: restoreRehearsals(raw.rehearsals),
    personalPhrases: restorePersonalPhrases(raw.personalPhrases),
    settings: { ...base.settings, ...Object.fromEntries(['pinyin', 'english', 'traditional', 'slow'].filter(k => typeof raw.settings?.[k] === 'boolean').map(k => [k, raw.settings[k]])), goal: [3, 6, 10].includes(raw.settings?.goal) ? raw.settings.goal : 6 },
    lastScene: typeof raw.lastScene === 'string' ? raw.lastScene : base.lastScene
  };
}
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function dueIds(state, now = Date.now()) {
  return Object.entries(state.reviews).filter(([, value]) => value && Number.isFinite(value.due) && value.due <= now).sort((a, b) => a[1].due - b[1].due).map(([id]) => id);
}
export function scheduleReview(previous, rating, now = Date.now()) {
  const interval = rating === 'again' ? 0 : rating === 'hard' ? 1 : rating === 'good' ? Math.max(2, Math.round((previous?.interval || 1) * 2)) : Math.max(4, Math.round((previous?.interval || 1) * 3));
  return { interval, due: now + (rating === 'again' ? 10 * 60 * 1000 : interval * 86400000), repetitions: (previous?.repetitions || 0) + 1, lastRating: rating };
}
export function logPractice(state, id, rating, now = Date.now()) {
  state.reviews[id] = scheduleReview(state.reviews[id], rating, now);
  const key = dateKey(new Date(now));
  state.activity[key] = [...new Set([...(Array.isArray(state.activity[key]) ? state.activity[key] : []), id])];
  return state;
}
export function streak(state, today = new Date()) {
  const cursor = new Date(today); cursor.setHours(12, 0, 0, 0);
  if (!state.activity[dateKey(cursor)]?.length) cursor.setDate(cursor.getDate() - 1);
  let days = 0;
  while (state.activity[dateKey(cursor)]?.length) { days++; cursor.setDate(cursor.getDate() - 1); }
  return days;
}
