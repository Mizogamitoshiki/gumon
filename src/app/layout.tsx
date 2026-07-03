import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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

export const metadata: Metadata = {
  title: "愚問 ｜ 中国料理 GUMON",
  description:
    "中国料理の伝統を、現代の感性で。素材と火と時間に静かに問いを重ね、ひと皿の答えとしてお出しします。中国料理 愚問（GUMON）。",
  openGraph: {
    title: "愚問 ｜ 中国料理 GUMON",
    description: "問いを重ね、一皿に答える。中国料理 愚問（GUMON）。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
      <body>{children}</body>
    </html>
  );
}
