import type { Metadata } from "next";
import MenuHero from "@/components/menu/MenuHero";
import InfoSection from "@/components/info/InfoSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { ADDRESS, SITE_NAME, TEL_DISPLAY } from "@/lib/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "中国料理 愚問（貝塚）のプライバシーポリシー。アクセス解析（Googleアナリティクス）と埋め込み地図による外部送信の内容、Cookieの取り扱い、ご予約でお預かりする情報の扱いについて。",
  alternates: { canonical: "/privacy" },
  // 集客ページではないので検索結果に積極的に出す必要はないが、
  // 「どんな情報を送っているか」を確かめに来る人が辿れることの方が大事
  robots: { index: true, follow: true },
};

const HERO = {
  titleEn: "PRIVACY",
  titleJp: "プライバシーポリシー",
  lead: "お預かりするものと、外に送られるもの。",
  items: [],
};

// 改正電気通信事業法(外部送信規律)で公表が求められる項目。
// 「何が・どこへ・何のために」送られるかを、送信先ごとに書き出す。
// 増やすとき・やめるときは、実装(Analytics.tsx / 埋め込み地図)と必ず揃える。
const TRANSMISSIONS = [
  {
    name: "Google アナリティクス（GA4）",
    operator: "Google LLC",
    sent: "閲覧されたページの URL、遷移元のページ、滞在時間、端末・ブラウザの種類、画面サイズ、IPアドレス、Cookie に保存された識別子",
    purpose:
      "どのページがどれだけ見られているかを把握し、お品書きや案内の分かりやすさを改善するため",
    where: "すべてのページ",
  },
  {
    name: "Google マップ（埋め込み地図）",
    operator: "Google LLC",
    sent: "IPアドレス、端末・ブラウザの種類、Google のサービスで保存された Cookie",
    purpose: "店舗の場所と道順を地図で表示するため",
    where: "トップページ、アクセスのページ",
  },
] as const;

export default function Page() {
  return (
    <main className="gm-cine-main">
      <BreadcrumbJsonLd
        trail={[{ name: "プライバシーポリシー", path: "/privacy" }]}
      />
      <MenuHero category={HERO} />

      <div className="gm-info-body">
        <InfoSection eyebrow="POLICY" title="このサイトについて">
          <div className="gm-info-prose" data-info-row>
            <p>
              {SITE_NAME}（{ADDRESS.full}）が運営しています。
              このページでは、当サイトをご覧になるときに集まる情報と、
              その情報が外部に送られる場合の内容をお知らせします。
            </p>
            <p>
              お名前やご連絡先を、当サイト上で入力していただく仕組みはありません。
              ご予約・お問い合わせはお電話（{TEL_DISPLAY}）で承っています。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="EXTERNAL TRANSMISSION" title="外部への送信について">
          <div className="gm-info-prose" data-info-row>
            <p>
              当サイトでは、アクセス状況の把握と地図の表示のために、
              次のサービスを利用しています。ご覧になったときに、
              以下の情報がそれぞれの運営者へ送信されます。
            </p>
          </div>

          <dl className="gm-info-dl">
            {TRANSMISSIONS.map((t) => (
              <div key={t.name} data-info-row>
                <dt>{t.name}</dt>
                <dd>
                  <strong>送信先</strong>：{t.operator}
                  <br />
                  <strong>送信される情報</strong>：{t.sent}
                  <br />
                  <strong>利用目的</strong>：{t.purpose}
                  <br />
                  <strong>対象のページ</strong>：{t.where}
                </dd>
              </div>
            ))}
          </dl>

          <p className="gm-info-note" data-info-row>
            送信された情報の取り扱いについては、
            <a
              href="https://policies.google.com/privacy?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google プライバシー ポリシー
            </a>
            および
            <a
              href="https://policies.google.com/technologies/partner-sites?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google のサービスを使用するサイトやアプリから収集した情報の利用
            </a>
            をご覧ください。
          </p>
        </InfoSection>

        <InfoSection eyebrow="OPT OUT" title="送信を止めたいとき">
          <div className="gm-info-prose" data-info-row>
            <p>
              アクセス解析の送信は、お使いのブラウザ側で止められます。
              止めても、当サイトの表示や閲覧に不都合が出ることはありません。
            </p>
          </div>
          <dl className="gm-info-dl">
            <div data-info-row>
              <dt>アクセス解析を止める</dt>
              <dd>
                Google が配布している
                <a
                  href="https://tools.google.com/dlpage/gaoptout?hl=ja"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  オプトアウト アドオン
                </a>
                を導入すると、Google アナリティクスへの送信が行われなくなります。
              </dd>
            </div>
            <div data-info-row>
              <dt>Cookie を無効にする</dt>
              <dd>
                ブラウザの設定から Cookie の受け入れを拒否・削除できます。
                方法はブラウザによって異なりますので、各ブラウザのヘルプをご確認ください。
              </dd>
            </div>
          </dl>
        </InfoSection>

        <InfoSection eyebrow="YOUR INFORMATION" title="ご予約でお預かりする情報">
          <div className="gm-info-prose" data-info-row>
            <p>
              お電話でご予約・お問い合わせをいただいた際に、お名前・お電話番号・
              ご人数・ご希望の内容などをお伺いします。これらは、
              お席のご用意とご連絡のためだけに使わせていただきます。
            </p>
            <p>
              法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。
              ご予約の内容についての訂正・削除のご希望は、お電話でお申し付けください。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="CONTACT" title="お問い合わせ先">
          <div className="gm-info-prose" data-info-row>
            <p>
              {SITE_NAME}
              <br />
              {ADDRESS.postalCode ? `〒${ADDRESS.postalCode} ` : ""}
              {ADDRESS.full}
              <br />
              電話 {TEL_DISPLAY}（営業時間内にお願いします）
            </p>
          </div>
          <p className="gm-info-note" data-info-row>
            このページの内容は、必要に応じて改定します。最終更新：2026年8月18日
          </p>
        </InfoSection>
      </div>
    </main>
  );
}
