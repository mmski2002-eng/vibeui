import type { CSSProperties } from "react"

import { Navbar030 } from "@/registry/blocks/navbar/navbar-030/navbar-030"
import { Hero030 } from "@/registry/blocks/hero/hero-030/hero-030"
import { Opensource001 } from "@/registry/blocks/opensource/opensource-001/opensource-001"
import { Bento001 } from "@/registry/blocks/bento/bento-001/bento-001"
import { Comparison006 } from "@/registry/blocks/comparison/comparison-006/comparison-006"
import { Stats002 } from "@/registry/blocks/stats/stats-002/stats-002"
import { Changelog004 } from "@/registry/blocks/changelog/changelog-004/changelog-004"
import { Cta024 } from "@/registry/blocks/cta/cta-024/cta-024"
import { Footer029 } from "@/registry/blocks/footer/footer-029/footer-029"

/**
 * Сценарий «Open-source проект»: README, который ожил. Команда установки
 * копируется, терминал печатает сам, песочница меняет код и результат от
 * переключателей, размер бандла сравнивается живыми полосами, история
 * версий раскрывается. Светлая инженерная тема на линиях. Витрина
 * результата, не шаблон.
 */
export const metadata = {
  title: "tabl — headless-таблица для React на 4 КБ",
  description:
    "Демо сценария «Open-source проект» VibeUI: установка с копированием, живой терминал, песочница, bento возможностей, сравнение размера, сообщество, changelog и звезда на GitHub.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fbfbf9",
  color: "#111111",
  fontFamily: '"Onest",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const light = { tone: "light", accent: "#2f5bff", ink: "#111111", background: "#fbfbf9" } as const

export default function OpensourceDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar030 {...light} />
      <div id="top">
        <Hero030 {...light} />
      </div>
      <div id="playground">
        <Opensource001 {...light} />
      </div>
      <div id="docs">
        <Bento001 {...light} />
      </div>
      <div id="compare">
        <Comparison006 {...light} />
      </div>
      <div id="community">
        <Stats002 {...light} />
      </div>
      <div id="changelog">
        <Changelog004 {...light} />
      </div>
      <div id="star">
        <Cta024 {...light} />
      </div>
      <Footer029 {...light} />
    </div>
  )
}
