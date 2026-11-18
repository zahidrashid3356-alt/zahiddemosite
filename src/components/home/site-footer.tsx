import Link from "next/link";

import { CONTACT } from "@/data/home";
import { siteConfig } from "@/lib/site";

export const SiteFooter = () => (
  <footer className="w-full border-t border-line px-gutter py-10">
    <div className="mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-4 text-sm text-muted">
      <p>
        © {new Date().getFullYear()} {siteConfig.name}
      </p>
      <nav aria-label="Footer" className="flex items-center gap-8">
        <a
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-foreground"
        >
          LinkedIn
        </a>
        <Link
          href="/privacy-policy"
          className="transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-foreground"
        >
          Privacy policy
        </Link>
      </nav>
    </div>
  </footer>
);
