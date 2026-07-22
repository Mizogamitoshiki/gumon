// Single source of truth for menu data — shared by the home scroll page
// (GumonScroll) and the /menu/* detail pages. Framework-agnostic (no React).
//
// 品目データ(items)はBloom-lCMSの`menu` APIから取得し、ビルド前に
// scripts/sync-menu.mjs が src/lib/menu.generated.ts を再生成する(npm run dev/build のpreフック)。
// セクション見出し(titleEn/titleJp/lead/notes)は変更頻度が低いためこのファイルで静的管理する。
import { CMS_MENU_ITEMS } from "./menu.generated";

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

// 品目(items)はBloom-lCMSの`menu` API由来(CMS_MENU_ITEMS)。価格・説明・辛さ等の
// 更新は管理画面で行い、`npm run sync:menu`(または dev/build 実行時に自動)で反映する。
export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    slug: "lunch",
    label: "昼 ／ LUNCH",
    titleEn: "LUNCH",
    titleJp: "昼のお品書き",
    lead: "昼は軽やかに、一皿で満たされる中国料理を。",
    items: CMS_MENU_ITEMS.lunch,
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
    items: CMS_MENU_ITEMS.dinner,
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
    items: CMS_MENU_ITEMS.course,
    notes: [
      "コースの内容・価格はお電話にてご相談ください。072-430-6038",
      "飲み放題付きの宴会コースをご用意しています。",
    ],
  },
];

export const DRINKS: DrinkCategory = {
  titleEn: "DRINK",
  titleJp: "飲み物",
  lead: "一皿に、寄り添う一杯を。紹興酒から中国茶まで。",
  items: CMS_MENU_ITEMS.drink,
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
