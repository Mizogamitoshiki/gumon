import type { MenuSection } from "@/lib/menu";
import MenuHero from "./MenuHero";
import DishGallery from "./DishGallery";
import MenuList from "./MenuList";

// 料理・飲み物 詳細ページ本体。
// Hero(文字リビール + 視差) → 横スクロールギャラリー(看板の品・最大4品)
// → お品書き一覧 + 予約 CTA の 3 セクション構成。
export default function MenuDetailPage({
  category,
}: {
  category: MenuSection;
}) {
  return (
    <main className="gm-cine-main">
      <MenuHero category={category} />
      <DishGallery items={category.items.slice(0, 4)} titleEn={category.titleEn} />
      <MenuList category={category} />
    </main>
  );
}
