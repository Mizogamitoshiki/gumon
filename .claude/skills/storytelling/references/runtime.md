# runtime — storytelling Skillの実行ランタイム

本Skillを状態機械として実行するための仕様。起動・状態管理・再開・承認・質問・成果物生成・報告の動作を定める。

## 1. Runtime Flow — 起動シーケンス

Skillが起動されたら、他の何よりも先に次を実行する。

```
1. 対象プロジェクトのルートを特定する（曖昧なら質問して停止）
2. state.md を探す:
   既定: <対象プロジェクト>/docs/cinematic/state.md
   なければ docs/ 配下を state.md で検索
3. 分岐:
   [state.md なし] → 新規案件。Stage 0 から開始。
       上位文書（PROJECT_CHARTER・QUALITY_STANDARD・BLOOM_RULES または CLAUDE.md。
       探索順: docs/bloom-cinematic/ → docs/）を読む
       → Stage 0 完了時に state.md を生成（templates/state-template.md）
   [state.md あり] → 再開。本ファイル4章の Resume Mechanism へ
4. Stage Router（2章）に従い、現在Stageのreferenceだけを読んで実行する
```

## 2. Stage Router と Context最適化

**規則: 現在のStageに必要なファイルだけを読む。**

- `workflow.md` を毎回全部読まない。読むのは次の場合のみ: 停止条件の全リストが必要／バックトラックの戻り先判断／部分適用の判断
- 先のStageのreference・templateを先読みしない
- 上位文書の扱い:
  - `CLAUDE.md`・`docs/PROJECT_CHARTER.md`・`docs/QUALITY_STANDARD.md` — 起動時に必読（新規・再開とも）
  - creative 3文書（CDE / KNOWLEDGE_SYSTEM / METHODOLOGY） — 全文を読まず、**現在Stageのreferenceが「正」として指す章だけ**を読む
- 完了済みStageの詳細を思い出す必要があるときは、referenceではなく**成果物**（Brief等）を読む。成果物が設計判断の記録であり、referenceは手順書である

### ルーティング表（Stage → 読むもの → 書くもの）

| Stage | 読む reference | 読む上位文書の章 | 書く成果物 |
| --- | --- | --- | --- |
| 0 | workflow.md（Stage 0節のみ） | 上位3文書 | state.md 生成 |
| 1 | project-analysis.md | — | project-analysis.md |
| 2〜3 | creative-interview.md | METHODOLOGY 2.2 | analysis 8章更新・回答原文 |
| 4 | creative-brief.md | CDE 3章 | creative-brief.md |
| 5 | emotion-story-scene.md | METHODOLOGY 4〜6章・KS 2章 | experience-plan.md 1〜4章 |
| 6 | scroll-rhythm.md | CDE 7章 | 同 5〜7章 |
| 7 | motion-direction.md | CDE 6章・KS 5章 | 同 8〜9章 |
| 8〜9 | implementation-gates.md | — | implementation-plan.md 1〜2章 |
| 10〜11 | implementation-gates.md | QS 19章 | 同 3〜4章 |
| 12〜14 | qa-protocol.md | QS 21〜22章 | qa-report.md |

## 3. State Management — state.md仕様

`state.md` が案件状態の**唯一の正**である。各成果物のステータスヘッダは補助表示であり、食い違ったらstate.mdを信じて成果物側を直す。

- 様式: `templates/state-template.md`
- Stageステータスの値: `未着手` / `進行中` / `完了` / `スキップ（理由必須）` / `差し戻し（戻り先Stage必須）` / `承認待ち` / `レビュー待ち`
- **更新タイミング（不変条件: 停止する前に必ずstate.mdを書く）**:
  1. Stage遷移時（完了・スキップ・差し戻し）
  2. ユーザーへ質問・承認依頼を出す**直前**（「承認待ち」「質問待ち＋質問一覧」を書いてから停止する）
  3. 長いStage（1・5・8・11）の節目（成果物の章単位の保存時）に「進行中メモ」を更新
  4. 承認・回答を受領した直後（内容を記録してから作業を再開する）
- state.mdには要約とポインタだけを書く。設計内容の本文は各成果物に書く（重複させない）

## 4. Resume Mechanism — 再開と整合性検査

state.mdが見つかったら、作業再開の前に**整合性検査**を行う。

| 検査 | 不整合時の動作 |
| --- | --- |
| stateが「完了」と主張するStageの成果物が存在するか | 成果物ヘッダから状態を再構築し、差分を報告してから続行 |
| Stage 10以降なのに承認記録（implementation-plan 2章）があるか | **停止**。承認なしの実装状態は重大事故として報告 |
| 承認範囲と実装済み内容が一致するか | 範囲外の実装を検出したら停止して報告 |
| 前セッション以降にコードが変わっていないか（git log/status） | 差分を要約して報告してから続行 |
| 「承認待ち」「質問待ち」で止まっていたか | 保留中の質問・承認依頼を**そのまま再提示**する（作り直さない） |

検査通過後: 現在Stageのreferenceだけを読み、進行中メモの続きから再開する。完了済みStageはやり直さない。ユーザーが完了済みStageの変更を求めた場合はバックトラック（workflow.md）として扱い、影響する下流成果物に「要再検証」を記録する。

state.mdなしで成果物だけがある場合（旧形式・破損）: 成果物のステータスヘッダからstate.mdを再構築し、再構築した旨を報告してから進む。

## 5. Approval Gate Runtime — G1・G2の動作

```
1. 提示物を組み立てる（8章 Report Generatorの様式）。不利な材料を先に
2. state.md を「承認待ち」＋提示内容の要約に更新する
3. 承認を依頼して**ターンを終了する**（承認を待たずに次の作業を始めない）
4. 回答受領:
   [明確な承認] → 範囲を implementation-plan 2章に文字で固定し、
                  state.md に承認要約を記録 → 次Stageへ
   [曖昧（「いいね」「進めて」等）] → 範囲を具体的に確認する質問を1回返す。
                  範囲が確定するまで実装Stageへ進まない
   [部分承認] → 承認された範囲だけを記録し、承認外を「承認されていない事項」へ
   [差し戻し] → 指摘を該当Stageへ翻訳し、差し戻しとしてstate.mdに記録 → 戻る
5. G2（代表Sceneレビュー）も同じ手順。「レビュー待ち」ステータスを使う
```

承認記録は削除・改変しない。追加の承認は履歴として追記する。

## 6. Question Strategy — 質問の実行規則

- **質問してよい地点**: Stage 0（対象・未コミット変更・範囲）／Stage 3（Interview）／G1・G2・G3／停止条件に該当したとき。それ以外の疑問は、まず解析・成果物・上位文書で自己解決を試みる
- **ブロッキング判定**:
  - 答えがないと次の作業が間違いになる（対象特定・未コミット変更の扱い・承認範囲・ブランドの核） → 質問して**停止**
  - 答えがなくても確からしさの高い側で進められる → `[推定]`ラベル＋Assumptionsに記録して**進み**、次の停止地点でまとめて確認
- 質問はまとめて出す（一度に7問以下・重要度順・答えやすい順）。1問ずつ小出しにしない
- 停止する前にstate.mdへ質問一覧を書く（3章の不変条件）。回答は**原文のまま**成果物へ記録し、同じ質問を二度としない
- Interview固有の規則（仮説検証型・再質問禁止・参考サイト翻訳）は creative-interview.md に従う

## 7. Document Generator — 成果物の生成規則

```
1. 保存場所の決定（Stage 1で一度だけ）:
   既定 = <対象プロジェクト>/docs/cinematic/
   対象プロジェクトに既存のドキュメント規則があればそれを優先し、
   決定した場所を state.md に記録する（以降この記録が正）。
   既定以外に決めた場合、Stage 0で既定場所に生成した state.md も
   新しい場所へ移動し、旧ファイルを残さない
2. 生成: templates/ の該当テンプレートを骨格としてコピーし、埋める。
   ディレクトリがなければ作成する
3. 更新: 既存ファイルがあれば上書き再生成せず、該当章だけを編集する。
   ステータスヘッダを毎回更新する
4. 検査: 保存前に、テンプレート由来の必須要素（根拠欄・確からしさラベル・
   チェックボックス）が残っているか確認する。プレースホルダ（{案件名}等）を残さない
5. 保存したら state.md の成果物ポインタと進行中メモを更新する
```

対象プロジェクトのソースコードには、Stage 10より前にいかなる変更も加えない。

## 8. Report Generator — 提示と報告の組み立て

**原則: 報告は記憶からではなく成果物から組み立てる。** 報告作成時は該当成果物を読み直し、要約する。

- **G1提示（Transformation Plan）**: implementation-plan 1章の順で提示。冒頭に①Assumptions（推定で進めた点）②Open Questions ③リスク ④実施できないQA、を置いてから計画本体を示す。末尾に「承認していただきたい範囲」を箇条書きで明示する
- **G2提示（代表Scene）**: 確認9項目（implementation-gates.md）の結果表＋判定材料＋Claudeの所見（自己弁護をしない）＋人間に見てほしい点
- **Stage 14最終報告**: qa-protocol.md「Stage 14」の8項目の順で、qa-report.md・implementation-plan.md・state.mdのセッションログから組み立てる。チャットには要約のみ、詳細は成果物への参照で示す。成果物本文を全文貼り付けない
- 報告後、state.mdのステータスを更新して終了する（Stage 14後: `案件ステータス: 報告済み`）
