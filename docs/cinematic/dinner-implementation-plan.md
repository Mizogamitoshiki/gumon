# Implementation Plan — /menu/dinner（Phase 16・承認待ち）

<!-- 承認記録が空欄の間、実装へ進めない。親: sitewide-rollout-plan.md／dinner-creative-brief.md／dinner-experience-plan.md -->

## 1. 現行ページの分析（要約）

- 構成: MenuHero（文字リビール・軽視差）→ DishGallery（PC=pin横流し／モバイル=縦積み）→ MenuBoard（検索・絞込・注記・他導線・電話CTA）。SiteChrome（DetailNav/ScrollProgress/フッター/Lenis lerp0.09）
- **強み**: 実価格3品と予算目安・検索/絞込・FAQ級の注記・電話CTA 44px+（15px×2+15pt≈48px）・reduced-motion/モバイル分岐完備・SEO（メタ/パンくず/canonical）完備・「写真を足すならmenu.tsのimgを埋めるだけ」の拡張性
- **課題**: ①PCギャラリーのpin＋横流しがPhase 16基準（Pin禁止・読み優先）と衝突 ②実写が麻婆1枚のみで、ギャラリー4枠中3枠がプレースホルダ＝期待形成が逆効果 ③Reveal値がトークン外（y20〜26）でTOPのfade-quiet文法と不統一 ④リード文がTOP章句（火・時間）と語彙近接 ⑤価格[未確認]6箇所・実URL[未確認]

## 2. 変更の全体像（残す・変更・追加・削除候補）

| 区分 | 内容 | 理由 |
| --- | --- | --- |
| **残す** | MenuHero一式（文字リビール・軽視差=条件付き利用の範囲）／MenuBoard構造（検索・絞込・crosshits・注記・他導線・CTA・締めの一枚）／TelCta文法（電話主役・Web副次）／SiteChrome・Lenis系統／SEO資産／menu.ts単一出典／reduced-motion分岐思想 | 読み・実用・信頼形成の基盤として完成度が高い。Editorialの核 |
| **変更** | ①**DishGallery → 縦型エディトリアル「看板との対面」へ**（pin・横流し・containerAnimation・水平視差を廃止。モバイル縦型を全デバイス基準に統合。額縁clip-reveal 1回＋fade-quietキャプション。実写がある品のみ表示=Plan B内蔵） ②MenuBoard等のReveal値を`GUMON_SCENE_MOTION`（fade-quiet 8px）へ弱化（読む区間） | Phase 16基準（Pin禁止・料理名/価格/説明の可読最優先）。プレースホルダ額縁の露出をやめ写真を信頼形成に限定 |
| **追加** | D2大判額縁レイアウト（麻婆豆腐主役・キャプション余白） | 記憶層。写真受領で額縁を足すだけの拡張構造 |
| **削除候補** | ギャラリー進捗バー・横流し専用CSS（.gm-gal系の水平レイアウト分） | pin廃止に伴い機能喪失。削除テストではなく構造変更の随伴 |
| **提案（要承認・今回は変更しない）** | ①リード「火と時間をかけた、夜のための一皿。」→「今夜の一皿を、選びはじめる。」等（TOP章句との語彙重複解消） ②CTAリードにS9の反響「今夜の答えを、お取り置きします。」 | コピー変更は承認事項 |

## 3. Hero案・代表Scene（承認対象）

- **Hero: 案A（現行深化）を推奨**（比較はdinner-experience-plan 8章。案B=一皿ヒーローは唯一の実写をD2と取り合うため不採用推奨）
- **代表Scene: D2「看板との対面」** — 変更の中心・写真主役の型・素材課題（Plan B）の検証・menu残り3ページへの型の原器。実装→人間レビュー→残りのD3弱化等へ

## 4. 実装計画（承認後）

1. 代表Scene D2: DishGalleryの縦型化（またはDishShowcase新設→置換）＋Plan B分岐 → レビュー
2. D3: MenuBoard Reveal弱化（値のみ・構造不変）／D1・D4: 現状継承の確認
3. QA→コミット（feat: transform dinner page to editorial ほか）
- **変更ファイル候補**: `src/components/menu/DishGallery.tsx`（中心）／`src/app/globals.css`（.gm-gal系の縦型統合・不要CSS削除）／`src/components/menu/MenuBoard.tsx`（Reveal値のみ）／（コピー承認時のみ）`src/lib/menu.ts`／docs/cinematic
- **触らない**: TOP関連全て（GumonScroll/T/scroll-root）・MenuHero・TelCta・SiteChrome・依存・他ページ

## 5. QA計画

- build/lint/diff-check・コンソール0・**pinの不存在確認**（ScrollTrigger pin数=Hero視差のみ）・375/390横スクロール0・タップ領域44px+・reduced-motion実切替（headless --force-prefers-reduced-motion）・Lighthouse（devtools法・LCP 2.5s以内目標: pin廃止と画像lazyで悪化要因なし）・TOP回帰なし（/の挙動・ビルドサイズ）・可読性（品名/価格/説明のコントラスト・行間）・人間レビュー: D2の対面の質感・「TOPの再放送に見えないか」・PC/iPhone通し

## 6. リスク

| リスク | 低減策 |
| --- | --- |
| 実写不足でD2が痩せる | Plan B（1枚主役・額縁は写真がある品のみ）を最初から実装。受領後は menu.ts の img 追記だけで拡張 |
| pin廃止でPCの「見せ場」が弱く感じる | D2の大判額縁＋clip-revealに集中投下。判定は人間レビュー（弱ければ額縁サイズ/余白で調整、pinには戻さない） |
| ボード弱化で物足りない | 削除条件記録済み（現行値へ戻す） |
| .gm-gal CSS変更の他ページ波及 | 同CSSはmenu4ページ共用 — **dinnerで確立した型がそのままlunch/course/drinkに適用される**（意図した波及。QAで4ページ確認） |

## 7. 公開Blocker（このページ関連・[未確認]）

麻婆豆腐ほか実価格・夜メニュー原本／ホットペッパー実URL（CTA内リンク）／料理実写2〜4点（陰影・一点光）／素材一次出所。**いずれも推測で埋めない。**

## 8. 承認記録

- **Phase 16 Plan承認（2026-07-10・条件付き）**: Hero案A維持／D2を代表Sceneとして実装／Plan B採用（実写のみ大判・プレースホルダ非表示）／D3弱化はdinner内限定／電話CTA・SEO・MenuHero・検索絞込は維持。**重要制約: `.gm-gal`を直接変更せず、lunch/course/drinkへ未承認の見た目変更を波及させない（dinner専用variant必須）**。コピー変更・menu.ts変更・新素材・依存追加・TOP変更・Phase 18は禁止

## 9. Phase 17 実装記録（2026-07-10）【人間レビュー待ち・未コミット】

### 変更ファイル

| ファイル | 変更 |
| --- | --- |
| `src/components/menu/DishShowcase.tsx` | **新規** — D2「看板との対面」dinner専用variant。縦型・実写のみ（Plan B: `items.filter(i=>i.img)`・実写ゼロならセクション自体を出さない）。額縁clip-reveal各1回（expo.out 1.3・once）＋キャプション/見出しはfade-quiet（8px・0.8・power1.out）。useGSAP+scope・matchMediaでRM時は何も構築しない。pin・横流し・進捗バー・水平視差なし |
| `src/components/menu/MenuDetailPage.tsx` | `editorial?: boolean`（既定false）を追加。true時のみ DishShowcase＋MenuBoard quiet。**未指定ページはDOM・見た目・Motionとも従来と完全同一** |
| `src/components/menu/MenuBoard.tsx` | `quiet?: boolean`（既定false）を追加。quiet時のみ額縁/リボン/行/導線CTAのRevealを fade-quiet 値へ弱化（`rise ?? 26` 等のnull合体で**既定パスは従来リテラルのまま**）。見出しマスクと締めの一枚clipは維持（ページのクリップ=D2額縁＋締めの計2回） |
| `src/app/menu/dinner/page.tsx` | `editorial` を渡すのみ |
| `src/app/globals.css` | `.gm-shot*` 新規クラス群を**追記のみ**（`.gm-gal`は一切変更なし）。額縁は`aspect-ratio: 4/3`でサイズ先確保=CLSゼロ |

### Dinner専用variantの設計理由

別コンポーネント（DishShowcase）＋新規クラス名前空間（gm-shot）＋オプトインprop方式を採用。**DishGallery.tsxと.gm-galは1バイトも変更していない**ため、他ページの非回帰が構造的に保証される。将来は各ページの`editorial`フラグを立てるだけで同variantを承認後に展開できる。

### 他メニュー非回帰の確認結果（客観検証）

- 変更前後のSSR HTMLを取得し、script/link（チャンクハッシュ）を除いた**body DOMを厳密比較 → lunch/course/drink 3ページとも完全一致** ✅
- dinnerのみ変更（gm-gal出現0＝横流し撤去・gm-shot 11・麻婆/価格/CTA存在）✅
- コード上もDishGallery無変更＋MenuBoard既定パスは従来リテラル ✅（Motion非回帰）

### 実装したD2のMotion目的

額縁clip-reveal（1回）=「対面の瞬間」（感情を変える。D3より強く、TOP S4フィルムより弱いページ唯一のピーク）／キャプションfade-quiet=読み優先（理解を助ける）／RM時=構築ゼロで全文静置。

### 検証結果

build ✅／lint ✅ 0件／diff --check ✅／コンソール0 ✅／**pin-spacer 0個（pin不在をDOMで実証）**✅／PC: 額縁933×700(4:3)・電話CTA 214×**53px** ✅／390px（実iframe計測）: scrollWidth=390=横スクロール0・額縁375幅・CTA 53px ✅／**reduced-motion実切替（headless --force-prefers-reduced-motion）: gm-shot・board内にopacity:0残留ゼロ、麻婆豆腐・酢豚・¥980・tel CTA全て可読** ✅／noscript: SSRに品名・価格・CTA存在（メニューページは元よりインライン隠しなし）✅

### 未確認素材・公開Blocker（変更なし・推測で埋めていない）

麻婆豆腐ほか実価格[未確認]／夜メニュー原本[未確認]／ホットペッパー実URL[未確認]／追加の料理実写[未確認]（現状Plan B=麻婆1枚のみ）／素材一次出所[未確認]

### 人間に確認してほしい観点

①D2「対面」の質感（大判1枚の額縁が「看板」として立っているか・clip-revealの重さ）②D2がD3より強くTOP S4より弱い階調に感じられるか ③1枚だけでも寂しくないか（Plan Bの妥当性）④D3弱化後の品書きの読み心地 ⑤PC/iPhoneの通し（Hero→対面→品書き→CTA）⑥lunch/course/drinkがいつも通りか（目視でのダブルチェック）


## 10. Dinner Storytelling Pass 実装記録（2026-07-10）【人間レビュー待ち・未コミット】

物語の骨格: D1 夜の入口 → D2 看板との対面（選びたくなる一皿）→ D3 選ぶ時間 → D4 席へ向かう（結末）。

| 場面/境界 | 実装内容 |
| --- | --- |
| D1→D2 | 入口の余白を拡張（`.gm-editorial .gm-shot` padding-top clamp(96px,16vh,176px)）— ヒーローの視差退場（既存）を受ける呼吸。新コピーなし |
| D2 | **写真だけに縦パララックス**: yPercent -5→+5（合計10%・規定8〜12%内）・scrub 0.6・ease none・**デスクトップのみ**（min-width:861px + no-preference）。のりしろはCSSで縦±6%オーバースキャン（モバイルは従来フレーミング維持）。額縁・見出し・キャプションは不変 |
| D2→D3 | 写真を見せ切る余白（padding-bottom clamp(110px,18vh,200px)）→ 品書き（最も静かな場面・fade-quiet継続・stagger追加なし） |
| D3→D4 | CTA前の短い余白（`.gm-editorial .gm-board-cta` margin-top clamp(72px,11vh,128px)）＋ quiet時はCTAを導線から分離し**単独・長め(1.1)・fade-quietで静かに着地**（焦らせない） |

- 変更ファイル: DishShowcase.tsx（パララックス）／MenuBoard.tsx（quiet枝のCTA分離のみ・既定枝は従来リテラルへ戻し切り）／MenuDetailPage.tsx（editorial時のみ `gm-editorial` クラス付与）／globals.css（`.gm-editorial` スコープ内の追記のみ）
- 禁止事項遵守: Pin・横スク・スクラブ・進捗バー追加なし／コピー・価格変更なし／TOP・DishGallery・.gm-gal 無変更／transform・opacity（＋既存clip）以外なし／強いパララックスはD2写真のみ
- 検証: build/lint/diff-check ✅・コンソール0 ✅・**非回帰: lunch/course/drink の body DOM 完全一致（Phase 17承認済みHTML基準・機械検証）** ✅・390px実測: 横スクロール0・media overscanはモバイル0px（無効）・CTA余白≈93px適用・電話CTA 53px ✅・RM実切替（headless）: 全文・価格・CTA可読（唯一のopacity:0は閉状態のモバイルメニュー=意図されたUI）✅
- 未検証（ウィンドウ不可視のため）: PCでのD1→D4通し体感（低速/通常/高速）・パララックスの実速度感 — 人間レビュー観点へ


## 11. Dinner Scene-Turn Storytelling 実装記録（2026-07-10）【人間レビュー待ち・未コミット】

「1スクロール=1場面」の骨格（参考にしたのは設計原理のみ。表現の模倣なし）:

| Scene/境界 | 実装（10章からの差分） |
| --- | --- |
| D1 夜の入口 | **hero情報の段階的退場を新設**（dinner限定）: `.gm-editorial .gm-chero-inner`/`-cue` を heroの通過に同期して opacity 1→0（scrub 0.6・ease none・opacityのみ）。MenuHero本体は無変更 — dinner専用コンポーネント（DishShowcase）から `.gm-editorial` スコープの描画要素にだけ作用。既存の視差退場と重なり「情報が少しずつ退き、D2へ視線を渡す」 |
| D2 看板との対面 | **順序を「写真→見出し→キャプション」へ**: 額縁clip-reveal（1回・変わらず）を先頭に、見出し列は額縁トリガー+delay 0.25、キャプションは各額縁トリガー+delay 0.35 で遅れて静かに。パララックスは10章のまま（±5%計10%・scrub 0.6・写真のみ） |
| D3 選ぶ時間 | カテゴリ（リボン）→料理（行）の間を半拍拡大（tl位置 0.15→0.3・quiet時のみ）。fade-quietのみ・大量同時表示なし |
| D4 席へ向かう | 10章のまま（余白→CTA単独の静かな着地） |
| **モバイル** | **完全静的な縦構成へ変更**: DishShowcaseの全演出とMenuBoardのquiet演出を `(min-width:861px)` へスコープ（quiet時のみ。他ページの挙動は不変）。Sceneの順番と余白だけで物語を維持 |

- Scene間ルール遵守: 各Scene主役1つ（D1題字/D2写真/D3品書き行/D4電話CTA）・高強度連続なし（ピークはD2のみ）・scroll-snapなし・Pin/横スク/スクラブ/進捗バーなし・transform/opacity（+既存clip）のみ
- 検証: build/lint/diff-check ✅・コンソール0 ✅・非回帰: lunch/course/drink body DOM 完全一致（Phase 17承認基準）✅・390px実測: 横スクロール0・**gm-shot内の演出系インラインスタイル0（完全静的を実証）**・hero退場もモバイル無効・CTA 53px ✅・RM実切替（headless）: 麻婆豆腐・¥980・CTA可読、hero内容可視 ✅
- 未検証: PCでのD1→D4通し体感（低速/通常/高速・写真→見出しの遅れの質感）— ウィンドウ不可視のため人間レビューへ


## 12. 紙芝居型（画面固定Scene-Turn）実装記録（2026-07-10）【人間レビュー待ち・未コミット】

**方針転換の記録**: ユーザー指示「画面固定でめくれる紙芝居型にしたい」により、**Phase 16のPin禁止をD2ステージ限定で解除**。scrub駆動（入力無視ゼロ）・snap不使用・+170%の短い行程でQS13は維持。モバイル・reduced-motionは静的縦積みのまま（Pin持ち込みなし）。

| 場面 | 実装 |
| --- | --- |
| 場面1 | 題字の幕: 「SELECTION／DINNER・看板の品」だけが画面中央（ビューポート固定開始） |
| めくり | 題字が退き（opacity+y）、窓（clip inset 18%/14%→0）が開いて一皿が**全画面**で対面。scale 1.08→1・写真の縦ドリフト±6%（等速） |
| 場面2 | キャプション（品名→価格→説明）が下部スクリムの上に点灯（stagger 0.05） |
| 解放 | p0.84〜1は保持（見せ切る）→ pin解除 → 余白（margin-bottom clamp(110px,18vh,200px)）→ D3お品書きへ |

- 実装: DishShowcase デスクトップmmブロックを pinタイムライン（trigger=section・start top top・end +=170%・pin・scrub 0.6・anticipatePin・invalidateOnRefresh）へ再構成。ステージレイアウトは **`@media (min-width:861px) and (prefers-reduced-motion: no-preference)` ガード付きCSS**（`.gm-editorial`スコープ）— RMデスクトップとモバイルは基底の静的レイアウトに自動フォールバック。スクリム（.gm-shot-scrim）は基底display:noneでステージ時のみ表示
- 修正1件: 題字が左寄りになる不具合（基底max-width:880pxがabsolute化後も残存）→ ステージ時 `max-width:none` で解消・中央配置を実画面確認
- 検証: build/lint/diff-check ✅・**実スクロール通し（可視ウィンドウ・PC）で 題字幕→めくり→全画面対面→キャプション→解放→お品書き を目視確認** ✅・RM実切替: 全文/価格/CTA可読 ✅・モバイル: ステージCSS非適用=静的縦積み維持 ✅・非回帰: 本ラウンドの変更はDishShowcase+scopedCSSのみ（共有ファイル不変） ✅
- 注意: pin-spacerが1個生成される（意図された挙動。11章までの「pin-spacer 0」記録はこのラウンドで更新）／複数写真の受領時はステージの多場面化を別途設計する（現状は麻婆1枚のワンステージ）


## 13. 全ページ紙芝居化（2026-07-11）【人間レビュー待ち・未コミット】

ユーザー指示「ページの上から下すべてに対応してほしい」を受け、紙芝居の場面をページ全体へ拡張:

| Scene | 形 |
| --- | --- |
| D1 夜の帳 | **固定の開幕ページ化**: heroを+70% pin。前半0.35は題字を読む保持（何も動かさない）、後半で題字とキューが退場（めくり）→解放。MenuHero本体は無変更（dinner側からpin） |
| D2 看板との対面 | 12章の紙芝居ステージ（変更なし） |
| D3 お品書き | **意図して流し読みのまま**（読む頁。長い一覧のpinは可読性を壊すため。kurukuru型でも読み物は流すのが常道） |
| D4 席へ向かう | **全画面の結末ページ化**: CTAブロックを min-height 88svh の中央寄せ場面に（pinはしない — 結末で操作を拘束しない）。既存のquiet単独着地と組み合わせ「最後の一頁」になる |

- 変更: DishShowcase（D1 pinタイムライン追加）／globals.css（`.gm-editorial .gm-board-cta` の全画面場面化 — motion可ガード付きmedia query内）。共有ファイル・他ページ・モバイル・RMは不変
- 検証: build/lint/diff-check ✅・実スクロール目視: D1が画面固定で読ませてからめくれる→D2ステージ→D3流し読み→D4全画面結末を確認 ✅・コンソール0 ✅・RM/モバイル: ガード付きのため静的維持（構造上不変）✅
- ページ内pin=2箇所（D1 +70%・D2 +170%）。TOP(1箇所・長尺)との階調は維持


## 14. 境界レス化 — 一つづきの流れで品書きへ（2026-07-11）【人間レビュー待ち・未コミット】

ユーザー指示「スクロールに境界をなくして自然に流れ、メニュー一覧まで辿り着くように」を受けた再調整:

| 変更 | 内容・理由 |
| --- | --- |
| D1のpin撤回 | 「読む時間」はスクロール開始前の静止が既に担っており、pinは二重の停止＝境界だった。スクロールに同期した退場（opacity+y・scrub 0.6・end bottom 45%）へ戻し、動き出したら止めない |
| D2ステージの幕間解消 | 題字の退場(0.1〜)と窓の開き(0.06〜)を**重ねる**順序に変更 — 「真っ黒だけの瞬間」を排除し、常にどちらかが動いている |
| ステージ行程短縮 | +170%→**+150%**・キャプション0.62→0.55・保持0.84→0.78〜（見せ切ったらすぐ解放） |
| 余白圧縮 | D2→D3: clamp(110,18vh,200)→**clamp(48px,8vh,96px)** ／ D3→D4 CTA前: clamp(72,11vh,128)→clamp(48px,8vh,96px) |
| 結果 | 品書き到達までの行程 ≈4.4画面→**≈3.5画面**。ページ内pinはD2の1箇所のみに復帰 |

- 検証: build/lint/diff-check ✅・実スクロール目視: ヒーロー退場中に次場面の題字が同一画面へ入り（境界消失）、窓開き→対面→解放→即・品書き到達を確認 ✅・コンソール0 ✅・モバイル/RM: ガード構造のため不変 ✅


## 15. Story Transition Refinement — 4段の物語接続（2026-07-11）【人間レビュー待ち・未コミット】

指示: 「D1 夜の入口 → D2 一皿との対面 → D3 今夜を選ぶ → D4 席を決める」が
スクロールで自然に進むよう、**つながりだけ**を改善（Hero・D2写真・お品書き・quiet設計は不変更）。

| 問題 | 打ち手 |
| --- | --- |
| 「看板の品」の黒い題字Sceneが独立して見える | **熾火**: ステージ開始時から皿を opacity 0.35・窓 inset(24% 18%) で題字の背後に灯す。題字が退くほど皿が明るく開く — 題字は独立場面でなく「対面の予感」になる（DishShowcase: 初期set変更＋開幕タイミング前倒し 0.02〜） |
| D2→D3 の意味的な受け渡しが弱い | **一歩引き**: 見せ切り後(p=0.82〜) 皿が scale 0.965・opacity 0.55 へ静かに翳る — 全景の「答え」から選ぶ時間へ誘う。受け側は quiet 時のみボード額縁の登場を top 94% へ前倒しし、翳った皿の裾と額縁が同一画面で重なる |
| D4 CTA が結末として感じにくい | **儀式的点灯**: quiet 時のみ CTA を一括fadeから**子要素の逐次reveal**へ（ご予約を承っております→電話ボタン→番号→Web→アクセス、stagger 0.16・fadeQuiet・trigger top 75%・once）。88svh 全画面場面は維持 |

- コピー・価格・URL・DOM構造は不変更。lunch/course/drink は非quiet分岐（78%・一括fade）のまま無影響。モバイル/RM は quiet の mm が 861px+ no-preference のため静的なまま
- 検証: build ✅ lint ✅ 実スクロール目視（熾火→開窓→対面→一歩引き＋額縁の同居→CTA結末）✅ コンソール error/warn 0 ✅


## 16. scrTelling 機構の移植 — 単一ステージの場面合成（2026-07-11）【人間レビュー待ち・未コミット】

ユーザー指示「セクション区切りが目立つ。kurukuru-web のスクロール技術を調査して完全にコピーして応用」。

### 調査結果（https://wednes-web.com/special/kurukuru-web/ 実地解剖）
- GSAP/Lenis 不使用。jQuery + 自前 258 行（function.js「scrTelling」）
- 機構: ①超長尺親セクション（20/16/6画面分・総高 32,625px）+ position:sticky の 100vh 子で場面を固定
  ②scroll イベントで「n番目のセクションを m% 進んだ」を算出し、calcAuto（線形補間→CSS直接更新）と
  switchAuto（閾値クラス切替・CSS transition が緩急担当）で駆動
  ③場面転換は**セクション間でなく 1 つの sticky 画面内のサブシーン重畳**
  （scene01 が「拡大しながらフェードアウト」する 10〜100% と scene02 入場 10〜20% が必ず重なる）
  ④読む情報（料金・結び）だけ通常フローへ戻す
- 応用方針: 機構（超長尺固定・進捗%駆動・重畳・署名手法の拡大フェードアウト）を完全移植し、
  ビジュアル・コピー・素材は愚問のまま。スタックは規約どおり GSAP pin(=sticky相当)+scrub(=calcAuto相当)

### 実装
| 対象 | 内容 |
| --- | --- |
| MenuDetailPage | editorial 時のみ Hero+Showcase を `.gm-stage` で内包（+ JS無効時に静的へ戻す noscript style）。非editorialページは Fragment のみ＝DOM不変 |
| globals.css | デスクトップ+motion可のみ: gm-stage=100svh固定ステージ、hero=絶対配置 z3 不透明幕(#1c1b19)、gm-shot=絶対配置 z1。従来の gm-shot 単独 100svh 規則を置換 |
| DishShowcase | ステージ全体を pin(+320%)する単一マスタータイムラインへ再構成。夜の入口(静止→**拡大fade-out** 0.06-0.26)→幕が晴れる(hero autoAlpha 0.12-0.3)と重ねて「看板の品」入場(0.2-0.32)→拡大fade-out(0.42-0.56)と重ねて窓が開く(0.36-0.72)→キャプション(0.72-)→一歩引き(0.9-)。皿ドリフトは全行程等速 |

- 効果: ページ冒頭〜一皿対面まで**セクション境界ゼロ**（常に前の場面の退場と次の入場が重畳する 1 枚のステージ）。品書き(D3)・CTA(D4)は kurukuru の結びと同様に通常フローで読ませる
- pin はステージ 1 箇所のみ（従来の gm-shot 単独 pin を吸収・置換）
- 検証: build ✅ lint ✅ 非回帰（gm-stage は dinner のみ・lunch/course/drink は gm-gal 構造のまま）✅ 実スクロール目視（3層合成の場面めくり→対面→一歩引き→「今夜を、選ぶ。」額縁との同居着地）✅ コンソール error/warn 0 ✅
- 未検証: モバイル実機・RM実機（構造上は media query 外で静的のまま）・JS無効の noscript 実表示


## 17. お品書きの活気ある登場（2026-07-11）【人間レビュー待ち・未コミット】

ユーザー指示「お品書きも活気的なアニメーションで登場するように」。quiet(dinner)分岐のみ変更。

| 要素 | 演出 |
| --- | --- |
| 入場の波(単一TL・top 92%・once) | 章句「今夜を、選ぶ。」(y14) → **額縁が札のように躍り上がる**(y40・scale 0.975→1・1.0s) → 頭書き(見出し以外 stagger 0.09) → 見出し「お品書き」行マスクせり上がり(重複reveal回避のため頭書きフェードから除外しTL内へ) → 検索・絞り込み(stagger 0.08) |
| リボン | 帯らしく**左から差し込む**(x:-24・riseLine) |
| 品々(行) | わずかな縮み(scale 0.985)を伴い**次々と躍り上がる**(y24・riseLine・stagger 0.055・リボンから1/4拍) |

- トーン: riseLine(expo.out=速く出て柔らかく着地)で「賑わい」、順序の整いで「品」を維持。移動量は最大40px(規約内)
- 他ページ: 非quiet分岐を従来値で明示的に分離(額縁26px/GUMON_MOTION・見出し単独トリガー) — 値・順序とも不変
- モバイル/RM: quiet の mm が 861px+ no-preference のため静的のまま
- 検証: build ✅ lint ✅ 実スクロール目視(札の躍り上がり→波状連鎖→全行着地・可読) ✅ コンソール error/warn 0 ✅
