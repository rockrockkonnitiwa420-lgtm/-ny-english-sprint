
const LEVELS = {
  1:{name:"超初級", rate:0.72, hint:"日本語ヒント多め", desc:"1〜4語中心。まずは聞いてマネする。"},
  2:{name:"初級", rate:0.88, hint:"日本語ヒント少なめ", desc:"短い文で受け答え。少しずつ自分で話す。"},
  3:{name:"留学実践", rate:1.0, hint:"ヒント最小限", desc:"現地に近い速さ。文章で返す練習。"}
};

const ITEMS = [
  {scene:"Airport", ja:"入国審査で「旅行の目的は？」", l1:"Study.", l2:"I'm here to study.", l3:"I'm here for a two-week study program.", choices:["観光です","留学です","仕事です"], correct:1},
  {scene:"Airport", ja:"「どこに泊まりますか？」", l1:"Host family.", l2:"I'm staying with a host family.", l3:"I'll be staying with a host family in New York.", choices:["ホテルです","ホストファミリーです","空港です"], correct:1},
  {scene:"Airport", ja:"荷物が見つからない時", l1:"My bag?", l2:"I can't find my bag.", l3:"Excuse me, I can't find my checked bag.", choices:["荷物が見つかりません","切符をください","電話を貸してください"], correct:0},
  {scene:"Airport", ja:"「これはどこで受け取れますか？」", l1:"Where?", l2:"Where can I get this?", l3:"Where can I pick up my luggage?", choices:["どこで受け取れますか","いくらですか","何時ですか"], correct:0},
  {scene:"Airport", ja:"「手伝ってもらえますか？」", l1:"Help, please.", l2:"Can you help me?", l3:"Excuse me, could you help me, please?", choices:["写真を撮ってください","手伝ってください","待ってください"], correct:1},

  {scene:"Homestay", ja:"初対面のあいさつ", l1:"Nice to meet you.", l2:"Nice to meet you. I'm ___ from Japan.", l3:"Nice to meet you. Thank you for having me.", choices:["はじめまして","おやすみなさい","また明日"], correct:0},
  {scene:"Homestay", ja:"「シャワーを使ってもいいですか？」", l1:"Shower?", l2:"Can I use the shower?", l3:"Is it okay if I use the shower now?", choices:["シャワーを使っていいですか","窓を開けていいですか","外に出ていいですか"], correct:0},
  {scene:"Homestay", ja:"「何時に帰ればいいですか？」", l1:"What time?", l2:"What time should I be home?", l3:"What time would you like me to be home?", choices:["何時に帰ればいいですか","何時に起きますか","何時に食べますか"], correct:0},
  {scene:"Homestay", ja:"食事がおいしい時", l1:"Delicious!", l2:"This is really good.", l3:"This is delicious. Thank you for dinner.", choices:["おいしいです","辛すぎます","お腹いっぱいです"], correct:0},
  {scene:"Homestay", ja:"「分からないので、もう一度お願いします」", l1:"Again, please.", l2:"Could you say that again?", l3:"Sorry, I didn't understand. Could you say that again?", choices:["もう一度言ってください","少し待ってください","書いてください"], correct:0},

  {scene:"School", ja:"先生に「もう一度お願いします」", l1:"Again, please.", l2:"Could you say that again?", l3:"Sorry, could you say that again more slowly?", choices:["もっと速く","もう一度","終わりました"], correct:1},
  {scene:"School", ja:"「これはどういう意味ですか？」", l1:"Meaning?", l2:"What does this mean?", l3:"What does this word mean?", choices:["どういう意味ですか","どこですか","誰ですか"], correct:0},
  {scene:"School", ja:"「一緒に座ってもいい？」", l1:"Sit here?", l2:"Can I sit here?", l3:"Is it okay if I sit here with you?", choices:["ここに座っていい？","ここで待っていい？","ここで食べていい？"], correct:0},
  {scene:"School", ja:"自己紹介", l1:"I'm from Japan.", l2:"I'm from Japan. I like table tennis.", l3:"I'm from Japan, and I'm here for two weeks. I like table tennis.", choices:["日本から来ました","中国から来ました","韓国から来ました"], correct:0},
  {scene:"School", ja:"「一緒にやってもいい？」", l1:"Can I join?", l2:"Can I join you?", l3:"Can I join you guys?", choices:["一緒にやっていい？","帰っていい？","見ていい？"], correct:0},

  {scene:"Subway", ja:"「この電車はタイムズスクエアに行きますか？」", l1:"Times Square?", l2:"Does this go to Times Square?", l3:"Excuse me, does this train go to Times Square?", choices:["タイムズスクエアに行きますか","空港に行きますか","ホテルに行きますか"], correct:0},
  {scene:"Subway", ja:"「どこで乗り換えますか？」", l1:"Change where?", l2:"Where do I change trains?", l3:"Where should I transfer to the next train?", choices:["どこで降りますか","どこで乗り換えますか","どこで買いますか"], correct:1},
  {scene:"Subway", ja:"「この席、空いていますか？」", l1:"Free?", l2:"Is this seat free?", l3:"Excuse me, is anyone sitting here?", choices:["この席は空いていますか","ここは駅ですか","これは無料ですか"], correct:0},
  {scene:"Subway", ja:"「次の駅はどこですか？」", l1:"Next?", l2:"What's the next stop?", l3:"Do you know what the next stop is?", choices:["次の駅は？","終点は？","出口は？"], correct:0},
  {scene:"Subway", ja:"「出口はどこですか？」", l1:"Exit?", l2:"Where is the exit?", l3:"Excuse me, which way is the exit?", choices:["入口は？","出口は？","トイレは？"], correct:1},

  {scene:"Shopping", ja:"「これはいくらですか？」", l1:"How much?", l2:"How much is this?", l3:"Excuse me, how much is this?", choices:["これはいくら？","これは何？","これは誰の？"], correct:0},
  {scene:"Shopping", ja:"「試着してもいいですか？」", l1:"Try on?", l2:"Can I try this on?", l3:"Can I try this on, please?", choices:["買っていい？","試着していい？","触っていい？"], correct:1},
  {scene:"Shopping", ja:"「小さいサイズはありますか？」", l1:"Smaller?", l2:"Do you have a smaller size?", l3:"Do you have this in a smaller size?", choices:["別の色は？","小さいサイズは？","大きいサイズは？"], correct:1},
  {scene:"Shopping", ja:"「カードで払えますか？」", l1:"Card?", l2:"Can I pay by card?", l3:"Can I pay with a credit card?", choices:["現金だけ？","カードで払える？","値引きできる？"], correct:1},
  {scene:"Shopping", ja:"「これをください」", l1:"This, please.", l2:"I'll take this.", l3:"I'll take this one, please.", choices:["これをください","これは要りません","見ているだけです"], correct:0},

  {scene:"Restaurant", ja:"「水をください」", l1:"Water, please.", l2:"Can I have some water, please?", l3:"Could I have some water, please?", choices:["水をください","メニューをください","お会計をください"], correct:0},
  {scene:"Restaurant", ja:"「ハンバーガーをお願いします」", l1:"Burger, please.", l2:"I'd like a hamburger, please.", l3:"I'd like the hamburger, please.", choices:["ハンバーガーをください","ピザをください","水をください"], correct:0},
  {scene:"Restaurant", ja:"「これは辛いですか？」", l1:"Spicy?", l2:"Is this spicy?", l3:"Is this dish very spicy?", choices:["これは甘い？","これは辛い？","これは熱い？"], correct:1},
  {scene:"Restaurant", ja:"「ナッツは入っていますか？」", l1:"Nuts?", l2:"Does this have nuts?", l3:"Does this dish contain any nuts?", choices:["ナッツは入っていますか","肉は入っていますか","卵は入っていますか"], correct:0},
  {scene:"Restaurant", ja:"「お会計をお願いします」", l1:"Check, please.", l2:"Can we get the check, please?", l3:"Excuse me, could we get the check, please?", choices:["注文します","お会計お願いします","もう一杯ください"], correct:1},

  {scene:"Emergency", ja:"「分かりません」", l1:"I don't understand.", l2:"Sorry, I don't understand.", l3:"I'm sorry, I don't understand what you mean.", choices:["分かりません","知りません","聞こえません"], correct:0},
  {scene:"Emergency", ja:"「もう一度言ってください」", l1:"Again, please.", l2:"Could you say that again?", l3:"Could you say that again a little more slowly?", choices:["もう一度言ってください","書いてください","待ってください"], correct:0},
  {scene:"Emergency", ja:"「助けてください」", l1:"Help, please.", l2:"Can you help me?", l3:"Excuse me, could you help me?", choices:["助けてください","写真を撮ってください","電話してください"], correct:0},
  {scene:"Emergency", ja:"「トイレはどこですか？」", l1:"Restroom?", l2:"Where is the restroom?", l3:"Excuse me, where is the nearest restroom?", choices:["駅はどこ？","トイレはどこ？","出口はどこ？"], correct:1},
  {scene:"Emergency", ja:"「迷いました」", l1:"I'm lost.", l2:"I think I'm lost.", l3:"I'm sorry, I think I'm lost. Can you help me?", choices:["疲れました","迷いました","遅れました"], correct:1}
];

const SCENES = ["Airport","Homestay","School","Subway","Shopping","Restaurant","Emergency"];

const $ = s => document.querySelector(s);
let state = {
  level:Number(localStorage.getItem("ny_level")||1),
  streak:Number(localStorage.getItem("ny_streak")||0),
  done:Number(localStorage.getItem("ny_done")||0),
  learned:Number(localStorage.getItem("ny_learned")||0),
  lastDate:localStorage.getItem("ny_last_date")||"",
  departure:localStorage.getItem("ny_departure")||"",
  speed:1
};
let queue=[], qi=0, mode="listen", currentScene=null;

function save(){ localStorage.setItem("ny_level",state.level); localStorage.setItem("ny_streak",state.streak); localStorage.setItem("ny_done",state.done); localStorage.setItem("ny_learned",state.learned); localStorage.setItem("ny_last_date",state.lastDate); localStorage.setItem("ny_departure",state.departure);}
function phrase(item){ return item["l"+state.level]; }
function todayStr(){ return new Date().toISOString().slice(0,10); }

function updateStreak(){
  const t=todayStr();
  if(state.lastDate===t) return;
  if(state.lastDate){
    const diff=(new Date(t)-new Date(state.lastDate))/86400000;
    state.streak = diff===1 ? state.streak+1 : 1;
  } else state.streak=1;
  state.lastDate=t; save();
}
function renderHome(){
  $("#levelBtn").textContent="Level "+state.level;
  $("#levelName").textContent=LEVELS[state.level].name;
  $("#streak").textContent=state.streak;
  $("#doneCount").textContent=state.done;
  $("#learnedCount").textContent=state.learned;
  if(state.departure){
    const d=Math.ceil((new Date(state.departure+"T00:00:00")-new Date())/86400000);
    $("#daysLeft").textContent=Math.max(0,d);
    $("#departureText").textContent=state.departure.replaceAll("-","/");
    $("#departureInput").value=state.departure;
  } else {
    $("#daysLeft").textContent="--"; $("#departureText").textContent="出発日を設定してください";
  }
}
function showView(id){ document.querySelectorAll(".view").forEach(v=>v.classList.remove("active")); $(id).classList.add("active"); window.scrollTo({top:0,behavior:"smooth"});}
function makeScenes(){
  $("#sceneGrid").innerHTML="";
  SCENES.forEach(s=>{
    const b=document.createElement("button"); b.className="scene-btn card";
    b.innerHTML=`<b>${s}</b><span>${ITEMS.filter(x=>x.scene===s).length} phrases</span>`;
    b.onclick=()=>startPractice("listen",s);
    $("#sceneGrid").appendChild(b);
  });
}
function startPractice(m,scene=null){
  mode=m; currentScene=scene;
  let pool=scene?ITEMS.filter(x=>x.scene===scene):ITEMS.slice();
  queue=pool.sort(()=>Math.random()-.5).slice(0,5);
  qi=0; $("#modeLabel").textContent=(scene||m).toUpperCase();
  $("#practiceTitle").textContent=scene?`${scene} 練習`:({listen:"Listening",shadow:"Shadowing",speak:"Speaking"}[m]);
  showView("#practiceView"); renderQuestion();
}
function renderQuestion(){
  const item=queue[qi];
  $("#questionIndex").textContent=qi+1; $("#questionTotal").textContent=queue.length;
  $("#progressBar").style.width=`${(qi/queue.length)*100}%`;
  $("#sceneLabel").textContent=item.scene;
  $("#promptJa").textContent = state.level===3 && mode!=="listen" ? "英語で答えてみよう" : item.ja;
  $("#englishText").textContent=phrase(item);
  $("#feedback").textContent=""; $("#nextBtn").classList.add("hidden"); $("#revealBtn").classList.add("hidden");
  $("#choices").innerHTML=""; $("#speakArea").classList.add("hidden"); $("#englishText").classList.add("hidden");

  if(mode==="listen"){
    $("#choices").classList.remove("hidden");
    item.choices.forEach((c,i)=>{
      const b=document.createElement("button"); b.className="choice"; b.textContent=c;
      b.onclick=()=>checkChoice(i,b,item);
      $("#choices").appendChild(b);
    });
  } else if(mode==="shadow"){
    $("#choices").classList.add("hidden"); $("#englishText").classList.remove("hidden");
    $("#speakArea").classList.remove("hidden"); $("#revealBtn").classList.add("hidden");
    setupSpeech(item,true);
  } else {
    $("#choices").classList.add("hidden"); $("#speakArea").classList.remove("hidden");
    $("#revealBtn").classList.remove("hidden");
    setupSpeech(item,false);
  }
  speakText(phrase(item), false);
}
function checkChoice(i,b,item){
  document.querySelectorAll(".choice").forEach(x=>x.disabled=true);
  if(i===item.correct){ b.classList.add("correct"); $("#feedback").textContent="Good! 次は声に出して言ってみよう。"; $("#englishText").classList.remove("hidden"); speakText(phrase(item),false); }
  else { b.classList.add("wrong"); document.querySelectorAll(".choice")[item.correct].classList.add("correct"); $("#feedback").textContent="大丈夫。答えを聞いて、声に出してマネしよう。"; $("#englishText").classList.remove("hidden"); }
  state.learned++; save(); $("#nextBtn").classList.remove("hidden");
}
function speakText(text, slow=true){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text); u.lang="en-US"; u.rate=LEVELS[state.level].rate*state.speed; u.pitch=1;
  speechSynthesis.speak(u);
}
function setupSpeech(item,isShadow){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  $("#transcript").textContent="マイクを押して英語で話そう";
  $("#manualDoneBtn").classList.toggle("hidden",!!SR);
  $("#micBtn").classList.toggle("hidden",!SR);
  $("#micBtn").onclick=()=>{
    if(!SR){return}
    const rec=new SR(); rec.lang="en-US"; rec.interimResults=false; rec.maxAlternatives=1;
    $("#transcript").textContent="Listening...";
    rec.onresult=e=>{
      const t=e.results[0][0].transcript; $("#transcript").textContent=t;
      const target=phrase(item).toLowerCase().replace(/[^\w\s']/g,"");
      const said=t.toLowerCase().replace(/[^\w\s']/g,"");
      const targetWords=target.split(/\s+/).filter(Boolean);
      const hit=targetWords.filter(w=>said.includes(w)).length;
      const score=Math.round(hit/Math.max(1,targetWords.length)*100);
      $("#feedback").textContent=score>=60?`Nice! ${score}%くらい伝わっているよ。`:`もう一度。まずはゆっくりでOK。 (${score}%)`;
      $("#nextBtn").classList.remove("hidden"); state.learned++; save();
    };
    rec.onerror=()=>{ $("#transcript").textContent="音声認識が使えない場合は、下のボタンで進めてOK。"; $("#manualDoneBtn").classList.remove("hidden"); };
    rec.start();
  };
  $("#manualDoneBtn").onclick=()=>{ $("#feedback").textContent="Good! 声に出せたらOK。"; $("#nextBtn").classList.remove("hidden"); state.learned++; save(); };
}
$("#playBtn").onclick=()=>speakText(phrase(queue[qi]),false);
document.querySelectorAll("[data-speed]").forEach(b=>b.onclick=()=>{
  state.speed=Number(b.dataset.speed); document.querySelectorAll("[data-speed]").forEach(x=>x.classList.remove("active")); b.classList.add("active");
});
$("#nextBtn").onclick=()=>{
  qi++;
  if(qi>=queue.length){
    state.done++; updateStreak(); save(); renderHome(); alert("今日のトレーニング完了！よくできた。"); showView("#homeView");
  } else renderQuestion();
};
$("#revealBtn").onclick=()=>{$("#englishText").classList.remove("hidden"); speakText(phrase(queue[qi]),false);};
document.querySelectorAll(".training").forEach(b=>b.onclick=()=>startPractice(b.dataset.mode));
$("#survivalBtn").onclick=()=>startPractice("shadow","Emergency");
$("#backBtn").onclick=()=>{renderHome();showView("#homeView")};
$("#settingsBackBtn").onclick=()=>{renderHome();showView("#homeView")};
$("#levelBtn").onclick=()=>{renderLevels();showView("#settingsView")};

function renderLevels(){
  $("#levelCards").innerHTML="";
  Object.entries(LEVELS).forEach(([k,v])=>{
    const d=document.createElement("button"); d.className="level-card card"+(Number(k)===state.level?" selected":"");
    d.innerHTML=`<div class="eyebrow">LEVEL ${k}</div><h3>${v.name}</h3><p>${v.desc}</p><p>${v.hint}</p>`;
    d.onclick=()=>{state.level=Number(k);save();renderLevels();renderHome();};
    $("#levelCards").appendChild(d);
  });
}
$("#setDateBtn").onclick=()=>$("#dateDialog").showModal();
$("#saveDateBtn").onclick=()=>{state.departure=$("#departureInput").value;save();renderHome();};

if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
makeScenes(); renderHome();
