import Faq from "../faq";
import { pageMeta, TEL, TEL_LINK } from "../site";

export const metadata = pageMeta(
  "/diet",
  "논산 다이어트 한의원 · 체질 맞춤 다이어트 한약",
  "논산 강경 다이어트 한의원 광명당한의원. 붓기형·식욕폭주형·냉증형 등 비만 유형과 체질을 진단해 맞춤 다이어트 한약을 처방하고, 굶지 않는 식단과 생활 관리까지 함께합니다."
);

// placeholder: replace every P with the clinic's real prices before launch
const P = "00,000원";

const TYPES = [
  ["붓기형", "몸속 수분 순환이 더뎌 아침저녁으로 잘 붓고 하체가 무겁습니다. 순환과 배출을 돕는 처방을 합니다."],
  ["식욕폭주형", "스트레스를 받거나 밤이 되면 식욕이 치솟아 폭식이 반복됩니다. 식욕과 위의 열을 조절하는 처방을 합니다."],
  ["냉증형", "손발과 배가 차고 적게 먹어도 살이 잘 빠지지 않습니다. 몸을 데우고 대사를 돕는 처방을 합니다."],
];
const PROGRAMS = [
  { name: "맞춤 다이어트 한약", desc: "체질과 비만 유형에 맞춰 식욕 조절과 대사를 돕는 한약을 처방합니다. 복용 중 불편한 점은 원장이 직접 확인해 처방을 조절합니다.", tags: ["체중 감량", "식욕 조절", "요요 관리"], prices: [["1개월", P], ["3개월", P]] },
  { name: "다이어트 약침", desc: "군살이 고민인 부위에 약침을 놓아 부분 체형 관리를 돕습니다. 한약과 함께 하면 전신과 부분을 같이 관리할 수 있습니다.", tags: ["복부", "팔뚝", "허벅지"], prices: [["1회", P], ["10회", P]] },
  { name: "산후 다이어트", desc: "출산 후 붓기와 늘어난 체중을 몸의 회복과 함께 관리합니다. 수유 여부와 회복 상태에 맞춰 처방합니다.", tags: ["산후 붓기", "산후 체중"], prices: [["1개월", P], ["3개월", P]] },
];
const STEPS = [
  ["체질 진단", "진맥과 상담으로 체질, 생활 습관, 비만 유형을 파악합니다."],
  ["맞춤 처방", "목표 체중과 몸 상태에 맞춰 한약을 처방합니다."],
  ["생활 관리", "무리하게 굶지 않는 식단과 생활 습관을 함께 안내합니다."],
  ["경과 확인", "체중 변화와 컨디션을 확인하며 처방을 조절합니다."],
];
const FAQ = [
  ["다이어트 한약은 누구나 먹을 수 있나요?", "원장이 진맥과 상담으로 체질과 건강 상태를 확인한 뒤 처방합니다. 임신·수유 중이거나 복용 중인 약이 있다면 상담할 때 꼭 알려 주세요."],
  ["굶으면서 해야 하나요?", "아닙니다. 끼니를 거르기보다 식욕을 조절하며 규칙적으로 먹는 방법을 안내합니다."],
  ["요요가 오지는 않나요?", "요요는 급하게 뺀 뒤 예전 습관으로 돌아갈 때 잘 생깁니다. 감량 뒤에도 식습관과 생활 관리를 함께 안내해 요요를 줄이도록 돕습니다."],
  ["비용은 얼마인가요?", "처방 기간과 체질에 따라 달라집니다. 이 페이지의 가격표를 참고해 주시고, 정확한 비용은 진료 후 안내해 드립니다. 문의는 041-745-2141로 해 주세요."],
];

export default function Diet() {
  return (
    <main>
      <section className="sub-hero photo">
        <img className="sub-hero-img" src="/img/herbs.jpg" alt="" style={{ objectPosition: "50% 30%" }} />
        <div className="sub-hero-inner">
          <div data-aos>
            <h1><span className="sub-label gm">논산 다이어트 한의원</span> 굶지 않고,<br /> <b>체질에 맞게 관리합니다</b></h1>
            <p>살이 찌는 이유는 사람마다 다릅니다.<br className="pc" /> 광명당한의원은 비만 유형과 체질을 먼저 진단하고, 맞춤 한약으로 식욕과 대사를 함께 관리합니다.</p>
          </div>
        </div>
      </section>

      <section id="type" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <p className="en gm">TYPE</p>
            <h2>비만 유형별 맞춤 처방</h2>
          </div>
          <p>같은 체중이라도 살이 찌는 원인이 다르면 처방도 달라야 합니다.</p>
        </div>
        <ul className="sub-cards" data-aos>
          {TYPES.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
        </ul>
      </section>

      <section id="program" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <p className="en gm">PROGRAM</p>
            <h2>프로그램 · 비용</h2>
          </div>
          <p>체질 진단 후 기간과 목표에 맞춰 프로그램을 정합니다.</p>
        </div>
        {PROGRAMS.map((it) => (
          <div key={it.name} className="sub-item" data-aos>
            <div>
              <h3>{it.name}</h3>
              <p className="desc">{it.desc}</p>
              <ul className="sub-tags">{it.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <dl className="sub-price">
              {it.prices.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="gm">{v}</dd></div>)}
            </dl>
          </div>
        ))}
      </section>

      <section id="process" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <p className="en gm">PROCESS</p>
            <h2>진료 과정</h2>
          </div>
          <p>감량보다 유지가 어렵습니다. 처방부터 생활 관리까지 함께합니다.</p>
        </div>
        <ol className="sub-steps" data-aos>
          {STEPS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
      </section>

      <Faq items={FAQ} />

      <section className="sub-notice">
        <h3>비용 및 복용 안내</h3>
        <ul>
          <li>표시된 금액은 비급여 진료비이며, 체질과 처방에 따라 달라질 수 있습니다.</li>
          <li>한약 복용 중 두근거림, 불면, 소화 불편 등이 생기면 복용을 멈추고 연락해 주세요.</li>
          <li>감량 정도와 기간에는 개인차가 있습니다.</li>
        </ul>
      </section>

      <section className="sub-cta">
        <h2>나에게 맞는 다이어트가 궁금하다면</h2>
        <p>체질 진단 후 맞춤 프로그램을 안내해 드립니다.</p>
        <a href={TEL_LINK}>{TEL} 전화 상담</a>
      </section>
    </main>
  );
}
