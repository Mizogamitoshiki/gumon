"use client";

import { useEffect, useRef } from "react";

/**
 * 詳細ページ共通の読了プログレスヘアライン(TOP の progress と同じ言語)。
 * transform(scaleX)のみ・rAF 集約。reduced-motion では表示しない。
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, window.scrollY / max));
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="gm-progress-rail" aria-hidden="true">
      <div ref={barRef} className="gm-progress-fill" />
    </div>
  );
}
