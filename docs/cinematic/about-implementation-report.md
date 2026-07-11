# About Editorial Flow — 実装記録（Finalization Sprint Stage C）

作成: 2026-07-11 ／ 状態: 実装済み・QA完了・コミット対象

対象: `/about` のみ。ただし副次的なバグ修正（§2）は `InfoSection.tsx`（access/contact/recruitも使用する共有コンポーネント）に適用。

## 1. 実装内容

- **PullQuoteの再配置**（コピー変更なし）: 「おいしいとは、なにか。」をHero直後から「ON THE NAME／店名について」セクション直後へ移動。TOPで先取り済みの一文を、店名の由来を読み終えた直後の反響として機能させる（詳細: about-copy-review.md）
- **本文の行Revealを静的化**: About本文の`<p>`・kodawariカード・リンク行から`data-info-row`を除去。読む区間の演出をゼロにし、本文の読みやすさを優先。セクション見出し(mask reveal)・eyebrow・罫線の演出は不変
- **Hero**: 変更なし（MenuHero共有コンポーネントは既に外部修正でLCP要素=h1が常時表示・副次要素のみ軽いfade。今回追加の弱化は行わない）
- **CTA**: 既存のまま（夜のお品書き・コース・宴会・よくあるご質問へのリンク＋TelCta）。「夜のお品書きへ自然につなぐ」要件は現状で充足済み

## 2. 副次的に発見・修正したバグ（Sprint原則0）

`InfoSection.tsx`の行リビールが`[data-info-row]`要素全体を対象にしており、TelCta（自身のルートdivに`data-info-row`を持つ）を含む行では、電話ボタン(`.gm-tel-btn`)もスクロールトリガー発火まで`opacity:0`になっていた。MenuBoardのquiet/consult/calmと同じ保護（電話ボタンを演出対象から除外）をInfoSection.tsxの共通ロジックに適用。

**影響範囲**: about・access・contact・recruit全て（InfoSectionの共有修正のため）。見た目・タイミングは電話ボタン以外すべて従来どおり。テキスト・構造・機能は無変更。

## 3. 変更ファイル

| ファイル | 変更 |
| --- | --- |
| `src/app/(info)/about/page.tsx` | PullQuote再配置・`data-info-row`除去（本文行のみ） |
| `src/components/info/InfoSection.tsx` | 行リビールで`.gm-tel-btn`を演出対象から除外（バグ修正・共有） |
| `docs/cinematic/` | about-copy-review.md（分析＋承認待ち候補）・about-implementation-report.md |

## 4. 検証結果

- lint 0件／build成功／`git diff --check` OK
- SSR: About本体の`data-info-row`は0件（TelCta内部の1箇所を除く）。PullQuote位置が「店名について」の後・「台所の姿勢」の前であることをテキスト順序で確認
- 実ブラウザ: PullQuoteが店名由来を読んだ直後に反響として現れることを目視確認。電話ボタンがスクロール到達後も常時`opacity:1/visibility:visible`（About・既存ページaccess/contact/recruit問わず）
- モバイル390px(iframe実測): 横スクロール1px（`.mask`スパンのサブピクセル丸め — **未変更の`/access`でも同じ1pxが再現するため、私の変更による回帰ではなく既存のサイト共通特性**と切り分け済み）。電話ボタン214×53px・PullQuote全文表示
- reduced-motion(headlessダンプ): About隠し要素0（既知1件=モバイルナビ）・全文可読。access/contact/recruitも同時に非回帰確認（opacity:0は同じ既知1件のみ・電話CTA文言全て出力）
- コンソール error/warn 0

## 5. 未実施（承認待ち・about-copy-review.md参照）

- PullQuote文言の変更・削除（B1/B2）
- Hero lead文言の調整（B3）

## 6. 未検証事項

Safari/iOS実機・CPU4xスロットリング・第三者体感評価（サイト共通の未検証項目）
