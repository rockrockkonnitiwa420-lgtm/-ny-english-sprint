// ===== NY English Sprint =====
// data.js（LEVELS / SCENE_INFO / SCENES / ITEMS / QA / HOBBIES）を先に読み込むこと

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const DAY = 86400000;
const DAILY_GOAL = 2;
const QUESTIONS_PER_SESSION = 5;

function loadJSON(key, fallback){
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
}

let state = {
  level:Number(localStorage.getItem("ny_level")||1),
  streak:Number(localStorage.getItem("ny_streak")||0),
  done:Number(localStorage.getItem("ny_done")||0),
  learned:Number(localStorage.getItem("ny_learned")||0),
  lastDate:localStorage.getItem("ny_last_date")||"",
  departure:localStorage.getItem("ny_departure")||"",
  profile:loadJSON("ny_profile", {name:"", age:"13", hobby:"soccer"}),
  stats:loadJSON("ny_stats_v2", {}),   // { itemId: {ok, ng, last} }（v2: 問題データ改訂で記録を作り直し）
  today:loadJSON("ny_today", {date:"", n:0}),
  speed:1
};

let queue=[], qi=0, mode="listen", currentScene=null, sessionOk=0, answered=false;

function save(){
  localStorage.setItem("ny_level",state.level);
  localStorage.setItem("ny_streak",state.streak);
  localStorage.setItem("ny_done",state.done);
  localStorage.setItem("ny_learned",state.learned);
  localStorage.setItem("ny_last_date",state.lastDate);
  localStorage.setItem("ny_departure",state.departure);
  localStorage.setItem("ny_profile",JSON.stringify(state.profile));
  localStorage.setItem("ny_stats_v2",JSON.stringify(state.stats));
  localStorage.setItem("ny_today",JSON.stringify(state.today));
}

// ---------- 日付（端末のローカル時刻で判定） ----------
const pad = n => String(n).padStart(2,"0");
function todayStr(){ const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function dayDiff(from, to){ return Math.round((Date.parse(to+"T00:00:00")-Date.parse(from+"T00:00:00"))/DAY); }
function daysLeft(){ return state.departure ? dayDiff(todayStr(), state.departure) : null; }

function updateStreak(){
  const t=todayStr();
  if(state.lastDate===t) return;
  state.streak = state.lastDate && dayDiff(state.lastDate,t)===1 ? state.streak+1 : 1;
  state.lastDate=t;
}
function todayCount(){ return state.today.date===todayStr() ? state.today.n : 0; }
function currentStreak(){
  // 昨日も今日もやっていなければ連続記録は途切れている
  if(!state.lastDate) return 0;
  return dayDiff(state.lastDate, todayStr())<=1 ? state.streak : 0;
}

// ---------- テキスト ----------
function fill(s){
  const p=state.profile;
  return s.replaceAll("{name}", p.name.trim()||"Taro")
    .replaceAll("{hobbyJa}", hobbyJa(p.hobby||"soccer"))
    .replaceAll("{hobby}", p.hobby||"soccer")
    .replaceAll("{age}", numberWord(p.age));
}
function phrase(item){
  if(item.text) return fill(item.text);           // 自己紹介
  if(item.q) return fill(item.answers[item.correct]); // Q&A の正解の返事
  return fill(item["l"+state.level]);
}
function hobbyJa(en){ return (HOBBIES.find(h=>h.en===en)||{ja:en}).ja; }

function introItems(){
  const p=state.profile;
  return [
    {id:"intro-1", scene:"My Intro", ja:`こんにちは、${p.name.trim()||"（名前）"}です。`, text:"Hi, I'm {name}."},
    {id:"intro-2", scene:"My Intro", ja:"日本から来ました。", text:"I'm from Japan."},
    {id:"intro-3", scene:"My Intro", ja:`${p.age||13}歳です。`, text:`I'm ${numberWord(p.age)} years old.`},
    {id:"intro-4", scene:"My Intro", ja:`${hobbyJa(p.hobby)}が好きです。`, text:"I like {hobby}."},
    {id:"intro-5", scene:"My Intro", ja:"ニューヨークは初めてです。", text:"This is my first time in New York."},
    {id:"intro-6", scene:"My Intro", ja:"よろしくね！", text:"Nice to meet you!"}
  ];
}
function numberWord(n){
  const w={11:"eleven",12:"twelve",13:"thirteen",14:"fourteen",15:"fifteen"};
  return w[Number(n)]||String(n||13);
}

// ---------- 学習記録 ----------
function record(item, ok){
  const s=state.stats[item.id]||{ok:0,ng:0,last:""};
  ok ? s.ok++ : s.ng++;
  s.last=todayStr();
  state.stats[item.id]=s;
  state.learned++;
  save();
}
function isMastered(id){ const s=state.stats[id]; return !!s && s.ok>=2 && s.ok>s.ng; }
function isWeak(id){ const s=state.stats[id]; return !!s && s.ng>0 && !isMastered(id); }
function weight(item){
  const s=state.stats[item.id];
  if(!s) return 2.5;                                   // まだ見ていない
  let w=Math.max(0.3, 1 + s.ng*2 - s.ok*0.5);          // 間違えたものほど出やすく
  if(s.last===todayStr()) w*=0.5;                      // 今日やったものは少し控えめ
  return w;
}
function weightedPick(pool, n){
  const list=pool.slice(), out=[];
  while(out.length<n && list.length){
    const total=list.reduce((a,x)=>a+weight(x),0);
    let r=Math.random()*total, i=0;
    for(; i<list.length-1; i++){ r-=weight(list[i]); if(r<=0) break; }
    out.push(list.splice(i,1)[0]);
  }
  return out;
}

// ---------- 音声 ----------
let voice=null;
function pickVoice(){
  if(!("speechSynthesis" in window)) return;
  const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]US/i.test(v.lang));
  voice = vs.find(v=>/Samantha|Google US English|Aaron|Nicky/i.test(v.name)) || vs[0] || null;
}
if("speechSynthesis" in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }

function speakText(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-US"; if(voice) u.voice=voice;
  u.rate=LEVELS[state.level].rate*state.speed;
  speechSynthesis.speak(u);
}

const words = s => s.toLowerCase().replace(/[’]/g,"'").replace(/[^a-z0-9\s']/g," ").split(/\s+/).filter(Boolean);
function matchScore(target, said){
  const t=words(target), heard=new Set(words(said));
  if(!t.length) return 0;
  return Math.round(t.filter(w=>heard.has(w)).length/t.length*100);
}

let recognizer=null;
function setupSpeech(item, targetText){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  $("#speakArea").classList.remove("hidden");
  $("#transcript").textContent= SR ? "🎙を押して英語で話そう" : "声に出して言えたら、下のボタンを押そう";
  $("#manualDoneBtn").classList.toggle("hidden",!!SR);
  $("#micBtn").classList.toggle("hidden",!SR);
  $("#micBtn").textContent="🎙 話す";
  $("#micBtn").onclick=()=>{
    if(!SR) return;
    if(recognizer){ try{recognizer.abort()}catch{} }
    speechSynthesis?.cancel?.();
    const rec=new SR(); recognizer=rec;
    rec.lang="en-US"; rec.interimResults=false; rec.maxAlternatives=3;
    $("#transcript").textContent="Listening..."; $("#micBtn").textContent="🎙 聞き取り中…";
    rec.onresult=e=>{
      // 候補の中から一番近いものを採用
      let best="", score=0;
      for(const alt of e.results[0]){ const sc=matchScore(targetText, alt.transcript); if(sc>=score){score=sc; best=alt.transcript;} }
      $("#transcript").textContent=best;
      const ok=score>=60;
      $("#feedback").textContent= ok ? `Nice! ${score}% 伝わっているよ。` : `もう一回いってみよう。ゆっくりでOK (${score}%)`;
      if(!answered){ answered=true; record(item, ok); if(ok) sessionOk++; }
      $("#nextBtn").classList.remove("hidden");
    };
    rec.onerror=()=>{
      $("#transcript").textContent="音声認識が使えない時は、下のボタンで進めてOK。";
      $("#manualDoneBtn").classList.remove("hidden");
    };
    rec.onend=()=>{ $("#micBtn").textContent="🎙 もう一回話す"; };
    rec.start();
  };
  $("#manualDoneBtn").onclick=()=>{
    $("#feedback").textContent="Good! 声に出せたらOK。";
    if(!answered){ answered=true; record(item, true); sessionOk++; }
    $("#nextBtn").classList.remove("hidden");
  };
}

// ---------- 画面 ----------
function showView(id){
  $$(".view").forEach(v=>v.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top:0});
}

const PHASES = [
  {min:91, step:"STEP 1", title:"耳と口をならす", level:1, text:"毎日10分。LISTEN と SHADOWING で英語の音に慣れよう。自己紹介も作っておこう。", start:"shadow"},
  {min:46, step:"STEP 2", title:"短い文で話す", level:2, text:"Q&A で「聞かれて答える」練習。SPEAK で日本語→英語を口に出そう。", start:"qa"},
  {min:15, step:"STEP 3", title:"本番モード", level:3, text:"現地スピードに挑戦。苦手復習で弱点をつぶし、自己紹介は何も見ずに言えるように。", start:"review"},
  {min:1, step:"FINAL", title:"直前チェック", level:2, text:"空港と困った時のフレーズを総復習。言えれば大丈夫！", start:"final"},
  {min:-Infinity, step:"IN NY", title:"ニューヨークで実践中！", level:2, text:"困ったら Emergency。分からない時は “Could you say that again?” でOK。", start:"emergency"}
];
function currentPhase(){
  const d=daysLeft();
  return d===null ? null : PHASES.find(p=>d>=p.min);
}

function renderHome(){
  $("#levelBtn").textContent="Level "+state.level;
  $("#levelName").textContent=LEVELS[state.level].name;
  $("#streak").textContent=currentStreak();
  $("#doneCount").textContent=state.done;
  const all=[...ITEMS,...QA];
  const mastered=all.filter(x=>isMastered(x.id)).length;
  $("#masteredCount").textContent=mastered;
  $("#masteryBar").style.width=`${mastered/all.length*100}%`;
  $("#masteryText").textContent=`${mastered} / ${all.length} フレーズ マスター`;

  const d=daysLeft();
  if(d!==null){
    $("#daysLeft").textContent=Math.max(0,d);
    $("#departureText").textContent=state.departure.replaceAll("-","/")+" 出発";
    $("#departureInput").value=state.departure;
  } else {
    $("#daysLeft").textContent="--"; $("#departureText").textContent="出発日を設定してください";
  }

  const ph=currentPhase();
  if(ph){
    $("#planStep").textContent=ph.step;
    $("#planTitle").textContent=ph.title;
    $("#planText").textContent=ph.text;
    $("#planLevelBtn").classList.toggle("hidden", ph.level===state.level);
    $("#planLevelBtn").textContent=`おすすめ: Level ${ph.level}（${LEVELS[ph.level].name}）にする`;
    $("#planStartBtn").classList.remove("hidden");
  } else {
    $("#planStep").textContent="PLAN";
    $("#planTitle").textContent="出発日を設定しよう";
    $("#planText").textContent="出発日から逆算して、今やるべき練習を表示します。";
    $("#planLevelBtn").classList.add("hidden");
    $("#planStartBtn").classList.add("hidden");
  }

  const n=todayCount();
  $("#todayText").textContent = n>=DAILY_GOAL ? `今日の目標達成！（${n}回クリア）🎉` : `今日 ${n} / ${DAILY_GOAL} 回クリア`;
  $("#todayBar").style.width=`${Math.min(1,n/DAILY_GOAL)*100}%`;

  const weak=[...ITEMS,...QA].filter(x=>isWeak(x.id)).length;
  $("#reviewSub").textContent = weak ? `苦手 ${weak} 個を集中練習` : "間違えたフレーズがここにたまります";

  const p=state.profile;
  $("#introSub").textContent = p.name.trim() ? `“Hi, I'm ${p.name.trim()}.” から始まる6文` : "まず名前と好きなことを設定しよう";
}

function makeScenes(){
  const grid=$("#sceneGrid"); grid.innerHTML="";
  SCENES.forEach(s=>{
    const items=ITEMS.filter(x=>x.scene===s);
    const m=items.filter(x=>isMastered(x.id)).length;
    const b=document.createElement("button"); b.className="scene-btn card";
    b.innerHTML=`<i>${SCENE_INFO[s].icon}</i><b>${s}</b><span>${SCENE_INFO[s].ja}・${m}/${items.length}</span>`;
    b.onclick=()=>startPractice("scene",s);
    grid.appendChild(b);
  });
}

const MODE_TITLE = {listen:"Listening", shadow:"Shadowing", speak:"Speaking", qa:"Q&A 聞かれて答える", review:"苦手復習", intro:"自己紹介", final:"直前チェック", emergency:"困った時"};

function startPractice(m, scene=null){
  mode=m; currentScene=scene;
  if(m==="intro"){
    if(!state.profile.name.trim()){ openSettings(true); return; }
    queue=introItems();
  } else if(m==="qa"){
    queue=weightedPick(QA, QUESTIONS_PER_SESSION);
  } else if(m==="review"){
    const weak=[...ITEMS,...QA].filter(x=>isWeak(x.id)).sort((a,b)=>weight(b)-weight(a));
    if(!weak.length){ alert("苦手フレーズはまだありません。まずは他の練習をやってみよう！"); return; }
    queue=weak.slice(0,QUESTIONS_PER_SESSION);
  } else if(m==="final"){
    queue=weightedPick(ITEMS.filter(x=>x.scene==="Airport"||x.scene==="Emergency"), QUESTIONS_PER_SESSION);
  } else if(m==="emergency"){
    queue=weightedPick(ITEMS.filter(x=>x.scene==="Emergency"), QUESTIONS_PER_SESSION);
  } else if(m==="scene"){
    queue=weightedPick(ITEMS.filter(x=>x.scene===scene), QUESTIONS_PER_SESSION);
  } else {
    queue=weightedPick(ITEMS, QUESTIONS_PER_SESSION);
  }
  qi=0; sessionOk=0;
  $("#modeLabel").textContent=(scene||m).toUpperCase();
  $("#practiceTitle").textContent= scene ? `${SCENE_INFO[scene].icon} ${scene} 練習` : MODE_TITLE[m];
  $("#resultCard").classList.add("hidden");
  $("#practiceCard").classList.remove("hidden");
  showView("#practiceView"); renderQuestion();
}

// 1問ごとの練習タイプ
function kindOf(item){
  if(item.q) return "qa";
  if(mode==="intro") return "shadow";
  if(mode==="review") return "speak";
  if(mode==="scene"){ return ["listen","shadow","speak"][qi%3]; }
  if(mode==="final"||mode==="emergency") return qi%2 ? "speak" : "shadow";
  return mode;
}

function renderQuestion(){
  const item=queue[qi], kind=kindOf(item);
  answered=false;
  if(recognizer){ try{recognizer.abort()}catch{} recognizer=null; }
  $("#questionIndex").textContent=qi+1; $("#questionTotal").textContent=queue.length;
  $("#progressBar").style.width=`${(qi/queue.length)*100}%`;
  $("#sceneLabel").textContent=item.scene;
  $("#kindLabel").textContent={listen:"聞いて意味を選ぶ",shadow:"聞いてマネする",speak:"日本語→英語で言う",qa:"聞かれて答える"}[kind];
  $("#feedback").textContent="";
  $("#nextBtn").classList.add("hidden"); $("#revealBtn").classList.add("hidden");
  $("#choices").innerHTML=""; $("#choices").classList.add("hidden");
  $("#speakArea").classList.add("hidden");
  $("#englishText").classList.add("hidden"); $("#subText").classList.add("hidden");
  $("#hintBtn").classList.add("hidden");

  if(kind==="listen"){
    // 日本語を先に見せると答えが分かってしまうので、場面だけ見せる
    $("#promptJa").textContent=`${SCENE_INFO[item.scene].ja}の場面。英語を聞いて、意味を選ぼう`;
    $("#englishText").textContent=phrase(item);
    addChoices(item.choices.map(fill), item.correct, ok=>checkChoice(ok,item));
    $("#choices").classList.remove("hidden");
    $("#playBtn").textContent="▶ 英語を聞く";
    speakText(phrase(item));
  } else if(kind==="shadow"){
    $("#promptJa").textContent=fill(item.ja);
    $("#englishText").textContent=phrase(item); $("#englishText").classList.remove("hidden");
    $("#playBtn").textContent="▶ 英語を聞く";
    setupSpeech(item, phrase(item));
    speakText(phrase(item));
  } else if(kind==="speak"){
    $("#promptJa").textContent=`「${fill(item.ja)}」を英語で言ってみよう`;
    $("#englishText").textContent=phrase(item);
    $("#playBtn").textContent="▶ お手本を聞く";
    $("#revealBtn").classList.remove("hidden");
    setupSpeech(item, phrase(item));
  } else if(kind==="qa"){
    $("#promptJa").textContent="相手の質問を聞いて、正しい返事を選ぼう";
    $("#englishText").textContent=fill(item.q);
    $("#subText").textContent=item.qja;
    if(state.level<3) $("#hintBtn").classList.remove("hidden");
    addChoices(item.answers.map(fill), item.correct, ok=>checkQA(ok,item));
    $("#choices").classList.remove("hidden");
    $("#playBtn").textContent="▶ 質問を聞く";
    speakText(fill(item.q));
  }
}
// 選択肢は毎回シャッフル（正解の位置で当てられないように）
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function addChoices(texts, correct, onAnswer){
  shuffle(texts.map((t,i)=>({t,i}))).forEach(({t,i})=>{
    const b=document.createElement("button"); b.className="choice"; b.textContent=t;
    if(i===correct) b.dataset.correct="1";
    b.onclick=()=>{
      $$(".choice").forEach(x=>x.disabled=true);
      $("#choices [data-correct]").classList.add("correct");
      if(i!==correct) b.classList.add("wrong");
      onAnswer(i===correct);
    };
    $("#choices").appendChild(b);
  });
}
function checkChoice(ok,item){
  $("#feedback").textContent= ok ? "Good! 声に出してマネしてみよう。" : "大丈夫。もう一度聞いて、声に出してマネしよう。";
  $("#englishText").classList.remove("hidden");
  $("#subText").textContent=fill(item.ja); $("#subText").classList.remove("hidden");
  record(item, ok); if(ok) sessionOk++; answered=true;
  speakText(phrase(item));
  $("#nextBtn").classList.remove("hidden");
}
function checkQA(ok,item){
  const ans=fill(item.answers[item.correct]);
  $("#englishText").classList.remove("hidden");
  $("#subText").textContent=item.qja; $("#subText").classList.remove("hidden");
  $("#hintBtn").classList.add("hidden");
  $("#feedback").textContent= ok ? `Good! 返事を声に出してみよう：“${ans}”` : `正解は “${ans}”。声に出して言ってみよう。`;
  record(item, ok); if(ok) sessionOk++; answered=true;
  speakText(ans);
  setupSpeech(item, ans);
  $("#nextBtn").classList.remove("hidden");
}

function finishSession(){
  state.done++;
  state.today = {date:todayStr(), n:todayCount()+1};
  updateStreak(); save();
  $("#progressBar").style.width="100%";
  $("#practiceCard").classList.add("hidden");
  $("#resultCard").classList.remove("hidden");
  $("#resultScore").textContent=`${sessionOk} / ${queue.length}`;
  const r=sessionOk/queue.length;
  $("#resultMsg").textContent = r===1 ? "Perfect! 完ぺき！" : r>=0.6 ? "Great job! いい調子！" : "Nice try! 間違えたものは「苦手復習」に入ったよ。";
  $("#resultStreak").textContent=`🔥 ${currentStreak()}日連続 ・ 今日 ${todayCount()}回目`;
}

function goHome(){
  if(recognizer){ try{recognizer.abort()}catch{} }
  if("speechSynthesis" in window) speechSynthesis.cancel();
  renderHome(); makeScenes(); showView("#homeView");
}

// ---------- フレーズ帳 ----------
function renderBook(){
  const list=$("#bookList"); list.innerHTML="";
  const filter=$("#bookFilter").value;
  const groups = filter==="QA" ? [["Q&A（聞かれること）", QA]] :
    SCENES.filter(s=>filter==="all"||filter===s).map(s=>[`${SCENE_INFO[s].icon} ${s}・${SCENE_INFO[s].ja}`, ITEMS.filter(x=>x.scene===s)]);
  groups.forEach(([title, items])=>{
    const h=document.createElement("h3"); h.className="book-head"; h.textContent=title; list.appendChild(h);
    items.forEach(item=>{
      const row=document.createElement("div"); row.className="book-row card";
      const dot=document.createElement("span");
      dot.className="dot "+(isMastered(item.id)?"ok":isWeak(item.id)?"weak":state.stats[item.id]?"seen":"");
      const txt=document.createElement("div");
      const en=document.createElement("b"); en.textContent= item.q ? fill(item.q) : phrase(item);
      const ja=document.createElement("span");
      ja.textContent= item.q ? `${item.qja} → ${fill(item.answers[item.correct])}` : fill(item.ja);
      txt.append(en, ja);
      const play=document.createElement("button"); play.className="mini-play"; play.textContent="▶";
      play.onclick=()=>speakText(item.q ? `${fill(item.q)} ... ${fill(item.answers[item.correct])}` : phrase(item));
      row.append(dot, txt, play); list.appendChild(row);
    });
  });
}

// ---------- 設定 ----------
function renderLevels(){
  $("#levelCards").innerHTML="";
  Object.entries(LEVELS).forEach(([k,v])=>{
    const d=document.createElement("button"); d.className="level-card card"+(Number(k)===state.level?" selected":"");
    d.innerHTML=`<div class="eyebrow">LEVEL ${k}</div><h3>${v.name}</h3><p>${v.desc}</p><p>${v.hint}</p>`;
    d.onclick=()=>{state.level=Number(k);save();renderLevels();renderHome();};
    $("#levelCards").appendChild(d);
  });
}
function openSettings(focusProfile=false){
  renderLevels();
  $("#nameInput").value=state.profile.name;
  $("#ageInput").value=state.profile.age||"13";
  $("#hobbyInput").value=state.profile.hobby||"soccer";
  showView("#settingsView");
  if(focusProfile){ $("#profileCard").scrollIntoView({behavior:"smooth"}); $("#nameInput").focus(); $("#profileMsg").textContent="自己紹介を作るために、名前を英語（ローマ字）で入れてね。"; }
  else $("#profileMsg").textContent="";
}

// ---------- イベント ----------
$("#playBtn").onclick=()=>{
  const item=queue[qi]; if(!item) return;
  speakText(item.q && !answered ? fill(item.q) : phrase(item));
};
$("#hintBtn").onclick=()=>{ $("#subText").classList.remove("hidden"); $("#hintBtn").classList.add("hidden"); };
$$("[data-speed]").forEach(b=>b.onclick=()=>{
  state.speed=Number(b.dataset.speed);
  $$("[data-speed]").forEach(x=>x.classList.remove("active")); b.classList.add("active");
});
$("#nextBtn").onclick=()=>{ qi++; qi>=queue.length ? finishSession() : renderQuestion(); };
$("#revealBtn").onclick=()=>{ $("#englishText").classList.remove("hidden"); $("#revealBtn").classList.add("hidden"); speakText(phrase(queue[qi])); };
$("#againBtn").onclick=()=>startPractice(mode,currentScene);
$("#resultHomeBtn").onclick=goHome;
$$(".training").forEach(b=>b.onclick=()=>startPractice(b.dataset.mode));
$("#survivalBtn").onclick=()=>startPractice("emergency");
$("#backBtn").onclick=goHome;
$("#settingsBackBtn").onclick=goHome;
$("#bookBackBtn").onclick=goHome;
$("#levelBtn").onclick=()=>openSettings();
$("#bookBtn").onclick=()=>{ renderBook(); showView("#bookView"); };
$("#bookFilter").onchange=renderBook;
$("#planStartBtn").onclick=()=>{ const ph=currentPhase(); if(ph) startPractice(ph.start); };
$("#planLevelBtn").onclick=()=>{ const ph=currentPhase(); if(ph){ state.level=ph.level; save(); renderHome(); } };

$("#setDateBtn").onclick=()=>$("#dateDialog").showModal();
$("#saveDateBtn").onclick=()=>{ state.departure=$("#departureInput").value; save(); renderHome(); };

$("#saveProfileBtn").onclick=()=>{
  const name=$("#nameInput").value.replace(/[^A-Za-z\s'-]/g,"").trim();
  if($("#nameInput").value.trim() && !name){ $("#profileMsg").textContent="名前はアルファベット（例: Kenta）で入れてね。"; return; }
  state.profile={name, age:$("#ageInput").value, hobby:$("#hobbyInput").value};
  save(); $("#nameInput").value=name;
  $("#profileMsg").textContent="保存しました！ホームの「自己紹介」で練習できます。";
};
$("#resetBtn").onclick=()=>{
  if(!confirm("学習記録（連続日数・正解記録）をリセットしますか？\n出発日・プロフィールは残ります。")) return;
  Object.assign(state,{streak:0,done:0,learned:0,lastDate:"",stats:{},today:{date:"",n:0}});
  save(); goHome();
};

// 趣味の選択肢
HOBBIES.forEach(h=>{ const o=document.createElement("option"); o.value=h.en; o.textContent=`${h.ja}（${h.en}）`; $("#hobbyInput").appendChild(o); });
// フレーズ帳フィルター
[["all","すべての場面"],["QA","Q&A（聞かれること）"],...SCENES.map(s=>[s,`${SCENE_INFO[s].icon} ${s}`])].forEach(([v,t])=>{
  const o=document.createElement("option"); o.value=v; o.textContent=t; $("#bookFilter").appendChild(o);
});

if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
makeScenes(); renderHome();
