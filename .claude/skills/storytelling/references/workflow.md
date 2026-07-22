# workflow — storytelling Skillの実行仕様

全Stageの実行順序・進行条件・再開手順を定める。個別Stageの詳細手順は各referenceへ。

## Stage一覧と対応関係

| Stage | 名称 | 詳細reference | 成果物（template） | ゲート |
| --- | --- | --- | --- | --- |
| 0 | Preflight | 本ファイル | — | 停止条件の確認 |
| 1 | Project Analysis | project-analysis.md | project-analysis-template.md | |
| 2 | Information Gap Analysis | creative-interview.md | （analysisの8章に記録） | |
| 3 | Creative Interview | creative-interview.md | 回答の原文記録 | |
| 4 | Creative Brief | creative-brief.md | creative-brief-template.md | |
| 5 | Emotion・Story・Scene | emotion-story-scene.md | experience-plan-template.md 1〜4章 | |
| 6 | Transition・Scroll Rhythm | scroll-rhythm.md | 同 5〜7章 | |
| 7 | Motion Direction | motion-direction.md | 同 8〜9章 | |
| 8 | Transformation Plan | implementation-gates.md | implementation-plan-template.md 1章 | |
| 9 | Approval Gate | implementation-gates.md | 同 2章 | **G1: 人間承認** |
| 10 | Representative Scene | implementation-gates.md | 同 3章 | **G2: 人間判定** |
| 11 | Incremental Implementation | implementation-gates.md | 同 4章 | |
| 12 | Technical QA | qa-protocol.md | qa-report-template.md 1章 | |
| 13 | Creative QA | qa-protocol.md | 同 2〜3章 | |
| 14 | Completion Report | qa-protocol.md | 同 4章＋報告 | **G3: 人間の納品判定材料** |

**順序の絶対規則**: Stage 4完了前に配色・レイアウト・Motionを確定しない（Brand Before Design）。Stage 5→6→7の順を逆行しない（Story Before Motion）。ゲートを飛ばさない。

## Stage 0: Preflight

1. **上位文書を読む** — 探索順: ①`docs/bloom-cinematic/`（導入先） ②`docs/`（Engineリポジトリ）。必読3文書 = `PROJECT_CHARTER.md`・`QUALITY_STANDARD.md`・`BLOOM_RULES.md`（Engineでは`CLAUDE.md`）。creative 3文書（CREATIVE_DIRECTOR_ENGINE / KNOWLEDGE_SYSTEM / CREATIVE_METHODOLOGY）は同じ場所の`creative/`配下。パスが異なる場合は`docs/`配下を探索する。**見つからない場合は停止**（本Skillは上位文書なしで実行できない）。導入先自身の`CLAUDE.md`があれば併読し、矛盾が作業に影響するなら停止して報告する
2. **対象プロジェクトを特定する** — 対象が曖昧なら質問する。特定できなければ停止
3. **Git状態を確認する** — `git status`。未コミット変更がある場合、**破棄・上書きせず**、扱い（コミット/スタッシュ/そのまま設計のみ進行）をユーザーに確認する。Gitがない場合はバックアップ方法を確認してから実装Stageに入る
4. **実行・ビルド・テスト方法を確認する** — package.json等から特定。実装Stage開始までに不明なら停止して質問
5. **作業範囲と禁止事項を確認する** — 依頼の範囲、変更してはいけないもの、対象プロジェクト自身のCLAUDE.md・規約
6. **依頼の粒度を判定する** — SKILL.mdの「使用しない状況」に該当すれば、全面実行せずその旨を伝えて通常作業へ切り替える。一部Stageのみが適切なら部分適用を提案する

## 中間成果物の保存場所

- 推奨: 対象プロジェクトの `docs/cinematic/` に `state.md`（実行状態 — [runtime.md](runtime.md) 3章）と `project-analysis.md` / `creative-brief.md` / `experience-plan.md` / `implementation-plan.md` / `qa-report.md`
- 対象プロジェクトに既存のドキュメント配置規則があればそれに従う。Stage 1完了時に保存場所を決めて記録する
- 各成果物の様式は `templates/` を出発点にする。項目の追加は自由。**根拠欄・確からしさラベル・チェック項目の削除は不可**

## セッションをまたぐ再開

再開・状態管理・整合性検査は [runtime.md](runtime.md)（3〜4章）に従う。`state.md`が案件状態の唯一の正であり、成果物のステータスヘッダは補助である。

## バックトラック規則

下流の問題は一段上流で直す。差し戻し時は該当成果物のステータスを戻し、影響する下流成果物に「要再検証」と記す。

| 兆候 | 戻り先 |
| --- | --- |
| Motionが決まらない / 理由が書けない | Stage 5（Sceneの目的） |
| Sceneが削れない・多すぎる | Stage 5（Storyの多重化） |
| Storyが凡庸・どの店でも成立 | Stage 4（体験ゴール・Brief） |
| 何を作っても既視感がある | Stage 4（Brand Essenceが一般論） |
| 代表Scene不合格 | 実装(10)ではなくStage 4〜6を先に疑う |

## 停止条件（全Stage共通）

以下を検出したら作業を停止し、**問題・影響・選択肢・推奨案**を報告する。

1. 上位文書同士の重大な矛盾（機械的に上位を適用しない）
2. 対象プロジェクトを特定できない
3. ビルド・実行方法が不明のまま実装Stageへ入ろうとしている
4. 未コミット変更との衝突リスクが高い
5. ブランド情報が不足し、ユーザーも回答できず、設計根拠を作れない
6. ユーザー承認が必要な段階（G1・G2・G3、依存追加、リプレイス提案）に到達した
7. 素材・フォント・コードのライセンス上の懸念
8. 既存構造の全面リプレイスが必要と判断した（提案し、承認を待つ）
9. 要求された参考表現が模倣に該当する可能性が高い（creative-interview.md「参考サイト希望の翻訳」で解決を試みてから）
10. 利用可能なツール・権限では要求された検証ができない（できない検証を実施済みとして扱わない）
11. 品質基準（QUALITY_STANDARD）のBlockerを満たせない重大な制約がある

## 部分適用

依頼が全ワークフローを要さない場合（例: 既に設計済みでQAだけ欲しい、Briefだけ作りたい）、該当Stageのみを実行してよい。ただし: 実装系Stage（10以降）だけの単独実行は、Stage 8〜9相当の承認記録が存在する場合のみ可。設計成果物なしの実装は本Skillでは行わない。
