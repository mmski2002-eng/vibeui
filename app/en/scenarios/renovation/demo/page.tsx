import type { CSSProperties } from "react"

import { Navbar037, type Navbar037Props } from "@/registry/blocks/navbar/navbar-037/navbar-037"
import { Hero037, type Hero037Props } from "@/registry/blocks/hero/hero-037/hero-037"
import { Renovation001, type Renovation001Props } from "@/registry/blocks/industry/renovation-001/renovation-001"
import { Renovation002, type Renovation002Props } from "@/registry/blocks/industry/renovation-002/renovation-002"
import { Renovation003, type Renovation003Props } from "@/registry/blocks/industry/renovation-003/renovation-003"
import { Renovation004, type Renovation004Props } from "@/registry/blocks/industry/renovation-004/renovation-004"
import { Comparison010, type Comparison010Props } from "@/registry/blocks/pricing/comparison-010/comparison-010"
import { People017, type People017Props } from "@/registry/blocks/team/people-017/people-017"
import { Testimonials029, type Testimonials029Props } from "@/registry/blocks/testimonials/testimonials-029/testimonials-029"
import { Cta030, type Cta030Props } from "@/registry/blocks/cta/cta-030/cta-030"
import { Footer036, type Footer036Props } from "@/registry/blocks/footer/footer-036/footer-036"

/**
 * English version of the "Apartment renovation" demo: same blocks and
 * theme as `app/scenarios/renovation/demo/page.tsx`, block text in English
 * via props.
 *
 * The site as a working drawing: light concrete and dark-blue graph
 * paper, a signal-yellow accent, mono digits. The floor plan draws itself
 * in lines, the estimate is calculated with a slider and goes into the
 * request form, stages ride along a Gantt chart on scroll, projects are
 * compared with a curtain, the live site updates from today's date.
 */
export const metadata = {
  title: "Level — apartment renovation with a fixed estimate and a deadline on the calendar",
  description:
    "VibeUI «Apartment renovation» scenario demo: a hero with a floor plan, an estimate calculator, stages as a Gantt chart, before/after projects, live site updates, a comparison with a typical crew, the crew, acceptance reports and a one-field request form.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#eceae5",
  color: "#141a24",
  fontFamily: '"Onest",ui-sans-serif,system-ui,sans-serif',
}

// Two sheet themes: light concrete for the body and dark-blue graph paper
// for the hero, the live site and the footer. One accent: signal yellow.
const concrete = { tone: "light", accent: "#ffd60a", ink: "#141a24", background: "#eceae5" } as const
const blueprint = { tone: "dark", accent: "#ffd60a", ink: "#eef2f7", background: "#0e1c36" } as const

const PHOTOS = "/demo/renovation"

const navbar: Navbar037Props = {
  brand: "Level",
  caption: "apartment renovation · since 2011",
  links: [
    { label: "Estimate", href: "#calc" },
    { label: "Stages", href: "#stages" },
    { label: "Projects", href: "#works" },
    { label: "Live site", href: "#online" },
    { label: "Crew", href: "#team" },
  ],
  actionLabel: "Get an estimate",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
}

const hero: Hero037Props = {
  eyebrow: "Turnkey apartment renovation · Moscow",
  title: "Renovation where *all is level*",
  measure: "± 1 mm",
  lede: "The estimate is fixed in the contract, the deadline is on the calendar, the site is in your phone. Delivered on time 14 years running.",
  primaryLabel: "Get an estimate",
  secondaryLabel: "See the projects",
  facts: ["312 projects delivered", "0 days of delay", "the price doesn't change after signing"],
  rooms: [
    { name: "Hallway", area: 8.2, x: 20, y: 20, w: 160, h: 120, note: "built-in wardrobe to the ceiling" },
    { name: "Bathroom", area: 5.4, x: 180, y: 20, w: 100, h: 120, note: "60×120 tiles, underfloor heating" },
    { name: "Kitchen", area: 12.3, x: 280, y: 20, w: 160, h: 120, note: "wet zone relocation approved" },
    { name: "Living room", area: 24.6, x: 20, y: 140, w: 240, h: 260, note: "two windows, engineered wood" },
    { name: "Bedroom", area: 16.8, x: 260, y: 140, w: 180, h: 260, note: "soundproofing on the shared wall" },
    { name: "Kids' room", area: 13.1, x: 440, y: 20, w: 180, h: 200, note: "cork floor, sockets at 30 cm" },
    { name: "Study", area: 11.6, x: 440, y: 220, w: 180, h: 180, note: "a separate line for equipment" },
  ],
  stamp: [
    ["Project", "3-room apartment, 92.0 m²"],
    ["Stage", "Working drawings"],
    ["Scale", "1:100"],
    ["Sheet", "1 of 12"],
  ],
  areaUnit: "m²",
  decimalSeparator: ".",
  planLabel: "Floor plan, {area}",
  hintLine: "Hover over a room. Total {area}, {n} rooms.",
}

const calculator: Renovation001Props = {
  eyebrow: "An estimate in a minute",
  title: "Price your renovation without calling anyone",
  lede: "Move the area, pick the type and the options. The number in the estimate is the one that goes into the contract: we don't recalculate after measuring.",
  types: [
    { id: "cosmetic", name: "Cosmetic", rate: 8900, baseWeeks: 2, weeksPer10: 0.5, note: "wallpaper, paint, floors" },
    { id: "major", name: "Major", rate: 17900, baseWeeks: 5, weeksPer10: 0.8, note: "down to concrete, all utilities" },
    { id: "design", name: "Designer", rate: 29500, baseWeeks: 7, weeksPer10: 1.1, note: "to a project, with author's supervision" },
  ],
  options: [
    { id: "electric", name: "Electrics from scratch", perM2: 1800, weeks: 1 },
    { id: "screed", name: "Floor screed", perM2: 1300, weeks: 1 },
    { id: "warm", name: "Underfloor heating", perM2: 2100, weeks: 0.5 },
    { id: "replan", name: "Replanning", fixed: 65000, weeks: 2 },
    { id: "project", name: "Design project", perM2: 2400, weeks: 1 },
    { id: "trash", name: "Waste removal", fixed: 19000 },
  ],
  saveLabel: "Save the estimate",
  savedLabel: "Estimate saved",
  fine: "Labour without materials. The exact estimate comes after a free measurement, but it won't be higher than this one.",
  weekUnits: ["week", "weeks", "weeks"],
  areaUnit: "m²",
  areaLabel: "Apartment area",
  typeLabel: "Renovation type",
  fromLabel: "from",
  optionsLabel: "Options",
  chosenLine: "{n} selected",
  nothingChosen: "nothing selected",
  sheetLabel: "Estimate No. {n}",
  draftLabel: "preliminary",
  sheetAreaLabel: "Area",
  totalLabel: "Total labour",
  perLabel: "per",
  termLabel: "Turnkey time",
}

const stages: Renovation002Props = {
  eyebrow: "Work stages",
  title: "12 weeks by the calendar, not «as it goes»",
  lede: "Scroll — the marker moves through the weeks the way the site does. Every stage starts on its own date, and you see it in the contract.",
  stages: [
    { name: "Demolition", start: 0, weeks: 1, text: "We strip everything down to concrete and remove the waste the same day. Neighbours get a letter three days ahead.", crew: "Igor + 3" },
    { name: "Partitions", start: 1, weeks: 1.5, text: "New walls from tongue-and-groove blocks per the approved replanning. Openings are reinforced.", crew: "Igor + 2" },
    { name: "Electrics, rough", start: 2, weeks: 2, text: "Chases, cable in conduit, a 36-module panel. Every line is tested and labelled.", crew: "Dmitry" },
    { name: "Plumbing, rough", start: 2.5, weeks: 1.5, text: "Water and sewage runs, manifolds, pressure test at 10 bar.", crew: "Artem" },
    { name: "Screed and plaster", start: 4, weeks: 2, text: "Semi-dry screed, plaster on guides. Two weeks later we check moisture with a meter.", crew: "Marat + 2" },
    { name: "Tiling", start: 6, weeks: 2, text: "Bathrooms and kitchen. 1.5 mm joints, levelling clips, 45° corners.", crew: "Rinat" },
    { name: "Ceilings and painting", start: 7, weeks: 2.5, text: "Three coats of filler, sanding under a lamp, two coats of paint with a roller.", crew: "Olga + 1" },
    { name: "Floors and doors", start: 9.5, weeks: 1.5, text: "Engineered wood on underlay, matching skirting, doors and architraves.", crew: "Marat" },
    { name: "Finishing and handover", start: 11, weeks: 1, text: "Sockets, lights, sanitaryware, cleaning. We sign the report — only if you're happy.", crew: "the whole crew" },
  ],
  hereLabel: "you are here",
  fine: "A sample schedule for a 54 m² major renovation. Your schedule — after measuring, the same day.",
  chartLabel: "Work schedule by week",
  cornerLabel: "Stage / week",
  weeksLabel: "weeks {from}–{to}",
  weekShort: "wk",
  stageLine: "Stage {n} of {total}",
  doneLabel: "Project delivered",
  startLabel: "Start",
  crewLabel: "crew: {crew}",
}

const works: Renovation003Props = {
  eyebrow: "Projects",
  title: "Drag the curtain — see the difference",
  lede: "One angle before and after. We shoot the photos ourselves on handover day, no retouching and no «stylist».",
  works: [
    { name: "Two-room on Leninsky", before: `${PHOTOS}/before-01.webp`, after: `${PHOTOS}/after-01.webp`, type: "Major", weeks: 11, price: "1.28M ₽", area: "62 m²", text: "A 1974 panel building. Removed the built-in wardrobes, moved the kitchen into the former pantry, levelled the screed by 4 cm." },
    { name: "Three-room in Skolkovo", before: `${PHOTOS}/before-02.webp`, after: `${PHOTOS}/after-02.webp`, type: "Designer", weeks: 16, price: "3.4M ₽", area: "96 m²", text: "A new build with no finish. Project by the client's studio, we did author's supervision, hidden doors and a curtain recess in the ceiling." },
    { name: "Studio on Taganka", before: `${PHOTOS}/before-03.webp`, after: `${PHOTOS}/after-03.webp`, type: "Cosmetic", weeks: 4, price: "290k ₽", area: "31 m²", text: "For letting: repainted the walls, replaced the laminate, the bathroom got new floor tiles and an inspection hatch." },
  ],
  beforeLabel: "before",
  afterLabel: "after",
  tabsLabel: "Projects",
  weekShort: "wk",
  afterAlt: "{name}: after renovation",
  beforeAlt: "{name}: before renovation",
  sliderLabel: "Before/after curtain",
  areaLabel: "Area",
  typeLabel: "Type",
  termLabel: "Time",
  worksLabel: "Labour",
}

const online: Renovation004Props = {
  eyebrow: "Live site",
  title: "You see the site every day, not «when you come by»",
  lede: "The foreman posts a report with photos every evening, the on-site camera runs around the clock. This is what the client's dashboard looks like right now.",
  object: "Three-room on Polezhaevskaya, 78 m²",
  stage: "Tiling, painting",
  next: "Floors — from Monday",
  reports: [
    { day: 38, time: "09:40", title: "Grouting in the guest bathroom", text: "Rinat finished tiling the walls, epoxy grout today. The hatch under the bath is an inspection one, 30×40, hidden.", photo: `${PHOTOS}/site-01.webp`, by: "Igor, foreman" },
    { day: 37, time: "18:10", title: "Heating pressure test — 10 bar, holding", text: "An hour and a half under pressure, no drop. Report signed, gauge photo in the chat.", by: "Artem, plumber" },
    { day: 36, time: "12:25", title: "Engineered wood delivered", text: "Oak «Natur», 28 boxes, acclimatising in the bedroom. Screed moisture 2.1% — can lay from Monday.", photo: `${PHOTOS}/site-02.webp`, by: "Igor, foreman" },
    { day: 34, time: "17:00", title: "Second coat of filler in the living room", text: "Sanding under a lamp tomorrow, primer for paint on Thursday. Colour NCS S 1002-Y — sample on the wall by the window.", by: "Olga, painter" },
    { day: 41, time: "10:00", title: "Laying the floor in the bedroom and study", text: "Floating on 2 mm underlay, 10 mm gap at the walls.", by: "plan" },
    { day: 45, time: "10:00", title: "Door installation", text: "Six concealed-frame leaves, the frames are already in.", by: "plan" },
  ],
  camLabel: "camera live",
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  loadingLabel: "loading",
  dayLine: "day {day} of {total}",
  startLabel: "Start",
  endLabel: "Handover",
  nowLabel: "Now",
  nextLabel: "Next",
  feedLabel: "Reports from the site",
  dayLabel: "day {n}",
  plannedLabel: "planned",
}

const why: Comparison010Props = {
  eyebrow: "Why us",
  title: "How we differ from «a crew from an ad»",
  lede: "Not promises — contract clauses. Every line can be checked before signing.",
  stats: [
    { value: 312, label: "projects delivered" },
    { value: 0, label: "days of delay in 14 years" },
    { value: 100, label: "of estimates didn't grow after signing", suffix: "%" },
  ],
  usLabel: "Level",
  themLabel: "A typical crew",
  rows: [
    { criterion: "Price fixed in the contract", us: true, them: "«roughly»" },
    { criterion: "Deadline on the calendar with stage dates", us: true, them: false },
    { criterion: "Penalty for delay — 0.5% per day", us: true, them: false },
    { criterion: "Daily photo report and a camera", us: true, them: "on request" },
    { criterion: "Hidden work accepted with a report", us: true, them: false },
    { criterion: "Site cleaned every evening", us: true, them: false },
    { criterion: "Warranty", us: "5 years", them: "verbal" },
    { criterion: "Payment by stage, no 50% upfront", us: true, them: false },
  ],
  fine: "An excerpt from the standard contract, 2026 edition. Full text on request before measuring.",
  yesLabel: "yes",
  noLabel: "no",
  criterionLabel: "Criterion",
}

const crew: People017Props = {
  eyebrow: "Crew",
  title: "Our own people, not «whoever's free»",
  lede: "Six people who have worked together for over seven years. No subcontracting: on site are those whose names are in the contract.",
  people: [
    { name: "Igor Savelyev", role: "Foreman, crew lead", years: 14, objects: 312, text: "Responsible for the schedule, acceptance of hidden work and the daily report. His phone number is in the contract.", now: "on Polezhaevskaya" },
    { name: "Dmitry Klyuev", role: "Electrician, certified up to 1000 V", years: 11, objects: 204, text: "Panels, low-voltage, smart home. Every line is labelled and on the diagram.", now: "on Polezhaevskaya" },
    { name: "Artem Gusev", role: "Plumber", years: 9, objects: 176, text: "Manifold runs, pressure tests with a report, underfloor heating." },
    { name: "Marat Ibragimov", role: "Tiler, floors", years: 12, objects: 158, text: "Large format, 45° porcelain, engineered wood, herringbone parquet.", now: "on Leninsky" },
    { name: "Olga Terekhova", role: "Painter", years: 8, objects: 120, text: "Filler for paint without «streaks under a lamp», butt-joined wallpaper, microcement." },
    { name: "Rinat Valeev", role: "Carpenter, fitting", years: 7, objects: 96, text: "Hidden doors, built-in furniture to the project, boxing and niches." },
  ],
  nowLabel: "now",
  yearsLine: "{n} years' experience",
  objectsLine: "{n} delivered",
}

const acts: Testimonials029Props = {
  eyebrow: "Acceptance reports",
  title: "What clients write on handover day",
  lede: "Quotes from acceptance reports over the past year. We don't hide remarks: if there were any — we write how we closed them.",
  reviews: [
    { number: "0298", object: "Two-room on Leninsky, 62 m²", date: "14.08.2026", text: "Delivered two days early. Photos in the chat every evening, I never once drove over to check. They'd have re-laid the bathroom tiles if I'd asked — no need.", name: "Anna R.", stars: 5 },
    { number: "0291", object: "Three-room in Skolkovo, 96 m²", date: "02.07.2026", text: "The designer from the studio said it was the first time a crew got hidden doors right first time. The estimate didn't grow by a rouble, even though we added sockets.", name: "Kirill and Maria", stars: 5 },
    { number: "0284", object: "Studio on Taganka, 31 m²", date: "19.05.2026", text: "Cosmetic in four weeks, as promised. Cleaned up after themselves — handed over a clean apartment, I moved tenants in the same day.", name: "Oleg N.", stars: 5, remark: "a scratch on the windowsill — replaced in two days, before signing the report" },
    { number: "0277", object: "Four-room in Khamovniki, 134 m²", date: "28.03.2026", text: "They got the replanning approved themselves, I only signed. Foreman Igor replies within an hour even on a Sunday — that's a value of its own.", name: "Dmitry V.", stars: 5 },
    { number: "0269", object: "Two-room on Rechnoy, 54 m²", date: "11.02.2026", text: "My first renovation, I was scared of everything. A contract with stage dates and a penalty calmed me better than any words. Everything matched to the day.", name: "Polina S.", stars: 5 },
    { number: "0260", object: "One-room in Lyublino, 38 m²", date: "23.12.2025", text: "Electrics redone from scratch, the panel labelled by line. I'm an engineer myself, there was nothing to fault — and I tried.", name: "Sergey K.", stars: 4, remark: "asked them to work quietly before 10:00 — the schedule was shifted from day one" },
  ],
  stampLabel: "Accepted without remarks",
  remarkStampLabel: "Remark resolved",
  signLabel: "Client's signature",
  actLabel: "Acceptance report No. {n}",
  starsLabel: "{n} out of 5",
  remarkLabel: "Remark: ",
}

const request: Cta030Props = {
  eyebrow: "Request",
  title: "Measuring is free, the estimate — the same day",
  lede: "We come with a laser meter and send the estimate with stage dates within two hours. A contract — only if the numbers suit you.",
  placeholder: "+7 ___ ___-__-__",
  actionLabel: "Book a measurement",
  channels: [
    { id: "call", label: "Call me", promise: "We'll call back within 15 minutes, 9:00 to 21:00" },
    { id: "telegram", label: "Telegram", promise: "We'll write on Telegram, no calls" },
    { id: "whatsapp", label: "WhatsApp", promise: "We'll write on WhatsApp, no calls" },
  ],
  estimateLabel: "An estimate is attached to the request",
  doneTitle: "Request received",
  fine: "No newsletters: one call or one message, to the point.",
  doneLine: "Request {n}. {promise}.",
  estimateLine: "Estimate {n} attached.",
  numberPrefix: "No.",
  areaUnit: "m²",
  weekShort: "wk",
  detachLabel: "Detach the estimate",
  phoneLabel: "Phone",
  channelsLabel: "How to reach you",
}

const footer: Footer036Props = {
  brand: "Level",
  caption: "apartment renovation · Moscow · since 2011",
  cells: [
    { label: "Phone", value: "+7 495 120-40-40", href: "tel:+74951204040" },
    { label: "Email", value: "smeta@rovno.ru", href: "mailto:smeta@rovno.ru" },
    { label: "Office", value: "Moscow, Bolshaya Polyanka 28, bldg 2" },
    { label: "Hours", value: "Mon–Sat 9:00–21:00" },
    { label: "Warranty", value: "5 years by contract" },
    { label: "Delay penalty", value: "0.5% per day" },
    { label: "Sheet", value: "1" },
    { label: "Sheets", value: "1" },
  ],
  nav: [
    { label: "Estimate", href: "#calc" },
    { label: "Stages", href: "#stages" },
    { label: "Projects", href: "#works" },
    { label: "Live site", href: "#online" },
    { label: "Crew", href: "#team" },
    { label: "Reviews", href: "#reviews" },
  ],
  legal: [
    { label: "Contract (sample)", href: "#contract" },
    { label: "Privacy policy", href: "#privacy" },
  ],
  requisites: "Level LLC · Tax ID 7706412870 · reg. no. 1157746318204 · SRO NOSTROY No. S-0412",
  copyright: "© 2011–2026 Level",
  navTitle: "Sections",
  legalTitle: "Documents",
}

export default function RenovationDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar037 {...concrete} {...navbar} />
      <div id="top">
        <Hero037 {...blueprint} {...hero} />
      </div>
      <div id="calc">
        <Renovation001 {...concrete} {...calculator} />
      </div>
      <div id="stages">
        <Renovation002 {...concrete} {...stages} />
      </div>
      <div id="works">
        <Renovation003 {...concrete} {...works} />
      </div>
      <div id="online">
        <Renovation004 {...blueprint} {...online} />
      </div>
      <div id="why">
        <Comparison010 {...concrete} {...why} />
      </div>
      <div id="team">
        <People017 {...concrete} {...crew} />
      </div>
      <div id="reviews">
        <Testimonials029 {...concrete} {...acts} />
      </div>
      <div id="contact">
        <Cta030 {...concrete} {...request} />
      </div>
      <Footer036 {...blueprint} {...footer} />
    </div>
  )
}
