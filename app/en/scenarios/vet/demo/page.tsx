import type { CSSProperties } from "react"

import { Navbar035, type Navbar035Props } from "@/registry/blocks/navbar/navbar-035/navbar-035"
import { Hero047, type Hero047Props } from "@/registry/blocks/hero/hero-047/hero-047"
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
 * A cream "Paw": a cat leaps into frame and freezes on the first screen;
 * then an emergency button, a body map, a symptom checker, a live doctors'
 * schedule, a haircut slider and a diary of reviews.
 */
export const metadata = {
  title: "Paw — vet clinic and grooming at Sokol",
  description:
    "VibeUI «Vet clinic + grooming» scenario demo: an intro hero with a cat, an emergency button, price tickets, a body map, a symptom checker, doctors with today's schedule, a haircut slider, a diary of reviews, booking with a map.",
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

const hero: Hero047Props = {
  wordmark: "Paw",
  eyebrow: "Vet clinic and grooming · Sokol",
  title: ["Gentle care.", "No queues,", "no stress."],
  lede: "Therapy, vaccination, dentistry and grooming in one clinic. Separate rooms for cats and dogs, a doctor on duty around the clock.",
  primaryLabel: "Book a visit",
  primaryHint: "free slots available today",
  stats: [
    { value: 24, suffix: "/7", label: "a doctor on duty, no appointment" },
    { value: 4.9, suffix: " / 5", label: "average rating on maps" },
    { value: 18, label: "minutes — average wait for a visit" },
  ],
  decimalSeparator: ".",
  skipLabel: "Skip",
  replayLabel: "Watch again",
}

const emergency: Vet001Props = {
  label: "Urgent",
  title: "What to do right now",
  lede: "Call us — we will prepare the room. While you are on the way:",
  steps: ["Don't feed or water if there's vomiting or an injury", "Wrap in a towel, don't press on the belly", "Poisoning — don't induce vomiting yourself, bring the packaging", "Bleeding — a tight bandage, not a tourniquet", "Tell us how much your pet weighs"],
  note: "A doctor on duty around the clock, no appointment needed. At night — entrance from the courtyard, button by the door.",
  address: "62 Leningradsky Ave., entrance from the park side",
  sectionLabel: "Emergency help",
  closeLabel: "Close",
}

const pricing: Pricing027Props = {
  eyebrow: "Services and prices",
  title: "Fixed prices",
  lede: "Service prices are known in advance. If anything beyond the plan is needed during the visit, the doctor agrees it with you before starting.",
  groups: [
    {
      key: "cat",
      label: "Cats",
      items: [
        { name: "First visit to a GP", note: "Exam, treatment plan, answers to the owner's questions", price: "1 200 ₽", popular: true },
        { name: "Combined vaccine", note: "Nobivac Tricat + rabies, passport filled in", price: "2 400 ₽" },
        { name: "Cat spaying", note: "Laparoscopic, no stitches to remove, home the same day", price: "9 800 ₽", popular: true },
        { name: "Cat neutering", note: "About 20 minutes under general anaesthesia", price: "4 500 ₽" },
        { name: "Ultrasonic teeth cleaning", note: "Under sedation, with polishing", price: "6 900 ₽" },
        { name: "Nail trimming", note: "Free with a booked visit", price: "400 ₽" },
      ],
    },
    {
      key: "dog",
      label: "Dogs",
      items: [
        { name: "First visit to a GP", note: "Exam, weighing, treatment plan", price: "1 400 ₽", popular: true },
        { name: "Combined vaccine", note: "Nobivac DHPPi + Lepto + rabies", price: "2 600 ₽" },
        { name: "Spaying", note: "Laparoscopic, up to 25 kg", price: "14 500 ₽" },
        { name: "Orthopedist visit", note: "Limping, dysplasia, gait problems", price: "2 200 ₽", popular: true },
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
        { name: "Nail trimming", note: "About five minutes", price: "350 ₽" },
        { name: "Abdominal ultrasound", note: "Urgent if not eating for over a day", price: "2 300 ₽" },
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
  title: "Choose what concerns you",
  lede: "Each dot on the diagram is a service with its price. If yours is not there, the front desk will tell you which doctor to see.",
  spots: [
    { key: "ears", label: "Ears", x: 31, y: 22, service: "Ear cleaning and otoscope exam", price: "900 ₽", duration: "15 minutes", text: "Shaking the head, scratching, smell — we look at the canal, take a swab, clean. Drops are prescribed based on the results." },
    { key: "eyes", label: "Eyes", x: 24, y: 17, service: "Ophthalmologist visit", price: "1 800 ₽", duration: "30 minutes", text: "Watery, red, third eyelid — slit-lamp exam, Schirmer test and fluorescein." },
    { key: "teeth", label: "Teeth", x: 17, y: 32, service: "Ultrasonic teeth cleaning", price: "from 6 900 ₽", duration: "≈ 1 hour", text: "Under sedation, with polishing and X-rays. Bad breath is usually caused by tartar, which we remove in one visit." },
    { key: "coat", label: "Coat and skin", x: 52, y: 36, service: "Dermatologist visit", price: "1 600 ₽", duration: "30 minutes", text: "Itching, hair loss, dandruff — a scraping and a Wood's lamp on the spot. If it's an allergy, we'll help find out to what exactly." },
    { key: "belly", label: "Belly", x: 48, y: 60, service: "Abdominal ultrasound", price: "2 300 ₽", duration: "25 minutes", text: "Not eating, vomiting, sitting oddly — we look right away, no appointment for tomorrow. Report and images sent via messenger." },
    { key: "paws", label: "Paws and nails", x: 31, y: 86, service: "Nail trimming + paw pad check", price: "400 ₽", duration: "10 minutes", text: "While you wait for the visit — free. Limping — then to the orthopedist, X-ray the same day." },
    { key: "tail", label: "Tail", x: 86, y: 16, service: "Surgeon visit", price: "1 500 ₽", duration: "20 minutes", text: "Injury or the pet will not lift its tail — a surgeon exam, X-ray if needed." },
  ],
  imageAlt: "A beagle in profile",
  actionLabel: "Book a visit",
  legendLabel: "Body parts",
}

const symptoms: Vet003Props = {
  eyebrow: "Symptoms",
  title: "Tick what you've noticed",
  lede: "We'll tell you which doctor and how urgent. It is not a diagnosis but a route to help you decide quickly at any time of day.",
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
  disclaimer: "If in doubt, call us. The doctor on duty will advise free of charge and tell you whether to come now.",
  emptyText: "No symptoms selected. Tick them above to see doctor recommendations.",
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
    { name: "Daria Kim", role: "Exotic and small mammal vet", photo: `${PHOTOS}/doctor-03.webp`, tags: ["rabbits", "rodents", "birds"], days: [0, 2, 4, 6], hours: "10:00–19:00", since: "in practice since 2017" },
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
  title: "Calculate the grooming price",
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
    { upTo: 25, label: "styled cut" },
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
  eyebrow: "Reviews",
  title: "Owner reviews",
  lede: "Reviews from maps and messenger — as is, with names and dates. Owners send the photos themselves.",
  entries: [
    { pet: "Baton", owner: "Olga", date: "14 March", text: "Neutering went smoothly: by the evening he was eating again. The stitches caused no trouble, no cone needed.", photo: `${PHOTOS}/diary-01.webp`, sticker: "no stress" },
    { pet: "Miss Plush", owner: "Artem and Anastasia", date: "2 April", text: "A styled cut. Groomer Elena showed before and after photos and agreed the result with us in advance. We are very pleased.", photo: `${PHOTOS}/diary-02.webp`, sticker: "grooming" },
    { pet: "Funtik", owner: "Mikhail", date: "19 April", text: "Our rabbit stopped eating at night. We came at two in the morning and got an ultrasound right away. A day later his appetite was back.", photo: `${PHOTOS}/diary-03.webp`, sticker: "24/7" },
    { pet: "Zosya", owner: "Ekaterina", date: "5 May", text: "Teeth cleaning: the smell is gone and she eats dry food again. The orthopedist also checked a paw free of charge.", photo: `${PHOTOS}/diary-04.webp`, sticker: "5 / 5" },
    { pet: "Keks", owner: "The Ivanov family", date: "23 May", text: "The puppy's first vaccine. The doctor was calm and gentle, and the puppy went through it without stress.", sticker: "first vaccine" },
    { pet: "Marcel", owner: "Irina", date: "8 June", text: "The dermatologist found the allergen in one visit. Three years of scratching, a month without.", sticker: "result" },
  ],
  hint: "scroll the strip",
  trackLabel: "Reviews",
}

const contact: Contact023Props = {
  eyebrow: "Booking",
  title: "Book a visit",
  lede: "Leave your phone number — the front desk will call back within 15 minutes, find a time and explain how to prepare for the visit.",
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
  doneTitle: "Request received",
  doneText: "We'll call back within 15 minutes. If it's urgent — call us, the doctor on duty is in.",
  nameLabel: "Your name",
  phoneLabel: "Phone",
  petLabel: "Who do you have",
  whenLabel: "When is convenient",
  noteLabel: "What happened — briefly",
  notePlaceholder: "What happened",
  fine: "By pressing the button you agree to a call back to arrange the visit.",
  mapAria: "Map: {address}",
}

const footer: Footer034Props = {
  brand: "Paw",
  caption: "Vet clinic and grooming at Sokol. We treat cats, dogs, rabbits, rodents and birds.",
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
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media (min-width:56rem){#top{margin-top:-4.25rem}}`}
      </style>
      <Navbar035 {...cream} {...navbar} />
      <div id="top">
        <Hero047 accent={cream.accent} ink={cream.ink} background={cream.background} {...hero} />
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
