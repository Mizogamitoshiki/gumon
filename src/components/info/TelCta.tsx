// 電話予約 CTA(情報ページ共通)。InfoSection 内に置くと
// [data-info-row] のスクロールリビールに乗る(Server Component 可)
const SERIF = "var(--font-noto-serif-jp), serif";

export default function TelCta({
  lead = "ご予約を承っております。",
  label = "電話で予約する",
}: {
  lead?: string;
  label?: string;
}) {
  return (
    <div className="gm-detail-cta" data-info-row>
      <p className="gm-detail-cta-lead">{lead}</p>
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
        {label}
      </a>
      <a href="tel:0724306038" className="gm-detail-cta-tel">
        072-430-6038
      </a>
    </div>
  );
}
