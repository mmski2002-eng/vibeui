import type { CSSProperties } from "react"

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
const STYLES = `
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
[data-vibeui-block="testimonials-004"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(1.5rem,4.4cqi,2.25rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="testimonials-004"] [data-part="text"]{
margin:0;max-width:56ch;color:var(--vibeui-testimonials-004-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="testimonials-004"] [data-part="grid"]{
display:grid;gap:0;border-top:1px solid var(--vibeui-testimonials-004-border);
}
[data-vibeui-block="testimonials-004"] [data-part="cell"]{
display:grid;gap:0.875rem;align-content:start;margin:0;
padding:1.75rem 0;border-bottom:1px solid var(--vibeui-testimonials-004-border);
}
[data-vibeui-block="testimonials-004"] [data-part="logo"]{
display:inline-flex;align-items:center;gap:0.5rem;
font-size:1.125rem;font-weight:760;letter-spacing:-0.035em;
}
[data-vibeui-block="testimonials-004"] [data-part="glyph"]{
width:1.625rem;height:1.625rem;flex:none;border-radius:0.5rem;
background:var(--vibeui-testimonials-004-accent);
mask-image:conic-gradient(from 0deg at 50% 50%,black 0 25%,transparent 0 50%,black 0 75%,transparent 0);
mask-size:0.8125rem 0.8125rem;color:oklch(from var(--vibeui-testimonials-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="testimonials-004"] [data-part="industry"]{
color:var(--vibeui-testimonials-004-muted);
font-size:0.6875rem;font-weight:640;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-004"] [data-part="quote"]{
margin:0;font-size:0.9375rem;line-height:1.6;max-width:42ch;
}
[data-vibeui-block="testimonials-004"] [data-part="person"]{
color:var(--vibeui-testimonials-004-muted);font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="testimonials-004"] [data-part="person"]::before{content:"— "}
@container (min-width: 42rem){
[data-vibeui-block="testimonials-004"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-004"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:3rem}
}
@container (min-width: 68rem){
[data-vibeui-block="testimonials-004"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:2.5rem}
[data-vibeui-block="testimonials-004"] [data-part="cell"]{padding:2rem 0}
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
            <h2 data-part="title">{title}</h2>
            <p data-part="text">{description}</p>
          </div>
          <div data-part="grid">
            {items.map((item) => (
              <figure key={item.company} data-part="cell">
                <span data-part="logo">
                  <span data-part="glyph" aria-hidden="true" />
                  {item.company}
                </span>
                <span data-part="industry">{item.industry}</span>
                <blockquote data-part="quote">{item.quote}</blockquote>
                <figcaption data-part="person">{item.person}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
