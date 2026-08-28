"use client";

import { useEffect, useRef, useState } from "react";
import { HOTPEPPER_URL } from "@/lib/site";

// ホットペッパーグルメ「ホームページ予約ツール」(空席カレンダー)。
// HPG 店舗管理画面が発行する <script> タグそのもの(2026-08-28 取得)を、
// 予約欄が画面に近づいたときに動的に差し込む。スクリプトは
// document.currentScript の直後に 268×529px の iframe を挿入し、
// フォーム POST でカレンダーを読み込むだけの作りなので、後入れでも動く。
// 予約はホットペッパー経由で成立し、レストランボード(予約台帳)に自動で入る。
//
// 方針: 電話が主役、これは 2 番手(手数料は店の負担)。初期表示を重くしないため
// ページロード時には何も読み込まず、失敗時は従来の HPG リンクへ倒す。
// 店舗 ID は HOTPEPPER_URL(/strJ003850704/)と同じものを使い、出典を一つにする。

const GADGET_SRC = "https://www.hotpepper.jp/hpdsReserveGadget/";
const STORE_ID = HOTPEPPER_URL.match(/\/str(J\d+)\//)?.[1] ?? "J003850704";
// 発行タグの属性そのまま(HPG 側で JSON.parse される疑似 JSON。改変しない)
const DATA_STYLE = "{'bgcolor': 'black', 'btncolor': 'red'}";
const DATA_STORES = `[{'${STORE_ID}': null}]`;
export const GADGET_HEIGHT = 529; // stores 1 件・ロゴあり(スクリプト内の分岐値)
export const GADGET_WIDTH = 268;

type State = "idle" | "loading" | "ready" | "error";

export default function HotPepperReserveWidget() {
  const hostRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false); // StrictMode の二重実行・再マウントでも 1 回だけ
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    const inject = () => {
      if (cancelled || injectedRef.current) return;
      if (host.querySelector(`script[src="${GADGET_SRC}"]`)) return;
      injectedRef.current = true;
      setState("loading");

      const s = document.createElement("script");
      s.src = GADGET_SRC;
      s.charset = "UTF-8";
      s.setAttribute("data-style", DATA_STYLE);
      s.setAttribute("data-stores", DATA_STORES);
      s.onerror = () => setState("error");
      s.onload = () => {
        // スクリプトは同期的に iframe + form を挿入して submit まで済ませる
        const frame = host.querySelector("iframe");
        if (!frame) {
          setState("error");
          return;
        }
        frame.title = "ネット予約 空席カレンダー(ホットペッパーグルメ)";
        frame.setAttribute("loading", "eager");
        frame.addEventListener("load", () => setState("ready"), { once: true });
        window.gtag?.("event", "reservation_widget_view", {
          provider: "hotpepper",
          page_path: window.location.pathname,
        });
      };
      host.appendChild(s);
    };

    if (!("IntersectionObserver" in window)) {
      inject();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          inject();
        }
      },
      { rootMargin: "320px 0px" },
    );
    io.observe(host);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div className="gm-hpg" data-info-row data-state={state}>
      <div
        ref={hostRef}
        className="gm-hpg-frame"
        style={{ minHeight: GADGET_HEIGHT, maxWidth: GADGET_WIDTH }}
        aria-busy={state === "loading"}
      >
        {state !== "ready" && (
          <p className="gm-hpg-status" aria-live="polite">
            {state === "error"
              ? "カレンダーを読み込めませんでした。"
              : "空席カレンダーを読み込んでいます…"}
          </p>
        )}
      </div>
      <p className="gm-hpg-legend">
        <span>○ 即予約</span>
        <span>□ リクエスト予約（店から折り返しご連絡）</span>
        <span>TEL お電話でご相談</span>
      </p>
      <p className="gm-hpg-note">
        ネット予約はホットペッパーグルメの予約システムを利用しています。
        {state === "error" && (
          <>
            {" "}
            <a href={HOTPEPPER_URL} target="_blank" rel="noopener noreferrer" className="gm-detail-link">
              ホットペッパーグルメで予約する
              <span className="gm-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </>
        )}
      </p>
    </div>
  );
}
