"use client";

import { useMemo, useState } from "react";

// よくあるご質問(details/summary ベース、CSS の 0fr→1fr で静かに開閉)。
// searchable を立てると質問・回答の全文検索ボックスが付く。
// 各項目は [data-info-row] でスクロールリビールに乗る
export type FaqItem = { q: string; a: string };

export default function FaqList({
  items,
  searchable = false,
}: {
  items: FaqItem[];
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (f) =>
        f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t),
    );
  }, [items, query]);

  return (
    <div className="gm-faq">
      {searchable && (
        <label className="gm-board-search gm-faq-search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="質問を探す(例: 予算)"
            aria-label="よくあるご質問を検索"
          />
        </label>
      )}
      {visible.length === 0 && (
        <p className="gm-board-empty">
          「{query}」に当てはまる質問は見つかりませんでした。
          お電話でお気軽にお尋ねください。
        </p>
      )}
      {visible.map((f) => (
        <details key={f.q} className="gm-faq-item" data-info-row>
          <summary className="gm-faq-q">
            <span className="gm-faq-q-text">{f.q}</span>
            <span className="gm-faq-mark" aria-hidden="true" />
          </summary>
          <div className="gm-faq-a-wrap">
            <p className="gm-faq-a">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
