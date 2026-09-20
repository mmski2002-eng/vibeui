import type { CSSProperties } from "react"

import { Navbar026 } from "@/registry/blocks/navbar/navbar-026/navbar-026"
import { Hero026 } from "@/registry/blocks/hero/hero-026/hero-026"
import { About012 } from "@/registry/blocks/about/about-012/about-012"
import { Event010 } from "@/registry/blocks/events/event-010/event-010"
import { Event011 } from "@/registry/blocks/events/event-011/event-011"
import { Event012 } from "@/registry/blocks/events/event-012/event-012"
import { Map008 } from "@/registry/blocks/map/map-008/map-008"
import { Contact019 } from "@/registry/blocks/contact/contact-019/contact-019"
import { Faq021 } from "@/registry/blocks/faq/faq-021/faq-021"
import { Portfolio009 } from "@/registry/blocks/portfolio/portfolio-009/portfolio-009"
import { Cta022 } from "@/registry/blocks/cta/cta-022/cta-022"
import { Testimonials021 } from "@/registry/blocks/testimonials/testimonials-021/testimonials-021"
import { Footer025 } from "@/registry/blocks/footer/footer-025/footer-025"

/**
 * English version of the "Wedding in Cuba" demo: same blocks and theme as
 * `app/scenarios/wedding-cuba/demo/page.tsx`, text in English.
 *
 * Paper and sand, ink blue, coral and turquoise, Oswald + Lobster + Manrope.
 * A boarding pass at the entrance, the couple's route as a paper plane,
 * three days as tabs, travel info with a checklist, check-in instead of
 * RSVP, postcards instead of a gallery. Thirteen blocks. A showcase of the
 * result, not a template.
 */
export const metadata = {
  title: "Sonya and Timur are flying to get married — 12–14 February 2027, Cuba",
  description:
    "VibeUI «Wedding in Cuba» scenario demo: a boarding pass, the couple's route, three days, travel info, a beach-formal dress code, a map, check-in, questions, postcards, gifts and postcards from guests.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fffaf0",
  color: "#123a4b",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const light = { tone: "light", background: "#fffaf0", ink: "#123a4b", accent: "#ff6b57" } as const
// Alternating sections on sand.
const sand = { ...light, background: "#f3e9d2" } as const

const IMG = "/demo/wedding-cuba/"

const POSTCARDS = [
  { src: `${IMG}postcard-01.webp`, caption: "A bicycle for two", back: "Sonya rides on the frame and gives orders. I pedal. Same as always.", from: "Trinidad", date: "03.2026", shape: "wide" },
  { src: `${IMG}postcard-02.webp`, caption: "A door in Havana", back: "Blue, peeling, perfect. Sonya said «let's get married here». I said «where's here?»", from: "La Habana", date: "10.2025", shape: "tall" },
  { src: `${IMG}postcard-03.webp`, caption: "Lying down", back: "The sea is +27, we're +100. Don't call.", from: "Cayo Largo", date: "10.2025", shape: "wide" },
  { src: `${IMG}postcard-04.webp`, caption: "A coconut", back: "One for two, two straws. Timur drank more.", from: "Varadero", date: "10.2025", shape: "square" },
  { src: `${IMG}postcard-05.webp`, caption: "Son on the square", back: "They taught us in ten minutes. They lied. But it was fun.", from: "La Habana", date: "10.2025", shape: "wide" },
  { src: `${IMG}postcard-06.webp`, caption: "The pier", back: "This is where he asked. This is where I answered. Look at the water — it's turquoise, honestly.", from: "Cayo Largo", date: "10.2025", shape: "tall" },
  { src: `${IMG}postcard-07.webp`, caption: "A small plane", back: "Forty minutes, eight seats, both asleep. Woke up as bride and groom.", from: "over the sea", date: "10.2025", shape: "wide" },
  { src: `${IMG}postcard-08.webp`, caption: "Sunset", back: "Wrote nothing. Just watched.", from: "Cayo Largo", date: "10.2025", shape: "wide" },
] as const

export default function Page() {
  return (
    <div style={page} className="min-h-dvh" data-demo="wedding-cuba">
      {/* Sand panels inside the blocks: in the catalogue they're grey, the scenario sets the shade. */}
      <style href="vibeui-demo-cuba-sand" precedence="medium">
        {`[data-vibeui-block]{--vibeui-hero-026-sand:#f3e9d2;--vibeui-about-012-sand:#f3e9d2;--vibeui-event-011-sand:#f3e9d2;--vibeui-event-012-sand:#f3e9d2;--vibeui-faq-021-sand:#f3e9d2;--vibeui-cta-022-sand:#f3e9d2;}`}
      </style>
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar026
        {...light}
        background="rgb(255 250 240 / .9)"
        names="Sonya & Timur"
        brandHref="#hero"
        date="2027-02-12T09:40:00+03:00"
        daysCaption="until departure"
        daysLabels={["day", "days", "days", "today"]}
        links={[
          { label: "Route", href: "#route" },
          { label: "Three days", href: "#days" },
          { label: "Travel", href: "#travel" },
          { label: "Questions", href: "#faq" },
        ]}
        actionLabel="Check-in"
        music={`${IMG}music.mp3`}
        musicLabel="Son cubano"
        playingLabel="Playing"
        menuLabel="Menu"
        closeLabel="Close menu"
      />
      <div id="hero">
        <Hero026
          {...light}
          names="Sonya & Timur"
          script="are flying to get married"
          eyebrow="Three days in Cuba"
          dateLabel="12–14 February 2027"
          place="Cayo Largo · Havana"
          lede="Instead of a registry office — a flight. A ceremony on the beach, dinner under the palms, son cubano till morning. Fly with us."
          primaryLabel="Check-in"
          calendarLabel="Add to calendar"
          calendarTitle="Sonya and Timur's wedding in Cuba"
          image={`${IMG}hero.webp`}
          imageAlt="An empty Caribbean beach at sunset"
          photo={`${IMG}hero-couple.webp`}
          photoAlt="Sonya and Timur barefoot at the water's edge"
          countdownCaption="Until departure"
          countdownLabels={["days", "hours", "minutes", "seconds"]}
          fromCity="Moscow"
          toCity="Havana"
          passLabels={{ flight: "Flight", gate: "Gate", seat: "Seat", cabin: "Class", tear: "Tear off the stub" }}
          passValues={{ flight: "ST 1402", gate: "Beach", seat: "Front row", cabin: "Love" }}
        />
      </div>
      <div id="route">
        <About012
          {...light}
          eyebrow="Our route"
          title="Four cities to «yes»"
          lede="We met in one country, fell in love in another and decided to marry in a third. So we fly."
          stops={[
            {
              code: "MOW",
              city: "Moscow",
              date: "January 2022",
              title: "One cup of coffee",
              text: "We met on a bridge in a snowfall: Timur's hands were frozen, Sonya had a spare coffee.",
              image: `${IMG}route-01.webp`,
            },
            {
              code: "IST",
              city: "Istanbul",
              date: "May 2023",
              title: "The first layover",
              text: "Missed the connection and spent a day in the city. Realised it's better this way.",
              image: `${IMG}route-04.webp`,
            },
            {
              code: "LIS",
              city: "Lisbon",
              date: "October 2025",
              title: "Tram 28",
              text: "Sonya leaned out of the window, Timur took that shot. It's on the cover now.",
              image: `${IMG}route-02.webp`,
            },
            {
              code: "HAV",
              city: "Havana",
              date: "February 2027",
              title: "The finish — on the beach",
              text: "Here Timur asked, here Sonya answered. Here we'll marry — with you.",
              image: `${IMG}route-03.webp`,
            },
          ]}
        />
      </div>
      <div id="days">
        <Event010
          {...sand}
          eyebrow="Three days"
          title="Havana, beach, rest"
          lede="We arrive together, we leave together. In between — one evening in the city, one ceremony on the sand and one morning to sleep in."
          wearLabel="What to wear"
          days={[
            {
              day: "12",
              label: "Havana",
              note: "arrival and mojitos",
              wear: "Linen, sneakers and something against the sun",
              image: `${IMG}havana-02.webp`,
              slots: [
                { time: "14:30", title: "Arrival", place: "José Martí airport", text: "The transfer is waiting at the exit — look for the sign with our names." },
                { time: "18:00", title: "A walk", place: "Old Havana", text: "The Malecón, old cars, the first ice cream." },
                { time: "20:30", title: "Dinner on the roof", place: "the bar by the cathedral", text: "Getting to know each other. Mojitos on us." },
              ],
            },
            {
              day: "13",
              label: "Beach",
              note: "the day itself",
              wear: "Beach formal: linen, sand, no heels",
              main: true,
              image: `${IMG}beach-ceremony.webp`,
              slots: [
                { time: "09:00", title: "Flight to Cayo Largo", place: "a small plane", text: "Forty minutes over turquoise — and we're there." },
                { time: "16:30", title: "The ceremony", place: "Playa Paraíso", text: "Barefoot, facing the sea, twenty minutes." },
                { time: "18:00", title: "Dinner on the sand", place: "the long table by the water", text: "Lobster, rum, sunset and toasts." },
                { time: "21:00", title: "Son cubano", place: "same place", text: "A live band from Havana. Everyone can dance — tested." },
              ],
            },
            {
              day: "14",
              label: "Rest",
              note: "a slow morning",
              wear: "Whatever's still clean",
              image: `${IMG}beach-dinner.webp`,
              slots: [
                { time: "10:30", title: "Late breakfast", place: "the hotel terrace", text: "Coffee, papaya, swapping photos." },
                { time: "13:00", title: "The sea", place: "the hotel beach", text: "The last swim. Or the first — whichever." },
                { time: "17:00", title: "Back to Havana", place: "the plane", text: "In the evening some fly home, some stay for a week." },
              ],
            },
          ]}
        />
      </div>
      <div id="travel">
        <Event011
          {...light}
          eyebrow="Travel"
          title="What to know before departure"
          lede="Everything people ask a week before the flight — in one place. The rest is with Mariela, she's in Cuba and answers faster than we do."
          cards={[
            { icon: "plane", title: "The flight", value: "13 h 20 min", text: "A direct flight Moscow — Havana, departing 12 February at 09:40, 23 kg of luggage included." },
            { icon: "passport", title: "Visa", value: "Not needed", text: "Russians get up to 90 days visa-free. Your passport must be valid for another six months." },
            { icon: "cash", title: "Money", value: "Cash", text: "Russian bank cards don't work. Bring dollars or euros, exchange at the hotel." },
            { icon: "sim", title: "Connectivity", value: "Cubacel eSIM", text: "The internet is slow and expensive. Get an eSIM in advance or take a break from it." },
            { icon: "shield", title: "Insurance", value: "Mandatory", text: "They ask for a policy at the border. Get one for four days — costs as much as a coffee." },
            { icon: "phone", title: "Sockets", value: "110 V · type A", text: "Bring an adapter; the hotel has a hairdryer, an iron is questionable." },
          ]}
          contactName="Mariela"
          contactRole="planner in Havana, speaks Russian"
          contactLabel="Message on WhatsApp"
          contactImage={`${IMG}planner.webp`}
          checklistTitle="What to pack"
          checklistNote="tick things off — the list remembers"
          checklist={["Passport (valid 6+ months)", "Cash dollars or euros", "Insurance for 4 days", "Linen for the beach and something for the evening", "A hat, sunglasses, SPF 50", "A type A socket adapter", "Mosquito repellent", "Swimsuit — in hand luggage", "A good mood and that one song"]}
        />
      </div>
      <div id="dresscode">
        <Event012
          {...light}
          eyebrow="Dress code"
          title="Beach formal — that is, «pretty, but barefoot»"
          lede="Sand, sun and wind decide for us: linen, light, nothing complicated. The colours are from this beach."
          swatches={[
            { name: "Sand", hex: "#f3e9d2" },
            { name: "Mint", hex: "#bfe3d6" },
            { name: "Sea", hex: "#2aa7a0" },
            { name: "Coral", hex: "#ff6b57" },
            { name: "Sun", hex: "#f2c14e" },
            { name: "Ink", hex: "#123a4b" },
          ]}
          copiedLabel="copied"
          looks={[
            { who: "For her", title: "Linen, midi, flat soles", text: "A dress or a jumpsuit in sand, mint or coral. Heels will sink — sandals or barefoot.", image: `${IMG}look-her.webp` },
            { who: "For him", title: "An untucked shirt, light trousers", text: "Linen or cotton, sleeves rolled up. No jacket needed, a hat — very much so.", image: `${IMG}look-him.webp` },
          ]}
          rules={[
            { icon: "sun", text: "The ceremony is at 16:30 — the sun is still high. A hat, sunglasses, cream." },
            { icon: "sand", text: "The sand is fine and hot: shoes come off at the beach entrance." },
            { icon: "wind", text: "By evening there's a wind from the sea — a light shirt or a shawl will come in handy." },
          ]}
        />
      </div>
      <div id="place">
        <Map008
          {...sand}
          eyebrow="Where"
          title="Cayo Largo and Havana"
          lede="Two places, one island. We land in Havana, on the second day — forty minutes on a small plane to the beach."
          points={[
            { code: "CYO", title: "The hotel on Cayo Largo", text: "Bungalows by the water, all the rooms are ours for two nights", latitude: 21.6098, longitude: -81.5476 },
            { code: "PLY", title: "Playa Paraíso", text: "The ceremony and dinner, 10 minutes on foot from the hotel", latitude: 21.6245, longitude: -81.5628 },
            { code: "HAV", title: "Havana, a hotel in the old town", text: "The first and last night, next to the Malecón", latitude: 23.1375, longitude: -82.3546 },
          ]}
          image={`${IMG}hotel.webp`}
          imageAlt="White bungalows with turquoise doors and hammocks between the palms"
          imageCaption="our hotel on Cayo Largo"
          transferTitle="Transfers are on us"
          transferText="From the airport to the hotel, between Havana and Cayo Largo, back to the airport. Look for Mariela with a sign."
          openLabel="Open in Yandex Maps"
        />
      </div>
      <div id="checkin">
        <Contact019
          {...sand}
          eyebrow="Check-in"
          title="Check in for the flight"
          greeting="{name}, welcome aboard"
          lede="Five questions — and we know when to meet you, where to put you up and what to cook for you. Please reply {deadline}."
          deadline="by 1 December"
          stepLabels={["Flying?", "Dates", "Hotel", "Menu", "Song"]}
          menu={[
            { value: "fish", label: "Fish and lobster" },
            { value: "chicken", label: "Chicken" },
            { value: "veg", label: "Vegetarian" },
          ]}
          summaryTitle="Boarding pass"
          submitLabel="Check in"
          thanksTitle="You're on board"
          thanksText="Your answer is saved. Mariela will write two weeks before departure with the transfer details."
          stampLabel="Checked in"
          labels={{
            whoText: "How to put you on the passenger list and whether you can make the flight.",
            nameLabel: "First and last name — as in your passport",
            namePlaceholder: "Olga Smirnova",
            comingYes: "I'm flying!",
            comingNo: "I can't make it",
            datesText: "When to meet you in Havana and when to see you off.",
            arriveLabel: "Arrival",
            arrivePlaceholder: "12 February",
            departLabel: "Departure",
            departPlaceholder: "15 February",
            flightLabel: "Flight number, if you have it",
            flightPlaceholder: "SU 1402",
            hotelText: "We hold rooms in Havana and on Cayo Largo at our rate — or stay wherever you like.",
            hotelHelp: "Book for me",
            hotelOwn: "I'll find my own place",
            companionsLabel: "Who are you flying with",
            companionsPlaceholder: "With a partner, with a 6-year-old…",
            menuText: "Dinner on the beach is cooked in advance — choose the main.",
            allergies: "Allergies and restrictions",
            allergiesPlaceholder: "Seafood, nuts…",
            songText: "The song you'll get up and dance to on the sand — we'll pass it to the band.",
            songLabel: "Artist — title",
            songPlaceholder: "Buena Vista Social Club — Chan Chan",
            wishLabel: "A few words for us",
            wishPlaceholder: "Optional, but nice",
            back: "← Back",
            next: "Next →",
            summaryPassenger: "Passenger",
            summaryStatus: "Status",
            flying: "flying",
            notFlying: "not flying",
            summaryDates: "Dates",
            summaryFlight: "Flight",
            summaryHotel: "Hotel",
            hotelBooking: "we're booking",
            hotelOwnShort: "own",
            summaryMenu: "Menu",
            summarySong: "Song",
          }}
        />
      </div>
      <div id="faq">
        <Faq021
          {...light}
          eyebrow="Questions"
          title="Asked before departure"
          lede="We collected everything people wrote to us over the past month. No answer — Mariela is in touch."
          items={[
            { tag: "visa", question: "Do I need a visa?", answer: "No. Russians get up to 90 days visa-free, you only need a passport valid for six months after the trip." },
            { tag: "money", question: "How to pay?", answer: "In cash: dollars or euros, exchange a little at a time at the hotel. Our banks' cards don't work, nor does Apple Pay." },
            { tag: "connectivity", question: "Will there be internet?", answer: "Slow and mostly at the hotel. Get a Cubacel eSIM in advance — or take a three-day break from it." },
            { tag: "sun", question: "How hot is it?", answer: "February is the best month: +28° by day, +21° in the evening, almost no rain. SPF 50 and a hat are a must." },
            { tag: "sea", question: "Can we swim after the ceremony?", answer: "You must. Dinner starts at 18:00, between the ceremony and dinner — the sea and the sunset." },
            { tag: "children", question: "Can we bring children?", answer: "Yes. The beach is safe and shallow, the hotel has cots. Put the ages in the form." },
            { tag: "flight", question: "How long is the flight?", answer: "A direct flight is about 13 hours. There are options via Istanbul with a layover, but we're flying direct." },
            { tag: "gifts", question: "What to bring as a gift?", answer: "Yourself and a tan. If you'd like — a contribution to our next flight, the details are in the «Gifts» section. Flowers won't survive the flight." },
          ]}
          askText="Didn't find the answer?"
          askLabel="Write to Mariela"
        />
      </div>
      <div id="postcards">
        <Portfolio009
          {...sand}
          eyebrow="Postcards"
          title="What we wrote to you"
          lede="From every trip we sent each other postcards — even when sitting side by side. Flip any of them."
          cards={POSTCARDS}
          addressee="To our dear guests"
        />
      </div>
      <div id="gifts">
        <Cta022
          {...light}
          eyebrow="Gifts"
          title="The best gift is you in Cuba"
          lede="Honestly: you've already spent on the ticket. If you still want to — we're saving for the next flight. Where to — undecided, hence the question mark on the ticket."
          fundTitle="For the next flight"
          fundText="A transfer by phone number. In the comment — your name and, if you like, where we should fly."
          fromCity="Havana"
          toCity="we'll decide together"
          requisiteLabel="Transfer · Timur K."
          copyLabel="Copy the number"
          copiedLabel="Copied"
          joke="Or bring a bottle of rum — we don't have any in Cuba. Joke. We do."
        />
      </div>
      <div id="wishes">
        <Testimonials021
          {...sand}
          eyebrow="Postcards"
          title="Write us a postcard"
          lede="We'll collect the real ones on the beach. But this wall already works — and everyone who's flying will see it."
          cards={[
            { name: "Olya and Sasha", from: "Moscow", text: "Tickets bought, hats too. See you on the pier — just don't be late for your own wedding." },
            { name: "Grandma Vera", from: "Kazan", text: "Timur, it's my first time flying across the ocean. Sonya, I'm flying for you. Buy me rum." },
            { name: "Dima", from: "Berlin", text: "Flying in via Istanbul, like you did back then. If I get stuck for a day — you know whose fault it is." },
            { name: "Mariela", from: "Havana", text: "Everything's ready, the sea is warm, the band is rehearsing. ¡Hasta la boda!" },
            { name: "Kristina", from: "Petersburg", text: "Leave approved, tan planned. Already picked the song — Chan Chan, of course." },
          ]}
          formTitle="Send a postcard"
          nameLabel="Who's writing"
          fromLabel="From where"
          fromPlaceholder="Moscow"
          textLabel="Postcard text"
          submitLabel="Send"
          sentLabel="sent"
        />
      </div>
      <div id="footer">
        <Footer025
          {...light}
          background="#123a4b"
          ink="#fffaf0"
          names="Sonya & Timur"
          hashtag="#sonyatimurfly"
          links={[
            { label: "Route", href: "#route" },
            { label: "Three days", href: "#days" },
            { label: "Travel", href: "#travel" },
            { label: "Check-in", href: "#checkin" },
            { label: "Questions", href: "#faq" },
          ]}
          rsvpText="Check-in is open"
          rsvpLabel="until 1 December"
        />
      </div>
    </div>
  )
}
