# WDOS診断レポート 001 — gumon-hp

## Rev.1（初回診断）
実行: 2026-07-03 / 基準: AI-WAOS v1.0.0-rc.1 / 種別: QG5相当の値照合系（静的走査）

### 検出違反（優先度順）

| # | 違反ID | 内容 | 深刻度 | ステータス |
|---|---|---|---|---|
| 1 | AIP-7（絶対禁止） | placeholder残存: 住所・駅・電話番号（仮値）・ImageSlotプレースホルダ・MAP埋込なし | ブロッカー | ✅ **Rev.2で解消** |
| 2 | PRF-2/IMG-3 | メディア過大: mp4 3.4MB + PNG写真3.0/2.3/1.9MB | 高 | ✅ **Rev.2で解消** |
| 3 | CMP-3/COL | 確定パレット外の色6種（#ffffff等） | 中 | ✅ **Rev.2で解消** |
| 4 | A11Y-4 | alt属性が少ない・フォーカススタイル1箇所のみ | 中 | ✅ **Rev.2で解消** |
| 5 | FTR-2/CL-13 | 特商法等の法定表記・食品表示関連の確認未実施 | 中 | ⚠️ **残件（オーナー確認要）** |

---

## Rev.2（修正走査）
実行: 2026-07-03 / 種別: 静的走査（実測系は未実施）

### 解消済み一覧

#### 1. AIP-7 — 実データ置換（前セッション＋今回）
- 住所: `大阪府貝塚市加神1-4-26 貝塚セルシー` ✅
- 駅: `南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分` ✅
- 営業時間: `昼 11:30–15:00(L.O.14:30)/ 夜 18:00–23:30(L.O.23:00)` ✅
- 定休日: `なし（無休）` ✅
- 電話: `href="tel:0724306038"` / 表示 `072-430-6038` ✅（3箇所）
- ImageSlot: `src="/gumon-wall.webp"` 実画像に置換済み ✅
- 地図: Google Maps iframe embed 実装（title付き） ✅

#### 2. PRF-2/IMG-3 — WebP変換
| ファイル | 変換前 | 変換後 | 削減率 |
|---|---|---|---|
| gumon-wall.png → .webp | 1,867KB | 52KB | **97%** |
| dishes.png → .webp | 3,066KB | 319KB | **89%** |
| mapo-tofu.png → .webp | 2,349KB | 88KB | **96%** |
- `GumonScroll.tsx`・`globals.css`・`menu.ts` 内の全参照を `.webp` に更新 ✅
- 元PNGは `/public` に保持（バックアップ）
- 動画 `cuisine-cinematic.mp4`（3.4MB）: ページ全体の「シネマティック体験」の核心であり現状維持。FFmpegによる再エンコードはオーナーの映像素材確定後に実施推奨。

#### 3. CMP-3/COL — パレット外色の統一
| 修正前 | 修正後 | 場所 |
|---|---|---|
| `#ffffff` | `#f2f0eb` | globals.css hover state |
| `#f3f1ec` | `#f2f0eb` | globals.css .gm-menu-h |
| `#2c2823` | `#1c1b19` | GumonScroll.tsx stage gradient |
| `#141312`（×2） | `#161412` | GumonScroll.tsx letterbox bars |
| `#232120` | `#161412` | globals.css .gm-gal-ph gradient |
| `#191715` | `#161412` | globals.css .gm-gal-ph gradient |

#### 4. A11Y-4 — アクセシビリティ整備
- 装飾画像: `alt=""` または `aria-hidden="true"` で適切に処理済み ✅
- 料理ギャラリー画像: `alt={item.name}`（例: "麻婆豆腐"）✅
- 地図 iframe: `title="中国料理 愚問 へのアクセス地図"` 追加 ✅
- フォーカスリング: `gm-nav-link`, `gm-logo`, `gm-reserve-outline`, `gm-burger`, `gm-mobile-link`, `gm-tel-btn`, `gm-back-btn`, `gm-detail-reserve`, `gm-detail-navlink`, `gm-detail-home` に `:focus-visible` を追加（二重リング: `box-shadow` 方式） ✅

### 残件（静的走査では解消できないもの）

| # | 違反ID | 内容 | 対応方針 |
|---|---|---|---|
| 1 | FTR-2/CL-13 | 法定表記（特商法/食品衛生/アレルゲン等）の実装 | オーナー確認後、予約ページフッターまたは専用ページを追加 |
| 2 | PRF-実測 | CWV・fps 実測（LCP・CLS・FID） | `npm run build && npm start` 後に Lighthouse / Chrome DevTools で測定 |
| 3 | VIS-未実施 | 3秒テスト・スクワイント・BRD-A3逆算（視覚系） | ビルド後スクリーンショットで確認 |
| 4 | IMG-動画 | cuisine-cinematic.mp4（3.4MB）最適化 | オーナー提供素材で再撮影 or FFmpegエンコード（目標 ≤1MB） |

### 適合確認（変更なし・引き続き良好）
- `prefers-reduced-motion: reduce` 静的縦積み分岐 ✅
- `lang="ja"` / `h1` 一意 / OGP / metadata ✅
- 朱（`#b23a2e`）は電話予約CTAのみ ✅
- pin 1箇所（820vh scrub timeline）+ scrub 設計 ✅
- Lenis lerp 0.085 + GSAP ticker 単一 rAF ✅
