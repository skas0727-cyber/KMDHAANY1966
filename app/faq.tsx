// visible Q&A (native <details>) + FAQPage structured data, so search/answer engines can quote it
export default function Faq({ items }: { items: string[][] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <section className="sub-cat faq">
      <div className="sub-cat-head" data-aos>
        <div>
          <p className="en gm">FAQ</p>
          <h2>자주 묻는 질문</h2>
        </div>
      </div>
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
