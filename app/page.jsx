"use client";
import { useEffect, useState } from "react";
import { IMG, BLOG, PLACE } from "./site";
import Faq from "./faq";

const HERO = [["lobby.jpg", "광명당한의원 대기실"], ["room-spine.jpg", "광명당한의원 추나 치료실"], ["exterior.jpg", "논산 강경 광명당한의원 외관"]];
const FEATURES = [
  { cls: "f1", img: "logo.png", left: true, txt: <>1966년부터 <br className="mo" /><b>3대째 이어온 한의원</b></> },
  { cls: "f2", img: "ultrasound2.jpg", txt: <>초음파로 직접 보고 <br className="mo" /><b>정확하게 치료</b></> },
  { cls: "f3", img: "rafos-use.jpg", left: true, txt: <>고주파 심부열·체외충격파 <br className="mo" /><b>치료 장비 보유</b></> },
  { cls: "f4", img: "lobby2.jpg", txt: <>자동차보험 협약 의료기관 <br className="mo" /><b>본인부담금 0원</b></> },
];
const PAIN = [["needle.jpg", "침·약침", "#location"], ["room-spine.jpg", "추나요법", "#location"], ["room-healing.jpg", "재활·운동치료", "#location"]];
const SPECIAL = [
  ["backpain.jpg", "교통사고 후유증", "본인부담금 0원", "전 보험사 자동차보험 적용 · 사고 후 바로 내원", "/accident"],
  ["herbs.jpg", "한방 다이어트", "맞춤 한약", "체질과 비만 유형에 맞춘 처방", "/diet"],
  ["rhinitis.jpg", "비염·감기·안면마비", "내과 진료", "면역과 순환을 돕는 한방 치료", "#location"],
];
const EQUIP = [["ultrasound2.jpg", "초음파 진단", "#location"], ["rafos.jpg", "고주파 심부열 (RAFOS)", "#location"], ["ulforce.jpg", "체외충격파 (울포스)", "#location"]];
const FAQ = [
  ["논산 광명당한의원은 어디에 있나요?", "충남 논산시 강경읍 대흥로6번길 9(지번 강경읍 대흥리 32-120)에 있습니다. 네이버 지도에서 '광명당한의원'을 검색하면 길찾기를 할 수 있습니다."],
  ["진료시간은 어떻게 되나요?", "월·수·금 08:30~20:00(야간진료), 화·목 08:30~18:00, 토요일 08:30~13:00입니다. 점심시간은 12:30~14:00이며 일요일과 공휴일은 휴진합니다."],
  ["예약하고 가야 하나요?", "추나요법·체외충격파·고주파 치료는 예약제로 운영합니다. 그 외 진료는 예약 없이 내원하셔도 됩니다. 문의는 041-745-2141로 해 주세요."],
  ["어떤 진료를 하나요?", "침·약침, 추나요법, 재활·운동치료, 교통사고 후유증, 한방 다이어트, 피부 관리(슈링크 리프팅·레이저 토닝·점 제거), 비염·감기·안면마비 같은 내과 진료를 합니다."],
  ["교통사고 치료도 받을 수 있나요?", "네. 자동차보험 협약 의료기관이라 전 보험사 자동차보험이 적용되며, 본인부담금 없이 치료받을 수 있습니다."],
];

function useSlider(count, delay) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setI((i + 1) % count), delay);
    return () => clearTimeout(t);
  }, [i, count, delay]);
  return [i, setI];
}

function CardList({ id, title, sub, items }) {
  return (
    <section id={id} className="sec cards">
      <div className="sec-tit" data-aos>
        <p>{sub}</p>
        <h2 className="gm">{title}</h2>
      </div>
      <ul className="card-list" data-aos>
        {items.map(([img, name, href]) => (
          <li key={name}>
            <a href={href}>
              <div className="thumb"><img src={IMG + img} alt={name} /></div>
              <p>{name}<span>→</span></p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  const [hero, setHero] = useSlider(HERO.length, 5000);

  return (
    <main>
      <section className="hero">
        {HERO.map(([src, alt], k) => (
          <div key={src} className={"slide" + (k === hero ? " on" : "")}>
            <img src={IMG + src} alt={alt} />
          </div>
        ))}
        <div className="inner hero-txt">
          <h1 className="gm">3대를 이어온 정성,<br className="mo" /> 논산 광명당한의원</h1>
          <p>SINCE 1966 · 논산 강경 한의원</p>
        </div>
        <div className="inner hero-dots">
          {HERO.map(([src], k) => <button key={src} className={k === hero ? "on" : ""} onClick={() => setHero(k)} aria-label={`${k + 1}번 슬라이드`} />)}
        </div>
      </section>

      <section id="about" className="sec about">
        <div className="about-inner">
          <img src={IMG + "exterior.jpg"} alt="논산 강경 광명당한의원 외관" />
          <div className="about-txt" data-aos>
            <h2 className="gm">SINCE 1966</h2>
            <p>1966년 강경에서 문을 연 광명당한약방이 할아버지 남주희 원장에서 손자 남인우 원장으로 이어지며, 3대째 지역 주민의 건강을 살피는 한의원이 되었습니다.</p>
            <p>오랜 전통 한의학에 초음파 진단과 현대 치료 장비를 더해, 한 분 한 분의 체질과 상태에 맞춘 진료를 하고 있습니다.</p>
          </div>
        </div>
      </section>

      <section className="doctor inner">
        <h2 data-aos="zoom">광명당한의원 <br /><b>대표원장 남인우</b></h2>
        <img src={IMG + "ultrasound1.jpg"} alt="남인우 대표원장 초음파 진단" />
      </section>

      <section className="features">
        {FEATURES.map((f) => (
          <div key={f.cls} className={"feature " + f.cls}>
            <div className="inner">
              <p data-aos="zoom" className={f.left ? "right" : ""}>{f.txt}</p>
              <img className={f.left ? "left" : "right"} src={IMG + f.img} alt="" />
            </div>
          </div>
        ))}
      </section>

      <CardList id="pain" sub="아픈 원인부터 바로잡고 싶다면?" title="통증 치료" items={PAIN} />

      <section id="special" className="sec skin inner">
        <div className="sec-tit" data-aos>
          <p>생활 속 불편함까지</p>
          <h2 className="gm">특화 진료</h2>
        </div>
        <ul className="skin-list" data-aos>
          {SPECIAL.map(([img, name, tag, desc, href]) => (
            <li key={name}>
              <a href={href}>
                <div className="thumb"><img src={IMG + img} alt={name} /></div>
                <div className="skin-txt">
                  <div><h3>{name}</h3><p className="gm">{tag}</p></div>
                  <p>{desc}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <CardList id="equip" sub="통증의 깊은 곳까지" title="치료 장비" items={EQUIP} />

      <Faq items={FAQ} />

      <section className="sns">
        <ul className="inner">
          <li><h3 className="gm">BLOG</h3><a href={BLOG} target="_blank" rel="noreferrer">바로가기</a></li>
          <li><h3 className="gm">PLACE</h3><a href={PLACE} target="_blank" rel="noreferrer">바로가기</a></li>
        </ul>
      </section>
    </main>
  );
}
