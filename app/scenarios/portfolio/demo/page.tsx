import type { CSSProperties } from "react"

import { Navbar031 } from "@/registry/blocks/navbar/navbar-031/navbar-031"
import { Hero031 } from "@/registry/blocks/hero/hero-031/hero-031"
import { Portfolio012 } from "@/registry/blocks/portfolio/portfolio-012/portfolio-012"
import { Logocloud007 } from "@/registry/blocks/logos/logocloud-007/logocloud-007"
import { About014 } from "@/registry/blocks/about/about-014/about-014"
import { Testimonials024 } from "@/registry/blocks/testimonials/testimonials-024/testimonials-024"
import { Contact021 } from "@/registry/blocks/contact/contact-021/contact-021"
import { Footer030 } from "@/registry/blocks/footer/footer-030/footer-030"
import { TintShell } from "./tint-shell"

/**
 * Сценарий «Портфолио разработчика / дизайнера»: страница ведёт себя как
 * живой человек — имя антиквой из-под маски, свет за курсором с инерцией,
 * печатающиеся роли, местное время с секундами, проекты стопкой по прокрутке,
 * и вся страница подкрашивается под наведённый проект (событие
 * `vibeui-page:tint` → TintShell). Бумага с зерном, чернила и ультрафиолет.
 */
export const metadata = {
  title: "Даня Лунёв — дизайн и фронтенд",
  description:
    "Демо сценария «Портфолио» VibeUI: имя антиквой, печатающиеся роли и свет за курсором, проекты стопкой с подкраской страницы, бегущая строка навыков, отзывы-заметки, форма с плавающими ярлыками.",
}

const PAPER = "#efeee9"

const page: CSSProperties = {
  colorScheme: "light",
  background: "var(--vibeui-page-bg)",
  color: "#141414",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
// Фон блоков — переменная страницы, чтобы подкраска от проектов дошла до каждой секции.
const paper = { tone: "light", accent: "#5b3df5", ink: "#141414", background: "var(--vibeui-page-bg)" } as const

const PHOTOS = "/demo/portfolio"

export default function PortfolioDemo() {
  return (
    <TintShell base={PAPER} style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar031 {...paper} />
      <div id="top">
        <Hero031 {...paper} />
      </div>
      <div id="work">
        <Portfolio012 {...paper} />
      </div>
      <Logocloud007 {...paper} />
      <div id="about">
        <About014 {...paper} image={`${PHOTOS}/portrait.webp`} imageAlt="Даня за столом с закрытым ноутбуком" />
      </div>
      <div id="words">
        <Testimonials024 {...paper} />
      </div>
      <div id="contact">
        <Contact021 {...paper} image={`${PHOTOS}/portrait-02.webp`} imageAlt="Даня рисует маркером на бумаге" />
      </div>
      <Footer030 {...paper} />
    </TintShell>
  )
}
