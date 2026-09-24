"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IMG, BLOG, PLACE, TEL, TEL_LINK, ADDRESS } from "./site";

const EXT = { target: "_blank", rel: "noreferrer" };

// home sections are anchors on "/", so they work from any page; the footer (#location) is on every page
const NAV = [["병원소개", "/#about"], ["통증치료", "/#pain"], ["교통사고", "/accident"], ["다이어트", "/diet"], ["피부 클리닉", "/skin"], ["시술메뉴", "/program"], ["치료장비", "/#equip"], ["오시는 길", "#location"], ["블로그", BLOG]];
const QUICK = [["홈", "/"], ["교통사고", "/accident"], ["다이어트", "/diet"], ["피부", "/skin"], ["통증", "/#pain"], ["블로그", BLOG], ["오시는 길", "#location"], ["전화", TEL_LINK]];
const CONSULT = {
  통증: ["목", "허리", "어깨", "무릎", "손목·발목", "기타"],
  교통사고: ["교통사고 후유증"],
  "추나·재활": ["추나요법", "재활·운동치료"],
  피부: ["첫 방문 체험", "슈링크 리프팅", "레이저·듀얼·트리플 토닝", "프락셀·PN 스킨부스터", "점·잡티 제거"],
  다이어트: ["한방 다이어트"],
  기타: ["비염·감기", "안면마비", "기타"],
};

// shared header, drawer, footer and consult bar around every page
export default function Chrome({ children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => document.body.classList.toggle("scr", window.scrollY > 5);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // AOS replacement: reveal once on first intersection; re-run per page
  useEffect(() => {
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target)))
    );
    document.querySelectorAll("[data-aos]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const submitConsult = (e) => {
    e.preventDefault();
    // ponytail: no backend; nothing is sent. Wire an API route (or form service) here before launch.
    alert("상담 신청이 접수되었습니다. (데모: 서버 전송 없음)");
    e.target.reset();
  };

  return (
    <>
      <header className="header">
        <div className="inner">
          <div className="logo"><a href="/"><img src={IMG + "logo.png"} alt="광명당한의원" /></a></div>
          <nav className="gnb">
            <ul>
              {NAV.map(([n, h]) => <li key={n}><a href={h} {...(h === BLOG && EXT)}>{n}</a></li>)}
            </ul>
          </nav>
          <button className="ham" onClick={() => setMenuOpen(true)} aria-label="전체메뉴 열기">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={"dim" + (menuOpen ? " on" : "")} onClick={() => setMenuOpen(false)} />
      <aside className={"all-menu" + (menuOpen ? " on" : "")}>
        <div className="all-menu-top">
          <img className="logo" src={IMG + "logo.png"} alt="광명당한의원" />
          <button className="ham-close" onClick={() => setMenuOpen(false)} aria-label="메뉴 닫기">×</button>
        </div>
        <ul>
          {NAV.map(([n, h]) => <li key={n}><a href={h} {...(h === BLOG && EXT)} onClick={() => setMenuOpen(false)}>{n}</a></li>)}
        </ul>
      </aside>

      {children}

      <nav className="quick">
        {QUICK.map(([n, h]) => <a key={n} href={h} {...(h === BLOG && EXT)}>{n}</a>)}
      </nav>

      <footer id="location" className="footer">
        <iframe
          className="map"
          title="오시는 길"
          loading="lazy"
          src="https://maps.google.com/maps?output=embed&z=17&q=36.1553892,127.0156908"
        />
        <div className="info">
          <div className="info-box">
            <h2 className="gm">Location</h2>
            <p>{ADDRESS}</p>
            <p>지번 : 강경읍 대흥리 32-120</p>
            <a className="map-link" href={PLACE} {...EXT}>네이버 지도에서 보기 →</a>
          </div>
          <div className="info-box">
            <h2 className="gm">Treatment Time</h2>
            <dl>
              <dt>월·수·금</dt><dd>08:30 - 20:00 (야간진료)</dd>
              <dt>화·목</dt><dd>08:30 - 18:00</dd>
              <dt>토요일</dt><dd>08:30 - 13:00</dd>
              <dt>점심시간</dt><dd>12:30 - 14:00</dd>
              <dt>일요일·공휴일</dt><dd>휴진</dd>
            </dl>
            <p className="note">추나·체외충격파·고주파 치료는 예약제로 운영합니다.</p>
          </div>
          <div className="info-box">
            <dl>
              <dt>대표자</dt><dd>남인우</dd>
              <dt>상호</dt><dd>광명당한의원</dd>
              <dt>사업자등록번호</dt><dd>000-00-00000</dd>
            </dl>
          </div>
          <div className="info-box last">
            <h2 className="gm">Counsel</h2>
            <a className="gm tel" href={TEL_LINK}>{TEL}</a>
          </div>
          <button className="prv-btn" onClick={() => document.getElementById("privacy").showModal()}>개인정보처리방침</button>
        </div>
      </footer>

      <dialog id="privacy" className="privacy" onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}>
        <div>
          <form method="dialog"><button aria-label="닫기">×</button></form>
          <h3>개인정보처리방침</h3>
          <p>광명당한의원 개인정보처리방침 내용을 입력하세요.</p>
        </div>
      </dialog>

      <div className={"consult" + (consultOpen ? " open" : "")}>
        <button className="consult-toggle" onClick={() => setConsultOpen(!consultOpen)}>
          {consultOpen ? "닫기" : "빠른상담문의"}
        </button>
        <form className="inner" onSubmit={submitConsult}>
          <img className="consult-logo" src={IMG + "logo-white.png"} alt="" />
          <div className="consult-fields">
            <div className="consult-inputs">
              <input name="name" placeholder="이름" required maxLength={30} />
              <input name="tel" type="tel" placeholder="연락처" required maxLength={14} />
              <select name="item" required defaultValue="">
                <option value="" disabled hidden>상담항목</option>
                {Object.entries(CONSULT).map(([group, opts]) => (
                  <optgroup key={group} label={group}>
                    {opts.map((o) => <option key={o} value={`${group}-${o}`}>{o}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="consult-agree">
              <label><input type="checkbox" required /> 개인정보 취급방침 동의</label>
              <label><input type="checkbox" required /> SMS 수신 동의</label>
            </div>
          </div>
          <div className="consult-btns">
            <button type="submit">상담신청</button>
            <a className="call" href={TEL_LINK}>전화 상담</a>
            <a className="blog" href={BLOG} {...EXT}>블로그</a>
          </div>
        </form>
      </div>
    </>
  );
}
