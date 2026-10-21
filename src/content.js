import { additionalScenarios } from './more-lessons.js';

const phrase = (id, zh, traditional, pinyin, en, note, register = 'Neutral') => ({ id, zh, traditional, pinyin, en, note, register });

// Teaching convention: show the spoken changes of 一 and 不, retain lexical
// third-tone marks, and use unmarked syllables for common conversational neutral tones.
// This is a pronunciation aid, not a narrow transcription of every pitch change.
export const pinyinGuide = {
  yi: '一 is yī on its own. Before a fourth tone it becomes rising yí: 一下 → yíxià. Before a first, second, or third tone it usually becomes falling yì: 一杯 → yì bēi; 一起 → yìqǐ. Dictionaries may show the original yī instead.',
  bu: '不 is normally bù, but becomes rising bú before a fourth tone: 不错 → búcuò. In casual questions such as 要不要 and 辣不辣, the middle 不 is often neutral bu.',
  third: 'Third-tone spelling keeps the original tone: 你好 is written nǐ hǎo, although the first syllable is pronounced with a rising tone in connected speech. Longer strings of third tones depend on how the words are grouped.',
  neutral: 'A syllable without a tone mark is light and unstressed, not first tone: the final syllables in 谢谢 xièxie and 朋友 péngyou are common examples. Neutral tones and emphasis vary by speaker and region. Traditional characters change the script, not the pronunciation variety.'
};

export const scenarios = [
  {
    id: 'updates', title: 'Keep your manager in the loop', short: 'Giving a work update', category: 'At work', icon: 'briefcase', color: 'sage', time: 7,
    description: 'Share progress, flag a blocker, and agree on next steps.', situation: 'Your manager checks in on a feature during a quick team chat. Share how it is going, what is stuck, and when you can finish.',
    phrases: [
      phrase("u1", "我跟你说一下现在的进度。", "我跟你說一下現在的進度。", "Wǒ gēn nǐ shuō yíxià xiànzài de jìndù.", "Quick update on where things are.", "A natural opener in a quick chat with your manager or teammate. 一下 makes it sound brief. 同步一下 is also common in tech teams.", "Friendly & polite"),
      phrase("u2", "现在还挺顺的。", "現在還挺順的。", "Xiànzài hái tǐng shùn de.", "It’s going pretty smoothly.", "挺顺的 is a relaxed way to say things are going smoothly. Add a concrete detail about what you finished.", "Friendly & polite"),
      phrase("u3", "这块我还需要一点时间。", "這塊我還需要一點時間。", "Zhè kuài wǒ hái xūyào yìdiǎn shíjiān.", "I still need a little more time on this part.", "这块 means “this part” of the work, such as a feature or design. Say which part you mean, then give a realistic timeline.", "Friendly & polite"),
      phrase("u4", "我这边有个地方卡住了。", "我這邊有個地方卡住了。", "Wǒ zhèbiān yǒu ge dìfang kǎ zhù le.", "I’m stuck on something on my end.", "卡住了 means you are stuck or blocked. Follow it with the issue and the help you need; it is useful with teammates and managers.", "Friendly & polite"),
      phrase("u5", "周五之前应该能做完。", "週五之前應該能做完。", "Zhōuwǔ zhīqián yīnggāi néng zuò wán.", "I should be able to finish before Friday.", "应该…能 gives an estimate, so leave room for uncertainty. 周五之前 means before Friday; 周五下班前 means by the end of the workday Friday.", "Friendly & polite"),
      phrase("u6", "你看这样可以吗？", "你看這樣可以嗎？", "Nǐ kàn zhèyàng kěyǐ ma?", "Does that work for you?", "你看… asks for their take. It is a short, considerate way to check a plan with your manager or coworker.", "Friendly & polite")
    ],
    turns: [
      { zh: "进度怎么样了？", traditional: "進度怎麼樣了？", pinyin: "Jìndù zěnmeyàng le?", en: "How’s it coming along?", goal: 'Tell your manager that things are going smoothly so far.', correct: 'u2', options: ['u2', 'u6', 'u1'], why: 'Answer the progress question directly. Then you can add a detail or a blocker.' },
      { zh: "有哪里卡住了吗？", traditional: "有哪裡卡住了嗎？", pinyin: "Yǒu nǎlǐ kǎ zhù le ma?", en: "Are you stuck on anything?", goal: 'Let your manager know that you have run into an issue.', correct: 'u4', options: ['u5', 'u4', 'u6'], why: '卡住了 tells your manager you are stuck. Explain where and what would help.' },
      { zh: "大概什么时候能做完？", traditional: "大概什麼時候能做完？", pinyin: "Dàgài shénme shíhou néng zuò wán?", en: "About when can you finish?", goal: 'Give a specific estimated completion date.', correct: 'u5', options: ['u3', 'u1', 'u5'], why: '应该…能 gives a practical estimate without making an absolute promise.' }
    ]
  },
  {
    id: 'clarify', title: 'Ask without feeling awkward', short: 'Asking for clarification', category: 'At work', icon: 'message', color: 'lavender', time: 6,
    description: 'Ask someone to repeat, explain, or confirm what they mean.', situation: 'A teammate talks through a code change a little too quickly. Ask which part they mean and check that you understood.',
    phrases: [
      phrase("c1", "不好意思，你能再说一遍吗？", "不好意思，你能再說一遍嗎？", "Bù hǎoyìsi, nǐ néng zài shuō yí biàn ma?", "Sorry, could you say that again?", "A quick 不好意思 is normal in everyday conversation. Ask once, then keep chatting; there is no need for a long apology.", "Friendly & polite"),
      phrase("c2", "你是说哪一块？", "你是說哪一塊？", "Nǐ shì shuō nǎ yí kuài?", "Which part do you mean?", "哪一块 asks which part of the task, code, or design they mean. Keep your tone curious. 一 is rising yí before fourth-tone 块 kuài.", "Friendly & polite"),
      phrase("c3", "我确认一下，你是说……", "我確認一下，你是說……", "Wǒ quèrèn yíxià, nǐ shì shuō…", "Just checking, you mean…", "Repeat your understanding after 你是说. In 一下, 一 changes from yī to rising yí before fourth-tone xià. The app shows this spoken tone change.", "Friendly & polite"),
      phrase("c4", "能举个例子吗？", "能舉個例子嗎？", "Néng jǔ ge lìzi ma?", "Could you give me an example?", "能…吗 is a simple, polite request. You can leave out 你 when you are already talking to that person.", "Friendly & polite"),
      phrase("c5", "能说慢一点吗？", "能說慢一點嗎？", "Néng shuō màn yìdiǎn ma?", "Could you speak a little more slowly?", "一点 softens the request. This is short and perfectly usable with a coworker; a friendly tone does the rest.", "Friendly & polite"),
      phrase("c6", "明白了，谢谢！", "明白了，謝謝！", "Míngbai le, xièxie!", "Got it, thanks!", "A simple 明白了，谢谢 is enough after someone explains something. Use it once you understand; otherwise ask a follow-up.", "Friendly & polite")
    ],
    turns: [
      { zh: "刚才那段听清楚了吗？", traditional: "剛才那段聽清楚了嗎？", pinyin: "Gāngcái nà duàn tīng qīngchu le ma?", en: "Did you catch that last part?", goal: 'You missed the last sentence. Ask them to repeat it.', correct: 'c1', options: ['c6', 'c1', 'c4'], why: 'Ask for a repeat when you did not catch the words.' },
      { zh: "这块我们再改一下吧。", traditional: "這塊我們再改一下吧。", pinyin: "Zhè kuài wǒmen zài gǎi yíxià ba.", en: "Let’s tweak this part a bit.", goal: 'Ask which part of the code they mean.', correct: 'c2', options: ['c5', 'c2', 'c6'], why: '哪一块 asks which part they want to change, so you can get on the same page.' },
      { zh: "就是把重复的那几步合到一起。", traditional: "就是把重複的那幾步合到一起。", pinyin: "Jiùshì bǎ chóngfù de nà jǐ bù hé dào yìqǐ.", en: "Just combine those repeated steps.", goal: 'You understand now. Thank them for explaining.', correct: 'c6', options: ['c6', 'c5', 'c1'], why: 'Acknowledge the explanation and thank your coworker.' }
    ]
  },
  {
    id: 'lunch', title: 'Make the lunch chat easy', short: 'Lunch with coworkers', category: 'At work', icon: 'bowl', color: 'peach', time: 5,
    description: 'Invite someone along, pick a place, and keep the chat going.', situation: 'It is almost lunchtime. Invite a coworker out and decide where to eat.',
    phrases: [
      phrase('l1', '中午要不要一起吃饭？', '中午要不要一起吃飯？', 'Zhōngwǔ yào bu yào yìqǐ chīfàn?', 'Want to grab lunch together?', '要不要 is a relaxed invitation. The middle 不 is often unstressed bu. In 一起, 一 is falling yì before third-tone qǐ.', 'Casual'),
      phrase('l2', '你想吃什么？', '你想吃什麼？', 'Nǐ xiǎng chī shénme?', 'What do you feel like eating?', '想吃 asks what someone wants to eat, not what they plan to order yet.', 'Casual'),
      phrase('l3', '附近有一家不错的面馆。', '附近有一家不錯的麵館。', 'Fùjìn yǒu yì jiā búcuò de miànguǎn.', 'There is a pretty good noodle place nearby.', '一家 is the measure phrase for a business. Swap 面馆 for 咖啡店, “coffee shop.”'),
      phrase('l4', '我都可以，你定吧。', '我都可以，你定吧。', 'Wǒ dōu kěyǐ, nǐ dìng ba.', 'Anything works for me. You pick.', '吧 makes the suggestion relaxed. This is warmer than a flat 随便 (“whatever”).', 'Casual'),
      phrase('l5', '你周末过得怎么样？', '你週末過得怎麼樣？', 'Nǐ zhōumò guò de zěnmeyàng?', 'How was your weekend?', 'An easy Monday lunch opener. Be ready to share a small detail about your own weekend.'),
      phrase('l6', '下次我请你。', '下次我請你。', 'Xià cì wǒ qǐng nǐ.', 'Next time, it is on me.', '请 here means “treat someone.” Use it when you mean to return the favor.', 'Casual')
    ],
    turns: [
      { zh: "快中午了。", traditional: "快中午了。", pinyin: "Kuài zhōngwǔ le.", en: "It’s almost noon.", goal: 'Invite your coworker to have lunch together.', correct: 'l1', options: ['l6', 'l5', 'l1'], why: 'Turn the observation into an invitation with 要不要一起…?' },
      { zh: "附近有什么好吃的？", traditional: "附近有什麼好吃的？", pinyin: "Fùjìn yǒu shénme hǎochī de?", en: "Any good food around here?", goal: 'Suggest a specific place to eat nearby.', correct: 'l3', options: ['l3', 'l6', 'l5'], why: 'Offer a specific nearby suggestion.' },
      { zh: '这顿我请吧。', traditional: '這頓我請吧。', pinyin: 'Zhè dùn wǒ qǐng ba.', en: 'Let me get this one.', goal: 'Offer to treat them next time.', correct: 'l6', options: ['l2', 'l6', 'l1'], why: 'Offer to return the favor next time. 这顿 refers to this meal.' }
    ]
  },
  {
    id: 'opinions', title: 'Say what you think, thoughtfully', short: 'Sharing an opinion', category: 'At work', icon: 'spark', color: 'blue', time: 7,
    description: 'Suggest an idea, disagree gently, and find a way forward.', situation: 'You are chatting with your team about how to build a feature. Suggest a small experiment and flag a tight deadline.',
    phrases: [
      phrase("o1", "我有个想法，想听听你怎么想。", "我有個想法，想聽聽你怎麼想。", "Wǒ yǒu ge xiǎngfǎ, xiǎng tīngting nǐ zěnme xiǎng.", "I have an idea and would like to hear what you think.", "Share your idea next. 听听你怎么想 invites a teammate’s input in an everyday way.", "Friendly & polite"),
      phrase("o2", "我觉得可以先试一下。", "我覺得可以先試一下。", "Wǒ juéde kěyǐ xiān shì yíxià.", "I think we could give it a try first.", "我觉得 frames it as your suggestion. 先试一下 is useful for proposing a small experiment with the team.", "Friendly & polite"),
      phrase("o3", "我觉得这个方向挺好的。", "我覺得這個方向挺好的。", "Wǒ juéde zhège fāngxiàng tǐng hǎo de.", "I think this direction looks pretty good.", "挺好的 is an everyday way to agree. 方向 can mean the approach to a feature or design. You can still raise a concern afterward.", "Friendly & polite"),
      phrase("o4", "我有点担心时间不够。", "我有點擔心時間不夠。", "Wǒ yǒudiǎn dānxīn shíjiān bú gòu.", "I’m a little worried we won’t have enough time.", "有点担心 raises a concern gently. Say what might take longer, then suggest what to cut or change.", "Friendly & polite"),
      phrase("o5", "要不我们换个办法试试？", "要不我們換個辦法試試？", "Yàobu wǒmen huàn ge bànfǎ shìshi?", "How about trying a different way?", "要不…? suggests an alternative, and 试试 makes it feel like something to explore together. 不 is often neutral bu here; full-tone bù is also heard.", "Friendly & polite"),
      phrase("o6", "我懂你的意思，不过……", "我懂你的意思，不過……", "Wǒ dǒng nǐ de yìsi, búguò…", "I get what you mean, but…", "Acknowledge their point, then explain your concern after 不过. 懂 is an everyday way to say you understand.", "Friendly & polite")
    ],
    turns: [
      { zh: "你觉得呢？", traditional: "你覺得呢？", pinyin: "Nǐ juéde ne?", en: "What do you think?", goal: 'Suggest trying the current approach before committing to it.', correct: 'o2', options: ['o3', 'o2', 'o6'], why: 'Offer a concrete next step: try it first.' },
      { zh: "我们明天都做完吧。", traditional: "我們明天都做完吧。", pinyin: "Wǒmen míngtiān dōu zuò wán ba.", en: "Let’s finish it all tomorrow.", goal: 'You are concerned about the deadline. Raise the time constraint.', correct: 'o4', options: ['o1', 'o3', 'o4'], why: 'Raise the time constraint with 有点担心.' },
      { zh: "那你觉得怎么弄比较好？", traditional: "那你覺得怎麼弄比較好？", pinyin: "Nà nǐ juéde zěnme nòng bǐjiào hǎo?", en: "Then how do you think we should go about it?", goal: 'Suggest exploring a different approach together.', correct: 'o5', options: ['o5', 'o3', 'o6'], why: 'Suggest exploring an alternative together.' }
    ]
  },
  {
    id: 'requests', title: 'Ask for a hand', short: 'Requests & scheduling', category: 'At work', icon: 'calendar', color: 'sand', time: 6,
    description: 'Ask for help, find a time, and follow up politely.', situation: 'You want a teammate to take a quick look at some code. Find a time to chat and let them know it is not urgent.',
    phrases: [
      phrase("r1", "你现在有空吗？", "你現在有空嗎？", "Nǐ xiànzài yǒu kòng ma?", "Do you have a moment?", "Check whether your coworker or manager has time before making the request. 有空 is yǒu kòng when it means having time.", "Friendly & polite"),
      phrase("r2", "能帮我看一下这个吗？", "能幫我看一下這個嗎？", "Néng bāng wǒ kàn yíxià zhège ma?", "Could you take a quick look at this for me?", "A normal request for a code snippet, design, or draft. If they cannot see what you mean, name it: 这段代码 means “this piece of code.”", "Friendly & polite"),
      phrase("r3", "我们找个时间聊聊吧。", "我們找個時間聊聊吧。", "Wǒmen zhǎo ge shíjiān liáoliao ba.", "Let’s find a time to chat.", "聊聊 makes this sound like a conversation. 吧 turns it into a suggestion you can arrange together.", "Friendly & polite"),
      phrase("r4", "明天下午两点可以吗？", "明天下午兩點可以嗎？", "Míngtiān xiàwǔ liǎng diǎn kěyǐ ma?", "Does tomorrow at two work?", "Once you are arranging a chat, the time plus 可以吗 is enough. Use 两点 for two o’clock.", "Friendly & polite"),
      phrase("r5", "不着急，你有空再看就行。", "不著急，你有空再看就行。", "Bù zháojí, nǐ yǒu kòng zài kàn jiù xíng.", "No rush. Take a look when you have time.", "就行 means “that’s fine / that works.” This gives them room to fit it into their day. Say 不着急 only when the timing really is flexible.", "Friendly & polite"),
      phrase("r6", "上次说的那个事，现在怎么样了？", "上次說的那個事，現在怎麼樣了？", "Shàng cì shuō de nà ge shì, xiànzài zěnmeyàng le?", "Any updates on what we talked about last time?", "A conversational follow-up. Replace 那个事 with the actual feature, bug, or task if they might not remember which one you mean.", "Friendly & polite")
    ],
    turns: [
      { zh: "怎么了？", traditional: "怎麼了？", pinyin: "Zěnme le?", en: "What’s up?", goal: 'Ask them to take a quick look at your code.', correct: 'r2', options: ['r4', 'r2', 'r6'], why: 'State the help you need: a quick look at something.' },
      { zh: "今天有点忙，明天可以。", traditional: "今天有點忙，明天可以。", pinyin: "Jīntiān yǒudiǎn máng, míngtiān kěyǐ.", en: "I’m a bit busy today. Tomorrow works.", goal: 'Suggest a specific meeting time tomorrow.', correct: 'r4', options: ['r6', 'r1', 'r4'], why: 'Suggest a specific time tomorrow.' },
      { zh: "这个急吗？", traditional: "這個急嗎？", pinyin: "Zhège jí ma?", en: "Is this urgent?", goal: 'There is no deadline today. Let them know there is no rush.', correct: 'r5', options: ['r5', 'r3', 'r6'], why: 'Clarify that the timing is flexible with 不着急.' }
    ]
  },
  {
    id: 'weekend', title: 'Go beyond “I’m good”', short: 'Weekend & small talk', category: 'Everyday life', icon: 'sun', color: 'peach', time: 5,
    description: 'Talk about your plans, share a story, and ask a follow-up.', situation: 'You run into a friend on Friday. Talk about the weekend and keep the conversation moving.',
    phrases: [
      phrase('w1', '最近怎么样？', '最近怎麼樣？', 'Zuìjìn zěnmeyàng?', 'How have you been lately?', '最近 asks about life recently, rather than just this moment.', 'Casual'),
      phrase('w2', '周末有什么安排？', '週末有什麼安排？', 'Zhōumò yǒu shénme ānpái?', 'Any plans for the weekend?', 'You can omit 你 in casual conversation when it is clear who you mean.', 'Casual'),
      phrase('w3', '我打算跟朋友去爬山。', '我打算跟朋友去爬山。', 'Wǒ dǎsuàn gēn péngyou qù páshān.', 'I am planning to go hiking with friends.', '打算 introduces a plan. Replace 去爬山 with 看电影, “watch a movie.”'),
      phrase('w4', '听起来不错！', '聽起來不錯！', 'Tīng qǐlai búcuò!', 'That sounds nice!', '听起来 means “sounds.” 来 is often neutral lai in this expression; full-tone lái is also heard. Add a follow-up question to keep the chat going.', 'Casual'),
      phrase('w5', '你平时喜欢做什么？', '你平時喜歡做什麼？', 'Nǐ píngshí xǐhuan zuò shénme?', 'What do you like doing in your free time?', '平时 means “usually / in everyday life.” Context makes this a question about hobbies.'),
      phrase('w6', '有机会我们一起去吧。', '有機會我們一起去吧。', 'Yǒu jīhuì wǒmen yìqǐ qù ba.', 'Let us go together sometime.', 'A friendly, low-pressure suggestion. Set a date later if you want to make a firm plan.', 'Casual')
    ],
    turns: [
      { zh: '终于到周五了！', traditional: '終於到週五了！', pinyin: 'Zhōngyú dào zhōuwǔ le!', en: 'Finally, it is Friday!', goal: 'Ask about their weekend plans.', correct: 'w2', options: ['w6', 'w2', 'w4'], why: 'Ask about weekend plans to open the conversation.' },
      { zh: '你呢，周末准备做什么？', traditional: '你呢，週末準備做什麼？', pinyin: 'Nǐ ne, zhōumò zhǔnbèi zuò shénme?', en: 'What about you? What are you doing this weekend?', goal: 'Tell them you are planning to hike with friends.', correct: 'w3', options: ['w1', 'w5', 'w3'], why: 'Share your own plan with 我打算…' },
      { zh: '我也很喜欢爬山。', traditional: '我也很喜歡爬山。', pinyin: 'Wǒ yě hěn xǐhuan páshān.', en: 'I love hiking too.', goal: 'Suggest going hiking together sometime.', correct: 'w6', options: ['w6', 'w1', 'w5'], why: 'Build on your shared interest by suggesting going together.' }
    ]
  },
  {
    id: 'food', title: 'Order it just how you like it', short: 'Cafés & restaurants', category: 'Everyday life', icon: 'cup', color: 'sand', time: 5,
    description: 'Order naturally, customize your food, and get the bill.', situation: 'You are at a café that serves lunch. Ask for a recommendation and place an order.',
    phrases: [
      phrase('f1', '有什么推荐的吗？', '有什麼推薦的嗎？', 'Yǒu shénme tuījiàn de ma?', 'What would you recommend?', 'A natural open question for food, drinks, or places to visit.'),
      phrase('f2', '我要一杯拿铁，热的。', '我要一杯拿鐵，熱的。', 'Wǒ yào yì bēi nátiě, rè de.', 'I would like a hot latte.', '热的 specifies hot. For an iced drink, say 冰的.'),
      phrase('f3', '可以少放一点糖吗？', '可以少放一點糖嗎？', 'Kěyǐ shǎo fàng yìdiǎn táng ma?', 'Could you put in a little less sugar?', '少放 means “add less.” Replace 糖 with 盐, “salt,” when appropriate.', 'Polite'),
      phrase('f4', '这个辣不辣？', '這個辣不辣？', 'Zhège là bu là?', 'Is this spicy?', 'The adjective-not-adjective pattern asks a yes/no question. The middle 不 is often neutral bu here, unlike the rising bú in 不错.'),
      phrase('f5', '麻烦帮我打包。', '麻煩幫我打包。', 'Máfan bāng wǒ dǎbāo.', 'Could you pack this to go, please?', '麻烦 politely acknowledges the effort. 打包 can mean leftovers or takeaway.', 'Polite'),
      phrase('f6', '你好，买单。', '你好，買單。', 'Nǐ hǎo, mǎidān.', 'Hi, the bill, please.', '买单 is widely used in mainland Mandarin. 结账 also works; in Taiwan, 结账 is more usual.', 'Polite')
    ],
    turns: [
      { zh: '你好，想喝点什么？', traditional: '你好，想喝點什麼？', pinyin: 'Nǐ hǎo, xiǎng hē diǎn shénme?', en: 'Hi, what would you like to drink?', goal: 'Order a hot latte.', correct: 'f2', options: ['f4', 'f6', 'f2'], why: 'Order the drink and specify its temperature.' },
      { zh: '要正常甜度吗？', traditional: '要正常甜度嗎？', pinyin: 'Yào zhèngcháng tiándù ma?', en: 'Would you like the usual sweetness?', goal: 'Ask for less sugar.', correct: 'f3', options: ['f3', 'f5', 'f6'], why: 'Ask for less sugar using 少放一点.' },
      { zh: '吃不完的需要带走吗？', traditional: '吃不完的需要帶走嗎？', pinyin: 'Chī bu wán de xūyào dài zǒu ma?', en: 'Would you like to take the leftovers with you?', goal: 'Ask them to pack the leftovers to go.', correct: 'f5', options: ['f1', 'f5', 'f4'], why: '打包 asks to pack the food so you can take it with you.' }
    ]
  },
  {
    id: 'getting-around', title: 'Find your way with confidence', short: 'Getting around', category: 'Everyday life', icon: 'map', color: 'blue', time: 5,
    description: 'Ask for directions, check a route, and navigate a ride.', situation: 'You are heading to meet a friend. Find the station and make sure you are going the right way.',
    phrases: [
      phrase('g1', '请问，地铁站怎么走？', '請問，地鐵站怎麼走？', 'Qǐngwèn, dìtiězhàn zěnme zǒu?', 'Excuse me, how do I get to the subway station?', '请问 is a polite opener with strangers. In Taiwan, the metro is usually called 捷运.', 'Polite'),
      phrase('g2', '走路大概要多久？', '走路大概要多久？', 'Zǒulù dàgài yào duō jiǔ?', 'About how long does it take to walk?', '多久 asks about duration. 多远 asks about distance.'),
      phrase('g3', '是在前面那个路口右转吗？', '是在前面那個路口右轉嗎？', 'Shì zài qiánmiàn nà ge lùkǒu yòu zhuǎn ma?', 'Is it a right turn at that intersection ahead?', 'Confirm a direction by repeating it as a question.'),
      phrase('g4', '这趟车到市中心吗？', '這趟車到市中心嗎？', 'Zhè tàng chē dào shì zhōngxīn ma?', 'Does this train or bus go to the city center?', '趟 is a measure word for a trip or service. Context tells you whether 车 is a bus or train.'),
      phrase('g5', '麻烦在这里停一下。', '麻煩在這裡停一下。', 'Máfan zài zhèlǐ tíng yíxià.', 'Could you stop here, please?', 'A polite way to ask a driver to stop where it is safe and permitted.', 'Polite'),
      phrase('g6', '我快到了，大概还有五分钟。', '我快到了，大概還有五分鐘。', 'Wǒ kuài dào le, dàgài hái yǒu wǔ fēnzhōng.', 'I am almost there, about five more minutes.', '快…了 describes something about to happen. Useful for messaging a friend.')
    ],
    turns: [
      { zh: '你要去哪里？', traditional: '你要去哪裡？', pinyin: 'Nǐ yào qù nǎlǐ?', en: 'Where are you headed?', goal: 'You need the subway station. Ask how to get there.', correct: 'g1', options: ['g5', 'g6', 'g1'], why: 'Name the destination and ask how to get there.' },
      { zh: '一直走，到路口右转。', traditional: '一直走，到路口右轉。', pinyin: 'Yìzhí zǒu, dào lùkǒu yòu zhuǎn.', en: 'Go straight, then turn right at the intersection.', goal: 'Confirm whether they mean the intersection ahead.', correct: 'g3', options: ['g4', 'g3', 'g5'], why: 'Confirm which intersection they mean before setting off.' },
      { zh: '你到哪儿了？我在门口等你。', traditional: '你到哪兒了？我在門口等你。', pinyin: 'Nǐ dào nǎr le? Wǒ zài ménkǒu děng nǐ.', en: 'Where are you now? I am waiting at the entrance.', goal: 'Tell your friend you are almost there and estimate your arrival.', correct: 'g6', options: ['g6', 'g2', 'g4'], why: 'Give your friend a short arrival update.' }
    ]
  }
];

scenarios.push(
  {
    id: 'your-day', title: 'Tell someone about your day', short: 'How was your day?', category: 'Everyday life', icon: 'sun', color: 'sage', time: 5,
    description: 'Share a small update, say how you feel, and ask about their day.',
    situation: 'You are catching up with a friend after work. Tell them how your day went and what you feel like doing tonight.',
    phrases: [
      phrase('day1', '今天过得怎么样？', '今天過得怎麼樣？', 'Jīntiān guò de zěnmeyàng?', 'How was your day?', '过得怎么样 asks how an experience went. It invites more than a yes or no answer.', 'Friendly'),
      phrase('day2', '今天有点忙，不过还挺顺的。', '今天有點忙，不過還挺順的。', 'Jīntiān yǒudiǎn máng, búguò hái tǐng shùn de.', 'A bit busy today, but things went pretty smoothly.', 'Share one small detail next. 有点忙 sounds conversational, and 不过 adds a second side to the story.', 'Friendly'),
      phrase('day3', '我刚下班。', '我剛下班。', 'Wǒ gāng xiàbān.', 'I just finished work.', '刚 means “just” when something happened a moment ago. 下班 means finishing work, even if you work from home.', 'Friendly'),
      phrase('day4', '今天开了一天的会。', '今天開了一天的會。', 'Jīntiān kāi le yì tiān de huì.', 'I was in meetings all day.', '开会 means to have a meeting. 一天 describes how long it took; 一 becomes falling yì before first-tone 天.', 'Friendly'),
      phrase('day5', '我打算早点休息。', '我打算早點休息。', 'Wǒ dǎsuàn zǎo diǎn xiūxi.', 'I’m planning to get some rest early.', '早点 means “a little earlier.” 休息 can mean resting or going to bed, depending on the context.', 'Friendly'),
      phrase('day6', '你呢，今天怎么样？', '你呢，今天怎麼樣？', 'Nǐ ne, jīntiān zěnmeyàng?', 'What about you? How was your day?', '你呢 hands the conversation back to the other person after you share your own update.', 'Friendly')
    ],
    turns: [
      { zh: '今天怎么样，忙不忙？', traditional: '今天怎麼樣，忙不忙？', pinyin: 'Jīntiān zěnmeyàng, máng bu máng?', en: 'How was today? Was it busy?', goal: 'Say that it was busy but went smoothly.', correct: 'day2', options: ['day3', 'day2', 'day5'], why: 'Answer both parts: 有点忙 says it was busy, and 还挺顺的 says it went smoothly.' },
      { zh: '晚上还想出去吗？', traditional: '晚上還想出去嗎？', pinyin: 'Wǎnshang hái xiǎng chūqù ma?', en: 'Do you still feel like going out tonight?', goal: 'You would rather get some rest early. Say what you plan to do.', correct: 'day5', options: ['day5', 'day1', 'day4'], why: '我打算早点休息 gently explains why you would rather stay in.' },
      { zh: '那你早点休息吧。', traditional: '那你早點休息吧。', pinyin: 'Nà nǐ zǎo diǎn xiūxi ba.', en: 'Then get some rest early.', goal: 'Before ending the chat, ask how their day went.', correct: 'day6', options: ['day4', 'day3', 'day6'], why: '你呢 returns the interest and gives them room to share.' }
    ]
  },
  {
    id: 'making-plans', title: 'Turn “sometime” into a plan', short: 'Making plans', category: 'Everyday life', icon: 'calendar', color: 'peach', time: 6,
    description: 'Invite a friend, pick a time, and decide where to meet.',
    situation: 'You and a friend want to catch up this Saturday. Suggest coffee, agree on a time, and choose a meeting spot.',
    phrases: [
      phrase('plan1', '这周六有空吗？', '這週六有空嗎？', 'Zhè zhōuliù yǒu kòng ma?', 'Are you free this Saturday?', 'A simple way to start making plans. Replace 周六 with a day or time that works for you.', 'Friendly'),
      phrase('plan2', '要不要一起喝杯咖啡？', '要不要一起喝杯咖啡？', 'Yào bu yào yìqǐ hē bēi kāfēi?', 'Want to grab a coffee together?', '喝杯咖啡 is a casual invitation. 一 is often left out before 杯 here. 要不要 leaves them room to say yes or no.', 'Friendly'),
      phrase('plan3', '下午三点怎么样？', '下午三點怎麼樣？', 'Xiàwǔ sān diǎn zěnmeyàng?', 'How about three in the afternoon?', 'A time followed by 怎么样 is enough to suggest it. Confirm the day first so you both know which afternoon.', 'Friendly'),
      phrase('plan4', '我们在地铁站门口见吧。', '我們在地鐵站門口見吧。', 'Wǒmen zài dìtiězhàn ménkǒu jiàn ba.', 'Let’s meet at the subway station entrance.', '在…见 names the meeting place. For a big station, add the exit number so you can find each other.', 'Friendly'),
      phrase('plan5', '好，那就这么说定了。', '好，那就這麼說定了。', 'Hǎo, nà jiù zhème shuō dìng le.', 'Great, it’s a plan.', '说定了 means you have agreed. Use it after the details are settled.', 'Friendly'),
      phrase('plan6', '到了给我发个消息。', '到了給我發個消息。', 'Dào le gěi wǒ fā ge xiāoxi.', 'Send me a message when you get there.', '到了 introduces what to do once they arrive. With a friend, this is a normal request; add 可以吗 if you want to make it a question.', 'Friendly')
    ],
    turns: [
      { zh: '周六我没什么安排，你想做什么？', traditional: '週六我沒什麼安排，你想做什麼？', pinyin: 'Zhōuliù wǒ méi shénme ānpái, nǐ xiǎng zuò shénme?', en: 'I don’t have much planned for Saturday. What would you like to do?', goal: 'Invite them to have coffee together.', correct: 'plan2', options: ['plan5', 'plan2', 'plan6'], why: '要不要一起… offers an activity you could do together.' },
      { zh: '好啊，几点方便？', traditional: '好啊，幾點方便？', pinyin: 'Hǎo a, jǐ diǎn fāngbiàn?', en: 'Sounds good. What time works?', goal: 'Suggest three in the afternoon.', correct: 'plan3', options: ['plan4', 'plan1', 'plan3'], why: 'A specific time plus 怎么样 makes it easy to agree or suggest another time.' },
      { zh: '三点可以，我们在哪儿见？', traditional: '三點可以，我們在哪兒見？', pinyin: 'Sān diǎn kěyǐ, wǒmen zài nǎr jiàn?', en: 'Three works. Where should we meet?', goal: 'Suggest meeting at the subway station entrance.', correct: 'plan4', options: ['plan4', 'plan5', 'plan2'], why: 'Use 在…见 to name the meeting spot.' }
    ]
  },
  {
    id: 'changing-plans', title: 'Change the plan, keep it friendly', short: 'Running late & rescheduling', category: 'Everyday life', icon: 'clock', color: 'lavender', time: 6,
    description: 'Give a heads-up, suggest another time, and respond kindly.',
    situation: 'You are on your way to meet a friend, but your bus is delayed. Let them know, then find another day when they cannot wait.',
    phrases: [
      phrase('change1', '不好意思，我可能会晚一点。', '不好意思，我可能會晚一點。', 'Bù hǎoyìsi, wǒ kěnéng huì wǎn yìdiǎn.', 'Sorry, I might be a little late.', 'A short apology plus a heads-up is useful. Add an arrival estimate if you know it.', 'Friendly & polite'),
      phrase('change2', '我坐的公交车晚点了。', '我坐的公交車晚點了。', 'Wǒ zuò de gōngjiāochē wǎndiǎn le.', 'The bus I’m on is running late.', '晚点 means a service is delayed. 公交车 means bus; in Taiwan you will more often hear 公车, pronounced gōngchē.', 'Friendly & polite'),
      phrase('change3', '估计还要十分钟。', '估計還要十分鐘。', 'Gūjì hái yào shí fēnzhōng.', 'It’ll probably take another ten minutes.', '估计 marks an estimate. 还要…分钟 means that many more minutes are needed.', 'Friendly & polite'),
      phrase('change4', '要不我们改天再约？', '要不我們改天再約？', 'Yàobu wǒmen gǎitiān zài yuē?', 'How about meeting another day?', '改天 means another day, without picking one yet. Suggest a specific date next if you want to keep the plan moving.', 'Friendly & polite'),
      phrase('change5', '明天这个时间可以吗？', '明天這個時間可以嗎？', 'Míngtiān zhège shíjiān kěyǐ ma?', 'Would this time tomorrow work?', '这个时间 refers to the meeting time you already agreed on. Say the exact time again if there could be confusion.', 'Friendly & polite'),
      phrase('change6', '没事，不着急。', '沒事，不著急。', 'Méi shì, bù zháojí.', 'No worries. There’s no rush.', 'Use this when someone else is late and you really have time to wait. 没事 here means it is okay.', 'Friendly')
    ],
    turns: [
      { zh: '我已经到门口了，你到哪儿了？', traditional: '我已經到門口了，你到哪兒了？', pinyin: 'Wǒ yǐjīng dào ménkǒu le, nǐ dào nǎr le?', en: 'I’m already at the entrance. Where are you?', goal: 'Explain that your bus is delayed.', correct: 'change2', options: ['change6', 'change4', 'change2'], why: 'Explain what is holding you up before giving an estimate.' },
      { zh: '没事，大概还要多久？', traditional: '沒事，大概還要多久？', pinyin: 'Méi shì, dàgài hái yào duō jiǔ?', en: 'No worries. Roughly how much longer?', goal: 'Estimate another ten minutes.', correct: 'change3', options: ['change3', 'change1', 'change5'], why: '还要十分钟 answers how much longer; 估计 makes clear it is an estimate.' },
      { zh: '今天我可能等不了了，我们换个时间吧。', traditional: '今天我可能等不了了，我們換個時間吧。', pinyin: 'Jīntiān wǒ kěnéng děng bu liǎo le, wǒmen huàn ge shíjiān ba.', en: 'I might not be able to wait today. Let’s find another time.', goal: 'Offer the same time tomorrow as a specific alternative.', correct: 'change5', options: ['change6', 'change5', 'change3'], why: 'Name a specific alternative so they can check whether it works.' }
    ]
  },
  {
    id: 'interests', title: 'Find something you both enjoy', short: 'Shows, hobbies & recommendations', category: 'Everyday life', icon: 'play', color: 'blue', time: 6,
    description: 'Talk about what you are watching and ask a real follow-up.',
    situation: 'A friend mentions a show they have been watching. Ask about it, share a little about yourself, and keep the conversation going.',
    phrases: [
      phrase('interest1', '你最近在看什么？', '你最近在看什麼？', 'Nǐ zuìjìn zài kàn shénme?', 'What have you been watching lately?', 'When you are already talking about shows, 看 naturally means watching. In another context it could mean reading.', 'Friendly'),
      phrase('interest2', '我最近在看一部新剧。', '我最近在看一部新劇。', 'Wǒ zuìjìn zài kàn yí bù xīn jù.', 'I’ve been watching a new show lately.', '部 is a measure word for shows and films. 新剧 is a new show or drama; name it next.', 'Friendly'),
      phrase('interest3', '主要讲什么？', '主要講什麼？', 'Zhǔyào jiǎng shénme?', 'What’s it mainly about?', '讲 here means what the story is about. You can omit the subject once you both know which show you mean.', 'Friendly'),
      phrase('interest4', '你觉得好看吗？', '你覺得好看嗎？', 'Nǐ juéde hǎokàn ma?', 'Do you think it’s good?', 'For a show or film, 好看 means enjoyable to watch. For clothes, it can mean good-looking.', 'Friendly'),
      phrase('interest5', '听你这么一说，我也想看看。', '聽你這麼一說，我也想看看。', 'Tīng nǐ zhème yì shuō, wǒ yě xiǎng kànkan.', 'Now that you’ve told me about it, I want to check it out too.', '这么一说 means “putting it that way / hearing you say that.” 看看 makes trying it sound relaxed.', 'Friendly'),
      phrase('interest6', '看完了我们再聊。', '看完了我們再聊。', 'Kàn wán le wǒmen zài liáo.', 'Let’s talk about it once I’ve finished watching.', '看完了 sets the point when you will talk. The subject can be left out when it is clear from context.', 'Friendly')
    ],
    turns: [
      { zh: '我最近在追一部剧，还挺有意思的。', traditional: '我最近在追一部劇，還挺有意思的。', pinyin: 'Wǒ zuìjìn zài zhuī yí bù jù, hái tǐng yǒu yìsi de.', en: 'I’ve been following a show lately. It’s pretty interesting.', goal: 'Ask what the show is about.', correct: 'interest3', options: ['interest6', 'interest3', 'interest2'], why: '主要讲什么 asks about the story rather than changing the subject to your own show.' },
      { zh: '讲的是几个朋友一起开店的故事。', traditional: '講的是幾個朋友一起開店的故事。', pinyin: 'Jiǎng de shì jǐ ge péngyou yìqǐ kāi diàn de gùshi.', en: 'It’s about a few friends opening a shop together.', goal: 'Ask whether they think it is good to watch.', correct: 'interest4', options: ['interest1', 'interest2', 'interest4'], why: '你觉得好看吗 asks for their personal take on the show.' },
      { zh: '挺好看的，人物也很有意思，你应该会喜欢。', traditional: '挺好看的，人物也很有意思，你應該會喜歡。', pinyin: 'Tǐng hǎokàn de, rénwù yě hěn yǒu yìsi, nǐ yīnggāi huì xǐhuan.', en: 'It’s really enjoyable, and the characters are interesting. I think you’d like it.', goal: 'Say that their description makes you want to check it out too.', correct: 'interest5', options: ['interest5', 'interest6', 'interest1'], why: '听你这么一说 shows that their recommendation has interested you.' }
    ]
  },
  {
    id: 'shopping', title: 'Find the right fit', short: 'Shopping & exchanging things', category: 'Everyday life', icon: 'bookmark', color: 'sand', time: 6,
    description: 'Try something on, ask about sizes, and check the exchange policy.',
    situation: 'You are looking at a jacket in a shop. Try it on, ask for a larger size, and check whether exchanges are possible.',
    phrases: [
      phrase('shop1', '这个有别的颜色吗？', '這個有別的顏色嗎？', 'Zhège yǒu bié de yánsè ma?', 'Does this come in other colors?', '别的 means other or different. Point to the item so 这个 is clear.', 'Friendly & polite'),
      phrase('shop2', '我可以试一下吗？', '我可以試一下嗎？', 'Wǒ kěyǐ shì yíxià ma?', 'Could I try it on?', 'In a clothing shop, 试一下 can mean trying it on. 试穿 names trying on clothes explicitly.', 'Friendly & polite'),
      phrase('shop3', '这件有点小，有大一点的吗？', '這件有點小，有大一點的嗎？', 'Zhè jiàn yǒudiǎn xiǎo, yǒu dà yìdiǎn de ma?', 'This one’s a little small. Do you have a larger one?', '件 is used for many items of clothing. 有点小 describes the problem; 大一点 asks for a slightly larger size.', 'Friendly & polite'),
      phrase('shop4', '我再看看，谢谢。', '我再看看，謝謝。', 'Wǒ zài kànkan, xièxie.', 'I’ll keep looking, thanks.', 'A short way to step back from a purchase without making an excuse. 再看看 can mean looking around a bit more.', 'Friendly & polite'),
      phrase('shop5', '如果不合适，可以换吗？', '如果不合適，可以換嗎？', 'Rúguǒ bù héshì, kěyǐ huàn ma?', 'If it doesn’t fit, can I exchange it?', '换 asks about an exchange; 退 asks about a return. Store policies vary, so ask before buying.', 'Friendly & polite'),
      phrase('shop6', '好，我就要这件。', '好，我就要這件。', 'Hǎo, wǒ jiù yào zhè jiàn.', 'Great, I’ll take this one.', '就 here signals that you have settled on this choice. 件 refers back to the piece of clothing.', 'Friendly & polite')
    ],
    turns: [
      { zh: '这件外套你喜欢吗？', traditional: '這件外套你喜歡嗎？', pinyin: 'Zhè jiàn wàitào nǐ xǐhuan ma?', en: 'Do you like this jacket?', goal: 'Ask to try it on before deciding.', correct: 'shop2', options: ['shop6', 'shop2', 'shop5'], why: 'Ask permission with 我可以…吗 before trying it on.' },
      { zh: '穿上感觉怎么样？', traditional: '穿上感覺怎麼樣？', pinyin: 'Chuān shàng gǎnjué zěnmeyàng?', en: 'How does it feel on?', goal: 'It is too small. Ask for a larger size.', correct: 'shop3', options: ['shop3', 'shop1', 'shop4'], why: 'Describe the fit first, then ask whether they have something larger.' },
      { zh: '大一号的在这儿，要这件吗？', traditional: '大一號的在這兒，要這件嗎？', pinyin: 'Dà yí hào de zài zhèr, yào zhè jiàn ma?', en: 'Here’s one size larger. Would you like this one?', goal: 'Before buying, check whether an exchange is possible if it does not fit.', correct: 'shop5', options: ['shop4', 'shop6', 'shop5'], why: '可以换吗 checks the exchange policy; it does not assume that an exchange is allowed.' }
    ]
  },
  {
    id: 'cooking', title: 'Figure out dinner together', short: 'Groceries & cooking', category: 'Everyday life', icon: 'bowl', color: 'peach', time: 6,
    description: 'Decide what to cook, check what you need, and offer to help.',
    situation: 'You and a friend are making dinner at home. Choose a simple meal and split up the small jobs.',
    phrases: [
      phrase('cook1', '晚上想吃点什么？', '晚上想吃點什麼？', 'Wǎnshang xiǎng chī diǎn shénme?', 'What do you feel like having for dinner?', '吃点什么 sounds relaxed and leaves the options open. The evening context makes this about dinner.', 'Friendly'),
      phrase('cook2', '要不我们做个简单的？', '要不我們做個簡單的？', 'Yàobu wǒmen zuò ge jiǎndān de?', 'How about making something simple?', 'The food is already understood, so 简单的 can stand for “something simple.” 要不 turns it into a suggestion.', 'Friendly'),
      phrase('cook3', '家里还有什么菜？', '家裡還有什麼菜？', 'Jiālǐ hái yǒu shénme cài?', 'What vegetables do we still have at home?', '菜 can mean vegetables, dishes, or food. Here you are checking ingredients before cooking.', 'Friendly'),
      phrase('cook4', '我顺路去买点东西。', '我順路去買點東西。', 'Wǒ shùnlù qù mǎi diǎn dōngxi.', 'I’ll pick up a few things on the way.', '顺路 means it is on your way. 买点东西 is a casual way to say you will pick up a few things.', 'Friendly'),
      phrase('cook5', '还需要我带什么吗？', '還需要我帶什麼嗎？', 'Hái xūyào wǒ dài shénme ma?', 'Is there anything else you need me to bring?', '还 asks whether anything else is needed. 带 means bringing something with you.', 'Friendly'),
      phrase('cook6', '我来洗菜，你来切吧。', '我來洗菜，你來切吧。', 'Wǒ lái xǐ cài, nǐ lái qiē ba.', 'I’ll wash the vegetables. How about you chop?', '我来… volunteers for a job. 吧 makes your suggestion for the other person less abrupt.', 'Friendly')
    ],
    turns: [
      { zh: '今天有点累，不想做太复杂的。', traditional: '今天有點累，不想做太複雜的。', pinyin: 'Jīntiān yǒudiǎn lèi, bù xiǎng zuò tài fùzá de.', en: 'I’m a bit tired today. I don’t want to make anything too complicated.', goal: 'Suggest making something simple.', correct: 'cook2', options: ['cook5', 'cook2', 'cook1'], why: '做个简单的 responds to their energy level and proposes an easy meal.' },
      { zh: '好啊，不过家里好像没什么菜了。', traditional: '好啊，不過家裡好像沒什麼菜了。', pinyin: 'Hǎo a, búguò jiālǐ hǎoxiàng méi shénme cài le.', en: 'Sounds good, but I don’t think we have many vegetables left at home.', goal: 'Offer to pick up a few things on your way.', correct: 'cook4', options: ['cook3', 'cook6', 'cook4'], why: '我顺路去买点东西 offers a practical way to get the ingredients.' },
      { zh: '菜买好了，我们开始做吧。', traditional: '菜買好了，我們開始做吧。', pinyin: 'Cài mǎi hǎo le, wǒmen kāishǐ zuò ba.', en: 'We’ve got the vegetables. Let’s start cooking.', goal: 'Offer to wash the vegetables and suggest that they chop.', correct: 'cook6', options: ['cook6', 'cook1', 'cook5'], why: '我来… takes a task, then 你来…吧 suggests how to share the work.' }
    ]
  },
  {
    id: 'visiting', title: 'Feel at home with friends', short: 'Visiting someone’s home', category: 'Everyday life', icon: 'home', color: 'sage', time: 5,
    description: 'Arrive, offer a hand, and say thanks before heading home.',
    situation: 'A friend has invited you over for dinner. You arrive with fruit, help set up, and thank them before leaving.',
    phrases: [
      phrase('visit1', '要换鞋吗？', '要換鞋嗎？', 'Yào huàn xié ma?', 'Should I change my shoes?', 'Ask rather than assuming the household’s preference. They may offer slippers or ask you just to take your shoes off.', 'Friendly & polite'),
      phrase('visit2', '我带了点水果。', '我帶了點水果。', 'Wǒ dài le diǎn shuǐguǒ.', 'I brought some fruit.', '带了点… introduces a small thing you brought. It sounds easygoing and does not make a big ceremony of the gift.', 'Friendly'),
      phrase('visit3', '有什么我能帮忙的吗？', '有什麼我能幫忙的嗎？', 'Yǒu shénme wǒ néng bāngmáng de ma?', 'Is there anything I can help with?', 'A friendly offer when a host is busy. 帮忙 is “lend a hand”; with a specific task, you can say 帮你摆碗筷, “help you set the table.”', 'Friendly & polite'),
      phrase('visit4', '这个真好吃，是你做的吗？', '這個真好吃，是你做的嗎？', 'Zhège zhēn hǎochī, shì nǐ zuò de ma?', 'This is really good. Did you make it?', 'A compliment plus a follow-up gives the host something to respond to. 真 adds sincere enthusiasm.', 'Friendly'),
      phrase('visit5', '今天谢谢你，我先回去了。', '今天謝謝你，我先回去了。', 'Jīntiān xièxie nǐ, wǒ xiān huíqù le.', 'Thanks for today. I’m going to head home.', '我先… signals that you are leaving or doing something ahead of the others. 回去了 can announce that you are about to head home.', 'Friendly & polite'),
      phrase('visit6', '下次来我家玩。', '下次來我家玩。', 'Xià cì lái wǒ jiā wán.', 'Come over to my place next time.', '来我家玩 means coming over to hang out, even when no games are involved. It is a friendly invitation.', 'Friendly')
    ],
    turns: [
      { zh: '你来啦，快进来！', traditional: '你來啦，快進來！', pinyin: 'Nǐ lái la, kuài jìnlai!', en: 'You’re here! Come on in!', goal: 'Check whether you should change your shoes before entering.', correct: 'visit1', options: ['visit4', 'visit1', 'visit5'], why: '要换鞋吗 checks the household’s preference without assuming.' },
      { zh: '我还在准备晚饭，你先坐一下。', traditional: '我還在準備晚飯，你先坐一下。', pinyin: 'Wǒ hái zài zhǔnbèi wǎnfàn, nǐ xiān zuò yíxià.', en: 'I’m still getting dinner ready. Have a seat for a moment.', goal: 'Offer to help with the preparations.', correct: 'visit3', options: ['visit6', 'visit2', 'visit3'], why: '有什么我能帮忙的吗 offers a hand while letting your host decide what would help.' },
      { zh: '不早了，回去路上慢点。', traditional: '不早了，回去路上慢點。', pinyin: 'Bù zǎo le, huíqù lùshang màn diǎn.', en: 'It’s getting late. Take care on your way home.', goal: 'Thank your host and say you are heading home.', correct: 'visit5', options: ['visit5', 'visit1', 'visit4'], why: '谢谢你 acknowledges their hospitality, and 我先回去了 is a natural way to take your leave.' }
    ]
  },
  {
    id: 'small-problems', title: 'Handle a small everyday snag', short: 'Asking for a little help', category: 'Everyday life', icon: 'settings', color: 'blue', time: 6,
    description: 'Explain what is wrong, ask for help, and check how to fix it.',
    situation: 'You are visiting a friend, but your phone is almost out of battery and will not connect to the Wi-Fi. Ask for a little help.',
    phrases: [
      phrase('help1', '能帮我个忙吗？', '能幫我個忙嗎？', 'Néng bāng wǒ ge máng ma?', 'Could you do me a favor?', 'A short opener before saying what you need. Explain the favor next so they can decide whether they can help.', 'Friendly & polite'),
      phrase('help2', '我手机快没电了。', '我手機快沒電了。', 'Wǒ shǒujī kuài méi diàn le.', 'My phone’s almost out of battery.', '快…了 describes something about to happen. 没电 means out of battery or power.', 'Friendly'),
      phrase('help3', '你有充电器吗？借我用一下可以吗？', '你有充電器嗎？借我用一下可以嗎？', 'Nǐ yǒu chōngdiànqì ma? Jiè wǒ yòng yíxià kěyǐ ma?', 'Do you have a charger? Could I borrow it for a moment?', '借我用一下 asks to borrow it briefly. 可以吗 checks that they are okay with lending it.', 'Friendly & polite'),
      phrase('help4', '我好像连不上网。', '我好像連不上網。', 'Wǒ hǎoxiàng lián bu shàng wǎng.', 'I can’t seem to get online.', '好像 means “it seems.” 连不上 says you cannot get connected; 不 is often neutral bu in this potential complement.', 'Friendly'),
      phrase('help5', '这个怎么弄？', '這個怎麼弄？', 'Zhège zěnme nòng?', 'How do I do this?', '弄 is an everyday verb for doing or handling something. Point to the setting or step you mean, and ask with a curious tone.', 'Friendly'),
      phrase('help6', '好了，能用了，谢谢！', '好了，能用了，謝謝！', 'Hǎo le, néng yòng le, xièxie!', 'It’s working now, thanks!', '好了 marks that the problem is sorted out. 能用了 says you can use it now.', 'Friendly')
    ],
    turns: [
      { zh: '你怎么一直在找插座？', traditional: '你怎麼一直在找插座？', pinyin: 'Nǐ zěnme yìzhí zài zhǎo chāzuò?', en: 'Why do you keep looking for an outlet?', goal: 'Explain that your phone is almost out of battery.', correct: 'help2', options: ['help1', 'help6', 'help2'], why: '快没电了 explains why you are looking for somewhere to charge your phone.' },
      { zh: '这边能充电。你还要连网吗？', traditional: '這邊能充電。你還要連網嗎？', pinyin: 'Zhèbiān néng chōngdiàn. Nǐ hái yào lián wǎng ma?', en: 'You can charge it here. Do you also want to get online?', goal: 'Say that you cannot seem to connect.', correct: 'help4', options: ['help4', 'help2', 'help3'], why: '连不上网 names the connection problem; 好像 makes it a tentative observation.' },
      { zh: '把无线网络关掉再打开，试试看。', traditional: '把無線網絡關掉再打開，試試看。', pinyin: 'Bǎ wúxiàn wǎngluò guān diào zài dǎkāi, shìshi kàn.', en: 'Turn Wi-Fi off and back on, and give it a try.', goal: 'It works now. Tell your friend and thank them.', correct: 'help6', options: ['help5', 'help3', 'help6'], why: '能用了 tells them the fix worked, followed by a simple 谢谢.' }
    ]
  }
);

scenarios.push(...additionalScenarios);

export const phrases = scenarios.flatMap(scene => scene.phrases.map(p => ({ ...p, sceneId: scene.id, sceneTitle: scene.short, category: scene.category })));
export const phraseById = id => phrases.find(p => p.id === id);
