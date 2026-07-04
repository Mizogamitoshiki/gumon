// サイト共通の実在情報(SEO・構造化データ・sitemap が参照する単一の出典)。
// 出典: gumon.owst.jp(公式・2026-07-03取得)

// 本番ドメイン確定後は Vercel 等の環境変数 NEXT_PUBLIC_SITE_URL を設定すること。
// 未設定の間、canonical / OG / sitemap の絶対 URL はこのフォールバックになる。
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gumon-hp.vercel.app";

export const SITE_NAME = "中国料理 愚問（GUMON）";
export const TEL_DISPLAY = "072-430-6038";
export const TEL_LINK = "tel:0724306038";

export const ADDRESS = {
  full: "大阪府貝塚市加神1-4-26 貝塚セルシー",
  region: "大阪府",
  locality: "貝塚市",
  street: "加神1-4-26 貝塚セルシー",
  postalCountry: "JP",
};

export const STATION = "南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分";

export const HOURS = {
  lunch: { opens: "11:30", closes: "15:00", lo: "14:30" },
  dinner: { opens: "18:00", closes: "23:30", lo: "23:00" },
  closed: "なし(無休)",
};

// schema.org Restaurant(ローカルSEOの中核)。
// 座標・公式SNS等は未確認のため載せない(実在性の原則)
export const RESTAURANT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE_NAME,
  alternateName: "愚問",
  url: SITE_URL,
  image: `${SITE_URL}/dishes.webp`,
  telephone: "+81-72-430-6038",
  servesCuisine: "中華料理",
  priceRange: "¥1,000-¥4,000",
  acceptsReservations: "True",
  address: {
    "@type": "PostalAddress",
    addressCountry: ADDRESS.postalCountry,
    addressRegion: ADDRESS.region,
    addressLocality: ADDRESS.locality,
    streetAddress: ADDRESS.street,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: HOURS.lunch.opens,
      closes: HOURS.lunch.closes,
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: HOURS.dinner.opens,
      closes: HOURS.dinner.closes,
    },
  ],
  hasMenu: `${SITE_URL}/menu/dinner`,
} as const;
