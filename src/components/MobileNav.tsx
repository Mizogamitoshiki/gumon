"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOD_CATEGORIES } from "@/lib/menu";
import { IS_RECRUITING } from "@/lib/recruit";
import { HOTPEPPER_URL, TEL_DISPLAY, TEL_LINK } from "@/lib/site";
import InstagramLink from "@/components/InstagramLink";
import { useMobileNavA11y } from "@/lib/use-mobile-nav";

/**
 * モバイルの全画面メニュー（TOP・詳細ページ共通の唯一の出典）。
 *
 * 設計: 「紙がめくれ、墨が落ちる」。
 *   愚問の世界は紙のお品書きと墨の幕でできている。開くときは、まず紙色の帳が
 *   上から流れ、その裏を追って墨(マットブラック)の幕が落ちる。二枚の縁の間に
 *   一瞬だけ紙の帯が走る——お品書きを一枚めくる所作の翻訳。
 *
 * 段取り(開く):
 *   三本線が右へ抜ける → 紙の帳(veil)が降りる → 墨の幕(panel)が追う
 *   → 縦書きの「愚問」透かしが浮かぶ → ロゴ(中国料理 GUMON / 愚問 / 問いを
 *   重ね、一皿に答える。)が行マスクでせり上がる → 品書きが番号・和名・英名の
 *   行で1行ずつ現れ、罫線が左から引かれる → 予約の一角(朱の電話CTA・営業時間・
 *   Instagram)が灯る。閉じるときは下から順に落ち、墨が上がり、紙が追う。
 *
 * 参照: jf-reform-hp(二段の clip-path とロゴの見せ場)・okafuku-HP(ブランドの
 * 頭書きと導線カード)。ともに骨組みだけ借り、所作は愚問の調子(ease
 * cubic-bezier(.16,1,.3,1)・移動量 8〜40px・朱は電話予約のみ)へ翻訳した。
 *
 * オーバーレイは createPortal で body 直下へ。ヘッダーの backdrop-filter が
 * position:fixed の包含ブロックを作り、幕がヘッダーの高さに閉じ込められるため。
 */
type NavLink = { href: string; label: string; en: string };

const LINKS: NavLink[] = [
  { href: "/about", label: "愚問とは", en: "ABOUT" },
  ...FOOD_CATEGORIES.map((c) => ({
    href: `/menu/${c.slug}`,
    label: c.titleJp,
    en: c.titleEn,
  })),
  { href: "/menu/drink", label: "飲み物", en: "DRINK" },
  { href: "/access", label: "アクセス", en: "ACCESS" },
  { href: "/calendar", label: "営業カレンダー", en: "CALENDAR" },
  { href: "/contact", label: "お問い合わせ", en: "CONTACT" },
  ...(IS_RECRUITING ? [{ href: "/recruit", label: "採用", en: "RECRUIT" }] : []),
];

export default function MobileNav({
  onOpenChange,
}: {
  /** TOP が「開いている間はヘッダーを引っ込めない」判定に使う */
  onOpenChange?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 呼び出し側がインライン関数を渡しても effect が毎描画で走らないよう ref に逃がす
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => setMounted(true), []);
  useEffect(() => onOpenChangeRef.current?.(open), [open]);
  useMobileNavA11y(open, () => setOpen(false), panelRef, burgerRef);

  const close = () => setOpen(false);
  // 時間差の総段数(ロゴ3段 + 品書き + 予約の一角2段)。閉じる際の逆順計算に使う
  const total = LINKS.length + 5;

  const overlay = (
    <>
      {/* 紙の帳 — 墨の幕に一拍先行し、縁の間に紙色の帯が走る */}
      <div className="gm-mnav-veil" data-open={open} aria-hidden="true" />

      <div
        ref={panelRef}
        id="gm-mobile-menu"
        className="gm-mnav"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        tabIndex={-1}
        style={{ "--n": total } as CSSProperties}
      >
        {/* 縦書きの透かし。問いの気配だけを漂わせる(読ませない) */}
        <span className="gm-mnav-ghost" aria-hidden="true">
          愚問
        </span>

        <div className="gm-mnav-inner">
          {/* ブランドの頭書き */}
          <header className="gm-mnav-brand">
            <p className="gm-mnav-eyebrow" style={{ "--i": 0 } as CSSProperties}>
              中国料理 ── GUMON
            </p>
            <p className="gm-mnav-logo" style={{ "--i": 1 } as CSSProperties}>
              <span className="gm-mnav-mask">
                <span className="gm-mnav-rise">愚問</span>
              </span>
            </p>
            <p className="gm-mnav-tagline" style={{ "--i": 2 } as CSSProperties}>
              <span className="gm-mnav-mask">
                <span className="gm-mnav-rise">問いを重ね、一皿に答える。</span>
              </span>
            </p>
          </header>

          <nav className="gm-mnav-list" aria-label="サイト内メニュー">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="gm-mnav-item"
                aria-current={pathname === l.href ? "page" : undefined}
                onClick={close}
                style={{ "--i": i + 3 } as CSSProperties}
              >
                <span className="gm-mnav-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="gm-mnav-mask">
                  <span className="gm-mnav-rise gm-mnav-label">{l.label}</span>
                </span>
                <span className="gm-mnav-en" aria-hidden="true">
                  {l.en}
                </span>
                <span className="gm-mnav-rule" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          {/* 予約の一角 — 朱はここ(電話)だけ */}
          <footer className="gm-mnav-foot">
            <div
              className="gm-mnav-reserve"
              style={{ "--i": LINKS.length + 3 } as CSSProperties}
            >
              <a href={TEL_LINK} data-tel-from="mobile-menu" className="gm-tel-btn gm-mnav-telbtn" onClick={close}>
                電話で予約する
              </a>
              <a href={TEL_LINK} data-tel-from="mobile-menu" className="gm-mnav-tel" onClick={close}>
                {TEL_DISPLAY}
              </a>
            </div>
            <div
              className="gm-mnav-info"
              style={{ "--i": LINKS.length + 4 } as CSSProperties}
            >
              <p className="gm-mnav-hours">
                昼 11:30–15:00 ／ 夜 18:00–23:30 ・定休日なし
              </p>
              <div className="gm-mnav-links2">
                <a
                  href={HOTPEPPER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gm-mnav-web"
                >
                  Webで予約する
                  <span className="gm-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <InstagramLink />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
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
        {/* 三本線(中段だけ短い)。開くと右へ抜け、×が交差して現れる */}
        <span className="gm-burger-bars" aria-hidden="true">
          <span style={{ "--i": 0 } as CSSProperties} />
          <span style={{ "--i": 1 } as CSSProperties} />
          <span style={{ "--i": 2 } as CSSProperties} />
        </span>
        <span className="gm-burger-x" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
