import type { CSSProperties } from "react"

import { Navbar020 } from "@/registry/blocks/navbar/navbar-020/navbar-020"
import { Hero020 } from "@/registry/blocks/hero/hero-020/hero-020"
import { Realty003 } from "@/registry/blocks/industry/realty-003/realty-003"
import { Map004 } from "@/registry/blocks/map/map-004/map-004"
import { Realty005 } from "@/registry/blocks/industry/realty-005/realty-005"
import { Realty006 } from "@/registry/blocks/industry/realty-006/realty-006"
import { People007 } from "@/registry/blocks/team/people-007/people-007"
import { Testimonials016 } from "@/registry/blocks/testimonials/testimonials-016/testimonials-016"
import { Faq016 } from "@/registry/blocks/faq/faq-016/faq-016"
import { Contact015 } from "@/registry/blocks/contact/contact-015/contact-015"
import { Footer019 } from "@/registry/blocks/footer/footer-019/footer-019"

/**
 * English version of the "Real estate agency" demo: same blocks and theme
 * as `app/scenarios/realty/demo/page.tsx`, text in English.
 *
 * A light sandy theme, serif headings, a brass accent. Twelve blocks: the
 * header, first screen, footer and the rest from the catalogue's shared
 * groups plus four subject blocks from realty, including a Yandex Map of
 * districts. A showcase of the result, not a template.
 */
export const metadata = {
  title: "House on the Neva — real estate agency",
  description:
    "VibeUI «Real estate agency» scenario demo: an agency site with search, a selection of listings, a district map, a mortgage calculator and a flat valuation form.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f3ede3",
  color: "#173b2e",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const realty = { tone: "light", background: "#f3ede3", ink: "#173b2e", accent: "#b8925a" } as const
// Inverted sections: an ink-green slab with light text.
const realtyDark = { ...realty, background: "#173b2e", ink: "#eef0ea" } as const

const PHOTOS = "/demo/realty"

const LISTINGS = [
  { title: "Two-room with a green kitchen on Petrogradskaya", price: "18 900 000 ₽", kind: "Flats", area: "64 m²", rooms: "2 rooms", floor: "4 of 6", district: "Petrogradskaya", metro: "Chkalovskaya, 7 min", badge: "exclusive", image: `${PHOTOS}/object-01.webp`, imageHover: `${PHOTOS}/object-02.webp`, text: "A 24 m² kitchen-living room with courtyard windows, two separate bedrooms, a fresh 2024 renovation.", features: ["A 1912 building, major overhaul in 2019", "3.4 m ceilings, herringbone parquet", "Closed courtyard, a storeroom in the basement"] },
  { title: "A bay-window flat on a quiet street", price: "31 500 000 ₽", kind: "Flats", area: "112 m²", rooms: "3 rooms", floor: "2 of 5", district: "Central", metro: "Vladimirskaya, 9 min", image: `${PHOTOS}/object-02.webp`, imageHover: `${PHOTOS}/object-04.webp`, text: "Three rooms with a south-facing bay window, a study in the former dressing room, windows onto a linden alley.", features: ["Mouldings and stoves preserved", "Two bathrooms, a dressing room", "Courtyard parking"] },
  { title: "A studio with a sunset view", price: "9 200 000 ₽", kind: "New builds", area: "31 m²", rooms: "studio", floor: "19 of 24", district: "Primorsky", metro: "Begovaya, 12 min", badge: "new build", image: `${PHOTOS}/object-03.webp`, text: "A corner studio with panoramic glazing, a kitchen in a niche, white-box finish from the developer.", features: ["Handover in Q4 2026", "Mortgage from 6% under the programme", "Parking and storerooms in the building"] },
  { title: "A bedroom with mouldings, courtyard windows", price: "22 400 000 ₽", kind: "Flats", area: "78 m²", rooms: "3 rooms", floor: "3 of 4", district: "Central", metro: "Chernyshevskaya, 6 min", image: `${PHOTOS}/object-04.webp`, text: "A quiet three-room on the third floor: a bedroom with mouldings, a kids' room and a living room with a fireplace.", features: ["An 1898 building, lift", "Two bathrooms", "School and kindergarten in the courtyard"] },
  { title: "A townhouse with a garden and terrace", price: "27 000 000 ₽", kind: "Houses", area: "148 m²", rooms: "4 rooms", district: "Kurortny", metro: "Sestroretsk, rail", badge: "urgent", image: `${PHOTOS}/object-05.webp`, text: "A two-storey townhouse with a 400 m² plot, a terrace and a separate entrance.", features: ["Mains gas, water and sewage", "A two-car garage", "10 minutes on foot to the gulf"] },
  { title: "A penthouse with a terrace over the roofs", price: "64 000 000 ₽", kind: "Flats", area: "164 m²", rooms: "4 rooms", floor: "7 of 7", district: "Central", metro: "Admiralteyskaya, 5 min", image: `${PHOTOS}/object-06.webp`, text: "The top floor with a 60 m² terrace, a view of the cathedral dome and a private lift.", features: ["4.2 m ceilings", "Panoramic windows on three sides", "Two parking spaces in a closed courtyard"] },
] as const

const DISTRICTS = [
  { name: "Petrogradskaya", price: "285k ₽", count: "164 listings", note: "art nouveau, quiet courtyards, 10 minutes to the centre", image: `${PHOTOS}/district-01.webp`, latitude: 59.9632, longitude: 30.3117, href: "#objects" },
  { name: "Vasilievsky", price: "240k ₽", count: "128 listings", note: "embankments, numbered lines, quiet in the evening", image: `${PHOTOS}/district-02.webp`, latitude: 59.9412, longitude: 30.2626, href: "#objects" },
  { name: "Central", price: "310k ₽", count: "402 listings", note: "grand entrances, mouldings, the best schools", image: `${PHOTOS}/district-03.webp`, latitude: 59.9343, longitude: 30.3462, href: "#objects" },
  { name: "Primorsky", price: "205k ₽", count: "356 listings", note: "new builds by the gulf, parks", image: `${PHOTOS}/district-04.webp`, latitude: 59.9989, longitude: 30.2632, href: "#objects" },
] as const

const AGENTS = [
  { name: "Marina Lebedeva", role: "Head. Historic stock, the centre", fact: "18 years in deals", image: `${PHOTOS}/agent-01.webp`, phone: "+7 812 240-00-41", phoneHref: "tel:+78122400041", chatLabel: "Message", chatHref: "#valuation" },
  { name: "Ilya Gromov", role: "New builds and mortgages, every bank programme", fact: "412 deals", image: `${PHOTOS}/agent-02.webp`, phone: "+7 812 240-00-42", phoneHref: "tel:+78122400042", chatLabel: "Message", chatHref: "#valuation" },
  { name: "Ksenia Orlova", role: "Rentals and sales: Petrogradskaya, Vasilievsky", fact: "26 days to a deal", image: `${PHOTOS}/agent-03.webp`, phone: "+7 812 240-00-43", phoneHref: "tel:+78122400043", chatLabel: "Message", chatHref: "#valuation" },
  { name: "Andrey Fyodorov", role: "Lawyer. Flat history, debts, owners", fact: "0 contested deals", image: `${PHOTOS}/agent-04.webp`, phone: "+7 812 240-00-44", phoneHref: "tel:+78122400044", chatLabel: "Email", chatHref: "mailto:law@domnaneve.ru" },
]

const REVIEWS = [
  { quote: "Sold the two-room in 26 days and for more than the neighbouring agencies valued it. Ksenia took all the calls and viewings, we only signed.", name: "Olga and Sergey", deal: "sold a flat on Petrogradskaya", source: "Yandex Maps", rating: 5 },
  { quote: "Ilya found a mortgage programme two percent below what our bank offered. Over a year that's more than two hundred thousand.", name: "Dmitry", deal: "bought a studio in Primorsky", source: "Google", rating: 5 },
  { quote: "The flat had a capital repair debt and a registered relative. Andrey cleaned everything up before the deal, we didn't notice a thing.", name: "Anna", deal: "bought a three-room in the centre", source: "Avito", rating: 5 },
]

const FAQ = [
  { question: "How much do your services cost?", answer: "When buying — 2% of the price, when selling — 3%, but no less than 150 000 ₽. Payment after the deal is registered, no advances." },
  { question: "Can I sell a flat with a mortgage?", answer: "Yes. We pay off the mortgage with the buyer's money through a letter of credit or transfer the loan to them — the bank agrees 9 times out of 10." },
  { question: "How is a flat checked?", answer: "The lawyer pulls the history of title transfers, debts, registered residents, bankruptcy of the seller and spouses. The opinion is in writing, and we stand behind it." },
  { question: "Do you work with new builds?", answer: "With every developer in the city at their price list: the developer pays the commission, for you the selection and the deal are free." },
  { question: "What if the flat doesn't sell in 30 days?", answer: "We revise the price and the strategy together with you. The contract can be terminated at any time without penalties." },
]

export default function Page() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar020
        {...realty}
        brand="House on the Neva"
        brandHref="#"
        caption="Real estate agency · Petersburg"
        phone="+7 812 240-00-40"
        phoneHref="tel:+78122400040"
        actionLabel="Value my flat"
        actionHref="#valuation"
        menuLabel="Menu"
        navLabel="Sections"
        links={[
          { label: "Listings", href: "#objects" },
          { label: "Districts", href: "#districts" },
          { label: "How we work", href: "#process" },
          { label: "Mortgage", href: "#mortgage" },
          { label: "Agents", href: "#agents" },
        ]}
      />
      <div id="hero">
        <Hero020
          {...realty}
          image={`${PHOTOS}/hero.webp`}
          imageAlt="The living room of a flat in a historic building with a view of the Neva"
          eyebrow="Petersburg · since 2007"
          title="A flat you'll want to come home to"
          lede="We find homes in Petersburg for your budget and rhythm of life: from a studio by the metro to a house with a garden. Every listing is checked by a lawyer."
          modes={["Buy", "Rent"]}
          types={["Flat", "House", "New build", "Commercial"]}
          districts={["Any district", "Central", "Petrogradskaya", "Vasilievsky", "Primorsky"]}
          budgets={["Any budget", "up to 10M", "10–20M", "20–40M", "from 40M"]}
          submitLabel="Search"
          action="#objects"
          stats={[
            { value: "1 240", label: "listings in the database" },
            { value: "18 years", label: "on the market" },
            { value: "3 offices", label: "in the city" },
          ]}
          modesLabel="What do you need"
          typeLabel="Type"
          districtLabel="District"
          budgetLabel="Budget"
        />
      </div>
      <div id="objects">
        <Realty003
          {...realty}
          eyebrow="Selection of the week"
          title="Listings we vouch for"
          lede="An agent has seen every listing in person, and a lawyer checked it before publication. Hover over the photo — a second angle; click — the card opens into a window."
          allLabel="All"
          moreLabel="All listings"
          moreHref="#valuation"
          listings={[...LISTINGS]}
          flipHint="details"
          openLabel="View the listing"
          closeLabel="Close"
          floorLabel="floor {n}"
          chipsLabel="Listing type"
          emptyLabel="Nothing here yet"
        />
      </div>
      <div id="districts">
        <Map004
          {...realty}
          eyebrow="Districts"
          title="Where you'll live"
          lede="Average price per metre and live listings by district — on a real map of the city."
          zoom={11}
          points={[...DISTRICTS]}
          providerLabel="Yandex Maps"
          failedText="The JS API didn't load — showing the embedded Yandex Maps widget. Check the key and the domain in the developer console."
        />
      </div>
      <div id="process">
        <Realty005
          {...realtyDark}
          eyebrow="How we work"
          title="From the first call to the keys — five steps"
          lede="The timings are real: this is how an average deal goes on the secondary market."
          steps={[
            { title: "A conversation", text: "We listen to why you need the flat and for how many years. We agree the budget and the districts.", time: "1 day" },
            { title: "Selection", text: "From the database and closed offers we pick 5–7 listings worth seeing.", time: "3–5 days" },
            { title: "Viewings", text: "We look together: the agent talks about the pluses and about what might upset you.", time: "1–2 weeks" },
            { title: "Checks", text: "The lawyer checks the flat's history, debts and owners. We negotiate for you.", time: "up to 10 days" },
            { title: "The deal and the keys", text: "We accompany you at the bank and the notary, accept the flat, hand over the keys.", time: "1 day" },
          ]}
        />
      </div>
      <div id="mortgage">
        <Realty006
          {...realty}
          eyebrow="Mortgage"
          title="How much per month"
          lede="We calculate with the annuity formula, like the banks. Ilya will find the exact rate for your programme."
          price={18900000}
          downPercent={20}
          years={20}
          rate={16.5}
          actionLabel="Find a programme"
          actionHref="#valuation"
          note="The calculation is preliminary and not a bank offer."
          costLabel="Price"
          downLabel="Down payment"
          termLabel="Term"
          yearsUnit="years"
          rateLabel="Rate"
          monthlyLabel="Monthly payment"
          loanLabel="Loan amount"
          overpayLabel="Interest over {n} years"
        />
      </div>
      <div id="agents">
        <People007
          {...realty}
          eyebrow="Team"
          title="Four people who run your deal"
          lede="One agent from the first call to the keys. A lawyer joins every deal, not on request."
          agents={AGENTS}
        />
      </div>
      <div id="reviews">
        <Testimonials016
          {...realty}
          eyebrow="Reviews"
          title="What people say after the deal"
          lede="Reviews from open platforms where they can't be edited."
          score="4.9"
          scoreLabel="average rating from 312 reviews"
          reviews={REVIEWS}
          ratingLabel="Rating {n} out of 5"
        />
      </div>
      <div id="faq">
        <Faq016 {...realty} eyebrow="Questions" title="What people ask before the first meeting" lede="Briefly about money, timing and risks. The rest — by phone, no obligations." items={FAQ} noteLabel="Didn't find the answer? Ask" noteHref="#valuation" />
      </div>
      <div id="valuation">
        <Contact015
          {...realty}
          eyebrow="Free valuation"
          title="Find out what your flat is worth"
          lede="We value by deals in your building and the neighbouring ones over the last year, not by listings. We'll call back within an hour during working hours."
          image={`${PHOTOS}/office.webp`}
          imageAlt="The agency office on the ground floor of a historic building"
          promises={["The price the flat will sell for in 30 days", "What's worth fixing before selling and what isn't", "A sales plan and timeline — no obligations"]}
          rooms={["Studio", "1 room", "2 rooms", "3 rooms", "4 or more"]}
          submitLabel="Get a valuation"
          doneTitle="Thank you, received"
          doneText="We'll call back within an hour and name a price range."
          consentLabel="I agree to data processing and a call on this number."
          addressLabel="Address"
          addressPlaceholder="Street, building, flat"
          areaLabel="Area, m²"
          roomsLabel="Rooms"
          phoneLabel="Phone"
          phonePlaceholder="+7 999 123-45-67"
          action=""
        />
      </div>
      <div id="footer">
        <Footer019
          {...realtyDark}
          brand="House on the Neva"
          caption="Real estate agency · Petersburg"
          address="Saint Petersburg, 24 Fontanka River emb., ground floor"
          hours="Daily 10:00–20:00, viewings by arrangement"
          phone="+7 812 240-00-40"
          phoneHref="tel:+78122400040"
          phoneLabel="Phone"
          email="hello@domnaneve.ru"
          messengersLabel="Write wherever is convenient"
          messengers={[
            { kind: "telegram", label: "Telegram", href: "https://t.me/" },
            { kind: "whatsapp", label: "WhatsApp", href: "https://wa.me/78122400040" },
            { kind: "max", label: "Max", href: "https://max.ru/", short: "M" },
            { kind: "vk", label: "VK", href: "https://vk.com/" },
          ]}
          links={[
            { label: "Privacy policy", href: "#" },
            { label: "Terms of service", href: "#" },
          ]}
          legal="© 2007–2026 House on the Neva LLC. RGR licence No. 0412. Not an offer."
        />
      </div>
    </div>
  )
}
