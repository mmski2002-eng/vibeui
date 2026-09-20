import type { CSSProperties } from "react"

import { Navbar034 } from "@/registry/blocks/navbar/navbar-034/navbar-034"
import { Hero034 } from "@/registry/blocks/hero/hero-034/hero-034"
import { Auto001 } from "@/registry/blocks/industry/auto-001/auto-001"
import { Auto002 } from "@/registry/blocks/industry/auto-002/auto-002"
import { Auto003 } from "@/registry/blocks/industry/auto-003/auto-003"
import { People014 } from "@/registry/blocks/team/people-014/people-014"
import { Testimonials026 } from "@/registry/blocks/testimonials/testimonials-026/testimonials-026"
import { Auto004 } from "@/registry/blocks/industry/auto-004/auto-004"
import { Map011 } from "@/registry/blocks/map/map-011/map-011"
import { Footer033 } from "@/registry/blocks/footer/footer-033/footer-033"

/**
 * Сценарий «Автосервис / детейлинг»: тёмный «гараж ночью» — графит, металл,
 * один кислотный оранжевый. Силуэт машины прорисовывается и подсвечивает
 * услуги, калькулятор считает на лету и уносит выбор в запись по слотам,
 * до/после тянется шторкой, счётчики докручиваются, мастера наклоняются
 * за курсором.
 */
export const metadata = {
  title: "Гараж 42 — детейлинг-студия в закрытом боксе",
  description:
    "Демо сценария «Автосервис / детейлинг» VibeUI: хиро с силуэтом машины по зонам, калькулятор услуг, слайдер до/после, таймлайн процесса, мастера, отзывы со счётчиками, запись по слотам и карта.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0f1114",
  color: "#f2f3f5",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const garage = { tone: "dark", accent: "#ff5a1f", ink: "#f2f3f5", background: "#0f1114" } as const

export default function AutoDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar034 {...garage} />
      <div id="top">
        <Hero034 {...garage} />
      </div>
      <div id="services">
        <Auto001 {...garage} background="#14171b" />
      </div>
      <div id="results">
        <Auto002 {...garage} />
      </div>
      <div id="process">
        <Auto003 {...garage} background="#14171b" />
      </div>
      <div id="team">
        <People014 {...garage} />
      </div>
      <div id="reviews">
        <Testimonials026 {...garage} background="#14171b" />
      </div>
      <div id="booking">
        <Auto004 {...garage} />
      </div>
      <div id="contacts">
        <Map011 {...garage} background="#14171b" />
      </div>
      <Footer033 {...garage} />
    </div>
  )
}
