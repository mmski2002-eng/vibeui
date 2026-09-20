import type { CSSProperties } from "react"

import { Navbar041 } from "@/registry/blocks/navbar/navbar-041/navbar-041"
import { Hero041 } from "@/registry/blocks/hero/hero-041/hero-041"
import { Market001 } from "@/registry/blocks/industry/market-001/market-001"
import { Market002 } from "@/registry/blocks/industry/market-002/market-002"
import { Market003 } from "@/registry/blocks/industry/market-003/market-003"
import { People021 } from "@/registry/blocks/team/people-021/people-021"
import { Bento010 } from "@/registry/blocks/layout/bento-010/bento-010"
import { Testimonials024 } from "@/registry/blocks/testimonials/testimonials-024/testimonials-024"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Cta034 } from "@/registry/blocks/cta/cta-034/cta-034"
import { Footer040 } from "@/registry/blocks/footer/footer-040/footer-040"

/**
 * English version of the "Digital goods marketplace" demo: same blocks and
 * theme as `app/scenarios/market/demo/page.tsx`, text in English via props.
 *
 * A gallery catalogue on an almost white background with one electric
 * accent. A 3D shelf of covers spreads apart on scroll, the storefront
 * lives under filters, a discounted bundle is assembled by hand and goes
 * to the header as an event, authors' income ticks in real time.
 */
export const metadata = {
  title: "Layer — templates, icons and fonts from independent authors",
  description:
    "VibeUI «Digital goods marketplace» scenario demo: a 3D shelf in the hero, a storefront with FLIP filters and quick view, a discounted bundle builder, licence tickets, authors with live income, a bento for authors, a drop subscription.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f7f7f5",
  color: "#0f0f0f",
  fontFamily: '"Onest",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const gallery = { tone: "light", accent: "#3b5bff", ink: "#0f0f0f", background: "#f7f7f5" } as const

const QUOTES = [
  { text: "Bought a UI kit on Thursday, on Friday I showed the client a finished prototype. Layers named, auto layouts live — nothing to fix.", name: "Polina Ershova", role: "product designer, Ozon", project: "buyer" },
  { text: "In six months on Layer the font earned more than in three years on a Western marketplace. Payouts on Fridays — like a salary.", name: "Timur Gareev", role: "type designer", project: "author" },
  { text: "A team licence — one button, one invoice for the company, and the whole studio works from a shared library. Accounting didn't argue for the first time.", name: "Mark Leshchenko", role: "art director, Format studio", project: "team" },
]

const FAQ = [
  { question: "What's included in a purchase and how do I download?", answer: "Right after payment — a link to the files and the licence in your account. Updates from the author come free, you can download as many times as you like." },
  { question: "How does a personal licence differ from a commercial one?", answer: "Personal — for your own projects and portfolio. Commercial — for client work and products where you earn. Team adds shared access for up to 10 people and a contract for the company." },
  { question: "Can I return a digital product?", answer: "Yes, within 14 days if the files don't open or don't match the description. We write to the author; if there's no reply in two days — we refund ourselves." },
  { question: "How are authors paid?", answer: "80% of the price of every sale. Payout every Friday to a card or a sole proprietor's account, with no minimum. Taxes — under the agency scheme, a report comes once a month." },
  { question: "How do I get into the Thursday drop?", answer: "Upload the product by Tuesday — the editors check the files and the description, and it goes out in the nearest drop. All the week's new arrivals go into the email." },
]

export default function MarketDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar041
        {...gallery}
        brand="Layer"
        links={[
          { label: "Catalogue", href: "#catalog" },
          { label: "Bundles", href: "#bundle" },
          { label: "Licences", href: "#licenses" },
          { label: "Authors", href: "#authors" },
        ]}
        searchPlaceholder="Template, icons, font…"
        sellLabel="Sell"
        cartLabel="Bundle"
        navLabel="Sections"
        menuLabel="Menu"
        menuOpenLabel="Open menu"
        menuCloseLabel="Close menu"
      />
      <div id="top">
        <Hero041
          {...gallery}
          eyebrow="a digital goods marketplace · *4 812* in the catalogue"
          lines={["Templates and fonts", "from those who", "*live* by them"]}
          lede="Figma, Notion, icons and fonts from independent authors. Bought — downloaded — in use within a minute. 80% of the price goes to the author."
          primaryLabel="Browse the catalogue"
          secondaryLabel="Sell on Layer"
          cards={[
            { name: "Atlas — UI kit", price: "2 490 ₽", image: "/demo/market/cover-01.webp", kind: "figma" },
            { name: "Routine — second brain", price: "990 ₽", image: "/demo/market/cover-02.webp", kind: "notion" },
            { name: "Edge — 480 icons", price: "1 490 ₽", image: "/demo/market/cover-03.webp", kind: "icons" },
            { name: "Narva Grotesk", price: "3 900 ₽", image: "/demo/market/cover-04.webp", kind: "font" },
            { name: "Dashboard Pro", price: "3 200 ₽", image: "/demo/market/cover-05.webp", kind: "figma" },
            { name: "Sprint — tracker", price: "1 290 ₽", image: "/demo/market/cover-06.webp", kind: "notion" },
            { name: "Pixel 3D", price: "1 990 ₽", image: "/demo/market/cover-07.webp", kind: "icons" },
            { name: "Moto Script", price: "2 400 ₽", image: "/demo/market/cover-08.webp", kind: "font" },
          ]}
          hint="scroll — the shelf spreads apart"
        />
      </div>
      <div id="catalog">
        <Market001
          {...gallery}
          eyebrow="storefront · updated on Thursdays"
          title="What's selling this week"
          lede="Every product is checked by the editors: the files open, the layers are named, the licence is clear."
          products={[
            { name: "Atlas — UI kit", author: "Lena Zavarzina", kind: "figma", price: 2490, image: "/demo/market/cover-01.webp", downloads: 4210, isNew: false },
            { name: "Routine — second brain", author: "Igor Plotnikov", kind: "notion", price: 990, image: "/demo/market/cover-02.webp", downloads: 6830 },
            { name: "Edge — 480 icons", author: "Setka studio", kind: "icons", price: 1490, image: "/demo/market/cover-03.webp", downloads: 3120, isNew: true },
            { name: "Narva Grotesk", author: "Timur Gareev", kind: "fonts", price: 3900, image: "/demo/market/cover-04.webp", downloads: 1980 },
            { name: "Dashboard Pro", author: "Lena Zavarzina", kind: "figma", price: 3200, image: "/demo/market/cover-05.webp", downloads: 2740, isNew: true },
            { name: "Sprint — product tracker", author: "Anya Melnik", kind: "notion", price: 1290, image: "/demo/market/cover-06.webp", downloads: 5110 },
            { name: "Pixel 3D", author: "Setka studio", kind: "icons", price: 1990, image: "/demo/market/cover-07.webp", downloads: 1420, isNew: true },
            { name: "Moto Script", author: "Timur Gareev", kind: "fonts", price: 2400, image: "/demo/market/cover-08.webp", downloads: 860 },
          ]}
          kinds={[
            { key: "figma", label: "Figma" },
            { key: "notion", label: "Notion" },
            { key: "icons", label: "Icons" },
            { key: "fonts", label: "Fonts" },
          ]}
          allLabel="All"
          sortLabels={{ popular: "Popular", fresh: "New", cheap: "Cheaper", expensive: "Pricier" }}
          licenses={[
            { key: "personal", label: "Personal", factor: 1, note: "one person, own projects" },
            { key: "commercial", label: "Commercial", factor: 2.5, note: "client projects, one designer" },
            { key: "team", label: "Team", factor: 5, note: "up to 10 people, any projects" },
          ]}
          quickLabel="Quick view"
          addLabel="Add to bundle"
          addedLabel="In the bundle"
          chipsLabel="Categories"
          sortsLabel="Sorting"
          sortShort="sort"
          emptyText="Nothing yet — come back on Thursday."
          downloadsUnit="downloads"
          licenseLabel="Licence"
        />
      </div>
      <div id="bundle">
        <Market002
          {...gallery}
          eyebrow="a discounted bundle"
          title="Build a bundle — the discount grows with every item"
          lede="Two items — 5% off, three — 15% off, four or more — 25% off. The discount is counted from the full price, any licence."
          items={[
            { name: "Atlas — UI kit", kind: "Figma", price: 2490, image: "/demo/market/cover-01.webp" },
            { name: "Routine — second brain", kind: "Notion", price: 990, image: "/demo/market/cover-02.webp" },
            { name: "Edge — 480 icons", kind: "Icons", price: 1490, image: "/demo/market/cover-03.webp" },
            { name: "Narva Grotesk", kind: "Font", price: 3900, image: "/demo/market/cover-04.webp" },
            { name: "Dashboard Pro", kind: "Figma", price: 3200, image: "/demo/market/cover-05.webp" },
            { name: "Sprint — product tracker", kind: "Notion", price: 1290, image: "/demo/market/cover-06.webp" },
          ]}
          preselected={["Atlas — UI kit", "Edge — 480 icons"]}
          panelTitle="Your bundle"
          emptyText="Empty so far. Press «+» on an item or «Add to bundle» in the storefront."
          checkoutLabel="Check out the bundle"
          itemUnits={["item", "items", "items"]}
          removeLabel="Remove «{name}» from the bundle"
          addLabel="Add «{name}» to the bundle"
          removeShort="Remove «{name}»"
          scaleLabel="The discount grows"
          nextLine="{n} more {items} — and {percent}% off"
          maxLine="Maximum discount. You can keep adding."
          subtotalLabel="Full price"
          discountLabel="Discount"
          totalLabel="Total"
          hideLabel="Hide the mini cart"
        />
      </div>
      <div id="licenses">
        <Market003
          {...gallery}
          eyebrow="licences"
          title="One product price — three ways to use it"
          lede="The licence price is calculated from the product's base price. Pick an example — the tickets recalculate."
          licenses={[
            { name: "Personal", factor: 1, who: "One person, own projects and portfolio.", rules: ["+ Personal and study projects", "+ Portfolio and social media", "+ Updates forever", "− Client projects", "− Passing files to third parties"] },
            { name: "Commercial", factor: 2.5, who: "One designer, any clients, no limit on projects.", rules: ["+ Everything in personal", "+ Client projects without limit", "+ Products with sales", "+ Priority support from the author", "− Shared access for a team"], featured: true },
            { name: "Team", factor: 5, seatsIncluded: 10, perExtraSeat: 0.4, who: "Up to 10 people included, then a surcharge per seat.", rules: ["+ Everything in commercial", "+ A shared library in Figma", "+ An invoice and a contract for the company", "+ A manager and a response SLA", "+ Seats can be added at any time"] },
          ]}
          basePriceLabel="Product base price"
          seatsLabel="People in the team"
          lessLabel="Fewer seats"
          moreLabel="More seats"
          peopleShort="ppl"
          featuredLabel="most popular"
          seatsLine="{n} seats · ×{factor}"
          extraLabel=" + surcharge"
          factorLine="×{factor} of the base"
        />
      </div>
      <div id="authors">
        <People021
          {...gallery}
          eyebrow="authors"
          title="1 240 authors are earning on Layer right now"
          lede="Income is counted in real time: every purchase — 80% to the author, payout on Fridays. Drag the strip."
          authors={[
            { name: "Lena Zavarzina", role: "UI kits and dashboards for Figma", hue: 255, products: 14, baseIncome: 96400, perSecond: 0.11 },
            { name: "Timur Gareev", role: "Fonts: grotesques and scripts", hue: 30, products: 6, baseIncome: 142000, perSecond: 0.07 },
            { name: "Setka studio", role: "Icons and illustrations", initials: "ST", hue: 150, products: 22, baseIncome: 210800, perSecond: 0.18 },
            { name: "Anya Melnik", role: "Notion for product teams", hue: 320, products: 9, baseIncome: 58900, perSecond: 0.05 },
            { name: "Igor Plotnikov", role: "Notion: personal productivity", hue: 200, products: 11, baseIncome: 73200, perSecond: 0.09 },
            { name: "Marat Yusupov", role: "3D icons and mockups", hue: 85, products: 5, baseIncome: 31500, perSecond: 0.04 },
          ]}
          incomeLabel="income this month"
          joinLabel="Become an author"
          productsUnit="products"
          perHourUnit="/hour"
          dragHint="← drag the strip →"
        />
      </div>
      <div id="for-authors">
        <Bento010
          {...gallery}
          eyebrow="for authors"
          title="Uploaded once — sells for years"
          lede="We take care of payment, licences, taxes under the agency scheme and buyer support. You — only the product."
          hero={{ value: 80, suffix: " %", label: "of every sale goes to the author" }}
          heroText="No thresholds and no «first 100 sales at a different rate». One rate for everyone, from the first rouble."
          payoutTitle="Payouts every Friday"
          payoutText="To a card or a sole proprietor's account, with no minimum."
          stats={[
            { value: 4812, label: "products in the catalogue" },
            { value: 1240, label: "authors receive payouts" },
            { value: 2.1, decimals: 1, suffix: " M", label: "downloads in a year" },
          ]}
          purchasesLabel="just bought"
          purchases={[
            { who: "Masha from Kazan", what: "Atlas — UI kit", ago: "just now" },
            { who: "Format studio", what: "Narva Grotesk · team", ago: "1 min" },
            { who: "Kirill from Tbilisi", what: "Routine — second brain", ago: "2 min" },
            { who: "Olya from Novosibirsk", what: "Edge — 480 icons", ago: "4 min" },
            { who: "Artem from Minsk", what: "Dashboard Pro · commercial", ago: "6 min" },
            { who: "Dina from Almaty", what: "Sprint — product tracker", ago: "9 min" },
          ]}
          ctaLabel="Become an author"
          days={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
          weekLabel="Week"
        />
      </div>
      <Testimonials024 {...gallery} eyebrow="buyers and authors say" quotes={QUOTES} prevLabel="Previous testimonial" nextLabel="Next testimonial" />
      <div id="faq">
        <Faq023 {...gallery} eyebrow="Questions" title="Asked before buying" lede="Briefly about licences, refunds and payouts. Didn't find the answer — write to us, we reply within a day." items={FAQ} contactLabel="Message support" contactHref="#contact" />
      </div>
      <div id="drops">
        <Cta034
          {...gallery}
          eyebrow="next drop in"
          title="New products — on Thursdays at noon"
          lede="Once a week, a drop email: 10–15 new products and one at 50% off for a day. Nothing else."
          word="DROP"
          placeholder="Email"
          actionLabel="Get the drops"
          fine={["once a week", "unsubscribe in one email", "no spam"]}
          doneTitle="You're on the list"
          doneText="The first email arrives on Thursday at 12:00 sharp."
          timerLabel="Until the next drop"
          units={["days", "hrs", "min", "sec"]}
        />
      </div>
      <Footer040
        {...gallery}
        brand="Layer"
        caption="A design assets marketplace: templates, icons, fonts from independent authors. 80% of the price goes to the author."
        columns={[
          { title: "Catalogue", links: [{ label: "Figma templates", href: "#catalog" }, { label: "Notion templates", href: "#catalog" }, { label: "Icons", href: "#catalog" }, { label: "Fonts", href: "#catalog" }, { label: "Bundles", href: "#bundle" }] },
          { title: "Layer", links: [{ label: "For authors", href: "#for-authors" }, { label: "Licences", href: "#licenses" }, { label: "Drops", href: "#drops" }, { label: "Blog", href: "#blog" }] },
          { title: "Help", links: [{ label: "Payment and refunds", href: "#faq" }, { label: "How to download", href: "#faq" }, { label: "Contact us", href: "#contact" }] },
        ]}
        legal={[{ label: "Terms", href: "#terms" }, { label: "Privacy", href: "#privacy" }, { label: "Offer", href: "#offer" }]}
        copyright="© 2026 Layer"
        note="Saint Petersburg · v4.2"
        topLabel="Back to top"
      />
    </div>
  )
}
