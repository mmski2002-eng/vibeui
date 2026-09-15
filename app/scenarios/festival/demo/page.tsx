import type { CSSProperties } from "react"

import { About009 } from "@/registry/blocks/about/about-009/about-009"
import { Cta019 } from "@/registry/blocks/cta/cta-019/cta-019"
import { Event005 } from "@/registry/blocks/events/event-005/event-005"
import { Event006 } from "@/registry/blocks/events/event-006/event-006"
import { Event007 } from "@/registry/blocks/events/event-007/event-007"
import { Faq018 } from "@/registry/blocks/faq/faq-018/faq-018"
import { Footer022 } from "@/registry/blocks/footer/footer-022/footer-022"
import { Hero023 } from "@/registry/blocks/hero/hero-023/hero-023"
import { Map006 } from "@/registry/blocks/map/map-006/map-006"
import { Navbar023 } from "@/registry/blocks/navbar/navbar-023/navbar-023"
import { People008 } from "@/registry/blocks/team/people-008/people-008"
import { Pricing021 } from "@/registry/blocks/pricing/pricing-021/pricing-021"

/**
 * Сценарий «Городской фестиваль»: белая страница, чёрный гигантский
 * заголовок и цветные капсулы направлений — двенадцать цветов на белом.
 * Двенадцать блоков из общих групп каталога. Витрина результата, не шаблон.
 */
export const metadata = {
  title: "Три дня города — фестиваль музыки, еды и лекций в парке «Остров»",
  description:
    "Демо сценария «Городской фестиваль» VibeUI: программа, расписание по дням, участники, площадки, билеты, карта и вопросы. Белая страница с цветными капсулами.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#ffffff",
  color: "#111111",
  fontFamily: '"Inter",ui-sans-serif,system-ui,sans-serif',
}

const light = { tone: "light" } as const

export default function Page() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar023 {...light} brand="тридня" brandHref="#hero" />

      <div id="hero">
        <Hero023 {...light} />
      </div>

      <div id="about">
        <About009 {...light} />
      </div>

      <div id="program">
        <Event005 {...light} />
      </div>

      <div id="schedule">
        <Event006 {...light} />
      </div>

      <div id="lineup">
        <People008 {...light} />
      </div>

      <div id="venues">
        <Event007 {...light} />
      </div>

      <div id="tickets">
        <Pricing021 {...light} />
      </div>

      <div id="map">
        <Map006 {...light} />
      </div>

      <div id="faq">
        <Faq018 {...light} />
      </div>

      <div id="cta">
        <Cta019 {...light} />
      </div>

      <div id="footer">
        <Footer022 {...light} />
      </div>
    </div>
  )
}
