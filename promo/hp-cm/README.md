# HP制作CM「こんな豪華なHP、作りませんか？」（愚問 制作事例）

Instagram リール／ストーリーズ向けの縦型 CM（1080×1920・30fps・30秒・音付き）。
愚問サイトの**実画面録画**、**Higgsfield の AI 映像**、**HyperFrames のモーショングラフィックス**を合成している。

- プレビュー: `output/gumon-hp-cm_preview.mp4`
- 構成ソース: `index.template.html`（HyperFrames コンポジション。`/*FONTFACES*/` はビルド時に展開）
- 再現: `build.sh`（素材準備 → レンダリングまで一括）

## 構成（絵コンテ）

| 秒 | シーン | 映像 | テロップ |
|---|---|---|---|
| 0–3 | フック | Higgsfield: 中華鍋の炎 | その店の“熱”は、サイトで伝わっていますか。 |
| 3–6 | 事例紹介 | Higgsfield: 「愚問」看板へのドリー | CASE STUDY ── 中国料理 愚問／一皿の物語を、スクロールで語る。 |
| 6–12.5 | スマホ | 実サイト録画（スマホ枠） | スマホで、映画のように。＋特徴チップ×3 |
| 12.5–15.5 | AI映像 | Higgsfield: 麻婆豆腐の写真から動画化 | 料理写真が、“動く”映像に。 |
| 15.5–21.5 | PC | 実サイト録画（ブラウザ枠・3D傾き） | PCでも、圧倒的な没入感。＋機能6項目 |
| 21.5–24.5 | 情緒 | Higgsfield: 卓上の俯瞰 | “行ってみたい”を、デザインでつくる。 |
| 24.5–30 | エンドカード | — | こんな豪華なHP、作りませんか？／CTA／アカウント |

- 文字はすべて HyperFrames 側で描画している（AI 映像には文字を描かせない）。
- 演出はサイトと同じルール: ease-out（expo.out）・小さな移動量・マスクからのせり上げ・ブラー→フォーカス・stagger。
- インスタの UI に被らないよう、テロップは上 220px／下 380px を避けて配置。
- BGM／効果音は `tools/bgm.py` で numpy 合成した自作音源（著作権フリー）。
  インスタ内の楽曲を使う場合は、アプリ側で音量を下げるか差し替える。

## 社名・アカウントの差し替え

エンドカードの 3 項目はコンポジション変数。再レンダー時に渡す:

```bash
CM_VARS='{"studioName":"株式会社〇〇","handle":"@xxxx","cta":"無料相談はDMから"}' ./build.sh
```

## Higgsfield クリップ

Seedance 2.5（1080p・9:16・5秒）で生成済み。`hf/` に置くと `build.sh` が自動で使う
（無い場合は写真から作った仮素材で代用し、警告を出す）。

| ファイル | 内容 | 入力 |
|---|---|---|
| `hf/flame.mp4` | 中華鍋の炎（text-to-video） | プロンプトのみ |
| `hf/wall.mp4` | 看板へのドリー＋光のスイープ | `public/gumon-wall-mobile.webp` |
| `hf/mapo.mp4` | 麻婆豆腐の湯気・ぐつぐつ | `public/mapo-tofu.webp` |
| `hf/table.mp4` | 卓上の俯瞰回転 | `public/dinner-table.webp` |

## 録画の仕組み

`tools/rec.mjs` は Playwright の仮想時計（`page.clock`）でページの時間を 1/30 秒ずつ進め、
1 フレームずつスクリーンショットを撮る。Lenis／GSAP の慣性とスクラブがコマ落ちなしで記録できる。
Chromium が H.264 を再生できないため、ヒーロー動画は WebM に差し替えて配信している（`tools/*.webm`、git 管理外）。

録画はローカルの本番ビルド（`npx next build && npx next start -p 3100`）に対して行う。
CMS 未接続の環境では `src/lib/*.generated.ts` を用意する必要がある（git 管理外）。
