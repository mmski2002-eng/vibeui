import type { CSSProperties } from "react"

import { Navbar028 } from "@/registry/blocks/navbar/navbar-028/navbar-028"
import { Hero028 } from "@/registry/blocks/hero/hero-028/hero-028"
import { Bakery001 } from "@/registry/blocks/bakery/bakery-001/bakery-001"
import { Bakery002 } from "@/registry/blocks/bakery/bakery-002/bakery-002"
import { Bakery003 } from "@/registry/blocks/bakery/bakery-003/bakery-003"
import { Bakery004 } from "@/registry/blocks/bakery/bakery-004/bakery-004"
import { People012 } from "@/registry/blocks/team/people-012/people-012"
import { Bakery005 } from "@/registry/blocks/bakery/bakery-005/bakery-005"
import { Portfolio011 } from "@/registry/blocks/portfolio/portfolio-011/portfolio-011"
import { Testimonials023 } from "@/registry/blocks/testimonials/testimonials-023/testimonials-023"
import { Map010 } from "@/registry/blocks/map/map-010/map-010"
import { Subscribe007 } from "@/registry/blocks/newsletter/subscribe-007/subscribe-007"
import { Footer027 } from "@/registry/blocks/footer/footer-027/footer-027"

/**
 * Сценарий «Кофейня-пекарня»: сайт живёт по часам пекарни — что в печи
 * сейчас, что достанут через двадцать минут, сколько осталось. Тринадцать
 * блоков, светлая тема «молоко и мак»; полка и коробка связаны событиями
 * window. Витрина результата, не шаблон.
 */
export const metadata = {
  title: "Корка — кофейня-пекарня в Хамовниках",
  description:
    "Демо сценария «Кофейня-пекарня» VibeUI: хлеб по часам, витрина с остатками, кофе по крепости, коробка к утру и история буханки за 36 часов.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f6f1e8",
  color: "#1f1a17",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const bakery = { tone: "light", accent: "#e4572e", ink: "#1f1a17", background: "#f6f1e8" } as const
const dark = { tone: "dark", accent: "#e4572e", ink: "#f6f1e8", background: "#1f1a17" } as const

const PHOTOS = "/demo/bakery"

export default function BakeryDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar028 {...bakery} />
      <div id="top">
        <Hero028 {...bakery} image={`${PHOTOS}/hero.webp`} imageAlt="Витрина пекарни утром: круассаны за стеклом, хлеб на полках, бариста у машины" />
      </div>
      <div id="shelf">
        <Bakery001 {...bakery} />
      </div>
      <div id="coffee">
        <Bakery002 {...bakery} beanImage={`${PHOTOS}/beans.webp`} />
      </div>
      <div id="box">
        <Bakery003 {...bakery} howImage={`${PHOTOS}/box.webp`} />
      </div>
      <div id="story">
        <Bakery004 {...bakery} />
      </div>
      <div id="people">
        <People012 {...bakery} />
      </div>
      <div id="loyalty">
        <Bakery005 {...bakery} />
      </div>
      <div id="gallery">
        <Portfolio011 {...bakery} />
      </div>
      <div id="reviews">
        <Testimonials023 {...bakery} />
      </div>
      <div id="where">
        <Map010 {...bakery} mapSrc="https://yandex.ru/map-widget/v1/?ll=37.5860,55.7330&z=15&pt=37.5860,55.7330,pm2rdm&lang=ru_RU" mapTitle="Карта: пекарня «Корка» в Хамовниках" />
      </div>
      <div id="newsletter">
        <Subscribe007 {...bakery} texture={`${PHOTOS}/bag.webp`} />
      </div>
      <Footer027 {...dark} />
    </div>
  )
}
