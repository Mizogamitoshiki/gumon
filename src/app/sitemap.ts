import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { IS_RECRUITING } from "@/lib/recruit";

// 集客の主目的(ランチ・ディナー)を priority に反映
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/menu/lunch", 0.9, "weekly"),
    page("/menu/dinner", 0.9, "weekly"),
    page("/menu/course", 0.8),
    page("/menu/drink", 0.7),
    page("/access", 0.8),
    page("/about", 0.6),
    page("/contact", 0.6),
    ...(IS_RECRUITING ? [page("/recruit", 0.4)] : []),
  ];
}
