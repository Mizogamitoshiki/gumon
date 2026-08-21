import Link from "next/link";
import {
  ADDRESS,
  BUILDING,
  FACILITY,
  GOOGLE_MAPS_URL,
  HOTPEPPER_URL,
  HOURS,
  INSTAGRAM_URL,
  PAYMENT,
  SITE_NAME,
  STATION,
  TEL_DISPLAY,
  TEL_LINK,
} from "@/lib/site";
import { IS_RECRUITING } from "@/lib/recruit";

/* TOP 末尾の店舗概要(静的フッター)。
   - 目的: TOP は演出中心で検索エンジン/AI が読める本文が 1,200 字しか無く、
     住所・営業時間・席・支払いなど「来店前に知りたい事実」と、
     「貝塚セルシー」「小皿中華」といった実際に検索される語が本文に無かった。
     画面固定ステージの後ろに通常フローで置き、演出には一切手を触れない。
   - 事実の出典は src/lib/site.ts(公式ページ由来)に一本化。ここに直書きしない。
   - サーバーコンポーネント(JS を増やさない) */
const MENU_LINKS = [
  { href: "/menu/lunch", label: "昼のお品書き" },
  { href: "/menu/dinner", label: "夜のお品書き" },
  { href: "/menu/course", label: "コース・宴会" },
  { href: "/menu/drink", label: "飲み物" },
] as const;
const INFO_LINKS = [
  { href: "/about", label: "愚問とは" },
  { href: "/access", label: "アクセス" },
  { href: "/calendar", label: "営業カレンダー" },
  { href: "/contact", label: "お問い合わせ・FAQ" },
  // 募集 0 件のときは /recruit 自体が 404 になるのでリンクも出さない
  ...(IS_RECRUITING ? [{ href: "/recruit", label: "採用" }] : []),
  { href: "/privacy", label: "プライバシーポリシー" },
];

export default function SiteFooterInfo() {
  return (
    <footer className="gm-sitefoot" aria-labelledby="gm-sitefoot-title">
      <div className="gm-sitefoot-inner">
        <p className="gm-sitefoot-en">INFORMATION</p>
        <h2 id="gm-sitefoot-title" className="gm-sitefoot-title">
          店舗概要
        </h2>
        {/* JSX の改行は空白として描画されるため、一続きの文字列で渡す */}
        <p className="gm-sitefoot-lead">
          {`${SITE_NAME}は、大阪・泉州エリア 貝塚市の${BUILDING}にある、呑める小皿中華の店です。` +
            "麻婆豆腐や葡萄黒酢の酢豚、手包みの小籠包を一皿ずつ小さく。" +
            "昼は愚問小皿御膳などのランチ、夜は一品と飲み放題付きの宴会コース。" +
            "貝塚・岸和田・泉佐野・熊取など泉州一円からお越しいただいています。"}
        </p>

        <dl className="gm-sitefoot-dl">
          <div>
            <dt>店名</dt>
            <dd>{SITE_NAME}</dd>
          </div>
          <div>
            <dt>住所</dt>
            <dd>
              〒{ADDRESS.postalCode} {ADDRESS.full}
            </dd>
          </div>
          <div>
            <dt>最寄駅</dt>
            <dd>{STATION}</dd>
          </div>
          <div>
            <dt>営業時間</dt>
            <dd>
              昼 {HOURS.lunch.opens}–{HOURS.lunch.closes}（L.O.{HOURS.lunch.lo}）／
              夜 {HOURS.dinner.opens}–{HOURS.dinner.closes}（L.O.{HOURS.dinner.lo}）
            </dd>
          </div>
          <div>
            <dt>定休日</dt>
            <dd>{HOURS.closed}。臨時休業は営業カレンダーに掲載</dd>
          </div>
          <div>
            <dt>電話</dt>
            <dd>
              <a href={TEL_LINK} data-tel-from="footer">
                {TEL_DISPLAY}
              </a>
              （ご予約はお電話がいちばん確実です）
            </dd>
          </div>
          <div>
            <dt>席</dt>
            <dd>
              {FACILITY.seats}席・カウンターあり・個室なし・{FACILITY.charter}
            </dd>
          </div>
          <div>
            <dt>駐車場</dt>
            <dd>{FACILITY.parking}</dd>
          </div>
          <div>
            <dt>お支払い</dt>
            <dd>
              現金／クレジットカード（{PAYMENT.cards.join("・")}）／
              電子マネー（{PAYMENT.eMoney.join("・")}）／
              QRコード決済（{PAYMENT.qr.join("・")}）
            </dd>
          </div>
        </dl>

        <nav className="gm-sitefoot-nav" aria-label="サイト内リンク">
          <ul>
            {MENU_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <ul>
            {INFO_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <ul>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                Google マップ
              </a>
            </li>
            <li>
              <a href={HOTPEPPER_URL} target="_blank" rel="noopener noreferrer">
                Web予約（ホットペッパーグルメ）
              </a>
            </li>
          </ul>
        </nav>

        <p className="gm-sitefoot-copy">© {SITE_NAME}</p>
      </div>
    </footer>
  );
}
