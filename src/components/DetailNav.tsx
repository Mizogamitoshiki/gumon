"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FoodNavDropdown from "@/components/FoodNavDropdown";
import { IS_RECRUITING } from "@/lib/recruit";

// 詳細ページヘッダーのナビ。現在地に aria-current を立て、
// 下線(gm-nav-link と同じ言語)で「いまどこにいるか」を示す
const LINKS_LEFT = [{ href: "/about", label: "愚問とは" }] as const;
const LINKS_RIGHT = [
  { href: "/menu/drink", label: "飲み物" },
  { href: "/access", label: "アクセス" },
  ...(IS_RECRUITING ? [{ href: "/recruit", label: "採用" }] : []),
  { href: "/contact", label: "お問い合わせ" },
] as const;

export default function DetailNav() {
  const pathname = usePathname();
  const current = (href: string) =>
    pathname === href ? ("page" as const) : undefined;

  return (
    <nav className="gm-detail-nav">
      {LINKS_LEFT.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="gm-detail-navlink"
          aria-current={current(l.href)}
        >
          {l.label}
        </Link>
      ))}
      <FoodNavDropdown summaryClassName="gm-detail-navlink gm-nav-summary" />
      {LINKS_RIGHT.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="gm-detail-navlink"
          aria-current={current(l.href)}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
