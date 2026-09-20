import type { CSSProperties } from "react"

import { Navbar039 } from "@/registry/blocks/navbar/navbar-039/navbar-039"
import { Hero039 } from "@/registry/blocks/hero/hero-039/hero-039"
import { Language001 } from "@/registry/blocks/language/language-001/language-001"
import { Bento008 } from "@/registry/blocks/bento/bento-008/bento-008"
import { Language002 } from "@/registry/blocks/language/language-002/language-002"
import { Language003 } from "@/registry/blocks/language/language-003/language-003"
import { People019 } from "@/registry/blocks/team/people-019/people-019"
import { Pricing031 } from "@/registry/blocks/pricing/pricing-031/pricing-031"
import { Testimonials031 } from "@/registry/blocks/testimonials/testimonials-031/testimonials-031"
import { Cta032 } from "@/registry/blocks/cta/cta-032/cta-032"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Footer038 } from "@/registry/blocks/footer/footer-038/footer-038"

/**
 * English version of the "Online language school" demo: same blocks and
 * theme as `app/scenarios/language/demo/page.tsx`, text in English via
 * props.
 *
 * A 2026 notebook: warm paper, a barely visible grid and ruling, ink-blue
 * text and a coral marker, handwritten notes in the margins. The site is
 * alive: the word in the headline translates itself, the lesson dialogue
 * types out, the level test sets a filter on the schedule, the vocabulary
 * chart draws itself, the teachers tilt after the cursor.
 */
export const metadata = {
  title: "Slovo — an online school of English, Spanish and Italian",
  description:
    "VibeUI «Online language school» scenario demo: a hero with a translating word and a live dialogue, a level test with an A1–C1 scale, a group schedule with the nearest start, a progress chart, teachers with accents, plans with a calculator and a comparison, «before → after» reviews, a trial lesson form, questions and a footer.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fbfaf7",
  color: "#1b2a6b",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const notebook = { tone: "light", accent: "#ff6b4a", ink: "#1b2a6b", background: "#fbfaf7" } as const

const TEACHERS = [
  { name: "Emma Whitfield", role: "English · native speaker", from: "Manchester", years: 9, note: "favourite word — serendipity", accent: "Mancunian", image: "/demo/language/teacher-01.webp", imageAlt: "Emma Whitfield, English teacher" },
  { name: "Diego Ferrer", role: "Spanish · native speaker", from: "Valencia", years: 7, note: "favourite word — sobremesa", accent: "Valencian", image: "/demo/language/teacher-02.webp", imageAlt: "Diego Ferrer, Spanish teacher" },
  { name: "Giulia Rinaldi", role: "Italian · native speaker", from: "Bologna", years: 6, note: "favourite word — abbiocco", accent: "Bolognese", image: "/demo/language/teacher-03.webp", imageAlt: "Giulia Rinaldi, Italian teacher" },
  { name: "Anna Severova", role: "English · methodologist", from: "Petersburg", years: 12, note: "favourite word — petrichor", accent: "RP, almost BBC", image: "/demo/language/teacher-04.webp", imageAlt: "Anna Severova, the school's methodologist" },
]

const FAQ = [
  { question: "I'm a complete beginner. Won't I feel embarrassed in a group?", answer: "«From scratch» groups are made up only of beginners — everyone is on the same page of the notebook. For the first two weeks we speak in short phrases, and the teacher doesn't let anyone «drop out»." },
  { question: "What if I miss a lesson?", answer: "The recording and the notes arrive the same evening, homework can be handed in as a voice message. Missed more than two in a row — the teacher offers a short catch-up lesson for free." },
  { question: "Can I switch to another group?", answer: "Yes, at any time: if the group turned out too fast or too slow, the methodologist moves you within a week, and the money is recalculated." },
  { question: "How does a lesson with a native speaker go?", answer: "Every fourth lesson is led by a native speaker on the week's topic. They speak at their own pace, and you get used to a live accent rather than a newsreader's." },
  { question: "How do I pay and can I get a refund?", answer: "Monthly by card, the receipt comes by email. Unused lessons are refunded in full — no explanations needed, within three working days." },
]

export default function LanguageDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar039
        {...notebook}
        brand="Slovo"
        caption="language school"
        links={[
          { label: "Level test", href: "#test" },
          { label: "How we teach", href: "#how" },
          { label: "Schedule", href: "#schedule" },
          { label: "Teachers", href: "#teachers" },
          { label: "Prices", href: "#pricing" },
        ]}
        actionLabel="Trial lesson"
        navLabel="Sections"
        menuLabel="Menu"
        menuOpenLabel="Open menu"
        menuCloseLabel="Close menu"
        langsLabel="Languages"
      />
      <div id="top">
        <Hero039
          {...notebook}
          eyebrow="Online school · since 2019"
          titleStart="In three months you'll tell this story"
          words={[
            { word: "in English", lang: "EN" },
            { word: "in Spanish", lang: "ES" },
            { word: "in Italian", lang: "IT" },
          ]}
          lede="English, Spanish and Italian in groups of up to six. Conversation from the first lesson, native-speaker teachers once a week, a notebook with homework — and not a single table of irregular verbs to memorise."
          primaryLabel="Take the level test"
          secondaryLabel="Free trial lesson"
          trust="1 240 students in a year · 4.9 on Yandex"
          chatTitle="Lesson 12 · Thursday 19:30"
          studentName="Masha"
          messages={[
            { who: "teacher", text: "Hi Masha! How was your weekend?", note: "the teacher opens with small talk" },
            { who: "student", text: "It was great, I went to the mountains with friends." },
            { who: "teacher", text: "Nice! Did you go hiking or just relax?", note: "a follow-up question keeps the story going" },
            { who: "student", text: "We hiked for five hours. My legs still hurt." },
            { who: "teacher", text: "Ha! Then today we talk about the past — you already use it perfectly.", note: "the grammar topic comes from the conversation" },
          ]}
          sticker="homework: talk about your weekend"
          chatLabel="A lesson excerpt"
          typingLabel="typing"
        />
      </div>
      <div id="test">
        <Language001
          {...notebook}
          eyebrow="two minutes, honestly"
          title="Find out your level before the first lesson"
          lede="Five grammar questions — and we'll show your level on the scale and the group where you'll be neither bored nor scared."
          levels={[
            { code: "A1", label: "Beginner", can: "Introduce yourself, order a coffee and ask the way — slowly, but you'll be understood.", group: "A1 · «from scratch», Tuesday and Thursday 19:30, starts 5 October" },
            { code: "A2", label: "Elementary", can: "Talk about yourself and your work, understand a simple text, arrange a meeting.", group: "A2 · «conversation start», Monday and Wednesday 20:00, starts 28 September" },
            { code: "B1", label: "Intermediate", can: "Keep up a conversation on any everyday topic, watch a series with subtitles.", group: "B1 · «confident conversation», Tuesday and Thursday 20:30, starts 5 October" },
            { code: "B2", label: "Upper-Intermediate", can: "Argue, joke, negotiate and read books in the original.", group: "B2 · «fluent», Monday and Wednesday 19:00, starts 12 October" },
            { code: "C1", label: "Advanced", can: "Understand accents, subtle humour, and write so an editor can't tell you from a native.", group: "C1 · «like a native», Saturday 12:00, starts 10 October" },
          ]}
          resultTitle="Your level"
          actionLabel="Join this group"
          retryLabel="Take it again"
          counterLine="Question {n} of {total}"
          hint="don't think too long — the first thought is usually right"
          groupLabel="the group for you"
        />
      </div>
      <div id="how">
        <Bento008
          {...notebook}
          eyebrow="how lessons go"
          title="An hour after which you want to keep talking"
          lede="No forty-minute lectures on the Present Perfect. The lesson is built so that you speak more than the teacher — and leave with homework you actually want to do."
          image="/demo/language/lesson.webp"
          imageAlt="A group lesson: the teacher and students on screen"
          imageCaption="group B1, Thursday, 19:30"
          lessonTitle="A lesson — 60 minutes on Zoom"
          lessonText="Five parts, and the longest is conversation. The teacher leads but doesn't solo."
          segments={[
            { label: "warm-up", minutes: 5 },
            { label: "homework", minutes: 10 },
            { label: "new topic", minutes: 15 },
            { label: "conversation", minutes: 25 },
            { label: "wrap-up", minutes: 5 },
          ]}
          groupTitle="Up to six people"
          groupText="Everyone speaks every lesson. Pairs change so you hear different voices."
          group={["MK", "AS", "DP", "OV", "IL", "EN"]}
          speakText="of the lesson you're the one talking, not listening"
          homeworkTitle="Homework in the notebook"
          homework="Record a voice message: three things that annoy you in the morning. In English, 40 seconds."
          nativeTitle="A native speaker once a week"
          nativeText="Every fourth lesson is led by a native speaker — you get used to the speed and the accent."
          recordTitle="After the lesson you keep"
          records={["The lesson recording for a week", "Notes with the new words", "A voice review of your homework"]}
          minutesUnit="min"
        />
      </div>
      <div id="schedule">
        <Language002
          {...notebook}
          eyebrow="schedule"
          title="Groups starting this autumn"
          lede="Pick a language and a level — we'll show where there are places. Lessons twice a week for an hour, morning and evening."
          languages={[
            { code: "en", label: "English" },
            { code: "es", label: "Spanish" },
            { code: "it", label: "Italian" },
          ]}
          groups={[
            { lang: "en", level: "A1", day: 2, time: "19:30", start: "2026-10-05", teacher: "Anna", seats: 3 },
            { lang: "en", level: "A1", day: 4, time: "19:30", start: "2026-10-05", teacher: "Anna", seats: 3 },
            { lang: "en", level: "A2", day: 1, time: "20:00", start: "2026-09-28", teacher: "Emma", seats: 1 },
            { lang: "en", level: "A2", day: 3, time: "20:00", start: "2026-09-28", teacher: "Emma", seats: 1 },
            { lang: "en", level: "B1", day: 2, time: "20:00", start: "2026-10-05", teacher: "Emma", seats: 4 },
            { lang: "en", level: "B1", day: 4, time: "20:00", start: "2026-10-05", teacher: "Emma", seats: 4 },
            { lang: "en", level: "B2", day: 1, time: "19:30", start: "2026-10-12", teacher: "Anna", seats: 2 },
            { lang: "en", level: "B2", day: 3, time: "19:30", start: "2026-10-12", teacher: "Anna", seats: 2 },
            { lang: "en", level: "C1", day: 6, time: "12:00", start: "2026-10-10", teacher: "Emma", seats: 0 },
            { lang: "es", level: "A1", day: 1, time: "19:30", start: "2026-10-05", teacher: "Diego", seats: 5 },
            { lang: "es", level: "A1", day: 3, time: "19:30", start: "2026-10-05", teacher: "Diego", seats: 5 },
            { lang: "es", level: "A2", day: 6, time: "11:00", start: "2026-10-17", teacher: "Diego", seats: 2 },
            { lang: "es", level: "B1", day: 2, time: "08:00", start: "2026-10-06", teacher: "Diego", seats: 3 },
            { lang: "es", level: "B1", day: 4, time: "08:00", start: "2026-10-06", teacher: "Diego", seats: 3 },
            { lang: "it", level: "A1", day: 2, time: "20:00", start: "2026-10-13", teacher: "Giulia", seats: 6 },
            { lang: "it", level: "A1", day: 4, time: "20:00", start: "2026-10-13", teacher: "Giulia", seats: 6 },
            { lang: "it", level: "A2", day: 7, time: "12:00", start: "2026-10-18", teacher: "Giulia", seats: 2 },
            { lang: "it", level: "B1", day: 5, time: "19:30", start: "2026-10-09", teacher: "Giulia", seats: 1 },
          ]}
          days={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          actionLabel="Didn't find your time? Write to us — we'll put a group together for you."
          months={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
          dayUnits={["day", "days", "days"]}
          seatUnits={["seat", "seats", "seats"]}
          nearestLabel="nearest start"
          todayLabel="today"
          inDaysLine="in {n} {days}"
          countingLabel="counting…"
          onRequestLabel="on request"
          calendarLabel="checking the calendar"
          writeLabel="write to us — we'll form a group"
          langFilterLabel="Language"
          langShort="language"
          allLabel="All"
          levelFilterLabel="Level"
          levelShort="level"
          anyLabel="Any"
          emptyText="No such groups yet — but we form new ones every two weeks."
          tableLabel="Group schedule"
          waitlistLabel="waiting list"
        />
      </div>
      <div id="progress">
        <Language003
          {...notebook}
          eyebrow="progress"
          title="What happens in three months if you don't quit"
          lede="We count the words you actually use in speech, not just the ones you've seen. Move the slider — we'll show what you'll be able to say by that week."
          milestones={[
            { week: 0, can: "introduce yourself and say where you're from" },
            { week: 2, can: "tell how your weekend went without getting lost" },
            { week: 4, can: "order dinner and argue about the bill" },
            { week: 6, can: "explain to a doctor what hurts and understand the answer" },
            { week: 8, can: "watch a series with subtitles in the language, not in your own" },
            { week: 10, can: "keep up small talk with a colleague from London" },
            { week: 12, can: "run a call with a native speaker without panicking" },
          ]}
          wordsLabel="active words"
          lessonsLabel="lessons"
          minutesLabel="minutes of speaking"
          byWeekLine="by week {n}:"
          chartLabel="Vocabulary by week: from {from} to {to} words"
          startLabel="start"
          weekShort="wk"
          wordsShort="w."
          weekLabel="Week of study"
          weekLine="week {n}"
          weekValue="week {n}, {words} words"
          monthTicks={["1 month", "2 months", "3 months"]}
        />
      </div>
      <div id="teachers">
        <People019
          {...notebook}
          eyebrow="teachers"
          title="People it's not scary to make mistakes with"
          lede="Native speakers run the conversation lessons, methodologists — the grammar. Each has their own accent: have a listen so it doesn't surprise you in class."
          people={TEACHERS}
          listenLabel="hear the accent"
          yearsUnit="years"
        />
      </div>
      <div id="pricing">
        <Pricing031
          {...notebook}
          eyebrow="prices"
          title="Pay for lessons, not for «platform access»"
          lede="Pick a format and how many times a week you're ready to study — the price recalculates. The first lesson is free in any format."
          formats={[
            { key: "group", label: "Group", perLesson: 990, size: "up to 6 people, 60 minutes", features: ["A native speaker once a week", "A conversation club on Saturdays", "Lesson recordings and notes", "A group chat with the teacher"], sticker: "chosen by 78%" },
            { key: "pair", label: "Pair", perLesson: 1690, size: "you and one more, 60 minutes", features: ["Your own schedule", "A native speaker once a week", "A conversation club on Saturdays", "Lesson recordings and notes"] },
            { key: "solo", label: "One-to-one", perLesson: 2490, size: "just you, 60 minutes", features: ["A programme for your goal", "Any time, reschedule 6 hours ahead", "A native speaker on request", "Lesson recordings and notes"] },
          ]}
          actionLabel="Book a trial lesson"
          compareTitle="Us, an app or a tutor?"
          compareColumns={["Slovo", "An app", "A tutor"]}
          compareRows={[
            { label: "Live conversation in every lesson", values: ["yes", "no", "yes"] },
            { label: "A native speaker", values: ["yes", "no", "part"] },
            { label: "Homework checked by a human", values: ["yes", "no", "yes"] },
            { label: "A group where mistakes aren't embarrassing", values: ["yes", "no", "no"] },
            { label: "The schedule keeps you going", values: ["yes", "part", "part"] },
            { label: "Per month at two lessons a week", values: ["7 920 ₽", "990 ₽", "20 000 ₽"] },
          ]}
          lessonUnits={["lesson", "lessons", "lessons"]}
          formatLabel="Format"
          formatAria="Lesson format"
          perWeekLabel="Lessons a week"
          perMonthLabel="per month"
          lessonLabel="Lesson"
          monthLabel="Per month"
          firstLabel="First lesson"
          freeLabel="free"
          markLabels={["yes", "no", "partly"]}
        />
      </div>
      <div id="reviews">
        <Testimonials031
          {...notebook}
          eyebrow="reviews"
          title="Before → after, in levels, not in stars"
          lede="The level before and after — by our test and an external exam, if taken. Real names, with permission."
          reviews={[
            { name: "Marina", lang: "English", months: 6, before: "A2", after: "B2", quote: "Came in with «London is the capital», six months later I was running a call with a client from Dublin and even got his joke about the weather.", note: "passed IELTS with 7.0" },
            { name: "Artem", lang: "Spanish", months: 3, before: "A1", after: "A2", quote: "Learned it for a trip. In Seville I ordered tapas, argued with a taxi driver and didn't get lost in the metro. Diego said my accent was «terrible, pero encantador».", note: "the trip was a success" },
            { name: "Ksenia", lang: "Italian", months: 9, before: "A1", after: "B1", quote: "Quit apps three times. Here the group holds you: miss a lesson — they ask where you were. Nine months on I'm reading Ferrante with a dictionary, but reading.", note: "moved to Milan" },
            { name: "Oleg", lang: "English", months: 4, before: "B1", after: "B2", quote: "I didn't need the language, I needed confidence at interviews. Emma drilled me on behavioural questions until I stopped saying «umm». Got the offer.", note: "an offer in Amsterdam" },
            { name: "Dasha", lang: "Spanish", months: 6, before: "A2", after: "B1", quote: "Studied at 8:00 in the morning before work. Thought I wouldn't last. I did — because a group of seven people was waiting, not a bot." },
            { name: "Igor", lang: "English", months: 12, before: "A1", after: "B1", quote: "I'm 47, started from scratch. Never once felt embarrassed — that's probably the main thing. Now I text my son in Canada without a translator.", note: "the best year" },
          ]}
          monthUnits={["month", "months", "months"]}
          levelUnits={["level", "levels", "levels"]}
          scaleLabel="Level: was {before}, now {after}"
        />
      </div>
      <div id="trial">
        <Cta032
          {...notebook}
          eyebrow="first lesson — free"
          title="Come and talk. Just talk"
          lede="The trial lesson isn't a test or a sales pitch. Half an hour of conversation with a teacher to see whether the format and the group suit you."
          facts={["We'll talk for 30 minutes in the language — as much as you can manage", "We'll pin down your level more precisely than the test and pick a group", "We'll tell you what to expect in a month and in three"]}
          languages={["English", "Spanish", "Italian"]}
          nameLabel="Your name"
          contactLabel="Phone or Telegram"
          actionLabel="Book a trial"
          fine="We'll write within an hour during working hours. No calls without warning."
          doneTitle="booked!"
          doneText="We'll write within an hour and offer two or three times to choose from. Check Telegram."
          fallbackTitle="trial lesson"
          langsLabel="Language"
          langsShort="language"
        />
      </div>
      <div id="faq">
        <Faq023 {...notebook} eyebrow="Questions" title="What people ask before the first lesson" lede="Briefly about what worries people most. The rest — at the trial lesson." items={FAQ} contactLabel="Ask on Telegram" contactHref="#trial" />
      </div>
      <Footer038
        {...notebook}
        brand="Slovo"
        caption="an online language school"
        columns={[
          { title: "languages", links: [{ label: "English", href: "#schedule" }, { label: "Spanish", href: "#schedule" }, { label: "Italian", href: "#schedule" }, { label: "Level test", href: "#test" }] },
          { title: "school", links: [{ label: "How we teach", href: "#how" }, { label: "Teachers", href: "#teachers" }, { label: "Prices", href: "#pricing" }, { label: "Reviews", href: "#reviews" }] },
          { title: "help", links: [{ label: "Questions", href: "#faq" }, { label: "Trial lesson", href: "#trial" }, { label: "Rescheduling", href: "#faq" }, { label: "Refunds", href: "#legal" }] },
        ]}
        legal={[
          { label: "Terms", href: "#offer" },
          { label: "Privacy", href: "#privacy" },
          { label: "Licence No. L035-01271-78", href: "#license" },
        ]}
        copyright="© 2026 Slovo, Saint Petersburg"
        bigWord="Slovo"
        navLabel="Site sections"
      />
    </div>
  )
}
