import type { CSSProperties } from "react"

import { Background006 } from "@/registry/animations/background/background-006/background-006"
import { Navbar027 } from "@/registry/blocks/navbar/navbar-027/navbar-027"
import { Hero027 } from "@/registry/blocks/hero/hero-027/hero-027"
import { About013 } from "@/registry/blocks/about/about-013/about-013"
import { Event013 } from "@/registry/blocks/events/event-013/event-013"
import { Event014 } from "@/registry/blocks/events/event-014/event-014"
import { Map009 } from "@/registry/blocks/map/map-009/map-009"
import { Contact020 } from "@/registry/blocks/contact/contact-020/contact-020"
import { Faq022 } from "@/registry/blocks/faq/faq-022/faq-022"
import { Portfolio010 } from "@/registry/blocks/portfolio/portfolio-010/portfolio-010"
import { People011 } from "@/registry/blocks/team/people-011/people-011"
import { Cta023 } from "@/registry/blocks/cta/cta-023/cta-023"
import { Testimonials022 } from "@/registry/blocks/testimonials/testimonials-022/testimonials-022"
import { Footer026 } from "@/registry/blocks/footer/footer-026/footer-026"

/**
 * English version of the "Winter wedding by candlelight" demo: same blocks
 * and theme as `app/scenarios/wedding-winter/demo/page.tsx`, text in English.
 *
 * A blue night, candles, snow over the whole site. Cormorant Garamond +
 * Marck Script + Manrope. A candle at the entrance, a house in the woods, a
 * story as a garland, a programme with the moon, a letter as the reply.
 * A showcase of the result, not a template.
 */
export const metadata = {
  title: "Valeria and Dmitry — 18 December 2027, Forest Estate",
  description:
    "VibeUI «Winter wedding by candlelight» scenario demo: a candle at the entrance, snow over the whole site, a house in the woods, a garland story, a programme from sunset to midnight, a dress code, a map, a letter as the reply, questions, a gallery in windows, gifts and notes on the glass.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0b1220",
  color: "#f2eee6",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const dark = { tone: "dark", background: "#0b1220", ink: "#f2eee6", accent: "#f2b64f" } as const
// A second tone for rhythm: even sections are slightly lighter; bands of depth
// break up the monotone canvas so the page breathes instead of stretching as one blue.
const lift = { ...dark, background: "#101d33" } as const

const IMG = "/demo/wedding-winter/"

const GALLERY = [
  { src: `${IMG}gallery-01.webp`, caption: "The road into the woods", shape: "wide" },
  { src: `${IMG}gallery-02.webp`, caption: "Snow on eyelashes", shape: "tall" },
  { src: `${IMG}gallery-03.webp`, caption: "Mulled wine", shape: "square" },
  { src: `${IMG}gallery-04.webp`, caption: "Firewood", shape: "tall" },
  { src: `${IMG}gallery-05.webp`, caption: "Snow angels" },
  { src: `${IMG}gallery-06.webp`, caption: "A heart on the glass" },
  { src: `${IMG}gallery-07.webp`, caption: "A lantern", shape: "square" },
  { src: `${IMG}gallery-08.webp`, caption: "Fireworks" },
] as const

export default function Page() {
  return (
    <div style={page} className="dark min-h-dvh" data-demo="wedding-winter">
      {/* Night blue for cards, lines and muted text: in the catalogue the blocks are grey, the scenario sets the shade. */}
      <style href="vibeui-demo-winter-night" precedence="medium">
        {`[data-vibeui-block]{--vibeui-navbar-027-muted:#9fb0c8;--vibeui-navbar-027-line:rgb(159 176 200 / .28);--vibeui-about-013-card:#131c2e;--vibeui-about-013-muted:#9fb0c8;--vibeui-about-013-line:rgb(159 176 200 / .22);--vibeui-event-013-card:#131c2e;--vibeui-event-013-muted:#9fb0c8;--vibeui-event-013-line:rgb(159 176 200 / .22);--vibeui-event-014-card:#131c2e;--vibeui-event-014-muted:#9fb0c8;--vibeui-event-014-line:rgb(159 176 200 / .24);--vibeui-map-009-card:#131c2e;--vibeui-map-009-muted:#9fb0c8;--vibeui-map-009-line:rgb(159 176 200 / .24);--vibeui-contact-020-muted:#9fb0c8;--vibeui-contact-020-line:rgb(159 176 200 / .24);--vibeui-faq-022-card:#131c2e;--vibeui-faq-022-muted:#9fb0c8;--vibeui-faq-022-line:rgb(159 176 200 / .24);--vibeui-portfolio-010-card:#131c2e;--vibeui-portfolio-010-muted:#9fb0c8;--vibeui-portfolio-010-line:rgb(159 176 200 / .35);--vibeui-people-011-card:#131c2e;--vibeui-people-011-muted:#9fb0c8;--vibeui-people-011-line:rgb(159 176 200 / .24);--vibeui-cta-023-card:#131c2e;--vibeui-cta-023-muted:#9fb0c8;--vibeui-cta-023-line:rgb(159 176 200 / .24);--vibeui-testimonials-022-card:#131c2e;--vibeui-testimonials-022-muted:#9fb0c8;--vibeui-testimonials-022-line:rgb(159 176 200 / .24);--vibeui-hero-027-line:rgb(159 176 200 / .35);--vibeui-footer-026-line:rgb(159 176 200 / .2);}`}
      </style>
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Background006 density={0.6} wind={0.2} shape="star" zIndex={30} />
      <Navbar027
        {...dark}
        background="rgb(11 18 32 / .78)"
        initials={["V", "D"]}
        names="Valeria and Dmitry"
        brandHref="#hero"
        links={[
          { label: "Story", href: "#story" },
          { label: "Evening", href: "#evening" },
          { label: "Getting there", href: "#place" },
          { label: "Questions", href: "#faq" },
        ]}
        actionLabel="Reply"
        music={`${IMG}music.mp3`}
        musicLabel="Our music"
        playingLabel="Playing"
        snowLabel="Snow"
        menuLabel="Menu"
        closeLabel="Close menu"
      />
      <div id="hero">
        <Hero027
          {...dark}
          candle={false}
          names="Valeria & Dmitry"
          script="when it gets dark"
          eyebrow="A winter wedding"
          dateLabel="18 December 2027"
          place="Forest Estate · 40 km from Moscow"
          lede="A ceremony at sunset by the fireplace, mulled wine on the terrace, dancing till midnight and fireworks in the woods. Snow is promised."
          note="come after dark — it's prettier"
          primaryLabel="Reply"
          calendarLabel="Add to calendar"
          calendarTitle="Valeria and Dmitry's wedding"
          calendarLocation="Forest Estate, Moscow region"
          image={`${IMG}hero.webp`}
          imageAlt="A house in a snowy forest with warm windows"
          photo={`${IMG}hero-couple.webp`}
          photoAlt="Valeria and Dmitry with a lantern on a forest path"
          photoCaption="first snow, November"
          countdownCaption="Until the wedding"
          countdownLabels={["days", "hours", "minutes", "seconds"]}
          candleLabel="Light the candle"
          candleHint="press the wick"
        />
      </div>
      <div id="story">
        <About013
          {...dark}
          eyebrow="Our story"
          title="Four winters «before»"
          lede="We met in winter and have counted the years by snow ever since, not by the calendar. This is the fourth."
          frames={[
            { date: "December 2023", title: "The rink", text: "Dima fell first, Lera second. We got up together, and that's how we've held on.", image: `${IMG}story-01.webp` },
            { date: "January 2025", title: "A tree for two", text: "Carried it across the whole city. There were enough baubles for one branch.", image: `${IMG}story-02.webp` },
            { date: "February 2026", title: "The first winter together", text: "Moved in during a snowfall. Unpacked the boxes until spring.", image: `${IMG}story-03.webp` },
            { date: "November 2027", title: "Under a tree in the woods", text: "Dima asked under a big spruce with a garland. Lera said «yes» and «it's cold».", image: `${IMG}story-04.webp` },
          ]}
        />
      </div>
      <div id="evening">
        <Event013
          {...lift}
          eyebrow="The evening"
          title="From sunset to midnight"
          lede="We start when the sun sets and finish when the moon is over the woods. In between — the fireplace, mulled wine and dancing."
          skyNote="sunset at 16:04"
          slots={[
            { time: "15:30", title: "Guests arrive", place: "by the fireplace", text: "Tea, mulled wine, blankets. The transfer from the metro arrives by 15:15." },
            { time: "16:00", title: "The ceremony", place: "the big living room", text: "At sunset, by candlelight, twenty minutes. Phones in pockets — the photographer will catch everything." },
            { time: "17:00", title: "Mulled wine on the terrace", place: "the terrace", text: "First snow on shoulders, garlands, the first photos outside." },
            { time: "18:30", title: "Dinner", place: "the long table", text: "Duck, fish or vegetarian — whatever you chose in the form. Toasts if you like." },
            { time: "21:00", title: "Dancing", place: "the living room", text: "The first dance is a waltz, then everything you requested in the form." },
            { time: "23:00", title: "Fireworks", place: "a clearing in the woods", text: "Five minutes, warm shoes and coats — on the rack by the exit." },
            { time: "00:00", title: "Midnight", place: "the terrace", text: "The transfer back at 00:30 and 01:00. For those staying — the rooms are ready." },
          ]}
          image={`${IMG}evening.webp`}
          imageAlt="A long table by candlelight, blue dusk outside the window"
        />
      </div>
      <div id="dresscode">
        <Event014
          {...dark}
          eyebrow="Dress code"
          title="Velvet and wool — warm and festive"
          lede="An evening by candlelight in a country house: deep colours, dense fabrics, nothing shiny. The fabrics are from this shelf."
          swatches={[
            { name: "Night", hex: "#0b1220" },
            { name: "Indigo", hex: "#1c2740" },
            { name: "Burgundy", hex: "#7a2b35" },
            { name: "Pine", hex: "#2f5d50" },
            { name: "Silver", hex: "#9fb0c8" },
            { name: "Candle", hex: "#f2b64f" },
          ]}
          copiedLabel="copied"
          looks={[
            { who: "For her", title: "Long and warm", text: "Velvet, wool, heavy silk — in night, burgundy or pine. We'll hand out shawls on the terrace. Heels are fine: the house has parquet.", image: `${IMG}look-her.webp` },
            { who: "For him", title: "A dark suit, a turtleneck or a shirt", text: "Navy, graphite, bottle green. A scarf is welcome, a tie — optional.", image: `${IMG}look-him.webp` },
          ]}
          rules={[
            { icon: "snow", text: "There's snow on the terrace and in the woods: a change of shoes or warm boots — we'll leave them by the exit." },
            { icon: "flame", text: "A ceremony by candlelight: nothing puffy in synthetics, please." },
            { icon: "boot", text: "Fireworks at 23:00 in the clearing — don't leave coats and hats in the car." },
          ]}
        />
      </div>
      <div id="place">
        <Map009
          {...lift}
          eyebrow="Getting there"
          title="Forest Estate"
          lede="Forty kilometres from the ring road along Novorizhskoye highway, then ten minutes through the woods. The navigator leads correctly, the snow is cleared."
          address="Moscow region, Istra district, Lesnaya village, 12"
          mapImage={`${IMG}map.webp`}
          mapImageAlt="Aerial view: a road through the woods to a house in a snowy clearing"
          image={`${IMG}venue.webp`}
          imageAlt="A house with warm windows and lanterns by the entrance"
          imageCaption="the house where it all happens"
          ways={[
            { icon: "car", title: "By car", text: "An hour from the centre without traffic. The navigator point is under the button above. Enter through the gates, security knows about the wedding." },
            { icon: "bus", title: "Transfer", text: "From Tushinskaya metro at 14:30 and 15:15, buses with a «V ❄ D» sign. Back — at 00:30 and 01:00." },
            { icon: "bed", title: "Staying over", text: "The house has twelve rooms: if you want to stay — tick it in the form, we'll allocate and write." },
            { icon: "parking", title: "Parking", text: "Under a canopy for twenty cars, as many again by the gates. In the morning the cars will be under snow — there's a brush with security." },
          ]}
          openLabel="Open in Yandex Maps"
          mapAlt="Directions map: {address}"
          drawnMapLabel="Stylised directions map: {address}"
        />
      </div>
      <div id="rsvp">
        <Contact020
          {...dark}
          eyebrow="Reply"
          title="Write that you're coming"
          greeting="{name}, we're waiting for your reply"
          lede="Five questions — and we know how many chairs to set, where to put you up and what to cook. Please reply {deadline}."
          deadline="by 1 November"
          stepLabels={["Who", "Staying", "Getting there", "Menu", "Song"]}
          menu={[
            { value: "duck", label: "Duck with apples" },
            { value: "fish", label: "Trout" },
            { value: "veg", label: "Vegetarian" },
          ]}
          seal="V·D"
          summaryTitle="Your reply"
          submitLabel="Send"
          thanksTitle="Letter received"
          thanksText="Thank you! Two weeks before the evening we'll write about the transfer and the rooms."
          stampLabel="Waiting"
          labels={{
            whoTitle: "Who's coming",
            whoText: "How to write you down and whether you can be with us.",
            nameLabel: "First and last name",
            namePlaceholder: "Anna Sokolova",
            comingYes: "I'll come",
            comingNo: "I can't make it",
            companionsLabel: "With whom",
            companionsPlaceholder: "Alone, with a partner, with a 5-year-old…",
            stayTitle: "Staying overnight?",
            stayText: "The house has twelve rooms, linen and breakfast are on us. For those leaving — the transfer at 00:30 and 01:00.",
            stayHouse: "Staying in the house",
            stayBack: "Going back at night",
            transferTitle: "How will you get there",
            transferText: "A transfer from Tushinskaya metro or your own car — parking under a canopy.",
            transferBus: "By transfer",
            transferCar: "By car",
            transferTimeLabel: "Transfer time",
            transferAt: "At {time}",
            menuTitle: "What to cook",
            menuText: "Dinner by the fireplace is cooked in advance — choose the main.",
            allergies: "Allergies and restrictions",
            allergiesPlaceholder: "Nuts, lactose…",
            songTitle: "A song and a few words",
            songText: "What you'll definitely dance to — we'll pass it to the DJ.",
            songLabel: "Artist — title",
            songPlaceholder: "Frank Sinatra — Let It Snow",
            wishLabel: "Words for us",
            wishPlaceholder: "Optional, but we read everything",
            back: "← Back",
            next: "Next →",
            summaryFrom: "From",
            summaryAnswer: "Reply",
            willCome: "coming",
            cannotCome: "can't make it",
            summaryWith: "With",
            summaryStay: "Staying",
            inHouse: "in the house",
            leaving: "leaving",
            summaryRoad: "Getting there",
            byTransfer: "transfer {time}",
            byCar: "by car",
            summaryMenu: "Menu",
            summarySong: "Song",
          }}
        />
      </div>
      <div id="faq">
        <Faq022
          {...lift}
          eyebrow="Questions"
          title="What people ask before winter"
          lede="Everything we've been asked in the last month. No answer — write to Marina, she replies faster than we do."
          items={[
            { question: "Will it be cold?", answer: "The house is warm: a fireplace and a stove. On the terrace and in the woods it's below zero, but there are blankets, mulled wine and twenty minutes at a time. Warm shoes and a coat are only needed for the fireworks." },
            { question: "Can we bring children?", answer: "Yes. There'll be a nanny, a kids' room with cartoons and a separate menu. Put the age in your reply — we'll set a high chair." },
            { question: "Where to sleep?", answer: "The house has twelve rooms — free for guests, by the replies in the form. For anyone who doesn't fit — a guest house three minutes away, we'll book at our rate." },
            { question: "Where to park?", answer: "Under a canopy for twenty cars, as many again by the gates. Security will show you. In the morning there's a snow brush with security too." },
            { question: "What about phones at the ceremony?", answer: "In your pocket for twenty minutes. The photographer and videographer will catch everything, and you'll look at us, not at a screen." },
            { question: "What time does it all end?", answer: "Fireworks at 23:00, midnight — the final dance. The transfer back at 00:30 and 01:00; for those staying — breakfast at 10:00." },
            { question: "What to give?", answer: "Flowers will freeze on the way in December. If you'd like — a contribution «for the fireplace», the details are in the «Gifts» section. Or just come." },
            { question: "Is the dress code strict?", answer: "More like warm: velvet, wool, deep colours. The main thing is that you're comfortable dancing and going out into the snow." },
          ]}
          askText="Didn't find the answer?"
          askLabel="Write to Marina"
        />
      </div>
      <div id="gallery">
        <Portfolio010
          {...dark}
          eyebrow="Frames"
          title="Four winters in windows"
          lede="The best of our winters — the rink, the tree, the first snow and that very spruce. Warm up any window."
          photos={GALLERY}
          closeLabel="Close"
          prevLabel="Previous"
          nextLabel="Next"
        />
      </div>
      <div id="people">
        <People011
          {...lift}
          eyebrow="Who's meeting you"
          title="They're waiting for you at the gates"
          lede="For any question before the wedding — go to them. They know where the parking is, who sits with whom and when the fireworks are."
          people={[
            { name: "Kristina", role: "Maid of honour", text: "Lera's friend since first grade. Knows about dresses, shawls and where to hide phones at the ceremony.", image: `${IMG}people-01.webp`, contactLabel: "Message on Telegram", contactHref: "#" },
            { name: "Igor", role: "Best man", text: "Dima's brother. In charge of transfers, firewood and the fireworks — in that order.", image: `${IMG}people-02.webp`, contactLabel: "Message on Telegram", contactHref: "#" },
            { name: "Marina", role: "Planner", text: "Puts the evening together to the minute. Rooms, allergies, high chairs — she's the one.", image: `${IMG}people-03.webp`, contactLabel: "Call", contactHref: "tel:+70000000000" },
          ]}
        />
      </div>
      <div id="gifts">
        <Cta023
          {...dark}
          eyebrow="Gifts"
          title="The best gift is you by the fireplace"
          lede="Honestly: the main thing is to come. If you still want to — we're saving for a fireplace in our first own house. A real one, with logs."
          fundTitle="For the fireplace"
          fundText="A transfer by phone number. In the comment — your name, we'll be sure to say thank you in person."
          requisiteLabel="Transfer · Dmitry V."
          copyLabel="Copy the number"
          copiedLabel="Copied"
          stampLabel="Thank you!"
          joke="Flowers in December will freeze on the way. Candles won't. But they're not needed either: we already have two hundred."
        />
      </div>
      <div id="wishes">
        <Testimonials022
          {...lift}
          eyebrow="Wishes"
          title="Write on the glass"
          lede="The living room window will fog up by evening — that's where you'll write for real. For now — here: everyone who's coming will see it."
          notes={[
            { name: "Olya and Sasha", text: "Warm boots bought, song requested. Dima, don't drop the ring in the snow." },
            { name: "Grandma Vera", text: "Lera, I'll bring my own shawl. Dima, can you chop wood? I'll check." },
            { name: "Kristina", text: "Four winters — and not one without you. May the fifth be the warmest." },
            { name: "Igor", text: "There will be fireworks. The rest — we'll see. Joking. Love you." },
            { name: "Marina", text: "Candles delivered, fireplace checked, snow ordered. ❄" },
          ]}
          formTitle="Write on the glass"
          nameLabel="Who's writing"
          textLabel="Your wish"
          submitLabel="Write"
        />
      </div>
      <div id="footer">
        <Footer026
          {...dark}
          background="#070c15"
          initials={["V", "D"]}
          names="Valeria and Dmitry"
          dateLabel="18 December 2027"
          place="Forest Estate"
          script="see you in the snow"
          hashtag="#leraanddimainthesnow"
          links={[
            { label: "Story", href: "#story" },
            { label: "Evening", href: "#evening" },
            { label: "Getting there", href: "#place" },
            { label: "Reply", href: "#rsvp" },
            { label: "Questions", href: "#faq" },
          ]}
          rsvpText="Please reply"
          rsvpLabel="by 1 November"
        />
      </div>
    </div>
  )
}
