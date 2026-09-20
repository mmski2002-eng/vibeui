import type { CSSProperties } from "react"

import { Navbar042 } from "@/registry/blocks/navbar/navbar-042/navbar-042"
import { Hero042 } from "@/registry/blocks/hero/hero-042/hero-042"
import { Api001 } from "@/registry/blocks/industry/api-001/api-001"
import { Bento011 } from "@/registry/blocks/layout/bento-011/bento-011"
import { Pricing034 } from "@/registry/blocks/pricing/pricing-034/pricing-034"
import { Api002 } from "@/registry/blocks/industry/api-002/api-002"
import { Comparison015 } from "@/registry/blocks/pricing/comparison-015/comparison-015"
import { Changelog013 } from "@/registry/blocks/blog/changelog-013/changelog-013"
import { Logocloud007 } from "@/registry/blocks/logos/logocloud-007/logocloud-007"
import { Testimonials034 } from "@/registry/blocks/testimonials/testimonials-034/testimonials-034"
import { Cta035 } from "@/registry/blocks/cta/cta-035/cta-035"
import { Footer041 } from "@/registry/blocks/footer/footer-041/footer-041"

/**
 * Сценарий «API / dev-tool с оплатой за запросы»: «Геокод» — геокодирование,
 * маршруты и подсказки адресов по API. Сайт — «терминал, но красивый»:
 * запрос печатается сам, JSON приходит с задержкой «42 ms», песочница
 * двигает точку по CSS-карте, цена считается логарифмическим ползунком,
 * статус-панель живёт от текущего времени. Тёмный фон, один фосфорный
 * акцент, моно-шрифт для кода и метрик, ни одной фотографии.
 */
export const metadata = {
  title: "Геокод — API геокодирования: адрес → координаты за 42 ms",
  description:
    "Демо сценария «API / dev-tool» VibeUI: хиро с живым запросом, песочница с картой, эндпоинты bento, калькулятор цены за запросы, статус-панель регионов, сравнение с конкурентами, changelog, отзывы разработчиков и ключ за 30 секунд.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0b0d10",
  color: "#e6edf3",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const terminal = { tone: "dark", accent: "#7cf3a0", ink: "#e6edf3", background: "#0b0d10" } as const

export default function ApiDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar042 {...terminal} />
      <div id="top">
        <Hero042 {...terminal} />
      </div>
      <div id="sandbox">
        <Api001 {...terminal} />
      </div>
      <div id="endpoints">
        <Bento011 {...terminal} />
      </div>
      <div id="pricing">
        <Pricing034 {...terminal} />
      </div>
      <div id="status">
        <Api002 {...terminal} />
      </div>
      <div id="compare">
        <Comparison015 {...terminal} />
      </div>
      <div id="changelog">
        <Changelog013 {...terminal} />
      </div>
      <Logocloud007 {...terminal} label="используют" names={["Самокат", "Достависта", "Ситимобил", "Lamoda", "СДЭК", "Wildberries", "Ozon", "Яндекс Еда", "Boxberry", "Delivery Club", "Циан", "Авито"]} />
      <div id="reviews">
        <Testimonials034 {...terminal} />
      </div>
      <div id="key">
        <Cta035 {...terminal} />
      </div>
      <Footer041 {...terminal} />
    </div>
  )
}
