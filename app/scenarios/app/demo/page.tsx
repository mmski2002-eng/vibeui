import type { CSSProperties } from "react"

import { Navbar032 } from "@/registry/blocks/navbar/navbar-032/navbar-032"
import { Hero032 } from "@/registry/blocks/hero/hero-032/hero-032"
import { App001 } from "@/registry/blocks/industry/app-001/app-001"
import { App002 } from "@/registry/blocks/industry/app-002/app-002"
import { Testimonials025 } from "@/registry/blocks/testimonials/testimonials-025/testimonials-025"
import { Pricing024 } from "@/registry/blocks/pricing/pricing-024/pricing-024"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Cta025 } from "@/registry/blocks/cta/cta-025/cta-025"
import { Footer031 } from "@/registry/blocks/footer/footer-031/footer-031"
import { Scene } from "./scene"

/**
 * Сценарий «Мобильное приложение»: сайт показывает не скриншоты, а живой
 * телефон из CSS — круг дышит, экраны переключаются по прокрутке, график
 * сна двигается ползунком «до / после». Страница проживает сутки: от
 * лавандового дня через сумерки к ночи и обратно к утру — фон, чернила и
 * акцент перетекают по прокрутке (обёртка `Scene`). Витрина результата,
 * не шаблон.
 */
export const metadata = {
  title: "Тише — приложение для сна и дыхания",
  description:
    "Демо сценария «Мобильное приложение» VibeUI: CSS-телефон с дышащим кругом, экраны по прокрутке, сравнение до/после, отзывы из магазинов, тарифы, вопросы и QR для скачивания.",
}

const page: CSSProperties = {
  colorScheme: "light",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
// Цвета — переменные обёртки Scene, которые перетекают между фазами суток.
const scene = { accent: "var(--vibeui-scene-accent)", ink: "var(--vibeui-scene-ink)", background: "var(--vibeui-scene-bg)" } as const
const light = { ...scene, tone: "light" } as const
const dark = { ...scene, tone: "dark" } as const

const PHOTOS = "/demo/app"

export default function AppDemo() {
  return (
    <Scene style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar032 {...light} />
      <div id="top" data-scene="day">
        <Hero032 {...light} />
      </div>
      <div id="features" data-scene="dusk">
        <App001 {...dark} />
      </div>
      <div id="results" data-scene="night">
        <App002 {...dark} />
      </div>
      <div id="reviews" data-scene="night">
        <Testimonials025 {...dark} image={`${PHOTOS}/evening.webp`} />
      </div>
      <div id="pricing" data-scene="night">
        <Pricing024 {...dark} />
      </div>
      <div id="faq" data-scene="night">
        <Faq023 {...dark} />
      </div>
      <div id="download" data-scene="dawn">
        <Cta025 {...light} image={`${PHOTOS}/night.webp`} />
      </div>
      <div data-scene="dawn">
        <Footer031 {...light} />
      </div>
    </Scene>
  )
}
