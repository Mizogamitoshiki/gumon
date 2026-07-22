# 全ルート横断QA — 実施記録（Finalization Sprint Stage F）

作成: 2026-07-11 ／ 状態: 完了・コード変更なし（Stage A〜Eで既に修正済み）

対象9ルート: `/` `/about` `/menu/lunch` `/menu/dinner` `/menu/course` `/menu/drink` `/access` `/contact` `/recruit`

## 1. 確認結果サマリー

| 項目 | 結果 |
| --- | --- |
| HTTP 200（全9ルート） | ✅ 全ルート正常応答 |
| SEO metadata（title/description/canonical） | ✅ 全ルートで固有・重複なし。canonical URLは`NEXT_PUBLIC_SITE_URL`依存（本番ドメイン未確定は既知Blocker） |
| 画像alt欠落 | ✅ 全ルートで0件 |
| H1の一意性 | ✅ 各ページ1個のみ（TOP=愚問、各詳細ページ=カテゴリ名） |
| 見出し階層（H1→H2→H3） | ✅ 逆転・スキップなし（About/Access/Contact/Recruitで個別確認済み） |
| 内部リンクのリンク切れ | ✅ 0件（全ルートを機械的にクロールしHEADリクエストで確認） |
| コンソール error/warn | ✅ 全ルートで0件 |
| reduced-motion（隠し要素） | ✅ 全ルートで既知1件のみ（モバイルナビ閉状態。全ページ共通・正常） |
| モバイル390px 横スクロール | ✅ menu系・TOP=0px。about/access/contact/recruit=1px（`.mask`見出しラッパーのサブピクセル丸め。未変更ページでも再現する既存の全ページ共通特性 — About QAで実証済み） |
| variant分岐の混入 | ✅ dinner(gm-stage)/lunch(gm-brisk)/course(gm-consult)/drink(gm-calm)が相互に混入0 |
| 電話CTA常時操作可能性 | ✅ MenuBoard系(quiet/consult/calm/既定・brisk含む全分岐)・InfoSection系(about/access/contact/recruit)ともに演出対象除外を確認済み |
| npm run lint | ✅ 0件 |
| git diff --check | ✅ エラーなし |
| npm run build（本番） | ✅ 成功。全9ページ+robots.txt+sitemap.xml+icon.svg。First Load JS: 87.3kB共通+各ページ141B〜12.9kB（TOPが最大158kB、予算300kB以内） |

## 2. 発見事項の記録（新規コード変更は伴わない）

- **`.mask`サブピクセル1px横スクロール**: About/Access/Contact/Recruitで共通発生。未変更ページ(`/access`)でも再現するため、本スプリントで新規発生した回帰ではなく既存の特性。実害は視覚上皆無（1px）
- **Tab-onlyキーボードナビゲーションでのscroll-reveal未到達領域**: `docs/cinematic/access-contact-qa-report.md` §3に詳細記録。reduced-motion利用者・通常スクロール利用では問題なし。サイト全体のMotion機構に及ぶ大規模改修が必要なためBlockerへ記録（§gumon-publication-blockers.md）
- **`.next`devキャッシュの一時的不整合**（Recruit QA中に発見・`.next`削除で解消・ソースコードは無関係）: `docs/cinematic/recruit-qa-report.md`に記録済み

## 3. ページ遷移・戻る導線

- 各詳細ページ左上「← 愚問」でTOPへ復帰（aria-label「愚問 中国料理 GUMON トップへ戻る」を外部修正で確認・全ページ共通で正常動作）
- ヘッダーナビ・フッターナビから相互遷移可能。パンくず(BreadcrumbJsonLd)は各詳細ページに実装済み

## 4. 未検証事項（サイト共通）

Safari/iOS実機・Firefox/Edge・CPU4xスロットリング・スクリーンリーダー実読み上げ・第三者体感評価
