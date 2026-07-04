"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_MOTION } from "@/lib/motion-tokens";

/**
 * 情報ページ(/about /access /contact /recruit)の 1 セクション。
 * 見出しは行マスクのせり上がり、罫線は左から、行([data-info-row])は
 * 下から順に小さな移動量で現す。地図・写真([data-info-clip])は
 * clip-path マスクの展開 + 1.06 → 等倍。reduced-motion では静的表示。
 */
export default function InfoSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        if (!section) return;

        gsap.from(section.querySelectorAll(".gm-info-title .mask > span"), {
          yPercent: 115,
          duration: GUMON_MOTION.durationLong,
          ease: GUMON_MOTION.easeEmphasis,
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        });
        gsap.from(section.querySelectorAll("[data-info-eyebrow]"), {
          autoAlpha: 0,
          y: 14,
          duration: GUMON_MOTION.duration,
          ease: GUMON_MOTION.ease,
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        });
        gsap.from(section.querySelectorAll("[data-info-rule]"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: GUMON_MOTION.durationLong,
          ease: GUMON_MOTION.easeEmphasis,
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });

        gsap.utils
          .toArray<HTMLElement>("[data-info-row]", section)
          .forEach((row) => {
            gsap.from(row, {
              autoAlpha: 0,
              y: 24,
              duration: GUMON_MOTION.duration,
              ease: GUMON_MOTION.ease,
              scrollTrigger: { trigger: row, start: "top 88%", once: true },
            });
          });

        gsap.utils
          .toArray<HTMLElement>("[data-info-clip]", section)
          .forEach((el) => {
            gsap.from(el, {
              clipPath: "inset(14% 10% 14% 10%)",
              scale: 1.06,
              duration: 1.3,
              ease: GUMON_MOTION.easeEmphasis,
              scrollTrigger: { trigger: el, start: "top 82%", once: true },
            });
          });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="gm-info-sec">
      <header className="gm-info-head">
        <p className="gm-detail-eyebrow" data-info-eyebrow>
          {eyebrow}
        </p>
        <h2 className="gm-info-title">
          <span className="mask">
            <span>{title}</span>
          </span>
        </h2>
      </header>
      <span className="gm-detail-rule gm-info-rule" data-info-rule />
      {children}
    </section>
  );
}
