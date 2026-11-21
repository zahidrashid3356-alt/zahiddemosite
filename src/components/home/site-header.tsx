import Link from "next/link";

import { buttonClass } from "@/components/ui/button-styles";
import { SectionLink } from "@/components/ui/section-link";
import { SECTION_IDS } from "@/data/home";
import { siteConfig } from "@/lib/site";

import { DesktopNav } from "./desktop-nav";
import { MobileMenu } from "./mobile-menu";

/**
 * The fixed top bar: wordmark, the section links (the desktop mega menu lives
 * in `DesktopNav`), the one call to action, and on a phone the menu button. A
 * solid translucent ground, no backdrop blur (blur on a fixed bar
 * re-composites on every scrolled frame) — and no transform or filter on this
 * element, so the mega menu can position against it.
 */
export const SiteHeader = () => (
  <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/95 px-gutter py-4">
    <div className="mx-auto flex w-full max-w-page items-center justify-between gap-6">
      <Link
        href="/"
        className="flex items-center gap-3 text-lg font-semibold tracking-tight"
      >
        <span aria-hidden className="size-2.5 rounded-pill bg-accent shadow-glow" />
        {siteConfig.name}
      </Link>

      <DesktopNav />

      <div className="flex items-center gap-3">
        <SectionLink
          id={SECTION_IDS.contact}
          className={`${buttonClass("primary", "sm")} hidden sm:inline-flex`}
        >
          Start a project
        </SectionLink>
        <MobileMenu />
      </div>
    </div>
  </header>
);
