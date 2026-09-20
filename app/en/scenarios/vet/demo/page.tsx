import type { CSSProperties } from "react"

import { Navbar035, type Navbar035Props } from "@/registry/blocks/navbar/navbar-035/navbar-035"
import { Hero035, type Hero035Props } from "@/registry/blocks/hero/hero-035/hero-035"
import { Vet001, type Vet001Props } from "@/registry/blocks/industry/vet-001/vet-001"
import { Pricing027, type Pricing027Props } from "@/registry/blocks/pricing/pricing-027/pricing-027"
import { Vet002, type Vet002Props } from "@/registry/blocks/industry/vet-002/vet-002"
import { Vet003, type Vet003Props } from "@/registry/blocks/industry/vet-003/vet-003"
import { People015, type People015Props } from "@/registry/blocks/team/people-015/people-015"
import { Vet004, type Vet004Props } from "@/registry/blocks/industry/vet-004/vet-004"
import { Testimonials027, type Testimonials027Props } from "@/registry/blocks/testimonials/testimonials-027/testimonials-027"
import { Contact023, type Contact023Props } from "@/registry/blocks/contact/contact-023/contact-023"
import { Footer034, type Footer034Props } from "@/registry/blocks/footer/footer-034/footer-034"

/**
 * English version of the "Vet clinic + grooming" demo: same blocks and
 * theme as `app/scenarios/vet/demo/page.tsx`, block text in English via
 * props.
 *
 * A cream "Paw" with a CSS pet face that follows the cursor, an emergency
 * button, a body map, a symptom checker, a live doctors' schedule, a
 * haircut slider and a diary of reviews. The pet switch in the hero also
 * switches the price list (the vibeui-vet:pet event).
 */
export const metadata = {
  title: "Paw — vet clinic and grooming at Sokol",
  description:
    "VibeUI «Vet clinic + grooming» scenario demo: a CSS pet face, an emergency button, price tickets, a body map, a symptom checker, doctors with today's schedule, a haircut slider, a diary of reviews, booking with a map.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fbf6ee",
  color: "#2b241f",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const cream = { tone: "light", accent: "#d9643a", ink: "#2b241f", background: "#fbf6ee" } as const

const PHOTOS = "/demo/vet"

const navbar: Navbar035Props = {
  brand: "Paw",
  caption: "vet clinic · grooming",
  links: [
    { label: "Services", href: "#services" },
    { label: "Symptoms", href: "#symptoms" },
    { label: "Doctors", href: "#doctors" },
    { label: "Grooming", href: "#grooming" },
    { label: "Contacts", href: "#contacts" },
  ],
  actionLabel: "Book a visit",
  navLabel: "Sections",
  menuLabel: "Menu",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
  openLine: "Open until {time}",
  closingLine: "Closing in {n} min",
  closedLine: "Closed · opens at {time}",
}

const hero: Hero035Props = {
  pets: [
    { key: "cat", label: "Cat", eyebrow: "Vet clinic and grooming at Sokol · 24/7", title: "We treat so gently *the cat won't notice*", lede: "Quiet rooms with no barking, appointments without queues and doctors who pet first, examine second. Vaccines, teeth, neutering — all in one place.", bubble: "Meow. Nobody even held me.", image: `${PHOTOS}/cat-face.png`, imageAlt: "A ginger cat looking at the camera" },
    { key: "dog", label: "Dog", eyebrow: "Vet clinic and grooming at Sokol · 24/7", title: "We treat so gently *the tail keeps wagging*", lede: "A separate entrance for dogs, scales right in the lobby and a treat after the shot. Orthopedist, dentist, grooming — and nobody rubs you the wrong way.", bubble: "Woof. They give treats here.", image: `${PHOTOS}/dog-face.png`, imageAlt: "A corgi with its tongue out" },
    { key: "rabbit", label: "Rabbit", eyebrow: "Vet clinic and grooming at Sokol · 24/7", title: "We treat so gently *the ears stay up*", lede: "A rabbit and rodent vet every day, not «on Thursdays». Teeth, digestion, nail trimming — quick, quiet and stress-free for the long-eared.", bubble: "Brought my own carrot.", image: `${PHOTOS}/rabbit-face.png`, imageAlt: "A grey lop-eared rabbit" },
  ],
  primaryLabel: "Book a visit",
  secondaryLabel: "What hurts?",
  stats: [
    { value: 12480, label: "tails treated since 2017" },
    { value: 4.9, suffix: " / 5", label: "average rating on maps" },
    { value: 18, label: "minutes — average wait for a visit" },
  ],
  switchLabel: "Who do you have",
  decimalSeparator: ".",
}

const emergency: Vet001Props = {
  label: "Urgent",
  title: "What to do right now",
  lede: "Call — we're already preparing the room. While you're on the way:",
  steps: ["Don't feed or water if there's vomiting or an injury", "Wrap in a towel, don't press on the belly", "Poisoning — don't induce vomiting yourself, bring the packaging", "Bleeding — a tight bandage, not a tourniquet", "Tell us how much your pet weighs"],
  note: "A doctor on duty around the clock, no appointment needed. At night — entrance from the courtyard, button by the door.",
  address: "62 Leningradsky Ave., entrance from the park side",
  sectionLabel: "Emergency help",
  closeLabel: "Close",
}

const pricing: Pricing027Props = {
  eyebrow: "Services and prices",
  title: "No «ask at the front desk»",
  lede: "Prices are fixed and written down in advance. If something beyond the plan comes up during the visit — we ask first, then do it.",
  groups: [
    {
      key: "cat",
      label: "Cats",
      items: [
        { name: "First visit to a GP", note: "Exam, treatment plan, answers to every «is this normal?»", price: "1 200 ₽", popular: true },
        { name: "Combined vaccine", note: "Nobivac Tricat + rabies, passport filled in", price: "2 400 ₽" },
        { name: "Cat spaying", note: "Laparoscopic, no stitches to remove, home the same day", price: "9 800 ₽", popular: true },
        { name: "Cat neutering", note: "20 minutes under anaesthesia, demanding food by the evening", price: "4 500 ₽" },
        { name: "Ultrasonic teeth cleaning", note: "Under sedation, with polishing", price: "6 900 ₽" },
        { name: "Nail trimming", note: "While you wait for the visit — free", price: "400 ₽" },
      ],
    },
    {
      key: "dog",
      label: "Dogs",
      items: [
        { name: "First visit to a GP", note: "Exam, weighing, plan, a treat after", price: "1 400 ₽", popular: true },
        { name: "Combined vaccine", note: "Nobivac DHPPi + Lepto + rabies", price: "2 600 ₽" },
        { name: "Spaying", note: "Laparoscopic, up to 25 kg", price: "14 500 ₽" },
        { name: "Orthopedist visit", note: "Limping, dysplasia, «jumps, but weirdly»", price: "2 200 ₽", popular: true },
        { name: "Ultrasonic teeth cleaning", note: "Under sedation, with polishing", price: "8 400 ₽" },
        { name: "Microchipping", note: "Chip + registration, 5 minutes", price: "1 500 ₽" },
      ],
    },
    {
      key: "rabbit",
      label: "Rabbits and rodents",
      items: [
        { name: "Exotic vet visit", note: "A rabbit and rodent doctor — every day", price: "1 500 ₽", popular: true },
        { name: "Teeth filing", note: "Incisors, under light sedation", price: "2 800 ₽" },
        { name: "Rabbit neutering", note: "Inhalation anaesthesia, home in 3 hours", price: "5 900 ₽" },
        { name: "RHD + myxomatosis vaccine", note: "Every six months, passport filled in", price: "1 900 ₽" },
        { name: "Nail trimming", note: "Five minutes and a carrot", price: "350 ₽" },
        { name: "Abdominal ultrasound", note: "«Hasn't eaten since yesterday» — that's here, urgently", price: "2 300 ₽" },
      ],
    },
  ],
  actionLabel: "Book a visit",
  fine: "The full price list — 140 items — is available at reception and sent via messenger. Night visits from 22:00 to 8:00 cost 30% more.",
  tabsLabel: "Pet type",
  popularLabel: "most popular",
}

const bodyMap: Vet002Props = {
  eyebrow: "Pet map",
  title: "Tap where it hurts",
  lede: "A dot on the diagram — a service and a price. Can't find yours — message the front desk, we'll work out who to see.",
  spots: [
    { key: "ears", label: "Ears", x: 31, y: 22, service: "Ear cleaning and otoscope exam", price: "900 ₽", duration: "15 minutes", text: "Shaking the head, scratching, smell — we look at the canal, take a swab, clean. Drops are chosen for what we find, not «just in case»." },
    { key: "eyes", label: "Eyes", x: 24, y: 17, service: "Ophthalmologist visit", price: "1 800 ₽", duration: "30 minutes", text: "Watery, red, third eyelid — slit-lamp exam, Schirmer test and fluorescein. No «put some drops in»." },
    { key: "teeth", label: "Teeth", x: 17, y: 32, service: "Ultrasonic teeth cleaning", price: "from 6 900 ₽", duration: "≈ 1 hour", text: "Under sedation, with polishing and X-rays. Bad breath isn't «the breed», it's tartar. Gone in one visit." },
    { key: "coat", label: "Coat and skin", x: 52, y: 36, service: "Dermatologist visit", price: "1 600 ₽", duration: "30 minutes", text: "Itching, hair loss, dandruff — a scraping and a Wood's lamp on the spot. If it's an allergy, we'll help find out to what exactly." },
    { key: "belly", label: "Belly", x: 48, y: 60, service: "Abdominal ultrasound", price: "2 300 ₽", duration: "25 minutes", text: "Not eating, vomiting, sitting oddly — we look right away, no appointment for tomorrow. Report and images sent via messenger." },
    { key: "paws", label: "Paws and nails", x: 31, y: 86, service: "Nail trimming + paw pad check", price: "400 ₽", duration: "10 minutes", text: "While you wait for the visit — free. Limping — then to the orthopedist, X-ray the same day." },
    { key: "tail", label: "Tail", x: 86, y: 16, service: "Surgeon visit", price: "1 500 ₽", duration: "20 minutes", text: "Caught in a door, won't lift it, «hangs» — exam, X-ray if needed. Tail's fine — everything's fine." },
  ],
  imageAlt: "A beagle in profile",
  actionLabel: "Book a visit",
  legendLabel: "Body parts",
}

const symptoms: Vet003Props = {
  eyebrow: "Something wrong?",
  title: "Tick what you've noticed",
  lede: "We'll tell you which doctor and how urgent. It's not a diagnosis — a route, so you don't have to guess at three in the morning.",
  symptoms: [
    { label: "Not eating for a second day", doctor: "GP", urgency: 2 },
    { label: "Vomiting more than twice", doctor: "GP", urgency: 2 },
    { label: "Breathing hard, blue tongue", doctor: "Doctor on duty", urgency: 3 },
    { label: "Can't pee", doctor: "Doctor on duty", urgency: 3 },
    { label: "Ate something wrong", doctor: "Doctor on duty", urgency: 3 },
    { label: "Limping", doctor: "Orthopedist", urgency: 1 },
    { label: "Itching, losing hair", doctor: "Dermatologist", urgency: 1 },
    { label: "Bad breath", doctor: "Dentist", urgency: 1 },
    { label: "Shaking the head", doctor: "GP", urgency: 1 },
    { label: "Watery eyes", doctor: "Ophthalmologist", urgency: 1 },
    { label: "Blood in urine", doctor: "GP", urgency: 2 },
    { label: "Lethargic, hiding", doctor: "GP", urgency: 2 },
    { label: "Seizures", doctor: "Doctor on duty", urgency: 3 },
    { label: "Drinking a lot", doctor: "GP", urgency: 2 },
    { label: "A lump under the skin", doctor: "Surgeon", urgency: 1 },
  ],
  levels: ["routine, this week", "within a day", "urgent, right now"],
  actionLabel: "Book a visit",
  disclaimer: "If in doubt — call. The doctor on duty will answer and tell you whether to come now. It's free.",
  emptyText: "Nothing ticked yet. Tap the symptoms above — the cards will assemble themselves.",
  chipsLabel: "Symptoms",
  scaleTitles: ["Urgency scale", "You can book a routine visit", "Today, don't put it off", "Come now"],
  scaleEmpty: "Tick the symptoms — the slider will show how serious it is.",
  scaleLine: "Ticked: {n}. We look at the most worrying symptom.",
  scaleUnknown: "Urgency not determined",
  scaleLabel: "Urgency: {level}",
  scaleTicks: ["routine", "a day", "now"],
  callLabel: "Call {phone}",
}

const doctors: People015Props = {
  eyebrow: "Doctors",
  title: "Who's at the clinic today",
  lede: "Four doctors, each with their own specialty. The schedule is live: see who you can get to today.",
  doctors: [
    { name: "Marina Sokolova", role: "Chief doctor, GP", photo: `${PHOTOS}/doctor-01.webp`, tags: ["cats", "ultrasound", "endocrinology"], days: [1, 2, 3, 4, 5], hours: "9:00–17:00", since: "in practice since 2009" },
    { name: "Artem Gusev", role: "Surgeon, orthopedist", photo: `${PHOTOS}/doctor-02.webp`, tags: ["surgery", "fractures", "laparoscopy"], days: [1, 3, 5, 6], hours: "11:00–21:00", since: "in practice since 2013" },
    { name: "Dasha Kim", role: "Exotic and small mammal vet", photo: `${PHOTOS}/doctor-03.webp`, tags: ["rabbits", "rodents", "birds"], days: [0, 2, 4, 6], hours: "10:00–19:00", since: "in practice since 2017" },
    { name: "Ilya Romanov", role: "Dentist, doctor on duty", photo: `${PHOTOS}/doctor-04.webp`, tags: ["teeth", "night shifts", "intensive care"], days: [0, 1, 2, 3, 4, 5, 6], hours: "21:00–9:00", since: "in practice since 2015" },
  ],
  actionLabel: "All 11 doctors",
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  dayShort: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  scheduleTitle: "Visiting hours",
  scheduleNote: "The day of the week is set on your device.",
  todayLine: "Today, {day}",
  onDutyLine: "On duty: {list}",
  nobodyLine: "No routine visits today, the doctor on duty is in.",
  todayHoursLine: "today {hours}",
  weekLabel: "Visiting days",
}

const grooming: Vet004Props = {
  eyebrow: "Grooming",
  title: "Turn the dial — and see what you'll get",
  lede: "Cut length, dog size and extras — the price is calculated instantly. The groomer will look at the coat and say if the plan is worth changing.",
  sizes: [
    { key: "s", label: "S", note: "up to 5 kg", price: 2200 },
    { key: "m", label: "M", note: "5–15 kg", price: 3200 },
    { key: "l", label: "L", note: "over 15 kg", price: 4500 },
  ],
  extras: [
    { key: "wash", label: "Wash and dry", price: 900 },
    { key: "nails", label: "Nails", price: 350 },
    { key: "ears", label: "Ears", price: 400 },
    { key: "teeth", label: "Teeth brushing", price: 500 },
    { key: "mats", label: "Mats", price: 800 },
  ],
  marks: [
    { upTo: 5, label: "clippers — summer and mats" },
    { upTo: 12, label: "short and neat" },
    { upTo: 25, label: "styled, like in a magazine" },
    { upTo: 99, label: "just wash and tidy up" },
  ],
  imageAlt: "A spitz before and after a haircut",
  actionLabel: "Book a haircut",
  mmUnit: "mm",
  stageLabel: "A dog with a {n} mm haircut",
  lengthLabel: "Coat length after the cut",
  sizeLabel: "Size",
  extrasLabel: "Add",
  summaryLine: "≈ {minutes} minutes · {size}, {length} mm",
}

const diary: Testimonials027Props = {
  eyebrow: "Diary",
  title: "Notes from owners",
  lede: "Reviews from maps and messenger — as is, with names and dates. Owners send the photos themselves.",
  entries: [
    { pet: "Baton", owner: "Olya, owner", date: "14 March", text: "Neutering. In the morning I was the one scared, by evening he was demanding dinner. Didn't touch the stitches, no cone needed.", photo: `${PHOTOS}/diary-01.webp`, sticker: "wasn't scared" },
    { pet: "Miss Plush", owner: "Artem and Nastya", date: "2 April", text: "Lion cut. Groomer Lena showed before and after photos and asked if we were sure. We were. No regrets.", photo: `${PHOTOS}/diary-02.webp`, sticker: "lion" },
    { pet: "Funtik", owner: "Grandpa Misha", date: "19 April", text: "Stopped eating at night. Came at two in the morning, ultrasound done right away. A day later he was eating hay as if nothing happened.", photo: `${PHOTOS}/diary-03.webp`, sticker: "24/7" },
    { pet: "Zosya", owner: "Katya, owner", date: "5 May", text: "Teeth cleaning. No smell, eats crunchy food, kisses me on the nose. The orthopedist checked a paw while at it — free.", photo: `${PHOTOS}/diary-04.webp`, sticker: "5 / 5" },
    { pet: "Keks", owner: "The Ivanov family", date: "23 May", text: "First vaccine. The doctor gave a treat before the shot, not after — and the puppy never figured out what happened.", sticker: "first time" },
    { pet: "Marcel", owner: "Ira, owner", date: "8 June", text: "The dermatologist found the allergen in one visit. Three years of scratching, a month without.", sticker: "found it" },
  ],
  hint: "drag the strip",
  trackLabel: "Reviews",
}

const contact: Contact023Props = {
  eyebrow: "Booking",
  title: "Come in, we're already warming the table",
  lede: "Leave your phone number — the front desk will call back within 15 minutes, find a time and tell you what to bring.",
  address: "62 Leningradsky Avenue",
  metro: "Sokol · 6 minutes on foot, entrance from the park side",
  hours: [
    { label: "Visits by appointment", value: "9:00–21:00, seven days a week" },
    { label: "Emergency help", value: "around the clock" },
    { label: "Grooming", value: "10:00–20:00, except Monday" },
    { label: "Pharmacy and food", value: "9:00–21:00" },
  ],
  mapLabel: "Open in maps",
  petOptions: ["Cat", "Dog", "Rabbit or rodent", "Bird", "Someone else"],
  actionLabel: "Book a visit",
  doneTitle: "Booked",
  doneText: "We'll call back within 15 minutes. If it's urgent — call us, the doctor on duty is in.",
  nameLabel: "Your name",
  phoneLabel: "Phone",
  petLabel: "Who do you have",
  whenLabel: "When is convenient",
  noteLabel: "What happened — briefly",
  notePlaceholder: "What happened",
  fine: "By pressing the button you agree that we'll call you back. Nothing more.",
  mapAria: "Map: {address}",
}

const footer: Footer034Props = {
  brand: "Paw",
  caption: "Vet clinic and grooming at Sokol. We treat cats, dogs, rabbits and everyone who fits in a carrier.",
  address: "62 Leningradsky Avenue · Sokol metro",
  hours: "Visits 9:00–21:00 · emergencies — around the clock",
  columns: [
    { title: "Services", links: [{ label: "General practice", href: "#services" }, { label: "Surgery", href: "#services" }, { label: "Dentistry", href: "#services" }, { label: "Grooming", href: "#grooming" }, { label: "Exotics", href: "#services" }] },
    { title: "Clinic", links: [{ label: "Doctors", href: "#doctors" }, { label: "Prices", href: "#services" }, { label: "Reviews", href: "#diary" }, { label: "Careers", href: "#" }] },
    { title: "Help", links: [{ label: "Symptom checker", href: "#symptoms" }, { label: "What to bring", href: "#" }, { label: "Preparing for surgery", href: "#" }, { label: "Questions", href: "#" }] },
  ],
  socials: [
    { label: "Telegram", href: "#" },
    { label: "VK", href: "#" },
    { label: "Maps", href: "#" },
  ],
  legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  license: "Veterinary licence No. 77-VD-004182 of 12.03.2019 · Paw LLC · reg. no. 1197746001234",
  copyright: "© 2017–2026 Paw",
}

export default function VetDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar035 {...cream} {...navbar} />
      <div id="top">
        <Hero035 {...cream} {...hero} />
      </div>
      <Vet001 {...cream} {...emergency} />
      <div id="services">
        <Pricing027 {...cream} {...pricing} background="#f4ecdf" />
      </div>
      <div id="body">
        <Vet002 {...cream} {...bodyMap} />
      </div>
      <div id="symptoms">
        <Vet003 {...cream} {...symptoms} background="#f4ecdf" />
      </div>
      <div id="doctors">
        <People015 {...cream} {...doctors} />
      </div>
      <div id="grooming">
        <Vet004 {...cream} {...grooming} background="#f4ecdf" />
      </div>
      <div id="diary">
        <Testimonials027 {...cream} {...diary} />
      </div>
      <div id="contacts">
        <Contact023 {...cream} {...contact} background="#f4ecdf" />
      </div>
      <Footer034 {...cream} {...footer} />
    </div>
  )
}
