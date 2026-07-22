# wdos-perf-measurement-001 — CWV初回実測(QG5残課題#8'対応)
日付: 2026-07-11 / 実行者: claude-code(ai-waos framework session) / Framework版: v1.0.0-rc.1

## 計測方法
- 本番ビルド(next build 14/14ページ静的生成)→ next start をローカルで起動
- Lighthouse 13.4.0 / headless Chrome / モバイルエミュレーション+4G相当スロットリング(performance-flow§計測条件に一致)
- 対象: / ・/menu/course ・/contact の3ページ
- 注記: ローカル計測のため実ホスティングのTTFB/CDN効果は未反映。INPはラボ計測不能につきTBTを代理指標とする

## 実測値 vs 予算(performance-flow予算表)
| ページ | LCP(予算≤2.5s) | CLS(≤0.1) | TBT(INP代理・≤200ms) | Perf | A11y |
|---|---|---|---|---|---|
| / | **3.24s 超過** | 0.000 pass | 56ms pass | 93 | 100 |
| /menu/course | **3.47s 超過** | 0.000 pass | 0ms pass | 91 | 100 |
| /contact | **3.01s 超過** | 0.000 pass | 51ms pass | 95 | 100 |

初期転送: First Load JS 158KB(ビルド出力・gzip前)で予算300KB内。総転送(画像込み)はトップ1,035KB(LCP対象はテキストのため画像は遅延読込可の範囲)。

## 根本原因(LCP超過・全ページ共通)
LCP要素はヒーロー見出しテキスト(トップは h1 > span.mask > span「愚問」)。TTFB 20ms+要素描画遅延204msに対し、**mask+rise入場アニメーションがLCP paintを約3秒まで遅延**させている。
これは ban-list **MOT-7「主要素(LCP)への入場アニメ」= 例外なしの絶対禁止** に該当(PRF予算超過の直接原因)。

## 修正方向(削減順序C-6.2-3に従う)
1. LCP要素(各ページのヒーロー見出し)を入場アニメ対象から除外し初期状態で可視にする(MOT-7の唯一の解)
2. rise演出はサブコピー以下の副次要素に限定(モーションの意図は維持できる)
3. 修正後に本計測を同条件で再実行し、LCP≤2.5sを確認してから#8'をclose

## 付随検出(QG7先行情報)
- WCAG 2.5.3(Label in Name)不一致: `/menu/*`・`/contact` の `a.gm-detail-home`(aria-label「トップへ戻る」が視覚テキストを包含しない)。aria-label除去または視覚テキスト包含で解消
- 上記以外のLighthouse A11y監査は全pass(100点)。ただしQG7の4系統トレース(SR/キーボード全操作)は別途必要

## Gate影響
QG5=fail継続(本計測により#8'の「実測未」は解消、**LCP超過という新規fail項目が確定**)。残: #6実メニュー素材・#9実写真・#10運営者表記(オーナー確認)+上記LCP修正。

---

## 追記(同日): MOT-7修正の実施と再実測
- 修正1: GumonScroll.tsx — heroLogo全体への入場フェード(opacity 0→1・1.5s)を廃し、副次行(直下.mask=中国料理/GUMON/キャッチ)のみに限定。h1「愚問」(LCP)は初回描画から可視
- 修正2: MenuHero.tsx — タイトルの「fonts.readyまでautoAlpha:0+文字せり上げ」を廃止し即時描画。入場演出は[data-hero-fade](eyebrow/リード/cue)のみ
- 修正3: app/icon.svg 新設 — favicon.ico 404(全ページ唯一のコンソールエラー)を解消。墨地+ストーン#b9b2a6の「愚」(QG1禁忌の金色不使用)

### 再実測(Lighthouse 13.4.0・実スロットリング=devtools方式・モバイル)
| ページ | LCP(予算≤2.5s) | CLS(≤0.1) | コンソールエラー |
|---|---|---|---|
| / | **2.07s pass** | 0.000 pass | 0件 |
| /menu/course | **1.93s pass** | 0.000 pass | 0件 |
| /contact | **2.01s pass** | 0.000 pass | 0件 |

LCP=FCP一致(入場アニメによる遅延が消滅)。tsc/lint/本番ビルド15ページすべて緑。
計測注記: シミュレート方式(lantern)はローカル環境でLCP推定が不安定(observed 247msに対し5.7s等)だったため、実スロットリング方式の値を正とする。本番ホスティングでのフィールド再確認は#8'の残作業として維持。

### 追記2(同日): WCAG 2.5.3も修正済み
gm-detail-homeのaria-labelを「愚問 中国料理 GUMON トップへ戻る」(可視テキスト包含・先頭配置)へ変更。Lighthouse再監査でlabel-content-name-mismatch=pass(検出0件)・A11yスコア100を確認。

### 残るQG5課題(修正不能=オーナー入力待ち)
#6実メニュー素材・#9実写真・#10運営者表記。
