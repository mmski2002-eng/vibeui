import type { ComponentProps, CSSProperties } from "react"

export type Counter001Frame = {
  /** Часы на табло: «18:00». */
  time: string
  title: string
  text?: string
  image?: string
  /** Насколько темно в этот момент: 0 — день, 1 — ночь. */
  night?: number
}

export type Counter001Props = Omit<ComponentProps<"span">, "title" | "children"> & {
  frames?: readonly Counter001Frame[]
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_FRAMES: Counter001Frame[] = [
  { time: "18:00", title: "Замес", text: "Мука, вода, соль и закваска, которой шесть лет. Никаких дрожжей — только время.", image: "/demo/bakery/story-01.webp", night: 0.15 },
  { time: "22:00", title: "Складывание", text: "Каждые сорок минут тесто складывают, как письмо. Так у мякиша появляются большие поры.", image: "/demo/bakery/story-01.webp", night: 0.55 },
  { time: "01:30", title: "Холод", text: "Ночь в холодильнике при четырёх градусах. Вкус становится сложнее, корка — тоньше.", image: "/demo/bakery/story-02.webp", night: 1 },
  { time: "05:00", title: "Печь", text: "Первый человек в пекарне включает подовую печь. 250 градусов, пар, надрез лезвием.", image: "/demo/bakery/story-03.webp", night: 0.85 },
  { time: "07:00", title: "Первая партия", text: "Буханки остывают на решётках и потрескивают. Это единственный звук, который мы записываем.", image: "/demo/bakery/story-04.webp", night: 0.25 },
  { time: "07:40", title: "На полке", text: "Хлеб дошёл до вас. Резать лучше через час — но мы понимаем, если не дотерпите.", image: "/demo/bakery/story-05.webp", night: 0 },
]

// Часть блока bakery-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="counter-001"]){

}
[data-vibeui-block="counter-001"]{box-sizing:border-box}
[data-vibeui-block="counter-001"] *{box-sizing:border-box}
[data-vibeui-block="counter-001"]{position:absolute;left:1rem;top:1rem;padding:.35rem .7rem;border-radius:999px;background:rgb(0 0 0 / .45);color:#fff;font-size:.75rem;font-weight:600;letter-spacing:.12em;backdrop-filter:blur(6px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="counter-001"] *{animation:none!important;transition:none!important}}
`

/** Подпись «текущий / всего» для scroll-истории. */
export function Counter001({
  frames = DEFAULT_FRAMES,
  index,
  accent,
  className,
  style,
  ...props
}: Counter001Props) {
  const palette = {
    ...(accent ? { "--vibeui-counter-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-counter-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="typography"
        data-vibeui-block="counter-001"
        className={className}
        style={palette}
      >
        {index + 1} / {frames.length}
      </span>
    </>
  )
}
