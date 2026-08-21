import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL, RESTAURANT_JSONLD, pageMetadata } from "@/lib/site";
import NoticeBar from "@/components/NoticeBar";
import FloatingTel from "@/components/FloatingTel";
import PageTransition from "@/components/PageTransition";
import Analytics from "@/components/Analytics";
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

// ローカルSEO: 「貝塚 中華」「貝塚駅 ランチ/ディナー」「貝塚セルシー」で
// 見つかることを主目的に、タイトル・説明へ地名と利用シーンを自然な形で含める
// (煽り語は使わない=CTA-4)。
// タイトルは検索結果で切れない長さ(全角30字前後)に収める。以前の
// 「…徒歩10分の中華 — ランチ・ディナー・宴会」は末尾が "..." に省略されていた
const HOME_TITLE = "中国料理 愚問（GUMON）｜貝塚・泉州の小皿中華 ランチ・宴会";
const HOME_DESCRIPTION =
  "大阪・泉州エリア（貝塚市）の中国料理店「愚問（GUMON）」。貝塚セルシー内、貝塚駅 東出口より徒歩約10分。ランチは11:30–15:00、ディナーは18:00–23:30、定休日なし。麻婆豆腐・酢豚・小籠包の小皿中華と、飲み放題付き宴会コース。ご予約は072-430-6038。";

const home = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  ogTitle: HOME_TITLE,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s ｜ 中国料理 愚問（貝塚）",
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "貝塚 中華",
    "貝塚 中華料理",
    "貝塚 ランチ",
    "貝塚駅 ランチ",
    "貝塚駅 ディナー",
    "貝塚 宴会",
    "貝塚セルシー",
    "貝塚市 レストラン",
    "小皿中華",
    "泉州 中華",
    "泉州 ランチ",
    "泉州 グルメ",
    "岸和田 中華",
    "中国料理 愚問",
    "GUMON",
  ],
  alternates: home.alternates,
  // OG は 1.91:1 の JPEG を渡す。WebP は LINE など一部のクローラが
  // 展開できず「画像なしのリンク」になるため、共有用だけは JPEG に固定する
  openGraph: home.openGraph,
  twitter: home.twitter,
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
        {/* CMS 画像(サムネイル・料理写真)のオリジン。先に接続を張って
            最初の画像要求の DNS/TLS 往復を省く */}
        <link rel="preconnect" href="https://media.bloom-l.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://media.bloom-l.com" />
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
        {/* GA4。NEXT_PUBLIC_GA_ID が無い環境では何も出力しない */}
        <Analytics />
        {/* schema.org Restaurant — ローカル検索(マップ・リッチリザルト)向け */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_JSONLD) }}
        />
      </body>
    </html>
  );
}
