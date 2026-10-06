import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

// AI search/answer crawlers, named so the opt-in is explicit (a bot obeys its own group over "*", so the disallow repeats)
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot"];

// public pages are open to every crawler (Google, Naver Yeti, Daum, Bing, AI assistants); admin UI and the inquiry API stay out of the index
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: AI_BOTS, allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
