import { HOTPEPPER_URL } from "@/lib/site";

// 電話予約 CTA(情報ページ共通)。InfoSection 内に置くと
// [data-info-row] のスクロールリビールに乗る(Server Component 可)。
// Web 予約(ホットペッパー)は手数料が店の負担になるため、常にセカンダリ扱い +
// 「お電話がいちばんありがたい」の一文でオーナーの意向を UI に汲む。
const SERIF = "var(--font-noto-serif-jp), serif";

export default function TelCta({
  lead = "ご予約を承っております。",
  label = "電話で予約する",
  showWebReserve = true,
}: {
  lead?: string;
  label?: string;
  showWebReserve?: boolean;
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
      {showWebReserve && (
        <div className="gm-cta-web">
          <a
            href={HOTPEPPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gm-detail-link"
          >
            Webで予約する(ホットペッパーグルメ)
            <span className="gm-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <p className="gm-cta-web-note">
            お電話でのご予約が、店にはいちばんありがたい方法です。
          </p>
        </div>
      )}
    </div>
  );
}
