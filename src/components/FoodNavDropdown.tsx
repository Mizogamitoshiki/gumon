"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { FOOD_CATEGORIES } from "@/lib/menu";

/**
 * ヘッダーの「料理」ドロップダウン(TOP / 詳細ページ共通)。
 * ネイティブ <details> は 外側クリック・Escape・リンク選択後 に閉じないため
 * (App Router では layout が遷移後も残り、開きっぱなしが露呈する)、
 * ここで閉じる制御をまとめて持つ。
 */
export default function FoodNavDropdown({
  summaryClassName,
  summaryStyle,
}: {
  summaryClassName: string;
  summaryStyle?: CSSProperties;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = () => el.removeAttribute("open");

    // パネル外のどこかを押したら閉じる(summary 自身は native toggle に任せる)
    const onPointerDown = (e: PointerEvent) => {
      if (el.open && e.target instanceof Node && !el.contains(e.target)) {
        close();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // パネル内リンクを選んだら閉じる(遷移をキャンセルはしない)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (a && el.contains(a)) close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    el.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <details ref={ref} className="gm-nav-drop">
      <summary className={summaryClassName} style={summaryStyle}>
        料理
        <span className="gm-nav-caret" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="gm-nav-panel">
        {FOOD_CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/menu/${c.slug}`}>
            {c.titleJp}
            <span className="gm-nav-panel-en">{c.titleEn}</span>
          </Link>
        ))}
      </div>
    </details>
  );
}
