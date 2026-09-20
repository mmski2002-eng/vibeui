import type { CSSProperties } from "react"

import { Navbar032, type Navbar032Props } from "@/registry/blocks/navbar/navbar-032/navbar-032"
import { Hero032, type Hero032Props } from "@/registry/blocks/hero/hero-032/hero-032"
import { App001, type App001Props } from "@/registry/blocks/app/app-001/app-001"
import { App002, type App002Props } from "@/registry/blocks/app/app-002/app-002"
import { Testimonials025, type Testimonials025Props } from "@/registry/blocks/testimonials/testimonials-025/testimonials-025"
import { Pricing024, type Pricing024Props } from "@/registry/blocks/pricing/pricing-024/pricing-024"
import { Faq023, type Faq023Props } from "@/registry/blocks/faq/faq-023/faq-023"
import { Cta025, type Cta025Props } from "@/registry/blocks/cta/cta-025/cta-025"
import { Footer031, type Footer031Props } from "@/registry/blocks/footer/footer-031/footer-031"
import { Scene } from "@/app/scenarios/app/demo/scene"

/**
 * English version of the "Mobile app" demo: same blocks and theme as
 * `app/scenarios/app/demo/page.tsx`, block text in English via props.
 *
 * The site shows a live CSS phone instead of screenshots: the circle
 * breathes, screens switch on scroll, the sleep chart moves with a
 * before/after slider. The page lives through a day: from a lavender
 * afternoon through dusk into night and back to morning; background, ink
 * and accent flow on scroll (the `Scene` wrapper). A showcase of the
 * result, not a template.
 */
export const metadata = {
  title: "Hush — an app for sleep and breathing",
  description:
    "VibeUI «Mobile app» scenario demo: a CSS phone with a breathing circle, screens on scroll, a before/after comparison, store reviews, plans, questions and a QR code to download.",
}

const page: CSSProperties = {
  colorScheme: "light",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
// Colours are Scene wrapper variables that flow between the phases of the day.
const scene = { accent: "var(--vibeui-scene-accent)", ink: "var(--vibeui-scene-ink)", background: "var(--vibeui-scene-bg)" } as const
const light = { ...scene, tone: "light" } as const
const dark = { ...scene, tone: "dark" } as const

const PHOTOS = "/demo/app"

const navbar: Navbar032Props = {
  brand: "Hush",
  links: [
    { label: "What's inside", href: "#features" },
    { label: "Results", href: "#results" },
    { label: "Reviews", href: "#reviews" },
    { label: "Plans", href: "#pricing" },
  ],
  rating: "4.9",
  actionLabel: "Download",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
}

const hero: Hero032Props = {
  eyebrow: "Sleep · breathing · quiet",
  title: "Fall asleep in ten minutes, not an hour",
  highlight: "ten minutes",
  lede: "Evening rituals, breathing practices and a smart alarm. No «meditation» subscription — only what helps you fall asleep.",
  rating: "4.9",
  ratingNote: "12k ratings",
  screenTitle: "Evening breathing · 4-7-8",
  inhaleLabel: "inhale",
  holdLabel: "hold",
  exhaleLabel: "exhale",
  appStoreCaption: "Download on the",
  playCaption: "Get it on",
  phoneLabel: "App screen: breathing practice",
}

const features: App001Props = {
  eyebrow: "What's inside",
  title: "Four screens you'll open before bed",
  features: [
    { title: "Breathing that leads", text: "The circle grows and shrinks, and you just follow. Three practices: 4-7-8, box breathing, «evening».", screen: "breath", screenTitle: "Evening breathing" },
    { title: "Sleep by phases, not by hours", text: "The phone listens to your breathing next to the pillow and draws the night: deep, light, awakenings.", screen: "sleep", screenTitle: "Tonight · 7 h 42 min" },
    { title: "An alarm in the light phase", text: "A 30-minute window: we wake you when sleep is already shallow — no grogginess.", screen: "alarm", screenTitle: "Alarm" },
    { title: "A streak of days instead of charts", text: "One screen: how many days in a row you went to bed on time. Days, not percentages.", screen: "stats", screenTitle: "September" },
  ],
  alarmWindow: "window 06:20 — 06:50",
  alarmPhase: "light phase",
  streak: "18 days in a row",
  screenPrefix: "screen",
  phoneLabel: "App screen",
}

const results: App002Props = {
  eyebrow: "Results",
  title: "A week before and a week after",
  lede: "Data from eight hundred users in the first month. Drag the slider — see the difference by day.",
  beforeLabel: "before",
  afterLabel: "after",
  days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  beforeNote: "fell asleep in 48 min",
  afterNote: "fall asleep in 12 min",
  hoursUnit: "h",
  rangeLabel: "Before and after comparison",
}

const reviews: Testimonials025Props = {
  eyebrow: "Reviews",
  title: "What people write in the stores",
  lede: "Unfiltered: the latest reviews from the App Store and Google Play as they are.",
  rating: "4.9",
  ratingNote: "12 412 ratings",
  reviews: [
    { title: "First time I fell asleep without my phone", text: "4-7-8 breathing works better than anything I've tried. The circle on the screen — brilliantly simple.", name: "Lena K.", store: "App Store", stars: 5, date: "Sep 2026" },
    { title: "The alarm doesn't annoy me", text: "Wakes me in the light phase — I get up without feeling dragged out of a well. Seriously.", name: "Artem", store: "Google Play", stars: 5, date: "Aug 2026" },
    { title: "The streak motivates", text: "I don't want to lose 18 days in a row — so I go to bed on time. Silly psychology, but it works.", name: "Maria L.", store: "App Store", stars: 5, date: "Aug 2026" },
    { title: "Would love a widget", text: "Like everything, but missing a widget with the streak on the home screen. Four stars in advance.", name: "Dmitry", store: "Google Play", stars: 4, date: "Jul 2026" },
    { title: "Quiet and ad-free", text: "No «premium for 3 990 a year» on every screen. The free version is enough.", name: "Olya", store: "App Store", stars: 5, date: "Jul 2026" },
  ],
  starsLabel: "{n} out of 5",
}

const pricing: Pricing024Props = {
  eyebrow: "Plans",
  title: "Free is enough. Premium — if you want more",
  lede: "Breathing and the alarm are free forever. Premium — sleep analysis by phases, streaks and family access.",
  freeName: "Free",
  premiumName: "Premium",
  monthlyLabel: "per month",
  yearlyLabel: "per year",
  yearlyNote: "−45%",
  trial: "7 days free",
  features: [
    { label: "Breathing practices", free: true, premium: true },
    { label: "Smart alarm", free: true, premium: true },
    { label: "Sleep by phases", free: false, premium: true },
    { label: "Streaks and reminders", free: "7 days", premium: "unlimited" },
    { label: "Family access", free: false, premium: "up to 5" },
    { label: "Data export", free: false, premium: true },
  ],
  freeAction: "Download",
  premiumAction: "Try for 7 days",
  periodLabel: "Billing period",
  featureLabel: "feature",
}

const faq: Faq023Props = {
  eyebrow: "Questions",
  title: "Asked before installing",
  lede: "Briefly about privacy, money and watches. Didn't find the answer — write to us, we reply within a day.",
  items: [
    { question: "Does the app listen to me all night?", answer: "Only with the microphone and only on the phone: sound isn't recorded or sent anywhere, the breathing rhythm is analysed. You can turn it off — then phases are counted by movement." },
    { question: "What happens after 7 days of premium?", answer: "Nothing scary: premium features close, the free ones stay forever. We'll remind you a day before the trial ends." },
    { question: "Does it work offline?", answer: "Yes, fully. Sync between devices — when the network is back." },
    { question: "Is there a watch version?", answer: "For Apple Watch and Wear OS — the alarm and breathing on your wrist. The streak widget — in the next update." },
    { question: "Can I cancel the subscription?", answer: "Any time in the store settings. Money for the unused period is refunded under App Store and Google Play rules." },
  ],
  contactLabel: "Ask a question",
}

const download: Cta025Props = {
  title: "Tonight — your first practice",
  text: "Install in a minute, turn on breathing before bed. In the morning you'll tell us how you slept.",
  qrNote: "point your camera — the store will open",
  appStoreCaption: "Download on the",
  playCaption: "Get it on",
  qrLabel: "QR code to download",
}

const footer: Footer031Props = {
  brand: "Hush",
  caption: "made so you sleep",
  links: [
    { label: "What's inside", href: "#features" },
    { label: "Results", href: "#results" },
    { label: "Reviews", href: "#reviews" },
    { label: "Plans", href: "#pricing" },
    { label: "Questions", href: "#faq" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Support", href: "#" },
  ],
  copyright: "© Hush, 2026",
}

export default function AppDemoEn() {
  return (
    <Scene style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar032 {...light} {...navbar} />
      <div id="top" data-scene="day">
        <Hero032 {...light} {...hero} />
      </div>
      <div id="features" data-scene="dusk">
        <App001 {...dark} {...features} />
      </div>
      <div id="results" data-scene="night">
        <App002 {...dark} {...results} />
      </div>
      <div id="reviews" data-scene="night">
        <Testimonials025 {...dark} {...reviews} image={`${PHOTOS}/evening.webp`} />
      </div>
      <div id="pricing" data-scene="night">
        <Pricing024 {...dark} {...pricing} />
      </div>
      <div id="faq" data-scene="night">
        <Faq023 {...dark} {...faq} />
      </div>
      <div id="download" data-scene="dawn">
        <Cta025 {...light} {...download} image={`${PHOTOS}/night.webp`} />
      </div>
      <div data-scene="dawn">
        <Footer031 {...light} {...footer} />
      </div>
    </Scene>
  )
}
