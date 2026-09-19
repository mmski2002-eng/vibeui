import type { CSSProperties } from "react"

import { Navbar032 } from "@/registry/blocks/navbar/navbar-032/navbar-032"
import { Hero032 } from "@/registry/blocks/hero/hero-032/hero-032"
import { App001 } from "@/registry/blocks/app/app-001/app-001"
import { App002 } from "@/registry/blocks/app/app-002/app-002"
import { Testimonials025 } from "@/registry/blocks/testimonials/testimonials-025/testimonials-025"
import { Pricing024 } from "@/registry/blocks/pricing/pricing-024/pricing-024"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Cta025 } from "@/registry/blocks/cta/cta-025/cta-025"
import { Footer031 } from "@/registry/blocks/footer/footer-031/footer-031"

/**
 * Сценарий «Мобильное приложение»: сайт показывает не скриншоты, а живой
 * телефон из CSS — круг дышит, экраны переключаются по прокрутке, график
 * сна двигается ползунком «до / после». Светлая ночь с лавандой. Витрина
 * результата, не шаблон.
 */
export const metadata = {
  title: "Тише — приложение для сна и дыхания",
  description:
    "Демо сценария «Мобильное приложение» VibeUI: CSS-телефон с дышащим кругом, экраны по прокрутке, сравнение до/после, отзывы из магазинов, тарифы, вопросы и QR для скачивания.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f4f2fb",
  color: "#1c1b2e",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const lavender = { tone: "light", accent: "#7c5cff", ink: "#1c1b2e", background: "#f4f2fb" } as const

const PHOTOS = "/demo/app"

export default function AppDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar032 {...lavender} />
      <div id="top">
        <Hero032 {...lavender} />
      </div>
      <div id="features">
        <App001 {...lavender} />
      </div>
      <div id="results">
        <App002 {...lavender} />
      </div>
      <div id="reviews">
        <Testimonials025 {...lavender} image={`${PHOTOS}/evening.webp`} />
      </div>
      <div id="pricing">
        <Pricing024 {...lavender} />
      </div>
      <div id="faq">
        <Faq023 {...lavender} />
      </div>
      <div id="download">
        <Cta025 {...lavender} image={`${PHOTOS}/night.webp`} />
      </div>
      <Footer031 {...lavender} />
    </div>
  )
}
