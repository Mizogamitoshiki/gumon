# storytelling 実行状態 — 愚問（GUMON）シネマティック変換

<!-- このファイルが案件状態の唯一の正。停止する前に必ず更新する（runtime.md 3章） -->

## 案件

- 案件名: 愚問（GUMON）LP シネマティック・スクロールテリング変換（Bloom-L v1 検証案件 / Phase 6）
- 対象プロジェクトのパス: /Users/mizokamimirai/Desktop/mizogamitoshiki/gumon-hp
- 案件タイプ: 既存サイト変換
- 成果物の保存場所: docs/cinematic/
- 最終更新: 2026-07-11
- 案件ステータス: **Gumon Site v1：実装完了・公開前Blocker確認待ち**

## 現在地

- 現在のStage: **Finalization Sprint（Stage A〜H）完了**。Course・Drink・About・Access/Contact・Recruitの実装/QAが全てコミット済み。全9ルート横断QA・公開前Blocker集約・Final Handoff・Pattern Catalogを作成し停止
- 次のアクション（再開時に最初にやること）: 人間によるCreative Review（各ページ実画面確認）→ 承認後、gumon-publication-blockers.mdの1〜13（実URL・実価格・素材出所・運用情報）をオーナー確認のうえ解消 → 公開判断
- 確定済み: TOP=G3合格（条件付き）／Dinner=Phase18ロック（64586ab）／Lunch=Phase19Cロック（91d77da）／Course=本Sprint完成（c2d0ba7）／Drink=本Sprint完成（2f026f9）／About=本Sprint完成（b8ed072）／Access・Contact=本SprintでUtility QA完了（a8b07ce）／Recruit=本SprintでQA完了・コード変更なし（1d9cab0）
- 参照文書: `GUMON_FINAL_HANDOFF.md`（全体像・公開手順・ロールバック手順）・`gumon-final-qa-report.md`（QUALITY_STANDARD準拠の最終QA）・`gumon-pattern-catalog.md`（Engine還元Pattern7種）・`gumon-publication-blockers.md`（公開前Blocker19項目）

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

**Gumon Site v1 Final Creative Review依頼**（人間確認待ち）:
1. Course/Drink/About/Access/Contact/Recruitの実画面通し確認（各ページの役割どおりの体験になっているか）
2. About: PullQuote再配置（「店名について」直後）がTOP重複の解消として機能しているか
3. About-copy-review.mdのB1〜B3（コピー変更候補）の承認可否
4. Course-transformation-plan.mdのA4（Contact導線文言）は既に承認・実装済みだが、実画面での見え方の最終確認
5. gumon-publication-blockers.mdの1〜13（実URL・実価格・素材出所・運用情報）の解消スケジュール
6. 第三者テスト・実機確認（Safari/iOS）の実施可否・時期

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
| dinner-implementation-plan.md（Phase 16計画+Phase 17〜18実装記録） | 完了（Phase 18ロック 64586ab） | docs/cinematic/dinner-implementation-plan.md |
| lunch-transformation-plan.md（Phase 19A計画+19B実装記録） | 完了（Phase 19Cロック 91d77da） | docs/cinematic/lunch-transformation-plan.md |
| lunch-implementation-report.md（Phase 19A〜19C レポート） | 完了 | docs/cinematic/lunch-implementation-report.md |
| course-project-analysis.md（Phase 20A 現状分析） | 承認済み | docs/cinematic/course-project-analysis.md |
| course-transformation-plan.md（Phase 20A 変換計画） | 承認済み（2026-07-11 A1〜A5） | docs/cinematic/course-transformation-plan.md |
| course-implementation-report.md（Phase 20B 実装記録） | 完了（本Sprintでコミット確定 c2d0ba7） | docs/cinematic/course-implementation-report.md |
| drink-transformation-plan.md（Finalization Sprint Stage B） | 完了（2f026f9） | docs/cinematic/drink-transformation-plan.md |
| about-copy-review.md（Stage C: TOP重複分析） | 完了（承認待ち候補あり） | docs/cinematic/about-copy-review.md |
| about-implementation-report.md（Stage C 実装記録） | 完了（b8ed072） | docs/cinematic/about-implementation-report.md |
| access-contact-qa-report.md（Stage D） | 完了（a8b07ce） | docs/cinematic/access-contact-qa-report.md |
| recruit-qa-report.md（Stage E・コード変更なし） | 完了（1d9cab0） | docs/cinematic/recruit-qa-report.md |
| crossroute-qa-report.md（Stage F 全9ルート横断QA） | 完了（4d28aa7） | docs/cinematic/crossroute-qa-report.md |
| gumon-publication-blockers.md（Stage G 公開前Blocker19項目） | 完了（076ffb9） | docs/cinematic/gumon-publication-blockers.md |
| GUMON_FINAL_HANDOFF.md（Stage G 最終引き継ぎ） | 完了（076ffb9） | docs/cinematic/GUMON_FINAL_HANDOFF.md |
| gumon-final-qa-report.md（Stage G QUALITY_STANDARD準拠サマリー） | 完了（076ffb9） | docs/cinematic/gumon-final-qa-report.md |
| gumon-pattern-catalog.md（Stage H Engine還元Pattern7種） | 完了 | docs/cinematic/gumon-pattern-catalog.md |

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
- 2026-07-10 / Phase 17 / Plan条件付き承認を受け D2実装。方式=別コンポーネントDishShowcase＋gm-shot新名前空間＋editorialオプトインprop（DishGallery/.gm-galは無変更=非回帰を構造保証）。Plan B実装（実写のみ・ゼロならセクション非表示）。MenuBoardにquiet prop（既定パスは従来リテラル）。検証: build/lint/diff-check/コンソール0/pin-spacer0/390px横スクロール0/CTA53px/RM実切替で全文・CTA可読/lunch・course・drinkのbody DOM完全一致。**未コミットのまま人間レビュー待ちで停止。Phase 18未着手**
- 2026-07-10 / Phase 17 レビュー / **合格**（D2構成・Plan B・強度・D3弱化・variant分離・非回帰を承認。コピー変更は不承認、実価格/実URL/追加写真/素材出所は未確定のまま維持）。最終確認（diff範囲・build/lint/diff-check再実行）後、1コミットで確定: **`1ff940e`** feat: transform dinner page to editorial showcase。Phase 18未着手
- 2026-07-10 / Dinner Storytelling Pass / D1〜D4を場面として接続: 入口余白拡張・D2写真のみ縦パララックス（±5%計10%・scrub0.6・PC限定・のりしろ縦±6%）・D2→D3余白・D3→D4余白＋CTA単独の静かな着地（quiet枝のみ変更・既定枝は従来リテラル復元）。gm-editorialスコープCSSで他ページ非波及。検証: build/lint/diff-check/コンソール0/非回帰3ページbody DOM一致/390横スクロール0/RM可読。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-10 / Dinner Scene-Turn / D1退場の振付（dinner限定・heroInner/cueのopacityをscrub退場・MenuHero無変更）＋D2の順序化（写真→見出しdelay0.25→キャプションdelay0.35）＋D3リボン→行を半拍拡大＋**モバイルを完全静的化**（DishShowcase全演出とMenuBoard quiet演出を861px+へスコープ。他ページ不変）。検証: build/lint/diff-check/コンソール0/非回帰3ページDOM一致/390で演出インライン0=静的実証/RM可読。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-10 / Dinner 紙芝居型 / ユーザー指示「画面固定でめくれる紙芝居型にしたい」を受け、Pin禁止をD2限定解除。DishShowcaseをpinステージ化（題字の幕→窓が開いて全画面対面→キャプション→保持→解放。+170%・scrub0.6）。ステージCSSは861px+かつmotion可のみ（RM/モバイルは静的維持）。題字左寄り不具合をmax-width:noneで修正。実スクロールで全場面を目視確認。build/lint/diff-check/RM可読。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-11 / Dinner 全ページ紙芝居化 / D1を固定開幕ページ（+70% pin・読む保持→めくり）、D4を全画面結末ページ（88svh中央・pinなし）へ拡張。D3は読む頁として流し読み維持（可読性原則）。ページ内pin=2（D1/D2）。実スクロール目視・build/lint/diff-check/コンソール0。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-11 / Dinner 境界レス化 / D1 pin撤回（スクロール同期退場へ）・D2幕間の黒排除（題字退場と窓開きを重畳）・行程+150%短縮・余白圧縮（D2→D3/D3→D4とも48〜96px）。品書き到達≈3.5画面・pin=D2の1箇所のみ。実スクロール目視/build/lint/コンソール0。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-11 / Dinner Story Transition Refinement / ①熾火: 題字の背後に皿を0.35で常灯（黒い独立Scene解消）②受け渡し: p0.82〜皿が一歩引き(0.965/0.55)＋quiet額縁をtop 94%で前倒し（同一画面で重なる）③結末: CTAを子要素逐次reveal(stagger 0.16)へ。実装 §15。build/lint/実スクロール/コンソール0。他ページ・モバイル/RM不変。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-11 / Dinner scrTelling機構移植 / kurukuru-web を実地調査（jQuery自前実装: 超長尺+sticky・進捗%線形補間・サブシーン重畳・拡大fade-out）し機構を GSAP pin+scrub で完全移植。Hero+Showcase を gm-stage 単一ステージ(+320%)に層で内包し、冒頭〜対面の境界ゼロ化。ビジュアル・コピーは愚問のまま（表現の模倣なし）。実装 §16。build/lint/非回帰/実スクロール/コンソール0。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-11 / Dinner お品書き活気登場 / quiet分岐のみ: 章句→額縁躍り上がり(y40/scale0.975/1.0s)→頭書き→見出しマスク→道具の波状TL、リボン左差し込み(x-24)、行はscale0.985+y24のriseLine連鎖(stagger0.055)。他ページ非quiet分岐は従来値で明示分離・不変。実装 §17。build/lint/実スクロール/コンソール0。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-11 / Phase 18 Dinner Lock & Quality Gate / 新規演出なし。QA12項目: 合格10・環境制約による未計測2（JS無効の視覚レンダ・60fps定量）。実再現バグ0・修正0。蓄積差分（§8〜17）を一括コミットして固定。コミットID: 64586ab（feat: unify dinner page into seamless cinematic scroll stage）
- 2026-07-11 / Phase 19A Lunch 現状分析+Transformation Plan / lunch-transformation-plan.md 作成。要点: 実写0・価格4品とも原本未照合[未確認]、DishGallery(プレースホルダ4枠pin)の削除テスト→外す提案、brisk分岐(軽快Editorial・pinなし・3 Scene)。承認事項 A1〜A4。**実装せず承認待ちで停止**
- 2026-07-11 / Phase 19B Lunch 実装 / 承認記録: 「Phase 19AのTransformation Planを承認します」(A1〜A4)。DishGallery除去・brisk分岐(MenuDetailPage/MenuBoard/globals.css)・計画から逸脱なし。DoD全通過(build/lint/非回帰/実スクロール/モバイル390/RM/コンソール0)。**未コミットのまま人間レビュー待ちで停止**
- 2026-07-11 / Phase 19C Lunch 合格・コミット / レビュー記録「Lunch brisk Editorialは人間レビューで合格しました」。最終確認: diff --check/lint/変更範囲限定/非回帰SSR/ギャラリー除去/tel CTA操作可能性 — 全て合格。lunch-implementation-report.md 作成。コミットID: 91d77da（feat: transform lunch page to brisk editorial）**
- 2026-07-11 / Phase 20A Course 現状分析+Transformation Plan / course-project-analysis.md・course-transformation-plan.md 作成。実画面確認（1440/390・RM強制ダンプ・SSRテキストダンプ）。要点: 現状=既定分岐のままプレースホルダ2枠pin横流しが残存（P1）／型と目的の不一致（選ぶ型に相談の中身・P2）／notes電話番号タップ不可（P3）／FAQ導線なし（P4）。Concept 3案比較→**案A「一卓の相談から、夜を整える。」推奨**（既存コピー変更ゼロで成立・案Bは未確認情報必須かつLunch近接・案Cはテンプレ感最大）。3 Scene（C1相談の入口/C2対応できることを知る/C3電話で席を整える）・Motion密度2-1-1・pinなし・fade-quiet最弱。実装候補②consult分岐を推奨。未確認事項（人数条件・飲み放題内容・個室・記念日対応等）は[未確認]のまま表示しない設計。**コード・CSS・コピー変更なし・コミットなし。A1〜A5承認待ちで停止。Phase 20B未着手**
- 2026-07-11 / Phase 20B Course 実装 / 承認記録: 「Phase 20AのTransformation Planを承認します」（A1〜A5・導線文言「ご予約・ご宴会についてのご質問」固定）。実装: course/page.tsx に consult 付与／MenuDetailPage に consult prop（ギャラリー非描画・gm-consult スコープ）／MenuBoard に consult 分岐（全Reveal=fadeQuiet y8・見出しマスクのみ既定値・締めの一枚も fadeQuiet・gm-tel-btn は演出対象外）＋renderNote（072-430-6038 の tel: リンク化・文言不変）＋consult限定の /contact 導線／globals.css に .gm-consult 余白・.gm-note-tel（タップ44px+）・.gm-board-contact-hint。検証: build/lint/diff-check ✅・実スクロール（実ブラウザ1440）✅・モバイル390 iframe実測（横0・pin0・インライン演出0・tel 87×48）✅・RMダンプ（隠し要素0）✅・非回帰SSR+実画面（dinner gm-stage6/lunch brisk/drink gal4・混入0）✅・削除行逐語照合 ✅・横断検索無破壊 ✅・コンソール0 ✅。未検証: Safari/iOS実機・CPU4x・JS無効視覚レンダ。**未コミットのまま人間レビュー待ちで停止。Phase 20C未着手**
- 2026-07-11 / Gumon Finalization Sprint（Stage A〜H・ユーザー指示「愚問の実装を一括で仕上げる最終スプリント」） / Course再承認・Drink/About新規実装・Access/Contact/Recruit QAを一括実施。**Stage 0**: next-server(本番プロセス)を停止しnext dev単独稼働へ整理。**Stage A**: Course最終QA後、Course関連4ファイル+docsのみをステージしてコミット（`c2d0ba7`）。**Stage B**: drink-transformation-plan.md作成→calm分岐実装（consult||calmへ統合しfadeQuiet基準を共有）。副次発見: 既定/brisk分岐がCTA全体を演出対象にし電話ボタンが初期不可視だったバグをquiet/consultと同じ除外パターンで修正（Lunchにも適用・原則0是正）。コミット`2f026f9`。**Stage C**: about-copy-review.md作成→PullQuoteをTOP重複解消のため「店名について」直後へ再配置（コピー不変・順序のみ）、本文行Revealを静的化。副次発見: InfoSection共有のTelCta電話ボタンも同種の可視性バグ→除外修正（about/access/contact/recruit全てに恩恵）。コミット`b8ed072`。**Stage D**: access-contact-qa-report.md作成。実バグ1件（`.gm-info-tel-link`タップ領域22px→51×109pxへ拡大）発見・修正。Tab-onlyキーボードナビゲーションの scroll-reveal未到達領域を発見したが、サイト全体に及ぶ大規模改修が必要なため記録のみに留め、Blockerへ記録。コミット`a8b07ce`。**Stage E**: recruit-qa-report.md作成。Recruit固有の実バグなし・コード変更なし（QA中に発見したInstagramアイコン1424px巨大化は`.next`devキャッシュ不整合と特定・`.next`削除で解消・ソース無関係）。コミット`1d9cab0`（docsのみ）。**Stage F**: 全9ルート横断QA（SEO/alt/見出し階層/リンク切れ/lint/diff-check/本番build）— 新規コード変更なしで全合格。コミット`4d28aa7`。**Stage G**: gumon-publication-blockers.md（19項目集約）・GUMON_FINAL_HANDOFF.md・gumon-final-qa-report.mdを作成。コミット`076ffb9`。**Stage H**: gumon-pattern-catalog.md（Engine還元Pattern7種+横断原則4件）作成・state.mdを最終状態へ更新。全期間を通じて「既存の未コミット変更（外部セッションによるLCP/A11y改善: GumonScroll.tsx/SiteChrome.tsx/MenuHero.tsx/decisions.log.md/icon.svg/wdos-perf-measurement-001.md）」は一度も上書き・破棄せず、常にstageごとに関連ファイルのみをgit addして分離コミットした。TOP/Dinner/Lunchへの大規模変更は行っていない（Lunchのtel-btn除外のみ最小修正として実施）。**Gumon Site v1：実装完了・公開前Blocker確認待ちで停止**
