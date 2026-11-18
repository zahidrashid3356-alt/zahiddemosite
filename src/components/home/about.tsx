import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { ABOUT, SECTION_IDS } from "@/data/home";

export const About = () => (
  <Section id={SECTION_IDS.about} label="About">
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
      <div className="flex flex-col items-start gap-8">
        <Reveal>
          <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
        </Reveal>
        <Headline className="text-headline">{ABOUT.title}</Headline>
      </div>

      <div>
        {ABOUT.body.map((paragraph, index) => (
          <Reveal
            key={paragraph}
            tag="p"
            delayIn={index * 120}
            className="mb-6 max-w-3xl text-lead text-muted last:mb-0"
          >
            {paragraph}
          </Reveal>
        ))}

        <Reveal delayIn={240}>
          <ul className="mt-10 flex flex-wrap gap-3">
            {ABOUT.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-pill border border-glass-line bg-glass px-5 py-2 text-sm"
              >
                {skill}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  </Section>
);
