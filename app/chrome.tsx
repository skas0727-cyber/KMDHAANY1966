"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import "./chrome.css";
import { BLOG, PLACE, KAKAO_CHANNEL, KAKAO_PLACE, TEL, TEL_LINK, ADDRESS, KAKAO_JS_KEY } from "./site";

const EXT = { target: "_blank", rel: "noreferrer" };
declare global {
  interface Window { kakao: any }
}

// Kakao static map (from Kakao Map 내보내기 → HTML 태그 복사; no key or domain needed), centered on the clinic (WCONGNAMUL x/y)
const KAKAO_STATIC = "https://staticmap.kakao.com/map/mapservice?FORMAT=PNG&SCALE=2.5&MX=503530&MY=738217&S=0&IW=640&IH=480&LANG=0&COORDSTM=WCONGNAMUL&logo=kakao_logo";

// menu bar = real pages only (no in-page section jumps)
const NAV = [["교통사고", "/accident"], ["다이어트", "/diet"], ["피부 클리닉", "/skin"], ["피부 시술", "/program"], ["한약과 치료", "/treatment"], ["블로그", BLOG]];
const CONSULT = {
  통증: ["목", "허리", "어깨", "무릎", "손목과 발목", "기타"],
  교통사고: ["교통사고 후유증"],
  "추나와 재활": ["추나요법", "재활과 운동치료"],
  피부: ["첫 방문 체험", "슈링크 리프팅", "레이저, 듀얼, 트리플 토닝", "프락셀, PN 스킨부스터", "점과 잡티 제거"],
  다이어트: ["한방 다이어트"],
  한약: ["보약", "치료약"],
  기타: ["비염과 감기", "안면마비", "기타"],
};

// tiny original inline line icons (stroke currentColor) -- no reference-site icons/logos reused
const Svg = ({ w = 1.8, children }: { w?: number; children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IconPhone = () => <Svg><path d="M5 4h3.3l1.3 4.1-2.1 1.7a12.4 12.4 0 0 0 6.7 6.7l1.7-2.1L20 15.7V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></Svg>;
const IconPin = () => <Svg><path d="M12 21.5S5.5 14.8 5.5 9.8a6.5 6.5 0 0 1 13 0c0 5-6.5 11.7-6.5 11.7Z" /><circle cx="12" cy="9.6" r="2.4" /></Svg>;
const IconMap = () => <Svg><path d="M9 4 3.8 5.9v14L9 18l6 2 5.2-1.9v-14L14 6 9 4Z" /><path d="M9 4v14M14 6v14" /></Svg>;
const IconEdit = () => <Svg><path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0-3-3L5.2 16.8 4 20Z" /><path d="M13.3 7.9l2.8 2.8" /></Svg>;
const IconChat = () => <Svg><path d="M4.5 4.5h15v11.4H9.6L4.5 20V4.5Z" /></Svg>;
const IconChevron = () => <Svg w={2.2}><path d="M6 15l6-6 6 6" /></Svg>;

// shared header, drawer, footer and consult bar around every page
export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [mapFailed, setMapFailed] = useState(false); // SDK rejected (domain not registered in Kakao Developers) → static map
  const formRef = useRef<HTMLDialogElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuFirst = useRef(true);

  const drawMap = () =>
    window.kakao.maps.load(() => {
      const { maps } = window.kakao;
      const pos = new maps.LatLng(36.15538902, 127.01569125);
      const map = new maps.Map(mapRef.current, { center: pos, level: 3, scrollwheel: false });
      const marker = new maps.Marker({ position: pos, map });
      new maps.InfoWindow({ content: '<div style="padding:6px 12px;font-size:13px;font-weight:600;white-space:nowrap">광명당한의원</div>' }).open(map, marker);
    });

  // header hides while scrolling down past 120px and comes back on the way up (reference behavior)
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // full-screen menu: focus its close button on open, return focus to the burger on close (scroll lock is CSS-only, see chrome.css)
  useEffect(() => {
    if (menuFirst.current) { menuFirst.current = false; return; }
    (menuOpen ? closeRef : burgerRef).current?.focus();
  }, [menuOpen]);

  // AOS replacement: reveal once on first intersection; re-run per page
  useEffect(() => {
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target)))
    );
    document.querySelectorAll("[data-aos]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Esc closes whichever overlay is open (drawer or consult panel)
  useEffect(() => {
    if (!menuOpen && !consultOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setMenuOpen(false), setConsultOpen(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, consultOpen]);

  // POST to /api/inquiries (validated + stored server-side; admin reviews at /admin)
  const submitConsult = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setSending(true);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: f.get("name"), phone: f.get("tel"), item: f.get("item"), privacy: f.get("privacy") === "on", sms: f.get("sms") === "on", company: f.get("company") }),
    }).catch(() => null);
    setSending(false);
    if (res?.ok) {
      alert("상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.");
      form.reset();
      formRef.current?.close();
    } else {
      const err = await res?.json().then((d) => d.error as string, () => null);
      alert(`${(err ?? "접수하지 못했습니다").replace(/\.$/, "")}. 전화(${TEL})로도 문의하실\u00A0수\u00A0있습니다.`);
    }
  };

  // admin pages render bare (no public header/footer/consult bar)
  if (pathname.startsWith("/admin")) return <>{children}</>;

  // internal routes match the current page or any of its sub-paths; "/" only matches the home page itself
  const current = (h: string) => (h.startsWith("/") && (h === "/" ? pathname === "/" : pathname.startsWith(h))) ? "page" : undefined;

  return (
    <>
      {/* pill header: logo left, white rounded bar right (CTA, page links, burger); burger opens the full-screen menu */}
      <header className={"hd" + (hidden && !menuOpen ? " is-hidden" : "") + (menuOpen ? " is-open" : "")}>
        <a className="hd-logo" href="/"><img src="/img/logo.png" alt="광명당한의원" /></a>
        <nav className="hd-bar" inert={menuOpen} aria-label="주 메뉴">
          <a className="hd-cta" href={KAKAO_CHANNEL} {...EXT}>카카오톡 상담</a>
          <div className="hd-tools">
            <ul className="hd-links">
              {NAV.map(([n, h]) => (
                <li key={n}><a href={h} aria-current={current(h)} {...(h === BLOG && EXT)}>{n}</a></li>
              ))}
            </ul>
            <button type="button" ref={burgerRef} className="hd-burger" onClick={() => setMenuOpen(true)} aria-label="전체메뉴 열기" aria-expanded={menuOpen} aria-controls="hd-menu">
              <span /><span />
            </button>
          </div>
        </nav>
      </header>

      <div id="hd-menu" className={"mn" + (menuOpen ? " is-open" : "")} role="dialog" aria-modal="true" aria-label="전체메뉴" inert={!menuOpen}>
        <div className="mn-left"><img src="/img/lobby-wide.jpg" alt="" loading="lazy" /></div>
        <div className="mn-right">
          <button type="button" ref={closeRef} className="mn-close" onClick={() => setMenuOpen(false)} aria-label="메뉴 닫기">
            <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><line x1="6" y1="6" x2="30" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="30" y1="6" x2="6" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <nav className="mn-nav" aria-label="전체메뉴">
            <ul>
              {NAV.map(([n, h], k) => (
                <li key={n} style={{ "--k": k } as React.CSSProperties}>
                  <a className="mn-link" href={h} aria-current={current(h)} {...(h === BLOG && EXT)} onClick={() => setMenuOpen(false)}>{n}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {children}

      {/* vertical icon strip (reference: right edge, vertically centered, 42px icons) */}
      <nav className="qk" aria-label="빠른 메뉴">
        <a href={KAKAO_CHANNEL} {...EXT} aria-label="카카오톡 상담" title="카카오톡 상담"><IconChat /></a>
        <a href={TEL_LINK} aria-label={`전화 ${TEL}`} title="전화 상담"><IconPhone /></a>
        <a href={BLOG} {...EXT} aria-label="네이버 블로그" title="블로그"><IconEdit /></a>
        <a href={PLACE} {...EXT} aria-label="네이버 플레이스" title="네이버 플레이스"><IconPin /></a>
        <a href="#location" aria-label="오시는 길" title="오시는 길"><IconMap /></a>
      </nav>

      <footer id="location" className="ft-footer">
        <section className="ft-loc">
          <h2 className="ft-title">광명당한의원 <span>논산 강경</span></h2>
          <div className="ft-wrap">
            <div className="ft-map-box">
              <Script src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`} onReady={drawMap} onError={() => setMapFailed(true)} />
              {mapFailed ? (
                <a className="ft-map ft-map-static" href={KAKAO_PLACE} {...EXT} aria-label="카카오맵에서 광명당한의원 위치 보기">
                  <img src={KAKAO_STATIC} alt={`광명당한의원 주변 지도 (${ADDRESS})`} loading="lazy" />
                  <span className="ft-pin"><b>광명당한의원</b><IconPin /></span>
                </a>
              ) : (
                <div ref={mapRef} className="ft-map" role="region" aria-label="광명당한의원 위치 카카오맵" />
              )}
            </div>
            <div className="ft-info">
              <h3>오시는 길</h3>
              <p className="ft-address">{ADDRESS}<br /><strong>지번 강경읍 대흥리 32-120</strong></p>
              <div className="ft-btns">
                <a className="ft-btn" href={PLACE} {...EXT}><IconPin />네이버 지도 길찾기</a>
                <a className="ft-btn dark" href={KAKAO_PLACE} {...EXT}>카카오맵 보기</a>
              </div>
              <h3>진료시간</h3>
              <dl className="ft-time">
                <dt>월, 수, 금</dt><dd>08:30~20:00</dd>
                <dt>화, 목</dt><dd>08:30~18:00</dd>
                <dt>토요일</dt><dd>08:30~13:00</dd>
              </dl>
              <p className="ft-note">※ 점심시간 12:30 - 14:00, 접수마감 월수금 19:30, 화목 17:30, 토 12:30, 일요일과 공휴일 휴진</p>
              <h3>상담안내</h3>
              <a className="ft-phone" href={TEL_LINK}><span><IconPhone /></span>{TEL}</a>
            </div>
          </div>
        </section>
        <div className="ft-bottom">
          <div className="ft-row">
            <div>
              <p className="ft-name">광명당한의원 <span>대표 남인우</span></p>
              <p className="ft-biz"><span>{ADDRESS}</span><span>사업자등록번호 501-06-66851</span><span>전화 {TEL}</span></p>
            </div>
            <button className="ft-prv" onClick={() => (document.getElementById("privacy") as HTMLDialogElement).showModal()}>개인정보처리방침</button>
          </div>
          <p className="ft-copy">© 광명당한의원. All rights reserved.<br />사진은 기존 촬영본을 AI로 보정하거나 진료 설명을 위해 생성한 이미지입니다.</p>
        </div>
      </footer>

      <dialog id="privacy" className="privacy" onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}>
        <div>
          <form method="dialog"><button aria-label="닫기">×</button></form>
          <h3>개인정보처리방침</h3>
          <p>광명당한의원 개인정보처리방침 내용을 입력하세요.</p>
        </div>
      </dialog>

      {/* desktop: tab rides up on a 105px strip of three actions (same interaction as the reference) */}
      <div className={"cs-wrap" + (consultOpen ? " open" : "")}>
        <button className="cs-tab" onClick={() => setConsultOpen((v) => !v)} aria-expanded={consultOpen} aria-controls="cs-options">
          상담하기
          <span className="cs-tab-chevron"><IconChevron /></span>
        </button>
        <div id="cs-options" className="cs-options" inert={!consultOpen}>
          <div className="cs-actions">
            <a className="cs-action" href={KAKAO_CHANNEL} {...EXT}><IconChat /><span>카카오톡 상담</span></a>
            <a className="cs-action" href={TEL_LINK}><IconPhone /><span>전화 상담</span></a>
            <button type="button" className="cs-action" onClick={() => formRef.current?.showModal()}><IconEdit /><span>빠른 상담 신청</span></button>
          </div>
        </div>
      </div>

      <dialog ref={formRef} className="cs-dialog" aria-label="빠른 상담 신청" onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}>
        <form className="cs-form" onSubmit={submitConsult}>
          <h3>빠른 상담 신청</h3>
          <button type="button" className="cs-close" onClick={() => formRef.current?.close()} aria-label="닫기">×</button>
          <div className="cs-inputs">
            <input name="name" aria-label="이름" placeholder="이름" required maxLength={30} autoFocus />
            <input name="tel" type="tel" aria-label="연락처" placeholder="연락처" required maxLength={14} pattern="[0-9\-]{9,14}" title="숫자와 하이픈(-)만 입력해 주세요" />
            <select name="item" aria-label="상담항목" required defaultValue="">
              <option value="" disabled hidden>상담항목</option>
              {Object.entries(CONSULT).map(([group, opts]) => (
                <optgroup key={group} label={group}>
                  {opts.map((o) => <option key={o} value={`${group}-${o}`}>{o}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          {/* PIPA Art.15 notice: items, purpose, retention, right to refuse (retention period = owner decision) */}
          <p className="cs-notice">수집 항목: 이름, 연락처, 상담 항목. 이용 목적: 상담 및 예약 안내. 보유 기간: 상담 완료 후 1년. 동의를 거부할&nbsp;수&nbsp;있으며, 거부 시 온라인 상담 신청이 제한됩니다.</p>
          <div className="cs-agree">
            <label><input name="privacy" type="checkbox" required /> 개인정보 수집 및 이용 동의(필수)</label>
            <label><input name="sms" type="checkbox" /> SMS 수신 동의(선택)</label>
          </div>
          {/* honeypot: hidden from people, bots fill it and get silently dropped */}
          <input name="company" className="cs-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button type="submit" className="cs-submit" disabled={sending}>{sending ? "접수 중…" : "상담신청"}</button>
        </form>
      </dialog>

      <nav className="mb-tabbar" aria-label="하단 바로가기">
        <a className="mb-tab" href={TEL_LINK}><IconPhone /><span>전화</span></a>
        <a className="mb-tab" href={PLACE} {...EXT}><IconPin /><span>플레이스</span></a>
        <a className="mb-tab" href={KAKAO_CHANNEL} {...EXT}><IconChat /><span>카카오톡 상담</span></a>
        <a className="mb-tab" href="#location"><IconMap /><span>오시는 길</span></a>
      </nav>
    </>
  );
}
