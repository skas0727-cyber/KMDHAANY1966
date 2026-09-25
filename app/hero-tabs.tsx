"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// photo hero whose background follows the hovered tab, then the selected one; with nothing selected (or the first tab,
// e.g. "전체") it cycles through every tab's background every 5s, pausing while a tab is hovered.
// bg = image name in /img: "<bg>-wide.jpg" from 768px up, "<bg>.jpg" below. Tabs link to "#<id>", or filter (onSelect) when onSelect is given.
type Tab = { id: string; label: string; bg: string };

export default function HeroTabs({ tabs, selected, onSelect, children }: { tabs: Tab[]; selected?: string; onSelect?: (id: string) => void; children: ReactNode }) {
  const base = tabs[0].bg;
  const [hover, setHover] = useState<string | null>(null);
  const [all, setAll] = useState(false); // other backgrounds load shortly after first paint, not up front
  useEffect(() => { const t = setTimeout(() => setAll(true), 1500); return () => clearTimeout(t); }, []);
  const [auto, setAuto] = useState(0);
  const cycling = !hover && (!selected || selected === tabs[0].id);
  useEffect(() => {
    if (!cycling || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setAuto((i) => (i + 1) % tabs.length), 5000);
    return () => clearInterval(t);
  }, [cycling, tabs.length]);
  const shownId = hover ?? (cycling ? tabs[auto].id : selected);
  const bg = tabs.find((t) => t.id === shownId)?.bg ?? base;

  return (
    <section className="sub-hero ht">
      {[...new Set([base, bg, ...(all ? tabs.map((t) => t.bg) : [])])].map((b) => (
        <picture key={b} className={b === bg ? "on" : undefined}>
          <source media="(min-width: 768px)" srcSet={`/img/${b}-wide.jpg`} />
          <img className="sub-hero-img" src={`/img/${b}.jpg`} alt="" />
        </picture>
      ))}
      <div className="sub-hero-inner">
        <div data-aos>
          {children}
          <ul className="ht-tabs" onMouseLeave={() => setHover(null)}>
            {tabs.map((t) => {
              const on = t.id === selected;
              const p = { className: on ? "on" : t.id === shownId ? "cur" : undefined, onMouseEnter: () => setHover(t.id), onFocus: () => setHover(t.id), onBlur: () => setHover(null) };
              return (
                <li key={t.id}>
                  {onSelect ? <button type="button" aria-pressed={on} {...p} onClick={() => onSelect(t.id)}>{t.label}</button> : <a href={"#" + t.id} {...p}>{t.label}</a>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
