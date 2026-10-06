import "./list.css";
import ProgramList from "./list";
import { pageMeta } from "../site";
import { PROGRAMS } from "../programs";
import { JsonLd, graph, webPage, itemList } from "../seo";

export const metadata = pageMeta(
  "/program",
  "논산 피부 시술 메뉴와 가격",
  "논산 강경 광명당한의원의 피부 프로그램 전체 메뉴입니다. 슈링크 리프팅, 레이저, 듀얼, 트리플 토닝, Er:YAG 프락셀, PN 스킨부스터, 점과 잡티 제거 가격을 피부 고민별로 비교해 보세요(VAT 별도).",
  { image: ["/img/program-wide.jpg", 2400, 1357, "논산 피부 한의원 광명당한의원 피부 시술 프로그램"], keywords: ["논산 피부 시술", "논산 슈링크 가격", "논산 토닝 가격", "논산 점 제거 가격", "논산 프락셀", "논산 PN 스킨부스터", "논산 피부 한의원"] }
);

const LD = graph(
  webPage("/program", "논산 피부 시술 메뉴와 가격", "광명당한의원 피부 프로그램 전체 메뉴와 가격(VAT 별도)을 피부 고민별로 비교합니다.", { image: "/img/program-wide.jpg" }),
  itemList("피부 시술 프로그램", PROGRAMS.map((p) => [p.name, `/program/${p.slug}`])),
);

export default function Program() {
  return (
    <main className="skin-clinic">
      <ProgramList />

      <div className="pl-foot">
        <p>모든 가격은 VAT 별도입니다.</p>
        <a href="/skin">피부 클리닉 소개 보기 →</a>
      </div>
      <JsonLd data={LD} />
    </main>
  );
}
