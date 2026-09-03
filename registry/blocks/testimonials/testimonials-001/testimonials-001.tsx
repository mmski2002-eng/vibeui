import type { CSSProperties } from "react"

type Testimonials001Item = {
  quote: string
  name: string
  role: string
  /** Крупный отзыв занимает две колонки: он и есть главный. */
  featured?: boolean
}

export type Testimonials001Props = {
  eyebrow?: string
  title?: string
  items?: Testimonials001Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// container-type делает секцию собственным query-контейнером: число колонок
// считается от ширины блока, а не окна, поэтому миниатюра каталога показывает
// настоящую сетку, а не мобильный столбик.
//
// Идея блока: один отзыв крупный, остальные мелкие. Стена одинаковых карточек
// читается как шум; иерархия заставляет прочитать хотя бы главный.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее подложки карточки, а не темнее.
const STYLES = `
:where([data-vibeui-block="testimonials-001"]){
--vibeui-testimonials-001-bg:transparent;
--vibeui-testimonials-001-card:light-dark(oklch(1 0 0),oklch(0.26 0.016 265));
--vibeui-testimonials-001-ink:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.006 265));
--vibeui-testimonials-001-muted:light-dark(oklch(0.5 0.014 265),oklch(0.72 0.012 265));
--vibeui-testimonials-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.014 265));
--vibeui-testimonials-001-accent:light-dark(oklch(0.52 0.19 265),oklch(0.76 0.15 265));
--vibeui-testimonials-001-serif:ui-serif,Georgia,"Times New Roman",Times,serif;
--vibeui-testimonials-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-001"]{color-scheme:dark}
[data-vibeui-block="testimonials-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-testimonials-001-bg);color:var(--vibeui-testimonials-001-ink);
font-family:var(--vibeui-testimonials-001-sans);
}
[data-vibeui-block="testimonials-001"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:3.5rem 1.5rem;
}
[data-vibeui-block="testimonials-001"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.5rem;margin-bottom:2rem;
}
[data-vibeui-block="testimonials-001"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-testimonials-001-accent);
}
[data-vibeui-block="testimonials-001"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(1.625rem,3.6cqi,2.5rem);line-height:1.1;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="testimonials-001"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="testimonials-001"] figure{
display:flex;flex-direction:column;gap:1rem;margin:0;
padding:1.25rem;
border:1px solid var(--vibeui-testimonials-001-border);border-radius:1rem;
background:var(--vibeui-testimonials-001-card);
}
[data-vibeui-block="testimonials-001"] blockquote{
margin:0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-testimonials-001-ink);
}
[data-vibeui-block="testimonials-001"] figcaption{
display:flex;align-items:center;gap:0.625rem;margin-top:auto;
font-size:0.8125rem;color:var(--vibeui-testimonials-001-muted);
}
/* Аватар — инициалы на подложке: фотографии в отзывах чаще всего стоковые. */
[data-vibeui-block="testimonials-001"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-testimonials-001-accent) 14%,transparent);
color:var(--vibeui-testimonials-001-accent);
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="testimonials-001"] [data-part="name"]{
display:block;color:var(--vibeui-testimonials-001-ink);font-weight:560;
}
/* Главный отзыв: крупная засечная цитата и две колонки сетки. */
[data-vibeui-block="testimonials-001"] figure[data-featured="true"] blockquote{
font-family:var(--vibeui-testimonials-001-serif);
font-size:clamp(1.125rem,2.2cqi,1.5rem);line-height:1.4;letter-spacing:-0.01em;
}
[data-vibeui-block="testimonials-001"] figure[data-featured="true"]{
border-color:color-mix(in oklab,var(--vibeui-testimonials-001-accent) 30%,var(--vibeui-testimonials-001-border));
}
@container (min-width: 44rem){
[data-vibeui-block="testimonials-001"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="testimonials-001"] figure[data-featured="true"]{grid-column:span 2}
}
@container (min-width: 64rem){
[data-vibeui-block="testimonials-001"] [data-part="frame"]{padding:5rem 3rem}
[data-vibeui-block="testimonials-001"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}
[data-vibeui-block="testimonials-001"] figure{padding:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials001Item[] = [
  {
    quote:
      "Мы перестали спорить о вёрстке. Дизайнер выбирает блок, агент ставит ровно его — и то, что видно в превью, оказывается на странице без переделок.",
    name: "Анна Ковалёва",
    role: "Арт-директор, студия «Полёт»",
    featured: true,
  },
  {
    quote:
      "Раньше на лендинг уходила неделя. Сейчас собираю за вечер и трачу время на текст, а не на отступы.",
    name: "Дмитрий Орлов",
    role: "Основатель, Grafit",
  },
  {
    quote:
      "Понравилось, что компонент приходит одним файлом. Никаких зависимостей, которые придётся тащить в проект годами.",
    name: "Сергей Мохов",
    role: "Фронтенд-разработчик",
  },
  {
    quote:
      "Инструкция для агента оказалась важнее самих блоков: он больше не сочиняет свой вариант вместо нашего.",
    name: "Ирина Белова",
    role: "Продакт-менеджер, Северная почта",
  },
  {
    quote:
      "Взяли пять блоков, переопределили переменные под наш бренд — и секции встали в существующий сайт без конфликтов стилей.",
    name: "Павел Гусев",
    role: "Технический директор, Ремарк",
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

/** Инициалы: первые буквы двух первых слов имени. */
function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/**
 * Секция отзывов с иерархией: один крупный, остальные мелкие.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Testimonials001({
  eyebrow = "Отзывы",
  title = "Что говорят те, кто уже собрал сайт",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Testimonials001Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-001"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="head">
            {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
            <h2 data-part="title">{title}</h2>
          </div>
          <div data-part="grid">
            {items.map((item) => (
              <figure
                key={item.name}
                data-featured={item.featured || undefined}
              >
                <blockquote>«{item.quote}»</blockquote>
                <figcaption>
                  <span data-part="mark" aria-hidden="true">
                    {initialsOf(item.name)}
                  </span>
                  <span>
                    <span data-part="name">{item.name}</span>
                    {item.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
