import Faq, { SubHero, Head, Cta, Notice } from "../faq";
import { pageMeta } from "../site";

export const metadata = pageMeta(
  "/accident",
  "논산 교통사고 한의원, 자동차보험 본인부담금 0원",
  "논산 강경 교통사고 한의원 광명당한의원. 자동차보험 협약 의료기관으로 전 보험사 자동차보험이 적용되어 본인부담금 없이 침과 약침, 추나요법, 한약, 한방물리요법을 받을 수 있습니다. 사고 당일 내원 가능, 평일 야간진료."
);

const TABS: [string, string][] = [["symptom", "이런 증상"], ["treatment", "치료 방법"], ["process", "진료 절차"], ["faq", "자주 묻는 질문"]];
const SYMPTOMS = [
  ["목과 어깨 통증", "목이 뻣뻣하고 어깨가 결리며 고개를 돌리기 힘듭니다.", "neck-shoulder"],
  ["허리 통증", "허리가 뻐근하고 오래 앉아 있거나 서\u00A0있기 힘듭니다.", "lower-back"],
  ["두통과 어지럼증", "머리가 무겁고 어지럽거나 속이 메스껍습니다.", "headache"],
  ["손발 저림", "팔다리가 저리거나 힘이 빠지는 느낌이 듭니다.", "numbness"],
  ["불면과 불안", "사고 장면이 떠올라 잠들기 어렵고 쉽게 놀랍니다.", "insomnia"],
  ["피로와 무기력", "몸이 무겁고 쉽게 지치며 회복이 더딥니다.", "fatigue"],
];
const TREATMENTS = [
  ["accident-needle.jpg", "침과 약침", "통증 부위의 뭉친 근육과 순환을 풀어 통증 완화를 돕습니다."],
  ["room-spine.jpg", "추나요법", "사고 충격으로 틀어진 척추와 관절의 균형 회복을 돕습니다."],
  ["herbal-pouch.jpg", "한약", "사고로 생긴 어혈을 풀고 회복을 돕는 한약을 체질에 맞춰 처방합니다."],
  ["rafos-use.jpg", "한방물리요법", "온열과 전기 자극 등으로 굳은 근육을 부드럽게 풀어 줍니다."],
];
const STEPS = [
  ["사고 접수", "가입한 보험사(또는 상대 보험사)에 사고를 접수하고 접수번호를 받습니다."],
  ["내원과 진료", "접수번호와 신분증을 가지고 내원하시면 원장이 직접 상태를 진찰합니다."],
  ["지급보증 확인", "지급보증은 한의원에서 보험사에 직접 요청합니다. 환자분이 따로 하실 일은 없습니다."],
  ["치료 시작", "본인부담금 없이 침과 약침, 추나, 한약, 한방물리요법을 받습니다."],
];
const FAQ = [
  ["교통사고 한의원 치료비는 얼마인가요?", "자동차보험으로 치료하면 본인부담금 없이 치료받을\u00A0수\u00A0있습니다. 광명당한의원은 전 보험사 자동차보험이 적용되는 협약 의료기관입니다. 과실 비율과 가입한 보험 조건에 따라 보험 처리 범위가 달라질\u00A0수\u00A0있어 내원 시 안내해 드립니다."],
  ["사고 후 며칠 지나서 아파도 치료받을\u00A0수\u00A0있나요?", "네. 교통사고 통증은 며칠에서 몇 주 뒤에 나타나기도 합니다. 사고 접수가 되어 있다면 증상이 생긴 뒤에 내원하셔도 됩니다."],
  ["정형외과 치료를 받고 있어도 한의원 치료를 같이 받을\u00A0수\u00A0있나요?", "네, 양방 치료를 받고 계셔도 한의원 치료를 함께 받으실\u00A0수\u00A0있습니다. 보험사별 기준이 있어 내원하시면 자세히 안내해 드립니다."],
  ["무엇을 가지고 가야 하나요?", "보험사에서 받은 사고 접수번호와 신분증을 가지고 오시면 됩니다. 보험사 담당자 연락처를 알고 계시면 접수가 더 빠릅니다."],
  ["야간에도 진료하나요?", "평일(월~금)은 저녁 8시까지, 토요일은 오후 1시까지 진료합니다."],
];

export default function Accident() {
  return (
    <main>
      <SubHero img="/img/backpain.jpg" wide="/img/accident-wide.jpg" pos="50% 45%" tabs={TABS}>
        <h1><span className="sub-label">논산 교통사고 한의원</span> 사고 후 통증,<br /> <b>초기 치료가 중요합니다</b></h1>
        <p>교통사고 직후에는 괜찮다가 며칠 뒤 통증이 시작되는 경우가 많습니다.<br className="pc" /> 자동차보험 협약 의료기관인 광명당한의원에서는<br className="pc" /> 본인부담금 없이 한방 치료를 받을&nbsp;수&nbsp;있습니다.</p>
      </SubHero>

      <section className="sub-intro" data-aos>
        <h2>자동차보험 협약 의료기관,<br /><span>본인부담금 0원</span>으로 치료받는<br />논산 교통사고 한의원입니다.</h2>
        <p>전 보험사 자동차보험이 적용되고, 사고 당일에도 바로 내원하실&nbsp;수&nbsp;있습니다.<br className="pc" /> 평일은 저녁 8시까지 진료합니다.</p>
      </section>

      <section id="symptom" className="sub-cat">
        <Head title="이런 증상이 있다면" lead="영상 검사에서 이상이 없어도 사고 충격으로 근육과 인대가 놀라 통증이 남을&nbsp;수&nbsp;있습니다. 가벼운 증상이라도 진료를 받아 보세요." />
        <ul className="sub-cards" data-aos>
          {SYMPTOMS.map(([t, d, image]) => <li key={t}><img src={"/img/accident/" + image + ".jpg"} alt={t + " 증상 설명 이미지"} width={1448} height={1086} style={{ height: "auto" }} loading="lazy" /><h3>{t}</h3><p>{d}</p></li>)}
        </ul>
      </section>

      <section id="treatment" className="sub-cat">
        <Head title="치료 방법" lead="아픈 부위뿐 아니라 사고로 생긴 어혈과 틀어진 몸의 균형까지 함께 살펴 치료합니다." />
        <ul className="sub-cards" style={{ "--cols": 4 } as React.CSSProperties} data-aos>
          {TREATMENTS.map(([img, t, d]) => <li key={t}><img src={"/img/" + img} alt={"교통사고 " + t} loading="lazy" /><h3>{t}</h3><p>{d}</p></li>)}
        </ul>
      </section>

      <section id="process" className="sub-cat">
        <Head title="진료 절차" lead="사고 접수번호만 있으면 복잡한 절차 없이 바로 치료를 시작할&nbsp;수&nbsp;있습니다." />
        <ol className="sub-steps" data-aos>
          {STEPS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
      </section>

      <Faq items={FAQ} />

      <Notice title="교통사고 진료 안내" items={[
        "자동차보험 치료 시 보험사 사고 접수번호가 필요합니다.",
        "치료 기간과 경과는 사고 정도와 개인에 따라 다릅니다.",
        "약침과 추나 등 치료 후 일시적인 뻐근함이나 멍이 생길\u00A0수\u00A0있습니다.",
        "추나요법, 체외충격파, 고주파 치료는 예약제로 운영합니다.",
      ]} />

      <Cta title="사고 후 통증, 미루지 마세요" text="사고 접수번호만 있으면 오늘 바로 치료받을&nbsp;수&nbsp;있습니다." />
    </main>
  );
}
