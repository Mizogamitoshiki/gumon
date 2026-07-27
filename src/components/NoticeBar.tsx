"use client";

import { useEffect, useRef, useState } from "react";
import { activeNotices, type Notice } from "@/lib/notice";

/**
 * 全ページ最上部のお知らせ帯(臨時休業など)。
 *
 * 掲載期間の判定は **マウント後にブラウザの時刻で** 行う。
 * このサイトはビルド時にCMSを焼き込むため、ビルド時に判定すると期限切れの
 * 告知が次のビルドまで残ってしまう。「臨時休業」が終わっても出 している方が
 * 一瞬表示されないことより実害が大きいので、初回描画では出さない。
 */
export default function NoticeBar() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotices(activeNotices(new Date()));
  }, []);

  // 帯は画面最上部に固定し、その高さぶんヘッダーを下げる(--gm-notice-h)。
  // ページ全体を押し下げないので、100dvhのヒーローやScrollTriggerの位置に影響しない。
  // 文言の折り返しで高さが変わるためResizeObserverで追従する
  useEffect(() => {
    const el = wrapRef.current;
    const root = document.documentElement;
    if (!el) {
      root.style.setProperty("--gm-notice-h", "0px");
      return;
    }
    const apply = () =>
      root.style.setProperty("--gm-notice-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--gm-notice-h", "0px");
    };
  }, [notices]);

  if (notices.length === 0) return null;

  return (
    <div className="gm-notice-wrap" ref={wrapRef} role="region" aria-label="お知らせ">
      {notices.map((n) => (
        <NoticeItem key={n.id} notice={n} />
      ))}
    </div>
  );
}

function NoticeItem({ notice }: { notice: Notice }) {
  const [open, setOpen] = useState(false);
  const hasBody = !!notice.body;

  const content = (
    <>
      <span className="gm-notice-mark" aria-hidden="true">
        {notice.level === "alert" ? "!" : "i"}
      </span>
      <span className="gm-notice-title">{notice.title}</span>
      {hasBody && (
        <span className="gm-notice-more" aria-hidden="true">
          {open ? "閉じる" : "詳しく"}
        </span>
      )}
    </>
  );

  return (
    <div className={`gm-notice gm-notice-${notice.level}`}>
      {hasBody ? (
        <button
          type="button"
          className="gm-notice-head"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {content}
        </button>
      ) : (
        <div className="gm-notice-head gm-notice-head-static">{content}</div>
      )}
      {hasBody && open && <p className="gm-notice-body">{notice.body}</p>}
    </div>
  );
}
