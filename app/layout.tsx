import type { Metadata } from "next";
import "./globals.css";
import Chrome from "./chrome";
import { SITE_URL, NAME, BLOG, PLACE, pageMeta } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta(
    "/",
    "논산 한의원 광명당한의원, 강경 SINCE 1966",
    "충남 논산시 강경읍 광명당한의원. 1966년 광명당한약방에서 시작해 3대째 이어온 한의원입니다. 침과 약침, 추나요법, 교통사고 후유증 치료(자동차보험 본인부담금 0원), 한방 다이어트, 피부 관리(슈링크, 토닝, 점 제거)를 하며, 월, 수, 금요일은 저녁 8시까지 진료합니다."
  ),
  title: { default: "논산 한의원 광명당한의원, 강경 SINCE 1966", template: `%s, ${NAME}` },
};

// local-business structured data: name/address/phone/hours must match the footer and Naver Place (NAP consistency)
const hours = (days: string | string[], opens: string, closes: string) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes });
const LATE = ["Monday", "Wednesday", "Friday"], EARLY = ["Tuesday", "Thursday"]; // 월수금 20:00, 화목 18:00
const clinic = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": `${SITE_URL}/#clinic`,
  name: NAME,
  alternateName: ["광명당 한의원", "논산 광명당한의원", "강경 광명당한의원"],
  description: "1966년 광명당한약방에서 시작해 3대째 이어온 충남 논산시 강경읍의 한의원. 침과 약침, 추나요법, 교통사고 후유증, 한방 다이어트, 피부 관리.",
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo.png`,
  image: `${SITE_URL}/img/exterior-wide.jpg`,
  telephone: "+82-41-745-2141",
  foundingDate: "1966",
  address: { "@type": "PostalAddress", streetAddress: "대흥로6번길 9", addressLocality: "논산시 강경읍", addressRegion: "충청남도", addressCountry: "KR" },
  geo: { "@type": "GeoCoordinates", latitude: 36.1553892, longitude: 127.0156908 },
  openingHoursSpecification: [
    hours([...LATE, ...EARLY], "08:30", "12:30"), hours(LATE, "14:00", "20:00"), hours(EARLY, "14:00", "18:00"),
    hours("Saturday", "08:30", "13:00"),
  ],
  areaServed: ["논산시", "강경읍"],
  employee: [{ "@type": "Person", name: "남인우", jobTitle: "대표원장" }, { "@type": "Person", name: "김준형", jobTitle: "원장" }],
  availableService: [
    ["교통사고 후유증 치료", "/accident"],
    ["한방 다이어트", "/diet"],
    ["피부 관리 (슈링크, 토닝, 점 제거)", "/skin"],
    ["한약 (보약, 치료약)", "/treatment"],
    ["추나요법", "/treatment#care"],
    ["침", "/treatment#care"],
    ["약침", "/treatment#care"],
  ].map(([name, path]) => ({ "@type": "MedicalTherapy", name, url: SITE_URL + path })),
  sameAs: [BLOG, PLACE],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Chrome>{children}</Chrome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinic) }} />
      </body>
    </html>
  );
}
