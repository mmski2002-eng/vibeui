import type { CSSProperties } from "react"

import { Navbar036 } from "@/registry/blocks/navbar/navbar-036/navbar-036"
import { Hero036 } from "@/registry/blocks/hero/hero-036/hero-036"
import { Flowers001 } from "@/registry/blocks/flowers/flowers-001/flowers-001"
import { Flowers002 } from "@/registry/blocks/flowers/flowers-002/flowers-002"
import { Flowers003 } from "@/registry/blocks/flowers/flowers-003/flowers-003"
import { Flowers004 } from "@/registry/blocks/flowers/flowers-004/flowers-004"
import { Flowers005 } from "@/registry/blocks/flowers/flowers-005/flowers-005"
import { About017 } from "@/registry/blocks/about/about-017/about-017"
import { Testimonials028 } from "@/registry/blocks/testimonials/testimonials-028/testimonials-028"
import { Subscribe011 } from "@/registry/blocks/newsletter/subscribe-011/subscribe-011"
import { Footer035 } from "@/registry/blocks/footer/footer-035/footer-035"

/**
 * Сценарий «Цветочная мастерская»: ботанический журнал — бумага, чернила,
 * маковый акцент, антиква и рукописные пометки. Букет на первом экране
 * собирается из слоёв и разъезжается на прокрутке, картинки каталога
 * бегут за курсором, конструктор ставит стебли в вазу и передаёт состав в
 * форму доставки, окна доставки считаются от текущего времени.
 */
export const metadata = {
  title: "Стебель — цветочная мастерская на Пестеля",
  description:
    "Демо сценария «Цветочная мастерская» VibeUI: букет из слоёв на первом экране, каталог с картинкой за курсором, конструктор букета, доставка к часу, сезонный календарь, уход, открытки-отзывы и подписка.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f3efe6",
  color: "#1d1b18",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const paper = { tone: "light", accent: "#c2361d", ink: "#1d1b18", background: "#f3efe6" } as const
const plum = { tone: "dark", accent: "#f0a58f", ink: "#f3efe6", background: "#2b1e2a" } as const

export default function FlowersDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar036 {...paper} />
      <div id="top">
        <Hero036 {...paper} />
      </div>
      <div id="catalog">
        <Flowers001 {...paper} />
      </div>
      <div id="builder">
        <Flowers002 {...paper} />
      </div>
      <div id="delivery">
        <Flowers003 {...paper} />
      </div>
      <div id="season">
        <Flowers004 {...plum} />
      </div>
      <div id="care">
        <Flowers005 {...paper} />
      </div>
      <div id="about">
        <About017 {...paper} />
      </div>
      <div id="reviews">
        <Testimonials028 {...paper} />
      </div>
      <div id="subscribe">
        <Subscribe011 {...paper} />
      </div>
      <div id="contacts">
        <Footer035 {...paper} />
      </div>
    </div>
  )
}
