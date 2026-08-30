import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion009Entry = {
  date: string
  title: string
  body: string
  /** Метка выпуска: «Релиз», «Исправление», «Beta». */
  tag?: string
}

export type Accordion009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  entries?: Accordion009Entry[]
  defaultOpen?: number
  accent?: string
}

// Идея компонента: аккордеон-лента событий. Слева непрерывная линия с точками,
// справа раскрывающиеся записи — так читают историю изменений: сначала по
// датам, потом вглубь одной записи. Точка верхней записи залита акцентом:
// последнее событие важнее остальных, и оно должно быть видно сразу.
const STYLES = `
:where([data-vibeui-block="accordion-009"]){
--vibeui-accordion-009-fg:oklch(0.22 0.014 265);
--vibeui-accordion-009-muted:oklch(0.52 0.014 265);
--vibeui-accordion-009-bg:oklch(1 0 0);
--vibeui-accordion-009-line:oklch(0.9 0.006 265);
--vibeui-accordion-009-accent:oklch(0.55 0.2 262);
--vibeui-accordion-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-009"]{
display:flex;flex-direction:column;
width:100%;max-width:40rem;box-sizing:border-box;
color:var(--vibeui-accordion-009-fg);font-family:var(--vibeui-accordion-009-font);
}
[data-vibeui-block="accordion-009"] details{position:relative;padding-left:1.75rem}
/* Линия ленты: у последней записи она обрывается на её точке. */
[data-vibeui-block="accordion-009"] details::before{
content:"";position:absolute;left:0.3125rem;top:0;bottom:0;
width:1px;background:var(--vibeui-accordion-009-line);
}
[data-vibeui-block="accordion-009"] details:last-child::before{bottom:auto;height:1.125rem}
[data-vibeui-block="accordion-009"] details::after{
content:"";position:absolute;left:0;top:0.875rem;
width:0.6875rem;height:0.6875rem;border-radius:9999px;
border:2px solid var(--vibeui-accordion-009-line);
background:var(--vibeui-accordion-009-bg);
}
[data-vibeui-block="accordion-009"] details:first-child::after{
border-color:var(--vibeui-accordion-009-accent);
background:var(--vibeui-accordion-009-accent);
}
[data-vibeui-block="accordion-009"] details[open]::after{border-color:var(--vibeui-accordion-009-accent)}
[data-vibeui-block="accordion-009"] summary{
display:flex;align-items:baseline;gap:0.625rem;flex-wrap:wrap;
padding:0.625rem 0 0.75rem;cursor:pointer;list-style:none;
}
[data-vibeui-block="accordion-009"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-009"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-009-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="accordion-009"] [data-part="date"]{
flex:none;font-size:0.75rem;color:var(--vibeui-accordion-009-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="accordion-009"] [data-part="tag"]{
flex:none;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-accordion-009-accent) 12%,transparent);
color:var(--vibeui-accordion-009-accent);
font-size:0.6875rem;font-weight:600;
}
[data-vibeui-block="accordion-009"] [data-part="title"]{
flex:1 1 100%;font-size:0.9375rem;font-weight:550;line-height:1.4;
transition:color .16s ease;
}
[data-vibeui-block="accordion-009"] summary:hover [data-part="title"]{color:var(--vibeui-accordion-009-accent)}
[data-vibeui-block="accordion-009"] [data-part="body"]{
margin:0;padding:0 0 1rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-009-muted);max-width:58ch;
}
@container (min-width: 34rem){
[data-vibeui-block="accordion-009"] summary{flex-wrap:nowrap}
[data-vibeui-block="accordion-009"] [data-part="date"]{width:5.5rem}
[data-vibeui-block="accordion-009"] [data-part="title"]{flex:1 1 auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Accordion009Entry[] = [
  {
    date: "12 марта",
    tag: "Релиз",
    title: "Панель кода в карточке каталога",
    body: "Код компонента открывается прямо на витрине: команда установки, исходник и копирование — без перехода на страницу item'а.",
  },
  {
    date: "4 марта",
    tag: "Beta",
    title: "Настройка компонента перед выдачей агенту",
    body: "Подписи, размеры и акцент меняются на карточке, значения уезжают в ссылку. Исходник при этом не трогается.",
  },
  {
    date: "27 февраля",
    title: "Английская версия каталога",
    body: "Интерфейс, метаданные и инструкция для агента переведены целиком. Русский остаётся основным, английский живёт под /en.",
  },
  {
    date: "19 февраля",
    tag: "Исправление",
    title: "Миниатюры перестали показывать мобильную вёрстку",
    body: "Раскладка блоков считается от собственной ширины через container-запросы, поэтому в карточке виден настоящий десктопный дизайн.",
  },
]

/**
 * Аккордеон-лента событий: линия с точками и раскрывающиеся записи.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion009({
  entries = DEFAULT_ENTRIES,
  defaultOpen = 0,
  accent,
  className,
  style,
  ...props
}: Accordion009Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-009"
        className={className}
        style={palette}
      >
        {entries.map((entry, index) => (
          <details key={entry.title} open={index === defaultOpen}>
            <summary>
              <span data-part="date">{entry.date}</span>
              {entry.tag ? <span data-part="tag">{entry.tag}</span> : null}
              <span data-part="title">{entry.title}</span>
            </summary>
            <p data-part="body">{entry.body}</p>
          </details>
        ))}
      </div>
    </>
  )
}
