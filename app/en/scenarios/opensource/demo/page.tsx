import type { CSSProperties } from "react"

import { Navbar030 } from "@/registry/blocks/navbar/navbar-030/navbar-030"
import { Hero030 } from "@/registry/blocks/hero/hero-030/hero-030"
import { Opensource001 } from "@/registry/blocks/opensource/opensource-001/opensource-001"
import { Bento001 } from "@/registry/blocks/bento/bento-001/bento-001"
import { Comparison006 } from "@/registry/blocks/comparison/comparison-006/comparison-006"
import { Stats002 } from "@/registry/blocks/stats/stats-002/stats-002"
import { Changelog004 } from "@/registry/blocks/changelog/changelog-004/changelog-004"
import { Cta024 } from "@/registry/blocks/cta/cta-024/cta-024"
import { Footer029 } from "@/registry/blocks/footer/footer-029/footer-029"

/**
 * English version of the "Open-source project" demo: same blocks and theme
 * as `app/scenarios/opensource/demo/page.tsx`, text in English via props.
 *
 * A README that came alive. The terminal types a command, installs the
 * package with a progress bar and prints "ready" on a loop, the playground
 * is a sticky scene where scrolling switches options on, the bento lives
 * on micro-animations, stars are drawn as a graph, the changelog slides in
 * as a ribbon. A light engineering theme on dots and grain, a dark finale
 * at the star. A showcase of the result, not a template.
 */
export const metadata = {
  title: "tabl — a 4 KB headless table for React",
  description:
    "VibeUI «Open-source project» scenario demo: install with copy, a live terminal, a playground, a features bento, a size comparison, community, changelog and a GitHub star.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fbfbf9",
  color: "#111111",
  fontFamily: '"Onest",ui-sans-serif,system-ui,sans-serif',
}

// Grain over the whole page: an svg feTurbulence data URI, below the threshold of notice, but it takes the "plastic" off.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const noise: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 70,
  pointerEvents: "none",
  opacity: 0.06,
  backgroundImage: NOISE,
  backgroundSize: "160px 160px",
  mixBlendMode: "overlay",
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const light = { tone: "light", accent: "#2f5bff", ink: "#111111", background: "#fbfbf9" } as const
// The finale is dark: the star and the footer on the terminal colour, a lighter accent for contrast.
const dark = { tone: "dark", accent: "#6d8bff", ink: "#f2f3f7", background: "#0f1117" } as const

const TERMINAL = ["$ npm i tabl", "added 1 package in 412ms", "✓ 4.1 kB gzip · 0 dependencies", "✓ column types inferred: ColumnDef<Row>", "✓ virtualisation enabled (rows > 200)", "✓ ready in 1.2s"]

const FEATURES = [
  { title: "Virtualisation out of the box", text: "48,000 rows render like 12: only what is in the viewport is in the DOM. Switches on by itself once there are more than two hundred rows.", demo: "rows", wide: true },
  { title: "Sorting", text: "By any column, with a custom comparator and a stable order.", demo: "sort" },
  { title: "The theme is yours", text: "Not a single style inside. Light, dark, branded — the table picks up any of them.", demo: "theme" },
  { title: "Types inferred from data", text: "Columns know the cell type: the editor will hint, TypeScript will check.", demo: "types" },
  { title: "Grouping", text: "One key — and rows gather into collapsible groups with totals.", demo: "group" },
  { title: "4 KB and zero dependencies", text: "Smaller than an icon. Tree-shaking: you take only what you use.", demo: "size" },
] as const

const ROWS = [
  { name: "invoice-0412.pdf", type: "pdf", size: 412, updated: "today" },
  { name: "logo.svg", type: "image", size: 18, updated: "yesterday" },
  { name: "report-q3.xlsx", type: "sheet", size: 1290, updated: "3 days" },
  { name: "cover.webp", type: "image", size: 240, updated: "a week" },
  { name: "contract.pdf", type: "pdf", size: 980, updated: "a month" },
  { name: "budget.xlsx", type: "sheet", size: 2100, updated: "a month" },
]

const STEPS = [
  { title: "Sorting", text: "`sort: { by: \"size\" }` — one line, and the column is sorted. Stable, with any comparator." },
  { title: "Grouping", text: "`groupBy: \"type\"` — rows gather under headings with a count. Totals are computed for you." },
  { title: "Zebra", text: "`view.zebra` — even rows are tinted, a long table is easier to read." },
  { title: "Compact", text: "`density: \"compact\"` — a third more rows in the same viewport. Still your markup." },
]

const CONTRIBUTORS = ["Anna Kravets", "Bart Meyer", "Ilya Sorokin", "Yuki Tanaka", "Marta Grin", "Diego Alves", "Oleg Chernykh", "Priya Nair", "Nastya Lee", "Tom Becker", "Kirill Us", "Lea Fischer", "Maxim Dub", "Sofia Rossi", "Zhenya Pak", "Ahmed Saleh", "Vika Moroz", "Nils Berg", "Danil Roz", "Chloé Martin", "Artem Gai", "Ola Nowak", "Lena Shal", "Ravi Kumar"].map((name, index) => ({ name, commits: Math.max(1, Math.round(420 / (index + 1) ** 1.1)) }))

const RELEASES = [
  { version: "2.4.1", date: "18 Sep 2026", title: "Virtualisation with variable row height", items: ["rows of different heights without measuring ahead — ResizeObserver as they appear", "`table.scrollTo(rowIndex)` for programmatic scrolling", "fixed jitter on fast trackpad scrolling"] },
  { version: "2.4.0", date: "2 Sep 2026", title: "Grouping with totals", items: ["`groupBy` accepts a function, not only a key", "`sum`, `avg`, `count` aggregates in the group row", "`onGroupToggle` events with state"] },
  { version: "2.3.0", date: "12 Aug 2026", title: "Function columns and types", items: ["a column can be a function of the row — the type is inferred automatically", "`ColumnDef<T>` is exported for external definitions", "the types documentation is rewritten"] },
  { version: "2.0.0", date: "1 Jun 2026", title: "Truly headless", breaking: true, items: ["!the styled `<Table>` component is removed — only the `useTable` hook", "!`onSort` now receives `{ by, dir }` instead of two arguments", "bundle size 4.1 KB instead of 11", "React 19 and Server Components"] },
]

export default function OpensourceDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <div style={noise} aria-hidden="true" />
      <Navbar030
        {...light}
        links={[
          { label: "Docs", href: "#docs" },
          { label: "Playground", href: "#playground" },
          { label: "Compare", href: "#compare" },
          { label: "History", href: "#changelog" },
        ]}
        starsLabel="stars"
        starsAria="{stars} {label} on GitHub"
        actionLabel="Get started"
        navLabel="Sections"
        menuLabel="Menu"
        menuOpenLabel="Open menu"
        menuCloseLabel="Close menu"
      />
      <div id="top">
        <Hero030
          {...light}
          eyebrow="v2.4 · a headless table for React"
          title="A table lighter than your *favicon*"
          lede="Sorting, grouping, virtualisation and types — without a single style. tabl gives you the data and the behaviour, you draw the markup."
          copyLabel="copy"
          copiedLabel="copied"
          terminal={TERMINAL}
          primaryLabel="Documentation"
          secondaryLabel="Open the playground"
          facts={["4 KB gzip", "TypeScript", "0 dependencies", "MIT"]}
          managersLabel="Package manager"
          terminalLabel="Terminal"
        />
      </div>
      <div id="playground">
        <Opensource001
          {...light}
          eyebrow="// playground"
          title="Try it without installing"
          lede="Every toggle is one option in code. On the left — what you write, on the right — what you get."
          rows={ROWS}
          sortLabel="sort by size"
          groupLabel="group by type"
          zebraLabel="zebra"
          compactLabel="compact"
          resultLabel="result"
          steps={STEPS}
          stepsLabel="Steps"
        />
      </div>
      <div id="docs">
        <Bento001
          {...light}
          eyebrow="// features"
          title="Everything a table needs. Nothing it doesn't"
          features={FEATURES}
          lede="Six things you usually write yourself and then fix. Here they are written once."
          sizeOthers={["others", "yet others"]}
          kbUnit="kb"
        />
      </div>
      <div id="compare">
        <Comparison006
          {...light}
          eyebrow="// comparison"
          title="Smaller means faster"
          lede="Gzipped size of headless tables for React. Data from bundlephobia on the day of the 2.4 release."
          unit="KB"
          metric="gzip, minimal import"
          footnote="Measured with `import { useTable }` and no styles. The full tabl feature set — 6.8 KB."
          checksLabel="4.1 KB includes"
          checks={["sorting", "grouping", "virtualisation", "column types", "SSR", "row selection"]}
          selfTag="that's us"
        />
      </div>
      <div id="community">
        <Stats002
          {...light}
          eyebrow="// community"
          title="Made by 214 people from 31 countries"
          lede="Every pull request is reviewed by two maintainers, every release passes 1,900 tests. Join in — there is always a good first issue."
          stats={[
            { value: 214, label: "contributors" },
            { value: 12480, label: "stars on GitHub" },
            { value: 3.2, label: "M installs a month", suffix: "M" },
          ]}
          wallLabel="Contributors · size is contribution"
          starLabel="stars on GitHub · 12 months"
          contributors={CONTRIBUTORS}
          moreLabel="+190 on GitHub →"
          gainLine="+{n} this month"
          personAria="{name}, {n} commits"
        />
      </div>
      <div id="changelog">
        <Changelog004 {...light} eyebrow="// version history" title="What changed" lede="Semantic versions, breaking changes are marked. The full list is in CHANGELOG.md." releases={RELEASES} allLabel="Full changelog →" />
      </div>
      <div id="star">
        <Cta024
          {...dark}
          title="One star — one more maintainer"
          text="GitHub stars are the only metric by which a project gets into curated lists and finds people. If tabl saved you an evening — give a minute back."
          secondaryLabel="Open on npm"
          copyLabel="copy"
          copiedLabel="copied"
          sponsorsLabel="Sponsors"
          sponsors={[{ name: "Vercel" }, { name: "Cloud.ru" }, { name: "Selectel" }, { name: "Tinkoff Open Source" }]}
          sponsorLabel="become a sponsor"
        />
      </div>
      <Footer029
        {...dark}
        tagline="A headless table for React. Data and behaviour from us, markup from you."
        columns={[
          { title: "Project", links: [{ label: "Documentation", href: "#docs" }, { label: "Playground", href: "#playground" }, { label: "Version history", href: "#changelog" }, { label: "Roadmap", href: "#" }] },
          { title: "Community", links: [{ label: "GitHub", href: "#" }, { label: "Discussions", href: "#" }, { label: "Telegram", href: "#" }, { label: "Good first issue", href: "#" }] },
          { title: "More", links: [{ label: "npm", href: "#" }, { label: "Sponsors", href: "#star" }, { label: "Code of conduct", href: "#" }, { label: "Security", href: "#" }] },
        ]}
        status="all systems operational · CI green"
        madeBy="made by contributors from 31 countries"
      />
    </div>
  )
}
