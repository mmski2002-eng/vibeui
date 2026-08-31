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
const STYLES = `
:where([data-vibeui-block="features-003"]){
--vibeui-features-003-bg:oklch(0.98 0.006 90);
--vibeui-features-003-fg:oklch(0.19 0.012 80);
--vibeui-features-003-muted:oklch(0.48 0.014 80);
--vibeui-features-003-line:oklch(0.24 0.012 80);
--vibeui-features-003-accent:oklch(0.45 0.13 30);
--vibeui-features-003-serif:ui-serif,Georgia,"Iowan Old Style","Times New Roman",serif;
--vibeui-features-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="features-003"]{
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

/** Три колонки с описаниями: верхние линейки, порядковые номера, serif-заголовки. */
export function Features003({
  title = "Три принципа, на которых держится библиотека",
  lede = "Не список галочек, а редакционная полоса: каждая колонка объясняет одно решение и ведёт в документацию.",
  columns = DEFAULT_COLUMNS,
  accent,
  className,
  style,
}: Features003Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-003-accent": accent } : null),
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
