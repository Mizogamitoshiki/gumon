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
  // 飲み物のみ: 紙のお品書きの章(BEER / SHOCHU / …)。見出しの文言は DRINK_GROUPS 側が出典
  group?: string;
  desc?: string;
  // CMS のスキーマ側にある印。UI ではバッジ表示していない(文言を出さない方針)
  signature?: boolean;
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
      // 「飲み放題付き」は各コースの品名が持つため、ここでは繰り返さない。
      // 時間・杯数などの条件は店ごとに変わるので、断らずお電話へ寄せる
      "飲み放題の時間・内容は、お電話でご確認ください。",
    ],
  },
];

export const DRINKS: DrinkCategory = {
  titleEn: "DRINK",
  titleJp: "飲み物",
  lead: "一皿に、寄り添う一杯を。ビールから紹興酒、お茶割りまで。",
  items: CMS_MENU_ITEMS.drink,
};

// 飲み物の章立て。品目(items)は CMS 側の `group` で各章に振り分けられ、
// 見出し・TOP の一行・注記だけをここで静的に持つ(食事の titleJp/lead と同じ扱い)。
export type DrinkGroup = {
  key: string; // CMS の group 値
  titleJp: string;
  titleEn: string;
  lead: string; // TOP の飲み物ビートで品名の下に添える一行
  note?: string; // 章の注記(紙のお品書きに書かれている但し書き)
};

export const DRINK_GROUPS: DrinkGroup[] = [
  { key: "BEER", titleJp: "ビール", titleEn: "BEER", lead: "生と瓶、そして青島。" },
  { key: "SHOCHU", titleJp: "焼酎", titleEn: "SHOCHU", lead: "麦と芋、本日の一本も。" },
  { key: "WHISKY", titleJp: "ウイスキー", titleEn: "WHISKY", lead: "角と、知多。" },
  { key: "OTHER", titleJp: "その他", titleEn: "OTHER", lead: "紹興酒、杏露酒、梅酒。" },
  { key: "SOUR", titleJp: "チューハイ", titleEn: "SOUR", lead: "プレーン、梅、リンゴ酢。" },
  {
    key: "TEA-SHOCHU",
    titleJp: "お茶割り",
    titleEn: "TEA-SHOCHU",
    lead: "緑茶、ジャスミン、コーン茶。",
  },
  {
    key: "GIN",
    titleJp: "ジン",
    titleEn: "GIN",
    lead: "日本と世界のクラフトジン。",
    note: "カウンター後ろからお選びください。",
  },
  {
    key: "SOFTDRINK",
    titleJp: "ソフトドリンク",
    titleEn: "SOFT DRINK",
    lead: "コーラ、オレンジ、お茶各種。",
  },
];

// 飲み物ページ頭の写真(店内で撮影した実写)。題字の直下に文字なしで並べる。
// 銘柄名・価格・在庫は画面に出さない(棚の中身は日々変わるため。読むための
// 情報の出典は下の品書き=CMS のまま)。alt だけは読み上げのために残す。
export type DrinkPhoto = {
  src: string;
  alt: string;
};

export const DRINK_PHOTOS: DrinkPhoto[] = [
  {
    src: "/drink-gin.webp",
    alt: "カウンターに並んだ11本のクラフトジン。国産の瀬戸内・桜尾・KOMASA から、ヘンドリックス、ノルデス、マルフィまで",
  },
  {
    src: "/drink-tsingtao.webp",
    alt: "冷えた青島ビールの瓶と、その後ろに置かれた青島ビールのケース",
  },
  {
    src: "/drink-shochu.webp",
    alt: "若潮酒造(鹿児島・志布志)の焼酎3本。樽熟成焼酎「歩く一日」、Cool Mint Green、WARU WARU ÷ IMO PLAY!",
  },
  {
    src: "/drink-liqueur.webp",
    alt: "イラストのラベルが並ぶ和リキュール3本。中央は MUGY、その両脇に赤と緑のラベルの一本ずつ",
  },
  {
    src: "/drink-shelf.webp",
    alt: "店内の棚。上段にジンが並び、下段に桂花陳酒・ウイスキー・梅酒などが置かれている",
  },
];

// 章の定義順に items を束ねる。CMS に品目が 1 つも無い章は落とす(空の見出しを出さない)。
// どの章にも属さない品目(group 未設定)は最後に「その他」としてまとめ、取りこぼしを防ぐ。
export const getDrinkGroups = (): { group: DrinkGroup; items: MenuItem[] }[] => {
  const items = DRINKS.items;
  const grouped = DRINK_GROUPS.map((group) => ({
    group,
    items: items.filter((it) => it.group === group.key),
  })).filter((g) => g.items.length > 0);

  const known = new Set(DRINK_GROUPS.map((g) => g.key));
  const rest = items.filter((it) => !it.group || !known.has(it.group));
  if (rest.length > 0) {
    grouped.push({
      group: { key: "__rest", titleJp: "その他", titleEn: "OTHER", lead: "" },
      items: rest,
    });
  }
  return grouped;
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
