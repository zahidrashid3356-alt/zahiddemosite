"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { ProgressTrigger } from "@/components/animation/springs/progress-trigger";
import { useRobot } from "@/components/common/robot-view";

/** Below this width the row is a plain horizontal scroller (matches the springs' mobile width). */
const PIN_MIN_WIDTH = 768;
/** How much page scroll one card of horizontal travel costs, in screens. */
const SCREENS_PER_CARD = 0.6;

interface WorkTrackProps {
  /** Server-rendered heading, shown above the cards. */
  heading: ReactNode;
  count: number;
  children: ReactNode;
}

/**
 * Horizontal scroll driven by the page scroll. From `md` up the section is
 * pinned and the card row slides sideways as you scroll down; below that it is
 * a native swipe row with snap points. The slide writes one `transform` on the
 * track, from the trigger's spring-smoothed progress, and only on a pinned
 * layout. The robot form gets the swipe row too (nothing pinned).
 */
export const WorkTrack = ({ heading, count, children }: WorkTrackProps) => {
  const robot = useRobot();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shift = useRef(0);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    if (window.innerWidth < PIN_MIN_WIDTH) {
      shift.current = 0;
      track.style.transform = "";
      return;
    }
    shift.current = Math.max(0, track.scrollWidth - viewport.clientWidth);
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [measure]);

  const onChange = useCallback(({ interpolatedProgress }: { interpolatedProgress: number }) => {
    const track = trackRef.current;
    if (!track || window.innerWidth < PIN_MIN_WIDTH) return;
    track.style.transform = `translate3d(${-interpolatedProgress * shift.current}px,0,0)`;
  }, []);

  const height = { "--work-height": `${Math.round(count * SCREENS_PER_CARD * 100 + 100)}svh` } as CSSProperties;

  return (
    <ProgressTrigger
      tag="div"
      start="top top"
      end="bottom bottom"
      enabled={!robot}
      onChange={onChange}
      className="relative md:h-(--work-height)"
      style={height}
    >
      <div className="py-section md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:py-0">
        <div className="mx-auto w-full max-w-page px-gutter">{heading}</div>
        <div
          ref={viewportRef}
          className="mt-12 snap-x snap-mandatory overflow-x-auto md:snap-none md:overflow-hidden"
        >
          <div ref={trackRef} className="flex w-max gap-6 px-gutter will-change-transform">
            {children}
          </div>
        </div>
      </div>
    </ProgressTrigger>
  );
};
