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

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
