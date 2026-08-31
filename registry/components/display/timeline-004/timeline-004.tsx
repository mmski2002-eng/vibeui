import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline004Point = {
  date: string
  title: string
  text?: string
  /** Веха рисуется ромбом и не теряется среди рядовых записей. */
  milestone?: boolean
}

export type Timeline004Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  points?: Timeline004Point[]
  title?: string
  accent?: string
}

// Идея компонента: хронология проекта, где вехи не равны рядовым записям.
// Веха — ромб и жирная дата, обычная запись — точка: важное видно, даже если
// список не читать. Раскладка считается от собственной ширины блока: узкий
// блок даёт один столбец, широкий — дату отдельной колонкой слева, поэтому
// даты выстраиваются по вертикали и список читается как календарь.
const STYLES = `
:where([data-vibeui-block="timeline-004"]){
--vibeui-timeline-004-bg:oklch(1 0 0);
--vibeui-timeline-004-fg:oklch(0.22 0.014 265);
--vibeui-timeline-004-muted:oklch(0.57 0.014 265);
--vibeui-timeline-004-border:oklch(0.91 0.006 265);
--vibeui-timeline-004-accent:oklch(0.55 0.19 30);
--vibeui-timeline-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="timeline-004"]{
display:block;width:100%;max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-timeline-004-font);color:var(--vibeui-timeline-004-fg);
}
[data-vibeui-block="timeline-004"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.75rem;
box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-004-bg);
border:1px solid var(--vibeui-timeline-004-border);border-radius:0.875rem;
}
[data-vibeui-block="timeline-004"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-004"] ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-004"] li{
position:relative;display:grid;grid-template-columns:0.875rem 1fr;
gap:0.25rem 0.75rem;padding:0 0 1rem 0;
}
[data-vibeui-block="timeline-004"] li::before{
content:"";position:absolute;left:0.375rem;top:1.125rem;bottom:0;
width:1px;background:var(--vibeui-timeline-004-border);
}
[data-vibeui-block="timeline-004"] li:last-child{padding-bottom:0}
[data-vibeui-block="timeline-004"] li:last-child::before{display:none}
[data-vibeui-block="timeline-004"] [data-part="mark"]{
grid-row:1 / span 2;align-self:start;justify-self:center;margin-top:0.375rem;
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-timeline-004-border);
}
/* Ромб вместо точки: веха отличается формой, а не только цветом. */
[data-vibeui-block="timeline-004"] li[data-kind="milestone"] [data-part="mark"]{
width:0.625rem;height:0.625rem;margin-top:0.25rem;border-radius:0.0625rem;
transform:rotate(45deg);background:var(--vibeui-timeline-004-accent);
}
[data-vibeui-block="timeline-004"] [data-part="date"]{
font-size:0.6875rem;letter-spacing:0.02em;color:var(--vibeui-timeline-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="timeline-004"] li[data-kind="milestone"] [data-part="date"]{
color:var(--vibeui-timeline-004-accent);font-weight:700;
}
[data-vibeui-block="timeline-004"] [data-part="body"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="timeline-004"] [data-part="name"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="timeline-004"] li[data-kind="milestone"] [data-part="name"]{font-weight:700}
[data-vibeui-block="timeline-004"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-timeline-004-muted)}
/* Широкий блок: дата уезжает в свой столбец и даты встают по вертикали. */
@container (min-width: 30rem){
[data-vibeui-block="timeline-004"] li{grid-template-columns:6.5rem 0.875rem 1fr;align-items:start}
[data-vibeui-block="timeline-004"] li::before{left:7.375rem}
[data-vibeui-block="timeline-004"] [data-part="date"]{grid-column:1;grid-row:1;text-align:right;padding-top:0.1875rem}
[data-vibeui-block="timeline-004"] [data-part="mark"]{grid-column:2;grid-row:1;margin-top:0.4375rem}
[data-vibeui-block="timeline-004"] li[data-kind="milestone"] [data-part="mark"]{margin-top:0.3125rem}
[data-vibeui-block="timeline-004"] [data-part="body"]{grid-column:3;grid-row:1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS: Timeline004Point[] = [
  {
    date: "14 января",
    title: "Старт проекта",
    text: "Собрана команда, согласован объём первой версии",
    milestone: true,
  },
  { date: "02 февраля", title: "Прототип интерфейса" },
  {
    date: "27 февраля",
    title: "Внутренний релиз",
    text: "Сборка для команды: только каталог и поиск",
    milestone: true,
  },
  { date: "11 марта", title: "Правки после теста на пользователях" },
  {
    date: "05 апреля",
    title: "Публичный запуск",
    text: "Открытая регистрация и первый платный тариф",
    milestone: true,
  },
]

/**
 * Хронология проекта: вехи ромбом, даты отдельным столбцом на широкой раскладке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline004({
  points = DEFAULT_POINTS,
  title = "Хронология проекта",
  accent,
  className,
  style,
  ...props
}: Timeline004Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h3 data-part="title">{title}</h3>
          <ol>
            {points.map((point) => (
              <li
                key={point.title}
                data-kind={point.milestone ? "milestone" : "event"}
              >
                <span data-part="mark" aria-hidden="true" />
                <span data-part="date">{point.date}</span>
                <div data-part="body">
                  <span data-part="name">{point.title}</span>
                  {point.text ? <p data-part="text">{point.text}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
