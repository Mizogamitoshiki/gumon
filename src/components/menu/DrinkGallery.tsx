"use client";

import { useRef } from "react";
import { DRINK_PHOTOS } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_MOTION } from "@/lib/motion-tokens";

/**
 * 飲み物の「おすすめ」— 店内で撮った実写を、紙のお品書きの下に添える。
 *
 * 価格・在庫は書かない(上の品書き=CMS が唯一の出典)。ここが担うのは
 * 「棚に何があるか」の気配だけ。写真は 3:4 で統一し、暗い面の上に
 * 生成りの縁を持たない素の板として置く。
 *
 * 演出は他ページと同じ控えめな fade-up の連鎖のみ。reduced-motion では
 * 何も仕込まず SSR のまま全文可読(CLAUDE.md の RM 尊重規定)。
 */
export default function DrinkGallery() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const D = GUMON_MOTION.duration;
        const E = GUMON_MOTION.ease;
        const tl = gsap.timeline({
          defaults: { ease: E },
          scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
        });
        tl.from(".gm-dgal-head > *", { autoAlpha: 0, y: 14, duration: D, stagger: 0.08 });
        // 写真は 1 枚ずつ、わずかに縮尺を戻しながら現す(1.04 → 等倍)
        tl.from(
          ".gm-dgal-item",
          { autoAlpha: 0, y: 22, scale: 1.04, duration: D, stagger: 0.09 },
          0.16,
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="gm-dgal" aria-label="おすすめの飲み物">
      <header className="gm-dgal-head">
        <p className="gm-detail-eyebrow">おすすめ ／ RECOMMENDED</p>
        <p className="gm-dgal-lead">その日の棚から、一杯を選んでください。</p>
      </header>

      <div className="gm-dgal-grid">
        {DRINK_PHOTOS.map((p) => (
          <figure key={p.src} className="gm-dgal-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.alt}
              className="gm-dgal-img"
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <figcaption className="gm-dgal-cap">
              <span className="gm-dgal-title">{p.title}</span>
              <span className="gm-dgal-note">{p.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
