"use client";

import { SpringTrigger } from "@/components/animation/springs/spring-trigger";

/**
 * Relay's "one stream of light runs the whole length of the site": a thin rail
 * fixed to the left edge whose lit part grows with the page's scroll progress.
 * Decorative and desktop-only (`aria-hidden`, hidden on phones).
 *
 * The wrapper spans the whole page (it is absolutely positioned inside `<main>`),
 * so the trigger's progress runs top of page → bottom of page; the two sticky
 * rails inside stay one viewport tall and stay put while you scroll.
 */
export const Stream = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-y-0 left-6 z-10 hidden w-px sm:block"
  >
    <div className="sticky top-0 h-lvh w-px bg-line" />
    <SpringTrigger
      className="absolute inset-0"
      innerClassName="sticky top-0 h-lvh w-px origin-top bg-accent shadow-glow"
      start="top top"
      end="bottom bottom"
      from={{ scaleY: 0 }}
      to={{ scaleY: 1 }}
    />
  </div>
);
