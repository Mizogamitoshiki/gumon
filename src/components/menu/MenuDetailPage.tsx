import type { MenuSection } from "@/lib/menu";
import MenuHero from "./MenuHero";
import DishGallery from "./DishGallery";
import DishShowcase from "./DishShowcase";
import MenuBoard from "./MenuBoard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const MENU_PATHS: Record<string, string> = {
  LUNCH: "/menu/lunch",
  DINNER: "/menu/dinner",
  COURSE: "/menu/course",
  DRINK: "/menu/drink",
};

// 料理・飲み物 詳細ページ本体。
// Hero(文字リビール + 視差) → 看板の品 → お品書きボード + 予約 CTA。
// editorial(Phase 17・現状 dinner のみ): 看板の品を縦型 Editorial の
// DishShowcase(pin なし・実写のみ)にし、ボードの Reveal を fade-quiet へ
// 弱化する。未指定ページは従来の DishGallery(pin 横流し)+ボードのまま —
// DOM・見た目・Motion は一切変わらない。
export default function MenuDetailPage({
  category,
  editorial = false,
}: {
  category: MenuSection;
  editorial?: boolean;
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
      {editorial ? (
        <DishShowcase items={category.items} titleEn={category.titleEn} />
      ) : (
        <DishGallery
          items={category.items.slice(0, 4)}
          titleEn={category.titleEn}
        />
      )}
      <MenuBoard category={category} quiet={editorial} />
    </main>
  );
}
