# GUMON Final Handoff — Site v1 完成報告

作成: 2026-07-11 ／ 案件: 愚問（GUMON）／ Bloom-L Cinematic Engine v1検証案件
状態: **実装完了・公開前Blocker確認待ち**（公開可能とは判定しない — 判定は人間が行う）

---

## 1. 完成したルート一覧とページごとの役割

| ルート | 役割 | 演出密度 | Motion密度(0-5目安) | 状態 |
| --- | --- | --- | --- | --- |
| `/` | ブランドの物語（問答を軸にした9 Scene構成） | Cinematic | 4-5（TOPのみ突出して高い） | G3合格（条件付き）。Phase 6〜14で完成 |
| `/menu/dinner` | 一皿との対面（gm-stage単一ステージ・活気の登場） | Cinematic寄りEditorial | 3 | Phase 18ロック（64586ab） |
| `/menu/lunch` | 迷わず選ぶ（brisk・pinなし・軽快） | Editorial | 2 | Phase 19Cロック（91d77da） |
| `/menu/course` | 電話で相談する（consult・pinなし・最弱fade-quiet） | Editorial-Utility | 1 | 本Sprint完成（c2d0ba7） |
| `/menu/drink` | 一杯の余韻（calm・pinなし・consultと同強度） | Editorial | 1 | 本Sprint完成（2f026f9） |
| `/about` | 問いの本文（TOP重複解消・行Reveal静的化） | Editorial | 1 | 本Sprint完成（b8ed072） |
| `/access` | 来店を迷わせない（情報卓越・演出最小） | Utility | 0-1 | 本Sprint QA完了（a8b07ce） |
| `/contact` | 予約を迷わせない（電話カード・FAQ） | Utility | 0-1 | 本Sprint QA完了（a8b07ce） |
| `/recruit` | 働く人への静かな入口 | Editorial（控えめ） | 1 | 本Sprint QA完了（1d9cab0・コード変更なし） |

## 2. 変更した主要ファイル（本Sprint）

| ファイル | 関与ページ |
| --- | --- |
| `src/app/menu/course/page.tsx`／`drink/page.tsx` | Course／Drink |
| `src/components/menu/MenuDetailPage.tsx` | Course／Drink（`consult`／`calm` prop） |
| `src/components/menu/MenuBoard.tsx` | Course／Drink／全ページ（tel-btn除外バグ修正） |
| `src/app/(info)/about/page.tsx` | About |
| `src/components/info/InfoSection.tsx` | About／Access／Contact／Recruit（共有・tel-btn除外バグ修正） |
| `src/app/globals.css` | Course／Drink（余白・note-tel）／Access（info-tel-link） |
| `docs/cinematic/*.md` | 全ページ分析・計画・QA記録 |

## 3. コミット一覧（本Sprint・feature/bloom-cinematic-storytelling）

```
c2d0ba7 feat: transform course page to consultation editorial
2f026f9 feat: transform drink page to calm editorial
b8ed072 feat: refine about page editorial flow
a8b07ce fix: complete access and contact utility QA
1d9cab0 docs: record recruit editorial QA (no code changes needed)
4d28aa7 docs: record cross-route QA sweep across all 9 routes
```

（前提: `63ea0c0`までにTOP=G3合格・Dinner=Phase18ロック・Lunch=Phase19Cロックが完了済み）

## 4. 検証結果

- 全9ルートでbuild成功／lint 0件／`git diff --check` OK／コンソールerror・warn 0件
- 非回帰: dinner(`gm-stage`)・lunch(`gm-brisk`)・course(`gm-consult`)・drink(`gm-calm`)の相互混入0
- reduced-motion: 全ルートで隠し要素0（既知1件=モバイルナビ）・全文可読
- モバイル390px: 横スクロール0（About/Access/Contact/Recruitのみ1px=`.mask`サブピクセル・既存特性）
- 電話CTA常時操作可能性: MenuBoard全分岐・InfoSection全分岐で保護済み（本Sprintで発見・修正した実バグ）
- SEO: 全ルートでtitle/description/canonical重複なし・alt欠落0・見出し階層正常・内部リンク切れ0
- 詳細は各Stageの実装報告・`crossroute-qa-report.md`を参照

## 5. 未検証事項

- Safari・iOS実機・Firefox・Edgeでの通し確認
- CPU4xスロットリング下の実機スクロール
- 第三者テスト（制作関与者以外）
- 公開後のフィールドCore Web Vitals（CrUX/RUM）
- スクリーンリーダーでの実読み上げ確認

## 6. 公開前Blocker

全19項目を `docs/cinematic/gumon-publication-blockers.md` に集約。主要カテゴリ:
1. 実URL（ホットペッパー・Instagram・本番ドメイン）
2. 実価格・メニュー原本照合（ランチ4品・飲み物4品・コース条件）
3. 素材一次出所・追加実写
4. 店舗運用情報（駐車場・支払い方法・採用条件）
5. 技術的既知事項（Tab-onlyキーボードナビゲーションの一部・サブピクセル横スクロール）— 広範囲改修が必要なため今回は見送り、記録のみ

## 7. 公開手順（AWS掲載・2026-07-22 オーナー決定により Vercel 前提から改訂）

前提の確定事項（2026-07-22）: ホスティングは **AWS**。**本番ドメインは未購入**。
技術特性: 全9ルート静的プリレンダー・next/image 不使用・APIルート/middleware なし
→ 完全静的配信が可能。メニュー品目は **ビルド時に Bloom-lCMS から取得**
（`prebuild` の sync-menu.mjs）のため、**ビルド環境に `BLOOM_API_URL` /
`BLOOM_API_KEY` が必須**（旧手順に記載漏れ。.env.example 参照）。
CMSでメニューを更新したら再ビルド・再デプロイが必要（Webhook 連携を推奨）。

構成候補（どちらでも成立。選定はオーナー/Bloom-L判断）:
- **案A: AWS Amplify Hosting（推奨）** — Git連携の自動ビルド/デプロイ・環境変数管理・
  Incoming Webhook（CMS更新→再ビルド）・独自ドメイン+SSL(ACM)自動化が揃い運用が最も軽い
- **案B: S3 + CloudFront** — 最安の完全静的配信。`next.config` に `output: 'export'`
  追加が必要。CI（GitHub Actions等でビルド→S3 sync→CloudFront invalidation）・
  ACM証明書・Route 53・クリーンURL処理（trailingSlash か CloudFront Function）を自前構築

手順:
1. **本番ドメインを購入・決定**（オーナー作業。Route 53 で取得すると DNS/ACM 連携が容易）
2. `docs/cinematic/gumon-publication-blockers.md` の1〜13（実URL・価格・素材・運用情報）を
   オーナー確認のうえ確定し、該当箇所（`src/lib/site.ts`・`src/lib/menu.ts` または CMS）を差し替える
3. AWS側のビルド環境に環境変数を設定: `NEXT_PUBLIC_SITE_URL`（本番ドメイン）・
   `BLOOM_API_URL`・`BLOOM_API_KEY`
4. `npm run build` がローカルで成功することを確認（案Bの場合は `output: 'export'` 追加後に確認）
5. `main`（または配信ブランチ）へ `feature/bloom-cinematic-storytelling` をマージ
6. AWSへデプロイ（案A: Amplify の Git 連携 push で自動 ／ 案B: CI 実行）
7. Bloom-lCMS の Webhook にデプロイフックを登録（メニュー更新→自動再ビルド）
8. デプロイ後、9ルート全てを実機（PC・モバイル）で目視確認（https・www正規化・404含む）
9. Google Search Console でドメイン所有権確認・sitemap.xml 送信・インデックス状況を確認
10. 公開後1〜2週間でフィールド Core Web Vitals（CrUX）を確認

## 8. ロールバック手順

- Vercel: デプロイ履歴から直前の安定デプロイへ「Instant Rollback」
- Git: 問題のコミットを特定し `git revert <commit>` で打ち消しコミットを作成（`git reset --hard`等の破壊的操作は行わない）
- 各Phase/Stageの成果物（`docs/cinematic/*.md`）に実装前のコミットIDが記録されているため、任意のPhase単位でも切り戻し可能
  - Course以前: `63ea0c0`（Lunchロック直後）
  - Drink以前: `c2d0ba7`
  - About以前: `2f026f9`
  - Access/Contact QA以前: `b8ed072`

## 9. 附属文書

- `docs/cinematic/gumon-final-qa-report.md`（最終QAサマリー）
- `docs/cinematic/gumon-pattern-catalog.md`（Engine還元Pattern）
- 各Stage個別文書: course/drink-transformation-plan.md、about-copy-review.md、access-contact-qa-report.md、recruit-qa-report.md、crossroute-qa-report.md
