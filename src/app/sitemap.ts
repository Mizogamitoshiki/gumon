import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { IS_RECRUITING } from "@/lib/recruit";

// lastModified は「本当に中身が変わった日」を返す。
// 全ページにビルド日時を入れると毎デプロイで全URLが更新扱いになり、
// クローラに対して信号が無意味になる(いずれ lastmod ごと無視される)。
//
//  - CMS 由来のページ: ビルド日時でよい。Bloom-lCMS の publish が Amplify の
//    Webhook を叩いて再ビルドするので、ビルド日時 ≒ 内容の更新日になる。
//  - 読み物ページ: 手で書き換えたときだけ下の定数を更新する。
const BUILT_AT = new Date();
const EDITORIAL_UPDATED = new Date("2026-08-18T00:00:00+09:00");

// 集客の主目的(ランチ・ディナー)を priority に反映
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    priority: number,
    lastModified: Date,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, BUILT_AT, "weekly"),
    page("/menu/lunch", 0.9, BUILT_AT, "weekly"),
    page("/menu/dinner", 0.9, BUILT_AT, "weekly"),
    page("/menu/course", 0.8, BUILT_AT),
    page("/menu/drink", 0.7, BUILT_AT),
    page("/access", 0.8, EDITORIAL_UPDATED),
    page("/calendar", 0.7, BUILT_AT, "weekly"), // 臨時休業の更新があるため weekly
    page("/about", 0.6, EDITORIAL_UPDATED),
    page("/contact", 0.6, EDITORIAL_UPDATED),
    ...(IS_RECRUITING ? [page("/recruit", 0.4, BUILT_AT)] : []),
  ];
}
