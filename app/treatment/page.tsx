import Faq from "../faq";
import { pageMeta, TEL, TEL_LINK } from "../site";
import HeroTabs from "../hero-tabs";

export const metadata = pageMeta(
  "/treatment",
  "논산 한의원 한약 가격과 보약, 약침, 추나 패키지",
  "논산 강경 한의원 광명당한의원. 으뜸 보약, 맞춤 치료약, 부인과 치료약, 다이어트 한약 가격과 고주파(RAFOS Premium), 체외충격파, 약침, 추나요법 치료 안내와 약침, 추나, 통합 치료 패키지 가격을 확인하세요."
);

// section links shown in the hero; each swaps in its own still life (/img/<bg>[-wide].jpg)
const TABS = [["bohyak", "으뜸 보약"], ["custom", "맞춤 치료약"], ["gynecology", "부인과 치료약"], ["diet", "다이어트 한약"], ["care", "치료 안내"], ["package", "패키지 안내"]]
  .map(([id, label]) => ({ id, label, href: "#" + id, bg: id === "bohyak" ? "treatment" : "treatment-" + id }));

const BOHYAK = [
  ["가미녹용이공산", "피로와 스트레스로 지친 분께 권하는 녹용 보약입니다. 기혈을 보충하고 순환을 도우며, 떨어진 입맛과 영양 흡수 회복에도 도움이 됩니다."],
  ["가미녹용팔물탕", "출산이나 수술로 기혈이 많이 소모된 분께 권합니다. 산후 몸조리를 돕고, 어지럼증(빈혈 증상)과 약해진 소화 기능의 회복을 목표로 하는 처방입니다."],
  ["가미총명탕", "공부나 일에 집중해야 하는 수험생과 직장인에게 권합니다. 머리를 맑게 하고 집중력 유지를 도우며, 스트레스로 생긴 긴장과 불안을 푸는 데 도움을 줍니다."],
  ["가미녹용대보탕", "성장기 어린이를 위한 보약입니다. 발육과 성장을 돕고, 허약한 체질을 보강하며 면역 관리에도 도움을 줍니다."],
];

const CUSTOM_MEDS: [string, string][] = [
  ["중풍", "16만원"], ["안면신경마비", "16만원"], ["요실금", "25만원"], ["방광염", "16만원"],
  ["관절염", "16만원"], ["부종", "16만원"], ["신경안정", "25만원"], ["여드름, 면열풍", "16만원"],
  ["감기, 몸살", "16만원"], ["진해거담", "16만원"], ["위궤양, 위염", "25만원"], ["설사, 복냉증", "16만원"],
];

const GYNECOLOGY: [string, string][] = [
  ["생리불순", "25만원"], ["입덧", "25만원"], ["하혈", "16만원"], ["태동불안", "25만원"],
];

const CARE = [
  ["rafos.jpg", "고주파(심부열)", "RAFOS Premium 장비로 CET, RET 두 가지 모드를 사용합니다. RF 에너지로 몸속 깊은 곳의 온도를 높여(심부열) 굳은 근육과 인대를 풀고, 혈액과 림프 순환을 돕습니다. 치료 중 통증이 적은 편입니다.", ["목과 어깨 뭉침", "허리 통증", "관절염", "교통사고 후유증", "하지 부종", "수족냉증"]],
  ["ulforce.jpg", "체외충격파", "압전 방식으로 만든 충격파 에너지를 통증 부위에 전달하는 비수술 통증 치료입니다. 절개가 없어 회복 부담이 적은 편이며 여러 부위에 적용할\u00A0수\u00A0있습니다.", ["오십견", "석회화건염", "회전근개 파열", "만성 디스크와 요통", "족저근막염", "아킬레스건염"]],
  ["treatment-yakchim.jpg", "약침 요법", "한약재에서 추출해 정제한 약액을 통증 부위의 경혈에 주입해, 침 자극과 한약의 효과를 함께 기대하는 치료입니다.", ["급성 통증", "회전근개 파열과 테니스 엘보 등 염증성 질환", "발목 염좌와 인대 손상", "타박상과 어혈"]],
  ["room-spine.jpg", "추나 요법", "손과 몸, 보조 기구를 써서 척추와 관절, 근육을 밀고 당기며 균형을 바로잡는 비수술 교정 치료입니다.", ["허리와 목 디스크", "척추관 협착증", "거북목, 일자목, 굽은 등", "골반 틀어짐과 자세 불균형", "교통사고 후유증과 만성 통증"]],
] as const;

const FAQ = [
  ["으뜸 보약은 얼마인가요?", "가미녹용이공산, 가미녹용팔물탕, 가미총명탕, 가미녹용대보탕 모두 1제 40포(20일분) 기준 40만원입니다."],
  ["맞춤 치료약은 며칠 동안 먹나요?", "1제 30포(10일분)가 기준입니다. 문진과 진찰 후 증상과 체질에 맞춰 처방하며, 복용 기간과 처방 내용은 경과를 보며 조정합니다."],
  ["1년 20회 추나 패키지는 어떻게 이용하나요?", "1년 동안 20회를 이용하는 패키지로, 1회 기준 추나 치료 31,700원, 추나치료 + 녹용약침 54,100원, 추나치료 + 충격파 또는 고주파 54,100원입니다. 초진 시에는 별도 추가 금액이 발생할\u00A0수\u00A0있습니다."],
  ["패키지 치료도 실손보험 청구가 되나요?", "네, 실손보험 청구가 가능합니다. 가입한 보험 상품에 따라 청구 범위가 다를\u00A0수\u00A0있어 진료 후 안내해 드립니다."],
  ["초진에는 추가 비용이 있나요?", "네. 초진 시에는 진찰료 등 별도 추가 금액이 발생할\u00A0수\u00A0있습니다. 정확한 비용은 내원 시 안내해 드립니다."],
];

function PriceRows({ items }: { items: [string, string][] }) {
  return (
    <dl className="sub-price">
      {items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="gm">{v}</dd></div>)}
    </dl>
  );
}

export default function Treatment() {
  return (
    <main>
      <HeroTabs tabs={TABS} base="treatment">
            <h1><span className="sub-label gm">논산 한의원</span> 한약과 치료,<br /> <b>한눈에 확인하세요</b></h1>
            <p>몸 상태와 증상에 맞춰 보약과 치료약을 처방하고,<br className="pc" /> 고주파, 체외충격파, 약침, 추나 같은 치료로 회복을 돕습니다.<br className="pc" /> 아래에서 가격과 이용 방법을 확인해 보세요.</p>
      </HeroTabs>

      <section id="bohyak" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <h2>으뜸 보약</h2>
          </div>
          <p>기혈을 보충해 떨어진 기본 체력의 회복을 돕는 보약입니다. 1제 40포(20일분) 기준으로 처방합니다.</p>
        </div>
        <ul className="sub-cards" style={{ "--cols": 4 } as React.CSSProperties} data-aos>
          {BOHYAK.map(([name, desc]) => (
            <li key={name}>
              <h3>{name}</h3>
              <p>{desc}</p>
              <b className="price gm">40만원</b>
              <small className="sc-price-spec">1제 40포(20일분 기준)</small>
            </li>
          ))}
        </ul>
      </section>

      <section id="custom" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <h2>맞춤 치료약</h2>
          </div>
          <p>문진과 진찰로 증상, 체질, 생활 패턴을 확인한 뒤 약재 구성과 용량을 조정해 처방합니다. 복용 기간과 처방은 경과에 따라 달라질&nbsp;수&nbsp;있습니다.</p>
        </div>
        <div data-aos>
          <PriceRows items={CUSTOM_MEDS} />
          <p className="sc-cap">1제 30포(10일분 기준)</p>
        </div>
      </section>

      <section id="gynecology" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <h2>부인과 치료약</h2>
          </div>
          <p>문진과 진찰로 월경불순, 생리통, 냉(대하), 골반과 하복부 불편감 등을 살핀 뒤 체질과 증상 단계에 맞춰 처방합니다. 경과에 따라 처방을 조정하기도 합니다.</p>
        </div>
        <div data-aos>
          <PriceRows items={GYNECOLOGY} />
          <p className="sc-cap">1제 30포(10일분 기준)</p>
        </div>
      </section>

      <section id="diet" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <h2>다이어트 한약</h2>
          </div>
          <p>식욕과 소화, 대사 흐름, 순환 상태를 확인한 뒤 체질과 컨디션에 맞게 처방합니다. 무리한 절식보다 생활 패턴에 맞춰 강도를 조절하며, 붓기, 피로감, 소화 불편 같은 동반 증상도 함께 살핍니다.</p>
        </div>
        <div className="sub-item" data-aos>
          <div>
            <h3>감비환과 감비탕</h3>
            <p className="desc">체질과 컨디션에 맞춰 처방하는 다이어트 한약입니다.</p>
            <a className="sc-more" href="/diet">다이어트 프로그램 자세히 보기 →</a>
          </div>
          <PriceRows items={[["1제 30포(15일분 기준)", "14만 5천원"]]} />
        </div>
      </section>

      <section id="care" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <h2>치료 안내</h2>
          </div>
          <p>증상과 몸 상태를 보고 아래 치료 가운데 알맞은 방법을 골라 진행합니다.</p>
        </div>
        <ul className="sub-cards" style={{ "--cols": 2 } as React.CSSProperties} data-aos>
          {CARE.map(([img, name, desc, tags]) => (
            <li key={name}>
              <img src={"/img/" + img} alt={name} loading="lazy" />
              <h3>{name}</h3>
              <p>{desc}</p>
              <ul className="sub-tags">{tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </li>
          ))}
        </ul>
      </section>

      <section id="package" className="sub-cat">
        <div className="sub-cat-head" data-aos>
          <div>
            <h2>패키지 치료 안내</h2>
          </div>
          <p>여러 회차를 묶어 이용하는 패키지입니다. 건강보험이 적용되는 항목은 본인부담금 기준 금액입니다.</p>
        </div>

        <p className="sc-cat">약침 패키지</p>
        <div className="sub-item" data-aos>
          <div><h3>녹용약침</h3><p className="desc">정상가 1회 15,000원</p></div>
          <PriceRows items={[["5회", "70,000원"], ["10회", "130,000원"]]} />
        </div>
        <div className="sub-item" data-aos>
          <div><h3>자하거약침(태반약침)</h3><p className="desc">정상가 1회 25,000원</p></div>
          <PriceRows items={[["5회", "120,000원"], ["10회", "230,000원"]]} />
        </div>

        <p className="sc-cat">1년 20회 추나 패키지</p>
        <div className="sub-item" data-aos>
          <div><h3>추나 패키지</h3><p className="desc">1년 동안 20회를 이용하는 패키지이며, 표시된 금액은 1회당 금액입니다.</p></div>
          <PriceRows items={[["추나 치료", "31,700원"], ["추나치료 + 녹용약침", "54,100원"], ["추나치료 + 충격파 또는 고주파", "54,100원"]]} />
        </div>

        <p className="sc-cat">통합 치료 패키지 (건강보험 본인부담금)</p>
        <div className="sub-item" data-aos>
          <div><h3>65세 미만</h3><p className="desc">65세 미만 환자의 건강보험 본인부담금입니다.</p></div>
          <PriceRows items={[["침 치료", "9,800원"], ["침 + 자기장 치료", "12,200원"], ["침 + 고주파 또는 충격파 + 자기장", "18,500원"]]} />
        </div>
        <div className="sub-item" data-aos>
          <div><h3>65세 이상</h3><p className="desc">65세 이상 환자의 건강보험 본인부담금입니다.</p></div>
          <PriceRows items={[["침 치료", "2,400원"], ["침 + 자기장 치료", "5,900원"], ["침 + 고주파 또는 충격파 + 자기장", "16,000원"]]} />
        </div>

        <p className="sc-cap">* 초진 시 별도 추가 금액이 발생합니다. 실손보험 청구가 가능합니다.</p>
      </section>

      <Faq items={FAQ} />

      <section className="sub-notice">
        <h3>비용 및 처방 안내</h3>
        <ul>
          <li>처방 내용과 복용 기간은 진찰 후 증상과 체질에 따라 달라질&nbsp;수&nbsp;있습니다.</li>
          <li>표시된 금액은 병원 사정에 따라 바뀔&nbsp;수&nbsp;있으니 {TEL}로 다시 확인해 주세요.</li>
          <li>건강보험이 적용되는 침과 추나 등 치료 항목은 본인부담금 기준 금액이며, 자격 조건과 횟수에 따라 달라질&nbsp;수&nbsp;있습니다.</li>
        </ul>
      </section>

      <section className="sub-cta">
        <h2>어떤 처방이 맞을지 궁금하다면</h2>
        <p>진찰 후 체질과 증상에 맞는 한약과 치료를 안내해 드립니다.</p>
        <a href={TEL_LINK}>{TEL} 전화 상담</a>
      </section>
    </main>
  );
}
