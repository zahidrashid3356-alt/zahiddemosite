import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { FAQ, SECTION_IDS } from "@/data/home";

import { FaqList } from "./faq-list";

export const Faq = () => (
  <Section id={SECTION_IDS.faq} label="Frequently asked questions">
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
      <div className="flex flex-col items-start gap-8">
        <Reveal>
          <Eyebrow>{FAQ.eyebrow}</Eyebrow>
        </Reveal>
        <Headline className="text-headline">{FAQ.title}</Headline>
      </div>
      <Reveal>
        <FaqList items={FAQ.items} />
      </Reveal>
    </div>
  </Section>
);
