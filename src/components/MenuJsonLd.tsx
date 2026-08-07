import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { MenuSection } from "@/lib/menu";

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
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${SITE_NAME} ${category.titleJp}`,
    url: `${SITE_URL}${path}`,
    inLanguage: "ja",
    hasMenuSection: {
      "@type": "MenuSection",
      name: category.titleJp,
      description: category.lead,
      hasMenuItem: category.items.map((i) => {
        const price = parsePrice(i.price);
        return {
          "@type": "MenuItem",
          name: i.name,
          ...(i.desc ? { description: i.desc } : {}),
          ...(price !== null
            ? {
                offers: {
                  "@type": "Offer",
                  price,
                  priceCurrency: "JPY",
                },
              }
            : {}),
        };
      }),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  );
}
