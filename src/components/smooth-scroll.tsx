"use client";

import { type ReactNode } from "react";
import { useLenis } from "@/lib/lenis-setup";

// Lenis はページツリーに 1 つだけ。/menu 配下のレイアウトから呼ばれる
// (トップ LP は GumonScroll が自前の Lenis を持つため、ここでは巻き込まない)。
// lerp はトップ LP(0.085)と近い値に揃え、サイト全体の慣性を統一する。
export function SmoothScroll({ children }: { children: ReactNode }) {
  useLenis({ lerp: 0.09 });
  return <>{children}</>;
}
