"use client";

import { animated, easings, useSpring } from "@react-spring/web";

import { HERO } from "@/data/home";
import { useMotionOff } from "@/hooks/use-motion-off";

/**
 * The "Scroll" hint at the foot of the first screen: a thin line with a light
 * running down it, forever. A spring loop, so it reads `useMotionOff()`.
 */
export const ScrollCue = () => {
  const motionOff = useMotionOff();
  const spring = useSpring({
    from: { y: -100 },
    to: { y: 100 },
    loop: !motionOff,
    config: { duration: 1800, easing: easings.easeInOutCubic },
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-sm text-muted sm:flex"
    >
      {HERO.scrollCue}
      <span className="relative h-12 w-px overflow-hidden bg-line">
        <animated.span
          className="absolute inset-x-0 h-1/2 bg-accent"
          style={{ transform: spring.y.to((value) => `translate3d(0,${value}%,0)`) }}
        />
      </span>
    </div>
  );
};
