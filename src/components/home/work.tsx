import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SECTION_IDS, WORK } from "@/data/home";

/** Real clients and the kind of work — no invented results. */
export const Work = () => (
  <Section id={SECTION_IDS.work} label="Work">
    <div className="flex flex-col items-start gap-8">
      <Reveal>
        <Eyebrow>{WORK.eyebrow}</Eyebrow>
      </Reveal>
      <Headline className="max-w-4xl text-headline">{WORK.title}</Headline>
    </div>

    <ul className="mt-16 border-t border-line">
      {WORK.items.map((item, index) => (
        <Reveal
          key={item.client}
          tag="li"
          className="grid gap-2 border-b border-line py-8 md:grid-cols-[auto_1.2fr_1fr_0.8fr] md:items-baseline md:gap-8"
        >
          <p className="text-sm tabular-nums text-muted">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="text-title font-semibold leading-snug tracking-tight">
            {item.client}
          </h3>
          <p className="text-base text-muted">{item.scope}</p>
          {"market" in item && item.market ? (
            <p className="text-sm text-muted md:text-right">{item.market}</p>
          ) : null}
        </Reveal>
      ))}
    </ul>
  </Section>
);
