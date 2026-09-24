import Faq from "../faq";
import { pageMeta, TEL, TEL_LINK } from "../site";

export const metadata = pageMeta(
  "/accident",
  "논산 교통사고 한의원 · 자동차보험 본인부담금 0원",
  "논산 강경 교통사고 한의원 광명당한의원. 자동차보험 협약 의료기관으로 전 보험사 자동차보험이 적용되어 본인부담금 없이 침·약침, 추나요법, 한약, 물리치료를 받을 수 있습니다. 사고 당일 내원 가능, 월·수·금 야간진료."
);

const POINTS = [["본인부담금", "0원"], ["전 보험사", "자동차보험 적용"], ["사고 당일", "바로 내원 가능"], ["월·수·금", "20시 야간진료"]];
const SYMPTOMS = [
  ["목·어깨 통증", "목이 뻣뻣하고 어깨가 결리며 고개를 돌리기 힘듭니다."],
  ["허리 통증", "허리가 뻐근하고 오래 앉아 있거나 서 있기 힘듭니다."],
  ["두통·어지럼증", "머리가 무겁고 어지럽거나 속이 메스껍습니다."],
  ["손발 저림", "팔다리가 저리거나 힘이 빠지는 느낌이 듭니다."],
  ["불면·불안", "사고 장면이 떠올라 잠들기 어렵고 쉽게 놀랍니다."],
  ["피로·무기력", "몸이 무겁고 쉽게 지치며 회복이 더딥니다."],
];
const TREATMENTS = [
  ["needle.jpg", "침·약침", "통증 부위의 긴장을 풀고 순환을 도와 염증과 통증을 가라앉힙니다."],
  ["room-spine.jpg", "추나요법", "충격으로 틀어진 척추와 관절의 균형을 손으로 바로잡습니다."],
  ["herbs.jpg", "한약", "사고로 생긴 어혈을 풀고 회복을 돕는 한약을 체질에 맞춰 처방합니다."],
  ["rafos-use.jpg", "물리치료", "온열·전기 등 물리치료로 뭉친 근육을 깊은 곳까지 풀어 줍니다."],
];
const STEPS = [
  ["사고 접수", "가입한 보험사(또는 상대 보험사)에 사고를 접수하고 접수번호를 받습니다."],
  ["내원·진료", "접수번호와 신분증을 가지고 내원하시면 원장이 직접 상태를 진찰합니다."],
  ["지급보증 확인", "한의원에서 보험사에 지급보증을 요청하므로 따로 하실 일이 없습니다."],
  ["치료 시작", "본인부담금 없이 침·약침, 추나, 한약, 물리치료를 받습니다."],
];
const FAQ = [
  ["교통사고 한의원 치료비는 얼마인가요?", "자동차보험으로 치료하면 본인부담금 없이 치료받을 수 있습니다. 광명당한의원은 전 보험사 자동차보험이 적용되는 협약 의료기관입니다."],
  ["사고 후 며칠 지나서 아파도 치료받을 수 있나요?", "네. 교통사고 통증은 며칠에서 몇 주 뒤에 나타나기도 합니다. 사고 접수가 되어 있다면 증상이 생긴 뒤에 내원하셔도 됩니다."],
  ["정형외과 치료를 받고 있어도 한의원 치료를 같이 받을 수 있나요?", "네, 양방 치료를 받고 계셔도 한의원 치료를 함께 받으실 수 있습니다. 보험사별 기준이 있어 내원하시면 자세히 안내해 드립니다."],
  ["무엇을 가지고 가야 하나요?", "보험사에서 받은 사고 접수번호와 신분증을 가지고 오시면 됩니다. 보험사 담당자 연락처를 알고 계시면 접수가 더 빠릅니다."],
  ["야간에도 진료하나요?", "월·수·금요일은 저녁 8시까지 야간진료를 합니다. 화·목요일은 오후 6시, 토요일은 오후 1시까지 진료합니다."],
];

export default function Accident() {
  return (
    <main>
      <section className="sub-hero">
        <div className="sub-hero-inner">
          <div data-aos>
            <h1><span className="sub-label gm">논산 교통사고 한의원</span> 사고 후 통증,<br /> <b>초기 치료가 중요합니다</b></h1>
            <p>교통사고 직후에는 괜찮다가 며칠 뒤 통증이 시작되는 경우가 많습니다.<br className="pc" /> 광명당한의원은 자동차보험 협약 의료기관으로, 본인부담금 없이 한방 치료를 받을 수 있습니다.</p>
          </div>
          <img src="/img/backpain.jpg" alt="교통사고 후 허리 통증" />
        </div>
      </section>

      <ul className="sub-points">
        {POINTS.map(([k, v]) => <li key={k}><span>{k}</span><b className="gm">{v}</b></li>)}
      </ul>

      <section id="symptom" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <p className="en gm">SYMPTOMS</p>
            <h2>이런 증상이 있다면</h2>
          </div>
          <p>영상 검사에서 이상이 없어도 사고 충격으로 근육과 인대가 놀라 통증이 남을 수 있습니다. 가벼운 증상이라도 진료를 받아 보세요.</p>
        </div>
        <ul className="sub-cards" data-aos>
          {SYMPTOMS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
        </ul>
      </section>

      <section id="treatment" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <p className="en gm">TREATMENT</p>
            <h2>치료 방법</h2>
          </div>
          <p>아픈 부위만이 아니라 사고로 뭉친 어혈과 틀어진 균형을 함께 치료합니다.</p>
        </div>
        <ul className="sub-cards" style={{ "--cols": 4 }} data-aos>
          {TREATMENTS.map(([img, t, d]) => <li key={t}><img src={"/img/" + img} alt={"교통사고 " + t} /><h3>{t}</h3><p>{d}</p></li>)}
        </ul>
      </section>

      <section id="process" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <p className="en gm">PROCESS</p>
            <h2>진료 절차</h2>
          </div>
          <p>사고 접수번호만 있으면 복잡한 절차 없이 바로 치료를 시작할 수 있습니다.</p>
        </div>
        <ol className="sub-steps" data-aos>
          {STEPS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
      </section>

      <Faq items={FAQ} />

      <section className="sub-notice">
        <h3>교통사고 진료 안내</h3>
        <ul>
          <li>자동차보험 치료 시 보험사 사고 접수번호가 필요합니다.</li>
          <li>치료 기간과 경과는 사고 정도와 개인에 따라 다릅니다.</li>
          <li>약침·추나 등 치료 후 일시적인 뻐근함이나 멍이 생길 수 있습니다.</li>
          <li>추나요법·체외충격파·고주파 치료는 예약제로 운영합니다.</li>
        </ul>
      </section>

      <section className="sub-cta">
        <h2>사고 후 통증, 미루지 마세요</h2>
        <p>사고 접수번호만 있으면 오늘 바로 치료받을 수 있습니다.</p>
        <a href={TEL_LINK}>{TEL} 전화 상담</a>
      </section>
    </main>
  );
}
