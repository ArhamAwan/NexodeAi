export const siteConfig = {
  name: "Nexode AI",
  shortName: "Nexode AI",
  tagline: "Software that makes investors and customers ask how.",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@nexodeailabs.com",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/nexode",
  social: {
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
    x: process.env.NEXT_PUBLIC_SOCIAL_X,
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
  },
} as const;

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
] as const;

export const hero = {
  headline: "Ship software that makes people ask how.",
  headlines: [
    "Ship software that makes people ask how.",
    "Web. Mobile. AI. Built to convert.",
    "Ambition outgrew the codebase.",
    "Your next version — already live.",
    "From brief to production. Fast.",
  ],
  adsHeadlines: [
    "Ship the product your ambition promised.",
    "Web. Mobile. AI. Built to convert.",
    "Turn a strong idea into trusted software.",
  ],
  subheadline:
    "Nexode AI builds custom web, mobile, and AI products for startups and businesses that need to ship.",
  proof: "Products live for real businesses.",
  primaryCta: "Start a Project",
  secondaryCta: "Book a Call",
  trust: [
    { label: "Products live in production", value: "2+" },
    { label: "Full-stack & AI builds shipped", value: "5+" },
  ],
} as const;

export const capabilityStrip = [
  "Web Apps",
  "Mobile",
  "AI Integrations",
  "Full-Stack",
  "Automation",
  "SaaS Platforms",
  "Realtime Systems",
  "Product Design",
] as const;

export const narrative = {
  label: "The gap",
  headlineLines: ["We close", "that gap."],
  lead: "Great founders changing the world deserve software as powerful as what they're building. Most teams we meet have something significant — but the product experience doesn't show it yet.",
  body: "That gap costs more than velocity. It costs the certainty that customers and investors finally understand what you've built. We take what makes you irreplaceable, shape the product around it, and ship until the world can feel it.",
} as const;

export const services = [
  {
    title: "Custom Web Apps",
    description:
      "Fast, scalable web products — dashboards, SaaS platforms, and customer-facing apps.",
    icon: "web" as const,
  },
  {
    title: "Mobile Apps",
    description:
      "Native-feel iOS and Android experiences that ship with your product roadmap.",
    icon: "mobile" as const,
  },
  {
    title: "Automation & AI Integrations",
    description:
      "Wire LLMs, workflows, and APIs into your ops so the busywork disappears.",
    icon: "ai" as const,
  },
  {
    title: "Full-Stack Product Builds",
    description:
      "From discovery to launch — architecture, UI, backend, and ongoing support.",
    icon: "stack" as const,
  },
] as const;

export type CaseStudy = {
  id: string;
  index: string;
  title: string;
  summary: string;
  metric: string;
  tags: string[];
  problem: string;
  solution: string;
  outcome: string;
  shipped: boolean;
};

export const portfolio: CaseStudy[] = [
  {
    id: "callsflow",
    index: "SS/01",
    title: "CallsFlow",
    summary: "Live call-routing SaaS for insurance agents.",
    metric: "Live in production",
    tags: ["SaaS", "Realtime", "Insurance"],
    problem:
      "Insurance agents were missing inbound leads because call routing was manual, fragmented across phones, and impossible to audit.",
    solution:
      "We built a live call-routing SaaS with smart queues, agent availability, CRM hooks, and a real-time ops dashboard.",
    outcome:
      "Agents pick up more qualified calls; routing decisions are logged end-to-end; the product is live in production.",
    shipped: true,
  },
  {
    id: "croptivize",
    index: "SS/02",
    title: "Croptivize",
    summary: "AgTech AI product for field intelligence.",
    metric: "Investor-ready product demo",
    tags: ["AgTech", "AI", "Product"],
    problem:
      "Growers lacked a clear, actionable signal from field data — insights were buried in spreadsheets and delayed reports.",
    solution:
      "We shipped an AgTech AI product that turns field inputs into recommendations with a clean operator-facing UI.",
    outcome:
      "Faster decisions in the field and a product story investors could demo, not just pitch.",
    shipped: true,
  },
  {
    id: "coming-1",
    index: "SS/03",
    title: "More shipping soon",
    summary: "Next case study landing here.",
    metric: "Coming soon",
    tags: ["Coming soon"],
    problem: "",
    solution: "",
    outcome: "",
    shipped: false,
  },
  {
    id: "coming-2",
    index: "SS/04",
    title: "More shipping soon",
    summary: "Another build in progress.",
    metric: "Coming soon",
    tags: ["Coming soon"],
    problem: "",
    solution: "",
    outcome: "",
    shipped: false,
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    description: "Clarify goals, constraints, and the shortest path to value.",
  },
  {
    step: "02",
    title: "Design",
    description: "Shape UX, architecture, and a build plan you can trust.",
  },
  {
    step: "03",
    title: "Build",
    description: "Ship in tight loops with production-ready engineering.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "Go live, monitor, and keep iterating with you.",
  },
] as const;

export const about = {
  studio:
    "Nexode AI builds custom web, mobile, and AI products for startups and businesses — design, engineering, and launch, without the agency fluff.",
  team: [
    {
      name: "Arham Awan",
      role: "Full Stack Developer",
      bio: "A passionate software engineer blending creativity with code, driven by curiosity and innovation. Always exploring new tech to build impactful digital experiences.",
      email: "arhamtawan@gmail.com",
      image: "/team/arham-awan.png",
    },
    {
      name: "Hashim Ali",
      role: "Full Stack Developer",
      bio: "A results-driven Full Stack Developer known for building seamless, scalable digital solutions. Combines strategic thinking with technical precision to deliver high-impact applications.",
      email: "hashimalinaqvi5@gmail.com",
      image: "/team/hashim-ali.png",
    },
    {
      name: "Maniha Fatima",
      role: "UI/UX Designer",
      bio: "A visionary designer who doesn't just follow trends — she sets them. Known for crafting immersive, high-impact interfaces that turn heads and drive results.",
      email: "manihafatimamalik@gmail.com",
      image: "/team/maniha-fatima.png",
    },
    {
      name: "Muhammad Rayyan",
      role: "3D Animations & Modeling",
      bio: "Brings digital worlds to life with a blend of creativity and code — from 3D animation and modeling to crafting experiences people remember.",
      email: "mrayyansalman69@gmail.com",
      image: "/team/muhammad-rayyan.png",
    },
    {
      name: "Musab Bin Aslam",
      role: "Developer",
      bio: "Builds scalable, user-friendly applications. Skilled in JavaScript, Python, and cloud technologies — turning ideas into clean, efficient code.",
      email: "musabbinaslam6@gmail.com",
      image: "/team/musab-bin-aslam.png",
    },
  ],
} as const;

export const reviews = [
  {
    id: "review-1",
    quote:
      "[PLACEHOLDER — replace with real testimonial] Working with Nexode felt like having a product-minded engineering team inside our company.",
    name: "[PLACEHOLDER Name]",
    role: "[PLACEHOLDER Role / Company]",
    rating: 5,
  },
  {
    id: "review-2",
    quote:
      "[PLACEHOLDER — replace with real testimonial] They shipped faster than we expected and the quality held up in production.",
    name: "[PLACEHOLDER Name]",
    role: "[PLACEHOLDER Role / Company]",
    rating: 5,
  },
  {
    id: "review-3",
    quote:
      "[PLACEHOLDER — replace with real testimonial] Clear communication, strong technical judgment, and zero fluff.",
    name: "[PLACEHOLDER Name]",
    role: "[PLACEHOLDER Role / Company]",
    rating: 5,
  },
] as const;

export const megaCta = {
  lines: ["Ship", "Product"],
  cta: "Start a Project",
} as const;

export const buildTypes = [
  "Web App",
  "Mobile App",
  "Automation",
  "AI Feature",
  "Not sure yet",
] as const;

export const stages = [
  "Idea",
  "Existing Product",
  "Needs Rebuild",
] as const;

export const timelines = ["ASAP", "1–3 months", "Exploring"] as const;
