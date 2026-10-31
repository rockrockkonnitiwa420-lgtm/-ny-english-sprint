// ===== 学習データ =====
// フレーズを追加するときは、各シーンの末尾に追記してください（id は「シーン名-番号」で自動採番されるため、途中に挿入すると学習記録がずれます）。
// {name} はプロフィールで設定した名前に置き換わります。

const LEVELS = {
  1:{name:"超初級", rate:0.72, hint:"日本語ヒント多め", desc:"1〜4語中心。まずは聞いてマネする。"},
  2:{name:"初級", rate:0.88, hint:"日本語ヒント少なめ", desc:"短い文で受け答え。少しずつ自分で話す。"},
  3:{name:"留学実践", rate:1.0, hint:"ヒント最小限", desc:"現地に近い速さ。文章で返す練習。"}
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
  {scene:"Airport", ja:"入国審査で「旅行の目的は？」", l1:"Study.", l2:"I'm here to study.", l3:"I'm here for a two-week study program.", choices:["観光です","留学です","仕事です"], correct:1},
  {scene:"Airport", ja:"「どこに泊まりますか？」", l1:"Host family.", l2:"I'm staying with a host family.", l3:"I'll be staying with a host family in New York.", choices:["ホテルです","ホストファミリーです","空港です"], correct:1},
  {scene:"Airport", ja:"荷物が見つからない時", l1:"My bag?", l2:"I can't find my bag.", l3:"Excuse me, I can't find my checked bag.", choices:["荷物が見つかりません","切符をください","電話を貸してください"], correct:0},
  {scene:"Airport", ja:"「これはどこで受け取れますか？」", l1:"Where?", l2:"Where can I get this?", l3:"Where can I pick up my luggage?", choices:["どこで受け取れますか","いくらですか","何時ですか"], correct:0},
  {scene:"Airport", ja:"「手伝ってもらえますか？」", l1:"Help, please.", l2:"Can you help me?", l3:"Excuse me, could you help me, please?", choices:["写真を撮ってください","手伝ってください","待ってください"], correct:1},
  {scene:"Airport", ja:"「どのくらい滞在しますか？」への答え", l1:"Two weeks.", l2:"For two weeks.", l3:"I'm staying for two weeks.", choices:["2週間です","2日間です","2か月です"], correct:0},

  {scene:"Homestay", ja:"初対面のあいさつ", l1:"Nice to meet you.", l2:"Nice to meet you. I'm {name} from Japan.", l3:"Nice to meet you. Thank you for having me.", choices:["はじめまして","おやすみなさい","また明日"], correct:0},
  {scene:"Homestay", ja:"「シャワーを使ってもいいですか？」", l1:"Shower?", l2:"Can I use the shower?", l3:"Is it okay if I use the shower now?", choices:["シャワーを使っていいですか","窓を開けていいですか","外に出ていいですか"], correct:0},
  {scene:"Homestay", ja:"「何時に帰ればいいですか？」", l1:"What time?", l2:"What time should I be home?", l3:"What time would you like me to be home?", choices:["何時に帰ればいいですか","何時に起きますか","何時に食べますか"], correct:0},
  {scene:"Homestay", ja:"食事がおいしい時", l1:"Delicious!", l2:"This is really good.", l3:"This is delicious. Thank you for dinner.", choices:["おいしいです","辛すぎます","お腹いっぱいです"], correct:0},
  {scene:"Homestay", ja:"「分からないので、もう一度お願いします」", l1:"Again, please.", l2:"Could you say that again?", l3:"Sorry, I didn't understand. Could you say that again?", choices:["もう一度言ってください","少し待ってください","書いてください"], correct:0},
  {scene:"Homestay", ja:"「お腹いっぱいです」", l1:"I'm full.", l2:"I'm full, thank you.", l3:"I'm full. It was really good, thank you.", choices:["お腹いっぱいです","お腹がすきました","眠いです"], correct:0},
  {scene:"Homestay", ja:"「Wi-Fiのパスワードは何ですか？」", l1:"Wi-Fi password?", l2:"What's the Wi-Fi password?", l3:"Could you tell me the Wi-Fi password?", choices:["Wi-Fiのパスワードは？","充電器ある？","テレビ見ていい？"], correct:0},
  {scene:"Homestay", ja:"「手伝いましょうか？」", l1:"Can I help?", l2:"Can I help you?", l3:"Is there anything I can help with?", choices:["手伝いましょうか？","手伝って！","もう終わった？"], correct:0},
  {scene:"Homestay", ja:"「おやすみなさい」", l1:"Good night.", l2:"Good night. See you tomorrow.", l3:"I'm going to bed now. Good night!", choices:["おはよう","おやすみなさい","いってきます"], correct:1},

  {scene:"School", ja:"先生に「もう一度お願いします」", l1:"Again, please.", l2:"Could you say that again?", l3:"Sorry, could you say that again more slowly?", choices:["もっと速く","もう一度","終わりました"], correct:1},
  {scene:"School", ja:"「これはどういう意味ですか？」", l1:"Meaning?", l2:"What does this mean?", l3:"What does this word mean?", choices:["どういう意味ですか","どこですか","誰ですか"], correct:0},
  {scene:"School", ja:"「一緒に座ってもいい？」", l1:"Sit here?", l2:"Can I sit here?", l3:"Is it okay if I sit here with you?", choices:["ここに座っていい？","ここで待っていい？","ここで食べていい？"], correct:0},
  {scene:"School", ja:"自己紹介", l1:"I'm from Japan.", l2:"I'm from Japan. I like {hobby}.", l3:"I'm from Japan, and I'm here for two weeks. I like {hobby}.", choices:["日本から来ました","中国から来ました","韓国から来ました"], correct:0},
  {scene:"School", ja:"「一緒にやってもいい？」", l1:"Can I join?", l2:"Can I join you?", l3:"Can I join you guys?", choices:["一緒にやっていい？","帰っていい？","見ていい？"], correct:0},
  {scene:"School", ja:"「ゆっくり話してください」", l1:"Slowly, please.", l2:"Could you speak slowly?", l3:"Could you speak a little more slowly, please?", choices:["大きな声で","ゆっくり話して","静かにして"], correct:1},
  {scene:"School", ja:"「英語で何て言うの？」", l1:"In English?", l2:"How do you say this in English?", l3:"How do you say this in English?", choices:["英語で何て言う？","日本語で何て言う？","どう書くの？"], correct:0},
  {scene:"School", ja:"「トイレに行ってもいいですか？」", l1:"Restroom, please.", l2:"May I go to the restroom?", l3:"Excuse me, may I go to the restroom?", choices:["トイレに行っていい？","帰っていい？","水を飲んでいい？"], correct:0},

  {scene:"Small Talk", ja:"「何が好き？」と聞く", l1:"What do you like?", l2:"What do you like to do?", l3:"What do you like to do on weekends?", choices:["何が好き？","どこに住んでる？","何歳？"], correct:0},
  {scene:"Small Talk", ja:"「それいいね！」", l1:"Cool!", l2:"That's cool!", l3:"That's so cool! I want to try it.", choices:["それいいね！","それ違うよ","それ知らない"], correct:0},
  {scene:"Small Talk", ja:"「私も！」", l1:"Me too!", l2:"Me too! I like it.", l3:"Me too! I really like it.", choices:["私も！","私じゃない","ありがとう"], correct:0},
  {scene:"Small Talk", ja:"「インスタやってる？」", l1:"Instagram?", l2:"Do you have Instagram?", l3:"Do you have Instagram? Let's follow each other.", choices:["インスタやってる？","写真撮っていい？","電話番号は？"], correct:0},
  {scene:"Small Talk", ja:"「写真を一緒に撮ろう！」", l1:"Photo?", l2:"Can we take a picture?", l3:"Can we take a picture together?", choices:["一緒に写真撮ろう","写真を見せて","カメラ貸して"], correct:0},
  {scene:"Small Talk", ja:"「日本に来たことある？」", l1:"Japan?", l2:"Have you been to Japan?", l3:"Have you ever been to Japan?", choices:["日本に来たことある？","日本は好き？","日本語話せる？"], correct:0},

  {scene:"Subway", ja:"「この電車はタイムズスクエアに行きますか？」", l1:"Times Square?", l2:"Does this go to Times Square?", l3:"Excuse me, does this train go to Times Square?", choices:["タイムズスクエアに行きますか","空港に行きますか","ホテルに行きますか"], correct:0},
  {scene:"Subway", ja:"「どこで乗り換えますか？」", l1:"Change where?", l2:"Where do I change trains?", l3:"Where should I transfer to the next train?", choices:["どこで降りますか","どこで乗り換えますか","どこで買いますか"], correct:1},
  {scene:"Subway", ja:"「この席、空いていますか？」", l1:"Free?", l2:"Is this seat free?", l3:"Excuse me, is anyone sitting here?", choices:["この席は空いていますか","ここは駅ですか","これは無料ですか"], correct:0},
  {scene:"Subway", ja:"「次の駅はどこですか？」", l1:"Next?", l2:"What's the next stop?", l3:"Do you know what the next stop is?", choices:["次の駅は？","終点は？","出口は？"], correct:0},
  {scene:"Subway", ja:"「出口はどこですか？」", l1:"Exit?", l2:"Where is the exit?", l3:"Excuse me, which way is the exit?", choices:["入口は？","出口は？","トイレは？"], correct:1},
  {scene:"Subway", ja:"「アップタウン（北）行きはどっち？」", l1:"Uptown?", l2:"Which way is uptown?", l3:"Excuse me, is this the uptown platform?", choices:["北行きはどっち？","南行きはどっち？","バス停はどこ？"], correct:0},

  {scene:"Sightseeing", ja:"「写真を撮ってもらえますか？」", l1:"Picture, please.", l2:"Could you take a picture?", l3:"Excuse me, could you take a picture of us?", choices:["写真を撮ってもらえますか","写真を撮っていいですか","写真を消してください"], correct:0},
  {scene:"Sightseeing", ja:"「チケットを1枚ください」", l1:"One ticket.", l2:"One ticket, please.", l3:"Can I get one student ticket, please?", choices:["チケット1枚","チケット2枚","チケット不要"], correct:0},
  {scene:"Sightseeing", ja:"「学生割引はありますか？」", l1:"Student?", l2:"Is there a student discount?", l3:"Do you have a student discount?", choices:["学生割引ある？","子ども料金ある？","無料ですか？"], correct:0},
  {scene:"Sightseeing", ja:"「何時に閉まりますか？」", l1:"Close when?", l2:"What time do you close?", l3:"What time does the museum close?", choices:["何時に開く？","何時に閉まる？","何時に始まる？"], correct:1},
  {scene:"Sightseeing", ja:"「ここで写真を撮ってもいいですか？」", l1:"Photo okay?", l2:"Can I take pictures here?", l3:"Is it okay to take pictures here?", choices:["ここで写真OK？","ここで食べてOK？","ここに座ってOK？"], correct:0},

  {scene:"Shopping", ja:"「これはいくらですか？」", l1:"How much?", l2:"How much is this?", l3:"Excuse me, how much is this?", choices:["これはいくら？","これは何？","これは誰の？"], correct:0},
  {scene:"Shopping", ja:"「試着してもいいですか？」", l1:"Try on?", l2:"Can I try this on?", l3:"Can I try this on, please?", choices:["買っていい？","試着していい？","触っていい？"], correct:1},
  {scene:"Shopping", ja:"「小さいサイズはありますか？」", l1:"Smaller?", l2:"Do you have a smaller size?", l3:"Do you have this in a smaller size?", choices:["別の色は？","小さいサイズは？","大きいサイズは？"], correct:1},
  {scene:"Shopping", ja:"「カードで払えますか？」", l1:"Card?", l2:"Can I pay by card?", l3:"Can I pay with a credit card?", choices:["現金だけ？","カードで払える？","値引きできる？"], correct:1},
  {scene:"Shopping", ja:"「これをください」", l1:"This, please.", l2:"I'll take this.", l3:"I'll take this one, please.", choices:["これをください","これは要りません","見ているだけです"], correct:0},
  {scene:"Shopping", ja:"「見ているだけです」", l1:"Just looking.", l2:"I'm just looking, thanks.", l3:"I'm just looking, thank you.", choices:["これをください","見ているだけです","探しています"], correct:1},

  {scene:"Restaurant", ja:"「水をください」", l1:"Water, please.", l2:"Can I have some water, please?", l3:"Could I have some water, please?", choices:["水をください","メニューをください","お会計をください"], correct:0},
  {scene:"Restaurant", ja:"「ハンバーガーをお願いします」", l1:"Burger, please.", l2:"I'd like a hamburger, please.", l3:"I'd like the hamburger, please.", choices:["ハンバーガーをください","ピザをください","水をください"], correct:0},
  {scene:"Restaurant", ja:"「これは辛いですか？」", l1:"Spicy?", l2:"Is this spicy?", l3:"Is this dish very spicy?", choices:["これは甘い？","これは辛い？","これは熱い？"], correct:1},
  {scene:"Restaurant", ja:"「ナッツは入っていますか？」", l1:"Nuts?", l2:"Does this have nuts?", l3:"Does this dish contain any nuts?", choices:["ナッツは入っていますか","肉は入っていますか","卵は入っていますか"], correct:0},
  {scene:"Restaurant", ja:"「お会計をお願いします」", l1:"Check, please.", l2:"Can we get the check, please?", l3:"Excuse me, could we get the check, please?", choices:["注文します","お会計お願いします","もう一杯ください"], correct:1},
  {scene:"Restaurant", ja:"「持ち帰りで」", l1:"To go.", l2:"To go, please.", l3:"Can I get this to go, please?", choices:["持ち帰りで","ここで食べます","まだ決めていません"], correct:0},
  {scene:"Restaurant", ja:"「おすすめは何ですか？」", l1:"Recommend?", l2:"What do you recommend?", l3:"What would you recommend here?", choices:["おすすめは？","一番安いのは？","人気は？"], correct:0},

  {scene:"Emergency", ja:"「分かりません」", l1:"I don't understand.", l2:"Sorry, I don't understand.", l3:"I'm sorry, I don't understand what you mean.", choices:["分かりません","知りません","聞こえません"], correct:0},
  {scene:"Emergency", ja:"「もう一度言ってください」", l1:"Again, please.", l2:"Could you say that again?", l3:"Could you say that again a little more slowly?", choices:["もう一度言ってください","書いてください","待ってください"], correct:0},
  {scene:"Emergency", ja:"「助けてください」", l1:"Help, please.", l2:"Can you help me?", l3:"Excuse me, could you help me?", choices:["助けてください","写真を撮ってください","電話してください"], correct:0},
  {scene:"Emergency", ja:"「トイレはどこですか？」", l1:"Restroom?", l2:"Where is the restroom?", l3:"Excuse me, where is the nearest restroom?", choices:["駅はどこ？","トイレはどこ？","出口はどこ？"], correct:1},
  {scene:"Emergency", ja:"「迷いました」", l1:"I'm lost.", l2:"I think I'm lost.", l3:"I'm sorry, I think I'm lost. Can you help me?", choices:["疲れました","迷いました","遅れました"], correct:1},
  {scene:"Emergency", ja:"「気分が悪いです」", l1:"I feel sick.", l2:"I don't feel well.", l3:"I don't feel well. I think I need to rest.", choices:["気分が悪いです","お腹がすきました","眠いです"], correct:0},
  {scene:"Emergency", ja:"「スマホをなくしました」", l1:"My phone!", l2:"I lost my phone.", l3:"I think I lost my phone. Can you help me?", choices:["財布をなくした","スマホをなくした","鍵をなくした"], correct:1},
  {scene:"Emergency", ja:"「先生に電話してください」", l1:"Call my teacher.", l2:"Please call my teacher.", l3:"Could you please call my teacher? Here is the number.", choices:["先生に電話して","家族に電話して","警察を呼んで"], correct:0}
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
// q:相手が言う英語 / qja:意味 / answers:返事の候補(英語) / correct:正解
const QA = [
  {scene:"Airport", q:"What's the purpose of your visit?", qja:"訪問の目的は？", answers:["I'm here to study.","I'm thirteen.","Yes, please."], correct:0},
  {scene:"Airport", q:"How long are you staying?", qja:"どのくらい滞在しますか？", answers:["By plane.","For two weeks.","I'm from Japan."], correct:1},
  {scene:"Airport", q:"Do you have anything to declare?", qja:"申告するものはありますか？", answers:["No, nothing.","It's on the table.","I like pizza."], correct:0},
  {scene:"Homestay", q:"Are you hungry?", qja:"お腹すいてる？", answers:["It's blue.","Yes, a little.","I'm from Tokyo."], correct:1},
  {scene:"Homestay", q:"Did you sleep well?", qja:"よく眠れた？", answers:["Yes, I did. Thank you.","Yes, I am.","No, it's not mine."], correct:0},
  {scene:"Homestay", q:"Do you want some more?", qja:"おかわりいる？", answers:["I'm fine, thank you. I'm full.","I want to go home.","It's my bag."], correct:0},
  {scene:"Homestay", q:"How was your day?", qja:"今日はどうだった？", answers:["It was fun!","It's Monday.","At seven."], correct:0},
  {scene:"Homestay", q:"Is there anything you can't eat?", qja:"食べられないものはある？", answers:["Yes, I can.","No, I can eat everything.","I'm eating now."], correct:1},
  {scene:"Homestay", q:"Do you need anything?", qja:"何か必要なものある？", answers:["Can I have a towel?","I'm thirteen.","It's sunny."], correct:0},
  {scene:"School", q:"Where are you from?", qja:"どこから来たの？", answers:["I'm from Japan.","I'm fine.","I like soccer."], correct:0},
  {scene:"School", q:"How old are you?", qja:"何歳？", answers:["I'm thirteen.","I'm Japanese.","I'm okay."], correct:0},
  {scene:"School", q:"What do you like to do?", qja:"何をするのが好き？", answers:["I like {hobby}.","I'm from Japan.","Thank you."], correct:0},
  {scene:"School", q:"Do you understand?", qja:"分かった？", answers:["Yes, I am.","Sorry, could you say that again?","It's mine."], correct:1},
  {scene:"Small Talk", q:"What's up?", qja:"元気？どうしたの？（あいさつ）", answers:["Not much. How about you?","Up there.","I'm thirteen."], correct:0},
  {scene:"Small Talk", q:"Have you been to New York before?", qja:"ニューヨークは初めて？", answers:["No, this is my first time.","Yes, I'm going.","I like it."], correct:0},
  {scene:"Small Talk", q:"What do you think of New York?", qja:"ニューヨークどう思う？", answers:["It's amazing!","It's ten o'clock.","I think so."], correct:0},
  {scene:"Restaurant", q:"For here or to go?", qja:"店内で？持ち帰り？", answers:["For here, please.","Yes, I do.","Go to school."], correct:0},
  {scene:"Restaurant", q:"Anything else?", qja:"他にご注文は？", answers:["That's it, thank you.","It's here.","I'm Japanese."], correct:0},
  {scene:"Restaurant", q:"What can I get for you?", qja:"ご注文は？", answers:["Can I get a cheeseburger?","I'm good at math.","Get up."], correct:0},
  {scene:"Shopping", q:"Can I help you find anything?", qja:"何かお探しですか？", answers:["I'm just looking, thanks.","Find it!","I can't."], correct:0},
  {scene:"Shopping", q:"Would you like a bag?", qja:"袋はいりますか？", answers:["No, thank you.","I like bags.","It's blue."], correct:0},
  {scene:"Subway", q:"Are you okay? Do you need help?", qja:"大丈夫？手伝おうか？", answers:["Yes, please. I'm looking for this station.","I'm thirteen.","See you."], correct:0}
].map((x,i)=>({...x, id:`QA-${i+1}`}));

const HOBBIES = [
  {en:"soccer", ja:"サッカー"},{en:"baseball", ja:"野球"},{en:"basketball", ja:"バスケ"},
  {en:"table tennis", ja:"卓球"},{en:"tennis", ja:"テニス"},{en:"swimming", ja:"水泳"},
  {en:"video games", ja:"ゲーム"},{en:"anime", ja:"アニメ"},{en:"music", ja:"音楽"},
  {en:"drawing", ja:"絵を描くこと"},{en:"reading", ja:"読書"},{en:"dancing", ja:"ダンス"}
];
