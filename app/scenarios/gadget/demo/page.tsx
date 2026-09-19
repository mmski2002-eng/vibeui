import type { CSSProperties } from "react"

import { Navbar043 } from "@/registry/blocks/navbar/navbar-043/navbar-043"
import { Hero043 } from "@/registry/blocks/hero/hero-043/hero-043"
import { Gadget001 } from "@/registry/blocks/gadget/gadget-001/gadget-001"
import { Bento012 } from "@/registry/blocks/bento/bento-012/bento-012"
import { Gadget002 } from "@/registry/blocks/gadget/gadget-002/gadget-002"
import { Stats012 } from "@/registry/blocks/stats/stats-012/stats-012"
import { Comparison016 } from "@/registry/blocks/comparison/comparison-016/comparison-016"
import { Gadget003 } from "@/registry/blocks/gadget/gadget-003/gadget-003"
import { Testimonials035 } from "@/registry/blocks/testimonials/testimonials-035/testimonials-035"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Footer042 } from "@/registry/blocks/footer/footer-042/footer-042"

/**
 * Сценарий «Хардвер-гаджет»: лампа-будильник «Луч» нарисована CSS и сама
 * ведёт сайт — светит на первом экране по ползункам, разгорается в
 * sticky-рассвете, разбирается на детали, меняет цвет в предзаказе.
 * Страница идёт «ночь → утро → вечер»: почти чёрный, тёплый белый, снова
 * чёрный. Ни одной фотографии.
 */
export const metadata = {
  title: "Луч — умная лампа-будильник, которая будит светом",
  description:
    "Демо сценария «Хардвер-гаджет» VibeUI: CSS-лампа с живым светом, sticky-рассвет по прокрутке, bento возможностей, взрыв-схема, панель приборов, сравнение с первой версией, предзаказ с отсчётом и бегущая строка прессы.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0a0a0a",
  color: "#f2ede4",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const night = { tone: "dark", accent: "#ffb454", ink: "#f2ede4", background: "#0a0a0a" } as const
const day = { tone: "light", accent: "#d4780f", ink: "#14110f", background: "#f4efe6" } as const

const dusk: CSSProperties = { height: "10rem", background: "linear-gradient(180deg,#f4efe6,#0a0a0a)" }

const FAQ = [
  { question: "Когда отгрузите партию?", answer: "Вторая партия уходит со склада в Москве в октябре, счётчик на странице считает до даты отгрузки. По России доставим за 2–5 дней СДЭК или Яндексом, бесплатно." },
  { question: "Что входит в гарантию?", answer: "Два года на всё, включая светодиоды и динамик. Сломалось — присылаете фото в Telegram, высылаем замену и курьера за старой лампой. Чинить самому не нужно." },
  { question: "Можно вернуть, если не понравится?", answer: "30 дней с момента получения, без объяснения причин. Курьера за коробкой оформляем сами, деньги возвращаем на карту в течение трёх дней." },
  { question: "Нужен ли интернет, чтобы лампа работала?", answer: "Нет. Будильники, рассвет и звуки живут в самой лампе. Wi-Fi нужен только для приложения, обновлений прошивки и голосовых ассистентов." },
  { question: "Подойдёт ли Луч детям?", answer: "Да, это самый частый сценарий владельцев первой версии. Свет без мерцания, ни одного индикатора в темноте, максимальная громкость ограничена 65 дБ." },
]

export default function GadgetDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar043 {...night} />
      <div id="top">
        <Hero043 {...night} />
      </div>
      <div id="dawn">
        <Gadget001 {...night} />
      </div>
      <div id="features">
        <Bento012 {...day} />
      </div>
      <div id="inside">
        <Gadget002 {...day} />
      </div>
      <div id="specs">
        <Stats012 {...day} />
      </div>
      <div id="compare">
        <Comparison016 {...day} />
      </div>
      <div style={dusk} aria-hidden="true" />
      <div id="preorder">
        <Gadget003 {...night} />
      </div>
      <div id="press">
        <Testimonials035 {...night} />
      </div>
      <div id="faq">
        <Faq023 {...night} eyebrow="Доставка и гарантия" title="Что спрашивают перед предзаказом" lede="Коротко о сроках, гарантии и возврате. Остальное — в Telegram поддержки, отвечаем за час." items={FAQ} contactLabel="Спросить в Telegram" contactHref="#tg" />
      </div>
      <Footer042 {...night} />
    </div>
  )
}
