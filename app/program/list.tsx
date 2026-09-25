"use client";
import { useState } from "react";
import { CATEGORIES, CONCERNS, PROGRAMS } from "../programs";
import HeroTabs from "../hero-tabs";

const CAT = Object.fromEntries(CATEGORIES);
// hero tabs: each category swaps in its own model shot (/img/program-<cat>[-wide].jpg)
const TABS = [{ id: "all", label: "전체", bg: "program" }, ...CATEGORIES.map(([id, label]) => ({ id, label, bg: "program-" + id }))];

// no data-aos on cards: the reveal observer only runs once per route, so cards re-mounted by filtering would stay hidden
export default function ProgramList() {
  const [cat, setCat] = useState("all");
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (c: string) => setPicked((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const list = PROGRAMS.filter((p) => (cat === "all" || p.cat === cat) && (!picked.length || p.concerns.some((c) => picked.includes(c))));

  return (
    <>
    <HeroTabs tabs={TABS} base="program" selected={cat} onSelect={setCat}>
      <h1><span className="sub-label gm">논산 피부 한의원</span> 피부 프로그램</h1>
      <p>피부 고민을 고르면 맞는 프로그램과 가격을 한눈에 확인할&nbsp;수&nbsp;있습니다.</p>
    </HeroTabs>
    <section className="pl" data-aos>
      <div className="pl-concern">
        <div className="pl-q">
          <p id="pl-q">어떤 피부 고민이 있으신가요? <span>(중복 선택 가능)</span></p>
          {picked.length > 0 && <button type="button" className="pl-reset" onClick={() => setPicked([])}>초기화</button>}
        </div>
        <div className="pl-chips" role="group" aria-labelledby="pl-q">
          {CONCERNS.map((c) => (
            <button key={c} type="button" className={picked.includes(c) ? "pl-on" : ""} aria-pressed={picked.includes(c)} onClick={() => toggle(c)}>{c}</button>
          ))}
        </div>
      </div>

      <p className="pl-count" aria-live="polite">총 <b>{list.length}</b>개 프로그램</p>

      {list.length ? (
        <ul className="pl-grid">
          {list.map((p) => {
            const o = p.options[0];
            return (
              <li key={p.slug}>
                <a href={"/program/" + p.slug} className="pl-card">
                  <div className="pl-top">
                    <span className="pl-cat">{CAT[p.cat]}</span>
                  </div>
                  <div className="pl-body">
                    <h2>{p.name}</h2>
                    <p>{p.summary}</p>
                    <ul className="pl-tags">{p.concerns.map((c) => <li key={c}>#{c}</li>)}</ul>
                    <div className="pl-bottom">
                      <div className="pl-price">
                        {o.first && <span className="pl-badge">첫 방문</span>}
                        <b className="gm">{o.price}{!o.first && p.options.length > 1 && "~"}</b>
                      </div>
                      <span className="pl-more">자세히 보기 →</span>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="pl-empty">선택하신 조건에 맞는 프로그램이 없습니다.<br />다른 고민을 선택하거나 초기화해 주세요.</p>
      )}
    </section>
    </>
  );
}
