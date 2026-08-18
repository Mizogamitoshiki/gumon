import AnalyticsEvents from "./AnalyticsEvents";

// GA4。測定ID(G-XXXXXXXXXX)は Amplify の環境変数 NEXT_PUBLIC_GA_ID で渡す。
// 未設定ならタグごと出力しない = ローカル開発とプレビューでは計測されない。
//
// next/script の afterInteractive はインラインの中身を静的HTMLに出さず
// ハイドレーション後に注入するため、gtag.js は読み込まれたのに config が
// 走らない、という取りこぼしが起きうる。初期化は layout の openingInit と
// 同じく素の <script> で HTML に埋め込み、確実に実行させる。
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const initSnippet = (id: string) => `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js',new Date());
gtag('config','${id}');`;

export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script dangerouslySetInnerHTML={{ __html: initSnippet(GA_ID) }} />
      <AnalyticsEvents />
    </>
  );
}
