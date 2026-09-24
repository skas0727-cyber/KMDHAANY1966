import { SITE_URL } from "./site";
import { PROGRAMS } from "./programs";

export default function sitemap() {
  return ["", "/accident", "/diet", "/skin", "/program", ...PROGRAMS.map((p) => `/program/${p.slug}`)].map((path) => ({ url: SITE_URL + path, lastModified: new Date() }));
}
