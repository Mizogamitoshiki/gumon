"use client";

import { useRef } from "react";
import type { MenuSection } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_MOTION } from "@/lib/motion-tokens";

// 料理・飲み物 詳細ページのヒーロー。titleJp(LCP要素)は即時描画し、
// 通過中は背景(壁テクスチャ)と前景で速度差を付けて奥行きを出す。
export default function MenuHero({ category }: { category: MenuSection }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // タイトル(h1)= LCP要素はアニメ対象外で初回描画から可視 — MOT-7(LCP要素への
      // 入場アニメ禁止)。従来の「fonts.ready まで autoAlpha:0 で伏せて文字せり上げ」は
      // LCP を約3秒へ遅延させていた(perf-measurement-001)。入場演出は副次要素
      // ([data-hero-fade] = eyebrow/リード/cue)のみに残す。
      gsap.from(
        gsap.utils.toArray<HTMLElement>("[data-hero-fade]", section),
        {
          autoAlpha: 0,
          y: 18,
          duration: GUMON_MOTION.duration,
          stagger: GUMON_MOTION.stagger,
          ease: GUMON_MOTION.easeEmphasis,
          delay: 0.2,
        },
      );

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
