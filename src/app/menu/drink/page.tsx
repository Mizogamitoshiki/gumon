import type { Metadata } from "next";
import { getDrinkData } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

// タイトル末尾はルート layout の template で「｜ 中国料理 愚問（貝塚）」が付く
export const metadata: Metadata = {
  title: "飲み物 — 紹興酒・ワイン・中国茶",
  description:
    "貝塚の中国料理 愚問の飲み物。紹興酒・ワイン・中国茶・ソフトドリンクまで、一皿に寄り添う一杯を。飲み放題付き宴会コースのご相談も072-430-6038へ。",
  alternates: { canonical: "/menu/drink" },
};

export default function Page() {
  return <MenuDetailPage category={getDrinkData()} />;
}
