"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap-setup";
import { splitText, type SplitTextResult } from "@/lib/split-text";
import { GUMON_MOTION } from "@/lib/motion-tokens";

/**
 * 大きな一文の引用(情報ページの「間」)。文字マスクのせり上がりで一字ずつ現す。
 * フォント確定前に分割すると幅がズレるため fonts.ready を待つ。
 * StrictMode の stale 実行は cancelled フラグで無効化(過去の不具合の再発防止)。
 */
export default function PullQuote({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const splitRef = useRef<SplitTextResult | null>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = quoteRef.current;
      if (!el || !contextSafe) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(el, { autoAlpha: 0 });
      let cancelled = false;

      const run = contextSafe(() => {
        if (cancelled || !quoteRef.current) return;
        splitRef.current = splitText(quoteRef.current, { type: "chars" });
        gsap.set(quoteRef.current, { autoAlpha: 1 });
        gsap.from(splitRef.current.chars, {
          yPercent: 115,
          duration: GUMON_MOTION.durationLong,
          ease: GUMON_MOTION.easeEmphasis,
          stagger: 0.05,
          scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
        });
        ScrollTrigger.refresh();
      });
      document.fonts.ready.then(run);

      return () => {
        cancelled = true;
        splitRef.current?.revert();
        splitRef.current = null;
      };
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="gm-pullquote" aria-label={text}>
      <p ref={quoteRef} className="gm-pullquote-text" aria-hidden="true">
        {text}
      </p>
    </section>
  );
}
