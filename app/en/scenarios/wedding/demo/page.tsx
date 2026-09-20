import type { CSSProperties } from "react"

import { Navbar025 } from "@/registry/blocks/navbar/navbar-025/navbar-025"
import { Hero025 } from "@/registry/blocks/hero/hero-025/hero-025"
import { About011 } from "@/registry/blocks/about/about-011/about-011"
import { Event008 } from "@/registry/blocks/events/event-008/event-008"
import { Event009 } from "@/registry/blocks/events/event-009/event-009"
import { Map007 } from "@/registry/blocks/map/map-007/map-007"
import { Contact018 } from "@/registry/blocks/contact/contact-018/contact-018"
import { Faq020 } from "@/registry/blocks/faq/faq-020/faq-020"
import { Portfolio008 } from "@/registry/blocks/portfolio/portfolio-008/portfolio-008"
import { People010 } from "@/registry/blocks/team/people-010/people-010"
import { Cta021 } from "@/registry/blocks/cta/cta-021/cta-021"
import { Testimonials020 } from "@/registry/blocks/testimonials/testimonials-020/testimonials-020"
import { Footer024 } from "@/registry/blocks/footer/footer-024/footer-024"

/**
 * English version of the "Wedding invitation" demo: same blocks and theme
 * as `app/scenarios/wedding/demo/page.tsx`, text in English.
 *
 * A cream page, plum ink, a terracotta accent, Cormorant Garamond + Manrope.
 * An envelope with a seal at the entrance, a countdown, a five-step RSVP,
 * a dress code as a palette, a gallery and a wall of wishes. Thirteen
 * blocks. A showcase of the result, not a template.
 */
export const metadata = {
  title: "Vasilisa and Artem — 5 September 2027, Marfino Estate",
  description:
    "VibeUI «Wedding invitation» scenario demo: an envelope with a seal, a countdown, the couple's story, the day's programme, a dress code, a map, an RSVP form, a gallery, gifts and a wall of wishes.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f6f1e8",
  color: "#2b1a24",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const light = { tone: "light", background: "#f6f1e8", ink: "#2b1a24", accent: "#b8552f" } as const
// Alternating sections on lighter paper.
const paper = { ...light, background: "#fffaf3" } as const

const GALLERY = [
  {
    src: "/demo/wedding/gallery-01.webp",
    caption: "Sunday morning",
    shape: "arch",
  },
  { src: "/demo/wedding/gallery-02.webp", caption: "The park, May" },
  {
    src: "/demo/wedding/gallery-03.webp",
    caption: "Under one umbrella",
    shape: "tall",
  },
  { src: "/demo/wedding/gallery-04.webp", caption: "Picnic" },
  { src: "/demo/wedding/gallery-05.webp", caption: "The lift", shape: "arch" },
  { src: "/demo/wedding/gallery-06.webp", caption: "The embankment" },
  { src: "/demo/wedding/gallery-07.webp", caption: "Ice cream", shape: "tall" },
  { src: "/demo/wedding/gallery-08.webp", caption: "Rain outside the window" },
] as const

export default function Page() {
  return (
    <div style={page} className="min-h-dvh" data-demo="wedding">
      {/* Headings in plum: in the catalogue the blocks draw them in ink, the scenario sets the shade. */}
      <style href="vibeui-demo-wedding-plum" precedence="medium">
        {`[data-vibeui-block]{--vibeui-navbar-025-plum:#4a1f36;--vibeui-hero-025-plum:#4a1f36;--vibeui-about-011-plum:#4a1f36;--vibeui-event-008-plum:#4a1f36;--vibeui-event-009-plum:#4a1f36;--vibeui-map-007-plum:#4a1f36;--vibeui-contact-018-plum:#4a1f36;--vibeui-faq-020-plum:#4a1f36;--vibeui-portfolio-008-plum:#4a1f36;--vibeui-people-010-plum:#4a1f36;--vibeui-cta-021-plum:#4a1f36;--vibeui-testimonials-020-plum:#4a1f36;}`}
      </style>
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar025
        {...light}
        background="rgb(246 241 232 / .85)"
        monogram="V & A"
        brandHref="#hero"
        daysLabels={["day", "days", "days", "today"]}
        links={[
          { label: "Story", href: "#story" },
          { label: "Programme", href: "#program" },
          { label: "Venue", href: "#place" },
          { label: "Questions", href: "#faq" },
        ]}
        actionLabel="RSVP"
        date="2027-09-05T15:00:00+03:00"
        music="/demo/wedding/music.mp3"
        musicLabel="Our music"
        playingLabel="Playing"
        menuLabel="Menu"
        closeLabel="Close menu"
      />
      <div id="hero">
        <Hero025
          {...light}
          names="Vasilisa & Artem"
          eyebrow="You're invited to our wedding"
          dateLabel="5 September 2027, Saturday"
          place="Marfino Estate"
          lede="We're getting married and want to celebrate it with you — intimately, under the open sky, with a long dinner and dancing until the sparklers."
          primaryLabel="Confirm attendance"
          calendarLabel="Add to calendar"
          calendarTitle="Vasilisa and Artem's wedding"
          calendarLocation="Marfino Estate, Moscow region"
          countdownLabels={["days", "hours", "minutes", "seconds"]}
          sealHint="Press the seal"
          envelopeLabel="To our dear guests"
          image="/demo/wedding/hero.webp"
          imageAlt="Vasilisa and Artem on an autumn street"
        />
      </div>
      <div id="story">
        <About011
          {...light}
          eyebrow="Our story"
          title="Six years, four frames"
          lede="We don't like long stories about ourselves, so — briefly and in frames. We'll tell the rest at the table."
          prevLabel="Back"
          nextLabel="Next"
          frames={[
            {
              date: "October 2021",
              title: "Coffee by the window",
              text: "We met in a coffee queue: Artem took her cup, Vasilisa took his. We swapped back after half an hour of talking.",
              image: "/demo/wedding/story-01.webp",
            },
            {
              date: "July 2022",
              title: "The first road trip",
              text: "Two thousand kilometres south, a map on the knees and one playlist for two.",
              image: "/demo/wedding/story-02.webp",
            },
            {
              date: "March 2024",
              title: "Boxes",
              text: "We moved in together. The first dinner in the new flat — pizza on the floor among the boxes.",
              image: "/demo/wedding/story-03.webp",
            },
            {
              date: "May 2027",
              title: "The pier at sunset",
              text: "Artem went down on one knee, Vasilisa said «yes» before the question.",
              image: "/demo/wedding/story-04.webp",
            },
          ]}
        />
      </div>
      <div id="program">
        <Event008
          {...light}
          eyebrow="The day's programme"
          title="How 5 September will go"
          lede="One day, one place, no moving around. Come by three — and stay until the sparklers."
          steps={[
            { time: "15:00", title: "Guests arrive", place: "the terrace", text: "Lemonade, homemade kvass and the first hugs. Time to find your place card.", icon: "glass" },
            { time: "16:00", title: "The ceremony", place: "the garden pavilion", text: "Twenty minutes in the shade of the lindens. You can keep your phones out — but better to watch with your eyes.", icon: "rings" },
            { time: "17:00", title: "Dinner", place: "the long table on the terrace", text: "Family dishes on shared plates, toasts if you like, no toastmaster.", icon: "dinner" },
            { time: "20:00", title: "Dancing", place: "the lawn", text: "The first dance is ours, then — by your requests from the form.", icon: "music" },
            { time: "23:00", title: "Sparklers", place: "by the pond", text: "Sparklers to say goodbye. The transfer to the city — at 23:30.", icon: "sparkles" },
          ]}
          asideTitle="What to bring"
          asideItems={["A warm jumper — it's cool by the pond in the evening", "Comfortable shoes: lawn and gravel", "A good mood and that one song"]}
        />
      </div>
      <div id="dresscode">
        <Event009
          {...paper}
          eyebrow="Dress code"
          title="Warm neutrals — and something of your own"
          lede="We're not asking for a uniform. We'd just like everyone in the photos to look like one company in one light — here's a palette to start from."
          swatches={[
            { name: "Cream", hex: "#f1e8d8" },
            { name: "Sand", hex: "#d9c5a5" },
            { name: "Sage", hex: "#8a9a7b" },
            { name: "Terracotta", hex: "#b8552f" },
            { name: "Plum", hex: "#4a1f36" },
          ]}
          hint="Tap a colour — the code is copied, show it in the shop."
          copiedLabel="copied"
          looks={[
            { who: "For her", title: "A mid-calf dress, linen or silk", text: "Any length and any colour from the palette. A heel will sink into the lawn — better a flat sole or a block." },
            { who: "For him", title: "A shirt, trousers, jacket optional", text: "A linen shirt in sand or sage, darker trousers. No tie needed, sneakers are fine." },
          ]}
          avoidTitle="Better to avoid"
          avoidItems={["White and ivory — we'll leave those to Vasilisa", "Big prints and neon: they argue with the light", "Stilettos — gravel and grass"]}
        />
      </div>
      <div id="place">
        <Map007
          {...light}
          eyebrow="Venue"
          title="Marfino Estate, Moscow region"
          venue="Marfino Estate"
          address="Moscow region, Mytishchi district, Marfino village"
          timeNote="Guests arrive at 15:00"
          image="/demo/wedding/venue-01.webp"
          imageAlt="The alley and the house of Marfino Estate"
          ways={[
            { mode: "By car", text: "45 minutes from the ring road along Dmitrovskoye highway. Parking at the estate gates, free.", icon: "car" },
            { mode: "Transfer", text: "A bus from Altufyevo metro at 13:30 and 14:15, back at 23:30. Tick it in the form — we'll keep a seat.", icon: "bus" },
            { mode: "Taxi", text: "From the centre — about 2 500 ₽. The «Marfino Estate, main gates» point is in every app.", icon: "taxi" },
          ]}
          waysTitle="How to get there"
          stays={[
            { name: "The Lindens guest house", text: "5 minutes on foot, 12 rooms, say you're with us — they'll include breakfast", href: "#" },
            { name: "Marfino Park hotel", text: "10 minutes by car, a pool and a sauna for the morning after", href: "#" },
          ]}
          staysTitle="Where to stay"
          staysNote="We've reserved a few rooms until 1 August — write to Polina if you'd like to stay."
          openLabel="Open in Yandex Maps"
        />
      </div>
      <div id="rsvp">
        <Contact018
          {...paper}
          eyebrow="RSVP"
          title="Tell us you're coming"
          greeting="{name}, hi!"
          lede="Five short questions — so we seat you next to the people you want and don't forget anything important. Please reply {deadline}."
          deadline="by 1 August"
          stepLabels={["Who", "With whom", "Menu", "Getting there", "Song"]}
          menu={[
            { value: "meat", label: "Meat" },
            { value: "fish", label: "Fish" },
            { value: "veg", label: "Vegetarian" },
          ]}
          drinks={[
            { value: "wine", label: "Wine" },
            { value: "strong", label: "Spirits" },
            { value: "none", label: "No alcohol" },
          ]}
          summaryTitle="Your answer"
          submitLabel="Send the answer"
          thanksTitle="Thank you, see you there!"
          thanksText="Your answer is saved. If anything changes — just open this page again and write to us."
          labels={{
            whoText: "How to write you down and whether you can make it.",
            nameLabel: "First and last name",
            namePlaceholder: "Olga Smirnova",
            comingYes: "I'll be there, of course",
            comingNo: "I can't make it, sorry",
            plusText: "A plus one and children — we'll count the chairs and glasses.",
            alone: "Coming alone",
            withPair: "With a partner",
            pairName: "Your partner's name",
            pairPlaceholder: "Name",
            children: "Children and their ages, if you're bringing them",
            childrenPlaceholder: "Mira, 4 years old",
            menuText: "One main course to choose, drinks — as many as you like.",
            drinksLabel: "Drinks",
            allergies: "Allergies and restrictions",
            allergiesPlaceholder: "Nuts, lactose…",
            transferText: "Transfer from Altufyevo metro at 13:30 and 14:15, back at 23:30.",
            transferYes: "I'll take the transfer",
            transferNo: "I'll get there myself",
            songText: "The song you'll definitely get up and dance to — we'll play it in the evening.",
            songLabel: "Artist — title",
            songPlaceholder: "ABBA — Dancing Queen",
            wishLabel: "A few words for us",
            wishPlaceholder: "Optional, but nice",
            back: "← Back",
            next: "Next →",
            summaryGuest: "Guest",
            summaryComing: "Coming",
            yes: "yes",
            no: "no",
            summaryWith: "With",
            withPairShort: "with a partner",
            summaryMenu: "Menu",
            summaryTransfer: "Transfer",
            transferNeeded: "needed",
            transferNotNeeded: "not needed",
            summarySong: "Song",
          }}
        />
      </div>
      <div id="faq">
        <Faq020
          {...light}
          eyebrow="Questions"
          title="What people usually ask"
          lede="If your question isn't here — write to us, we'll answer quickly."
          items={[
            { question: "Can we bring children?", answer: "Yes, and we'd be glad. There'll be a play corner with an entertainer on the lawn from 17:00 to 21:00. Put the ages in the form — we'll prepare a children's menu." },
            { question: "What to give?", answer: "The best gift is you. If you'd like more, we're saving for a trip — the details are in the «Gifts» section. Please, no flowers: there's nowhere to take them." },
            { question: "Where to park?", answer: "At the estate gates, free, there's room for everyone. If you want to drink — there's a transfer to the metro at 23:30." },
            { question: "Will there be «kiss, kiss»?", answer: "No. And no toastmaster either. There'll be toasts from those who want to speak, and lots of time to just talk." },
            { question: "Can we take photos?", answer: "Of course. At the ceremony we ask you to put phones away for twenty minutes — there's a photographer for that. After that shoot whatever you like and tag #vasilisaartem2027." },
            { question: "What if it rains?", answer: "The ceremony moves under the pavilion roof, dinner — to the orangery. An umbrella still won't hurt: it's a walk through the garden to the pond." },
            { question: "What time does it all end?", answer: "Sparklers at 23:00, the transfer at 23:30. Those staying in the guest house can take their time." },
          ]}
          askText="Didn't find the answer?"
          askLabel="Write to Polina, our planner"
        />
      </div>
      <div id="gallery">
        <Portfolio008
          {...light}
          eyebrow="Gallery"
          title="Us before the wedding"
          lede="Film frames from six years: the kitchen, the road, the rain and one pier. We'll add the wedding ones after the fifth of September."
          photos={GALLERY}
          closeLabel="Close"
          prevLabel="Previous"
          nextLabel="Next"
        />
      </div>
      <div id="people">
        <People010
          {...paper}
          eyebrow="Who you'll meet"
          title="Three people you can ask anything"
          lede="We'll be busy with each other. So for everything organisational — go to them: they know more than we do."
          people={[
            {
              name: "Ksenia",
              role: "Maid of honour",
              text: "Vasilisa's best friend since the first year of uni. Knows where to sit, what to give and who isn't talking to whom.",
              image: "/demo/wedding/people-01.webp",
              contactLabel: "Message on Telegram",
              contactHref: "#",
            },
            {
              name: "Daniil",
              role: "Best man",
              text: "Artem's brother. In charge of the transfer, the parking and those who got lost on the way.",
              image: "/demo/wedding/people-02.webp",
              contactLabel: "Message on Telegram",
              contactHref: "#",
            },
            {
              name: "Polina",
              role: "Planner",
              text: "Puts the whole day together to the minute. Allergies, hotels, high chairs — she's the one.",
              image: "/demo/wedding/people-03.webp",
              contactLabel: "Call",
              contactHref: "tel:+70000000000",
            },
          ]}
        />
      </div>
      <div id="gifts">
        <Cta021
          {...light}
          eyebrow="Gifts"
          title="The best gift is you"
          lede="Honestly. But if you really want to — we're saving for a honeymoon in Portugal. Any amount becomes a dinner by the ocean, and we'll send a postcard from there."
          fundTitle="A contribution to the trip"
          fundText="A transfer by phone number or to a card — whichever is easier. Put your name in the comment so we know who to thank."
          requisiteLabel="Phone for transfers · Artem Z."
          copyLabel="Copy the number"
          copiedLabel="Copied"
          seal="V&A"
        />
      </div>
      <div id="wishes">
        <Testimonials020
          {...paper}
          eyebrow="Wishes"
          title="The board by the entrance — already here"
          lede="At the wedding there'll be a real one, with paper and pins. But you can start now: the note appears on the board right away."
          wishes={[
            { name: "Ksenia", note: "maid of honour", text: "Finally! I knew it from the first coffee. Love you both, get the dance floor ready." },
            { name: "Grandma Nina", text: "Artem, take care of her. Vasilisa, feed him. The rest will follow." },
            { name: "Daniil", note: "brother", text: "Brother, you chose the best one. The transfer's on me, the toasts are on you." },
            { name: "Masha and Egor", text: "Looking forward to the fifth of September more than our own holiday. Bringing you a sapling." },
            { name: "Polina", note: "planner", text: "Everything will be on time. Even the rain — on schedule." },
            { name: "Aunt Lena", text: "Crying already. Artem, you promised to teach me to dance — I remember." },
          ]}
          formTitle="Leave a wish"
          nameLabel="How to sign it"
          textLabel="Your wish"
          submitLabel="Pin to the board"
          freshNote="just now"
        />
      </div>
      <div id="footer">
        <Footer024
          {...light}
          background="#2b1a24"
          ink="#f3ebe4"
          accent="#d9784f"
          monogram="V & A"
          names="Vasilisa and Artem"
          dateLabel="5 September 2027"
          place="Marfino Estate"
          hashtag="#vasilisaartem2027"
          links={[
            { label: "Story", href: "#story" },
            { label: "Programme", href: "#program" },
            { label: "Venue", href: "#place" },
            { label: "RSVP", href: "#rsvp" },
            { label: "Questions", href: "#faq" },
          ]}
          rsvpText="Please reply"
          rsvpLabel="by 1 August"
          signature="With love, V. and A."
        />
      </div>
    </div>
  )
}
