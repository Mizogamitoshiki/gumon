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

// Google マップ上の当店(CID 固定リンク)。ローカル検索の主戦場なので
// hasMap / sameAs の両方でこの URL を指し、同一エンティティだと明示する。
// ※2026-08-18 時点でオーナー確認(claim)は未実施 — 確認後に GBP 側の
//   ウェブサイト欄を gumon.owst.jp から gumon0624.com へ差し替えること
export const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=18091006304497056848";
// 第三者グルメDB。実在の裏取りと引用元として AI/検索の双方に効く
export const TABELOG_URL = "https://tabelog.com/osaka/A2705/A270502/27145831/";
export const YAHOO_MAP_URL = "https://map.yahoo.co.jp/v3/place/kzOXGX5aWHc";

export const ADDRESS = {
  full: "大阪府貝塚市加神1-4-26 貝塚セルシー",
  postalCode: "597-0071",
  region: "大阪府",
  locality: "貝塚市",
  street: "加神1-4-26 貝塚セルシー",
  postalCountry: "JP",
};

// 店舗の座標。Google マップ上の当店の登録ピンから取得(2026-08-18)。
// Plus Code "C9R4+P5 貝塚市" のデコード結果と place URL の値が一致することを確認済み。
export const GEO = { lat: 34.4418027, lng: 135.3554601 } as const;

export const STATION = "南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分";

export const HOURS = {
  lunch: { opens: "11:30", closes: "15:00", lo: "14:30" },
  dinner: { opens: "18:00", closes: "23:30", lo: "23:00" },
  closed: "なし(無休)",
};

// schema.org Restaurant(ローカルSEOの中核)。
// 載せるのは裏取りできた事実のみ(実在性の原則)。座標は Google マップ上の
// 当店ピンで確認済み(2026-08-18)。Instagram は公式確認済み(2026-07-24)。
// 未確認のもの(駐車場・喫煙可否・評価)は引き続き載せない
export const RESTAURANT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE_NAME,
  alternateName: ["愚問", "GUMON", "ぐもん"],
  description:
    "問いを重ね、一皿に答える。大阪・泉州エリア(貝塚市)の中国料理店。麻婆豆腐や酢豚、点心をはじめ、ランチ・ディナー・飲み放題付き宴会コースを提供。南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分。",
  url: SITE_URL,
  sameAs: [
    INSTAGRAM_URL,
    GOOGLE_MAPS_URL,
    HOTPEPPER_URL,
    TABELOG_URL,
    YAHOO_MAP_URL,
  ],
  // リッチリザルト用に縦横比違いを複数渡す(Google 推奨: 16:9 / 4:3)
  image: [`${SITE_URL}/og.jpg`, `${SITE_URL}/dishes.webp`],
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
  hasMap: GOOGLE_MAPS_URL,
  geo: {
    "@type": "GeoCoordinates",
    latitude: GEO.lat,
    longitude: GEO.lng,
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: ADDRESS.postalCountry,
    postalCode: ADDRESS.postalCode,
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
