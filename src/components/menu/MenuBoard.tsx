"use client";

import { useRef } from "react";
import Link from "next/link";
import type { MenuSection } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_MOTION } from "@/lib/motion-tokens";
import { HOTPEPPER_URL } from "@/lib/site";

const SERIF = "var(--font-noto-serif-jp), serif";

// 他カテゴリへの導線(表示中カテゴリは除外して出す)
const BOARD_LINKS = [
  { titleEn: "LUNCH", href: "/menu/lunch", label: "昼のお品書き" },
  { titleEn: "DINNER", href: "/menu/dinner", label: "夜のお品書き" },
  { titleEn: "COURSE", href: "/menu/course", label: "コース・宴会" },
  { titleEn: "DRINK", href: "/menu/drink", label: "飲み物" },
] as const;

// お品書きボード(1 カテゴリ=1 ページ)。参考メニュー表の構成を GUMON の
// パレットに翻訳したもの: 額縁+コーナーマーク、リボン見出し、点線価格、
// コースは紙(アイボリー)カード、締めの一枚、注記、電話 CTA。
export default function MenuBoard({ category }: { category: MenuSection }) {
  const rootRef = useRef<HTMLElement>(null);
  const isCourse = category.titleEn === "COURSE";
  const others = BOARD_LINKS.filter((l) => l.titleEn !== category.titleEn);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = rootRef.current;
        if (!root) return;

        // ボードの額縁: 近づいたら静かに現す
        gsap.from(".gm-board-frame", {
          autoAlpha: 0,
          y: 26,
          duration: GUMON_MOTION.durationLong,
          ease: GUMON_MOTION.ease,
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        });
        // MENU 見出し: 行マスクのせり上がり
        gsap.from(".gm-board-title .mask > span", {
          yPercent: 115,
          duration: GUMON_MOTION.durationLong,
          ease: GUMON_MOTION.easeEmphasis,
          scrollTrigger: { trigger: root, start: "top 74%", once: true },
        });
        // リボン → 行の順に連鎖
        const sec = root.querySelector(".gm-board-sec");
        if (sec) {
          const tl = gsap.timeline({
            defaults: { ease: GUMON_MOTION.ease },
            scrollTrigger: { trigger: sec, start: "top 84%", once: true },
          });
          tl.from(sec.querySelector(".gm-board-ribbon"), {
            autoAlpha: 0,
            y: 16,
            duration: GUMON_MOTION.duration,
          });
          tl.from(
            sec.querySelectorAll(".gm-board-row, .gm-board-card"),
            {
              autoAlpha: 0,
              y: 20,
              duration: GUMON_MOTION.duration,
              stagger: 0.07,
            },
            0.15,
          );
        }
        // 締めの料理写真: clip-path 展開 + 1.06 → 等倍
        gsap.utils
          .toArray<HTMLElement>(".gm-board-photo", root)
          .forEach((el) => {
            gsap.from(el, {
              clipPath: "inset(12% 8% 12% 8%)",
              scale: 1.06,
              duration: 1.3,
              ease: GUMON_MOTION.easeEmphasis,
              scrollTrigger: { trigger: el, start: "top 84%", once: true },
            });
          });
        // 導線 + CTA
        gsap.from(
          gsap.utils.toArray<HTMLElement>(
            ".gm-board-others, .gm-board-cta",
            root,
          ),
          {
            autoAlpha: 0,
            y: 20,
            duration: GUMON_MOTION.duration,
            ease: GUMON_MOTION.ease,
            stagger: GUMON_MOTION.stagger,
            scrollTrigger: {
              trigger: ".gm-board-others",
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="gm-board"
      aria-label={`お品書き ${category.titleJp}`}
    >
      <div className="gm-board-frame gm-board-frame-single">
        {/* 見出し: MENU */}
        <header className="gm-board-head">
          <p className="gm-detail-eyebrow gm-board-eyebrow">MENU</p>
          <h2 className="gm-board-title">
            <span className="mask">
              <span>お品書き</span>
            </span>
          </h2>
          <span className="gm-board-head-rule" aria-hidden="true" />
        </header>

        <section className="gm-board-sec">
          <h3 className="gm-board-ribbon is-current">
            <span className="gm-board-ribbon-jp">{category.titleJp}</span>
            <span className="gm-board-ribbon-en">{category.titleEn}</span>
          </h3>

          {isCourse ? (
            // コースは紙カード(参考デザインの紙面をアイボリーで翻訳)
            <div className="gm-board-cards">
              {category.items.map((d) => (
                <article key={d.name} className="gm-board-card">
                  <div className="gm-board-card-line">
                    <h4 className="gm-board-card-name">{d.name}</h4>
                    <p className="gm-board-card-price">{d.price}</p>
                  </div>
                  {d.desc && <p className="gm-board-card-desc">{d.desc}</p>}
                </article>
              ))}
            </div>
          ) : (
            <div className="gm-board-rows">
              {category.items.map((d) => (
                <div key={d.name} className="gm-board-row">
                  <div className="gm-menu-line">
                    {d.img && (
                      <span
                        className="gm-menu-thumb"
                        aria-hidden="true"
                        style={{ backgroundImage: `url(${d.img})` }}
                      />
                    )}
                    <span className="gm-menu-name gm-board-name">
                      {d.name}
                      {d.signature && <span className="gm-menu-sig">看板</span>}
                    </span>
                    <span className="gm-menu-dots" aria-hidden="true" />
                    <span className="gm-menu-price gm-board-price">
                      {d.price}
                    </span>
                  </div>
                  {d.desc && (
                    <p
                      className="gm-menu-desc gm-board-desc"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {d.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {category.notes && category.notes.length > 0 && (
            <div className="gm-board-notes">
              {category.notes.map((n) => (
                <p key={n} className="gm-menu-note">
                  {n}
                </p>
              ))}
            </div>
          )}
        </section>

        {/* 締めの一枚(全皿の広がり) */}
        <div className="gm-board-photo" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dishes.webp" alt="" loading="lazy" decoding="async" />
        </div>

        {/* 共通注記 */}
        <div className="gm-board-foot">
          <p className="gm-menu-note">
            ※ 仕入れ状況により内容が変わることがあります。
          </p>
          <p className="gm-menu-note">
            ※ 最新のお品書き・価格は店頭またはお電話でご確認ください。
          </p>
        </div>

        {/* 他カテゴリへの導線 */}
        <nav className="gm-board-others" aria-label="ほかのお品書き">
          <p className="gm-detail-eyebrow gm-board-others-head">
            ほかのお品書き
          </p>
          <div className="gm-board-others-links">
            {others.map((l) => (
              <Link key={l.href} href={l.href} className="gm-detail-link">
                {l.label}
                <span className="gm-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* 電話予約 CTA(朱はここだけ) */}
        <div className="gm-detail-cta gm-board-cta">
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
          <div className="gm-cta-web">
            <a
              href={HOTPEPPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gm-detail-link"
            >
              Webで予約する(ホットペッパーグルメ)
              <span className="gm-arrow" aria-hidden="true">
                →
              </span>
            </a>
            <p className="gm-cta-web-note">
              お電話でのご予約が、店にはいちばんありがたい方法です。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
