# Course Consultation Editorial — 実装レポート（Phase 20B）

最終更新: 2026-07-11 ／ 状態: **実装済み・人間レビュー待ち・未コミット**
計画: `course-transformation-plan.md`（Phase 20A）／ 分析: `course-project-analysis.md`

## 承認の記録

| ゲート | 日付 | 記録 |
| --- | --- | --- |
| 20A 計画承認 | 2026-07-11 | ユーザー「Phase 20AのTransformation Planを承認します」。A1（DishGallery除去）・A2（consult分岐）・A3（notes電話番号のtel:リンク化）・A4（/contact導線1本・文言は「ご予約・ご宴会についてのご質問」で固定）・A5（既存コピー不変更）。TOP・Dinner・Lunch・Drink・(info)全ページ・DishGallery/DishShowcase本体・依存・既存価格/コピーは変更禁止 |

## 実装差分（計画 §8 どおり・逸脱なし）

| ファイル | 内容 |
| --- | --- |
| `src/app/menu/course/page.tsx` | `consult` 付与のみ |
| `src/components/menu/MenuDetailPage.tsx` | `consult` prop 新設: DishGallery 非描画（brisk と同じ Plan B 判定）・`.gm-consult` スコープ・MenuBoard へ伝搬。editorial(dinner)/brisk(lunch)/既定分岐は不変更 |
| `src/components/menu/MenuBoard.tsx` | ①`consult` 分岐新設（既定/quiet/brisk から独立）: 額縁 y8/0.8s/power1.out（fadeQuiet）→ 見出し行マスク（全ページ共通文法・既定値）→ リボン y8 fadeQuiet → 行 y8/stagger0.08 → 締めの一枚も clip 展開ではなく fadeQuiet → 導線 fadeQuiet → CTA は **gm-tel-btn を演出対象から除外**し周辺のみ fadeQuiet/stagger0.08。トリガー帯は既定と同じ（top 78%/74%/84%/88%）・すべて once ②`renderNote()`: note 内の `072-430-6038` を `tel:0724306038` リンクに（表示文言不変。番号を含まない他ページの note は文字列のまま） ③consult のみ notes 直後に `/contact` 導線「ご予約・ご宴会についてのご質問 →」（既存 gm-detail-link 様式・演出対象外＝常時表示） |
| `src/app/globals.css` | `.gm-consult .gm-board { padding-top: clamp(96px,15vh,168px) }`（C1→C2 の「間」・brisk の圧縮とは逆）／`.gm-note-tel`（padding+negative margin でレイアウト不変のままタップ領域 44px+・下線・focus-visible リング・朱不使用）／`.gm-board-contact-hint`（余白のみ）。既存セレクタの変更なし |

- matchMedia: consult も quiet/brisk と同じ `(min-width: 861px) and (prefers-reduced-motion: no-preference)` — **モバイル/RM では GSAP を構築しない**
- pin・横スクロール・速い stagger・新章句・依存追加・コピー変更: なし（導線文言はユーザー固定文言）

## Scene 構成（実装後の実画面）

```text
C1 相談の入口       Hero(既存のまま) — 文字マスク+視差のみ
C2 対応できることを知る 額縁→紙カード2枚→notes(tel リンク)→FAQ導線 — すべて fade-quiet(8px)
C3 電話で席を整える   朱ボタン(常時可視)→番号→Web予約→アクセス — 周辺のみ fade-quiet
```

## 検証結果（DoD）

| 項目 | 結果 |
| --- | --- |
| `npm run lint` | ✅ 0 件 |
| `npm run build` | ✅ 成功（course 149KB First Load・変更前と同値） |
| `git diff --check` | ✅ whitespace エラーなし |
| Desktop 実スクロール（実ブラウザ 1440px） | ✅ Hero → 紙カード → notes → 導線 → 締めの一枚 → CTA が pin なしで自然に流れる。fade-quiet の途中経過（8px せり上がり）を目視確認。プレースホルダギャラリー不存在 |
| notes 電話番号のクリック可能性 | ✅ `href="tel:0724306038"`・タップ領域実測 96×51px（Desktop）/ 87×48px（390px） |
| Contact 導線 | ✅ notes 直後・gm-detail-link 様式（12.5px・ストーン系）で朱の主 CTA より明確に弱い。href="/contact" |
| Mobile 390px（same-origin iframe 実測） | ✅ 横スクロール 0・gm-gal 0・pin-spacer 0・board 内インライン演出スタイル 0（完全静的）・主ボタン 214×53px |
| reduced-motion（headless 強制・DOM ダンプ） | ✅ 隠し要素 0（inline opacity:0 は 1 件 = モバイルナビ閉状態のオーバーレイ。既存・全ページ共通・非表示が正しい）。全品目・tel リンク・導線・CTA テキスト出力 |
| 非回帰 SSR | ✅ dinner: gm-stage=6 維持／lunch: gm-brisk=2・gal=0 維持／drink: gm-gal-panel=4 維持。3 ページとも gm-consult・gm-note-tel・gm-board-contact-hint 混入 0 |
| 非回帰 実画面 | ✅ lunch board（4 行・価格・brisk）/ dinner hero / drink hero を実ブラウザ目視 — 変化なし |
| 共有ファイルの分岐限定性 | ✅ `git diff` 削除行レビュー — すべて三分岐→四分岐化に伴う再配置で、既定/quiet/brisk の値は逐語で再掲 |
| 検索・絞り込みの無破壊 | ✅ course で「海老」→ ページ内 0 件メッセージ+横断ヒット 2 件（昼・夜）→ クリアで紙カード 2 枚復帰 |
| コンソール error/warn | ✅ 0（course/lunch/dinner/drink。INFO は React DevTools 案内のみ） |

## 未検証事項（正直に記録）

- Safari / iOS 実機・Firefox / Edge での通し確認（環境なし — サイト共通の未検証項目として qa-report 3 章と同状態）
- スクロール中 CPU 4x スロットリング・60fps 定量計測（未実施）
- JS 無効時の視覚レンダリング（headless スクリーンショットが稼働中 Chrome と競合するため未計測 — SSR に全文が含まれることは確認済み。course は絶対配置ステージを持たないため構造リスクは dinner より低い）
- 第三者による「相談しやすさ」の体感評価

## 残課題（公開前・本 Phase の対象外）

- [未確認] 人数条件・飲み放題内容・個室有無・記念日対応（本実装はこれらを表示しない設計。オーナー確認後に notes/FAQ 追記を別途提案可）
- 実 URL（ホットペッパー/Instagram）・素材一次出所（サイト共通 Blocker）
- Hero lead「前菜から主菜まで。問いを重ねた一夜の流れ。」の相談ページへの言い換え（将来の文言承認課題・A5 で保留確定）

## 人間レビューで確認してほしい箇所

1. localhost:3000/menu/course を PC で通しスクロール — Hero → 紙カード → 電話までが「急がされない」テンポか。fade-quiet が Dinner の活気・Lunch の軽快と質感が違って見えるか
2. notes の電話番号リンクの見た目（下線の強さが品を保っているか）
3. 「ご予約・ご宴会についてのご質問 →」の位置と弱さ — 朱の CTA を邪魔していないか
4. C1→C2 の余白（clamp(96px,15vh,168px)）が「間」として効いているか・広すぎないか
5. モバイル 390px と reduced-motion の目視ダブルチェック
6. lunch / dinner / drink が以前と変わって見えないか
