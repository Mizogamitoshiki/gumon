import type { Metadata } from "next";
import Link from "next/link";
import MenuHero from "@/components/menu/MenuHero";
import InfoSection from "@/components/info/InfoSection";
import PullQuote from "@/components/info/PullQuote";
import TelCta from "@/components/info/TelCta";

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

export default function Page() {
  return (
    <main className="gm-cine-main">
      <MenuHero category={HERO} />

      <div className="gm-info-body">
        <PullQuote text="おいしいとは、なにか。" />

        <InfoSection eyebrow="ON THE NAME" title="店名について">
          <div className="gm-info-prose">
            <p data-info-row>
              「愚問」とは、愚かな問いのこと。
              誰もが答えを知っているようで、誰もほんとうには答えきれない問い。
              私たちはその愚問を、毎日、素材と火に向かって繰り返しています。
            </p>
            <p data-info-row>
              今日の素材はどう仕立てるか。この火加減で合っているか。
              昨日と同じでいいのか。問いはいつも台所にあって、
              答えはいつも、お客さまの箸の先にあります。
            </p>
            <p data-info-row>
              返ってきた答えを、ひと皿に盛ってお出しする。
              それがこの店の名前の由来であり、仕事のすべてです。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="OUR KITCHEN" title="台所の姿勢">
          <div className="gm-info-rows">
            <article className="gm-info-row" data-info-row>
              <h3 className="gm-info-row-title">素材に問う</h3>
              <p className="gm-info-row-text">
                その日の素材の声を聞き、いちばん生きる形を探します。
                同じ献立でも、仕立ては日々すこしずつ違います。
                だから、お品書きにない一皿が生まれる日もあります。
              </p>
            </article>
            <article className="gm-info-row" data-info-row>
              <h3 className="gm-info-row-title">火に問う</h3>
              <p className="gm-info-row-text">
                中国料理の核心は火加減にあります。強火の一瞬、弱火の一晩。
                鍋の中の答えを聞き逃さないこと。
                酢豚の照りも、麻婆豆腐の痺れも、火の返事です。
              </p>
            </article>
            <article className="gm-info-row" data-info-row>
              <h3 className="gm-info-row-title">時間に問う</h3>
              <p className="gm-info-row-text">
                仕込みの時間、寝かせる時間、蒸らす時間。
                急がないことも技術のうちだと考えています。
                お席でも、どうぞ急がずに。
              </p>
            </article>
          </div>
        </InfoSection>

        <InfoSection eyebrow="THE PLACE" title="静けさについて">
          <div className="gm-info-prose">
            <p data-info-row>
              貝塚駅の東出口から、歩いておよそ10分。
              日常の延長にある一軒です。
              騒がしい演出で急かさないこと、料理の湯気と皿の音を主役にすること。
              そういう静けさを大切にしています。
            </p>
            <p data-info-row>
              服装は自由です。特別な日の食事にも、仕事帰りの一皿にも、
              同じ火加減でお応えします。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="YOUR TABLE" title="使い方は、ご自由に">
          <div className="gm-info-prose">
            <p data-info-row>
              ふだんの晩ごはんから、ご家族の集まり、飲み放題付きの宴会コースまで。
              おひとりでも、どうぞ。夜の予算はおおよそ3,000〜4,000円ほど、
              気負わずにお使いいただける店です。
            </p>
            <p data-info-row className="gm-info-note">
              個室の有無・お席の詳細・そのほか気になることは、
              お電話にてお気軽にご確認ください。よくあるご質問は
              お問い合わせページにもまとめています。
            </p>
          </div>
          <div className="gm-info-links" data-info-row>
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
