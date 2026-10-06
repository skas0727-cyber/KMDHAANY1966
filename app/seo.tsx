import { SITE_URL, NAME } from "./site";

// shared JSON-LD helpers; every page-level graph points at the clinic node declared in layout.tsx (`#clinic`)
export const CLINIC_ID = `${SITE_URL}/#clinic`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const clinicRef = { "@id": CLINIC_ID };

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

// one node per page describing what the page is about; `about` links the page to the services it describes
export const webPage = (path: string, name: string, description: string, opts: { medical?: boolean; about?: object[]; image?: string } = {}) => ({
  "@type": opts.medical === false ? "WebPage" : "MedicalWebPage",
  "@id": `${SITE_URL}${path}#webpage`,
  url: `${SITE_URL}${path}`,
  name,
  description,
  inLanguage: "ko-KR",
  isPartOf: { "@id": WEBSITE_ID },
  about: opts.about,
  primaryImageOfPage: opts.image ? { "@type": "ImageObject", url: `${SITE_URL}${opts.image}` } : undefined,
  publisher: clinicRef,
});

// breadcrumb trail; home is always the first crumb. Only used where the page shows the same trail.
export const breadcrumb = (items: [string, string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["홈", "/"], ...items].map(([name, path], k) => ({ "@type": "ListItem", position: k + 1, name, item: `${SITE_URL}${path}` })),
});

// a treatment the clinic offers, optionally with its listed price (KRW, VAT 별도 is stated in `description`)
export const therapy = (name: string, description: string, path: string, offers?: { name: string; price: number; description?: string }[]) => ({
  "@type": "MedicalTherapy",
  name,
  description,
  url: `${SITE_URL}${path}`,
  provider: clinicRef,
  areaServed: ["논산시", "강경읍"],
  offers: offers?.map((o) => ({ "@type": "Offer", name: o.name, price: o.price, priceCurrency: "KRW", description: o.description, availability: "https://schema.org/InStock", seller: clinicRef })),
});

export const itemList = (name: string, items: [string, string][]) => ({
  "@type": "ItemList",
  name,
  itemListElement: items.map(([n, path], k) => ({ "@type": "ListItem", position: k + 1, name: n, url: `${SITE_URL}${path}` })),
});

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

