import type { CSSProperties } from "react"

import { Navbar034, type Navbar034Props } from "@/registry/blocks/navbar/navbar-034/navbar-034"
import { Hero034, type Hero034Props } from "@/registry/blocks/hero/hero-034/hero-034"
import { Auto001, type Auto001Props } from "@/registry/blocks/industry/auto-001/auto-001"
import { Auto002, type Auto002Props } from "@/registry/blocks/industry/auto-002/auto-002"
import { Auto003, type Auto003Props } from "@/registry/blocks/industry/auto-003/auto-003"
import { People014, type People014Props } from "@/registry/blocks/team/people-014/people-014"
import { Testimonials026, type Testimonials026Props } from "@/registry/blocks/testimonials/testimonials-026/testimonials-026"
import { Auto004, type Auto004Props } from "@/registry/blocks/industry/auto-004/auto-004"
import { Map011, type Map011Props } from "@/registry/blocks/map/map-011/map-011"
import { Footer033, type Footer033Props } from "@/registry/blocks/footer/footer-033/footer-033"

/**
 * English version of the "Car service / detailing" demo: same blocks and
 * theme as `app/scenarios/auto/demo/page.tsx`, block text in English via
 * props.
 *
 * A dark "garage at night": graphite, metal, one acid orange. The car
 * silhouette draws itself and highlights services, the calculator counts
 * on the fly and carries the choice into slot booking, before/after is a
 * draggable curtain, counters roll up, the crew tilts after the cursor.
 */
export const metadata = {
  title: "Garage 42 — detailing studio in a closed bay",
  description:
    "VibeUI «Car service / detailing» scenario demo: a hero with a car silhouette by zones, a service calculator, a before/after slider, a process timeline, the crew, reviews with counters, slot booking and a map.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0f1114",
  color: "#f2f3f5",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const garage = { tone: "dark", accent: "#ff5a1f", ink: "#f2f3f5", background: "#0f1114" } as const

const PHOTOS = "/demo/auto"

const navbar: Navbar034Props = {
  brand: "Garage 42",
  status: "lift #2 is free right now",
  links: [
    { label: "Services", href: "#services" },
    { label: "Before / after", href: "#results" },
    { label: "Crew", href: "#team" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contacts", href: "#contacts" },
  ],
  actionLabel: "Book a slot",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
}

const hero: Hero034Props = {
  eyebrow: "Detailing studio · Saint Petersburg",
  title: ["Like", "brand", "new"],
  lede: "Ceramic coating, paint protection film, polishing and interior cleaning in a closed bay with warm light. We show before/after and name the price up front.",
  primaryLabel: "Get a quote",
  secondaryLabel: "See before / after",
  hint: "Hover over the hood, lights, wheels, body or interior — we'll show the service and the price",
  zones: [
    { id: "body", label: "Body", service: "9H ceramic, three coats", price: "from 32 000 ₽", note: "Two days in the bay. Hydrophobic for 2–3 years, wash once a fortnight." },
    { id: "hood", label: "Hood", service: "Paint protection film on the front", price: "from 45 000 ₽", note: "Hood, bumper, mirrors, pillars. XPEL film, 10-year warranty." },
    { id: "lights", label: "Lights", service: "Headlight polishing and film", price: "from 7 000 ₽", note: "We remove the yellowing and the spider cracks, then 200-micron film on top." },
    { id: "wheels", label: "Wheels", service: "Wheel cleaning and ceramic", price: "from 5 000 ₽", note: "Off the car, clean the inner side, ceramic coat. Brake dust washes off with water." },
    { id: "glass", label: "Interior", service: "Interior and leather cleaning", price: "from 9 000 ₽", note: "Seats, headliner, carpets, plastic. Leather — cleaning and conditioner." },
  ],
  carLabel: "Car silhouette: zones with services",
  zonesTitle: "Services by zone",
  zonesLabel: "Car zones",
}

const calculator: Auto001Props = {
  eyebrow: "Calculator",
  title: "Build your detailing",
  lede: "Tick what you need, pick the car class — price and time are calculated instantly. We lock the total at booking, no «we'll see on site».",
  services: [
    { name: "Detailing wash", price: 2500, minutes: 90, note: "Two-stage hand wash, clay, wax." },
    { name: "Body polishing", price: 18000, minutes: 480, note: "Two stages: cutting and finishing." },
    { name: "9H ceramic, 3 coats", price: 32000, minutes: 720, note: "Hydrophobic for 2–3 years." },
    { name: "PPF on the front", price: 45000, minutes: 960, note: "Hood, bumper, mirrors, pillars." },
    { name: "Interior cleaning", price: 9000, minutes: 300, note: "Seats, headliner, carpets, plastic." },
    { name: "Headlights: polish + film", price: 7000, minutes: 120, note: "200-micron film on top." },
    { name: "Ceramic on wheels", price: 5000, minutes: 150, note: "Off, clean, coat." },
    { name: "Leather: clean and protect", price: 6500, minutes: 180, note: "Foam, brush, conditioner." },
  ],
  classes: [
    { label: "Compact", hint: "Polo, Rio, Mini", factor: 1 },
    { label: "Sedan", hint: "Camry, 5 Series", factor: 1.15 },
    { label: "Crossover", hint: "RAV4, X3, Q5", factor: 1.3 },
    { label: "SUV", hint: "LC300, X7, G-Class", factor: 1.5 },
  ],
  actionLabel: "Book a slot",
  dayUnits: ["day", "days", "days"],
  hoursUnit: "h",
  minutesUnit: "min",
  serviceUnits: ["service", "services", "services"],
  classLabel: "Car class",
  servicesLabel: "Services",
  totalLabel: "Total",
  timeLabel: "Time in the bay",
  selectedLabel: "Selected",
}

const results: Auto002Props = {
  eyebrow: "Before / after",
  title: "Drag — and the difference shows",
  lede: "Three real cars from the bay. Drag the curtain with a finger, a mouse or the arrow keys.",
  pairs: [
    { label: "Lights", before: `${PHOTOS}/before-lights.webp`, after: `${PHOTOS}/after-lights.webp`, work: "Removed the yellowing and spider cracks in three abrasive stages, then 200-micron protective film on top.", time: "2 hours" },
    { label: "Body", before: `${PHOTOS}/before-body.webp`, after: `${PHOTOS}/after-body.webp`, work: "Two-stage polishing and 9H ceramic in three coats. Black is deep again, no holograms.", time: "2 days" },
    { label: "Interior", before: `${PHOTOS}/before-interior.webp`, after: `${PHOTOS}/after-interior.webp`, work: "Headliner, seats and carpets cleaned, leather — cleaning and conditioner. Smells like a new car.", time: "5 hours" },
  ],
  beforeLabel: "before",
  afterLabel: "after",
  tabsLabel: "What we compare",
  workLabel: "What we did",
  tookLine: "Took: {time}",
  sliderLabel: "Before/after curtain: {label}",
}

const steps: Auto003Props = {
  eyebrow: "How it goes",
  title: "Four steps from drive-in to keys",
  lede: "Nothing is «settled on site»: price and timing are known after the inspection, then it's only work and a photo of every stage.",
  steps: [
    { title: "Inspection under the lamp", text: "You drive into the bay, the master checks the body under spotlights, measures the clear coat, shows the trouble spots and locks the price.", duration: "20 minutes", result: "quote in your messenger" },
    { title: "Wash and prep", text: "Two-stage wash, clay, degreasing. We remove whatever is in the way: badges, mud flaps, wheels if needed.", duration: "1.5 hours", result: "clean base" },
    { title: "Work in the bay", text: "Polishing, ceramic, film or interior cleaning — per the quote. The car sits in a closed bay at +22°, no dust and no strangers' hands.", duration: "from 4 hours to 3 days", result: "photo of every stage" },
    { title: "Handover and care guide", text: "We show the result under the same lamp as at the inspection. You get a care guide and a reminder about the first wash in two weeks.", duration: "20 minutes", result: "warranty in the contract" },
  ],
}

const crew: People014Props = {
  eyebrow: "Crew",
  title: "Who touches your car",
  lede: "Three masters, each with their own specialty. No trainees on someone else's body: the hard stuff is done by whoever has done it a thousand times.",
  members: [
    { name: "Artem Gushchin", role: "Founder, polishing and ceramic", photo: `${PHOTOS}/master-01.webp`, years: "11 years", cars: "2 400", skills: ["Ceramic", "Holograms", "Porsche"] },
    { name: "Marat Safin", role: "PPF wrapping", photo: `${PHOTOS}/master-02.webp`, years: "8 years", cars: "1 100", skills: ["XPEL", "Seamless front", "Headlights"] },
    { name: "Dasha Orlova", role: "Interior, leather, cleaning", photo: `${PHOTOS}/master-03.webp`, years: "6 years", cars: "1 800", skills: ["Leather", "Alcantara", "Child seats"] },
  ],
  yearsLabel: "experience",
  carsLabel: "cars",
}

const reviews: Testimonials026Props = {
  eyebrow: "Reviews",
  title: "They come back for the result, not the discount",
  stats: [
    { value: 1840, label: "cars last year" },
    { value: 9, label: "years in detailing" },
    { value: 72, suffix: "%", label: "come back" },
    { value: 4.9, label: "rating on maps" },
  ],
  reviews: [
    { name: "Ilya R.", car: "Porsche Macan, 2022", text: "Had the ceramic done by Artem. A year on, I wash once a fortnight and water beads off by itself. Not a single hologram under the lamp.", stars: 5 },
    { name: "Ksenia V.", car: "Mini Cooper S", text: "Came in with headlights like an old trolleybus. Two hours later — showroom fresh, plus film on top.", stars: 5 },
    { name: "Dmitry K.", car: "BMW X5, 2021", text: "Front in film, no seams visible even on the hood. They sent photos of every stage and never changed the quote.", stars: 5 },
    { name: "Anna and Pavel", car: "Volvo XC90", text: "Interior cleaning after two kids and a dog. Dasha got everything out, including what we preferred not to think about.", stars: 5 },
    { name: "Roman T.", car: "Tesla Model 3", text: "Polishing + ceramic. Liked that they first showed the clear coat thickness and explained where you can't go hard.", stars: 5 },
    { name: "Egor M.", car: "Lexus RX", text: "The bay is clean and bright, nobody else touches the car. Picked it up on time, got the care guide on paper.", stars: 4 },
    { name: "Marina S.", car: "Audi Q5", text: "Wheels got ceramic — brake dust now rinses off with a hose. A small thing, but nice.", stars: 5 },
    { name: "Sergey L.", car: "Land Rover Defender", text: "Booked a Saturday slot on the site, confirmed within a minute. Not «we'll call you back» — it actually works.", stars: 5 },
  ],
  starsLabel: "{n} out of 5",
  brandsLabel: "Brands we work with",
}

const booking: Auto004Props = {
  eyebrow: "Booking",
  title: "Pick a slot — we confirm within a minute",
  lede: "A week ahead across two lifts. Taken slots are crossed out, grey ones have passed. Tap a free time and leave your phone number.",
  namePlaceholder: "Your name",
  phonePlaceholder: "+7 (___) ___-__-__",
  actionLabel: "Book a slot",
  doneTitle: "The slot is yours",
  doneText: "A master will message you within a minute to confirm the time and ask about the car.",
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  gridLabel: "Free slots for the week",
  freeLabel: "free",
  busyLabel: "taken",
  pastLabel: "passed",
  closedLabel: "day off",
  pickedLabel: "your pick",
  orderTitle: "Your order",
  classLine: "Class: {value}",
  totalLabel: "Calculator total",
  emptyText: "Services will come from the calculator above. Or just pick a time — we'll discuss on the phone.",
  timeLabel: "Time",
  pickHint: "Pick a slot in the grid",
  phoneLabel: "Phone",
  fineText: "No prepayment. You can reschedule or cancel until the evening before.",
}

const where: Map011Props = {
  eyebrow: "Find us",
  title: "The bay on Obvodny, gate 42",
  address: "Saint Petersburg, Obvodny Canal emb., 150, bldg 3",
  howToFind: "Enter from Kurlyandskaya, the second gate with the green sign. Call — we'll open the barrier.",
  facts: [
    { label: "Phone", value: "+7 (812) 420-42-42", href: "tel:+78124204242" },
    { label: "Messenger", value: "@garage42_spb", href: "#" },
    { label: "Hours", value: "Mon–Sat 9:00–21:00, Sun — closed" },
    { label: "Parking", value: "Our own, 6 spots at the bay gate" },
  ],
  mapsLabel: "Open in Yandex Maps",
  navigatorLabel: "Route in 2GIS",
  pinLabel: "Garage 42",
  fromLabel: "Baltiyskaya metro · 7 min",
  mapLabel: "Directions: {pin}",
}

const footer: Footer033Props = {
  wordmark: "Garage 42",
  brand: "Garage 42",
  tagline: "Detailing studio in a closed bay. Ceramic, film, polishing, interior. Saint Petersburg, since 2017.",
  columns: [
    { title: "Services", links: [{ label: "Ceramic", href: "#services" }, { label: "PPF film", href: "#services" }, { label: "Polishing", href: "#services" }, { label: "Interior cleaning", href: "#services" }] },
    { title: "Studio", links: [{ label: "Before / after", href: "#results" }, { label: "How it goes", href: "#process" }, { label: "Crew", href: "#team" }, { label: "Reviews", href: "#reviews" }] },
    { title: "For clients", links: [{ label: "Book a slot", href: "#booking" }, { label: "Warranty", href: "#" }, { label: "Care guide", href: "#" }, { label: "Gift certificate", href: "#" }] },
  ],
  address: "Obvodny Canal emb., 150, bldg 3",
  hours: "Mon–Sat 9:00–21:00",
  legal: "© 2026 Garage 42 LLC. Tax ID 7805123456",
  note: "Prices on the site are a guide; the exact one is locked after the inspection.",
  contactsTitle: "Contacts",
}

export default function AutoDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar034 {...garage} {...navbar} />
      <div id="top">
        <Hero034 {...garage} {...hero} />
      </div>
      <div id="services">
        <Auto001 {...garage} {...calculator} background="#14171b" />
      </div>
      <div id="results">
        <Auto002 {...garage} {...results} />
      </div>
      <div id="process">
        <Auto003 {...garage} {...steps} background="#14171b" />
      </div>
      <div id="team">
        <People014 {...garage} {...crew} />
      </div>
      <div id="reviews">
        <Testimonials026 {...garage} {...reviews} background="#14171b" />
      </div>
      <div id="booking">
        <Auto004 {...garage} {...booking} />
      </div>
      <div id="contacts">
        <Map011 {...garage} {...where} background="#14171b" />
      </div>
      <Footer033 {...garage} {...footer} />
    </div>
  )
}
