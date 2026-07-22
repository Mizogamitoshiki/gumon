# Drink Calm Editorial — Transformation Plan（Finalization Sprint Stage B）

作成: 2026-07-11 ／ 状態: 承認待ちにせず、既存原則の範囲内で安全に実装（スプリント指示どおり）
対象: `/menu/drink` のみ。TOP・Dinner・Lunch・Course・About・Access・Contact・Recruit は不変更（MenuBoard 共有バグ修正1件を除く。§4参照）。

## 1. Drink の役割

「一杯の余韻」。食事の後を締める、静かな一杯の紹介ページ。

```text
食事の余韻          … Hero(現状維持)
料理に寄り添う一杯を知る … 紹興酒・ワイン・中国茶・ソフトドリンクの一覧
席と予約へ戻る        … 既定CTA
```

## 2. 現状分析

- 構成（現行）: MenuHero → **DishGallery（pin 横流し・4枠すべて実写ゼロのプレースホルダ）** → MenuBoard（既定Reveal・quiet/brisk/consultいずれでもない）→ CTA
- データ（`DRINKS`, `src/lib/menu.ts`）: 4品目とも `img` なし・価格はすべて「価格は店舗へ」（プレースホルダではなく方針として維持中の実データ未確定表示）。`notes` フィールドは未定義（配列自体がない）
- 問題: Course・Lunch と同一の P1（視覚情報ゼロのギャラリーが1ステージ分を占有）。削除テスト判定は同一（品名・価格・説明は MenuBoard に全件掲載済み＝情報損失なし）

## 3. 実装方針

- DishGallery を外す（Plan B。Course 20A-A1 / Lunch 19A-A1 と同型の削除テスト）
- Drink 専用の **`calm`** 分岐を新設。演出強度は「Lunch(brisk)以下・Course(consult)以上」の範囲に収める — 本計画では、この範囲の**下限＝Course(fadeQuiet基準)と同じ値**を採用する。理由: (a) Lunchより強くしないことは自明に満たされる (b) Courseより弱くしないことも、Courseと同値を採ることで確実に満たされる (c) 新しい5つ目のマジックナンバー体系を作らずMotion Has Meaningの理由記録を簡潔にできる
- C1→C2 の間は、Course（clamp(96,15vh,168)）ほど大きな「立ち止まる間」ではなく、食後の余韻が続く緩やかな移行として `clamp(64px, 10vh, 120px)` を採用（brisk の圧縮 clamp(40,7,80) と consult の間）
- notes・tel リンク化・Contact 導線は**追加しない**（DRINKS に notes フィールドが存在しないため対象がない。捏造しない）
- 事実・価格・新コピーは追加しない

## 4. 副次的に発見した実バグの修正（本スプリント原則0）

MenuBoard の共有 CTA reveal（quiet/consult 以外が通る既定 `else` 分岐）が `.gm-board-cta` 全体（電話ボタン含む）をアニメーション対象にしており、スクロールトリガー発火まで電話ボタンが `opacity:0` の初期状態になる。これは本スプリント原則0「主電話CTAはアニメーションの初期状態で隠さず、常に操作可能にする」に反する。quiet(dinner)・consult(course) は既に `.gm-tel-btn` を対象から除外済みだが、既定分岐（現状 drink が使用）と brisk(lunch) はこの保護がない。

**修正**: 既定 `else` 分岐でも `.gm-tel-btn` を演出対象から除外する（quiet/consult と同じ保護を適用）。これは Lunch（既にロック済み・91d77da）にも影響するが、見た目・タイミングは電話ボタン以外すべて逐語で維持し、電話ボタンのみ「常時表示」に変える最小修正のため、「重大な実バグの最小修正」として許容範囲とする。

## 5. 変更ファイル

| ファイル | 変更 |
| --- | --- |
| `src/app/menu/drink/page.tsx` | `calm` 付与 |
| `src/components/menu/MenuDetailPage.tsx` | `calm` prop 新設（DishGallery非描画をbrisk/consultと共有条件に・`.gm-calm`スコープ・MenuBoardへ伝搬） |
| `src/components/menu/MenuBoard.tsx` | `calm` 分岐新設（fadeQuiet基準）＋ 既定`else`分岐のtel-btn除外（バグ修正・Lunch/Drink双方に適用） |
| `src/app/globals.css` | `.gm-calm .gm-board`余白のみ追記 |

## 6. 未確認事項（推測で埋めない）

- [未確認] 飲み物の実価格（4品とも「価格は店舗へ」表示を維持）
- [未確認] 酒器・グラス等の実写素材の有無

## 7. 実装記録・QA（2026-07-11）

計画どおり実装。`page.tsx`に`calm`付与／`MenuDetailPage.tsx`に`calm` prop（DishGallery非描画・`.gm-calm`スコープ）／`MenuBoard.tsx`に`calm`分岐（`consult || calm`条件へ統合し fadeQuiet基準を共有）／`globals.css`に`.gm-calm .gm-board`余白のみ追記。

**副次的なバグ修正**: 既定/brisk(lunch)の`else`分岐が`.gm-board-cta`全体を演出対象にしており、電話ボタンがスクロールトリガー発火まで`opacity:0`だった。quiet/consult同様に`.gm-tel-btn`を対象から除外(Sprint原則0の是正)。Lunch(91d77da)にも適用されるが、電話ボタン以外の見た目・タイミングは逐語で維持する最小修正。

**検証結果**:
- lint 0件／build成功／`git diff --check` OK
- SSR: drink `gm-calm`×2・`gm-gal-panel`0（ギャラリー除去確認）。dinner`gm-stage`6・lunch`gm-brisk`2・course`gm-consult`2 を維持、他ページへの`gm-calm`混入0
- 実ブラウザ: 電話ボタンが`.gm-board-frame`の早期リビール後は常時`opacity:1/visibility:visible`で、CTA到達時に別途フェードインするflickerが解消したことをdrink・lunch両方で確認
- モバイル390px(iframe実測): 横スクロール0・pinスペーサー0・ギャラリー0・board内インライン演出0(完全静的)・電話ボタン214×53px・4行表示
- reduced-motion(headlessダンプ): 隠し要素0(既知1件=モバイルナビ)・4カテゴリ全文+電話CTA文言を確認。course側も同時に非回帰確認(opacity:0は同じ既知1件のみ)
- コンソール error/warn 0

**未検証事項**: Safari/iOS実機・CPU4xスロットリング・第三者体感評価（Course実装記録と同様、サイト共通の未検証項目）

## 8. 夜のお品書き構成への統一（2026-07-22・ユーザー指示）

指示（同日2段階・course-transformation-plan §15 参照）: 最終指示「全て…夜のお品書きの構成に統一して もちろんドリンクも」により、calm の fade-quiet 下限固定（§4）を撤回し、**dinner(quiet) と同一の振付**（`lively` 共通パス）へ統一。場面句は既存リード「一皿に、寄り添う一杯を。」由来の**「一杯を、選ぶ。」**、締め句「席を、決める。」。notes/tel リンク/Contact 導線を作らない方針・モバイル/RM 静的ゲートは不変。

検証は course §15 と同一バッチで全合格（drink 実画面: 場面句 op1・額縁/行の統一振付・締め写真 clip 展開・RM 隠し0）。**未コミット・人間レビュー待ち。**
