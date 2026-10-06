import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

// public pages are open to every crawler (Google, Naver Yeti, Daum, Bing); admin UI and the inquiry API stay out of the index
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
