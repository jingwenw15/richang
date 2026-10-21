import { scenarios, phrases, phraseById, pinyinGuide } from './content.js';
import { hydrate, dateKey, dueIds, logPractice, streak } from './model.js';
import { rehearsalExamples, suggestRehearsalTopic, createOfflinePreparation, offlineRehearsalReply, makeRehearsal, rehearsalPhrases, completeRehearsal, retryRehearsal, validatePreparation, validateRehearsalResponse } from './rehearsal.js';

const KEY = 'richang.v1';
let state;
try { state = hydrate(JSON.parse(localStorage.getItem(KEY))); } catch { state = hydrate(null); }
let page = 'today';
let filter = 'All situations';
let query = '';
let savedOnly = false;
let practice;
let listeningOffset = 0;
let recorder;
let stream;
let recordingTimer;
let audioUrl;
let nativeSpeech = false;
let rehearsalSelected = null;
let rehearsalDraft = { goal: '', audience: 'teammate', topic: '' };
let rehearsalBusy = false;
let rehearsalError = '';
let aiConnection = { provider: 'offline', openaiModel: 'gpt-4.1-mini', ollamaModel: '', hasKey: false, keyStored: false, configured: true };
let rehearsalAudio = { stream: null, recorder: null, blob: null, url: null, timer: null };
let rehearsalMediaToken = 0;
let connectionDraft = null;
let connectionMessage = '';
const root = document.querySelector('#app');
const dialog = document.querySelector('#practice-dialog');
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const chinese = p => state.settings.traditional ? p.traditional : p.zh;
const findPhrase = id => phraseById(id) || state.personalPhrases.find(p => p.id === id);
const allPhrases = () => [...phrases, ...state.personalPhrases];
const due = () => dueIds(state).filter(id => findPhrase(id));
const dueRehearsals = () => state.rehearsals.filter(s => s.phase === 'done' && Number.isFinite(s.revisitAt) && s.revisitAt <= Date.now());
const todayCount = () => state.activity[dateKey()]?.length || 0;
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { toast('Your device could not save progress. Check available storage.'); } };
const paths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  repeat: '<path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>',
  book: '<path d="M12 5v16M3 3c4-1 6 0 9 2 3-2 5-3 9-2v16c-4-1-6 0-9 2-3-2-5-3-9-2z"/>',
  chart: '<path d="M4 3v17h17M8 15l4-5 4 2 5-7"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  play: '<path d="m9 5 11 7-11 7z"/>',
  volume: '<path d="m11 4-6 5H2v6h3l6 5zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V4h8v3M3 12c5 4 13 4 18 0m-9 1v4"/>',
  message: '<path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a9 9 0 1 1 17-5Z"/><path d="M8 10h8m-8 4h5"/>',
  bowl: '<path d="M3 12h18a9 9 0 0 1-18 0ZM7 21h10M8 4v4m4-5v5m4-4v4"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h3m4 0h3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  cup: '<path d="M4 9h13v6a6.5 6.5 0 0 1-13 0Zm13 1h2a3 3 0 0 1 0 6h-2M7 3v2m4-2v2M3 22h16"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Zm6-3v15m6-12v15"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
  leaf: '<path d="M20 3c-13-2-21 13-9 16 8 2 10-7 9-16ZM5 21 16 9"/>',
  headphones: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
const pill = (text, cls = '') => `<span class="pill ${cls}">${text}</span>`;
function toast(message) {
  const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 4000);
}
function navButton(id, label, name, badge = '') {
  return `<button class="nav-item ${page === id ? 'active' : ''}" data-page="${id}" ${page === id ? 'aria-current="page"' : ''}>${icon(name)}<span>${label}</span>${badge ? `<span class="nav-badge">${badge}</span>` : ''}</button>`;
}
function render() {
  root.innerHTML = `<aside class="sidebar">
    <div class="window-drag"><span class="browser-dots"><i></i><i></i><i></i></span></div>
    <a href="#" class="brand" data-page="today"><span class="brand-mark">日常</span><span><strong>Richang</strong><small>Chinese for your everyday.</small></span></a>
    <div class="nav-label">YOUR PRACTICE</div>
    <nav aria-label="Main navigation">${navButton('today', 'Today', 'home')}${navButton('rehearsal', 'Rehearsal', 'mic')}${navButton('scenarios', 'Conversations', 'message')}${navButton('review', 'Review', 'repeat', (due().length + dueRehearsals().length) || '')}${navButton('library', 'Phrasebook', 'book')}${navButton('progress', 'Your progress', 'chart')}</nav>
    <div class="sidebar-note"><span class="mini-leaf">${icon('leaf')}</span><strong>A little, every day.</strong><p>You know more than you think.<br>Let’s put it into words.</p></div>
    <div class="sidebar-bottom">${navButton('settings', 'Preferences', 'settings')}<div class="profile"><span class="avatar">你</span><div><strong>Your Mandarin journey</strong><small>From familiar to fluent</small></div><span class="online-dot" title="Progress stored on this device"></span></div></div>
  </aside>
  <div class="main-shell"><header class="topbar"><span>${{ today: 'Your daily practice', rehearsal: 'Your words. Your next conversation.', scenarios: 'Real situations. Useful words.', review: 'Make it stick', library: 'Words to come back to', progress: 'Every conversation counts', settings: 'Make yourself at home' }[page]}</span><div>${pill('MANDARIN', 'language-pill')}<button class="pinyin-toggle ${state.settings.pinyin ? 'enabled' : ''}" data-action="pinyin" aria-pressed="${state.settings.pinyin}"><span>拼</span> Pinyin ${state.settings.pinyin ? 'on' : 'off'}</button></div></header>
  <main id="main" tabindex="-1">${({ today: todayPage, rehearsal: rehearsalPage, scenarios: scenariosPage, review: reviewPage, library: libraryPage, progress: progressPage, settings: settingsPage }[page])()}</main><footer class="app-footer"><span>日积月累 · A little practice goes a long way.</span><span>${icon('leaf')} Made for real life</span></footer></div>`;
  if (window.desktop) document.body.classList.add('desktop');
}

function todayPage() {
  const suggested = scenarios.find(s => !state.completed.includes(s.id)) || scenarios.find(s => s.id === state.lastScene) || scenarios[0];
  const explore = ['your-day', 'making-plans', 'clarify', 'interests'].map(id => scenarios.find(s => s.id === id)).filter(s => s && s.id !== suggested.id).slice(0, 3);
  const count = todayCount();
  return `<section class="page-heading"><div class="eyebrow">LET’S MAKE CHINESE PART OF YOUR DAY</div><h1>A little more fluent.<br>A little more you.</h1><p>Real conversations, one small practice at a time.</p></section>
  <section class="rehearsal-banner"><span class="scene-icon sage">${icon("mic")}</span><div><strong>Something you want to say?</strong><p>Prepare for a real conversation, then try it in your own words.</p></div><button class="button primary" data-page="rehearsal">Rehearse it ${icon("arrow")}</button></section>
  <div class="today-layout"><div class="today-primary"><section class="featured-card"><div class="featured-top"><span class="overline">${icon('spark')} TODAY’S CONVERSATION</span><span class="featured-time">${icon('clock')} ${suggested.time} min</span></div>
  <div class="featured-body"><div><span class="featured-category">${suggested.category}${suggested.category === "At work" ? " · Friendly & polite" : ""}</span><h2>${suggested.title}</h2><p>${suggested.description}</p><button class="button light" data-start="${suggested.id}">Let’s practice ${icon('arrow')}</button></div><div class="conversation-art" aria-hidden="true"><span class="art-orbit"></span><span class="art-bubble one">聊聊？<i></i></span><span class="art-bubble two">好啊！<i></i></span><span class="art-spark">✳</span><span class="art-caption">a conversation starts here</span></div></div>
  <div class="featured-bottom"><span>${icon('headphones')} Listen & repeat</span><span>${icon('message')} Try a conversation</span><span>${icon('check')} ${suggested.phrases.length} useful phrases</span></div></section>
  <section class="explore-section"><div class="section-heading"><h2>For the moments that matter</h2><button class="text-button" data-page="scenarios">Explore all ${icon('arrow')}</button></div><div class="scenario-grid compact">${explore.map(s => scenarioCard(s)).join('')}</div></section>
  <section class="daily-phrase"><div class="phrase-label">${icon('book')} A PHRASE TO TAKE WITH YOU ${pill('At work')}</div><div class="phrase-content"><div><h3 lang="zh-CN">${chinese(findPhrase('c3'))}</h3>${state.settings.pinyin ? `<p class="pinyin">${findPhrase('c3').pinyin}</p>` : ''}${state.settings.english ? `<p class="translation">${findPhrase('c3').en}</p>` : ''}</div><button class="round-button" data-speak="c3" aria-label="Listen to the daily phrase">${icon('volume')}</button></div><p class="phrase-tip">A small phrase that buys you time, checks your understanding, and keeps the conversation going.</p>${state.settings.pinyin ? pronunciationHelp(true) : ""}</section></div>
  <aside class="today-secondary"><section class="goal-card"><div class="section-heading"><h3>Your daily rhythm</h3>${icon('sun')}</div><div class="goal-ring"><span class="goal-number">${count}<small> / ${state.settings.goal}</small></span><span>phrases practiced</span></div><progress max="${state.settings.goal}" value="${Math.min(count, state.settings.goal)}" aria-label="Daily phrase goal"></progress><p>${count >= state.settings.goal ? 'You reached your goal. Nicely done.' : 'A few minutes now. More confidence later.'}</p><div class="goal-bottom"><span>${icon('spark')} <strong>${streak(state)} day${streak(state) === 1 ? '' : 's'}</strong> of momentum</span></div></section>
  <section class="review-nudge"><div class="nudge-icon">${icon('repeat')}</div><h3>${due().length ? 'A little refresher?' : 'Make the words yours.'}</h3><p>${due().length ? `${due().length} phrase${due().length === 1 ? ' is' : 's are'} ready for another look. Bring them back before they fade.` : 'Practice a conversation and your phrases will find their way here for review.'}</p><button class="button secondary" data-page="review">${due().length ? 'Review phrases' : 'Your review space'} ${icon('arrow')}</button></section>
  <section class="heritage-note"><span class="note-label">BUILT ON WHAT YOU KNOW</span><h3>From 家里 to everyday.</h3><p>You already have a feel for Chinese. We’ll help you find the words for work, friendships, and everything in between.</p><span class="note-decoration" aria-hidden="true">聊</span></section></aside></div>`;
}
function scenarioCard(s) {
  const completed = state.completed.includes(s.id);
  return `<button class="scenario-card" data-start="${s.id}"><span class="scene-icon ${s.color}">${icon(s.icon)}</span><span class="scene-category">${s.category}${completed ? ` · Practiced ${icon('check')}` : ''}</span><h3>${s.short}</h3><p>${s.description}</p><span class="scene-footer">${s.phrases.length} phrases <span>·</span> ${s.time} min ${icon('arrow')}</span></button>`;
}
function scenariosPage() {
  return `<section class="page-heading"><div class="eyebrow">CHINESE YOU’LL ACTUALLY USE</div><h1>Let’s talk about real life.</h1><p>Friendly, everyday Chinese for your team, your manager, and life outside work.</p></section>${categoryTabs()}<div class="scenario-grid full">${scenarios.filter(s => filter === 'All situations' || s.category === filter).map(scenarioCard).join('')}</div><div class="quiet-note">${icon('message')} Each conversation includes listening, speaking practice, and a guided roleplay.</div>`;
}
function categoryTabs() {
  return `<div class="filter-tabs" aria-label="Filter by situation">${['All situations', 'At work', 'Everyday life'].map(f => `<button class="${filter === f ? 'selected' : ''}" data-filter="${f}" aria-pressed="${filter === f}">${f}</button>`).join('')}</div>`;
}
function reviewPage() {
  const ids = due();
  const studied = Object.keys(state.reviews).filter(id => findPhrase(id));
  return `<section class="page-heading"><div class="eyebrow">FAMILIAR WORDS, STRONGER ROOTS</div><h1>Bring it back. Make it stick.</h1><p>A little recall today makes tomorrow’s conversation easier.</p></section><section class="review-hero"><span class="large-scene-icon sage">${icon('repeat')}</span><h2>${ids.length ? `${ids.length} phrases ready for you` : studied.length ? 'You’re all caught up.' : 'Your first words start here.'}</h2><p>${ids.length ? 'Think of how you’d say it. Reveal the phrase, listen, and rate how easily it came to you.' : studied.length ? 'Your next reviews will appear when they’re due. You can also practice your learned phrases anytime.' : 'Finish a conversation to start your personal review queue.'}</p>${ids.length ? '<button class="button primary" data-action="review-due">Start review '+icon('arrow')+'</button>' : studied.length ? '<button class="button primary" data-action="review-all">Practice learned phrases '+icon('arrow')+'</button>' : '<button class="button primary" data-page="scenarios">Find a conversation '+icon('arrow')+'</button>'}</section><div class="stat-grid"><div><strong>${studied.length}</strong><span>Phrases practiced</span></div><div><strong>${ids.length}</strong><span>Ready for review</span></div><div><strong>${studied.length - ids.length}</strong><span>Resting until next time</span></div></div>${studied.length ? `<section class="rehearsal-banner"><span class="scene-icon blue">${icon("headphones")}</span><div><strong>Understand it before you read it.</strong><p>Listen to up to ten learned phrases, with due phrases first. Reveal the text when you’re ready. Listening practice leaves your recall schedule unchanged.</p></div><button class="button secondary" data-action="listen-learned">Practice listening ${icon("arrow")}</button></section>` : ''}${rehearsalReviewSection()}${studied.length ? `<div class="section-heading"><h2>In your rotation</h2></div><div class="phrase-list">${studied.slice(0, 12).map(id => phraseRow(findPhrase(id), true)).join('')}</div>` : ''}`;
}
function phraseRow(p, withDue = false) {
  const isSaved = state.saved.includes(p.id);
  return `<article class="phrase-row"><div class="phrase-row-body"><span class="small-label">${escape(p.sceneTitle)} <span>· ${escape(p.register)}</span></span><h3 lang="zh-CN">${escape(chinese(p))}</h3>${state.settings.pinyin ? `<p class="pinyin">${escape(p.pinyin)}</p>` : ''}${state.settings.english ? `<p class="translation">${escape(p.en)}</p>` : ''}${withDue ? `<small class="next-review">${state.reviews[p.id].due <= Date.now() ? 'Ready to review' : 'Next review: ' + new Date(state.reviews[p.id].due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small>` : ''}</div><div class="phrase-actions"><button class="round-button" data-speak="${p.id}" aria-label="Listen: ${escape(p.en)}">${icon('volume')}</button><button class="round-button ${isSaved ? 'bookmarked' : ''}" data-save="${p.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? 'Unsave' : 'Save'}: ${escape(p.en)}">${icon('bookmark')}</button></div></article>`;
}
function filteredPhrases() {
  const search = query.toLowerCase().trim();
  return allPhrases().filter(p => (!savedOnly || state.saved.includes(p.id)) && (filter === 'All situations' || p.category === filter) && (!search || [p.zh, p.traditional, p.pinyin, p.en, p.sceneTitle].some(t => t.toLowerCase().includes(search))));
}
function libraryPage() {
  return `<section class="page-heading"><div class="eyebrow">YOUR POCKET CONVERSATION STARTERS</div><h1>Good words to have around.</h1><p>Find the phrase you need. Save the ones that sound like you.</p></section><div class="library-tools"><label class="search-field">${icon('search')}<input id="phrase-search" type="search" placeholder="Search in English, Chinese, or pinyin…" value="${escape(query)}" aria-label="Search phrases"></label><button class="button secondary ${savedOnly ? 'selected' : ''}" data-action="saved-only" aria-pressed="${savedOnly}">${icon('bookmark')} Saved (${state.saved.length})</button></div>${categoryTabs()}<div class="library-count" id="library-count">${filteredPhrases().length} phrases</div><div class="phrase-list" id="phrase-results">${phraseResults()}</div>`;
}
function phraseResults() {
  const list = filteredPhrases();
  return list.length ? list.map(p => phraseRow(p)).join('') : `<div class="empty-state">${icon('book')}<h3>${savedOnly ? 'Your collection is waiting.' : 'No phrases found.'}</h3><p>${savedOnly ? 'Save phrases with the bookmark button to keep them close.' : 'Try a different word or choose another situation.'}</p></div>`;
}
function progressPage() {
  const learned = Object.keys(state.reviews).filter(id => findPhrase(id)).length;
  const days = Object.keys(state.activity).filter(k => state.activity[k]?.length).length;
  return `<section class="page-heading"><div class="eyebrow">SMALL STEPS ARE STILL STEPS</div><h1>Look how far your words go.</h1><p>Your practice, at your pace. Every bit adds up.</p></section>${rehearsalProgressSection()}<div class="stat-grid four"><div><strong>${learned}<small> / ${allPhrases().length}</small></strong><span>Phrases practiced</span></div><div><strong>${state.completed.length}<small> / ${scenarios.length}</small></strong><span>Conversations completed</span></div><div><strong>${streak(state)}</strong><span>Day streak</span></div><div><strong>${days}</strong><span>Days you showed up</span></div></div><section class="activity-card"><div class="section-heading"><h2>Your last two weeks</h2><span class="muted">Unique phrases per day</span></div><div class="activity-bars">${Array.from({ length: 14 }, (_, i) => { const date = new Date(); date.setDate(date.getDate() - 13 + i); const count = state.activity[dateKey(date)]?.length || 0; return `<div class="activity-day"><span>${count || ''}</span><div class="bar-track" role="img" aria-label="${date.toLocaleDateString()}: ${count} phrases"><div class="bar-fill level-${Math.min(10, Math.ceil(count / Math.max(state.settings.goal, ...Object.values(state.activity).map(a => a.length || 0)) * 10))}"></div></div><small>${date.toLocaleDateString(undefined, { weekday: 'narrow' })}</small></div>`; }).join('')}</div></section><div class="section-heading"><h2>Your conversations</h2></div><div class="progress-list">${scenarios.map(s => { const n = s.phrases.filter(p => state.reviews[p.id]).length; return `<button class="progress-scene" data-start="${s.id}"><span class="scene-icon ${s.color}">${icon(s.icon)}</span><div><strong>${s.short}</strong><small>${n} of ${s.phrases.length} phrases practiced</small><progress max="${s.phrases.length}" value="${n}"></progress></div>${state.completed.includes(s.id) ? `<span class="completed-label">${icon('check')} Completed</span>` : icon('arrow')}</button>`; }).join('')}</div>`;
}
function settingsPage() {
  return `<section class="page-heading"><div class="eyebrow">YOUR WORDS, YOUR WAY</div><h1>Make yourself at home.</h1><p>A few small adjustments for the way you like to learn.</p></section><section class="settings-card"><h2>Reading & listening</h2>${settingRow('Show pinyin', 'A little help with sounds and tones.', 'pinyin')}${settingRow('Show English translations', 'Keep meaning close while you learn.', 'english')}${settingRow('Traditional characters', 'Switch between 简体 and 繁體 Chinese.', 'traditional')}${settingRow('Slower listening', 'Give yourself time to catch each word.', 'slow')}<div class="setting-row"><div><h3>Daily phrase goal</h3><p>Choose something that fits your day.</p></div><select id="daily-goal" aria-label="Daily phrase goal">${[3, 6, 10].map(n => `<option value="${n}" ${state.settings.goal === n ? 'selected' : ''}>${n} phrases</option>`).join('')}</select></div>${pronunciationHelp()}</section>${connectionSettings()}<section class="settings-card"><h2>Your data stays here</h2><p>Progress, personal goals, and transcripts are stored on this device. Recordings are temporary. Offline lessons need no account. Connected rehearsal sends your goal and replies to your selected AI provider; audio is sent only when you choose transcription.</p><div class="settings-actions"><button class="button secondary" data-action="export">Export progress</button><button class="text-button danger" data-action="reset">Reset progress</button></div><div id="reset-confirm"></div></section><p class="quiet-note">${icon('headphones')} Audio uses an installed Mandarin voice. On Mac, add one in System Settings → Accessibility → Spoken Content (or Read & Speak).</p>`;
}
function settingRow(title, description, key) {
  return `<div class="setting-row"><div><h3>${title}</h3><p>${description}</p></div><button class="toggle ${state.settings[key] ? 'on' : ''}" role="switch" aria-checked="${state.settings[key]}" aria-label="${title}" data-setting="${key}"><span></span></button></div>`;
}
function pronunciationHelp(daily = false) {
  return `<details class="pronunciation-help"><summary>${daily ? 'Why yí in 一下?' : 'How to read the tone marks'}</summary><p>${escape(pinyinGuide.yi)}</p>${daily ? '' : `<p>${escape(pinyinGuide.bu)}</p><p>${escape(pinyinGuide.third)}</p><p>${escape(pinyinGuide.neutral)}</p>`}</details>`;
}

function startScene(id) {
  stopRecording();
  const scene = scenarios.find(s => s.id === id);
  if (!scene) return;
  practice = { type: 'lesson', scene, index: 0, phase: 'learn', answered: false, selected: null, rated: false, correct: 0, mistakes: new Set() };
  state.lastScene = id; save(); showPractice(); if (!dialog.open) dialog.showModal();
}
function startReview(ids, listening = false) {
  ids = ids.filter(id => findPhrase(id));
  if (!ids.length) return;
  practice = { type: 'review', ids, index: 0, phase: 'review', revealed: false, listening };
  showPractice(); if (!dialog.open) dialog.showModal();
}
function listeningQueue() {
  const priority = due().slice(0, 10);
  const dueSet = new Set(due());
  const resting = Object.keys(state.reviews).filter(id => findPhrase(id) && !dueSet.has(id));
  if (!resting.length) return priority;
  const start = listeningOffset % resting.length;
  const extra = [...resting.slice(start), ...resting.slice(0, start)].slice(0, 10 - priority.length);
  listeningOffset = (start + extra.length) % resting.length;
  return [...priority, ...extra];
}
function practiceChrome(body, eyebrow, title, step, total) {
  return `<div class="practice-header"><span class="overline">${eyebrow}</span><button class="round-button" data-action="close-practice" aria-label="Close practice">${icon('close')}</button></div><progress class="session-progress" value="${step}" max="${total}" aria-label="Session progress"></progress><div class="practice-title"><span class="small-label">${practice.type === 'lesson' ? practice.scene.category : 'YOUR REVIEW'}</span><h2>${title}</h2></div>${body}`;
}
function showPractice() {
  window.speechSynthesis?.cancel(); window.desktop?.stopSpeech();
  releaseAudio();
  if (practice.phase === 'done') {
    const lesson = practice.type === 'lesson';
    dialog.innerHTML = `<div class="practice-header"><span class="overline">A LITTLE MORE CONFIDENT</span><button class="round-button" data-action="close-practice" aria-label="Close practice">${icon('close')}</button></div><div class="session-done"><span class="done-icon">${icon('check')}</span><h2>These words are yours to try.</h2><p>${lesson ? `You practiced ${practice.scene.phrases.length} phrases and completed a short conversation.` : `${practice.listening ? 'You listened to' : 'You reviewed'} ${practice.ids.length} phrase${practice.ids.length === 1 ? '' : 's'}. ${practice.listening ? 'Your recall schedule is unchanged.' : 'They will return when it is time.'}`}</p>${lesson ? `<div class="session-summary">${practice.correct} of ${practice.scene.turns.length} replies chosen correctly on the first try</div>` : ''}<div class="takeaway"><span class="overline">TAKE IT INTO REAL LIFE</span><p>${lesson ? escape(practice.scene.phrases[0].en) : 'Try using one of these phrases in your next conversation.'}</p>${lesson ? `<strong lang="zh-CN">${chinese(practice.scene.phrases[0])}</strong>` : ''}</div><button class="button primary" data-action="close-practice">Back to your day ${icon('arrow')}</button></div>`; render(); return;
  }
  if (practice.type === 'review') {
    const p = findPhrase(practice.ids[practice.index]);
    if (practice.listening) {
      dialog.innerHTML = practiceChrome(`<div class="review-prompt"><span class="overline">WHAT DID YOU HEAR?</span><h3>Listen before you look.</h3><p>Say what you understood, then reveal and compare.</p></div>${!practice.revealed ? `<div class="learning-controls"><button class="button secondary" data-speak="${p.id}">${icon('volume')} Listen to phrase</button><button class="text-button" data-slow="${p.id}">${icon('headphones')} Slower</button></div>` : ''}${practice.revealed ? `${learningPhrase(p)}<div class="usage-note"><p>${escape(p.note)}</p></div><button class="button primary wide" data-action="next-listening">${practice.index === practice.ids.length - 1 ? 'Finish listening' : 'Next listening phrase'} ${icon('arrow')}</button>` : '<div class="recall-space">Try listening at normal speed first. Use Slower if you need another pass.<br>Audio unavailable? You can still reveal the phrase.</div><button class="button primary wide" data-action="reveal">Reveal phrase & meaning</button>'}`, 'LISTENING PRACTICE', 'Train your ear for everyday Chinese.', practice.index, practice.ids.length); return;
    }
    dialog.innerHTML = practiceChrome(`<div class="review-prompt"><span class="overline">HOW WOULD YOU SAY…</span><h3>${escape(p.en)}</h3><span class="small-label">${escape(p.sceneTitle)}</span></div>${practice.revealed ? `${learningPhrase(p)}<p class="self-rating">How easily did it come to you?</p>${ratingButtons()}` : `<div class="recall-space">Say it out loud, or think it through.<br>It doesn’t have to be perfect.</div><button class="button primary wide" data-action="reveal">Reveal phrase ${icon('arrow')}</button>`}`, 'RECALL & REPEAT', 'A familiar phrase, a fresh try.', practice.index, practice.ids.length); return;
  }
  const s = practice.scene;
  if (practice.phase === 'learn') {
    const p = s.phrases[practice.index];
    dialog.innerHTML = practiceChrome(`<div class="lesson-position"><span>PHRASE ${practice.index + 1} OF ${s.phrases.length}</span>${pill(p.register)}</div>${learningPhrase(p)}<div class="usage-note">${icon('spark')}<div><strong>Make it sound natural</strong><p>${escape(p.note)}</p></div></div><div class="speaking-strip"><div><strong>Now give it a try.</strong><p>Listen, repeat, and hear yourself back.</p></div><button class="button secondary" data-action="record">${icon('mic')} Record yourself</button></div><div id="recording-output" aria-live="polite"></div><div class="lesson-bottom"><button class="text-button" data-action="previous" ${practice.index === 0 ? 'disabled' : ''}>Previous</button><span>Say it once before you move on.</span><button class="button primary" data-action="next-phrase">${practice.index === s.phrases.length - 1 ? 'Try the conversation' : 'Next phrase'} ${icon('arrow')}</button></div>`, 'LISTEN · SAY IT · MAKE IT YOURS', s.short, practice.index, s.phrases.length + s.turns.length);
  } else {
    const turn = s.turns[practice.index];
    dialog.innerHTML = practiceChrome(`<div class="roleplay-context">${icon('message')}<p>${s.situation}</p></div><div class="partner-label">${s.category === 'At work' ? 'YOUR COWORKER' : 'THE OTHER PERSON'} <button class="text-button" data-action="speak-turn" aria-label="Listen to the conversation prompt">${icon('volume')}</button></div><div class="partner-bubble"><h3 lang="zh-CN">${chinese(turn)}</h3>${state.settings.pinyin ? `<p class="pinyin">${turn.pinyin}</p>` : ''}${state.settings.english ? `<p class="translation">${turn.en}</p>` : ''}</div><p class="turn-goal">${escape(turn.goal)}</p><div class="response-label">Which reply fits best? <span>Turn ${practice.index + 1} of ${s.turns.length}</span></div><div class="response-options">${turn.options.map((id, i) => { const p = findPhrase(id); return `<button class="response-option ${practice.selected === id ? (id === turn.correct ? 'correct' : 'incorrect') : ''}" data-reply="${id}" ${practice.answered ? 'disabled' : ''}><span class="option-letter">${String.fromCharCode(65 + i)}</span><span><strong lang="zh-CN">${escape(chinese(p))}</strong>${state.settings.pinyin ? `<small class="pinyin">${escape(p.pinyin)}</small>` : ''}${state.settings.english ? `<small>${escape(p.en)}</small>` : ''}</span>${practice.selected === id ? icon(id === turn.correct ? 'check' : 'repeat') : ''}</button>`; }).join('')}</div>${practice.selected ? `<div class="reply-feedback ${practice.answered ? 'success' : ''}" role="status"><strong>${practice.answered ? 'That fits. Say it out loud, too.' : 'A useful phrase, but try a different reply here.'}</strong><p>${practice.answered ? turn.why : 'Think about what they are asking for in this moment.'}</p></div>` : ''}${practice.answered ? `<button class="button primary wide" data-action="next-turn">${practice.index === s.turns.length - 1 ? 'Finish conversation' : 'Keep the conversation going'} ${icon('arrow')}</button>` : ''}`, 'YOUR TURN TO TALK', s.short, s.phrases.length + practice.index, s.phrases.length + s.turns.length);
  }
}
function learningPhrase(p) {
  return `<div class="learning-phrase"><h3 lang="zh-CN">${escape(chinese(p))}</h3>${state.settings.pinyin ? `<p class="pinyin">${escape(p.pinyin)}</p>` : ''}${state.settings.english ? `<p class="translation">${escape(p.en)}</p>` : ''}<div class="learning-controls"><button class="button secondary" data-speak="${p.id}">${icon('volume')} Listen</button><button class="text-button" data-slow="${p.id}">${icon('headphones')} Slower</button><button class="round-button ${state.saved.includes(p.id) ? 'bookmarked' : ''}" data-save="${p.id}" aria-pressed="${state.saved.includes(p.id)}" aria-label="Save phrase">${icon('bookmark')}</button></div></div>`;
}
function ratingButtons() {
  return `<div class="rating-buttons">${[['again', 'Again', '10 min'], ['hard', 'Hard', '1 day'], ['good', 'Got it', '2+ days'], ['easy', 'Easy', '4+ days']].map(([rating, label, when]) => `<button data-rating="${rating}"><strong>${label}</strong><small>${when}</small></button>`).join('')}</div>`;
}
function closePractice() {
  stopRecording(); releaseAudio(); window.speechSynthesis?.cancel(); window.desktop?.stopSpeech();
  if (dialog.open) dialog.close(); practice = null; render();
}
function releaseAudio() { if (audioUrl) { URL.revokeObjectURL(audioUrl); audioUrl = null; } }
function stopRecording() {
  clearTimeout(recordingTimer);
  if (recorder?.state === 'recording') recorder.stop();
  stream?.getTracks().forEach(t => t.stop()); stream = null;
}
async function record() {
  if (recorder?.state === 'recording') { stopRecording(); return; }
  const currentPractice = practice;
  const currentIndex = practice.index;
  const button = dialog.querySelector('[data-action="record"]');
  button.disabled = true;
  try {
    window.speechSynthesis?.cancel(); window.desktop?.stopSpeech();
    const captured = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    if (practice !== currentPractice || practice.index !== currentIndex || practice.phase !== 'learn' || !dialog.open) { captured.getTracks().forEach(t => t.stop()); return; }
    stream = captured;
    releaseAudio();
    const chunks = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      captured.getTracks().forEach(t => t.stop());
      if (practice !== currentPractice || practice.index !== currentIndex || practice.phase !== 'learn' || !dialog.open) return;
      audioUrl = URL.createObjectURL(new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' }));
      const output = dialog.querySelector('#recording-output');
      output.innerHTML = '<div class="recording-playback"><span>Your recording · compare it with the example</span><audio controls></audio><small>This is self-listening practice; pronunciation is not scored.</small></div>';
      output.querySelector('audio').src = audioUrl;
      button.classList.remove('recording'); button.innerHTML = `${icon('mic')} Record again`; button.disabled = false;
    };
    recorder.start(); button.disabled = false; button.classList.add('recording'); button.innerHTML = `${icon('mic')} Stop recording`;
    dialog.querySelector('#recording-output').textContent = 'Recording… Speak naturally. Stops automatically after 30 seconds.';
    recordingTimer = setTimeout(stopRecording, 30000);
  } catch (error) {
    button.disabled = false;
    toast(error.name === 'NotAllowedError' ? 'Microphone access is off. Allow it in your device settings to record.' : 'Recording is unavailable here. You can still listen and repeat aloud.');
  }
}
async function speak(text, slow = state.settings.slow) {
  if (nativeSpeech && window.desktop) { if (await window.desktop.speak(text, slow)) return; }
  if (!window.speechSynthesis) { toast('Listening is unavailable on this device.'); return; }
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => /zh[-_]CN/i.test(v.lang)) || voices.find(v => /^zh/i.test(v.lang) && !/HK/i.test(v.lang));
  if (!voice) { toast('Add a Mandarin voice in your device’s speech settings to listen.'); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'zh-CN'; utterance.voice = voice; utterance.rate = slow ? 0.65 : 0.88;
  utterance.onerror = e => { if (!['interrupted', 'canceled'].includes(e.error)) toast('Audio could not play. Check your Mandarin voice settings.'); };
  speechSynthesis.speak(utterance);
}

const rehearsalAudience = value => ({ manager: 'My manager', teammate: 'A teammate', friend: 'A friend', family: 'Family' }[value] || 'Someone I know');
const rehearsalMode = value => ({ offline: 'Offline practice', openai: 'OpenAI', ollama: 'Local Ollama' }[value] || 'Offline practice');
const currentRehearsal = () => state.rehearsals.find(s => s.id === rehearsalSelected);
const rehearsalPrompt = session => session.turns.at(-1)?.result.next || session.plan.opening;
function rehearsalUtterance(utterance) {
  return `<div class="rehearsal-utterance"><h3 lang="zh-CN">${escape(chinese(utterance))}</h3>${state.settings.pinyin ? `<p class="pinyin">${escape(utterance.pinyin)}</p>` : ''}${state.settings.english ? `<p class="translation">${escape(utterance.en)}</p>` : ''}</div>`;
}
function rehearsalFeedback(result) {
  const labels = { understood: 'Meaning came through', partial: 'One part to clarify', 'try-again': 'Try another phrasing', compare: 'Self-review' };
  return `<div class="rehearsal-feedback ${result.feedback.status === 'understood' ? 'understood' : ''}"><span class="overline">${labels[result.feedback.status]}</span><p>${escape(result.feedback.message)}</p>${result.feedback.suggestion ? `<div class="rehearsal-suggestion"><span class="small-label">ONE NATURAL WAY TO SAY IT</span>${rehearsalUtterance(result.feedback.suggestion)}</div>` : ''}<p class="rehearsal-tip">${escape(result.feedback.tip)}</p></div>`;
}
function rehearsalHistoryCards(sessions = state.rehearsals.slice().reverse()) {
  return sessions.map(s => `<article class="rehearsal-history-card"><div><span class="small-label">${rehearsalAudience(s.audience)} · ${rehearsalMode(s.source)}${s.phase === 'done' ? ' · Completed' : ' · In progress'}</span><h3>${escape(s.plan.title)}</h3><p>${escape(s.goal)}</p>${s.phase === 'done' ? `<small>${s.realUsedAt ? 'You used this in real life.' : (s.revisitAt && s.revisitAt <= Date.now() ? 'Ready for another try' : 'Revisit ' + new Date(s.revisitAt || s.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))}</small>` : ''}</div><button class="button secondary" data-rresume="${s.id}" ${rehearsalBusy ? 'disabled' : ''}>${s.phase === 'done' ? 'See your practice' : 'Continue'} ${icon('arrow')}</button></article>`).join('');
}
function rehearsalPage() {
  const session = currentRehearsal();
  if (session) return rehearsalSessionPage(session);
  const topic = rehearsalDraft.topic || suggestRehearsalTopic(rehearsalDraft.goal);
  return `<section class="page-heading"><div class="eyebrow">MAKE ROOM FOR YOUR OWN WORDS</div><h1>What do you want to say?</h1><p>Bring a real conversation. Learn three useful expressions, then try it in your own words.</p></section>
  <div class="rehearsal-layout"><section class="rehearsal-compose"><label class="field-label" for="rehearsal-goal">The conversation I’m preparing for</label><textarea id="rehearsal-goal" maxlength="1000" rows="4" placeholder="For example: I want to tell my manager I’m waiting on a coworker before I can finish.">${escape(rehearsalDraft.goal)}</textarea><p class="field-help">English, Chinese, or a mix is fine. A little context helps.</p>
  <div class="rehearsal-form-row"><label class="field-label" for="rehearsal-audience">Who am I talking to?</label><select id="rehearsal-audience">${['teammate', 'manager', 'friend', 'family'].map(a => `<option value="${a}" ${rehearsalDraft.audience === a ? 'selected' : ''}>${rehearsalAudience(a)}</option>`).join('')}</select></div>
  <div class="rehearsal-mode-line">${pill(rehearsalMode(aiConnection.provider))}<button class="text-button" data-page="settings">Change connection ${icon('settings')}</button></div>
  ${aiConnection.provider === 'offline' ? `<label class="field-label" for="rehearsal-topic">Choose the closest practice topic</label><select id="rehearsal-topic"><option value="">Choose a topic…</option><option value="dependency" ${topic === 'dependency' ? 'selected' : ''}>Waiting on someone before you can finish</option>${scenarios.map(s => `<option value="${s.id}" ${topic === s.id ? 'selected' : ''}>${escape(s.short)}</option>`).join('')}</select><p class="field-help">Offline mode uses prepared lesson material for this topic and self-review. Connect AI for a conversation tailored to your exact goal.</p>` : `<p class="field-help">${aiConnection.provider === 'openai' ? 'Your goal and replies are sent to OpenAI when you prepare or submit. API usage is billed to your API account.' : 'Your goal and replies are sent to Ollama on this Mac. Use a locally installed model.'} Generated Chinese can contain mistakes; the original lessons remain available.</p>`}
  ${rehearsalError ? `<p class="rehearsal-error" role="alert">${escape(rehearsalError)}</p>` : ''}<button class="button primary wide" data-action="r-prepare" ${rehearsalBusy ? 'disabled' : ''}>${rehearsalBusy ? 'Preparing your rehearsal…' : 'Prepare my conversation'} ${icon('arrow')}</button><p class="field-help">Your goal and practice history are saved on this device.</p></section>
  <aside class="rehearsal-starters"><span class="overline">START WITH SOMETHING REAL</span>${rehearsalExamples.map((example, i) => `<button class="rehearsal-example" data-rexample="${i}" ${rehearsalBusy ? 'disabled' : ''}><span>${escape(example.goal)}</span>${icon('arrow')}</button>`).join('')}<div class="rehearsal-promise">${icon('leaf')}<p>You can know what you mean before you know every word. Use the Chinese you have, and fill in the gaps as you go.</p></div></aside></div>
  ${state.rehearsals.length ? `<section class="rehearsal-history"><div class="section-heading"><h2>Things you wanted to say</h2><span class="muted">${state.rehearsals.length} saved conversations</span></div>${rehearsalHistoryCards()}</section>` : ''}`;
}
function rehearsalSessionPage(s) {
  const context = `<button class="text-button" data-action="r-back">← All my rehearsals</button><section class="page-heading rehearsal-session-heading"><div class="eyebrow">${rehearsalMode(s.source).toUpperCase()} · ${rehearsalAudience(s.audience).toUpperCase()}</div><h1>${escape(s.plan.title)}</h1><p>${escape(s.goal)}</p></section><div class="rehearsal-steps" aria-label="Rehearsal steps"><span class="${s.phase === 'prep' ? 'current' : ''}">1 · Useful expressions</span><span class="${s.phase === 'talk' ? 'current' : ''}">2 · Your conversation</span><span class="${s.phase === 'done' ? 'current' : ''}">3 · Take it with you</span></div>`;
  if (s.phase === 'prep') return context + `<section class="rehearsal-context"><p>${escape(s.plan.situation)}</p><p class="field-help">${s.source === 'offline' ? 'This is a prepared example for your selected topic. You can adapt the details as you speak.' : 'These are suggested expressions. You can answer in other ways, too.'}</p></section><div class="rehearsal-expression-list">${rehearsalPhrases(s).map((p, i) => `<article class="rehearsal-expression"><span class="expression-number">0${i + 1}</span><div>${rehearsalUtterance(p)}<p class="rehearsal-tip">${escape(p.note)}</p></div><div class="phrase-actions"><button class="round-button" data-speak="${p.id}" aria-label="Listen to expression ${i + 1}">${icon('volume')}</button><button class="round-button ${state.saved.includes(p.id) ? 'bookmarked' : ''}" data-save="${p.id}" aria-pressed="${state.saved.includes(p.id)}" aria-label="Save expression ${i + 1}">${icon('bookmark')}</button></div></article>`).join('')}</div><button class="button primary" data-action="r-begin">Try the conversation ${icon('arrow')}</button><p class="field-help">About 90 seconds · three replies · hints available if you get stuck</p>`;
  if (s.phase === 'done') {
    const clear = s.turns.filter(t => t.result.goalMet).length;
    const focus = s.turns.find(t => !t.result.goalMet) || s.turns.at(-1);
    return context + `<section class="rehearsal-done"><span class="done-icon">${icon('check')}</span><h2>You found a way to say it.</h2><p>${s.source === 'offline' ? 'Three replies practiced with self-review. Read your answers alongside the examples and notice what you want to try next.' : `Three replies practiced. The AI marked ${clear} of three speaking goals as conveyed. These judgments can be imperfect; use the suggestions as a guide.`}</p><div class="partner-bubble rehearsal-closing"><span class="small-label">YOUR PARTNER</span>${rehearsalUtterance(s.turns.at(-1).result.next)}<button class="text-button" data-action="r-listen">${icon("volume")} Listen</button></div><div class="rehearsal-takeaway"><span class="overline">ONE THING TO TAKE WITH YOU</span><p>${escape(focus.result.feedback.tip)}</p>${focus.result.feedback.suggestion ? rehearsalUtterance(focus.result.feedback.suggestion) : ''}</div><div class="rehearsal-done-actions"><button class="button primary" data-action="r-retry">Try again without prep ${icon('repeat')}</button><button class="button secondary" data-action="r-review">Review the expressions ${icon('book')}</button></div><p class="field-help">This conversation will return for another try tomorrow.</p><button class="text-button" data-action="r-used">${icon('check')} ${s.realUsedAt ? 'Used in a real conversation' : 'I used this in a real conversation'}</button></section>
    <section class="rehearsal-reflection"><label class="field-label" for="rehearsal-reflection">A note for next time</label><textarea id="rehearsal-reflection" maxlength="1000" rows="2" placeholder="What felt easier? What did you want a word for?">${escape(s.reflection || '')}</textarea></section><details class="rehearsal-transcript"><summary>Your conversation & feedback</summary>${s.turns.map(t => `<article><span class="small-label">THE OTHER PERSON</span>${rehearsalUtterance(t.prompt)}<span class="small-label">YOU</span><p class="rehearsal-answer">${escape(t.answer)}</p>${rehearsalFeedback(t.result)}</article>`).join('')}</details>`;
  }
  const prompt = rehearsalPrompt(s);
  const last = s.turns.at(-1);
  return context + `<div class="rehearsal-talk-layout"><div><div class="rehearsal-turn-label"><span class="overline">REPLY ${s.turns.length + 1} OF 3</span><button class="text-button" data-action="r-listen">${icon('volume')} Listen</button></div><div class="partner-bubble">${rehearsalUtterance(prompt)}</div><p class="turn-goal">${escape(s.plan.goals[s.turns.length])}</p>
  <label class="field-label" for="rehearsal-answer">Your reply, in your own words</label><textarea id="rehearsal-answer" maxlength="2000" rows="4" placeholder="Speak, type, or use macOS Dictation. An English word is okay when you’re stuck." ${rehearsalBusy ? 'disabled' : ''}>${escape(s.draft || '')}</textarea><div class="rehearsal-input-actions"><button class="button secondary" data-action="r-record" ${rehearsalBusy ? 'disabled' : ''}>${icon('mic')} ${rehearsalAudio.recorder?.state === 'recording' ? 'Stop recording' : 'Record my reply'}</button><span class="field-help">Recording stays here until you choose transcription.</span></div><div id="rehearsal-audio-output">${rehearsalAudio.url ? rehearsalAudioHTML() : ''}</div><p class="field-help">${s.source === 'offline' ? 'Offline mode offers a reference response for comparison. It does not grade your answer.' : 'Feedback checks the text you submit for meaning and natural phrasing. It does not score pronunciation. Check an automatic transcript before submitting.'}</p>${rehearsalError ? `<p class="rehearsal-error" role="alert">${escape(rehearsalError)}</p>` : ''}<button class="button primary wide" data-action="r-send" ${rehearsalBusy ? 'disabled' : ''}>${rehearsalBusy ? 'Your partner is thinking…' : (s.turns.length === 2 ? 'Get feedback & finish' : 'Send my reply')} ${icon('arrow')}</button>
  <details class="rehearsal-hint"><summary>Give me a phrase to start with</summary>${rehearsalUtterance(s.plan.expressions[s.turns.length])}<p class="rehearsal-tip">${escape(s.plan.expressions[s.turns.length].note)}</p></details></div><aside>${last ? `<span class="overline">YOUR LAST REPLY</span><p class="rehearsal-answer">${escape(last.answer)}</p>${rehearsalFeedback(last.result)}<button class="text-button" data-action="r-redo" ${rehearsalBusy ? 'disabled' : ''}>Try that reply again ${icon('repeat')}</button>` : `<div class="rehearsal-promise">${icon('message')}<p>You don’t need the exact sample sentence. Get your meaning across, and keep the conversation moving.</p></div>`}</aside></div>`;
}
function rehearsalAudioHTML() {
  return `<div class="recording-playback"><span>Your reply · listen back before submitting</span><audio src="${escape(rehearsalAudio.url)}" controls></audio>${aiConnection.provider === 'openai' && aiConnection.hasKey ? '<button class="button secondary" data-action="r-transcribe">Transcribe with OpenAI</button><small>This sends this recording to OpenAI. Review and edit the transcript before you submit your reply.</small>' : '<small>Type what you said, or use macOS Dictation in the reply field. OpenAI mode also offers audio transcription.</small>'}</div>`;
}
function rehearsalReviewSection() {
  const sessions = dueRehearsals();
  return sessions.length ? `<section class="rehearsal-history"><div class="section-heading"><h2>Try these conversations again</h2><span class="muted">${sessions.length} ready</span></div>${rehearsalHistoryCards(sessions)}</section>` : '';
}
function rehearsalProgressSection() {
  if (!state.rehearsals.length) return '';
  const completed = state.rehearsals.filter(s => s.phase === 'done').length;
  const used = state.rehearsals.filter(s => Number.isFinite(s.realUsedAt)).length;
  return `<section class="rehearsal-progress"><div><strong>${completed}</strong><span>Personal conversations rehearsed</span></div><div><strong>${used}</strong><span>You used in real life</span></div><button class="text-button" data-page="rehearsal">Keep finding your words ${icon('arrow')}</button></section>`;
}
function connectionSettings() {
  const c = connectionDraft || { ...aiConnection, apiKey: '', rememberKey: aiConnection.keyStored };
  return `<section class="settings-card"><h2>AI connection for rehearsal</h2><p>Offline practice is always available. A connected model can prepare your exact conversation and respond to your own answers.</p><label class="field-label" for="ai-provider">Practice mode</label><select id="ai-provider">${['offline', 'openai', 'ollama'].map(provider => `<option value="${provider}" ${c.provider === provider ? 'selected' : ''}>${rehearsalMode(provider)}</option>`).join('')}</select>
  ${c.provider === 'openai' ? `<label class="field-label" for="ai-key">OpenAI API key</label><input id="ai-key" type="password" autocomplete="off" spellcheck="false" placeholder="${aiConnection.hasKey ? 'A key is already set; leave blank to keep it' : 'Enter your API key'}"><label class="field-label" for="ai-openai-model">Conversation model</label><input id="ai-openai-model" value="${escape(c.openaiModel)}" maxlength="120"><label class="remember-key"><input id="ai-remember" type="checkbox" ${c.rememberKey ? 'checked' : ''}> Remember key securely on this Mac</label><p class="field-help">Unchecked: the key is held only until you quit the app. Checked: encrypted with macOS-protected storage. Keys are never included in progress exports. Use a key from your OpenAI API account; API usage is billed to that account.</p>` : ''}
  ${c.provider === 'ollama' ? `<label class="field-label" for="ai-ollama-model">Installed local model</label><input id="ai-ollama-model" value="${escape(c.ollamaModel)}" maxlength="120" placeholder="A model name from ollama list"><p class="field-help">Connects only to http://127.0.0.1:11434. Start Ollama and install a Mandarin-capable model first. Local mode does not include transcription; type or use macOS Dictation.</p>` : ''}
  ${window.desktop?.ai ? `<div class="settings-actions"><button class="button primary" data-action="r-save-connection" ${rehearsalBusy ? 'disabled' : ''}>${rehearsalBusy ? 'Working…' : 'Save connection'}</button><button class="button secondary" data-action="r-check-connection" ${rehearsalBusy ? 'disabled' : ''}>Check saved connection</button>${aiConnection.hasKey ? '<button class="text-button danger" data-action="r-forget-key">Forget API key</button>' : ''}</div>` : '<p class="field-help">AI connections are available in the Electron desktop app. This browser preview supports offline rehearsal.</p>'}
  <p id="connection-status" class="field-help" role="status">${escape(connectionMessage || `${rehearsalMode(aiConnection.provider)} is selected.${aiConnection.hasKey && !aiConnection.keyStored ? ' Your key lasts for this app session.' : ''}`)}</p></section>`;
}
async function rehearsalApi(action, ...args) {
  if (!window.desktop?.ai?.[action]) throw new Error('Open the Electron desktop app to connect AI. Offline practice works here too.');
  const response = await window.desktop.ai[action](...args);
  if (!response?.ok) throw new Error(response?.error || 'The AI request failed. Try again.');
  return response.data;
}
async function prepareRehearsal() {
  if (rehearsalBusy) return;
  const goal = rehearsalDraft.goal.trim();
  if (goal.length < 5 || goal.length > 1000) { rehearsalError = 'Describe what you want to say in a little more detail (5–1000 characters).'; render(); return; }
  const snapshot = state;
  const input = { ...rehearsalDraft, goal };
  const provider = aiConnection.provider;
  rehearsalBusy = true; rehearsalError = ''; render();
  try {
    const topic = input.topic || suggestRehearsalTopic(goal);
    const result = provider === 'offline' ? { plan: createOfflinePreparation(topic), provider: 'offline' } : await rehearsalApi('prepare', { goal, audience: input.audience });
    validatePreparation(result.plan);
    if (snapshot !== state) return;
    const session = makeRehearsal({ goal, audience: input.audience, source: result.provider, topic, plan: result.plan });
    state.rehearsals = [...state.rehearsals, session];
    state.personalPhrases.push(...rehearsalPhrases(session));
    rehearsalSelected = session.id; save();
  } catch (error) { rehearsalError = error.message; }
  finally { rehearsalBusy = false; render(); }
}
async function submitRehearsalReply() {
  const session = currentRehearsal();
  if (!session || session.phase !== 'talk' || rehearsalBusy || session.turns.length >= 3) return;
  const answer = (session.draft || '').trim();
  if (!answer || answer.length > 2000) { rehearsalError = 'Say or type a reply first. You can use an English word when you get stuck.'; render(); return; }
  disposeRehearsalAudio();
  const index = session.turns.length;
  const prompt = rehearsalPrompt(session);
  rehearsalBusy = true; rehearsalError = ''; render();
  try {
    const result = session.source === 'offline' ? offlineRehearsalReply(session, answer) : await rehearsalApi('reply', session, answer);
    validateRehearsalResponse(result);
    if (!state.rehearsals.includes(session) || session.turns.length !== index) return;
    session.turns.push({ prompt, answer, result }); session.draft = '';
    if (session.turns.length === 3) completeRehearsal(session);
    save();
  } catch (error) { rehearsalError = error.message; }
  finally { rehearsalBusy = false; render(); }
}
function disposeRehearsalAudio() {
  rehearsalMediaToken++;
  clearTimeout(rehearsalAudio.timer);
  if (rehearsalAudio.recorder?.state === 'recording') rehearsalAudio.recorder.stop();
  rehearsalAudio.stream?.getTracks().forEach(track => track.stop());
  if (rehearsalAudio.url) URL.revokeObjectURL(rehearsalAudio.url);
  rehearsalAudio = { stream: null, recorder: null, blob: null, url: null, timer: null };
}
async function recordRehearsalReply() {
  if (rehearsalAudio.recorder?.state === 'recording') { clearTimeout(rehearsalAudio.timer); rehearsalAudio.recorder.stop(); return; }
  const session = currentRehearsal();
  if (!session || session.phase !== 'talk') return;
  disposeRehearsalAudio(); window.speechSynthesis?.cancel(); window.desktop?.stopSpeech();
  const token = rehearsalMediaToken;
  const index = session.turns.length;
  const recordButton = document.querySelector('[data-action="r-record"]');
  if (recordButton) recordButton.disabled = true;
  try {
    const captured = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    if (token !== rehearsalMediaToken || currentRehearsal() !== session || page !== 'rehearsal' || session.turns.length !== index) { captured.getTracks().forEach(track => track.stop()); return; }
    const chunks = [];
    rehearsalAudio.stream = captured;
    const recording = new MediaRecorder(captured);
    const recordingState = rehearsalAudio;
    rehearsalAudio.recorder = recording;
    recording.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recording.onstop = () => {
      captured.getTracks().forEach(track => track.stop()); clearTimeout(recordingState.timer);
      if (token !== rehearsalMediaToken || currentRehearsal() !== session || page !== 'rehearsal' || session.turns.length !== index) return;
      if (chunks.length) { rehearsalAudio.blob = new Blob(chunks, { type: chunks[0].type }); rehearsalAudio.url = URL.createObjectURL(rehearsalAudio.blob); }
      render();
    };
    recording.start(); rehearsalAudio.timer = setTimeout(() => { if (recording.state === 'recording') recording.stop(); }, 30000); render();
  } catch (error) {
    disposeRehearsalAudio();
    rehearsalError = error.name === 'NotAllowedError' ? 'Microphone access is off. Allow it in your device settings, or type your answer.' : 'Recording is unavailable here. You can type your answer or use macOS Dictation.';
    render();
  }
}
async function handleRehearsalClick(button) {
  if (button.dataset.rexample !== undefined) {
    if (rehearsalBusy) return true;
    rehearsalDraft = { ...rehearsalExamples[Number(button.dataset.rexample)] }; rehearsalError = ''; render(); return true;
  }
  if (button.dataset.rresume) {
    if (rehearsalBusy) return true;
    disposeRehearsalAudio(); rehearsalSelected = button.dataset.rresume; page = 'rehearsal'; rehearsalError = ''; render(); return true;
  }
  const action = button.dataset.action;
  if (!action?.startsWith('r-')) return false;
  if (rehearsalBusy) return true;
  const session = currentRehearsal();
  switch (action) {
    case 'r-prepare': await prepareRehearsal(); break;
    case 'r-back': disposeRehearsalAudio(); rehearsalSelected = null; rehearsalError = ''; render(); break;
    case 'r-begin': if (session) { session.phase = 'talk'; save(); render(); } break;
    case 'r-send': await submitRehearsalReply(); break;
    case 'r-listen': if (session) await speak(chinese(rehearsalPrompt(session))); break;
    case 'r-record': await recordRehearsalReply(); break;
    case 'r-redo': if (session?.turns.length) { disposeRehearsalAudio(); const last = session.turns.pop(); session.draft = last.answer; rehearsalError = ''; save(); render(); } break;
    case 'r-retry': if (session) { disposeRehearsalAudio(); retryRehearsal(session); session.draft = ''; rehearsalError = ''; save(); render(); } break;
    case 'r-review': if (session) startReview(rehearsalPhrases(session).map(p => p.id)); break;
    case 'r-used': if (session) { session.realUsedAt = Date.now(); save(); render(); toast('A real conversation. That counts.'); } break;
    case 'r-transcribe': {
      if (!rehearsalAudio.blob || !session) break;
      const token = rehearsalMediaToken;
      const index = session.turns.length;
      rehearsalBusy = true; rehearsalError = ''; render();
      try {
        const bytes = new Uint8Array(await rehearsalAudio.blob.arrayBuffer());
        const text = await rehearsalApi('transcribe', bytes, rehearsalAudio.blob.type);
        if (token === rehearsalMediaToken && state.rehearsals.includes(session) && session.turns.length === index) { session.draft = text; save(); toast('Check the transcript before sending your reply.'); }
      } catch (error) { rehearsalError = error.message; }
      finally { rehearsalBusy = false; render(); } break;
    }
    case 'r-save-connection':
    case 'r-check-connection':
    case 'r-forget-key': {
      rehearsalBusy = true; render();
      try {
        const response = action === 'r-check-connection' ? await rehearsalApi('check') : await rehearsalApi('configure', action === 'r-forget-key' ? { ...aiConnection, provider: 'offline', forgetKey: true, rememberKey: false } : (connectionDraft || { ...aiConnection, rememberKey: aiConnection.keyStored }));
        aiConnection = response; connectionDraft = null;
        connectionMessage = response.message || (action === 'r-forget-key' ? 'API key removed. Offline practice is selected.' : 'Connection saved.');
      } catch (error) { connectionMessage = error.message; toast(error.message); }
      finally { rehearsalBusy = false; render(); }
      break;
    }
  }
  return true;
}

document.addEventListener('click', async event => {
  const button = event.target.closest('button, a[data-page]');
  if (!button || button.disabled) return;
  if (await handleRehearsalClick(button)) return;
  if (button.dataset.page) { event.preventDefault(); disposeRehearsalAudio(); rehearsalError = ''; page = button.dataset.page; render(); window.scrollTo(0, 0); return; }
  if (button.dataset.start) { startScene(button.dataset.start); return; }
  if (button.dataset.filter) { filter = button.dataset.filter; render(); return; }
  if (button.dataset.speak || button.dataset.slow) { const p = findPhrase(button.dataset.speak || button.dataset.slow); await speak(chinese(p), button.dataset.slow ? true : state.settings.slow); return; }
  if (button.dataset.save) {
    const id = button.dataset.save; const wasSaved = state.saved.includes(id);
    state.saved = wasSaved ? state.saved.filter(x => x !== id) : [...state.saved, id]; save();
    document.querySelectorAll(`[data-save="${id}"]`).forEach(el => { el.classList.toggle('bookmarked', !wasSaved); el.setAttribute('aria-pressed', String(!wasSaved)); });
    if (!dialog.open && page === 'library') render(); toast(wasSaved ? 'Removed from your saved phrases.' : 'Saved to your phrasebook.'); return;
  }
  if (button.dataset.setting) { const key = button.dataset.setting; state.settings[key] = !state.settings[key]; save(); render(); return; }
  if (button.dataset.reply && practice?.phase === 'roleplay' && !practice.answered) {
    const turn = practice.scene.turns[practice.index]; practice.selected = button.dataset.reply;
    if (practice.selected === turn.correct) { practice.answered = true; if (!practice.mistakes.has(practice.index)) practice.correct++; }
    else practice.mistakes.add(practice.index);
    showPractice(); return;
  }
  if (button.dataset.rating && practice?.type === 'review' && !practice.listening && practice.revealed) {
    logPractice(state, practice.ids[practice.index], button.dataset.rating); save();
    practice.index++; practice.revealed = false; if (practice.index >= practice.ids.length) practice.phase = 'done'; showPractice(); return;
  }
  switch (button.dataset.action) {
    case 'pinyin': state.settings.pinyin = !state.settings.pinyin; save(); render(); break;
    case 'saved-only': savedOnly = !savedOnly; render(); break;
    case 'review-due': startReview(due()); break;
    case 'review-all': startReview(Object.keys(state.reviews)); break;
    case 'listen-learned': startReview(listeningQueue(), true); break;
    case 'next-listening':
      if (practice?.type !== 'review' || !practice.listening || !practice.revealed || practice.phase === 'done') break;
      practice.index++; practice.revealed = false;
      if (practice.index >= practice.ids.length) practice.phase = 'done';
      showPractice(); break;
    case 'close-practice': closePractice(); break;
    case 'previous': stopRecording(); practice.index = Math.max(0, practice.index - 1); showPractice(); break;
    case 'next-phrase':
      stopRecording(); logPractice(state, practice.scene.phrases[practice.index].id, 'good'); save(); practice.index++;
      if (practice.index === practice.scene.phrases.length) { practice.phase = 'roleplay'; practice.index = 0; } showPractice(); break;
    case 'next-turn': practice.index++; practice.answered = false; practice.selected = null;
      if (practice.index === practice.scene.turns.length) { practice.phase = 'done'; state.completed = [...new Set([...state.completed, practice.scene.id])]; save(); } showPractice(); break;
    case 'speak-turn': await speak(chinese(practice.scene.turns[practice.index])); break;
    case 'reveal': practice.revealed = true; showPractice(); break;
    case 'record': await record(); break;
    case 'export': {
      const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = `richang-progress-${dateKey()}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Your progress export is ready.'); break;
    }
    case 'reset': document.querySelector('#reset-confirm').innerHTML = '<div class="reset-confirm"><p>Clear all practiced phrases, saved phrases, and preferences on this device?</p><button class="button secondary" data-action="cancel-reset">Keep my progress</button><button class="button danger-button" data-action="confirm-reset">Clear all progress</button></div>'; break;
    case 'cancel-reset': document.querySelector('#reset-confirm').innerHTML = ''; break;
    case 'confirm-reset': state = hydrate(null); save(); render(); toast('Progress cleared. A fresh start.'); break;
  }
});
document.addEventListener('input', event => {
  if (event.target.id === 'phrase-search') { query = event.target.value; document.querySelector('#phrase-results').innerHTML = phraseResults(); document.querySelector('#library-count').textContent = `${filteredPhrases().length} phrases`; }
  if (event.target.id === 'rehearsal-goal') rehearsalDraft.goal = event.target.value.slice(0, 1000);
  if (event.target.id === 'rehearsal-answer' && currentRehearsal()) { currentRehearsal().draft = event.target.value.slice(0, 2000); save(); }
  if (event.target.id === 'rehearsal-reflection' && currentRehearsal()) { currentRehearsal().reflection = event.target.value.slice(0, 1000); save(); }
  const connectionField = { 'ai-key': 'apiKey', 'ai-openai-model': 'openaiModel', 'ai-ollama-model': 'ollamaModel' }[event.target.id];
  if (connectionField) { connectionDraft ||= { ...aiConnection, apiKey: '', rememberKey: aiConnection.keyStored }; connectionDraft[connectionField] = event.target.value; }
});
document.addEventListener('change', event => {
  if (event.target.id === 'daily-goal') { state.settings.goal = Number(event.target.value); save(); render(); }
  if (event.target.id === 'rehearsal-audience') rehearsalDraft.audience = event.target.value;
  if (event.target.id === 'rehearsal-topic') rehearsalDraft.topic = event.target.value;
  if (event.target.id === 'ai-provider') { connectionDraft ||= { ...aiConnection, apiKey: '', rememberKey: aiConnection.keyStored }; connectionDraft.provider = event.target.value; connectionMessage = ''; render(); }
  if (event.target.id === 'ai-remember') { connectionDraft ||= { ...aiConnection, apiKey: '', rememberKey: aiConnection.keyStored }; connectionDraft.rememberKey = event.target.checked; }
});
dialog.addEventListener('cancel', event => { event.preventDefault(); closePractice(); });
window.addEventListener('beforeunload', () => { stopRecording(); releaseAudio(); disposeRehearsalAudio(); });
if (window.desktop) window.desktop.speechAvailable().then(value => { nativeSpeech = value; });
if (window.desktop?.ai) rehearsalApi('status').then(value => { aiConnection = value; if (['settings', 'rehearsal'].includes(page)) render(); }).catch(() => {});
render();
