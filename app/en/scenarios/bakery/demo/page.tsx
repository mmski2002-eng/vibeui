import type { CSSProperties } from "react"

import { Navbar028, type Navbar028Props } from "@/registry/blocks/navbar/navbar-028/navbar-028"
import { Hero028, type Hero028Props } from "@/registry/blocks/hero/hero-028/hero-028"
import { Bakery001, type Bakery001Props } from "@/registry/blocks/industry/bakery-001/bakery-001"
import { Bakery002, type Bakery002Props } from "@/registry/blocks/industry/bakery-002/bakery-002"
import { Bakery003, type Bakery003Props } from "@/registry/blocks/industry/bakery-003/bakery-003"
import { Bakery004, type Bakery004Props } from "@/registry/blocks/industry/bakery-004/bakery-004"
import { People012, type People012Props } from "@/registry/blocks/team/people-012/people-012"
import { Bakery005, type Bakery005Props } from "@/registry/blocks/industry/bakery-005/bakery-005"
import { Portfolio011, type Portfolio011Props } from "@/registry/blocks/portfolio/portfolio-011/portfolio-011"
import { Testimonials023, type Testimonials023Props } from "@/registry/blocks/testimonials/testimonials-023/testimonials-023"
import { Map010, type Map010Props } from "@/registry/blocks/map/map-010/map-010"
import { Subscribe007, type Subscribe007Props } from "@/registry/blocks/newsletter/subscribe-007/subscribe-007"
import { Footer027, type Footer027Props } from "@/registry/blocks/footer/footer-027/footer-027"

/**
 * English version of the "Coffee shop & bakery" demo: same blocks and theme
 * as `app/scenarios/bakery/demo/page.tsx`, block text in English via props.
 *
 * The site lives by the bakery's clock: what's in the oven now, what comes
 * out in twenty minutes, how much is left. Thirteen blocks, a light
 * "milk and poppy" theme; the shelf and the box talk through window
 * events. The "36 hours" story (bakery-004) writes `--vibeui-night` on
 * <html>, and the whole page including the header fades into night and
 * back to morning on scroll: page colours are color-mixed from that
 * variable. A showcase of the result, not a template.
 */
export const metadata = {
  title: "Korka — coffee shop and bakery in Khamovniki",
  description:
    "VibeUI «Coffee shop & bakery» scenario demo: bread by the hour, a shelf with what's left, coffee by strength, a box for the morning and the 36-hour story of a loaf.",
}

// Scene night → page colours: 0 is "milk", 1 is the bakery's dark night.
const page = {
  colorScheme: "light",
  "--vibeui-page-bg": "color-mix(in oklab, #17130f calc(var(--vibeui-night, 0) * 100%), #f6f1e8)",
  "--vibeui-page-ink": "color-mix(in oklab, #f6f1e8 calc(var(--vibeui-night, 0) * 100%), #1f1a17)",
  "--vibeui-page-chip": "color-mix(in oklab, var(--vibeui-page-ink) 8%, var(--vibeui-page-bg))",
  background: "var(--vibeui-page-bg)",
  color: "var(--vibeui-page-ink)",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
} as CSSProperties

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const bakery = { tone: "light", accent: "#e4572e", ink: "#1f1a17", background: "#f6f1e8" } as const
const dark = { tone: "dark", accent: "#e4572e", ink: "#f6f1e8", background: "#1f1a17" } as const

const PHOTOS = "/demo/bakery"

const navbar: Navbar028Props = {
  brand: "Korka",
  links: [
    { label: "Shelf", href: "#shelf" },
    { label: "Coffee", href: "#coffee" },
    { label: "Bread", href: "#story" },
    { label: "People", href: "#people" },
    { label: "Find us", href: "#where" },
  ],
  openLabel: "open",
  closedLabel: "opens at",
  actionLabel: "Order for the morning",
  actionShort: "Order",
  untilLabel: "until {time}",
  closingLabel: "closing in {n} min",
  inLabel: "in {n} {unit}",
  hourUnits: ["hour", "hours", "hours"],
  minutesUnit: "min",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
}

const hero: Hero028Props = {
  imageAlt: "Bakery counter in the morning: croissants behind glass, bread on the shelves, a barista at the machine",
  sticker: "hot!",
  words: ["Bread", "by the", "hour"],
  lede: "We mix in the evening, bake at five in the morning and pull batches all day. The site shows what's in the oven right now, so you come for the hot one.",
  batches: [
    { time: "07:00", name: "Croissants", note: "first batch, 40 pcs" },
    { time: "08:30", name: "Sourdough tartine", note: "36 hours, as it should be" },
    { time: "11:00", name: "Cinnamon buns", note: "glazed, still warm" },
    { time: "13:00", name: "Rosemary focaccia", note: "for lunch, sliced on the spot" },
    { time: "15:00", name: "Rye", note: "dark crust, caraway" },
    { time: "17:00", name: "Baguettes", note: "for dinner, last bread of the day" },
  ],
  bakingLabel: "In the oven now",
  nightLabel: "Night at the bakery",
  nightTitle: "Quiet, the dough is rising",
  nightText: "dough proofing · oven at 05:00",
  primaryLabel: "Build a box for the morning",
  secondaryLabel: "What's on the shelf",
  minutesUnit: "min",
  ovenLabel: "oven",
  outLine: "out at {time}",
  batchesLabel: "Batches of the day",
}

const shelf: Bakery001Props = {
  eyebrow: "Shelf",
  title: "What's on the shelf now",
  lede: "Every card knows when it was baked and how many are left. Put it in the box — we'll have it ready by morning.",
  hint: "drag the shelf",
  products: [
    { id: "tartine", name: "Tartine", text: "sourdough, 36 hours, 700 g", price: "420 ₽", image: `${PHOTOS}/item-01.webp`, bakedAt: "08:30", left: 6 },
    { id: "croissant", name: "Croissant", text: "82% butter, 27 layers", price: "190 ₽", image: `${PHOTOS}/item-02.webp`, bakedAt: "07:00", left: 11 },
    { id: "cinnamon", name: "Cinnamon bun", text: "cream glaze", price: "240 ₽", image: `${PHOTOS}/item-03.webp`, bakedAt: "11:00", left: 4 },
    { id: "focaccia", name: "Focaccia", text: "rosemary, sea salt", price: "210 ₽", image: `${PHOTOS}/item-04.webp`, bakedAt: "13:00", left: 9 },
    { id: "rye", name: "Rye", text: "caraway, dark crust, 800 g", price: "380 ₽", image: `${PHOTOS}/item-05.webp`, bakedAt: "15:00", left: 3 },
    { id: "cardamom", name: "Cardamom knot", text: "Stockholm style", price: "230 ₽", image: `${PHOTOS}/item-06.webp`, bakedAt: "11:00", left: 7 },
    { id: "baguette", name: "Baguette", text: "thin, crackly, 280 g", price: "160 ₽", image: `${PHOTOS}/item-07.webp`, bakedAt: "17:00", left: 12 },
    { id: "chocolat", name: "Pain au chocolat", text: "two sticks of dark", price: "210 ₽", image: `${PHOTOS}/item-08.webp`, bakedAt: "07:00", left: 5 },
  ],
  addLabel: "add to box",
  inBoxLabel: "in the box",
  fullLabel: "box is full",
  boxLabel: "in the box",
  soonLine: "ready at {time}",
  bakedLine: "baked at {time}",
  lastLine: "last {n}",
  leftLine: "{n} left",
  ofLabel: "of",
  unit: "pcs",
}

const coffee: Bakery002Props = {
  eyebrow: "Coffee",
  title: "How strong?",
  lede: "Move the slider — the glass shows what's inside. Farm milk, beans roasted by us once a week.",
  softLabel: "softer",
  strongLabel: "stronger",
  drinks: [
    { name: "Latte", text: "lots of milk, a hint of coffee", price: "290 ₽", milk: 62, foam: 10, coffee: 20, volume: "350 ml", image: `${PHOTOS}/cup-latte.png`, imageAlt: "Latte in a glass" },
    { name: "Flat white", text: "double shot, silky milk", price: "270 ₽", milk: 48, foam: 6, coffee: 36, volume: "220 ml", image: `${PHOTOS}/cup-latte.png`, imageAlt: "Flat white" },
    { name: "Cappuccino", text: "a third of foam, the classic", price: "250 ₽", milk: 34, foam: 28, coffee: 30, volume: "200 ml", image: `${PHOTOS}/cup-latte.png`, imageAlt: "Cappuccino" },
    { name: "Americano", text: "espresso and hot water", price: "190 ₽", milk: 0, foam: 0, coffee: 70, volume: "250 ml", water: true, image: `${PHOTOS}/cup-espresso.png`, imageAlt: "Americano" },
    { name: "Espresso", text: "double, 18 g in 36 g", price: "160 ₽", milk: 0, foam: 0, coffee: 30, volume: "60 ml", image: `${PHOTOS}/cup-espresso.png`, imageAlt: "Double espresso" },
  ],
  beanTitle: "Bean of the week: Ethiopia, Guji",
  beanText: "Washed process, light roast. Blackcurrant, jasmine, a long sweet finish.",
  espressoLabel: "espresso",
  milkLabel: "milk",
  foamLabel: "foam",
  strengthLabel: "Drink strength",
}

const box: Bakery003Props = {
  eyebrow: "Breakfast box",
  title: "Build a box for the morning",
  lede: "Pastries go into the box warm, right before pickup. Order by 22:00 — the box is waiting for you at the counter in the morning.",
  products: [
    { id: "tartine", name: "Tartine", price: 420, image: `${PHOTOS}/item-01.webp` },
    { id: "croissant", name: "Croissant", price: 190, image: `${PHOTOS}/item-02.webp` },
    { id: "cinnamon", name: "Cinnamon bun", price: 240, image: `${PHOTOS}/item-03.webp` },
    { id: "focaccia", name: "Focaccia", price: 210, image: `${PHOTOS}/item-04.webp` },
    { id: "rye", name: "Rye", price: 380, image: `${PHOTOS}/item-05.webp` },
    { id: "cardamom", name: "Cardamom knot", price: 230, image: `${PHOTOS}/item-06.webp` },
    { id: "baguette", name: "Baguette", price: 160, image: `${PHOTOS}/item-07.webp` },
    { id: "chocolat", name: "Pain au chocolat", price: 210, image: `${PHOTOS}/item-08.webp` },
  ],
  pickLabel: "Put in the box",
  emptyHints: ["something here", "…", "…", "and more"],
  emptyLine: "the box is still empty",
  stampTitle: "Korka",
  stampNote: "by 8:00 · packed",
  resetLabel: "Start over",
  nameLabel: "Name",
  phoneLabel: "Phone",
  slotLabel: "Pick up at",
  submitLabel: "Order for the morning",
  moreLabel: "{n} more for the box",
  howTitle: "Packing from 7:30",
  howText: "Pastries go in warm, the lid closes right before pickup. Pay at the counter or via the link in the message.",
  doneTitle: "thanks for getting up early",
  doneText: "The box will be at the counter by the time you chose. We'll send a reminder half an hour before.",
  removeLabel: "Remove {name}",
  ofLabel: "of",
}

const story: Bakery004Props = {
  eyebrow: "36 hours to a loaf",
  frames: [
    { time: "18:00", title: "Mixing", text: "Flour, water, salt and a six-year-old starter. No yeast — only time.", image: `${PHOTOS}/story-01.webp`, night: 0.15 },
    { time: "22:00", title: "Folding", text: "Every forty minutes the dough is folded like a letter. That's how the crumb gets its big holes.", image: `${PHOTOS}/story-01.webp`, night: 0.55 },
    { time: "01:30", title: "Cold", text: "A night in the fridge at four degrees. The flavour gets more complex, the crust thinner.", image: `${PHOTOS}/story-02.webp`, night: 1 },
    { time: "05:00", title: "Oven", text: "The first person in the bakery turns on the deck oven. 250 degrees, steam, a blade score.", image: `${PHOTOS}/story-03.webp`, night: 0.85 },
    { time: "07:00", title: "First batch", text: "Loaves cool on the racks and crackle. It's the only sound we record.", image: `${PHOTOS}/story-04.webp`, night: 0.25 },
    { time: "07:40", title: "On the shelf", text: "The bread has reached you. Best sliced in an hour — but we understand if you can't wait.", image: `${PHOTOS}/story-05.webp`, night: 0 },
  ],
}

const people: People012Props = {
  eyebrow: "People",
  title: "There are two of us, and we don't sleep",
  lede: "Hover over a card — we'll tell you what happens at five in the morning.",
  peekLabel: "what's at 5 am?",
  noteLabel: "Note",
  people: [
    { name: "Olga", role: "Baker, six-year-old starter", quote: "Bread doesn't tolerate haste. Everything I do is stay out of its way.", note: "At 5 am I'm alone in the bakery. I turn on the oven, put the kettle on and listen to the first batch crackle.", image: `${PHOTOS}/olga.webp` },
    { name: "Timur", role: "Barista, roasting on Thursdays", quote: "Espresso is 25 seconds. Everything else is about milk and mood.", note: "My standard: 18 grams in 36, 93 degrees, and if the guest smiles before the first sip — the shift went well.", image: `${PHOTOS}/timur.webp` },
  ],
}

const loyalty: Bakery005Props = {
  eyebrow: "For regulars",
  title: "The sixth coffee is on us",
  lede: "No app: a card in your wallet, a stamp at the till. Bread by subscription, so you don't have to think on Saturdays.",
  cardTitle: "Punch card",
  cardText: "Five stamps — the sixth drink is free. Any drink, even a large latte.",
  freeLabel: "free",
  fine: ["stamps never expire — even after a year", "you can pass the card to a friend along with the coffee", "takeaway coffee gets a stamp too"],
  cardAction: "Get a card at the till",
  subTitle: "Bread on Saturdays",
  subText: "A monthly pass: the loaf of your choice waits for you every Saturday from 8:00 until closing.",
  subLines: [
    { label: "Tartine or rye", value: "4 loaves" },
    { label: "A croissant as a gift on the first Saturday", value: "+1" },
    { label: "Skip a week — with one message", value: "yes" },
  ],
  subNote: "per month · save 210 ₽",
  subAction: "Subscribe",
  punchLabel: "{n} stamps, the {next}th is free",
}

const gallery: Portfolio011Props = {
  eyebrow: "This morning",
  title: "What it looks like",
  lede: "One ordinary Tuesday, shot by the hour. Hover — we'll tell you what time it was.",
  shots: [
    { src: `${PHOTOS}/hands-flour.webp`, note: "5:40, shaping", alt: "Hands shaping dough on a floured table", span: "big" },
    { src: `${PHOTOS}/story-04.webp`, note: "7:12, first tartine", alt: "The first batch of bread cooling on a rack" },
    { src: `${PHOTOS}/coffee-flat.webp`, note: "7:30, first flat white", alt: "Flat white with latte art" },
    { src: `${PHOTOS}/queue.webp`, note: "7:55, queue", alt: "A small queue at the bakery entrance", span: "wide" },
    { src: `${PHOTOS}/window.webp`, note: "9:20, by the window", alt: "A guest reading by the bakery window", span: "tall" },
    { src: `${PHOTOS}/story-05.webp`, note: "8:05, scoring", alt: "A knife slicing fresh bread", span: "wide" },
    { src: `${PHOTOS}/shelf.webp`, note: "10:00, shelf is full", alt: "A shelf full of bread" },
    { src: `${PHOTOS}/coffee-espresso.webp`, note: "10:40, double", alt: "Double espresso in a glass" },
    { src: `${PHOTOS}/beans.webp`, note: "11:00, bean of the week", alt: "Roasted coffee beans" },
    { src: `${PHOTOS}/hero.webp`, note: "12:10, counter", alt: "Bakery counter in the daytime" },
  ],
}

const reviews: Testimonials023Props = {
  eyebrow: "Reviews",
  title: "What the till prints",
  lede: "Real words from guests — on receipts, the way they leave them: short, before the coffee gets cold.",
  brand: "Korka",
  place: "Khamovniki",
  totalLabel: "TOTAL",
  guestLabel: "guest",
  thanks: "thank you, come for the hot one",
  reviews: [
    { no: "0412", time: "08:14", name: "Marina", lines: ["Tartine still warm,", "crust crackling through", "the whole tram. Neighbours stared."], sum: "420 ₽" },
    { no: "0587", time: "07:32", name: "Ilya", lines: ["Flat white beats", "three places nearby.", "Checked all three."], sum: "270 ₽" },
    { no: "0633", time: "11:06", name: "Katya & Lev", lines: ["The cinnamon bun", "was gone from our hands", "in four minutes."], sum: "480 ₽" },
    { no: "0701", time: "16:48", name: "Pyotr", lines: ["Ordered a box", "for eight — at 7:58 it was", "on the counter. No questions."], sum: "1 060 ₽" },
  ],
  reviewLabel: "Review: {name}",
}

const where: Map010Props = {
  eyebrow: "Find us",
  title: "Seven minutes from Park Kultury",
  lede: "Khamovniki, a quiet courtyard, entrance from the street. Ten-minute parking nearby — just enough to grab a box.",
  mapSrc: "https://yandex.ru/map-widget/v1/?ll=37.5860,55.7330&z=15&pt=37.5860,55.7330,pm2rdm&lang=en_US",
  mapTitle: "Map: Korka bakery in Khamovniki",
  pinTitle: "Korka · Khamovniki",
  pinText: "Moscow, in the courtyard by the square. Look for the red door and the smell of bread.",
  hoursTitle: "Hours",
  hours: [
    { label: "Weekdays", value: "7:00 — 21:00" },
    { label: "Weekends", value: "8:00 — 21:00" },
    { label: "Morning boxes", value: "from 7:30" },
  ],
  queueLabel: "people at the till right now",
  closedLabel: "closed, no queue",
  nowLabel: "now",
  warnBefore: "bread runs out by 14:00 — come before",
  warnAfter: "today's bread is almost gone — tomorrow from seven",
  chartLabel: "Queue by the hour",
}

const newsletter: Subscribe007Props = {
  eyebrow: "Reminder",
  title: "We'll text you when your bread comes out",
  lede: "Not a newsletter — one message five minutes before your favourite pastry lands on the shelf.",
  stamp: "Korka · since 2019",
  formTitle: "Bread alarm",
  formText: "Pick what you love — we'll work out when it'll be in the oven and text you. Unsubscribe with one word: «enough».",
  optionLabel: "What you love",
  contactLabel: "Phone or email",
  whenLine: "we'll text at {time} — {note}",
  submitLabel: "Set the alarm",
  doneLine: "noted: {label}, {time}",
  againLabel: "Add another",
  options: [
    { id: "tartine", label: "Tartine", time: "08:25", note: "36 hours, as it should be" },
    { id: "croissant", label: "Croissant", time: "06:55", note: "first batch, 40 pcs" },
    { id: "cinnamon", label: "Cinnamon bun", time: "10:55", note: "glazed, still warm" },
    { id: "focaccia", label: "Focaccia", time: "12:55", note: "for lunch, sliced on the spot" },
    { id: "rye", label: "Rye", time: "14:55", note: "dark crust, caraway" },
    { id: "baguette", label: "Baguette", time: "16:55", note: "for dinner, last bread of the day" },
  ],
}

const footer: Footer027Props = {
  brand: "Korka",
  caption: "coffee shop & bakery · baking since 2019",
  columns: [
    { title: "Sections", links: [{ label: "Shelf", href: "#shelf" }, { label: "Coffee", href: "#coffee" }, { label: "Morning box", href: "#box" }, { label: "36 hours to a loaf", href: "#story" }] },
    { title: "Address", links: [{ label: "Moscow, Khamovniki", href: "#where" }, { label: "in the courtyard by the square", href: "#where" }, { label: "+7 000 000-00-00", href: "tel:+70000000000" }] },
    { title: "Social", links: [{ label: "Telegram channel", href: "#" }, { label: "Mornings in stories", href: "#" }, { label: "Bread alarm", href: "#newsletter" }] },
  ],
  dayLabel: "bakery day",
  openLabel: "open",
  closedLabel: "closed till morning",
  sleepLabel: "still asleep",
  copyright: "© Korka, 2026",
  sign: "thanks for getting up early",
}

export default function BakeryDemoEn() {
  return (
    <div style={page} className="min-h-dvh" data-vibeui-demo="bakery">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}[data-vibeui-demo="bakery"]{transition:background .3s,color .3s}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}[data-vibeui-demo="bakery"]{transition:none}}`}
      </style>
      <Navbar028 {...bakery} {...navbar} background="var(--vibeui-page-bg)" ink="var(--vibeui-page-ink)" style={{ ["--vibeui-navbar-028-chip" as string]: "var(--vibeui-page-chip)" }} />
      <div id="top">
        <Hero028 {...bakery} {...hero} image={`${PHOTOS}/hero.webp`} />
      </div>
      <div id="shelf">
        <Bakery001 {...bakery} {...shelf} />
      </div>
      <div id="coffee">
        <Bakery002 {...bakery} {...coffee} beanImage={`${PHOTOS}/beans.webp`} />
      </div>
      <div id="box">
        <Bakery003 {...bakery} {...box} howImage={`${PHOTOS}/box.webp`} />
      </div>
      <div id="story">
        <Bakery004 {...bakery} {...story} />
      </div>
      <div id="people">
        <People012 {...bakery} {...people} />
      </div>
      <div id="loyalty">
        <Bakery005 {...bakery} {...loyalty} />
      </div>
      <div id="gallery">
        <Portfolio011 {...bakery} {...gallery} />
      </div>
      <div id="reviews">
        <Testimonials023 {...bakery} {...reviews} />
      </div>
      <div id="where">
        <Map010 {...bakery} {...where} />
      </div>
      <div id="newsletter">
        <Subscribe007 {...bakery} {...newsletter} texture={`${PHOTOS}/bag.webp`} />
      </div>
      <Footer027 {...dark} {...footer} />
    </div>
  )
}
