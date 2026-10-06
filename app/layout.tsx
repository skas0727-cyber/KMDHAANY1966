import type { Metadata } from "next";
import "./globals.css";
import Chrome from "./chrome";
import { SITE_URL, NAME, BLOG, PLACE, KAKAO_PLACE, TEL, ADDRESS, pageMeta } from "./site";
import { CLINIC_ID, WEBSITE_ID, JsonLd } from "./seo";

const GEO = { lat: 36.1553892, lng: 127.0156908 };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta(
    "/",
    "논산 한의원 광명당한의원, 강경 SINCE 1966",
    "충남 논산시 강경읍 광명당한의원. 1966년 광명당한약방에서 시작해 3대째 이어온 논산 한의원입니다. 침과 약침, 추나요법, 교통사고 후유증 치료(자동차보험 본인부담금 0원), 한방 다이어트, 피부 관리(슈링크, 토닝, 점 제거)를 하며, 월, 수, 금요일은 저녁 8시까지 진료합니다."
  ),
  title: { default: "논산 한의원 광명당한의원, 강경 SINCE 1966", template: `%s, ${NAME}` },
  applicationName: NAME,
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  publisher: NAME,
  category: "health",
  // index everything public; let Google show large image previews and full snippets (admin/api are blocked in robots.ts and X-Robots-Tag)
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: {
    // Google Search Console: paste the HTML-tag token into GOOGLE_SITE_VERIFICATION (Vercel → Environment Variables); the tag is omitted while unset
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: { "naver-site-verification": "cbbda4def29a9e38a2825688a2f2195c7e5d7e65" }, // Naver Search Advisor ownership
  },
  // legacy geo tags: still read by Naver/Daum and some local-search crawlers
  other: { "geo.region": "KR-44", "geo.placename": "논산시 강경읍", "geo.position": `${GEO.lat};${GEO.lng}`, ICBM: `${GEO.lat}, ${GEO.lng}` },
};

// local-business structured data: name/address/phone/hours must match the footer and Naver Place (NAP consistency)
const hours = (days: string | string[], opens: string, closes: string) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes });
const LATE = ["Monday", "Wednesday", "Friday"], EARLY = ["Tuesday", "Thursday"]; // 월수금 20:00, 화목 18:00
const DOCTORS = [
  { id: "nam-inwoo", name: "남인우", jobTitle: "대표원장", description: "광명당한의원 대표원장. 초음파로 통증 부위를 직접 확인하며 침, 약침, 추나요법, 교통사고 후유증을 진료합니다." },
  { id: "kim-junhyung", name: "김준형", jobTitle: "원장", description: "광명당한의원 원장." },
].map((d) => ({ "@type": "Person", "@id": `${SITE_URL}/#${d.id}`, name: d.name, jobTitle: d.jobTitle, description: d.description, worksFor: { "@id": CLINIC_ID }, knowsAbout: ["한의학", "침", "약침", "추나요법", "교통사고 후유증"] }));

const clinic = {
  "@type": ["MedicalClinic", "MedicalBusiness"],
  "@id": CLINIC_ID,
  name: NAME,
  alternateName: ["광명당 한의원", "논산 광명당한의원", "강경 광명당한의원", "논산 한의원 광명당"],
  legalName: NAME,
  slogan: "1966년부터 3대째, 논산 강경의 한의원",
  description: "1966년 광명당한약방에서 시작해 3대째 이어온 충남 논산시 강경읍의 한의원. 침과 약침, 추나요법, 교통사고 후유증, 한방 다이어트, 피부 관리.",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png`, width: 289, height: 217 },
  image: [`${SITE_URL}/img/exterior-wide.jpg`, `${SITE_URL}/img/lobby-wide.jpg`, `${SITE_URL}/img/exterior.jpg`],
  telephone: "+82-41-745-2141",
  foundingDate: "1966",
  taxID: "501-06-66851",
  priceRange: "₩₩",
  currenciesAccepted: "KRW",
  paymentAccepted: "현금, 신용카드",
  address: { "@type": "PostalAddress", streetAddress: "강경읍 대흥로6번길 9", addressLocality: "논산시", addressRegion: "충청남도", addressCountry: "KR" },
  geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
  hasMap: [PLACE, KAKAO_PLACE],
  openingHoursSpecification: [
    hours([...LATE, ...EARLY], "08:30", "12:30"), hours(LATE, "14:00", "20:00"), hours(EARLY, "14:00", "18:00"),
    hours("Saturday", "08:30", "13:00"),
  ],
  areaServed: [{ "@type": "City", name: "논산시" }, { "@type": "Place", name: "강경읍" }],
  medicalSpecialty: ["한의학", "침구", "추나요법", "교통사고 후유증", "한방 다이어트", "한방 피부 관리"],
  isAcceptingNewPatients: true,
  founder: { "@type": "Person", name: "남주희" },
  employee: DOCTORS.map((d) => ({ "@id": d["@id"] })),
  availableService: [
    ["교통사고 후유증 치료 (자동차보험 본인부담금 0원)", "/accident"],
    ["한방 다이어트 (체질 맞춤 다이어트 한약)", "/diet"],
    ["피부 관리 (슈링크 리프팅, 레이저 토닝, 점과 잡티 제거)", "/skin"],
    ["한약 (으뜸 보약, 맞춤 치료약, 부인과 치료약)", "/treatment"],
    ["추나요법", "/treatment#care"],
    ["침", "/treatment#care"],
    ["약침", "/treatment#care"],
    ["고주파 심부열 치료 (RAFOS)", "/treatment#care"],
    ["체외충격파 치료", "/treatment#care"],
  ].map(([name, path]) => ({ "@type": "MedicalTherapy", name, url: SITE_URL + path, provider: { "@id": CLINIC_ID } })),
  contactPoint: [{ "@type": "ContactPoint", telephone: "+82-41-745-2141", contactType: "reservations", areaServed: "KR", availableLanguage: "ko" }],
  sameAs: [BLOG, PLACE, KAKAO_PLACE],
};

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: `${NAME} 논산 강경`,
  alternateName: ["광명당 한의원", "논산 한의원 광명당"],
  description: `${ADDRESS}, ${TEL}. 논산 교통사고 한의원, 한방 다이어트, 피부 관리, 한약과 추나.`,
  inLanguage: "ko-KR",
  publisher: { "@id": CLINIC_ID },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* third-party origins used on every page: Pretendard font CSS (globals.css @import) and the Kakao Maps SDK (footer) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://dapi.kakao.com" />
      </head>
      <body>
        <Chrome>{children}</Chrome>
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [clinic, website, ...DOCTORS] }} />
      </body>
    </html>
  );
}
