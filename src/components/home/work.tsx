import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SECTION_IDS, WORK } from "@/data/home";

/**
 * Real clients and the kind of work — no invented results. Four cards sit in a
 * plain grid (no pinned or sideways scroll: there are too few to need it).
 */
export const Work = () => (
  <Section id={SECTION_IDS.work} label="Work">
    <div className="flex flex-col items-start gap-8">
      <Reveal>
        <Eyebrow>{WORK.eyebrow}</Eyebrow>
      </Reveal>
      <Headline className="max-w-4xl text-headline">{WORK.title}</Headline>
    </div>

    <ul className="mt-12 grid gap-6 md:grid-cols-2">
      {WORK.items.map((item, index) => (
        <Reveal
          key={item.client}
          tag="li"
          delayIn={(index % 2) * 120}
          className="relative flex min-h-72 flex-col justify-between overflow-hidden rounded-card border border-glass-line bg-surface-raised p-8 shadow-glow sm:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-1/4 -top-1/2 size-3/4 rounded-pill bg-accent-glow blur-3xl"
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

          <div className="relative mt-12">
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
        </Reveal>
      ))}
    </ul>
  </Section>
);
