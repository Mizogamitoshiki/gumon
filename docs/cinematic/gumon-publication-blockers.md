# 愚問（GUMON）公開前Blocker一覧

作成: 2026-07-11（Finalization Sprint Stage G） ／ これ以前の各Phase・Stageで確認済みの未確定事項を集約したもの。**コードで推測して解消してはならない項目**。

## 1. 実URL（サイト共通）

| # | 項目 | 現状 | ソース |
| --- | --- | --- | --- |
| 1 | ホットペッパーグルメの店舗ページURL | `src/lib/site.ts`が`https://www.hotpepper.jp/`（トップページ）を仮設定・TODOコメントあり | site.ts:17／qa-report.md 5章／sitewide-rollout-plan.md 5章 |
| 2 | Instagram公式アカウントURL | `src/lib/site.ts`が`https://www.instagram.com/`（トップページ）を仮設定・TODOコメントあり | site.ts:16／同上 |
| 3 | 本番ドメイン（NEXT_PUBLIC_SITE_URL） | 未設定時は`https://gumon-hp.vercel.app`にフォールバック（canonical/OGURL/JSON-LDに影響） | site.ts:6-7 |

## 2. 実価格・メニュー原本照合

| # | 項目 | 現状 | ソース |
| --- | --- | --- | --- |
| 4 | 夜3品以外の実価格 | 判明済みは酢豚・小籠包・海老マヨ/チリの3品のみ（gumon.owst.jp 2026-07-03取得）。麻婆豆腐・青菜等は「価格は店舗へ」表示を維持 | menu.ts冒頭コメント |
| 5 | ランチ4品の実価格・品揃え | オーナーのメニュー原本待ち。現状価格は未照合のまま表示 | lunch-transformation-plan.md 6章 |
| 6 | 飲み物4品の実価格 | 全品「価格は店舗へ」表示（プレースホルダではなく方針として維持） | menu.ts DRINKS |
| 7 | コースの人数条件・飲み放題内容・個室有無・記念日対応 | 「ご予算に応じて」「ご相談ください」を仕様として維持。事実を捏造せず非表示のまま設計 | course-transformation-plan.md 11章 |

## 3. 素材・写真

| # | 項目 | 現状 | ソース |
| --- | --- | --- | --- |
| 8 | 写真・動画の素材一次出所（撮影者/購入元）の最終確認 | 利用可否はG1で確認済みだが、一次出所の記録は未完了 | qa-report.md 5章 |
| 9 | ランチ・コース・飲み物の実写真 | 現状0枚。入手時はDishShowcase（Plan B）流用を別途提案 | lunch-transformation-plan.md／course-transformation-plan.md／drink-transformation-plan.md |
| 10 | 宴会風景・貸切時の店内・大皿の実写 | あれば尚可。必須ではない | course-transformation-plan.md 10章 |

## 4. 店舗運用情報

| # | 項目 | 現状 | ソース |
| --- | --- | --- | --- |
| 11 | 駐車場の有無・場所 | Accessページで「お電話にてご確認ください」に統一 | sitewide-rollout-plan.md 5章／access/page.tsx |
| 12 | 支払い方法 | Contactページで「お電話にてご確認ください」に統一 | sitewide-rollout-plan.md 5章／contact/page.tsx FAQ |
| 13 | 採用の募集条件（給与・雇用形態・勤務時間） | Recruitページで「お電話にてご確認ください」に統一。事実断定なし | recruit/page.tsx |

## 5. アクセシビリティ・技術的な既知事項（記録のみ・広範囲改修が必要なため今回は見送り）

| # | 項目 | 内容 | 影響範囲 | ソース |
| --- | --- | --- | --- | --- |
| 14 | Tab-onlyキーボードナビゲーションでのscroll-reveal未到達 | ページ上部から一度もスクロールせずTabキーのみで辿ると、scrollTrigger未発火要素(`visibility:hidden`)がTab順序から一時的に外れる | サイト全体のGSAP scroll-reveal機構（TOP/Dinner/Lunch/Course/Drink/About/Access/Contact/Recruit）。reduced-motion利用者・通常スクロール利用では無影響 | access-contact-qa-report.md 3章 |
| 15 | `.mask`見出しラッパーの1pxサブピクセル横スクロール | InfoSection/MenuHero等の見出しマスクで発生。視覚上の実害は皆無 | about/access/contact/recruit（未変更ページでも再現する既存特性） | about-implementation-report.md／crossroute-qa-report.md |

## 6. 実施済み・未検証の確認範囲

| # | 項目 | 状態 |
| --- | --- | --- |
| 16 | Safari/iOS実機・Firefox/Edge通し確認 | 未実施（環境なし。全Phase共通の未検証項目） |
| 17 | CPU4xスロットリング下のスクロール実用性 | Phase 12でdevtoolsラボのみ実測。実機未実施 |
| 18 | 第三者テスト（制作関与者以外） | 未実施報告のまま未確認 |
| 19 | フィールドCore Web Vitals（公開後） | 未計測。ラボ値のみ（LCP 1.8〜2.1s・CLS 0） |

## 7. 公開判定について

上記1〜13は「事実確認・素材待ち」であり、コードの品質・演出設計とは独立した公開許可事項である。14〜19は技術的既知事項として記録し、将来の改善候補とする。**本Sprintの完了（実装完了）は、公開許可を意味しない。** 公開の可否は人間（Bloom-L代表・クライアント）が判断する。
