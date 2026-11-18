import Link from "next/link";

import { buttonClass } from "@/components/ui/button-styles";
import { SectionLink } from "@/components/ui/section-link";
import { NAV_ITEMS, SECTION_IDS } from "@/data/home";
import { siteConfig } from "@/lib/site";

/**
 * The fixed top bar: wordmark, section links, and the one call to action. On a
 * phone the section links drop out — the page is one short scroll — and the
 * CTA stays. A solid translucent ground, no backdrop blur (blur on a fixed bar
 * re-composites on every scrolled frame).
 */
export const SiteHeader = () => (
  <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/80 px-gutter py-4">
    <div className="mx-auto flex w-full max-w-page items-center justify-between gap-6">
      <Link
        href="/"
        className="flex items-center gap-3 text-lg font-semibold tracking-tight"
      >
        <span aria-hidden className="size-2.5 rounded-pill bg-accent shadow-glow" />
        {siteConfig.name}
      </Link>

      <nav aria-label="Primary" className="hidden items-center gap-10 sm:flex">
        {NAV_ITEMS.map((item) => (
          <SectionLink
            key={item.id}
            id={item.id}
            className="text-base text-muted transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-foreground"
          >
            {item.label}
          </SectionLink>
        ))}
      </nav>

      <SectionLink id={SECTION_IDS.contact} className={buttonClass("primary", "sm")}>
        Start a project
      </SectionLink>
    </div>
  </header>
);
