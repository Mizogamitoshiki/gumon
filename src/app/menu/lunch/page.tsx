import type { Metadata } from "next";
import { getFoodCategory } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

// タイトル末尾はルート layout の template で「｜ 中国料理 愚問（貝塚）」が付く
export const metadata: Metadata = {
  title: "ランチ・昼のお品書き — 貝塚駅 徒歩10分",
  description:
    "貝塚駅 東出口より徒歩約10分、中国料理 愚問のランチ。営業 11:30–15:00(L.O.14:30)・定休日なし。担々麺や定食など、昼は軽やかに一皿で満たされる中国料理を。ご予約・ご確認は072-430-6038。",
  alternates: { canonical: "/menu/lunch" },
};

export default function Page() {
  return <MenuDetailPage category={getFoodCategory("lunch")!} />;
}
