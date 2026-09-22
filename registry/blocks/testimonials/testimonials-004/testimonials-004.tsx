import type { CSSProperties } from "react"
import { Card026 } from "@/registry/components/card/card-026/card-026"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Testimonials004Item = {
  company: string
  industry: string
  quote: string
  person: string
}

export type Testimonials004Props = {
  title?: string
  description?: string
  items?: Testimonials004Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Лента логотипов, у каждого из которых есть своя цитата. Обычная полоса
// логотипов ничего не доказывает: непонятно, клиенты это или просто
// знакомые бренды. Здесь под каждым логотипом стоит одна фраза от живого
// человека — доказательство и узнавание в одном элементе.
const STYLES = `[data-vibeui-block="testimonials-004"] [data-part="cell"]{margin:0}

:where([data-vibeui-block="testimonials-004"]){
--vibeui-testimonials-004-bg:transparent;
--vibeui-testimonials-004-ink:light-dark(oklch(0.21 0 250),oklch(0.95 0 250));
--vibeui-testimonials-004-muted:light-dark(oklch(0.5 0 250),oklch(0.72 0 250));
--vibeui-testimonials-004-border:light-dark(oklch(0.91 0 250),oklch(0.34 0 250));
--vibeui-testimonials-004-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-testimonials-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-004"]{color-scheme:dark}
[data-vibeui-block="testimonials-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-004-bg);color:var(--vibeui-testimonials-004-ink);
font-family:var(--vibeui-testimonials-004-font);
}
[data-vibeui-block="testimonials-004"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-004"] [data-part="head"]{
display:grid;gap:0.75rem;margin-bottom:2rem;
}
[data-vibeui-block="testimonials-004"] [data-part="grid"]{
display:grid;gap:0;border-top:1px solid var(--vibeui-testimonials-004-border);
}
@container (min-width: 42rem){
[data-vibeui-block="testimonials-004"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-004"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:3rem}
}
@container (min-width: 68rem){
[data-vibeui-block="testimonials-004"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials004Item[] = [
  {
    company: "Северный путь",
    industry: "Логистика",
    quote:
      "Личный кабинет клиента переписали за месяц вместо квартала и не потеряли ни одного сценария.",
    person: "Анна Ковалёва, маркетинг",
  },
  {
    company: "Артель",
    industry: "Производство",
    quote:
      "Каталог на две тысячи позиций собрали из готовых секций. Верстальщика в проекте не было вовсе.",
    person: "Елена Ремизова, продукт",
  },
  {
    company: "Сфера",
    industry: "Образование",
    quote:
      "Каждую неделю запускаем новую посадочную под курс. Раньше на это уходил весь ресурс дизайна.",
    person: "Мария Соболева, программы",
  },
  {
    company: "Плот",
    industry: "Студия",
    quote:
      "Отдаём клиентам сайты, которые они потом правят сами. Ни одного возврата за полгода.",
    person: "Дмитрий Хан, основатель",
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

/** Лента логотипов с цитатой у каждого: узнавание и доказательство разом. */
export function Testimonials004({
  title = "Нас выбирают не за красивые слова",
  description = "Четыре команды рассказали, что именно изменилось после перехода. Одна фраза от каждого — без пресс-релизов и общих формулировок.",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Testimonials004Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <Heading001
              data-part="heading"
              title={title}
              lede={description}
              ledeWidth={56}
              accent={accent}
            />
          </div>
          <div data-part="grid">
            {items.map((item) => (
              <Card026 key={item.company} data-part="cell" company={item.company} industry={item.industry} quote={item.quote} person={item.person} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
