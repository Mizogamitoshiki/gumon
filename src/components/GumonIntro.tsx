"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* TOP 初期表示のシネマティック・イントロ。
   - 初回訪問(セッション内で最初のオープニング): 約2.8秒の料理フィルム
     (public/gumon-intro-desktop.mp4 1600x900 / -mobile.mp4 720x1280。
      2026-08-22 に 7 秒・5 ショットから看板の 3 ショット(海老と紹興酒→葡萄黒酢
      酢豚→小皿御膳)へ再編集。0.6MB / 0.34MB。モバイルの Speed Index 8s の
      主因がこの 7 秒だったため、オーナー了承のうえ短縮)
     → マットブラック収束 →
     ロゴ「愚問」をGSAPで合成 → ヒーローへクロスフェード
   - 同一セッション内の再訪問: 0.8〜1.2秒の短いロゴ表示のみ
   - prefers-reduced-motion: 動画なし。#1c1b19 の上に opacity のみでロゴ
   - スクロール/タップ/キー入力でロゴ表示まで短縮(操作をブロックし続けない)
   - 動画が読み込めない/自動再生が拒否された場合は即座にロゴ画面へ
   - セッションフラグ 'gm-opened' は layout の石壁オープニングと共有
     (TOP では石壁を出さず、このコンポーネントがフラグを管理する) */

const SESSION_KEY = "gm-opened";
// 動画内でマットブラック収束が完了する時刻(再編集版: fade 2.1s+0.45s → 2.55s で全黒)
const LOGO_CUE_TIME = 2.5;

// StrictMode の二重マウントでも「初回フル/再訪ショート」の判定が
// 揺れないよう、判定はページロードにつき一度だけ行う(モジュール変数)
let decidedMode: "full" | "short" | "rm" | "skip" | null = null;

// 低速回線(2G/3G 相当)やデータセーバー有効時は、動画(0.7〜1.3MB)を
// 待たせるより即ロゴへ。Network Information API 非対応ブラウザは従来通り
function slowNetwork(): boolean {
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!conn) return false;
  return !!conn.saveData || /(^|-)2g$|^3g$/.test(conn.effectiveType ?? "");
}

function decideMode(): "full" | "short" | "rm" | "skip" {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try {
    seen = !!sessionStorage.getItem(SESSION_KEY);
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* プライベートモード等 — 毎回フルでよい */
  }
  if (reduce) return seen ? "skip" : "rm";
  if (seen) return "short";
  return slowNetwork() ? "short" : "full";
}

export default function GumonIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const holder = holderRef.current;
    const logo = logoRef.current;
    if (!root || !holder || !logo) return;

    if (!decidedMode) decidedMode = decideMode();
    const mode = decidedMode;

    if (mode === "skip") {
      setGone(true);
      return;
    }

    let cancelled = false;
    let logoStarted = false;
    let finished = false;
    const chars = Array.from(
      logo.querySelectorAll<HTMLElement>("[data-intro-char]")
    );
    const timeouts: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timeouts.push(window.setTimeout(fn, ms));
    };
    let video: HTMLVideoElement | null = null;
    let removeVisWait: (() => void) | null = null;

    /* ---- ヒーローへのクロスフェード(終幕) ---- */
    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      removeSkip();
      // 覆いが消え始めた瞬間からページ操作を通す
      root.style.pointerEvents = "none";
      // GumonScroll の armMedia(最初のユーザー操作で装填)を起こして、
      // 現れるヒーローの背後でマスターフィルムを温めておく
      window.dispatchEvent(new Event("pointermove"));
      gsap.to(root, {
        opacity: 0,
        duration: mode === "rm" ? 0.6 : 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          if (!cancelled) setGone(true);
        },
      });
    };

    /* ---- ロゴ「愚問」の出現(Web側合成 — 映像内では文字を生成しない) ---- */
    const logoIn = (duration = 1.0) => {
      if (logoStarted || cancelled) return;
      logoStarted = true;
      gsap.set(logo, { opacity: 1 });
      if (mode === "rm") {
        // reduced-motion: opacity のみ
        gsap.set(chars, { y: 0, filter: "none" });
        gsap.to(chars, {
          opacity: 1,
          duration: 0.8,
          ease: "power1.out",
          onComplete: () => later(finish, 500),
        });
        return;
      }
      gsap.fromTo(
        chars,
        { opacity: 0, y: 20, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          ease: "power3.out",
          stagger: 0.12,
          onComplete: () => later(finish, mode === "full" ? 400 : 250),
        }
      );
    };

    /* ---- スクロール/タップ/キーでロゴ表示まで短縮 ---- */
    const skip = () => {
      if (logoStarted || cancelled) return;
      if (video) {
        gsap.to(video, { opacity: 0, duration: 0.3, ease: "power1.in" });
      }
      logoIn(0.9);
    };
    const SKIP_EVENTS = ["wheel", "touchmove", "pointerdown", "keydown"];
    const removeSkip = () =>
      SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skip));
    if (mode === "full") {
      SKIP_EVENTS.forEach((ev) =>
        window.addEventListener(ev, skip, { passive: true })
      );
    }

    /* ---- モードごとの進行 ---- */
    if (mode === "short" || mode === "rm") {
      // 再訪問: 短いロゴ表示のみ / RM: opacityのみのロゴ表示
      logoIn(0.9);
    } else {
      // 初回: フルイントロ。動画は装填失敗・自動再生拒否・停滞のすべてで
      // 即座にロゴ画面へフォールバックする
      const begin = () => {
        if (cancelled || logoStarted) return;
        const lite = window.matchMedia("(max-width: 860px)").matches;
        const v = document.createElement("video");
        video = v;
        v.muted = true;
        v.playsInline = true;
        v.preload = "auto";
        v.setAttribute("muted", "");
        v.setAttribute("playsinline", "");
        v.setAttribute("aria-hidden", "true");
        v.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;";
        v.src = lite ? "/gumon-intro-mobile.mp4" : "/gumon-intro-desktop.mp4";
        const onTime = () => {
          if (v.currentTime >= LOGO_CUE_TIME) logoIn();
        };
        const onEnded = () => logoIn();
        const onError = () => logoIn(0.9);
        v.addEventListener("timeupdate", onTime);
        v.addEventListener("ended", onEnded);
        v.addEventListener("error", onError);
        holder.appendChild(v);
        v.play().catch(() => {
          if (!cancelled) logoIn(0.9);
        });
        // 停滞ウォッチドッグ: 1秒経っても再生が始まらなければロゴへ
        // (低速回線で 0.34〜0.6MB を待たせない。+faststart なので通常の 4G/Wi-Fi
        //  では数百 ms で始まる)
        later(() => {
          if (!logoStarted && v.currentTime < 0.05) logoIn(0.9);
        }, 1000);
        // 全体の安全上限(いかなる場合も5秒で終幕へ)
        later(() => {
          logoIn(0.9);
          later(finish, 1000);
        }, 5000);
      };
      // バックグラウンドタブで開かれた場合はタブが可視になるまで開始を待つ
      // (非表示タブでは動画再生が保留され、即フォールバックしてしまうため。
      //  覆いは黒のままなので、切り替えた瞬間に暗闇からイントロが始まる)
      if (document.visibilityState === "visible") {
        begin();
      } else {
        const onVisible = () => {
          if (document.visibilityState === "visible") {
            document.removeEventListener("visibilitychange", onVisible);
            removeVisWait = null;
            begin();
          }
        };
        document.addEventListener("visibilitychange", onVisible);
        removeVisWait = () =>
          document.removeEventListener("visibilitychange", onVisible);
      }
    }

    return () => {
      cancelled = true;
      removeVisWait?.();
      removeSkip();
      timeouts.forEach(clearTimeout);
      gsap.killTweensOf([root, logo, ...chars]);
      if (video) {
        video.removeAttribute("src");
        video.load();
        video.remove();
      }
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="gm-intro" aria-hidden="true">
      {/* JS が読めない環境では覆いを出さない(本文の可読を最優先) */}
      <noscript>
        <style>{`.gm-intro{display:none !important}`}</style>
      </noscript>
      <div ref={holderRef} className="gm-intro-media" />
      <div ref={logoRef} className="gm-intro-logo">
        {["愚", "問"].map((ch) => (
          <span key={ch} className="gm-intro-mask">
            <span data-intro-char>{ch}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
