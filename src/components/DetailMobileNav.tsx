"use client";

import { FOOD_CATEGORIES } from "@/lib/menu";
import { IS_RECRUITING } from "@/lib/recruit";
import MobileNav, { type MobileNavLink } from "@/components/MobileNav";

const LINKS: MobileNavLink[] = [
  { href: "/about", label: "愚問とは" },
  ...FOOD_CATEGORIES.map((c) => ({ href: `/menu/${c.slug}`, label: c.titleJp })),
  { href: "/menu/drink", label: "飲み物" },
  { href: "/access", label: "アクセス" },
  { href: "/calendar", label: "営業カレンダー" },
  { href: "/contact", label: "お問い合わせ" },
  ...(IS_RECRUITING ? [{ href: "/recruit", label: "採用" }] : []),
];

/**
 * 詳細ページ(/menu/* /about /access /contact /recruit)のモバイルメニュー。
 * 見た目と所作は MobileNav が持つ。ここが決めるのは「何を並べるか」だけ。
 * TOP と違い、予約はスクロール遷移ではなく tel: リンク。
 */
export default function DetailMobileNav() {
  return <MobileNav links={LINKS} cta={{ label: "予約", href: "tel:0724306038" }} />;
}
