"use client";

import { useEffect, useRef } from "react";

/**
 * モバイル全画面メニューの a11y 配線(開閉ロジックは呼び出し側の state に任せる)。
 * 開いている間: body スクロールをロック・Escape で閉じる・Tab をパネル内に閉じ込める
 * (フォーカストラップ)・閉じたらトリガー(ハンバーガー)へフォーカスを戻す。
 */
export function useMobileNavA11y(
  open: boolean,
  onClose: () => void,
  panelRef: React.RefObject<HTMLElement>,
  triggerRef: React.RefObject<HTMLElement>,
) {
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) triggerRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;

    const panel = panelRef.current;
    if (!panel) return;

    // 背面のスクロールを止める。body の overflow:hidden だけでは iOS Safari が
    // 背面を慣性スクロール/ラバーバンドさせ、メニューが上下にブレて見える。
    // スクロール位置を保ったまま body を position:fixed で固定し、閉じたら
    // 同じ位置へ即時復元する(scroll-behavior:smooth は一時的に殺す)。
    const { body } = document;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      );
    // 開いた瞬間、最初のリンクへフォーカスを送る(スクリーンリーダー利用者がヘッダーの
    // 裏に取り残されないように)
    focusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prevBehavior;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
