# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/gumon/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** GUMON（中国料理 愚問）
**Updated:** 2026-07-02（ui-ux-pro-max 生成案を、CLAUDE.md のブランド既定に合わせて補正済み）
**Category:** Restaurant / Fine Dining（1 ページ LP + 料理・飲み物詳細ページ）

---

## Global Rules

### Color Palette（確定ブランド。変更・追加禁止）

| Role | Hex | 用途 |
|------|-----|------|
| Background | `#1c1b19` | マットブラック基調。全ページ共通の地 |
| Background Deep | `#161412` | フッター・額縁・レターボックス等の一段暗い面 |
| Foreground | `#f2f0eb` | アイボリー。本文・見出し |
| Accent (Stone) | `#b9b2a6` | ストーン。中間アクセント・eyebrow・罫線・進捗バー |
| CTA (Vermilion) | `#b23a2e` | **朱。電話予約 CTA のみ**。他の用途は禁止 |
| Hairline | `rgba(242,240,235,0.08〜0.16)` | 罫線・ボーダー |

**Color Notes:** 金色（gold）は不使用。モノクロ + ストーン + 朱（CTA 限定）の 3 系統のみ。
実装では `src/lib/motion-tokens.ts` の `THEME_COLORS` を参照する。

### Typography

- **Heading Font:** Noto Serif JP（CSS 変数 `--font-noto-serif-jp`、next/font/google 供給）
- **Body Font:** Noto Sans JP（CSS 変数 `--font-noto-sans-jp`、weight 300 基調）
- **Mood:** 静謐・余白・問いを残す高級中国料理
- 欧文 eyebrow は sans + `letter-spacing: 0.28em` 前後 + uppercase
- 見出しは serif + `letter-spacing: 0.06〜0.2em`、価格は `tabular-nums`

### Motion（scroll-cinematics 連携）

- **Preset:** `elegant`（`src/lib/motion-tokens.ts` の `GUMON_MOTION`）
- ease: `power3.out` / 強調 `expo.out`。duration 1.0〜1.4s、stagger 0.12
- 移動量は 8〜40px（CLAUDE.md 絶対規定。elegant 既定の 48px より優先）
- scrub 連動は `ease: "none"` + `scrub: 1〜1.5`。Lenis lerp 0.085〜0.09
- 見出しは行/文字マスクのせり上がり、画像は clip-path 展開 or 1.08→等倍
- `prefers-reduced-motion: reduce` では演出を構築しない（静的縦積み）

### Spacing

- セクション余白: `clamp(64px, 10vh, 110px)` 前後。本文カラム幅 `min(680px, 100%)`
- 罫線 1px、角丸はほぼ使わない（0〜4px）。影は使わず暗い面の重なりで奥行きを出す

---

## Component Specs

### CTA（電話予約のみ朱を使用）

実装の唯一の出典は `src/app/globals.css` の `.gm-tel-btn` / `.gm-back-btn`。
**各コンポーネントのインライン style で寸法を再定義してはならない**
（2026-07-25 まで 4 箇所に散在し 14px/13-36px と 15px/15-46px が併存していた）。

```css
.gm-tel-btn {
  background: #b23a2e;
  color: #f2f0eb;
  font-family: var(--font-noto-serif-jp), serif;
  font-size: 15px;
  line-height: 1.2;          /* 外形 48px を決定的に固定 */
  letter-spacing: 0.16em;
  text-indent: 0.16em;       /* 光学的中央（下記ルール） */
  padding: 15px 46px;
  border-radius: 2px;        /* 検索欄・額縁と同じ角 */
}
```

副ボタン `.gm-back-btn` は朱と横に並ぶため **外形 48px を一致**させる
（content 18px + padding 14×2 + border 1×2）。

### 光学的中央（letter-spacing を入れた要素の必須ルール）

`letter-spacing` は最終文字の**後ろにも**余白を作るため、中央揃えだと文字列が
左へズレて見える。**字間を入れたら同量の `text-indent` で必ず打ち消す。**

```css
letter-spacing: 0.28em;
text-indent: 0.28em; /* 必ず同量 */
```

適用済み: `.gm-tel-btn` / `.gm-back-btn` / `.gm-detail-eyebrow` /
`.gm-detail-cta-lead` / `.gm-board-filter`。
※ `inline-flex`（`.gm-detail-link` 等）には `text-indent` が効かないため対象外。

### コントラスト下限（WCAG AA）

地 `#1c1b19` に対し **本文 4.5:1 以上**。アイボリー `#f2f0eb` は
不透明度 **0.55 以上**で 5.40:1 を満たす（0.4 は 3.49:1 で不足）。
プレースホルダも本文扱い。朱ボタン上の白文字は 5.21:1。

### 予約ピル（ヘッダー）: ストーン線 → ホバーでストーン地に反転

```css
border: 1px solid rgba(185, 178, 166, 0.55);
border-radius: 999px;
/* hover: background #b9b2a6 / color #1c1b19 */
```

### 罫線・アクセント

- 見出し脇のティック: `16px × 1px` の `#b9b2a6`
- ドットリーダー: `1px dotted rgba(185,178,166,0.42)`

---

## Style Guidelines

**Style:** Elegant / Luxury（serif 系に丸める。「Vibrant & Block-based」案は不採用）

**Keywords:** 静謐、モノクロ、余白、シネマティック、フィルムグレイン、ビネット

**Key Effects:** Lenis 慣性スクロール、GSAP ScrollTrigger scrub、行マスク text-reveal、
clip-path リビール、レターボックス、視差（±5〜14%）

### Page Pattern

- TOP: pin された 820vh の 6 ビート scrub タイムライン（hero → about → 料理 → 飲み物 → アクセス → 予約）
- 料理詳細: Hero 文字リビール → 横スクロールギャラリー（看板の品）→ お品書き一覧 → 電話 CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ 金色・ゴールド系アクセント（ブランド規定違反）
- ❌ 朱 `#b23a2e` を電話予約 CTA 以外に使う
- ❌ 明るい背景（`#FAFAF9` 等）。全ページ `#1c1b19` 基調
- ❌ 等速イージング（scrub の `ease:"none"` 以外での使用）
- ❌ `scroll-snap-type` によるセクション区切り
- ❌ transform / opacity / clip-path 以外のアニメーション（top/left/width/height 禁止）
- ❌ 絵文字アイコン（SVG を使う）
- ❌ reduced-motion 分岐なしの演出

---

## Pre-Delivery Checklist

- [ ] 配色が上記 3 系統に収まっている（金色なし・朱は CTA のみ）
- [ ] フォントが Noto Serif JP / Noto Sans JP の CSS 変数経由
- [ ] スクロール演出が CLAUDE.md 規定（Lenis + ScrollTrigger scrub、移動量 8〜40px）
- [ ] `prefers-reduced-motion` で静的表示になる
- [ ] 375px / 768px / 1024px / 1440px で崩れない
- [ ] 固定ヘッダー下にコンテンツが隠れない
- [ ] モバイルで横スクロールが発生しない（横流しギャラリーは縦積みに分岐）
