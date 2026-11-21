"use client";

import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";

import { Spring } from "@/components/common/robot-spring";
import { buttonClass } from "@/components/ui/button-styles";
import { SectionLink } from "@/components/ui/section-link";
import { NAV_ITEMS, SECTION_IDS, SERVICES } from "@/data/home";

const PANEL_FROM = { opacity: 0, y: -14, filter: "blur(0.5rem)" };
const PANEL_TO = { opacity: 1, y: 0, filter: "blur(0rem)" };
const PANEL_CONFIG = { tension: 260, friction: 26 };
/** Closing waits a beat so the pointer can cross the gap to the panel. */
const CLOSE_DELAY_MS = 140;

const LINK =
  "text-base text-muted transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-foreground";

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`size-4 transition-transform duration-[var(--duration-fast)] ease-entrance ${open ? "rotate-180" : ""}`}
  >
    <path d="m5 8 5 5 5-5" />
  </svg>
);

/**
 * The header's links on a tablet or desktop. "Services" opens the mega menu: on
 * hover, on focus, and on click (the button is a real disclosure, so a
 * keyboard or touch visitor gets it too). Escape and a click outside close it.
 *
 * The panel is always in the DOM — its links are real anchors — and `inert`
 * while closed, so it is out of the tab order and the accessibility tree. It
 * is positioned against the fixed header (no `relative` between them), so it
 * spans the full width under the bar.
 */
export const DesktopNav = () => {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelClose = useCallback(() => clearTimeout(timer.current), []);
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  const closeSoon = () => {
    cancelClose();
    timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  const closeNow = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeNow();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, closeNow]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeSoon();
  };

  return (
    <nav aria-label="Primary" className="hidden sm:block">
      <ul className="flex items-center gap-10">
        {NAV_ITEMS.map((item) =>
          item.id === SECTION_IDS.services ? (
            <li
              key={item.id}
              ref={rootRef}
              onMouseEnter={openNow}
              onMouseLeave={closeSoon}
              onBlur={onBlur}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((value) => !value)}
                className={`${LINK} flex items-center gap-1.5 ${open ? "text-foreground" : ""}`}
              >
                {item.label}
                <Chevron open={open} />
              </button>

              <Spring
                tag="div"
                id={panelId}
                enabled={open}
                mode="always"
                from={PANEL_FROM}
                to={PANEL_TO}
                config={PANEL_CONFIG}
                inert={!open}
                className={`absolute inset-x-0 top-full border-b border-line bg-surface-raised px-gutter ${open ? "" : "pointer-events-none"}`}
              >
                <div className="mx-auto grid w-full max-w-page gap-10 py-10 lg:grid-cols-[1.6fr_1fr]">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-muted">
                      {SERVICES.eyebrow}
                    </p>
                    <ul className="mt-6 grid gap-x-10 gap-y-2 md:grid-cols-2">
                      {SERVICES.items.map((service, index) => (
                        <li key={service.id}>
                          <SectionLink
                            id={`service-${service.id}`}
                            onNavigate={closeNow}
                            className="group flex gap-4 rounded-xl p-4 transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-glass"
                          >
                            <span className="pt-1 text-sm tabular-nums text-accent">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>
                              <span className="block text-lead font-semibold leading-snug tracking-tight">
                                {service.title}
                              </span>
                              <span className="mt-1 block text-sm text-muted">{service.short}</span>
                            </span>
                          </SectionLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-8 rounded-card border border-glass-line bg-glass p-8">
                    <div>
                      <p className="text-title font-semibold leading-snug tracking-tight">
                        {SERVICES.menuCta.title}
                      </p>
                      <p className="mt-3 text-base text-muted">{SERVICES.menuCta.body}</p>
                    </div>
                    <SectionLink
                      id={SECTION_IDS.contact}
                      onNavigate={closeNow}
                      className={buttonClass("primary", "sm")}
                    >
                      {SERVICES.menuCta.action}
                    </SectionLink>
                  </div>
                </div>
              </Spring>
            </li>
          ) : (
            <li key={item.id}>
              <SectionLink id={item.id} className={LINK}>
                {item.label}
              </SectionLink>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
};
