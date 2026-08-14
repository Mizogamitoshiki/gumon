import { TEL_DISPLAY, TEL_LINK } from "@/lib/site";

/**
 * モバイル専用の浮かぶ電話ボタン(全ページ共通・右下)。
 * スクロール位置に関わらず、いつでも一手で予約の電話が掛けられるようにする。
 *
 * - 861px 以上では表示しない(デスクトップはヘッダーの導線で足りる)
 * - 朱(#b23a2e)を使う=サイトの規律どおり「電話予約 CTA」だけの色
 * - z-index はメニューの幕(290)より下: メニューを開いたら幕の裏に隠れ、
 *   幕の中の電話CTAに役目を譲る
 * - 呼吸のような波紋を1本だけ(reduced-motion では止める)
 */
export default function FloatingTel() {
  return (
    <a
      href={TEL_LINK}
      className="gm-float-tel"
      aria-label={`電話で予約する ${TEL_DISPLAY}`}
    >
      <span className="gm-float-tel-ring" aria-hidden="true" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6.8 3.5c.6 0 1.1.4 1.3 1l1 2.9c.2.5 0 1.1-.4 1.5l-1.2 1.2a13.9 13.9 0 0 0 6.4 6.4l1.2-1.2c.4-.4 1-.6 1.5-.4l2.9 1c.6.2 1 .7 1 1.3v2.3c0 .8-.6 1.4-1.4 1.4A17.6 17.6 0 0 1 3.5 5c0-.8.6-1.4 1.4-1.4h1.9z" />
      </svg>
    </a>
  );
}
