"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Spring } from "@/components/common/robot-spring";
import { buttonClass } from "@/components/ui/button-styles";
import { SectionLink } from "@/components/ui/section-link";
import { CONTACT, NAV_ITEMS, SECTION_IDS, SERVICES } from "@/data/home";
import { useScrollLock } from "@/hooks/use-scroll-lock";

/** The scroll waits until the menu has unlocked the page. */
const SCROLL_DELAY_MS = 260;
const ROW_FROM = { opacity: 0, y: 24, filter: "blur(0.5rem)" };
const ROW_TO = { opacity: 1, y: 0, filter: "blur(0rem)" };
const ROW_CONFIG = { tension: 220, friction: 24 };
const ROW_STAGGER_MS = 55;

const noopSubscribe = () => () => {};

interface PanelProps {
  open: boolean;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * The full-screen phone menu. Built to `.claude/rules/menus.md`: a portal under
 * `<body>` (a fixed box inside the header would be relative to it), `h-dvh` +
 * the bottom safe area, its own colour tokens, `inert` while closed, scroll
 * locked while open, Escape closes, focus moves in on open and back out on
 * close. The portal is created here, inside the panel component.
 */
const MobileMenuPanel = ({ open, onClose, closeRef }: PanelProps) => {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!mounted) return null;

  return createPortal(
    <Spring
      tag="div"
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      enabled={open}
      mode="always"
      from={{ opacity: 0 }}
      to={{ opacity: 1 }}
      config={{ tension: 260, friction: 30 }}
      inert={!open}
      className={`fixed inset-x-0 top-0 z-[100] flex h-dvh flex-col overflow-y-auto overscroll-contain bg-menu-surface px-gutter pb-[env(safe-area-inset-bottom)] text-menu-foreground ${open ? "" : "pointer-events-none"}`}
    >
      <div className="flex items-center justify-between py-4">
        <span className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span aria-hidden className="size-2.5 rounded-pill bg-accent shadow-glow" />
          Menu
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-11 items-center justify-center rounded-pill border border-glass-line bg-glass"
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-5"
          >
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      </div>

      <nav aria-label="Menu" className="mt-6 flex-1">
        <ol className="flex flex-col">
          {NAV_ITEMS.map((item, index) => (
            <Spring
              key={item.id}
              tag="li"
              enabled={open}
              mode="always"
              from={ROW_FROM}
              to={ROW_TO}
              config={ROW_CONFIG}
              delayIn={index * ROW_STAGGER_MS}
              className="border-b border-line py-4"
            >
              <SectionLink
                id={item.id}
                onNavigate={onClose}
                delayMs={SCROLL_DELAY_MS}
                className="flex items-baseline gap-4 text-headline font-semibold leading-display tracking-tight"
              >
                <span className="text-sm font-normal tabular-nums text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </SectionLink>

              {item.id === SECTION_IDS.services ? (
                <ul className="mt-3 flex flex-col gap-1 pl-10">
                  {SERVICES.items.map((service) => (
                    <li key={service.id}>
                      <SectionLink
                        id={`service-${service.id}`}
                        onNavigate={onClose}
                        delayMs={SCROLL_DELAY_MS}
                        className="block py-1.5 text-base text-muted"
                      >
                        {service.title}
                      </SectionLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Spring>
          ))}
        </ol>
      </nav>

      <Spring
        tag="div"
        enabled={open}
        mode="always"
        from={ROW_FROM}
        to={ROW_TO}
        config={ROW_CONFIG}
        delayIn={NAV_ITEMS.length * ROW_STAGGER_MS}
        className="flex flex-col gap-4 py-8"
      >
        <SectionLink
          id={SECTION_IDS.contact}
          onNavigate={onClose}
          delayMs={SCROLL_DELAY_MS}
          className={`${buttonClass("primary")} w-full`}
        >
          Start a project
        </SectionLink>
        <a
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass("secondary")} w-full`}
        >
          LinkedIn
        </a>
      </Spring>
    </Spring>,
    document.body,
  );
};

/** The phone's menu button and its full-screen panel. */
export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useScrollLock(open);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      // The panel is visible in this render; now focus can move into it.
      closeRef.current?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div className="sm:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex size-11 items-center justify-center rounded-pill border border-glass-line bg-glass"
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-5"
        >
          <path d="M3 7h14M3 13h14" />
        </svg>
      </button>
      <MobileMenuPanel open={open} onClose={close} closeRef={closeRef} />
    </div>
  );
};
