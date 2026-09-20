import type { CSSProperties } from "react"

import { Navbar029, type Navbar029Props } from "@/registry/blocks/navbar/navbar-029/navbar-029"
import { Hero029, type Hero029Props } from "@/registry/blocks/hero/hero-029/hero-029"
import { Podcast004, type Podcast004Props } from "@/registry/blocks/industry/podcast-004/podcast-004"
import { Podcast005, type Podcast005Props } from "@/registry/blocks/industry/podcast-005/podcast-005"
import { People013, type People013Props } from "@/registry/blocks/team/people-013/people-013"
import { Podcast006, type Podcast006Props } from "@/registry/blocks/industry/podcast-006/podcast-006"
import { Pricing023, type Pricing023Props } from "@/registry/blocks/pricing/pricing-023/pricing-023"
import { Subscribe008, type Subscribe008Props } from "@/registry/blocks/newsletter/subscribe-008/subscribe-008"
import { Footer028, type Footer028Props } from "@/registry/blocks/footer/footer-028/footer-028"
import { Podcast007, type Podcast007Props } from "@/registry/blocks/industry/podcast-007/podcast-007"
import { Atmosphere } from "@/app/scenarios/podcast/demo/atmosphere"

/**
 * English version of the "Podcast" demo: same blocks and theme as
 * `app/scenarios/podcast/demo/page.tsx`, block text in English via props.
 *
 * A dark studio with an acid recording light. Everything that sounds is
 * visible: the episode waveform, running quotes, counters. The episode
 * feed, hero, mini player and header are linked by window events. The
 * first screen is a sticky scene: on scroll it slides down and fades while
 * sections roll over it; an accent glow follows the page and grain lies
 * on it. A showcase of the result, not a template.
 */
export const metadata = {
  title: "Quiet Hour — a podcast about how people work",
  description:
    "VibeUI «Podcast» scenario demo: a player with a live waveform, an episode feed, running quotes, guests, platforms, support and a mini player.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0e0d12",
  color: "#f3efe6",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const dark = { tone: "dark", accent: "#c8f542", ink: "#f3efe6", background: "#0e0d12" } as const

const PHOTOS = "/demo/podcast"

const navbar: Navbar029Props = {
  brand: "Quiet Hour",
  caption: "a podcast about work",
  links: [
    { label: "Episodes", href: "#episodes" },
    { label: "Guests", href: "#guests" },
    { label: "Where to listen", href: "#listen" },
    { label: "Support", href: "#support" },
  ],
  idleLabel: "on air on Thursdays",
  playingLabel: "now",
  actionLabel: "Listen",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
}

const hero: Hero029Props = {
  eyebrow: "Episode of the week",
  number: "No. 112",
  title: "The man who lights the lighthouse",
  outline: "lighthouse",
  guest: "Sergey Volkov — lighthouse keeper on the White Sea",
  lede: "An hour and a half about a day with nobody in it but you, the wind and a lamp that reaches forty kilometres.",
  coverAlt: "Episode cover: a microphone against a warm window",
  chapters: [
    { at: 0, title: "How you get to a lighthouse" },
    { at: 780, title: "Solitude and the radio" },
    { at: 1860, title: "The storm of 2019" },
    { at: 3240, title: "What to read in winter" },
    { at: 4500, title: "Leave or stay" },
  ],
  playLabel: "Listen",
  pauseLabel: "Pause",
  chaptersLabel: "Chapters",
  allLabel: "All episodes",
  seekLabel: "Seek",
}

const episodes: Podcast004Props = {
  eyebrow: "Episodes",
  title: "All releases",
  lede: "The length of the bar is the length of the conversation. Hover to read what it's about; press play — it starts at the bottom.",
  episodes: [
    { id: "e112", number: "112", title: "The man who lights the lighthouse", guest: "Sergey Volkov, lighthouse keeper", text: "An hour and a half about a day with nobody in it but the wind and a lamp that reaches forty kilometres.", cover: `${PHOTOS}/episode-02.webp`, minutes: 90, date: "12 Sep", tags: ["solitude", "sea", "craft"] },
    { id: "e111", number: "111", title: "A thousand identical cups", guest: "Anya Reznik, ceramicist", text: "Why a series is harder than one masterpiece, and what to do with the rejects.", cover: `${PHOTOS}/episode-01.webp`, minutes: 64, date: "5 Sep", tags: ["craft", "series"] },
    { id: "e110", number: "110", title: "Six hours over an open heart", guest: "Marat Ismailov, cardiac surgeon", text: "On concentration, music in the operating theatre and how to rest afterwards.", cover: `${PHOTOS}/episode-03.webp`, minutes: 78, date: "29 Aug", tags: ["medicine", "focus"] },
    { id: "e109", number: "109", title: "Code nobody will ever see", guest: "Lena Tsaryova, back-end developer", text: "On invisible work, legacy and the joy of «it just works».", cover: `${PHOTOS}/episode-04.webp`, minutes: 52, date: "22 Aug", tags: ["code", "invisible"] },
    { id: "e108", number: "108", title: "First run at five in the morning", guest: "Igor Naydyonov, train driver", text: "Dawn from the cab, silence in the depot and why he still gets nervous.", cover: `${PHOTOS}/episode-05.webp`, minutes: 71, date: "15 Aug", tags: ["road", "dawn"] },
    { id: "e107", number: "107", title: "Silence as a tool", guest: "Olga Men, librarian", text: "How a room where you can't talk works, and who really comes there.", cover: `${PHOTOS}/episode-06.webp`, minutes: 46, date: "8 Aug", tags: ["silence", "city"] },
  ],
  playLabel: "Listen",
  minuteLabel: "min",
  moreLabel: "Archive: 106 more episodes",
}

const quotes: Podcast005Props = {
  eyebrow: "Said on air",
  top: [
    { text: "Solitude isn't when there's nobody around, it's when there's nobody to call", who: "Sergey Volkov · No. 112", href: "#episodes" },
    { text: "The thousandth cup is no worse than the first", who: "Anya Reznik · No. 111", href: "#episodes" },
    { text: "I don't get tired of the work. I get tired of the waiting", who: "Marat Ismailov · No. 110", href: "#episodes" },
  ],
  bottom: [
    { text: "The best code is the code nobody ever thinks about", who: "Lena Tsaryova · No. 109", href: "#episodes" },
    { text: "Dawn from the cab never gets old. Twenty years of checking", who: "Igor Naydyonov · No. 108", href: "#episodes" },
    { text: "Silence is a sound too, just a rare one", who: "Olga Men · No. 107", href: "#episodes" },
  ],
}

const guests: People013Props = {
  eyebrow: "Guests",
  title: "Who's been in the studio",
  lede: "One hundred and twelve people who do their work with their hands and their heads. Hover — the strip stops.",
  guests: [
    { name: "Sergey Volkov", role: "lighthouse keeper", episode: "No. 112", image: `${PHOTOS}/guest-01.webp`, href: "#episodes" },
    { name: "Anya Reznik", role: "ceramicist", episode: "No. 111", image: `${PHOTOS}/guest-02.webp`, href: "#episodes" },
    { name: "Marat Ismailov", role: "cardiac surgeon", episode: "No. 110", image: `${PHOTOS}/guest-03.webp`, href: "#episodes" },
    { name: "Lena Tsaryova", role: "back-end developer", episode: "No. 109", image: `${PHOTOS}/guest-04.webp`, href: "#episodes" },
    { name: "Igor Naydyonov", role: "train driver", episode: "No. 108", image: `${PHOTOS}/guest-05.webp`, href: "#episodes" },
    { name: "Olga Men", role: "librarian", episode: "No. 107", image: `${PHOTOS}/guest-06.webp`, href: "#episodes" },
    { name: "Daniil Stern", role: "chef", episode: "No. 106", image: `${PHOTOS}/guest-07.webp`, href: "#episodes" },
    { name: "Vika Lim", role: "florist", episode: "No. 105", image: `${PHOTOS}/guest-08.webp`, href: "#episodes" },
  ],
}

const listen: Podcast006Props = {
  eyebrow: "Where to listen",
  title: "We're wherever you are",
  lede: "The podcast comes out on Thursdays in every app at once. Below — numbers we didn't expect ourselves.",
  stats: [
    { value: 112, label: "episodes in three years" },
    { value: 1.8, label: "plays", suffix: "M" },
    { value: 6240, label: "hours of conversation for listeners" },
  ],
  platformsLabel: "Platforms",
  platforms: [
    { name: "Yandex Music", href: "#", mark: "Y" },
    { name: "Apple Podcasts", href: "#", mark: "A" },
    { name: "Spotify", href: "#", mark: "S" },
    { name: "YouTube", href: "#", mark: "▶" },
    { name: "Telegram", href: "#", mark: "T" },
    { name: "RSS", href: "#", mark: "∿" },
  ],
}

const support: Pricing023Props = {
  eyebrow: "Support",
  title: "The show runs on listeners",
  lede: "No ads, no sponsors: every episode is paid for by the people waiting for it. Choose how much you're with us.",
  monthlyLabel: "per month",
  yearlyLabel: "a year",
  yearlyNote: "−2 months",
  perLabel: "/ mo",
  featuredLabel: "most chosen",
  tiers: [
    { name: "Listener", monthly: "0 ₽", yearly: "0 ₽", text: "Everything that goes on air.", perks: ["a new episode every Thursday", "a letter after the release", "the listeners' chat"], action: "Keep it this way", href: "#" },
    { name: "Friend of the studio", monthly: "290 ₽", yearly: "2 900 ₽", text: "More conversation than fit on air.", perks: ["episodes a day early", "full versions without editing", "vote for guests", "your name in the credits once a season"], action: "Become a friend", href: "#", featured: true },
    { name: "Co-host", monthly: "1 200 ₽", yearly: "12 000 ₽", text: "For those who want into the studio.", perks: ["everything from «Friend of the studio»", "a call with the host once a quarter", "an invitation to a live recording", "a tape signed by the guest"], action: "Come into the studio", href: "#" },
  ],
  periodLabel: "Billing period",
}

const letter: Subscribe008Props = {
  eyebrow: "Letter",
  title: "After every release — a letter",
  lede: "Not a digest and not «studio news». One letter from the host: what stayed behind the scenes and what to listen to next.",
  placeholder: "email",
  submitLabel: "Subscribe",
  promise: "once a week · after the release · unsubscribe in one click",
  inside: ["three quotes that didn't make it on air", "a link to the full version without editing", "a question for the guest that you can answer"],
  doneTitle: "Noted",
  doneText: "The first letter will arrive next Thursday, right after the release.",
}

const footer: Footer028Props = {
  brand: "Quiet Hour",
  caption: "a podcast about how people work",
  hostName: "Vera Ilyina",
  hostRole: "host and producer",
  hostText: "I record on Wednesdays, edit at night, publish on Thursday. Write if there's someone worth listening to.",
  platformsLabel: "Listen",
  platforms: [
    { label: "Yandex Music", href: "#" },
    { label: "Apple Podcasts", href: "#" },
    { label: "Spotify", href: "#" },
    { label: "YouTube", href: "#" },
  ],
  linksLabel: "Sections",
  links: [
    { label: "Episodes", href: "#episodes" },
    { label: "Guests", href: "#guests" },
    { label: "Support", href: "#support" },
    { label: "Letter", href: "#letter" },
  ],
  rssLabel: "rss feed",
  copyright: "© Quiet Hour, 2026",
  sign: "until the next show",
}

const player: Podcast007Props = {
  playLabel: "Listen",
  pauseLabel: "Pause",
  closeLabel: "Close",
  regionLabel: "Player",
  seekLabel: "Seek",
}

export default function PodcastDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}
[data-scene]{position:relative;z-index:1}
[data-scene="hero"]{z-index:0}
@supports (animation-timeline: scroll()){@media (min-width: 64rem){[data-scene="hero"]>*{animation:vibeui-demo-hero-away linear both;animation-timeline:scroll(root);animation-range:0 100vh}}}
@keyframes vibeui-demo-hero-away{to{translate:0 38%;scale:.94;opacity:.15}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}[data-scene="hero"]>*{animation:none!important}}`}
      </style>
      <Atmosphere accent={dark.accent} />
      <Navbar029 {...dark} {...navbar} />
      <div id="top" data-scene="hero">
        <Hero029 {...dark} {...hero} cover={`${PHOTOS}/cover.webp`} />
      </div>
      <div id="episodes" data-scene="episodes">
        <Podcast004 {...dark} {...episodes} />
      </div>
      <div data-scene="quotes">
        <Podcast005 {...dark} {...quotes} />
      </div>
      <div id="guests" data-scene="guests">
        <People013 {...dark} {...guests} />
      </div>
      <div id="listen" data-scene="listen">
        <Podcast006 {...dark} {...listen} />
      </div>
      <div id="support" data-scene="support">
        <Pricing023 {...dark} {...support} image={`${PHOTOS}/studio-01.webp`} />
      </div>
      <div id="letter" data-scene="letter">
        <Subscribe008 {...dark} {...letter} />
      </div>
      <div data-scene="footer">
        <Footer028 {...dark} {...footer} hostImage={`${PHOTOS}/host.webp`} />
      </div>
      <Podcast007 {...dark} {...player} />
    </div>
  )
}
