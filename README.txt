NY English Sprint - iPhone PWA版
中学生のニューヨーク短期留学に向けた英語練習アプリ

【できること】
- 出発日までのカウントダウン ＋ 残り日数に合わせた「今やるべき練習」プラン
    STEP1（91日以上前）耳と口をならす → STEP2（46日以上前）短い文で話す
    → STEP3（15日以上前）本番モード → FINAL（直前）空港・困った時の総復習
- レベル：Level 1 超初級 / Level 2 初級 / Level 3 留学実践
- 練習モード
    01 LISTEN     英語を聞いて意味を選ぶ
    02 SHADOWING  聞いてすぐマネする（音声認識で判定）
    03 SPEAK      日本語を見て英語で言う
    04 Q&A        ホストや友達・入国審査官に「聞かれて」正しく答える
    05 苦手復習    間違えたフレーズだけを集中練習
    ★ 自己紹介    名前・年齢・好きなことから自分だけの自己紹介を作って練習
- 9つの場面：Airport / Homestay / School / Small Talk / Subway / Sightseeing / Shopping / Restaurant / Emergency
- フレーズ61個 ＋ Q&A 23問（フレーズごとに3レベル分の英文）
- 間違えたフレーズほど多く出題（簡易な間隔反復）
- マスター数・連続日数・今日の目標（1日2回）を表示
- フレーズ帳：全フレーズを一覧で聞ける（現地でのカンペにも）
- 学習記録は端末内（localStorage）に保存。オフラインでも動作

【フレーズを追加するには】
data.js の RAW_ITEMS（フレーズ）や QA（質問と返事）に追記してください。
既存の学習記録がずれないよう、各シーンの「末尾」に足してください。

【iPhoneで使うには】
このPWAはHTTPSで公開する必要があります。
無料なら GitHub Pages / Cloudflare Pages / Netlify などに、このフォルダ一式をアップロードしてください。
（GitHub Pages：リポジトリの Settings → Pages → ブランチを選んで Save）

公開URLをSafariで開く
→ 共有ボタン
→「ホーム画面に追加」
→ NY English Sprint のアイコンから起動

※ 音声認識はiOS/Safariのバージョンや権限設定により利用可否が変わるため、
使えない場合でもShadowing/Speakingは「声に出して言えた」ボタンで進められます。
