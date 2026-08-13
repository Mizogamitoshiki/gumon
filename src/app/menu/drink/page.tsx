import type { Metadata } from "next";
import { getDrinkData } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

// タイトル末尾はルート layout の template で「｜ 中国料理 愚問（貝塚）」が付く
export const metadata: Metadata = {
  title: "飲み物 — ビール・焼酎・チューハイ・紹興酒",
  description:
    "貝塚の中国料理 愚問の飲み物。生ビール¥550、チューハイ¥500〜、焼酎・ウイスキー・クラフトジン・お茶割り・紹興酒・ソフトドリンクまで。飲み放題付き宴会コースのご相談も072-430-6038へ。",
  alternates: { canonical: "/menu/drink" },
};

export default function Page() {
  return <MenuDetailPage category={getDrinkData()} />;
}
