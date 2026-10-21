// Friendly spoken Mandarin for familiar coworkers, friends, and everyday errands.
// Keep IDs stable: bookmarks and review queues refer to these phrases directly.
const expansionPhrase = (id, zh, traditional, pinyin, en, note) => ({ id, zh, traditional, pinyin, en, note, register: 'Friendly & polite' });

export const additionalScenarios = [
  {
    id: 'video-calls', title: 'Keep a video call moving', short: 'Video calls & audio hiccups', category: 'At work', icon: 'headphones', color: 'blue', time: 6,
    description: 'Check the audio, share your screen, and recover from a dropped connection.',
    situation: 'You join a quick remote chat with a teammate. Check that they can hear you, show your screen, and catch up after the connection drops.',
    phrases: [
      expansionPhrase('call1', '你能听到我说话吗？', '你能聽到我說話嗎？', 'Nǐ néng tīng dào wǒ shuōhuà ma?', 'Can you hear me?', 'A normal audio check at the start of a call. 听到 asks whether your voice is reaching them.'),
      expansionPhrase('call2', '你好像静音了。', '你好像靜音了。', 'Nǐ hǎoxiàng jìngyīn le.', 'I think you’re muted.', '好像 makes this a gentle observation when you can see them speaking but cannot hear them.'),
      expansionPhrase('call3', '我共享一下屏幕。', '我共享一下屏幕。', 'Wǒ gòngxiǎng yíxià píngmù.', 'Let me share my screen.', 'A short announcement before screen sharing. 屏幕 is common in mainland Mandarin; Taiwanese Mandarin often uses 螢幕 (yíngmù).'),
      expansionPhrase('call4', '我这边有点卡。', '我這邊有點卡。', 'Wǒ zhèbiān yǒudiǎn kǎ.', 'The connection’s a bit choppy on my end.', '卡 describes laggy audio or video here. Context distinguishes it from being stuck on a task.'),
      expansionPhrase('call5', '刚才断了一下，你说到哪儿了？', '剛才斷了一下，你說到哪兒了？', 'Gāngcái duàn le yíxià, nǐ shuō dào nǎr le?', 'The connection dropped for a moment. Where were you?', '断了一下 explains the interruption. 哪儿 nǎr is common in northern mainland speech; 哪里 nǎlǐ is another option.'),
      expansionPhrase('call6', '我把链接发到群里。', '我把鏈接發到群裡。', 'Wǒ bǎ liànjiē fā dào qún lǐ.', 'I’ll send the link to the group chat.', '群 means a chat group in this context. Name the channel if your team has several.')
    ],
    turns: [
      { zh: '我能听见，你那边呢？', traditional: '我能聽見，你那邊呢？', pinyin: 'Wǒ néng tīngjiàn, nǐ nàbiān ne?', en: 'I can hear you. How is it on your end?', goal: 'Say that the connection is choppy on your end.', correct: 'call4', options: ['call4', 'call2', 'call6'], why: '我这边有点卡 describes the lag you are experiencing.' },
      { zh: '你能给我看一下那个页面吗？', traditional: '你能給我看一下那個頁面嗎？', pinyin: 'Nǐ néng gěi wǒ kàn yíxià nàge yèmiàn ma?', en: 'Could you show me that page?', goal: 'Say you will share your screen.', correct: 'call3', options: ['call1', 'call3', 'call5'], why: '共享一下屏幕 tells your teammate how you will show them the page.' },
      { zh: '你回来了？我们刚才还在聊那个问题。', traditional: '你回來了？我們剛才還在聊那個問題。', pinyin: 'Nǐ huílai le? Wǒmen gāngcái hái zài liáo nàge wèntí.', en: 'You’re back? We were still talking about that issue.', goal: 'Explain the connection dropped and ask where they got to.', correct: 'call5', options: ['call6', 'call5', 'call2'], why: 'Explain the interruption before asking them to pick up where they left off.' }
    ]
  },
  {
    id: 'priorities', title: 'Find out what matters first', short: 'Priorities & realistic timelines', category: 'At work', icon: 'briefcase', color: 'sage', time: 7,
    description: 'Compare two tasks, explain your capacity, and agree on what to do first.',
    situation: 'Your manager asks for a small change while you are finishing another task. Check the deadline and agree on a practical order.',
    phrases: [
      expansionPhrase('prio1', '这两个哪个比较急？', '這兩個哪個比較急？', 'Zhè liǎng ge nǎge bǐjiào jí?', 'Which of these two is more urgent?', '比较急 asks about relative urgency. It invites a choice instead of silently guessing.'),
      expansionPhrase('prio2', '这个最晚什么时候要？', '這個最晚什麼時候要？', 'Zhège zuì wǎn shénme shíhou yào?', 'When do you need this by?', '最晚 asks for the latest useful time. A friendly tone makes this a straightforward scheduling question.'),
      expansionPhrase('prio3', '我先把手上这个做完，可以吗？', '我先把手上這個做完，可以嗎？', 'Wǒ xiān bǎ shǒushang zhège zuò wán, kěyǐ ma?', 'Can I finish what I’m working on first?', '手上这个 means your current task. 可以吗 checks that the proposed order works for them.'),
      expansionPhrase('prio4', '要是先做这个，另一个可能得晚点。', '要是先做這個，另一個可能得晚點。', 'Yàoshi xiān zuò zhège, lìng yí ge kěnéng děi wǎn diǎn.', 'If I do this first, the other one may have to wait a bit.', '要是… introduces the tradeoff. 得 děi means “have to,” unlike 得到 dédào. 一 in 另一个 is commonly yí before neutral 个, whose full tone is gè.'),
      expansionPhrase('prio5', '今天可能来不及，明天上午可以吗？', '今天可能來不及，明天上午可以嗎？', 'Jīntiān kěnéng lái bu jí, míngtiān shàngwǔ kěyǐ ma?', 'I may not have time today. Would tomorrow morning work?', '来不及 means there is not enough time; bu is light in this potential complement. Offer a specific alternative.'),
      expansionPhrase('prio6', '好，那我先做这个，有变化再跟你说。', '好，那我先做這個，有變化再跟你說。', 'Hǎo, nà wǒ xiān zuò zhège, yǒu biànhuà zài gēn nǐ shuō.', 'Okay, I’ll do this first and let you know if anything changes.', 'Confirm the agreed order, then give a simple promise to keep them updated.')
    ],
    turns: [
      { zh: '这两个今天都想往前推一下。', traditional: '這兩個今天都想往前推一下。', pinyin: 'Zhè liǎng ge jīntiān dōu xiǎng wǎng qián tuī yíxià.', en: 'I’d like to move both of these forward today.', goal: 'Ask which of the two is more urgent.', correct: 'prio1', options: ['prio6', 'prio1', 'prio3'], why: 'Ask for the relative priority before choosing an order.' },
      { zh: '这个能不能今天做完？', traditional: '這個能不能今天做完？', pinyin: 'Zhège néng bu néng jīntiān zuò wán?', en: 'Could this be finished today?', goal: 'You do not expect to finish today. Suggest tomorrow morning.', correct: 'prio5', options: ['prio2', 'prio4', 'prio5'], why: 'Give a realistic timeline and a concrete alternative.' },
      { zh: '可以，那你就先做这个吧。', traditional: '可以，那你就先做這個吧。', pinyin: 'Kěyǐ, nà nǐ jiù xiān zuò zhège ba.', en: 'That works. Go ahead with this one first.', goal: 'Confirm the plan and say you will share any changes.', correct: 'prio6', options: ['prio6', 'prio2', 'prio1'], why: 'Repeat the agreed next step and keep the communication open.' }
    ]
  },
  {
    id: 'weather', title: 'Start with the weather', short: 'Weather & changing plans', category: 'Everyday life', icon: 'sun', color: 'blue', time: 5,
    description: 'Make small talk, mention the forecast, and suggest an indoor plan.',
    situation: 'You and a friend planned a walk. Chat about the weather and choose what to do if it rains.',
    phrases: [
      expansionPhrase('weather1', '今天外面还挺冷的。', '今天外面還挺冷的。', 'Jīntiān wàimian hái tǐng lěng de.', 'It’s pretty cold out today.', '还挺…的 is a casual observation. 外面 commonly ends with a light mian in conversational mainland Mandarin.'),
      expansionPhrase('weather2', '下午好像要下雨。', '下午好像要下雨。', 'Xiàwǔ hǎoxiàng yào xià yǔ.', 'Looks like it’s going to rain this afternoon.', '好像 signals that you are reporting an impression or forecast rather than guaranteeing the weather.'),
      expansionPhrase('weather3', '你带伞了吗？', '你帶傘了嗎？', 'Nǐ dài sǎn le ma?', 'Did you bring an umbrella?', 'A small practical question that also keeps the conversation going.'),
      expansionPhrase('weather4', '要不我们找个室内的地方？', '要不我們找個室內的地方？', 'Yàobu wǒmen zhǎo ge shìnèi de dìfang?', 'How about finding somewhere indoors?', '要不… proposes an alternative without making it sound like an instruction.'),
      expansionPhrase('weather5', '等雨小一点再走吧。', '等雨小一點再走吧。', 'Děng yǔ xiǎo yìdiǎn zài zǒu ba.', 'Let’s wait until the rain eases up before leaving.', '等…再… means waiting for something before doing the next thing. 雨小一点 means lighter rain.'),
      expansionPhrase('weather6', '明天天气好的话，我们再去。', '明天天氣好的話，我們再去。', 'Míngtiān tiānqì hǎo de huà, wǒmen zài qù.', 'If the weather’s nice tomorrow, we can go then.', '…的话 makes a condition. 再去 suggests going another time.')
    ],
    turns: [
      { zh: '我们下午还去散步吗？', traditional: '我們下午還去散步嗎？', pinyin: 'Wǒmen xiàwǔ hái qù sànbù ma?', en: 'Are we still going for a walk this afternoon?', goal: 'Mention that it looks like rain this afternoon.', correct: 'weather2', options: ['weather3', 'weather2', 'weather1'], why: 'The forecast gives a reason to reconsider the outdoor plan.' },
      { zh: '那下雨的话，去哪里？', traditional: '那下雨的話，去哪裡？', pinyin: 'Nà xià yǔ de huà, qù nǎlǐ?', en: 'Where should we go if it rains, then?', goal: 'Suggest finding somewhere indoors.', correct: 'weather4', options: ['weather4', 'weather5', 'weather3'], why: 'An indoor location answers the question about where to go.' },
      { zh: '雨还挺大的，现在走吗？', traditional: '雨還挺大的，現在走嗎？', pinyin: 'Yǔ hái tǐng dà de, xiànzài zǒu ma?', en: 'It’s still raining pretty hard. Shall we leave now?', goal: 'Suggest waiting for the rain to ease up.', correct: 'weather5', options: ['weather6', 'weather1', 'weather5'], why: '等雨小一点再走吧 proposes waiting before heading out.' }
    ]
  },
  {
    id: 'deliveries', title: 'Sort out a delivery', short: 'Packages & delivery calls', category: 'Everyday life', icon: 'home', color: 'sage', time: 6,
    description: 'Check a package, explain where you are, and arrange a handoff.',
    situation: 'A delivery person calls about a package. Confirm which delivery they mean and decide whether to meet them or have it left by the door.',
    phrases: [
      expansionPhrase('parcel1', '你好，是我的快递到了吗？', '你好，是我的快遞到了嗎？', 'Nǐ hǎo, shì wǒ de kuàidì dào le ma?', 'Hi, is my package here?', '快递 can refer to a courier delivery or the package itself. 包裹 is another word for the package.'),
      expansionPhrase('parcel2', '我现在不在家。', '我現在不在家。', 'Wǒ xiànzài bú zài jiā.', 'I’m not home right now.', '不 becomes rising bú before fourth-tone 在 zài.'),
      expansionPhrase('parcel3', '方便放在门口吗？', '方便放在門口嗎？', 'Fāngbiàn fàng zài ménkǒu ma?', 'Would it be possible to leave it by the door?', '方便…吗 politely asks whether the arrangement is workable. Use this only when you actually want it left there.'),
      expansionPhrase('parcel4', '我下楼拿，麻烦等我两分钟。', '我下樓拿，麻煩等我兩分鐘。', 'Wǒ xià lóu ná, máfan děng wǒ liǎng fēnzhōng.', 'I’ll come downstairs to get it. Could you wait two minutes?', '麻烦 adds consideration to a concrete request. Give a realistic wait time.'),
      expansionPhrase('parcel5', '你现在在哪个门？', '你現在在哪個門？', 'Nǐ xiànzài zài nǎge mén?', 'Which entrance are you at now?', 'Useful for a building with multiple entrances. 门 can mean the entrance in this context.'),
      expansionPhrase('parcel6', '收到了，谢谢，辛苦了！', '收到了，謝謝，辛苦了！', 'Shōu dào le, xièxie, xīnkǔ le!', 'Got it. Thanks for bringing it!', '辛苦了 acknowledges their effort; the English here is an idiomatic equivalent, not a literal translation.')
    ],
    turns: [
      { zh: '你好，有你的快递。你在家吗？', traditional: '你好，有你的快遞。你在家嗎？', pinyin: 'Nǐ hǎo, yǒu nǐ de kuàidì. Nǐ zài jiā ma?', en: 'Hi, I have a package for you. Are you home?', goal: 'Tell them you are not home right now.', correct: 'parcel2', options: ['parcel6', 'parcel2', 'parcel5'], why: 'State your availability before agreeing on the handoff.' },
      { zh: '那这个包裹放哪儿？', traditional: '那這個包裹放哪兒？', pinyin: 'Nà zhège bāoguǒ fàng nǎr?', en: 'Where should I leave the package, then?', goal: 'Ask whether they can leave it by your door.', correct: 'parcel3', options: ['parcel3', 'parcel1', 'parcel4'], why: '放在门口 answers the location question and checks that it is feasible.' },
      { zh: '已经放好了，你看一下。', traditional: '已經放好了，你看一下。', pinyin: 'Yǐjīng fàng hǎo le, nǐ kàn yíxià.', en: 'I’ve left it there. Please check.', goal: 'You have confirmed it arrived. Acknowledge it and thank them.', correct: 'parcel6', options: ['parcel5', 'parcel4', 'parcel6'], why: '收到了 confirms receipt, followed by a friendly acknowledgment of the delivery.' }
    ]
  },
  {
    id: 'routines', title: 'Talk about your usual day', short: 'Mornings, commuting & routines', category: 'Everyday life', icon: 'clock', color: 'lavender', time: 6,
    description: 'Compare daily habits and ask an easy follow-up question.',
    situation: 'A coworker chats with you before the workday starts. Talk about your commute, working from home, and what you do after work.',
    phrases: [
      expansionPhrase('routine1', '你平时几点起床？', '你平時幾點起床？', 'Nǐ píngshí jǐ diǎn qǐchuáng?', 'What time do you usually get up?', '平时 asks about their usual routine rather than what happened today.'),
      expansionPhrase('routine2', '我一般八点左右出门。', '我一般八點左右出門。', 'Wǒ yìbān bā diǎn zuǒyòu chū mén.', 'I usually leave home around eight.', '左右 after a time means “around.” 一 in 一般 becomes falling yì before first-tone 般 bān.'),
      expansionPhrase('routine3', '路上大概半个小时。', '路上大概半個小時。', 'Lùshang dàgài bàn ge xiǎoshí.', 'It takes about half an hour to get there.', 'A conversational answer when your commute is already the topic. 半个小时 is half an hour.'),
      expansionPhrase('routine4', '我今天在家办公。', '我今天在家辦公。', 'Wǒ jīntiān zài jiā bàngōng.', 'I’m working from home today.', '在家办公 is widely understandable. You may also hear 在家上班 or an English WFH in a tech team.'),
      expansionPhrase('routine5', '下班以后，我一般去走走。', '下班以後，我一般去走走。', 'Xià bān yǐhòu, wǒ yìbān qù zǒuzou.', 'I usually go for a walk after work.', '走走 is a relaxed “walk around a bit.” The repeated syllable is light here.'),
      expansionPhrase('routine6', '你呢，平时怎么安排？', '你呢，平時怎麼安排？', 'Nǐ ne, píngshí zěnme ānpái?', 'How about you? What’s your usual routine?', '你呢 turns the conversation back to them. The shared topic supplies what 安排 refers to.')
    ],
    turns: [
      { zh: '你一般几点出门？', traditional: '你一般幾點出門？', pinyin: 'Nǐ yìbān jǐ diǎn chū mén?', en: 'What time do you usually leave home?', goal: 'Say you usually leave around eight.', correct: 'routine2', options: ['routine4', 'routine2', 'routine1'], why: 'Name your usual departure time; 左右 leaves room for variation.' },
      { zh: '到公司要多久？', traditional: '到公司要多久？', pinyin: 'Dào gōngsī yào duō jiǔ?', en: 'How long does it take to get to the office?', goal: 'Say the journey takes about half an hour.', correct: 'routine3', options: ['routine3', 'routine6', 'routine2'], why: '半个小时 gives the travel time rather than a departure time.' },
      { zh: '你下班以后一般做什么？', traditional: '你下班以後一般做什麼？', pinyin: 'Nǐ xià bān yǐhòu yìbān zuò shénme?', en: 'What do you usually do after work?', goal: 'Say you usually go for a walk.', correct: 'routine5', options: ['routine1', 'routine5', 'routine4'], why: '下班以后… answers with a routine activity, making an easy opening for a follow-up.' }
    ]
  },
  {
    id: 'declining', title: 'Say no without closing the door', short: 'Declining an invitation kindly', category: 'Everyday life', icon: 'calendar', color: 'sage', time: 6,
    description: 'Decline clearly, give a short reason, and suggest another chance to meet.',
    situation: 'A friend invites you out on a busy evening. You cannot make it, but would like to get together another day.',
    phrases: [
      expansionPhrase('decline1', '谢谢你叫我，不过今天去不了了。', '謝謝你叫我，不過今天去不了了。', 'Xièxie nǐ jiào wǒ, búguò jīntiān qù bu liǎo le.', 'Thanks for inviting me, but I can’t make it today.', '叫我 means including or inviting you here. 去不了 uses light bu and liǎo for being unable to go.'),
      expansionPhrase('decline2', '我晚上已经有安排了。', '我晚上已經有安排了。', 'Wǒ wǎnshang yǐjīng yǒu ānpái le.', 'I already have plans this evening.', 'A brief reason is enough. You do not have to explain the whole plan.'),
      expansionPhrase('decline3', '今天想早点回家休息。', '今天想早點回家休息。', 'Jīntiān xiǎng zǎo diǎn huí jiā xiūxi.', 'I’d like to head home early and rest today.', 'A simple personal preference, useful with people you know. The subject 我 can be left out when it is clear.'),
      expansionPhrase('decline4', '我们改天再约吧。', '我們改天再約吧。', 'Wǒmen gǎitiān zài yuē ba.', 'Let’s get together another day.', '改天 leaves the date open. If you really want to meet soon, follow up with a specific time.'),
      expansionPhrase('decline5', '周六下午我有空，你呢？', '週六下午我有空，你呢？', 'Zhōuliù xiàwǔ wǒ yǒu kòng, nǐ ne?', 'I’m free Saturday afternoon. How about you?', '有空 uses fourth-tone kòng for available time. Offering a specific day makes rescheduling easier.'),
      expansionPhrase('decline6', '你们玩得开心，下次见！', '你們玩得開心，下次見！', 'Nǐmen wán de kāixīn, xià cì jiàn!', 'Have fun, and see you next time!', 'A warm way to close when the others are still going. 得 de connects 玩 to how the activity goes.')
    ],
    turns: [
      { zh: '今天晚上一起吃饭吗？', traditional: '今天晚上一起吃飯嗎？', pinyin: 'Jīntiān wǎnshang yìqǐ chī fàn ma?', en: 'Want to have dinner together tonight?', goal: 'Thank them for the invitation and say you cannot make it today.', correct: 'decline1', options: ['decline5', 'decline1', 'decline6'], why: 'Acknowledge the invitation and clearly say that today does not work.' },
      { zh: '没事，那你哪天方便？', traditional: '沒事，那你哪天方便？', pinyin: 'Méi shì, nà nǐ nǎ tiān fāngbiàn?', en: 'No worries. What day works for you?', goal: 'Offer Saturday afternoon and check their availability.', correct: 'decline5', options: ['decline4', 'decline2', 'decline5'], why: 'A concrete time helps turn a general intention into a plan.' },
      { zh: '好，那我们今天先去了。', traditional: '好，那我們今天先去了。', pinyin: 'Hǎo, nà wǒmen jīntiān xiān qù le.', en: 'Okay, we’ll go ahead today, then.', goal: 'Wish them a good time and say see you next time.', correct: 'decline6', options: ['decline6', 'decline3', 'decline2'], why: 'A friendly closing keeps the exchange warm even though you are not joining.' }
    ]
  },
  {
    id: 'catching-up', title: 'Pick up where you left off', short: 'Catching up & staying in touch', category: 'Everyday life', icon: 'message', color: 'lavender', time: 6,
    description: 'Reconnect, ask about a recent change, and leave room for a real answer.',
    situation: 'You run into a friend you have not seen for a while. Ask how things are going and follow up about their new job.',
    phrases: [
      expansionPhrase('catch1', '好久没见，最近怎么样？', '好久沒見，最近怎麼樣？', 'Hǎo jiǔ méi jiàn, zuìjìn zěnmeyàng?', 'Long time no see. How have you been?', 'A relaxed opener that invites more than a yes-or-no answer.'),
      expansionPhrase('catch2', '最近有点忙，不过还不错。', '最近有點忙，不過還不錯。', 'Zuìjìn yǒudiǎn máng, búguò hái búcuò.', 'I’ve been a bit busy, but things are pretty good.', 'A short personal update. Both 不过 and 不错 use rising bú before a fourth tone.'),
      expansionPhrase('catch3', '你上次说换工作了，现在还习惯吗？', '你上次說換工作了，現在還習慣嗎？', 'Nǐ shàng cì shuō huàn gōngzuò le, xiànzài hái xíguàn ma?', 'You mentioned changing jobs. Are you settling in okay?', 'Bring back something they told you. 还习惯吗 checks how they are adjusting.'),
      expansionPhrase('catch4', '有什么新鲜事吗？', '有什麼新鮮事嗎？', 'Yǒu shénme xīnxiān shì ma?', 'Anything new going on?', '新鲜事 asks about recent happenings. Keep the tone interested rather than expecting exciting news.'),
      expansionPhrase('catch5', '有空再跟我说说。', '有空再跟我說說。', 'Yǒu kòng zài gēn wǒ shuōshuo.', 'Tell me more when you have time.', '说说 is a casual invitation to talk. 有空 lets them choose a convenient time.'),
      expansionPhrase('catch6', '回头我们找个时间聊聊。', '回頭我們找個時間聊聊。', 'Huítóu wǒmen zhǎo ge shíjiān liáoliao.', 'Let’s find a time to have a proper catch-up.', '回头 means later in this context, and 聊聊 makes the invitation relaxed. Follow up with a specific time if you want to make a plan.')
    ],
    turns: [
      { zh: '好久没见！你最近还好吗？', traditional: '好久沒見！你最近還好嗎？', pinyin: 'Hǎo jiǔ méi jiàn! Nǐ zuìjìn hái hǎo ma?', en: 'Long time no see! Have you been doing okay?', goal: 'Say you have been busy but things are going pretty well.', correct: 'catch2', options: ['catch4', 'catch2', 'catch6'], why: 'Give a short update about yourself before turning the question back to them.' },
      { zh: '我最近主要就是忙新工作的事。', traditional: '我最近主要就是忙新工作的事。', pinyin: 'Wǒ zuìjìn zhǔyào jiù shì máng xīn gōngzuò de shì.', en: 'I’ve mostly been busy with the new job lately.', goal: 'Follow up by asking whether they are settling into the job.', correct: 'catch3', options: ['catch3', 'catch1', 'catch2'], why: 'A specific follow-up shows you remembered the change and want to hear how it is going.' },
      { zh: '还可以，不过我现在得走了。', traditional: '還可以，不過我現在得走了。', pinyin: 'Hái kěyǐ, búguò wǒ xiànzài děi zǒu le.', en: 'Pretty well, but I have to go now.', goal: 'Suggest finding a time for a longer catch-up later.', correct: 'catch6', options: ['catch2', 'catch4', 'catch6'], why: 'Respect the fact they need to go while expressing interest in talking again.' }
    ]
  },
  {
    id: 'misunderstandings', title: 'Fix a small mix-up', short: 'Apologizing & clearing things up', category: 'Everyday life', icon: 'message', color: 'blue', time: 6,
    description: 'Own a misunderstanding, clarify what happened, and offer a simple fix.',
    situation: 'You and a friend mixed up the meeting time. Explain what you thought, apologize briefly, and agree on the updated plan.',
    phrases: [
      expansionPhrase('mix1', '不好意思，我刚才听错了。', '不好意思，我剛才聽錯了。', 'Bù hǎoyìsi, wǒ gāngcái tīng cuò le.', 'Sorry, I misheard that.', '听错 means you heard it incorrectly. 没听清 means you did not hear clearly; these describe different problems.'),
      expansionPhrase('mix2', '我以为是明天。', '我以為是明天。', 'Wǒ yǐwéi shì míngtiān.', 'I thought it was tomorrow.', '以为 introduces what you had believed, usually when that belief turns out to be mistaken.'),
      expansionPhrase('mix3', '是我没说清楚。', '是我沒說清楚。', 'Shì wǒ méi shuō qīngchu.', 'I didn’t explain it clearly.', 'Use this when your own explanation caused the confusion. It takes responsibility without a long apology.'),
      expansionPhrase('mix4', '没关系，我们再确认一下。', '沒關係，我們再確認一下。', 'Méi guānxi, wǒmen zài quèrèn yíxià.', 'No worries. Let’s double-check.', 'An acknowledgment plus a practical next step helps both people move on.'),
      expansionPhrase('mix5', '我现在把时间改过来。', '我現在把時間改過來。', 'Wǒ xiànzài bǎ shíjiān gǎi guòlai.', 'I’ll correct the time now.', '改过来 means changing it to the correct version, for example in your calendar.'),
      expansionPhrase('mix6', '那就明天下午三点见。', '那就明天下午三點見。', 'Nà jiù míngtiān xiàwǔ sān diǎn jiàn.', 'Then let’s meet tomorrow at three in the afternoon.', 'Repeat the full agreed time to close the loop after a mix-up.')
    ],
    turns: [
      { zh: '我们约的不是今天吗？', traditional: '我們約的不是今天嗎？', pinyin: 'Wǒmen yuē de bú shì jīntiān ma?', en: 'Weren’t we meeting today?', goal: 'Explain that you thought it was tomorrow.', correct: 'mix2', options: ['mix5', 'mix2', 'mix3'], why: '我以为… explains your mistaken understanding of the day.' },
      { zh: '可能是我说得太快了，不好意思。', traditional: '可能是我說得太快了，不好意思。', pinyin: 'Kěnéng shì wǒ shuō de tài kuài le, bù hǎoyìsi.', en: 'Maybe I said it too quickly. Sorry about that.', goal: 'Reassure them and suggest double-checking together.', correct: 'mix4', options: ['mix1', 'mix4', 'mix2'], why: '没关系 accepts the apology, and 再确认一下 proposes a shared fix.' },
      { zh: '那改到明天下午三点，可以吗？', traditional: '那改到明天下午三點，可以嗎？', pinyin: 'Nà gǎi dào míngtiān xiàwǔ sān diǎn, kěyǐ ma?', en: 'Could we move it to tomorrow at three in the afternoon?', goal: 'Confirm the full new meeting time.', correct: 'mix6', options: ['mix6', 'mix1', 'mix3'], why: 'Repeat the day and time so there is no remaining ambiguity.' }
    ]
  }
];
