import type { CSSProperties } from "react";

type ImageSlotProps = {
  /** Optional image source. When omitted, a styled placeholder is shown. */
  src?: string;
  alt?: string;
  shape?: "rect" | "circle";
  /** Placeholder hint shown when no src is provided. */
  placeholder?: string;
  style?: CSSProperties;
};

/**
 * Port of the design's <image-slot> element. Renders the image when `src` is
 * provided, otherwise a styled drop-zone placeholder so the layout/animation
 * can be verified before real photography is supplied.
 */
export default function ImageSlot({
  src,
  alt = "",
  shape = "rect",
  placeholder = "画像をドロップ",
  style,
}: ImageSlotProps) {
  const base: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: shape === "circle" ? "50%" : 0,
    ...style,
  };

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} style={base} />;
  }

  return (
    <div
      style={{
        ...base,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "16px",
        background:
          "repeating-linear-gradient(135deg,rgba(255,255,255,.02) 0 2px,transparent 2px 13px)",
        border: "1px dashed rgba(242,240,235,.2)",
        color: "rgba(242,240,235,.34)",
        fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace",
        fontSize: "11px",
        letterSpacing: ".1em",
        lineHeight: 1.7,
      }}
    >
      <span>{placeholder}</span>
    </div>
  );
}
