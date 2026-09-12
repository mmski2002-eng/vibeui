import type { ComponentProps, CSSProperties } from "react"

export type Chart009Group = {
  label: string
  now: number
  before: number
}

export type Chart009Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  groups?: Chart009Group[]
  nowLabel?: string
  beforeLabel?: string
  /** Подпись пары для скринридера: {label}, {now}, {before} и подписи периодов. */
  groupLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: две серии столбиков рядом. Пары стоят вплотную, а группы
// разделены зазором — так глаз сравнивает внутри пары, а не через весь
// график. Прошлый период показан приглушённым: он фон для нынешнего, а не
// равноправная величина.
//
// Тема берётся из color-scheme окружения через light-dark(): график темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-009"]){
--vibeui-chart-009-bg:transparent;
--vibeui-chart-009-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-009-muted:color-mix(in oklab,var(--vibeui-chart-009-fg) 68%,transparent);
--vibeui-chart-009-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-009-track:light-dark(oklch(0.93 0 265),oklch(0.32 0 265));
--vibeui-chart-009-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-chart-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-009"]{color-scheme:dark}
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
[data-vibeui-block="chart-009"] [data-part="swatch"]{width:0.625rem;height:0.625rem;border-radius:0.1875rem;background:var(--vibeui-chart-009-accent);color:oklch(from var(--vibeui-chart-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="chart-009"] [data-part="swatch"][data-before="true"]{background:color-mix(in oklab,var(--vibeui-chart-009-accent) 30%,var(--vibeui-chart-009-track))}
/* Пары вплотную, группы с зазором: сравнение идёт внутри пары. */
[data-vibeui-block="chart-009"] [data-part="plot"]{
display:flex;align-items:flex-end;gap:0.875rem;height:7rem;
}
[data-vibeui-block="chart-009"] [data-part="group"]{display:flex;align-items:flex-end;gap:0.1875rem;flex:1;height:100%}
[data-vibeui-block="chart-009"] [data-part="bar"]{
flex:1;border-radius:0.25rem 0.25rem 0 0;background:var(--vibeui-chart-009-accent);color:oklch(from var(--vibeui-chart-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="chart-009"] [data-part="bar"][data-before="true"]{
background:color-mix(in oklab,var(--vibeui-chart-009-accent) 30%,var(--vibeui-chart-009-track));
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
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Две серии столбиков рядом: пары вплотную, группы с зазором.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart009({
  title = "Установки по дням",
  groups = DEFAULT_GROUPS,
  nowLabel = "Эта неделя",
  beforeLabel = "Прошлая",
  groupLabel = "{label}: {nowLabel} {now}, {beforeLabel} {before}",
  accent,
  background = "",
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
    ...(background
      ? {
          "--vibeui-chart-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-009" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
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
              aria-label={fillTemplate(groupLabel, {
                label: group.label,
                now: group.now,
                before: group.before,
                nowLabel,
                beforeLabel,
              })}
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
