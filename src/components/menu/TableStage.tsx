"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-setup";

/**
 * 食卓の見せ場 — 紙のお品書き(一覧)の直前に置く全画面ステージ。
 *
 * 2026-08-08: 単品の「看板の品」ステージ(DishStage)を、一卓を写した写真の
 * ステージへ改める(オーナー要望: 夜の見せ場をこの写真に・「看板」の文言は不要)。
 * 写真は一皿ではなく食卓全体なので、品名・価格のキャプションは持たない
 * (品と値段はこの直下の紙のお品書きが一覧で担う)。
 *
 * 演出はデスクトップ(861px+)かつ motion 可のときだけ構築する。
 * モバイル / reduced-motion / JS 無効では **静的な大判写真** として出る
 * (pin もスクラブもしない = CLAUDE.md のモバイル軽量化・RM 尊重規定)。
 */
export default function TableStage({
  src,
  alt,
  eyebrow,
  title,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
}) {
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
        if (!stage || !intro || !frame || !media) return;

        // 初期: 題字が立ち、食卓は「熾火」(0.35)で窓の奥に灯っている
        gsap.set(intro, { opacity: 1, scale: 1 });
        gsap.set(frame, {
          opacity: 0.35,
          clipPath: "inset(24% 18% 24% 18%)",
          scale: 1.08,
        });

        const tl = gsap.timeline({
          defaults: { ease: "power1.out" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=200%",
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

        // 食卓の呼吸: 写真だけの縦ドリフト(計12%以内・等速)。全画面なので縁は出ない
        tl.fromTo(media, { yPercent: -6 }, { yPercent: 6, ease: "none", duration: 1 }, 0);

        // 受け渡し: 見せ切ったら一歩引いて翳り、下の品書き(紙面)へ渡す
        tl.to(
          frame,
          { scale: 0.965, opacity: 0.5, duration: 0.12, ease: "power1.inOut" },
          0.88,
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="gm-stage2" aria-label={title}>
      <div className="gm-stage2-vp">
        {/* 題字(幕) */}
        <header className="gm-stage2-intro">
          <p className="gm-stage2-en">{eyebrow}</p>
          <h2 className="gm-stage2-title">{title}</h2>
        </header>

        {/* 食卓(窓) */}
        <div className="gm-stage2-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="gm-stage2-media"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
