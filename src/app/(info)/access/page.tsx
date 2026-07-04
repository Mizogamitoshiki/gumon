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

/* 細線アイコン(ストーン)。装飾なのですべて aria-hidden */
const ICONS = {
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-10.2a6.5 6.5 0 1 1 13 0C18.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </svg>
  ),
  train: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="13.5" rx="2.4" />
      <path d="M5 11h14M9.2 20.5 7.6 17m8.8 3.5L18 17" />
      <circle cx="9" cy="14" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3.2 2" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M4 10h16M8.5 3.5v3.4m7-3.4v3.4" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M6.8 4h2.7l1.4 4-2 1.5a12.5 12.5 0 0 0 5.6 5.6l1.5-2 4 1.4v2.7c0 1-.8 1.8-1.8 1.8A16.2 16.2 0 0 1 5 5.8C5 4.8 5.8 4 6.8 4Z" />
    </svg>
  ),
  car: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M5 12.5 6.7 7.6A2 2 0 0 1 8.6 6.2h6.8a2 2 0 0 1 1.9 1.4l1.7 4.9" />
      <rect x="4" y="12.5" width="16" height="5.5" rx="1.6" />
      <circle cx="8" cy="15.3" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" />
      <path d="m14.9 9.1-1.9 4.4-4.4 1.9 1.9-4.4z" />
    </svg>
  ),
} as const;

const INFO_ROWS = [
  { icon: ICONS.pin, label: "住所", value: "大阪府貝塚市加神1-4-26 貝塚セルシー" },
  {
    icon: ICONS.train,
    label: "最寄駅",
    value: "南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分",
  },
  {
    icon: ICONS.clock,
    label: "営業時間",
    value: "昼 11:30–15:00(L.O.14:30)／ 夜 18:00–23:30(L.O.23:00)",
  },
  { icon: ICONS.calendar, label: "定休日", value: "なし(無休)" },
  { icon: ICONS.phone, label: "電話番号", value: "072-430-6038", tel: true },
] as const;

export default function Page() {
  return (
    <main className="gm-cine-main">
      <MenuHero category={HERO} />

      <div className="gm-info-body gm-info-body-wide">
        <InfoSection eyebrow="INFORMATION" title="店舗情報">
          <dl className="gm-access-table">
            {INFO_ROWS.map((r) => (
              <div key={r.label} className="gm-access-tr" data-info-row>
                <span className="gm-access-ic">{r.icon}</span>
                <dt>{r.label}</dt>
                <dd>
                  {"tel" in r && r.tel ? (
                    <a href="tel:0724306038" className="gm-info-tel-link">
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </InfoSection>

        <InfoSection eyebrow="MAP" title="地図・道のり">
          <div className="gm-access-mapgrid">
            <div className="gm-info-map gm-access-map" data-info-clip>
              <iframe
                className="gm-map-dark"
                src="https://maps.google.com/maps?q=%E5%A4%A7%E9%98%AA%E5%BA%9C%E8%B2%9D%E5%A1%9A%E5%B8%82%E5%8A%A0%E7%A5%9E1-4-26&output=embed&hl=ja&z=17"
                title="中国料理 愚問 へのアクセス地図"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="gm-access-cards">
              <article className="gm-access-card" data-info-row>
                <h3 className="gm-access-card-title">
                  <span className="gm-access-ic">{ICONS.train}</span>
                  電車でお越しの方
                </h3>
                <p className="gm-access-card-text">
                  南海本線・水間鉄道「貝塚駅」下車、東出口から徒歩約10分。
                  難波方面からは南海本線で約30分ほどです。
                </p>
              </article>
              <article className="gm-access-card" data-info-row>
                <h3 className="gm-access-card-title">
                  <span className="gm-access-ic">{ICONS.car}</span>
                  お車でお越しの方
                </h3>
                <p className="gm-access-card-text">
                  駐車場の有無・場所については、お手数ですがお電話にて
                  ご確認ください。お酒を飲まれる方は、公共交通機関の
                  ご利用をおすすめします。
                </p>
              </article>
              <article className="gm-access-card" data-info-row>
                <h3 className="gm-access-card-title">
                  <span className="gm-access-ic">{ICONS.compass}</span>
                  はじめての方へ
                </h3>
                <p className="gm-access-card-text">
                  日常の延長にある、静かな一軒です。服装は自由。
                  おひとりでも、ご家族でも。ご不安なことがあれば、
                  ご予約の際になんでもお尋ねください。
                </p>
              </article>
              <div className="gm-info-links gm-access-maplink" data-info-row>
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
            </div>
          </div>
          <TelCta />
        </InfoSection>
      </div>
    </main>
  );
}
