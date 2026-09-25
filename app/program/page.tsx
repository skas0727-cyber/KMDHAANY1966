import "./list.css";
import ProgramList from "./list";
import { pageMeta } from "../site";

export const metadata = pageMeta(
  "/program",
  "논산 피부 시술 메뉴 · 가격",
  "논산 강경 광명당한의원 피부 프로그램 전체 메뉴로, 슈링크 리프팅, 레이저·듀얼·트리플 토닝, Er:YAG 프락셀, PN 스킨부스터, 점·잡티 제거의 시술별 가격을 피부 고민별로 비교해 볼 수 있습니다(VAT 별도)."
);

export default function Program() {
  return (
    <main className="skin-clinic">
      <section className="sub-hero pl-hero">
        <div className="sub-hero-inner">
          <div data-aos>
            <h1><span className="sub-label gm">논산 피부 한의원</span> 피부 프로그램</h1>
            <p>피부 고민을 고르면 맞는 프로그램과 가격을 한눈에 확인할 수 있습니다.</p>
          </div>
        </div>
      </section>

      <ProgramList />

      <div className="pl-foot">
        <p>모든 가격은 VAT 별도입니다.</p>
        <a href="/skin">피부 클리닉 소개 보기 →</a>
      </div>
    </main>
  );
}
