# QA Report — 愚問（GUMON）シネマティック変換 TOP

<!-- storytelling Skill Stage 12〜14 の成果物。
     実行環境やツールがない検証を「実施済み」として書くことを禁止する。未実施は未実施と書く -->

## ステータス

- 案件名: 愚問（GUMON）LP シネマティック・スクロールテリング変換
- 作成日 / 最終更新: 2026-07-10
- 現在のStage: Stage 12（Technical QA）＋ Stage 13相当の判定材料整理
- ステータス: Technical QA実施済み（人間確認項目あり）
- 対象コミット: Block A = `7b7a22e`（＋本QAでの修正2件を含む Stage 12 コミット）

## 1. Technical QA（QUALITY_STANDARD 22章）

| 項目 | 実施方法 | 結果 | 測定値・所見 | 未実施の場合の理由 |
| --- | --- | --- | --- | --- |
| Build | `npm run build`（本番） | ✅ | `/` 12.7kB・First Load JS 158KB（予算300KB内） | |
| Test | — | 未実施 | 自動テストがプロジェクトに存在しない | テスト基盤なし（既知） |
| Lint / Type check | `next lint`（tsc含むbuild） | ✅ | 警告・エラー0 | |
| コンソールエラー（本番ビルド） | 実ブラウザで読込＋全域スイープ後に取得 | ✅ | 0件 | |
| アクセシビリティ自動チェック | Lighthouse a11yカテゴリ（axeエンジン） | ✅ | スコア**1.0**・重大違反0。※初期ビュー中心の検査。スクロール後の各Scene状態は網羅されない | axe単体のスクロール状態別検査は未実施 |
| reduced-motion切替 通し確認 | **headless Chrome `--force-prefers-reduced-motion` で実切替**しDOM検査 | ✅ | 静的縦積み適用（scroll-root:auto・全scene relative/opacity1・S2=56vh/S5=42vh・章句非表示）。**動画2本ともsrc未付与=非ダウンロードを実測**。dishes.webpスタンドイン適用 | 視覚スクリーンショットでの通し閲覧は人間確認へ |
| レスポンシブ（375〜1920px） | 実390px viewport（mobile-preview.htmlハーネス）実測＋500/1280実測 | ✅ | **scrollWidth=viewport（横スクロール0）**。hero中央配置・CTA折返し正常。>viewport要素は意図した-10%オーバースキャン背景のみ（stageでクリップ）。※headless狭窓スクリーンショットの右ズレはdesktopモード描画アーティファクトと切り分け済み | 375px実機は未実施（ユーザーの過去レビューで375確認済み） |
| ブラウザ（Chrome/Safari/Firefox/Edge/iOS実機） | Chrome実ブラウザ＋headless | Chromeのみ✅ | Safari/Firefox/Edge/iOS実機は**未検証**。リスク: svh・video scrub・sticky挙動 | 本環境で起動・検証手段なし → 人間確認項目へ |
| CTA動作 | tel:リンク・導線のDOM/SSR検査＋タップ領域実測 | ✅（一部保留） | hero電話CTA **186×47px**・reserve電話48px・バーガー44px（44px基準クリア）。tel:0724306038正・SSRに全CTA存在。**発信の実挙動とWeb予約/Instagramは実URL未確定（TODOプレースホルダ・既知の納品前Blocker）** | 実発信は実機のみ |
| パフォーマンス（Lighthouseモバイル） | devtoolsスロットリング＋simulate両方 | ✅（ラボ） | **devtools法: perf 0.93・LCP 1.8s・FCP 1.8s・CLS 0・TBT 250ms — 目標2.5s達成**。simulate法は4.1〜6.7sと振れ大（モデリング起因・localhost）。**CPU4xでのスクロール中フレーム/long task計測は未実施**（可視ウィンドウ必須） | スクロール中の実計測は環境制約 |
| Animation cleanup | コードレビュー＋実ブラウザでページ遷移（/about等）後のエラー監視 | ✅ | ScrollTrigger 1個・tl.kill/st.kill/lenis.destroy/ticker除去/armリスナー除去を確認。遷移後のコンソール0 | リサイズ・長時間リークの計測は未実施 |
| 依存・素材・フォントのライセンス | 記録照合 | ⚠️記録 | フォント=Noto(SIL OFL)✅・依存=gsap(標準ライセンス)/lenis(MIT)✅。**画像・動画は「本案件で利用可」とユーザー確認済み（G1）だが一次出所の記録が存在しない** — 対外公開前の最終確認を運用課題として継続 | |

- パフォーマンスは**ラボ計測**である。フィールド（実ユーザー）は未計測: **はい**（公開後にCrUX/RUMでLCP・CLS・INPを確認し運用QAとして記録すること）

### Stage 12で実施した修正（根拠つき・2件）

1. **noscriptフォールバック追加**（QS20 [Blocker]: JS無効時の主要コンテンツ閲覧）: Scene容器のインラインopacity:0により、JS無効時に本文が全て不可視だった（原初実装からの既存問題）。`<noscript>`スタイルで静的縦積み・全文可読へ。JS有効時は完全に不干渉。SSRに全情報（問い・結末・電話・住所・品書き・価格）が存在することも実測済み
2. **メディア装填の遅延（LCP対策・QS16 [Blocker]）**: LCP要素が「不可視のフィルムposter（339KB）」で、初期パスにmp4 1.1MB+posterが乗っていた。動画2本とposterの装填を最初のユーザー操作（pointermove/pointerdown/touchstart/keydown/スクロール、復元スクロール時は即時）へ遅延。実操作は数百ms内に起きるため体験は同等、フィルム章（全行程22%地点）への装填猶予も十分。reduced-motionの非DL設計は不変。**効果: LCP要素がヒーロー本体へ交代し、devtoolsラボでLCP 1.8s（目標達成）**

### 削除テスト記録（Block A実施分）

- 視差グロー2層=削除（A/B視覚差ゼロ＋不透明壁レイヤーに常時遮蔽で視覚出力ゼロ）／進捗ヘアライン=残置（モバイルの現在地手がかり・QS13）／S5一行=残置（G2承認・S6への橋渡し）

## 2. Creative QA（QUALITY_STANDARD 21章 — 判定材料の整理。最終合否は人間）

| 観点 | 判定材料 | 所見 | 懸念 |
| --- | --- | --- | --- |
| ブランドらしさ | creative-brief（8軸・競合テスト済み）と全Sceneの根拠対応（experience-plan 4章・8章） | 全表現判断がBrief記述に紐づく（問い・火の返事・急がない速度・答えは席で） | 実店舗の空気との一致は店主確認が未 |
| 感情曲線の実装対応 | experience-plan 2章 ↔ 実装Scene 1:1（S1〜S9） | ピーク1（S4）・静けさ3区間（S2/S5/S7）＋間2箇所 実装済み | 体感は人間の通しで判定 |
| Story（一文テスト） | 問い(S2)→返事(S4)→湯気(S5)→証拠(S6)→静けさ(S7)→実在(S8)→**答えは、席で。(S9)** | 起点と結末が画面上のコピーで接続完了（Block A） | — |
| Scene構成（目的・重複・フック） | Scene定義シート全9・重複なし・フック手法連続≤2 | 設計どおり | — |
| Transition | 8境界すべて種類記録・同型連続なし・スクロールロック0 | B3(窓が開く)/B6(間をおいて溶ける)実装済み | 低速通過の体感確認は人間 |
| 好奇心の持続 | 章句の積層・「湯気の中に」→品書き・地図の開放 | — | どこで切れるかは人間の通しで |
| Scroll Rhythm | 譜面（吸吸浅止吐浅吐吐深吐）↔ 実装対応・低強度≈36% | 高強度連続1のみ | 疲労チェック（3回連続閲覧）は人間 |
| Motionの意味 | Motion一覧表 理由記録率100%・削除テスト実施済み（グロー削除） | 残存Motionすべて理由あり | — |
| 量産感チェック5項目 | ①同型出現なし（マスク/clip-path/スクラブ/収束/fade-quietの使い分け）②Hero+3カラム+実績ロゴ構成でない ③独自確定パレット・紫グラデなし ④コピーは全て店固有（問い・火の返事・答えは席で）⑤「愚問」がなければ成立しない構成 | 5項目とも該当なし（Claude判定） | 「どこかで見た感」の最終判定は第三者・人間 |
| CTAまでの信頼形成 | CTA前の信頼Scene3（S4証拠・S6実価格・S8実在）・煽りゼロ・「お電話がいちばんありがたい」 | QS18充足 | — |
| PC/モバイル通し体験 | 過去レビュー（G2/Inc1/Inc2/Block A）で人間確認済み。Stage 12時点の通しは環境制約で未 | — | **最終盤の通し（特にS9収束の質感）を人間で** |
| 疲労チェック | 未実施 | — | 人間のみ実施可能 |
| 末尾の余韻 | ロゴ収束（transform化）→答えは、席で。→電話→静かな© | 円環構造完成 | 質感は人間判定 |

## 3. 人間による確認が必要な項目

| 項目 | 判断材料の所在 | 推奨 |
| --- | --- | --- |
| S1→S9通しの体感（等速・低速・高速／PC・モバイル各1回以上） | localhost:3000（`npm run build && npm run start`） | 特にS9収束の質感・最初の操作でアンビエントが灯る挙動（media arming後）・S6→S7の間 |
| 疲労チェック（3回連続閲覧）・量産感の最終判定 | 同上 | 第三者1名以上が望ましい（QS21） |
| Safari・Firefox・Edge・iOS実機 | 各ブラウザ/実機 | iOS実機ではスクラブ動画のアンロックとsvhを重点確認 |
| CPU4xスロットリングでのスクロール中フレーム | Chrome DevTools Performance | long task>200ms 0件の確認 |
| 電話発信・Web予約/Instagram実URLの差し替え | site.ts（TODO 2件）・実機 | **実URL受領後に差し替え（納品前Blocker・QS17/18）** |
| 未確定価格・メニュー原本・素材一次出所 | menu.ts・オーナー確認 | 納品前Blocker（QS17）として継続 |
| フィールドCWV | 公開後CrUX/RUM | 運用QAとして記録 |

## 4. 結果サマリー

- **合格**: build/lint/型・コンソール0・横スクロール0（実390計測）・CLS 0・**LCP 1.8s（devtoolsラボ・目標2.5s達成）**・TBT 250ms・a11y自動1.0・reduced-motion実切替＋動画非DL実測・タップ領域44px+・cleanup・noscript情報到達
- **修正**: noscriptフォールバック（QS20）・メディア装填遅延（LCP、初期パス-1.4MB）
- **未検証**: Safari/Firefox/Edge/iOS実機・スクロール中のCPU4x実計測・疲労/第三者テスト・電話実発信・フィールドCWV（すべて3章の人間確認項目へ）
- **残るリスク**: ①simulate法のLCPは4〜6.7sと振れる（本番CDN/実機での再計測を推奨。残差の主因は初期JS実行後のheroロゴintro） ②iOS Safariのスクラブ成立は実機依存 ③実URL/実価格/素材出所が未確定のまま（コンテンツBlocker・体験とは独立）
- **次の改善候補**: 公開後フィールド計測／iOS実機QA／menu見出しh3化（axe結果次第）／Hero案C素材撮影（v1後）
