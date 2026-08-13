"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileNavA11y } from "@/lib/use-mobile-nav";

/**
 * モバイルの全画面メニュー（TOP・詳細ページ共通）。
 *
 * 以前は GumonScroll と DetailMobileNav に同じものが二重に書かれていて、
 * 演出を直すたびに二箇所へ同じ手を入れる必要があった。ここを唯一の出典にする。
 *
 * 所作（jf-reform-hp の SP メニューの段取りを、愚問の調子へ翻訳したもの）:
 *   1. トリガーの三本線が右へ抜ける（1 本ずつ 55ms の時間差）
 *   2. 入れ替わりに「幕」が上から降りる（clip-path・0.95s）
 *   3. 品書きが行マスクから 1 行ずつせり上がる（70ms の時間差）
 *      ＋ 各行の罫線が左から引かれる
 *   4. 閉じるときは逆再生（下の行から先に落ちて、幕が上がる）
 *
 * 元ネタと変えたところ:
 *   - 斜めの帯 → 上から降りる「幕」。愚問は暖簾と紙の店なので、斜めに裂ける
 *     動きより、真上から落ちる幕のほうが世界観に合う
 *   - skew/scale の飛び込み → 行マスクのせり上げ（CLAUDE.md の見出しの作法）
 *   - 移動量は 8〜40px に収め、イージングはサイト共通の cubic-bezier(.16,1,.3,1)
 *
 * オーバーレイは createPortal で body 直下に出す。ヘッダーには backdrop-filter が
 * 掛かることがあり、filter を持つ祖先は position:fixed の包含ブロックになるため、
 * ヘッダー内に置くと全画面のはずの幕がヘッダーの高さに閉じ込められる。
 */
export type MobileNavLink = { href: string; label: string };

export type MobileNavCta = {
  label: string;
  /** 詳細ページ: tel: へのリンク */
  href?: string;
  /** TOP: 予約ビートへのスクロール（クリック後にメニューを閉じる） */
  onClick?: () => void;
};

export default function MobileNav({
  links,
  cta,
  onOpenChange,
}: {
  links: MobileNavLink[];
  cta: MobileNavCta;
  /** TOP が「開いている間はヘッダーを引っ込めない」判定に使う */
  onOpenChange?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 閉じ切ってから走らせたい処理(TOP の予約スクロール)を預かる
  const pendingRef = useRef<(() => void) | null>(null);

  // 呼び出し側がインライン関数を渡しても effect が毎描画で走らないよう ref に逃がす
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => setMounted(true), []);
  useEffect(() => onOpenChangeRef.current?.(open), [open]);
  useMobileNavA11y(open, () => setOpen(false), panelRef, burgerRef);

  // 開いているあいだ body は position:fixed で固定されており、閉じるときに
  // 元のスクロール位置へ window.scrollTo で戻す。CTA のスクロールを先に呼ぶと
  // この復元に打ち消されるため、ロックが解けた後(= この effect)で走らせる。
  // useMobileNavA11y より後に登録することで、後片付けの完了後に呼ばれる。
  useEffect(() => {
    if (open) return;
    const run = pendingRef.current;
    if (!run) return;
    pendingRef.current = null;
    run();
  }, [open]);

  const close = () => setOpen(false);
  // 品書き＋予約ボタンの総数。閉じるときの「下から順に落ちる」計算に使う
  const total = links.length + 1;

  const overlay = (
    <div
      ref={panelRef}
      id="gm-mobile-menu"
      className="gm-mnav"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="メニュー"
      style={{ "--n": total } as CSSProperties}
    >
      {/* 幕の裾。幕が降り切るまで、下端を 1 本の線が追いかける */}
      <span className="gm-mnav-hem" aria-hidden="true" />

      <div className="gm-mnav-inner">
        <p className="gm-mnav-eyebrow" style={{ "--i": 0 } as CSSProperties}>
          MENU
        </p>

        <nav className="gm-mnav-list" aria-label="サイト内メニュー">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="gm-mnav-item"
              aria-current={pathname === l.href ? "page" : undefined}
              onClick={close}
              style={{ "--i": i } as CSSProperties}
            >
              <span className="gm-mnav-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="gm-mnav-mask">
                <span className="gm-mnav-label">{l.label}</span>
              </span>
              <span className="gm-mnav-rule" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        {cta.href ? (
          <a
            href={cta.href}
            className="gm-reserve-outline gm-mnav-cta"
            onClick={close}
            style={{ "--i": links.length } as CSSProperties}
          >
            {cta.label}
          </a>
        ) : (
          <button
            type="button"
            className="gm-reserve-outline gm-mnav-cta"
            onClick={() => {
              pendingRef.current = cta.onClick ?? null;
              close();
            }}
            style={{ "--i": links.length } as CSSProperties}
          >
            {cta.label}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={open}
        aria-controls="gm-mobile-menu"
        className="gm-burger"
        data-open={open}
      >
        {/* 三本線（開くと右へ抜ける） */}
        <span className="gm-burger-bars" aria-hidden="true">
          <span style={{ "--i": 0 } as CSSProperties} />
          <span style={{ "--i": 1 } as CSSProperties} />
          <span style={{ "--i": 2 } as CSSProperties} />
        </span>
        {/* 抜けたあとに交差して現れる × */}
        <span className="gm-burger-x" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
