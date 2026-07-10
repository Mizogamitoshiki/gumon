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
