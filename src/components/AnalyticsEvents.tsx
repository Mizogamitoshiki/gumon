"use client";

import { useEffect } from "react";

// この店のコンバージョンは「電話が鳴ること」。GA4 の拡張計測は離脱クリックを
// 自動で拾うが tel: リンクは対象外なので、ここだけ手で送る。
// 個別のリンクに onClick を付けて回らず document 上の委譲で全ページ分を賄う
// (浮かぶ電話ボタン・幕の中のCTA・各ページの電話CTA すべてが対象)。
// data-tel-from でどの導線から鳴ったかが分かる = 置き場所の良し悪しを数字で判断できる。
export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const page_path = window.location.pathname;

      if (href.startsWith("tel:")) {
        window.gtag?.("event", "tel_click", {
          link_location: a.getAttribute("data-tel-from") ?? "unknown",
          page_path,
        });
        return;
      }
      if (href.includes("hotpepper.jp")) {
        window.gtag?.("event", "reservation_click", { provider: "hotpepper", page_path });
        return;
      }
      if (href.includes("instagram.com")) {
        window.gtag?.("event", "instagram_click", { page_path });
        return;
      }
      if (href.includes("maps.google.com") || href.includes("google.com/maps")) {
        window.gtag?.("event", "map_click", { page_path });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
