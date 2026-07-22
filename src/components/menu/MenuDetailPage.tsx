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
// brisk(lunch)/consult(course)/calm(drink): 実写ゼロのプレースホルダ
// ギャラリーを置かないページの印(pin なし)。2026-07-22 ユーザー指示
// 「全て夜のお品書きの構成に統一」で、ボードの振付・場面句・CTA 余白は
// 4 variant とも dinner(quiet)と共通になった(MenuBoard 参照)。
// consult のみ notes 内 tel リンクと /contact 導線が付く(機能差)。
// dinner だけが gm-stage(写真ステージ)を持つのは、実写素材が
// 麻婆豆腐 1 枚しかないため(Plan B: 実写ゼロならセクション非表示)
export default function MenuDetailPage({
  category,
  editorial = false,
  brisk = false,
  consult = false,
  calm = false,
}: {
  category: MenuSection;
  editorial?: boolean;
  brisk?: boolean;
  consult?: boolean;
  calm?: boolean;
}) {
  return (
    // gm-editorial: dinner の Storytelling Pass 用スコープ(D2→D3→D4 の
    // 余白・着地を dinner 専用セレクタで調整する)。未指定ページは従来どおり
    <main
      className={`gm-cine-main${editorial ? " gm-editorial" : ""}${
        brisk ? " gm-brisk" : ""
      }${consult ? " gm-consult" : ""}${calm ? " gm-calm" : ""}`}
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
      ) : brisk || consult || calm ? (
        // brisk(lunch)/consult(course)/calm(drink): 実写ゼロのためギャラリーは
        // 置かない(Plan B・削除テスト承認済み 19A-A1 / 20A-A1 / Sprint-B)。
        // 品名・価格・説明は MenuBoard に全件掲載されている
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
      <MenuBoard
        category={category}
        quiet={editorial}
        brisk={brisk}
        consult={consult}
        calm={calm}
      />
    </main>
  );
}
