import type { MenuSection } from "@/lib/menu";
import MenuHero from "./MenuHero";
import DishGallery from "./DishGallery";
import DishShowcase from "./DishShowcase";
import MenuBoard from "./MenuBoard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const MENU_PATHS: Record<string, string> = {
  LUNCH: "/menu/lunch",
  DINNER: "/menu/dinner",
  COURSE: "/menu/course",
  DRINK: "/menu/drink",
};

// 料理・飲み物 詳細ページ本体。
// Hero(文字リビール + 視差) → 看板の品 → お品書きボード + 予約 CTA。
// editorial(Phase 17・現状 dinner のみ): 看板の品を縦型 Editorial の
// DishShowcase(pin なし・実写のみ)にし、ボードの Reveal を fade-quiet へ
// 弱化する。未指定ページは従来の DishGallery(pin 横流し)+ボードのまま —
// DOM・見た目・Motion は一切変わらない。
// brisk(Phase 19B・現状 lunch のみ): 「迷わず一皿を選ぶ」ための軽量 Editorial。
// 実写ゼロのプレースホルダギャラリーを外し、品書きを第2場面として軽快に
// 現す(pin なし)。dinner(editorial)・既定ページの分岐には触れない
export default function MenuDetailPage({
  category,
  editorial = false,
  brisk = false,
}: {
  category: MenuSection;
  editorial?: boolean;
  brisk?: boolean;
}) {
  return (
    // gm-editorial: dinner の Storytelling Pass 用スコープ(D2→D3→D4 の
    // 余白・着地を dinner 専用セレクタで調整する)。未指定ページは従来どおり
    <main
      className={`gm-cine-main${editorial ? " gm-editorial" : ""}${
        brisk ? " gm-brisk" : ""
      }`}
    >
      <BreadcrumbJsonLd
        trail={[
          {
            name: category.titleJp,
            path: MENU_PATHS[category.titleEn] ?? "/menu/dinner",
          },
        ]}
      />
      {editorial ? (
        // gm-stage: 夜の入口(Hero)〜一皿との対面(Showcase)を 1 つの
        // 画面固定ステージに層として重ね、サブシーンの重畳で場面をめくる
        // (kurukuru-web の scrTelling 機構の移植。2026-07-11)。
        // モバイル/RM/JS無効ではただの div — 従来の縦積みのまま
        <div className="gm-stage">
          {/* JS無効時: ステージの固定・絶対配置を解除して静的縦積みへ戻す */}
          <noscript>
            <style>{`
              .gm-editorial .gm-stage{height:auto!important;overflow:visible!important}
              .gm-editorial .gm-stage .gm-chero{position:relative!important;min-height:100svh!important}
              .gm-editorial .gm-shot{position:relative!important;inset:auto!important;height:auto!important;overflow:visible!important;padding:clamp(96px,16vh,176px) clamp(20px,5vw,40px) clamp(110px,18vh,200px)!important}
              .gm-editorial .gm-shot-intro{position:relative!important;inset:auto!important}
              .gm-editorial .gm-shot-panel{position:relative!important;inset:auto!important;margin:0 auto!important;max-width:880px!important}
              .gm-editorial .gm-shot-frame{position:relative!important;inset:auto!important;aspect-ratio:4/3!important}
              .gm-editorial .gm-shot-caption{position:relative!important;left:auto!important;bottom:auto!important;transform:none!important;width:auto!important}
            `}</style>
          </noscript>
          <MenuHero category={category} />
          <DishShowcase items={category.items} titleEn={category.titleEn} />
        </div>
      ) : brisk ? (
        // brisk(lunch): 実写ゼロのためギャラリーは置かない(Plan B・削除テスト
        // 承認済み 19A-A1)。品名・価格・説明は MenuBoard に全件掲載されている
        <MenuHero category={category} />
      ) : (
        <>
          <MenuHero category={category} />
          <DishGallery
            items={category.items.slice(0, 4)}
            titleEn={category.titleEn}
          />
        </>
      )}
      <MenuBoard category={category} quiet={editorial} brisk={brisk} />
    </main>
  );
}
