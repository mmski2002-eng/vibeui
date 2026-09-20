import type { CSSProperties } from "react"

import { Navbar036, type Navbar036Props } from "@/registry/blocks/navbar/navbar-036/navbar-036"
import { Hero036, type Hero036Props } from "@/registry/blocks/hero/hero-036/hero-036"
import { Flowers001, type Flowers001Props } from "@/registry/blocks/industry/flowers-001/flowers-001"
import { Flowers002, type Flowers002Props } from "@/registry/blocks/industry/flowers-002/flowers-002"
import { Flowers003, type Flowers003Props } from "@/registry/blocks/industry/flowers-003/flowers-003"
import { Flowers004, type Flowers004Props } from "@/registry/blocks/industry/flowers-004/flowers-004"
import { Flowers005, type Flowers005Props } from "@/registry/blocks/industry/flowers-005/flowers-005"
import { About017, type About017Props } from "@/registry/blocks/about/about-017/about-017"
import { Testimonials028, type Testimonials028Props } from "@/registry/blocks/testimonials/testimonials-028/testimonials-028"
import { Subscribe011, type Subscribe011Props } from "@/registry/blocks/newsletter/subscribe-011/subscribe-011"
import { Footer035, type Footer035Props } from "@/registry/blocks/footer/footer-035/footer-035"

/**
 * English version of the "Flower workshop" demo: same blocks and theme as
 * `app/scenarios/flowers/demo/page.tsx`, block text in English via props.
 *
 * A botanical journal: paper, ink, a poppy accent, serif type and
 * handwritten notes. The bouquet on the first screen is built from layers
 * and spreads apart on scroll, catalogue images follow the cursor, the
 * builder puts stems into a vase and passes the mix to the delivery form,
 * delivery windows are counted from the current time.
 */
export const metadata = {
  title: "Stem — a flower workshop on Pestelya",
  description:
    "VibeUI «Flower workshop» scenario demo: a layered bouquet on the first screen, a catalogue with an image following the cursor, a bouquet builder, delivery to the hour, a seasonal calendar, care tips, postcard reviews and a subscription.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f3efe6",
  color: "#1d1b18",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const paper = { tone: "light", accent: "#c2361d", ink: "#1d1b18", background: "#f3efe6" } as const
const plum = { tone: "dark", accent: "#f0a58f", ink: "#f3efe6", background: "#2b1e2a" } as const

const PHOTOS = "/demo/flowers"

const navbar: Navbar036Props = {
  brand: "Stem",
  links: [
    { label: "Bouquets", href: "#catalog" },
    { label: "Build your own", href: "#builder" },
    { label: "Delivery", href: "#delivery" },
    { label: "Season", href: "#season" },
    { label: "Workshop", href: "#about" },
  ],
  note: "open until 22:00",
  actionLabel: "Order a bouquet",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
}

const hero: Hero036Props = {
  eyebrow: "Flower workshop · Saint Petersburg",
  title: "Bouquets|put together|like a *letter*",
  lede: "No cellophane and no bows. Seasonal flowers from farms near Petersburg and from Holland, arranged the same day, delivered to the hour.",
  primaryLabel: "Build a bouquet",
  secondaryLabel: "See ready-made",
  facts: [
    { value: "since 2014", label: "workshop on Pestelya" },
    { value: "from 2 h", label: "delivery across the city" },
    { value: "7+ days", label: "lasts in a vase" },
  ],
  imageAlt: "Bouquet of the week: peonies, poppies and daisies in kraft paper",
  sideImageAlt: "The workshop on Pestelya",
  sideCaption: "the workshop, morning",
  note: "today: peonies, poppies and daisies",
}

const catalog: Flowers001Props = {
  eyebrow: "Bouquets of the week",
  title: "What we arranged today",
  lede: "Six bouquets standing in the window right now. Hover over a name — we'll show what it looks like.",
  items: [
    { name: "Poppy field", note: "poppy, daisy, St John's wort, oats", price: "3 900 ₽", image: `${PHOTOS}/bouquet-01.webp`, alt: "A bouquet with red poppies and meadow grasses in kraft paper", href: "#builder" },
    { name: "Morning at the dacha", note: "peonies, eucalyptus, sweet pea", price: "5 400 ₽", image: `${PHOTOS}/bouquet-02.webp`, alt: "A lush bouquet with pink peonies and eucalyptus", href: "#builder" },
    { name: "Plum evening", note: "dahlias, scabiosa, amaranth, ruscus", price: "4 700 ₽", image: `${PHOTOS}/bouquet-03.webp`, alt: "A dark bouquet with burgundy dahlias", href: "#builder" },
    { name: "Botanist", note: "anthurium, fern, monstera, callas", price: "6 200 ₽", image: `${PHOTOS}/bouquet-04.webp`, alt: "A green bouquet with anthurium and large leaves", href: "#builder" },
    { name: "Paper garden", note: "ranunculus, anemones, lavender, veronica", price: "4 300 ₽", image: `${PHOTOS}/bouquet-05.webp`, alt: "A delicate bouquet with ranunculus and lavender", href: "#builder" },
    { name: "A single stem", note: "hydrangea, one, in paper", price: "1 200 ₽", image: `${PHOTOS}/bouquet-06.webp`, alt: "A single large blue hydrangea in paper", href: "#builder" },
  ],
  note: "prices include paper and a card",
  allLabel: "Build your own bouquet",
}

const builder: Flowers002Props = {
  eyebrow: "Build your own",
  title: "A bouquet to your recipe",
  lede: "Add stems — they go into the vase. We'll tell you the price, how long we'll take to arrange it and how long it will last.",
  flowers: [
    { name: "Peony", price: 390, days: 6, color: "#e9a3b6", kind: "peony", initial: 3, image: `${PHOTOS}/stem-peony.png` },
    { name: "Poppy", price: 190, days: 4, color: "#c2361d", kind: "poppy", initial: 2, image: `${PHOTOS}/stem-poppy.png` },
    { name: "Daisy", price: 120, days: 8, color: "#fbf6ea", kind: "daisy", image: `${PHOTOS}/stem-chamomile.png` },
    { name: "Ranunculus", price: 260, days: 7, color: "#f0b04c", kind: "peony", image: `${PHOTOS}/stem-ranunculus.png` },
    { name: "Lavender", price: 140, days: 10, color: "#8b7bb5", kind: "spike", initial: 2, image: `${PHOTOS}/stem-lavender.png` },
    { name: "Eucalyptus", price: 160, days: 14, color: "#7f9a7a", kind: "leaf", image: `${PHOTOS}/stem-eucalyptus.png` },
  ],
  wrapLabel: "paper, ribbon and a card",
  orderLabel: "Order this bouquet",
  dayUnits: ["day", "days", "days"],
  assemblyLabels: ["40 min", "1.5 h", "3 h"],
  emptyLine: "the vase is empty — add a couple of stems →",
  lifeLine: "this bouquet lasts {n} {days}",
  stemLine: "{price}/stem · lasts {n} {days}",
  removeLabel: "Remove: {name}",
  addLabel: "Add: {name}",
  stemsLabel: "Stems",
  assemblyLabel: "Ready in",
  priceLabel: "Price",
  wrapLine: "{wrap} — {price}, already included",
}

const delivery: Flowers003Props = {
  eyebrow: "Delivery to the hour",
  title: "Tell us when — we'll deliver to the minute",
  lede: "Windows are counted from the current time: two hours to arrange, then an hour on the road. The courier texts half an hour before arriving.",
  submitLabel: "Place the order",
  doneTitle: "Order received",
  doneText: "The florist will call within ten minutes — to confirm the card and the entrance.",
  dayUnits: ["day", "days", "days"],
  minutesUnit: "min",
  hoursUnit: "h",
  decimalSeparator: ".",
  clockLine: "checking the clock…",
  nightLine: "it's night now — we'll deliver first thing in the morning",
  nowLine: "it's {time} now, the nearest window is in {wait}",
  byLine: "by {time}",
  todayLabel: "today",
  tomorrowLabel: "tomorrow",
  windowLine: "{day}, window {from}–{to}",
  countingLine: "counting windows",
  tapeLabel: "Delivery window",
  rangeLabel: "Delivery time",
  hintLine: "Couriers from {open} to {close}. Delivery {price}, free from {free}.",
  courierLine: "The courier will arrive {day} by {time}. ",
  orderTitle: "Your bouquet",
  orderLine: "{items} · {stems} stems · lasts {n} {days}",
  editLabel: "change the mix",
  noOrderTitle: "Which bouquet?",
  noOrderText: "Build it in the builder — the mix will appear here. Or describe it in words below.",
  builderLabel: "open the builder",
  nameLabel: "Your name",
  phoneLabel: "Phone",
  addressLabel: "Address, entrance, floor",
  noteLabel: "Card or wishes",
  totalLine: "bouquet {bouquet} + delivery {delivery}",
  freeLabel: "free",
  noBouquetLine: "delivery {delivery}, we'll price the bouquet after the call",
}

const season: Flowers004Props = {
  eyebrow: "Season",
  title: "What's in bloom this month",
  lede: "We don't ship roses from Ecuador all year round. Here's an honest calendar: what's fresher, what's cheaper and what lasts longer.",
  months: [
    { name: "January", flowers: ["amaryllis", "hyacinth", "tulip"], note: "greenhouse-grown, but alive and fragrant" },
    { name: "February", flowers: ["mimosa", "tulip", "ranunculus"], note: "mimosa — exactly two weeks" },
    { name: "March", flowers: ["daffodil", "ranunculus", "anemone"], note: "the first Dutch anemones" },
    { name: "April", flowers: ["lilac", "freesia", "tulip"], note: "lilac comes from Crimea" },
    { name: "May", flowers: ["peony", "lily of the valley", "poppy"], note: "peonies — from 20 May" },
    { name: "June", flowers: ["peony", "poppy", "daisy"], note: "peak peonies, best price" },
    { name: "July", flowers: ["lavender", "delphinium", "cornflower"], note: "meadow flowers from local farms" },
    { name: "August", flowers: ["dahlia", "sunflower", "hydrangea"], note: "dahlias until the frost" },
    { name: "September", flowers: ["dahlia", "aster", "scabiosa"], note: "the darkest palette of the year" },
    { name: "October", flowers: ["chrysanthemum", "physalis", "rowan"], note: "berries and dried flowers" },
    { name: "November", flowers: ["amaryllis", "eucalyptus", "cotton"], note: "we start drying" },
    { name: "December", flowers: ["spruce", "ilex", "poinsettia"], note: "conifers and red berries" },
  ],
  nowLabel: "in bloom now",
  prevLabel: "Earlier",
  nextLabel: "Later",
  ribbonLabel: "Season calendar",
  hint: "← drag the ribbon or use the arrows",
}

const care: Flowers005Props = {
  eyebrow: "Care",
  title: "So they last longer",
  lede: "Five rules we put on the card in every bouquet. Here — in more detail.",
  items: [
    { title: "Trim the stems at an angle", text: "Two centimetres with a sharp knife at 45°, ideally under water — so the stem doesn't draw in air and starts drinking right away. Repeat every two days.", icon: "scissors" },
    { title: "Water — cool, fresh every day", text: "A clean vase, tap water left to stand for half an hour. The sachet of flower food from the paper envelope — per litre. Strip leaves below the waterline, or they'll rot.", icon: "water" },
    { title: "No sun and no radiators", text: "A bouquet likes diffused light and a spot away from the window, the stove and the radiator. Draughts are bad too: petals dry out overnight.", icon: "sun" },
    { title: "Cooler — longer", text: "The ideal is 16–18 °C. If it's hot, move the bouquet at night to the coolest room or the balcony, as long as it doesn't drop below +5.", icon: "thermometer" },
    { title: "Keep fruit away", text: "Apples and bananas give off ethylene — flowers age twice as fast from it. A separate table — and peonies last three days longer.", icon: "vase" },
  ],
  counterLabel: "bouquets arranged this week",
  counterNote: "and each one gets a card with these rules",
}

const about: About017Props = {
  eyebrow: "Workshop",
  title: "Twelve years on Pestelya",
  paragraphs: [
    "Stem opened in 2014 in a former pharmacy at 4 Pestelya: the same tiled walls, the same oak counter and the same principle ever since — no cellophane, no dyed roses and nothing that doesn't smell.",
    "Flowers arrive three times a week: from two farms near Petersburg in summer and from Holland in winter. We keep no warehouse: what's in the window was cut yesterday, and we honestly say how long it will last.",
    "Five florists work in the workshop. Each arranges a bouquet from start to finish — and signs the card with their own name.",
  ],
  photos: [
    { src: `${PHOTOS}/workshop-01.webp`, alt: "The workshop bench: buckets of flowers, kraft paper, secateurs", caption: "bench No. 2, morning" },
    { src: `${PHOTOS}/workshop-02.webp`, alt: "A florist's hands trimming peony stems", caption: "we trim every two days" },
  ],
  facts: [
    { value: "2014", label: "year opened" },
    { value: "3 / wk", label: "deliveries from farms" },
    { value: "5", label: "florists" },
  ],
  peopleTitle: "Who arranges",
  people: [
    { name: "Vera Lapina", role: "founder, florist", image: `${PHOTOS}/florist-01.webp`, quote: "A bouquet should smell of a garden, not a shop." },
    { name: "Grisha Olkhin", role: "florist, buying", image: `${PHOTOS}/florist-02.webp`, quote: "I go to the farm on Tuesdays and pick myself." },
  ],
}

const postcards: Testimonials028Props = {
  eyebrow: "Postcards",
  title: "What people write back",
  lede: "Every bouquet leaves with a card. Sometimes cards come back — here are a few.",
  addressee: "Stem workshop",
  address: "4 Pestelya, Saint Petersburg",
  reviews: [
    { text: "Ordered «Morning at the dacha» for my mum's birthday. The courier came at 11 sharp, as promised, and mum showed everyone the card with the florist's name for three days.", name: "Ksenia", place: "Petrogradskaya", date: "12 June", occasion: "for mum, 60" },
    { text: "Built a bouquet of poppies and daisies in the builder in five minutes in a taxi. Delivered to the hour, lasted eight days — I counted.", name: "Anton", place: "Vasilievsky", date: "3 July", occasion: "just because" },
    { text: "The wedding bouquet and boutonnieres: Vera came herself in the morning, fixed the ribbons and left spare pins. Thank you for the calm.", name: "Masha and Ilya", place: "Pushkin", date: "24 August", occasion: "wedding" },
    { text: "A subscription every two weeks for six months now. Never once repeated, and they always write how to care for them. The best thing I buy myself.", name: "Olga", place: "Kolomna", date: "9 September", occasion: "subscription" },
  ],
  stripLabel: "Reviews",
  postLabel: "post",
  linesLabel: "Addressee",
  toLabel: "to:",
  whereLabel: "where:",
  fromLabel: "from:",
  hint: "← flip through the postcards",
}

const subscribe: Subscribe011Props = {
  eyebrow: "Subscription",
  title: "Flowers by subscription — seasonal, never repeated",
  lede: "The florist decides what's blooming best this week. You decide how often it should happen.",
  frequencies: [
    { label: "Every week", perMonth: 4, discount: 20 },
    { label: "Every two weeks", perMonth: 2, discount: 12 },
    { label: "Once a month", perMonth: 1, discount: 5 },
  ],
  sizes: [
    { label: "Small", price: 1900, stems: "5–7 stems" },
    { label: "Medium", price: 2900, stems: "9–12 stems" },
    { label: "Large", price: 4400, stems: "15–19 stems" },
  ],
  perks: ["First delivery — a gift", "Pause for holidays in one click", "A care card in every bouquet", "Cancel any time, no explanations"],
  placeholder: "Phone",
  actionLabel: "Subscribe",
  doneTitle: "Noted",
  doneText: "We'll call today to confirm the address and the day. The first bouquet is on us.",
  frequencyLegend: "How often",
  sizeLegend: "Which bouquet",
  summaryTitle: "your subscription",
  bouquetLabel: "Bouquet",
  frequencyLabel: "Frequency",
  perDeliveryLabel: "Per delivery",
  perMonthCountLabel: "Deliveries per month",
  perMonthLabel: "per month",
  fine: "Charged on delivery day. The first one is free, no card needed.",
}

const footer: Footer035Props = {
  brand: "Stem",
  tagline: "A flower workshop at 4 Pestelya",
  address: "Saint Petersburg, 4 Pestelya St., street entrance",
  hours: "daily 9:00–22:00",
  note: "come in just to smell — you don't have to buy",
  mapSrc: "https://yandex.ru/map-widget/v1/?ll=30.3460,59.9425&z=16&pt=30.3460,59.9425,pm2rdm&lang=en_US",
  mapTitle: "Map: Stem workshop on Pestelya",
  links: [
    { label: "Bouquets", href: "#catalog" },
    { label: "Builder", href: "#builder" },
    { label: "Delivery", href: "#delivery" },
    { label: "Subscription", href: "#subscribe" },
    { label: "Terms", href: "#offer" },
  ],
  copyright: "© 2014–2026 Stem",
  addressLabel: "Address",
  hoursLabel: "Hours",
  phoneLabel: "Phone",
  emailLabel: "Email",
  navLabel: "Sections",
  socialsLabel: "Social",
}

export default function FlowersDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar036 {...paper} {...navbar} />
      <div id="top">
        <Hero036 {...paper} {...hero} />
      </div>
      <div id="catalog">
        <Flowers001 {...paper} {...catalog} />
      </div>
      <div id="builder">
        <Flowers002 {...paper} {...builder} />
      </div>
      <div id="delivery">
        <Flowers003 {...paper} {...delivery} />
      </div>
      <div id="season">
        <Flowers004 {...plum} {...season} />
      </div>
      <div id="care">
        <Flowers005 {...paper} {...care} />
      </div>
      <div id="about">
        <About017 {...paper} {...about} />
      </div>
      <div id="reviews">
        <Testimonials028 {...paper} {...postcards} />
      </div>
      <div id="subscribe">
        <Subscribe011 {...paper} {...subscribe} />
      </div>
      <div id="contacts">
        <Footer035 {...paper} {...footer} />
      </div>
    </div>
  )
}
