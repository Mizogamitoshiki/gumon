import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { MenuItem, MenuSection } from "@/lib/menu";
import { getDrinkGroups } from "@/lib/menu";

// schema.org Menu — メニューページの品目・価格を検索エンジンとAIアシスタントに
// 機械可読で渡す(AIO)。品目データは CMS 由来の単一出典(lib/menu)をそのまま使う。

// "¥1,800" / "¥1,800 + tax" のような表記だけ数値化する。"価格は店舗へ" や
// "¥500〜"(下限のみ)・"+¥350"(追加料金)は offers を付けない。
// 店の価格表記は税抜(+ tax)なので、税込でないことを priceSpecification で明示する
const parsePrice = (p: string): { price: number; taxIncluded: boolean } | null => {
  const m = p.match(/^¥([\d,]+)( \+ tax)?$/);
  return m ? { price: Number(m[1].replace(/,/g, "")), taxIncluded: !m[2] } : null;
};

export default function MenuJsonLd({
  category,
  path,
}: {
  category: MenuSection;
  path: string;
}) {
  const menuItem = (i: MenuItem) => {
    const parsed = parsePrice(i.price);
    return {
      "@type": "MenuItem",
      name: i.name,
      ...(i.desc ? { description: i.desc } : {}),
      ...(parsed !== null
        ? {
            offers: {
              "@type": "Offer",
              price: parsed.price,
              priceCurrency: "JPY",
              priceSpecification: {
                "@type": "PriceSpecification",
                price: parsed.price,
                priceCurrency: "JPY",
                valueAddedTaxIncluded: parsed.taxIncluded,
              },
            },
          }
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
