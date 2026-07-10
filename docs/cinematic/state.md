# storytelling 実行状態 — 愚問（GUMON）シネマティック変換

<!-- このファイルが案件状態の唯一の正。停止する前に必ず更新する（runtime.md 3章） -->

## 案件

- 案件名: 愚問（GUMON）LP シネマティック・スクロールテリング変換（Bloom-L v1 検証案件 / Phase 6）
- 対象プロジェクトのパス: /Users/mizokamimirai/Desktop/mizogamitoshiki/gumon-hp
- 案件タイプ: 既存サイト変換
- 成果物の保存場所: docs/cinematic/
- 最終更新: 2026-07-10
- 案件ステータス: 進行中（Stage 10 代表Scene実装）

## 現在地

- 現在のStage: 10 Representative Scene（S4「火の返事」＋S5「受け止めの半拍」）
- 次のアクション（再開時に最初にやること）: 実測ベースライン取得（実ブラウザ通し・動画内容確認・Lighthouse・build/lint）→ S4+S5実装 → 検証 → **コミット前に差分提示・レビュー待ち（G2）で停止**
- 進行中メモ: G1承認記録済み（implementation-plan.md 2章）。実装範囲はS4+S5と、それを成立させる最小限のタイムライン調整のみ。S2/Hero/drink以降の演出改善は禁止

## 実行範囲（今回の依頼で確定）

- **実行するStage: 0〜8のみ。** Stage 8完了後に state.md を「承認待ち」へ更新して停止する。Stage 9以降へ進まない
- 変更してよいファイル: docs/cinematic/ 配下の設計成果物のみ（state.md / project-analysis.md / creative-brief.md / experience-plan.md / implementation-plan.md）
- 禁止: src/ 以下・CSS・コンテンツ・画像動画・package.json・依存・GSAP/ScrollTrigger/Lenis設定・ビルド設定への一切の変更。参考サイトの模倣
- 既存資産（GSAP / ScrollTrigger / Lenis / pin stage / 6ビート構成）は「残す / 変更する / 追加する / 削除候補」に分類し、理由を示す

## Stage状況

<!-- 値: 未着手 / 進行中 / 完了 / スキップ（理由） / 差し戻し（戻り先） / 承認待ち / レビュー待ち -->

| Stage | 状態 | 備考 |
| --- | --- | --- |
| 0 Preflight | 完了 | 上位3文書読了。CLAUDE.mdスクロール演出ルールとBloom-L原則に停止級の矛盾なし。Git clean（feature/bloom-cinematic-storytelling）。Engine/Skill v1.0.0。ビルド: npm run dev/build/lint |
| 1 Project Analysis | 完了 | project-analysis.md 全章記入済み |
| 2 Gap Analysis | 完了 | ギャップ7件を仕分け（analysis 8章） |
| 3 Creative Interview | スキップ（理由: Interview候補G1/G2/G7はいずれも確からしさの高い側で[推定]進行可能。G1はクライアント確定コピーで解決、G2は計画側で吸収、G7は依頼文で代替。Stage 8停止時にまとめて確認） | |
| 4 Creative Brief | 完了 | creative-brief.md（検査記録4項目済み） |
| 5 Emotion・Story・Scene | 完了 | experience-plan.md 1〜4章（チェック項目全て充足） |
| 6 Transition・Rhythm | 完了 | experience-plan.md 5〜7章（チェック項目全て充足） |
| 7 Motion Direction | 完了 | experience-plan.md 8〜9章（理由記録率100%・トークン定義済み） |
| 8 Transformation Plan | 完了 | implementation-plan.md 1章（Hero 3案・代表Scene=S4+S5・23項目網羅） |
| 9 Approval Gate (G1) | 完了 | 2026-07-10 全5項目承認（A1〜A5承認・素材利用確認済み。範囲: implementation-plan.md 2章） |
| 10 Representative Scene (G2) | 進行中 | S4+S5のみ。完了後レビュー待ち（G2）で停止 |
| 11 Incremental Implementation | 未着手 | G2合格まで進まない |
| 12 Technical QA | 未着手 | |
| 13 Creative QA | 未着手 | |
| 14 Completion Report | 未着手 | |

## 承認・レビュー記録（要約とポインタ）

- G1承認: **済**（2026-07-10 / 範囲: Concept・9 Scene・Hero案A・代表Scene=S4+S5・変更ファイル4+docs・依存追加なし・コンテンツ削除なし。A1〜A5承認、A3は映像実確認が条件。素材は利用前提で確認済み。全文: implementation-plan.md 2章）
- G2判定: 未（S4+S5実装・検証後にレビュー依頼予定）

## 保留中の質問・承認依頼

（なし — G1回答受領済み。次の停止はG2レビュー依頼）

## 成果物ポインタ

| 成果物 | 状態 | パス |
| --- | --- | --- |
| project-analysis.md | 完了 | docs/cinematic/project-analysis.md |
| creative-brief.md | 完了 | docs/cinematic/creative-brief.md |
| experience-plan.md | 完了（1〜9章） | docs/cinematic/experience-plan.md |
| implementation-plan.md | 1章 完了（2章以降はG1後） | docs/cinematic/implementation-plan.md |
| qa-report.md | 未作成 | docs/cinematic/qa-report.md |

## セッションログ

- 2026-07-10 / Stage 0 / 新規開始。上位文書読了・Git clean確認・実行範囲をStage 0〜8に限定（ユーザー指示）。既存ブランド資産（project/artifacts/*.json・design-system/gumon/MASTER.md・wdos-diagnosisレポート）の存在を確認 — Stage 1で活用する
- 2026-07-10 / Stage 1〜8 / 全設計成果物を作成。主な判断: ①Interview質問ゼロ（G1格のトーンはクライアント確定コピーで[推定]解決） ②既存6ビート全継承＋新設2 Scene（問いの帳・受け止めの半拍）のみ ③依存追加ゼロ・コンテンツ削除ゼロ ④Hero推奨=案A ⑤代表Scene=S4+S5 ⑥最大リスク=タイムライン時間再配分。G1承認依頼を提示し承認待ちで停止（Stage 9以降・コード変更は未実施）
- 2026-07-10 / Stage 9 / G1承認受領・記録（全5項目承認・A1〜A5承認・素材利用確認）。設計成果物をコミットし、Stage 10（S4+S5実装）へ。実測ベースライン→実装→検証→G2レビュー待ち停止の手順で進行
