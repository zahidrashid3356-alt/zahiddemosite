import { buttonClass } from "@/components/ui/button-styles";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { CONTACT, SECTION_IDS } from "@/data/home";

import { ContactForm } from "./contact-form";

/**
 * Closing call to action. The email and WhatsApp buttons render only once
 * their value is set in `src/data/home.ts`; LinkedIn and the form always do.
 */
export const Contact = () => (
  <Section id={SECTION_IDS.contact} label="Contact">
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
      <div className="flex flex-col items-start gap-8">
        <Reveal>
          <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
        </Reveal>
        <Headline className="text-headline">{CONTACT.title}</Headline>
        <Reveal tag="p" delayIn={150} className="max-w-xl text-lead text-muted">
          {CONTACT.body}
        </Reveal>

        <Reveal delayIn={250} className="flex flex-wrap gap-4">
          {CONTACT.email ? (
            <a href={`mailto:${CONTACT.email}`} className={buttonClass("primary")}>
              Email me
            </a>
          ) : null}
          {CONTACT.whatsappNumber ? (
            <a
              href={`https://wa.me/${CONTACT.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("secondary")}
            >
              WhatsApp
            </a>
          ) : null}
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("secondary")}
          >
            LinkedIn
          </a>
        </Reveal>
      </div>

      <Reveal delayIn={150}>
        <ContactForm />
      </Reveal>
    </div>
  </Section>
);
