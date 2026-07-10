# storytelling 実行状態 — 愚問（GUMON）シネマティック変換

<!-- このファイルが案件状態の唯一の正。停止する前に必ず更新する（runtime.md 3章） -->

## 案件

- 案件名: 愚問（GUMON）LP シネマティック・スクロールテリング変換（Bloom-L v1 検証案件 / Phase 6）
- 対象プロジェクトのパス: /Users/mizokamimirai/Desktop/mizogamitoshiki/gumon-hp
- 案件タイプ: 既存サイト変換
- 成果物の保存場所: docs/cinematic/
- 最終更新: 2026-07-10
- 案件ステータス: 進行中（Stage 11 — Increment 1 合格・コミット済み。Increment 2 未着手）

## 現在地

- 現在のStage: **11 Incremental Implementation（進行中）** — Increment 1「S2 問いの帳」**合格（2026-07-10・軽微修正後に合格）・コミット済み**。次のIncrement（実装順序3: S6→S7の間の整備 等）へは未着手 — ユーザーの指示待ち
- 次のアクション（再開時に最初にやること）: ユーザーから次Increment着手の指示を受けたら、implementation-plan 1.9 実装順序の次項目を1Sceneずつ実施
- 進行中メモ: Increment 1レビューの軽微修正3点（残像0.18→0.09／アンビエントpauseをtl.time()>T.ambientOut基準へ／vh-unitコメント現在値化）を実施しコミット。修正後の視覚再確認は検証ウィンドウのオクルージョン（rAF停止）により初期描画のみ — 次回レビュー時に残像0.09とアンビエント再開の目視をお願いする

## 実行範囲（今回の依頼で確定）

- **実行するStage: 0〜8のみ。** Stage 8完了後に state.md を「承認待ち」へ更新して停止する。Stage 9以降へ進まない
- 変更してよいファイル: docs/cinematic/ 配下の設計成果物のみ（state.md / project-analysis.md / creative-brief.md / experience-plan.md / implementation-plan.md）
- 禁止: src/ 以下・CSS・コンテンツ・画像動画・package.json・依存・GSAP/ScrollTrigger/Lenis設定・ビルド設定への一切の変更。参考サイトの模倣
- 既存資産（GSAP / ScrollTrigger / Lenis / pin stage / 6ビート構成）は「残す / 変更する / 追加する / 削除候補」に分類し、理由を示す

## Stage状況

<!-- 値: 未着手 / 進行中 / 完了 / スキップ（理由） / 差し戻し（戻り先） / 承認待ち / レビュー待ち -->

| Stage | 状態 | 備考 |
| --- | --- | --- |
| 0 Preflight | 完了 | 上位3文書読了。CLAUDE.mdスクロール演出ルールとBloom-L原則に停止級の矛盾なし。Git clean（feature/bloom-cinematic-storytelling）。Engine/Skill v1.0.0。ビルド: npm run dev/build/lint |
| 1 Project Analysis | 完了 | project-analysis.md 全章記入済み |
| 2 Gap Analysis | 完了 | ギャップ7件を仕分け（analysis 8章） |
| 3 Creative Interview | スキップ（理由: Interview候補G1/G2/G7はいずれも確からしさの高い側で[推定]進行可能。G1はクライアント確定コピーで解決、G2は計画側で吸収、G7は依頼文で代替。Stage 8停止時にまとめて確認） | |
| 4 Creative Brief | 完了 | creative-brief.md（検査記録4項目済み） |
| 5 Emotion・Story・Scene | 完了 | experience-plan.md 1〜4章（チェック項目全て充足） |
| 6 Transition・Rhythm | 完了 | experience-plan.md 5〜7章（チェック項目全て充足） |
| 7 Motion Direction | 完了 | experience-plan.md 8〜9章（理由記録率100%・トークン定義済み） |
| 8 Transformation Plan | 完了 | implementation-plan.md 1章（Hero 3案・代表Scene=S4+S5・23項目網羅） |
| 9 Approval Gate (G1) | 完了 | 2026-07-10 全5項目承認（A1〜A5承認・素材利用確認済み。範囲: implementation-plan.md 2章） |
| 10 Representative Scene (G2) | 完了 | **G2合格（2026-07-10・軽微修正後に合格）**。軽微修正=章句タイミングのT基準化・文書修正。実装記録: implementation-plan 3章 |
| 11 Incremental Implementation | 進行中 | **Increment 1「S2問いの帳」合格（軽微修正後）・コミット済み**。Increment 2以降は未着手 |
| 12 Technical QA | 未着手 | |
| 13 Creative QA | 未着手 | |
| 14 Completion Report | 未着手 | |

## 承認・レビュー記録（要約とポインタ）

- G1承認: **済**（2026-07-10 / 範囲: Concept・9 Scene・Hero案A・代表Scene=S4+S5・変更ファイル4+docs・依存追加なし・コンテンツ削除なし。A1〜A5承認、A3は映像実確認が条件。素材は利用前提で確認済み。全文: implementation-plan.md 2章）
- G2判定: **合格（2026-07-10・軽微修正後に合格）** — 承認内容: S4の映像と章句の表現／3章句（素材・火・時間）／S5の休符／S5コピー「答えは、まだ湯気の中に。」／S4→S5→S6の接続／375pxでの表現／現在の代表Scene方針。条件だった軽微修正（章句タイミングのT.film/T.rest相対化・implementation-planのtrailing whitespace除去・state.md表記修正・qa-baselineの成果物登録）は実施済み

## 保留中の質問・承認依頼

（なし — Increment 1合格・コミット済み。次の停止はIncrement 2着手指示待ち。次回レビュー時のお願い: 残像0.09の濃度とアンビエント再開の目視確認）

## 成果物ポインタ

| 成果物 | 状態 | パス |
| --- | --- | --- |
| project-analysis.md | 完了 | docs/cinematic/project-analysis.md |
| creative-brief.md | 完了 | docs/cinematic/creative-brief.md |
| experience-plan.md | 完了（1〜9章） | docs/cinematic/experience-plan.md |
| implementation-plan.md | 1章 完了（2章以降はG1後） | docs/cinematic/implementation-plan.md |
| qa-report.md | 未作成 | docs/cinematic/qa-report.md |
| qa-baseline.md（Stage 10 正式成果物: 実測ベースライン・実装後比較・A3映像確認記録） | 完了 | docs/cinematic/qa-baseline.md |

## セッションログ

- 2026-07-10 / Stage 0 / 新規開始。上位文書読了・Git clean確認・実行範囲をStage 0〜8に限定（ユーザー指示）。既存ブランド資産（project/artifacts/*.json・design-system/gumon/MASTER.md・wdos-diagnosisレポート）の存在を確認 — Stage 1で活用する
- 2026-07-10 / Stage 1〜8 / 全設計成果物を作成。主な判断: ①Interview質問ゼロ（G1格のトーンはクライアント確定コピーで[推定]解決） ②既存6ビート全継承＋新設2 Scene（問いの帳・受け止めの半拍）のみ ③依存追加ゼロ・コンテンツ削除ゼロ ④Hero推奨=案A ⑤代表Scene=S4+S5 ⑥最大リスク=タイムライン時間再配分。G1承認依頼を提示し承認待ちで停止（Stage 9以降・コード変更は未実施）
- 2026-07-10 / Stage 9 / G1承認受領・記録（全5項目承認・A1〜A5承認・素材利用確認）。設計成果物をコミットし、Stage 10（S4+S5実装）へ。実測ベースライン→実装→検証→G2レビュー待ち停止の手順で進行
- 2026-07-10 / Stage 10 / ベースライン実測（build/lint/実ブラウザ通し/動画内容確認/Lighthouse: qa-baseline.md）。A3条件履行: 動画は「完成皿の連なり」で調理カットなし→章句を「問い×答えの映像」構造に調整、「火に問う」を麻婆豆腐に配時。S4+S5実装（T定数化・章句・休符・スクリム・1210/920vh）。スコープ自制2件（drink弱化と壁受け渡し前倒しを差し戻し）。検証済み・性能悪化なし。黒画面現象は旧ビルドでも再現=非回帰と切り分け。コード未コミットのままG2レビュー待ちで停止
- 2026-07-10 / Stage 10 G2 / **G2合格（軽微修正後に合格）**を受領・記録。軽微修正を実施: ①章句タイミングをT.film/T.rest相対値へ統一（wordIn=[T.film+0.35, +1.05, +1.75]・退場=T.rest-0.4・スクリム点灯=T.film+0.2。見た目の値は不変） ②implementation-planのtrailing whitespace除去 ③state.md表記修正 ④qa-baseline.mdを成果物ポインタへ登録。再検証（build/lint/diff --check）後、コード＋文書を1コミットに統合（feat: implement cinematic fire response scene）。Stage 11へは進んでいない
- 2026-07-10 / Stage 11 Increment 1 / S2「問いの帳」実装（question/questionGhostのT追加・about以降+1.5・アンビエントS2まで残留・scroll-root 1330/1010vh・reduced-motion 56vh静的）。S1→S2→S3接続とS4/S5回帰なしを実画面確認。build/lint/diff--check合格・First Load JS不変。検証中の黒画面・scrollTo不発の真因を「タブ非表示によるrAF停止（テスト作為）」と確定し、qa-baselineの旧切り分け（既存問題扱い）を訂正。未コミットのまま人間レビュー待ちで停止
- 2026-07-10 / Stage 11 Increment 1 レビュー / **合格（軽微修正後に合格）**。軽微修正3点を実施: ①S2残像 autoAlpha 0.18→0.09（タイミング・位置不変） ②アンビエントpause判定を固定スクロール距離(vh*2.4)→タイムライン基準（`tl.time() > T.ambientOut`、T.ambientOut=3.1=退場tween完了点をnamed offset追加。リスナー追加なし） ③T直前コメントを現在値（PC≈78.8/モバイル≈59.8vh/unit）へ修正。build/lint/diff--check合格。コード＋文書をコミット（feat: add cinematic question scene — IDは下行）。**Increment 2へは未着手**
