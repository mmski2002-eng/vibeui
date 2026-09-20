import type { CSSProperties } from "react"

import { Navbar031, type Navbar031Props } from "@/registry/blocks/navbar/navbar-031/navbar-031"
import { Hero031, type Hero031Props } from "@/registry/blocks/hero/hero-031/hero-031"
import { Portfolio012, type Portfolio012Props } from "@/registry/blocks/portfolio/portfolio-012/portfolio-012"
import { Logocloud007, type Logocloud007Props } from "@/registry/blocks/logos/logocloud-007/logocloud-007"
import { About014, type About014Props } from "@/registry/blocks/about/about-014/about-014"
import { Testimonials024, type Testimonials024Props } from "@/registry/blocks/testimonials/testimonials-024/testimonials-024"
import { Contact021, type Contact021Props } from "@/registry/blocks/contact/contact-021/contact-021"
import { Footer030, type Footer030Props } from "@/registry/blocks/footer/footer-030/footer-030"
import { TintShell } from "@/app/scenarios/portfolio/demo/tint-shell"

/**
 * English version of the "Portfolio" demo: same blocks and theme as
 * `app/scenarios/portfolio/demo/page.tsx`, block text in English via props.
 *
 * The page behaves like a living person: a serif name from under a mask,
 * a light that follows the cursor with inertia, typing roles, local time
 * with seconds, projects stacked on scroll, and the whole page tinted by
 * the hovered project (the `vibeui-page:tint` event → TintShell). Grainy
 * paper, ink and ultraviolet.
 */
export const metadata = {
  title: "Danya Lunev — design and front-end",
  description:
    "VibeUI «Portfolio» scenario demo: a serif name, typing roles and a light that follows the cursor, projects stacked on scroll that tint the page, a skills marquee, note-style testimonials, a form with floating labels.",
}

const PAPER = "#efeee9"

const page: CSSProperties = {
  colorScheme: "light",
  background: "var(--vibeui-page-bg)",
  color: "#141414",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
// Block backgrounds are a page variable so the project tint reaches every section.
const paper = { tone: "light", accent: "#5b3df5", ink: "#141414", background: "var(--vibeui-page-bg)" } as const

const PHOTOS = "/demo/portfolio"

const navbar: Navbar031Props = {
  name: "Danya Lunev",
  status: "open to projects from October",
  city: "Tbilisi",
  links: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Words", href: "#words" },
  ],
  actionLabel: "Get in touch",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
}

const hero: Hero031Props = {
  greeting: "hi, I'm",
  name: "Danya Lunev",
  roles: ["I make interfaces", "I write front-end", "I draw design systems", "I build products from scratch"],
  lede: "Designer and developer in one person: from the first sketch to production. I work with early-stage teams — where building matters more than approving.",
  primaryLabel: "See the work",
  secondaryLabel: "Get in touch",
  scrollHint: "scroll",
  badge: "design · front-end · product · ",
}

const work: Portfolio012Props = {
  eyebrow: "selected · 2024—2026",
  title: "Projects I'm not ashamed of",
  projects: [
    { title: "Dashboard for a delivery service", role: "design and front-end", year: "2026", text: "Rebuilt the dispatcher panel: from 14 screens down to 3. Average time per order halved.", tags: ["React", "design system", "maps"], image: `${PHOTOS}/project-01.webp`, href: "#", tint: "#5b3df5" },
    { title: "City walks app", role: "product design", year: "2025", text: "Routes by interest, offline map, a journal. 120k installs in the first season.", tags: ["iOS", "Android", "maps"], image: `${PHOTOS}/project-02.webp`, href: "#", tint: "#2f9e6a" },
    { title: "Design system for a bank", role: "lead designer", year: "2025", text: "Tokens, 60 components, documentation. Four teams migrated within a quarter.", tags: ["Figma", "tokens", "documentation"], image: `${PHOTOS}/project-03.webp`, href: "#", tint: "#e06a3c" },
    { title: "Ceramics shop", role: "all by myself", year: "2024", text: "Site, catalogue, payments — in three weeks. First sale on launch day.", tags: ["Next.js", "e-commerce", "SEO"], image: `${PHOTOS}/project-04.webp`, href: "#", tint: "#c9a14a" },
    { title: "Office info wall", role: "development", year: "2024", text: "A lobby screen showing live company metrics. One WebSocket, zero clicks.", tags: ["visualisation", "WebSocket", "screens"], image: `${PHOTOS}/project-05.webp`, href: "#", tint: "#2a7fd4" },
  ],
  openLabel: "open",
}

const logos: Logocloud007Props = {
  label: "worked with",
  names: ["Yandex Lavka", "Tochka", "Skyeng", "Ozon", "Kukhnya na Rayone", "Samokat", "Tinkoff", "Delivery Club", "Avito", "Cian"],
}

const about: About014Props = {
  eyebrow: "about",
  title: "A designer who can code. Or the other way round",
  text: "Seven years of making products: from a weekend landing page to a design system for four teams. I love early stages, when building matters more than approving, and I'm not afraid to open the terminal myself.",
  imageAlt: "Danya at a desk with a closed laptop",
  imageNote: "Tbilisi, 2026",
  facts: [
    { value: "7", label: "years in products" },
    { value: "40+", label: "projects launched" },
    { value: "3", label: "teams grew out of my mockups" },
  ],
  skillsLabel: "what I work with",
  skills: ["Figma", "React", "Next.js", "TypeScript", "design systems", "prototypes", "research", "animation", "Framer", "Tailwind"],
  pathLabel: "path",
  path: [
    { years: "2024 — now", place: "freelance and partnerships", role: "design + development for startups" },
    { years: "2021 — 2024", place: "Tochka", role: "lead product designer" },
    { years: "2019 — 2021", place: "Smena agency", role: "interface designer" },
  ],
}

const words: Testimonials024Props = {
  eyebrow: "what they say",
  quotes: [
    { text: "Danya did in three weeks what would have taken us six months of approvals. And it still works.", name: "Marina Sokolova", role: "CEO, ceramics shop", project: "shop" },
    { text: "A rare case where the designer knows what state is, and the developer knows what padding is.", name: "Igor Chernykh", role: "CTO, Tochka", project: "design system" },
    { text: "The dispatcher panel stopped being a place people were afraid to open. Now they open it of their own accord.", name: "Alina Guseva", role: "head of operations", project: "delivery" },
  ],
  prevLabel: "Previous testimonial",
  nextLabel: "Next testimonial",
}

const contact: Contact021Props = {
  eyebrow: "contact",
  title: "Got a task? Write to me",
  text: "No managers and no ten-page briefs: a couple of lines about the task — and we'll hop on a call this week. I take two projects at a time, no more.",
  copyLabel: "click to copy",
  copiedLabel: "copied",
  promise: "I reply within a day",
  city: "Tbilisi",
  links: [
    { label: "Telegram", href: "#", handle: "@lunev" },
    { label: "GitHub", href: "#", handle: "danyalunev" },
    { label: "Behance", href: "#", handle: "lunev" },
    { label: "LinkedIn", href: "#", handle: "danya-lunev" },
  ],
  imageAlt: "Danya drawing with a marker on paper",
  nameLabel: "Your name",
  emailLabel: "Email for the reply",
  messageLabel: "What's the task",
  submitLabel: "Send",
  orLabel: "or just email",
  sentTitle: "Message sent",
  sentText: "I'll reply within a day. If it's urgent — write on Telegram.",
}

const footer: Footer030Props = {
  name: "Danya Lunev",
  caption: "design and front-end · Tbilisi",
  links: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Words", href: "#words" },
    { label: "Contact", href: "#contact" },
  ],
  sign: "made by hand, no templates",
  topLabel: "Back to top",
}

export default function PortfolioDemoEn() {
  return (
    <TintShell base={PAPER} style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar031 {...paper} {...navbar} />
      <div id="top">
        <Hero031 {...paper} {...hero} />
      </div>
      <div id="work">
        <Portfolio012 {...paper} {...work} />
      </div>
      <Logocloud007 {...paper} {...logos} />
      <div id="about">
        <About014 {...paper} {...about} image={`${PHOTOS}/portrait.webp`} />
      </div>
      <div id="words">
        <Testimonials024 {...paper} {...words} />
      </div>
      <div id="contact">
        <Contact021 {...paper} {...contact} image={`${PHOTOS}/portrait-02.webp`} />
      </div>
      <Footer030 {...paper} {...footer} />
    </TintShell>
  )
}
