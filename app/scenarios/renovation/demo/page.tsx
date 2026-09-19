import type { CSSProperties } from "react"

import { Navbar037 } from "@/registry/blocks/navbar/navbar-037/navbar-037"
import { Hero037 } from "@/registry/blocks/hero/hero-037/hero-037"
import { Renovation001 } from "@/registry/blocks/renovation/renovation-001/renovation-001"
import { Renovation002 } from "@/registry/blocks/renovation/renovation-002/renovation-002"
import { Renovation003 } from "@/registry/blocks/renovation/renovation-003/renovation-003"
import { Renovation004 } from "@/registry/blocks/renovation/renovation-004/renovation-004"
import { Comparison010 } from "@/registry/blocks/comparison/comparison-010/comparison-010"
import { People017 } from "@/registry/blocks/team/people-017/people-017"
import { Testimonials029 } from "@/registry/blocks/testimonials/testimonials-029/testimonials-029"
import { Cta030 } from "@/registry/blocks/cta/cta-030/cta-030"
import { Footer036 } from "@/registry/blocks/footer/footer-036/footer-036"

/**
 * Сценарий «Ремонт квартир / строительная бригада»: сайт как рабочий
 * чертёж — светлый бетон и тёмно-синяя миллиметровка, сигнально-жёлтый
 * акцент, моно-цифры. План квартиры рисуется линиями, смета считается
 * ползунком и уходит в форму заявки, этапы едут по Ганту при прокрутке,
 * объекты сравниваются шторкой, стройка обновляется от сегодняшней даты.
 */
export const metadata = {
  title: "Ровно — ремонт квартир с фиксированной сметой и сроком в календаре",
  description:
    "Демо сценария «Ремонт квартир» VibeUI: хиро с планом квартиры, калькулятор сметы, этапы диаграммой Ганта, объекты до/после, стройка онлайн, сравнение с типичной бригадой, бригада, акты приёмки и заявка одним полем.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#eceae5",
  color: "#141a24",
  fontFamily: '"Onest",ui-sans-serif,system-ui,sans-serif',
}

// Две темы листа: светлый бетон для основного и тёмно-синяя миллиметровка
// для хиро, стройки онлайн и подвала. Акцент один — сигнально-жёлтый.
const concrete = { tone: "light", accent: "#ffd60a", ink: "#141a24", background: "#eceae5" } as const
const blueprint = { tone: "dark", accent: "#ffd60a", ink: "#eef2f7", background: "#0e1c36" } as const

export default function RenovationDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar037 {...concrete} />
      <div id="top">
        <Hero037 {...blueprint} />
      </div>
      <div id="calc">
        <Renovation001 {...concrete} />
      </div>
      <div id="stages">
        <Renovation002 {...concrete} />
      </div>
      <div id="works">
        <Renovation003 {...concrete} />
      </div>
      <div id="online">
        <Renovation004 {...blueprint} />
      </div>
      <div id="why">
        <Comparison010 {...concrete} />
      </div>
      <div id="team">
        <People017 {...concrete} />
      </div>
      <div id="reviews">
        <Testimonials029 {...concrete} />
      </div>
      <div id="contact">
        <Cta030 {...concrete} />
      </div>
      <Footer036 {...blueprint} />
    </div>
  )
}
