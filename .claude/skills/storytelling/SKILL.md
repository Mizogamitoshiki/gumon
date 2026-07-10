---
name: storytelling
description: 既存または新規のWebサイトを、ブランド固有のスクロールテリング体験へ段階的に変換するBloom-Lの制作ワークフロー。プロジェクト解析 → 情報ギャップ検出 → 必要時のみCreative Interview → Creative Brief → 感情曲線・Story・Scene・Transition・Scroll Rhythm・Motion設計 → 変換計画の提示と承認 → 代表Scene実装とCreative Review → 段階実装 → Technical QA → Creative QA → 報告、の順で実行する。サイト全体をスクロール体験として設計・改善したいとき、Story・Scene・Rhythm・Motionを統合して設計したいとき、ブランド理解から実装・QAまで段階的に進めたいときに使用する。単純なテキスト修正、軽微なCSS修正、1要素だけのアニメーション追加、バグ修正のみの依頼には使用しない。
---

# storytelling — Bloom-L Cinematic Engine 制作ワークフロー

既存サイトへ派手なアニメーションを追加するSkillではない。既存または新規のサイトを、クライアント独自のブランド体験へ**段階的に**変換する制作ワークフローである。

## 起動時の動作（Runtime）

起動したら、最初に次を実行する。詳細は [references/runtime.md](references/runtime.md)。

1. 対象プロジェクトを特定し、`docs/cinematic/state.md`（状態ファイル）を探す
2. **state.mdなし** → 新規案件。上位文書1〜3を読み、Stage 0から開始。Stage 0完了時にstate.mdを生成する
3. **state.mdあり** → 再開。整合性検査のうえ、記録された現在Stageから続行する。「承認待ち/質問待ち」で止まっていた場合は保留中の依頼をそのまま再提示する
4. **Context最適化**: `workflow.md`や全referenceを毎回読まない。下のワークフロー表から**現在のStageのreferenceだけ**を読む。creative 3文書は各referenceが指す章のみ読む。完了済みStageの内容は、referenceではなく成果物を読んで思い出す
5. **不変条件**: 質問・承認依頼・報告でターンを終える前に、必ずstate.mdを更新する

## 使用する状況

- 既存サイトをスクロールテリング型の体験へ改善したい
- 新規サイトにブランド固有のスクロール体験を設計したい
- Story・Scene・Transition・Scroll Rhythm・Motionを統合して設計したい
- Heroだけでなくページ全体を体験として設計したい
- ブランド理解から実装・QAまで段階的に進めたい

## 使用しない状況

以下の場合は本Skillを全面実行せず、通常の作業として対応する（必要なら一部Stageの部分適用を提案する — [references/workflow.md](references/workflow.md)「部分適用」）。

- 単純なテキスト修正・軽微なCSS修正・1要素だけのアニメーション追加・バグ修正のみ
- 対象プロジェクトがWebサイトではない
- ユーザーが既存デザイン・構成を一切変更したくない
- ブランド情報がなく、ユーザーも回答できない（→ 停止して必要情報を報告）
- 明示的な承認なしで全面改修を求められていると解釈しなければ進めない場合（→ 解釈で進めず確認する）

## 上位文書

本Skillは以下の上位文書に従属する。**探索順: ① `docs/bloom-cinematic/`（導入先の標準配置） ② `docs/`（Engineリポジトリでの開発時）**。本Skill内で `docs/PROJECT_CHARTER.md` や `docs/creative/…` と表記されたパスは、導入先では `docs/bloom-cinematic/` 配下の同名ファイルを指す。**1〜3が見つからなければ停止する。**

1. `PROJECT_CHARTER.md` — 最上位原則・意思決定原則（12章）。**起動時に必読**
2. `QUALITY_STANDARD.md` — 全合否基準（Blocker/Major/Minor）。**起動時に必読**
3. `BLOOM_RULES.md`（導入先）または Engineリポジトリの `CLAUDE.md` — 運用ルール。**起動時に必読**
4. `creative/CREATIVE_DIRECTOR_ENGINE.md` — 思考OS（判断・レビューの方法）
5. `creative/KNOWLEDGE_SYSTEM.md` — 知識と判断ルール
6. `creative/CREATIVE_METHODOLOGY.md` — 工程の方法論

4〜6は全文を読まず、現在のStageのreferenceが「正」として指す章だけを読む（[references/runtime.md](references/runtime.md) 2章のルーティング表）。
導入先プロジェクト自身の`CLAUDE.md`・規約があれば併せて読み、Bloom-L文書と矛盾して作業結果に影響する場合は、優先順位を勝手に決めず停止して報告する。

本Skillは工程の**実行装置**であり、判断基準を再定義しない。矛盾を発見したら停止して報告する。

## 原則の実行ルール（上位文書 → 本Skillでの具体化）

| 原則 | 本Skillでの実行ルール |
| --- | --- |
| Brand Before Design | Stage 4（Creative Brief）完了前に、配色・レイアウト・Motionを確定しない |
| Emotion First Design | 感情曲線（Stage 5）を、Story・Sceneより先に設計する |
| Story Before Motion | Motion設計はStage 7。Stage 5〜6より前に行わない。実装中の思いつきMotion追加は禁止（表にないMotionは実装しない） |
| Motion Has Meaning | 全主要MotionにMotion一覧表で目的・採用理由・削除条件を記録する。理由が書けない行は削除する |
| Curiosity-Driven Scroll | 全Sceneにフックを設計する。同一フック手法の連続≤2 |
| Scroll Rhythm | Rhythm Scoreを作成し、高強度連続≤2・低強度≥20%目安・インパクト直後の受け止めを検査する |
| Trust Before Action | CTA前に信頼要素Scene≥2。CTAは物語の結末に置く |
| Originality | 参考サイトの特徴的表現をコピーしない。参考希望は性質へ翻訳する（[references/creative-interview.md](references/creative-interview.md)）。量産感チェックをQAで必ず実施する |
| Restraint | 削除テストを実施し、「無い方が良い/変わらない」Motionを削除する。迷ったら減らす |
| Quality Over Speed | 代表Sceneを先に高品質に仕上げ、人間のCreative Review合格後にのみ全面実装へ広げる |

## 実行ワークフロー

全Stageの進行条件・詳細は [references/workflow.md](references/workflow.md)。各Stageの手順は個別referenceへ。

| Stage | 内容 | 詳細 |
| --- | --- | --- |
| 0 | Preflight（上位文書・対象特定・Git状態・ビルド方法・範囲確認） | [workflow.md](references/workflow.md) |
| 1 | Project Analysis（技術・構成・資産・体験・リスクの観察） | [project-analysis.md](references/project-analysis.md) |
| 2 | Information Gap Analysis（質問すべき[未確認]の絞り込み） | [creative-interview.md](references/creative-interview.md) |
| 3 | Creative Interview（**情報不足時のみ**。仮説検証型・7問以下目安） | 同上 |
| 4 | Creative Brief（ブランドの本質・体験ゴール・コンセプト） | [creative-brief.md](references/creative-brief.md) |
| 5 | Emotion・Story・Scene設計 | [emotion-story-scene.md](references/emotion-story-scene.md) |
| 6 | Transition・Scroll Rhythm設計（モバイル再設計含む） | [scroll-rhythm.md](references/scroll-rhythm.md) |
| 7 | Motion Direction（一覧表・トークン・技術選定。設計のみ） | [motion-direction.md](references/motion-direction.md) |
| 8 | Transformation Plan（変換計画をユーザーへ提示） | [implementation-gates.md](references/implementation-gates.md) |
| 9 | **Approval Gate（G1: 人間承認。承認範囲を記録）** | 同上 |
| 10 | **Representative Scene（実装 → G2: 人間のCreative Review）** | 同上 |
| 11 | Incremental Implementation（承認範囲を1Sceneずつ） | 同上 |
| 12 | Technical QA | [qa-protocol.md](references/qa-protocol.md) |
| 13 | Creative QA（判定材料の整理。最終合否は人間） | 同上 |
| 14 | Completion Report | 同上 |

## 承認ゲート

- **G1（Stage 9）**: 承認前に禁止 — 大規模構造変更・依存パッケージ追加/導入・コンテンツ削除・全面リデザイン・GSAP/Lenis等のインストール・複数Sceneの一括実装・既存資産の置換。承認は範囲として文字で記録し、**曖昧な承認を全面実装の承認として扱わない**
- **G2（Stage 10）**: 代表Sceneが人間のCreative Reviewに合格するまで全面実装へ進まない
- **G3（Stage 14）**: 納品可否は人間が判定する。Claudeは判定材料を整理する

## 停止条件

検出したら作業を停止し、**問題・影響・選択肢・推奨案**を報告する。全リストは [references/workflow.md](references/workflow.md)。主要なもの: 上位文書の矛盾／対象不明／ビルド方法不明のまま実装へ／未コミット変更との衝突リスク／ブランド情報不足で設計根拠が作れない／承認が必要な段階への到達／ライセンス懸念／全面リプレイスが必要と判断／模倣要求／検証不能な品質確認／Blockerを満たせない制約。

## 成果物

対象プロジェクトの `docs/cinematic/`（既存のドキュメント規則があればそちらを優先）に保存する。様式は `templates/` を出発点とする。

| 成果物 | template |
| --- | --- |
| state.md（実行状態。唯一の正） | [templates/state-template.md](templates/state-template.md) |
| project-analysis.md | [templates/project-analysis-template.md](templates/project-analysis-template.md) |
| creative-brief.md | [templates/creative-brief-template.md](templates/creative-brief-template.md) |
| experience-plan.md | [templates/experience-plan-template.md](templates/experience-plan-template.md) |
| implementation-plan.md | [templates/implementation-plan-template.md](templates/implementation-plan-template.md) |
| qa-report.md | [templates/qa-report-template.md](templates/qa-report-template.md) |

## セッションをまたぐ再開

`state.md` が案件状態の唯一の正。再開時は整合性検査（成果物の存在・承認記録・コード差分）を行い、現在Stageから続行する。**承認記録は毎回読み直し、承認範囲外の作業をしない**。手順は [references/runtime.md](references/runtime.md) 4章。

## 品質基準と完了条件

- 合否はすべて `docs/QUALITY_STANDARD.md` に従う。「動く」ことは完了ではない。パフォーマンスは「ラボ計測・フィールド未計測」を区別して報告する
- 実行環境がない検証を実施済みとして扱わない。未検証は未検証と報告する
- 本Skillの1回の実行の完了 = Stage 14の報告まで完了し、全成果物が保存され、人間による確認が必要な項目が明示されていること
