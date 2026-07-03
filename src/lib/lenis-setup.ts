"use client";
// src/lib/lenis-setup.ts
// ============================================================
// Lenis(慣性スムーススクロール)の初期化と ScrollTrigger 連携を
// 一元管理するフック。アプリ全体で 1 回だけ呼ぶこと
// (ルートレイアウト直下のクライアントコンポーネント推奨)。
//
// 連携の3点セット(これが無いとピン位置ズレ・カクつきが起きる):
//   1. lenis.on("scroll", ScrollTrigger.update)
//      → Lenis のスクロール更新を ScrollTrigger に毎回通知する
//   2. gsap.ticker.add((t) => lenis.raf(t * 1000))
//      → requestAnimationFrame ループを GSAP の ticker に一本化する
//        (Lenis 側の autoRaf と二重ループにしない)
//   3. gsap.ticker.lagSmoothing(0)
//      → GSAP のラグ補正が Lenis の補間と干渉して
//        「スクロールと演出の時間軸がずれる」のを防ぐ
//
// 詳細・外し方・モバイル配慮 → references/smooth-scroll-lenis.md
// ============================================================
import { useEffect } from "react";
import Lenis, { type LenisOptions } from "lenis";
import { gsap, ScrollTrigger } from "./gsap-setup";

let activeLenis: Lenis | null = null;

/**
 * 現在アクティブな Lenis インスタンスを返す(未初期化・reduced-motion 時は null)。
 * アンカーナビの lenis.scrollTo() などに使う。null のときは
 * ネイティブの scrollIntoView にフォールバックすること。
 */
export function getLenis(): Lenis | null {
  return activeLenis;
}

/**
 * Lenis を初期化し GSAP/ScrollTrigger と接続するフック。
 * アンマウント時に ticker 解除と destroy まで自動で行う。
 *
 * 注意: options は初回マウント時の値だけが使われる(途中変更は反映されない)。
 * 毎レンダーで新しいオブジェクトを渡しても再初期化はしない設計。
 */
export function useLenis(options?: LenisOptions): void {
  useEffect(() => {
    // OS の「視差効果を減らす」設定のユーザーには慣性スクロール自体を適用しない。
    // ぬるっとした滑りは前庭障害の人に酔いを起こすことがある。
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false, // rAF は GSAP の ticker に一本化する(二重ループ防止)
      anchors: true, // ページ内 a[href="#..."] リンクを Lenis 経由のスクロールにする
      ...options,
    });
    activeLenis = lenis;

    // (1) Lenis のスクロールを ScrollTrigger に伝える
    lenis.on("scroll", ScrollTrigger.update);

    // (2) GSAP の ticker で Lenis を駆動(GSAP は秒、Lenis はミリ秒なので変換)
    const update = (time: number): void => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);

    // (3) GSAP のラグ補正を無効化(Lenis と干渉するため)
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      activeLenis = null;
      gsap.ticker.lagSmoothing(500, 33); // GSAP デフォルト値に戻す
    };
    // options は意図的に依存配列へ入れない(初回の値のみ使用)。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
