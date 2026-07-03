"use client";

import { useRef } from "react";
import type { FoodCategory } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_MOTION } from "@/lib/motion-tokens";

const SERIF = "var(--font-noto-serif-jp), serif";

// ギャラリー下のメニュー一覧 + 予約 CTA。
// 行マスクの見出し・罫線・行の順に、小さな移動量(≦24px)で連鎖的に現す。
export default function MenuList({ category }: { category: FoodCategory }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        if (!section) return;

        // 見出し: 行マスクのせり上がり
        gsap.from(".gm-mlist-title .mask > span", {
          yPercent: 115,
          duration: GUMON_MOTION.durationLong,
          ease: GUMON_MOTION.easeEmphasis,
          scrollTrigger: { trigger: ".gm-mlist-head", start: "top 85%", once: true },
        });
        gsap.from(".gm-mlist-eyebrow", {
          autoAlpha: 0,
          y: 14,
          duration: GUMON_MOTION.duration,
          ease: GUMON_MOTION.ease,
          scrollTrigger: { trigger: ".gm-mlist-head", start: "top 85%", once: true },
        });

        // 罫線: 左から引く
        gsap.from("[data-rule]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: GUMON_MOTION.durationLong,
          ease: GUMON_MOTION.easeEmphasis,
          scrollTrigger: { trigger: "[data-rule]", start: "top 90%", once: true },
        });

        // 各行 + CTA: 下から順にひとつずつ
        gsap.utils
          .toArray<HTMLElement>(".gm-menu-row, .gm-detail-cta", section)
          .forEach((row) => {
            gsap.from(row, {
              autoAlpha: 0,
              y: 24,
              duration: GUMON_MOTION.duration,
              ease: GUMON_MOTION.ease,
              scrollTrigger: { trigger: row, start: "top 88%", once: true },
            });
          });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="gm-mlist">
      <div className="gm-mlist-inner">
        <header className="gm-mlist-head">
          <p className="gm-detail-eyebrow gm-mlist-eyebrow">{category.titleEn} — MENU</p>
          <h2 className="gm-mlist-title">
            <span className="mask">
              <span>お品書き 一覧</span>
            </span>
          </h2>
        </header>

        <span className="gm-detail-rule" data-rule />

        <div className="gm-detail-list">
          {category.items.map((d) => (
            <article key={d.name} className="gm-menu-row">
              <div className="gm-menu-line">
                {d.img && (
                  <span
                    className="gm-menu-thumb"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${d.img})` }}
                  />
                )}
                <span className="gm-menu-name">
                  {d.name}
                  {d.signature && <span className="gm-menu-sig">看板</span>}
                </span>
                <span className="gm-menu-dots" aria-hidden="true" />
                <span className="gm-menu-price">{d.price}</span>
              </div>
              {d.desc && <p className="gm-menu-desc">{d.desc}</p>}
            </article>
          ))}
        </div>

        <div className="gm-detail-cta">
          <p className="gm-detail-cta-lead">ご予約を承っております。</p>
          <a
            href="tel:0724306038"
            className="gm-tel-btn"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#b23a2e",
              color: "#f2f0eb",
              fontFamily: SERIF,
              fontSize: 15,
              letterSpacing: ".16em",
              padding: "15px 46px",
            }}
          >
            電話で予約する
          </a>
          <a href="tel:0724306038" className="gm-detail-cta-tel">
            072-430-6038
          </a>
        </div>
      </div>
    </section>
  );
}
