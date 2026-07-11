import type { Metadata } from "next";
import { getFoodCategory } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

// タイトル末尾はルート layout の template で「｜ 中国料理 愚問（貝塚）」が付く
export const metadata: Metadata = {
  title: "コース・宴会（飲み放題付き）— 貝塚の中華",
  description:
    "貝塚の中国料理 愚問のコース・ご宴会。飲み放題付きの宴会コースを人数・ご予算に応じてご用意します。貝塚駅徒歩約10分・定休日なし。ご相談は072-430-6038。",
  alternates: { canonical: "/menu/course" },
};

export default function Page() {
  return <MenuDetailPage category={getFoodCategory("course")!} consult />;
}
