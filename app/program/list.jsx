"use client";
import { useState } from "react";
import { CATEGORIES, CONCERNS, PROGRAMS } from "../programs";

const CAT = Object.fromEntries(CATEGORIES);
const TABS = [["all", "전체"], ...CATEGORIES];

// no data-aos on cards: the reveal observer only runs once per route, so cards re-mounted by filtering would stay hidden
export default function ProgramList() {
  const [cat, setCat] = useState("all");
  const [picked, setPicked] = useState([]);
  const toggle = (c) => setPicked((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const list = PROGRAMS.filter((p) => (cat === "all" || p.cat === cat) && (!picked.length || p.concerns.some((c) => picked.includes(c))));

  return (
    <section className="pl" data-aos>
      <ul className="pl-cats">
        {TABS.map(([id, t]) => (
          <li key={id}>
            <button type="button" className={cat === id ? "pl-on" : ""} aria-pressed={cat === id} onClick={() => setCat(id)}>{t}</button>
          </li>
        ))}
      </ul>

      <div className="pl-concern">
        <div className="pl-q">
          <p id="pl-q">어떤 변화가 필요하신가요? <span>(중복 선택 가능)</span></p>
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
                <a href={"/program/" + p.slug} className={"pl-card" + (PROGRAMS.indexOf(p) % 2 ? " pl-dark" : "")}>
                  <div className="pl-top">
                    <span className="pl-cat">{CAT[p.cat]}</span>
                    <b className="gm">{p.en}</b>
                  </div>
                  <div className="pl-body">
                    <h2>{p.name}</h2>
                    <p>{p.summary}</p>
                    <ul className="pl-tags">{p.concerns.map((c) => <li key={c}>#{c}</li>)}</ul>
                    <div className="pl-bottom">
                      <div className="pl-price">
                        {o.first && <span className="pl-badge">첫 방문</span>}
                        <b className="gm">{o.price}{!o.first && "~"}</b>
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
  );
}
