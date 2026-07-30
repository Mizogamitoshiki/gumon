"use client";

import { useRef } from "react";
import type { MenuItem } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";

/**
 * 看板の一皿の「見せ場」— 紙のお品書き(一覧)の直前に置く全画面ステージ。
 *
 * 2026-07-30: 紙お品書き刷新(5c7322d)で削除された DishShowcase の紙芝居機構を、
 * 一覧の読みやすさを保ったまま復活させたもの(ユーザー要望「2と今のアニメーションを
 * 融合」)。旧実装との違い:
 *   - 旧: Hero ごと単一ステージに内包し、幕(hero)を晴らして皿を出す 4 場面
 *   - 新: 一覧(紙面)は通常フローのまま。ステージは「題字 → 窓が開く → 品名が灯る
 *         → 一歩引いて品書きへ渡す」の 1 幕に凝縮し、紙面へ自然に受け渡す
 *
 * 演出はデスクトップ(861px+)かつ motion 可のときだけ構築する。
 * モバイル / reduced-motion / JS 無効では **静的な大判カード** として全情報が読める
 * (pin もスクラブもしない = CLAUDE.md のモバイル軽量化・RM 尊重規定)。
 */
export default function DishStage({ item }: { item: MenuItem }) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
        const root = rootRef.current;
        if (!root) return;
        const stage = root.querySelector<HTMLElement>(".gm-stage2-vp");
        const intro = root.querySelector<HTMLElement>(".gm-stage2-intro");
        const frame = root.querySelector<HTMLElement>(".gm-stage2-frame");
        const media = root.querySelector<HTMLElement>(".gm-stage2-media");
        const caption = root.querySelector<HTMLElement>(".gm-stage2-caption");
        if (!stage || !intro || !frame || !media || !caption) return;
        const capBits = Array.from(caption.children);

        // 初期: 題字が立ち、皿は「熾火」(0.35)で窓の奥に灯っている
        gsap.set(intro, { opacity: 1, scale: 1 });
        gsap.set(frame, {
          opacity: 0.35,
          clipPath: "inset(24% 18% 24% 18%)",
          scale: 1.08,
        });
        gsap.set(capBits, { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          defaults: { ease: "power1.out" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 場面1→2: 題字が「拡大しながら退く」ほど、窓が明るく大きく開く
        // (退場と入場を必ず重ねる = 場面の境界を消す)
        tl.to(intro, { opacity: 0, scale: 1.08, duration: 0.16, ease: "power1.in" }, 0.1);
        tl.to(frame, { opacity: 1, duration: 0.18, ease: "power1.inOut" }, 0.08);
        tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.34 }, 0.12);
        tl.to(frame, { scale: 1, duration: 0.36 }, 0.12);

        // 皿の呼吸: 写真だけの縦ドリフト(計12%以内・等速)。全画面なので縁は出ない
        tl.fromTo(media, { yPercent: -6 }, { yPercent: 6, ease: "none", duration: 1 }, 0);

        // 品名 → 価格 → 説明 が順に灯る
        tl.to(capBits, { opacity: 1, y: 0, duration: 0.16, stagger: 0.05 }, 0.56);

        // 受け渡し: 見せ切ったら皿が一歩引いて翳り、下の品書き(紙面)へ渡す
        tl.to(
          frame,
          { scale: 0.965, opacity: 0.5, duration: 0.12, ease: "power1.inOut" },
          0.88,
        );
        tl.to(capBits, { opacity: 0, duration: 0.1, ease: "power1.in" }, 0.9);
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="gm-stage2" aria-label={`看板の品 ${item.name}`}>
      <div className="gm-stage2-vp">
        {/* 題字(幕) */}
        <header className="gm-stage2-intro">
          <p className="gm-stage2-en">SIGNATURE</p>
          <h2 className="gm-stage2-title">看板の品</h2>
        </header>

        {/* 一皿(窓) */}
        <div className="gm-stage2-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.img}
            alt={item.name}
            className="gm-stage2-media"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          {/* キャプションの可読を守る下部スクリム(装飾) */}
          <span className="gm-stage2-scrim" aria-hidden="true" />
        </div>

        {/* 品名・価格・説明 */}
        <div className="gm-stage2-caption">
          <h3 className="gm-stage2-name">
            {item.name}
            {item.spicy && (
              <span className="gm-stage2-spicy" aria-label={`辛さレベル${item.spicy}`}>
                {"辛".repeat(item.spicy)}
              </span>
            )}
          </h3>
          <p className="gm-stage2-price">{item.price}</p>
          {item.desc && (
            <p className="gm-stage2-desc" style={{ whiteSpace: "pre-line" }}>
              {item.desc}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
