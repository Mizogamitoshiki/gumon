// Single source of truth for menu data — shared by the home scroll page
// (GumonScroll) and the /menu/* detail pages. Framework-agnostic (no React).

export type MenuItem = {
  name: string;
  price: string;
  desc?: string;
  signature?: boolean; // 看板の品
  recommended?: boolean; // おすすめ(公式サイト掲載品=店が推す品。人気No.1等の実績主張はしない)
  spicy?: 1 | 2 | 3; // 辛さ(料理の性質としての事実表示。1=控えめ 2=中辛 3=辛口)
  img?: string;
};

// Shared shape driving the /menu/* detail page layout (Hero → gallery → list).
export type MenuSection = {
  titleEn: string; // detail eyebrow, e.g. "LUNCH"
  titleJp: string; // detail hero title, e.g. "昼のお品書き"
  lead: string; // one lead sentence
  items: MenuItem[];
  notes?: string[]; // ご案内(営業時間・宴会・予算目安など)。一覧の下に表示
};

export type FoodSlug = "lunch" | "dinner" | "course";

export type FoodCategory = MenuSection & {
  slug: FoodSlug;
  label: string; // TOP scroll header, e.g. "昼 ／ LUNCH"
};

export type DrinkCategory = MenuSection;

// 価格の実データ出典: gumon.owst.jp(公式・2026-07-03取得)。判明3品(酢豚・小籠包・
// 海老マヨ/チリ)は実価格。それ以外の品目・価格はオーナーの実メニュー原本待ち
// (wdos-diagnosis-002 残課題#6)。確定次第ここを差し替える。
export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    slug: "lunch",
    label: "昼 ／ LUNCH",
    titleEn: "LUNCH",
    titleJp: "昼のお品書き",
    lead: "昼は軽やかに、一皿で満たされる中国料理を。",
    items: [
      { name: "排骨担々麺", price: "¥1,800", desc: "胡麻香る担々スープ、辛さ控えめ", spicy: 1 },
      { name: "海老のチリソース定食", price: "¥2,200", desc: "ぷりっと海老の自家製チリ" },
      { name: "炒飯と点心のセット", price: "¥1,600", desc: "香港式焼売と海老蒸し餃子を添えて" },
      { name: "週替わりの定食", price: "¥1,500", desc: "季節の素材で仕立てる日替わりの一皿" },
    ],
    notes: [
      "昼の営業は 11:30–15:00(L.O.14:30)です。",
      "メニューは仕入れにより変わることがあります。最新のお品書きは店頭・お電話でご確認ください。",
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
        price: "価格は店舗へ",
        desc: "四川山椒の痺れと豆板醤のコク、看板の一皿",
        signature: true,
        spicy: 2,
        img: "/mapo-tofu.webp",
      },
      {
        name: "酢豚",
        price: "¥980",
        desc: "黒酢のコクと照り。火の入れ方が身上の定番",
        recommended: true,
      },
      {
        name: "海老マヨ・海老チリ",
        price: "¥780",
        desc: "ぷりっと海老を、まろやかに、または自家製チリで",
        recommended: true,
        spicy: 1,
      },
      {
        name: "小籠包",
        price: "¥480",
        desc: "薄皮に閉じ込めた熱い餡と湯気",
        recommended: true,
      },
      { name: "青菜の炒めもの", price: "価格は店舗へ", desc: "季節の青菜をにんにくと強火でさっと" },
    ],
    notes: [
      "夜のご予算の目安は、おおよそ¥3,000〜4,000です。",
      "夜の営業は 18:00–23:30(L.O.23:00)。ご宴会のご相談も承ります。",
    ],
  },
  {
    slug: "course",
    label: "コース ／ COURSE",
    titleEn: "COURSE",
    titleJp: "コース",
    lead: "前菜から主菜まで。問いを重ねた一夜の流れ。",
    items: [
      {
        name: "季節の宴会コース(飲み放題付き)",
        price: "ご予算に応じて",
        desc: "人数・ご予算に合わせて仕立てます。ご宴会・貸切のご相談もどうぞ",
      },
      {
        name: "おまかせの一卓",
        price: "ご相談ください",
        desc: "その日の素材で組む、おまかせの流れ。お電話にてご相談ください",
      },
    ],
    notes: [
      "コースの内容・価格はお電話にてご相談ください。072-430-6038",
      "飲み放題付きの宴会コースをご用意しています。",
    ],
  },
];

// price は仮のプレースホルダー。実価格が決まり次第ここを置き換える。
export const DRINKS: DrinkCategory = {
  titleEn: "DRINK",
  titleJp: "飲み物",
  lead: "一皿に、寄り添う一杯を。紹興酒から中国茶まで。",
  items: [
    { name: "紹興酒", price: "価格は店舗へ", desc: "十年熟成を中心に\n常温・温めでも" },
    { name: "ワイン", price: "価格は店舗へ", desc: "料理に寄り添う\n自然派を少量ずつ" },
    { name: "中国茶", price: "価格は店舗へ", desc: "岩茶・白茶など\n食後の余韻に" },
    { name: "ソフトドリンク", price: "価格は店舗へ", desc: "自家製の\n季節のドリンク" },
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
