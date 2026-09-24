import type { CSSProperties } from "react"

import { Navbar033 } from "@/registry/blocks/navbar/navbar-033/navbar-033"
import { Hero033 } from "@/registry/blocks/hero/hero-033/hero-033"
import { Ai001 } from "@/registry/blocks/ai/ai-001/ai-001"
import { Ai002 } from "@/registry/blocks/ai/ai-002/ai-002"
import { Bento002 } from "@/registry/blocks/layout/bento-002/bento-002"
import { Logocloud007 } from "@/registry/blocks/logos/logocloud-007/logocloud-007"
import { Pricing025 } from "@/registry/blocks/pricing/pricing-025/pricing-025"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Cta026 } from "@/registry/blocks/cta/cta-026/cta-026"
import { Footer032 } from "@/registry/blocks/footer/footer-032/footer-032"

/**
 * English version of the "AI tool / SaaS" demo: same blocks and theme as
 * `app/scenarios/saas/demo/page.tsx`, text in English via props.
 *
 * The site is itself a demo of the product: the assistant types a summary
 * on the first screen, in the sandbox you can press a button and see the
 * answer, integrations circle in orbits, the price is computed with a seat
 * slider. A dark aurora, glass, not a single photo. A film of grain on top
 * (feTurbulence); the aurora intensity changes from section to section
 * inside the blocks themselves: hero and integrations are bright, the
 * pipeline and pricing are muted, the call to action is bright again.
 */
export const metadata = {
  title: "Recap — the AI that turns calls into decisions",
  description:
    "VibeUI «AI tool / SaaS» scenario demo: a hero with a typing summary, a «how it works» pipeline, a sandbox, integration orbits, per-seat pricing, questions about data and a glass call to action.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0a0f1e",
  color: "#eef2ff",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const aurora = { tone: "dark", accent: "#5ee7ff", ink: "#eef2ff", background: "#0a0f1e" } as const

const CAPTIONS = [
  { who: 0, text: "Let's move the release to Thursday, the tests won't make it." },
  { who: 1, text: "Fine, then I'll take the database migration by Wednesday." },
  { who: 2, text: "I need the final icons by Tuesday." },
  { who: 0, text: "And a risk: the provider has a maintenance window on Wednesday night." },
]

const SAMPLE = `Lena: Let's move the release to Thursday, the tests won't make it.
Mark: OK, but then I'm taking the database migration by Wednesday.
Olya: I need the final icons from design by Tuesday, otherwise everything slips.
Lena: Risk — the payment provider has a maintenance window on Wednesday night.
Mark: Then we deploy Thursday morning, after the window.`

const RESULT = ["# Decisions", "The release moves to Thursday; deploy — Thursday morning, after the provider window.", "# Tasks", "Mark — database migration by Wednesday.", "Design — final icons to Olya by Tuesday.", "# Risks", "Payment provider maintenance window on Wednesday night — check the status on Thursday at 9:00."]

const FAQ = [
  { question: "Where are recordings and transcripts stored?", answer: "In your workspace, on servers in Russia. Audio is deleted right after transcription, text — by your retention period: from a day to a year." },
  { question: "Does the model learn from our meetings?", answer: "No. Your data does not go into training of our model or any third party's. This is written into the data processing agreement." },
  { question: "How does the bot get into a call?", answer: "You connect your calendar — the bot joins as a participant the meetings you marked. Or you upload a recording by hand if the meeting wasn't scheduled." },
  { question: "What if participants object to recording?", answer: "The bot introduces itself and writes in the meeting chat that it is transcribing. Any participant can ask it to leave — no summary will be made." },
  { question: "Can it be deployed on-premise?", answer: "Yes, on the «Company» plan: the model and the storage are deployed on your servers, nothing leaves." },
]

export default function SaasDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <style href="vibeui-demo-saas-grain" precedence="medium">
        {`[data-demo-grain]{position:fixed;inset:0;z-index:60;pointer-events:none;opacity:.05;mix-blend-mode:soft-light;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:220px}`}
      </style>
      <div data-demo-grain="" aria-hidden="true" />
      <Navbar033
        {...aurora}
        brand="Recap"
        links={[
          { label: "How it works", href: "#how" },
          { label: "Try it", href: "#sandbox" },
          { label: "Integrations", href: "#integrations" },
          { label: "Pricing", href: "#pricing" },
        ]}
        loginLabel="Log in"
        actionLabel="Start for free"
        navLabel="Sections"
        menuLabel="Menu"
        menuOpenLabel="Open menu"
        menuCloseLabel="Close menu"
        liveLabel="Call in progress"
        overlay
      />
      <div id="top">
        <Hero033
          {...aurora}
          eyebrow="AI for meetings · no minutes"
          title="Call over — *decisions in the tracker*"
          lede="Recap listens to the meeting, picks out decisions, tasks and risks and files them into Jira, Notion and Telegram. While you pour your coffee."
          primaryLabel="Start for free"
          secondaryLabel="Try it in the sandbox"
          trust="4,200 teams have already stopped writing minutes"
          callTitle="Release stand-up"
          recLabel="Recap is recording"
          people={[
            { name: "Lena", color: "#8b7cf6" },
            { name: "Mark", color: "#22c3a6" },
            { name: "Olya", color: "#f59e5b" },
          ]}
          captions={CAPTIONS}
          endedLabel="Call ended · 42:10"
          readyLabel="summary ready in 38 s"
          taskStatus="in progress"
          taskTitle="Database migration"
          taskMeta="Mark · by Wednesday"
          chatTitle="#release · Recap"
          chatText="Release moves to Thursday. Tasks: database migration — Mark, icons — design. Risk: provider window on Wednesday."
          docTitle="Decisions · release stand-up"
          docItems={["Release — on Thursday", "Deploy in the morning, after the provider window"]}
          demoLabel="Demo: a call and its results"
        />
      </div>
      <div id="how">
        <Ai001
          {...aurora}
          eyebrow="How it works"
          title="Three steps, none of them yours"
          lede="You just end the call. Everything else happens while you walk to get coffee."
          steps={[
            { title: "Listens to the meeting", text: "Joins Zoom, Meet or Teams as a participant. Or takes a recording.", kind: "wave", meta: "during the call" },
            { title: "Understands what it's about", text: "A transcript with roles, extraction of decisions, tasks, deadlines and risks.", kind: "text", meta: "≈ 40 seconds after" },
            { title: "Files everything in place", text: "Tasks — to Jira or Notion, the summary — to Telegram, decisions — to the knowledge base.", kind: "tasks", meta: "without a single click" },
          ]}
          stepLine="step {n} / {total}"
          tasks={["Database migration — Mark", "Icons — design", "Provider window — risk"]}
        />
      </div>
      <div id="sandbox">
        <Ai002
          {...aurora}
          eyebrow="Sandbox"
          title="Try it on your own call"
          lede="Paste a piece of a transcript — any. The answer below is pre-generated: this is a showcase of behaviour, not a model."
          inputLabel="transcript"
          sample={SAMPLE}
          runLabel="Make a summary"
          runningLabel="Thinking…"
          resetLabel="Start over"
          copyLabel="Copy"
          copiedLabel="Copied"
          outputLabel="summary"
          placeholder="Paste the meeting transcript…"
          result={RESULT}
          wordsUnit="words"
          emptyText="Press «{run}» — the summary will appear here."
          doneLine="done · {n} tokens"
        />
      </div>
      <div id="integrations">
        <Bento002
          {...aurora}
          eyebrow="Integrations"
          title="Lives where the team already lives"
          lede="Connects to what you already have: calls, tracker, knowledge base, messenger. No «go to our app»."
          core="Recap"
          coreCaption="listens and files"
          inner={[{ name: "Zoom", mark: "Z" }, { name: "Google Meet", mark: "M" }, { name: "Webex", mark: "W" }, { name: "Teams", mark: "T" }]}
          facts={["Calls: the bot joins as a participant or takes a recording", "Trackers: tasks are created with an assignee and a deadline", "Messengers: the summary arrives a minute after the meeting", "Knowledge bases: decisions accumulate in one place"]}
          spaceLabel="{core}: integrations"
        />
      </div>
      <Logocloud007 {...aurora} label="trusted by" names={["Tochka", "Skyeng", "Samokat", "Avito", "Cian", "Ozon", "Kontur", "Miro", "Tinkoff", "Kaspersky Lab"]} />
      <div id="pricing">
        <Pricing025
          {...aurora}
          eyebrow="Pricing"
          title="Pay for people, not for minutes"
          lede="Move the slider to your team size — the price recalculates. Yearly billing is a fifth cheaper."
          plans={[
            { name: "Starter", perSeat: 0, seatsIncluded: 3, note: "Up to three people, 5 meetings a month, a summary in Telegram.", features: ["Transcript and summary", "5 meetings a month", "Export to Markdown"], actionLabel: "Start for free", actionHref: "#start" },
            { name: "Team", perSeat: 890, note: "Everything a team of up to 50 needs. Integrations and tasks in the tracker.", features: ["Unlimited meetings", "Tasks in Jira, Notion, Linear", "Search across all decisions", "12 months of history"], featured: true, actionLabel: "Try for 14 days", actionHref: "#start" },
            { name: "Company", perSeat: 1490, note: "SSO, your own data perimeter, a contract and support with an SLA.", features: ["Everything in «Team»", "SSO and SCIM", "Data in your perimeter", "A manager and an SLA"], actionLabel: "Talk to us", actionHref: "#contact" },
          ]}
          seatsLabel="People in the team"
          seatUnits={["seat", "seats", "seats"]}
          monthlyLabel="Monthly"
          yearlyLabel="Yearly"
          yearlyAria="Yearly billing"
          featuredLabel="Most popular"
          upToLine="only up to {n} people"
          foreverLabel="forever"
          perSeatLine="/ mo · {price} per seat"
        />
      </div>
      <div id="security">
        <Faq023 {...aurora} eyebrow="Data" title="What about security" lede="The most common questions from lawyers and security teams — briefly. Full answers are in the docs." items={FAQ} contactLabel="Ask the security team" contactHref="#contact" />
      </div>
      <div id="start">
        <Cta026
          {...aurora}
          eyebrow="Get started"
          title="Your next call no longer needs notes"
          lede="Leave your email — we'll send a link to your workspace. The first five meetings are free, no card needed."
          placeholder="Work email"
          actionLabel="Start for free"
          fine={["No card", "5 meetings free", "Turn off in one click"]}
          doneTitle="Email sent"
          doneText="The workspace link arrives within a minute. Check «Spam», just in case."
        />
      </div>
      <Footer032
        {...aurora}
        brand="Recap"
        ghost={false}
        recap={{
          title: "A recap of this page",
          meta: "done in 38 s",
          sections: [
            { label: "Decisions", items: ["No more writing minutes", "Next call — with Recap"] },
            { label: "Tasks", items: ["Leave your email — you, today", "Connect the calendar — 2 minutes"] },
            { label: "Risks", items: ["Keep taking notes by hand"] },
          ],
        }}
        caption="The AI that listens to calls and files the decisions where they belong."
        status="All systems operational"
        columns={[
          { title: "Product", links: [{ label: "How it works", href: "#how" }, { label: "Integrations", href: "#integrations" }, { label: "Pricing", href: "#pricing" }, { label: "What's new", href: "#changelog" }] },
          { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Blog", href: "#blog" }, { label: "Careers", href: "#jobs" }, { label: "Contact", href: "#contact" }] },
          { title: "Help", links: [{ label: "Documentation", href: "#docs" }, { label: "API", href: "#api" }, { label: "Security", href: "#security" }, { label: "Support", href: "#support" }] },
        ]}
        legal={[{ label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }, { label: "Data processing", href: "#dpa" }]}
        copyright="© 2026 Recap"
        navLabel="Site sections"
      />
    </div>
  )
}
