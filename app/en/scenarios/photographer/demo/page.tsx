import type { CSSProperties, ReactNode } from "react"

import { Sketch001 } from "@/registry/animations/sketch/sketch-001/sketch-001"
import { Sketch007 } from "@/registry/animations/sketch/sketch-007/sketch-007"
import { Sketch009 } from "@/registry/animations/sketch/sketch-009/sketch-009"
import { Sketch012 } from "@/registry/animations/sketch/sketch-012/sketch-012"
import { Sketch013 } from "@/registry/animations/sketch/sketch-013/sketch-013"
import { Sketch015 } from "@/registry/animations/sketch/sketch-015/sketch-015"
import { Sketch016 } from "@/registry/animations/sketch/sketch-016/sketch-016"
import { Sketch017 } from "@/registry/animations/sketch/sketch-017/sketch-017"
import { Sketch018 } from "@/registry/animations/sketch/sketch-018/sketch-018"
import { Sketch019 } from "@/registry/animations/sketch/sketch-019/sketch-019"
import { Sketch020 } from "@/registry/animations/sketch/sketch-020/sketch-020"
import { Sketch021 } from "@/registry/animations/sketch/sketch-021/sketch-021"
import { Sketch022 } from "@/registry/animations/sketch/sketch-022/sketch-022"
import { Sketch023 } from "@/registry/animations/sketch/sketch-023/sketch-023"
import { Surface025 } from "@/registry/blocks/background/surface-025/surface-025"

/**
 * English version of the "Photographer portfolio" demo: same blocks and
 * theme as `app/scenarios/photographer/demo/page.tsx`, text in English.
 *
 * Built entirely from the hand-drawn sketch group: a light paper theme, one
 * handwriting across the whole page. A showcase of the result, not a
 * template: the same blocks are installed with commands.
 */
export const metadata = {
  title: "Anya Sokolova — photographer",
  description:
    "VibeUI «Photographer portfolio» scenario demo: a portrait and wedding photographer's site built from the catalogue's hand-drawn blocks.",
}

const ACCENT = "#c2410c"
const INK = "#1c1917"
const PAPER = "#faf7f2"
const FONT = '"Neucha","Caveat","Segoe Print","Bradley Hand",cursive'
const DISPLAY = '"Caveat","Neucha","Segoe Print",cursive'
const FONTS = "https://fonts.googleapis.com/css2?family=Neucha&family=Caveat:wght@400..700&display=swap"

const sketch = {
  tone: "light",
  accent: ACCENT,
  ink: INK,
  rough: "loose",
  boil: "soft",
} as const

// The grid comes from surface-025; sections give up their paper background
// (transparent) so it runs through the whole page. White cards and the
// sticky header sit on top.
const page: CSSProperties = {
  colorScheme: "light",
  color: INK,
  fontFamily: FONT,
}

/** A block's paper background is transparent: the page grid shows through. */
const onGrid = (name: string) => ({ [`--vibeui-sketch-${name}-paper`]: "transparent" }) as CSSProperties

const PHOTOS = "/demo/photographer"

const WORKS = [
  { title: "Liza and Mark, Ladoga", category: "Wedding", image: `${PHOTOS}/work-01.webp`, orientation: "portrait" },
  { title: "A cover portrait", category: "Portrait", image: `${PHOTOS}/work-02.webp`, orientation: "portrait" },
  { title: "The Ivanovs at the dacha", category: "Family", image: `${PHOTOS}/work-03.webp`, orientation: "landscape" },
  { title: "Morning on Vasilievsky", category: "Street", image: `${PHOTOS}/work-04.webp`, orientation: "landscape" },
  { title: "Anna, actress", category: "Portrait", image: `${PHOTOS}/work-05.webp`, orientation: "portrait" },
  { title: "A ceremony in Pushkin", category: "Wedding", image: `${PHOTOS}/work-06.webp`, orientation: "landscape" },
  { title: "Danya, 6 months", category: "Family", image: `${PHOTOS}/work-07.webp`, orientation: "portrait" },
  { title: "Rain on Nevsky", category: "Street", image: `${PHOTOS}/work-08.webp`, orientation: "landscape" },
] as const

const STEPS = [
  { title: "Getting to know you", text: "Half an hour on the phone or over coffee: who you are, what the photos are for, what scares you in front of a camera." },
  { title: "Idea and place", text: "I pick a place for you: the embankment, your kitchen, the dacha. I send references and what to wear." },
  { title: "The shoot", text: "An hour or two. I talk, you answer, the camera does its thing. No posing needed." },
  { title: "Selection and retouching", text: "Out of 300 frames I pick the living ones, retouch light and clutter, and leave your skin yours." },
  { title: "The album", text: "In 7–10 days a link to the gallery, in a month a printed album by post." },
]

const PACKAGES = [
  { title: "Portrait", price: "12 000 ₽", text: "An hour in the city or the studio, 30 retouched frames, ready in a week." },
  { title: "Family", price: "18 000 ₽", text: "Two hours outdoors or at home, 50 frames, a slideshow for the grandparents." },
  { title: "Wedding", price: "from 60 000 ₽", text: "The whole day from getting ready to the dancing, 400+ frames, an album as a gift." },
]

const QUOTES = [
  { text: "We were shy of the camera, and ten minutes later we forgot about it. In the photos we're real.", author: "Liza and Mark" },
  { text: "Anya caught the moment our son laughed for the first time. That frame hangs in our hallway.", author: "Olga" },
  { text: "The portrait came out without «photoshopped» skin. Finally it's me, not a doll.", author: "Anna, actress" },
]

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
      {children}
    </section>
  )
}

function Heading({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl" style={{ fontFamily: DISPLAY }}>
        {children}
      </h2>
      {note ? <p className="mt-3 text-lg leading-relaxed opacity-70">{note}</p> : null}
    </div>
  )
}

export default function Page() {
  return (
    <Surface025 tone="light" pattern="grid" cell={24} strength="soft" paper={PAPER} style={page} className="min-h-dvh">
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Sketch019
        {...sketch}
        brand="Anya Sokolova"
        brandHref="#"
        caption="portrait and wedding photographer · Petersburg"
        links={[
          { label: "Work", href: "#works" },
          { label: "How a shoot goes", href: "#process" },
          { label: "About me", href: "#about" },
          { label: "Prices", href: "#pricing" },
        ]}
        actionLabel="Book a shoot"
        actionHref="#book"
        menuLabel="menu"
        navLabel="Sections"
      />
      <div id="hero">
      <Sketch016
        {...sketch}
        style={onGrid("016")}
        eyebrow="Portrait and wedding photographer · Petersburg"
        title="I shoot people,"
        titleAccent="not poses"
        lede="No «smile on three». An hour of talking, a bit of a walk — and in the pictures you're the way the people close to you see you."
        primaryLabel="Book a shoot"
        primaryHref="#book"
        secondaryLabel="See the work"
        secondaryHref="#works"
        image={`${PHOTOS}/hero.webp`}
        imageAlt="Anya with a film camera on the Neva embankment"
        imageCaption="the Neva, May, film"
        arrowLabel="that's me"
      />
      </div>
      <Sketch018
        {...sketch}
        labels={["work", "how it goes", "about me", "reviews", "prices", "booking"]}
        doodles={[
          ["film", "frame"],
          ["coffee", "clock"],
          ["glasses", "lens"],
          ["heart", "chat"],
          ["coin", "tag"],
          ["phone", "calendar"],
        ]}
      >
        <div id="works">
          <Sketch017 {...sketch} style={onGrid("017")} title="Eight stories out of three hundred" allLabel="All" works={[...WORKS]} closeLabel="Close" prevLabel="Previous frame" nextLabel="Next frame" emptyLabel="Nothing here yet" />
        </div>
        <Section id="process">
          <div className="mb-8">
            <Sketch013 {...sketch} text="how it works" />
          </div>
          <div className="absolute top-24 right-8 hidden lg:block">
            <Sketch023 {...sketch} text="weather reschedule — free" pin="tape" tilt={4} />
          </div>
          <Heading note="No surprises: from the first message to the album, exactly five steps.">
            How a <Sketch009 {...sketch} kind="highlight" text="shoot" /> goes
          </Heading>
          <Sketch012 {...sketch} steps={STEPS.map((step) => step.title)} current={2} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, index) => (
              <Sketch007 key={step.title} {...sketch} seed={100 + index} title={`${index + 1}. ${step.title}`} text={step.text} className="!max-w-none" />
            ))}
          </div>
        </Section>
        <div id="about">
          <Sketch020
            {...sketch}
            style={onGrid("020")}
            eyebrow="About me"
            title="Seven years of shooting people who don't like being shot"
            paragraphs={[
              "I started with reportage for a city newspaper, so I don't wait for the «right» light and I don't arrange arms. I catch what's already happening.",
              "I shoot film and digital, retouch myself and without «plastic»: freckles and wrinkles stay where they are.",
            ]}
            image={`${PHOTOS}/about.webp`}
            imageAlt="Anya sorting prints in her home studio"
            imageCaption="home studio, November"
            points={["No poses and no «smile»", "Film and digital, retouching without plastic", "Ready in 10 days, the album in a month"]}
            stats={[
              { value: "300+", label: "shoots" },
              { value: "48", label: "weddings" },
              { value: "7 years", label: "with a camera" },
              { value: "10 days", label: "to finished photos" },
            ]}
          />
        </div>
        <Section id="reviews">
          <div className="absolute top-12 right-10 hidden lg:block">
            <Sketch023 {...sketch} text="these are real people, not stock" pin="tape" tilt={3} paper="#e6f1e2" />
          </div>
          <Heading>What they say afterwards</Heading>
          <div className="grid gap-8 md:grid-cols-3">
            {QUOTES.map((quote) => (
              <Sketch015 key={quote.author} {...sketch} text={quote.text} author={quote.author} />
            ))}
          </div>
        </Section>
        <Section id="pricing">
          <div className="mb-8">
            <Sketch013 {...sketch} text="prices" />
          </div>
          <div className="absolute top-20 right-8 hidden lg:block">
            <Sketch023 {...sketch} text="free dates — May and June" pin="pin" tilt={-5} paper="#ffe8d6" />
          </div>
          <Heading note="30% upfront, the rest after the shoot. Weather reschedules are free.">
            Three formats, no small print
          </Heading>
          <div className="grid gap-6 sm:grid-cols-3">
            {PACKAGES.map((item) => (
              <Sketch007 key={item.title} {...sketch} title={item.title} text={item.text}>
                <p className="mb-4 text-4xl font-bold" style={{ color: ACCENT, fontFamily: DISPLAY }}>
                  {item.price}
                </p>
                <p className="mb-5 leading-snug opacity-75">{item.text}</p>
                <Sketch001 {...sketch} variant="solid" label="Choose" />
              </Sketch007>
            ))}
          </div>
        </Section>
        <div id="book">
          <Sketch021
            {...sketch}
            style={onGrid("021")}
            eyebrow="Booking"
            title="Pick a day, I'll call you back"
            description="Fifteen minutes on the phone: we'll discuss the idea, the place and what to bring."
            days={[
              { label: "Today", note: "14 May" },
              { label: "Tomorrow", note: "15 May" },
              { label: "Friday", note: "16 May" },
            ]}
            phoneLabel="Phone"
            phonePlaceholder="+7 999 123-45-67"
            phoneHint="Country code is fine. No input mask: it breaks pasting from the clipboard."
            consentLabel="I agree to a call on this number."
            submitLabel="Book a shoot"
            doneLabel="Booked. I'll call at the chosen time."
            footNote="I reply the same day. Reschedules, no questions asked."
            dayLegend="Day"
            slotLegend="Call time"
            takenLabel="taken"
          />
        </div>
      </Sketch018>
      <div id="footer">
      <Sketch022
        {...sketch}
        style={onGrid("022")}
        image={`${PHOTOS}/next.webp`}
        imageAlt="A wedding by a bonfire on the shore of Ladoga"
        kicker="Next story"
        title="Liza and Mark. Ladoga, June"
        note="a two-day wedding, no host and with a bonfire"
        href="#works"
        linkLabel="see →"
        studioName="Anya Sokolova"
        contactLabel="Write to me"
        contactHref="#book"
        links={[
          { label: "Telegram", href: "https://t.me/" },
          { label: "Instagram", href: "https://instagram.com/" },
        ]}
        legal="© 2026 Anya Sokolova. Photos not for reprint."
      />
      </div>
    </Surface025>
  )
}
