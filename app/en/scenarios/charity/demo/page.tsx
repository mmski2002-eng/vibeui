import type { CSSProperties } from "react"

import { Navbar044 } from "@/registry/blocks/navbar/navbar-044/navbar-044"
import { Hero044 } from "@/registry/blocks/hero/hero-044/hero-044"
import { Charity001 } from "@/registry/blocks/industry/charity-001/charity-001"
import { Charity002 } from "@/registry/blocks/industry/charity-002/charity-002"
import { Charity003 } from "@/registry/blocks/industry/charity-003/charity-003"
import { Charity004 } from "@/registry/blocks/industry/charity-004/charity-004"
import { People024 } from "@/registry/blocks/team/people-024/people-024"
import { Charity005 } from "@/registry/blocks/industry/charity-005/charity-005"
import { Logocloud007 } from "@/registry/blocks/logos/logocloud-007/logocloud-007"
import { Event025 } from "@/registry/blocks/events/event-025/event-025"
import { Cta037 } from "@/registry/blocks/cta/cta-037/cta-037"
import { Footer043 } from "@/registry/blocks/footer/footer-043/footer-043"

/**
 * English version of the "Charity foundation" demo: same blocks and theme
 * as `app/scenarios/charity/demo/page.tsx`, text in English via props.
 *
 * "Warm Home" helps lonely elderly people in the Tver region. Paper,
 * terracotta, serif type and handwritten notes: a fundraiser with a live
 * counter, "what your amount gives", letters from wards in envelopes, a
 * ring chart of spending, a map of towns, a volunteer badge and a donation
 * form with "×12".
 */
export const metadata = {
  title: "Warm Home — a foundation helping lonely elderly people",
  description:
    "VibeUI «Charity foundation» scenario demo: a hero fundraiser with a counter and milestones, a «what the amount gives» calculator, letters from wards, a ring-chart report, a map of help, the team, volunteering, events and a donation form.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f6f1ea",
  color: "#2b211b",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const paper = { tone: "light", accent: "#c2410c", ink: "#2b211b", background: "#f6f1ea" } as const

const PHOTOS = "/demo/charity"

const STORIES = [
  { name: "Nina Petrovna", meta: "84 · Rzhev", letter: "Hello, my dears. I'm writing because I never did master the phone. Thank you for Katya — she comes on Wednesdays, we drink tea and she scolds me about my blood pressure. The kitchen tap doesn't drip anymore, I sleep. Hugs to all of you I don't know.", sign: "Nina P.", image: `${PHOTOS}/ward-02.webp` },
  { name: "Viktor Ilyich", meta: "79 · Torzhok", letter: "Forty years at the carriage works, and the front door of my own building I couldn't manage. The lads came on Saturday, fitted a lock and left with my fishing story. At least we laughed. Thank you. The groceries — thank you too, but the main thing is you came.", sign: "V. Kozlov", image: `${PHOTOS}/ward-01.webp` },
  { name: "Zinaida Fyodorovna", meta: "88 · Kuvshinovo", letter: "They brought the medicines, everything on the list, receipt attached — now that's humane. Murzik says hello to your Seryozha, who fed him while I was in hospital. We're living. Don't forget us.", sign: "Zina", image: `${PHOTOS}/ward-03.webp` },
  { name: "Anna Semyonovna", meta: "91 · Tver", letter: "I used to go weeks without talking to anyone. Now on Thursdays it's Lena, and on Sundays Igor calls and reads me the paper. I feel like I've become a person again, not a flat with a number.", sign: "A. S." },
]

const PEOPLE = [
  { name: "Marina Sokolova", role: "Foundation director", quote: "«Started with one grandmother in my own building. That was 2018.»", image: `${PHOTOS}/team-01.webp`, imageAlt: "Marina Sokolova" },
  { name: "Igor Lapin", role: "Logistics and repairs", quote: "«I know every road in the region and where taps are cheaper.»", image: `${PHOTOS}/team-02.webp`, imageAlt: "Igor Lapin by the van" },
  { name: "Katya Ryabova", role: "Senior social worker", quote: "«My Wednesdays are Nina Petrovna, tea and blood pressure.»", image: `${PHOTOS}/team-03.webp`, imageAlt: "Katya Ryabova" },
]

export default function CharityDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar044
        {...paper}
        brand="Warm Home"
        note="a foundation for the elderly"
        links={[
          { label: "Who we help", href: "#stories" },
          { label: "Reports", href: "#report" },
          { label: "Volunteers", href: "#volunteer" },
          { label: "Events", href: "#events" },
        ]}
        actionLabel="Help"
        navLabel="Sections"
        menuLabel="Menu"
        menuOpenLabel="Open menu"
        menuCloseLabel="Close menu"
      />
      <div id="top">
        <Hero044
          {...paper}
          eyebrow="Fundraiser No. 14 · September"
          title="So that Nina Petrovna\ngets visitors not only\n*on holidays*"
          lede="In Tver and the region there are 312 lonely elderly people we visit every week: groceries, medicines, fixing a tap, talking. This fundraiser is for the autumn."
          milestones={[
            { at: 500_000, label: "groceries" },
            { at: 1_000_000, label: "medicines" },
            { at: 1_500_000, label: "repairs" },
            { at: 2_000_000, label: "winter" },
          ]}
          primaryLabel="Help"
          secondaryLabel="Where the money goes"
          image={`${PHOTOS}/hero.webp`}
          imageAlt="Nina Petrovna by the window with a cup of tea, a volunteer's hand next to her"
          caption="Nina Petrovna, 84. Rzhev, Lenina St."
          dayUnits={["day", "days", "days"]}
          leftLine="{n} {days} left"
          ofLine="of {goal} · {percent}%"
          barLabel="Raised"
          donorsLine="{n} people have already helped"
          adsLine="{n} on advertising"
        />
      </div>
      <div id="impact">
        <Charity001
          {...paper}
          eyebrow="What your amount gives"
          title="We count not roubles but weeks, visits and fixed taps"
          lede="Pick an amount — we'll show what it turns into for one specific person. No rounding in our favour."
          tiers={[
            { amount: 500, title: "Groceries for a week", text: "Bread, grains, vegetables, milk and something for tea — the social worker brings the bag and stays for a chat.", icon: "bag", note: "and half an hour of conversation" },
            { amount: 1000, title: "Medicines for a month", text: "Blood pressure, heart, joints — from the doctor's list. A pharmacy far from home is beyond a lonely person's strength.", icon: "pills", note: "by prescription, with a receipt" },
            { amount: 2000, title: "A social worker's visit", text: "Four hours: cleaning, bathing, paying bills, a trip to the clinic. One visit a week is already a different life.", icon: "visit", note: "once a week" },
            { amount: 5000, title: "Small home repairs", text: "A tap, a socket, a door lock, insulating a window for winter. The handyman comes with tools and materials.", icon: "tools", note: "handyman + materials" },
            { amount: 15000, title: "A whole month of care", text: "Groceries, medicines, weekly visits and a phone number you can call at any time.", icon: "home", note: "one person — a whole month" },
          ]}
          actionLabel="Help with this amount"
          chipsLabel="Amount"
          sliderLabel="Donation amount"
          hint="drag the slider or tap an amount →"
          thisLabel="that's"
        />
      </div>
      <div id="stories">
        <Charity002
          {...paper}
          eyebrow="Who we help"
          title="Letters from the flats we visit every week"
          lede="We don't tell stories on behalf of our wards — they write themselves. Sometimes by hand, sometimes dictated to a social worker. We edit nothing."
          hint="drag the strip"
          stories={STORIES}
          openLabel="Open the letter"
          closeLabel="Fold"
          prevLabel="Back"
          nextLabel="Forward"
          stampLines={["Russian", "Post"]}
          fromLabel="from:"
        />
      </div>
      <div id="report">
        <Charity003
          {...paper}
          eyebrow="Reporting"
          title="Where every rouble went"
          lede="Once a year — an audit, once a quarter — a report on the site, once a month — a letter to donors with the numbers. We don't buy advertising: those we've helped tell people about us."
          years={[
            {
              year: "2025",
              note: "audit passed",
              items: [
                { label: "Groceries and medicines", value: 9_640_000 },
                { label: "Social workers: salaries", value: 6_120_000 },
                { label: "Repairs and equipment", value: 2_380_000 },
                { label: "Transport and logistics", value: 1_150_000 },
                { label: "Administration", value: 890_000 },
              ],
            },
            {
              year: "2024",
              note: "audit passed",
              items: [
                { label: "Groceries and medicines", value: 7_210_000 },
                { label: "Social workers: salaries", value: 4_480_000 },
                { label: "Repairs and equipment", value: 1_930_000 },
                { label: "Transport and logistics", value: 960_000 },
                { label: "Administration", value: 720_000 },
              ],
            },
            {
              year: "2023",
              items: [
                { label: "Groceries and medicines", value: 4_860_000 },
                { label: "Social workers: salaries", value: 2_940_000 },
                { label: "Repairs and equipment", value: 1_120_000 },
                { label: "Transport and logistics", value: 610_000 },
                { label: "Administration", value: 540_000 },
              ],
            },
          ]}
          stamp="on advertising"
          reportLabel="Open the annual report (PDF)"
          millionUnit="M"
          thousandUnit="k"
          decimalSeparator="."
          yearsLabel="Year"
          ringLabel="Spending in {year}: {total}"
          spentLine="spending in {year}"
        />
      </div>
      <div id="map">
        <Charity004
          {...paper}
          eyebrow="Where we work"
          title="Nine towns and forty villages in between"
          lede="We don't help «across Russia» — we help in the Tver region, where every ward can be reached within a day. That's verifiable and honest."
          region="Tver region"
          points={[
            { city: "Tver", count: 96, x: 52, y: 58, note: "since 2019" },
            { city: "Rzhev", count: 41, x: 30, y: 74 },
            { city: "Torzhok", count: 38, x: 40, y: 44 },
            { city: "Vyshny Volochyok", count: 32, x: 44, y: 22 },
            { city: "Kimry", count: 28, x: 74, y: 62 },
            { city: "Bezhetsk", count: 24, x: 70, y: 28, note: "new" },
            { city: "Kuvshinovo", count: 19, x: 24, y: 50 },
            { city: "Ostashkov", count: 18, x: 12, y: 36 },
            { city: "Konakovo", count: 16, x: 68, y: 78 },
          ]}
          unit="wards this week"
          mapLabel="{region}: {cities} towns, {total} wards"
          compassLabel="↑ north"
        />
      </div>
      <div id="team">
        <People024
          {...paper}
          eyebrow="Team"
          title="There are few of us, and we all have names"
          lede="Five people on staff, forty volunteers, one old «Largus». Everyone can be found in the report, everyone can be called."
          people={PEOPLE}
          moreLabel="volunteers we hug"
          initials={["AN", "LV", "SM", "YK"]}
          moreCountLine="{n} more"
          joinLabel="become one of them →"
        />
      </div>
      <div id="volunteer">
        <Charity005
          {...paper}
          eyebrow="Become a volunteer"
          title="Two hours a week is someone's Wednesday they're waiting for"
          lede="Pick what you can do and the days you're free. We'll find a ward near your home and introduce you in person — no ten-page forms."
          roles={[
            { label: "Driver", text: "Deliver groceries and medicines around your area", hours: 3 },
            { label: "Companion", text: "Call or visit to talk and read aloud", hours: 2 },
            { label: "Handyman", text: "Taps, sockets, locks, window insulation", hours: 4 },
            { label: "Home helper", text: "Cleaning, bathing, a trip to the clinic together", hours: 4 },
            { label: "Lawyer or accountant", text: "Sort out documents, benefits and bills", hours: 2 },
          ]}
          days={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
          namePlaceholder="Your name"
          actionLabel="I want to help"
          doneTitle="We've got your application"
          doneText="A coordinator will write within two days and invite you to a short get-to-know meeting."
          months={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
          helpedLine="helped {n} people today"
          rolesLegend="How would you like to help"
          daysLegend="Which days are you free"
          nameLabel="Name"
          badgeBrand="Warm Home"
          badgeNumber="volunteer No. {n}"
          namePlaceholderBadge="Your name"
          pickRoleLabel="Pick a role on the left"
          weekLabel="Days"
          hoursLabel="Hours a week"
          applicationLabel="Application"
          stampLabel="waiting for you"
        />
      </div>
      <Logocloud007 {...paper} label="supported by" names={["Tver Carriage Works", "Vita Pharmacy", "Sberbank", "Pyaterochka", "Rostelecom", "Vezyot Taxi", "Afanasy", "Tver Diocese", "Tochka", "Dom.ru"]} />
      <div id="events">
        <Event025
          {...paper}
          eyebrow="Events"
          title="Upcoming trips and meetings"
          lede="Every Saturday we go somewhere. The ticket is free, the dress code is comfortable shoes."
          events={[
            { day: "27", month: "Sep", weekday: "Saturday", title: "Autumn delivery: groceries and warm clothes", text: "We meet at the warehouse at 12 Korobkova, load up and drive to Rzhev and Kuvshinovo. Back by evening.", place: "Tver, the foundation's warehouse", time: "9:00 – 18:00", need: 12, joined: 7, note: "drivers needed", actionLabel: "Join the trip", actionHref: "#volunteer" },
            { day: "4", month: "Oct", weekday: "Saturday", title: "Insulating windows for winter", text: "Six flats in Torzhok: sealant, film, tea with the owners. We provide the tools.", place: "Torzhok", time: "10:00 – 16:00", need: 8, joined: 8, note: "no places left, thank you!", actionLabel: "Waiting list", actionHref: "#volunteer" },
            { day: "18", month: "Oct", weekday: "Saturday", title: "Calling day: 300 «how are you?»", text: "We call every ward, listen, write down what's needed. Can be done from home.", place: "Online", time: "11:00 – 15:00", need: 20, joined: 9, note: "can be done from home", actionLabel: "Sign up", actionHref: "#volunteer" },
            { day: "8", month: "Nov", weekday: "Saturday", title: "Annual meeting and tea with the wards", text: "We tell what we did over the year, show the numbers, introduce volunteers to those they help.", place: "Tver, Gorky Library", time: "14:00", need: 0, joined: 0, note: "bring the family", actionLabel: "Come along", actionHref: "#volunteer" },
          ]}
          joinedLine="{joined} of {need} signed up"
          fullLabel="no places left"
          leftLine="{n} more"
        />
      </div>
      <div id="donate">
        <Cta037
          {...paper}
          eyebrow="Help"
          title="One Wednesday a month — that's you"
          lede="A regular payment is the most valuable: we can plan visits a year ahead instead of from one fundraiser to the next. Cancel any time, with one email."
          onceLabel="Once"
          monthlyLabel="Monthly"
          monthlyNote="over a year — {year}. That's 12 visits to one person"
          actionLabel="Help"
          fine={["No fee for you", "Payment via YooKassa", "Unsubscribe with one email"]}
          doneTitle="Thank you. Truly."
          doneText="The receipt will come by email, and in a month — a letter about where the money went."
          image={`${PHOTOS}/hands.webp`}
          imageAlt="The hands of an old and a young person holding a bag of groceries"
          caption="Viktor Ilyich and Igor, a delivery in Torzhok"
          everyMonthLabel="every month"
          onceShortLabel="once"
          frequencyLabel="Frequency"
          amountsLabel="Amount"
          customLabel="Your own amount"
          perMonthSuffix=" / mo"
        />
      </div>
      <div id="documents">
        <Footer043
          {...paper}
          brand="Warm Home"
          legalName="The «Warm Home» charitable foundation for the elderly. Registered with the Ministry of Justice of the Russian Federation on 14.03.2018."
          thanks="thank you for reading down to the bank details"
          requisites={[
            { label: "Tax ID / KPP", value: "6950214477 / 695001001" },
            { label: "Reg. no.", value: "1186952004312" },
            { label: "Account", value: "40703810563000001842" },
            { label: "Bank", value: "Tver branch of Sberbank, BIC 042809679" },
          ]}
          documents={[
            { label: "Foundation charter", href: "#documents" },
            { label: "Annual report 2025", href: "#documents" },
            { label: "Auditor's report", href: "#documents" },
            { label: "Public offer agreement", href: "#documents" },
            { label: "Data processing policy", href: "#documents" },
          ]}
          contacts={[
            { label: "+7 (4822) 41-08-17", href: "tel:+74822410817" },
            { label: "help@teplydom.org", href: "mailto:help@teplydom.org" },
            { label: "Tver, 12 Korobkova St., warehouse 3", href: "#map" },
            { label: "Mon–Fri 10:00–19:00", href: "#contacts" },
          ]}
          socials={[
            { label: "Telegram", href: "#" },
            { label: "VK", href: "#" },
            { label: "Dzen", href: "#" },
          ]}
          legal={[
            { label: "Unsubscribe from the newsletter", href: "#" },
            { label: "Refund a payment", href: "#" },
          ]}
          copyright="© 2018–2026 Warm Home Foundation"
          socialsLabel="Social"
          requisitesTitle="Bank details"
          documentsTitle="Documents"
          contactsTitle="Contacts"
        />
      </div>
    </div>
  )
}
