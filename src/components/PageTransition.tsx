"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * ページ遷移の演出。デザイン提案「愚問 ページングアニメーション」の
 * 3案(石壁ワイプ/朱線スライス/暖簾めくり)を実サイトの soft-nav に載せる。
 *
 * 方針: Next.js の Link とは戦わない(preventDefault も手動 push もしない)。
 *   ①リンククリックを合図に「覆う(cover)」を始める
 *   ②遷移は Next がそのまま行う(裏でページが差し替わる)
 *   ③「覆いきった」かつ「新ページが到着した」両方が揃ったら「めくる(uncover)」
 * これで二重遷移や競合が起きず、重いページでは覆いが読み込みveilとして働く。
 *
 * 3案は共通の cover/uncover 骨格。下の KIND を変えるだけで切り替わる。
 * prefers-reduced-motion では一切演出せず即時遷移。
 */

// "A" = 石壁ワイプ / "B" = 朱線スライス / "C" = 暖簾めくり
const KIND: "A" | "B" | "C" = "A";

const COVER_MS = 440; // CSS の cover と揃える(段ズレ込みの上限)
const UNCOVER_MS = 560; // めくり終わるまで
const SAFETY_MS = 5000; // 万一遷移が来なくても必ず解除する保険

type Phase = "idle" | "cover" | "uncover";

export default function PageTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const run = useRef({ target: "", coverDone: false, arrived: false, active: false });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const startUncover = () => {
    if (!run.current.active) return;
    run.current.active = false;
    clearTimers();
    setPhase("uncover");
    timers.current.push(setTimeout(() => setPhase("idle"), UNCOVER_MS));
  };

  // 覆いきった & 新ページ到着、両方が揃ってからめくる
  const maybeUncover = () => {
    if (run.current.active && run.current.coverDone && run.current.arrived) startUncover();
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      if (run.current.active) return; // 遷移中は無視(状態はrefで見る)

      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (
        !href ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        a.dataset.noTransition != null ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        href.startsWith("#")
      )
        return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // 同一ページ内

      // preventDefault しない — 遷移は Next Link に任せ、こちらは覆うだけ
      run.current = { target: url.pathname, coverDone: false, arrived: false, active: true };
      setPhase("cover");
      clearTimers();
      timers.current.push(
        setTimeout(() => {
          run.current.coverDone = true;
          maybeUncover();
        }, COVER_MS),
      );
      // 保険: 遷移が来なくても必ず解除する(覆ったまま固着させない)
      timers.current.push(
        setTimeout(() => {
          if (run.current.active) startUncover();
        }, SAFETY_MS),
      );
    };

    document.addEventListener("click", onClick, true);
    // マウント時に一度だけ登録。cleanup(=アンマウント時のみ)でタイマーも掃除。
    // 依存に phase を入れると、phase 変化のたび cleanup が走って
    // 直前に張ったタイマーを消してしまう(covered 検知が失われ固着する)。
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 新ページのpathnameに到着したら「到着」を立て、条件が揃えばめくる
  useEffect(() => {
    if (run.current.active && pathname === run.current.target) {
      run.current.arrived = true;
      window.scrollTo(0, 0);
      requestAnimationFrame(() => requestAnimationFrame(maybeUncover));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div className="gm-tr" data-kind={KIND} data-phase={phase} aria-hidden="true">
      {KIND === "A" && <div className="gm-tr-a" />}

      {KIND === "B" &&
        [0, 1, 2].map((i) => (
          <div key={i} className="gm-tr-band" style={{ "--i": i } as React.CSSProperties} />
        ))}

      {KIND === "C" &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="gm-tr-strip" style={{ "--i": i } as React.CSSProperties}>
            {i === 2 && <span className="gm-tr-glyph">愚</span>}
            {i === 3 && <span className="gm-tr-glyph">問</span>}
          </div>
        ))}
    </div>
  );
}
