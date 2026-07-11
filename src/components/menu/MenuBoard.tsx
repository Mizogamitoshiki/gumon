"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  FOOD_CATEGORIES,
  DRINKS,
  type MenuItem,
  type MenuSection,
} from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";
import { GUMON_MOTION, GUMON_SCENE_MOTION } from "@/lib/motion-tokens";
import { HOTPEPPER_URL } from "@/lib/site";

const SERIF = "var(--font-noto-serif-jp), serif";

// 他カテゴリへの導線(表示中カテゴリは除外して出す)
const BOARD_LINKS = [
  { titleEn: "LUNCH", href: "/menu/lunch", label: "昼のお品書き" },
  { titleEn: "DINNER", href: "/menu/dinner", label: "夜のお品書き" },
  { titleEn: "COURSE", href: "/menu/course", label: "コース・宴会" },
  { titleEn: "DRINK", href: "/menu/drink", label: "飲み物" },
] as const;

// 横断検索用の全品目(カテゴリ名付き)
const ALL_SECTIONS: MenuSection[] = [...FOOD_CATEGORIES, DRINKS];
const hrefOf = (titleEn: string) =>
  BOARD_LINKS.find((l) => l.titleEn === titleEn)?.href ?? "/menu/dinner";

// notes 内の電話番号だけを押せるリンクにする(表示文言は 1 字も変えない)。
// 番号を含まない note(現状 course 以外の全 note)は従来どおり文字列のまま
const TEL_DISPLAY = "072-430-6038";
const TEL_HREF = "tel:0724306038";
function renderNote(text: string) {
  if (!text.includes(TEL_DISPLAY)) return text;
  const [before, after] = text.split(TEL_DISPLAY);
  return (
    <>
      {before}
      <a href={TEL_HREF} className="gm-note-tel">
        {TEL_DISPLAY}
      </a>
      {after}
    </>
  );
}

function matches(item: MenuItem, q: string): boolean {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  return (
    item.name.toLowerCase().includes(t) ||
    (item.desc ?? "").toLowerCase().includes(t)
  );
}

// お品書きボード(1 カテゴリ=1 ページ)。参考メニュー表の構成を GUMON の
// パレットに翻訳したもの: 額縁+コーナーマーク、リボン見出し、点線価格、
// コースは紙(アイボリー)カード、締めの一枚、注記、電話 CTA。
// 検索(全カテゴリ横断)と「おすすめのみ」絞り込みに対応。
// quiet(Phase 17・現状 dinner のみ): Reveal を fade-quiet 基準(8px・短め・
// power1.out)へ弱化する(読む区間は演出最弱 — CDE 6.4)。未指定ページは
// 従来値のまま一切変わらない。構造・DOM・機能は quiet でも不変。
export default function MenuBoard({
  category,
  quiet = false,
  brisk = false,
  consult = false,
}: {
  category: MenuSection;
  quiet?: boolean;
  // brisk(Phase 19B・lunch): 「迷わず選ぶ」ための軽快な登場。quiet(dinner の
  // 活気)より移動を小さく・連鎖を速く。既定/quiet 分岐には触れない
  brisk?: boolean;
  // consult(Phase 20B・course): 「相談できる」静けさ。全 Reveal を
  // fade-quiet(8px)まで弱化し、notes 内電話番号の tel リンクと /contact
  // 導線を足す。既定/quiet/brisk 分岐には触れない
  consult?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const isCourse = category.titleEn === "COURSE";
  const others = BOARD_LINKS.filter((l) => l.titleEn !== category.titleEn);

  const [query, setQuery] = useState("");
  const [recoOnly, setRecoOnly] = useState(false);
  const filtering = query.trim() !== "" || recoOnly;

  // 表示中カテゴリの絞り込み結果
  const visibleItems = useMemo(
    () =>
      category.items.filter(
        (d) => matches(d, query) && (!recoOnly || d.recommended || d.signature),
      ),
    [category.items, query, recoOnly],
  );
  // ほかのカテゴリでのヒット(検索時のみ提示する横断導線)
  const crossHits = useMemo(() => {
    if (!filtering) return [];
    return ALL_SECTIONS.filter((s) => s.titleEn !== category.titleEn)
      .map((s) => ({
        section: s,
        items: s.items.filter(
          (d) =>
            matches(d, query) && (!recoOnly || d.recommended || d.signature),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtering, query, recoOnly, category.titleEn]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // quiet(dinner)/brisk(lunch)/consult(course): モバイルは静的な縦構成
      // (演出なし)のためデスクトップのみ構築する。既定は従来どおり全幅で構築
      mm.add(
        quiet || brisk || consult
          ? "(min-width: 861px) and (prefers-reduced-motion: no-preference)"
          : "(prefers-reduced-motion: no-preference)",
        () => {
        const root = rootRef.current;
        if (!root) return;

        // quiet 時の弱化値(fade-quiet)。既定は従来値そのまま
        const rise = quiet ? GUMON_SCENE_MOTION.fadeQuiet.y : null;
        const dur = quiet ? GUMON_SCENE_MOTION.fadeQuiet.duration : null;
        const ez = quiet ? GUMON_SCENE_MOTION.fadeQuiet.ease : null;

        if (quiet) {
          // 活気の登場(dinner・2026-07-11): 額縁が一枚の札のように下から
          // 躍り上がり、章句→頭書き→道具→(この後リボン→品々)と波状に続く。
          // riseLine(速く出て柔らかく着地)で「賑わい」を、順序で「品」を保つ
          const SM = GUMON_SCENE_MOTION.riseLine;
          const enter = gsap.timeline({
            defaults: { ease: SM.ease },
            scrollTrigger: { trigger: root, start: "top 92%", once: true },
          });
          enter.from(
            ".gm-board-scene-cue",
            { autoAlpha: 0, y: 14, duration: SM.duration },
            0
          );
          enter.from(
            ".gm-board-frame",
            { autoAlpha: 0, y: 40, scale: 0.975, duration: 1.0 },
            0.06
          );
          enter.from(
            gsap.utils.toArray<HTMLElement>(
              ".gm-board-head > :not(.gm-board-title)",
              root
            ),
            { autoAlpha: 0, y: 18, duration: SM.duration, stagger: 0.09 },
            0.28
          );
          // 見出し「お品書き」は行マスクのせり上がりで(重複reveal回避のため
          // 頭書きのフェード対象から除外し、この位置で一度だけ)
          enter.from(
            ".gm-board-title .mask > span",
            {
              yPercent: 115,
              duration: GUMON_MOTION.durationLong,
              ease: GUMON_MOTION.easeEmphasis,
            },
            0.3
          );
          enter.from(
            gsap.utils.toArray<HTMLElement>(".gm-board-tools > *", root),
            { autoAlpha: 0, y: 16, duration: SM.duration, stagger: 0.08 },
            0.46
          );
        } else if (brisk) {
          // 軽快の登場(lunch・19B): 活気(quiet)より小さく・速く。額縁が
          // すっと持ち上がり、頭書き→見出しマスク→道具が短い波で続く。
          // トリガー位置は既定と同じ帯(top 78%) — 早出しはしない
          const SM = GUMON_SCENE_MOTION.riseLine;
          const enter = gsap.timeline({
            defaults: { ease: SM.ease },
            scrollTrigger: { trigger: root, start: "top 78%", once: true },
          });
          enter.from(
            ".gm-board-frame",
            { autoAlpha: 0, y: 28, scale: 0.985, duration: 0.8 },
            0
          );
          enter.from(
            gsap.utils.toArray<HTMLElement>(
              ".gm-board-head > :not(.gm-board-title)",
              root
            ),
            { autoAlpha: 0, y: 14, duration: SM.duration, stagger: 0.07 },
            0.16
          );
          // 見出しは行マスクのせり上がり一本(頭書きフェードから除外済み)
          enter.from(
            ".gm-board-title .mask > span",
            {
              yPercent: 115,
              duration: GUMON_MOTION.durationLong,
              ease: GUMON_MOTION.easeEmphasis,
            },
            0.18
          );
          enter.from(
            gsap.utils.toArray<HTMLElement>(".gm-board-tools > *", root),
            { autoAlpha: 0, y: 12, duration: SM.duration, stagger: 0.07 },
            0.3
          );
        } else if (consult) {
          // 相談の静けさ(course・20B): 読む区間は演出最弱 — 額縁は
          // fade-quiet(8px)でそっと現すだけ。急がせる連鎖は組まない。
          // 見出しマスクだけは全ページ共通の文法として既定値のまま維持
          const FQ = GUMON_SCENE_MOTION.fadeQuiet;
          gsap.from(".gm-board-frame", {
            autoAlpha: 0,
            y: FQ.y,
            duration: FQ.duration,
            ease: FQ.ease,
            scrollTrigger: { trigger: root, start: "top 78%", once: true },
          });
          gsap.from(".gm-board-title .mask > span", {
            yPercent: 115,
            duration: GUMON_MOTION.durationLong,
            ease: GUMON_MOTION.easeEmphasis,
            scrollTrigger: { trigger: root, start: "top 74%", once: true },
          });
        } else {
          // 既定(他ページ): 従来どおり静かに現す — 値・順序とも不変
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
        }
        // リボン → 行の順に連鎖
        const sec = root.querySelector(".gm-board-sec");
        if (sec) {
          const tl = gsap.timeline({
            defaults: { ease: GUMON_MOTION.ease },
            scrollTrigger: { trigger: sec, start: "top 84%", once: true },
          });
          // quiet(dinner)の活気: リボンは帯らしく左から差し込み、品々は
          // わずかな縮みを伴って次々と躍り上がる(連鎖のテンポも速める)。
          // brisk(lunch)の軽快: 同じ構造をさらに小さく・速く(迷わず選ぶ)。
          // consult(course)の静けさ: 差し込まず、8px の fade-quiet で
          // そっと置くだけ(読む・相談するページに勢いは要らない)
          tl.from(
            sec.querySelector(".gm-board-ribbon"),
            quiet
              ? {
                  autoAlpha: 0,
                  x: -24,
                  duration: GUMON_SCENE_MOTION.riseLine.duration,
                  ease: GUMON_SCENE_MOTION.riseLine.ease,
                }
              : brisk
                ? {
                    autoAlpha: 0,
                    x: -16,
                    duration: GUMON_SCENE_MOTION.riseLine.duration,
                    ease: GUMON_SCENE_MOTION.riseLine.ease,
                  }
                : consult
                  ? {
                      autoAlpha: 0,
                      y: GUMON_SCENE_MOTION.fadeQuiet.y,
                      duration: GUMON_SCENE_MOTION.fadeQuiet.duration,
                      ease: GUMON_SCENE_MOTION.fadeQuiet.ease,
                    }
                  : {
                      autoAlpha: 0,
                      y: 16,
                      duration: GUMON_MOTION.duration,
                    }
          );
          tl.from(
            sec.querySelectorAll(".gm-board-row, .gm-board-card"),
            quiet
              ? {
                  autoAlpha: 0,
                  y: 24,
                  scale: 0.985,
                  duration: GUMON_SCENE_MOTION.riseLine.duration,
                  ease: GUMON_SCENE_MOTION.riseLine.ease,
                  stagger: 0.055,
                }
              : brisk
                ? {
                    autoAlpha: 0,
                    y: 18,
                    duration: GUMON_SCENE_MOTION.riseLine.duration,
                    ease: GUMON_SCENE_MOTION.riseLine.ease,
                    stagger: 0.045,
                  }
                : consult
                  ? {
                      autoAlpha: 0,
                      y: GUMON_SCENE_MOTION.fadeQuiet.y,
                      duration: GUMON_SCENE_MOTION.fadeQuiet.duration,
                      ease: GUMON_SCENE_MOTION.fadeQuiet.ease,
                      stagger: 0.08,
                    }
                  : {
                      autoAlpha: 0,
                      y: 20,
                      duration: GUMON_MOTION.duration,
                      stagger: 0.07,
                    },
            // quiet: リボンが差し込んだ勢いのまま品々が続く(半拍→1/4拍)。
            // brisk: さらに間を詰める。consult: 既定と同じ間(急がせない)
            quiet ? 0.22 : brisk ? 0.18 : 0.15,
          );
        }
        // 締めの料理写真: clip-path 展開 + 1.06 → 等倍。
        // consult は展開の見せ場も作らず fade-quiet で静かに(最弱で統一)
        gsap.utils
          .toArray<HTMLElement>(".gm-board-photo", root)
          .forEach((el) => {
            gsap.from(
              el,
              consult
                ? {
                    autoAlpha: 0,
                    y: GUMON_SCENE_MOTION.fadeQuiet.y,
                    duration: GUMON_SCENE_MOTION.fadeQuiet.duration,
                    ease: GUMON_SCENE_MOTION.fadeQuiet.ease,
                    scrollTrigger: { trigger: el, start: "top 84%", once: true },
                  }
                : {
                    clipPath: "inset(12% 8% 12% 8%)",
                    scale: 1.06,
                    duration: 1.3,
                    ease: GUMON_MOTION.easeEmphasis,
                    scrollTrigger: { trigger: el, start: "top 84%", once: true },
                  },
            );
          });
        // 導線 + CTA
        if (quiet) {
          // D3→D4: 導線と CTA を分ける。CTA は「席を決める」結末の頁 —
          // 全画面の場面の中で、一行ずつ儀式のように灯す
          // (ご予約を承っております → 電話ボタン → 番号 → Web → アクセス)
          gsap.from(".gm-board-others", {
            autoAlpha: 0,
            y: rise ?? 20,
            duration: dur ?? GUMON_MOTION.duration,
            ease: ez ?? GUMON_MOTION.ease,
            scrollTrigger: {
              trigger: ".gm-board-others",
              start: "top 88%",
              once: true,
            },
          });
          const cta = root.querySelector<HTMLElement>(".gm-board-cta");
          if (cta) {
            // 電話予約はこのSceneの主行動。遅いスクロールや途中復帰でも
            // 不可視のまま残らないよう、主ボタンは演出対象に含めない。
            // 物語性より、常に予約できることを優先する。
            const ctaSequence = Array.from(cta.children).filter(
              (child) => !child.classList.contains("gm-tel-btn"),
            );
            gsap.from(ctaSequence, {
              autoAlpha: 0,
              y: GUMON_SCENE_MOTION.fadeQuiet.y,
              duration: 0.9,
              ease: GUMON_SCENE_MOTION.fadeQuiet.ease,
              stagger: 0.16,
              scrollTrigger: {
                trigger: cta,
                start: "top 75%",
                once: true,
              },
            });
          }
        } else if (consult) {
          // 相談の着地(course・20B): 電話は主行動 — quiet と同じく
          // 主ボタン(gm-tel-btn)は演出対象から外し、常に操作可能を保つ。
          // 周辺は fade-quiet で静かに現れるだけ
          const FQ = GUMON_SCENE_MOTION.fadeQuiet;
          gsap.from(".gm-board-others", {
            autoAlpha: 0,
            y: FQ.y,
            duration: FQ.duration,
            ease: FQ.ease,
            scrollTrigger: {
              trigger: ".gm-board-others",
              start: "top 88%",
              once: true,
            },
          });
          const cta = root.querySelector<HTMLElement>(".gm-board-cta");
          if (cta) {
            const ctaSequence = Array.from(cta.children).filter(
              (child) => !child.classList.contains("gm-tel-btn"),
            );
            gsap.from(ctaSequence, {
              autoAlpha: 0,
              y: FQ.y,
              duration: FQ.duration,
              ease: FQ.ease,
              stagger: 0.08,
              scrollTrigger: { trigger: cta, start: "top 80%", once: true },
            });
          }
        } else {
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
        }
      });
      return () => mm.revert();
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
        {quiet && <p className="gm-board-scene-cue">今夜を、選ぶ。</p>}
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

        {/* 検索・絞り込み(全カテゴリ横断) */}
        <div className="gm-board-tools">
          <label className="gm-board-search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="料理名で探す(例: 海老)"
              aria-label="お品書きを検索"
            />
          </label>
          <button
            type="button"
            className={`gm-board-filter${recoOnly ? " is-on" : ""}`}
            aria-pressed={recoOnly}
            onClick={() => setRecoOnly((v) => !v)}
          >
            看板・おすすめのみ
          </button>
        </div>

        <section className="gm-board-sec">
          <h3 className="gm-board-ribbon is-current">
            <span className="gm-board-ribbon-jp">{category.titleJp}</span>
            <span className="gm-board-ribbon-en">{category.titleEn}</span>
          </h3>

          {visibleItems.length === 0 && (
            <p className="gm-board-empty">
              「{query}」に当てはまる品は、このお品書きにはありませんでした。
              仕入れによってはご用意できることもあります。お電話でお尋ねください。
            </p>
          )}
          {isCourse ? (
            // コースは紙カード(参考デザインの紙面をアイボリーで翻訳)
            <div className="gm-board-cards">
              {visibleItems.map((d) => (
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
              {visibleItems.map((d) => (
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
                      {d.recommended && (
                        <span className="gm-menu-sig gm-badge-reco">
                          おすすめ
                        </span>
                      )}
                      {d.spicy && (
                        <span
                          className="gm-spicy"
                          aria-label={`辛さレベル${d.spicy}`}
                        >
                          {"辛".repeat(d.spicy)}
                        </span>
                      )}
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
                  {renderNote(n)}
                </p>
              ))}
            </div>
          )}

          {/* 相談ページ(consult)のみ: 不安の解消(FAQ)への静かな導線。
              電話 CTA(朱)より明確に弱く、事実情報はここに足さない */}
          {consult && (
            <p className="gm-board-contact-hint">
              <Link href="/contact" className="gm-detail-link">
                ご予約・ご宴会についてのご質問
                <span className="gm-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </p>
          )}
        </section>

        {/* 検索時: ほかのカテゴリでのヒットを横断提示 */}
        {crossHits.length > 0 && (
          <div className="gm-board-crosshits">
            <p className="gm-detail-eyebrow">ほかのお品書きにも見つかりました</p>
            {crossHits.map((g) => (
              <p key={g.section.titleEn} className="gm-board-crosshit">
                <Link href={hrefOf(g.section.titleEn)} className="gm-detail-link">
                  {g.section.titleJp}
                  <span className="gm-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <span className="gm-board-crosshit-names">
                  {g.items.map((d) => d.name).join(" ／ ")}
                </span>
              </p>
            ))}
          </div>
        )}

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
          {quiet && <p className="gm-board-cta-cue">席を、決める。</p>}
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
          <div className="gm-cta-access">
            <Link href="/access" className="gm-detail-link">
              アクセスを見る — 貝塚駅 徒歩10分
              <span className="gm-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
