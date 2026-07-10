import type { Metadata } from "next";
import { getFoodCategory } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

// タイトル末尾はルート layout の template で「｜ 中国料理 愚問（貝塚）」が付く
export const metadata: Metadata = {
  title: "ディナー・夜のお品書き — 貝塚駅 徒歩10分",
  description:
    "貝塚駅 東出口より徒歩約10分、中国料理 愚問のディナー。営業 18:00–23:30(L.O.23:00)・定休日なし。看板の麻婆豆腐、酢豚980円・小籠包480円。夜の予算目安は3,000〜4,000円。ご予約は072-430-6038。",
  alternates: { canonical: "/menu/dinner" },
};

export default function Page() {
  // editorial: Phase 17 — dinner のみ縦型 Editorial variant(看板の品=DishShowcase・
  // ボード fade-quiet 弱化)。他メニューページは従来のまま
  return <MenuDetailPage category={getFoodCategory("dinner")!} editorial />;
}
