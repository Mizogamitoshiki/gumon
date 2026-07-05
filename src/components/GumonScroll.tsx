"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import FoodNavDropdown from "./FoodNavDropdown";
import InstagramLink from "./InstagramLink";
import { CATS, DRINK_ITEMS, FOOD_CATEGORIES } from "@/lib/menu";
import { HOTPEPPER_URL } from "@/lib/site";
import { useMobileNavA11y } from "@/lib/use-mobile-nav";

/* ---------------------------------- data ---------------------------------- */

const ACCESS = [
  { k: "ADDRESS", v: "大阪府貝塚市加神1-4-26 貝塚セルシー" },
  { k: "STATION", v: "南海本線・水間鉄道 貝塚駅 東出口より徒歩約10分" },
  { k: "HOURS", v: "昼 11:30–15:00(L.O.14:30)/ 夜 18:00–23:30(L.O.23:00)" },
  { k: "CLOSED", v: "なし(無休)" },
];

const SERIF = "var(--font-noto-serif-jp), serif";
const SANS = "var(--font-noto-sans-jp), sans-serif";
// matte-black monochrome palette: base #1c1b19, accent stone #b9b2a6 (no gold)

const NAV_LINK_STYLE: CSSProperties = {
  position: "relative",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: SANS,
  fontWeight: 400,
  fontSize: 14,
  letterSpacing: ".18em",
  color: "rgba(242,240,235,.78)",
  padding: "10px 2px",
};

// 9 項目 + 予約が小型機(667px 高)にも収まるサイズ
const MOBILE_LINK_STYLE: CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  fontFamily: SERIF,
  fontWeight: 400,
  fontSize: "clamp(22px,5.8vw,30px)",
  letterSpacing: ".14em",
  color: "#f2f0eb",
  padding: "5px 0",
};

/* -------------------------------- component ------------------------------- */

export default function GumonScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastYRef = useRef(0);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;
  // Escape で閉じる・フォーカストラップ・閉じている間の body スクロールロック
  useMobileNavA11y(
    menuOpen,
    () => setMenuOpen(false),
    mobileMenuRef,
    burgerRef,
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const q = (sel: string) => root.querySelector<HTMLElement>(sel);
    const qa = (sel: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(sel));
    const qaIn = (el: Element | null, sel: string) =>
      el ? Array.from(el.querySelectorAll<HTMLElement>(sel)) : [];

    /* ---- reduced motion: flatten into a readable static stack ---- */
    if (reduce) {
      const sr = scrollRootRef.current;
      const stage = stageRef.current;
      if (sr) sr.style.height = "auto";
      if (stage) {
        stage.style.position = "static";
        stage.style.height = "auto";
        stage.style.overflow = "visible";
      }
      const vw = q("[data-velocity]");
      if (vw) {
        vw.style.position = "static";
        vw.style.inset = "auto";
      }
      qa("[data-scene]").forEach((el) => {
        el.style.position = "relative";
        el.style.opacity = "1";
        el.style.minHeight = "100vh";
        el.style.inset = "auto";
      });
      qa(".mask > span").forEach((s) => (s.style.transform = "none"));
      qa("[data-fade]").forEach((s) => {
        s.style.opacity = "1";
        s.style.transform = "none";
        s.style.filter = "none";
      });
      // reveal the editorial menu statically
      qa("[data-cat]").forEach((s) => {
        s.style.opacity = "1";
        s.style.transform = "none";
      });
      qa("[data-cat-row]").forEach((s) => {
        s.style.opacity = "1";
        s.style.transform = "none";
        s.style.filter = "none";
      });
      qa("[data-cat-rule]").forEach((s) => (s.style.transform = "none"));
      // show the food spread statically as a FIXED viewport backdrop (its
      // absolutely-positioned box would otherwise stretch over the whole
      // ~600vh flattened page); src is assigned here so motion users never
      // download the reduce-only image
      const dishesEl = q("[data-dishes]");
      if (dishesEl) {
        dishesEl.style.opacity = "1";
        dishesEl.style.position = "fixed";
        dishesEl.style.inset = "0";
        const im = dishesEl.querySelector<HTMLImageElement>("img");
        if (im && im.dataset.src) im.src = im.dataset.src;
      }
      // no scrubbed film without motion — dishes.png is the static stand-in
      // (the <video> never gets a src in this branch, so nothing downloads)
      const filmEl = q("[data-film]");
      if (filmEl) filmEl.style.display = "none";
      // match the animated scrim level so static text contrast holds; fixed
      // for the same reason as the backdrop above
      const darkenEl = q("[data-darken]");
      if (darkenEl) {
        darkenEl.style.opacity = "0.55";
        darkenEl.style.position = "fixed";
        darkenEl.style.inset = "0";
      }
      const cue = q("[data-cue]");
      if (cue) cue.style.display = "none";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    // モバイルのアドレスバー伸縮による refresh 連発(=スクロール中のジャンプ)を防ぐ
    ScrollTrigger.config({ ignoreMobileResize: true });
    const E = "expo.out";

    // モバイルは blur フィルタのアニメーションを省略する(重い割に小画面では
    // 効果が薄い)。y+opacity の骨格は共通なので演出の質感は保たれる。
    // 861px = .gm-nav / .gm-scroll-root と同じブレークポイント
    const lite = window.matchMedia("(max-width: 860px)").matches;
    const blurIn = (px: number) => (lite ? {} : { filter: `blur(${px}px)` });
    const blurOut = () => (lite ? {} : { filter: "blur(0px)" });

    /* ---- Lenis: smooth but not heavy. autoRaf:false so gsap.ticker is the
       single rAF loop driving both Lenis and ScrollTrigger (no scrub desync) ---- */
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.3,
      autoRaf: false,
    });
    lenis.on("scroll", () => {
      ScrollTrigger.update();
      onScroll();
    });
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    /* ---- element refs ---- */
    const glow = q("[data-glow]");
    const glow2 = q("[data-glow2]");
    const foodhero = q("[data-foodhero]");
    const film = q("[data-film]");
    const barTop = q("[data-bar-top]");
    const barBot = q("[data-bar-bot]");
    const video = videoRef.current;
    const darken = q("[data-darken]");
    const hero = q('[data-scene="hero"]');
    const heroLogo = q("[data-hero-logo]");
    const about = q('[data-scene="about"]');
    const food = q('[data-scene="food"]');
    const foodLabel = q("[data-food-label]");
    const cats = qa("[data-cat]");
    const drink = q('[data-scene="drink"]');
    const access = q('[data-scene="access"]');
    const mapEl = q("[data-map]");
    const reserve = q('[data-scene="reserve"]');
    const reserveLogo = q("[data-reserve-logo]");
    const cue = q("[data-cue]");

    /* ---- initial states ---- */
    // autoAlpha (opacity + visibility) so off-beat scenes are removed from
    // hit-testing AND tab order — their detail links aren't clickable/focusable
    // until the scene is on screen. Visually identical to opacity.
    gsap.set([about, food, drink, access, reserve], { autoAlpha: 0 });
    gsap.set(foodLabel, { opacity: 0 });
    // background layers: gentle, monotonic Ken Burns (transform-only, no blur).
    // carved 愚問 sits left/right of the centered title; the dark center gap
    // frames the hero text rather than duplicating it.
    gsap.set(foodhero, { opacity: 1, scale: 1.12, yPercent: -4, transformOrigin: "50% 50%" });
    // cuisine film: starts masked-in and slightly zoomed; the reveal opens the
    // clip-path and the zoom relaxes monotonically (1.12 -> 1.01, no reversals)
    gsap.set(film, {
      opacity: 0,
      scale: 1.12,
      yPercent: -2,
      clipPath: "inset(12% 9% 12% 9%)",
      transformOrigin: "50% 50%",
    });
    gsap.set(barTop, { scaleY: 0, transformOrigin: "center top" });
    gsap.set(barBot, { scaleY: 0, transformOrigin: "center bottom" });
    gsap.set(darken, { opacity: 0.5 });
    gsap.set(cats, { opacity: 0, y: 14 });
    qa("[data-cat-rule]").forEach((s) =>
      gsap.set(s, { scaleX: 0, transformOrigin: "left center" })
    );

    const heroLines = qaIn(hero, ".mask > span");
    qa(".mask > span").forEach((s) =>
      gsap.set(s, { yPercent: heroLines.indexOf(s) >= 0 ? 0 : 110 })
    );
    qa("[data-fade]").forEach((s) =>
      gsap.set(s, { opacity: 0, y: 18, ...blurIn(7) })
    );
    qa("[data-cat-row]").forEach((s) =>
      gsap.set(s, { opacity: 0, y: 16, ...blurIn(6) })
    );
    gsap.set(mapEl, {
      clipPath: "inset(100% 0 0 0)",
      scale: 1.08,
      ...blurIn(8),
    });

    const lines = (scene: Element | null) => qaIn(scene, ".mask > span");
    const fades = (scene: Element | null) => qaIn(scene, "[data-fade]");

    // scrub driver for the cuisine film: p (0..1) is tweened linearly inside
    // the master timeline, so scroll position IS the playhead; a per-frame lerp
    // in filmTick converts it to currentTime with cinematic weight
    const filmScrub = { p: 0 };

    /* ---- one master timeline, scrubbed by ScrollTrigger ---- */
    const tl = gsap.timeline({ paused: true, defaults: { ease: E } });

    // continuous vertical parallax across the WHOLE scroll (linear = correct for
    // depth); calm magnitudes so the glows drift, not surge
    tl.to(glow, { yPercent: 14, scale: 1.08, ease: "none", duration: 9.6 }, 0);
    tl.to(glow2, { yPercent: -12, scale: 1.06, ease: "none", duration: 9.6 }, 0);

    // BEAT 1 — hero -> food reveal
    tl.to(cue, { opacity: 0, duration: 0.3 }, 0);
    tl.to(hero, { opacity: 0, scale: 1.04, duration: 0.7, ease: "power2.in" }, 0.3);
    tl.fromTo(
      lines(hero),
      { yPercent: 0 },
      { yPercent: -110, duration: 0.7, ease: "power2.in", stagger: 0.05 },
      0.3
    );
    // wall background: ONE calm, monotonic, vertical-only Ken Burns across the
    // whole scroll — a single living photograph slowly breathing. No reversals,
    // no rotation, no horizontal pan, no animated blur (GPU transform only).
    // 8% travel sits inside the layer's -10% overscan, so edges never show.
    tl.to(foodhero, { scale: 1.04, yPercent: 4, ease: "none", duration: 8.3 }, 0);

    // scroll-scrubbed CUISINE FILM (the signature move): one continuous take
    // runs behind the 料理 and 飲み物 beats. Scroll drives the playhead
    // (filmScrub.p -> currentTime in filmTick), the frame opens via clip-path
    // mask, the zoom relaxes monotonically 1.12 -> 1.01, and letterbox bars
    // close in for the film chapter. Opacity/transform/clip-path only.
    tl.to(film, { opacity: 1, duration: 0.9, ease: "power1.inOut" }, 2.5);
    tl.to(film, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 }, 2.5);
    tl.to(film, { scale: 1.05, yPercent: 0, duration: 1.4 }, 2.5);
    tl.to(foodhero, { opacity: 0, duration: 1.0, ease: "power1.in" }, 2.6);
    // slow linear drift for the rest of the take (still monotonic zoom-out)
    tl.to(film, { scale: 1.01, yPercent: 1.5, ease: "none", duration: 3.1 }, 3.9);
    tl.to([barTop, barBot], { scaleY: 1, duration: 0.9, stagger: 0.06 }, 2.6);
    // scroll position IS the playhead: 0..1 across the whole film chapter
    tl.to(filmScrub, { p: 1, ease: "none", duration: 4.5 }, 2.5);
    // hand back to the wall for the drink→access transition (fires after
    // the drink text is read, not behind it)
    tl.to([barTop, barBot], { scaleY: 0, duration: 0.6, ease: "power2.in" }, 6.9);
    tl.to(film, { opacity: 0, duration: 1.0, ease: "power1.in" }, 7.0);
    tl.to(foodhero, { opacity: 1, duration: 1.0, ease: "power1.inOut" }, 6.95);

    // BEAT 2 — about
    tl.to(about, { autoAlpha: 1, duration: 0.5 }, 1.15);
    tl.to(lines(about), { yPercent: 0, duration: 1.0, stagger: 0.1 }, 1.2);
    tl.to(
      fades(about),
      { opacity: 1, y: 0, ...blurOut(), duration: 1.0, stagger: 0.1 },
      1.35
    );
    tl.to(about, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 2.3);
    // darken the wall (not hide it) so foreground text stays legible
    tl.to(darken, { opacity: 0.72, duration: 0.7, ease: "power2.in" }, 2.4);

    // BEAT 3 — editorial menu. Sections reveal in sequence (header rule draws,
    // rows rise) then PERSIST so the whole menu can be read; the panel fades out
    // as one unit at the BEAT3→BEAT4 boundary. All transform/opacity/blur only.
    tl.to(food, { autoAlpha: 1, duration: 0.5 }, 2.6);
    tl.to(foodLabel, { opacity: 1, duration: 0.8 }, 2.65);

    const catTimes = [2.85, 3.4, 3.9];
    cats.forEach((cat, i) => {
      const t = catTimes[i];
      const rise = qaIn(cat, "[data-cat-rise]");
      const rule = qaIn(cat, "[data-cat-rule]");
      const rows = qaIn(cat, "[data-cat-row]");
      tl.to(cat, { opacity: 1, y: 0, duration: 0.5 }, t);
      tl.fromTo(rise, { yPercent: 110 }, { yPercent: 0, duration: 0.8 }, t + 0.02);
      tl.fromTo(
        rule,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.out" },
        t + 0.05
      );
      tl.to(
        rows,
        { opacity: 1, y: 0, ...blurOut(), duration: 0.8, stagger: 0.08 },
        t + 0.15
      );
    });
    // hold the fully-revealed menu, then fade the whole panel out as one unit
    // (kicker + sections are children) at the BEAT3→BEAT4 boundary
    tl.to(food, { autoAlpha: 0, y: -18, duration: 0.6, ease: "power2.in" }, 5.4);

    // BEAT 4 — drink
    tl.to(drink, { autoAlpha: 1, duration: 0.5 }, 5.85);
    tl.to(lines(drink), { yPercent: 0, duration: 1.0, stagger: 0.08 }, 5.95);
    tl.to(
      fades(drink),
      { opacity: 1, y: 0, ...blurOut(), duration: 1.0, stagger: 0.09 },
      6.1
    );
    tl.to(drink, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 6.95);

    // BEAT 5 — access
    tl.to(access, { autoAlpha: 1, duration: 0.5 }, 7.05);
    tl.to(lines(access), { yPercent: 0, duration: 1.0, stagger: 0.1 }, 7.15);
    tl.to(
      fades(access),
      { opacity: 1, y: 0, ...blurOut(), duration: 1.0, stagger: 0.12 },
      7.3
    );
    tl.to(
      mapEl,
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ...blurOut(), duration: 1.2 },
      7.25
    );
    tl.to(access, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 8.25);

    // BEAT 6 — reserve
    tl.to(reserve, { autoAlpha: 1, duration: 0.5 }, 8.55);
    tl.fromTo(
      reserveLogo,
      { letterSpacing: "0.42em", opacity: 0.35, y: 14, ...blurIn(9) },
      { letterSpacing: "0.1em", opacity: 1, y: 0, ...blurOut(), duration: 1.2 },
      8.6
    );
    tl.to(
      fades(reserve),
      { opacity: 1, y: 0, ...blurOut(), duration: 1.0, stagger: 0.12 },
      8.95
    );

    // drive the timeline with ScrollTrigger. scrub:0.6 gives the scrubbed
    // background weight/inertia (single smoothing source; Lenis lerp stays 0.085)
    const st = ScrollTrigger.create({
      trigger: scrollRootRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      animation: tl,
    });

    /* ---- cuisine film: lerp currentTime toward the scrubbed playhead.
       The 0.16 lerp adds cinematic weight on top of ScrollTrigger's scrub
       smoothing; the threshold + !seeking guard avoids piling up seeks.
       The src is assigned HERE (not in JSX) so reduced-motion visitors —
       who bail out above — never download the video at all ---- */
    let filmDur = 0;
    const onFilmMeta = () => {
      if (!video) return;
      filmDur = video.duration || 0;
      // prime one seek so browsers that demote preload (iOS) start fetching
      // frame data even before any gesture — without it, filmTick's
      // readyState gate could never be satisfied on gesture-less devices
      if (video.readyState < 2) video.currentTime = 0.01;
    };
    if (video) {
      video.addEventListener("loadedmetadata", onFilmMeta);
      video.poster = "/dishes-poster.webp";
      video.src = "/cuisine-cinematic-opt.mp4";
      video.load();
      if (video.readyState >= 1) onFilmMeta();
    }
    const filmTick = () => {
      if (!video || !filmDur || video.readyState < 2 || video.seeking) return;
      const target = filmScrub.p * Math.max(0, filmDur - 0.06);
      const cur = video.currentTime;
      const next = cur + (target - cur) * 0.16;
      if (Math.abs(next - cur) > 0.002) video.currentTime = next;
    };
    gsap.ticker.add(filmTick);
    // iOS Low Power / Data Saver: a muted play()+pause() inside a user gesture
    // unlocks data loading + programmatic seeking. touchend/pointerup DO grant
    // user activation (touchstart does not); listeners stay armed until a
    // play() actually succeeds, so a rejected first attempt retries on the
    // next gesture instead of giving up forever
    const removeFilmUnlock = () => {
      window.removeEventListener("touchend", filmUnlock);
      window.removeEventListener("pointerup", filmUnlock);
    };
    function filmUnlock() {
      if (!video) return;
      video
        .play()
        .then(() => {
          video.pause();
          removeFilmUnlock();
        })
        .catch(() => {});
    }
    window.addEventListener("touchend", filmUnlock, { passive: true });
    window.addEventListener("pointerup", filmUnlock, { passive: true });

    // refresh start/end metrics after layout settles (Lenis mount, font + image
    // load) so beats fire at the correct scroll positions
    requestAnimationFrame(() => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    // intro: hero rises once on load (on the parent, so it doesn't fight the
    // scrubbed masked spans). Reverted (not just killed) in cleanup: an
    // orphaned from() leaves opacity:0 inline and the StrictMode re-run then
    // captures that poisoned value, pinning the logo invisible
    const intro = gsap.from(heroLogo, {
      opacity: 0,
      y: 24,
      duration: 1.5,
      ease: E,
      delay: 0.15,
    });

    /* ---- progress bar + header hide/show ---- */
    function onScroll() {
      const vh = window.innerHeight || 1;
      const y = window.scrollY || lenis.scroll || 0;
      const prog = progRef.current;
      if (prog) {
        const max = document.documentElement.scrollHeight - vh || 1;
        prog.style.width =
          (Math.max(0, Math.min(1, y / max)) * 100).toFixed(2) + "%";
      }
      const h = headerRef.current;
      if (h) {
        const past = y > vh * 0.5;
        h.style.background = past ? "rgba(28,27,25,.66)" : "rgba(28,27,25,0)";
        h.style.borderBottomColor = past
          ? "rgba(242,240,235,.07)"
          : "rgba(242,240,235,0)";
        h.style.backdropFilter = past ? "blur(16px)" : "none";
        (h.style as CSSStyleDeclaration & {
          webkitBackdropFilter?: string;
        }).webkitBackdropFilter = past ? "blur(16px)" : "none";
        const dy = y - lastYRef.current;
        if (menuOpenRef.current) {
          h.style.transform = "translateY(0)";
        } else if (y > vh * 0.9 && dy > 4) {
          h.style.transform = "translateY(-100%)";
        } else if (dy < -4 || y < vh * 0.6) {
          h.style.transform = "translateY(0)";
        }
      }
      lastYRef.current = y;
    }
    onScroll();

    /* ---- nav -> Lenis smooth scroll to fraction ---- */
    const navHandler = (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-go]");
      if (!btn || !root.contains(btn)) return;
      const frac = parseFloat(btn.getAttribute("data-go") || "0") || 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (menuOpenRef.current) setMenuOpen(false);
      lenis.scrollTo(max * frac, {
        duration: 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    };
    root.addEventListener("click", navHandler);

    /* ---- cleanup ---- */
    // NOTE: リサイズ時の refresh は ScrollTrigger 本体が面倒を見る
    // (ignoreMobileResize でアドレスバー分は無視)。手動リスナーは張らない
    return () => {
      root.removeEventListener("click", navHandler);
      removeFilmUnlock();
      if (video) video.removeEventListener("loadedmetadata", onFilmMeta);
      gsap.ticker.remove(filmTick);
      gsap.ticker.remove(tickerFn);
      intro.revert();
      st.kill();
      tl.kill();
      lenis.destroy();
    };
  }, []);

  /* -------------------------------- render -------------------------------- */

  return (
    <div ref={rootRef} style={{ position: "relative", background: "#1c1b19" }}>
      {/* cinematic vignette + film grain (unify the photography) */}
      <div className="gm-vignette" aria-hidden="true" />
      <div className="gm-grain" aria-hidden="true" />

      {/* progress hairline */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          zIndex: 400,
          pointerEvents: "none",
          background: "rgba(242,240,235,.05)",
        }}
      >
        <div
          ref={progRef}
          style={{
            height: "100%",
            width: "0%",
            background: "linear-gradient(90deg,rgba(242,240,235,.2),#f2f0eb)",
          }}
        />
      </div>

      {/* fixed header — centered wordmark + split nav. onScroll() owns
          background / borderBottom / backdropFilter / transform at runtime */}
      <header
        ref={headerRef}
        className="gm-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 clamp(20px,4vw,56px)",
          height: "clamp(72px,8vh,96px)",
          transition:
            "transform .6s cubic-bezier(0.16,1,0.3,1),background .5s ease,border-color .5s ease",
          background: "rgba(28,27,25,0)",
          borderBottom: "1px solid rgba(242,240,235,0)",
        }}
      >
        {/* LEFT nav group */}
        <nav
          className="gm-nav gm-nav-left"
          style={{
            gridColumn: 1,
            justifySelf: "start",
            alignItems: "center",
            gap: "clamp(22px,1.8vw,32px)",
          }}
        >
          <Link href="/about" className="gm-nav-link" style={NAV_LINK_STYLE}>
            愚問とは
          </Link>
          <FoodNavDropdown
            summaryClassName="gm-nav-link gm-nav-summary"
            summaryStyle={NAV_LINK_STYLE}
          />
          <Link href="/recruit" className="gm-nav-link" style={NAV_LINK_STYLE}>
            採用
          </Link>
        </nav>

        {/* CENTER wordmark lockup — gridColumn 明示必須: モバイルで左 nav が
            display:none になると自動配置で 1 列目に流れ、中央からズレる */}
        <button
          data-go="0"
          className="gm-logo"
          style={{
            gridColumn: 2,
            justifySelf: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(26px,2.6vw,32px)",
              fontWeight: 600,
              letterSpacing: ".2em",
              textIndent: ".2em",
              color: "#f2f0eb",
              lineHeight: 1,
            }}
          >
            愚問
          </span>
          <span
            style={{
              marginTop: 7,
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 10,
              letterSpacing: ".34em",
              textIndent: ".34em",
              paddingRight: ".34em",
              color: "#b9b2a6",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            中国料理　GUMON
          </span>
        </button>

        {/* RIGHT nav group + divider + 予約 */}
        <nav
          className="gm-nav gm-nav-right"
          style={{
            gridColumn: 3,
            justifySelf: "end",
            alignItems: "center",
            gap: "clamp(22px,1.8vw,32px)",
          }}
        >
          <Link href="/menu/drink" className="gm-nav-link" style={NAV_LINK_STYLE}>
            飲み物
          </Link>
          <Link href="/access" className="gm-nav-link" style={NAV_LINK_STYLE}>
            アクセス
          </Link>
          <Link href="/contact" className="gm-nav-link" style={NAV_LINK_STYLE}>
            お問い合わせ
          </Link>
          <span className="gm-nav-div" aria-hidden="true" />
          <button
            data-go="0.95"
            className="gm-reserve-outline"
            style={{
              cursor: "pointer",
              background: "transparent",
              border: "1px solid rgba(185,178,166,.55)",
              borderRadius: 999,
              color: "#f2f0eb",
              fontFamily: SERIF,
              fontSize: 13,
              letterSpacing: ".22em",
              textIndent: ".22em",
              padding: "11px 26px",
              lineHeight: 1,
            }}
          >
            予約
          </button>
        </nav>

        {/* hamburger (mobile) */}
        <button
          ref={burgerRef}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="メニュー"
          aria-expanded={menuOpen}
          aria-controls="gm-mobile-menu"
          className="gm-burger"
          style={{
            gridColumn: 3,
            justifySelf: "end",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
            width: 44,
            height: 44,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              display: "block",
              height: 1,
              width: 24,
              background: "#f2f0eb",
              transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              transition: "transform .5s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
          <span
            style={{
              display: "block",
              height: 1,
              width: 24,
              background: "#f2f0eb",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity .35s ease",
            }}
          />
          <span
            style={{
              display: "block",
              height: 1,
              width: 24,
              background: "#f2f0eb",
              transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              transition: "transform .5s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </button>
      </header>

      {/* mobile menu overlay */}
      <div
        ref={mobileMenuRef}
        id="gm-mobile-menu"
        data-open={menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 290,
          background: "rgba(24,23,21,.97)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          paddingTop: "max(88px, calc(env(safe-area-inset-top) + 72px))",
          paddingBottom: "max(28px, env(safe-area-inset-bottom))",
          overflowY: "auto",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          transition: "opacity .6s cubic-bezier(0.16,1,0.3,1),visibility .6s",
        }}
      >
        {(
          [
            { href: "/about", label: "愚問とは" },
            ...FOOD_CATEGORIES.map((c) => ({
              href: `/menu/${c.slug}`,
              label: c.titleJp,
            })),
            { href: "/menu/drink", label: "飲み物" },
            { href: "/access", label: "アクセス" },
            { href: "/contact", label: "お問い合わせ" },
            { href: "/recruit", label: "採用" },
          ] as { href: string; label: string }[]
        ).map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className="gm-mobile-link"
            onClick={() => setMenuOpen(false)}
            style={{ "--i": i, ...MOBILE_LINK_STYLE } as CSSProperties}
          >
            {l.label}
          </Link>
        ))}
        <button
          data-go="0.95"
          className="gm-reserve-outline gm-mobile-link"
          style={
            {
              "--i": FOOD_CATEGORIES.length + 5,
              marginTop: 14,
              cursor: "pointer",
              background: "transparent",
              border: "1px solid rgba(185,178,166,.5)",
              borderRadius: 999,
              color: "#f2f0eb",
              fontFamily: SERIF,
              fontSize: 17,
              letterSpacing: ".2em",
              textIndent: ".2em",
              padding: "14px 44px",
            } as CSSProperties
          }
        >
          予約
        </button>
      </div>

      {/* one pinned, scrubbed timeline — 高さは .gm-scroll-root(globals.css)。
          デスクトップ 820vh / モバイル 620vh */}
      <div ref={scrollRootRef} className="gm-scroll-root">
        <div
          ref={stageRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100svh",
            minHeight: "100svh",
            overflow: "hidden",
            background:
              "radial-gradient(125% 90% at 50% 32%,#1c1b19 0%,#1c1b19 66%)",
          }}
        >
          {/* parallax glows */}
          <div
            data-glow
            style={{
              position: "absolute",
              inset: "-25%",
              zIndex: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(40% 34% at 50% 42%,rgba(242,240,235,.05),rgba(28,27,25,0) 70%)",
              willChange: "transform",
            }}
          />
          <div
            data-glow2
            style={{
              position: "absolute",
              inset: "-25%",
              zIndex: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(32% 28% at 70% 64%,rgba(185,178,166,.05),rgba(28,27,25,0) 70%)",
              willChange: "transform",
            }}
          />

          {/* background stack (static positioning container; no longer transformed) */}
          <div
            data-velocity
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
            }}
          >
            {/* full-bleed food hero */}
            <div
              data-foodhero
              style={{
                position: "absolute",
                inset: "-10%",
                zIndex: 1,
                opacity: 0,
                willChange: "transform,opacity,filter",
                background: "#161412",
              }}
            >
              {/* モバイルは縦構図の専用アート(縦積み愚問)に切替 */}
              <picture>
                <source
                  media="(max-width: 860px)"
                  srcSet="/gumon-wall-mobile.webp"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gumon-wall.webp"
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </picture>
            </div>

            {/* dishes spread — REDUCED-MOTION-ONLY static stand-in for the
                cuisine film (the scrubbed video took over the 料理/飲み物
                crossfade). No src in JSX: the reduce branch assigns it from
                data-src, so motion users never download this 3MB image */}
            <div
              data-dishes
              style={{
                position: "absolute",
                inset: "-10%",
                zIndex: 1,
                opacity: 0,
                overflow: "clip",
                willChange: "transform,opacity,filter",
                background: "#161412",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="gm-dishes-fit"
                data-src="/dishes.webp"
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "saturate(1.16) contrast(1.06) brightness(1.02)",
                }}
              />
            </div>
            {/* cuisine film — scroll-scrubbed video (currentTime follows the
                scroll playhead). Revealed by clip-path mask + monotonic
                zoom-out across the 料理 beat; hidden for reduced motion
                (dishes.png serves as the static stand-in there). src/poster
                are assigned in the effect's motion branch only, so the SSR
                HTML triggers no download for reduced-motion visitors */}
            <div
              data-film
              style={{
                position: "absolute",
                inset: "-10%",
                zIndex: 1,
                opacity: 0,
                overflow: "clip",
                willChange: "transform,opacity",
                background: "#161412",
              }}
            >
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "saturate(1.12) contrast(1.05)",
                }}
              />
            </div>
            <div
              data-darken
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                opacity: 0.2,
                pointerEvents: "none",
                background:
                  "linear-gradient(180deg,rgba(28,27,25,.58) 0%,rgba(28,27,25,.2) 40%,rgba(28,27,25,.8) 100%)",
              }}
            />

            {/* letterbox bars — close in over the film chapter (scaleY only) */}
            <div
              data-bar-top
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 3,
                height: "clamp(36px,6svh,64px)",
                background: "#161412",
                transform: "scaleY(0)",
                transformOrigin: "center top",
                pointerEvents: "none",
                willChange: "transform",
              }}
            />
            <div
              data-bar-bot
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 3,
                height: "clamp(36px,6svh,64px)",
                background: "#161412",
                transform: "scaleY(0)",
                transformOrigin: "center bottom",
                pointerEvents: "none",
                willChange: "transform",
              }}
            />

            {/* BEAT 1 — hero */}
            <div
              data-scene="hero"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 24px",
                willChange: "transform,opacity",
              }}
            >
              <div
                data-hero-logo
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span className="mask">
                  <span
                    data-rise
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(13px,1.4vw,15px)",
                      fontWeight: 400,
                      letterSpacing: ".52em",
                      color: "#b9b2a6",
                      textIndent: ".52em",
                      paddingRight: ".52em",
                    }}
                  >
                    中 国 料 理
                  </span>
                </span>
                <h1
                  style={{
                    margin: "18px 0 0",
                    fontFamily: SERIF,
                    fontSize: "clamp(92px,21vw,272px)",
                    fontWeight: 500,
                    lineHeight: 0.9,
                    letterSpacing: ".1em",
                    textIndent: ".1em",
                    textShadow: "0 2px 18px rgba(0,0,0,.35)",
                  }}
                >
                  <span className="mask">
                    <span data-rise>愚問</span>
                  </span>
                </h1>
                <span className="mask">
                  <span
                    data-rise
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(12px,1.4vw,15px)",
                      fontWeight: 300,
                      letterSpacing: ".64em",
                      color: "rgba(242,240,235,.58)",
                      textIndent: ".64em",
                      paddingRight: ".64em",
                      paddingTop: 24,
                    }}
                  >
                    G U M O N
                  </span>
                </span>
              </div>
            </div>

            {/* BEAT 2 — about */}
            <div
              data-scene="about"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 clamp(24px,6vw,90px)",
                opacity: 0,
                willChange: "opacity",
              }}
            >
              <p
                data-fade
                style={{
                  margin: "0 0 34px",
                  fontFamily: SERIF,
                  fontSize: "clamp(12px,1.3vw,14px)",
                  fontWeight: 400,
                  letterSpacing: ".42em",
                  color: "#b9b2a6",
                }}
              >
                愚 問 に つ い て
              </p>
              <h2
                style={{
                  margin: "0 0 34px",
                  fontFamily: SERIF,
                  fontSize: "clamp(30px,5.4vw,72px)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  letterSpacing: ".08em",
                }}
              >
                <span className="mask">
                  <span data-rise>問いを重ね、</span>
                </span>
                <span className="mask">
                  <span data-rise>一皿に答える。</span>
                </span>
              </h2>
              <p
                data-fade
                style={{
                  margin: "0 auto",
                  maxWidth: 540,
                  fontSize: "clamp(14px,1.6vw,18px)",
                  fontWeight: 300,
                  lineHeight: 2.2,
                  color: "rgba(242,240,235,.66)",
                }}
              >
                中国料理の伝統を、現代の感性で。
                <br />
                素材と火と時間に静かに問いを重ね、
                <br />
                ひと皿の答えとしてお出しします。
              </p>
              <Link
                href="/about"
                className="gm-detail-link"
                data-fade
                style={{ marginTop: "clamp(26px,4.5vh,40px)" }}
              >
                愚問とは — 続きを読む
                <span className="gm-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            {/* BEAT 3 — editorial menu (whole dishes spread sits behind) */}
            <div
              data-scene="food"
              className="gm-menu-panel"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "clamp(88px,13vh,160px)",
                bottom: "clamp(40px,7vh,90px)",
                zIndex: 6,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                pointerEvents: "none",
                opacity: 0,
                willChange: "opacity,transform",
              }}
            >
              <div className="gm-menu">
                <p data-food-label className="gm-menu-kicker">
                  料 理 ／ CUISINE
                </p>
                {CATS.map((c) => (
                  <section key={c.label} data-cat className="gm-menu-sec">
                    <div className="gm-menu-head">
                      <p
                        className="mask"
                        style={{ margin: 0, width: "max-content" }}
                      >
                        <span data-cat-rise className="gm-menu-h">
                          {c.label}
                        </span>
                      </p>
                      <span data-cat-rule className="gm-menu-rule" aria-hidden="true" />
                    </div>
                    {c.items.slice(0, 2).map((d) => (
                      <div key={d.name} data-cat-row className="gm-menu-row">
                        <div className="gm-menu-line">
                          {d.img && (
                            <span
                              className="gm-menu-thumb"
                              aria-hidden="true"
                              style={{ backgroundImage: `url(${d.img})` }}
                            />
                          )}
                          <span className="gm-menu-name">
                            {d.name}
                            {d.signature && (
                              <span className="gm-menu-sig">看板</span>
                            )}
                          </span>
                          <span className="gm-menu-dots" aria-hidden="true" />
                          <span className="gm-menu-price">{d.price}</span>
                        </div>
                        {d.desc && <p className="gm-menu-desc">{d.desc}</p>}
                      </div>
                    ))}
                    <div data-cat-row className="gm-menu-more">
                      <Link
                        href={`/menu/${c.slug}`}
                        className="gm-detail-link"
                      >
                        詳細はこちら
                        <span className="gm-arrow" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* BEAT 4 — drink */}
            <div
              data-scene="drink"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 clamp(24px,6vw,90px)",
                opacity: 0,
                willChange: "opacity",
              }}
            >
              <div className="gm-drink-card">
                <p
                  data-fade
                  style={{
                    margin: "0 0 30px",
                    fontFamily: SERIF,
                    fontSize: "clamp(12px,1.3vw,14px)",
                    fontWeight: 400,
                    letterSpacing: ".42em",
                    color: "#b9b2a6",
                  }}
                >
                  飲 み 物 ／ DRINK
                </p>
                <h2
                  style={{
                    margin: "0 0 46px",
                    fontFamily: SERIF,
                    fontSize: "clamp(26px,4.4vw,56px)",
                    fontWeight: 400,
                    lineHeight: 1.5,
                    letterSpacing: ".08em",
                  }}
                >
                  <span className="mask">
                    <span data-rise>一皿に、寄り添う一杯を。</span>
                  </span>
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                    gap: "clamp(24px,4vw,60px)",
                    maxWidth: 840,
                    width: "100%",
                  }}
                >
                  {DRINK_ITEMS.map((dr) => (
                    <div key={dr.name} data-fade>
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: "clamp(19px,2.2vw,26px)",
                          fontWeight: 400,
                          letterSpacing: ".08em",
                          marginBottom: 12,
                        }}
                      >
                        {dr.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 300,
                          lineHeight: 1.9,
                          color: "rgba(242,240,235,.72)",
                          letterSpacing: ".03em",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {dr.desc}
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/menu/drink"
                  className="gm-detail-link"
                  data-fade
                  style={{ marginTop: "clamp(28px,5vh,44px)" }}
                >
                  飲み物の詳細はこちら
                  <span className="gm-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* BEAT 5 — access */}
            <div
              data-scene="access"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 clamp(24px,6vw,90px)",
                opacity: 0,
                willChange: "opacity",
              }}
            >
              <div
                className="gm-access-grid"
                style={{
                  maxWidth: 1040,
                  width: "100%",
                  display: "grid",
                  gap: "clamp(34px,5vw,80px)",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p
                    data-fade
                    style={{
                      margin: "0 0 28px",
                      fontFamily: SERIF,
                      fontSize: "clamp(12px,1.3vw,14px)",
                      fontWeight: 400,
                      letterSpacing: ".42em",
                      color: "#b9b2a6",
                    }}
                  >
                    アクセス ／ ACCESS
                  </p>
                  <h2
                    style={{
                      margin: "0 0 30px",
                      fontFamily: SERIF,
                      fontSize: "clamp(26px,4vw,52px)",
                      fontWeight: 400,
                      lineHeight: 1.45,
                      letterSpacing: ".06em",
                    }}
                  >
                    <span className="mask">
                      <span data-rise>静けさは、</span>
                    </span>
                    <span className="mask">
                      <span data-rise>路地の奥に。</span>
                    </span>
                  </h2>
                  <dl
                    data-fade
                    style={{
                      margin: 0,
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "13px 26px",
                      fontSize: 14,
                      lineHeight: 1.85,
                    }}
                  >
                    {ACCESS.map((a) => (
                      <div key={a.k} style={{ display: "contents" }}>
                        <dt
                          style={{
                            fontFamily: SERIF,
                            fontSize: 11,
                            letterSpacing: ".26em",
                            color: "#b9b2a6",
                            paddingTop: 3,
                          }}
                        >
                          {a.k}
                        </dt>
                        <dd
                          style={{
                            margin: 0,
                            fontWeight: 300,
                            color: "rgba(242,240,235,.82)",
                          }}
                        >
                          {a.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href="/access"
                    className="gm-detail-link"
                    data-fade
                    style={{ marginTop: "clamp(20px,3.5vh,32px)" }}
                  >
                    アクセスの詳細はこちら
                    <span className="gm-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
                <div
                  data-map
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4/5",
                    overflow: "hidden",
                    willChange: "transform,clip-path,filter",
                    background: "#161412",
                    border: "1px solid rgba(242,240,235,.08)",
                  }}
                >
                  <iframe
                    className="gm-map-dark"
                    src="https://maps.google.com/maps?q=%E5%A4%A7%E9%98%AA%E5%BA%9C%E8%B2%9D%E5%A1%9A%E5%B8%82%E5%8A%A0%E7%A5%9E1-4-26&output=embed&hl=ja&z=17"
                    title="中国料理 愚問 へのアクセス地図"
                    width="100%"
                    height="100%"
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: 0,
                      display: "block",
                    }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            {/* BEAT 6 — reserve */}
            <div
              data-scene="reserve"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 24px",
                opacity: 0,
                willChange: "opacity",
              }}
            >
              <span
                data-reserve-logo
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(70px,14vw,168px)",
                  fontWeight: 500,
                  letterSpacing: ".1em",
                  textIndent: ".1em",
                  lineHeight: 1,
                  willChange: "transform,opacity,filter",
                }}
              >
                愚問
              </span>
              <p
                data-fade
                style={{
                  margin: "26px 0 0",
                  fontFamily: SERIF,
                  fontSize: "clamp(13px,1.5vw,17px)",
                  fontWeight: 300,
                  letterSpacing: ".12em",
                  color: "rgba(242,240,235,.68)",
                }}
              >
                ご予約を承っております。
              </p>
              <a
                data-fade
                href="tel:0724306038"
                style={{
                  margin: "14px 0 0",
                  textDecoration: "none",
                  fontFamily: SERIF,
                  fontSize: "clamp(22px,3vw,34px)",
                  fontWeight: 300,
                  letterSpacing: ".1em",
                  color: "#f2f0eb",
                }}
              >
                072-430-6038
              </a>
              <div
                data-fade
                style={{
                  marginTop: "clamp(30px,5vh,48px)",
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <a
                  href="tel:0724306038"
                  className="gm-tel-btn"
                  style={{
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
                <button
                  data-go="0"
                  className="gm-back-btn"
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "1px solid rgba(242,240,235,.28)",
                    color: "#f2f0eb",
                    fontFamily: SERIF,
                    fontSize: 15,
                    letterSpacing: ".16em",
                    padding: "14px 32px",
                  }}
                >
                  最初に戻る
                </button>
              </div>
              <div
                data-fade
                style={{
                  marginTop: "clamp(20px,3.5vh,32px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
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
                <p className="gm-cta-web-note" style={{ margin: 0 }}>
                  お電話でのご予約が、店にはいちばんありがたい方法です。
                </p>
              </div>
              <div
                data-fade
                style={{
                  marginTop: "clamp(16px,3vh,26px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                }}
              >
                <Link href="/contact" className="gm-detail-link">
                  そのほかのお問い合わせ
                  <span className="gm-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <InstagramLink />
              </div>
              <p
                style={{
                  margin: "clamp(40px,7vh,72px) 0 0",
                  fontSize: 11,
                  letterSpacing: ".24em",
                  color: "rgba(242,240,235,.58)",
                }}
              >
                © GUMON
              </p>
            </div>
          </div>
          {/* /velocity */}

          {/* scroll cue */}
          <div
            data-cue
            className="gm-cue"
            style={{
              position: "absolute",
              zIndex: 7,
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 9,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: ".36em",
                color: "rgba(242,240,235,.5)",
                paddingLeft: ".36em",
              }}
            >
              SCROLL
            </span>
            <span
              style={{
                display: "block",
                width: 1,
                height: 44,
                background:
                  "linear-gradient(180deg,rgba(242,240,235,.7),transparent)",
                animation: "guCue 2.4s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
