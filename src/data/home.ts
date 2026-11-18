/**
 * Copy for the home page — every string the sections render. Content lives here
 * (props, not hardcoded in markup); change a line here, not in a component.
 *
 * Only say what is true: clients and the kind of work are real, there are no
 * invented results, rankings or percentages. Add a number only when it can be
 * shown to a client who asks for the proof.
 */

export const SECTION_IDS = {
  about: "about",
  services: "services",
  work: "work",
  contact: "contact",
} as const;

export interface NavItem {
  label: string;
  /** Section id on this page — rendered as `#id`. */
  id: (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "About", id: SECTION_IDS.about },
  { label: "Services", id: SECTION_IDS.services },
  { label: "Work", id: SECTION_IDS.work },
];

export const HERO = {
  eyebrow: "SEO · WordPress · PPC",
  /** The page's one <h1>. The accent word is rendered in the brand colour. */
  headlineLead: "SEO specialist for sites that need to",
  headlineAccent: "rank.",
  lead: "Technical SEO, content and GA4 diagnostics for brands in Japan, Dubai, Canada and Pakistan. I find what is holding your site back, fix it, and show you the data.",
  primaryCta: "Start a project",
  secondaryCta: "See the work",
  markets: ["Japan", "Dubai", "Canada", "Pakistan"],
  marketsLabel: "Working with brands in",
} as const;

/** The glass window in the hero — the order an audit goes in. No results. */
export const AUDIT_WINDOW = {
  title: "What I check first",
  items: [
    "Crawl and indexation",
    "Core Web Vitals",
    "Structured data and entities",
    "Content and E-E-A-T gaps",
    "GA4 tracking integrity",
    "Internal linking",
  ],
} as const;

export const STATEMENT = {
  lines: [
    "I don't sell packages.",
    "I find what stops your site from ranking,",
    "fix it, and prove it in the data.",
  ],
} as const;

export const ABOUT = {
  eyebrow: "About",
  title: "Hey, I'm Zahid.",
  body: [
    "I'm an SEO specialist based in Pakistan, working with brands in Japan, Dubai, Canada and at home. My background is wider than search: I build in WordPress, run paid campaigns and design, so I see how a ranking problem is also a speed problem, a design problem or a tracking problem.",
    "That is the point. An SEO fix that slows the site down, or a page that ranks but confuses people, is not a fix. I work on all of it together and tell you plainly when something is weak.",
  ],
  skills: [
    "Technical SEO",
    "Content and E-E-A-T",
    "GA4 and analytics",
    "WordPress",
    "PPC",
    "Graphic design",
    "Social media",
  ],
} as const;

export interface Service {
  title: string;
  body: string;
}

export const SERVICES = {
  eyebrow: "Services",
  title: "What I can fix for you.",
  items: [
    {
      title: "Technical SEO",
      body: "Crawling, indexation, Core Web Vitals, structured data. I audit what is really wrong, rank the findings by impact, and fix them, in your WordPress theme or your Next.js code if needed.",
    },
    {
      title: "Content and E-E-A-T",
      body: "Category and landing pages that answer the query in the first lines, built on the experience and trust signals Google actually checks.",
    },
    {
      title: "Analytics and GA4 diagnostics",
      body: "Traffic dropped, or the numbers look wrong? I trace it: tracking bugs, bot spikes, attribution gaps, before anyone decides anything on bad data.",
    },
    {
      title: "Websites and paid search",
      body: "WordPress builds designed around speed and conversion, and PPC landing pages that keep Quality Score high instead of fighting it.",
    },
  ] satisfies readonly Service[],
} as const;

export interface WorkItem {
  client: string;
  scope: string;
  /** Only where the client's market is known. */
  market?: string;
}

export const WORK = {
  eyebrow: "Work",
  title: "Brands I've worked with.",
  items: [
    {
      client: "JDM Rental Japan",
      scope: "SEO and GA4 diagnostics",
      market: "Japan",
    },
    {
      client: "Samurai Campers",
      scope: "Audits, E-E-A-T and GA4 anomaly diagnostics",
    },
    {
      client: "Elmridge Carpentry",
      scope: "SEO for a B2B carpentry subcontractor",
      market: "Ottawa and the GTA, Canada",
    },
    {
      client: "Cricket Closet",
      scope: "SEO category content for domestic and global markets",
    },
  ] satisfies readonly WorkItem[],
} as const;

export const CONTACT = {
  eyebrow: "Contact",
  title: "Make it rank.",
  body: "Tell me about your site and where it is stuck. I will reply with what I would check first.",
  /**
   * TODO(contact): fill these in before launch — a button only renders when its
   * value is set, so nothing broken ships meanwhile. The form below works
   * without them (it posts to /api/contact; set CONTACT_ENDPOINT to forward
   * leads to a CRM or webhook, or it is only logged server-side).
   */
  email: "",
  /** Digits only, with the country code (`923001234567`) — builds a wa.me link. */
  whatsappNumber: "",
  linkedin: "https://www.linkedin.com/in/zahid-seo/",
} as const;
