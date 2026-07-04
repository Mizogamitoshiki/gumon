import type { Metadata } from "next";
import MenuHero from "@/components/menu/MenuHero";
import InfoSection from "@/components/info/InfoSection";
import TelCta from "@/components/info/TelCta";

export const metadata: Metadata = {
  title: "アクセス — 貝塚駅 東出口より徒歩10分",
  description:
    "中国料理 愚問へのアクセス。大阪府貝塚市加神1-4-26 貝塚セルシー。南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分。営業は昼11:30–15:00／夜18:00–23:30、定休日なし。電話072-430-6038。",
  alternates: { canonical: "/access" },
};

const HERO = {
  titleEn: "ACCESS",
  titleJp: "アクセス",
  lead: "静けさは、路地の奥に。",
  items: [],
};

const INFO = [
  { k: "ADDRESS", v: "大阪府貝塚市加神1-4-26 貝塚セルシー" },
  { k: "STATION", v: "南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分" },
  { k: "HOURS", v: "昼 11:30–15:00(L.O.14:30)/ 夜 18:00–23:30(L.O.23:00)" },
  { k: "CLOSED", v: "なし(無休)" },
  { k: "TEL", v: "072-430-6038", tel: true },
] as const;

export default function Page() {
  return (
    <main className="gm-cine-main">
      <MenuHero category={HERO} />

      <div className="gm-info-body">
        <InfoSection eyebrow="INFORMATION" title="店舗情報">
          <dl className="gm-info-dl" data-info-row>
            {INFO.map((a) => (
              <div key={a.k} style={{ display: "contents" }}>
                <dt>{a.k}</dt>
                <dd>
                  {"tel" in a && a.tel ? (
                    <a href="tel:0724306038" className="gm-info-tel-link">
                      {a.v}
                    </a>
                  ) : (
                    a.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </InfoSection>

        <InfoSection eyebrow="MAP" title="地図・道のり">
          <div className="gm-info-map" data-info-clip>
            <iframe
              src="https://maps.google.com/maps?q=%E5%A4%A7%E9%98%AA%E5%BA%9C%E8%B2%9D%E5%A1%9A%E5%B8%82%E5%8A%A0%E7%A5%9E1-4-26&output=embed&hl=ja&z=17"
              title="中国料理 愚問 へのアクセス地図"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="gm-info-links" data-info-row>
            <a
              href="https://maps.google.com/?q=%E5%A4%A7%E9%98%AA%E5%BA%9C%E8%B2%9D%E5%A1%9A%E5%B8%82%E5%8A%A0%E7%A5%9E1-4-26"
              target="_blank"
              rel="noopener noreferrer"
              className="gm-detail-link"
            >
              マップアプリで開く
              <span className="gm-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <div className="gm-info-prose">
            <p data-info-row>
              貝塚駅の東出口から、歩いておよそ10分。
              日常の延長にある、静かな一軒です。
            </p>
          </div>
        </InfoSection>

        <InfoSection eyebrow="GETTING HERE" title="お越しの手段">
          <div className="gm-info-rows">
            <article className="gm-info-row" data-info-row>
              <h3 className="gm-info-row-title">電車でお越しの方</h3>
              <p className="gm-info-row-text">
                南海本線・水間鉄道「貝塚駅」下車、東出口から徒歩約10分です。
                難波方面からは南海本線で約30分ほど。
                道に迷われたら、お気軽にお電話ください。
              </p>
            </article>
            <article className="gm-info-row" data-info-row>
              <h3 className="gm-info-row-title">お車でお越しの方</h3>
              <p className="gm-info-row-text">
                駐車場の有無・場所については、お手数ですがお電話にてご確認ください。
              </p>
            </article>
            <article className="gm-info-row" data-info-row>
              <h3 className="gm-info-row-title">はじめての方へ</h3>
              <p className="gm-info-row-text">
                服装は自由です。おひとりでも、ご家族でも。
                ご不安なことがあれば、ご予約の際になんでもお尋ねください。
              </p>
            </article>
          </div>
          <TelCta />
        </InfoSection>
      </div>
    </main>
  );
}
