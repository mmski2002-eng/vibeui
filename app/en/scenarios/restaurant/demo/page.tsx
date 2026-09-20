import type { CSSProperties } from "react"

import { Navbar021 } from "@/registry/blocks/navbar/navbar-021/navbar-021"
import { Hero021 } from "@/registry/blocks/hero/hero-021/hero-021"
import { Restaurant003 } from "@/registry/blocks/restaurant/restaurant-003/restaurant-003"
import { Cta016 } from "@/registry/blocks/cta/cta-016/cta-016"
import { About007 } from "@/registry/blocks/about/about-007/about-007"
import { Restaurant005 } from "@/registry/blocks/restaurant/restaurant-005/restaurant-005"
import { Contact016 } from "@/registry/blocks/contact/contact-016/contact-016"
import { Event004 } from "@/registry/blocks/events/event-004/event-004"
import { Testimonials017 } from "@/registry/blocks/testimonials/testimonials-017/testimonials-017"
import { Map005 } from "@/registry/blocks/map/map-005/map-005"
import { Footer020 } from "@/registry/blocks/footer/footer-020/footer-020"

/**
 * English version of the "Restaurant" demo: same blocks and theme as
 * `app/scenarios/restaurant/demo/page.tsx`, text in English.
 *
 * A dark theme, candles and copper. Eleven blocks from the catalogue's
 * shared groups plus the menu and gallery from restaurant; the header lies
 * transparent over the first screen. A showcase of the result, not a
 * template.
 */
export const metadata = {
  title: "Soyka — a Nordic-kitchen restaurant",
  description:
    "VibeUI «Restaurant» scenario demo: a restaurant site with a menu, the chef, a gallery of the room, table booking, events and a map.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#141110",
  color: "#f2ebe0",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const dark = { tone: "dark", background: "#141110", ink: "#f2ebe0", accent: "#7d2a3a" } as const

const PHOTOS = "/demo/restaurant"

const MENU = [
  {
    title: "Starters",
    note: "We bake our bread twice a day",
    dishes: [
      { name: "Venison tartare", text: "juniper, yolk, rye crisps", price: "890 ₽", tags: ["chef"], image: `${PHOTOS}/dish-02.webp` },
      { name: "Khasan oysters", text: "3 pcs, shallot vinegar, lemon", price: "1 250 ₽", image: `${PHOTOS}/dish-05.webp` },
      { name: "Roasted beetroot", text: "goat cheese, hazelnut, thyme honey", price: "620 ₽", tags: ["veg"] },
      { name: "Herring and potatoes", text: "dill oil, onion in currant juice", price: "540 ₽" },
    ],
  },
  {
    title: "Mains",
    dishes: [
      { name: "Ladoga whitefish", text: "smoked potatoes, sorrel sauce", price: "1 480 ₽", tags: ["chef"], image: `${PHOTOS}/dish-01.webp` },
      { name: "Charcoal venison", text: "parsnip purée, lingonberry, reindeer moss", price: "2 100 ₽" },
      { name: "Forest mushroom soup", text: "cream, pine-needle butter, crouton", price: "690 ₽", tags: ["veg"], image: `${PHOTOS}/dish-03.webp` },
      { name: "Pike dumplings", text: "dashi broth, chilli oil", price: "820 ₽", tags: ["spicy"] },
    ],
  },
  {
    title: "Desserts",
    dishes: [
      { name: "Sea buckthorn and meringue", text: "honey, goat's milk cream", price: "560 ₽", tags: ["chef"], image: `${PHOTOS}/dish-04.webp` },
      { name: "Rye bread with ice cream", text: "black bread caramel", price: "490 ₽" },
      { name: "Cloudberry", text: "sorbet, condensed milk, crumble", price: "520 ₽", tags: ["veg"] },
    ],
  },
  {
    title: "Bar",
    note: "House infusions, 60 ml each",
    dishes: [
      { name: "Cranberry and rosemary", text: "gin, cranberry, rosemary syrup", price: "650 ₽", image: `${PHOTOS}/dish-06.webp` },
      { name: "Pine sour", text: "pine-infused vodka, lemon, egg white", price: "620 ₽" },
      { name: "Riesling Kabinett", text: "Mosel, 150 ml glass", price: "650 ₽" },
      { name: "Cloudberry infusion", text: "60 ml", price: "320 ₽" },
    ],
  },
]

const HALL = [
  { src: `${PHOTOS}/hall-01.webp`, aspect: "3 / 2", caption: "the bar" },
  { src: `${PHOTOS}/hall-02.webp`, aspect: "2 / 3", caption: "by the window" },
  { src: `${PHOTOS}/hall-04.webp`, aspect: "1", caption: "table setting" },
  { src: `${PHOTOS}/hall-03.webp`, aspect: "3 / 2", caption: "the terrace" },
  { src: `${PHOTOS}/chef-hands.webp`, aspect: "1", caption: "the kitchen" },
  { src: `${PHOTOS}/hero.webp`, aspect: "2 / 3", caption: "the room" },
  { src: `${PHOTOS}/event.webp`, aspect: "3 / 2", caption: "jazz on Fridays" },
  { src: `${PHOTOS}/dish-05.webp`, aspect: "1", caption: "oyster Wednesday" },
  { src: `${PHOTOS}/chef.webp`, aspect: "4 / 5", caption: "the chef" },
]

const EVENTS = [
  { day: "Wed", when: "every week", time: "18:00–23:00", title: "Oyster Wednesdays", text: "Khasan and Far East oysters at cost, with a glass of Muscadet.", price: "650 ₽ / 6 pcs", actionLabel: "Take a table", actionHref: "#book", image: `${PHOTOS}/dish-05.webp` },
  { day: "Fri", when: "every week", time: "21:00", title: "Jazz at the bar", text: "The Ilya Gordeev trio: standards and a little Nordic modern. Free entry, better to hold a table in advance.", price: "free entry", actionLabel: "Book", actionHref: "#book", image: `${PHOTOS}/event.webp` },
  { day: "Sat–Sun", when: "weekends", time: "11:00–16:00", title: "Brunch", text: "Rye-flour syrniki, eggs with whitefish, the pie of the day and unlimited coffee.", price: "1 900 ₽", actionLabel: "Brunch menu", actionHref: "#menu", image: `${PHOTOS}/dish-04.webp` },
  { day: "3 Oct", when: "one evening", time: "19:30", title: "Dinner with a winemaker", text: "Six courses paired with Divnomorskoye Estate wines, the winemaker himself at the table.", price: "7 500 ₽", actionLabel: "6 seats left", actionHref: "#book", image: `${PHOTOS}/dish-06.webp` },
]

const REVIEWS = [
  { quote: "The whitefish with smoked potatoes is the best thing I've eaten in the city this year. And the candles, and the quiet, and nobody rushing you.", name: "Maria K.", occasion: "dinner for two", source: "Yandex Maps", rating: 5 },
  { quote: "Came for oyster Wednesday, stayed till closing. The bartender built a sour to fit our conversation, not the menu.", name: "Ilya and Sasha", occasion: "Wednesday", source: "Restoclub", rating: 5 },
  { quote: "Celebrated a birthday for twelve — the back room, our own menu, not a single hitch.", name: "Anna L.", occasion: "birthday", source: "TripAdvisor", rating: 5 },
]

export default function Page() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar021
        {...dark}
        overlay
        brand="Soyka"
        brandHref="#"
        caption="Nordic kitchen · Petrogradskaya"
        hours="Today until 23:00"
        phone="+7 812 305-00-40"
        phoneHref="tel:+78123050040"
        actionLabel="Book a table"
        actionHref="#book"
        menuLabel="Menu"
        navLabel="Sections"
        links={[
          { label: "Menu", href: "#menu" },
          { label: "Chef", href: "#chef" },
          { label: "Room", href: "#hall" },
          { label: "Events", href: "#events" },
          { label: "Contacts", href: "#map" },
        ]}
      />
      <div id="hero">
        <Hero021
          {...dark}
          image={`${PHOTOS}/hero.webp`}
          imageAlt="The restaurant room in the evening: candles on oak tables, an open kitchen"
          eyebrow="Kitchen · bar · terrace"
          lines={["The North on a plate,", "warmth at the *table*"]}
          lede="Ladoga whitefish, venison and cloudberries half an hour from Nevsky. An open kitchen, candles and a table you'll want to come back to."
          primaryLabel="Book a table"
          primaryHref="#book"
          secondaryLabel="See the menu"
          secondaryHref="#menu"
          ticker={["Seasonal menu — autumn", "Oysters on Wednesdays", "Weekend brunches from 11:00", "Jazz on Fridays", "Terrace until the end of September"]}
        />
      </div>
      <div id="menu">
        <Restaurant003
          {...dark}
          eyebrow="Menu"
          title="What we're cooking this autumn"
          lede="The menu changes with the season. Fish from Ladoga, game from Karelia, vegetables from farms near Gatchina. Hover over a dish — we'll show it."
          sections={MENU}
          fullLabel="Full menu in PDF"
          fullHref="#"
          tabsLabel="Menu sections"
        />
      </div>
      <Cta016
        {...dark}
        label="Wine of the week"
        title="Riesling Kabinett, Mosel, 2022"
        text="Dry, mineral, with apple and lime. Perfect with the whitefish and the oysters."
        price="650 ₽ / glass"
        actionLabel="See the bar"
        actionHref="#menu"
        image={`${PHOTOS}/dish-06.webp`}
      />
      <div id="chef">
        <About007
          {...dark}
          eyebrow="Chef"
          quote="I grew up on Ladoga. Everything we cook is an attempt to bring back that taste: smoke, forest and cold water."
          name="Anna Ryabova"
          role="Chef and co-owner"
          text="Ten years in Copenhagen and Helsinki, then home. The menu changes four times a year, fish comes from the lake on Tuesdays and Fridays, bread is baked on a seven-year-old sourdough."
          facts={[
            { value: "18", label: "years in the kitchen" },
            { value: "4", label: "seasonal menus a year" },
            { value: "2", label: "stars in the «Gde» guide" },
          ]}
          image={`${PHOTOS}/chef.webp`}
          imageAlt="Anna Ryabova in the restaurant kitchen"
          imageSecondary={`${PHOTOS}/chef-hands.webp`}
        />
      </div>
      <div id="hall">
        <Restaurant005 {...dark} eyebrow="Room" title="Candles, wood and a courtyard view" lede="Forty seats in the room, eight at the bar and a terrace for summer. Tables for parties up to twelve — in the back room." photos={HALL} closeLabel="Close" openLabel="Open photo" photoLabel="Photo" />
      </div>
      <div id="book">
        <Contact016
          {...dark}
          background="#1a1614"
          eyebrow="Booking"
          title="Keep a table for yourself"
          lede="We confirm within fifteen minutes during working hours. Parties of eight or more — by phone."
          slots={["18:00", "18:30", "19:30", "20:00", "21:30"]}
          slotsLabel="Free today"
          notes={["We hold the table for 15 minutes after the booking", "With children — until 20:00, high chairs available", "The terrace is open from May to September"]}
          submitLabel="Book a table"
          doneTitle="The table is yours"
          doneText="We'll send a confirmation to your messenger in a couple of minutes."
          consentLabel="I agree to data processing and a call on this number."
          dateLabel="Date"
          timeLabel="Time"
          guestsLabel="Guests"
          lessLabel="Fewer"
          moreLabel="More"
          nameLabel="Name"
          namePlaceholder="How should we address you"
          phoneLabel="Phone"
          phonePlaceholder="+7 999 123-45-67"
          noteLabel="Wishes"
          notePlaceholder="By the window, a birthday, no onion…"
          action=""
        />
      </div>
      <div id="events">
        <Event004 {...dark} eyebrow="Events" title="What happens in the evenings" lede="Oysters, jazz and dinners with winemakers. Tables for events are held by booking." events={EVENTS} />
      </div>
      <div id="reviews">
        <Testimonials017 {...dark} eyebrow="Reviews" title="What people write after dinner" score="4.9" scoreLabel="from 640 reviews on three platforms" image={`${PHOTOS}/hall-01.webp`} reviews={REVIEWS} ratingLabel="Rating {n} out of 5" />
      </div>
      <div id="map">
        <Map005
          {...dark}
          eyebrow="How to get here"
          title="20 Bolshaya Pushkarskaya"
          address="Saint Petersburg, 20 Bolshaya Pushkarskaya, courtyard entrance"
          latitude={59.9585}
          longitude={30.3045}
          zoom={16}
          hours={[
            { days: "Mon–Thu", time: "12:00–23:00" },
            { days: "Fri–Sat", time: "12:00–01:00" },
            { days: "Sun", time: "11:00–22:00" },
          ]}
          details={["Gorkovskaya metro — 7 minutes on foot", "Courtyard parking, 6 spots, by booking", "Courtyard entrance, the arch to the left of the pharmacy"]}
          phone="+7 812 305-00-40"
          phoneHref="tel:+78123050040"
          routeLabel="Get directions"
          providerLabel="Yandex Maps"
          failedText="The JS API didn't load — showing the embedded Yandex Maps widget. Check the key and the domain in the developer console."
        />
      </div>
      <div id="footer">
        <Footer020
          {...dark}
          background="#0e0c0b"
          brand="Soyka"
          caption="Nordic kitchen · Petrogradskaya"
          address="Saint Petersburg, 20 Bolshaya Pushkarskaya, courtyard entrance"
          hours={[
            { days: "Mon–Thu", time: "12:00–23:00" },
            { days: "Fri–Sat", time: "12:00–01:00" },
            { days: "Sun", time: "11:00–22:00" },
          ]}
          hoursLabel="Hours"
          phone="+7 812 305-00-40"
          phoneHref="tel:+78123050040"
          email="hello@soyka.spb.ru"
          messengersLabel="Bookings and questions"
          messengers={[
            { kind: "telegram", label: "Telegram", href: "https://t.me/" },
            { kind: "whatsapp", label: "WhatsApp", href: "https://wa.me/78123050040" },
            { kind: "max", label: "Max", href: "https://max.ru/", short: "M" },
          ]}
          linksLabel="More"
          links={[
            { label: "Gift certificates", href: "#" },
            { label: "Banquets and the back room", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Privacy policy", href: "#" },
          ]}
          legal="© 2019–2026 Soyka LLC. Tax ID 7813000000. The menu is not a public offer."
        />
      </div>
    </div>
  )
}
