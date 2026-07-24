"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOD_CATEGORIES } from "@/lib/menu";
import { IS_RECRUITING } from "@/lib/recruit";
import { useMobileNavA11y } from "@/lib/use-mobile-nav";

const SERIF = "var(--font-noto-serif-jp), serif";

const MOBILE_LINK_STYLE: CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  fontFamily: SERIF,
  fontWeight: 400,
  fontSize: "clamp(22px,5.8vw,30px)",
  letterSpacing: ".14em",
  color: "#f2f0eb",
  padding: "5px 0",
};

const LINKS: { href: string; label: string }[] = [
  { href: "/about", label: "愚問とは" },
  ...FOOD_CATEGORIES.map((c) => ({ href: `/menu/${c.slug}`, label: c.titleJp })),
  { href: "/menu/drink", label: "飲み物" },
  { href: "/access", label: "アクセス" },
  { href: "/contact", label: "お問い合わせ" },
  ...(IS_RECRUITING ? [{ href: "/recruit", label: "採用" }] : []),
];

/**
 * 詳細ページ(/menu/* /about /access /contact /recruit)用のモバイル全画面メニュー。
 * TOP(GumonScroll)の見た目・挙動と揃え、861px 未満で .gm-burger/.gm-detail-nav の
 * 表示切り替えに乗る。予約は TOP と違いスクロール遷移ではなく tel: リンク。
 *
 * オーバーレイは createPortal で document.body 直下に描画する: このボタンの親
 * <header> には backdrop-filter があり、position:fixed の子はそのヘッダー自身を
 * containing block にしてしまう(CSS 仕様上 filter/backdrop-filter/transform を
 * 持つ祖先は fixed の基準になる)。header の中に inset:0 の全画面オーバーレイを
 * ネストするとヘッダーの高さに閉じ込められるため、body 直下へ逃がす。
 */
export default function DetailMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useMobileNavA11y(open, () => setOpen(false), panelRef, burgerRef);

  const overlay = (
    <div
      ref={panelRef}
      id="gm-detail-mobile-menu"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="メニュー"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 290,
        background: "rgba(24,23,21,.97)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        paddingTop: "max(88px, calc(env(safe-area-inset-top) + 72px))",
        paddingBottom: "max(28px, env(safe-area-inset-bottom))",
        overflowY: "auto",
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
        transition: "opacity .6s cubic-bezier(0.16,1,0.3,1),visibility .6s",
      }}
    >
      {LINKS.map((l, i) => (
        <Link
          key={l.href}
          href={l.href}
          className="gm-mobile-link"
          aria-current={pathname === l.href ? "page" : undefined}
          onClick={() => setOpen(false)}
          style={{ "--i": i, ...MOBILE_LINK_STYLE } as CSSProperties}
        >
          {l.label}
        </Link>
      ))}
      <a
        href="tel:0724306038"
        className="gm-reserve-outline gm-mobile-link"
        onClick={() => setOpen(false)}
        style={
          {
            "--i": LINKS.length,
            marginTop: 14,
            cursor: "pointer",
            display: "inline-block",
            textDecoration: "none",
            background: "transparent",
            border: "1px solid rgba(185,178,166,.5)",
            borderRadius: 999,
            color: "#f2f0eb",
            fontFamily: SERIF,
            fontSize: 17,
            letterSpacing: ".2em",
            textIndent: ".2em",
            padding: "14px 44px",
          } as CSSProperties
        }
      >
        予約
      </a>
    </div>
  );

  return (
    <>
      <button
        ref={burgerRef}
        onClick={() => setOpen((o) => !o)}
        aria-label="メニュー"
        aria-expanded={open}
        aria-controls="gm-detail-mobile-menu"
        className="gm-burger"
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          width: 44,
          height: 44,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <span
          style={{
            display: "block",
            height: 1,
            width: 24,
            background: "#f2f0eb",
            transform: open ? "translateY(7px) rotate(45deg)" : "none",
            transition: "transform .5s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <span
          style={{
            display: "block",
            height: 1,
            width: 24,
            background: "#f2f0eb",
            opacity: open ? 0 : 1,
            transition: "opacity .35s ease",
          }}
        />
        <span
          style={{
            display: "block",
            height: 1,
            width: 24,
            background: "#f2f0eb",
            transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            transition: "transform .5s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
