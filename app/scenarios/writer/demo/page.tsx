import type { CSSProperties } from "react"

import { Navbar045 } from "@/registry/blocks/navbar/navbar-045/navbar-045"
import { Hero045 } from "@/registry/blocks/hero/hero-045/hero-045"
import { Writer001 } from "@/registry/blocks/industry/writer-001/writer-001"
import { Writer002 } from "@/registry/blocks/industry/writer-002/writer-002"
import { Writer003 } from "@/registry/blocks/industry/writer-003/writer-003"
import { Bento014 } from "@/registry/blocks/layout/bento-014/bento-014"
import { Writer004 } from "@/registry/blocks/industry/writer-004/writer-004"
import { Event026 } from "@/registry/blocks/events/event-026/event-026"
import { Subscribe020 } from "@/registry/blocks/newsletter/subscribe-020/subscribe-020"
import { Contact033 } from "@/registry/blocks/contact/contact-033/contact-033"
import { Footer044 } from "@/registry/blocks/footer/footer-044/footer-044"

/**
 * Сценарий «Личный сайт писателя»: сайт-читалка. Тёплый графит ночью и
 * бумага днём — переключатель в шапке шлёт событие `vibeui-writer:theme`,
 * каждый блок слушает его и меняет color-scheme, а цвета заданы через
 * light-dark(), поэтому весь сайт кроссфейдится разом.
 * Ритм секций — три тона: базовый, приподнятый (книга, встречи) и
 * перевёрнутый (чтение, письма: ночью — бумага, днём — графит); между
 * соседями одного тона — чернильная линия.
 * Книга в 3D, архив с превью у курсора, чтение с закладкой и сносками.
 */
export const metadata = {
  title: "Вера Холодова — тексты и книга",
  description:
    "Демо сценария «Личный сайт писателя» VibeUI: имя антиквой из-под маски, цитата пером, 3D-книга, архив текстов с превью у курсора, чтение с закладкой и сносками, заметки на полях, лента встреч, письма читателям.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#17161a",
  color: "#ece5d8",
  fontFamily: '"PT Serif",Georgia,"Times New Roman",serif',
}

// Тема страницы: оба состояния разом — блок сам переключает color-scheme по событию.
const reader = {
  tone: "auto",
  accent: "#d9a066",
  ink: "light-dark(#1f1c19,#ece5d8)",
  background: "light-dark(#f4efe6,#17161a)",
} as const

const raised = { ...reader, background: "light-dark(#ece5d8,#1e1c21)" } as const

// Стартует бумагой на ночном сайте; событие темы блок переворачивает сам.
const inverted = { ...reader, tone: "light", invert: true } as const

// Чернильная линия между секциями одного тона: серый, читаемый на обеих подложках.
function InkLine() {
  return <hr aria-hidden className="mx-auto h-px w-[calc(100%-2.5rem)] max-w-[71.5rem] border-0 bg-[#8a8378]/35" />
}

export default function WriterDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar045 {...reader} />
      <div id="top">
        <Hero045 {...reader} showModeSwitch={false} video="/demo/writer/hero-night.mp4" videoDay="/demo/writer/hero-day.mp4" poster="/demo/writer/hero-night.webp" posterDay="/demo/writer/hero-day.webp" />
      </div>
      <div id="book">
        <Writer001 {...raised} cover="/demo/writer/cover.webp" />
      </div>
      <div id="texts">
        <Writer002 {...reader} />
      </div>
      <div id="read">
        <Writer003 {...inverted} />
      </div>
      <div id="about">
        <Bento014 {...reader} portrait="/demo/writer/portrait.webp" desk="/demo/writer/desk.webp" />
      </div>
      <InkLine />
      <div id="readers">
        <Writer004 {...reader} />
      </div>
      <div id="events">
        <Event026 {...raised} />
      </div>
      <div id="letters">
        <Subscribe020 {...inverted} />
      </div>
      <div id="publishers">
        <Contact033 {...reader} />
      </div>
      <InkLine />
      <Footer044 {...reader} />
    </div>
  )
}
