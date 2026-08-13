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
 *   一列がひとつの見せ場なので、帯全体で 1 つのトリガーを持ち、
 *   下から上への clip-path 展開 → 1.06 倍から等倍へ → ブラー 10px から
 *   フォーカスへ、を 1 枚ずつ stagger で連鎖させる。その後はスクロールに
 *   従属した浅い視差（±3%・等速）。移動量は CLAUDE.md の 8〜40px に収める。
 *
 * モバイル(≤860px): 2 列 3 段に折り返り、下の段は初期表示の外に出る。
 *   帯で 1 つのトリガーにすると、見えていない下の段まで一度に動き終わって
 *   しまうので、**1 枚ずつ自前のトリガー**を持たせ、スクロールで現れる
 *   たびに展開する。同じ段の右側だけ半拍遅らせて、2 枚が同時に立ち上がら
 *   ないようにする。重い blur は省き（既存の lite 規約）、視差も浅く（±2%）。
 *
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

          // モバイル — 1 枚ずつ、自分が画面に入ったときに展開する。
          // トリガーは figure、動かすのは内側の枠と写真（トリガー要素自身を
          // visibility:hidden にしない＝位置計算に影響を与えない）。
          if (lite) {
            items.forEach((el, i) => {
              // 同じ段の右側を半拍あとに立ち上げ、2 枚が同時に動かないようにする
              const half = (i % 2) * 0.1;
              gsap
                .timeline({
                  defaults: { ease: "expo.out" },
                  scrollTrigger: { trigger: el, start: "top 92%", once: true },
                })
                .fromTo(
                  frames[i],
                  { autoAlpha: 0, y: 20, clipPath: "inset(100% 0% 0% 0%)" },
                  { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
                  half,
                )
                // blur は省くが、寄って止まる動きは残す（ブラーの代わりの奥行き）
                .fromTo(imgs[i], { scale: 1.05 }, { scale: 1, duration: 1.15 }, half);

              // 展開後の呼吸。デスクトップより浅く（±2%）
              const dir = i % 2 === 0 ? 1 : -1;
              gsap.fromTo(
                imgs[i],
                { yPercent: -2 * dir },
                {
                  yPercent: 2 * dir,
                  ease: "none",
                  scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              );
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
