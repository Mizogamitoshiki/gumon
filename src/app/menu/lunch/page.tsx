import type { Metadata } from "next";
import { getFoodCategory } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

export const metadata: Metadata = {
  title: "昼のお品書き ｜ 中国料理 愚問",
  description: "中国料理 愚問の昼のお品書き。担々麺や定食など、昼は軽やかに一皿で満たされる中国料理を。",
};

export default function Page() {
  return <MenuDetailPage category={getFoodCategory("lunch")!} />;
}
