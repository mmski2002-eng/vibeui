import type { CSSProperties } from "react"

import { Navbar023 } from "@/registry/blocks/navbar/navbar-023/navbar-023"
import { Hero023 } from "@/registry/blocks/hero/hero-023/hero-023"
import { About009 } from "@/registry/blocks/about/about-009/about-009"
import { Event005 } from "@/registry/blocks/events/event-005/event-005"
import { Event006 } from "@/registry/blocks/events/event-006/event-006"
import { People008 } from "@/registry/blocks/team/people-008/people-008"
import { Event007 } from "@/registry/blocks/events/event-007/event-007"
import { Pricing021 } from "@/registry/blocks/pricing/pricing-021/pricing-021"
import { Map006 } from "@/registry/blocks/map/map-006/map-006"
import { Faq018 } from "@/registry/blocks/faq/faq-018/faq-018"
import { Cta019 } from "@/registry/blocks/cta/cta-019/cta-019"
import { Footer022 } from "@/registry/blocks/footer/footer-022/footer-022"

/**
 * English version of the "City festival" demo: same blocks and theme as
 * `app/scenarios/festival/demo/page.tsx`, text in English via props.
 *
 * A white page, a giant black headline and coloured capsules for the
 * tracks — twelve colours on white. Twelve blocks from the catalogue's
 * shared groups. A showcase of the result, not a template.
 */
export const metadata = {
  title: "Three Days of the City — a festival of music, food and talks in Ostrov Park",
  description:
    "VibeUI «City festival» scenario demo: programme, schedule by day, line-up, venues, tickets, map and questions. A white page with coloured capsules.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#ffffff",
  color: "#111111",
  fontFamily: '"Inter",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the lime accent.
const light = { tone: "light", accent: "#d3f43a" } as const

const P = "/demo/festival"

export default function Page() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar023
        {...light}
        brand="threedays"
        brandHref="#hero"
        markLabel="t"
        links={[
          { label: "Programme", href: "#program", color: "#ffe2d6" },
          { label: "Schedule", href: "#schedule", color: "#c2df37" },
          { label: "Line-up", href: "#lineup", color: "#9854d1" },
          { label: "Venues", href: "#venues", color: "#464dff" },
          { label: "Questions", href: "#faq", color: "#ffa5b1" },
        ]}
        navLabel="Site sections"
        actionLabel="Tickets"
        menuLabel="Menu"
        closeLabel="Close"
      />
      <div id="hero">
        <Hero023
          {...light}
          title="Three days of the city*.*"
          meta="22–24 August · Ostrov Park · entry by ticket, plus free zones"
          tagsLabel="What's on"
          tags={[
            { label: "#Music", color: "#ffe2d6", emoji: "🎸", href: "#program" },
            { label: "#Food", color: "#c2df37", emoji: "🌮", href: "#program" },
            { label: "#Talks", color: "#f1ddbc", emoji: "🎙️", href: "#program" },
            { label: "#Kids", color: "#9854d1", ink: "#fff", emoji: "🪁", href: "#program" },
            { label: "#Market", color: "#006461", ink: "#fff", emoji: "🧶", href: "#program" },
            { label: "#Cinema", color: "#f3c37d", emoji: "🎬", href: "#program" },
            { label: "#Sport", color: "#ffa5b1", emoji: "🏀", href: "#program" },
            { label: "#Night", color: "#122378", ink: "#fff", emoji: "🌙", href: "#program" },
            { label: "#Theatre", color: "#d9cafe", emoji: "🎭", href: "#program" },
            { label: "#City", color: "#464dff", ink: "#fff", emoji: "🚲", href: "#program" },
            { label: "#Workshops", color: "#fdb084", emoji: "✂️", href: "#program" },
            { label: "#Morning", color: "#98f5af", emoji: "🧘", href: "#program" },
          ]}
        />
      </div>
      <div id="about">
        <About009
          {...light}
          label="Hello"
          text="For three days in August, Ostrov Park becomes *a city within the city*: stages, kitchens, a lecture tent, a market and open-air cinema. Half the programme is _free_, the rest — one ticket for everything."
          note="The festival is made by the townspeople: 140 volunteers, 60 local projects and eight neighbourhood communities. We're not about TV headliners, we're about what's nearby."
          facts={[
            { value: "3", label: "days", color: "#c2df37" },
            { value: "6", label: "stages and venues", color: "#ffe2d6" },
            { value: "120+", label: "events", color: "#d9cafe" },
            { value: "48%", label: "of the programme is free", color: "#98f5af" },
            { value: "0+", label: "children under 7 — free entry", color: "#f3c37d" },
          ]}
          linkLabel="About the festival and the team →"
        />
      </div>
      <div id="program">
        <Event005
          {...light}
          eyebrow="Programme"
          title="What's happening at the venues"
          items={[
            { title: "Opening: an orchestra on the water and a confetti salute", image: `${P}/event-01.webp`, tag: "#Music", tagColor: "#ffe2d6", stage: "Main stage", time: "Fri, 20:00", href: "#" },
            { title: "Food row: 24 kitchens of the city", image: `${P}/event-02.webp`, tag: "#Food", tagColor: "#c2df37", stage: "Food court", time: "all days, 12:00–23:00", badge: "Free", href: "#" },
            { title: "The Big Picture: painting a 30-metre canvas", image: `${P}/event-03.webp`, tag: "#Kids", tagColor: "#9854d1", tagInk: "#fff", stage: "Kids' meadow", time: "Sat, 11:00", badge: "0+", href: "#" },
            { title: "How the city hears: a talk on the sound of streets", image: `${P}/event-04.webp`, tag: "#Talks", tagColor: "#f1ddbc", stage: "Lecture tent", time: "Sat, 15:00", badge: "Free", href: "#" },
            { title: "Market of local brands and ceramics", image: `${P}/event-05.webp`, tag: "#Market", tagColor: "#006461", tagInk: "#fff", stage: "The alley", time: "Sat–Sun, 12:00–21:00", href: "#" },
            { title: "Cinema under the sky: shorts about the city", image: `${P}/event-06.webp`, tag: "#Cinema", tagColor: "#f3c37d", stage: "Embankment", time: "Sat, 21:30", href: "#" },
            { title: "Morning yoga on the embankment", image: `${P}/event-07.webp`, tag: "#Morning", tagColor: "#98f5af", stage: "Embankment", time: "Sat–Sun, 08:00", badge: "Free", href: "#" },
            { title: "Silent disco: three DJs in headphones", image: `${P}/event-08.webp`, tag: "#Night", tagColor: "#122378", tagInk: "#fff", stage: "Dance floor", time: "Sat, 23:00", badge: "18+", href: "#" },
          ]}
          pick={{ label: "Pick of the day", image: `${P}/pick.webp`, title: "Night concert on the water: a stage in the middle of the pond", date: "Saturday, 22:00 · Main stage", actionLabel: "To the event →", href: "#" }}
          moreLabel="Full programme →"
        />
      </div>
      <div id="schedule">
        <Event006
          {...light}
          eyebrow="Schedule"
          title="By day and venue"
          days={[
            { key: "fri", label: "Friday", date: "22 Aug", color: "#ffa5b1" },
            { key: "sat", label: "Saturday", date: "23 Aug", color: "#c2df37" },
            { key: "sun", label: "Sunday", date: "24 Aug", color: "#464dff", ink: "#fff" },
          ]}
          slots={[
            { day: "fri", time: "18:00", title: "Venues open, food court and market", stage: "All venues", tag: "#Food", tagColor: "#c2df37", note: "Free" },
            { day: "fri", time: "20:00", title: "Orchestra on the water and a confetti salute", stage: "Main stage", tag: "#Music", tagColor: "#ffe2d6" },
            { day: "fri", time: "22:00", title: "DJ set on the embankment", stage: "Embankment", tag: "#Night", tagColor: "#122378", tagInk: "#fff", note: "18+" },
            { day: "sat", time: "08:00", title: "Yoga on the embankment", stage: "Embankment", tag: "#Morning", tagColor: "#98f5af", note: "Free" },
            { day: "sat", time: "11:00", title: "The Big Picture: a 30-metre canvas", stage: "Kids' meadow", tag: "#Kids", tagColor: "#9854d1", tagInk: "#fff", note: "0+" },
            { day: "sat", time: "13:00", title: "Workshop: pasta from the neighbourhood chefs", stage: "Food court", tag: "#Food", tagColor: "#c2df37" },
            { day: "sat", time: "15:00", title: "How the city hears: a talk on the sound of streets", stage: "Lecture tent", tag: "#Talks", tagColor: "#f1ddbc", note: "Free" },
            { day: "sat", time: "17:30", title: "Street theatre: «A Streetcar Named Desire» on wheels", stage: "The alley", tag: "#Theatre", tagColor: "#d9cafe" },
            { day: "sat", time: "20:00", title: "Headliner: Sonya Volna and orchestra", stage: "Main stage", tag: "#Music", tagColor: "#ffe2d6" },
            { day: "sat", time: "21:30", title: "Cinema under the sky: shorts about the city", stage: "Embankment", tag: "#Cinema", tagColor: "#f3c37d" },
            { day: "sat", time: "23:00", title: "Silent disco in headphones", stage: "Dance floor", tag: "#Night", tagColor: "#122378", tagInk: "#fff", note: "18+" },
            { day: "sun", time: "10:00", title: "Bike parade along the embankment", stage: "City", tag: "#City", tagColor: "#464dff", tagInk: "#fff", note: "Free" },
            { day: "sun", time: "12:00", title: "Workshop: ceramics in an hour", stage: "The alley", tag: "#Workshops", tagColor: "#fdb084" },
            { day: "sun", time: "14:00", title: "Discussion: who owns the courtyard", stage: "Lecture tent", tag: "#Talks", tagColor: "#f1ddbc", note: "Free" },
            { day: "sun", time: "16:00", title: "Roller jam and training", stage: "Embankment", tag: "#Sport", tagColor: "#ffa5b1" },
            { day: "sun", time: "19:00", title: "Closing: the city's combined choir", stage: "Main stage", tag: "#Music", tagColor: "#ffe2d6" },
          ]}
          allLabel="All tracks"
          emptyText="Nothing on that day for the chosen track — check the next one."
          daysLabel="Festival days"
          filtersLabel="Tracks"
        />
      </div>
      <div id="lineup">
        <People008
          {...light}
          eyebrow="Line-up"
          title="Who takes the stages"
          people={[
            { name: "Sonya Volna", role: "singer, headliner", image: `${P}/speaker-01.webp`, color: "#ffe2d6", tag: "#Music", when: "Sat, 20:00 · Main stage", text: "The album «Suburb» became the soundtrack of last summer. At the festival — with a forty-piece orchestra.", href: "#" },
            { name: "Marat Gusev", role: "chef, «Dvor»", image: `${P}/speaker-02.webp`, color: "#c2df37", tag: "#Food", when: "Sat, 13:00 · Food court", text: "Cooks with what grows within a hundred kilometres. At the festival he runs a pasta workshop.", href: "#" },
            { name: "Vera Lanskaya", role: "architect, urbanist", image: `${P}/speaker-03.webp`, color: "#d9cafe", tag: "#Talks", when: "Sun, 14:00 · Lecture tent", text: "Author of the embankment project the festival stands on. A discussion on who owns the courtyard.", href: "#" },
            { name: "Yan Roshchin", role: "DJ, «Night»", image: `${P}/speaker-04.webp`, color: "#464dff", ink: "#fff", tag: "#Night", when: "Fri, 22:00 · Embankment", text: "Resident of clubs in three cities. Opens the night programme with a set on the water.", href: "#" },
            { name: "Lera Pak", role: "illustrator", image: `${P}/speaker-05.webp`, color: "#f3c37d", tag: "#Kids", when: "Sat, 11:00 · Kids' meadow", text: "Draws children's books and murals for courtyards. Runs «The Big Picture» — a thirty-metre canvas.", href: "#" },
            { name: "Daniil Orlov", role: "director", image: `${P}/speaker-06.webp`, color: "#98f5af", tag: "#Cinema", when: "Sat, 21:30 · Embankment", text: "Curator of the shorts programme about the city: nine films in an hour and a half.", href: "#" },
          ]}
          moreLabel="All participants →"
        />
      </div>
      <div id="venues">
        <Event007
          {...light}
          eyebrow="Venues"
          title="Six points on the park map"
          lede="No more than seven minutes on foot between any two. Water, toilets and signage everywhere."
          venues={[
            { name: "Main stage", text: "A stage on pontoons in the middle of the pond, the audience on the slope and on the water.", image: `${P}/venue-01.webp`, color: "#c2df37", facts: ["4 000 seats", "live screens", "rain canopy"], tags: ["#Music", "#Night"], href: "#" },
            { name: "Food court", text: "Long tables under umbrellas, 24 kitchens and a bar with local breweries.", image: `${P}/venue-02.webp`, color: "#ffe2d6", facts: ["12:00–23:00", "cashless", "vegan row"], tags: ["#Food", "#Workshops"], href: "#" },
            { name: "Lecture tent", text: "A white tent with open walls: talks, discussions and cinema in the daytime.", image: `${P}/venue-03.webp`, color: "#d9cafe", facts: ["300 seats", "sign language", "free"], tags: ["#Talks", "#Cinema"], href: "#" },
            { name: "Kids' meadow", text: "An inflatable town, workshops and a quiet zone for the littlest.", image: `${P}/venue-04.webp`, color: "#98f5af", facts: ["0+", "changing tables", "entertainers"], tags: ["#Kids", "#Workshops"], href: "#" },
          ]}
        />
      </div>
      <div id="tickets">
        <Pricing021
          {...light}
          eyebrow="Tickets"
          title="One wristband — all the stages"
          lede="Presale until 1 August. Half the programme is free: the food court, the market, the lecture tent and morning sessions are open to all."
          tickets={[
            { name: "One day", text: "Any of the three days.", price: 1500, oldPrice: 1900, color: "#ffe2d6", features: ["All stages and venues of the day", "Lecture tent and cinema", "Kids' meadow with a child"], actionLabel: "Buy for a day", actionHref: "#" },
            { name: "All three days", text: "One wristband for the whole festival.", price: 3200, oldPrice: 4500, color: "#c2df37", featured: true, note: "30% better value", features: ["All stages and venues", "Night programme 18+", "Priority entry in the mornings", "10% off at the food court"], actionLabel: "Buy for everything", actionHref: "#" },
            { name: "Family", text: "Two adults and children under 14.", price: 5000, oldPrice: 6400, color: "#464dff", ink: "#fff", features: ["All three days for the whole family", "Kids' meadow and workshops", "Quiet zone and changing tables", "Parking by the entrance"], actionLabel: "Buy family", actionHref: "#" },
          ]}
          counterLabel="Tickets"
          freeNote="Children under 7 — free with any ticket. Refunds until 15 August, no questions asked."
          lessLabel="Fewer"
          moreLabel="More"
        />
      </div>
      <div id="map">
        <Map006
          {...light}
          eyebrow="How to get there"
          title="Ostrov Park, three entrances"
          address="9 Krymsky Val · entrance No. 1 by the metro, No. 2 from the embankment, No. 3 from the bridge"
          points={[
            { name: "Main stage", latitude: 55.7467, longitude: 37.6178, color: "#c2df37" },
            { name: "Food court", latitude: 55.7455, longitude: 37.6205, color: "#ffa5b1" },
            { name: "Lecture tent", latitude: 55.7478, longitude: 37.6215, color: "#9854d1" },
            { name: "Kids' meadow", latitude: 55.7448, longitude: 37.6165, color: "#98f5af" },
            { name: "Embankment", latitude: 55.744, longitude: 37.623, color: "#464dff" },
          ]}
          routes={[
            { mode: "Metro", text: "Park Kultury, 7 minutes on foot to entrance No. 1", emoji: "🚇", color: "#ffe2d6" },
            { mode: "Bus", text: "B, 10, 79 — the Krymsky Most stop", emoji: "🚌", color: "#d9cafe" },
            { mode: "Bike", text: "600 parking spots at every entrance, rental on the embankment", emoji: "🚲", color: "#c2df37" },
            { mode: "Car", text: "No parking at the park — leave it at the park-and-ride by the metro", emoji: "🚗", color: "#f1ddbc" },
          ]}
          routesLabel="Getting there"
          openLabel="Open in Yandex Maps"
          legendLabel="Venues"
        />
      </div>
      <div id="faq">
        <Faq018
          {...light}
          eyebrow="Questions"
          title="What people ask before the festival"
          items={[
            { question: "Can I come with children?", answer: "Yes. Children under 7 get in free with any ticket, the Kids' meadow has entertainers and workshops from 11:00 to 19:00, plus a quiet zone and changing tables.", color: "#98f5af" },
            { question: "What's free and what's ticketed?", answer: "The food court, the market, the lecture tent, morning yoga and the bike parade are open to all. The stages, cinema and night programme — by wristband.", color: "#c2df37" },
            { question: "What if it rains?", answer: "The main stage and the lecture tent are under canopies, the food court under umbrellas. Cancellation only in case of a storm warning — then tickets are refunded in full.", color: "#464dff" },
            { question: "Can I bring my own food and water?", answer: "Water in plastic bottles — yes, and every venue has free drinking fountains. Food and glass — no.", color: "#ffe2d6" },
            { question: "How do I return a ticket?", answer: "Until 15 August — in full, through your account in a minute. Later — only by passing the wristband to another person.", color: "#ffa5b1" },
            { question: "Are dogs allowed?", answer: "On a lead and with water for the dog — yes, except the main stage zone after 20:00: it's loud there.", color: "#f3c37d" },
            { question: "Is it accessible?", answer: "All entrances are step-free, there are wheelchair zones by the stages, the lecture tent has sign language interpretation. A companion enters free.", color: "#9854d1" },
            { question: "Where to park?", answer: "There's no parking at the park. Leave the car at the park-and-ride by Park Kultury metro or come by bike — there are racks at every entrance.", color: "#d9cafe" },
          ]}
          askText="Didn't find the answer?"
          askLabel="Message us on Telegram"
        />
      </div>
      <div id="cta">
        <Cta019 {...light} eyebrow="To be continued" label="22–24 August" secondaryLabel="Programme" primaryLabel="Buy a ticket →" />
      </div>
      <div id="footer">
        <Footer022
          {...light}
          brand="threedays"
          columns={[
            { title: "Festival", links: [{ label: "Programme", href: "#program" }, { label: "Schedule", href: "#schedule" }, { label: "Line-up", href: "#lineup" }, { label: "Venues", href: "#venues" }] },
            { title: "Tickets", links: [{ label: "Buy", href: "#tickets" }, { label: "Refunds", href: "#faq" }, { label: "Families", href: "#tickets" }, { label: "Promo codes", href: "#" }] },
            { title: "Guests", links: [{ label: "How to get there", href: "#map" }, { label: "Rules", href: "#" }, { label: "Accessibility", href: "#faq" }, { label: "Lost and found", href: "#" }] },
            { title: "Partners", links: [{ label: "Become a participant", href: "#" }, { label: "Food court and market", href: "#" }, { label: "Sponsorship", href: "#" }, { label: "Press", href: "#" }] },
            { title: "Team", links: [{ label: "About the festival", href: "#about" }, { label: "Volunteers", href: "#" }, { label: "Jobs", href: "#" }, { label: "Contacts", href: "#" }] },
          ]}
          socials={[
            { kind: "telegram", label: "Telegram", href: "https://t.me/" },
            { kind: "vk", label: "VK", href: "https://vk.com/" },
            { kind: "youtube", label: "YouTube", href: "https://youtube.com/" },
            { kind: "instagram", label: "Instagram", href: "https://instagram.com/" },
          ]}
          legal="Organiser — the City Weekends non-profit. Age ratings are shown next to each event. © 2026."
        />
      </div>
    </div>
  )
}
