import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";
import { PROGRAMS } from "./programs";

// static site: lastModified is the build time (a deploy is the only way content changes);
// priority ranks the keyword landing pages above the long-tail program pages
const PAGES: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"], string[]][] = [
  ["", 1, "weekly", ["/img/exterior-wide.jpg", "/img/lobby-wide.jpg"]],
  ["/accident", 0.9, "monthly", ["/img/accident-wide.jpg"]],
  ["/diet", 0.9, "monthly", ["/img/diet-wide.jpg"]],
  ["/skin", 0.9, "monthly", ["/img/skin/hero-wide.jpg"]],
  ["/treatment", 0.8, "monthly", ["/img/treatment-wide.jpg"]],
  ["/program", 0.7, "monthly", ["/img/program-wide.jpg"]],
  ...PROGRAMS.map((p): [string, number, "monthly", string[]] => [`/program/${p.slug}`, 0.6, "monthly", [`/img/program-${p.cat}-wide.jpg`]]),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(([path, priority, changeFrequency, images]) => ({
    url: SITE_URL + path,
    lastModified,
    changeFrequency,
    priority,
    images: images.map((i) => SITE_URL + i),
  }));
}
