import type { Metadata } from "next";
import { getFoodCategory } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

export const metadata: Metadata = {
  title: "コース ｜ 中国料理 愚問",
  description: "中国料理 愚問のコース。前菜から点心、主菜まで。問いを重ねた一夜の流れを、おまかせで。",
};

export default function Page() {
  return <MenuDetailPage category={getFoodCategory("course")!} />;
}
