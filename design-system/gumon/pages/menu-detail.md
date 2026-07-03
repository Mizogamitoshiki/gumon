# Menu Detail Page Overrides（/menu/lunch・dinner・course）

> **PROJECT:** GUMON
> **Updated:** 2026-07-02（実装に合わせて補正済み）
> **Page Type:** 料理カテゴリ詳細（シネマティック・スクロール）

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file
> (`design-system/gumon/MASTER.md`). Only deviations are documented here.

---

## Page Structure（確定構成）

1. **Hero** — 100svh。`titleJp` を文字マスクでせり上げ（`split-text` + expo.out、stagger 0.045）。
   背景は `gumon-wall.png`（opacity 0.16）+ ストーンのグロー。デスクトップは背景 +14% /
   前景 -10% の視差（scrub・等速）。下部にスクロールキュー（reduce では非表示）。
2. **横スクロールギャラリー（看板の品・最大 4 品）** — 861px 以上でピン + 横流し
   （`x: -(scrollWidth - innerWidth)`、scrub 1.2）。イントロ列は縦書き見出し。
   各額縁は clip-path inset(10% 8%) → 0 + 1.06 → 等倍、写真は containerAnimation 視差 ±5%。
   進捗バー（ストーン 1px）。**860px 以下と reduced-motion は縦積み**（構築自体をしない）。
3. **お品書き一覧** — `min(680px)` カラム。行マスク見出し → 罫線 scaleX → 行ごとの
   fade-rise（y 24px、once）。既存の `.gm-menu-row` プリミティブを再利用。
4. **電話予約 CTA** — 朱 `#b23a2e`。このページで朱を使うのはここだけ。

## Layout Overrides

- Hero とギャラリーはフルブリード。一覧セクションのみ `min(680px, 100%)` カラム
- ギャラリーのブレークポイント **861px** は CSS と `DishGallery.tsx` の matchMedia で必ず一致させる

## Component Notes

- 写真がない品は placeholder（`#161412` ラジアル地 + 品名 1 文字目の透かし serif）
- 実装ファイル: `src/components/menu/{MenuHero,DishGallery,MenuList,MenuDetailPage}.tsx`、
  Lenis は `menu/layout.tsx` の `<SmoothScroll>`（トップ LP とは別系統）

## Recommendations

- 追加写真を入れる際は `src/lib/menu.ts` の `img` を埋めるだけでギャラリー・一覧の両方に反映される
- 横流しに品を追加しても距離は `scrollWidth` から自動計算される（4 品程度を推奨）
