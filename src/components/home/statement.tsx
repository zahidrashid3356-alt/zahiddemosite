import { Headline } from "@/components/ui/headline";
import { Section } from "@/components/ui/section";
import { STATEMENT } from "@/data/home";

/** The one-sentence position, set large — David Langarica's "statement" beat. */
export const Statement = () => {
  const [first, second, third] = STATEMENT.lines;
  return (
    <Section id="approach" label="How I work">
      <Headline tag="p" className="max-w-5xl text-headline">
        {first} {second} <span className="text-accent">{third}</span>
      </Headline>
    </Section>
  );
};
