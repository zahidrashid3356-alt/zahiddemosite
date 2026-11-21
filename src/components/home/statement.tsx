"use client";

import { useCallback, useEffect, useRef } from "react";

import { ProgressTrigger } from "@/components/animation/springs/progress-trigger";
import { useRobot } from "@/components/common/robot-view";
import { STATEMENT } from "@/data/home";
import { useMotionOff } from "@/hooks/use-motion-off";

const WORDS = STATEMENT.text.split(" ");
const DIM = 0.16;

/**
 * The position statement, lit word by word as it scrolls through the middle of
 * the screen. Words start dim and are written to one element each, only when
 * their value changes. On the robot form the text is at full strength in the
 * served HTML; reduced motion lights everything once mounted.
 */
export const Statement = () => {
  const robot = useRobot();
  const motionOff = useMotionOff();
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const last = useRef<number[]>([]);

  const paint = useCallback((progress: number) => {
    const span = WORDS.length;
    for (let i = 0; i < span; i += 1) {
      const lit = Math.min(1, Math.max(0, progress * (span + 3) - i));
      const value = Math.round((DIM + (1 - DIM) * lit) * 100) / 100;
      if (last.current[i] === value) continue;
      last.current[i] = value;
      const node = refs.current[i];
      if (node) node.style.opacity = String(value);
    }
  }, []);

  useEffect(() => {
    if (motionOff) paint(1);
  }, [motionOff, paint]);

  return (
    <section
      id="approach"
      aria-label="How I work"
      className="relative w-full px-gutter py-section"
    >
      <ProgressTrigger
        tag="div"
        start="top bottom"
        end="center center"
        enabled={!motionOff}
        onChange={({ interpolatedProgress }) => paint(interpolatedProgress)}
        className="mx-auto w-full max-w-page"
      >
        <p className="max-w-5xl text-headline font-semibold leading-display tracking-tight">
          {WORDS.map((word, index) => (
            <span
              key={`${word}-${index}`}
              ref={(node) => {
                refs.current[index] = node;
              }}
              className={index >= STATEMENT.accentFrom ? "text-accent" : undefined}
              style={robot ? undefined : { opacity: DIM }}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </ProgressTrigger>
    </section>
  );
};
