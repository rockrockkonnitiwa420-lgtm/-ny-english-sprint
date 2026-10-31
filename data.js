// ===== 学習データ =====
// 書き方のルール
// - ja：言いたいこと（日本語）。l1〜l3 はどのレベルでも、この意味がちゃんと伝わる完全な英文にする（「Where?」のような断片はNG）
// - choices：LISTENで英語を聞いて選ぶ日本語。不正解は「同じ場面でありそうだけど、英語を聞けば区別できるもの」にする
// - choices は出題時にシャッフルされるので、正解を先頭に書いてもOK
// - フレーズを足すときは各シーンの末尾に追記（id は「シーン名-番号」で自動採番）
// - {name} {hobby} {hobbyJa} {age} はプロフィールで置き換わる

const LEVELS = {
  1:{name:"超初級", rate:0.72, hint:"短くてかんたんな文", desc:"2〜5語の短い文。まずは聞いてマネする。"},
  2:{name:"初級", rate:0.88, hint:"ていねいな言い方", desc:"Could you…? などのていねいな文で受け答え。"},
  3:{name:"留学実践", rate:1.0, hint:"ひとこと足した文", desc:"現地に近い速さ。理由やお礼をひとこと足して話す。"}
};

const SCENE_INFO = {
  "Airport":{ja:"空港・入国審査", icon:"✈️"},
  "Homestay":{ja:"ホームステイ", icon:"🏠"},
  "School":{ja:"学校・クラス", icon:"🏫"},
  "Small Talk":{ja:"友達と雑談", icon:"💬"},
  "Subway":{ja:"地下鉄・移動", icon:"🚇"},
  "Sightseeing":{ja:"観光", icon:"🗽"},
  "Shopping":{ja:"買い物", icon:"🛍️"},
  "Restaurant":{ja:"レストラン", icon:"🍔"},
  "Emergency":{ja:"困った時", icon:"🆘"}
};
const SCENES = Object.keys(SCENE_INFO);

const RAW_ITEMS = [
  // ---------- Airport ----------
  {scene:"Airport", ja:"（入国審査で目的を聞かれて）勉強しに来ました",
    l1:"I'm here to study.", l2:"I'm here to study English.", l3:"I'm here for a two-week study program.",
    choices:["勉強しに来ました","観光で来ました","仕事で来ました"], correct:0},
  {scene:"Airport", ja:"（どこに泊まるか聞かれて）ホストファミリーの家に泊まります",
    l1:"With a host family.", l2:"I'm staying with a host family.", l3:"I'm staying with a host family in New York.",
    choices:["ホストファミリーの家に泊まります","ホテルに泊まります","友達の家に泊まります"], correct:0},
  {scene:"Airport", ja:"（滞在期間を聞かれて）2週間です",
    l1:"Two weeks.", l2:"For two weeks.", l3:"I'm staying for two weeks.",
    choices:["2週間です","2日間です","2か月です"], correct:0},
  {scene:"Airport", ja:"自分のかばんが見つかりません",
    l1:"I can't find my bag.", l2:"Excuse me, I can't find my bag.", l3:"Excuse me, my suitcase didn't come out.",
    choices:["かばんが見つかりません","かばんを預けたいです","かばんが重いです"], correct:0},
  {scene:"Airport", ja:"荷物はどこで受け取れますか？",
    l1:"Where is baggage claim?", l2:"Where can I get my bags?", l3:"Excuse me, where can I pick up my luggage?",
    choices:["荷物はどこで受け取れますか？","出口はどこですか？","トイレはどこですか？"], correct:0},
  {scene:"Airport", ja:"（機内で）毛布をもらえますか？",
    l1:"A blanket, please.", l2:"Can I have a blanket, please?", l3:"Excuse me, could I have a blanket? I'm a little cold.",
    choices:["毛布をください","お水をください","枕をください"], correct:0},

  // ---------- Homestay ----------
  {scene:"Homestay", ja:"はじめまして。お世話になります",
    l1:"Nice to meet you.", l2:"Nice to meet you. I'm {name}.", l3:"Nice to meet you. Thank you for having me.",
    choices:["はじめまして","おやすみなさい","また明日"], correct:0},
  {scene:"Homestay", ja:"シャワーを使ってもいいですか？",
    l1:"Can I take a shower?", l2:"Can I use the shower now?", l3:"Is it okay if I take a shower now?",
    choices:["シャワーを使ってもいい？","窓を開けてもいい？","出かけてもいい？"], correct:0},
  {scene:"Homestay", ja:"何時までに帰ってくればいいですか？",
    l1:"When should I be home?", l2:"What time should I be home?", l3:"What time do you want me to be home?",
    choices:["何時までに帰ればいい？","何時に起きればいい？","何時に夕ご飯？"], correct:0},
  {scene:"Homestay", ja:"とてもおいしいです",
    l1:"It's delicious!", l2:"This is really good!", l3:"This is delicious. Thank you for dinner.",
    choices:["おいしいです","辛すぎます","お腹いっぱいです"], correct:0},
  {scene:"Homestay", ja:"お腹いっぱいです。ごちそうさま",
    l1:"I'm full.", l2:"I'm full, thank you.", l3:"I'm full. It was really good, thank you.",
    choices:["お腹いっぱいです","お腹がすきました","眠いです"], correct:0},
  {scene:"Homestay", ja:"Wi-Fiのパスワードは何ですか？",
    l1:"What's the Wi-Fi password?", l2:"Can I have the Wi-Fi password?", l3:"Could you tell me the Wi-Fi password, please?",
    choices:["Wi-Fiのパスワードは？","テレビを見てもいい？","電話してもいい？"], correct:0},
  {scene:"Homestay", ja:"何か手伝いましょうか？",
    l1:"Can I help?", l2:"Can I help you?", l3:"Is there anything I can help with?",
    choices:["手伝いましょうか？","手伝ってください","もう終わった？"], correct:0},
  {scene:"Homestay", ja:"おやすみなさい",
    l1:"Good night.", l2:"Good night. See you tomorrow.", l3:"I'm going to bed now. Good night!",
    choices:["おやすみなさい","おはよう","いってきます"], correct:0},
  {scene:"Homestay", ja:"充電器を借りてもいいですか？",
    l1:"Can I use a charger?", l2:"Can I borrow a charger?", l3:"Could I borrow a phone charger, please?",
    choices:["充電器を借りてもいい？","スマホを見てもいい？","電気を消してもいい？"], correct:0},

  // ---------- School ----------
  {scene:"School", ja:"もう一度言ってもらえますか？",
    l1:"One more time, please.", l2:"Could you say that again?", l3:"Sorry, could you say that again, please?",
    choices:["もう一度言ってください","もっと大きな声で","もう終わりです"], correct:0},
  {scene:"School", ja:"この単語はどういう意味ですか？",
    l1:"What does this mean?", l2:"What does this word mean?", l3:"Excuse me, what does this word mean?",
    choices:["どういう意味？","どう読むの？","どこにあるの？"], correct:0},
  {scene:"School", ja:"ここに一緒に座ってもいい？",
    l1:"Can I sit here?", l2:"Can I sit here with you?", l3:"Is it okay if I sit here with you?",
    choices:["ここに座ってもいい？","ここで待ってもいい？","ここで食べてもいい？"], correct:0},
  {scene:"School", ja:"日本から来ました。{hobbyJa}が好きです",
    l1:"I'm from Japan. I like {hobby}.", l2:"I'm from Japan, and I like {hobby}.", l3:"I'm from Japan. I'm here for two weeks, and I love {hobby}.",
    choices:["日本から来ました","中国から来ました","韓国から来ました"], correct:0},
  {scene:"School", ja:"（遊びやスポーツに）入れてもらってもいい？",
    l1:"Can I join?", l2:"Can I join you?", l3:"Hey, can I play with you guys?",
    choices:["一緒にやってもいい？","もう帰ってもいい？","見ててもいい？"], correct:0},
  {scene:"School", ja:"ゆっくり話してもらえますか？",
    l1:"Slowly, please.", l2:"Could you speak slowly?", l3:"Could you speak a little more slowly, please?",
    choices:["ゆっくり話して","大きな声で話して","静かにして"], correct:0},
  {scene:"School", ja:"これは英語で何と言いますか？",
    l1:"What's this in English?", l2:"How do you say this in English?", l3:"Excuse me, how do you say this in English?",
    choices:["英語で何て言う？","日本語で何て言う？","どうやって書く？"], correct:0},
  {scene:"School", ja:"トイレに行ってもいいですか？",
    l1:"Can I go to the restroom?", l2:"May I go to the restroom?", l3:"Excuse me, may I go to the restroom?",
    choices:["トイレに行ってもいい？","保健室に行ってもいい？","水を飲んでもいい？"], correct:0},

  // ---------- Small Talk ----------
  {scene:"Small Talk", ja:"何をするのが好き？",
    l1:"What do you like to do?", l2:"What do you like to do for fun?", l3:"What do you like to do on weekends?",
    choices:["何をするのが好き？","どこに住んでるの？","何歳？"], correct:0},
  {scene:"Small Talk", ja:"いいね！かっこいい！",
    l1:"Cool!", l2:"That's cool!", l3:"That's so cool! I want to try it.",
    choices:["いいね！","それは違うよ","知らないな"], correct:0},
  {scene:"Small Talk", ja:"ぼくも！（同じだね）",
    l1:"Me too!", l2:"Me too! I love it.", l3:"Me too! I really love it.",
    choices:["ぼくも！","ぼくは違うよ","ありがとう"], correct:0},
  {scene:"Small Talk", ja:"好きなスポーツは何？",
    l1:"What sports do you like?", l2:"What's your favorite sport?", l3:"What's your favorite sport to play?",
    choices:["好きなスポーツは？","好きな食べ物は？","好きな色は？"], correct:0},
  {scene:"Small Talk", ja:"一緒に写真を撮ろう！",
    l1:"Let's take a picture!", l2:"Can we take a picture together?", l3:"Do you want to take a picture together?",
    choices:["一緒に写真を撮ろう","写真を見せて","カメラを貸して"], correct:0},
  {scene:"Small Talk", ja:"日本に行ったことある？",
    l1:"Have you been to Japan?", l2:"Have you ever been to Japan?", l3:"Have you ever been to Japan? You should come!",
    choices:["日本に行ったことある？","日本は好き？","日本語を話せる？"], correct:0},

  // ---------- Subway ----------
  {scene:"Subway", ja:"この電車はタイムズスクエアに行きますか？",
    l1:"Does this go to Times Square?", l2:"Does this train go to Times Square?", l3:"Excuse me, does this train stop at Times Square?",
    choices:["この電車はタイムズスクエアに行く？","この電車は空港に行く？","タイムズスクエアは遠い？"], correct:0},
  {scene:"Subway", ja:"どこで乗り換えればいいですか？",
    l1:"Where do I transfer?", l2:"Where do I need to transfer?", l3:"Excuse me, which station should I transfer at?",
    choices:["どこで乗り換える？","どこで降りる？","どこで切符を買う？"], correct:0},
  {scene:"Subway", ja:"この席は空いていますか？",
    l1:"Is this seat open?", l2:"Is this seat taken?", l3:"Excuse me, is anyone sitting here?",
    choices:["この席は空いてる？","この電車は混んでる？","ここは何駅？"], correct:0},
  {scene:"Subway", ja:"次の駅はどこですか？",
    l1:"What's the next stop?", l2:"Excuse me, what's the next stop?", l3:"Do you know what the next stop is?",
    choices:["次の駅は？","終点は？","出口は？"], correct:0},
  {scene:"Subway", ja:"出口はどこですか？",
    l1:"Where's the exit?", l2:"Where is the exit?", l3:"Excuse me, which way is the exit?",
    choices:["出口は？","入口は？","トイレは？"], correct:0},
  {scene:"Subway", ja:"ここはアップタウン（北）行きのホームですか？",
    l1:"Is this uptown?", l2:"Is this the uptown train?", l3:"Excuse me, is this the uptown platform?",
    choices:["北（アップタウン）行き？","南（ダウンタウン）行き？","バス乗り場は？"], correct:0},

  // ---------- Sightseeing ----------
  {scene:"Sightseeing", ja:"（私たちの）写真を撮ってもらえますか？",
    l1:"Can you take our picture?", l2:"Could you take a picture of us?", l3:"Excuse me, could you take a picture of us, please?",
    choices:["写真を撮ってもらえますか？","写真を撮ってもいいですか？","写真を消してください"], correct:0},
  {scene:"Sightseeing", ja:"学生チケットを1枚ください",
    l1:"One ticket, please.", l2:"One student ticket, please.", l3:"Can I get one student ticket, please?",
    choices:["チケットを1枚ください","チケットを2枚ください","チケットはいくら？"], correct:0},
  {scene:"Sightseeing", ja:"学生割引はありますか？",
    l1:"Student discount?", l2:"Is there a student discount?", l3:"Do you have a student discount?",
    choices:["学生割引はある？","子ども料金はある？","無料ですか？"], correct:0},
  {scene:"Sightseeing", ja:"何時に閉まりますか？",
    l1:"What time do you close?", l2:"What time does it close?", l3:"What time does the museum close today?",
    choices:["何時に閉まる？","何時に開く？","何時に始まる？"], correct:0},
  {scene:"Sightseeing", ja:"ここで写真を撮ってもいいですか？",
    l1:"Can I take pictures here?", l2:"Is it okay to take pictures here?", l3:"Excuse me, am I allowed to take pictures here?",
    choices:["ここで写真を撮ってもいい？","ここで食べてもいい？","ここに座ってもいい？"], correct:0},

  // ---------- Shopping ----------
  {scene:"Shopping", ja:"これはいくらですか？",
    l1:"How much is this?", l2:"Excuse me, how much is this?", l3:"Excuse me, how much is this one?",
    choices:["これはいくら？","これは何？","これは誰の？"], correct:0},
  {scene:"Shopping", ja:"試着してもいいですか？",
    l1:"Can I try this on?", l2:"Can I try this on, please?", l3:"Where's the fitting room? I'd like to try this on.",
    choices:["試着してもいい？","買ってもいい？","触ってもいい？"], correct:0},
  {scene:"Shopping", ja:"小さいサイズはありますか？",
    l1:"Smaller size?", l2:"Do you have a smaller size?", l3:"Do you have this in a smaller size?",
    choices:["小さいサイズはある？","別の色はある？","大きいサイズはある？"], correct:0},
  {scene:"Shopping", ja:"カードで払えますか？",
    l1:"Can I pay by card?", l2:"Can I pay with a card?", l3:"Can I pay with a credit card?",
    choices:["カードで払える？","現金だけですか？","安くなる？"], correct:0},
  {scene:"Shopping", ja:"これをください",
    l1:"This one, please.", l2:"I'll take this.", l3:"I'll take this one, please.",
    choices:["これをください","これはいりません","見ているだけです"], correct:0},
  {scene:"Shopping", ja:"（店員に声をかけられて）見ているだけです",
    l1:"Just looking.", l2:"I'm just looking, thanks.", l3:"I'm just looking right now, thank you.",
    choices:["見ているだけです","これをください","何か探しています"], correct:0},

  // ---------- Restaurant ----------
  {scene:"Restaurant", ja:"お水をください",
    l1:"Water, please.", l2:"Can I have some water, please?", l3:"Could I have a glass of water, please?",
    choices:["お水をください","メニューをください","お会計をください"], correct:0},
  {scene:"Restaurant", ja:"ハンバーガーをお願いします",
    l1:"A burger, please.", l2:"I'd like a hamburger, please.", l3:"Can I get a cheeseburger and fries, please?",
    choices:["ハンバーガーをください","ピザをください","ホットドッグをください"], correct:0},
  {scene:"Restaurant", ja:"これは辛いですか？",
    l1:"Is it spicy?", l2:"Is this spicy?", l3:"Is this dish very spicy?",
    choices:["辛い？","甘い？","熱い？"], correct:0},
  {scene:"Restaurant", ja:"ナッツは入っていますか？（アレルギーがある時）",
    l1:"Any nuts?", l2:"Does this have nuts?", l3:"Does this have any nuts? I'm allergic.",
    choices:["ナッツは入ってる？","肉は入ってる？","卵は入ってる？"], correct:0},
  {scene:"Restaurant", ja:"お会計をお願いします",
    l1:"Check, please.", l2:"Can we get the check, please?", l3:"Excuse me, could we get the check, please?",
    choices:["お会計お願いします","注文します","おかわりください"], correct:0},
  {scene:"Restaurant", ja:"持ち帰りでお願いします",
    l1:"To go, please.", l2:"Can I get this to go?", l3:"Can I get this to go, please?",
    choices:["持ち帰りで","ここで食べます","まだ決めていません"], correct:0},
  {scene:"Restaurant", ja:"おすすめは何ですか？",
    l1:"What's good here?", l2:"What do you recommend?", l3:"What would you recommend?",
    choices:["おすすめは？","一番安いのは？","メニューはありますか？"], correct:0},

  // ---------- Emergency ----------
  {scene:"Emergency", ja:"（言われたことが）分かりません",
    l1:"I don't understand.", l2:"Sorry, I don't understand.", l3:"I'm sorry, I don't understand what you mean.",
    choices:["分かりません","知りません","聞こえません"], correct:0},
  {scene:"Emergency", ja:"英語は少ししか話せません",
    l1:"A little English.", l2:"I only speak a little English.", l3:"Sorry, I only speak a little English. Please speak slowly.",
    choices:["英語は少しだけ話せます","英語はぜんぜん話せません","英語は得意です"], correct:0},
  {scene:"Emergency", ja:"助けてください",
    l1:"Please help me.", l2:"Can you help me?", l3:"Excuse me, could you help me, please?",
    choices:["助けてください","写真を撮ってください","電話してください"], correct:0},
  {scene:"Emergency", ja:"トイレはどこですか？",
    l1:"Where's the restroom?", l2:"Where is the restroom?", l3:"Excuse me, where is the nearest restroom?",
    choices:["トイレはどこ？","駅はどこ？","出口はどこ？"], correct:0},
  {scene:"Emergency", ja:"道に迷いました",
    l1:"I'm lost.", l2:"I think I'm lost.", l3:"I'm sorry, I think I'm lost. Can you help me?",
    choices:["道に迷いました","疲れました","遅れました"], correct:0},
  {scene:"Emergency", ja:"気分が悪いです",
    l1:"I feel sick.", l2:"I don't feel well.", l3:"I don't feel well. I think I need to rest.",
    choices:["気分が悪いです","お腹がすきました","眠いです"], correct:0},
  {scene:"Emergency", ja:"スマホをなくしました",
    l1:"I lost my phone.", l2:"I think I lost my phone.", l3:"I lost my phone. Can you help me?",
    choices:["スマホをなくした","財布をなくした","鍵をなくした"], correct:0},
  {scene:"Emergency", ja:"先生に電話してください",
    l1:"Call my teacher, please.", l2:"Could you call my teacher?", l3:"Could you please call my teacher? Here's the number.",
    choices:["先生に電話して","家族に電話して","警察を呼んで"], correct:0}
];

// シーンごとに id を採番
const ITEMS = (()=>{
  const counter = {};
  return RAW_ITEMS.map(it=>{
    counter[it.scene] = (counter[it.scene]||0)+1;
    return {...it, id:`${it.scene}-${counter[it.scene]}`};
  });
})();

// ===== Q&A：相手に聞かれて、正しく答える =====
// 不正解は「似た質問への答え」にしてある（How old / How are you、Are you / Do you など）
// → 質問をちゃんと聞き取らないと選べない
const QA = [
  {scene:"Airport", q:"What's the purpose of your visit?", qja:"訪問の目的は？", answers:["I'm here to study.","For two weeks.","With a host family."], correct:0},
  {scene:"Airport", q:"How long will you stay?", qja:"どのくらい滞在しますか？", answers:["For two weeks.","I'm here to study.","By plane."], correct:0},
  {scene:"Airport", q:"Where are you staying?", qja:"どこに泊まりますか？", answers:["With a host family.","For two weeks.","I'm from Japan."], correct:0},
  {scene:"Homestay", q:"Are you hungry?", qja:"お腹すいてる？", answers:["Yes, a little.","Yes, I do.","Yes, it is."], correct:0},
  {scene:"Homestay", q:"Did you sleep well?", qja:"よく眠れた？", answers:["Yes, I did. Thanks.","Yes, I am.","Yes, I'm sleepy."], correct:0},
  {scene:"Homestay", q:"Would you like some more?", qja:"おかわりいる？", answers:["No, thanks. I'm full.","I'd like to go to bed.","No, it's not mine."], correct:0},
  {scene:"Homestay", q:"How was your day?", qja:"今日はどうだった？", answers:["It was fun!","It's Monday.","I'm from Japan."], correct:0},
  {scene:"Homestay", q:"Is there anything you can't eat?", qja:"食べられないものはある？", answers:["No, I can eat everything.","Yes, I can.","No, I'm not eating."], correct:0},
  {scene:"School", q:"Where are you from?", qja:"どこから来たの？", answers:["I'm from Japan.","I'm fine, thank you.","I'm {age}."], correct:0},
  {scene:"School", q:"How old are you?", qja:"何歳？", answers:["I'm {age}.","I'm fine, thank you.","I'm from Japan."], correct:0},
  {scene:"School", q:"How are you?", qja:"元気？", answers:["I'm good, thanks. How are you?","I'm {age}.","I'm from Japan."], correct:0},
  {scene:"School", q:"What do you like to do?", qja:"何をするのが好き？", answers:["I like {hobby}.","I'd like a burger.","Yes, I do."], correct:0},
  {scene:"School", q:"Do you understand?", qja:"分かった？", answers:["Yes, I do.","Yes, I am.","Yes, it is."], correct:0},
  {scene:"Small Talk", q:"What's up?", qja:"よっ、元気？（あいさつ）", answers:["Not much. How about you?","It's up there.","Yes, I am."], correct:0},
  {scene:"Small Talk", q:"Is this your first time in New York?", qja:"ニューヨークは初めて？", answers:["Yes, it is!","Yes, I do.","Yes, I can."], correct:0},
  {scene:"Small Talk", q:"How do you like New York?", qja:"ニューヨークはどう？（気に入った？）", answers:["I love it! It's amazing.","I like pizza.","By subway."], correct:0},
  {scene:"Small Talk", q:"Do you want to hang out after school?", qja:"放課後いっしょに遊ばない？", answers:["Sure! Sounds fun.","I'm in seventh grade.","It's after school."], correct:0},
  {scene:"Restaurant", q:"For here or to go?", qja:"店内で？持ち帰り？", answers:["For here, please.","Yes, please.","I'm going."], correct:0},
  {scene:"Restaurant", q:"Anything else?", qja:"他にご注文は？", answers:["No, that's all. Thank you.","Yes, I'm okay.","It's something."], correct:0},
  {scene:"Restaurant", q:"What can I get you?", qja:"ご注文は？", answers:["Can I get a cheeseburger?","I can get it.","You can get it."], correct:0},
  {scene:"Shopping", q:"Can I help you find anything?", qja:"何かお探しですか？", answers:["I'm just looking, thanks.","Yes, I can find it.","I'm fine, thank you. And you?"], correct:0},
  {scene:"Shopping", q:"Would you like a bag?", qja:"袋はいりますか？", answers:["No, thank you.","Yes, I like bags.","It's my bag."], correct:0},
  {scene:"Subway", q:"Are you okay? Do you need help?", qja:"大丈夫？手伝おうか？", answers:["Yes, please. Where is this station?","Yes, I help you.","I'm going to help."], correct:0}
].map((x,i)=>({...x, id:`QA-${i+1}`}));

const HOBBIES = [
  {en:"soccer", ja:"サッカー"},{en:"baseball", ja:"野球"},{en:"basketball", ja:"バスケ"},
  {en:"table tennis", ja:"卓球"},{en:"tennis", ja:"テニス"},{en:"swimming", ja:"水泳"},
  {en:"video games", ja:"ゲーム"},{en:"anime", ja:"アニメ"},{en:"music", ja:"音楽"},
  {en:"drawing", ja:"絵を描くこと"},{en:"reading", ja:"読書"},{en:"dancing", ja:"ダンス"}
];
