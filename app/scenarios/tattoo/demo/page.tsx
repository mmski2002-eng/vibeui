import type { CSSProperties } from "react"

import { About010 } from "@/registry/blocks/about/about-010/about-010"
import { Contact017 } from "@/registry/blocks/contact/contact-017/contact-017"
import { Cta020 } from "@/registry/blocks/cta/cta-020/cta-020"
import { Faq019 } from "@/registry/blocks/faq/faq-019/faq-019"
import { Footer023 } from "@/registry/blocks/footer/footer-023/footer-023"
import { Hero024 } from "@/registry/blocks/hero/hero-024/hero-024"
import { Navbar024 } from "@/registry/blocks/navbar/navbar-024/navbar-024"
import { Portfolio007 } from "@/registry/blocks/portfolio/portfolio-007/portfolio-007"
import { Pricing022 } from "@/registry/blocks/pricing/pricing-022/pricing-022"
import { Process001 } from "@/registry/blocks/process/process-001/process-001"
import { Stats001 } from "@/registry/blocks/stats/stats-001/stats-001"
import { People009 } from "@/registry/blocks/team/people-009/people-009"
import { Testimonials019 } from "@/registry/blocks/testimonials/testimonials-019/testimonials-019"

/**
 * Сценарий «Тату-студия»: всегда тёмная страница, неон фуксия и фиолет,
 * циан для служебных подписей. Навигация — рейка слева (на телефоне док
 * снизу), поэтому странице нужен отступ. Тринадцать блоков.
 * Витрина результата, не шаблон.
 */
export const metadata = {
  title: "Inkra — тату-студия в Петербурге: реализм, олд-скул, графика, минимализм",
  description:
    "Демо сценария «Тату-студия» VibeUI: неоновая вывеска, работы с фильтром, мастера, как проходит сеанс, калькулятор цены, отзывы спустя годы и запись в три шага.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#07060b",
  color: "#f3eefc",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

const dark = { tone: "dark" } as const

export default function Page() {
  return (
    <div style={page} className="min-h-dvh" data-demo="tattoo">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:1rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <style href="vibeui-demo-rail" precedence="medium">
        {`[data-demo="tattoo"]{padding-bottom:5rem}@media (min-width:60rem){[data-demo="tattoo"]{padding-left:5.5rem;padding-bottom:0}}`}
      </style>
      <Navbar024 {...dark} brandHref="#hero" />

      <div id="hero">
        <Hero024 {...dark} />
      </div>

      <div id="works">
        <Portfolio007 {...dark} />
      </div>

      <div id="artists">
        <People009 {...dark} />
      </div>

      <div id="process">
        <Process001 {...dark} />
      </div>

      <div id="stats">
        <Stats001 {...dark} />
      </div>

      <div id="pricing">
        <Pricing022 {...dark} />
      </div>

      <div id="reviews">
        <Testimonials019 {...dark} />
      </div>

      <div id="about">
        <About010 {...dark} />
      </div>

      <div id="faq">
        <Faq019 {...dark} />
      </div>

      <div id="booking">
        <Contact017 {...dark} />
      </div>

      <div id="contacts">
        <Cta020 {...dark} />
      </div>

      <div id="footer">
        <Footer023 {...dark} />
      </div>
    </div>
  )
}
