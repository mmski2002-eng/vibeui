import type { CSSProperties } from "react"

import { About008 } from "@/registry/blocks/about/about-008/about-008"
import { Course001 } from "@/registry/blocks/course/course-001/course-001"
import { Course002 } from "@/registry/blocks/course/course-002/course-002"
import { Course003 } from "@/registry/blocks/course/course-003/course-003"
import { Course004 } from "@/registry/blocks/course/course-004/course-004"
import { Cta017 } from "@/registry/blocks/cta/cta-017/cta-017"
import { Faq017 } from "@/registry/blocks/faq/faq-017/faq-017"
import { Footer021 } from "@/registry/blocks/footer/footer-021/footer-021"
import { Hero022 } from "@/registry/blocks/hero/hero-022/hero-022"
import { Navbar022 } from "@/registry/blocks/navbar/navbar-022/navbar-022"
import { Pricing020 } from "@/registry/blocks/pricing/pricing-020/pricing-020"
import { Testimonials018 } from "@/registry/blocks/testimonials/testimonials-018/testimonials-018"

/**
 * Сценарий «Онлайн-курс»: светлая тема, индиго и лаймовый маркер. Восемь
 * блоков из общих групп каталога плюс четыре предметных из course. Витрина
 * результата, не шаблон.
 */
export const metadata = {
  title: "Figma для продуктовых дизайнеров — онлайн-курс Ксении Мороз",
  description:
    "Демо сценария «Онлайн-курс» VibeUI: лендинг курса с программой, автором, результатами выпускников, тарифами и обратным отсчётом до старта.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#ffffff",
  color: "#111827",
  fontFamily: '"Inter",ui-sans-serif,system-ui,sans-serif',
}

const light = { tone: "light" } as const

const PHOTOS = "/demo/course"

const CASES = [
  { name: "Артём Гусев", image: `${PHOTOS}/graduate-01.webp`, work: `${PHOTOS}/work-01.webp`, before: "маркетолог, 4 года", after: "продуктовый дизайнер, Ozon", gain: "оффер через 2 месяца", quote: "Кейс с защиты показал на собеседовании — взяли без тестового.", href: "#" },
  { name: "Лена Крылова", image: `${PHOTOS}/graduate-02.webp`, work: `${PHOTOS}/work-02.webp`, before: "графический дизайнер", after: "UI-дизайнер, Самокат", gain: "×1,8 к доходу", quote: "Наконец поняла автолейаут. Теперь макеты не разваливаются.", href: "#" },
  { name: "Даниил Орлов", image: `${PHOTOS}/graduate-03.webp`, work: `${PHOTOS}/work-03.webp`, before: "продакт-менеджер", after: "продакт, сам собирает прототипы", gain: "гипотезы за вечер", quote: "Перестал ждать дизайнера две недели ради одного экрана.", href: "#" },
]

const REVIEWS = [
  { quote: "Самое ценное — ревью. Куратор разобрал мою домашку на 20 минут видео и показал, где я теряю пользователя. На работе так никто не делает.", name: "Марина Соколова", role: "UI-дизайнер, Авито", image: `${PHOTOS}/graduate-04.webp`, cohort: "поток 11", video: `${PHOTOS}/lesson.webp`, videoHref: "#", href: "#" },
  { quote: "Пришёл продактом, чтобы перестать ждать дизайнеров. Через месяц собрал прототип фичи сам и получил «да» на тест за один созвон.", name: "Игорь Левин", role: "Продакт-менеджер, Ozon", image: `${PHOTOS}/graduate-03.webp`, cohort: "поток 12", href: "#" },
  { quote: "Лайвы по средам — это отдельный курс. Ксения на живом файле показывает, как думает, а не только что нажать.", name: "Алина Фёдорова", role: "Дизайнер, фриланс", image: `${PHOTOS}/graduate-02.webp`, cohort: "поток 12", href: "#" },
]

export default function Page() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar022
        {...light}
        brand="Figma Pro"
        brandHref="#"
        caption="курс · 6 недель"
        actionLabel="Записаться"
        actionPrice="49 000 ₽"
        actionHref="#pricing"
        links={[
          { label: "Для кого", href: "#who" },
          { label: "Программа", href: "#program" },
          { label: "Результаты", href: "#results" },
          { label: "Автор", href: "#author" },
          { label: "Стоимость", href: "#pricing" },
        ]}
      />

      <div id="hero">
        <Hero022
          {...light}
          eyebrow="Онлайн-курс · старт 6 октября"
          title="Figma для продуктовых дизайнеров: от макета до *живого прототипа*"
          lede="Шесть недель практики на реальных задачах: соберёте три интерфейса, защитите проект перед арт-директором и выйдете с портфолио, которое смотрят."
          primaryLabel="Записаться на поток"
          primaryHref="#pricing"
          secondaryLabel="Смотреть первый урок"
          secondaryHref="#"
          poster={`${PHOTOS}/poster.webp`}
          posterAlt="Кадр из первого урока: дизайнер за монитором с макетом"
          duration="4:32"
          sticker="Осталось 12 мест"
        />
      </div>

      <div id="who">
        <Course001 {...light} />
      </div>

      <div id="program">
        <Course002 {...light} />
      </div>

      <div id="results">
        <Course003 {...light} cases={CASES} />
      </div>

      <div id="author">
        <About008 {...light} image={`${PHOTOS}/author.webp`} imageAlt="Ксения Мороз за рабочим столом" />
      </div>

      <div id="format">
        <Course004 {...light} image={`${PHOTOS}/lesson.webp`} imageAlt="Ксения записывает урок в студии" />
      </div>

      <div id="pricing">
        <Pricing020 {...light} />
      </div>

      <div id="reviews">
        <Testimonials018 {...light} items={REVIEWS} />
      </div>

      <div id="faq">
        <Faq017 {...light} />
      </div>

      <div id="enroll">
        <Cta017 {...light} startsAt="2026-10-06T10:00:00+03:00" action="" />
      </div>

      <div id="footer">
        <Footer021 {...light} email="hello@figmapro.school" />
      </div>
    </div>
  )
}
