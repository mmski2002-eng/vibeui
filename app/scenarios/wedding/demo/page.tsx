import type { CSSProperties } from "react"

import { About011 } from "@/registry/blocks/about/about-011/about-011"
import { Contact018 } from "@/registry/blocks/contact/contact-018/contact-018"
import { Cta021 } from "@/registry/blocks/cta/cta-021/cta-021"
import { Event008 } from "@/registry/blocks/events/event-008/event-008"
import { Event009 } from "@/registry/blocks/events/event-009/event-009"
import { Faq020 } from "@/registry/blocks/faq/faq-020/faq-020"
import { Footer024 } from "@/registry/blocks/footer/footer-024/footer-024"
import { Hero025 } from "@/registry/blocks/hero/hero-025/hero-025"
import { Map007 } from "@/registry/blocks/map/map-007/map-007"
import { Navbar025 } from "@/registry/blocks/navbar/navbar-025/navbar-025"
import { Portfolio008 } from "@/registry/blocks/portfolio/portfolio-008/portfolio-008"
import { People010 } from "@/registry/blocks/team/people-010/people-010"
import { Testimonials020 } from "@/registry/blocks/testimonials/testimonials-020/testimonials-020"

/**
 * Сценарий «Приглашение на свадьбу»: кремовая страница, чернила цвета
 * сливы, терракотовый акцент, Cormorant Garamond + Manrope. Конверт с
 * печатью на входе, обратный отсчёт, RSVP в пять шагов, дресс-код палитрой,
 * галерея и стена пожеланий. Тринадцать блоков. Витрина результата, не шаблон.
 */
export const metadata = {
  title: "Василиса и Артём — 5 сентября 2027, усадьба Марфино",
  description:
    "Демо сценария «Приглашение на свадьбу» VibeUI: конверт с печатью, обратный отсчёт, история пары, программа дня, дресс-код, карта, RSVP-анкета, галерея, подарки и стена пожеланий.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f6f1e8",
  color: "#2b1a24",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

const light = { tone: "light" } as const

const GALLERY = [
  {
    src: "/demo/wedding/gallery-01.webp",
    caption: "Воскресное утро",
    shape: "arch",
  },
  { src: "/demo/wedding/gallery-02.webp", caption: "Парк, май" },
  {
    src: "/demo/wedding/gallery-03.webp",
    caption: "Под одним зонтом",
    shape: "tall",
  },
  { src: "/demo/wedding/gallery-04.webp", caption: "Пикник" },
  { src: "/demo/wedding/gallery-05.webp", caption: "Лифт", shape: "arch" },
  { src: "/demo/wedding/gallery-06.webp", caption: "Набережная" },
  { src: "/demo/wedding/gallery-07.webp", caption: "Мороженое", shape: "tall" },
  { src: "/demo/wedding/gallery-08.webp", caption: "Дождь за окном" },
] as const

export default function Page() {
  return (
    <div style={page} className="min-h-dvh" data-demo="wedding">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar025
        {...light}
        brandHref="#hero"
        links={[
          { label: "История", href: "#story" },
          { label: "Программа", href: "#program" },
          { label: "Место", href: "#place" },
          { label: "Вопросы", href: "#faq" },
        ]}
        music="/demo/wedding/music.mp3"
      />

      <div id="hero">
        <Hero025
          {...light}
          image="/demo/wedding/hero.webp"
          imageAlt="Василиса и Артём на осенней улице"
        />
      </div>

      <div id="story">
        <About011
          {...light}
          frames={[
            {
              date: "Октябрь 2021",
              title: "Кофе у окна",
              text: "Познакомились в очереди за кофе: Артём взял её стакан, Василиса — его. Поменялись через полчаса разговора.",
              image: "/demo/wedding/story-01.webp",
            },
            {
              date: "Июль 2022",
              title: "Первая дорога",
              text: "Две тысячи километров на юг, карта на коленях и один плейлист на двоих.",
              image: "/demo/wedding/story-02.webp",
            },
            {
              date: "Март 2024",
              title: "Коробки",
              text: "Съехались. Первый ужин в новой квартире — пицца на полу среди коробок.",
              image: "/demo/wedding/story-03.webp",
            },
            {
              date: "Май 2027",
              title: "Пирс на закате",
              text: "Артём встал на одно колено, Василиса сказала «да» ещё до вопроса.",
              image: "/demo/wedding/story-04.webp",
            },
          ]}
        />
      </div>

      <div id="program">
        <Event008 {...light} />
      </div>

      <div id="dresscode">
        <Event009 {...light} />
      </div>

      <div id="place">
        <Map007
          {...light}
          image="/demo/wedding/venue-01.webp"
          imageAlt="Аллея и дом усадьбы Марфино"
        />
      </div>

      <div id="rsvp">
        <Contact018 {...light} />
      </div>

      <div id="faq">
        <Faq020 {...light} />
      </div>

      <div id="gallery">
        <Portfolio008 {...light} photos={GALLERY} />
      </div>

      <div id="people">
        <People010
          {...light}
          people={[
            {
              name: "Ксения",
              role: "Свидетельница",
              text: "Лучшая подруга Василисы с первого курса. Знает, где сидеть, что дарить и кто с кем не разговаривает.",
              image: "/demo/wedding/people-01.webp",
              contactLabel: "Написать в Telegram",
              contactHref: "#",
            },
            {
              name: "Даниил",
              role: "Свидетель",
              text: "Брат Артёма. Отвечает за трансфер, парковку и тех, кто потерялся по дороге.",
              image: "/demo/wedding/people-02.webp",
              contactLabel: "Написать в Telegram",
              contactHref: "#",
            },
            {
              name: "Полина",
              role: "Организатор",
              text: "Собирает весь день по минутам. Аллергии, отели, детские стулья — это к ней.",
              image: "/demo/wedding/people-03.webp",
              contactLabel: "Позвонить",
              contactHref: "tel:+70000000000",
            },
          ]}
        />
      </div>

      <div id="gifts">
        <Cta021 {...light} />
      </div>

      <div id="wishes">
        <Testimonials020 {...light} />
      </div>

      <div id="footer">
        <Footer024 {...light} />
      </div>
    </div>
  )
}
