"use client";

import { useRef } from "react";
import { DRINK_PHOTOS } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";

/**
 * 飲み物の見出し — 題字の直下に置く、文字のない一列。
 *
 * 銘柄名も価格も書かない(オーナー要望: 名称は不要)。棚の気配だけを先に
 * 見せ、読むための情報は下の紙のお品書き(CMS)へ渡す。写真は 3:4 で統一し、
 * 偶数番だけ少し下げて一列が「並べられた」ものに見えるようにする。
 *
 * 演出（デスクトップ・motion 可）:
 *   下から上への clip-path 展開 → 1.06 倍から等倍へ → ブラー 10px から
 *   フォーカスへ。1 枚ずつ stagger で連鎖し、その後はスクロールに従属した
 *   ごく浅い視差（±3%・等速）が続く。移動量は CLAUDE.md の 8〜40px に収める。
 * モバイル(≤860px): blur と視差を省き、fade + y16 の骨格だけ残す。
 * reduced-motion: 何も仕込まない（SSR のまま静止画として並ぶ）。
 */
export default function DrinkShowcase() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          full: "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
          lite: "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const lite = !!ctx.conditions?.lite;
          const items = gsap.utils.toArray<HTMLElement>(".gm-dshow-item", root);
          const frames = items.map((el) => el.querySelector(".gm-dshow-frame"));
          const imgs = items.map((el) => el.querySelector(".gm-dshow-img"));

          // 骨格（軽量版）— 気配だけの fade-up
          if (lite) {
            gsap.from(items, {
              autoAlpha: 0,
              y: 16,
              duration: 1,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: root, start: "top 88%", once: true },
            });
            return;
          }

          // 本演出 — 幕が上がる（clip-path）→ 等倍へ寄る → 焦点が合う
          const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: root, start: "top 84%", once: true },
          });
          tl.fromTo(
            items,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12 },
            0,
          );
          tl.fromTo(
            frames,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.12 },
            0,
          );
          tl.fromTo(
            imgs,
            { scale: 1.06, filter: "blur(10px)" },
            { scale: 1, filter: "blur(0px)", duration: 1.4, stagger: 0.12 },
            0,
          );

          // 見せ切ったあとの呼吸 — 浅い視差。1 枚おきに向きを違えて奥行きを出す
          // （等速＝スクロールへの従属。scrub 連動の原則）
          imgs.forEach((img, i) => {
            if (!img) return;
            const dir = i % 2 === 0 ? 1 : -1;
            gsap.fromTo(
              img,
              { yPercent: -3 * dir },
              {
                yPercent: 3 * dir,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="gm-dshow" aria-label="お飲み物">
      <div className="gm-dshow-strip">
        {DRINK_PHOTOS.map((p) => (
          <figure key={p.src} className="gm-dshow-item">
            <span className="gm-dshow-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                className="gm-dshow-img"
                width={900}
                height={1200}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </span>
          </figure>
        ))}
      </div>
    </section>
  );
}
