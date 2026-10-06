import type { Metadata } from "next";

// single source for clinic facts (name/address/phone) shared by pages, metadata and structured data
// public/llms.txt (summary for AI search) repeats hours, prices and doctors by hand: update it when those change
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

// search keywords every page carries (Naver reads <meta name="keywords">; Google ignores it but it costs nothing)
export const KEYWORDS = ["논산 한의원", "광명당한의원", "광명당 한의원", "강경 한의원", "논산 교통사고 한의원", "논산 다이어트 한의원", "논산 피부 한의원", "논산 추나", "논산 약침", "논산 한약"];

// social preview image: [path, width, height, alt]; the default is the clinic exterior
export type OgImage = [string, number, number, string];
export const OG_DEFAULT: OgImage = ["/img/exterior-wide.jpg", 1920, 1085, "논산 강경 광명당한의원 외관, SINCE 1966"];

// per-page metadata: title goes through the root template ("%s, 광명당한의원"), canonical is relative to SITE_URL
export const pageMeta = (path: string, title: string, description: string, extra: { image?: OgImage; keywords?: string[] } = {}): Metadata => {
  const [img, width, height, alt] = extra.image ?? OG_DEFAULT;
  const full = title.includes(NAME) ? title : `${title}, ${NAME}`;
  return {
    title,
    description,
    keywords: [...(extra.keywords ?? []), ...KEYWORDS.filter((k) => !extra.keywords?.includes(k))],
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "ko_KR", siteName: NAME, url: path, title: full, description, images: [{ url: img, width, height, alt }] },
    twitter: { card: "summary_large_image", title: full, description, images: [{ url: img, alt }] },
  };
};
