"use client";

import { animated, easings, useSpring } from "@react-spring/web";

import { useMotionOff } from "@/hooks/use-motion-off";
import { MARQUEE } from "@/data/home";

const LOOP_MS = 42000;

const Group = ({ items, hidden }: { items: readonly string[]; hidden?: boolean }) => (
  <ul aria-hidden={hidden} className="flex shrink-0 items-center">
    {items.map((item) => (
      <li key={item} className="flex items-center">
        <span className="px-8 text-title font-semibold tracking-tight text-foreground/90">
          {item}
        </span>
        <span aria-hidden className="size-2 rounded-pill bg-accent shadow-glow" />
      </li>
    ))}
  </ul>
);

/**
 * One row of the strip. The track holds the list twice; sliding it by exactly
 * half its width, forever, is a seamless loop. It is a spring loop, so it reads
 * `useMotionOff()` — reduced motion and the robot form would otherwise hang the
 * page (animation-system.md → "Loops and motion off").
 */
const Row = ({ items, reverse }: { items: readonly string[]; reverse?: boolean }) => {
  const motionOff = useMotionOff();
  const spring = useSpring({
    from: { x: reverse ? -50 : 0 },
    to: { x: reverse ? 0 : -50 },
    loop: !motionOff,
    config: { duration: LOOP_MS, easing: easings.linear },
  });

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <animated.div
        className="flex w-max will-change-transform"
        style={{ transform: spring.x.to((value) => `translate3d(${value}%,0,0)`) }}
      >
        <Group items={items} />
        <Group items={items} hidden />
      </animated.div>
    </div>
  );
};

export const Marquee = () => (
  <section aria-label={MARQUEE.label} className="w-full overflow-hidden py-8">
    <div className="flex flex-col gap-4">
      {MARQUEE.rows.map((row, index) => (
        <Row key={row[0]} items={row} reverse={index % 2 === 1} />
      ))}
    </div>
  </section>
);
