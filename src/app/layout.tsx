import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL, RESTAURANT_JSONLD } from "@/lib/site";
import NoticeBar from "@/components/NoticeBar";
import FloatingTel from "@/components/FloatingTel";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

// オープニング演出の出し分けを描画前に確定する(FOUC防止)。
// 繰り返し訪問(同一タブ)と reduced-motion では即座に隠す。
// TOP(パス "/")では石壁オープニングを出さない — 動画イントロ(GumonIntro)が
// 初回演出を担い、セッションフラグ 'gm-opened' もイントロ側が管理する
const openingInit = `try{var d=document.documentElement;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-gm-reduced','1');}else if(sessionStorage.getItem('gm-opened')||location.pathname==='/'){d.setAttribute('data-gm-opened','1');}else{sessionStorage.setItem('gm-opened','1');}}catch(e){}`;

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
      "中国料理 愚問（GUMON）｜泉州・貝塚駅 徒歩10分の中華 — ランチ・ディナー・宴会",
    template: "%s ｜ 中国料理 愚問（貝塚）",
  },
  description:
    "大阪・泉州エリア（貝塚市）の中国料理店「愚問（GUMON）」。貝塚駅 東出口より徒歩約10分。ランチは11:30–15:00、ディナーは18:00–23:30、定休日なし。酢豚・小籠包・麻婆豆腐、飲み放題付き宴会コースも。ご予約は072-430-6038。",
  keywords: [
    "貝塚 中華",
    "貝塚 中華料理",
    "貝塚 ランチ",
    "貝塚駅 ランチ",
    "貝塚駅 ディナー",
    "貝塚 宴会",
    "貝塚市 レストラン",
    "泉州 中華",
    "泉州 ランチ",
    "泉州 グルメ",
    "岸和田 中華",
    "中国料理 愚問",
    "GUMON",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "中国料理 愚問（GUMON）",
    title: "中国料理 愚問（GUMON）｜泉州・貝塚駅 徒歩10分の中華",
    description:
      "問いを重ね、一皿に答える。泉州・貝塚駅徒歩10分、ランチ・ディナー・宴会。中国料理 愚問（GUMON）。",
    // OG は 1.91:1 の JPEG を渡す。WebP は LINE など一部のクローラが
    // 展開できず「画像なしのリンク」になるため、共有用だけは JPEG に固定する
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "中国料理 愚問の料理（麻婆豆腐・小籠包・点心）",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "中国料理 愚問（GUMON）｜泉州・貝塚駅 徒歩10分の中華",
    description:
      "問いを重ね、一皿に答える。泉州・貝塚駅徒歩10分、ランチ・ディナー・宴会。",
    images: ["/og.jpg"],
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: openingInit }} />
      </head>
      <body>
        {/* オープニング(初回のみ・石壁に屋号→暖簾が開いて本体へ)。
            繰り返し訪問と reduced-motion は上の openingInit が即座に隠す */}
        <div className="gm-opening" aria-hidden="true">
          <div className="gm-opening-half left" />
          <div className="gm-opening-half right" />
          <div className="gm-opening-center">
            <div className="gm-opening-mark">愚問</div>
            <div className="gm-opening-bar">
              <span />
            </div>
            <div className="gm-opening-sub">中国料理 GUMON</div>
          </div>
        </div>
        {/* ページ遷移の演出(石壁ワイプ)。soft-nav 時のみ・reduced-motionは無効 */}
        <PageTransition />
        {/* 臨時休業などのお知らせ。全ページの最上部に出す(トップから来ても
            検索でメニューページに直接来ても必ず目に入るように) */}
        <NoticeBar />
        {children}
        {/* モバイルの浮かぶ電話ボタン(全ページ・861px未満のみ表示) */}
        <FloatingTel />
        {/* schema.org Restaurant — ローカル検索(マップ・リッチリザルト)向け */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_JSONLD) }}
        />
      </body>
    </html>
  );
}
