// サイト共通の実在情報(SEO・構造化データ・sitemap が参照する単一の出典)。
// 出典: gumon.owst.jp(公式・2026-07-03取得)

// 正規URL(canonical / OG / sitemap の絶対 URL の基点)。
// カスタムドメイン gumon0624.com を 2026-08-18 に接続(Amplify + Route 53)。
// Amplify にも環境変数 NEXT_PUBLIC_SITE_URL を同値で設定済み。
// www.gumon0624.com は Amplify の 301 で apex に寄せるため、ここは常に www なしの apex。
// (フォールバックが本番と別ドメインだとインデックスを阻害するため、
//  ドメイン移行時はこの値と public/llms.txt 内の URL を必ず揃える)
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gumon0624.com";

export const SITE_NAME = "中国料理 愚問（GUMON）";
export const TEL_DISPLAY = "072-430-6038";
export const TEL_LINK = "tel:0724306038";

// SNS・外部予約。実 URL が届き次第ここだけ差し替える(TODO)。
// ※ホットペッパーは成約手数料が発生するため、UI 上は電話予約を常に主役にし、
//   Web 予約はセカンダリ+「お電話がいちばんありがたい」の一文を添える方針
// 公式アカウント(オーナー提供 2026-07-24。共有トークン igsh は外した正規URL)
export const INSTAGRAM_URL = "https://www.instagram.com/gumon_kaizuka/";
// 実店舗ページ(オーナー提供 2026-07-22)
export const HOTPEPPER_URL = "https://www.hotpepper.jp/strJ003850704/";

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
// 座標は未確認のため載せない(実在性の原則)。Instagram は公式確認済み(2026-07-24)
export const RESTAURANT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE_NAME,
  alternateName: ["愚問", "GUMON", "ぐもん"],
  description:
    "問いを重ね、一皿に答える。大阪・泉州エリア(貝塚市)の中国料理店。麻婆豆腐や酢豚、点心をはじめ、ランチ・ディナー・飲み放題付き宴会コースを提供。南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分。",
  url: SITE_URL,
  sameAs: [INSTAGRAM_URL, HOTPEPPER_URL],
  image: `${SITE_URL}/dishes.webp`,
  telephone: "+81-72-430-6038",
  servesCuisine: ["中華料理", "四川料理", "点心"],
  priceRange: "¥1,000-¥4,000",
  acceptsReservations: "True",
  // 商圏の目安(泉州エリア) — ローカル検索・AI回答の地域文脈用
  areaServed: [
    "貝塚市",
    "岸和田市",
    "泉佐野市",
    "熊取町",
    "泉南市",
    "和泉市",
    "泉大津市",
    "忠岡町",
  ],
  hasMap:
    "https://maps.google.com/maps?q=%E5%A4%A7%E9%98%AA%E5%BA%9C%E8%B2%9D%E5%A1%9A%E5%B8%82%E5%8A%A0%E7%A5%9E1-4-26",
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
