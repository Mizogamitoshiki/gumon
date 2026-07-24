"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

// ページ間トランジション(2026-07-24)。全ルート間の遷移を「暗転→静かな浮上」で
// 接続する(背景が全ページ #1c1b19 なので、旧ページの瞬時消失+新ページの
// フェードインが黒を経由したクロスフェードに見える)。
//
// 実装メモ:
// - ルート template の再マウントは最上位セグメント変更時のみ(/menu/dinner→
//   /menu/drink では再マウントされない)ため、remount 依存ではなく
//   usePathname の変化で CSS アニメーションを再始動する
// - 初回ロードでは絶対に演出しない: 全画面 opacity:0 からの入場は LCP を
//   遅延させる(MOT-7 / perf-measurement-001 の再発防止)
// - useLayoutEffect(描画前)で class を付け、新ページが素で 1 フレーム
//   見えてから暗転するチラつきを防ぐ。SSR では useEffect に差し替えて
//   React の SSR 警告を回避
// - 演出は opacity のみ: transform だと fixed 祖先の containing block になり
//   固定ヘッダー等が遷移中にずれる。reduced-motion は CSS 側で無効化
const useClientLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// 「このブラウザセッションで一度でも描画したか」。ルート template は
// 最上位セグメントが変わる遷移(/menu/*→/access 等)で再マウントされ ref が
// 消えるため、初回ロード判定は再マウントを跨いで生きるモジュール変数で持つ
// (フルリロード時はモジュールごと初期化される=正しく「初回」に戻る)
let hasLoadedOnce = false;

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  // StrictMode の二重実行ガード: 同一パスでの再実行では演出を重ねない
  const prevPathRef = useRef<string | null>(null);

  useClientLayoutEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;
    if (prev === pathname) return; // StrictMode 二重実行
    const isFirstLoad = prev === null && !hasLoadedOnce;
    hasLoadedOnce = true;
    if (isFirstLoad) return; // 初回ロード = 演出なし(LCP保護)
    const el = ref.current;
    if (!el) return;
    el.classList.remove("gm-page-enter");
    // reflow を挟んで同名アニメーションを再始動させる(CSS animation の再生は
    // class の付け直しだけでは再トリガーされない)
    void el.offsetWidth;
    el.classList.add("gm-page-enter");
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
