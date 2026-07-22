"use client";

import { useRef } from "react";
import type { MenuItem } from "@/lib/menu";
import { gsap, useGSAP } from "@/lib/gsap-setup";

// D2「看板との対面」— /menu/dinner 専用の Editorial variant(Phase 17)。
// 縦型・写真主役: 実写がある品だけを大判の額縁で見せる(Plan B)。
// プレースホルダは並べない(期待形成を薄めるため)。
// pin・横スクロール・進捗バー・水平パララックスは使わない(Phase 16基準)。
// 他メニューページは従来の DishGallery(gm-gal)のまま — 本コンポーネントと
// gm-shot クラス群は dinner からのみ参照され、共有CSSには触れない。
// 実写が増えたら menu.ts の img を埋めるだけで額縁が縦に増える。
export default function DishShowcase({
  items,
  titleEn,
}: {
  items: MenuItem[];
  titleEn: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const withPhoto = items.filter((i) => i.img);

  useGSAP(
    () => {
      // Scene-Turn Storytelling(dinner 専用):
      // - モバイルは静的な縦構成(Scene の順番と余白だけで語る) — JS演出なし
      // - reduced-motion も何も構築しない(SSR のまま全文可読)
      // 演出はデスクトップ(861px+ かつ no-preference)のみ
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current;
          if (!section) return;

          // ---- scrTelling 機構の移植(kurukuru-web 調査・2026-07-11) ----
          // 参照サイトの技術: ①超長尺の親 + position:sticky の 100vh 子で
          // 場面を画面に固定し、②親内の進捗%の線形補間で CSS 値を駆動、
          // ③前の場面の「拡大しながらフェードアウト」と次の場面の入場を
          // 必ず重ねる(境界をセクション間でなく場面の重畳で消す)。
          // 読む情報(品書き・CTA)だけ通常フローに戻す。
          // 本実装では ①=ScrollTrigger pin(+320%)、②=scrub タイムライン、
          // ③=単一ステージ gm-stage(Hero+Showcase を層で内包)内の
          // サブシーン重畳、として同じ機構を GSAP で再現する。
          // モバイル/reduced-motion はこのブロック外(静的縦積みのまま)
          const pageRoot = section.closest<HTMLElement>(".gm-editorial");
          const stage = section.closest<HTMLElement>(".gm-stage");
          const heroSection = pageRoot?.querySelector<HTMLElement>(".gm-chero");
          const heroInner = pageRoot?.querySelector<HTMLElement>(
            ".gm-chero-inner"
          );
          const heroCue = pageRoot?.querySelector<HTMLElement>(".gm-chero-cue");
          const intro = section.querySelector<HTMLElement>(".gm-shot-intro");
          const frame = section.querySelector<HTMLElement>(".gm-shot-frame");
          const media = section.querySelector<HTMLElement>(".gm-shot-media");
          const caption = section.querySelector<HTMLElement>(".gm-shot-caption");
          if (!stage || !heroSection || !heroInner || !intro || !frame || !caption)
            return;
          const capChildren = Array.from(caption.children);
          const heroBits = [heroInner, heroCue].filter(
            (element): element is HTMLElement => element !== null,
          );

          // 初期状態: 題字は伏せ、皿は「熾火」(0.35)で窓の奥に灯っている
          gsap.set(intro, { opacity: 0, scale: 0.97 });
          gsap.set(frame, {
            opacity: 0.35,
            clipPath: "inset(24% 18% 24% 18%)",
            scale: 1.08,
          });
          gsap.set(capChildren, { opacity: 0, y: 16 });

          const tl = gsap.timeline({
            defaults: { ease: "power1.out" },
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "+=320%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          // 場面1→2: 夜の入口。冒頭は静止(読む時間)。動き出したら
          // 「拡大しながらフェードアウト」(scrTelling の場面めくりの署名手法)
          tl.to(
            heroBits,
            { opacity: 0, y: -16, scale: 1.06, duration: 0.2, ease: "power1.in" },
            0.06
          );
          // 幕(hero の不透明背景)が晴れ、下層の熾火が透けてくる。
          // autoAlpha: 消えた幕(z3)が下層の操作・支援技術を遮らないように
          tl.to(
            heroSection,
            { autoAlpha: 0, duration: 0.18, ease: "power1.inOut" },
            0.12
          );
          // 場面2: 「看板の品」— 幕が晴れる最中に入場(退場と入場を重ねる)
          tl.to(intro, { opacity: 1, scale: 1, duration: 0.12 }, 0.2);
          tl.to(
            intro,
            { opacity: 0, scale: 1.08, duration: 0.14, ease: "power1.in" },
            0.42
          );
          // 場面3: 一皿との対面 — 題字が退くほど窓が明るく大きく開く
          tl.to(frame, { opacity: 1, duration: 0.16, ease: "power1.inOut" }, 0.36);
          tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3 }, 0.4);
          tl.to(frame, { scale: 1, duration: 0.32 }, 0.4);
          // 皿の呼吸: 写真だけの縦ドリフト(合計12%以内・等速・全行程)
          tl.fromTo(
            media,
            { yPercent: -6 },
            { yPercent: 6, ease: "none", duration: 1 },
            0
          );
          // キャプションが灯る(品名→価格→説明)
          tl.to(
            capChildren,
            { opacity: 1, y: 0, duration: 0.14, stagger: 0.04 },
            0.72
          );
          // 受け渡し(→品書き): 見せ切ったあと、皿が「一歩引いて」翳り、
          // 選ぶ時間へ誘う。解放直後に品書きの額縁が重なって現れる(MenuBoard)
          tl.to(
            frame,
            { scale: 0.965, opacity: 0.55, duration: 0.1, ease: "power1.inOut" },
            0.9
          );
        }
      );
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // 実写ゼロ運用: 無理に視覚要素を置かず、セクションごと出さない
  if (withPhoto.length === 0) return null;

  return (
    <section ref={sectionRef} className="gm-shot" aria-label="看板の品">
      <header className="gm-shot-intro">
        <p className="gm-shot-en">SELECTION ／ {titleEn}</p>
        <h2 className="gm-shot-title">看板の品</h2>
      </header>

      {withPhoto.map((item) => (
        <article key={item.name} className="gm-shot-panel">
          <div className="gm-shot-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.img}
              alt={item.name}
              className="gm-shot-media"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {/* 紙芝居ステージ(デスクトップ)でキャプションの可読を守る下部スクリム。
                モバイル/RM では CSS で非表示 */}
            <span className="gm-shot-scrim" aria-hidden="true" />
          </div>
          <div className="gm-shot-caption">
            <h3 className="gm-shot-name">
              {item.name}
              {item.signature && <span className="gm-menu-sig">看板</span>}
              {item.recommended && (
                <span className="gm-menu-sig gm-badge-reco">おすすめ</span>
              )}
              {item.spicy && (
                <span className="gm-spicy" aria-label={`辛さレベル${item.spicy}`}>
                  {"辛".repeat(item.spicy)}
                </span>
              )}
            </h3>
            <p className="gm-shot-price">{item.price}</p>
            {item.desc && (
              <p className="gm-shot-desc" style={{ whiteSpace: "pre-line" }}>
                {item.desc}
              </p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
