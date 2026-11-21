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
  process: "process",
  work: "work",
  faq: "faq",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export interface NavItem {
  label: string;
  /** Section id on this page — rendered as `#id`. */
  id: SectionId;
}

/** The header's links. "Services" opens the mega menu on desktop. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "About", id: SECTION_IDS.about },
  { label: "Services", id: SECTION_IDS.services },
  { label: "Process", id: SECTION_IDS.process },
  { label: "Work", id: SECTION_IDS.work },
  { label: "FAQ", id: SECTION_IDS.faq },
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
  scrollCue: "Scroll",
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

/** The tools and topics strip under the hero — real skills only. */
export const MARQUEE = {
  label: "What I work with",
  rows: [
    [
      "Technical SEO",
      "Google Search Console",
      "GA4",
      "Core Web Vitals",
      "Schema markup",
      "E-E-A-T",
      "Internal linking",
      "Site audits",
    ],
    [
      "WordPress",
      "Next.js",
      "Google Ads",
      "Landing pages",
      "Content strategy",
      "Local SEO",
      "Social media",
      "Graphic design",
    ],
  ],
} as const;

/** One sentence, revealed word by word as it scrolls through. */
export const STATEMENT = {
  text: "I don't sell packages. I find what stops your site from ranking, fix it, and prove it in the data.",
  /** Words from this index on are set in the accent colour. */
  accentFrom: 12,
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
  /** Anchor id suffix: the card is `#service-<id>`, the menu links to it. */
  id: string;
  title: string;
  /** One line for the mega menu. */
  short: string;
  body: string;
}

export const SERVICES = {
  eyebrow: "Services",
  title: "What I can fix for you.",
  items: [
    {
      id: "technical-seo",
      title: "Technical SEO",
      short: "Crawling, indexation, speed, structured data",
      body: "Crawling, indexation, Core Web Vitals, structured data. I audit what is really wrong, rank the findings by impact, and fix them, in your WordPress theme or your Next.js code if needed.",
    },
    {
      id: "content-eeat",
      title: "Content and E-E-A-T",
      short: "Pages that answer the query and earn trust",
      body: "Category and landing pages that answer the query in the first lines, built on the experience and trust signals Google actually checks.",
    },
    {
      id: "analytics-ga4",
      title: "Analytics and GA4 diagnostics",
      short: "Find tracking bugs and traffic anomalies",
      body: "Traffic dropped, or the numbers look wrong? I trace it: tracking bugs, bot spikes, attribution gaps, before anyone decides anything on bad data.",
    },
    {
      id: "websites-ppc",
      title: "Websites and paid search",
      short: "WordPress builds and PPC landing pages",
      body: "WordPress builds designed around speed and conversion, and PPC landing pages that keep Quality Score high instead of fighting it.",
    },
  ] satisfies readonly Service[],
  /** The promo card in the mega menu. */
  menuCta: {
    title: "Not sure what is wrong?",
    body: "Send me the site. I will tell you what I would check first.",
    action: "Start a project",
  },
} as const;

export interface ProcessStep {
  title: string;
  body: string;
  points: readonly string[];
}

/** The pinned scroll-story: one step at a time. */
export const PROCESS = {
  eyebrow: "Process",
  title: "How I work.",
  steps: [
    {
      title: "Audit",
      body: "I crawl the site, read Search Console and GA4, and check what a search engine and a visitor actually get.",
      points: ["Crawl and indexation", "Speed and Core Web Vitals", "Tracking integrity", "Content gaps"],
    },
    {
      title: "Prioritise",
      body: "Every finding is ranked by impact and effort, in plain language. You see what matters first and what can wait.",
      points: ["Impact versus effort", "A written plan", "No jargon", "Nothing padded"],
    },
    {
      title: "Fix",
      body: "I make the changes myself where I can, in WordPress or in code, and hand your developer clear tickets where I can't.",
      points: ["WordPress and Next.js", "Structured data", "Content and internal links", "Clear dev tickets"],
    },
    {
      title: "Measure",
      body: "Results are compared against the same window in Search Console and GA4, so the numbers can be checked, not just believed.",
      points: ["Before and after", "Same-window comparison", "What moved, what didn't", "The next change"],
    },
  ] satisfies readonly ProcessStep[],
} as const;

export interface WorkItem {
  client: string;
  scope: string;
  /** Only where the client's market is known. */
  market?: string;
  /** What the work covered — real scope only. */
  tags: readonly string[];
}

export const WORK = {
  eyebrow: "Work",
  title: "Brands I've worked with.",
  items: [
    {
      client: "JDM Rental Japan",
      scope: "SEO and GA4 diagnostics.",
      market: "Japan",
      tags: ["SEO", "GA4 diagnostics"],
    },
    {
      client: "Samurai Campers",
      scope: "Site audits, E-E-A-T work and GA4 anomaly diagnostics.",
      tags: ["Audits", "E-E-A-T", "GA4 anomalies"],
    },
    {
      client: "Elmridge Carpentry",
      scope: "SEO for a B2B carpentry subcontractor.",
      market: "Ottawa and the GTA, Canada",
      tags: ["B2B SEO", "Local SEO"],
    },
    {
      client: "Cricket Closet",
      scope: "SEO category content for domestic and global markets.",
      tags: ["Category content", "International SEO"],
    },
  ] satisfies readonly WorkItem[],
} as const;

export interface FaqEntry {
  question: string;
  /** Plain text — also used verbatim as the FAQPage JSON-LD answer. */
  answer: string;
}

export const FAQ = {
  eyebrow: "FAQ",
  title: "Questions I get asked.",
  items: [
    {
      question: "How long does SEO take to show results?",
      answer:
        "It depends on the site's starting point and competition, so I won't promise a date. Fixes to crawling and tracking can show up in weeks. Rankings for competitive terms usually take months, and I report what moved against the same period, so you can see it either way.",
    },
    {
      question: "Do you guarantee rankings?",
      answer:
        "No, and be careful with anyone who does. Nobody controls Google's results. What I can promise is a clear audit, honest priorities, correct fixes and reporting you can check.",
    },
    {
      question: "Do you work on WordPress only, or custom sites too?",
      answer:
        "Both. I build and fix WordPress sites directly, and I work with custom and Next.js sites by editing the code or by writing clear tickets for your developer.",
    },
    {
      question: "What do you need from me to start?",
      answer:
        "The site address, and view access to Google Search Console and GA4. If you also run Google Ads, access to that helps me connect paid and organic data.",
    },
    {
      question: "Do you only report problems, or fix them too?",
      answer:
        "I fix them wherever I can: on-page changes, structured data, content, WordPress settings and speed. Where a change needs your developer, I hand over exact, prioritised instructions.",
    },
    {
      question: "Which markets and languages do you work in?",
      answer:
        "I work with brands in Japan, Dubai, Canada and Pakistan, in English. For multi-language and multi-market sites I handle language and region targeting as part of the technical work.",
    },
    {
      question: "How do you report progress?",
      answer:
        "From Search Console and GA4, compared against the same window before the change. I tell you what moved, what didn't, and what I would change next.",
    },
  ] satisfies readonly FaqEntry[],
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
  email: "zahidrashid300@gmail.com",
  /** Digits only, with the country code (`923001234567`) — builds a wa.me link. */
  whatsappNumber: "923356476679",
  linkedin: "https://www.linkedin.com/in/zahid-seo/",
} as const;
