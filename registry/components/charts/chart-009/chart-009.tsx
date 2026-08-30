import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart009Group = {
  label: string
  now: number
  before: number
}

export type Chart009Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  groups?: Chart009Group[]
  nowLabel?: string
  beforeLabel?: string
  accent?: string
}

// Идея компонента: две серии столбиков рядом. Пары стоят вплотную, а группы
// разделены зазором — так глаз сравнивает внутри пары, а не через весь
// график. Прошлый период показан приглушённым: он фон для нынешнего, а не
// равноправная величина.
const STYLES = `
:where([data-vibeui-block="chart-009"]){
--vibeui-chart-009-bg:oklch(1 0 0);
--vibeui-chart-009-fg:oklch(0.22 0.014 265);
--vibeui-chart-009-muted:oklch(0.56 0.014 265);
--vibeui-chart-009-border:oklch(0.91 0.006 265);
--vibeui-chart-009-accent:oklch(0.55 0.17 265);
--vibeui-chart-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-009"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-009-bg);
border:1px solid var(--vibeui-chart-009-border);border-radius:0.875rem;
color:var(--vibeui-chart-009-fg);font-family:var(--vibeui-chart-009-font);
}
[data-vibeui-block="chart-009"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;flex-wrap:wrap}
[data-vibeui-block="chart-009"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-009"] [data-part="legend"]{display:flex;gap:0.75rem;font-size:0.75rem;color:var(--vibeui-chart-009-muted)}
[data-vibeui-block="chart-009"] [data-part="key"]{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="chart-009"] [data-part="swatch"]{width:0.625rem;height:0.625rem;border-radius:0.1875rem;background:var(--vibeui-chart-009-accent)}
[data-vibeui-block="chart-009"] [data-part="swatch"][data-before="true"]{background:color-mix(in oklab,var(--vibeui-chart-009-accent) 30%,oklch(0.93 0.005 265))}
/* Пары вплотную, группы с зазором: сравнение идёт внутри пары. */
[data-vibeui-block="chart-009"] [data-part="plot"]{
display:flex;align-items:flex-end;gap:0.875rem;height:7rem;
}
[data-vibeui-block="chart-009"] [data-part="group"]{display:flex;align-items:flex-end;gap:0.1875rem;flex:1;height:100%}
[data-vibeui-block="chart-009"] [data-part="bar"]{
flex:1;border-radius:0.25rem 0.25rem 0 0;background:var(--vibeui-chart-009-accent);
}
[data-vibeui-block="chart-009"] [data-part="bar"][data-before="true"]{
background:color-mix(in oklab,var(--vibeui-chart-009-accent) 30%,oklch(0.93 0.005 265));
}
[data-vibeui-block="chart-009"] [data-part="axis"]{
display:flex;gap:0.875rem;font-size:0.6875rem;color:var(--vibeui-chart-009-muted);
}
[data-vibeui-block="chart-009"] [data-part="axis"] span{flex:1;text-align:center}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Chart009Group[] = [
  { label: "Пн", now: 42, before: 36 },
  { label: "Вт", now: 55, before: 48 },
  { label: "Ср", now: 48, before: 52 },
  { label: "Чт", now: 61, before: 44 },
  { label: "Пт", now: 72, before: 58 },
]

/**
 * Две серии столбиков рядом: пары вплотную, группы с зазором.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart009({
  title = "Установки по дням",
  groups = DEFAULT_GROUPS,
  nowLabel = "Эта неделя",
  beforeLabel = "Прошлая",
  accent,
  className,
  style,
  ...props
}: Chart009Props) {
  const max = Math.max(
    ...groups.flatMap((group) => [group.now, group.before]),
    1,
  )

  const palette = {
    ...(accent ? { "--vibeui-chart-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-009" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-009"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <p data-part="legend">
            <span data-part="key">
              <span data-part="swatch" aria-hidden="true" />
              {nowLabel}
            </span>
            <span data-part="key">
              <span data-part="swatch" data-before="true" aria-hidden="true" />
              {beforeLabel}
            </span>
          </p>
        </div>
        <div data-part="plot">
          {groups.map((group) => (
            <div
              key={group.label}
              data-part="group"
              role="img"
              aria-label={`${group.label}: ${nowLabel} ${group.now}, ${beforeLabel} ${group.before}`}
            >
              <span
                data-part="bar"
                data-before="true"
                style={{
                  height: `${Math.max(4, (group.before / max) * 100)}%`,
                }}
              />
              <span
                data-part="bar"
                style={{ height: `${Math.max(4, (group.now / max) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div data-part="axis">
          {groups.map((group) => (
            <span key={group.label}>{group.label}</span>
          ))}
        </div>
      </figure>
    </>
  )
}
