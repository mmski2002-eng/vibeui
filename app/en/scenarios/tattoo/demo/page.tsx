import type { CSSProperties } from "react"

import { About010 } from "@/registry/blocks/about/about-010/about-010"
import { Contact017 } from "@/registry/blocks/contact/contact-017/contact-017"
import { Cta020 } from "@/registry/blocks/cta/cta-020/cta-020"
import { Faq019 } from "@/registry/blocks/faq/faq-019/faq-019"
import { Footer023 } from "@/registry/blocks/footer/footer-023/footer-023"
import { Hero024 } from "@/registry/blocks/hero/hero-024/hero-024"
import { Navbar024 } from "@/registry/blocks/navbar/navbar-024/navbar-024"
import { Portfolio007 } from "@/registry/blocks/portfolio/portfolio-007/portfolio-007"
import { Pricing022 } from "@/registry/blocks/pricing/pricing-022/pricing-022"
import { Process001 } from "@/registry/animations/process/process-001/process-001"
import { Stats001 } from "@/registry/blocks/stats/stats-001/stats-001"
import { People009 } from "@/registry/blocks/team/people-009/people-009"
import { Testimonials019 } from "@/registry/blocks/testimonials/testimonials-019/testimonials-019"

/**
 * English version of the "Tattoo studio" demo: same blocks and theme as
 * `app/scenarios/tattoo/demo/page.tsx`, text in English via props.
 *
 * An always dark page, neon fuchsia and violet, cyan for service captions.
 * Navigation is a rail on the left (a dock at the bottom on the phone), so
 * the page needs an inset. Thirteen blocks. A showcase of the result, not
 * a template.
 */
export const metadata = {
  title: "Inkra — tattoo studio in Saint Petersburg: realism, old school, graphic, minimalism",
  description:
    "VibeUI «Tattoo studio» scenario demo: a neon sign, works with a filter, artists, how a session goes, a price calculator, reviews years later and booking in three steps.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#07060b",
  color: "#f3eefc",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

const dark = { tone: "dark" } as const

const P = "/demo/tattoo"

const WORKS = [
  { title: "Lion", style: "realism", image: `${P}/work-01.webp`, meta: "Mark · shoulder", hours: "6 h", story: "The reference is a photo from a nature reserve. The light is arranged so the mane reads even five years on." },
  { title: "Swallow and rose", style: "oldschool", image: `${P}/work-02.webp`, meta: "Asya · forearm", hours: "3 h", story: "Classic American flash, reworked for the curve of the arm." },
  { title: "Fern", style: "minimal", image: `${P}/work-03.webp`, meta: "Lina · collarbone", hours: "1.5 h", story: "A single unbroken line, the sketch was drawn right on the skin." },
  { title: "Mandala", style: "graphic", image: `${P}/work-04.webp`, meta: "Timur · back", hours: "9 h", story: "Two sessions. Symmetry along the spine, corrected for posture." },
  { title: "Koi", style: "color", image: `${P}/work-05.webp`, meta: "Mark · shin", hours: "7 h", story: "Japanese school: the water swirls against the fish's movement." },
  { title: "Cat", style: "realism", image: `${P}/work-06.webp`, meta: "Mark · thigh", hours: "5 h", story: "Colour realism from the owner's photo, the eyes as the last layer." },
  { title: "Moon phases", style: "minimal", image: `${P}/work-07.webp`, meta: "Lina · spine", hours: "2 h", story: "Dotwork, each phase is a separate pass of a 3RL needle." },
  { title: "Fox", style: "color", image: `${P}/work-08.webp`, meta: "Asya · shoulder", hours: "5 h", story: "Neo-traditional: thick outline, warm palette, peonies instead of daisies." },
  { title: "Brushstroke", style: "color", image: `${P}/work-09.webp`, meta: "Lina · shoulder blade", hours: "3 h", story: "Watercolour without an outline, fuchsia and cyan — the studio colours." },
  { title: "Sleeve", style: "graphic", image: `${P}/work-10.webp`, meta: "Timur · arm", hours: "22 h", story: "Four sessions. The ornament is assembled from patterns of northern carpets." },
  { title: "Wave", style: "minimal", image: `${P}/work-11.webp`, meta: "Lina · wrist", hours: "40 min", story: "The smallest work of the month. Done during the consultation." },
  { title: "Clock and roses", style: "realism", image: `${P}/work-12.webp`, meta: "Mark · chest", hours: "8 h", story: "Black and grey realism, the time on the clock is his daughter's birth date." },
]

const ARTISTS = [
  { name: "Asya", styles: ["old school", "neo-traditional"], experience: "9 years", image: `${P}/artist-01.webp`, works: [`${P}/work-02.webp`, `${P}/work-08.webp`, `${P}/work-05.webp`], slot: "slot 21 Sep", color: "#ff2bd6", href: "#booking" },
  { name: "Mark", styles: ["realism", "black and grey"], experience: "14 years", image: `${P}/artist-02.webp`, works: [`${P}/work-01.webp`, `${P}/work-06.webp`, `${P}/work-12.webp`], slot: "slot 3 Oct", color: "#8b5cff", href: "#booking" },
  { name: "Timur", styles: ["graphic", "ornament"], experience: "7 years", image: `${P}/artist-03.webp`, works: [`${P}/work-04.webp`, `${P}/work-10.webp`, `${P}/work-07.webp`], slot: "slot 24 Sep", color: "#22f3ff", href: "#booking" },
  { name: "Lina", styles: ["minimalism", "watercolour"], experience: "5 years", image: `${P}/artist-04.webp`, works: [`${P}/work-03.webp`, `${P}/work-09.webp`, `${P}/work-11.webp`], slot: "slot tomorrow", color: "#c8ff3a", href: "#booking" },
]

const REVIEWS = [
  { quote: "Mark asked three times where the shirt sleeve would end. Two years on, the lion looks like it was done yesterday.", name: "Ilya", meta: "realism · forearm · 2023", image: `${P}/healed-01.webp`, after: "2 years later", rating: 5 },
  { quote: "I was afraid the thin lines would blur. Lina drew the sketch right on the skin, and the fern is still crisp down to the last leaf.", name: "Marina", meta: "minimalism · shoulder · 2024", image: `${P}/healed-02.webp`, after: "a year later", rating: 5 },
  { quote: "Asya talked me into peonies instead of daisies — and she was right. The colour hasn't faded, even though the thigh was in the sun all summer.", name: "Kira", meta: "neo-traditional · thigh · 2022", image: `${P}/healed-03.webp`, after: "3 years later", rating: 5 },
  { quote: "The ornament on the shin — 9 hours over two sessions. Timur gave a break every forty minutes, and it really helped.", name: "Denis", meta: "graphic · shin · 2024", image: `${P}/healed-04.webp`, after: "a year later", rating: 5 },
]

const FAQ = [
  { question: "Does it hurt?", answer: "Bearable. The sensation depends on the area: the shoulder and forearm are barely felt, the ribs and feet are sharper. Breaks every 40 minutes, numbing is available for sensitive areas." },
  { question: "How long does it take to heal?", answer: "The top layer — 10–14 days, fully — a month. The first three days under film, then cream twice a day. We hand you the instructions to take home." },
  { question: "Can I come at 16?", answer: "From 18. No exceptions, we'll ask for ID at the first session." },
  { question: "How do I choose an artist?", answer: "By style. Realism — Mark, old school — Asya, graphic — Timur, minimalism — Lina. If you're not sure, message us, we'll advise." },
  { question: "Can you cover up an old tattoo?", answer: "Most of the time, yes. Send a photo — we'll tell you what can be done and whether it needs lightening with a laser first." },
  { question: "What should I avoid before a session?", answer: "Alcohol for a day, sun and tanning beds for three days, blood thinners. Sleeping well and eating — allowed and encouraged." },
]

export default function TattooDemoEn() {
  return (
    <div style={page} className="min-h-dvh" data-demo="tattoo">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:1rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <style href="vibeui-demo-rail" precedence="medium">
        {`[data-demo="tattoo"]{padding-bottom:5rem}@media (min-width:60rem){[data-demo="tattoo"]{padding-left:5.5rem;padding-bottom:0}}`}
      </style>
      <Navbar024
        {...dark}
        brandHref="#hero"
        links={[
          { label: "Works", href: "#works", icon: "works" },
          { label: "Artists", href: "#artists", icon: "artists" },
          { label: "How it goes", href: "#process", icon: "process" },
          { label: "Pricing", href: "#pricing", icon: "pricing" },
          { label: "Questions", href: "#faq", icon: "faq" },
        ]}
        status="Slots open"
        actionLabel="Book"
      />

      <div id="hero">
        <Hero024
          {...dark}
          eyebrow="Tattoo studio · since 2014"
          title={"Wear\nyour own"}
          lede="Realism, old school, graphic and minimalism. Four artists, a sterile room, the sketch is free. The first session — as soon as this week."
          primaryLabel="Book a consultation"
          secondaryLabel="See the works"
          facts={[
            { value: "11", label: "years of the studio" },
            { value: "4,800+", label: "works" },
            { value: "4", label: "artists" },
            { value: "100 %", label: "single-use needles" },
          ]}
        />
      </div>

      <div id="works">
        <Portfolio007
          {...dark}
          eyebrow="Works"
          title="What comes out from under the needle"
          styles={[
            { key: "realism", label: "Realism" },
            { key: "oldschool", label: "Old school" },
            { key: "graphic", label: "Graphic" },
            { key: "minimal", label: "Minimalism" },
            { key: "color", label: "Colour" },
          ]}
          works={WORKS}
          allLabel="All"
          closeLabel="Close"
          filtersLabel="Style"
          emptyText="Nothing here yet — try another style."
          prevLabel="Previous"
          nextLabel="Next"
        />
      </div>

      <div id="artists">
        <People009 {...dark} eyebrow="Artists" title="Four hands, four handwritings" lede="Each works in their own style and doesn't take on someone else's: the work comes out better, and you get to the one who loves exactly this." artists={ARTISTS} bookLabel="Book" />
      </div>

      <div id="process">
        <Process001
          {...dark}
          eyebrow="How it goes"
          title="From the idea to healed skin"
          lede="Five steps, none of them skipped. Half the time is before the needle."
          steps={[
            { title: "Idea", text: "Message us or come by: what, where, size, references. We discuss which of the artists it's closest to.", note: "free" },
            { title: "Sketch", text: "The artist draws for your anatomy: we try it on a photo, revise until «yes».", note: "1–3 days" },
            { title: "Sign-off", text: "The final size, placement, price and date. A 20% deposit holds the slot.", note: "30 min" },
            { title: "Session", text: "A sterile room, single-use needles and inks opened in front of you. Breaks every 40 minutes.", note: "from 1 h" },
            { title: "Aftercare", text: "Film, instructions and a free touch-up after a month. The artist stays in touch until it heals.", note: "30 days" },
          ]}
        />
      </div>

      <div id="stats">
        <Stats001
          {...dark}
          eyebrow="In numbers"
          title="A studio people trust with their skin"
          items={[
            { value: 11, label: "years of the studio", fill: 0.7, color: "#ff2bd6" },
            { value: 4800, suffix: "+", label: "works done", fill: 0.92, color: "#8b5cff" },
            { value: 100, suffix: " %", label: "single-use needles and inks", fill: 1, color: "#22f3ff" },
            { value: 98, suffix: " %", label: "come back for a second", fill: 0.98, color: "#c8ff3a" },
          ]}
        />
      </div>

      <div id="pricing">
        <Pricing022
          {...dark}
          eyebrow="Pricing"
          title="How much it costs"
          lede="The price depends on size, placement and detail. The calculator gives an estimate, the artist gives the exact price after the sketch."
          zones={[
            { key: "arm", label: "Arm", factor: 1 },
            { key: "leg", label: "Leg", factor: 1 },
            { key: "back", label: "Back", factor: 1.1 },
            { key: "chest", label: "Chest", factor: 1.25 },
            { key: "ribs", label: "Ribs", factor: 1.4 },
            { key: "neck", label: "Neck and hands", factor: 1.5 },
          ]}
          packages={[
            { name: "Mini", text: "A small piece within one consultation.", price: "from 5,000", hint: "up to 5 cm", features: ["Sketch on the spot", "40 minutes", "Aftercare kit included"], color: "#22f3ff", actionLabel: "Book", actionHref: "#booking" },
            { name: "Session", text: "A medium-sized piece in one visit.", price: "from 15,000", hint: "up to 4 hours", features: ["A custom sketch", "Revisions until «yes»", "A free touch-up after a month"], featured: true, color: "#ff2bd6", actionLabel: "Book", actionHref: "#booking" },
            { name: "Sleeve", text: "A big project over several sessions.", price: "from 60,000", hint: "3–6 sessions", features: ["A concept for the whole arm at once", "A fixed price per project", "Instalments by session"], color: "#8b5cff", actionLabel: "Discuss the project", actionHref: "#booking" },
          ]}
          note="Consultation and sketch are free. A 20% deposit when booking a date, refunded if cancelled 48 hours ahead."
          sizeLabel="Size"
          cmUnit="cm"
          zoneLabel="Area"
          approxLabel="Roughly"
          hoursLine="≈ {n} h of work"
        />
      </div>

      <div id="reviews">
        <Testimonials019 {...dark} eyebrow="Reviews" title="What it looks like years later" items={REVIEWS} prevLabel="Previous" nextLabel="Next" ratingLine="{n} out of 5" dotLine="Review {n}" />
      </div>

      <div id="about">
        <About010
          {...dark}
          eyebrow="About the studio"
          title="A quiet place with loud work"
          text="We're not a salon by the metro and not a basement with posters. Four rooms, daylight, quieter music and one rule: *no compromises on sterility*."
          points={[
            { title: "Everything single-use", text: "Needles, cartridges, inks in capsules and film are opened in front of you." },
            { title: "Autoclave and UV", text: "Reusable grips go through a class B autoclave after every client." },
            { title: "Numbing on request", text: "Certified creams for sensitive areas, discussed in advance." },
          ]}
          imageHallAlt="The studio hall"
          imageDeskAlt="A sterile workstation"
          docs={["Licence No. LO-78-01-011245", "Sanitary service contract", "Artists' health certificates"]}
        />
      </div>

      <div id="faq">
        <Faq019 {...dark} eyebrow="Questions" title="What people ask before the first needle" lede="About pain, healing, age and cover-ups. Didn't find yours — message us, we reply within an hour." items={FAQ} />
      </div>

      <div id="booking">
        <Contact017
          {...dark}
          eyebrow="Booking"
          title="Book a session"
          lede="Three steps, two minutes. Consultation and sketch are free, a deposit only when booking a date."
          artists={[
            { key: "asya", name: "Asya", styles: "old school", color: "#ff2bd6" },
            { key: "mark", name: "Mark", styles: "realism", color: "#8b5cff" },
            { key: "timur", name: "Timur", styles: "graphic", color: "#22f3ff" },
            { key: "lina", name: "Lina", styles: "minimalism", color: "#c8ff3a" },
            { key: "any", name: "Any", styles: "you choose", color: "#a39bb5" },
          ]}
          zones={["arm", "leg", "back", "chest", "ribs", "neck / hands"]}
          slots={[
            { date: "20 Sep", times: ["12:00", "16:00"] },
            { date: "21 Sep", times: ["11:00", "14:00", "18:00"] },
            { date: "23 Sep", times: ["13:00"] },
            { date: "24 Sep", times: ["10:00", "15:00", "19:00"] },
            { date: "27 Sep", times: ["12:00", "17:00"] },
          ]}
          submitLabel="Send the request"
          doneTitle="We've got your request"
          doneText="We'll message you within an hour to confirm the slot and discuss the sketch."
          consent="By pressing the button you agree to the data processing policy. You must be 18+."
          steps={["Artist and area", "Date and time", "Idea and contacts"]}
          stepperLabel="Booking steps"
          artistLabel="Artist"
          zoneLabel="Area"
          dateLabel="Date"
          slotsUnit="slots"
          timeLabel="Time"
          namePlaceholder="Your name"
          nameLabel="Name"
          phonePlaceholder="Phone or Telegram"
          ideaPlaceholder="The idea: what, size, any references"
          ideaLabel="Idea"
          fileLabel="Attach a reference — optional"
          backLabel="Back"
          nextLabel="Next"
          summaryTitle="Your choice"
          whenLabel="When"
          consultLabel="Consultation"
          freeLabel="free"
        />
      </div>

      <div id="contacts">
        <Cta020 {...dark} title="A free consultation — today" text="Come by or message us: we'll show the works, estimate the price and draw the first sketch. No deposit and no obligations." hours="daily 12:00–22:00 · Ligovsky 50" />
      </div>

      <div id="footer">
        <Footer023
          {...dark}
          address="Saint Petersburg, Ligovsky pr. 50, courtyard, entrance by the neon arrow"
          hours="daily 12:00–22:00"
          columns={[
            { title: "Studio", links: [{ label: "Works", href: "#works" }, { label: "Artists", href: "#artists" }, { label: "Pricing", href: "#pricing" }, { label: "Questions", href: "#faq" }] },
            { title: "For clients", links: [{ label: "Book", href: "#booking" }, { label: "Tattoo aftercare", href: "#" }, { label: "Gift certificate", href: "#" }, { label: "Contract and policy", href: "#" }] },
          ]}
          socials={[
            { kind: "telegram", label: "Telegram", href: "https://t.me/" },
            { kind: "instagram", label: "Instagram", href: "https://instagram.com/" },
            { kind: "vk", label: "VK", href: "https://vk.com/" },
            { kind: "youtube", label: "YouTube", href: "https://youtube.com/" },
          ]}
          legal="Sole proprietor A. S. Volkova, licence No. LO-78-01-011245. For persons over 18 only. © 2014–2026."
          mapLabel="on the map"
          ageLabel="18 plus"
        />
      </div>
    </div>
  )
}
