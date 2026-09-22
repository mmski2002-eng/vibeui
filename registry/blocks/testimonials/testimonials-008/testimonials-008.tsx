import type { CSSProperties } from "react"
import { Card030 } from "@/registry/components/card/card-030/card-030"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Testimonials008Item = {
  metric: string
  metricLabel: string
  quote: string
  name: string
  role: string
}

export type Testimonials008Props = {
  eyebrow?: string
  title?: string
  items?: Testimonials008Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Отзыв с измеримым результатом: крупная цифра сверху, цитата под ней.
// Цифра отвечает на вопрос «что мне это даст» быстрее любой цитаты, а
// цитата под цифрой объясняет, откуда результат взялся, — вместе они
// работают лучше, чем порознь.
const STYLES = `[data-vibeui-block="testimonials-008"] [data-part="heading"]{margin-bottom:2rem}
[data-vibeui-block="testimonials-008"] [data-part="card"]{margin:0}

:where([data-vibeui-block="testimonials-008"]){
--vibeui-testimonials-008-bg:transparent;
--vibeui-testimonials-008-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-008-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-008-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-008-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-008-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-testimonials-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-008"]{color-scheme:dark}
[data-vibeui-block="testimonials-008"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-008-bg);color:var(--vibeui-testimonials-008-ink);
font-family:var(--vibeui-testimonials-008-font);
}
[data-vibeui-block="testimonials-008"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-008"] [data-part="grid"]{display:grid;gap:1rem}
@container (min-width: 40rem){
[data-vibeui-block="testimonials-008"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-008"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="testimonials-008"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials008Item[] = [
  {
    metric: "−40%",
    metricLabel: "времени на вёрстку лендинга",
    quote:
      "Секции берём готовыми, агент ставит их в проект сам. Руки доходят до текстов и офферов — того, что реально двигает конверсию.",
    name: "Анна Ковалёва",
    role: "Руководитель маркетинга, «Северный путь»",
  },
  {
    metric: "2 дня",
    metricLabel: "от макета до продакшена",
    quote:
      "Раньше между «дизайн готов» и «страница живёт» лежала неделя. Теперь блоки совпадают с превью один в один, и спорить не о чем.",
    name: "Дмитрий Хан",
    role: "Основатель студии «Плот»",
  },
  {
    metric: "0",
    metricLabel: "зависимостей в довесок",
    quote:
      "Взяли пять блоков — в package.json не добавилось ни строчки. Через год обновлять и чинить будет нечего, это лучшая часть.",
    name: "Ольга Титова",
    role: "Инженер, финтех",
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

/** Карточки отзывов с крупной метрикой результата над цитатой. */
export function Testimonials008({
  eyebrow = "Результаты",
  title = "Цифры, которые называют сами команды",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Testimonials008Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
          <div data-part="grid">
            {items.map((item) => (
              <Card030 key={item.name} data-part="card" name={item.name} metric={item.metric} metricLabel={item.metricLabel} quote={item.quote} role={item.role} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
