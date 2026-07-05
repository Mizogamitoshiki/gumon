import type { MenuSection } from "@/lib/menu";
import MenuHero from "./MenuHero";
import DishGallery from "./DishGallery";
import MenuBoard from "./MenuBoard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const MENU_PATHS: Record<string, string> = {
  LUNCH: "/menu/lunch",
  DINNER: "/menu/dinner",
  COURSE: "/menu/course",
  DRINK: "/menu/drink",
};

// 料理・飲み物 詳細ページ本体。
// Hero(文字リビール + 視差) → 横スクロールギャラリー(看板の品・最大4品)
// → お品書きボード(このカテゴリのみ+他カテゴリへの導線) + 予約 CTA。
export default function MenuDetailPage({
  category,
}: {
  category: MenuSection;
}) {
  return (
    <main className="gm-cine-main">
      <BreadcrumbJsonLd
        trail={[
          {
            name: category.titleJp,
            path: MENU_PATHS[category.titleEn] ?? "/menu/dinner",
          },
        ]}
      />
      <MenuHero category={category} />
      <DishGallery items={category.items.slice(0, 4)} titleEn={category.titleEn} />
      <MenuBoard category={category} />
    </main>
  );
}
