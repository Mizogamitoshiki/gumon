import type { Metadata } from "next";
import { getFoodCategory } from "@/lib/menu";
import MenuDetailPage from "@/components/menu/MenuDetailPage";

const COURSE = getFoodCategory("course")!;

// 看板のコース(愚問コース)の名前と価格は CMS が出典。description に直書きすると
// 価格改定のたびに二重管理になるため、ビルド時に品目から組み立てる。
// 該当品目が無くなった場合は、その一文ごと落ちる(嘘が残らない)。
const flagship = COURSE.items.find((i) => i.name.startsWith("愚問コース"));
const flagshipLine = flagship ? `全10品の${flagship.name}${flagship.price}のほか、` : "";

// タイトル末尾はルート layout の template で「｜ 中国料理 愚問（貝塚）」が付く
export const metadata: Metadata = {
  title: "コース・宴会（飲み放題付き）— 貝塚の中華",
  description:
    `貝塚の中国料理 愚問のコース・ご宴会。${flagshipLine}` +
    "人数・ご予算に合わせた飲み放題付きの宴会コースをご用意します。貝塚駅徒歩約10分・定休日なし。ご相談は072-430-6038。",
  alternates: { canonical: "/menu/course" },
};

export default function Page() {
  return <MenuDetailPage category={COURSE} />;
}
