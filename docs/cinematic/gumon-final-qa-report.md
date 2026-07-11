# 愚問（GUMON）Final QA Report — Site v1

作成: 2026-07-11 ／ QUALITY_STANDARD.md の構成に沿った最終サマリー。各項目の詳細は個別QA記録を参照。

---

## A. Technical QA（QUALITY_STANDARD 22章）

| 最低セット項目 | 結果 | 詳細 |
| --- | --- | --- |
| 自動アクセシビリティチェック | 部分実施（axe等の専用ツールは未実行。alt/見出し階層/lang/コントラストは手動確認済み） | crossroute-qa-report.md |
| Lighthouse（モバイル） | TOPのみdevtoolsラボで実施（Phase 12）。LCP 1.8s・CLS 0 | qa-report.md |
| reduced-motion切替確認 | 全9ルートで実施。隠し要素0（既知1件=モバイルナビ） | crossroute-qa-report.md |
| CPUスロットリング通し確認 | TOPのみ実施（devtoolsラボ）。下層ページ未実施 | qa-report.md／本Sprintの未検証事項 |
| 対象ブラウザ確認 | **未実施**（Chrome系のみで開発・検証。Safari/Firefox/Edge未確認） | 公開前Blocker |
| モバイル実機確認 | **未実施**（390pxはheadless/iframeエミュレーションのみ） | 公開前Blocker |
| CTA動作確認 | 全ページでtel:リンク・href確認済み。電話ボタン常時操作可能性を本Sprintで是正 | 各Stage実装報告 |
| ライセンス確認記録 | フォント（Google Fonts経由）・GSAP/Lenis（既存導入時に確認済み）。素材一次出所は未完了 | gumon-publication-blockers.md #8 |
| コンソールエラー0件 | ✅ 全9ルートで確認 | crossroute-qa-report.md |

## B. Creative QA（QUALITY_STANDARD 21章）

| 項目 | 結果 |
| --- | --- |
| A〜C章の全Blocker判定 | TOP: G3合格（条件付き・qa-report.md 5章）。Dinner/Lunch: 各Phase合格（レビュー記録あり）。Course/Drink/About/Access/Contact/Recruit: 本Sprintで実画面確認・自己QAチェックリスト通過（人間の最終確認は別途必要） |
| 通しスクロールレビュー（PC・モバイル） | 実施（本レポート作成者による。第三者レビューではない） |
| 第三者テスト | **未実施**（全Phase共通の未検証事項） |
| 疲労チェック・量産感チェック | TOPは既存Phase QAで実施済み。下層ページは各ページが「TOPのコピーではない」ことを個別に検証（course-transformation-plan.md 6章／drink-transformation-plan.md 1章／about-copy-review.md） |

## C. ページ別サマリー

| ページ | Story | Motion Has Meaning | Restraint（削除テスト） |
| --- | --- | --- | --- |
| Course | 相談の入口→対応を知る→電話で整える | fade-quiet(8px)のみ・理由記録済み | プレースホルダ2枠削除（情報損失なし判定） |
| Drink | 食事の余韻→一杯を知る→席へ戻る | Courseと同強度を意図的に共有（新規マジックナンバーを作らない判断） | プレースホルダ4枠削除 |
| About | 問いの本文 | 行Revealを静的化（読む区間は演出ゼロ） | PullQuote位置変更でTOP重複を解消（削除ではなく再配置） |
| Access/Contact | 実用最優先 | 演出追加なし。既存のみ | 該当なし（Utility） |
| Recruit | 働く人への入口 | 変更なし（既存が既に適切と判定） | 該当なし |

## D. 本Sprintで発見・修正した実バグ

1. **電話CTAボタンの初期非表示**（MenuBoard既定/brisk分岐・InfoSection全分岐）: スクロールトリガー発火までopacity:0だった。quiet/consult/calmと同じ除外パターンを全分岐に適用
2. **`.gm-info-tel-link`のタップ領域不足**（Access）: 22px→51×109pxへ拡大
3. **`.next`devキャッシュ不整合**（Recruit QA中に発見）: ソースコードの問題ではなく開発環境の問題。`.next`削除で解消・コード変更不要

## E. 総合判定

**Gumon Site v1: 実装完了・公開前Blocker確認待ち。**

「完成」の定義（QUALITY_STANDARD準拠）に対する充足状況:
- ブランド文書・感情設計・Story・Scene構成の存在: ✅（各Phase/Stageの成果物として存在）
- 承認を挟んだ段階的変換: ✅（TOP/Dinner/Lunchは人間承認済み。Course/Drink/About/Access/Contact/Recruitは本Sprint内で実装→自己QA完結、**人間の最終Creative Review待ち**）
- 量産感の排除: ✅（各ページがテンプレート流用でなく役割別に設計されていることをドキュメントで説明可能）
- 公開前Blockerの明示: ✅（gumon-publication-blockers.md）

**「公開可能」とは判定しない。** 人間によるCreative Review・第三者テスト・実機確認、および公開前Blocker（実URL・実価格・素材出所）の解消が必要。
