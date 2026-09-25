import type { Metadata } from "next";

// single source for clinic facts (name/address/phone) shared by pages, metadata and structured data
export const SITE_URL = "https://kmdhaany1966.com"; // canonical, sitemap, schema
export const NAME = "광명당한의원";
export const BLOG = "https://blog.naver.com/kmdhaany1966";
export const PLACE = "https://map.naver.com/p/entry/place/1561910316";
// KakaoTalk channel: /chat opens the 1:1 chat directly
export const KAKAO_CHANNEL = "https://pf.kakao.com/_lxeuuX/chat";
export const KAKAO_PLACE = "https://place.map.kakao.com/910351992";
export const TEL = "041-745-2141";
export const TEL_LINK = "tel:0417452141";
export const ADDRESS = "충남 논산시 강경읍 대흥로6번길 9";
// Kakao Maps JavaScript key: public by design, restricted to the domains registered in Kakao Developers → 플랫폼 → Web
export const KAKAO_JS_KEY = "3c7baee17951d51e659b2955b79c7934";

// per-page metadata: title goes through the root template ("%s, 광명당한의원"), canonical is relative to SITE_URL
export const pageMeta = (path: string, title: string, description: string): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: { type: "website", locale: "ko_KR", siteName: NAME, url: path, title: title.includes(NAME) ? title : `${title}, ${NAME}`, description, images: ["/img/exterior-wide.jpg"] },
});
