"use client";

import type { MouseEvent, ReactNode } from "react";

import { scrollTo } from "@/utils/scroll-to";

interface SectionLinkProps {
  /** The section's `id` on this page — the link's `href` is `#id`. */
  id: string;
  className?: string;
  children: ReactNode;
}

/**
 * A link to a section of this page. The `href` stays a real `#id` (crawlers,
 * middle-click, no-JS); a plain click goes through `scrollTo` so the scroll
 * runs through Lenis instead of jumping.
 */
export const SectionLink = ({ id, className, children }: SectionLinkProps) => {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    scrollTo(id);
  };

  return (
    <a href={`#${id}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
};
