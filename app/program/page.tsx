import "./list.css";
import ProgramList from "./list";
import { pageMeta } from "../site";

export const metadata = pageMeta(
  "/program",
  "논산 피부 시술 메뉴와 가격",
  "논산 강경 광명당한의원의 피부 프로그램 전체 메뉴입니다. 슈링크 리프팅, 레이저, 듀얼, 트리플 토닝, Er:YAG 프락셀, PN 스킨부스터, 점과 잡티 제거 가격을 피부 고민별로 비교해 보세요(VAT 별도)."
);

export default function Program() {
  return (
    <main className="skin-clinic">
      <ProgramList />

      <div className="pl-foot">
        <p>모든 가격은 VAT 별도입니다.</p>
        <a href="/skin">피부 클리닉 소개 보기 →</a>
      </div>
    </main>
  );
}
