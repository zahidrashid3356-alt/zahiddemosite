"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useId, useRef, useState } from "react";

import { useRobot } from "@/components/common/robot-view";
import type { FaqEntry } from "@/data/home";

const SPRING = { tension: 260, friction: 30 };

const Item = ({ entry, robot }: { entry: FaqEntry; robot: boolean }) => {
  const uid = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [spring, api] = useSpring(() => ({ height: 0, opacity: 0, config: SPRING }));

  const toggle = () => {
    const next = !open;
    setOpen(next);
    api.start({ height: next ? (bodyRef.current?.scrollHeight ?? 0) : 0, opacity: next ? 1 : 0 });
  };

  // A resize re-wraps the answer: keep the open one the right height.
  useEffect(() => {
    if (!open) return;
    const onResize = () =>
      api.start({ height: bodyRef.current?.scrollHeight ?? 0, immediate: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [open, api]);

  const buttonId = `${uid}-q`;
  const regionId = `${uid}-a`;

  return (
    <li className="border-b border-line">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={robot || open}
          aria-controls={regionId}
          onClick={toggle}
          disabled={robot}
          className="flex w-full items-center justify-between gap-6 py-7 text-left text-title font-semibold leading-snug tracking-tight"
        >
          {entry.question}
          <span
            aria-hidden
            className={`relative size-6 shrink-0 transition-transform duration-[var(--duration-normal)] ease-entrance ${open ? "rotate-45" : ""}`}
          >
            <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-pill bg-accent" />
            <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rounded-pill bg-accent" />
          </span>
        </button>
      </h3>
      <animated.div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        inert={!robot && !open}
        className="overflow-hidden"
        style={robot ? undefined : spring}
      >
        <div ref={bodyRef} className="max-w-3xl pb-7 text-lead text-muted">
          {entry.answer}
        </div>
      </animated.div>
    </li>
  );
};

/**
 * The accordion. The answers are always in the DOM; closed ones are collapsed
 * with a height spring and `inert`. On the robot form every answer is open in
 * the served HTML.
 */
export const FaqList = ({ items }: { items: readonly FaqEntry[] }) => {
  const robot = useRobot();
  return (
    <ul className="border-t border-line">
      {items.map((entry) => (
        <Item key={entry.question} entry={entry} robot={robot} />
      ))}
    </ul>
  );
};
