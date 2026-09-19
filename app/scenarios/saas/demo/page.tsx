import type { CSSProperties } from "react"

import { Navbar033 } from "@/registry/blocks/navbar/navbar-033/navbar-033"
import { Hero033 } from "@/registry/blocks/hero/hero-033/hero-033"
import { Ai001 } from "@/registry/blocks/ai/ai-001/ai-001"
import { Ai002 } from "@/registry/blocks/ai/ai-002/ai-002"
import { Bento002 } from "@/registry/blocks/bento/bento-002/bento-002"
import { Logocloud007 } from "@/registry/blocks/logos/logocloud-007/logocloud-007"
import { Pricing025 } from "@/registry/blocks/pricing/pricing-025/pricing-025"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Cta026 } from "@/registry/blocks/cta/cta-026/cta-026"
import { Footer032 } from "@/registry/blocks/footer/footer-032/footer-032"

/**
 * Сценарий «AI-инструмент / SaaS»: сайт сам является демо продукта —
 * ассистент печатает сводку на первом экране, в песочнице можно нажать
 * кнопку и увидеть ответ, интеграции кружат по орбитам, цена считается
 * ползунком мест. Тёмная аврора, стекло, без единой фотографии.
 */
export const metadata = {
  title: "Сводка — AI, который превращает созвоны в решения",
  description:
    "Демо сценария «AI-инструмент / SaaS» VibeUI: хиро с печатающейся сводкой, конвейер «как работает», песочница, орбиты интеграций, тарифы по местам, вопросы о данных и стеклянный призыв.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0a0f1e",
  color: "#eef2ff",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const aurora = { tone: "dark", accent: "#5ee7ff", ink: "#eef2ff", background: "#0a0f1e" } as const

const FAQ = [
  { question: "Где хранятся записи и расшифровки?", answer: "В вашем пространстве, на серверах в России. Аудио удаляется сразу после расшифровки, текст — по вашему сроку хранения: от суток до года." },
  { question: "Учится ли модель на наших встречах?", answer: "Нет. Ваши данные не попадают в обучение ни нашей модели, ни сторонних. Это записано в договоре обработки данных." },
  { question: "Как бот попадает на созвон?", answer: "Вы подключаете календарь — бот заходит участником на встречи, которые вы отметили. Или загружаете запись руками, если встречу не планировали." },
  { question: "Что, если участники против записи?", answer: "Бот представляется и пишет в чат встречи, что ведёт расшифровку. Любой участник может попросить его выйти — сводка не составится." },
  { question: "Можно ли развернуть в своём контуре?", answer: "Да, в тарифе «Компания»: модель и хранилище разворачиваются на ваших серверах, наружу ничего не уходит." },
]

export default function SaasDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar033 {...aurora} />
      <div id="top">
        <Hero033 {...aurora} />
      </div>
      <div id="how">
        <Ai001 {...aurora} />
      </div>
      <div id="sandbox">
        <Ai002 {...aurora} />
      </div>
      <div id="integrations">
        <Bento002 {...aurora} />
      </div>
      <Logocloud007 {...aurora} label="доверяют" names={["Точка", "Skyeng", "Самокат", "Авито", "Циан", "Ozon", "Контур", "Miro", "Тинькофф", "Лаборатория Касперского"]} />
      <div id="pricing">
        <Pricing025 {...aurora} />
      </div>
      <div id="security">
        <Faq023 {...aurora} eyebrow="Данные" title="Что с безопасностью" lede="Самые частые вопросы юристов и безопасников — коротко. Полные ответы в документации." items={FAQ} contactLabel="Спросить безопасника" contactHref="#contact" />
      </div>
      <div id="start">
        <Cta026 {...aurora} />
      </div>
      <Footer032 {...aurora} />
    </div>
  )
}
