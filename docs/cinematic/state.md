# storytelling 実行状態 — 愚問（GUMON）シネマティック変換

<!-- このファイルが案件状態の唯一の正。停止する前に必ず更新する（runtime.md 3章） -->

## 案件

- 案件名: 愚問（GUMON）LP シネマティック・スクロールテリング変換（Bloom-L v1 検証案件 / Phase 6）
- 対象プロジェクトのパス: /Users/mizokamimirai/Desktop/mizogamitoshiki/gumon-hp
- 案件タイプ: 既存サイト変換
- 成果物の保存場所: docs/cinematic/
- 最終更新: 2026-07-10
- 案件ステータス: **Phase 17 合格・コミット済み**（/menu/dinner Editorial化=D2完了。Phase 18未着手。TOP: G3条件付き合格）

## 現在地

- 現在のStage: **Phase 17 完了（人間レビュー合格・コミット済み）**。Phase 18未着手
- 次のアクション（再開時に最初にやること）: ユーザー指示を待つ — 想定候補: ①editorial variantのlunch/course/drinkへの展開承認 ②/aboutのコピー重複整理案の提示 ③公開前Blocker素材の受領→差し替え。コピー変更2案は不承認のまま維持（勝手に再提案しない）
- 実装記録: dinner-implementation-plan.md 9章（変更5ファイル・非回帰=3ページbody DOM完全一致・pin-spacer 0・RM実切替可読・390px横スクロール0・CTA 53px）
- 進行中メモ: **Block A合格・コミット済み: `7b7a22e`**（Part1/Part2は同一領域重複のため理由記録の上1コミット統合）。Stage 12修正2件: ①noscriptフォールバック（QS20 Blocker解消） ②メディア装填遅延（LCP: 不可視film posterがLCP要素だった問題を解消 → devtoolsラボで **LCP 1.8s達成**・初期パス-1.4MB）。375px横スクロール0を実390ビューポートで実測確定（headless狭窓のズレはアーティファクトと切り分け）。reduced-motion実切替をheadless実施（分岐実行・動画非DLを実測）

## 実行範囲（履歴）

- 当初依頼はStage 0〜8のみ → 以降、各ゲート（G1/G2/Inc1/Inc2/棚卸し/Block A/Stage 12/Stage 13）ごとにユーザー指示で範囲を拡張し、**Stage 14まで完了**。全承認範囲はimplementation-plan 2章と本ファイルの承認記録・セッションログが正
- 不変の禁止事項: 依存追加・コンテンツ削除・参考サイト模倣・transform/opacity(/clip-path)以外のアニメーション・下層ページ実装（未指示）

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
| 11 Incremental Implementation | 完了 | Inc1合格(ead5d5f)・Inc2合格(402fd03)・**Block A合格(7b7a22e)** — S9完成(収束transform化・答えは、席で。)・削除テスト(グロー削除/ヘアライン残置)・Scene別ビルダー化 |
| 12 Technical QA | 完了（人間確認項目あり） | qa-report.md作成。修正2件(noscript/LCPメディア装填遅延)。LCP 1.8s(devtoolsラボ)達成。未検証=Safari/iOS実機・スクロール中CPU4x等はqa-report 3章へ |
| 13 Creative QA | 完了 | 人間確認「確認完了OK」受領（2026-07-10）。A〜C・総合=合格／D8実URL=未解決（客観事実）／E11第三者=未確認と記録（qa-report 5章） |
| 14 Completion Report | **完了（報告済み）** | **G3=合格（条件付き）**: 公開前必須=実URL差し替え・素材出所最終確認。qa-report.md 5章に記録 |

## 承認・レビュー記録（要約とポインタ）

- G1承認: **済**（2026-07-10 / 範囲: Concept・9 Scene・Hero案A・代表Scene=S4+S5・変更ファイル4+docs・依存追加なし・コンテンツ削除なし。A1〜A5承認、A3は映像実確認が条件。素材は利用前提で確認済み。全文: implementation-plan.md 2章）
- G2判定: **合格（2026-07-10・軽微修正後に合格）** — 承認内容: S4の映像と章句の表現／3章句（素材・火・時間）／S5の休符／S5コピー「答えは、まだ湯気の中に。」／S4→S5→S6の接続／375pxでの表現／現在の代表Scene方針。条件だった軽微修正（章句タイミングのT.film/T.rest相対化・implementation-planのtrailing whitespace除去・state.md表記修正・qa-baselineの成果物登録）は実施済み
- **Phase 17レビュー: 合格（2026-07-10）** — 承認: D2縦型Editorial／Plan B（麻婆1枚大判）／clip-reveal1回+fade-quiet強度／D3静かなReveal／dinner専用variant分離／他3ページ非影響。**コピー変更は不承認**・実価格/実URL/追加写真/素材出所は未確定のまま維持。コミットIDはセッションログ参照
- **G3判定: 合格 — 条件付き（2026-07-10）**。ユーザー「確認完了OK」（チェックリスト一括回答）。公開前必須条件: ①ホットペッパー/Instagram実URLの差し替え（site.ts現状はトップページTODO＝公開不可） ②素材一次出所の最終確認。第三者評価(E11)は実施報告なしのため未確認と記録。全文: qa-report.md 5章

## 保留中の質問・承認依頼

<!-- 再開時はこれをそのまま再提示する -->

（なし — Phase 17合格・コミット済み。次はPhase 18等の指示待ち）

## 成果物ポインタ

| 成果物 | 状態 | パス |
| --- | --- | --- |
| project-analysis.md | 完了 | docs/cinematic/project-analysis.md |
| creative-brief.md | 完了 | docs/cinematic/creative-brief.md |
| experience-plan.md | 完了（1〜9章） | docs/cinematic/experience-plan.md |
| implementation-plan.md | 完了（1〜5章: 計画・承認記録・実装記録・棚卸し） | docs/cinematic/implementation-plan.md |
| qa-report.md | 完了（1〜5章: Technical/Creative/人間確認/サマリー/G3記録） | docs/cinematic/qa-report.md |
| qa-baseline.md（Stage 10 正式成果物: 実測ベースライン・実装後比較・A3映像確認記録） | 完了 | docs/cinematic/qa-baseline.md |
| sitewide-rollout-plan.md（Phase 15: 全ページ棚卸し・演出密度・再利用分類・ロードマップ） | 承認済み（実装順序確定） | docs/cinematic/sitewide-rollout-plan.md |
| dinner-creative-brief.md（Phase 16: ページ固有override） | 承認待ち | docs/cinematic/dinner-creative-brief.md |
| dinner-experience-plan.md（Phase 16: 感情・Story・4 Scene・Motion） | 承認待ち | docs/cinematic/dinner-experience-plan.md |
| dinner-implementation-plan.md（Phase 16計画+Phase 17実装記録9章） | 実装済み・レビュー待ち | docs/cinematic/dinner-implementation-plan.md |

## セッションログ

- 2026-07-10 / Stage 0 / 新規開始。上位文書読了・Git clean確認・実行範囲をStage 0〜8に限定（ユーザー指示）。既存ブランド資産（project/artifacts/*.json・design-system/gumon/MASTER.md・wdos-diagnosisレポート）の存在を確認 — Stage 1で活用する
- 2026-07-10 / Stage 1〜8 / 全設計成果物を作成。主な判断: ①Interview質問ゼロ（G1格のトーンはクライアント確定コピーで[推定]解決） ②既存6ビート全継承＋新設2 Scene（問いの帳・受け止めの半拍）のみ ③依存追加ゼロ・コンテンツ削除ゼロ ④Hero推奨=案A ⑤代表Scene=S4+S5 ⑥最大リスク=タイムライン時間再配分。G1承認依頼を提示し承認待ちで停止（Stage 9以降・コード変更は未実施）
- 2026-07-10 / Stage 9 / G1承認受領・記録（全5項目承認・A1〜A5承認・素材利用確認）。設計成果物をコミットし、Stage 10（S4+S5実装）へ。実測ベースライン→実装→検証→G2レビュー待ち停止の手順で進行
- 2026-07-10 / Stage 10 / ベースライン実測（build/lint/実ブラウザ通し/動画内容確認/Lighthouse: qa-baseline.md）。A3条件履行: 動画は「完成皿の連なり」で調理カットなし→章句を「問い×答えの映像」構造に調整、「火に問う」を麻婆豆腐に配時。S4+S5実装（T定数化・章句・休符・スクリム・1210/920vh）。スコープ自制2件（drink弱化と壁受け渡し前倒しを差し戻し）。検証済み・性能悪化なし。黒画面現象は旧ビルドでも再現=非回帰と切り分け。コード未コミットのままG2レビュー待ちで停止
- 2026-07-10 / Stage 10 G2 / **G2合格（軽微修正後に合格）**を受領・記録。軽微修正を実施: ①章句タイミングをT.film/T.rest相対値へ統一（wordIn=[T.film+0.35, +1.05, +1.75]・退場=T.rest-0.4・スクリム点灯=T.film+0.2。見た目の値は不変） ②implementation-planのtrailing whitespace除去 ③state.md表記修正 ④qa-baseline.mdを成果物ポインタへ登録。再検証（build/lint/diff --check）後、コード＋文書を1コミットに統合（feat: implement cinematic fire response scene）。Stage 11へは進んでいない
- 2026-07-10 / Stage 11 Increment 1 / S2「問いの帳」実装（question/questionGhostのT追加・about以降+1.5・アンビエントS2まで残留・scroll-root 1330/1010vh・reduced-motion 56vh静的）。S1→S2→S3接続とS4/S5回帰なしを実画面確認。build/lint/diff--check合格・First Load JS不変。検証中の黒画面・scrollTo不発の真因を「タブ非表示によるrAF停止（テスト作為）」と確定し、qa-baselineの旧切り分け（既存問題扱い）を訂正。未コミットのまま人間レビュー待ちで停止
- 2026-07-10 / Stage 11 Increment 1 レビュー / **合格（軽微修正後に合格）**。軽微修正3点を実施: ①S2残像 autoAlpha 0.18→0.09（タイミング・位置不変） ②アンビエントpause判定を固定スクロール距離(vh*2.4)→タイムライン基準（`tl.time() > T.ambientOut`、T.ambientOut=3.1=退場tween完了点をnamed offset追加。リスナー追加なし） ③T直前コメントを現在値（PC≈78.8/モバイル≈59.8vh/unit）へ修正。build/lint/diff--check合格。コード＋文書をコミット: **`ead5d5f`** feat: add cinematic question scene
- 2026-07-10 / Stage 11 Increment 2 / S6→S7のhold-quiet（menuRest=12.0→drink=12.9の0.9unit。間の内容=バー開放＋フィルム→壁の受け渡し=B6実装）＋S7弱化（初期y8px・blurなし・fade-quiet 0.8/power1.out・stagger0.12・読了後保持0.5unit）＋S8/S9一律+1.4＋scroll-root 1440/1095vh（78.8/59.9vh/unit維持）。DOM・リスナー・依存追加ゼロ。build/lint/diff--check/コンソール0/158KB不変。ウィンドウ不可視（rAF停止）のため通し目視は未=レビュー依頼に記載。未コミットのまま人間レビュー待ちで停止
- 2026-07-10 / Stage 11 Increment 2 レビュー / **合格**（PC/375px実画面確認。間0.9unit・壁への受け渡し・S7弱化・保持0.5unit・再配分・モバイル表現を承認。受け渡しの「溶けるTransition」は休符として成立のため変更不要と判定）。表現の追加変更なしでコード＋文書をコミット: **`402fd03`** feat: add quiet rest between menu and drink scenes
- 2026-07-10 / Stage 11 棚卸し / TOP完成までの残作業をBlock A（最終実装1回: S9置換・S9結末一行・削除テスト・純リファクタ）とBlock B（Stage 12包括QA: QS22最低セット・LCP改善・実機/Safari・Creative QA）へ集約（implementation-plan.md 5章）。Blocker5・Required6・Optional5・Reject6を分類。コード変更なし・コミットなし・Increment 3/Stage 12未着手。Block A着手指示待ちで停止
- 2026-07-10 / Stage 11 Block A / Part 1: S9 letterSpacing tween廃止→2文字translateX ±0.16em置換（静的字間・role=img/aria-label・CLSゼロ）＋結末一行「答えは、席で。」追加＋削除テスト（視差グロー削除=壁に常時遮蔽で視覚出力ゼロをA/B+z-order解析で確認／進捗ヘアライン残置=モバイル現在地QS13）。Part 2: タイムラインをScene別ビルダー11関数へ純リファクタ（挿入順・演出値完全維持）。build/lint/diff-check/コンソール0/158KB不変/DOM実測OK。ウィンドウ不可視のため通し目視は未。未コミットのまま人間レビュー待ちで停止
- 2026-07-10 / Stage 11 Block A合格 → Stage 12 / Block Aを`7b7a22e`でコミット（Part分離は同一領域重複のため理由記録の上統合）。Stage 12実施: JS無効時の情報到達（SSR全文確認+noscriptフォールバック新設=QS20解消）／reduced-motion実切替（headless --force-prefers-reduced-motion で分岐実行・動画非DL実測）／LCP原因特定（不可視film posterがLCP要素）→メディア装填を最初のユーザー操作へ遅延 → **devtoolsラボ perf0.93・LCP1.8s・CLS0（目標達成。simulate法は4.1〜6.7sの振れ=モデリング起因と記録）**／実390ビューポートで横スクロール0・hero中央・CTA折返しを実測（headless狭窓のズレはアーティファクト）／タップ領域47px実測／qa-report.md作成。未検証（Safari/iOS実機・スクロール中CPU4x・疲労/第三者）は3章の人間確認項目へ。Stage 13以降・下層ページ未着手
- 2026-07-10 / Stage 13 / 最終確認チェックリスト（12項目・5〜10分・合格/修正希望/未確認形式）を作成し提示。コード・CSS・依存・コンテンツの変更なし。人間確認待ちで停止
- 2026-07-10 / Stage 13→14 / ユーザー「確認完了OK」受領。A〜C・総合=合格、D8実URL=未解決（site.tsのTODOを再確認=客観事実）、D9価格6箇所未確定、E11第三者=未確認と正直に記録（qa-report 5章）。**G3=合格（条件付き: 公開前に実URL差し替え+素材出所確認）**。Stage 14完了報告を提示し、案件ステータスを報告済みへ。下層ページは未着手（新規指示待ち）
- 2026-07-10 / Phase 15 / 全9ルートを棚卸しし sitewide-rollout-plan.md を作成（演出密度3段階の割当・全体情報設計・再利用3分類＋不足候補・ロードマップ・最初の1ページ比較→推奨 /menu/dinner・公開前Blocker 5件）。発見: TOPがS2で「おいしいとは、なにか。」を先取りしたため /about 冒頭に重複感が新規発生（実装3番目でコピー整理案を提示予定）。コード・CSS・コンテンツ変更なし。実装順序の承認待ちで停止。下層実装・Stage 16未着手
- 2026-07-10 / Phase 16 / 実装順序を確定（dinner→lunch→course→drink→about→access・contact→recruit）。/menu/dinner の現行分析（強み=ボード/実価格/分岐完備・課題=PC pin横流しがPhase16基準と衝突・実写1枚・トークン不統一・リードがTOP章句と語彙近接）→ ページ固有Brief・Experience Plan・Implementation Plan を作成。Concept=「今夜の一皿を、選びはじめる。」／4 Scene（夜の帳・看板との対面・お品書き・席を押さえる）／Hero 2案比較→案A推奨／代表Scene=D2。コード・CSS・コピー・依存・TOP変更なし。**承認待ちで停止。実装・Phase 17未着手
- 2026-07-10 / Phase 17 / Plan条件付き承認を受け D2実装。方式=別コンポーネントDishShowcase＋gm-shot新名前空間＋editorialオプトインprop（DishGallery/.gm-galは無変更=非回帰を構造保証）。Plan B実装（実写のみ・ゼロならセクション非表示）。MenuBoardにquiet prop（既定パスは従来リテラル）。検証: build/lint/diff-check/コンソール0/pin-spacer0/390px横スクロール0/CTA53px/RM実切替で全文・CTA可読/lunch・course・drinkのbody DOM完全一致。**未コミットのまま人間レビュー待ちで停止。Phase 18未着手****
