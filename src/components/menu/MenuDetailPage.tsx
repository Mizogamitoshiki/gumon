import type { MenuSection } from "@/lib/menu";
import MenuPaper from "./MenuPaper";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const MENU_PATHS: Record<string, string> = {
  LUNCH: "/menu/lunch",
  DINNER: "/menu/dinner",
  COURSE: "/menu/course",
  DRINK: "/menu/drink",
};

// 料理・飲み物 詳細ページ本体。
// 「紙のお品書き」1 枚の構成（MenuPaper）。1 ページ＝1 カテゴリ。
// コース（COURSE）だけ品書きの下に /contact への導線を添える（機能差）。
// 夜（DINNER）は img+signature の品を看板カードとして先頭に出す（データ判定）。
export default function MenuDetailPage({ category }: { category: MenuSection }) {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          {
            name: category.titleJp,
            path: MENU_PATHS[category.titleEn] ?? "/menu/dinner",
          },
        ]}
      />
      <MenuPaper category={category} consult={category.titleEn === "COURSE"} />
    </>
  );
}
