import type { CSSProperties } from "react"

import { Navbar035 } from "@/registry/blocks/navbar/navbar-035/navbar-035"
import { Hero035 } from "@/registry/blocks/hero/hero-035/hero-035"
import { Vet001 } from "@/registry/blocks/industry/vet-001/vet-001"
import { Pricing027 } from "@/registry/blocks/pricing/pricing-027/pricing-027"
import { Vet002 } from "@/registry/blocks/industry/vet-002/vet-002"
import { Vet003 } from "@/registry/blocks/industry/vet-003/vet-003"
import { People015 } from "@/registry/blocks/team/people-015/people-015"
import { Vet004 } from "@/registry/blocks/industry/vet-004/vet-004"
import { Testimonials027 } from "@/registry/blocks/testimonials/testimonials-027/testimonials-027"
import { Contact023 } from "@/registry/blocks/contact/contact-023/contact-023"
import { Footer034 } from "@/registry/blocks/footer/footer-034/footer-034"

/**
 * Сценарий «Ветклиника + груминг»: кремовая «Лапа» с CSS-мордой, которая
 * следит за курсором, экстренной кнопкой, картой тела, симптом-чекером,
 * живым расписанием врачей, ползунком стрижки и дневником отзывов.
 * Переключатель питомца в хиро переключает и прайс (событие vibeui-vet:pet).
 */
export const metadata = {
  title: "Лапа — ветклиника и груминг на Соколе",
  description:
    "Демо сценария «Ветклиника + груминг» VibeUI: морда питомца из CSS, экстренная кнопка, прайс-тикеты, карта тела, симптом-чекер, врачи с расписанием на сегодня, ползунок стрижки, дневник отзывов, запись с картой.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fbf6ee",
  color: "#2b241f",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const cream = { tone: "light", accent: "#d9643a", ink: "#2b241f", background: "#fbf6ee" } as const

export default function VetDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar035 {...cream} />
      <div id="top">
        <Hero035 {...cream} />
      </div>
      <Vet001 {...cream} />
      <div id="services">
        <Pricing027 {...cream} background="#f4ecdf" />
      </div>
      <div id="body">
        <Vet002 {...cream} />
      </div>
      <div id="symptoms">
        <Vet003 {...cream} background="#f4ecdf" />
      </div>
      <div id="doctors">
        <People015 {...cream} />
      </div>
      <div id="grooming">
        <Vet004 {...cream} background="#f4ecdf" />
      </div>
      <div id="diary">
        <Testimonials027 {...cream} />
      </div>
      <div id="contacts">
        <Contact023 {...cream} background="#f4ecdf" />
      </div>
      <Footer034 {...cream} />
    </div>
  )
}
