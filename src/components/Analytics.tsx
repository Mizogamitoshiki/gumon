import AnalyticsEvents from "./AnalyticsEvents";

// GA4。測定ID(G-XXXXXXXXXX)は Amplify の環境変数 NEXT_PUBLIC_GA_ID で渡す。
// 未設定ならタグごと出力しない = ローカル開発とプレビューでは計測されない。
//
// next/script の afterInteractive はインラインの中身を静的HTMLに出さず
// ハイドレーション後に注入するため、gtag.js は読み込まれたのに config が
// 走らない、という取りこぼしが起きうる。初期化は layout の openingInit と
// 同じく素の <script> で HTML に埋め込み、確実に実行させる。
//
// gtag.js(約170KB・実行 約0.4s)は初期表示に不要なので、window の load 後の
// アイドル時(上限 4 秒。どの道 6 秒で必ず読む)に差し込む。dataLayer への
// push は先に始まっているため、後から読み込まれた gtag.js がキューを順に
// 処理し page_view も tel_click も欠けない(読み込み前のクリックも送られる)。
// (モバイルの Lighthouse で初期描画・メインスレッドと競合していた 2026-08-21)
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const initSnippet = (id: string) => `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js',new Date());
gtag('config','${id}');
(function(){var done=false;function load(){if(done)return;done=true;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${id}';document.head.appendChild(s);}
function idle(){if('requestIdleCallback' in window){requestIdleCallback(load,{timeout:4000});}else{setTimeout(load,2500);}}
if(document.readyState==='complete'){idle();}else{window.addEventListener('load',idle);}
setTimeout(load,6000);})();`;

export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initSnippet(GA_ID) }} />
      <AnalyticsEvents />
    </>
  );
}
