"use client";

import { useCallback, useRef, useState } from "react";

import { ProgressTrigger } from "@/components/animation/springs/progress-trigger";
import { Spring } from "@/components/common/robot-spring";
import { useRobot } from "@/components/common/robot-view";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { PROCESS, SECTION_IDS, type ProcessStep } from "@/data/home";

const STEPS = PROCESS.steps;
const PANEL_FROM = { opacity: 0, y: 48, filter: "blur(0.75rem)" };
const PANEL_TO = { opacity: 1, y: 0, filter: "blur(0rem)" };
const PANEL_CONFIG = { tension: 200, friction: 26 };

const StepCard = ({ step, index }: { step: ProcessStep; index: number }) => (
  <>
    <p className="text-sm font-medium tabular-nums text-accent">
      {String(index + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
    </p>
    <h3 className="mt-6 text-headline font-semibold leading-display tracking-tight">
      {step.title}
    </h3>
    <p className="mt-5 max-w-xl text-lead text-muted">{step.body}</p>
    <ul className="mt-8 flex flex-wrap gap-3">
      {step.points.map((point) => (
        <li
          key={point}
          className="rounded-pill border border-glass-line bg-glass px-5 py-2 text-sm"
        >
          {point}
        </li>
      ))}
    </ul>
  </>
);

const Heading = () => (
  <>
    <Eyebrow>{PROCESS.eyebrow}</Eyebrow>
    <Headline className="mt-6 text-headline">{PROCESS.title}</Headline>
  </>
);

/**
 * The pinned scroll-story. The section is `steps × one screen` tall; inside, a
 * sticky screen holds the heading, a step index, and the step cards stacked in
 * one grid cell. Scrolling moves `active`; each card is a spring that blurs in
 * and out. The robot form gets a plain list instead — every step readable in
 * the HTML, nothing pinned.
 */
export const Process = () => {
  const robot = useRobot();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const fillRef = useRef<HTMLDivElement>(null);

  const onChange = useCallback(
    ({ progress, interpolatedProgress }: { progress: number; interpolatedProgress: number }) => {
      const next = Math.min(STEPS.length - 1, Math.max(0, Math.floor(progress * STEPS.length)));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${interpolatedProgress})`;
    },
    [],
  );

  if (robot) {
    return (
      <section
        id={SECTION_IDS.process}
        aria-label="Process"
        className="relative w-full px-gutter py-section"
      >
        <div className="mx-auto w-full max-w-page">
          <Heading />
          <ol className="mt-16 grid gap-6 md:grid-cols-2">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-card border border-glass-line bg-glass p-8"
              >
                <StepCard step={step} index={index} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id={SECTION_IDS.process} aria-label="Process" className="relative w-full px-gutter">
      <ProgressTrigger
        tag="div"
        start="top top"
        end="bottom bottom"
        onChange={onChange}
        className="relative"
        style={{ height: `${STEPS.length * 100}svh` }}
      >
        <div className="sticky top-0 flex h-svh items-center">
          <div className="mx-auto grid w-full max-w-page gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div className="flex gap-8">
              <div aria-hidden className="relative hidden w-px shrink-0 bg-line lg:block">
                <div
                  ref={fillRef}
                  className="absolute inset-0 origin-top bg-accent shadow-glow"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>
              <div>
                <Heading />
                <ol className="mt-10 hidden flex-col gap-3 lg:flex">
                  {STEPS.map((step, index) => (
                    <li
                      key={step.title}
                      aria-current={index === active ? "step" : undefined}
                      className={`flex items-baseline gap-4 text-lead transition-colors duration-[var(--duration-normal)] ease-entrance ${
                        index === active ? "text-foreground" : "text-muted/60"
                      }`}
                    >
                      <span className="text-sm tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="grid items-center">
              {STEPS.map((step, index) => (
                <Spring
                  key={step.title}
                  tag="div"
                  enabled={index === active}
                  mode="always"
                  from={PANEL_FROM}
                  to={PANEL_TO}
                  config={PANEL_CONFIG}
                  aria-hidden={index !== active}
                  className="col-start-1 row-start-1 rounded-card border border-glass-line bg-surface-raised p-8 shadow-glow sm:p-10"
                >
                  <StepCard step={step} index={index} />
                </Spring>
              ))}
            </div>
          </div>
        </div>
      </ProgressTrigger>
    </section>
  );
};
