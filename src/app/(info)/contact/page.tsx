import type { Metadata } from "next";
import Link from "next/link";
import MenuHero from "@/components/menu/MenuHero";
import InfoSection from "@/components/info/InfoSection";
import FaqList, { type FaqItem } from "@/components/info/FaqList";
import PullQuote from "@/components/info/PullQuote";
import TelCta from "@/components/info/TelCta";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "お問い合わせ・ご予約 — よくあるご質問",
  description:
    "貝塚の中国料理 愚問へのお問い合わせ。ご予約・宴会・貸切のご相談は072-430-6038まで。予算・服装・お子さま連れなど、よくあるご質問にもお答えしています。",
  alternates: { canonical: "/contact" },
};

const HERO = {
  titleEn: "CONTACT",
  titleJp: "お問い合わせ",
  lead: "ご予約も、ご相談も、一本のお電話から。",
  items: [],
};

/* 細線アイコン(ストーン)。装飾なのですべて aria-hidden */
const ICONS = {
  seat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="4.5" y="5" width="15" height="7" rx="1.6" />
      <path d="M6.5 12v6.5m11-6.5v6.5M4.5 15.5h15" />
    </svg>
  ),
  cups: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M7 4.5h10l-1.2 8a3.9 3.9 0 0 1-7.6 0z" />
      <path d="M12 12.8v5.2m-3.4 1.5h6.8" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M18.8 5.2C11 5.6 6.7 9 6.3 15.7c0 1.2.4 2.4 1 3.1 6.9-.2 11-4.2 11.5-13.6Z" />
      <path d="M6.8 18.5C9.5 13.5 13 10.5 17 8.5" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="3.5" y="7" width="17" height="12" rx="2" />
      <path d="M8.5 7 10 4.5h4L15.5 7" />
      <circle cx="12" cy="12.8" r="3.4" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" />
      <path d="m14.9 9.1-1.9 4.4-4.4 1.9 1.9-4.4z" />
    </svg>
  ),
} as const;

const TOPICS = [
  {
    icon: ICONS.seat,
    title: "お席のご予約",
    text: "日時と人数をお知らせください。コースのご相談もあわせて承ります。",
  },
  {
    icon: ICONS.cups,
    title: "宴会・貸切のご相談",
    text: "飲み放題付きの宴会コースをご用意しています。人数・ご予算に合わせてご提案します。",
  },
  {
    icon: ICONS.leaf,
    title: "食材のご不安・お子さま連れ",
    text: "ご事情に合わせてできることを一緒に考えます。まずはお気軽にご相談ください。",
  },
  {
    icon: ICONS.camera,
    title: "取材・お取引について",
    text: "営業時間内にお電話のうえ、ご用件をお知らせください。",
  },
] as const;

// 来店前の不安(価格帯・格式・予約・席)に正面から答える。
// 店舗確認が要るものは断定せず「お電話で」に倒す(実在性の原則)
const FAQ: FaqItem[] = [
  {
    q: "予約は必要ですか？",
    a: "ご予約なしでもご利用いただけますが、お席のご用意を確実にするにはお電話でのご予約をおすすめします。ご宴会・貸切は事前のご相談をお願いします。",
  },
  {
    q: "服装に決まりはありますか？",
    a: "ありません。ふだんの服装でどうぞ。特別な日の食事にも、仕事帰りの一皿にも、同じようにお応えします。",
  },
  {
    q: "予算はどのくらいを見ればよいですか？",
    a: "夜はおおよそ3,000〜4,000円ほどが目安です。酢豚980円・小籠包480円など、一品はお手頃な価格から。飲み放題付きの宴会コースはご予算に応じてご相談ください。",
  },
  {
    q: "子ども連れでも大丈夫ですか？",
    a: "はい、ご家族でのお食事も歓迎です。お席やお料理のご相談は、ご予約の際にお気軽にお申し付けください。",
  },
  {
    q: "個室や席の詳細を知りたいのですが。",
    a: "お席の構成・個室の有無は、お電話にてご確認ください。人数とご用途をお伝えいただければ、最適な形をご案内します。",
  },
  {
    q: "支払い方法は何が使えますか？",
    a: "ご利用いただける支払い方法は、お手数ですがお電話にてご確認ください。",
  },
];

// FAQ リッチリザルト(Google 検索でのアコーディオン表示)向け構造化データ
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <main className="gm-cine-main">
      <BreadcrumbJsonLd trail={[{ name: "お問い合わせ", path: "/contact" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <MenuHero category={HERO} />

      <div className="gm-info-body">
        <PullQuote text="愚問こそ、歓迎です。" />

        <InfoSection eyebrow="BY PHONE" title="お電話でのお問い合わせ">
          <div className="gm-tel-card gm-tel-card-hero" data-info-row>
            <p className="gm-tel-card-label">TEL</p>
            <a href="tel:0724306038" className="gm-tel-card-number">
              072-430-6038
            </a>
            <div className="gm-tel-hours">
              <div className="gm-tel-hours-block">
                <span className="gm-tel-hours-k">昼</span>
                <span className="gm-tel-hours-v">11:30–15:00(L.O.14:30)</span>
              </div>
              <span className="gm-tel-hours-div" aria-hidden="true" />
              <div className="gm-tel-hours-block">
                <span className="gm-tel-hours-k">夜</span>
                <span className="gm-tel-hours-v">18:00–23:30(L.O.23:00)</span>
              </div>
            </div>
            <p className="gm-tel-card-note">
              受付は営業時間内 ── 定休日なし。どんな愚問にも、お答えします。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="TOPICS" title="承れるご相談">
          <div className="gm-contact-grid">
            {TOPICS.map((t) => (
              <article key={t.title} className="gm-access-card" data-info-row>
                <h3 className="gm-access-card-title">
                  <span className="gm-access-ic">{t.icon}</span>
                  {t.title}
                </h3>
                <p className="gm-access-card-text">{t.text}</p>
              </article>
            ))}
            <article className="gm-access-card" data-info-row>
              <h3 className="gm-access-card-title">
                <span className="gm-access-ic">{ICONS.compass}</span>
                採用について
              </h3>
              <p className="gm-access-card-text">
                一緒に働く仲間を探しています。詳しくは採用ページをご覧ください。
              </p>
              <Link href="/recruit" className="gm-detail-link">
                採用ページへ
                <span className="gm-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </article>
          </div>
        </InfoSection>

        <InfoSection eyebrow="FAQ" title="よくあるご質問">
          <FaqList items={FAQ} searchable />
        </InfoSection>

        <InfoSection eyebrow="VISIT" title="ご来店の前に">
          <div className="gm-info-prose">
            <p data-info-row>
              場所・道のりはアクセスページにまとめています。
              貝塚駅の東出口から、歩いておよそ10分です。
            </p>
          </div>
          <div className="gm-info-links" data-info-row>
            <Link href="/access" className="gm-detail-link">
              アクセスを見る
              <span className="gm-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <TelCta lead="お電話をお待ちしております。" label="電話をかける" />
        </InfoSection>
      </div>
    </main>
  );
}
