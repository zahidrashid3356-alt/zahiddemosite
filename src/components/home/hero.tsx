import { buttonClass } from "@/components/ui/button-styles";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { SectionLink } from "@/components/ui/section-link";
import { HERO, SECTION_IDS } from "@/data/home";

import { AuditWindow } from "./audit-window";

/**
 * First screen. The `<h1>` is the page's one title and carries the main query
 * ("SEO specialist"); the lead line answers it in the first two sentences. The
 * heading's engine mounts straight away (`lazy={false}`) — it is on the first
 * screen, where a swap from plain text would be visible.
 */
export const Hero = () => (
  <section
    id="top"
    aria-label="Introduction"
    className="relative flex min-h-lvh w-full items-center px-gutter pb-section pt-32 sm:pt-40"
  >
    <div className="mx-auto grid w-full max-w-page items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col items-start">
        <Reveal>
          <Eyebrow>{HERO.eyebrow}</Eyebrow>
        </Reveal>

        <Headline tag="h1" lazy={false} className="mt-8 text-display">
          {HERO.headlineLead}{" "}
          <span className="text-accent">{HERO.headlineAccent}</span>
        </Headline>

        <Reveal tag="p" delayIn={200} className="mt-8 max-w-2xl text-lead text-muted">
          {HERO.lead}
        </Reveal>

        <Reveal delayIn={300} className="mt-10 flex flex-wrap gap-4">
          <SectionLink id={SECTION_IDS.contact} className={buttonClass("primary")}>
            {HERO.primaryCta}
          </SectionLink>
          <SectionLink id={SECTION_IDS.work} className={buttonClass("secondary")}>
            {HERO.secondaryCta}
          </SectionLink>
        </Reveal>

        <Reveal delayIn={400} className="mt-14">
          <p className="text-sm text-muted">{HERO.marketsLabel}</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-base">
            {HERO.markets.map((market) => (
              <li key={market}>{market}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <AuditWindow />
    </div>
  </section>
);
