"use client";

import { useRef } from "react";
import Link from "next/link";
import type { MenuItem, MenuSection } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_MOTION } from "@/lib/motion-tokens";
import { HOTPEPPER_URL } from "@/lib/site";

// 「紙のお品書き」— デザイン提案『お品書き Menu』を実サイトの 4 ページ構成
// （昼/夜/コース/飲み物）へ翻訳したもの。暗い面の上に生成りの紙面を一枚置き、
// 二重罫線・頭書き（愚問／御品書）・点線の品書き・朱の予約 CTA で構成する。
// 記載内容は CMS 由来（category）のまま。1 ページ＝1 カテゴリ。
//
// レイアウトはカテゴリで 3 通り:
//   - list : 昼/夜（品名 … 点線 … 価格 ＋ 説明）。夜は img+signature を看板カードで先頭に
//   - card : コース（中央寄せの枠カード）
//   - drink: 飲み物（2 段組。それ以外は list と同じ行）
//
// 演出は控えめな fade-up の連鎖のみ（GUMON_MOTION）。reduced-motion は何も
// 仕込まず SSR のまま全文可読。電話予約ボタン（主行動）は演出対象に含めない。
const BOARD_LINKS = [
  { titleEn: "LUNCH", href: "/menu/lunch", label: "昼のお品書き" },
  { titleEn: "DINNER", href: "/menu/dinner", label: "夜のお品書き" },
  { titleEn: "COURSE", href: "/menu/course", label: "コース・宴会" },
  { titleEn: "DRINK", href: "/menu/drink", label: "飲み物" },
] as const;

function Badges({ item }: { item: MenuItem }) {
  return (
    <>
      {item.signature && <span className="gm-paper-tag">看板の品</span>}
      {item.recommended && <span className="gm-paper-tag">おすすめ</span>}
      {item.spicy && (
        <span className="gm-paper-spicy" aria-label={`辛さレベル${item.spicy}`}>
          {"辛".repeat(item.spicy)}
        </span>
      )}
    </>
  );
}

// 品名 … 点線 … 価格 ＋ 説明（昼/夜/飲み物の 1 行）
function Row({ item }: { item: MenuItem }) {
  return (
    <div className="gm-paper-row" data-anim-item>
      <div className="gm-paper-line">
        <span className="gm-paper-name">
          {item.name}
          <Badges item={item} />
        </span>
        <span className="gm-paper-dots" aria-hidden="true" />
        <span className="gm-paper-price">{item.price}</span>
      </div>
      {item.desc && (
        <p className="gm-paper-desc" style={{ whiteSpace: "pre-line" }}>
          {item.desc}
        </p>
      )}
    </div>
  );
}

export default function MenuPaper({
  category,
  consult = false,
}: {
  category: MenuSection;
  // consult（コース）: 品書きの下に /contact への静かな導線を添える
  consult?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const isCourse = category.titleEn === "COURSE";
  const isDrink = category.titleEn === "DRINK";
  // 看板カード（実写＋signature がある品。現状は夜の麻婆豆腐のみ）を先頭に
  const featured = category.items.filter((i) => i.signature && i.img);
  const rest = category.items.filter((i) => !(i.signature && i.img));
  const others = BOARD_LINKS.filter((l) => l.titleEn !== category.titleEn);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const D = GUMON_MOTION.duration;
        const E = GUMON_MOTION.ease;
        // 頭書き（暗い面）— 上部・初期表示内なので即座に静かに現す
        gsap.from(".gm-paper-eyebrow", {
          autoAlpha: 0,
          y: 14,
          duration: D,
          ease: E,
          delay: 0.15,
        });
        // 紙面が一枚、下から静かに立ち上がる
        gsap.from(".gm-paper", {
          autoAlpha: 0,
          y: 40,
          duration: GUMON_MOTION.durationLong,
          ease: E,
          scrollTrigger: { trigger: ".gm-paper", start: "top 85%", once: true },
        });
        // 紙の頭書き
        gsap.from(".gm-paper-head > *", {
          autoAlpha: 0,
          y: 16,
          duration: D,
          ease: E,
          stagger: 0.08,
          scrollTrigger: { trigger: ".gm-paper-head", start: "top 88%", once: true },
        });
        // 各章: 見出し（リボン）→ 品々の波状スタッガー
        root.querySelectorAll<HTMLElement>(".gm-paper-sec").forEach((sec) => {
          const tl = gsap.timeline({
            defaults: { ease: E },
            scrollTrigger: { trigger: sec, start: "top 82%", once: true },
          });
          const ribbon = sec.querySelector(".gm-paper-ribbon");
          if (ribbon) tl.from(ribbon, { autoAlpha: 0, y: 16, duration: D });
          const sub = sec.querySelectorAll(".gm-paper-sub, .gm-paper-lead");
          if (sub.length) tl.from(sub, { autoAlpha: 0, y: 12, duration: D, stagger: 0.06 }, 0.1);
          const items = sec.querySelectorAll("[data-anim-item]");
          if (items.length)
            tl.from(items, { autoAlpha: 0, y: 18, duration: D, stagger: 0.09 }, 0.18);
        });
        /* 看板の一皿（おすすめ料理）の写真リビール。
           2026-07-30: 紙お品書き刷新(5c7322d)で DishShowcase が削除され、
           看板の品も他の行と同じ fade-up になっていた。ユーザー要望により
           「おすすめの料理のスクロールアニメーション」を復元する。
           値は削除された DishShowcase の演出言語を踏襲(clip-path inset
           24%/18% からの展開 + scale 1.08→等倍)。ただし当時の全画面 pin
           ステージは紙一枚の意匠と衝突するため持ち込まず、紙面の中で
           窓が開くリビールに翻訳している。
           親の [data-anim-item] は fade-up 対象なので、写真自身の transform と
           競合しない(親=位置/不透明度、子=clip-path/scale) */
        root.querySelectorAll<HTMLElement>(".gm-paper-feature-img").forEach((img) => {
          gsap.from(img, {
            clipPath: "inset(24% 18% 24% 18%)",
            scale: 1.08,
            duration: 1.3,
            ease: GUMON_MOTION.easeEmphasis,
            scrollTrigger: { trigger: img, start: "top 86%", once: true },
          });
        });
        // 脚注・他ページ導線
        gsap.from(".gm-paper-foot > *", {
          autoAlpha: 0,
          y: 14,
          duration: D,
          ease: E,
          stagger: 0.08,
          scrollTrigger: { trigger: ".gm-paper-foot", start: "top 92%", once: true },
        });
        gsap.from(".gm-paper-others", {
          autoAlpha: 0,
          y: 18,
          duration: D,
          ease: E,
          scrollTrigger: { trigger: ".gm-paper-others", start: "top 90%", once: true },
        });
        // 予約 CTA: 電話ボタン（主行動）は演出対象から外し常に操作可能に保つ
        const cta = root.querySelector<HTMLElement>(".gm-paper-cta");
        if (cta) {
          const seq = Array.from(cta.children).filter(
            (c) => !c.classList.contains("gm-tel-btn"),
          );
          gsap.from(seq, {
            autoAlpha: 0,
            y: 16,
            duration: D,
            ease: E,
            stagger: GUMON_MOTION.stagger,
            scrollTrigger: { trigger: cta, start: "top 88%", once: true },
          });
        }
      });

      /* 視差(DishShowcase の ±6% 縦パララックス)は復元しない:
         現在の看板写真は 84〜128px のサムネイルで、±6% は約 8px の移動になり
         枠から飛び出して隙間・重なりを生む。写真を大きく据える設計に戻すなら
         そのときに併せて復活させる(判断を要するため今回は入れない) */
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <main ref={rootRef} className="gm-paper-page">
      <p className="gm-paper-eyebrow">GUMON — CHINESE CUISINE</p>
      <h1 className="gm-paper-h1">{category.titleJp}</h1>

      {/* 紙のお品書き（二重罫線の枠） */}
      <div className="gm-paper">
        <div className="gm-paper-frame">
          <div className="gm-paper-inner">
            {/* 紙の頭書き */}
            <header className="gm-paper-head">
              <p className="gm-paper-head-en">Chinese Restaurant</p>
              <p className="gm-paper-brand">愚　問</p>
              <p className="gm-paper-brand-sub">御 品 書</p>
              <span className="gm-paper-head-rule" aria-hidden="true" />
            </header>

            <section className="gm-paper-sec">
              <h2 className="gm-paper-ribbon">
                <span className="gm-paper-ribbon-rule" aria-hidden="true" />
                <span className="gm-paper-ribbon-jp">{category.titleJp}</span>
                <span className="gm-paper-ribbon-rule" aria-hidden="true" />
              </h2>
              <p className="gm-paper-sub">{category.titleEn}</p>
              {category.lead && <p className="gm-paper-lead">{category.lead}</p>}

              {/* 看板の一皿（実写＋signature。現状は夜の麻婆豆腐） */}
              {featured.map((item) => (
                <article key={item.name} className="gm-paper-feature" data-anim-item>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="gm-paper-feature-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="gm-paper-feature-body">
                    <div className="gm-paper-line">
                      <span className="gm-paper-name gm-paper-name-lg">
                        {item.name}
                        <Badges item={item} />
                      </span>
                      <span className="gm-paper-dots" aria-hidden="true" />
                      <span className="gm-paper-price">{item.price}</span>
                    </div>
                    {item.desc && (
                      <p className="gm-paper-desc" style={{ whiteSpace: "pre-line" }}>
                        {item.desc}
                      </p>
                    )}
                  </div>
                </article>
              ))}

              {/* 品書き本体 */}
              {isCourse ? (
                <div className="gm-paper-cards">
                  {rest.map((item) => (
                    <article key={item.name} className="gm-paper-card" data-anim-item>
                      <p className="gm-paper-card-name">{item.name}</p>
                      <p className="gm-paper-card-price">{item.price}</p>
                      {item.desc && <p className="gm-paper-card-desc">{item.desc}</p>}
                    </article>
                  ))}
                </div>
              ) : (
                <div className={`gm-paper-rows${isDrink ? " gm-paper-rows-2col" : ""}`}>
                  {rest.map((item) => (
                    <Row key={item.name} item={item} />
                  ))}
                </div>
              )}

              {/* カテゴリ別のご案内（営業時間・予算目安・コースのご相談など） */}
              {category.notes && category.notes.length > 0 && (
                <div className="gm-paper-notes" data-anim-item>
                  {category.notes.map((n) => (
                    <p key={n} className="gm-paper-note">
                      {n}
                    </p>
                  ))}
                </div>
              )}

              {/* コースのみ: ご質問への静かな導線 */}
              {consult && (
                <p className="gm-paper-contact-hint" data-anim-item>
                  <Link href="/contact" className="gm-detail-link">
                    ご予約・ご宴会についてのご質問
                    <span className="gm-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </p>
              )}
            </section>

            {/* 紙の脚注 */}
            <footer className="gm-paper-foot">
              <p className="gm-paper-note">
                ※ 仕入れ状況により内容・価格が変わることがあります。
              </p>
              <p className="gm-paper-note">
                ※ 最新のお品書きは店頭またはお電話でご確認ください。
              </p>
              <p className="gm-paper-sign">中国料理　愚問</p>
            </footer>
          </div>
        </div>
      </div>

      {/* 他カテゴリへの導線 */}
      <nav className="gm-paper-others" aria-label="ほかのお品書き">
        <p className="gm-detail-eyebrow gm-paper-others-head">ほかのお品書き</p>
        <div className="gm-paper-others-links">
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

      {/* 予約 CTA（朱はここだけ） */}
      <div className="gm-detail-cta gm-paper-cta">
        <p className="gm-detail-cta-lead">ご予約を承っております。</p>
        {/* 見た目は .gm-tel-btn(globals.css) が唯一の出典 */}
        <a href="tel:0724306038" className="gm-tel-btn">
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
        <div className="gm-cta-access">
          <Link href="/access" className="gm-detail-link">
            アクセスを見る — 貝塚駅 徒歩10分
            <span className="gm-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
