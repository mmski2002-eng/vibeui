import type { CSSProperties } from "react"
import { Card042 } from "@/registry/components/card/card-042/card-042"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"


type Testimonials007Item = {
  quote: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  name: string
  role: string
}

export type Testimonials007Props = {
  eyebrow?: string
  title?: string
  items?: Testimonials007Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Две бегущие ленты отзывов навстречу друг другу. Движение продаёт объём:
// лента говорит «отзывов больше, чем влезает на экран», не заставляя листать.
// Пауза по hover обязательна — бегущий текст нельзя читать, и reduced-motion
// останавливает ленты совсем.
const STYLES = `[data-vibeui-block="testimonials-007"] [data-part="card"]{width:19rem;flex:none;margin:0}

:where([data-vibeui-block="testimonials-007"]){
--vibeui-testimonials-007-bg:transparent;
--vibeui-testimonials-007-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-007-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-007-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-007-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-007-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-testimonials-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-007"]{color-scheme:dark}
[data-vibeui-block="testimonials-007"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-007-bg);color:var(--vibeui-testimonials-007-ink);
font-family:var(--vibeui-testimonials-007-font);
}
[data-vibeui-block="testimonials-007"] [data-part="head"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem 0;
}
[data-vibeui-block="testimonials-007"] [data-part="band"]{
display:grid;gap:0.25rem;padding:2rem 0 3rem;
}
[data-vibeui-block="testimonials-007"] [data-part="row"]{
overflow:hidden;
/* Края растворяются в фоне: обрезанная в лоб карточка выглядит багом. */
mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
}
[data-vibeui-block="testimonials-007"] [data-part="track"]{
display:flex;width:max-content;
animation:vibeui-testimonials-007-left 48s linear infinite;
}
[data-vibeui-block="testimonials-007"] [data-part="row"][data-direction="right"] [data-part="track"]{
animation-name:vibeui-testimonials-007-right;animation-duration:56s;
}
[data-vibeui-block="testimonials-007"] [data-part="row"]:hover [data-part="track"]{animation-play-state:paused}
[data-vibeui-block="testimonials-007"] [data-part="group"]{
display:flex;gap:1rem;flex:none;list-style:none;margin:0;padding:0.5rem 0.5rem 0.5rem 0;
}
@container (min-width: 40rem){
[data-vibeui-block="testimonials-007"] [data-part="head"]{padding-top:4.5rem}
}
@keyframes vibeui-testimonials-007-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes vibeui-testimonials-007-right{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials007Item[] = [
  {
    quote:
      "Лендинг собрали за вечер: выбрали блоки, отдали агенту, поправили тексты.",
    name: "Анна Ковалёва",
    role: "Маркетинг, «Северный путь»",
  },
  {
    quote:
      "Компоненты приходят обычными файлами. Обновлять нечего — и ломаться нечему.",
    name: "Игорь Демидов",
    role: "Технический директор, Sturm",
  },
  {
    quote:
      "Агент впервые не изобрёл свою версию секции, а поставил ровно ту, что я выбрал.",
    name: "Пётр Ляхов",
    role: "Фронтенд-разработчик",
  },
  {
    quote:
      "Успели к дате запуска кампании. За три года такое случилось впервые.",
    name: "Мария Соболева",
    role: "Продюсер курсов",
  },
  {
    quote:
      "Дизайнер один, проектов пять. Библиотека забрала рутину и вернула ему время.",
    name: "Дмитрий Хан",
    role: "Основатель студии «Плот»",
  },
  {
    quote:
      "Взяли три блока — и не получили сорок мегабайт зависимостей в довесок.",
    name: "Ольга Титова",
    role: "Инженер, финтех",
  },
  {
    quote:
      "Переменные бренда переопределили за час, и секции легли в старый сайт без конфликтов.",
    name: "Павел Гусев",
    role: "CTO, Remark",
  },
  {
    quote: "Раньше спорили о вёрстке неделями. Теперь спорим только о текстах.",
    name: "Ирина Белова",
    role: "Продакт-менеджер",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

function MarqueeGroup({
  items,
  hidden,
  accent,
}: {
  items: Testimonials007Item[]
  hidden?: boolean
  accent?: string
}) {
  return (
    <ul data-part="group" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.name}>
          <Card042 data-part="card" quote={item.quote} name={item.name} image={item.image} role={item.role} accent={accent} />
        </li>
      ))}
    </ul>
  )
}

/** Две бегущие ленты отзывов навстречу друг другу с паузой по наведению. */
export function Testimonials007({
  eyebrow = "Отзывы",
  title = "Лента тех, кто уже собрал сайт",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Testimonials007Props) {
  const half = Math.ceil(items.length / 2)
  const topRow = items.slice(0, half)
  const bottomRow = items.length > 1 ? items.slice(half) : topRow
  const palette = {
    ...(accent ? { "--vibeui-testimonials-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-007"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
        </div>
        <div data-part="band">
          <div data-part="row" data-direction="left">
            <div data-part="track">
              <MarqueeGroup items={topRow} accent={accent} />
              <MarqueeGroup items={topRow} hidden accent={accent} />
            </div>
          </div>
          <div data-part="row" data-direction="right">
            <div data-part="track">
              <MarqueeGroup items={bottomRow} accent={accent} />
              <MarqueeGroup items={bottomRow} hidden accent={accent} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
