import { INSTAGRAM_URL } from "@/lib/site";

/**
 * Instagram リンク(公式グリフと同型の角丸カメラ+レンズ+ドット)。
 * 一目でインスタと分かる形をストーン→ホバーでアイボリーに。
 */
export default function InstagramLink({
  withLabel = true,
}: {
  withLabel?: boolean;
}) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="gm-ig"
      aria-label="Instagram(新しいタブで開く)"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.6" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.15" cy="6.85" r="1.15" fill="currentColor" stroke="none" />
      </svg>
      {withLabel && <span className="gm-ig-label">Instagram</span>}
    </a>
  );
}
