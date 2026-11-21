import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SECTION_IDS, SERVICES } from "@/data/home";

export const Services = () => (
  <Section id={SECTION_IDS.services} label="Services">
    <div className="flex flex-col items-start gap-8">
      <Reveal>
        <Eyebrow>{SERVICES.eyebrow}</Eyebrow>
      </Reveal>
      <Headline className="max-w-4xl text-headline">{SERVICES.title}</Headline>
    </div>

    <ul className="mt-16 grid gap-6 md:grid-cols-2">
      {SERVICES.items.map((service, index) => (
        <Reveal
          key={service.id}
          tag="li"
          id={`service-${service.id}`}
          delayIn={(index % 2) * 120}
          className="rounded-card border border-glass-line bg-glass p-8 transition-colors duration-[var(--duration-fast)] ease-entrance hover:border-accent sm:p-10"
        >
          <p className="text-sm font-medium tabular-nums text-accent">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-6 text-title font-semibold leading-snug tracking-tight">
            {service.title}
          </h3>
          <p className="mt-4 text-base text-muted">{service.body}</p>
        </Reveal>
      ))}
    </ul>
  </Section>
);
