import type { CSSProperties } from "react"

type Testimonials002Item = {
  quote: string
  name: string
  role: string
  source: string
}

export type Testimonials002Props = {
  eyebrow?: string
  title?: string
  items?: Testimonials002Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Ровная сетка отзывов карточками. Все отзывы равны по весу — так делают,
// когда важно показать не одну громкую цитату, а объём: карточки одной
// высоты, автор внизу, источник отзыва подписан. Источник важен: отзыв без
// указания, откуда он взят, читается как написанный маркетологом.
const STYLES = `
:where([data-vibeui-block="testimonials-002"]){
--vibeui-testimonials-002-bg:transparent;
--vibeui-testimonials-002-card:light-dark(oklch(1 0 0),oklch(0.255 0 260));
--vibeui-testimonials-002-ink:light-dark(oklch(0.22 0 260),oklch(0.95 0 260));
--vibeui-testimonials-002-muted:light-dark(oklch(0.5 0 260),oklch(0.72 0 260));
--vibeui-testimonials-002-border:light-dark(oklch(0.91 0 260),oklch(0.35 0 260));
--vibeui-testimonials-002-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.76 0.14 39.8));
--vibeui-testimonials-002-shadow:light-dark(oklch(0.2 0.04 39.8 / 70%),oklch(0.05 0 260 / 85%));
--vibeui-testimonials-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-002"]{color-scheme:dark}
[data-vibeui-block="testimonials-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-002-bg);color:var(--vibeui-testimonials-002-ink);
font-family:var(--vibeui-testimonials-002-font);
}
[data-vibeui-block="testimonials-002"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-002"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-testimonials-002-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-002"] [data-part="title"]{
margin:0 0 2rem;max-width:20ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="testimonials-002"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="testimonials-002"] [data-part="card"]{
/* Элемент грида не сжимается меньше содержимого без явного нуля: на узком
   экране карточка вылезала за край блока. */
min-inline-size:0;
display:flex;flex-direction:column;gap:1.25rem;margin:0;
padding:1.5rem;border:1px solid var(--vibeui-testimonials-002-border);border-radius:1.125rem;
background:var(--vibeui-testimonials-002-card);
transition:border-color .18s ease,transform .18s ease,box-shadow .18s ease;
}
[data-vibeui-block="testimonials-002"] [data-part="card"]:hover{
border-color:color-mix(in oklab,var(--vibeui-testimonials-002-accent) 40%,var(--vibeui-testimonials-002-border));
transform:translateY(-2px);
box-shadow:0 22px 44px -36px var(--vibeui-testimonials-002-shadow);
}
[data-vibeui-block="testimonials-002"] [data-part="quote"]{
margin:0;flex:1 1 auto;
font-size:1rem;line-height:1.6;
}
[data-vibeui-block="testimonials-002"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="testimonials-002"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="testimonials-002"] [data-part="author"]{
display:flex;align-items:center;gap:0.75rem;
padding-top:1rem;border-top:1px solid var(--vibeui-testimonials-002-border);
}
[data-vibeui-block="testimonials-002"] [data-part="avatar"]{
width:2.5rem;height:2.5rem;flex:none;border-radius:999px;
display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-testimonials-002-accent) 15%,var(--vibeui-testimonials-002-card));
color:var(--vibeui-testimonials-002-accent);
font-size:0.8125rem;font-weight:750;letter-spacing:0.02em;
}
[data-vibeui-block="testimonials-002"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="testimonials-002"] [data-part="name"]{font-size:0.9375rem;font-weight:640}
[data-vibeui-block="testimonials-002"] [data-part="role"]{color:var(--vibeui-testimonials-002-muted);font-size:0.8125rem;line-height:1.35}
[data-vibeui-block="testimonials-002"] [data-part="source"]{
margin-left:auto;flex:none;align-self:flex-start;
padding:0.1875rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-testimonials-002-border);
color:var(--vibeui-testimonials-002-muted);font-size:0.6875rem;font-weight:600;white-space:nowrap;
}
@container (min-width: 40rem){
[data-vibeui-block="testimonials-002"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-002"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="testimonials-002"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials002Item[] = [
  {
    quote:
      "Раньше на посадочную страницу уходила неделя вёрстки. Сейчас маркетолог собирает её сам за вечер, а мы только проверяем тексты.",
    name: "Анна Ковалёва",
    role: "Руководитель маркетинга, «Северный путь»",
    source: "Отзыв в чате",
  },
  {
    quote:
      "Понравилось, что компоненты приходят обычными файлами в проект. Ничего не ломается при обновлении, потому что обновлять нечего.",
    name: "Игорь Демидов",
    role: "Технический директор, Sturm",
    source: "Письмо",
  },
  {
    quote:
      "Пришли за одной секцией, остались из-за документации. Впервые встретил инструкцию, написанную для того, кто будет это поддерживать.",
    name: "Пётр Ляхов",
    role: "Фронтенд-разработчик",
    source: "Отзыв на GitHub",
  },
  {
    quote:
      "Собрали лендинг под кампанию за два дня вместе с текстами. Успели к дате запуска, чего за три года не случалось ни разу.",
    name: "Мария Соболева",
    role: "Продюсер образовательных программ",
    source: "Созвон",
  },
  {
    quote:
      "Дизайнер в команде один, а проектов пять. Библиотека закрыла рутину и оставила ему время на то, ради чего его нанимали.",
    name: "Дмитрий Хан",
    role: "Основатель студии «Плот»",
    source: "Отзыв в чате",
  },
  {
    quote:
      "Отдельно ценно, что блоки не тянут за собой библиотеку компонентов. Взяли три штуки и не получили сорок мегабайт зависимостей.",
    name: "Ольга Титова",
    role: "Инженер, финтех",
    source: "Письмо",
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

/** Ровная сетка отзывов: все карточки равны, источник отзыва подписан. */
export function Testimonials002({
  eyebrow = "Отзывы",
  title = "Что говорят команды, которые уже перешли",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Testimonials002Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {items.map((item) => (
              <figure key={item.name} data-part="card">
                <blockquote data-part="quote">{item.quote}</blockquote>
                <figcaption data-part="author">
                  <span data-part="avatar" aria-hidden="true">
                    {initials(item.name)}
                  </span>
                  <span data-part="who">
                    <span data-part="name">{item.name}</span>
                    <span data-part="role">{item.role}</span>
                  </span>
                  <span data-part="source">{item.source}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
