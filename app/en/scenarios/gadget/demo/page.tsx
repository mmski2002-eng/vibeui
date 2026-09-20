import type { CSSProperties } from "react"

import { Navbar043 } from "@/registry/blocks/navbar/navbar-043/navbar-043"
import { Hero043 } from "@/registry/blocks/hero/hero-043/hero-043"
import { Gadget001 } from "@/registry/blocks/industry/gadget-001/gadget-001"
import { Bento012 } from "@/registry/blocks/layout/bento-012/bento-012"
import { Gadget002 } from "@/registry/blocks/industry/gadget-002/gadget-002"
import { Stats012 } from "@/registry/blocks/about/stats-012/stats-012"
import { Comparison016 } from "@/registry/blocks/pricing/comparison-016/comparison-016"
import { Gadget003 } from "@/registry/blocks/industry/gadget-003/gadget-003"
import { Testimonials035 } from "@/registry/blocks/testimonials/testimonials-035/testimonials-035"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Footer042 } from "@/registry/blocks/footer/footer-042/footer-042"

/**
 * English version of the "Hardware gadget" demo: same blocks and theme as
 * `app/scenarios/gadget/demo/page.tsx`, text in English via props.
 *
 * The "Ray" alarm lamp is drawn in CSS and runs the site itself: it shines
 * on the first screen by the sliders, flares up in the sticky dawn, comes
 * apart into its parts, changes colour in the pre-order. The page goes
 * "night → morning → evening": almost black, warm white, black again. Not
 * a single photo.
 */
export const metadata = {
  title: "Ray — a smart alarm lamp that wakes you with light",
  description:
    "VibeUI «Hardware gadget» scenario demo: a CSS lamp with live light, a sticky dawn on scroll, a bento of features, an exploded view, a gauge panel, a comparison with the first version, a pre-order with a countdown and a press ticker.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0a0a0a",
  color: "#f2ede4",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const night = { tone: "dark", accent: "#ffb454", ink: "#f2ede4", background: "#0a0a0a" } as const
const day = { tone: "light", accent: "#d4780f", ink: "#14110f", background: "#f4efe6" } as const
const dusk: CSSProperties = { height: "10rem", background: "linear-gradient(180deg,#f4efe6,#0a0a0a)" }

const FAQ = [
  { question: "When does the batch ship?", answer: "The second batch leaves the Moscow warehouse in October; the counter on the page counts down to the shipping date. Across Russia we deliver in 2–5 days by CDEK or Yandex, free." },
  { question: "What does the warranty cover?", answer: "Two years on everything, including the LEDs and the speaker. Broken — send a photo on Telegram, we ship a replacement and a courier for the old lamp. No need to fix it yourself." },
  { question: "Can I return it if I don't like it?", answer: "30 days from receipt, no reasons needed. We arrange the courier for the box ourselves and refund to your card within three days." },
  { question: "Does the lamp need the internet to work?", answer: "No. The alarms, the dawn and the sounds live in the lamp itself. Wi-Fi is only needed for the app, firmware updates and voice assistants." },
  { question: "Is Ray suitable for children?", answer: "Yes, it's the most common use among owners of the first version. Flicker-free light, not a single indicator in the dark, maximum volume capped at 65 dB." },
]

export default function GadgetDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar043
        {...night}
        brand="Ray"
        caption="alarm lamp · v2"
        links={[
          { label: "Dawn", href: "#dawn" },
          { label: "Features", href: "#features" },
          { label: "Inside", href: "#inside" },
          { label: "Specs", href: "#specs" },
          { label: "Questions", href: "#faq" },
        ]}
        actionLabel="Pre-order"
        navLabel="Sections"
        menuLabel="Menu"
        menuOpenLabel="Open menu"
        menuCloseLabel="Close menu"
      />
      <div id="top">
        <Hero043
          {...night}
          eyebrow="Ray · smart alarm lamp · batch 2"
          title="Wake up to light, not to sound"
          lede="Thirty minutes before the alarm, Ray flares up from embers to daylight white — like a real dawn. The birdsong only comes on if the light didn't help."
          primaryLabel="Pre-order — 14 900 ₽"
          secondaryLabel="See the dawn"
          facts={["1 200 lm", "CRI 97", "2700–6500 K", "5 W speaker", "CO₂ and light sensors"]}
          imageAlt="The Ray alarm lamp"
          kelvinLabel="Light temperature"
          brightnessLabel="Brightness"
        />
      </div>
      <div id="dawn">
        <Gadget001
          {...night}
          eyebrow="How it works"
          title="A dawn in thirty minutes — right on the desk"
          alarmLabel="alarm 06:00"
          steps={[
            { at: 0, label: "05:30 · 1%", text: "Dim red, like embers. The pupils get time to adjust, sleep becomes shallow — without a jolt." },
            { at: 0.34, label: "05:45 · 40%", text: "Warm amber, 2700 K. Cortisol rises on its own, like at a real dawn. Birds outside the window — the speaker, at 8%." },
            { at: 0.68, label: "06:00 · 100%", text: "Daylight white, 5000 K, 1 200 lumens. You're already awake — the alarm sound wasn't needed." },
          ]}
        />
      </div>
      <div id="features">
        <Bento012
          {...day}
          eyebrow="Features"
          title="Not an alarm clock. A small sun with character"
          lede="Ray wakes you with light and keeps sound in reserve. Between alarms it watches the air, lights the desk and obeys the phone — or does without it."
          soundTitle="Sound that doesn't startle"
          soundText="A 5 W 360° speaker: birds, rain, a stream, white noise. The volume rises from zero — not a single sharp ring. A clap — and silence."
          soundChip="48 kHz · 5 W"
          sensorsTitle="Knows what you breathe"
          sensors={[
            { label: "CO₂, ppm", value: "640", percent: 32 },
            { label: "Humidity", value: "42%", percent: 42 },
            { label: "Light, lx", value: "320", percent: 64 },
          ]}
          appTitle="An app — if you want one"
          appText="Schedules, scenes, updates. Without the app Ray works in full: the wheel on the body and a clap."
          alarms={[
            { time: "06:00", label: "Weekdays · 30-min dawn", on: true },
            { time: "08:30", label: "Saturday · birds", on: true },
            { time: "22:30", label: "Sunset · 15 min" },
          ]}
          spectrumTitle="The whole daylight spectrum"
          spectrumText="From a 2700 K candle to 6500 K noon. CRI 97 — colours on the desk are the same as by a window."
          silentTitle="Quieter than the room"
          silentValue="0 dB"
          silentText="No fan, no power-supply whine. At night — zero light: not a single indicator."
          localTitle="Works without the cloud"
          localText="Alarms and scenes live in the lamp. The internet is only needed for updates and voice assistants."
        />
      </div>
      <div id="inside">
        <Gadget002
          {...day}
          eyebrow="Inside"
          title="Five parts. Not one spare"
          lede="Take Ray apart without removing a single screw: drag the slider or just scroll on — the diagram spreads out by itself."
          parts={[
            { name: "Diffuser", text: "Opal polycarbonate, 2 mm. Spreads 96 LEDs into one even disc with no hot spots." },
            { name: "Board", text: "ESP32-S3, CO₂, humidity and light sensors, a two-channel driver for 2700 and 6500 K." },
            { name: "Speaker", text: "5 W, 360°, a passive radiator. Birds and rain without a plywood rattle." },
            { name: "Body", text: "Anodised aluminium, warm to the touch. A control wheel with 24 clicks." },
            { name: "Base", text: "A 480 g steel puck and a silicone ring — the lamp doesn't slide on the desk." },
          ]}
          explodeLabel="Explode"
          explodeAria="Degree of disassembly"
          assembleLabel="Assemble"
          disassembleLabel="Take apart"
        />
      </div>
      <div id="specs">
        <Stats012
          {...day}
          eyebrow="Specs"
          title="Numbers you can see from across the room"
          lede="Ray 2 versus Ray 1: one and a half times brighter, twice as loud, four sensors instead of one. All measured, not promised."
          status="Ray 2 · firmware 2.3.1 · all sensors normal"
          gauges={[
            { label: "Brightness", value: 1200, unit: "lm", max: 1500, previous: 800, previousLabel: "Ray 1" },
            { label: "Colour accuracy", value: 97, unit: "CRI", max: 100, previous: 90, previousLabel: "Ray 1" },
            { label: "Speaker", value: 5, unit: "W", max: 6, previous: 2, previousLabel: "Ray 1" },
            { label: "Sensors", value: 4, unit: "pcs", max: 4, previous: 1, previousLabel: "Ray 1" },
          ]}
          wasLabel="was"
        />
      </div>
      <div id="compare">
        <Comparison016
          {...day}
          eyebrow="Comparison"
          title="What changed since the first Ray"
          lede="We went through 3 400 reviews of the first version. Everything people asked for is here. Everything they complained about isn't."
          currentName="Ray 2"
          currentNote="2026 · batch 2"
          previousName="Ray 1"
          previousNote="2023 · discontinued"
          rows={[
            { label: "Brightness", current: "1 200 lm", previous: "800 lm", currentBar: 100, previousBar: 66 },
            { label: "Light temperature", current: "2700–6500 K", previous: "2700–4000 K", currentBar: 100, previousBar: 34 },
            { label: "Dawn length", current: "5–60 min", previous: "30 min", currentBar: 100, previousBar: 50 },
            { label: "Speaker", current: "5 W, 360°", previous: "2 W", currentBar: 100, previousBar: 40 },
            { label: "Sensors", current: "CO₂, humidity, light, heat", previous: "light only", currentBar: 100, previousBar: 25 },
            { label: "Gesture control", current: "clap, touch", previous: "—", currentBar: 100, previousBar: 0, isNew: true },
            { label: "Matter / Thread", current: "yes", previous: "—", currentBar: 100, previousBar: 0, isNew: true },
            { label: "Noise", current: "0 dB", previous: "18 dB (fan)", currentBar: 100, previousBar: 30 },
          ]}
          tableLabel="{current} versus {previous}"
          newLabel="new"
        />
      </div>
      <div style={dusk} aria-hidden="true" />
      <div id="preorder">
        <Gadget003
          {...night}
          eyebrow="Pre-order · batch 2"
          title="A place in the batch costs a thousand roubles"
          lede="The rest — at shipping. Changed your mind — we refund the deposit the same day, no questions asked."
          swatches={[
            { name: "Graphite", color: "#2b2b2b", image: "/demo/gadget/lamp-front.png" },
            { name: "Sand", color: "#cdb994", image: "/demo/gadget/lamp-sand.png" },
            { name: "Ivory", color: "#e9e2d2", image: "/demo/gadget/lamp-white.png" },
          ]}
          kits={[
            { name: "Ray", price: 14900, note: "The lamp, a 2 m USB-C cable, a power supply" },
            { name: "Ray + stand", price: 17900, note: "Plus a stand with wireless phone charging" },
            { name: "Pair", price: 27900, note: "Two lamps for two nightstands, a synchronised dawn" },
          ]}
          actionLabel="Place a pre-order"
          fine="The 1 000 ₽ deposit is part of the price. Delivery across Russia is free."
          doneTitle="Your place is reserved"
          doneText="Your number in the batch is 0689. The confirmation email is on its way; we'll remind you three days before shipping."
          swatchesLabel="Body colour"
          kitsLabel="Kit"
          shipLabel="Batch ships in"
          countLabel="Until shipping"
          countUnits={["days", "hrs", "min", "sec"]}
          leftLabel="Left in the batch"
          ofLabel="of"
          dateLocale="en-GB"
        />
      </div>
      <div id="press">
        <Testimonials035
          {...night}
          eyebrow="Press and first owners"
          title="What those who've already woken up say"
          featured={[
            { quote: "The first alarm clock you want to put on the nightstand rather than hide under the pillow.", who: "Kinzhal", role: "review, February 2026" },
            { quote: "The light really does look like a dawn, not like an open fridge. After a week I stopped hearing the alarm — I was waking up earlier.", who: "Rozetked", role: "30-day test" },
            { quote: "A CO₂ sensor in a lamp sounds like marketing until it shows 1 400 ppm in a closed bedroom.", who: "Habr", role: "hardware teardown" },
          ]}
          items={[
            { quote: "My six-year-old son gets up by himself. Himself. No shouting.", who: "Marina", role: "Kazan · batch 1" },
            { quote: "The speaker is louder than I expected: you can hear the birds from the kitchen.", who: "Artem", role: "Moscow" },
            { quote: "Asked the first version for cool white. They delivered.", who: "Ilya", role: "Yekaterinburg · batch 1" },
            { quote: "A clap turns the light off. The cat learned it in a day.", who: "Olga", role: "Saint Petersburg" },
            { quote: "Beautiful even switched off. Sits on the desk like an object.", who: "Denis", role: "Novosibirsk" },
            { quote: "Works without the cloud. The router died — the alarm still went off.", who: "Sergey", role: "Tula" },
            { quote: "Showed 28% humidity in winter. Bought a humidifier — sleeping got easier.", who: "Anna", role: "Perm" },
            { quote: "A 15-minute sunset puts me to sleep better than any podcast.", who: "Kirill", role: "Kaliningrad" },
          ]}
        />
      </div>
      <div id="faq">
        <Faq023 {...night} eyebrow="Delivery and warranty" title="What people ask before pre-ordering" lede="Briefly about timing, the warranty and returns. The rest — in the support Telegram, we reply within an hour." items={FAQ} contactLabel="Ask on Telegram" contactHref="#tg" />
      </div>
      <Footer042
        {...night}
        brand="Ray"
        caption="A smart alarm lamp. Assembled in Moscow in small batches, firmware updated once a month."
        status="batch 2 · ships in October"
        columns={[
          { title: "Product", links: [{ label: "Dawn", href: "#dawn" }, { label: "Features", href: "#features" }, { label: "Inside", href: "#inside" }, { label: "Specs", href: "#specs" }] },
          { title: "Buying", links: [{ label: "Pre-order", href: "#preorder" }, { label: "Delivery and warranty", href: "#faq" }, { label: "Where to see it", href: "#stores" }, { label: "For business", href: "#b2b" }] },
          { title: "Company", links: [{ label: "About the lab", href: "#about" }, { label: "Firmware", href: "#firmware" }, { label: "Support", href: "#support" }, { label: "Telegram", href: "#tg" }] },
        ]}
        legal={[
          { label: "Terms", href: "#offer" },
          { label: "Privacy", href: "#privacy" },
          { label: "Warranty", href: "#warranty" },
        ]}
        copyright="© 2026 Ray Lab"
      />
    </div>
  )
}
