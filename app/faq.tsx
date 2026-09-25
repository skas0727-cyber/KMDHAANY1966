import type { ReactNode } from "react";
import { TEL, TEL_LINK } from "./site";

// visible Q&A (native <details>) + FAQPage structured data, so search/answer engines can quote it
export default function Faq({ items }: { items: string[][] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <section id="faq" className="sub-cat faq">
      <Head title="자주 묻는 질문" />
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

// shared "<h2> + optional lead paragraph" head used at the top of every sub-page section
export function Head({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="sub-cat-head" data-aos>
      <h2>{title}</h2>
      {lead && <p>{lead}</p>}
      {children}
    </div>
  );
}

export function Cta({ title, text }: { title: string; text: string }) {
  return (
    <section className="sub-cta">
      <h2>{title}</h2>
      <p>{text}</p>
      <a href={TEL_LINK}>{TEL} 전화 상담</a>
    </section>
  );
}

export function Notice({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="sub-notice">
      <h3>{title}</h3>
      <ul>{items.map((it) => <li key={it}>{it}</li>)}</ul>
    </section>
  );
}

// photo hero shared by accident, diet and skin (each swaps in its own image/position/copy)
export function SubHero({ img, wide, pos, tabs, children }: { img: string; wide?: string; pos?: string; tabs: [string, string][]; children: ReactNode }) {
  return (
    <section className="sub-hero">
      <picture>
        {wide && <source media="(min-width: 768px)" srcSet={wide} />}
        <img className="sub-hero-img" src={img} alt="" style={pos ? { objectPosition: pos } : undefined} />
      </picture>
      <div className="sub-hero-inner">
        <div data-aos>
          {children}
          <ul className="ht-tabs">{tabs.map(([id, t]) => <li key={id}><a href={"#" + id}>{t}</a></li>)}</ul>
        </div>
      </div>
    </section>
  );
}
