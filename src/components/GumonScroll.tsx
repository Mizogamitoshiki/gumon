"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import FoodNavDropdown from "./FoodNavDropdown";
import InstagramLink from "./InstagramLink";
import { CATS, DRINK_ITEMS, FOOD_CATEGORIES } from "@/lib/menu";
import { IS_RECRUITING } from "@/lib/recruit";
import { GUMON_SCENE_MOTION } from "@/lib/motion-tokens";
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
      // S5(受け止めの半拍)は一行だけの休符 — 静的縦積みでは 100vh も要らない
      const restStatic = q('[data-scene="rest"]');
      if (restStatic) restStatic.style.minHeight = "42vh";
      // S2(問いの帳)も一行のみ — 通常コンテンツとして読める高さに抑える
      const questionStatic = q('[data-scene="question"]');
      if (questionStatic) questionStatic.style.minHeight = "56vh";
      // モバイルの RM: 各シーンを 100vh で埋めると内容の少ないシーンに大きな
      // 空白が生まれ、最終シーン(reserve)では © GUMON の後に「フッターの先の
      // 何もない領域」が残ってスクロールできてしまう(実機報告 2026-07-24 —
      // iOS「視差効果を減らす」ON の端末はこの静的版が表示される)。
      // 自然高さ+一定の縦余白で締め、ページ終端を © 直後に揃える。
      // デスクトップの RM は従来どおり 100vh(QA 済みの見え方を維持)
      if (window.matchMedia("(max-width: 860px)").matches) {
        qa("[data-scene]").forEach((el) => {
          el.style.minHeight = "auto";
          el.style.padding = "72px 24px";
        });
      }
      // S4 の章句はフィルム(動画)専用の演出 — 静的表示では /about が同じ
      // 言葉(素材に問う/火に問う/時間に問う)を担うため出さない
      const filmWordsEl = q("[data-filmwords]");
      if (filmWordsEl) filmWordsEl.style.display = "none";
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
      // hero のアンビエント映像も同様に出さない(src 未付与のまま)
      const ambientEl = q("[data-hero-ambient]");
      if (ambientEl) ambientEl.style.display = "none";
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
      armMedia(); // 最初のスクロールで動画/poster を装填(下の media arming 参照)
      ScrollTrigger.update();
      onScroll();
    });
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    /* ---- element refs ---- */
    const foodhero = q("[data-foodhero]");
    const heroAmbient = q("[data-hero-ambient]");
    const heroAmbientVideo = root.querySelector<HTMLVideoElement>(
      "[data-hero-ambient-video]"
    );
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
    const reserveChars = qa("[data-reserve-char]");
    const cue = q("[data-cue]");
    // S4 章句(三つの問い)と S5 受け止めの半拍(docs/cinematic/experience-plan.md)
    const filmWordsWrap = q("[data-filmwords]");
    const filmWords = qa("[data-film-line]");
    const restScene = q('[data-scene="rest"]');
    const restLine = q("[data-rest-line]");
    // S2 問いの帳(Stage 11 Increment 1)
    const question = q('[data-scene="question"]');
    const questionLine = q("[data-question-line]");

    /* ---- initial states ---- */
    // autoAlpha (opacity + visibility) so off-beat scenes are removed from
    // hit-testing AND tab order — their detail links aren't clickable/focusable
    // until the scene is on screen. Visually identical to opacity.
    gsap.set([question, about, food, restScene, drink, access, reserve], {
      autoAlpha: 0,
    });
    gsap.set(foodLabel, { opacity: 0 });
    // S5 の一行は fade-quiet(blur なし・8px)で現す
    gsap.set(restLine, { opacity: 0, y: GUMON_SCENE_MOTION.fadeQuiet.y });
    // 章句コンテナ(下部スクリム込み)は章句の出現期間だけ灯す —
    // 常時表示だと壁のビートまで暗くしてしまうため opacity をタイムラインで持つ
    gsap.set(filmWordsWrap, { opacity: 0 });
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
    // S7 drink(静けさ区間)だけ弱い初期状態に上書き: fade-quiet(8px・blurなし)。
    // 他 Scene の data-fade には影響させない(CDE 6.4 弱化条件)
    qaIn(q('[data-scene="drink"]'), "[data-fade]").forEach((s) =>
      gsap.set(s, {
        opacity: 0,
        y: GUMON_SCENE_MOTION.fadeQuiet.y,
        ...(lite ? {} : { filter: "blur(0px)" }),
      })
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

    /* ---- Scene time offsets (timeline units) — single source of truth.
       S4(フィルム単独章)・S5(受け止めの半拍)・S2(問いの帳)は各ビートを
       ここから引く。スクロール距離は .gm-scroll-root(globals.css)の高さと
       比例(デスクトップ 1440vh ≈78.8vh/unit・モバイル 1095vh ≈59.9vh/unit)。
       高さを変えたらここも見直すこと ---- */
    const T = {
      heroExit: 0.3,
      question: 0.85, // S2 問いの帳 — 一行の立ち上がり(記憶層2)
      questionGhost: 2.4, // S2 残像化。T.question+0.9(立ち上がり完了)からここまでが hold-quiet(≈0.65unit)
      ambientOut: 3.1, // アンビエント退場tweenの完了点(= questionGhost + 0.7)。onScroll の pause 判定もここを見る
      about: 2.65, // ここから下は S2 挿入で一律 +1.5(相対間隔は G2 合格時と同一)
      aboutOut: 3.8,
      dim: 3.9, // 幕間の減光(フィルムを迎える暗転)
      film: 4.0, // S4 火の返事 — スクラブ本編(単独章。品書きはもう重ねない)
      rest: 7.2, // S5 受け止めの半拍 — 圧倒直後の「吐く」
      food: 8.7, // S6 お品書き
      foodExit: 11.4,
      breath: 11.6, // フィルムの take が p=1 に達する点(S6 の終わり。以降は静止フレーム)
      menuRest: 12.0, // S6→S7 の hold-quiet 開始(品書きが引かれ終わる点)。ここでバー退場・フィルム→壁の受け渡し(=休符の背景)
      drink: 12.9, // S7 一杯の静けさ — 開始。hold-quiet は menuRest→drink の 0.9unit
      drinkOut: 14.8, // S7 終了。読み終わり(≈14.31)から静かな保持 ≈0.5unit を置く
      access: 14.9, // ここから下は Increment 2 で一律 +1.4(内部の演出値は不変)
      accessOut: 16.1,
      reserve: 16.4,
      drift: 17.1, // 全域リニア視差(glow/壁)の長さ ≒ タイムライン全長
    } as const;
    const SM = GUMON_SCENE_MOTION;

    /* ---- one master timeline, scrubbed by ScrollTrigger ---- */
    const tl = gsap.timeline({ paused: true, defaults: { ease: E } });

    /* ---- Scene builders(QS19 保守性: Scene 単位のモジュール化) ----
       関数名は設計書(experience-plan.md の Scene Map)と 1:1 対応。
       末尾の呼び出し順 = 従来の tween 挿入順を厳密に維持した純リファクタで、
       演出値・位置・ease は 1 つも変えていない(Block A Part 2)。
       視差グロー2層はここで削除済み(削除テスト: A/B 視覚差ゼロ+不透明な
       壁レイヤーに常時遮蔽され視覚出力が存在しなかった — Restraint) ---- */

    // S1 静けさの入場 — hero の退場と、S2 まで残す台所の気配(アンビエント)
    const buildHeroScene = () => {
      tl.to(cue, { opacity: 0, duration: 0.3 }, 0);
      // autoAlpha: 退場後は hit-test からも外す(hero に CTA ボタンがあるため、
      // 不可視のまま tel: リンクが誤タップされる事故を防ぐ)
      tl.to(hero, { autoAlpha: 0, scale: 1.04, duration: 0.7, ease: "power2.in" }, T.heroExit);
      tl.fromTo(
        lines(hero),
        { yPercent: 0 },
        { yPercent: -110, duration: 0.7, ease: "power2.in", stagger: 0.05 },
        T.heroExit
      );
      // hero のアンビエント映像(台所の気配)は S2 の残像化まで残す —
      // 「台所の気配の中で問いが立つ」(experience-plan 5章 S1→S2 受け渡し)。
      // 退場完了 = T.questionGhost + 0.7 = T.ambientOut(onScroll の pause 判定と一致)
      tl.to(heroAmbient, { opacity: 0, duration: 0.7, ease: "power2.in" }, T.questionGhost);
    };

    // S2 問いの帳(記憶層2) — 一行だけが立ち、hold-quiet で読む時間を置いて
    // から残像(opacity 0.09 — 問いの気配は残しつつ S3 見出しの可読を優先)
    // となり、その上に S3 の応答見出しが立つ。
    // T.question+0.9(立ち上がり完了) → T.questionGhost は意図的な休符(何も動かさない)
    const buildQuestionScene = () => {
      tl.to(question, { autoAlpha: 1, duration: 0.4 }, T.question - 0.1);
      tl.to(questionLine, { yPercent: 0, duration: 0.9, ease: E }, T.question);
      tl.to(
        question,
        { autoAlpha: 0.09, duration: 0.6, ease: "power1.inOut" },
        T.questionGhost
      );
      tl.to(question, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, T.dim);
    };

    // 背景 — 壁の Ken Burns(全域): ONE calm, monotonic, vertical-only drift —
    // a single living photograph slowly breathing. No reversals, no rotation,
    // no horizontal pan, no animated blur (GPU transform only).
    // 8% travel sits inside the layer's -10% overscan, so edges never show.
    const buildWallDrift = () => {
      tl.to(foodhero, { scale: 1.04, yPercent: 4, ease: "none", duration: 15.5 }, 0);
    };

    // S4 火の返事 — scroll-scrubbed CUISINE FILM(シグネチャームーブ・単独章)。
    // scroll が再生ヘッド(filmScrub.p -> currentTime)、clip-path で「台所の窓が
    // 開く」、ズームは 1.12 -> 1.01 へ単調、レターボックスが閉じる。章句(三つの
    // 問い)は T.film/T.rest 相対で積み上がり、章の終わりに揃って退場して S5 へ。
    // すべて opacity/transform/clip-path のみ
    const buildFilmScene = () => {
      tl.to(film, { opacity: 1, duration: 0.9, ease: "power1.inOut" }, T.film);
      tl.to(film, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 }, T.film);
      tl.to(film, { scale: 1.05, yPercent: 0, duration: 1.4 }, T.film);
      tl.to(foodhero, { opacity: 0, duration: 1.0, ease: "power1.in" }, T.film + 0.1);
      // slow linear drift for the rest of the take (still monotonic zoom-out).
      // ends ≈T.menuRest+1.0 — フィルムが壁へ溶け終わる点(buildMenuRestGap)と一致
      tl.to(
        film,
        { scale: 1.01, yPercent: 1.5, ease: "none", duration: 7.6 },
        T.film + 1.4
      );
      tl.to([barTop, barBot], { scaleY: 1, duration: 0.9, stagger: 0.06 }, T.film + 0.1);
      // scroll position IS the playhead. The take spends its main travel
      // (p 0 -> .85) inside S4, then crawls to 1 behind S5/S6 — the dish is
      // handed over mid-change, never shown "finished" (完成皿は見せきらない)
      tl.to(filmScrub, { p: 0.85, ease: "none", duration: T.rest - T.film }, T.film);
      tl.to(filmScrub, { p: 1, ease: "none", duration: T.breath - T.rest }, T.rest);

      // 章句 —「火に問う」は麻婆豆腐の寄り(v≈2.8s)に重なる配時(qa-baseline.md)
      const wordIn = [T.film + 0.35, T.film + 1.05, T.film + 1.75];
      // 下部スクリム(コンテナ背景)ごと点灯・消灯: 明るい映像上での可読性確保
      tl.to(
        filmWordsWrap,
        { opacity: 1, duration: 0.5, ease: "power1.inOut" },
        T.film + 0.2
      );
      tl.to(filmWordsWrap, { opacity: 0, duration: 0.45, ease: "power1.in" }, T.rest + 0.15);
      filmWords.forEach((w, i) => {
        tl.to(
          w,
          { yPercent: 0, duration: SM.riseLine.duration, ease: SM.riseLine.ease },
          wordIn[i] ?? T.film + 0.5
        );
      });
      tl.to(
        filmWords,
        {
          yPercent: -110,
          duration: SM.exitLine.duration,
          ease: SM.exitLine.ease,
          stagger: 0.05,
        },
        T.rest - 0.4
      );
    };

    // S5 受け止めの半拍 — 圧倒直後の「吐く」(QS 7章)。一行だけの静けさ。
    // フィルムは減光したまま奥で crawl を続ける(湯気は続いている)
    const buildRestScene = () => {
      tl.to(restScene, { autoAlpha: 1, duration: 0.4 }, T.rest + 0.1);
      tl.to(
        restLine,
        { opacity: 1, y: 0, duration: SM.fadeQuiet.duration, ease: SM.fadeQuiet.ease },
        T.rest + 0.25
      );
      tl.to(
        restLine,
        { opacity: 0, y: -6, duration: SM.exitLine.duration, ease: SM.exitLine.ease },
        T.food - 0.4
      );
      tl.to(restScene, { autoAlpha: 0, duration: 0.4 }, T.food - 0.25);
    };

    // S6→S7 hold-quiet — 品書きが引かれた直後の無情報の間。間の「内容」は
    // フィルム→壁の受け渡しそのもの — バーが開き、静止した一皿の映像が
    // 呼吸する壁に溶けて、S7 は静かな壁の上に置かれる
    // (experience-plan 5章 B6「溶ける(間をおいて)」・7章 S7=静けさ区間)
    const buildMenuRestGap = () => {
      tl.to([barTop, barBot], { scaleY: 0, duration: 0.6, ease: "power2.in" }, T.menuRest);
      tl.to(film, { opacity: 0, duration: 0.9, ease: "power1.in" }, T.menuRest + 0.1);
      tl.to(foodhero, { opacity: 1, duration: 0.9, ease: "power1.inOut" }, T.menuRest + 0.05);
    };

    // S3 台所の姿勢(about) + 減光の呼吸: フィルム章(S4)は明るく(0.34)、
    // S5 で翳り(0.62)、品書き(S6)の可読コントラストで 0.72(診断003の改善値)へ
    const buildAboutScene = () => {
      tl.to(about, { autoAlpha: 1, duration: 0.5 }, T.about);
      tl.to(lines(about), { yPercent: 0, duration: 1.0, stagger: 0.1 }, T.about + 0.05);
      tl.to(
        fades(about),
        { opacity: 1, y: 0, ...blurOut(), duration: 1.0, stagger: 0.1 },
        T.about + 0.2
      );
      tl.to(about, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, T.aboutOut);
      tl.to(darken, { opacity: 0.34, duration: 0.7, ease: "power2.in" }, T.dim);
      tl.to(darken, { opacity: 0.62, duration: 0.7, ease: "power1.inOut" }, T.rest);
      tl.to(darken, { opacity: 0.72, duration: 0.6, ease: "power1.inOut" }, T.food - 0.2);
    };

    // S6 お品書き — sections reveal in sequence (header rule draws, rows rise)
    // then PERSIST so the whole menu can be read; the panel fades out as one
    // unit before the S6→S7 gap. All transform/opacity/blur only.
    const buildMenuScene = () => {
      tl.to(food, { autoAlpha: 1, duration: 0.5 }, T.food);
      tl.to(foodLabel, { opacity: 1, duration: 0.8 }, T.food + 0.05);

      const catTimes = [T.food + 0.25, T.food + 0.8, T.food + 1.3];
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
      // (kicker + sections are children) before the S6→S7 gap ("間")
      tl.to(food, { autoAlpha: 0, y: -18, duration: 0.6, ease: "power2.in" }, T.foodExit);
    };

    // S7 一杯の静けさ — ピーク(S4)と情報密度(S6)を受けた「吐く」区間。
    // fade-quiet(8px・blurなし・power1.out)を S6 の行(16px・blur・expo)より
    // 明確に弱く、stagger は急かさず 0.12。読み終わり(≈T.drink+1.41)から
    // T.drinkOut まで静かな保持
    const buildDrinkScene = () => {
      tl.to(drink, { autoAlpha: 1, duration: 0.5 }, T.drink);
      tl.to(lines(drink), { yPercent: 0, duration: 1.0, stagger: 0.08 }, T.drink + 0.1);
      tl.to(
        fades(drink),
        {
          opacity: 1,
          y: 0,
          duration: SM.fadeQuiet.duration,
          ease: SM.fadeQuiet.ease,
          stagger: 0.12,
        },
        T.drink + 0.25
      );
      tl.to(drink, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, T.drinkOut);
    };

    // S8 路地の奥(access) — 地図の開放=実在の確認
    const buildAccessScene = () => {
      tl.to(access, { autoAlpha: 1, duration: 0.5 }, T.access);
      tl.to(lines(access), { yPercent: 0, duration: 1.0, stagger: 0.1 }, T.access + 0.1);
      tl.to(
        fades(access),
        { opacity: 1, y: 0, ...blurOut(), duration: 1.0, stagger: 0.12 },
        T.access + 0.25
      );
      tl.to(
        mapEl,
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ...blurOut(), duration: 1.2 },
        T.access + 0.2
      );
      tl.to(access, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, T.accessOut);
    };

    // S9 答えは、席で。(reserve) — 円環の回収。letterSpacing アニメーションは
    // Block A で transform へ置換: 「散っていた問いが店名に収束する」余韻を
    // 2 文字それぞれの translateX(±0.16em→0 = 旧 0.42em→0.1em の字間差と同量)
    // で等価表現。最終字間は静的スタイル(.1em)で確定 — レイアウトは動かない
    const buildReserveScene = () => {
      tl.to(reserve, { autoAlpha: 1, duration: 0.5 }, T.reserve);
      tl.fromTo(
        reserveLogo,
        { opacity: 0.35, y: 14, ...blurIn(9) },
        { opacity: 1, y: 0, ...blurOut(), duration: 1.2 },
        T.reserve + 0.05
      );
      tl.fromTo(
        reserveChars,
        { x: (i: number) => (i === 0 ? "-0.16em" : "0.16em") },
        { x: 0, duration: 1.2 },
        T.reserve + 0.05
      );
      tl.to(
        fades(reserve),
        { opacity: 1, y: 0, ...blurOut(), duration: 1.0, stagger: 0.12 },
        T.reserve + 0.4
      );
    };

    // 構築(呼び出し順 = 従来の挿入順)
    buildHeroScene();
    buildQuestionScene();
    buildWallDrift();
    buildFilmScene();
    buildRestScene();
    buildMenuRestGap();
    buildAboutScene();
    buildMenuScene();
    buildDrinkScene();
    buildAccessScene();
    buildReserveScene();

    // drive the timeline with ScrollTrigger. scrub:0.6 gives the scrubbed
    // background weight/inertia (single smoothing source; Lenis lerp stays 0.085)
    const st = ScrollTrigger.create({
      trigger: scrollRootRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      animation: tl,
    });

    /* ---- スマホ特有の動き: velocity breathing(2026-07-24) ----
       フリックの勢いに背景メディアがわずかに遅れて追従し、指を離すと
       柔らかく原位置へ整う(親指の速度が奥行きに変換される、タッチ専用の
       質感)。対象はタイムラインが transform を触らない「内側」のメディア
       のみ(コンテナ側の scale/yPercent/opacity と競合しない)。コンテナは
       inset:-10% ののりしろを持つため ±12px の移動で縁は露出しない。
       transform のみ・power3.out で減速・reduced-motion はこの分岐に
       到達しない(上で return 済み)。デスクトップには掛けない */
    let vbCleanup: (() => void) | null = null;
    if (lite) {
      const vbTargets = [
        q("[data-foodhero] img"),
        q("[data-film] video"),
        q("[data-hero-ambient] video"),
      ].filter((el): el is HTMLElement => !!el);
      const vbSetters = vbTargets.map((el) =>
        gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" }),
      );
      const vbTrigger = ScrollTrigger.create({
        trigger: scrollRootRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate(self) {
          // 下フリック(正の速度)で背景が一拍遅れて沈む=奥行き。±12px 上限
          const y = gsap.utils.clamp(-12, 12, self.getVelocity() / 280);
          vbSetters.forEach((set) => set(y));
        },
      });
      // スクロールが静止したら必ず原位置へ(残留オフセットを残さない)
      const vbSettle = () => vbSetters.forEach((set) => set(0));
      ScrollTrigger.addEventListener("scrollEnd", vbSettle);
      vbCleanup = () => {
        ScrollTrigger.removeEventListener("scrollEnd", vbSettle);
        vbTrigger.kill();
      };
    }

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
    if (video) video.addEventListener("loadedmetadata", onFilmMeta);

    /* ---- media arming(Stage 12 LCP対策): 動画2本(同一URL・キャッシュ共有)と
       film poster の装填は「最初のユーザー操作」まで遅らせる。
       - Lighthouse で LCP 要素が不可視の film poster(339KB)になっており、
         初期クリティカルパスに mp4 1.1MB + poster が乗っていた(qa-report)
       - 実ユーザーの操作(pointermove/touch/スクロール)は数百ms以内に起きる
         ため、アンビエントの立ち上がり体感はマウント時装填とほぼ同等
       - フィルム章は全行程の約22%地点なので装填猶予は十分
       - reduced-motion は上の分岐で return 済み(元々非ダウンロード) ---- */
    let mediaArmed = false;
    const armMedia = () => {
      if (mediaArmed) return;
      mediaArmed = true;
      removeArmListeners();
      if (video) {
        video.poster = "/dishes-poster.webp";
        video.src = "/cuisine-cinematic-opt.mp4";
        video.load();
        if (video.readyState >= 1) onFilmMeta();
      }
      // hero アンビエント: 同一ファイルの通常ループ再生(キャッシュ共有)。
      // 自動再生が拒否されても致命ではない(静かな壁のまま)
      if (heroAmbientVideo) {
        heroAmbientVideo.src = "/cuisine-cinematic-opt.mp4";
        heroAmbientVideo.play().catch(() => {});
        gsap.to(heroAmbient, {
          opacity: 0.16,
          duration: 2.2,
          ease: "power2.out",
          delay: 0.5,
        });
      }
    };
    const ARM_EVENTS = ["pointermove", "pointerdown", "touchstart", "keydown"];
    const removeArmListeners = () =>
      ARM_EVENTS.forEach((ev) => window.removeEventListener(ev, armMedia));
    ARM_EVENTS.forEach((ev) =>
      window.addEventListener(ev, armMedia, { passive: true })
    );
    // 復元スクロール(深いリンク・リロード)で既にページ中腹にいる場合は即装填
    if ((window.scrollY || 0) > 0) armMedia();
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
      armMedia(); // ジェスチャ時点で未装填なら先に装填(src なしの play() は失敗する)
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

    // intro: secondary hero lines (直下の.mask=中国料理/GUMON/キャッチ) rise once
    // on load. h1「愚問」= LCP要素は対象外で初回描画から可視 — MOT-7(LCP要素への
    // 入場アニメ禁止)。全体フェードがLCPを3.2sへ遅延させていた(perf-measurement-001)。
    // 外側.maskへのopacity/yのため、内側spanを使うスクラブ演出とは衝突しない。
    // Reverted (not just killed) in cleanup: an orphaned from() leaves opacity:0
    // inline and the StrictMode re-run then captures that poisoned value,
    // pinning the lines invisible
    const intro = gsap.from(qaIn(heroLogo, ":scope > .mask"), {
      opacity: 0,
      y: 24,
      duration: 1.5,
      ease: E,
      delay: 0.15,
      stagger: 0.08,
    });

    /* ---- progress bar + header hide/show ---- */
    let ambientPaused = false;
    function onScroll() {
      const vh = window.innerHeight || 1;
      const y = window.scrollY || lenis.scroll || 0;
      // hero を通過したらアンビエント映像を止める(電池・デコード節約)。戻れば再開
      if (heroAmbientVideo) {
        // S2(問いの帳)までアンビエントが残るため、pause 判定は固定スクロール
        // 距離ではなくマスタータイムライン時間で行う(PC/モバイルの vh/unit 差に
        // 依存せず、常に同じ Scene 位置 = アンビエント退場完了点 T.ambientOut に
        // 連動)。戻れば再開する挙動は従来どおり。リスナー追加なし(既存 onScroll 内)
        const past = tl.time() > T.ambientOut;
        if (past && !ambientPaused) {
          heroAmbientVideo.pause();
          ambientPaused = true;
        } else if (!past && ambientPaused) {
          heroAmbientVideo.play().catch(() => {});
          ambientPaused = false;
        }
      }
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
      removeArmListeners();
      removeFilmUnlock();
      if (video) video.removeEventListener("loadedmetadata", onFilmMeta);
      gsap.ticker.remove(filmTick);
      gsap.ticker.remove(tickerFn);
      vbCleanup?.();
      intro.revert();
      st.kill();
      tl.kill();
      lenis.destroy();
    };
  }, []);

  /* -------------------------------- render -------------------------------- */

  return (
    <div ref={rootRef} style={{ position: "relative", background: "#1c1b19" }}>
      {/* graceful degradation(QS20): JS が読み込めない環境では演出を構築でき
          ず、Scene 容器のインライン opacity:0 が残って本文が見えない。noscript
          スタイルで reduced-motion 分岐と同じ「静的縦積み・全文可読」へ倒す
          (JS 有効時にはこの style は一切適用されない) */}
      <noscript>
        <style>{`
          .gm-scroll-root{height:auto !important}
          .gm-scroll-root > div{position:static !important;height:auto !important;min-height:0 !important;overflow:visible !important}
          [data-velocity]{position:static !important;inset:auto !important}
          [data-scene]{position:relative !important;inset:auto !important;opacity:1 !important;visibility:visible !important;min-height:0 !important;padding-top:48px !important;padding-bottom:48px !important}
          [data-foodhero],[data-film],[data-dishes],[data-hero-ambient],[data-filmwords],[data-bar-top],[data-bar-bot],[data-cue],[data-darken]{display:none !important}
          .mask > span{transform:none !important}
        `}</style>
      </noscript>
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
          {IS_RECRUITING && (
            <Link href="/recruit" className="gm-nav-link" style={NAV_LINK_STYLE}>
              採用
            </Link>
          )}
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
            ...(IS_RECRUITING ? [{ href: "/recruit", label: "採用" }] : []),
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
          デスクトップ 1440vh / モバイル 1095vh(タイムライン長 T と比例) */}
      <div ref={scrollRootRef} className="gm-scroll-root">
        <div
          ref={stageRef}
          style={{
            position: "sticky",
            top: 0,
            // dvh(動的ビューポート高さ)= 常に現在の表示領域と一致。従来の svh は
            // アドレスバーが隠れた時に viewport より短くなり、ステージ下に隙間が
            // 生まれて「フッターの先までスクロールできる」バグの原因だった。
            // dvh なら隙間ゼロで終端が固定される。PC では dvh=vh で無変更
            height: "100dvh",
            minHeight: "100dvh",
            overflow: "hidden",
            background:
              "radial-gradient(125% 90% at 50% 32%,#1c1b19 0%,#1c1b19 66%)",
          }}
        >
          {/* 視差グロー2層は削除済み(Block A 削除テスト 2026-07-10 —
              不透明な壁レイヤーに常時遮蔽され視覚出力ゼロだった) */}

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

            {/* hero ambient film — ファーストビューに湯気と炎の気配を敷く。
                低不透明度のループ再生(scrub とは独立)。src は motion 分岐での
                み付与(reduced-motion では一切ダウンロードさせない)。ファイルは
                スクラブ用と同一 URL のためキャッシュ 1 回で済む */}
            <div
              data-hero-ambient
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "-10%",
                zIndex: 1,
                opacity: 0,
                pointerEvents: "none",
                willChange: "opacity",
              }}
            >
              <video
                data-hero-ambient-video
                muted
                loop
                playsInline
                preload="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "saturate(1.05) brightness(0.9)",
                }}
              />
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
                {/* キャッチコピー: 行マスクで hero の文字群と同じ言語で登場・退場 */}
                <span className="mask" style={{ marginTop: "clamp(26px,4.5vh,42px)" }}>
                  <span
                    data-rise
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(14px,1.8vw,19px)",
                      fontWeight: 300,
                      letterSpacing: ".18em",
                      lineHeight: 1.9,
                      color: "rgba(242,240,235,.86)",
                    }}
                  >
                    問い続ける台所の、今夜の答えを。
                  </span>
                </span>
                {/* hero CTA: 電話予約(朱)を主役に、お品書きへの食欲導線を添える */}
                <div
                  style={{
                    marginTop: "clamp(24px,4vh,38px)",
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
                      display: "inline-block",
                      textDecoration: "none",
                      background: "#b23a2e",
                      color: "#f2f0eb",
                      fontFamily: SERIF,
                      fontSize: 14,
                      letterSpacing: ".16em",
                      padding: "13px 36px",
                    }}
                  >
                    電話で予約する
                  </a>
                  <Link
                    href="/menu/dinner"
                    className="gm-back-btn"
                    style={{
                      display: "inline-block",
                      textDecoration: "none",
                      background: "none",
                      border: "1px solid rgba(242,240,235,.28)",
                      color: "#f2f0eb",
                      fontFamily: SERIF,
                      fontSize: 14,
                      letterSpacing: ".16em",
                      padding: "12px 30px",
                    }}
                  >
                    お品書きを見る
                  </Link>
                </div>
              </div>
            </div>

            {/* S2 — 問いの帳(記憶層2): 店名の意味への入口。主文の一行だけを
                立て、hold-quiet で読む時間を確保してから残像となって S3 の
                応答を受ける。派手にしない(S4の最大ピークを弱めない) */}
            <div
              data-scene="question"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 24px",
                opacity: 0,
                pointerEvents: "none",
                willChange: "opacity",
              }}
            >
              <h2 style={{ margin: 0 }}>
                <span className="mask" style={{ display: "block" }}>
                  <span
                    data-question-line
                    style={{
                      display: "inline-block",
                      fontFamily: SERIF,
                      fontWeight: 400,
                      fontSize: "clamp(21px,3.2vw,40px)",
                      letterSpacing: ".22em",
                      textIndent: ".22em",
                      lineHeight: 1.9,
                      whiteSpace: "nowrap",
                      color: "#f2f0eb",
                      textShadow: "0 2px 20px rgba(0,0,0,.5)",
                    }}
                  >
                    おいしいとは、なにか。
                  </span>
                </span>
              </h2>
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

            {/* S4 章句 — 三つの問い(素材・火・時間)。フィルム(=答えの連なり)の
                上に問いだけを積む。装飾的な章題(本文は /about が担う)なので
                aria-hidden。reduced-motion では表示しない(上の分岐で hide) */}
            <div
              data-filmwords
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "clamp(10px,1.6svh,16px)",
                paddingBottom: "clamp(96px,18svh,170px)",
                textAlign: "center",
                pointerEvents: "none",
                opacity: 0,
                willChange: "opacity",
                // 明るい映像上での可読性を守る下部スクリム(コンテナごと点灯)
                background:
                  "linear-gradient(180deg, rgba(22,20,18,0) 44%, rgba(22,20,18,.42) 70%, rgba(22,20,18,.6) 100%)",
              }}
            >
              {["素材に問う", "火に問う", "時間に問う"].map((t) => (
                <p key={t} className="mask" style={{ margin: 0 }}>
                  <span
                    data-film-line
                    style={{
                      display: "inline-block",
                      fontFamily: SERIF,
                      fontSize: "clamp(16px,2.1vw,24px)",
                      fontWeight: 400,
                      letterSpacing: ".3em",
                      textIndent: ".3em",
                      color: "#f2f0eb",
                      textShadow: "0 2px 22px rgba(0,0,0,.65)",
                    }}
                  >
                    {t}
                  </span>
                </p>
              ))}
            </div>

            {/* S5 — 受け止めの半拍: フィルムの圧倒の直後、一行だけの静けさ。
                コピー比較と採用判断は docs/cinematic/implementation-plan.md 3章 */}
            <div
              data-scene="rest"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 24px",
                opacity: 0,
                willChange: "opacity",
                // 一行の背後だけを翳らせる局所スクリム(sceneのopacityに連動)。
                // 明るいカットに重なっても QS コントラストを割らない濃度
                background:
                  "radial-gradient(82% 60% at 50% 50%, rgba(22,20,18,.78), rgba(22,20,18,.25) 58%, rgba(22,20,18,0) 76%)",
              }}
            >
              <p
                data-rest-line
                style={{
                  margin: 0,
                  fontFamily: SERIF,
                  fontSize: "clamp(15px,1.9vw,21px)",
                  fontWeight: 300,
                  letterSpacing: ".22em",
                  textIndent: ".22em",
                  lineHeight: 2,
                  color: "rgba(242,240,235,.85)",
                  textShadow: "0 2px 20px rgba(0,0,0,.55)",
                }}
              >
                答えは、まだ湯気の中に。
              </p>
            </div>

            {/* S6 — editorial menu (the film's still frame sits behind) */}
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
                      // モバイルの縦圧縮: 固定28pxだと小さい端末でシーンが
                      // 100dvhに収まらないため vh 連動(PCではほぼ従来値)
                      margin: "0 0 clamp(14px,3vh,28px)",
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
                      margin: "0 0 clamp(16px,3.2vh,30px)",
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
                role="img"
                aria-label="愚問"
                style={{
                  fontFamily: SERIF,
                  // 下限70→58: 小型スマホで結末シーンを 100dvh に収めるための
                  // 縦圧縮(14vw が 70 を超える端末=414px 以上と PC は不変)
                  fontSize: "clamp(58px,14vw,168px)",
                  fontWeight: 500,
                  letterSpacing: ".1em",
                  textIndent: ".1em",
                  lineHeight: 1,
                  willChange: "transform,opacity,filter",
                }}
              >
                {/* 収束モチーフ用の文字分割(transformのみで動かす。字間は親の .1em で静的確定) */}
                {["愚", "問"].map((ch) => (
                  <span
                    key={ch}
                    data-reserve-char
                    aria-hidden="true"
                    style={{ display: "inline-block", willChange: "transform" }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
              {/* 物語の結末 — S2「おいしいとは、なにか。」→ S5「答えは、まだ湯気の中に。」の回収 */}
              <p
                data-fade
                style={{
                  margin: "clamp(24px,4vh,34px) 0 0",
                  fontFamily: SERIF,
                  fontSize: "clamp(15px,1.8vw,20px)",
                  fontWeight: 300,
                  letterSpacing: ".2em",
                  textIndent: ".2em",
                  color: "rgba(242,240,235,.88)",
                }}
              >
                答えは、席で。
              </p>
              <p
                data-fade
                style={{
                  margin: "12px 0 0",
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
                  justifyContent: "center",
                  // モバイル幅では「アクセスを/見る」のような語中折返しが起きて
                  // いたため、リンク単位で行を折り返す(ラベル自体は CSS 側で
                  // nowrap)。PC は 1 行のまま
                  flexWrap: "wrap",
                  columnGap: 28,
                  rowGap: 12,
                }}
              >
                <Link href="/access" className="gm-detail-link">
                  アクセスを見る
                  <span className="gm-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <Link href="/contact" className="gm-detail-link">
                  お問い合わせ
                  <span className="gm-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <InstagramLink />
              </div>
              <p
                style={{
                  // モバイル縦圧縮: 小さい端末で結末シーンを 100dvh に収める
                  margin: "clamp(24px,5vh,72px) 0 0",
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
