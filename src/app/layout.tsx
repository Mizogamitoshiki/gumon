import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL, RESTAURANT_JSONLD } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1c1b19",
};

const notoSansJP = localFont({
  src: "../../public/fonts/noto-sans-jp.woff2",
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerifJP = localFont({
  src: "../../public/fonts/noto-serif-jp.woff2",
  variable: "--font-noto-serif-jp",
  display: "swap",
});

// ローカルSEO: 「貝塚 中華」「貝塚駅 ランチ/ディナー」で見つかることを主目的に、
// タイトル・説明へ地名と利用シーンを自然な形で含める(煽り語は使わない=CTA-4)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "中国料理 愚問（GUMON）｜貝塚駅 徒歩10分の中華 — ランチ・ディナー・宴会",
    template: "%s ｜ 中国料理 愚問（貝塚）",
  },
  description:
    "大阪府貝塚市の中国料理店「愚問（GUMON）」。貝塚駅 東出口より徒歩約10分。ランチは11:30–15:00、ディナーは18:00–23:30、定休日なし。酢豚・小籠包・麻婆豆腐、飲み放題付き宴会コースも。ご予約は072-430-6038。",
  keywords: [
    "貝塚 中華",
    "貝塚 中華料理",
    "貝塚駅 ランチ",
    "貝塚駅 ディナー",
    "貝塚 宴会",
    "貝塚市 レストラン",
    "中国料理 愚問",
    "GUMON",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "中国料理 愚問（GUMON）",
    title: "中国料理 愚問（GUMON）｜貝塚駅 徒歩10分の中華",
    description:
      "問いを重ね、一皿に答える。貝塚駅徒歩10分、ランチ・ディナー・宴会。中国料理 愚問（GUMON）。",
    images: [{ url: "/dishes.webp", width: 1448, height: 1086, alt: "愚問の料理" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "中国料理 愚問（GUMON）｜貝塚駅 徒歩10分の中華",
    description:
      "問いを重ね、一皿に答える。貝塚駅徒歩10分、ランチ・ディナー・宴会。",
    images: ["/dishes.webp"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
      <body>
        {children}
        {/* schema.org Restaurant — ローカル検索(マップ・リッチリザルト)向け */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_JSONLD) }}
        />
      </body>
    </html>
  );
}
