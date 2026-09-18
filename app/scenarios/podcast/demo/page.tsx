import type { CSSProperties } from "react"

import { Navbar029 } from "@/registry/blocks/navbar/navbar-029/navbar-029"
import { Hero029 } from "@/registry/blocks/hero/hero-029/hero-029"
import { Podcast004 } from "@/registry/blocks/podcast/podcast-004/podcast-004"
import { Podcast005 } from "@/registry/blocks/podcast/podcast-005/podcast-005"
import { People013 } from "@/registry/blocks/team/people-013/people-013"
import { Podcast006 } from "@/registry/blocks/podcast/podcast-006/podcast-006"
import { Pricing023 } from "@/registry/blocks/pricing/pricing-023/pricing-023"
import { Subscribe008 } from "@/registry/blocks/newsletter/subscribe-008/subscribe-008"
import { Footer028 } from "@/registry/blocks/footer/footer-028/footer-028"
import { Podcast007 } from "@/registry/blocks/podcast/podcast-007/podcast-007"

/**
 * Сценарий «Подкаст»: тёмная студия с кислотным индикатором записи. Всё,
 * что звучит, — видно: волна эпизода, бегущие цитаты, счётчики. Лента
 * эпизодов, мини-плеер и шапка связаны событиями window. Витрина
 * результата, не шаблон.
 */
export const metadata = {
  title: "Тихий час — подкаст о том, как люди работают",
  description:
    "Демо сценария «Подкаст» VibeUI: плеер с живой волной, лента эпизодов, бегущие цитаты, гости, платформы, поддержка и мини-плеер.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0e0d12",
  color: "#f3efe6",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const dark = { tone: "dark", accent: "#c8f542", ink: "#f3efe6", background: "#0e0d12" } as const

const PHOTOS = "/demo/podcast"

export default function PodcastDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar029 {...dark} />
      <div id="top">
        <Hero029 {...dark} cover={`${PHOTOS}/cover.webp`} coverAlt="Обложка эпизода: микрофон на фоне тёплого окна" />
      </div>
      <div id="episodes">
        <Podcast004 {...dark} />
      </div>
      <Podcast005 {...dark} />
      <div id="guests">
        <People013 {...dark} />
      </div>
      <div id="listen">
        <Podcast006 {...dark} />
      </div>
      <div id="support">
        <Pricing023 {...dark} image={`${PHOTOS}/studio-01.webp`} />
      </div>
      <div id="letter">
        <Subscribe008 {...dark} />
      </div>
      <Footer028 {...dark} hostImage={`${PHOTOS}/host.webp`} />
      <Podcast007 {...dark} />
    </div>
  )
}
