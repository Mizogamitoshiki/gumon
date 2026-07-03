import Link from "next/link";
import { FOOD_CATEGORIES } from "@/lib/menu";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
        <nav className="gm-detail-nav">
          <details className="gm-nav-drop">
            <summary className="gm-detail-navlink gm-nav-summary">
              料理
              <span className="gm-nav-caret" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="gm-nav-panel">
              {FOOD_CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/menu/${c.slug}`}>
                  {c.titleJp}
                  <span className="gm-nav-panel-en">{c.titleEn}</span>
                </Link>
              ))}
            </div>
          </details>
          <Link href="/menu/drink" className="gm-detail-navlink">
            飲み物
          </Link>
        </nav>

        <a href="tel:0724306038" className="gm-detail-reserve">
          予約
        </a>
      </header>

      <SmoothScroll>{children}</SmoothScroll>

      <footer className="gm-detail-footer">
        <div className="gm-detail-footer-inner">
          <div>
            <h3>愚問</h3>
            <span className="gm-detail-footer-sub">中国料理 GUMON</span>
          </div>
          <nav className="gm-detail-footer-nav" aria-label="お品書き">
            {FOOD_CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/menu/${c.slug}`}>
                {c.titleJp}
              </Link>
            ))}
            <Link href="/menu/drink">飲み物</Link>
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
          </div>
        </div>
        <p className="gm-detail-copy">© GUMON</p>
      </footer>
    </>
  );
}
