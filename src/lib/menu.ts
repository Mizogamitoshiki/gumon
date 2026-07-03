// Single source of truth for menu data — shared by the home scroll page
// (GumonScroll) and the /menu/* detail pages. Framework-agnostic (no React).

export type MenuItem = {
  name: string;
  price: string;
  desc?: string;
  signature?: boolean;
  img?: string;
};

export type FoodSlug = "lunch" | "dinner" | "course";

export type FoodCategory = {
  slug: FoodSlug;
  label: string; // TOP scroll header, e.g. "昼 ／ LUNCH"
  titleEn: string; // detail eyebrow, e.g. "LUNCH"
  titleJp: string; // detail hero title, e.g. "昼のお品書き"
  lead: string; // one lead sentence
  items: MenuItem[];
};

export type DrinkItem = { name: string; note: string };
export type DrinkCategory = {
  titleEn: string;
  titleJp: string;
  lead: string;
  items: DrinkItem[];
};

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    slug: "lunch",
    label: "昼 ／ LUNCH",
    titleEn: "LUNCH",
    titleJp: "昼のお品書き",
    lead: "昼は軽やかに、一皿で満たされる中国料理を。",
    items: [
      { name: "排骨担々麺", price: "¥1,800", desc: "胡麻香る担々スープ、辛さ控えめ" },
      { name: "海老のチリソース定食", price: "¥2,200", desc: "ぷりっと海老の自家製チリ" },
      { name: "炒飯と点心のセット", price: "¥1,600", desc: "香港式焼売と海老蒸し餃子を添えて" },
      { name: "週替わりの定食", price: "¥1,500", desc: "季節の素材で仕立てる日替わりの一皿" },
    ],
  },
  {
    slug: "dinner",
    label: "夜 ／ DINNER",
    titleEn: "DINNER",
    titleJp: "夜のお品書き",
    lead: "火と時間をかけた、夜のための一皿。",
    items: [
      {
        name: "麻婆豆腐",
        price: "¥1,600",
        desc: "四川山椒の痺れと豆板醤のコク、看板の一皿",
        signature: true,
        img: "/mapo-tofu.webp",
      },
      { name: "北京填鴨（半羽）", price: "¥6,800", desc: "皮はぱりっと、一枚ずつ削ぎ切りで" },
      { name: "清蒸鮮魚", price: "時価", desc: "その日の鮮魚を姿のまま、葱と生姜で蒸し上げ" },
      { name: "海老のチリソース", price: "¥2,400", desc: "大ぶりの海老を自家製の辣油でからめて" },
      { name: "青菜の炒めもの", price: "¥1,200", desc: "季節の青菜をにんにくと強火でさっと" },
    ],
  },
  {
    slug: "course",
    label: "コース ／ COURSE",
    titleEn: "COURSE",
    titleJp: "コース",
    lead: "前菜から点心、主菜まで。問いを重ねた一夜の流れ。",
    items: [
      { name: "おまかせコース", price: "¥12,000〜", desc: "前菜から点心、主菜まで全8品" },
      { name: "季節の宴会コース", price: "¥8,000〜", desc: "飲み放題付き・2名様より" },
      { name: "点心と前菜のミニコース", price: "¥5,000〜", desc: "昼夜通しの軽めのコース、5品" },
    ],
  },
];

export const DRINKS: DrinkCategory = {
  titleEn: "DRINK",
  titleJp: "飲み物",
  lead: "一皿に、寄り添う一杯を。紹興酒から中国茶まで。",
  items: [
    { name: "紹興酒", note: "十年熟成を中心に\n常温・温めでも" },
    { name: "ワイン", note: "料理に寄り添う\n自然派を少量ずつ" },
    { name: "中国茶", note: "岩茶・白茶など\n食後の余韻に" },
    { name: "ソフトドリンク", note: "自家製の\n季節のドリンク" },
  ],
};

// Back-compat shims so GumonScroll keeps the same JSX shapes.
export const CATS = FOOD_CATEGORIES.map((c) => ({
  label: c.label,
  slug: c.slug,
  items: c.items,
}));
export const DRINK_ITEMS = DRINKS.items;

export const getFoodCategory = (slug: string) =>
  FOOD_CATEGORIES.find((c) => c.slug === slug);
export const getDrinkData = () => DRINKS;
