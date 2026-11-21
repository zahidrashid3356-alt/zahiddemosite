import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { SECTION_IDS, WORK } from "@/data/home";

import { WorkTrack } from "./work-track";

/** Real clients and the kind of work — no invented results. */
export const Work = () => (
  <section id={SECTION_IDS.work} aria-label="Work" className="relative w-full">
    <WorkTrack
      count={WORK.items.length}
      heading={
        <div className="flex flex-col items-start gap-8">
          <Eyebrow>{WORK.eyebrow}</Eyebrow>
          <Headline className="max-w-4xl text-headline">{WORK.title}</Headline>
        </div>
      }
    >
      {WORK.items.map((item, index) => (
        <article
          key={item.client}
          className="relative flex h-96 w-80 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-card border border-glass-line bg-surface-raised p-8 md:w-96"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-1/4 -top-1/4 size-3/4 rounded-pill bg-accent-glow blur-3xl"
          />
          <div className="relative flex items-start justify-between gap-4">
            <p className="text-sm tabular-nums text-muted">
              {String(index + 1).padStart(2, "0")} / {String(WORK.items.length).padStart(2, "0")}
            </p>
            {"market" in item && item.market ? (
              <p className="rounded-pill border border-glass-line px-4 py-1.5 text-sm text-muted">
                {item.market}
              </p>
            ) : null}
          </div>

          <div className="relative">
            <h3 className="text-title font-semibold leading-snug tracking-tight">{item.client}</h3>
            <p className="mt-3 text-base text-muted">{item.scope}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li key={tag} className="rounded-pill bg-glass px-4 py-1.5 text-sm">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </WorkTrack>
  </section>
);
