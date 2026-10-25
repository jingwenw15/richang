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
  ] },
  { id: 'planning', title: 'Plans & getting things done', category: 'Everyday life', words: [
    vocabEntry('need', '需要', '需要', 'xūyào', 'to need', 'Follow with a thing or an action. 不需要 means something is not necessary.', '你需要我帮忙吗？', '你需要我幫忙嗎？', 'Nǐ xūyào wǒ bāngmáng ma?', 'Do you need a hand?'),
    vocabEntry('arrange', '安排', '安排', 'ānpái', 'to arrange; a plan or arrangement', 'Can be a verb or a noun. 有安排了 means you already have plans.', '你周末有什么安排？', '你週末有什麼安排？', 'Nǐ zhōumò yǒu shénme ānpái?', 'What plans do you have for the weekend?'),
    vocabEntry('prepare', '准备', '準備', 'zhǔnbèi', 'to prepare; to plan to', 'Before an action, 准备 can mean you intend or are getting ready to do it.', '我准备周末去看朋友。', '我準備週末去看朋友。', 'Wǒ zhǔnbèi zhōumò qù kàn péngyou.', 'I’m planning to visit a friend this weekend.'),
    vocabEntry('decide', '决定', '決定', 'juédìng', 'to decide; a decision', '还没决定 means the decision has not been made yet.', '我们还没决定去哪儿。', '我們還沒決定去哪兒。', 'Wǒmen hái méi juédìng qù nǎr.', 'We haven’t decided where to go yet.'),
    vocabEntry('remind', '提醒', '提醒', 'tíxǐng', 'to remind; to point something out', '提醒我一下 asks for a quick reminder. 谢谢提醒 is a short way to acknowledge one.', '明天提醒我一下，好吗？', '明天提醒我一下，好嗎？', 'Míngtiān tíxǐng wǒ yíxià, hǎo ma?', 'Could you remind me tomorrow?'),
    vocabEntry('give-a-try', '试试', '試試', 'shìshi', 'to give something a try', 'Repeating 试 makes this a small, exploratory try. The second syllable is light in this conversational reading.', '我先试试这个办法。', '我先試試這個辦法。', 'Wǒ xiān shìshi zhège bànfǎ.', 'I’ll give this approach a try first.'),
    vocabEntry('continue', '继续', '繼續', 'jìxù', 'to continue; to keep going', 'Use before the activity you are continuing, or on its own when the activity is clear.', '我们吃完饭再继续吧。', '我們吃完飯再繼續吧。', 'Wǒmen chī wán fàn zài jìxù ba.', 'Let’s continue after we’ve eaten.'),
    vocabEntry('solve', '解决', '解決', 'jiějué', 'to solve; to resolve', 'Often used with 问题. 解决了 means the issue has been dealt with.', '这个问题已经解决了。', '這個問題已經解決了。', 'Zhège wèntí yǐjīng jiějué le.', 'This issue has already been resolved.')
  ] },
  { id: 'devices', title: 'Devices & digital life', category: 'At work', words: [
    vocabEntry('phone', '手机', '手機', 'shǒujī', 'mobile phone', 'The everyday word for a cell phone. 没电了 means the battery has run out.', '我的手机快没电了。', '我的手機快沒電了。', 'Wǒ de shǒujī kuài méi diàn le.', 'My phone’s almost out of battery.'),
    vocabEntry('computer', '电脑', '電腦', 'diànnǎo', 'computer', '笔记本电脑 is a laptop; 电脑 alone works when the type does not matter.', '我先打开电脑。', '我先打開電腦。', 'Wǒ xiān dǎkāi diànnǎo.', 'Let me turn on my computer first.'),
    vocabEntry('screen', '屏幕', '屏幕', 'píngmù', 'screen', '屏幕 is common in mainland Mandarin. Taiwan often uses 螢幕 (yíngmù); switching the app’s script keeps the original word.', '你能看到我的屏幕吗？', '你能看到我的屏幕嗎？', 'Nǐ néng kàn dào wǒ de píngmù ma?', 'Can you see my screen?'),
    vocabEntry('link', '链接', '鏈接', 'liànjiē', 'link; hyperlink', 'Useful for a document or webpage link. Taiwan often uses 連結 (liánjié).', '你能把链接发给我吗？', '你能把鏈接發給我嗎？', 'Nǐ néng bǎ liànjiē fā gěi wǒ ma?', 'Could you send me the link?'),
    vocabEntry('file', '文件', '文件', 'wénjiàn', 'file; document', 'Can refer to a computer file or a document. 个 is a common conversational measure word for a file.', '文件我已经发给你了。', '文件我已經發給你了。', 'Wénjiàn wǒ yǐjīng fā gěi nǐ le.', 'I’ve already sent you the file.'),
    vocabEntry('password', '密码', '密碼', 'mìmǎ', 'password; passcode', 'A password or passcode. A one-time verification code is usually 验证码.', '密码在哪里改？', '密碼在哪裡改？', 'Mìmǎ zài nǎlǐ gǎi?', 'Where can I change the password?'),
    vocabEntry('network', '网络', '網絡', 'wǎngluò', 'network; internet', '网络不太稳定 describes an unreliable connection. 上网 means going online.', '我这边网络不太稳定。', '我這邊網絡不太穩定。', 'Wǒ zhèbiān wǎngluò bú tài wěndìng.', 'My connection’s a bit unstable.'),
    vocabEntry('update', '更新', '更新', 'gēngxīn', 'to update; an update', '更 is first-tone gēng in 更新, unlike fourth-tone gèng when it means “more.”', '我先更新一下软件。', '我先更新一下軟件。', 'Wǒ xiān gēngxīn yíxià ruǎnjiàn.', 'I’ll update the software first.')
  ] },
  { id: 'people', title: 'People & relationships', category: 'Everyday life', words: [
    vocabEntry('coworker', '同事', '同事', 'tóngshì', 'coworker; colleague', 'Use for someone you work with. 我的同事 works for either a teammate or a colleague elsewhere in the company.', '这是我的同事。', '這是我的同事。', 'Zhè shì wǒ de tóngshì.', 'This is my coworker.'),
    vocabEntry('manager', '经理', '經理', 'jīnglǐ', 'manager', 'A common job title. For your direct manager, 我的经理 is understandable; 老板 can imply the boss or owner.', '我先跟经理确认一下。', '我先跟經理確認一下。', 'Wǒ xiān gēn jīnglǐ quèrèn yíxià.', 'I’ll check with the manager first.'),
    vocabEntry('friend', '朋友', '朋友', 'péngyou', 'friend', 'The second syllable is commonly light in mainland conversational Mandarin.', '周末我跟朋友一起吃饭。', '週末我跟朋友一起吃飯。', 'Zhōumò wǒ gēn péngyou yìqǐ chī fàn.', 'I’m having a meal with friends this weekend.'),
    vocabEntry('family', '家人', '家人', 'jiārén', 'family members; family', 'Refers to the people in your family, rather than the place where you live.', '我晚上想跟家人聊聊天。', '我晚上想跟家人聊聊天。', 'Wǒ wǎnshang xiǎng gēn jiārén liáoliao tiān.', 'I’d like to chat with my family this evening.'),
    vocabEntry('neighbor', '邻居', '鄰居', 'línjū', 'neighbor', 'A person who lives near you. Use a name when you already know them.', '我跟邻居打了个招呼。', '我跟鄰居打了個招呼。', 'Wǒ gēn línjū dǎ le ge zhāohu.', 'I said hello to my neighbor.'),
    vocabEntry('everyone', '大家', '大家', 'dàjiā', 'everyone; everybody', 'Useful when addressing a group or talking about what works for everyone.', '大家几点方便？', '大家幾點方便？', 'Dàjiā jǐ diǎn fāngbiàn?', 'What time works for everyone?'),
    vocabEntry('together', '一起', '一起', 'yìqǐ', 'together', 'Usually comes before the shared action. 一 becomes falling yì before third-tone 起 qǐ.', '我们一起去吃午饭吧。', '我們一起去吃午飯吧。', 'Wǒmen yìqǐ qù chī wǔfàn ba.', 'Let’s go have lunch together.'),
    vocabEntry('introduce', '介绍', '介紹', 'jièshào', 'to introduce; to tell someone about', 'Can introduce a person, place, or idea. 介绍一下 makes it sound brief.', '我给你介绍一下，这是我的同事。', '我給你介紹一下，這是我的同事。', 'Wǒ gěi nǐ jièshào yíxià, zhè shì wǒ de tóngshì.', 'Let me introduce you. This is my coworker.')
  ] },
  { id: 'home', title: 'Home & daily life', category: 'Everyday life', words: [
    vocabEntry('room', '房间', '房間', 'fángjiān', 'room', 'A room in a home, hotel, or another building. 房子 refers more broadly to a house or dwelling.', '这个房间光线很好。', '這個房間光線很好。', 'Zhège fángjiān guāngxiàn hěn hǎo.', 'This room gets good light.'),
    vocabEntry('kitchen', '厨房', '廚房', 'chúfáng', 'kitchen', 'Use 在厨房 for “in the kitchen.”', '我在厨房做饭。', '我在廚房做飯。', 'Wǒ zài chúfáng zuò fàn.', 'I’m cooking in the kitchen.'),
    vocabEntry('fridge', '冰箱', '冰箱', 'bīngxiāng', 'fridge; refrigerator', 'Use 放进冰箱 for putting something into the fridge, or 冰箱里 for inside it.', '牛奶在冰箱里。', '牛奶在冰箱裡。', 'Niúnǎi zài bīngxiāng lǐ.', 'The milk’s in the fridge.'),
    vocabEntry('keys', '钥匙', '鑰匙', 'yàoshi', 'key; keys', '匙 is light shi in this word. 一把钥匙 is one key; Chinese does not require a plural ending.', '我的钥匙在桌上。', '我的鑰匙在桌上。', 'Wǒ de yàoshi zài zhuōshang.', 'My keys are on the table.'),
    vocabEntry('laundry', '洗衣服', '洗衣服', 'xǐ yīfu', 'to do laundry; to wash clothes', '衣服 is clothing, with a light final fu in this conversational reading.', '我晚上还要洗衣服。', '我晚上還要洗衣服。', 'Wǒ wǎnshang hái yào xǐ yīfu.', 'I still need to do laundry this evening.'),
    vocabEntry('clean', '打扫', '打掃', 'dǎsǎo', 'to clean; to sweep', 'Often followed by the space you are cleaning, such as 房间 or 厨房.', '我周末一般打扫房间。', '我週末一般打掃房間。', 'Wǒ zhōumò yìbān dǎsǎo fángjiān.', 'I usually clean my room on weekends.'),
    vocabEntry('move-home', '搬家', '搬家', 'bān jiā', 'to move home', 'For moving to a new home. 搬东西 means moving or carrying things.', '我下个月要搬家。', '我下個月要搬家。', 'Wǒ xià ge yuè yào bān jiā.', 'I’m moving next month.'),
    vocabEntry('rest', '休息', '休息', 'xiūxi', 'to rest; a break', 'Can mean taking a short break or resting more generally. 休息一下 is a brief rest.', '我们休息一下再继续吧。', '我們休息一下再繼續吧。', 'Wǒmen xiūxi yíxià zài jìxù ba.', 'Let’s take a break before continuing.')
  ] },
  { id: 'shopping', title: 'Shopping & services', category: 'Everyday life', words: [
    vocabEntry('price', '价格', '價格', 'jiàgé', 'price', 'Useful for discussing a price in general. To ask a shop assistant the price directly, 多少钱 is more conversational.', '这个价格还可以。', '這個價格還可以。', 'Zhège jiàgé hái kěyǐ.', 'The price is pretty reasonable.'),
    vocabEntry('cheap', '便宜', '便宜', 'piányi', 'inexpensive; cheap', '便 is pián in this word, not biàn as in 方便. The final yi is commonly light.', '这家店的东西比较便宜。', '這家店的東西比較便宜。', 'Zhè jiā diàn de dōngxi bǐjiào piányi.', 'Things at this shop are relatively inexpensive.'),
    vocabEntry('expensive', '贵', '貴', 'guì', 'expensive', '有点贵 gives a mild opinion about the price; 太贵了 is stronger.', '这个有点贵，我再看看。', '這個有點貴，我再看看。', 'Zhège yǒudiǎn guì, wǒ zài kànkan.', 'This is a bit expensive. I’ll keep looking.'),
    vocabEntry('suitable', '合适', '合適', 'héshì', 'suitable; a good fit', 'Can describe a good size, time, price, or choice. 合身 is specifically about how clothing fits the body.', '这个时间对我来说很合适。', '這個時間對我來說很合適。', 'Zhège shíjiān duì wǒ lái shuō hěn héshì.', 'This time works well for me.'),
    vocabEntry('size', '尺码', '尺碼', 'chǐmǎ', 'clothing or shoe size', '尺码 asks about a size category, rather than physical dimensions in general.', '这件有大一点的尺码吗？', '這件有大一點的尺碼嗎？', 'Zhè jiàn yǒu dà yìdiǎn de chǐmǎ ma?', 'Does this come in a larger size?'),
    vocabEntry('try-on', '试穿', '試穿', 'shìchuān', 'to try on clothing or shoes', '试 is trying; 穿 is wearing. Add 可以吗 to check whether you may try something on.', '这件可以试穿吗？', '這件可以試穿嗎？', 'Zhè jiàn kěyǐ shìchuān ma?', 'Can I try this on?'),
    vocabEntry('return-item', '退货', '退貨', 'tuì huò', 'to return a purchase', '退货 means returning an item; 换货 means exchanging it. Ask what the shop allows.', '如果不合适，可以退货吗？', '如果不合適，可以退貨嗎？', 'Rúguǒ bù héshì, kěyǐ tuì huò ma?', 'If it isn’t suitable, can I return it?'),
    vocabEntry('receipt', '收据', '收據', 'shōujù', 'receipt', 'A receipt acknowledging payment. Mainland shops may call a till receipt 小票; 发票 has a more specific invoicing meaning.', '能给我一张收据吗？', '能給我一張收據嗎？', 'Néng gěi wǒ yì zhāng shōujù ma?', 'Could I have a receipt?')
  ] },
  { id: 'describing', title: 'Describing & comparing', category: 'Everyday life', words: [
    vocabEntry('relatively', '比较', '比較', 'bǐjiào', 'relatively; quite; to compare', 'Before an adjective it often means “relatively” or “quite.” As a verb, it means comparing things.', '这个办法比较简单。', '這個辦法比較簡單。', 'Zhège bànfǎ bǐjiào jiǎndān.', 'This approach is relatively simple.'),
    vocabEntry('about-same', '差不多', '差不多', 'chàbuduō', 'about the same; almost', 'Can compare similar things or mean something is nearly ready. 不 is light bu here.', '这两个价格差不多。', '這兩個價格差不多。', 'Zhè liǎng ge jiàgé chàbuduō.', 'These two prices are about the same.'),
    vocabEntry('more', '更', '更', 'gèng', 'more; even more', 'Comes before an adjective to express a comparison. It is gèng here; 更新 uses gēng.', '这个方案更简单。', '這個方案更簡單。', 'Zhège fāng’àn gèng jiǎndān.', 'This plan is simpler.'),
    vocabEntry('especially', '特别', '特別', 'tèbié', 'especially; particularly; special', 'Before an adjective, 特别 often means “particularly.” It can also describe something as special.', '今天路上特别堵。', '今天路上特別堵。', 'Jīntiān lùshang tèbié dǔ.', 'Traffic’s particularly bad today.'),
    vocabEntry('important', '重要', '重要', 'zhòngyào', 'important', 'Use to explain what deserves attention, rather than simply what is urgent.', '这个细节很重要。', '這個細節很重要。', 'Zhège xìjié hěn zhòngyào.', 'This detail is important.'),
    vocabEntry('clear', '清楚', '清楚', 'qīngchu', 'clear; clearly', '听清楚 is hearing clearly; 说清楚 is explaining clearly. 清楚 can also describe how well you understand something.', '不好意思，我刚才没听清楚。', '不好意思，我剛才沒聽清楚。', 'Bù hǎoyìsi, wǒ gāngcái méi tīng qīngchu.', 'Sorry, I didn’t catch that clearly.'),
    vocabEntry('simple', '简单', '簡單', 'jiǎndān', 'simple; straightforward', 'Often describes a task, explanation, or plan. 简单说 means “to put it simply.”', '我们先做个简单的版本。', '我們先做個簡單的版本。', 'Wǒmen xiān zuò ge jiǎndān de bǎnběn.', 'Let’s make a simple version first.'),
    vocabEntry('complicated', '复杂', '複雜', 'fùzá', 'complicated; complex', '有点复杂 is a measured way to say something has several parts or is not easy to explain.', '这个情况有点复杂。', '這個情況有點複雜。', 'Zhège qíngkuàng yǒudiǎn fùzá.', 'The situation’s a bit complicated.')
  ] },
  { id: 'clarification', title: 'Understanding & explaining', category: 'Everyday life', words: [
    vocabEntry('understand-heard', '听懂', '聽懂', 'tīng dǒng', 'to understand what you hear', '听到 means hearing something; 听懂 adds understanding its meaning. 听不懂 means being unable to understand it.', '这句话我没听懂。', '這句話我沒聽懂。', 'Zhè jù huà wǒ méi tīng dǒng.', 'I didn’t understand that sentence.'),
    vocabEntry('understand', '明白', '明白', 'míngbai', 'to understand; clear', '明白了 is a short acknowledgment that you understand. The final bai is commonly light in conversational mainland Mandarin.', '我明白你的意思了。', '我明白你的意思了。', 'Wǒ míngbai nǐ de yìsi le.', 'I understand what you mean now.'),
    vocabEntry('meaning', '意思', '意思', 'yìsi', 'meaning; intention', '什么意思 asks what something means. 你的意思是… checks what the other person intends.', '这个词是什么意思？', '這個詞是什麼意思？', 'Zhège cí shì shénme yìsi?', 'What does this word mean?'),
    vocabEntry('for-example', '比如', '比如', 'bǐrú', 'for example; such as', 'Introduces an example. 比如说 is another conversational way to start one.', '比如，我们可以先试一个小功能。', '比如，我們可以先試一個小功能。', 'Bǐrú, wǒmen kěyǐ xiān shì yí ge xiǎo gōngnéng.', 'For example, we could try one small feature first.'),
    vocabEntry('explain', '解释', '解釋', 'jiěshì', 'to explain; an explanation', '解释一下 asks for a brief explanation. Add what you want explained when it is not obvious.', '你能解释一下这个例子吗？', '你能解釋一下這個例子嗎？', 'Nǐ néng jiěshì yíxià zhège lìzi ma?', 'Could you explain this example?'),
    vocabEntry('repeat', '重复', '重複', 'chóngfù', 'to repeat; repeated', '重 is chóng in 重复, unlike zhòng in 重要. 再说一遍 is another natural way to ask for a repeat.', '不好意思，能重复一下最后一句吗？', '不好意思，能重複一下最後一句嗎？', 'Bù hǎoyìsi, néng chóngfù yíxià zuìhòu yí jù ma?', 'Sorry, could you repeat the last sentence?'),
    vocabEntry('slow', '慢', '慢', 'màn', 'slow; slowly', '慢一点 asks for a slower pace. Be specific about the action rather than describing the person as slow.', '能说慢一点吗？', '能說慢一點嗎？', 'Néng shuō màn yìdiǎn ma?', 'Could you speak a little more slowly?'),
    vocabEntry('certain', '确定', '確定', 'quèdìng', 'to be certain; to decide or settle', '我不太确定 expresses uncertainty. 确认 often focuses on checking; 确定 can mean being sure or settling a decision.', '我不太确定，先查一下。', '我不太確定，先查一下。', 'Wǒ bú tài quèdìng, xiān chá yíxià.', 'I’m not quite sure. Let me check first.')
  ] },
  { id: 'team-tasks', title: 'Team tasks & projects', category: 'At work', words: [
    vocabEntry('task', '任务', '任務', 'rènwu', 'task; assignment', 'A concrete piece of work. The final wu is often light in mainland conversational speech.', '这个任务我来做吧。', '這個任務我來做吧。', 'Zhège rènwu wǒ lái zuò ba.', 'I can take this task.'),
    vocabEntry('project', '项目', '項目', 'xiàngmù', 'project', 'Usually broader than a single task. 项目 can also mean an item or program in other contexts.', '你最近在忙什么项目？', '你最近在忙什麼項目？', 'Nǐ zuìjìn zài máng shénme xiàngmù?', 'What project have you been working on lately?'),
    vocabEntry('code', '代码', '代碼', 'dàimǎ', 'code; source code', 'For software code. Writing code is 写代码; a one-time verification code is usually 验证码.', '你能帮我看一下这段代码吗？', '你能幫我看一下這段代碼嗎？', 'Nǐ néng bāng wǒ kàn yíxià zhè duàn dàimǎ ma?', 'Could you take a look at this piece of code?'),
    vocabEntry('test', '测试', '測試', 'cèshì', 'to test; a test', 'Can be a noun or a verb. 测试一下 describes giving something a quick test.', '我先测试一下这个功能。', '我先測試一下這個功能。', 'Wǒ xiān cèshì yíxià zhège gōngnéng.', 'I’ll test this feature first.'),
    vocabEntry('version', '版本', '版本', 'bǎnběn', 'version; edition', 'Useful for software, drafts, and other versions of a work. Add a number if several versions are in play.', '这个版本还有一个小问题。', '這個版本還有一個小問題。', 'Zhège bǎnběn hái yǒu yí ge xiǎo wèntí.', 'This version still has one small issue.'),
    vocabEntry('requirements', '需求', '需求', 'xūqiú', 'need; requirement; requirements', 'At work, often refers to what a feature or user needs. In everyday requests, 需要 is usually the more natural verb.', '这个需求能再说具体一点吗？', '這個需求能再說具體一點嗎？', 'Zhège xūqiú néng zài shuō jùtǐ yìdiǎn ma?', 'Could you be a bit more specific about this requirement?'),
    vocabEntry('responsible', '负责', '負責', 'fùzé', 'to be responsible for; to handle', 'Use before the work someone owns. 我来负责 offers to take responsibility for it.', '这部分谁负责？', '這部分誰負責？', 'Zhè bùfen shéi fùzé?', 'Who’s handling this part?'),
    vocabEntry('discuss', '讨论', '討論', 'tǎolùn', 'to discuss; a discussion', 'Useful for exploring a question together. 聊聊 is a more casual alternative when the topic does not need a focused discussion.', '我们找个时间讨论一下吧。', '我們找個時間討論一下吧。', 'Wǒmen zhǎo ge shíjiān tǎolùn yíxià ba.', 'Let’s find a time to talk it through.')
  ] },
  { id: 'places', title: 'Places & running errands', category: 'Everyday life', words: [
    vocabEntry('supermarket', '超市', '超市', 'chāoshì', 'supermarket', 'A common place for groceries and household supplies. 便利店 is a convenience store.', '我去超市买点东西。', '我去超市買點東西。', 'Wǒ qù chāoshì mǎi diǎn dōngxi.', 'I’m going to pick up a few things at the supermarket.'),
    vocabEntry('pharmacy', '药店', '藥店', 'yàodiàn', 'pharmacy; drugstore', 'The everyday mainland term for a shop selling medicine. 药房 is another term you may hear.', '这附近有药店吗？', '這附近有藥店嗎？', 'Zhè fùjìn yǒu yàodiàn ma?', 'Is there a pharmacy nearby?'),
    vocabEntry('bank', '银行', '銀行', 'yínháng', 'bank', '行 is háng in 银行, unlike xíng when 行 means “okay” or “to work.”', '银行在超市旁边。', '銀行在超市旁邊。', 'Yínháng zài chāoshì pángbiān.', 'The bank is next to the supermarket.'),
    vocabEntry('post-office', '邮局', '郵局', 'yóujú', 'post office', 'For postal services. 快递 often refers to courier delivery rather than the post office itself.', '我想去邮局寄个包裹。', '我想去郵局寄個包裹。', 'Wǒ xiǎng qù yóujú jì ge bāoguǒ.', 'I’d like to go to the post office to send a package.'),
    vocabEntry('station', '车站', '車站', 'chēzhàn', 'station; bus stop', 'A general word; 地铁站 is a metro station and 公交车站 is a bus stop. Name the service when the distinction matters.', '我们在车站门口见吧。', '我們在車站門口見吧。', 'Wǒmen zài chēzhàn ménkǒu jiàn ba.', 'Let’s meet at the station entrance.'),
    vocabEntry('entrance', '入口', '入口', 'rùkǒu', 'entrance', 'Often appears on signs. 入口在哪里 asks how to find the entrance.', '入口在那边吗？', '入口在那邊嗎？', 'Rùkǒu zài nàbiān ma?', 'Is the entrance over there?'),
    vocabEntry('exit', '出口', '出口', 'chūkǒu', 'exit', 'For the way out of a place. In business contexts, 出口 can instead mean exporting goods.', '从哪个出口出去比较近？', '從哪個出口出去比較近？', 'Cóng nǎge chūkǒu chūqu bǐjiào jìn?', 'Which exit is closest?'),
    vocabEntry('restroom', '洗手间', '洗手間', 'xǐshǒujiān', 'restroom; toilet', 'A polite, ordinary word for a restroom. 厕所 is another common word.', '不好意思，洗手间在哪里？', '不好意思，洗手間在哪裡？', 'Bù hǎoyìsi, xǐshǒujiān zài nǎlǐ?', 'Excuse me, where’s the restroom?')
  ] },
  { id: 'meals', title: 'Meals & food preferences', category: 'Everyday life', words: [
    vocabEntry('menu', '菜单', '菜單', 'càidān', 'menu', 'Used for a restaurant menu and also for menus in software. Context makes the meaning clear.', '能给我们看一下菜单吗？', '能給我們看一下菜單嗎？', 'Néng gěi wǒmen kàn yíxià càidān ma?', 'Could we have a look at the menu?'),
    vocabEntry('taste-preference', '口味', '口味', 'kǒuwèi', 'taste preference; flavor', 'Can describe someone’s preferred flavors or the flavor profile of food.', '你喜欢什么口味？', '你喜歡什麼口味？', 'Nǐ xǐhuan shénme kǒuwèi?', 'What kinds of flavors do you like?'),
    vocabEntry('lightly-seasoned', '清淡', '清淡', 'qīngdàn', 'lightly seasoned; mild', 'Usually describes food that is not rich, oily, or strongly seasoned. It does not simply mean “not spicy.”', '我想吃点清淡的。', '我想吃點清淡的。', 'Wǒ xiǎng chī diǎn qīngdàn de.', 'I’d like something lightly seasoned.'),
    vocabEntry('sweet', '甜', '甜', 'tián', 'sweet', 'A taste word. 少放点糖 asks for a little less sugar when ordering.', '这个有点甜。', '這個有點甜。', 'Zhège yǒudiǎn tián.', 'This is a bit sweet.'),
    vocabEntry('salty', '咸', '鹹', 'xián', 'salty', '有点咸 is a mild observation; 太咸了 is a stronger complaint.', '这道菜有点咸。', '這道菜有點鹹。', 'Zhè dào cài yǒudiǎn xián.', 'This dish is a bit salty.'),
    vocabEntry('full', '饱', '飽', 'bǎo', 'full from eating; satisfied', '吃饱了 says you have eaten enough. 不饿 means “not hungry,” which is a different idea.', '我吃饱了，你慢慢吃。', '我吃飽了，你慢慢吃。', 'Wǒ chī bǎo le, nǐ mànman chī.', 'I’m full. Take your time eating.'),
    vocabEntry('recommend', '推荐', '推薦', 'tuījiàn', 'to recommend; a recommendation', 'Useful for food, shows, books, and other suggestions. 有什么推荐的吗 asks for a recommendation.', '你有什么推荐的吗？', '你有什麼推薦的嗎？', 'Nǐ yǒu shénme tuījiàn de ma?', 'Do you have any recommendations?'),
    vocabEntry('casual-choice', '随便', '隨便', 'suíbiàn', 'casually; without a particular preference', 'Can signal an easygoing choice among people you know. A bare 随便 can sound uninterested; 我都可以 is a warmer “anything works for me.”', '午饭随便吃点就行。', '午飯隨便吃點就行。', 'Wǔfàn suíbiàn chī diǎn jiù xíng.', 'Something simple for lunch is fine.')
  ] },
  { id: 'outdoors', title: 'Weather & being outside', category: 'Everyday life', words: [
    vocabEntry('weather', '天气', '天氣', 'tiānqì', 'weather', 'An easy small-talk topic. 天气不错 means the weather is pretty nice.', '天气不错，我们出去走走吧。', '天氣不錯，我們出去走走吧。', 'Tiānqì búcuò, wǒmen chūqu zǒuzou ba.', 'The weather’s nice. Let’s go for a walk.'),
    vocabEntry('rain', '下雨', '下雨', 'xià yǔ', 'to rain', '下雨了 can announce that it has started raining. 雨 by itself is the noun “rain.”', '外面下雨了，你带伞了吗？', '外面下雨了，你帶傘了嗎？', 'Wàimian xià yǔ le, nǐ dài sǎn le ma?', 'It’s raining outside. Did you bring an umbrella?'),
    vocabEntry('windy', '刮风', '刮風', 'guā fēng', 'to be windy; for the wind to blow', '刮 is the verb commonly used for wind blowing. 风 is the noun “wind.”', '外面刮风了，关一下窗户吧。', '外面刮風了，關一下窗戶吧。', 'Wàimian guā fēng le, guān yíxià chuānghu ba.', 'It’s windy outside. Let’s close the window.'),
    vocabEntry('sunny', '晴天', '晴天', 'qíngtiān', 'a sunny day; clear weather', 'A noun for a clear or sunny day. 晴 can describe the weather on its own in forecasts.', '明天是晴天，我们去公园吧。', '明天是晴天，我們去公園吧。', 'Míngtiān shì qíngtiān, wǒmen qù gōngyuán ba.', 'It’ll be sunny tomorrow. Let’s go to the park.'),
    vocabEntry('warm', '暖和', '暖和', 'nuǎnhuo', 'warm; comfortably warm', '和 is light huo here, rather than hé as in “and.” Often describes weather, a room, or clothing.', '今天比昨天暖和多了。', '今天比昨天暖和多了。', 'Jīntiān bǐ zuótiān nuǎnhuo duō le.', 'It’s much warmer today than yesterday.'),
    vocabEntry('cool', '凉快', '涼快', 'liángkuai', 'cool; pleasantly cool', 'Usually describes comfortable coolness, rather than being uncomfortably cold. The final kuai is commonly light.', '晚上出去走走比较凉快。', '晚上出去走走比較涼快。', 'Wǎnshang chūqu zǒuzou bǐjiào liángkuai.', 'It’s cooler for a walk outside in the evening.'),
    vocabEntry('jacket', '外套', '外套', 'wàitào', 'jacket; coat; outer layer', 'A broad word for outerwear. 一件外套 is one jacket or coat.', '外面有点冷，带件外套吧。', '外面有點冷，帶件外套吧。', 'Wàimian yǒudiǎn lěng, dài jiàn wàitào ba.', 'It’s a bit cold outside. Bring a jacket.'),
    vocabEntry('stroll', '散步', '散步', 'sàn bù', 'to take a walk; to stroll', 'Usually means a leisurely walk. 走路 can simply mean traveling on foot.', '我们吃完饭去散步吧。', '我們吃完飯去散步吧。', 'Wǒmen chī wán fàn qù sàn bù ba.', 'Let’s take a walk after eating.')
  ] },
  { id: 'hobbies', title: 'Hobbies & weekends', category: 'Everyday life', words: [
    vocabEntry('weekend', '周末', '週末', 'zhōumò', 'weekend', '这周末 is this weekend; 下周末 is next weekend.', '你周末一般做什么？', '你週末一般做什麼？', 'Nǐ zhōumò yìbān zuò shénme?', 'What do you usually do on weekends?'),
    vocabEntry('exercise', '运动', '運動', 'yùndòng', 'exercise; sport; to exercise', 'Can refer to physical activity in general or a sport. 做运动 means exercising.', '你平时喜欢什么运动？', '你平時喜歡什麼運動？', 'Nǐ píngshí xǐhuan shénme yùndòng?', 'What sports or exercise do you like?'),
    vocabEntry('run', '跑步', '跑步', 'pǎo bù', 'to run; to go running', 'A common way to name running as exercise, rather than running to catch something.', '我一般下班以后去跑步。', '我一般下班以後去跑步。', 'Wǒ yìbān xià bān yǐhòu qù pǎo bù.', 'I usually go running after work.'),
    vocabEntry('movie', '电影', '電影', 'diànyǐng', 'movie; film', '看电影 can mean watching a film at home or going to the movies; context tells you which.', '你最近看什么电影了？', '你最近看什麼電影了？', 'Nǐ zuìjìn kàn shénme diànyǐng le?', 'What movies have you seen lately?'),
    vocabEntry('music', '音乐', '音樂', 'yīnyuè', 'music', '乐 is yuè in 音乐, unlike lè in 快乐. 听音乐 means listening to music.', '我做饭的时候喜欢听音乐。', '我做飯的時候喜歡聽音樂。', 'Wǒ zuò fàn de shíhou xǐhuan tīng yīnyuè.', 'I like listening to music while cooking.'),
    vocabEntry('photo', '照片', '照片', 'zhàopiàn', 'photo; photograph', '拍照片 means taking photos. Use 张 to count a photo.', '这张照片拍得真好！', '這張照片拍得真好！', 'Zhè zhāng zhàopiàn pāi de zhēn hǎo!', 'This photo came out really well!'),
    vocabEntry('interesting', '有意思', '有意思', 'yǒu yìsi', 'interesting; fun', 'Usually means interesting or fun as a description, rather than literally “has a meaning.”', '这个节目挺有意思的。', '這個節目挺有意思的。', 'Zhège jiémù tǐng yǒu yìsi de.', 'This show’s pretty interesting.'),
    vocabEntry('relax', '放松', '放鬆', 'fàngsōng', 'to relax; to loosen up', 'Can refer to resting mentally or physically. 放松一下 suggests a short chance to unwind.', '周末想在家放松一下。', '週末想在家放鬆一下。', 'Zhōumò xiǎng zài jiā fàngsōng yíxià.', 'I’d like to relax at home this weekend.')
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
