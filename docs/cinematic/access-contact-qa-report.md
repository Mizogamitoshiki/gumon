# Access / Contact Utility QA — 実施記録（Finalization Sprint Stage D）

作成: 2026-07-11 ／ 状態: QA完了・実バグ1件修正・コミット対象

対象: `/access`・`/contact`。Utilityページのため演出追加は行わず、確認と最小修正のみ。

## 1. 確認項目と結果

| 項目 | Access | Contact |
| --- | --- | --- |
| 住所・営業時間・電話番号 | 表示・正確（既存事実情報。捏造なし） | 電話カードに集約・正確 |
| 地図 | Google Maps iframe。`title`属性あり・`loading="lazy"` | — |
| FAQ | — | 6問・details/summary・検索可能。開閉動作OK |
| タップ領域(44px+) | **`.gm-info-tel-link`が22pxしかなく未達 → 修正**（§2） | 主要CTA・FAQ summaryは44px+相当を確認 |
| モバイル390px | 横スクロール0（`.mask`の1pxサブピクセルは既存の全ページ共通特性。About QA参照） | 同左 |
| Keyboard | 見出し階層OK・back linkにaria-label（外部修正で対応済み）・FAQ summaryはscroll-reveal後にfocus可能 | 同左。詳細は§3 |
| reduced-motion | 隠し要素0(既知1件=モバイルナビ)。全文可読 | 同左 |
| コンソール error/warn | 0 | 0 |
| 見出し階層 | H1→H2→H3、順序正常 | H1→H2→H3、順序正常 |
| 画像alt | alt欠落0件 | alt欠落0件 |
| 電話CTA常時操作可能性 | InfoSection共有修正(Stage C・b8ed072)で対応済み。再確認OK | 同左 |

## 2. 修正した実バグ

**`.gm-info-tel-link`（Accessの店舗情報テーブル内・電話番号リンク）のタップ領域が22px**（padding無し・文字の行高のみ）で、WCAG/QUALITY_STANDARD 15条の44px基準に対し明確に未達だった。Course（`.gm-note-tel`）・Lunch/Drink（CTA修正）と同じ「padding+negative margin でレイアウト不変のままタップ領域拡張」パターンを適用。実測51×109pxに拡大、表示位置・崩れなしを確認。

## 3. 記録のみ・本スプリントでは対応しない発見（サイト共通の既存特性）

**Tab-onlyキーボードナビゲーションでのスクロールリビール未到達領域**: `[data-info-row]`等のscroll-reveal要素は、ページ上部から一度もスクロールせずTabキーのみで辿ると、まだscrollTrigger未発火の要素は`visibility:hidden`のため一時的にTab順序から外れる（フォーカスが次に見える要素へ飛ぶ）。これはCourse/Drink/About等で確認した「祖先要素のautoAlphaが子要素の可視性を継承的に隠す」構造がサイト全体のGSAP scroll-reveal機構に共通する性質であり、Access/Contact固有のバグではない。

- **reduced-motion利用者は完全に無影響**（GSAP自体を構築しないため、全要素が最初からfocus可能・可視）
- **スクロール（マウス・トラックパッド・Page Down等)を伴う通常利用では問題なく機能**（実機で、FAQ summaryがスクロールで可視化された直後に正しくfocus可能になることを確認済み）
- 修正には`autoAlpha`(opacity+visibility)から`opacity`単体への変更等、サイト全体のMotion機構に及ぶ大規模な設計変更が必要で、Stage Dの「最小修正」の範囲を超える。TOP/Dinner/Lunch/Course/Drinkにも影響する非常に広いスコープのため、今回は見送り、gumon-publication-blockers.mdへ将来課題として記録する

## 4. 変更ファイル

| ファイル | 変更 |
| --- | --- |
| `src/app/globals.css` | `.gm-info-tel-link`にタップ領域確保のpadding+negative margin追加のみ |
| `docs/cinematic/access-contact-qa-report.md` | 本ファイル |

## 5. 未検証事項

Safari/iOS実機・スクリーンリーダーでの実読み上げ確認・第三者体感評価
