import type { CSSProperties } from "react"

import { Navbar038, type Navbar038Props } from "@/registry/blocks/navbar/navbar-038/navbar-038"
import { Hero048, type Hero048Props } from "@/registry/blocks/hero/hero-048/hero-048"
import { Delivery001, type Delivery001Props } from "@/registry/blocks/industry/delivery-001/delivery-001"
import { Delivery002, type Delivery002Props } from "@/registry/blocks/industry/delivery-002/delivery-002"
import { Delivery003, type Delivery003Props } from "@/registry/blocks/industry/delivery-003/delivery-003"
import { Delivery004, type Delivery004Props } from "@/registry/blocks/industry/delivery-004/delivery-004"
import { Download011, type Download011Props } from "@/registry/blocks/cta/download-011/download-011"
import { Delivery005, type Delivery005Props } from "@/registry/blocks/industry/delivery-005/delivery-005"
import { Faq023, type Faq023Props } from "@/registry/blocks/faq/faq-023/faq-023"
import { Footer037, type Footer037Props } from "@/registry/blocks/footer/footer-037/footer-037"

/**
 * English version of the "Food delivery" demo: same blocks and theme as
 * `app/scenarios/delivery/demo/page.tsx`, block text in English via props.
 *
 * Charcoal, tomato and cream. The "delivered in 28:00" timer ticks in the
 * hero, a burger stacks in slow motion in the background, a menu with a cart bar at the
 * bottom, a bowl builder, a zone map, a tracker with a courier and sticker
 * reviews. Blocks talk through vibeui-cart:* events.
 */
export const metadata = {
  title: "Hot — food delivery in 28 minutes",
  description:
    "VibeUI «Food delivery / dark kitchen» scenario demo: a hero with a live timer and a burger clip, a menu with a sticky cart, a bowl builder, a delivery zone map, an order tracker, an app promo, sticker reviews and a footer.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#141414",
  color: "#fff4e6",
  fontFamily: '"Onest",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const hot = { tone: "dark", accent: "#ff3d2e", ink: "#fff4e6", background: "#141414" } as const

const PHOTOS = "/demo/delivery"

const navbar: Navbar038Props = {
  brand: "Hot",
  address: "12 Tverskaya",
  links: [
    { label: "Menu", href: "#menu" },
    { label: "Builder", href: "#builder" },
    { label: "Delivery zone", href: "#zones" },
    { label: "Tracker", href: "#tracker" },
    { label: "Reviews", href: "#reviews" },
  ],
  cartLabel: "Cart",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
  whereLabel: "Delivery: {address}, {n} minutes",
  minutesUnit: "min",
  countLabel: "In the cart: {n}",
}

const hero: Hero048Props = {
  eyebrow: "Dark kitchen · inside the Third Ring",
  title: ["Hot food", "delivered in"],
  lede: "Our own kitchen and couriers, no middlemen. We cook after payment and deliver in a thermal bag — the burger arrives crispy, the tom yum hot.",
  primaryLabel: "Open the menu",
  secondaryLabel: "Build a bowl",
  trust: "4.8 out of 5 · 12 400 orders a month · free from 1 500 ₽",
  ticker: ["Smash burger", "Tom yum", "Salmon poke", "Pad thai", "Truffle fries", "San Sebastián cheesecake", "Tonkotsu ramen", "Charcoal shawarma"],
  timerLabel: "{m} minutes {s} seconds",
  skipLabel: "Skip",
  replayLabel: "Watch again",
}

// The header sits above the hero: together they fit the window exactly.
const HERO_OFFSET = { "--vibeui-hero-048-offset": "4.25rem" } as CSSProperties

const menu: Delivery001Props = {
  eyebrow: "Menu",
  title: "What we're cooking right now",
  lede: "Eight dishes that leave the kitchen most often. Everything is cooked after payment, nothing is reheated.",
  dishes: [
    { id: "smash", name: "Double smash burger", text: "two patties, cheddar, caramelised onion, «Hot» sauce", price: 590, meta: "320 g · 780 kcal", kind: "Burgers", image: `${PHOTOS}/dish-01.webp`, badge: "hit" },
    { id: "chicken", name: "Crispy chicken burger", text: "breaded thigh, slaw, jalapeño, ranch", price: 520, meta: "300 g · 690 kcal", kind: "Burgers", image: `${PHOTOS}/dish-02.webp`, badge: "spicy" },
    { id: "tomyum", name: "Tom yum with shrimp", text: "coconut, lemongrass, mushrooms, rice on the side", price: 490, meta: "450 ml · 380 kcal", kind: "Asia", image: `${PHOTOS}/dish-03.webp` },
    { id: "poke", name: "Salmon poke", text: "rice, avocado, edamame, mango, ponzu", price: 640, meta: "380 g · 520 kcal", kind: "Asia", image: `${PHOTOS}/dish-04.webp`, badge: "new" },
    { id: "padthai", name: "Chicken pad thai", text: "rice noodles, peanuts, sprouts, lime", price: 470, meta: "400 g · 610 kcal", kind: "Asia", image: `${PHOTOS}/dish-05.webp` },
    { id: "fries", name: "Truffle fries", text: "parmesan, truffle oil, aioli", price: 290, meta: "220 g · 470 kcal", kind: "Snacks", image: `${PHOTOS}/dish-06.webp` },
    { id: "wings", name: "Glazed wings", text: "8 pieces, kimchi mayo, sesame", price: 450, meta: "360 g · 720 kcal", kind: "Snacks", image: `${PHOTOS}/dish-07.webp`, badge: "spicy" },
    { id: "cheesecake", name: "San Sebastián cheesecake", text: "burnt top, vanilla, a spoon of cream", price: 320, meta: "150 g · 430 kcal", kind: "Desserts", image: `${PHOTOS}/dish-08.webp` },
  ],
  allLabel: "All",
  addLabel: "Add to cart",
  checkoutLabel: "Checkout",
  filtersLabel: "Menu sections",
  removeLabel: "Remove {name}",
  emptyText: "Nothing in this section yet",
  cartLabel: "Cart",
  dishUnits: ["dish", "dishes", "dishes"],
  etaLine: " · delivered in {n} min",
  leftLine: "{left} to free delivery · delivery now {fee}",
  freeLine: "Free delivery · thanks for ordering big",
  progressLabel: "To free delivery",
  doneLabel: "Received, cooking",
}

const builder: Delivery002Props = {
  eyebrow: "Builder",
  title: "Build your bowl",
  lede: "Base, protein, toppings, sauce. The bowl on the right fills up as you choose; calories and price update right away.",
  groups: [
    {
      id: "base",
      title: "Base",
      mode: "single",
      options: [
        { id: "rice", name: "Rice", price: 0, kcal: 210, color: "#f4efe2", image: `${PHOTOS}/bowl/base-rice.webp` },
        { id: "quinoa", name: "Quinoa", price: 60, kcal: 190, color: "#d9c9a3", image: `${PHOTOS}/bowl/base-quinoa.webp` },
        { id: "noodles", name: "Soba noodles", price: 40, kcal: 240, color: "#a88a6a", image: `${PHOTOS}/bowl/base-noodles.webp` },
        { id: "greens", name: "Salad mix", price: 0, kcal: 40, color: "#7cc95a", image: `${PHOTOS}/bowl/base-greens.webp` },
      ],
    },
    {
      id: "protein",
      title: "Protein",
      mode: "multi",
      options: [
        { id: "salmon", name: "Salmon", price: 220, kcal: 180, color: "#ff8a6b", image: `${PHOTOS}/bowl/protein-salmon.webp` },
        { id: "chicken", name: "Grilled chicken", price: 150, kcal: 165, color: "#e6b380", image: `${PHOTOS}/bowl/protein-chicken.webp` },
        { id: "shrimp", name: "Shrimp", price: 240, kcal: 95, color: "#ffb0a0", image: `${PHOTOS}/bowl/protein-shrimp.webp` },
        { id: "tofu", name: "Tofu", price: 110, kcal: 120, color: "#f0e6c8", image: `${PHOTOS}/bowl/protein-tofu.webp` },
      ],
    },
    {
      id: "toppings",
      title: "Toppings",
      mode: "multi",
      options: [
        { id: "avocado", name: "Avocado", price: 90, kcal: 120, color: "#9ad04c", image: `${PHOTOS}/bowl/topping-avocado.webp` },
        { id: "edamame", name: "Edamame", price: 60, kcal: 60, color: "#5fb85a", image: `${PHOTOS}/bowl/topping-edamame.webp` },
        { id: "mango", name: "Mango", price: 80, kcal: 70, color: "#ffc632", image: `${PHOTOS}/bowl/topping-mango.webp` },
        { id: "corn", name: "Corn", price: 40, kcal: 55, color: "#ffe066", image: `${PHOTOS}/bowl/topping-corn.webp` },
        { id: "egg", name: "Onsen egg", price: 70, kcal: 75, color: "#fff2c2", image: `${PHOTOS}/bowl/topping-egg.webp` },
        { id: "cucumber", name: "Cucumber", price: 30, kcal: 10, color: "#6fd08b", image: `${PHOTOS}/bowl/topping-cucumber.webp` },
        { id: "sesame", name: "Sesame", price: 20, kcal: 30, color: "#e8dcc0", image: `${PHOTOS}/bowl/topping-sesame.webp` },
        { id: "chili", name: "Chili", price: 20, kcal: 5, color: "#ff3d2e", image: `${PHOTOS}/bowl/topping-chili.webp` },
      ],
    },
    {
      id: "sauce",
      title: "Sauce",
      mode: "single",
      options: [
        { id: "teriyaki", name: "Teriyaki", price: 0, kcal: 60, color: "#7a3b1e", image: `${PHOTOS}/bowl/sauce-teriyaki.webp` },
        { id: "ponzu", name: "Ponzu", price: 0, kcal: 25, color: "#d6a34a", image: `${PHOTOS}/bowl/sauce-ponzu.webp` },
        { id: "peanut", name: "Peanut", price: 20, kcal: 110, color: "#c98a4b", image: `${PHOTOS}/bowl/sauce-peanut.webp` },
        { id: "spicy", name: "Spicy mayo", price: 20, kcal: 130, color: "#ff8060", image: `${PHOTOS}/bowl/sauce-spicy.webp` },
      ],
    },
  ],
  addLabel: "Add to cart",
  addedLabel: "Added to cart",
  ownBowlLabel: "Custom bowl: {items}",
  singleHint: "pick one",
  multiHint: "as many as you like",
  emptyText: "Pick a base — the bowl will fill up",
  kcalLabel: "kcal",
  gramsUnit: "g",
  weightLabel: "weight",
  priceLabel: "price",
  nothingLabel: "Empty so far",
}

const zones: Delivery003Props = {
  eyebrow: "Where we deliver",
  title: "Tap your block",
  lede: "One kitchen, on Baumanskaya. The closer to it — the faster and cheaper. We don't go beyond the ring road yet.",
  zones: [
    { id: "near", name: "Centre — up to 5 km", minutes: 25, fee: 0, freeFrom: 0, radius: 5 },
    { id: "mid", name: "Third Ring and around", minutes: 35, fee: 149, freeFrom: 1500, radius: 11.5 },
    { id: "far", name: "Up to the ring road", minutes: 50, fee: 249, freeFrom: 2500, radius: 18 },
  ],
  addresses: [
    { label: "12 Tverskaya", zone: "near", point: [37.6071, 55.7625] },
    { label: "7 Baumanskaya", zone: "near", point: [37.6793, 55.7712] },
    { label: "40 Leninsky", zone: "mid", point: [37.5856, 55.7068] },
    { label: "Sokol", zone: "mid", point: [37.515, 55.805] },
    { label: "Lyublino", zone: "far", point: [37.7617, 55.6766] },
    { label: "Kuntsevo", zone: "far", point: [37.4461, 55.7306] },
  ],
  kitchenLabel: "kitchen",
  mapLang: "en_US",
  addressesLabel: "Frequent addresses",
  mapLabel: "Delivery zone map around the kitchen",
  legendLabel: "Zones",
  minutesUnit: "min",
  yourAddressTitle: "Your address",
  pickZoneTitle: "Pick a zone",
  pickHint: "Tap the map or an address above",
  etaNote: "from payment to the door",
  etaIdle: "delivery time",
  feeLabel: "Delivery",
  freeLabel: "free",
  freeFromLabel: "Free from",
  anySumLabel: "any amount",
  zoneLabel: "Zone",
  hint: "Time is the average over the last 30 days in this zone. In snow and on Friday evenings add 5–10 minutes, honestly.",
}

const tracker: Delivery004Props = {
  eyebrow: "Tracker",
  title: "Every minute in view",
  lede: "After payment the order lives on one screen: who's cooking, when the courier left and where they are now. No «please wait, we'll contact you».",
  steps: [
    { title: "Order received", text: "Payment went through, the cook sees the order on the screen.", time: "12:41", after: 300, progress: 0 },
    { title: "Cooking", text: "Patties on the grill, fries in the oil. 9 more minutes.", time: "12:43", after: 1800, progress: 0 },
    { title: "Courier on the way", text: "Artem on a scooter, thermal bag, 2.3 km to you.", time: "12:56", after: 3600, progress: 100 },
    { title: "At the door", text: "The courier is here. Enjoy your meal.", time: "13:07", after: 6600, progress: 100 },
  ],
  playLabel: "Show how it looks",
  replayLabel: "Once more",
  courierName: "Artem",
  etaLabels: ["Waiting for the order", "Cooking", "Courier on the way", "Delivered"],
  etaValues: ["26 min", "11 min", "0 min"],
  kitchenLabel: "KITCHEN",
  youLabel: "YOU",
  courierRole: "courier",
  courierMessage: "I'm at the entrance, coming up. The order is hot.",
}

const app: Download011Props = {
  eyebrow: "App",
  title: "−20% on your first order in the app",
  lede: "Courier tracking, repeat your favourite order in one tap and promo codes on Fridays. Installs in a minute.",
  qrLabel: "point your camera",
  phonePlaceholder: "+7 900 000-00-00",
  smsLabel: "Send me the link",
  doneText: "The link is in your SMS",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  phoneLabel: "Phone",
  qrAria: "App QR code",
}

const reviews: Delivery005Props = {
  eyebrow: "Reviews",
  title: "What people write while chewing",
  lede: "The reactions are real — tap yours under every review. The order counter grows from early morning.",
  reviews: [
    { name: "Katya", meta: "Baumanskaya · 14th order", text: "The smash arrived in 19 minutes and was genuinely crispy. The «Hot» sauce is a love of its own, get a double.", dish: "smash", reactions: { "🔥": 48, "😋": 31, "❤️": 22 } },
    { name: "Ilya", meta: "Sokol", text: "Ordered tom yum at one in the morning, the courier texted «coming up» instead of calling. Appreciated. The soup scalds, as promised.", dish: "tom yum", reactions: { "🔥": 27, "😋": 12, "❤️": 9 } },
    { name: "Marina", meta: "Leninsky · with a kid", text: "The bowl builder is a lifesaver: no sauce for my son, spicy mayo for me, one box, two happy people.", dish: "bowl", reactions: { "❤️": 41, "😋": 18, "🔥": 7 } },
    { name: "Dima", meta: "Lyublino", text: "Far away, 50 minutes — but they made it in 42 and still hot. We ate the wings in the stairwell, couldn't wait.", dish: "wings", reactions: { "😋": 35, "🔥": 20, "❤️": 11 } },
    { name: "Anya and Sasha", meta: "Tverskaya · Friday", text: "The tracker is the best thing that ever happened to waiting for food. We watched the scooter on the map like a TV series.", dish: "pad thai", reactions: { "❤️": 29, "🔥": 15, "😋": 14 } },
    { name: "Gosha", meta: "Kuntsevo · 3rd order", text: "The burnt-top cheesecake is the only reason I don't eat desserts anywhere else.", dish: "cheesecake", reactions: { "😋": 52, "❤️": 24, "🔥": 6 } },
  ],
  ordersLabel: "orders today",
  reactionsLabel: "Reactions",
  reactionLabel: "Reaction {emoji}: {n}",
}

const faq: Faq023Props = {
  eyebrow: "Questions",
  title: "Asked before the first order",
  lede: "Briefly about time, temperature and ingredients. The rest — in support chat, we reply within a couple of minutes.",
  items: [
    { question: "Why 28 minutes and not «30 to 60»?", answer: "One kitchen, a short menu, our own couriers. We know how long every dish takes and how long the ride is to every block. 28 is the centre average over the last month; your zone's number is on the map above." },
    { question: "What if you're late?", answer: "If we're more than 10 minutes past the time promised in the tracker — we refund the delivery fee and add a dessert to your next order. Automatically, no calls to support." },
    { question: "Does the food arrive hot?", answer: "We cook after payment, not reheat prepped food. The courier carries a thermal bag with hot and cold separated: the burger doesn't steam, the poke doesn't warm up." },
    { question: "Can I have it without onion / gluten / spice?", answer: "Yes: the dish card has a «remove» for every ingredient before payment, and the bowl builder starts from scratch anyway. The full allergen list is in the site footer." },
    { question: "How do I pay and is there a minimum order?", answer: "By card, instant transfer or through the app. There's no minimum order, but delivery is free from 1 500 ₽ inside the Third Ring and on any amount in the centre." },
  ],
  contactLabel: "Message support",
  contactHref: "#support",
}

const footer: Footer037Props = {
  brand: "Hot",
  caption: "A dark kitchen on Baumanskaya. We cook after payment, deliver with our own couriers, in a thermal bag, no middlemen.",
  hours: "Today until 02:00 · seven days a week",
  columns: [
    { title: "Menu", links: [{ label: "Burgers", href: "#menu" }, { label: "Asia", href: "#menu" }, { label: "Bowl builder", href: "#builder" }, { label: "Desserts", href: "#menu" }] },
    { title: "Delivery", links: [{ label: "Zones and time", href: "#zones" }, { label: "Order tracker", href: "#tracker" }, { label: "App", href: "#app" }, { label: "Questions", href: "#faq" }] },
    { title: "Company", links: [{ label: "About the kitchen", href: "#about" }, { label: "Courier jobs", href: "#jobs" }, { label: "Partners", href: "#partners" }, { label: "Press", href: "#press" }] },
  ],
  socials: [
    { label: "Telegram", href: "#telegram" },
    { label: "VK", href: "#vk" },
    { label: "Dzen", href: "#dzen" },
  ],
  legal: [
    { label: "Terms", href: "#offer" },
    { label: "Privacy", href: "#privacy" },
    { label: "Ingredients and allergens", href: "#allergens" },
  ],
  copyright: "© 2026 Hot LLC. Moscow, 20/2 Baumanskaya",
  socialsLabel: "Social",
}

export default function DeliveryDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar038 {...hot} {...navbar} />
      <div id="top">
        <Hero048 accent={hot.accent} ink={hot.ink} style={HERO_OFFSET} {...hero} />
      </div>
      <div id="menu">
        <Delivery001 {...hot} {...menu} />
      </div>
      <div id="builder">
        <Delivery002 {...hot} {...builder} />
      </div>
      <div id="zones">
        <Delivery003 {...hot} {...zones} />
      </div>
      <div id="tracker">
        <Delivery004 {...hot} {...tracker} />
      </div>
      <div id="app">
        <Download011 {...hot} {...app} image={`${PHOTOS}/promo.webp`} />
      </div>
      <div id="reviews">
        <Delivery005 {...hot} {...reviews} />
      </div>
      <div id="faq">
        <Faq023 {...hot} {...faq} />
      </div>
      <Footer037 {...hot} {...footer} />
    </div>
  )
}
