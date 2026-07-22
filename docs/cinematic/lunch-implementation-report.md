# Lunch Brisk Editorial — 実装レポート（Phase 19A〜19C）

最終更新: 2026-07-11 ／ 状態: **人間レビュー合格・コミット済み**

## 承認・レビューの記録

| ゲート | 日付 | 記録 |
| --- | --- | --- |
| 19A 計画承認 | 2026-07-11 | ユーザー「Phase 19AのTransformation Planを承認します」。範囲: DishGallery除去／brisk分岐追加／Hero・CTA現状維持／新コピーなし。Dinner・TOP・course・drink不変更 |
| 19C 実装合格 | 2026-07-11 | ユーザー「Lunch brisk Editorialは人間レビューで合格しました」 |

## 実装差分（計画 §4 どおり・逸脱なし）

| ファイル | 内容 |
| --- | --- |
| `src/app/menu/lunch/page.tsx` | `brisk` 付与のみ |
| `src/components/menu/MenuDetailPage.tsx` | `brisk` prop 新設: DishGallery 非描画・`.gm-brisk` スコープ・MenuBoard へ伝搬。editorial(dinner)/既定分岐は不変更 |
| `src/components/menu/MenuBoard.tsx` | `brisk` 分岐新設（quiet・既定から独立）: 額縁 y28/scale0.985/0.8s → 頭書き stagger0.07 → 見出し行マスク → 道具 y12 → リボン x-16 → 行 y18/stagger0.045（すべて riseLine）。トリガーは既定と同じ top 78% 帯 |
| `src/app/globals.css` | `.gm-brisk .gm-board { padding-top: clamp(40px, 7vh, 80px) }` のみ追記 |

## Phase 19C 最終確認（コミット前）

| 項目 | 結果 |
| --- | --- |
| `git diff --check` | ✅ whitespace エラーなし |
| `npm run lint` | ✅ 0 件 |
| 変更対象の限定 | ✅ lunch 関連 4 ファイル + docs/cinematic/ のみ |
| Dinner / TOP / course / drink の意図しない差分 | ✅ なし — 共有 2 ファイルの削除行は三分岐化に伴う再配置のみで、既定・quiet の値は逐語で再掲。SSR 実測: dinner gm-stage=6 維持・course/drink gm-gal 構造維持・全ページ gm-brisk 混入 0 |
| Lunch に DishGallery が残っていない | ✅ SSR gm-gal=0 |
| 電話予約 CTA の操作可能性 | ✅ tel リンク存在(gm-tel-btn + tel: href)。モバイル/RM は常時表示(静的)。デスクトップは once トリガーで、途中復帰時も開始位置通過済みなら即時発火して可視化 |

## QA サマリ（19B 実施・DoD 全通過）

build/lint ✅ ／ 非回帰 SSR ✅ ／ 実スクロール(行程短縮・全文可読) ✅ ／
モバイル390実測(pinなし・横はみ出し0) ✅ ／ RM(隠し要素0) ✅ ／
検索「担々」→1件・クリア→4行 ✅ ／ コンソール error/warn 0 ✅

## 残課題（Lunch 公開前・本 Phase の対象外）

- [未確認] ランチ 4 品の実価格・品揃え（メニュー原本待ち — Blocker）
- [未確認] ランチ実写真（入手時は DishShowcase 流用を別途提案）
- [未確認] 昼客層・回転の実態（「速さ」前提はヒアリング未実施の設計仮説）
