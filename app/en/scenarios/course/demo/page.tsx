import type { CSSProperties } from "react"

import { Navbar022 } from "@/registry/blocks/navbar/navbar-022/navbar-022"
import { Hero022 } from "@/registry/blocks/hero/hero-022/hero-022"
import { Course001 } from "@/registry/blocks/industry/course-001/course-001"
import { Course002 } from "@/registry/blocks/industry/course-002/course-002"
import { Course003 } from "@/registry/blocks/industry/course-003/course-003"
import { About008 } from "@/registry/blocks/about/about-008/about-008"
import { Course004 } from "@/registry/blocks/industry/course-004/course-004"
import { Pricing020 } from "@/registry/blocks/pricing/pricing-020/pricing-020"
import { Testimonials018 } from "@/registry/blocks/testimonials/testimonials-018/testimonials-018"
import { Faq017 } from "@/registry/blocks/faq/faq-017/faq-017"
import { Cta017 } from "@/registry/blocks/cta/cta-017/cta-017"
import { Footer021 } from "@/registry/blocks/footer/footer-021/footer-021"
import { Cta018 } from "@/registry/blocks/cta/cta-018/cta-018"

/**
 * English version of the "Online course" demo: same blocks and theme as
 * `app/scenarios/course/demo/page.tsx`, text in English.
 *
 * A light theme, indigo and a lime marker. Nine blocks from the catalogue's
 * shared groups plus four subject blocks from course. Sections reveal on
 * scroll (scroll-driven animation, visible right away in older browsers),
 * the background alternates: white → soft indigo → dark. A showcase of the
 * result, not a template.
 */
export const metadata = {
  title: "Figma for product designers — an online course by Ksenia Moroz",
  description:
    "VibeUI «Online course» scenario demo: a course landing page with the programme, the author, graduates' results, plans and a countdown to the start.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#ffffff",
  color: "#111827",
  fontFamily: '"Inter",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const light = { tone: "light", background: "#ffffff", ink: "#111827", accent: "#4f46e5" } as const
const SOFT = "linear-gradient(180deg,#ffffff 0%,#eef2ff 40%,#f5f3ff 100%)"
const REVEAL = `@supports (animation-timeline: view()){[data-reveal]{animation:vibeui-demo-reveal linear both;animation-timeline:view();animation-range:entry 0% entry 35%}@keyframes vibeui-demo-reveal{from{opacity:.2;transform:translateY(28px)}to{opacity:1;transform:none}}}@media (prefers-reduced-motion:reduce){[data-reveal]{animation:none}}`

const PHOTOS = "/demo/course"

const CASES = [
  { name: "Artem Gusev", image: `${PHOTOS}/graduate-01.webp`, work: `${PHOTOS}/work-01.webp`, before: "marketer, 4 years", after: "product designer, Ozon", gain: "an offer in 2 months", quote: "Showed the case from my defence at the interview — hired without a test task.", href: "#" },
  { name: "Lena Krylova", image: `${PHOTOS}/graduate-02.webp`, work: `${PHOTOS}/work-02.webp`, before: "graphic designer", after: "UI designer, Samokat", gain: "×1.8 income", quote: "I finally understood auto layout. My mockups don't fall apart anymore.", href: "#" },
  { name: "Daniil Orlov", image: `${PHOTOS}/graduate-03.webp`, work: `${PHOTOS}/work-03.webp`, before: "product manager", after: "PM who builds his own prototypes", gain: "hypotheses in an evening", quote: "Stopped waiting two weeks for a designer for a single screen.", href: "#" },
]

const REVIEWS = [
  { quote: "The most valuable part is the review. The curator went through my homework in a 20-minute video and showed where I lose the user. Nobody does that at work.", name: "Marina Sokolova", role: "UI designer, Avito", image: `${PHOTOS}/graduate-04.webp`, cohort: "cohort 11", video: `${PHOTOS}/lesson.webp`, videoHref: "#", href: "#" },
  { quote: "Came as a PM to stop waiting for designers. A month later I built a feature prototype myself and got a «yes» for a test in one call.", name: "Igor Levin", role: "Product manager, Ozon", image: `${PHOTOS}/graduate-03.webp`, cohort: "cohort 12", href: "#" },
  { quote: "The Wednesday lives are a course of their own. Ksenia shows how she thinks on a live file, not just what to click.", name: "Alina Fyodorova", role: "Designer, freelance", image: `${PHOTOS}/graduate-02.webp`, cohort: "cohort 12", href: "#" },
]

const WEEKS = [
  { label: "Week 1", title: "Grid, typography and the first screen", text: "We break down what an interface is made of and build the first screen to the platform guidelines.", lessons: [{ title: "How Figma works: files, pages, frames", length: "35 min" }, { title: "Grids and spacing: the 8-pixel system", length: "40 min" }, { title: "Interface typography", length: "45 min" }, { title: "Cohort homework review", length: "1 h", kind: "live" as const }], homework: "An onboarding screen from a reference" },
  { label: "Week 2", title: "Components and auto layout", text: "We build buttons, fields and cards so they don't break with any text.", lessons: [{ title: "Auto layout from simple to nested", length: "50 min" }, { title: "Components and variants", length: "45 min" }, { title: "States: hover, focus, error", length: "35 min" }, { title: "Component checklist", kind: "text" as const }], homework: "A set of 12 components" },
  { label: "Week 3", title: "Design system and tokens", lessons: [{ title: "Colour and theme: light and dark", length: "40 min" }, { title: "Tokens, styles, variables", length: "45 min" }, { title: "System documentation", length: "30 min" }, { title: "System review with the curator", length: "1 h", kind: "review" as const }], homework: "A mini system with 2 themes" },
  { label: "Week 4", title: "Flows and prototyping", lessons: [{ title: "User journey and screens", length: "40 min" }, { title: "A prototype with transitions and overlays", length: "50 min" }, { title: "Smart Animate animations", length: "35 min" }], homework: "A clickable 6-screen prototype" },
  { label: "Week 5", title: "Working with development", lessons: [{ title: "Dev Mode and handoff", length: "40 min" }, { title: "Responsive layouts and constraints", length: "45 min" }, { title: "Review with a developer", length: "1.5 h", kind: "live" as const }], homework: "Mockups for three breakpoints" },
  { label: "Week 6", title: "Case study and defence", lessons: [{ title: "How to present a case in a portfolio", length: "40 min" }, { title: "Presenting the solution", length: "35 min" }, { title: "Defence before an art director", length: "2 h", kind: "live" as const }], homework: "The final case study" },
]

export default function Page() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <style href="vibeui-demo-reveal" precedence="medium">
        {REVEAL}
      </style>
      <Navbar022
        {...light}
        brand="Figma Pro"
        brandHref="#"
        caption="course · 6 weeks"
        actionLabel="Enrol"
        actionPrice="49 000 ₽"
        actionHref="#pricing"
        menuLabel="Menu"
        navLabel="Sections"
        links={[
          { label: "Who it's for", href: "#who" },
          { label: "Programme", href: "#program" },
          { label: "Results", href: "#results" },
          { label: "Author", href: "#author" },
          { label: "Price", href: "#pricing" },
        ]}
      />
      <div id="hero">
        <Hero022
          {...light}
          eyebrow="Online course · starts 6 October"
          title="Figma for product designers: from mockup to *live prototype*"
          lede="Six weeks of practice on real tasks: you'll build three interfaces, defend a project before an art director and leave with a portfolio people actually look at."
          primaryLabel="Enrol in the cohort"
          primaryHref="#pricing"
          secondaryLabel="Watch the first lesson"
          secondaryHref="#"
          poster={`${PHOTOS}/poster.webp`}
          posterAlt="A frame from the first lesson: a designer at a monitor with a mockup"
          duration="4:32"
          bigLabel="weeks of practice"
          seatsTaken={48}
          seatsTotal={60}
          seatsLabel="seats taken"
          dateValue="6 Oct"
          dateLabel="cohort starts"
          facts={[
            { value: "18", label: "40-minute lessons" },
            { value: "3", label: "portfolio projects" },
            { value: "3 000", label: "graduates" },
            { value: "94%", label: "make it to the defence" },
          ]}
          logosLabel="Graduates work at"
          logos={["Ozon", "Tinkoff", "Yandex", "Avito", "Samokat"]}
          watchLabel="Watch the lesson"
        />
      </div>
      <div id="who" data-reveal>
        <Course001
          {...light}
          eyebrow="Who it's for"
          title="The course adapts to where you're coming from"
          lede="Three typical starting points — three different sets of practice. Open yours."
          personas={[
            { label: "Starting from zero", glyph: "0", title: "You've never opened Figma", text: "You want into interface design but don't know where to start. We begin with the grid and components and in six weeks reach a prototype you won't be ashamed to show.", outcomes: ["Three mobile app screens to the guidelines", "Components and auto layout without fear", "A first portfolio project with a curator's review"], note: "from zero to a first project" },
            { label: "From graphic design", glyph: "→", title: "You can draw, but not interfaces", text: "You know composition and typography, but get lost in a product team: states, flows, design systems. We'll translate the skill into product.", outcomes: ["A design system with tokens and variants", "A prototype with logic and error states", "A portfolio for product designer vacancies"], note: "a switch in 6 weeks" },
            { label: "A PM without hands", glyph: "PM", title: "You brief designers", text: "You want to build prototypes for hypotheses yourself and speak the same language as the team, without waiting in the design queue.", outcomes: ["A clickable hypothesis prototype in an evening", "You understand design constraints and timings", "You read mockups and give precise feedback"], note: "a prototype in an evening" },
          ]}
          outcomesLabel="What you get"
          tilesLabel="Who are you now"
        />
      </div>
      <div id="program" data-reveal>
        <Course002
          {...light}
          eyebrow="Programme"
          title="Six weeks — three portfolio projects"
          lede="Every week: three recorded lessons, a live with a review and homework checked by a curator."
          weeks={WEEKS}
          summary={[
            { value: "18", label: "lessons" },
            { value: "24 h", label: "of video and lives" },
            { value: "6", label: "reviewed homeworks" },
            { value: "3", label: "projects" },
          ]}
          summaryTitle="In numbers"
          finalTitle="Final project: a mobile app from scratch to prototype"
          finalText="A defence before an art director from a partner company. The best cases go into the referral base."
          homeworkLabel="Homework:"
          hoursUnit="h"
          minutesUnit="min"
          weeksLabel="Course weeks"
          finalLabel="Final project"
          totalLabel="Total"
          style={{ background: SOFT }}
        />
      </div>
      <div id="results" data-reveal>
        <Course003
          {...light}
          eyebrow="Results"
          title="What graduates of past cohorts became"
          lede="Not «100% employed», but specific people and specific offers — with the work they built on the course."
          cases={CASES}
          stats={[
            { value: 3200, suffix: "+", label: "graduates in 5 years" },
            { value: 71, suffix: "%", label: "changed jobs within six months" },
            { value: 48, label: "partner companies" },
          ]}
          beforeLabel="Before"
          afterLabel="After"
          linkLabel="See the case"
          prevLabel="Back"
          nextLabel="Forward"
          background="#111827"
          style={{ ["--vibeui-course-003-fg" as string]: "#f3f4f6", ["--vibeui-course-003-muted" as string]: "#9ca3af", ["--vibeui-course-003-card" as string]: "#1b2130", ["--vibeui-course-003-line" as string]: "#2a3140" }}
        />
      </div>
      <div id="author" data-reveal>
        <About008
          {...light}
          eyebrow="Course author"
          name="Ksenia Moroz"
          role="Lead product designer, 12 years in interfaces"
          quote="I don't teach «drawing pretty». I teach *assembling an interface so it can be handed to development tomorrow*."
          text="Built design systems for a bank and a marketplace, led teams of up to twelve designers. The course is my internal onboarding programme rewritten for people outside."
          image={`${PHOTOS}/author.webp`}
          imageAlt="Ksenia Moroz at her desk"
          credentials={["Tinkoff Business design system, 2019–2022", "Design lead at Samokat, 2022–2024", "Speaker at Dribbble Meetup and ProductSense"]}
          companies={["Tinkoff", "Samokat", "Ozon", "Yandex", "Avito"]}
          companiesLabel="Worked with"
          facts={[
            { value: "12", label: "years in products" },
            { value: "3 000+", label: "graduates" },
            { value: "4.9", label: "course rating" },
          ]}
          linkLabel="Portfolio and articles"
        />
      </div>
      <div id="format" data-reveal>
        <Course004
          {...light}
          eyebrow="How the learning goes"
          title="One course week — day by day"
          lede="Recorded lessons, a live on Wednesdays and checked homework. Five to seven hours a week, everything else at your own pace."
          days={[
            { day: "Mon", kind: "recording", time: "from the morning", title: "The week's three lessons open", text: "Watch at your own pace, notes and files are in your account." },
            { day: "Wed", kind: "live", time: "19:30 · 1.5 h", title: "Live with the author: review and questions", text: "The recording stays, questions can be asked in advance in the chat." },
            { day: "Thu", kind: "chat", time: "all day", title: "Questions for the curator", text: "Answers within two hours during working hours." },
            { day: "Sat", kind: "review", time: "by 12:00", title: "Homework deadline", text: "The curator checks within 48 hours and records a video review." },
            { day: "Sun", kind: "chat", time: "all day", title: "Reviewing others' work", text: "See how others solved it and discuss in the cohort chat." },
          ]}
          weekdays={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          formats={[
            { title: "18 recorded lessons", text: "35–50 minutes each, with timecodes and files" },
            { title: "6 lives with the author", text: "on Wednesdays, recordings kept for a year" },
            { title: "A curator per 12 people", text: "a video review of every homework" },
            { title: "Cohort chat", text: "and a private graduates' community afterwards" },
          ]}
          image={`${PHOTOS}/lesson.webp`}
          imageAlt="Ksenia recording a lesson in the studio"
          caption="Wednesday live — the recording stays"
          calendarLabel="The week by day"
          style={{ background: SOFT }}
        />
      </div>
      <div id="pricing" data-reveal>
        <Pricing020
          {...light}
          eyebrow="Price"
          title="Three formats — one programme"
          lede="Instalments with no markup from a partner bank. A refund in the first seven days, no questions asked."
          plans={[
            { name: "Solo", text: "Lesson recordings and the cohort chat. No homework checks.", price: 29000, oldPrice: 36000, features: ["18 lessons and all the files", "Cohort chat and community", "Access to recordings for a year"], actionLabel: "Choose", actionHref: "#" },
            { name: "With a curator", text: "Everything in «Solo» plus a review of every homework and a case defence.", price: 49000, oldPrice: 61000, featured: true, seats: "12 seats left", seatsTaken: 48, seatsTotal: 60, features: ["A curator per 12 people", "Video reviews of six homeworks", "A defence before an art director", "Your case in the referral base"], actionLabel: "Enrol", actionHref: "#" },
            { name: "With job placement", text: "A curator, a career track and three mock interviews.", price: 79000, oldPrice: 98000, seatsTaken: 7, seatsTotal: 10, features: ["Everything in «With a curator»", "CV and portfolio with a career consultant", "Three mock interviews", "Partner vacancies"], actionLabel: "Choose", actionHref: "#" },
          ]}
          onceLabel="Pay in full"
          splitLabel="Instalments"
          sticker="−20% until 30 September"
          note="The contract and the receipt go to your email. Pay by card, instant transfer or invoice for companies."
          methodLabel="Payment method"
          monthsUnit="mo"
          perMonthLabel="per month"
          perCourseLabel="per course"
          totalLabel="total"
          seatsLine="{taken} of {total} taken"
          background="#f8fafc"
        />
      </div>
      <div id="reviews" data-reveal>
        <Testimonials018
          {...light}
          eyebrow="Reviews"
          title="What people say after the defence"
          lede="Reviews from the graduates' chat and open platforms — with names, job titles and links to profiles."
          items={REVIEWS}
          score="4.9"
          scoreLabel="from 412 graduate reviews"
          videoLabel="Video review"
          closeLabel="Close"
        />
      </div>
      <div id="faq" data-reveal>
        <Faq017
          {...light}
          eyebrow="Questions"
          title="What people ask before paying"
          lede="About pace, experience, the certificate, money and equipment. The rest — on Telegram, we reply within an hour."
          items={[
            { question: "What if I can't keep up the pace?", answer: "Five to seven hours a week is the norm. If you fall behind, the curator moves the deadline, and the recordings and the chat stay for a year: you can catch up with the next cohort for free." },
            { question: "Do I need design experience?", answer: "No. The first two weeks are built for those opening Figma for the first time. For those who already can, these lessons help close gaps in auto layout and components." },
            { question: "Will there be a certificate?", answer: "Yes, a named certificate after the project defence. It doesn't «guarantee» anything to an employer — your case does, and we help you present it." },
            { question: "Can I get a refund?", answer: "In the first seven days — in full, no explanations. After that — in proportion to what's been covered, per the terms of service." },
            { question: "How do instalments work?", answer: "No markup, from a partner bank, over 6 months. Approval in a couple of minutes at checkout, the course opens immediately." },
            { question: "What equipment do I need?", answer: "Any laptop from the last five years and Figma's free plan. A tablet won't do: there's no full editor." },
          ]}
          askTitle="Didn't find the answer?"
          askText="Message the admissions curator — they'll tell you whether the course fits you."
          askLabel="Ask on Telegram"
          style={{ background: SOFT }}
        />
      </div>
      <div id="enroll" data-reveal>
        <Cta017
          {...light}
          eyebrow="Next cohort"
          title="Starts 6 October. The next cohort — not until February"
          text="Leave your email — we'll send the programme, the contract and a payment link. We hold the seat for 48 hours."
          startsAt="2026-10-06T10:00:00+03:00"
          countdownLabel="until the cohort starts"
          seats="12 of 60 seats left"
          placeholder="Your email"
          submitLabel="Reserve a seat"
          doneTitle="The seat is yours"
          doneText="The email with the programme and the link is already on its way. Check «Promotions» if you don't see it."
          consent="By pressing the button you agree to the data processing policy."
          units={["days", "hours", "minutes", "seconds"]}
          action=""
        />
      </div>
      <div id="footer">
        <Footer021
          {...light}
          brand="Figma Pro"
          caption="An online course for product designers"
          author="Author and host — Ksenia Moroz"
          email="hello@figmapro.school"
          columns={[
            { title: "Course", links: [{ label: "Programme", href: "#program" }, { label: "Results", href: "#results" }, { label: "Price", href: "#pricing" }, { label: "Questions", href: "#faq" }] },
            { title: "Documents", links: [{ label: "Terms of service", href: "#" }, { label: "Privacy policy", href: "#" }, { label: "Refund terms", href: "#" }] },
          ]}
          socialsLabel="Find us online"
          legal="Sole proprietor Ksenia Andreevna Moroz, Tax ID 780000000000, reg. no. 320000000000000. Educational licence No. L035-00000-78/00000000. © 2021–2026."
          background="#f8fafc"
        />
      </div>
      <Cta018 {...light} label="Enrol" price="49 000 ₽" href="#pricing" caption="Starts 6 October" showAfter="#hero" hideNear="#pricing, #enroll, #footer" />
    </div>
  )
}
