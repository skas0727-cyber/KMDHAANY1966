"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { IMG, BLOG, PLACE } from "./site";
import { CATEGORIES, PROGRAMS } from "./programs";
import Faq from "./faq";
import "./home.css";

// section order + measurements follow the reference home (card hero → tabbed price → magazine → card carousel → greeting → special);
// all copy and photos are the clinic's own. Title strings use \n for line breaks (white-space: pre-line).
const CARDS: [string, string, string][] = [
  ["backpain.jpg", "교통사고\n후유증 치료", "/accident"],
  ["herbs.jpg", "체질 맞춤\n한방 다이어트", "/diet"],
  ["skin/hero-model.jpg", "피부\n클리닉", "/skin"],
  ["room-spine.jpg", "추나요법\n척추·관절", "#pain"],
  ["needle.jpg", "침·약침\n통증 치료", "#pain"],
  ["ulforce.jpg", "체외충격파\n고주파 치료", "#pain"],
  ["exterior.jpg", "SINCE 1966\n3대째 한의원", "#story"],
  ["lobby.jpg", "오시는 길\n진료시간", "#location"],
];
// [image, title, text, link?]
type Slide = [string, string, string, string?];
const STORY: [string, Slide[]][] = [
  ["병원 소개", [
    ["exterior.jpg", "SINCE 1966, 3대째 이어온 한의원", "1966년 강경에서 문을 연 광명당한약방이 할아버지 남주희 원장에서 손자 남인우 원장으로 이어지며, 3대째 지역 주민의 건강을 살피고 있습니다."],
    ["lobby.jpg", "전통 한의학에 현대 진단을 더하다", "오랜 전통 한의학에 초음파 진단과 현대 치료 장비를 더해, 한 분 한 분의 체질과 상태에 맞춘 진료를 합니다."],
    ["ultrasound1.jpg", "대표원장 남인우", "통증 부위를 초음파로 직접 보며 상태를 확인하고, 그에 맞는 치료를 설명해 드립니다."],
  ]],
  ["블로그", [["rafos-use.jpg", "광명당한의원 블로그", "진료 이야기와 생활 속 건강 정보를 네이버 블로그에서 전해 드립니다.", BLOG]]],
  ["플레이스", [["lobby2.jpg", "네이버 플레이스", "진료시간, 길찾기, 방문자 리뷰를 네이버 플레이스에서 확인하세요.", PLACE]]],
];
const TREAT: [string, Slide[]][] = [
  ["통증 치료", [
    ["needle.jpg", "침·약침", "통증 부위의 긴장을 풀고 순환을 도와 통증 완화를 돕습니다."],
    ["room-spine.jpg", "추나요법", "틀어진 척추·관절의 균형 회복을 돕는 한방 수기 치료입니다."],
    ["room-healing.jpg", "재활·운동치료", "약해진 근육과 움직임을 되찾도록 운동 치료를 함께 합니다."],
    ["rafos-use.jpg", "한방물리요법", "온열·전기 자극 등으로 뭉친 근육의 긴장 완화를 돕습니다."],
  ]],
  ["교통사고", [
    ["backpain.jpg", "교통사고 후유증", "전 보험사 자동차보험 적용, 본인부담금 0원으로 치료합니다.", "/accident"],
    ["room-spine.jpg", "사고 후 추나요법", "사고 충격으로 틀어진 척추·관절의 균형 회복을 돕습니다.", "/accident"],
    ["herbs.jpg", "사고 한약", "사고로 생긴 어혈을 풀고 회복을 돕는 한약을 체질에 맞춰 처방합니다.", "/accident"],
  ]],
  ["특화 진료", [
    ["herbs.jpg", "한방 다이어트", "체질과 비만 유형에 맞춘 처방", "/diet"],
    ["skin/hero-model.jpg", "피부 클리닉", "슈링크 리프팅·레이저 토닝·점 제거", "/skin"],
    ["rhinitis.jpg", "비염·감기·안면마비", "면역과 순환을 돕는 한방내과 진료"],
  ]],
  ["치료 장비", [
    ["ultrasound2.jpg", "초음파 진단", "통증 부위를 직접 보며 상태를 확인합니다."],
    ["rafos.jpg", "고주파 심부열 (RAFOS)", "깊은 곳까지 열을 전달해 뭉친 근육의 이완을 돕습니다."],
    ["ulforce.jpg", "체외충격파 (울포스)", "충격파로 만성 힘줄·근육 통증 관리를 돕습니다."],
  ]],
];
const SPECIAL: [string, string, ReactNode, string, string][] = [
  ["exterior.jpg", "3대째 이어온 한의원", <>1966년 강경의 한약방에서 시작해<br /><strong>3대째 지역 주민의 건강</strong>을 살피고 있습니다.</>, "병원 이야기 보기", "#story"],
  ["ultrasound2.jpg", "보면서 하는 진료", <>통증 부위를 <strong>초음파로 직접 보며</strong><br />상태를 확인하고 치료합니다.</>, "치료 장비 보기", "#pain"],
  ["rafos-use.jpg", "치료 장비 보유", <><strong>고주파 심부열·체외충격파</strong> 장비로<br />깊은 곳의 통증까지 관리합니다.</>, "통증 치료 보기", "#pain"],
  ["lobby2.jpg", "자동차보험 협약 의료기관", <>전 보험사 자동차보험이 적용되어<br /><strong>본인부담금 0원</strong>으로 치료받을 수 있습니다.</>, "교통사고 치료 보기", "/accident"],
];
const FAQ = [
  ["논산 광명당한의원은 어디에 있나요?", "충남 논산시 강경읍 대흥로6번길 9(지번 강경읍 대흥리 32-120)에 있습니다. 네이버 지도에서 '광명당한의원'을 검색하면 길찾기를 할 수 있습니다."],
  ["진료시간은 어떻게 되나요?", "월·수·금 08:30~20:00(야간진료), 화·목 08:30~18:00, 토요일 08:30~13:00입니다. 점심시간은 12:30~14:00이며 일요일과 공휴일은 휴진합니다."],
  ["예약하고 가야 하나요?", "추나요법·체외충격파·고주파 치료는 예약제로 운영합니다. 그 외 진료는 예약 없이 내원하셔도 됩니다. 문의는 041-745-2141로 해 주세요."],
  ["어떤 진료를 하나요?", "침·약침, 추나요법, 재활·운동치료, 교통사고 후유증, 한방 다이어트, 피부 관리(슈링크 리프팅·레이저 토닝·점 제거), 비염·감기·안면마비 같은 한방내과 진료를 합니다."],
  ["교통사고 치료도 받을 수 있나요?", "네. 자동차보험 협약 의료기관이라 전 보험사 자동차보험이 적용되며, 본인부담금 없이 치료받을 수 있습니다. 과실 비율과 가입한 보험 조건에 따라 보험 처리 범위가 달라질 수 있어 내원 시 안내해 드립니다."],
];

const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const mod = (a: number, n: number) => ((a % n) + n) % n;

// runs `next` after `ms` whenever `dep` changes (autoplay); off while paused or with reduced motion
function useAuto(ms: number, next: () => void, dep: unknown, paused = false) {
  useEffect(() => {
    if (paused || still()) return;
    const t = setTimeout(next, ms);
    return () => clearTimeout(t);
  }, [dep, paused]); // eslint-disable-line react-hooks/exhaustive-deps
}

function Head({ title, sub, cls = "" }: { title: string; sub: ReactNode; cls?: string }) {
  return (
    <div className={"hs-head " + cls}>
      <h2 className="gm">{title}</h2>
      <p>{sub}</p>
    </div>
  );
}

// loop carousel (reference: 3 per view + 15% side peek, center focus, 30px gap, 700ms, autoplay 4s): list is tripled and
// the index snaps back into the middle copy after each move, so it never runs out of slides
function Hero() {
  const n = CARDS.length;
  const [i, setI] = useState(n);
  const [anim, setAnim] = useState(true);
  const [hold, setHold] = useState(false);
  const x0 = useRef<number | null>(null);
  const dragged = useRef(false);
  useAuto(4000, () => setI(i + 1), i, hold);
  useEffect(() => {
    if (anim) return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    return () => cancelAnimationFrame(r);
  }, [anim]);
  const settle = () => { if (i < n || i >= 2 * n) { setAnim(false); setI(mod(i, n) + n); } };

  return (
    <section className="hc" aria-label="주요 진료 바로가기" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <ul
        className={"hc-list" + (anim ? "" : " no-anim")}
        style={{ "--i": i } as CSSProperties}
        onTransitionEnd={(e) => e.target === e.currentTarget && settle()}
        onPointerDown={(e) => { x0.current = e.clientX; dragged.current = false; }}
        onPointerUp={(e) => {
          if (x0.current === null) return;
          const dx = e.clientX - x0.current;
          x0.current = null;
          if (Math.abs(dx) > 40) { dragged.current = true; setI(i + (dx < 0 ? 1 : -1)); }
        }}
        onClickCapture={(e) => dragged.current && (e.preventDefault(), (dragged.current = false))}
      >
        {[0, 1, 2].flatMap((copy) => CARDS.map(([img, title, href], k) => {
          const idx = copy * n + k, d = Math.abs(idx - i), clone = copy !== 1;
          return (
            <li key={idx} className={d === 0 ? "on" : d === 1 ? "near" : undefined} aria-hidden={clone || undefined}>
              <a href={href} tabIndex={clone ? -1 : undefined} draggable={false}>
                <img src={IMG + img} alt="" draggable={false} />
                <div><p className="hc-t">{title}</p><p className="hc-d">바로가기 &gt;</p></div>
              </a>
            </li>
          );
        }))}
      </ul>
      <div className="hc-dots">
        {CARDS.map(([, title], k) => <button key={k} className={mod(i, n) === k ? "on" : undefined} onClick={() => setI(n + k)} aria-label={title.replace("\n", " ")} />)}
      </div>
    </section>
  );
}

// reference "Ranking" block: underline tabs, image card with overlay, 5-row priced list paged with dots
function Price() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const progs = PROGRAMS.filter((p) => p.cat === CATEGORIES[tab][0]);
  const rows = progs.flatMap((p) => p.options);
  const pages = Math.ceil(rows.length / 5);

  return (
    <section className="hs pr">
      <Head title="Skin Price" sub="광명당 피부 클리닉 시술 가격을 확인해 보세요 (VAT 별도)" />
      <div className="pr-tabs" role="tablist">
        {CATEGORIES.map(([id, name], k) => (
          <button key={id} role="tab" aria-selected={k === tab} className={k === tab ? "on" : undefined} onClick={() => { setTab(k); setPage(0); }}>{name}</button>
        ))}
      </div>
      <div className="pr-body" key={tab}>
        <a className="pr-main" href={`/program/${progs[0].slug}`}>
          <img src={IMG + "skin/hero-model.jpg"} alt="" loading="lazy" />
          <div className="pr-overlay">
            <strong>{CATEGORIES[tab][1]}</strong>
            <p>{progs[0].summary}</p>
            <span className="pr-btn">시술 자세히 보기 <span>→</span></span>
          </div>
        </a>
        <div className="pr-card">
          <div className="pr-frame">
            <div className="pr-track" style={{ transform: `translateX(-${page * 100}%)` }}>
              {Array.from({ length: pages }, (_, pg) => (
                <ul key={pg} className="pr-list" inert={pg !== page}>
                  {rows.slice(pg * 5, pg * 5 + 5).map((o, k) => {
                    const no = pg * 5 + k + 1;
                    return (
                      <li key={k}>
                        <div className="pr-left">
                          <span className={"pr-num" + (no <= 3 ? " top" : "")}>{no}</span>
                          <span className="pr-name">{o.name} <em>{o.spec}</em></span>
                        </div>
                        <div className="pr-price">{o.orig && <del>{o.orig}</del>}<b>{o.price}</b></div>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
          {pages > 1 && (
            <div className="pr-dots">
              {Array.from({ length: pages }, (_, k) => <button key={k} className={k === page ? "on" : undefined} onClick={() => setPage(k)} aria-label={`${k + 1}페이지`} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// reference "Magazine" block: pill tabs, wide rounded slider with round arrows, title + text under the image
function Story() {
  const [tab, setTab] = useState(0);
  const [i, setI] = useState(0);
  const slides = STORY[tab][1];
  const [, title, text] = slides[i];
  const go = (d: number) => setI(mod(i + d, slides.length));

  return (
    <section id="story" className="hs st">
      <Head title="Clinic Story" sub="광명당한의원의 이야기를 만나보세요" />
      <div className="st-tabs">
        {STORY.map(([name], k) => <button key={name} className={k === tab ? "on" : undefined} onClick={() => { setTab(k); setI(0); }}>{name}</button>)}
      </div>
      <div className="st-body" key={tab}>
        <div className="st-slider">
          {slides.length > 1 && <button className="st-arrow prev" onClick={() => go(-1)} aria-label="이전"><span>&lt;</span></button>}
          <div className="st-frame">
            <div className="st-track" style={{ transform: `translateX(-${i * 100}%)` }}>
              {slides.map(([img, t, , href]) => (
                <div key={t} className="st-slide">
                  {href ? <a href={href} target="_blank" rel="noreferrer"><img src={IMG + img} alt={t} loading="lazy" /></a> : <img src={IMG + img} alt={t} loading="lazy" />}
                </div>
              ))}
            </div>
          </div>
          {slides.length > 1 && <button className="st-arrow next" onClick={() => go(1)} aria-label="다음"><span>&gt;</span></button>}
        </div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </section>
  );
}

// reference "Best Procedure" block: category pill (select on mobile), center-focused cards (active 1, others .92 + dim), arrows, progress bar
function Treat() {
  const [tab, setTab] = useState(0);
  const cards = TREAT[tab][1];
  const [i, setI] = useState(1);
  const pick = (k: number) => { setTab(k); setI(Math.min(1, TREAT[k][1].length - 1)); };

  return (
    <section id="pain" className="hs tr">
      <Head title="Best Treatment" sub="광명당한의원이 집중하는 진료" />
      <div className="tr-top">
        <div className="tr-tabs">
          {TREAT.map(([name], k) => <button key={name} className={k === tab ? "on" : undefined} onClick={() => pick(k)}>{name}</button>)}
        </div>
        <select className="tr-select" value={tab} onChange={(e) => pick(+e.target.value)} aria-label="진료 분류">
          {TREAT.map(([name], k) => <option key={name} value={k}>{name}</option>)}
        </select>
      </div>
      <div className="tr-slider">
        <button className="tr-arrow prev" disabled={i === 0} onClick={() => setI(i - 1)} aria-label="이전">&lt;</button>
        <div className="tr-frame">
          <div className="tr-track" key={tab} style={{ "--i": i } as CSSProperties}>
            {cards.map(([img, name, desc, href], k) => {
              const body = (
                <>
                  <div className="tr-img"><img src={IMG + img} alt={name} loading="lazy" /></div>
                  <div className="tr-info"><b>{name}</b><p>{desc}</p></div>
                </>
              );
              return (
                <div key={name} className={"tr-card" + (k === i ? " on" : "")} onClick={(e) => k !== i && (e.preventDefault(), setI(k))}>
                  {href ? <a href={href}>{body}</a> : body}
                </div>
              );
            })}
          </div>
        </div>
        <button className="tr-arrow next" disabled={i === cards.length - 1} onClick={() => setI(i + 1)} aria-label="다음">&gt;</button>
      </div>
      <div className="tr-progress"><span style={{ width: `${((i + 1) / cards.length) * 100}%` }} /></div>
    </section>
  );
}

// greeting banner: 3-line statement + clinic name, two director photo slots on the right
// [photo file (empty = placeholder until the photo arrives), title, name]
const DOCTORS: [string, string, string][] = [
  ["ultrasound1.jpg", "대표원장", "남인우"],
  ["", "원장", "OOO"], // TODO: second director's photo + name
];
function Greeting() {
  return (
    <section className="bn">
      <div className="bn-inner">
        <div>
          <h1 className="bn-title">1966년 강경 광명당한약방에서 시작해<br /><span>3대째</span> 지역의 건강을 살펴 온<br />논산 강경 한의원입니다.</h1>
          <p className="bn-branch">광명당한의원</p>
          <p className="bn-name">{DOCTORS.map(([, t, n]) => `${n} ${t}`).join(" · ")}</p>
        </div>
        <div className="bn-imgs">
          {DOCTORS.map(([img, title, name]) => (
            <figure key={name}>
              {img ? <img src={IMG + img} alt={`${title} ${name}`} loading="lazy" /> : <div className="bn-ph">원장 사진</div>}
              <figcaption><span>{title}</span> {name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// reference "Special" block: fade slider (300ms, autoplay 3.5s, loop) with a floating text box carrying the bullets
function Special() {
  const [i, setI] = useState(0);
  useAuto(3500, () => setI((i + 1) % SPECIAL.length), i);

  return (
    <section className="hs sp">
      <Head cls="blue" title="Gwangmyeongdang Special" sub={<>오래 믿고 찾을 수 있는 한의원을 위한 <b>광명당만의 특별함</b></>} />
      <div className="sp-slider">
        {SPECIAL.map(([img, title, text, more, href], k) => (
          <div key={title} className={"sp-slide" + (k === i ? " on" : "")} inert={k !== i}>
            <img src={IMG + img} alt="" loading="lazy" />
            <div className="sp-box">
              <div className="sp-dots">
                {SPECIAL.map(([, t], b) => <button key={t} className={b === i ? "on" : undefined} onClick={() => setI(b)} aria-label={t} />)}
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <a className="sp-more" href={href}>
                <span>{more}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="10 8 14 12 10 16" /></svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <Price />
      <Story />
      <Treat />
      <Greeting />
      <Special />
      <Faq items={FAQ} />
    </main>
  );
}
