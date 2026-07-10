"use client";

import { useRef } from "react";
import type { MenuItem } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_SCENE_MOTION } from "@/lib/motion-tokens";

// D2「看板との対面」— /menu/dinner 専用の Editorial variant(Phase 17)。
// 縦型・写真主役: 実写がある品だけを大判の額縁で見せる(Plan B)。
// プレースホルダは並べない(期待形成を薄めるため)。
// pin・横スクロール・進捗バー・水平パララックスは使わない(Phase 16基準)。
// 他メニューページは従来の DishGallery(gm-gal)のまま — 本コンポーネントと
// gm-shot クラス群は dinner からのみ参照され、共有CSSには触れない。
// 実写が増えたら menu.ts の img を埋めるだけで額縁が縦に増える。
export default function DishShowcase({
  items,
  titleEn,
}: {
  items: MenuItem[];
  titleEn: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const withPhoto = items.filter((i) => i.img);

  useGSAP(
    () => {
      // reduced-motion: 何も構築しない(静的な縦積みが SSR のまま読める)
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        if (!section) return;
        const SM = GUMON_SCENE_MOTION;

        // 見出し列: fade-quiet(8px・blurなし)
        gsap.from(
          gsap.utils.toArray<HTMLElement>(".gm-shot-intro > *", section),
          {
            autoAlpha: 0,
            y: SM.fadeQuiet.y,
            duration: SM.fadeQuiet.duration,
            ease: SM.fadeQuiet.ease,
            stagger: 0.09,
            scrollTrigger: { trigger: section, start: "top 78%", once: true },
          }
        );

        // 額縁: clip-reveal は1枚につき1回だけ(「対面」の瞬間。D3より強く、
        // TOP S4 のフィルムより弱い、このページ唯一のピーク)
        gsap.utils
          .toArray<HTMLElement>(".gm-shot-frame", section)
          .forEach((frame) => {
            gsap.from(frame, {
              clipPath: "inset(10% 8% 10% 8%)",
              scale: 1.06,
              duration: 1.3,
              ease: "expo.out",
              scrollTrigger: { trigger: frame, start: "top 80%", once: true },
            });
          });

        // キャプション: fade-quiet で静かに(読み優先)
        gsap.utils
          .toArray<HTMLElement>(".gm-shot-caption", section)
          .forEach((cap) => {
            gsap.from(Array.from(cap.children), {
              autoAlpha: 0,
              y: SM.fadeQuiet.y,
              duration: SM.fadeQuiet.duration,
              ease: SM.fadeQuiet.ease,
              stagger: 0.08,
              scrollTrigger: { trigger: cap, start: "top 85%", once: true },
            });
          });
      });
    },
    { scope: sectionRef }
  );

  // 実写ゼロ運用: 無理に視覚要素を置かず、セクションごと出さない
  if (withPhoto.length === 0) return null;

  return (
    <section ref={sectionRef} className="gm-shot" aria-label="看板の品">
      <header className="gm-shot-intro">
        <p className="gm-shot-en">SELECTION ／ {titleEn}</p>
        <h2 className="gm-shot-title">看板の品</h2>
      </header>

      {withPhoto.map((item) => (
        <article key={item.name} className="gm-shot-panel">
          <div className="gm-shot-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.img}
              alt={item.name}
              className="gm-shot-media"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
          <div className="gm-shot-caption">
            <h3 className="gm-shot-name">
              {item.name}
              {item.signature && <span className="gm-menu-sig">看板</span>}
              {item.recommended && (
                <span className="gm-menu-sig gm-badge-reco">おすすめ</span>
              )}
              {item.spicy && (
                <span className="gm-spicy" aria-label={`辛さレベル${item.spicy}`}>
                  {"辛".repeat(item.spicy)}
                </span>
              )}
            </h3>
            <p className="gm-shot-price">{item.price}</p>
            {item.desc && (
              <p className="gm-shot-desc" style={{ whiteSpace: "pre-line" }}>
                {item.desc}
              </p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
