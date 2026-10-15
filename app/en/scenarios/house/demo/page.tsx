import type { CSSProperties } from "react"

import { Navbar046 } from "@/registry/blocks/navbar/navbar-046/navbar-046"
import { Hero049 } from "@/registry/blocks/hero/hero-049/hero-049"
import { House001 } from "@/registry/blocks/industry/house-001/house-001"
import { House002 } from "@/registry/blocks/industry/house-002/house-002"
import { House003 } from "@/registry/blocks/industry/house-003/house-003"
import { House004 } from "@/registry/blocks/industry/house-004/house-004"
import { House005 } from "@/registry/blocks/industry/house-005/house-005"
import { Testimonials036 } from "@/registry/blocks/testimonials/testimonials-036/testimonials-036"
import { Faq025 } from "@/registry/blocks/faq/faq-025/faq-025"
import { Cta038 } from "@/registry/blocks/cta/cta-038/cta-038"
import { Footer045 } from "@/registry/blocks/footer/footer-045/footer-045"

/**
 * English version of the "Glulam timber homes" demo: same blocks and theme
 * as `app/scenarios/house/demo/page.tsx`, block text in English via props.
 */
export const metadata = {
  title: "Pine — turnkey glulam timber homes at a fixed price",
  description:
    "VibeUI «Glulam timber homes» scenario demo: a project slider, a catalog with an area filter, a cost calculator, timber technology, construction stages, built homes, homeowner reviews, FAQ and a request form.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0e0f10",
  color: "#f2efe9",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// A "mockup" presentation: a blurred house photo behind the page, sections
// float on top as separate rounded cards. overflow:clip rather than hidden,
// otherwise the sticky scenes inside blocks would stop working.
const card = "house-card relative mb-3 overflow-clip rounded-[1.75rem] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] sm:mb-4 sm:rounded-[2.25rem]"

const night = { tone: "dark", accent: "#e8a35c", ink: "#f2efe9" } as const

const navbar046 = {
  brand: "Pine",
  tagline: "glulam timber homes",
  links: [
    {
      label: "Projects",
      href: "#projects",
    },
    {
      label: "Pricing",
      href: "#calc",
    },
    {
      label: "Technology",
      href: "#tech",
    },
    {
      label: "Stages",
      href: "#stages",
    },
    {
      label: "Built homes",
      href: "#built",
    },
  ],
  phone: "+1 (604) 555-0142",
  ctaLabel: "Discuss a house",
  menuLabel: "Menu",
  homeLabel: "Home",
} as const

const hero049 = {
  title: "Homes built from glulam",
  subtitle: "timber — from blueprint to keys in six months",
  currency: "$",
  locale: "en-US",
  ctaLabel: "View project",
  asideLabel: "Find a project by size and budget",
  prevLabel: "Previous project",
  nextLabel: "Next project",
  slidesLabel: "Projects",
  imageAlt: "Glulam house {code}",
  slides: [
    {
      image: "/demo/house/hero-01.webp",
      code: "PH-242",
      area: "2,600 sq ft",
      specs: "2 floors · 4 bedrooms · double height",
      price: 1290000,
      priceNote: "turnkey, with utilities",
      href: "#projects",
    },
    {
      image: "/demo/house/hero-02.webp",
      code: "PH-160",
      area: "1,720 sq ft",
      specs: "1 floor · 3 bedrooms · 520 sq ft deck",
      price: 735000,
      priceNote: "turnkey, with utilities",
      href: "#projects",
    },
    {
      image: "/demo/house/hero-03.webp",
      code: "BH-138",
      area: "1,485 sq ft",
      specs: "1 floor · 3 bedrooms · barnhouse",
      price: 649000,
      priceNote: "turnkey, with utilities",
      href: "#projects",
    },
    {
      image: "/demo/house/hero-04.webp",
      code: "PH-198",
      area: "2,130 sq ft",
      specs: "2 floors · 4 bedrooms · sauna",
      price: 1035000,
      priceNote: "turnkey, with utilities",
      href: "#projects",
    },
  ],
} as const

const house001 = {
  eyebrow: "Project catalog",
  title: "Which house is yours?",
  allLabel: "All projects",
  foundLabel: "Found",
  openLabel: "View project",
  areaUnit: "m²",
  filtersLabel: "House area",
  emptyText: "No projects in this range yet — we will design one for you.",
  filters: [
    {
      label: "All sizes",
    },
    {
      label: "Under 150 m²",
      max: 150,
    },
    {
      label: "150–200 m²",
      min: 150,
      max: 200,
    },
    {
      label: "Over 200 m²",
      min: 200,
    },
  ],
  projects: [
    {
      code: "PH-86",
      image: "/demo/house/p-01.webp",
      area: 86,
      floors: "1 floor",
      bedrooms: "2 bedrooms",
      price: "$342,000",
      priceNote: "house kit",
      href: "#calc",
    },
    {
      code: "PH-160",
      image: "/demo/house/p-02.webp",
      area: 160,
      floors: "1 floor",
      bedrooms: "3 bedrooms",
      price: "$735,000",
      priceNote: "turnkey",
      badge: "Bestseller",
      href: "#calc",
    },
    {
      code: "PH-242",
      image: "/demo/house/p-03.webp",
      area: 242,
      floors: "2 floors",
      bedrooms: "4 bedrooms",
      price: "$1,290,000",
      priceNote: "turnkey",
      href: "#calc",
    },
    {
      code: "GH-64",
      image: "/demo/house/p-04.webp",
      area: 64,
      floors: "1 floor",
      bedrooms: "sauna + guest room",
      price: "$244,000",
      priceNote: "turnkey",
      badge: "Sauna house",
      href: "#calc",
    },
    {
      code: "PH-198",
      image: "/demo/house/p-05.webp",
      area: 198,
      floors: "2 floors",
      bedrooms: "4 bedrooms",
      price: "$1,035,000",
      priceNote: "turnkey",
      href: "#calc",
    },
    {
      code: "BH-138",
      image: "/demo/house/p-06.webp",
      area: 138,
      floors: "1 floor",
      bedrooms: "3 bedrooms",
      price: "$649,000",
      priceNote: "turnkey",
      badge: "New",
      href: "#calc",
    },
  ],
} as const

const house002 = {
  eyebrow: "Pricing",
  title: "Price your house in a minute",
  lede: "The price is fixed in the contract and does not grow during construction. The calculator uses this season's prices.",
  areaLabel: "House area",
  packageLabel: "Package",
  foundationLabel: "Foundation",
  roofLabel: "Roof",
  totalLabel: "Estimated cost",
  perMeterLabel: "Per m²",
  termLabel: "Term",
  weekShort: "wk",
  currency: "$",
  locale: "en-US",
  areaUnit: "m²",
  submitLabel: "Send estimate",
  sentLabel: "Estimate added to the form ↓",
  note: "An exact quote after a free site visit.",
  packages: [
    {
      label: "House kit",
      note: "timber, rafters, assembly on the foundation",
      rate: 2250,
      weeks: 10,
    },
    {
      label: "Weather-tight shell",
      note: "+ roof, windows, doors, insulation",
      rate: 3050,
      weeks: 16,
    },
    {
      label: "Turnkey",
      note: "+ utilities, finishing, plumbing",
      rate: 4200,
      weeks: 26,
    },
  ],
  foundations: [
    {
      label: "Screw piles",
      rate: 150,
    },
    {
      label: "Strip footing",
      rate: 310,
    },
    {
      label: "Insulated slab",
      rate: 440,
    },
  ],
  roofs: [
    {
      label: "Asphalt shingles",
      rate: 180,
    },
    {
      label: "Metal tiles",
      rate: 140,
    },
    {
      label: "Standing seam",
      rate: 270,
    },
  ],
} as const

const house003 = {
  eyebrow: "Technology",
  title: "Timber that does not shrink or crack",
  lede: "Glulam is not a log. Five kiln-dried lamellas glued with opposing grain: geometry that lasts decades and moving in without a year of settling.",
  image: "/demo/house/tech.webp",
  imageAlt: "Glulam beam cross-section",
  imageCaption: "section 200 × 280",
  facts: [
    {
      value: "5",
      label: "lamellas per section",
      text: "Glued with opposing grain — the beam does not warp or twist.",
    },
    {
      value: "12%",
      label: "factory moisture",
      text: "Kiln drying: the house does not settle or crack.",
    },
    {
      value: "<1%",
      label: "shrinkage in year one",
      text: "We start finishing right away, no year of waiting.",
    },
    {
      value: "×1.7",
      label: "warmer than a log",
      text: "A tight tongue-and-groove joint with insulation inside.",
    },
    {
      value: "6 mo",
      label: "from blueprint to keys",
      text: "The kit is made at the plant while the foundation is poured.",
    },
  ],
} as const

const house004 = {
  eyebrow: "How we build",
  title: "Seven stages from plot to keys",
  total: "24 wk",
  totalLabel: "turnkey on average",
  stages: [
    {
      title: "Design and estimate",
      weeks: "2 weeks",
      text: "We fit the project to your plot, calculate loads and fix the price in the contract. It does not change after that.",
      image: "/demo/house/p-03.webp",
    },
    {
      title: "Foundation",
      weeks: "3 weeks",
      text: "Soil survey, layout, piles or a slab. While the concrete cures, the plant cuts your house kit.",
      image: "/demo/house/stage-01.webp",
    },
    {
      title: "House kit",
      weeks: "4 weeks",
      text: "Timber is CNC-cut to the project with millimetre precision, numbered and delivered wrapped in film.",
      image: "/demo/house/stage-02.webp",
    },
    {
      title: "Wall assembly",
      weeks: "3 weeks",
      text: "The timber goes together like a kit: tongue into groove, insulation in the joint, dowels every five feet.",
      image: "/demo/house/stage-03.webp",
    },
    {
      title: "Roof and windows",
      weeks: "4 weeks",
      text: "Rafters, insulation, standing seam or shingles. Panoramic windows sit on sliding supports for settling.",
      image: "/demo/house/stage-04.webp",
    },
    {
      title: "Utilities and finishing",
      weeks: "8 weeks",
      text: "Wiring in conduit, underfloor heating, plumbing, sanding and hardwax oil. A photo report every week.",
      image: "/demo/house/stage-05.webp",
    },
    {
      title: "Keys",
      weeks: "one day",
      text: "We hand over by an acceptance act with the house passport and a 10-year structural warranty.",
      image: "/demo/house/stage-06.webp",
    },
  ],
} as const

const house005 = {
  eyebrow: "Built homes",
  title: "People already live in them",
  prevLabel: "Back",
  nextLabel: "Forward",
  galleryLabel: "Built homes",
  homes: [
    {
      image: "/demo/house/built-01.webp",
      place: "Lake Ladoga shore",
      year: "2025",
      area: "212 m²",
      code: "PH-212",
    },
    {
      image: "/demo/house/built-02.webp",
      place: "Istra, Moscow region",
      year: "2024",
      area: "138 m²",
      code: "BH-138",
    },
    {
      image: "/demo/house/built-03.webp",
      place: "Valdai Hills",
      year: "2025",
      area: "176 m²",
      code: "PH-176",
    },
    {
      image: "/demo/house/built-04.webp",
      place: "Sortavala, Karelia",
      year: "2023",
      area: "242 m²",
      code: "PH-242",
    },
  ],
  stats: [
    {
      value: 214,
      label: "homes delivered",
    },
    {
      value: 11,
      label: "years building with glulam",
    },
    {
      value: 14,
      label: "regions",
    },
    {
      value: 0,
      suffix: " $",
      label: "over the contract price",
    },
  ],
} as const

const testimonials036 = {
  eyebrow: "Reviews",
  title: "In the words of those who live there",
  prevLabel: "Previous review",
  nextLabel: "Next review",
  reviewLabel: "Review",
  reviews: [
    {
      quote:
        "We moved in in October, and by January we understood the main thing: at minus thirty the house is quiet and warm, and it smells of wood, not paint. Not a cent over the estimate.",
      name: "Andrew and Mary",
      meta: "living here 3 years · Priozersk",
      image: "/demo/house/review-01.webp",
      project: "PH-198",
    },
    {
      quote:
        "They built it while we lived in another city. Every Friday — a photo report and a short video. We came once for the foundation and the second time to collect the keys.",
      name: "Olga Savelyeva",
      meta: "living here 2 years · Valdai",
      image: "/demo/house/review-02.webp",
      project: "PH-160",
    },
    {
      quote:
        "Not a single crack in the timber, no door got stuck. A year later we called the crew for the warranty check — they tightened a couple of dowels for free.",
      name: "Igor Vetrov",
      meta: "living here 4 years · Istra",
      image: "/demo/house/review-03.webp",
      project: "BH-138",
    },
  ],
} as const

const faq025 = {
  eyebrow: "Questions",
  title: "What people usually ask",
  cardTitle: "Didn't find an answer?",
  cardText:
    "An engineer replies in the messenger within 15 minutes during working hours.",
  cardLabel: "Ask an engineer",
  cardHref: "#contact",
  items: [
    {
      question: "Does glulam timber shrink?",
      answer:
        "Under 1% in the first year — versus 5–8% for green logs. So windows, doors and finishing go in right away, not a year later.",
    },
    {
      question: "Can you build in winter?",
      answer:
        "Yes, winter is the best time for assembly: the timber does not absorb moisture and machinery drives easily on frozen ground. Pile foundations work in any season.",
    },
    {
      question: "Do you work with mortgages?",
      answer:
        "We are accredited with major banks: construction loans with staged payments through escrow, and a down payment from 15%.",
    },
    {
      question: "What does turnkey include?",
      answer:
        "Foundation, house kit and assembly, roof, windows and doors, wiring, heating, water supply and sewerage, wall sanding and coating, finished floors and plumbing.",
    },
    {
      question: "What is the warranty?",
      answer:
        "10 years on the structure and 3 years on utilities. A year after handover we come for a free seasonal inspection.",
    },
    {
      question: "Can a ready project be changed?",
      answer:
        "Yes: move walls, add a deck or a double-height living room. Changes up to 15% of the area come without a design fee.",
    },
  ],
} as const

const cta038 = {
  eyebrow: "Discuss a house",
  title: "Your house by the water — this autumn",
  lede: "Leave your phone: an engineer will call back, match a project to your plot and budget and invite you to tour a finished home.",
  image: "/demo/house/cta.webp",
  phoneLabel: "Phone",
  phonePlaceholder: "+1 (___) ___-____",
  channelsLabel: "How to reach you",
  channels: ["Call", "Telegram", "WhatsApp"],
  submitLabel: "Discuss my house",
  successTitle: "Request received",
  successText: "An engineer will contact you within 15 minutes.",
  estimateLabel: "Your estimate",
  consent:
    "By pressing the button you agree to the processing of personal data.",
} as const

const footer045 = {
  brand: "Pine",
  tagline: "Building glulam timber homes on lakes and in forests since 2015.",
  phone: "+1 (604) 555-0142",
  email: "home@pine.build",
  address: "Showroom: 12 Lakeshore Road, Pine Hills",
  hours: "Daily 9:00–21:00",
  legal: "Pine Homes Ltd · Reg. 4712034567",
  copyright: "© 2026",
  topLabel: "Back to top",
  columns: [
    {
      title: "Homes",
      links: [
        {
          label: "Project catalog",
          href: "#projects",
        },
        {
          label: "Sauna houses",
          href: "#projects",
        },
        {
          label: "Custom project",
          href: "#contact",
        },
      ],
    },
    {
      title: "Company",
      links: [
        {
          label: "Technology",
          href: "#tech",
        },
        {
          label: "Stages",
          href: "#stages",
        },
        {
          label: "Built homes",
          href: "#built",
        },
      ],
    },
    {
      title: "Clients",
      links: [
        {
          label: "Pricing",
          href: "#calc",
        },
        {
          label: "Mortgage",
          href: "#faq",
        },
        {
          label: "Warranty",
          href: "#faq",
        },
      ],
    },
  ],
} as const

export default function HouseDemoEn() {
  return (
    <div style={page} className="relative min-h-dvh px-2 pt-2 pb-1 sm:px-4 sm:pt-4 lg:px-6">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0">
        <img src="/demo/house/hero-01.webp" alt="" className="h-full w-full scale-110 object-cover blur-[6px] brightness-[0.45] saturate-[1.1]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent,rgb(8_9_10/0.85))]" />
      </div>
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.75rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}.house-card::after{content:'';position:absolute;inset:0;z-index:30;padding:1px;border-radius:inherit;background:linear-gradient(170deg,rgb(255 255 255/.32),rgb(255 255 255/.06) 22%,transparent 55%,rgb(232 163 92/.28));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}@supports (animation-timeline:view()){@media (prefers-reduced-motion:no-preference){.house-card:not(#top){animation:house-rise linear both;animation-timeline:view();animation-range:entry 0% entry 40%}}}@keyframes house-rise{from{opacity:.25;transform:translateY(60px) scale(.965);filter:blur(4px)}}`}
      </style>
      <Navbar046 className="house-nav" {...night} {...navbar046} />
      <div id="top" className={card}>
        <Hero049 {...night} {...hero049} />
      </div>
      <div id="projects" className={card}>
        <House001 {...night} {...house001} />
      </div>
      <div id="calc" className={card}>
        <House002 {...night} {...house002} />
      </div>
      <div id="tech" className={card}>
        <House003 {...night} {...house003} />
      </div>
      <div id="stages" className={card}>
        <House004 {...night} {...house004} />
      </div>
      <div id="built" className={card}>
        <House005 {...night} {...house005} />
      </div>
      <div id="reviews" className={card}>
        <Testimonials036 {...night} {...testimonials036} />
      </div>
      <div id="faq" className={card}>
        <Faq025 {...night} {...faq025} />
      </div>
      <div id="contact" className={card}>
        <Cta038 {...night} {...cta038} />
      </div>
      <div className={card}>
        <Footer045 {...night} {...footer045} />
      </div>
    </div>
  )
}
