// A practical starter list, grouped by use rather than a proficiency exam level.
// Pinyin follows the same spoken 一/不 and neutral-tone conventions as the lessons.
const vocabEntry = (id, zh, traditional, pinyin, en, note, exampleZh, exampleTraditional, examplePinyin, exampleEn) => ({
  id: `v_${id}`, zh, traditional, pinyin, en, note,
  example: { zh: exampleZh, traditional: exampleTraditional, pinyin: examplePinyin, en: exampleEn },
  kind: 'vocabulary', register: 'Common word'
});

export const vocabularyGroups = [
  { id: 'time', title: 'Time & routines', category: 'Everyday life', words: [
    vocabEntry('recent', '最近', '最近', 'zuìjìn', 'recently; lately', 'Use for a recent stretch of time, not just the present moment.', '最近工作有点忙。', '最近工作有點忙。', 'Zuìjìn gōngzuò yǒudiǎn máng.', 'Work has been a bit busy lately.'),
    vocabEntry('just-now', '刚才', '剛才', 'gāngcái', 'just now; a moment ago', 'Points to a short time before now. 刚才说的 means “what was said just now.”', '你刚才说什么？', '你剛才說什麼？', 'Nǐ gāngcái shuō shénme?', 'What did you just say?'),
    vocabEntry('already', '已经', '已經', 'yǐjīng', 'already', 'Often used with sentence-final 了 to mark a change or completed state.', '我已经吃过了。', '我已經吃過了。', 'Wǒ yǐjīng chī guo le.', 'I’ve already eaten.'),
    vocabEntry('still', '还', '還', 'hái', 'still; also', 'Here it is hái, as in “still.” When it means returning something, it is huán.', '你还在公司吗？', '你還在公司嗎？', 'Nǐ hái zài gōngsī ma?', 'Are you still at the office?'),
    vocabEntry('first', '先', '先', 'xiān', 'first; before doing something else', '先…再… gives an order: do this first, then that.', '你先坐，我去倒水。', '你先坐，我去倒水。', 'Nǐ xiān zuò, wǒ qù dào shuǐ.', 'Have a seat first. I’ll get some water.'),
    vocabEntry('again', '再', '再', 'zài', 'again; then', 'Use 再 for another time that has not happened yet. 又 often describes a repeat that has already happened.', '我们明天再聊。', '我們明天再聊。', 'Wǒmen míngtiān zài liáo.', 'Let’s talk again tomorrow.'),
    vocabEntry('right-away', '马上', '馬上', 'mǎshàng', 'right away; very soon', 'Useful for an imminent action. Add a realistic estimate when timing matters.', '我马上就到。', '我馬上就到。', 'Wǒ mǎshàng jiù dào.', 'I’ll be there very soon.'),
    vocabEntry('usually', '一般', '一般', 'yìbān', 'usually; generally', 'For routines, 一般 means “usually.” In 这家店很一般 it can instead mean “ordinary” or “so-so.”', '我一般八点出门。', '我一般八點出門。', 'Wǒ yìbān bā diǎn chū mén.', 'I usually leave home at eight.')
  ] },
  { id: 'conversation', title: 'Connecting your thoughts', category: 'Everyday life', words: [
    vocabEntry('think', '觉得', '覺得', 'juéde', 'to think; to feel', 'A natural way to introduce an opinion or personal impression.', '我觉得这样挺好。', '我覺得這樣挺好。', 'Wǒ juéde zhèyàng tǐng hǎo.', 'I think this works pretty well.'),
    vocabEntry('actually', '其实', '其實', 'qíshí', 'actually; in fact', 'Often adds something different from what the other person might expect.', '其实我也不太清楚。', '其實我也不太清楚。', 'Qíshí wǒ yě bú tài qīngchu.', 'Actually, I’m not too sure either.'),
    vocabEntry('maybe', '可能', '可能', 'kěnéng', 'maybe; possibly', 'Leaves room for uncertainty. Put it before the action or description.', '我可能会晚一点。', '我可能會晚一點。', 'Wǒ kěnéng huì wǎn yìdiǎn.', 'I might be a little late.'),
    vocabEntry('should', '应该', '應該', 'yīnggāi', 'should; probably', 'Can express advice or an expectation. Context decides whether “should” means ought to or is likely to.', '明天应该能做完。', '明天應該能做完。', 'Míngtiān yīnggāi néng zuò wán.', 'I should be able to finish tomorrow.'),
    vocabEntry('or-question', '还是', '還是', 'háishi', 'or, when asking a choice', 'Use 还是 between options in a choice question. It also means “still” in other contexts.', '你想喝茶还是咖啡？', '你想喝茶還是咖啡？', 'Nǐ xiǎng hē chá háishi kāfēi?', 'Would you like tea or coffee?'),
    vocabEntry('or-statement', '或者', '或者', 'huòzhě', 'or, when listing possibilities', 'Usually lists alternatives in a statement, unlike 还是 in a choice question.', '周六或者周日都可以。', '週六或者週日都可以。', 'Zhōuliù huòzhě zhōurì dōu kěyǐ.', 'Either Saturday or Sunday works.'),
    vocabEntry('so', '所以', '所以', 'suǒyǐ', 'so; therefore', 'Introduces a result. In casual conversation the reason can come just before it.', '今天下雨，所以我没出门。', '今天下雨，所以我沒出門。', 'Jīntiān xià yǔ, suǒyǐ wǒ méi chū mén.', 'It rained today, so I didn’t go out.'),
    vocabEntry('because', '因为', '因為', 'yīnwèi', 'because', 'Introduces a reason. A complete Chinese sentence can use both 因为 and 所以.', '因为有点累，我想早点回家。', '因為有點累，我想早點回家。', 'Yīnwèi yǒudiǎn lèi, wǒ xiǎng zǎo diǎn huí jiā.', 'I want to head home early because I’m a bit tired.')
  ] },
  { id: 'work', title: 'Work & your team', category: 'At work', words: [
    vocabEntry('progress', '进度', '進度', 'jìndù', 'progress', 'Talk about how a task is coming along. Add the feature or project when it is not obvious.', '我跟你说一下进度。', '我跟你說一下進度。', 'Wǒ gēn nǐ shuō yíxià jìndù.', 'Let me give you a quick progress update.'),
    vocabEntry('issue', '问题', '問題', 'wèntí', 'question; problem; issue', 'Can mean a question to ask or a problem to solve. Context supplies the meaning.', '我想问个问题。', '我想問個問題。', 'Wǒ xiǎng wèn ge wèntí.', 'I’d like to ask a question.'),
    vocabEntry('feedback', '反馈', '反饋', 'fǎnkuì', 'feedback', 'Useful for comments on a design, document, or code change.', '我在等你的反馈。', '我在等你的反饋。', 'Wǒ zài děng nǐ de fǎnkuì.', 'I’m waiting for your feedback.'),
    vocabEntry('confirm', '确认', '確認', 'quèrèn', 'to confirm; to check', '确认一下 is a friendly way to double-check rather than silently assume.', '我确认一下时间。', '我確認一下時間。', 'Wǒ quèrèn yíxià shíjiān.', 'Let me double-check the time.'),
    vocabEntry('revise', '修改', '修改', 'xiūgǎi', 'to revise; to modify', 'Common for editing code, text, or a design. 改一下 is a more casual alternative.', '这部分我再修改一下。', '這部分我再修改一下。', 'Zhè bùfen wǒ zài xiūgǎi yíxià.', 'I’ll revise this part a bit more.'),
    vocabEntry('finish', '完成', '完成', 'wánchéng', 'to complete; to finish', 'Useful at work; 做完 is another everyday way to say a task is finished.', '这个任务已经完成了。', '這個任務已經完成了。', 'Zhège rènwu yǐjīng wánchéng le.', 'This task is already finished.'),
    vocabEntry('meeting', '会议', '會議', 'huìyì', 'meeting', 'The noun is 会议; “to have a meeting” is commonly 开会.', '下午有个会议。', '下午有個會議。', 'Xiàwǔ yǒu ge huìyì.', 'There’s a meeting this afternoon.'),
    vocabEntry('convenient', '方便', '方便', 'fāngbiàn', 'convenient; available to do something', '你方便…吗 checks whether something works for the other person.', '你现在方便聊一下吗？', '你現在方便聊一下嗎？', 'Nǐ xiànzài fāngbiàn liáo yíxià ma?', 'Is now a good time for a quick chat?')
  ] },
  { id: 'food', title: 'Food & everyday errands', category: 'Everyday life', words: [
    vocabEntry('order', '点', '點', 'diǎn', 'to order food or drinks', '点 has several meanings. Here it is the verb for placing an order, not a time or a small amount.', '我们先点菜吧。', '我們先點菜吧。', 'Wǒmen xiān diǎn cài ba.', 'Let’s order food first.'),
    vocabEntry('portion', '份', '份', 'fèn', 'portion; measure word for servings', 'Use a number plus 份 for a portion or serving. It also counts copies of documents.', '我要一份炒饭。', '我要一份炒飯。', 'Wǒ yào yí fèn chǎofàn.', 'I’d like one serving of fried rice.'),
    vocabEntry('spicy', '辣', '辣', 'là', 'spicy', 'Use 辣不辣 to ask whether something is spicy. The middle 不 is light bu in this question pattern.', '这个辣不辣？', '這個辣不辣？', 'Zhège là bu là?', 'Is this spicy?'),
    vocabEntry('takeaway', '打包', '打包', 'dǎbāo', 'to pack up; to take away', 'At a restaurant, ask to have food packed to go or leftovers boxed up.', '剩下的能打包吗？', '剩下的能打包嗎？', 'Shèng xià de néng dǎbāo ma?', 'Could you pack up what’s left?'),
    vocabEntry('bill', '结账', '結帳', 'jiézhàng', 'to pay the bill; to check out', 'Useful at a restaurant or a shop. 买单 is another common restaurant expression.', '你好，我们想结账。', '你好，我們想結帳。', 'Nǐ hǎo, wǒmen xiǎng jiézhàng.', 'Hi, we’d like to pay the bill.'),
    vocabEntry('groceries', '买菜', '買菜', 'mǎi cài', 'to buy groceries; to shop for cooking', '菜 here can mean food ingredients more broadly, not just vegetables.', '我下班以后去买菜。', '我下班以後去買菜。', 'Wǒ xià bān yǐhòu qù mǎi cài.', 'I’m going grocery shopping after work.'),
    vocabEntry('ingredients', '食材', '食材', 'shícái', 'ingredients', 'Refers to ingredients used in cooking. Name the dish if you want a specific shopping list.', '做这个需要什么食材？', '做這個需要什麼食材？', 'Zuò zhège xūyào shénme shícái?', 'What ingredients do we need to make this?'),
    vocabEntry('enough', '够', '夠', 'gòu', 'enough; to be enough', 'Often comes after the thing being measured: 时间够吗, “Is there enough time?”', '这些够我们两个人吃吗？', '這些夠我們兩個人吃嗎？', 'Zhèxiē gòu wǒmen liǎng ge rén chī ma?', 'Is this enough for the two of us to eat?')
  ] },
  { id: 'travel', title: 'Getting around', category: 'Everyday life', words: [
    vocabEntry('nearby', '附近', '附近', 'fùjìn', 'nearby; the area around somewhere', 'Can stand alone or follow a place, such as 公司附近, “near the office.”', '这附近有咖啡店吗？', '這附近有咖啡店嗎？', 'Zhè fùjìn yǒu kāfēidiàn ma?', 'Is there a café nearby?'),
    vocabEntry('intersection', '路口', '路口', 'lùkǒu', 'intersection; junction', 'Useful for identifying where to turn or meet.', '我们在下个路口见。', '我們在下個路口見。', 'Wǒmen zài xià ge lùkǒu jiàn.', 'Let’s meet at the next intersection.'),
    vocabEntry('subway', '地铁', '地鐵', 'dìtiě', 'subway; metro', '地铁 is common in mainland Mandarin. Taiwan generally uses 捷运 / 捷運 (jiéyùn).', '坐地铁比较快。', '坐地鐵比較快。', 'Zuò dìtiě bǐjiào kuài.', 'Taking the subway is faster.'),
    vocabEntry('transfer', '换乘', '換乘', 'huànchéng', 'to transfer between transit services', 'Useful for switching trains, lines, or other public transport.', '我们要在哪里换乘？', '我們要在哪裡換乘？', 'Wǒmen yào zài nǎlǐ huànchéng?', 'Where do we need to transfer?'),
    vocabEntry('get-off', '下车', '下車', 'xià chē', 'to get off; to get out of a vehicle', 'Use for leaving a bus, train, or car. 上车 means getting on or in.', '我下一站下车。', '我下一站下車。', 'Wǒ xià yí zhàn xià chē.', 'I’m getting off at the next stop.'),
    vocabEntry('walk', '走路', '走路', 'zǒu lù', 'to walk; to go on foot', 'Useful for asking how long a journey takes on foot.', '走路过去要多久？', '走路過去要多久？', 'Zǒu lù guòqu yào duō jiǔ?', 'How long does it take to walk there?'),
    vocabEntry('traffic', '堵车', '堵車', 'dǔ chē', 'traffic congestion; to be stuck in traffic', 'Say 路上堵车 to explain traffic on the way.', '路上有点堵车，我会晚一点。', '路上有點堵車，我會晚一點。', 'Lùshang yǒudiǎn dǔ chē, wǒ huì wǎn yìdiǎn.', 'There’s some traffic. I’ll be a little late.'),
    vocabEntry('on-the-way', '顺路', '順路', 'shùnlù', 'on the way; along the same route', 'Useful for an errand or favor that fits an existing journey.', '我顺路帮你买杯咖啡。', '我順路幫你買杯咖啡。', 'Wǒ shùnlù bāng nǐ mǎi bēi kāfēi.', 'I’ll pick up a coffee for you on the way.')
  ] },
  { id: 'feelings', title: 'Feelings & availability', category: 'Everyday life', words: [
    vocabEntry('busy', '忙', '忙', 'máng', 'busy', '有点忙 means “a bit busy.” You can give a short reason and suggest a better time.', '我现在有点忙，晚点聊可以吗？', '我現在有點忙，晚點聊可以嗎？', 'Wǒ xiànzài yǒudiǎn máng, wǎn diǎn liáo kěyǐ ma?', 'I’m a bit busy now. Could we talk later?'),
    vocabEntry('tired', '累', '累', 'lèi', 'tired', 'Use 有点累 for “a little tired” or 太累了 for “really tired.”', '今天有点累，想早点睡。', '今天有點累，想早點睡。', 'Jīntiān yǒudiǎn lèi, xiǎng zǎo diǎn shuì.', 'I’m a bit tired today and want to sleep early.'),
    vocabEntry('comfortable', '舒服', '舒服', 'shūfu', 'comfortable; feeling well', 'Can describe physical comfort or how you feel. 不舒服 often means feeling unwell.', '这把椅子很舒服。', '這把椅子很舒服。', 'Zhè bǎ yǐzi hěn shūfu.', 'This chair is comfortable.'),
    vocabEntry('worry', '担心', '擔心', 'dānxīn', 'to worry; to be worried about', 'Follow with the person, situation, or possibility you are concerned about.', '我有点担心时间不够。', '我有點擔心時間不夠。', 'Wǒ yǒudiǎn dānxīn shíjiān bú gòu.', 'I’m a bit worried there won’t be enough time.'),
    vocabEntry('reassured', '放心', '放心', 'fàngxīn', 'to feel reassured; to stop worrying', '你放心 can reassure someone, especially when followed by what you will do.', '你放心，我会提前跟你说。', '你放心，我會提前跟你說。', 'Nǐ fàngxīn, wǒ huì tíqián gēn nǐ shuō.', 'Don’t worry. I’ll let you know in advance.'),
    vocabEntry('used-to', '习惯', '習慣', 'xíguàn', 'habit; to be used to', 'Can be a noun or a verb. 还不太习惯 means you are still adjusting.', '我还不太习惯早起。', '我還不太習慣早起。', 'Wǒ hái bú tài xíguàn zǎo qǐ.', 'I’m still not quite used to getting up early.'),
    vocabEntry('free-time', '有空', '有空', 'yǒu kòng', 'to have free time; to be available', '空 is fourth-tone kòng for available time, rather than kōng meaning “empty.”', '你周末有空吗？', '你週末有空嗎？', 'Nǐ zhōumò yǒu kòng ma?', 'Are you free this weekend?'),
    vocabEntry('trouble', '麻烦', '麻煩', 'máfan', 'trouble; to trouble someone', '麻烦你… introduces a considerate request. As a description, 很麻烦 means troublesome.', '麻烦你帮我看一下。', '麻煩你幫我看一下。', 'Máfan nǐ bāng wǒ kàn yíxià.', 'Could you take a look for me?')
  ] }
];

export const vocabulary = vocabularyGroups.flatMap(group => group.words.map(word => ({ ...word,
  topic: group.id, sceneTitle: group.title, category: group.category
})));
export const vocabularyById = id => vocabulary.find(word => word.id === id);
const vocabSearchKey = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\s]/g, '');
export function selectVocabulary({ query = '', topic = 'all', savedOnly = false, saved = [] } = {}) {
  const needle = vocabSearchKey(query.trim());
  return vocabulary.filter(word => (topic === 'all' || word.topic === topic) && (!savedOnly || saved.includes(word.id)) &&
    (!needle || [word.zh, word.traditional, word.pinyin, word.en, word.sceneTitle, ...Object.values(word.example)].some(text => vocabSearchKey(text).includes(needle))));
}
