import { notFound } from "next/navigation";
import Faq from "../../faq";
import { CATEGORIES, PROGRAMS, getProgram } from "../../programs";
import { pageMeta, SITE_URL, NAME, TEL, TEL_LINK } from "../../site";
import "./view.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = getProgram(slug);
  if (!p) return {};
  const first = p.intro.split(". ")[0].replace(/\.$/, "") + ".";
  return pageMeta(`/program/${p.slug}`, `논산 ${p.name} 가격`, `${p.summary}. ${first} 광명당한의원 가격 안내(VAT 별도).`);
}

const CAT = Object.fromEntries(CATEGORIES);

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const p = getProgram(slug);
  if (!p) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.name,
    description: p.summary,
    url: `${SITE_URL}/program/${p.slug}`,
    provider: { "@id": `${SITE_URL}/#clinic`, "@type": "MedicalClinic", name: NAME, url: SITE_URL },
    areaServed: "논산시",
    offers: p.options.map((o) => ({ "@type": "Offer", name: o.name, price: Number(o.price.replace(/[^0-9]/g, "")), priceCurrency: "KRW", description: (o.first ? "첫 방문 1회, " : "") + "VAT 별도" })),
  };

  return (
    <main className="skin-clinic">
      <div className="pv-wrap">
        <div className="pv-head">
          <nav className="pv-crumb" aria-label="현재 위치">
            <a href="/program">피부 프로그램</a>
            <span>{CAT[p.cat]}</span>
          </nav>
          <h1><span className="sub-label gm">논산 피부 한의원</span> {p.name}</h1>
          <p className="pv-summary">{p.summary}</p>
          <ul className="sub-tags">{p.concerns.map((c) => <li key={c}>#{c}</li>)}</ul>
          <p className="pv-intro">{p.intro}</p>
        </div>

        <aside className="pv-price" aria-label={`${p.name} 가격`}>
          <h2>{p.name} 가격</h2>
          <ul className="pv-opts">
            {p.options.map((o) => (
              <li key={o.name}>
                <div>
                  <b>{o.name}</b>
                  {o.first && <span className="pv-badge">첫 방문</span>}
                  <span className="pv-spec">{o.spec}</span>
                </div>
                <p className="pv-cost">
                  {o.orig && <del>{o.orig}</del>}
                  <strong className="gm">{o.price}</strong>
                </p>
              </li>
            ))}
          </ul>
          <p className="pv-vat">* VAT 별도</p>
          <a className="pv-call" href={TEL_LINK}>전화 상담 {TEL}</a>
        </aside>

        <div className="pv-body">
          <section className="sub-cat">
            <div className="sub-cat-head" data-aos>
              <div>
                <h2>이런 분들께 추천드립니다</h2>
              </div>
            </div>
            <ol className="pv-rec" data-aos>{p.recommend.map((r) => <li key={r}>{r}</li>)}</ol>
          </section>

          <section className="sub-cat">
            <div className="sub-cat-head" data-aos>
              <div>
                <h2>이런 효과를 기대할&nbsp;수&nbsp;있습니다</h2>
              </div>
            </div>
            <ul className="sub-cards pv-fx" data-aos>
              {p.effects.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
            </ul>
          </section>

          <section className="sub-cat">
            <div className="sub-cat-head" data-aos>
              <div>
                <h2>시술 과정</h2>
              </div>
            </div>
            <ol className="sub-steps" data-aos>
              {p.steps.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
            </ol>
          </section>

          <section className="sub-notice" data-aos>
            <h2>시술 후 주의사항</h2>
            <ul>{p.cautions.map((c) => <li key={c}>{c}</li>)}</ul>
          </section>

          <Faq items={p.faq} />
        </div>
      </div>

      <section className="sub-cat pv-others">
        <div className="sub-cat-head" data-aos>
          <div>
            <h2>다른 프로그램</h2>
          </div>
          <a className="pv-all" href="/program">전체 프로그램 보기</a>
        </div>
        <ul data-aos>
          {PROGRAMS.filter((o) => o.slug !== p.slug).map((o) => (
            <li key={o.slug}>
              <a className="pv-card" href={`/program/${o.slug}`}>
                <h3>{o.name}</h3>
                <p>{o.summary}</p>
                <span className="pv-more">자세히 보기 →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="sub-cta">
        <h2>{p.name}, 상담으로 먼저 확인해 보세요</h2>
        <p>피부 상태를 진단한 뒤 알맞은 시술과 횟수를 안내해 드립니다.</p>
        <a href={TEL_LINK}>{TEL} 전화 상담</a>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}
