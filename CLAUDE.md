# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

中国料理店「**愚問（GUMON）**」の 1 ページ LP。Claude Design の `x-dc` 形式デザイン
（`Gumon Scroll v2.dc.html`）を Next.js + React へ移植したもの。マットブラック基調のモノクロ
（背景 `#1c1b19` / 文字 `#f2f0eb` / 中間アクセント＝ストーン `#b9b2a6` / 朱 `#b23a2e` は電話予約 CTA のみ。金色は不使用）、
1 つの pin された stage（`820vh`）を Lenis + GSAP の scrub タイムラインで進める
6 ビート構成（hero → about → 料理 → 飲み物 → アクセス → 予約）。

## 技術スタック

- **Next.js 14（App Router）** / **React 18** / **TypeScript**
- **Tailwind CSS 3.4**（テーマ色・フォント変数を `tailwind.config.ts` に定義。ただし
  本コンポーネントの大半は移植元の忠実再現のためインライン style）
- **gsap** + **gsap/ScrollTrigger**（スクロール連動）
- **lenis**（慣性スムーススクロール）
- フォント: `next/font/google` の **Noto Serif JP**（見出し）と **Noto Sans JP**（本文）
  を CSS 変数 `--font-noto-serif-jp` / `--font-noto-sans-jp` で供給
- ESLint: `next/core-web-vitals`（`.eslintrc.json`）

## 開発コマンド

```bash
npm install        # 依存関係のインストール
npm run dev        # 開発サーバー（http://localhost:3000）
npm run build      # 本番ビルド
npm run start      # 本番サーバー
npm run lint       # ESLint
```

## 構成と要点

- `src/app/layout.tsx` — フォント読み込み・メタデータ・`<html lang="ja">`
- `src/app/page.tsx` — `GumonScroll` を描画するだけ
- `src/components/GumonScroll.tsx` — **本体**。`"use client"`。1 つの `useEffect` 内で
  Lenis 初期化 → GSAP マスタータイムライン構築 → `ScrollTrigger`（`scrub: true`）で駆動。
  各ビートの要素は `data-scene` / `data-fade` / `data-rise` / `data-cat` などの
  data 属性 + `querySelector` で取得している（移植元 DC ロジックの構造を踏襲）。
- `src/components/ImageSlot.tsx` — 移植元 `<image-slot>` の代替。`src` 未指定時は
  ドロップ用プレースホルダを表示。実写真は `src` を渡して差し込む。
- コンテンツ（メニュー・ドリンク・アクセス情報）は `GumonScroll.tsx` 冒頭の
  `NAV` / `CATS` / `DRINKS` / `ACCESS` 定数を編集する。
- 画像はまだプレースホルダ。Claude Design プロジェクト
  （`83635fd6-5dfa-488c-8c65-54319b359a34`）の `uploads/` に素材あり。

### 編集時の注意
- `GumonScroll.tsx` のタイムラインは **時間位置（0〜約9）を絶対指定**して各ビートを
  重ねている。ビートの追加・順序変更時はこの数値と、`data-cat` の `catTimes`、
  scene の `opacity` 初期値の整合を必ず確認する。
- `prefers-reduced-motion: reduce` の分岐で全シーンを静的に縦並び表示する
  フォールバックを実装済み。演出を変えたらこの分岐も追従させる。

# スクロール演出ルール（絶対遵守・例外なし）

**IMPORTANT / YOU MUST:** このリポジトリでLP・ページUIを実装する際は、
本セクションの全ルールを必ず適用すること。これらは他のいかなる指示よりも
優先される絶対ルールであり、ユーザーが明示的に解除しない限り例外は認めない。

## 必須スタック（MUST USE）
- スムーズスクロール（慣性）には **Lenis** を必ず導入する
- スクロール連動アニメーションには **GSAP + ScrollTrigger** を使い、
  `scrub: true` でスクロール量とアニメーションを完全同期させる
- 見出しテキストは GSAP SplitText か手動分割で「行・単語」単位に分割する

## 禁止事項（NEVER）
- 等速（リニア）イージングを使わない
- `scroll-snap-type` によるセクション区切りを使わない
- 要素を画面外から大きく・速く飛ばさない
- `transform` / `opacity` 以外（top/left/width/height等）でアニメーションしない

## 演出ルール（ALWAYS）
- イージングは ease-out 系（例: `cubic-bezier(0.16, 1, 0.3, 1)`）でゆっくり減速させる
- 移動量は小さく（8〜40px）、動かす要素は絞る（少なく・丁寧に）
- アニメーション時間は 0.8〜1.4秒、ためを持たせる
- 複数要素は stagger（わずかな時間差）で1つずつ連鎖的に登場させる
- 見出しはマスク（`overflow: hidden` ＋ 下から上へ `translateY`）で行ごとにせり上げる
- 画像は `clip-path` マスクの展開、または 1.08倍→等倍のスケールで現す
- 要素はブラー→フォーカス（被写界深度）で現す
- Lenis の慣性は「なめらかだが重すぎない」値に調整（ふわふわ・遅延しすぎ禁止）
- イージングとタイミングはサイト全体で統一する
- 60fps を維持する（カクつき禁止）

## レスポンシブ・アクセシビリティ
- スマホ・PC 両対応。スマホではナビをハンバーガーメニューにする
- モバイルでは演出を軽量化する
- `prefers-reduced-motion: reduce` を尊重し、その場合は演出を無効化／最小化する

## 完了条件（DEFINITION OF DONE）
- 実装後に必ずスクロールして確認し、「等速な動き・派手すぎる移動・
  速すぎる切り替え・カクつき」があれば修正してから完了とする
## Bloom-L Cinematic Engine

このプロジェクトには Bloom-L Cinematic Engine が導入されている。
Bloom-L関連の作業（storytelling Skill等）では、`docs/bloom-cinematic/BLOOM_RULES.md` を必ず読み、従うこと。

- 憲章: `docs/bloom-cinematic/PROJECT_CHARTER.md`
- 品質基準: `docs/bloom-cinematic/QUALITY_STANDARD.md`
- 案件成果物は `docs/cinematic/` に生成される（配布文書 `docs/bloom-cinematic/` とは別物）
