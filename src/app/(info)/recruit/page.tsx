import type { Metadata } from "next";
import MenuHero from "@/components/menu/MenuHero";
import InfoSection from "@/components/info/InfoSection";
import FaqList, { type FaqItem } from "@/components/info/FaqList";
import PullQuote from "@/components/info/PullQuote";
import TelCta from "@/components/info/TelCta";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "採用 — 調理・接客スタッフ募集",
  description:
    "貝塚の中国料理 愚問の採用情報。調理スタッフ・接客スタッフを募集しています。未経験のご相談も歓迎。応募は072-430-6038(採用の件、とお伝えください)。",
  alternates: { canonical: "/recruit" },
};

const HERO = {
  titleEn: "RECRUIT",
  titleJp: "採用",
  lead: "問いを重ねる仲間を、探しています。",
  items: [],
};

const POSITIONS = [
  {
    title: "調理スタッフ ／ キッチン",
    text: "仕込みから火場まで。中国料理の経験の長さは問いません。素材と火に問い続けられる人と働きたいと考えています。",
  },
  {
    title: "接客スタッフ ／ ホール",
    text: "お迎えからお見送りまで、店の呼吸をつくる仕事です。料理の言葉はすこしずつ覚えていけば大丈夫です。",
  },
] as const;

const VALUES = [
  {
    title: "問いを持つこと",
    text: "「なぜこの手順なのか」と聞ける人は、必ず伸びます。分からないことを分からないと言える台所です。",
  },
  {
    title: "急がないこと",
    text: "仕込みにも、成長にも、時間がかかります。昨日より一つ良くなっていれば、それで前進です。",
  },
  {
    title: "皿の向こうを見ること",
    text: "料理は食べる人がいて完成します。フロアもキッチンも、目線の先はいつもお客さまの卓です。",
  },
] as const;

const FAQ: FaqItem[] = [
  {
    q: "未経験でも応募できますか？",
    a: "はい。経験の長さよりも、問い続けられることを大切にしています。まずはお電話でご相談ください。",
  },
  {
    q: "給与や勤務時間を知りたいのですが。",
    a: "募集状況・雇用形態・給与などの勤務条件は、お電話にてご確認ください。面談の際に書面でもご説明します。",
  },
  {
    q: "アルバイト・パートの募集はありますか？",
    a: "時期により異なります。現在の募集状況はお電話にてお問い合わせください。",
  },
];

export default function Page() {
  return (
    <main className="gm-cine-main">
      <BreadcrumbJsonLd trail={[{ name: "採用", path: "/recruit" }]} />
      <MenuHero category={HERO} />

      <div className="gm-info-body">
        <PullQuote text="問いのある台所へ。" />

        <InfoSection eyebrow="WHY WE HIRE" title="愚問で働くということ">
          <div className="gm-info-prose">
            <p data-info-row>
              愚問の台所は、毎日が問いの連続です。
              今日の素材はどう仕立てるか。この火加減で合っているか。
              昨日より、すこしでも良い答えを出せるか。
            </p>
            <p data-info-row>
              経験の長さよりも、問い続けられることを大切にしています。
              静かな店ですが、鍋の前もフロアも、意外と体育会系です。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="POSITIONS" title="募集職種">
          <div className="gm-info-rows">
            {POSITIONS.map((p) => (
              <article key={p.title} className="gm-info-row" data-info-row>
                <h3 className="gm-info-row-title">{p.title}</h3>
                <p className="gm-info-row-text">{p.text}</p>
              </article>
            ))}
          </div>
          <div className="gm-info-prose">
            <p data-info-row className="gm-info-note">
              募集状況・雇用形態・給与などの勤務条件は、お電話にてご確認ください。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="OUR VALUES" title="大切にしていること">
          <div className="gm-info-rows">
            {VALUES.map((v) => (
              <article key={v.title} className="gm-info-row" data-info-row>
                <h3 className="gm-info-row-title">{v.title}</h3>
                <p className="gm-info-row-text">{v.text}</p>
              </article>
            ))}
          </div>
        </InfoSection>

        <InfoSection eyebrow="FAQ" title="よくあるご質問">
          <FaqList items={FAQ} />
        </InfoSection>

        <InfoSection eyebrow="HOW TO APPLY" title="応募の流れ">
          <div className="gm-info-rows">
            <article className="gm-info-row" data-info-row>
              <h3 className="gm-info-row-title">01 ── お電話ください</h3>
              <p className="gm-info-row-text">
                「採用の件で」とお伝えください。営業時間内のお電話が確実です。
              </p>
            </article>
            <article className="gm-info-row" data-info-row>
              <h3 className="gm-info-row-title">02 ── 面談</h3>
              <p className="gm-info-row-text">
                日時をご相談のうえ、店でお会いしましょう。店の空気も見にきてください。
              </p>
            </article>
          </div>
          <TelCta
            lead="ご応募・ご相談はお電話で。"
            label="電話をかける"
            showWebReserve={false}
          />
        </InfoSection>
      </div>
    </main>
  );
}
