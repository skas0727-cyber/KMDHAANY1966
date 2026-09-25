import Faq from "../faq";
import { CATEGORIES, PROGRAMS, type Program } from "../programs";
import { pageMeta, TEL, TEL_LINK } from "../site";

// "피부과" is a medical-specialty name a 한의원 must not use; target "피부 한의원" instead
export const metadata = pageMeta(
  "/skin",
  "논산 피부 한의원 슈링크, 토닝, 점 제거 가격",
  "논산 강경 피부 한의원 광명당한의원. 기미, 검버섯, 비립종, 편평사마귀, 오타모반, 한관종 같은 색소와 잡티 고민을 야누스프로 피부 분석 후 관리합니다. 슈링크 리프팅, 연어주사(PDRN), PN주사 스킨부스터, 토닝, 점 제거 가격과 첫 방문 체험가(슈링크 100샷 15,000원)를 안내합니다."
);

const TABS = [["first", "첫 방문 체험가"], ["concern", "색소 질환"], ["diagnosis", "검사와 치료"], ["lifting", "리프팅"], ["booster", "스킨부스터"], ["price", "가격표"]];
// [illustration file in /img/skin (.jpg, Higgsfield GPT Image 2), name, description]
const CONDITIONS = [
  ["geomburseot", "검버섯", "나이가 들수록 늘어나는 흔한 병변으로, 피부 표면의 각질이 두껍게 쌓이며 갈색에서 흑갈색으로 도드라집니다. 만졌을 때 표면이 거칠게 느껴지는 경우가 많습니다."],
  ["biripjong", "비립종", "빠져나가지 못한 각질이 피부 얕은 곳에 갇혀 생긴 하얗고 작은 알갱이입니다. 눈가에 잘 생기며, 각질이 제때 떨어져 나가지 않으면 다른 자리에 다시 올라오기도 합니다."],
  ["gimi", "기미", "자외선과 호르몬 변화, 타고난 체질 등이 겹쳐 멜라닌이 피부 깊은 층까지 내려앉은 상태입니다. 한의학에서는 몸속 열과 혈액순환, 간 기능의 균형도 함께 살펴 관리 방향을 정합니다."],
  ["ota", "오타모반", "진피 깊은 곳에 멜라닌 세포가 모여 생기는 모반입니다. 주로 눈가와 광대 주변에 푸른빛이나 잿빛 갈색으로 넓게 비쳐 보입니다."],
  ["wart", "편평사마귀", "사람유두종바이러스(HPV)에 감염되어 생기는 납작하고 작은 사마귀입니다. 면역력이 떨어지거나 피부 장벽이 약해졌을 때 주변으로 옮겨 가며 개수가 늘어날\u00A0수\u00A0있습니다."],
  ["hangwanjong", "한관종", "땀샘을 이루는 조직이 지나치게 자라 생기는 양성 종양으로, 눈 밑에 살색의 작은 알갱이들이 모여 올라옵니다. 재발이 잦은 편이라 주변 조직에 자극을 덜 주면서 신중하게 치료합니다."],
];
const POINTS = [
  ["532nm와 1064nm 두 파장", "색소가 얕은지 깊은지에 따라 파장을 달리해, 멜라닌 색소만 골라 겨냥합니다."],
  ["수분에 반응하는 미세 박피", "피부 속 수분에 잘 흡수되는 파장으로 표면을 얇고 정교하게 다듬어, 주변 조직에 전해지는 열을 줄입니다."],
  ["기화 방식의 병변 제거", "병변 조직의 수분을 순간적으로 증발시켜 없애는 방식입니다. 필요한 깊이까지 제거하면서 지혈에도 도움이 됩니다."],
];
// first-visit prices from the clinic's price sheet (VAT 별도); the full price list comes from ../programs
const FIRST = [
  ["슈링크 100샷", "첫 방문 피부진단 + 100샷 체험", "15,000원", "shurink"],
  ["듀얼토닝 1,500샷", "첫 방문 피부진단 + 1,500샷 체험", "25,000원", "toning"],
  ["점, 검버섯, 쥐젖 등", "신경 쓰이는 작은 병변, 1개당", "5,000원~", "removal"],
];
// [tag, name, description, detail link (none = price given after consultation)]
const BOOSTERS = [
  ["#PDRN", "연어주사", "연어에서 얻은 DNA 성분인 PDRN에 성장인자(MGF)를 더해 진피층에 전달하는 시술입니다. 섬유아세포의 활동과 콜라겐 생성을 도와, 모공, 잔주름, 얼굴의 붉은 기, 유수분 균형 관리에 쓰입니다."],
  ["#PN", "PN주사", "연어 DNA에서 추출한 성분(PN)으로 만든 재생 촉진제를 진피층에 주입하는 시술입니다. 자극으로 얇아진 진피를 도톰하게 채워 피부 장벽과 유수분 균형을 돕습니다. 모공과 안색이 정돈되는 효과도 기대할\u00A0수\u00A0있습니다.", "/program/pn-booster"],
];

const FAQ = [
  ["첫 방문 체험가는 어떻게 받을\u00A0수\u00A0있나요?", "처음 내원하신 분은 피부진단과 함께 슈링크 100샷(15,000원) 또는 듀얼토닝 1,500샷(25,000원)을 1회 체험가로 받을\u00A0수\u00A0있습니다. 모든 가격은 VAT 별도입니다."],
  ["야누스프로 피부 분석은 어떤 검사인가요?", "고해상도 촬영으로 색소, 모공, 주름, 피지 등 여러 항목을 나누어 측정하는 피부 분석입니다. 측정한 수치를 바탕으로 어떤 치료를 어떤 순서로 할지 정해 안내해 드립니다."],
  ["점 제거 비용은 얼마인가요?", "점, 편평사마귀, 검버섯, 쥐젖, 비립종 제거는 1개 5,000원이고, 30개 이내 139,000원, 50개 이내 229,000원, 80개 이상 359,000원입니다. 같은 병변이 남아 있으면 12주 이내 리터치가 포함됩니다."],
  ["레이저토닝, 듀얼토닝, 트리플토닝은 무엇이 다른가요?", "레이저토닝은 1064nm 토닝, 듀얼토닝은 1064nm 토닝에 제네시스를 더한 것, 트리플토닝은 여기에 532nm 색소토닝까지 더한 프리미엄 토닝입니다. 색소 종류와 피부톤에 맞춰 권해 드립니다."],
  ["슈링크 리프팅 가격은 얼마인가요?", "슈링크 300샷은 1회 99,000원, 3회 269,000원입니다. 처음이라면 첫 방문 피부진단과 함께 슈링크 100샷을 15,000원에 체험할\u00A0수\u00A0있습니다."],
  ["시술 후 바로 일상생활이 가능한가요?", "대부분 바로 일상생활이 가능합니다. 다만 시술에 따라 붉어짐이나 딱지가 며칠 생길\u00A0수\u00A0있어 시술 전에 안내해 드립니다."],
];

function Head({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="sub-cat-head" data-aos>
      <div>
        <h2>{title}</h2>
      </div>
      {lead && <p>{lead}</p>}
    </div>
  );
}

function PriceItem({ p }: { p: Program }) {
  return (
    <div className="sub-item" data-aos>
      <div>
        <h3>{p.name}</h3>
        <p className="desc">{p.summary}</p>
        <ul className="sub-tags">{p.concerns.map((t) => <li key={t}>{t}</li>)}</ul>
        <a className="sc-more" href={`/program/${p.slug}`}>자세히 보기 →</a>
      </div>
      <dl className="sub-price">
        {p.options.map((o) => (
          <div key={o.name}>
            <dt>{o.name}{o.first && <em className="sc-first">첫 방문</em>}<small className="sc-price-spec">{o.spec}</small></dt>
            <dd className="gm">{o.orig && <del>{o.orig}</del>}{o.price}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function Skin() {
  return (
    <main className="skin-clinic">
      <section className="sub-hero photo sc-hero">
        <picture><source media="(min-width: 768px)" srcSet="/img/skin/hero-wide.jpg" /><img className="sub-hero-img" src="/img/skin/hero.jpg" alt="" /></picture>
        <div className="sub-hero-inner">
          <div data-aos>
            <h1><span className="sub-label gm">논산 피부 한의원</span> 건강한 피부,<br /> <b>무리하지 않고 관리합니다</b></h1>
            <p>기미와 검버섯 같은 색소 고민부터 리프팅, 스킨부스터까지<br className="pc" /> 한곳에서 상담하실&nbsp;수&nbsp;있습니다.<br className="pc" /> 피부 분석 결과를 보고 꼭 필요한 시술부터 권합니다.</p>
            <ul className="ht-tabs">{TABS.map(([id, t]) => <li key={id}><a href={"#" + id}>{t}</a></li>)}</ul>
          </div>
        </div>
      </section>

      <section id="first" className="sub-cat sc-first-visit">
        <Head title={"처음이라면, 부담\u00A0없이 피부관리"} lead="처음 오신 분께 1회 체험가로 드립니다. 모든 시술은 VAT 별도입니다." />
        <ul className="sub-cards" data-aos>
          {FIRST.map(([t, d, price, slug]) => (
            <li key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
              <b className="price gm">{price}</b>
              <a className="sc-more" href={`/program/${slug}`}>시술 자세히 보기 →</a>
            </li>
          ))}
        </ul>
      </section>

      <section id="concern" className="sub-cat">
        <Head title="되풀이되는 색소와 잡티, 원인부터 봅니다" lead="겉으로는 비슷해 보여도 생기는 깊이와 원인이 저마다 다릅니다. 대표적인 여섯 가지를 먼저 알아 두세요." />
        <ul className="sub-cards sc-ill" data-aos>
          {CONDITIONS.map(([file, name, desc]) => (
            <li key={file}>
              <img src={`/img/skin/${file}.jpg`} alt={`${name} 모식도`} loading="lazy" />
              <h3>{name}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ul>
        <p className="sc-cap">※ 그림은 이해를 돕기 위한 모식도이며, 실제 모습은 사람마다 다릅니다.</p>
      </section>

      <section id="diagnosis" className="sub-cat">
        <Head title="피부 분석으로 시작하는 색소 치료" lead="눈으로 보이는 것만으로 판단하지 않습니다. 피부 상태를 숫자로 확인한 뒤 치료 계획을 세웁니다." />
        <div className="sc-intro" data-aos>
          <div>
            <h3>야누스프로 피부 분석</h3>
          </div>
          <p className="desc">고해상도 촬영으로 색소, 모공, 주름, 피지 등 여러 항목을 나누어 측정하는 피부 분석 장비입니다. 결과를 함께 보며 지금 피부에서 무엇을 먼저 관리할지 설명해 드립니다.</p>
        </div>
        <ul className="sub-cards sc-points" data-aos>
          {POINTS.map(([t, d]) => (
            <li key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="lifting" className="sub-cat">
        <Head title="흐려진 얼굴선에 다시 탄력을" />
        <div className="sc-intro" data-aos>
          <div>
            <h3>슈링크 리프팅</h3>
          </div>
          <div>
            <p className="desc">초음파 에너지를 한 지점에 모아 피부 아래 근막층(SMAS)까지 전달하는 리프팅 시술입니다. 근막층을 자극해 처진 라인을 정돈하고, 탄력과 잔주름 관리에 도움이 될&nbsp;수&nbsp;있습니다.</p>
            <a className="sc-more" href="/program/shurink">슈링크 가격과 자세한 내용 보기 →</a>
          </div>
        </div>
      </section>

      <section id="booster" className="sub-cat">
        <Head title="얇아지고 건조해진 피부, 재생 관리로 가꿉니다" lead="피부가 스스로 회복하는 힘을 돕는 성분을 진피층에 직접 전달하는 주사 관리입니다." />
        <ul className="sub-cards sc-boost" style={{ "--cols": 2 } as React.CSSProperties} data-aos>
          {BOOSTERS.map(([tag, name, desc, href]) => (
            <li key={tag}>
              <h3>{name}</h3>
              <p>{desc}</p>
              {href ? <a className="sc-more" href={href}>PN 스킨부스터 가격과 자세한 내용 보기 →</a> : <p className="sc-note">비용은 진료 후 안내해 드립니다.</p>}
            </li>
          ))}
        </ul>
      </section>

      <section id="price" className="sub-cat">
        <Head title="시술 가격표" lead={"모든 가격은 VAT 별도이며, 시술별 자세한 내용은 각 메뉴에서 볼\u00A0수\u00A0있습니다."} />
        {CATEGORIES.map(([cat, label]) => (
          <div key={cat}>
            <p className="sc-cat">{label}</p>
            {PROGRAMS.filter((p) => p.cat === cat).map((p) => <PriceItem key={p.slug} p={p} />)}
          </div>
        ))}
        <a className="sc-all" href="/program">전체 시술 메뉴 보기</a>
      </section>

      <Faq items={FAQ} />

      <section className="sub-notice">
        <h3>비용 및 시술 안내</h3>
        <ul>
          <li>모든 시술 비용은 VAT 별도입니다.</li>
          <li>첫 방문 체험가는 첫 방문 시 1회에 한해 적용됩니다.</li>
          <li>점과 잡티 제거는 같은 병변이 남아 있으면 12주 이내 리터치가 포함됩니다.</li>
          <li>시술 결과에는 개인차가 있으며, 붉어짐, 붓기, 딱지 등 일시적인 반응이 생길&nbsp;수&nbsp;있습니다.</li>
          <li>가격은 병원 사정에 따라 바뀔&nbsp;수&nbsp;있으니 {TEL}로 확인해 주세요.</li>
        </ul>
      </section>

      <section className="sub-cta">
        <h2>피부 고민, 지금 가볍게 시작하세요</h2>
        <p>첫 방문 피부진단으로 지금 상태를 확인하고, 알맞은 시술을 안내해 드립니다.</p>
        <a href={TEL_LINK}>{TEL} 전화 상담</a>
      </section>
    </main>
  );
}
