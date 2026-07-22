# Lunch Editorial Transformation Plan（Phase 19A）

作成: 2026-07-11 ／ 状態: **Phase 19C 合格・コミット済み**
対象: `/menu/lunch` のみ。Dinner（Phase 18 で固定・64586ab）には一切触れない。

---

## 1. Lunch の役割（Dinner との違い）

| | Dinner | Lunch |
| --- | --- | --- |
| 物語 | 一皿と対面する → 今夜を選ぶ → 席を決める | **昼の入口に出会う → 迷わず一皿を選ぶ → 今日の席を確かめる** |
| 時間感覚 | 溜めと儀式（夜の贅沢な時間） | **速さと軽さ（昼休みの限られた時間）** |
| 密度 | Cinematic 寄り Editorial（単一ステージ・対面Scene） | **軽量 Editorial（pin なし・最短で品書きへ）** |
| 結末 | 全画面の「席を、決める。」儀式 | **コンパクトな実務確認（時間・電話・道順）** |

Lunch は Dinner のコピーではない。Dinner が「夜をどう過ごすか」の物語なら、
Lunch は「いま決めて、確かめて、向かう」ための頁。演出は速度に奉仕する。

## 2. 現状分析

### 構成（現行コード）
- `src/app/menu/lunch/page.tsx` → `MenuDetailPage category=lunch`（editorial なし＝既定分岐）
- 描画: MenuHero（文字リビール＋視差）→ **DishGallery（pin＋横流しギャラリー・4枠）** → MenuBoard（既定 Reveal）→ CTA（既定・コンパクト）

### 資産・データ（事実）
- 品目 4 品（排骨担々麺 ¥1,800／海老のチリソース定食 ¥2,200／炒飯と点心のセット ¥1,600／週替わりの定食 ¥1,500）
- **実写真: 0 枚**（`img` 指定なし。リポジトリ内の料理実写は mapo-tofu.webp = Dinner 専用のみ）
- **価格は 4 品とも原本未照合**（menu.ts 冒頭コメントのとおり実価格が確定しているのは夜の 3 品のみ。ランチ価格はオーナーのメニュー原本待ち = 公開前 Blocker 継続。本 Phase では扱わない・推測で埋めない）
- notes に営業時間あり: 「昼の営業は 11:30–15:00(L.O.14:30)です。」

### 問題点（Lunch の役割に照らして）
| # | 問題 | 根拠 |
| --- | --- | --- |
| P1 | **DishGallery が実写ゼロのプレースホルダ 4 枠を pin 横流しで見せている** | 「迷わず選ぶ」前に、空の期待形成へ 1 ステージ分のスクロールを消費させる。Dinner Phase 17 で確立した Plan B（実写がある品だけ見せる／プレースホルダは並べない）と矛盾 |
| P2 | 入口から品書きまでの行程が Dinner 同様の重さ | 昼の来店動機（速い決断）に演出テンポが合っていない |
| P3 | 結末の押しが弱いのではなく**確認情報の並びは既に適切**（notes→CTA） | 変更最小で良い（誤爆リスクを避ける） |

## 3. 変換方針（3 Scene・pin 全面不使用）

```text
L1 昼の入口に出会う   … Hero は現状維持(コード不変更)。滞留させず、すぐ次へ
L2 迷わず一皿を選ぶ   … DishGallery を外し、品書きが第2場面として即座に・軽快に現れる
L3 今日の席を確かめる … 既定のコンパクト CTA を維持(notes の営業時間 → 電話 → 道順の順序も現状どおり)
```

- **L2 が主役**。Dinner の「活気(夜の賑わい)」に対し、Lunch は「軽快(昼の即断)」:
  同じ波状構造だが行程を短く・速く（数値は §4）
- 新コピーは追加しない（Dinner の章句「今夜を、選ぶ。」に相当する句は**置かない**。
  必要と判断される場合は別途文言承認を得る — 本計画のスコープ外）
- 削除テスト（DishGallery 外し）の判定: 4 枠すべてプレースホルダで視覚情報ゼロ。
  品名・価格・説明は MenuBoard に全件掲載されており**情報の損失はない**。
  「無い方が役割に適う」ため削除が妥当。実写が将来入った場合は
  Dinner の DishShowcase（既存・変更不要）を Plan B のまま流用できる

## 4. 実装計画（承認後の Phase 19B で実施）

| ファイル | 変更 | Dinner への影響 |
| --- | --- | --- |
| `src/app/menu/lunch/page.tsx` | `<MenuDetailPage category={lunch} brisk />` | なし |
| `MenuDetailPage.tsx` | 新 prop `brisk?: boolean`（lunch 専用）: ①DishGallery を描画しない ②main に `gm-brisk` スコープ付与 ③MenuBoard へ `brisk` 伝搬。**editorial(dinner) 分岐・既定分岐は文字どおり不変更** | なし（独立分岐） |
| `MenuBoard.tsx` | 新 `brisk?: boolean` 分岐（quiet とも既定とも独立）: 額縁 y28・0.8s・riseLine ／ 頭書き〜道具 stagger 0.07 ／ リボン x-16 ／ 行 y18・stagger 0.045（Dinner の活気より小さく・速く）。トリガーは既定と同じ位置（top 78% 帯）で早出しはしない | なし（quiet 分岐に触れない） |
| `globals.css` | `.gm-brisk` スコープのみ追記: Hero→ボードの余白圧縮 `clamp(40px, 7vh, 80px)` 程度。既存セレクタの変更なし | なし |

- モバイル / reduced-motion: brisk の matchMedia も quiet と同じ
  `(min-width: 861px) and (prefers-reduced-motion: no-preference)` — 既定どおり完全静的
- pin・横スクロール・依存追加・コピー変更・価格変更: **なし**
- JS 無効: lunch は絶対配置ステージを持たないため noscript 追補は不要（現行のまま可読）

## 5. 非回帰・検証計画（19B の DoD）

1. build / lint ゼロエラー
2. dinner / course / drink の SSR DOM 構造チェック（gm-brisk 混入なし・従来構造のまま）
3. 実スクロール: L1→L2→L3 の行程が Dinner より明確に短く感じられること・全行着地後に全文可読
4. モバイル 390px 実測（pin なし・横はみ出しゼロ）／ RM ダンプ（隠し要素ゼロ）
5. コンソール error/warn 0
6. 検索・絞り込みの動作（既存機能の無破壊）

## 6. 未確認事項（推測で埋めない）

- [未確認] ランチ 4 品の実価格・品揃え（メニュー原本待ち — 公開前 Blocker、本 Phase の対象外）
- [未確認] ランチの実写真（現状 0 枚。入手時は DishShowcase 流用を別途提案）
- [未確認] 昼の客層・回転の実態（「速さ」前提はオーナーヒアリング未実施の設計仮説）

## 7. 承認をお願いする事項

1. **A1**: DishGallery（プレースホルダ 4 枠の pin 横流し）を lunch から外すこと（§3 削除テスト根拠）
2. **A2**: L2 の軽快な登場を `brisk` 分岐として新設すること（§4 の数値レンジ）
3. **A3**: L1 / L3 は現状維持（コード不変更）とすること
4. **A4**: 新コピー・章句を追加しないこと（必要なら別途文言承認）

承認をいただき次第、Phase 19B（実装）に入ります。


---

## 8. Phase 19B 実装記録（2026-07-11）【人間レビュー待ち・未コミット】

- 承認: 2026-07-11 ユーザー「Phase 19AのTransformation Planを承認します」— 範囲: DishGallery除去／brisk分岐追加／Hero・CTA現状維持／新コピーなし。Dinner・TOP・course・drink不変更
- 実装（計画 §4 どおり・逸脱なし）:
  - `menu/lunch/page.tsx`: `brisk` 付与
  - `MenuDetailPage.tsx`: `brisk` prop 新設（DishGallery 非描画・`.gm-brisk` スコープ・MenuBoard へ伝搬）。editorial/既定分岐は不変更
  - `MenuBoard.tsx`: `brisk` 分岐新設 — 額縁 y28/scale0.985/0.8s・頭書き stagger0.07・見出しマスク一本化・道具 y12・リボン x-16・行 y18/stagger0.045（riseLine）。トリガーは既定と同じ top 78% 帯。quiet/既定分岐は不変更
  - `globals.css`: `.gm-brisk .gm-board { padding-top: clamp(40px,7vh,80px) }` のみ追記
- 検証（§5 DoD）: build ✅ lint ✅／非回帰: dinner(gm-stage維持・brisk混入0)・course/drink(gm-gal構造維持) ✅／実スクロール: Hero→品書き→CTA が明確に短い・全行着地後に全品/価格/営業時間可読 ✅／モバイル390実測: 横はみ出し0・pinなし・ギャラリーなし・4行可視 ✅／RM: 隠し要素0・全テキスト出力 ✅／コンソール error/warn 0 ✅
- 未確認のまま維持: ランチ実価格(原本待ち)・実写真・客層仮説

## 追記: 夜のお品書き構成への統一（2026-07-22・ユーザー指示）

指示「全て各ランチやコースは夜のお品書きの構成に統一して もちろんドリンクも」により、Phase 19B の brisk 独自値（軽快・小さく速く）を撤回し、ボードの振付を **dinner(quiet) と同一の構成**（MenuBoard の `lively` 共通パス・course-transformation-plan §15 参照）へ統一した。場面句は dinner 句の昼転写**「昼を、選ぶ。」**・締め句「席を、決める。」を新設（要文言レビュー）。DishGallery を置かない構造・モバイル/RM 完全静的・tel-btn 演出除外は 19B のまま不変。検証は §15 と同一バッチで全合格。**未コミット・人間レビュー待ち。**
