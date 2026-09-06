import type { CSSProperties } from "react"

export type Features003Column = {
  number: string
  title: string
  description: string
  link?: { label: string; href: string }
}

export type Features003Props = {
  title?: string
  lede?: string
  columns?: Features003Column[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: журнальная полоса в три колонки. Ни карточек, ни иконок —
// колонки держатся на верхней линейке и порядковом номере, как рубрики в
// печатном развороте. Заголовки набраны системным serif, текст — sans:
// пара шрифтов делает работу, которую в других блоках делают рамки и тени.
// Колонки равной высоты, ссылка прижата к низу, поэтому нижний край ровный
// даже при разной длине описаний.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Тёмная ветка — не
// инверсия светлой: линейка там светлее фона, но не белая, иначе рубрика
// начинает спорить с заголовком.
const STYLES = `
:where([data-vibeui-block="features-003"]){
--vibeui-features-003-bg:transparent;
--vibeui-features-003-fg:light-dark(oklch(0.19 0.012 80),oklch(0.95 0.006 80));
--vibeui-features-003-muted:light-dark(oklch(0.48 0.014 80),oklch(0.71 0.012 80));
--vibeui-features-003-line:light-dark(oklch(0.24 0.012 80),oklch(0.74 0.012 80));
--vibeui-features-003-accent:light-dark(oklch(0.55 0.13 39.8),oklch(0.74 0.13 39.8));
--vibeui-features-003-serif:ui-serif,Georgia,"Iowan Old Style","Times New Roman",serif;
--vibeui-features-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-003"]{color-scheme:dark}
[data-vibeui-block="features-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-003-bg);color:var(--vibeui-features-003-fg);
font-family:var(--vibeui-features-003-sans);
}
[data-vibeui-block="features-003"] *{box-sizing:border-box}
[data-vibeui-block="features-003"] [data-part="shell"]{max-width:68rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-003"] h2{
margin:0;max-width:22ch;font-family:var(--vibeui-features-003-serif);font-weight:400;
font-size:clamp(1.75rem,5cqi,3rem);line-height:1.08;letter-spacing:-0.025em;text-wrap:balance;
}
[data-vibeui-block="features-003"] [data-part="lede"]{
margin:1rem 0 0;max-width:34rem;font-size:clamp(0.9375rem,1.3cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-features-003-muted);text-wrap:pretty;
}
[data-vibeui-block="features-003"] [data-part="cols"]{
list-style:none;margin:2.75rem 0 0;padding:0;display:grid;grid-template-columns:1fr;gap:2rem;
}
[data-vibeui-block="features-003"] [data-part="col"]{
display:flex;flex-direction:column;padding-top:1rem;border-top:2px solid var(--vibeui-features-003-line);
}
[data-vibeui-block="features-003"] [data-part="num"]{
font-size:0.75rem;font-weight:700;letter-spacing:0.16em;color:var(--vibeui-features-003-accent);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="features-003"] h3{
margin:0.75rem 0 0;font-family:var(--vibeui-features-003-serif);font-weight:400;
font-size:1.375rem;line-height:1.2;letter-spacing:-0.015em;
}
[data-vibeui-block="features-003"] [data-part="col"] p{
margin:0.625rem 0 0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-features-003-muted);text-wrap:pretty;
}
[data-vibeui-block="features-003"] a{
margin-top:auto;padding-top:1.25rem;display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.875rem;font-weight:650;color:var(--vibeui-features-003-fg);text-decoration:none;
transition:color .16s ease,gap .16s ease;
}
[data-vibeui-block="features-003"] a:hover{color:var(--vibeui-features-003-accent);gap:0.625rem}
[data-vibeui-block="features-003"] a:focus-visible{outline:2px solid var(--vibeui-features-003-accent);outline-offset:3px}
@container (min-width: 34rem){
[data-vibeui-block="features-003"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="features-003"] [data-part="cols"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2.5rem}
[data-vibeui-block="features-003"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Features003Column[] = [
  {
    number: "I",
    title: "Переносимость",
    description:
      "Секция — один файл без внешних импортов. Она не знает про вашу тему, ваши утилиты и вашу версию Tailwind, поэтому переезжает в чужой проект копированием.",
    link: { label: "Как устроен файл", href: "#" },
  },
  {
    number: "II",
    title: "Фидельность",
    description:
      "Превью рендерит ровно тот файл, который вы получаете. Никаких демо-копий, которые со временем расходятся с поставкой.",
    link: { label: "Правило фидельности", href: "#" },
  },
  {
    number: "III",
    title: "Читаемость для агента",
    description:
      "К каждой секции приложена инструкция: что нельзя ломать, что можно менять и какие пропсы за это отвечают.",
    link: { label: "Пример инструкции", href: "#" },
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

/** Три колонки с описаниями: верхние линейки, порядковые номера, serif-заголовки. */
export function Features003({
  title = "Три принципа, на которых держится библиотека",
  lede = "Не список галочек, а редакционная полоса: каждая колонка объясняет одно решение и ведёт в документацию.",
  columns = DEFAULT_COLUMNS,
  background = "",
  accent,
  className,
  style,
}: Features003Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <ul data-part="cols">
            {columns.slice(0, 3).map((column) => (
              <li key={column.title} data-part="col">
                <span data-part="num">{column.number}</span>
                <h3>{column.title}</h3>
                <p>{column.description}</p>
                {column.link ? (
                  <a href={column.link.href}>{column.link.label} →</a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
