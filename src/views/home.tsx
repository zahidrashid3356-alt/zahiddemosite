import { JsonLd } from "@/components/common/json-ld";
import { RobotProvider, RobotView } from "@/components/common/robot-view";
import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { Services } from "@/components/home/services";
import { Statement } from "@/components/home/statement";
import { Stream } from "@/components/home/stream";
import { Work } from "@/components/home/work";
import { siteConfig } from "@/lib/site";
import {
  getPersonStructuredData,
  jsonLdGraph,
} from "@/utils/seo/structured-data";

/**
 * Home view — a Server Component. Every section is a Server Component too;
 * the motion lives in client leaves (`Headline`, `Reveal`, `AuditWindow`,
 * `Stream`, `ContactForm`) so the HTML is complete before hydration.
 *
 * `robot` is the robot form (obsidian/frontend/robot-form.md): `app/robot-view`
 * renders `<HomeView robot />` for crawlers and lab tools, routed there by the
 * proxy. Same content — the leaves read `useRobot()` and render at rest. Never
 * read `headers()` here: `/` must stay static.
 */
export const HomeView = ({ robot = false }: { robot?: boolean }) => {
  return (
    <RobotProvider robot={robot}>
      {robot && <RobotView />}
      <JsonLd
        data={jsonLdGraph(
          getPersonStructuredData({
            name: siteConfig.name,
            url: "/",
            jobTitle: "SEO Specialist",
            sameAs: siteConfig.organization.sameAs,
          }),
        )}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-gutter focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="relative w-full overflow-x-clip">
        <Stream />
        <Hero />
        <Statement />
        <About />
        <Services />
        <Work />
        <Contact />
      </main>
      <SiteFooter />
    </RobotProvider>
  );
};
