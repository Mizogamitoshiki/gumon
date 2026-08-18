"use client";

import { useRef } from "react";
import Link from "next/link";
import type { MenuItem, MenuSection } from "@/lib/menu";
import { getDrinkGroups } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import TableStage from "./TableStage";
import DrinkShowcase from "./DrinkShowcase";
import { GUMON_MOTION } from "@/lib/motion-tokens";
import { HOTPEPPER_URL } from "@/lib/site";

// 「紙のお品書き」— デザイン提案『お品書き Menu』を実サイトの 4 ページ構成
// （昼/夜/コース/飲み物）へ翻訳したもの。暗い面の上に生成りの紙面を一枚置き、
// 二重罫線・頭書き（愚問／御品書）・点線の品書き・朱の予約 CTA で構成する。
// 記載内容は CMS 由来（category）のまま。1 ページ＝1 カテゴリ。
//
// レイアウトはカテゴリで 3 通り:
//   - list : 昼/夜（品名 … 点線 … 価格 ＋ 説明）。夜は食卓の見せ場を先頭に置く
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
// anim=false: 飲み物は章（8 つ）単位で現すため、行そのものは演出対象にしない
function Row({ item, anim = true }: { item: MenuItem; anim?: boolean }) {
  return (
    <div className="gm-paper-row" {...(anim ? { "data-anim-item": "" } : {})}>
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
  const isDinner = category.titleEn === "DINNER";
  const rows = category.items;
  // 飲み物だけは紙のお品書きどおり章立て（ビール／焼酎／…）で組む
  const drinkGroups = isDrink ? getDrinkGroups() : [];
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

      /* 食卓の見せ場(全画面ステージ・写真の視差込み)は TableStage が担う。
         紙面側のサムネイルには視差を掛けない(84〜138px では枠から飛び出す) */
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <main ref={rootRef} className="gm-paper-page">
      <p className="gm-paper-eyebrow">GUMON — CHINESE CUISINE</p>
      <h1 className="gm-paper-h1">{category.titleJp}</h1>

      {/* 夜だけの見せ場（一卓を写した実写）。デスクトップでは全画面の紙芝居
          ステージ、モバイル/RM では静的な大判写真になる（TableStage 内で分岐） */}
      {/* 飲み物だけの見出し（文字のない一列）。読む情報は下の紙面が担う */}
      {isDrink && <DrinkShowcase />}

      {isDinner && (
        <TableStage
          src="/dinner-table.webp"
          alt="麻婆豆腐を中心に、点心や炒飯などを並べた愚問の夜の食卓"
          eyebrow="DINNER"
          title="夜の食卓"
        />
      )}

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

              {/* 品書き本体 */}
              {isCourse ? (
                <div className="gm-paper-cards">
                  {rows.map((item) => (
                    <article key={item.name} className="gm-paper-card" data-anim-item>
                      <p className="gm-paper-card-name">{item.name}</p>
                      <p className="gm-paper-card-price">{item.price}</p>
                      {item.desc && <p className="gm-paper-card-desc">{item.desc}</p>}
                    </article>
                  ))}
                </div>
              ) : isDrink ? (
                <div className="gm-paper-groups">
                  {drinkGroups.map(({ group, items }) => (
                    <section key={group.key} className="gm-paper-group" data-anim-item>
                      <h3 className="gm-paper-group-head">
                        <span className="gm-paper-group-jp">{group.titleJp}</span>
                        <span className="gm-paper-group-rule" aria-hidden="true" />
                        <span className="gm-paper-group-en">{group.titleEn}</span>
                      </h3>
                      {group.note && <p className="gm-paper-group-note">{group.note}</p>}
                      <div className="gm-paper-group-rows">
                        {items.map((item) => (
                          // 緑茶などは「お茶割り」「ソフトドリンク」の両方にあるため章名で一意にする
                          <Row key={`${group.key}-${item.name}`} item={item} anim={false} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="gm-paper-rows">
                  {rows.map((item) => (
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
        <a href="tel:0724306038" data-tel-from="menu-cta" className="gm-tel-btn">
          電話で予約する
        </a>
        <a href="tel:0724306038" data-tel-from="menu-cta" className="gm-detail-cta-tel">
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
