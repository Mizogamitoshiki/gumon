import type { Metadata } from "next";
import { getDrinkData } from "@/lib/menu";
import DrinkDetailPage from "@/components/menu/DrinkDetailPage";

export const metadata: Metadata = {
  title: "飲み物 ｜ 中国料理 愚問",
  description: "中国料理 愚問の飲み物。紹興酒・ワイン・中国茶まで、一皿に寄り添う一杯を。",
};

export default function Page() {
  return <DrinkDetailPage data={getDrinkData()} />;
}
