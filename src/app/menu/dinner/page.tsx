import type { Metadata } from "next";
import { getFoodCategory } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

export const metadata: Metadata = {
  title: "夜のお品書き ｜ 中国料理 愚問",
  description: "中国料理 愚問の夜のお品書き。麻婆豆腐や北京填鴨など、火と時間をかけた夜のための一皿。",
};

export default function Page() {
  return <MenuDetailPage category={getFoodCategory("dinner")!} />;
}
