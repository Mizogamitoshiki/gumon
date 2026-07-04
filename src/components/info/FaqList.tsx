// よくあるご質問(details/summary ベース、CSS の 0fr→1fr で静かに開閉)。
// Server Component 可。各項目は [data-info-row] でスクロールリビールに乗る
export type FaqItem = { q: string; a: string };

export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="gm-faq">
      {items.map((f) => (
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
