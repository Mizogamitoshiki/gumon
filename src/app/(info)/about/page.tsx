import type { Metadata } from "next";
import Link from "next/link";
import MenuHero from "@/components/menu/MenuHero";
import InfoSection from "@/components/info/InfoSection";
import PullQuote from "@/components/info/PullQuote";
import TelCta from "@/components/info/TelCta";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "愚問とは — 店名の由来と台所の姿勢",
  description:
    "貝塚の中国料理 愚問について。「おいしいとは、なにか」という愚問を素材と火に問い続け、ひと皿の答えとしてお出しする店です。店名の由来、台所の姿勢、予算の目安と使い方のご案内。",
  alternates: { canonical: "/about" },
};

const HERO = {
  titleEn: "ABOUT",
  titleJp: "愚問とは",
  lead: "問いを重ね、一皿に答える。",
  items: [],
};

/* こだわりカードの細線アイコン(ストーン)。装飾なので aria-hidden */
const ICONS = {
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M18.8 5.2C11 5.6 6.7 9 6.3 15.7c0 1.2.4 2.4 1 3.1 6.9-.2 11-4.2 11.5-13.6Z" />
      <path d="M6.8 18.5C9.5 13.5 13 10.5 17 8.5" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M12 3.5c.6 3-1.8 4.6-3.2 6.4-1.3 1.6-2 3.1-1.6 5.2.5 2.9 3 5 6.3 4.9 3.2-.1 5.6-2.3 5.9-5.3.4-3.6-2.2-5.3-3.2-8-.4 1.3-1.3 2.1-2.3 2.5-.2-2-.6-4-1.9-5.7Z" />
      <path d="M12 19.9c-1.6-.3-2.6-1.5-2.5-3.1.1-1.3 1-2 1.9-3 .8 1 2.7 1.6 2.8 3.3.1 1.4-.8 2.5-2.2 2.8Z" />
    </svg>
  ),
  hourglass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5v3.2c0 2.6 4.5 3.9 4.5 5.3 0 1.4-4.5 2.7-4.5 5.3v3.2m9-17v3.2c0 2.6-4.5 3.9-4.5 5.3 0 1.4 4.5 2.7 4.5 5.3v3.2" />
    </svg>
  ),
} as const;

const KODAWARI = [
  {
    icon: ICONS.leaf,
    title: "素材に問う",
    text: "その日の素材の声を聞き、いちばん生きる形を探します。同じ献立でも、仕立ては日々すこしずつ違います。だから、お品書きにない一皿が生まれる日もあります。",
  },
  {
    icon: ICONS.flame,
    title: "火に問う",
    text: "中国料理の核心は火加減にあります。強火の一瞬、弱火の一晩。鍋の中の答えを聞き逃さないこと。酢豚の照りも、麻婆豆腐の痺れも、火の返事です。",
  },
  {
    icon: ICONS.hourglass,
    title: "時間に問う",
    text: "仕込みの時間、寝かせる時間、蒸らす時間。急がないことも技術のうちだと考えています。お席でも、どうぞ急がずに。",
  },
] as const;

export default function Page() {
  return (
    <main className="gm-cine-main">
      <BreadcrumbJsonLd trail={[{ name: "愚問とは", path: "/about" }]} />
      <MenuHero category={HERO} />

      <div className="gm-info-body">
        <InfoSection eyebrow="ON THE NAME" title="店名について">
          <div className="gm-info-prose">
            <p>
              「愚問」とは、愚かな問いのこと。
              誰もが答えを知っているようで、誰もほんとうには答えきれない問い。
              私たちはその愚問を、毎日、素材と火に向かって繰り返しています。
            </p>
            <p>
              今日の素材はどう仕立てるか。この火加減で合っているか。
              昨日と同じでいいのか。問いはいつも台所にあって、
              答えはいつも、お客さまの箸の先にあります。
            </p>
            <p>
              返ってきた答えを、ひと皿に盛ってお出しする。
              それがこの店の名前の由来であり、仕事のすべてです。
            </p>
          </div>
        </InfoSection>

        {/* TOPのS2で先取り済みの一文。店名の由来を読み終えた直後に置くことで
            重複の反復ではなく、意味を理解した上での反響として機能させる
            (再配置のみ・文言不変。詳細: docs/cinematic/about-copy-review.md) */}
        <PullQuote text="おいしいとは、なにか。" />

        <InfoSection eyebrow="OUR KITCHEN" title="台所の姿勢">
          <div className="gm-kodawari-grid">
            {KODAWARI.map((k) => (
              <article key={k.title} className="gm-kodawari-card">
                <span className="gm-kodawari-ic" aria-hidden="true">
                  {k.icon}
                </span>
                <h3 className="gm-kodawari-title">{k.title}</h3>
                <p className="gm-kodawari-text">{k.text}</p>
              </article>
            ))}
          </div>
        </InfoSection>

        <InfoSection eyebrow="THE PLACE" title="静けさについて">
          <div className="gm-info-prose">
            <p>
              貝塚駅の東出口から、歩いておよそ10分。
              日常の延長にある一軒です。
              騒がしい演出で急かさないこと、料理の湯気と皿の音を主役にすること。
              そういう静けさを大切にしています。
            </p>
            <p>
              服装は自由です。特別な日の食事にも、仕事帰りの一皿にも、
              同じ火加減でお応えします。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="YOUR TABLE" title="使い方は、ご自由に">
          <div className="gm-info-prose">
            <p>
              ふだんの晩ごはんから、ご家族の集まり、飲み放題付きの宴会コースまで。
              おひとりでも、どうぞ。夜の予算はおおよそ3,000〜4,000円ほど、
              気負わずにお使いいただける店です。
            </p>
            <p className="gm-info-note">
              個室の有無・お席の詳細・そのほか気になることは、
              お電話にてお気軽にご確認ください。よくあるご質問は
              お問い合わせページにもまとめています。
            </p>
          </div>
          <div className="gm-info-links">
            <Link href="/menu/dinner" className="gm-detail-link">
              夜のお品書きを見る
              <span className="gm-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/menu/course" className="gm-detail-link">
              コース・宴会を見る
              <span className="gm-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/contact" className="gm-detail-link">
              よくあるご質問へ
              <span className="gm-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <TelCta />
        </InfoSection>
      </div>
    </main>
  );
}
