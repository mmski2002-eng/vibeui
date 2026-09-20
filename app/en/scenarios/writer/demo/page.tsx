import type { CSSProperties } from "react"

import { Navbar045, type Navbar045Props } from "@/registry/blocks/navbar/navbar-045/navbar-045"
import { Hero045, type Hero045Props } from "@/registry/blocks/hero/hero-045/hero-045"
import { Writer001, type Writer001Props } from "@/registry/blocks/industry/writer-001/writer-001"
import { Writer002, type Writer002Props } from "@/registry/blocks/industry/writer-002/writer-002"
import { Writer003, type Writer003Props } from "@/registry/blocks/industry/writer-003/writer-003"
import { Bento014, type Bento014Props } from "@/registry/blocks/layout/bento-014/bento-014"
import { Writer004, type Writer004Props } from "@/registry/blocks/industry/writer-004/writer-004"
import { Event026, type Event026Props } from "@/registry/blocks/events/event-026/event-026"
import { Subscribe020, type Subscribe020Props } from "@/registry/blocks/newsletter/subscribe-020/subscribe-020"
import { Contact033, type Contact033Props } from "@/registry/blocks/contact/contact-033/contact-033"
import { Footer044, type Footer044Props } from "@/registry/blocks/footer/footer-044/footer-044"

/**
 * English version of the "Writer's personal site" demo: same blocks and
 * theme as `app/scenarios/writer/demo/page.tsx`, block text in English via
 * props.
 *
 * A reader-site. Warm graphite at night and paper by day: the switch in
 * the header sends the `vibeui-writer:theme`
 * event, every block listens and changes its color-scheme, and colours
 * are set via light-dark(), so the whole site crossfades at once. A 3D
 * book, an archive with a preview at the cursor, reading with a bookmark
 * and footnotes.
 */
export const metadata = {
  title: "Vera Kholodova — essays and a book",
  description:
    "VibeUI «Writer's personal site» scenario demo: a serif name from under a mask, a quote in pen, a 3D book, an essay archive with a preview at the cursor, reading with a bookmark and footnotes, margin notes, an events feed, letters to readers.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#17161a",
  color: "#ece5d8",
  fontFamily: '"PT Serif",Georgia,"Times New Roman",serif',
}

// Page theme: both states at once; each block switches its color-scheme on the event.
const reader = {
  tone: "auto",
  accent: "#d9a066",
  ink: "light-dark(#1f1c19,#ece5d8)",
  background: "light-dark(#f4efe6,#17161a)",
} as const

const raised = { ...reader, background: "light-dark(#ece5d8,#1e1c21)" } as const

// Starts as paper on the night site; the block flips the theme event itself.
const inverted = { ...reader, tone: "light", invert: true } as const

// Ink line between neighbours of the same tone: a grey that reads on both grounds.
function InkLine() {
  return <hr aria-hidden className="mx-auto h-px w-[calc(100%-2.5rem)] max-w-[71.5rem] border-0 bg-[#8a8378]/35" />
}

const PHOTOS = "/demo/writer"

const navbar: Navbar045Props = {
  brand: "Vera Kholodova",
  tagline: "essays and a book",
  links: [
    { label: "Essays", href: "#texts" },
    { label: "Book", href: "#book" },
    { label: "Letters", href: "#letters" },
  ],
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
  nightLabel: "Switch to night",
  paperLabel: "Switch to paper",
}

const hero: Hero045Props = {
  lines: ["Vera", "Kholodova"],
  role: "Essayist. I write about cities, memory and the houses we never lived in.",
  quoteLabel: "Today's line",
  quotes: [
    "Silence is not the absence of sound but the place where it is listened to.",
    "Every city I've lived in began with a railway station and ended with a kitchen.",
    "I write so as not to forget; I forget so there's something to write about.",
  ],
  primaryLabel: "Read the essays",
  secondaryLabel: "About the book",
  topLine: "Personal site · essays · book",
  paperLabel: "Paper",
  nightLabel: "Night",
}

const book: Writer001Props = {
  eyebrow: "Book",
  title: "Rooms We Never Lived In",
  subtitle: "Twenty-two essays on houses, cities and what we carry away with us",
  author: "Vera Kholodova",
  firstPage: [
    "The first house I remember wasn't ours. We rented it from a woman whose surname sounded like the name of a river, and she came on Thursdays to check whether the ficus plants were alive.",
    "The rooms were enormous, like in the movies, and spoke in echoes. I thought it was the house answering.",
  ],
  lede: "About the flats we rented, the houses we never moved into, the cities where we spent a single summer. Essays written over six years in four countries and one kitchen.",
  facts: ["Polya Publishing", "288 pages", "2026", "Print run 3 000"],
  formats: [
    { name: "Paperback", price: 890, note: "signed, delivery across Russia in 3–5 days", actionLabel: "Order a signed copy", actionHref: "#order" },
    { name: "E-book", price: 390, note: "epub and pdf, a link by email within a minute", actionLabel: "Buy and read", actionHref: "#order" },
    { name: "Audio", price: 590, note: "read by the author, 6 hours 40 minutes", actionLabel: "Listen to the first chapter", actionHref: "#listen" },
  ],
  pagesLabel: "read by readers",
  openLabel: "Open the first page of «{title}»",
  hint: "Hover or tap — it opens on page seven",
  formatsLabel: "Book format",
  pagesUnit: "pages",
}

const archive: Writer002Props = {
  eyebrow: "Essays",
  title: "Archive",
  lede: "Seven years of essays. Short ones — for one stop, long ones — for the way home. Hover: I'll show the first line.",
  texts: [
    { title: "The city that sleeps on its side", year: "2024", minutes: 12, topic: "Cities", firstLine: "Tbilisi goes to sleep not by the clock but by the slope: the upper streets go dark first.", excerpt: ["Tbilisi goes to sleep not by the clock but by the slope: the upper streets go dark first, then the ones clinging to them by their balconies, and only towards three — the embankment, where someone keeps laughing by the water for a long while.", "I lived there one winter and learned to tell the floors apart by sound. The upper ones creak. The middle ones sing in the mornings, because that's where the early risers live. The lower ones keep quiet and smell of bread."] },
    { title: "My grandmother's squared notebook", year: "2023", minutes: 9, topic: "Memory", firstLine: "There isn't a single date in the notebook, but there are butter prices for eleven years.", excerpt: ["There isn't a single date in the notebook, but there are butter prices for eleven years. That's how I reconstruct time: here we moved, here I was born, here butter doubled in price and the handwriting got smaller.", "She didn't keep a diary. She kept house. But if you read those columns in a row, you get the most honest autobiography I know."] },
    { title: "What a house sounds like when everyone has gone", year: "2025", minutes: 7, topic: "Home", firstLine: "The fridge, it turns out, sighs. I didn't know that for thirty-four years.", excerpt: ["The fridge, it turns out, sighs. I didn't know that for thirty-four years, because there was always someone at home, and its sigh got lost in the conversations.", "An empty house sounds like waiting: a door that hasn't slammed yet, a kettle that hasn't been put on. It isn't silent. It's holding a pause."] },
    { title: "Words I can't translate", year: "2022", minutes: 14, topic: "Language", firstLine: "Everyone translates the Portuguese saudade as «longing», and everyone lies — by about a third.", excerpt: ["Everyone translates the Portuguese saudade as «longing», and everyone lies — by about a third. There's a tenderness in it that longing doesn't have, and there isn't the weight that longing does.", "I collect words like that in a separate file. There are fourteen. One per move, as if the language hands me a word for every suitcase."] },
    { title: "Balconies", year: "2021", minutes: 6, topic: "Home", firstLine: "The balcony is the only room where the owners don't pretend.", excerpt: ["The balcony is the only room where the owners don't pretend. There's the bicycle, there are the jars, there's the laundry they won't show guests, and there too — the chair someone thinks on in the evenings.", "If I wrote guidebooks, I'd write them by balconies."] },
    { title: "A letter to a railway station", year: "2025", minutes: 11, topic: "Cities", firstLine: "Dear Ladozhsky, you were the first to see me leaving.", excerpt: ["Dear Ladozhsky, you were the first to see me leaving. You weren't surprised. That's your job.", "Since then I recognise cities by their stations: the ones that greet you with an echo, the ones that greet you cramped, and the ones where the platform turns straight into a street, as if the city doesn't want you lingering on the threshold."] },
    { title: "On the smell of the photocopier", year: "2020", minutes: 5, topic: "Memory", firstLine: "There are smells that vanished along with a profession.", excerpt: ["There are smells that vanished along with a profession. The photocopier in the library basement smelled of hot paper and ozone, and I went there for that smell more often than for the copies.", "Now I know: memory keeps not the events but the conditions we lived them in. The light, the temperature, the smell of toner."] },
  ],
  allLabel: "All",
  moreLabel: "read on",
  lessLabel: "collapse",
  fullLabel: "Read in full →",
  filtersLabel: "Topics",
  textUnits: ["essay", "essays", "essays"],
  minuteUnits: ["minute", "minutes", "minutes"],
  emptyText: "Nothing yet — but I'm writing.",
  firstLineLabel: "first line",
}

const reading: Writer003Props = {
  eyebrow: "Excerpt",
  title: "What a house sounds like when everyone has gone",
  source: "From «Rooms We Never Lived In», chapter three",
  paragraphs: [
    "The fridge, it turns out, sighs. I didn't know that for thirty-four years, because there was always someone at home, and its sigh got lost in the conversations, the radio, the footsteps in the corridor. Now everyone has gone — some to work, some for good — and ==the house has started speaking in the voice it had all along==.",
    "I write it down in a notebook, the way I'd write down birds. Half past seven: the radiator clicks three times, as if counting[1]. Nine: the light in the stairwell goes out with the sound of a book being closed. Eleven: ==someone upstairs puts down a cup, and I know the cup is white==.",
    "An empty house sounds like waiting: a door that hasn't slammed yet, a kettle that hasn't been put on. It isn't silent — ==it's holding a pause==, like a good reader before the last line[2].",
    "I think I've understood why people get cats. Not for the warmth and not for the mice. So that there's one more listener in the house[3] — and so that the fridge's sigh becomes someone's again, and not only yours.",
  ],
  notes: [
    "Later it turned out to be the thermostat. But I kept «counting».",
    "My reading-aloud teacher used to say: a pause is text too, it just isn't typeset.",
    "The cat never appeared in this essay. A ficus did.",
  ],
  progressLabel: "read",
  actionLabel: "Read the whole essay",
  noteLabel: "Footnote {n}",
}

const about: Bento014Props = {
  eyebrow: "About",
  title: "Briefly, in numbers and cities",
  bio: [
    "Born in Petersburg, in a house with a bay window that was later demolished. Studied philology, worked as an editor at three magazines, two of which closed — not because of me.",
    "Writing essays since 2019: first in letters to friends, then in a column, then in a book. I live wherever there's a balcony and a railway station half an hour away.",
  ],
  numbers: [
    { value: 142, label: "essays written" },
    { value: 2, label: "books published" },
    { value: 18400, label: "letter readers", suffix: "+" },
  ],
  cities: [
    { name: "Petersburg", years: "1991–2014" },
    { name: "Moscow", years: "2014–2019" },
    { name: "Tbilisi", years: "2019–2021" },
    { name: "Lisbon", years: "2021–2024" },
    { name: "Petersburg", years: "2024 — now" },
  ],
  fact: "I write by hand and type it up in the evening. Half the text gets lost on the way — and that's the best editing there is.",
  deskNote: "A desk by the window, a squared notebook, a 2B pencil and a cup that is never empty.",
  nowTitle: "Now writing: «Night Shift»",
  nowNote: "A book about people who don't sleep when the city does: bakers, dispatchers, nurses. The draft is",
  portraitAlt: "Portrait of the author",
  portraitCaption: "portrait · 2025",
  portraitLabel: "Portrait",
  portraitFact: "There are few photos: I'm usually on the other side of the page.",
  bioLabel: "Biography",
  nowLabel: "Now writing",
  draftLine: "draft · {n}%",
  numbersLabel: "In numbers",
  citiesLabel: "Cities",
  deskAlt: "The author's desk",
  deskCaption: "the desk",
  deskLabel: "Desk",
  factLabel: "Fact",
}

const readers: Writer004Props = {
  eyebrow: "Readers",
  title: "Notes in the margins",
  lede: "What people write in the margins, in letters and on the metro. The notes change — like the readers.",
  pageTitle: "Balconies",
  page: [
    "The balcony is the only room where the owners don't pretend. There's the bicycle, there are the jars, there's the laundry they won't show guests, and there too — the chair someone thinks on in the evenings.",
    "If I wrote guidebooks, I'd write them by balconies. Not by façades — façades lie for money — but by what's been put outside because it didn't fit inside.",
  ],
  notes: [
    { text: "Read it on the metro and missed my stop. Twice.", name: "Marina", from: "Kazan" },
    { text: "The one about balconies — that's about my father. How did you know?", name: "Igor", from: "from a letter" },
    { text: "Bought the paperback after the e-book. To underline.", name: "Anya", from: "Yekaterinburg" },
    { text: "The only book I've ever read aloud to a cat.", name: "Timur", from: "Tbilisi" },
    { text: "First time I've heard what silence sounds like in a text.", name: "Lena", from: "Petersburg" },
    { text: "Gave it to my mum. Now she writes me letters by hand.", name: "Olga", from: "Samara" },
    { text: "I read one essay every Sunday, making it last.", name: "Dmitry", from: "Minsk" },
  ],
  leftLabel: "Readers' notes",
  rightLabel: "More readers' notes",
}

const events: Event026Props = {
  eyebrow: "Events",
  title: "Where we'll meet",
  lede: "Launches, readings and broadcasts. Come along, I'll sign the book and read what isn't in print yet.",
  events: [
    { inDays: -9, time: "19:30", kind: "reading", title: "«Balconies» and other essays — an evening at Podpisnie Izdaniya", place: "Podpisnie Izdaniya", city: "Petersburg" },
    { inDays: 6, time: "19:00", kind: "launch", title: "«Rooms We Never Lived In» — the first book launch", place: "Dom Knigi, second-floor hall", city: "Petersburg", actionLabel: "Sign up", href: "#rsvp" },
    { inDays: 14, time: "20:00", kind: "broadcast", title: "A conversation about cities and memory on the «Between the Lines» podcast", place: "Online, the link comes by email", actionLabel: "Remind me", href: "#letters" },
    { inDays: 27, time: "18:00", kind: "reading", title: "Reading new essays from «Night Shift» — drafts aloud", place: "Nekrasov Library", city: "Moscow", actionLabel: "Sign up", href: "#rsvp" },
    { inDays: 41, time: "17:00", kind: "launch", title: "The book in Tbilisi: a conversation in two languages", place: "Auditoria bookshop", city: "Tbilisi", actionLabel: "Details", href: "#rsvp" },
  ],
  countdownLabel: "until the next event",
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  tbaLabel: "date to be confirmed",
  nextLabel: "· next",
  todayLabel: "today",
  dayUnits: ["day", "days", "days"],
  pastLabel: "Already happened",
}

const letters: Subscribe020Props = {
  eyebrow: "Letters",
  title: "Letters to readers",
  lede: "I write letters more often than essays. They're shorter, warmer and don't go through editing. Subscribe — and choose how often.",
  frequencies: [
    { name: "Once a week", promise: "Every Sunday, short: one thought, one book, one photo from the balcony." },
    { name: "Once a month", promise: "On the first, long: a new essay in full, before it comes out anywhere else." },
  ],
  placeholder: "Your email",
  actionLabel: "Get the letters",
  fine: "No ads and no «hot offers». Unsubscribe with one link at the bottom of any letter.",
  doneTitle: "The letter is on its way",
  doneText: "The first one will come at the next date — check the «Promotions» folder, email sometimes confuses letters with newsletters.",
  letterDate: "7 September",
  letterSubject: "On the window that hasn't been washed since spring",
  letterText: [
    "I noticed I hadn't washed the window since April only when the city appeared on it: the dust had settled exactly along the silhouette of the houses opposite, like a negative.",
    "And I thought — that's how memory works. We don't keep events. We keep the dust that settled on them.",
  ],
  letterHrefLabel: "Letter archive →",
  frequencyLabel: "How often",
  closeLabel: "Close the envelope",
  openLabel: "Open the last letter",
  sealLetter: "V",
  caption: "The last letter · hover to open",
}

const publishers: Contact033Props = {
  eyebrow: "For publishers",
  title: "Rights, excerpts, broadcasts",
  lede: "Translations, excerpt publication and film adaptation are handled through my agent. Interviews and broadcasts — directly, I reply within a week.",
  rights: [
    { name: "Translation", status: "sold: Germany, Poland · available: the rest" },
    { name: "Excerpts in magazines", status: "available" },
    { name: "Audiobook", status: "out in November" },
    { name: "Film adaptation", status: "available" },
  ],
  agentName: "Daria Lanina",
  agentRole: "literary agent",
  agency: "Polosa Agency",
  pressKitLabel: "Press kit: photos, biography, cover (zip, 14 MB)",
  freePrefix: "available",
  directLine: "For interviews and broadcasts — directly:",
  copyLabel: "copy",
  copiedLabel: "copied",
}

const footer: Footer044Props = {
  brand: "Vera Kholodova",
  tagline: "Essays, a book and letters to readers",
  links: [
    { label: "Essays", href: "#texts" },
    { label: "Book", href: "#book" },
    { label: "Events", href: "#events" },
    { label: "Letters", href: "#letters" },
    { label: "For publishers", href: "#publishers" },
  ],
  socials: [
    { label: "Telegram", href: "#" },
    { label: "Podcast", href: "#" },
    { label: "Litres", href: "#" },
    { label: "Email", href: "mailto:vera@kholodova.ru" },
  ],
  colophon: "Set in Cormorant Garamond and PT Serif. No analytics, only a page counter.",
  copyright: "© 2026 Vera Kholodova. Texts may be quoted with a link.",
  topLabel: "Back to top",
  navLabel: "Sections",
  socialsLabel: "Social",
}

export default function WriterDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar045 {...reader} {...navbar} />
      <div id="top">
        <Hero045 {...reader} {...hero} showModeSwitch={false} video="/demo/writer/hero-night.mp4" videoDay="/demo/writer/hero-day.mp4" poster="/demo/writer/hero-night.webp" posterDay="/demo/writer/hero-day.webp" />
      </div>
      <div id="book">
        <Writer001 {...raised} {...book} cover={`${PHOTOS}/cover.webp`} />
      </div>
      <div id="texts">
        <Writer002 {...reader} {...archive} />
      </div>
      <div id="read">
        <Writer003 {...inverted} {...reading} />
      </div>
      <div id="about">
        <Bento014 {...reader} {...about} portrait={`${PHOTOS}/portrait.webp`} desk={`${PHOTOS}/desk.webp`} />
      </div>
      <InkLine />
      <div id="readers">
        <Writer004 {...reader} {...readers} />
      </div>
      <div id="events">
        <Event026 {...raised} {...events} />
      </div>
      <div id="letters">
        <Subscribe020 {...inverted} {...letters} />
      </div>
      <div id="publishers">
        <Contact033 {...reader} {...publishers} />
      </div>
      <InkLine />
      <Footer044 {...reader} {...footer} />
    </div>
  )
}
