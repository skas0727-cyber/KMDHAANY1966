// single source for clinic facts (name/address/phone) shared by pages, metadata and structured data
export const SITE_URL = "https://example.com"; // TODO: set the real domain before launch (used for canonical, sitemap, schema)
export const NAME = "광명당한의원";
export const IMG = "/img/";
export const BLOG = "https://blog.naver.com/kmdhaany1966";
export const PLACE = "https://map.naver.com/p/entry/place/1561910316";
export const TEL = "041-745-2141";
export const TEL_LINK = "tel:0417452141";
export const ADDRESS = "충남 논산시 강경읍 대흥로6번길 9";

// per-page metadata: title goes through the root template ("%s | 광명당한의원"), canonical is relative to SITE_URL
export const pageMeta = (path, title, description) => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: { type: "website", locale: "ko_KR", siteName: NAME, url: path, title: title.includes(NAME) ? title : `${title} | ${NAME}`, description, images: ["/img/lobby.jpg"] },
});
