import type { CSSProperties } from "react";
import type { DrinkCategory } from "@/lib/menu";

const SERIF = "var(--font-noto-serif-jp), serif";

export default function DrinkDetailPage({ data }: { data: DrinkCategory }) {
  return (
    <main className="gm-detail-main">
      <div className="gm-detail-inner">
        <header
          className="gm-detail-reveal"
          style={{ "--d": "0.04s" } as CSSProperties}
        >
          <p className="gm-detail-eyebrow">{data.titleEn}</p>
          <h1 className="gm-detail-title">{data.titleJp}</h1>
          <p className="gm-detail-lead">{data.lead}</p>
        </header>

        <span
          className="gm-detail-rule gm-detail-reveal"
          style={{ "--d": "0.1s" } as CSSProperties}
        />

        <section
          className="gm-detail-list gm-detail-reveal"
          style={{ "--d": "0.16s" } as CSSProperties}
        >
          {data.items.map((dr) => (
            <article key={dr.name} className="gm-menu-row">
              <div className="gm-menu-line">
                <span className="gm-menu-name">{dr.name}</span>
              </div>
              <p className="gm-menu-desc" style={{ whiteSpace: "pre-line" }}>
                {dr.note}
              </p>
            </article>
          ))}
        </section>

        <div
          className="gm-detail-cta gm-detail-reveal"
          style={{ "--d": "0.24s" } as CSSProperties}
        >
          <p className="gm-detail-cta-lead">ご予約を承っております。</p>
          <a
            href="tel:0724306038"
            className="gm-tel-btn"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#b23a2e",
              color: "#f2f0eb",
              fontFamily: SERIF,
              fontSize: 15,
              letterSpacing: ".16em",
              padding: "15px 46px",
            }}
          >
            電話で予約する
          </a>
          <a href="tel:0724306038" className="gm-detail-cta-tel">
            072-430-6038
          </a>
        </div>
      </div>
    </main>
  );
}
