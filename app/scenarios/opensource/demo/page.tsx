import type { CSSProperties } from "react"

import { Navbar030 } from "@/registry/blocks/navbar/navbar-030/navbar-030"
import { Hero030 } from "@/registry/blocks/hero/hero-030/hero-030"
import { Opensource001 } from "@/registry/blocks/industry/opensource-001/opensource-001"
import { Bento001 } from "@/registry/blocks/layout/bento-001/bento-001"
import { Comparison006 } from "@/registry/blocks/pricing/comparison-006/comparison-006"
import { Stats002 } from "@/registry/blocks/about/stats-002/stats-002"
import { Changelog004 } from "@/registry/blocks/blog/changelog-004/changelog-004"
import { Cta024 } from "@/registry/blocks/cta/cta-024/cta-024"
import { Footer029 } from "@/registry/blocks/footer/footer-029/footer-029"

/**
 * Сценарий «Open-source проект»: README, который ожил. Терминал печатает
 * команду, устанавливает пакет с прогресс-баром и выводит «ready» по кругу,
 * песочница — sticky-сцена, где прокрутка включает опции, bento живёт
 * микроанимациями, звёзды рисуются графиком, changelog выезжает лентой.
 * Светлая инженерная тема на точках и зерне, тёмный финал у звезды.
 * Витрина результата, не шаблон.
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

// Зерно поверх всей страницы: svg feTurbulence в data-URI, ниже порога заметности, но снимает «пластик».
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const noise: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 70,
  pointerEvents: "none",
  opacity: 0.06,
  backgroundImage: NOISE,
  backgroundSize: "160px 160px",
  mixBlendMode: "overlay",
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const light = { tone: "light", accent: "#2f5bff", ink: "#111111", background: "#fbfbf9" } as const
// Финал — тёмный: звезда и подвал на цвете терминала, акцент светлее ради контраста.
const dark = { tone: "dark", accent: "#6d8bff", ink: "#f2f3f7", background: "#0f1117" } as const

const TERMINAL = ["$ npm i tabl", "added 1 package in 412ms", "✓ 4.1 kB gzip · 0 зависимостей", "✓ типы колонок выведены: ColumnDef<Row>", "✓ виртуализация включена (rows > 200)", "✓ ready in 1.2s"]

const FEATURES = [
  { title: "Виртуализация из коробки", text: "48 000 строк рендерятся как 12: в DOM только то, что в окне. Включается сама, когда строк больше двухсот.", demo: "rows", wide: true },
  { title: "Сортировка", text: "По любой колонке, с кастомным компаратором и стабильным порядком.", demo: "sort" },
  { title: "Тема — ваша", text: "Ни одного стиля внутри. Светлая, тёмная, фирменная — таблица подхватывает любую.", demo: "theme" },
  { title: "Типы выводятся из данных", text: "Колонки знают тип ячеек: редактор подскажет, TypeScript проверит.", demo: "types" },
  { title: "Группировка", text: "Один ключ — и строки собираются в раскрывающиеся группы с итогами.", demo: "group" },
  { title: "4 КБ и ноль зависимостей", text: "Меньше, чем иконка. Дерево-шейкинг: берёте только то, что используете.", demo: "size" },
] as const

export default function OpensourceDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <div style={noise} aria-hidden="true" />
      <Navbar030 {...light} />
      <div id="top">
        <Hero030 {...light} title="Таблица легче, чем ваш *favicon*" terminal={TERMINAL} />
      </div>
      <div id="playground">
        <Opensource001 {...light} />
      </div>
      <div id="docs">
        <Bento001 {...light} features={FEATURES} lede="Шесть вещей, которые вы обычно пишете сами и потом чините. Здесь они написаны один раз." />
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
        <Cta024 {...dark} />
      </div>
      <Footer029 {...dark} />
    </div>
  )
}
