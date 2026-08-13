import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { MenuItem, MenuSection } from "@/lib/menu";
import { getDrinkGroups } from "@/lib/menu";

// schema.org Menu — メニューページの品目・価格を検索エンジンとAIアシスタントに
// 機械可読で渡す(AIO)。品目データは CMS 由来の単一出典(lib/menu)をそのまま使う。

// "¥1,800" のような表記だけ数値化する。"価格は店舗へ" 等は offers を付けない
const parsePrice = (p: string): number | null => {
  const m = p.match(/^¥([\d,]+)$/);
  return m ? Number(m[1].replace(/,/g, "")) : null;
};

export default function MenuJsonLd({
  category,
  path,
}: {
  category: MenuSection;
  path: string;
}) {
  const menuItem = (i: MenuItem) => {
    const price = parsePrice(i.price);
    return {
      "@type": "MenuItem",
      name: i.name,
      ...(i.desc ? { description: i.desc } : {}),
      ...(price !== null
        ? { offers: { "@type": "Offer", price, priceCurrency: "JPY" } }
        : {}),
    };
  };

  // 飲み物は紙のお品書きと同じ章立て（ビール／焼酎／…）で節を分けて渡す。
  // 「緑茶」のように章が違えば同名の品があるため、1 節にまとめない
  const sections =
    category.titleEn === "DRINK"
      ? getDrinkGroups().map(({ group, items }) => ({
          "@type": "MenuSection",
          name: group.titleJp,
          ...(group.note ? { description: group.note } : {}),
          hasMenuItem: items.map(menuItem),
        }))
      : {
          "@type": "MenuSection",
          name: category.titleJp,
          description: category.lead,
          hasMenuItem: category.items.map(menuItem),
        };

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${SITE_NAME} ${category.titleJp}`,
    url: `${SITE_URL}${path}`,
    inLanguage: "ja",
    hasMenuSection: sections,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  );
}
