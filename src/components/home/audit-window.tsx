"use client";

import { SpringTrigger } from "@/components/animation/springs/spring-trigger";
import { Inview } from "@/components/common/robot-inview";
import { AUDIT_WINDOW } from "@/data/home";

const ITEM_FROM = { opacity: 0, x: -16 };
const ITEM_TO = { opacity: 1, x: 0 };
const ITEM_CONFIG = { tension: 140, friction: 22 };
const ITEM_STAGGER_MS = 110;

const Check = () => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5 shrink-0 text-accent"
  >
    <path d="M4 10.5 8.5 15 16 6" />
  </svg>
);

/**
 * The hero's glass window — Relay's tilting pane, filled with the order an
 * audit goes in. It lists the work, not results (nothing here claims a number).
 * Scrolling the hero away scrubs the pane further into its tilt; phones keep it
 * flat. The checklist rows slide in one after another.
 */
export const AuditWindow = () => (
  <SpringTrigger
    className="perspective-distant"
    innerClassName="transform-3d rounded-card border border-glass-line bg-glass p-8 shadow-glow sm:p-10"
    start="top top"
    end="bottom top"
    from={{ rotateX: 6, rotateY: -8, y: 0 }}
    to={{ rotateX: 26, rotateY: -18, y: -40 }}
    disableOnMobile
  >
    <div className="flex items-center gap-2">
      <span aria-hidden className="size-3 rounded-pill bg-line" />
      <span aria-hidden className="size-3 rounded-pill bg-line" />
      <span aria-hidden className="size-3 rounded-pill bg-line" />
      <p className="ml-3 text-sm text-muted">{AUDIT_WINDOW.title}</p>
    </div>

    <ol className="mt-8 flex flex-col gap-5">
      {AUDIT_WINDOW.items.map((item, index) => (
        <Inview
          key={item}
          tag="li"
          mode="once"
          from={ITEM_FROM}
          to={ITEM_TO}
          config={ITEM_CONFIG}
          delayIn={index * ITEM_STAGGER_MS}
          className="flex items-center gap-4 border-b border-line pb-5 text-lead last:border-b-0 last:pb-0"
        >
          <Check />
          {item}
        </Inview>
      ))}
    </ol>
  </SpringTrigger>
);
