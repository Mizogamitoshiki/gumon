"use client";

import { useRef } from "react";
import type { MenuItem } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_MOTION } from "@/lib/motion-tokens";

// CSS の @media (min-width: 861px) と必ず一致させること(globals.css の .gm-gal)
const DESKTOP = "(min-width: 861px)";

// 看板の品を横流しで見せるギャラリー。
// デスクトップ: セクションをピンし、縦スクロールをトラックの横移動へ変換。
//   パネル内の写真は containerAnimation 経由の視差でわずかに逆走させる。
// モバイル / reduced-motion: 何も構築しない(CSS の縦積みがそのまま使われる)。
export default function DishGallery({
  items,
  titleEn,
}: {
  items: MenuItem[];
  titleEn: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${DESKTOP} and (prefers-reduced-motion: no-preference)`, () => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        // 「トラック全幅 − 画面幅」= 横に動かすべき距離
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const scrollTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // 横移動の進捗バー(ピン中の現在地)
        gsap.to(".gm-gal-progress-fill", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: true,
          },
        });

        // イントロ列: セクションが近づいたら静かに現す
        gsap.from(gsap.utils.toArray<HTMLElement>(".gm-gal-intro > *", section), {
          autoAlpha: 0,
          y: 20,
          duration: GUMON_MOTION.duration,
          ease: GUMON_MOTION.ease,
          stagger: GUMON_MOTION.stagger,
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
        });

        gsap.utils.toArray<HTMLElement>(".gm-gal-frame", track).forEach((frame) => {
          // 額縁: クリップの展開 + 1.06 → 等倍(横移動内の位置で判定)
          gsap.from(frame, {
            clipPath: "inset(10% 8% 10% 8%)",
            scale: 1.06,
            duration: 1.3,
            ease: GUMON_MOTION.easeEmphasis,
            scrollTrigger: {
              trigger: frame,
              containerAnimation: scrollTween,
              start: "left 95%",
              toggleActions: "play none none reverse",
            },
          });

          // 写真: トラックとわずかに速度差を付ける(±5%)。額縁からはみ出す分は
          // .gm-gal-media の左右ののりしろ(7%)で吸収する
          const media = frame.querySelector<HTMLElement>(".gm-gal-media");
          if (media) {
            gsap.fromTo(
              media,
              { xPercent: -5 },
              {
                xPercent: 5,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  containerAnimation: scrollTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          }
        });

        // キャプション: 一皿ぶんの間を置いて連鎖的に
        gsap.utils.toArray<HTMLElement>(".gm-gal-caption", track).forEach((cap) => {
          gsap.from(Array.from(cap.children), {
            autoAlpha: 0,
            y: 24,
            duration: GUMON_MOTION.duration,
            ease: GUMON_MOTION.ease,
            stagger: 0.09,
            scrollTrigger: {
              trigger: cap,
              containerAnimation: scrollTween,
              start: "left 78%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });

      // モバイル: ピンも視差もなし。縦積みの各パネルを軽く現すだけ
      mm.add(`(max-width: 860px) and (prefers-reduced-motion: no-preference)`, () => {
        const section = sectionRef.current;
        if (!section) return;
        gsap.utils
          .toArray<HTMLElement>(".gm-gal-intro, .gm-gal-panel", section)
          .forEach((el) => {
            gsap.from(el, {
              autoAlpha: 0,
              y: 24,
              duration: GUMON_MOTION.duration,
              ease: GUMON_MOTION.ease,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="gm-gal" aria-label="看板の品">
      <div ref={trackRef} className="gm-gal-track">
        <header className="gm-gal-intro">
          <p className="gm-gal-intro-en">SELECTION ／ {titleEn}</p>
          <h2 className="gm-gal-intro-title">看板の品</h2>
          <p className="gm-gal-intro-note">スクロールで、一皿ずつ。</p>
        </header>

        {items.map((item, i) => (
          <article key={item.name} className="gm-gal-panel">
            <div className="gm-gal-frame">
              {item.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.img}
                  alt={item.name}
                  className="gm-gal-media"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              ) : (
                <div className="gm-gal-media gm-gal-ph" aria-hidden="true">
                  <span className="gm-gal-ph-char">{item.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="gm-gal-caption">
              <p className="gm-gal-no">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="gm-gal-name">
                {item.name}
                {item.signature && <span className="gm-menu-sig">看板</span>}
              </h3>
              <p className="gm-gal-price">{item.price}</p>
              {item.desc && (
                <p className="gm-gal-desc" style={{ whiteSpace: "pre-line" }}>
                  {item.desc}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="gm-gal-progress" aria-hidden="true">
        <span className="gm-gal-progress-fill" />
      </div>
    </section>
  );
}
