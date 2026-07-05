import Link from "next/link";
import { FOOD_CATEGORIES } from "@/lib/menu";
import { SmoothScroll } from "@/components/smooth-scroll";
import DetailNav from "@/components/DetailNav";
import DetailMobileNav from "@/components/DetailMobileNav";
import ScrollProgress from "@/components/ScrollProgress";
import InstagramLink from "@/components/InstagramLink";

// 店舗案内系のページ(/about /access /contact /recruit)へのリンク。
// ヘッダー(デスクトップ)とフッターの両方で使う
const INFO_LINKS = [
  { href: "/about", label: "愚問とは" },
  { href: "/access", label: "アクセス" },
  { href: "/recruit", label: "採用" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

/**
 * TOP 以外の全ページ共通のヘッダー + フッター。
 * /menu/* と /(info)/* の layout から使う(Server Component)。
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <header className="gm-detail-header">
        <Link href="/" className="gm-detail-home" aria-label="トップへ戻る">
          <span className="gm-arrow-back" aria-hidden="true">
            ←
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span className="gm-detail-home-mark">愚問</span>
            <span className="gm-detail-home-sub">中国料理 GUMON</span>
          </span>
        </Link>
        <DetailNav />

        <div className="gm-detail-header-right">
          <a href="tel:0724306038" className="gm-detail-reserve">
            予約
          </a>
          <DetailMobileNav />
        </div>
      </header>

      <SmoothScroll>{children}</SmoothScroll>

      <footer className="gm-detail-footer">
        <div className="gm-detail-footer-inner">
          <div>
            <h3>愚問</h3>
            <span className="gm-detail-footer-sub">中国料理 GUMON</span>
            <div className="gm-detail-footer-sns">
              <InstagramLink />
            </div>
          </div>
          <nav className="gm-detail-footer-nav" aria-label="お品書き">
            {FOOD_CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/menu/${c.slug}`}>
                {c.titleJp}
              </Link>
            ))}
            <Link href="/menu/drink">飲み物</Link>
          </nav>
          <nav className="gm-detail-footer-nav" aria-label="店舗案内">
            {INFO_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="gm-detail-footer-info">
            大阪府貝塚市加神1-4-26 貝塚セルシー
            <br />
            南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分
            <br />
            昼 11:30–15:00(L.O.14:30)/ 夜 18:00–23:30(L.O.23:00)
            <br />
            定休日なし
            <br />
            <a
              href="tel:0724306038"
              style={{ color: "#f2f0eb", textDecoration: "none" }}
            >
              072-430-6038
            </a>
            <div className="gm-detail-footer-actions">
              <a href="tel:0724306038" className="gm-detail-reserve">
                電話で予約
              </a>
              <a
                href="https://maps.google.com/?q=%E5%A4%A7%E9%98%AA%E5%BA%9C%E8%B2%9D%E5%A1%9A%E5%B8%82%E5%8A%A0%E7%A5%9E1-4-26"
                target="_blank"
                rel="noopener noreferrer"
                className="gm-detail-link"
              >
                Google マップで開く
                <span className="gm-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
        <p className="gm-detail-copy">© GUMON — 中国料理 愚問</p>
      </footer>
    </>
  );
}
