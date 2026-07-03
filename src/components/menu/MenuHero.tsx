"use client";

import { useRef } from "react";
import type { FoodCategory } from "@/lib/menu";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap-setup";
import { splitText, type SplitTextResult } from "@/lib/split-text";
import { GUMON_MOTION } from "@/lib/motion-tokens";

// 料理詳細ページのヒーロー。titleJp を文字マスクでせり上げ、
// 通過中は背景(壁テクスチャ)と前景で速度差を付けて奥行きを出す。
export default function MenuHero({ category }: { category: FoodCategory }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitTextResult | null>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = sectionRef.current;
      const title = titleRef.current;
      if (!section || !title || !contextSafe) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Web フォント確定前に分割すると文字幅がズレるため、確定までは伏せておく
      gsap.set(title, { autoAlpha: 0 });

      // StrictMode の二重マウントでは fonts.ready の .then が「破棄済み effect の分」
      // まで発火する。stale 実行を許すと 2 本目の from() が「1 本目が隠した状態」を
      // 着地点として捕捉し、リード等が不可視のまま固まる。フラグで無効化する。
      let cancelled = false;

      const run = contextSafe(() => {
        if (cancelled || !titleRef.current || !sectionRef.current) return;

        splitRef.current = splitText(titleRef.current, { type: "chars" });
        gsap.set(titleRef.current, { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: GUMON_MOTION.easeEmphasis },
        });
        tl.from(
          splitRef.current.chars,
          {
            yPercent: 115,
            duration: GUMON_MOTION.durationLong,
            stagger: 0.045,
          },
          0.1,
        );
        tl.from(
          gsap.utils.toArray<HTMLElement>("[data-hero-fade]", sectionRef.current),
          {
            autoAlpha: 0,
            y: 18,
            duration: GUMON_MOTION.duration,
            stagger: GUMON_MOTION.stagger,
          },
          0.5,
        );

        // 分割で行高が確定した後、後続トリガーの位置を再計算
        ScrollTrigger.refresh();
      });
      document.fonts.ready.then(run);

      // ヒーロー通過中の視差(デスクトップのみ)。scrub 連動は等速が原則
      const mm = gsap.matchMedia();
      mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
        const st = {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        } as const;
        gsap.to(".gm-chero-bg", { yPercent: 14, ease: "none", scrollTrigger: { ...st } });
        gsap.to(".gm-chero-inner", { yPercent: -10, ease: "none", scrollTrigger: { ...st } });
      });

      return () => {
        cancelled = true;
        splitRef.current?.revert();
        splitRef.current = null;
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="gm-chero">
      <div className="gm-chero-bg" aria-hidden="true" />
      <div className="gm-chero-glow" aria-hidden="true" />
      <div className="gm-chero-inner">
        <p className="gm-detail-eyebrow gm-chero-eyebrow" data-hero-fade>
          {category.titleEn}
        </p>
        <h1 ref={titleRef} className="gm-chero-title">
          {category.titleJp}
        </h1>
        <p className="gm-chero-lead" data-hero-fade>
          {category.lead}
        </p>
      </div>
      <div className="gm-chero-cue gm-cue" aria-hidden="true" data-hero-fade>
        <span className="gm-chero-cue-line" />
      </div>
    </section>
  );
}
