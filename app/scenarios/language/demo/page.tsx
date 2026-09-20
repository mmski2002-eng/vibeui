import type { CSSProperties } from "react"

import { Navbar039 } from "@/registry/blocks/navbar/navbar-039/navbar-039"
import { Hero039 } from "@/registry/blocks/hero/hero-039/hero-039"
import { Language001 } from "@/registry/blocks/industry/language-001/language-001"
import { Bento008 } from "@/registry/blocks/layout/bento-008/bento-008"
import { Language002 } from "@/registry/blocks/industry/language-002/language-002"
import { Language003 } from "@/registry/blocks/industry/language-003/language-003"
import { People019 } from "@/registry/blocks/team/people-019/people-019"
import { Pricing031 } from "@/registry/blocks/pricing/pricing-031/pricing-031"
import { Testimonials031 } from "@/registry/blocks/testimonials/testimonials-031/testimonials-031"
import { Cta032 } from "@/registry/blocks/cta/cta-032/cta-032"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Footer038 } from "@/registry/blocks/footer/footer-038/footer-038"

/**
 * Сценарий «Языковая онлайн-школа»: тетрадь 2026 — тёплая бумага, едва
 * заметная клетка и линовка, чернильно-синий текст и коралловый маркер,
 * рукописные подписи на полях. Сайт живёт: слово в заголовке переводится,
 * диалог урока печатается, тест уровня выставляет фильтр расписанию,
 * график словаря рисуется, преподаватели наклоняются за курсором.
 */
export const metadata = {
  title: "Слово — онлайн-школа английского, испанского и итальянского",
  description:
    "Демо сценария «Языковая онлайн-школа» VibeUI: хиро с переводимым словом и живым диалогом, тест уровня со шкалой A1–C1, расписание групп с ближайшим стартом, график прогресса, преподаватели с акцентами, тарифы с калькулятором и сравнением, отзывы «до → после», форма пробного урока.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fbfaf7",
  color: "#1b2a6b",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const notebook = { tone: "light", accent: "#ff6b4a", ink: "#1b2a6b", background: "#fbfaf7" } as const

const TEACHERS = [
  { name: "Emma Whitfield", role: "английский · носитель", from: "Манчестер", years: 9, note: "любимое слово — serendipity", accent: "манчестерский", image: "/demo/language/teacher-01.webp", imageAlt: "Эмма Уитфилд, преподаватель английского" },
  { name: "Diego Ferrer", role: "испанский · носитель", from: "Валенсия", years: 7, note: "любимое слово — sobremesa", accent: "валенсийский", image: "/demo/language/teacher-02.webp", imageAlt: "Диего Феррер, преподаватель испанского" },
  { name: "Giulia Rinaldi", role: "итальянский · носитель", from: "Болонья", years: 6, note: "любимое слово — abbiocco", accent: "болонский", image: "/demo/language/teacher-03.webp", imageAlt: "Джулия Ринальди, преподаватель итальянского" },
  { name: "Анна Северова", role: "английский · методист", from: "Петербург", years: 12, note: "любимое слово — petrichor", accent: "RP, почти BBC", image: "/demo/language/teacher-04.webp", imageAlt: "Анна Северова, методист школы" },
]

const FAQ = [
  { question: "Я совсем с нуля. Мне не будет стыдно в группе?", answer: "Группы «с нуля» собираются только из новичков — все на одной странице тетради. Первые две недели говорим короткими фразами, и преподаватель не даёт никому «выпасть»." },
  { question: "Что, если я пропущу занятие?", answer: "Запись и конспект приходят в тот же вечер, домашку можно сдать голосовым. Пропустили больше двух подряд — преподаватель предложит короткое догоняющее занятие бесплатно." },
  { question: "Можно ли перейти в другую группу?", answer: "Да, в любой момент: если группа оказалась слишком быстрой или медленной, методист пересадит вас в течение недели, деньги пересчитаются." },
  { question: "Как проходит занятие с носителем?", answer: "Каждое четвёртое занятие ведёт носитель по теме недели. Он говорит в своём темпе, а вы привыкаете к живому акценту, а не к дикторскому." },
  { question: "Как платить и можно ли вернуть деньги?", answer: "Оплата помесячно картой, чек приходит на почту. Неиспользованные занятия возвращаем полностью — без объяснения причин, в течение трёх рабочих дней." },
]

export default function LanguageDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar039 {...notebook} />
      <div id="top">
        <Hero039 {...notebook} />
      </div>
      <div id="test">
        <Language001 {...notebook} />
      </div>
      <div id="how">
        <Bento008 {...notebook} image="/demo/language/lesson.webp" />
      </div>
      <div id="schedule">
        <Language002 {...notebook} />
      </div>
      <div id="progress">
        <Language003 {...notebook} />
      </div>
      <div id="teachers">
        <People019 {...notebook} people={TEACHERS} />
      </div>
      <div id="pricing">
        <Pricing031 {...notebook} />
      </div>
      <div id="reviews">
        <Testimonials031 {...notebook} />
      </div>
      <div id="trial">
        <Cta032 {...notebook} />
      </div>
      <div id="faq">
        <Faq023 {...notebook} eyebrow="Вопросы" title="Что спрашивают перед первым уроком" lede="Коротко о том, что волнует чаще всего. Остальное — на пробном занятии." items={FAQ} contactLabel="Спросить в Telegram" contactHref="#trial" />
      </div>
      <Footer038 {...notebook} />
    </div>
  )
}
