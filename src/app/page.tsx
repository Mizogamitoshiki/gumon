import GumonIntro from "@/components/GumonIntro";
import GumonScroll from "@/components/GumonScroll";
import SiteFooterInfo from "@/components/SiteFooterInfo";
import { WEBSITE_JSONLD } from "@/lib/site";

export default function Home() {
  return (
    <>
      <GumonIntro />
      <GumonScroll />
      {/* 画面固定ステージの後ろに、検索エンジン/AI が読める店舗概要を通常フローで置く */}
      <SiteFooterInfo />
      {/* schema.org WebSite — 検索結果のサイト名を「中国料理 愚問」にするため(トップのみ) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
      />
    </>
  );
}
