import type { ComponentProps, CSSProperties } from "react"

export type Chart003Slice = {
  label: string
  value: number
  hue?: number
}

export type Chart003Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  slices?: Chart003Slice[]
  unit?: string
  /** Подпись итога под легендой: {total} и {unit}. */
  totalLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: кольцевая диаграмма на conic-gradient. SVG с дугами и
// расчётом длины окружности здесь не нужен: доли складываются в один градиент,
// а дырка вырезается маской. Легенда обязательна — по кольцу без подписей
// нельзя назвать ни одну долю, а угол глаз оценивает хуже длины.
//
// Тема берётся из color-scheme окружения через light-dark(): подписи и рамка
// темнеют вместе со страницей, оттенки секторов читаются в обеих темах.
const STYLES = `
:where([data-vibeui-block="chart-003"]){
--vibeui-chart-003-bg:transparent;
--vibeui-chart-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-003-muted:color-mix(in oklab,var(--vibeui-chart-003-fg) 68%,transparent);
--vibeui-chart-003-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-003-accent:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-003-size:7.5rem;
--vibeui-chart-003-thickness:1.375rem;
--vibeui-chart-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-003"]{color-scheme:dark}
[data-vibeui-block="chart-003"]{
display:flex;align-items:center;gap:1rem;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-003-bg);
border:1px solid var(--vibeui-chart-003-border);border-radius:0.875rem;
color:var(--vibeui-chart-003-fg);font-family:var(--vibeui-chart-003-font);
}
/* Кольцо: один conic-gradient и маска вместо SVG с расчётом дуг. */
[data-vibeui-block="chart-003"] [data-part="ring"]{
position:relative;flex:none;
width:var(--vibeui-chart-003-size);height:var(--vibeui-chart-003-size);
border-radius:9999px;
background:conic-gradient(var(--vibeui-chart-003-stops));
mask:radial-gradient(farthest-side,transparent calc(100% - var(--vibeui-chart-003-thickness)),oklch(0 0 0) calc(100% - var(--vibeui-chart-003-thickness)));
}
[data-vibeui-block="chart-003"] [data-part="center"]{
position:absolute;inset:0;display:flex;flex-direction:column;
align-items:center;justify-content:center;
}
[data-vibeui-block="chart-003"] [data-part="total"]{
font-size:1.125rem;font-weight:680;font-variant-numeric:tabular-nums;line-height:1.1;
color:var(--vibeui-chart-003-accent);
}
[data-vibeui-block="chart-003"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-003-muted)}
[data-vibeui-block="chart-003"] [data-part="body"]{display:flex;flex-direction:column;gap:0.5rem;min-width:0;flex:1}
[data-vibeui-block="chart-003"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-003"] [data-part="legend"]{display:flex;flex-direction:column;gap:0.3125rem;margin:0;padding:0;list-style:none}
/* Легенда с числами: по углу сектора долю не назвать. */
[data-vibeui-block="chart-003"] [data-part="row"]{
display:grid;grid-template-columns:0.5rem 1fr auto;align-items:center;gap:0.5rem;
font-size:0.8125rem;
}
/* Цвет точки один на обе темы: он обязан совпадать с сектором кольца,
   а тот считается тем же oklch(0.62 0.15 hue) в разметке. */
[data-vibeui-block="chart-003"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;
background:oklch(0.62 0.15 var(--vibeui-chart-003-hue,250));
}
[data-vibeui-block="chart-003"] [data-part="name"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--vibeui-chart-003-muted)}
[data-vibeui-block="chart-003"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLICES: Chart003Slice[] = [
  { label: "Прямые заходы", value: 42, hue: 250 },
  { label: "Поиск", value: 28, hue: 150 },
  { label: "Соцсети", value: 18, hue: 30 },
  { label: "Письма", value: 12, hue: 300 },
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
 * Кольцевая диаграмма на conic-gradient с обязательной легендой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart003({
  title = "Источники трафика",
  slices = DEFAULT_SLICES,
  unit = "тысяч визитов",
  totalLabel = "Всего: {total} {unit}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart003Props) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1

  // Доли складываются в один список стопов: каждый сектор занимает свой
  // отрезок круга, поэтому кольцо строится без единого расчёта дуги. Начало
  // сектора считается суммой предыдущих — так обходимся без счётчика,
  // который менялся бы прямо во время отрисовки.
  const stops = slices
    .map((slice, index) => {
      const before = slices
        .slice(0, index)
        .reduce((sum, item) => sum + item.value, 0)
      const from = (before / total) * 360
      const to = ((before + slice.value) / total) * 360
      return `oklch(0.62 0.15 ${slice.hue ?? 250}) ${from}deg ${to}deg`
    })
    .join(",")

  const palette = {
    "--vibeui-chart-003-stops": stops,
    ...(accent ? { "--vibeui-chart-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-003" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-003"
        className={className}
        style={palette}
      >
        <div data-part="ring" aria-hidden="true" />
        <div data-part="body">
          <figcaption data-part="title">{title}</figcaption>
          <ul data-part="legend">
            {slices.map((slice) => (
              <li key={slice.label} data-part="row">
                <span
                  data-part="dot"
                  aria-hidden="true"
                  style={
                    {
                      "--vibeui-chart-003-hue": slice.hue ?? 250,
                    } as CSSProperties
                  }
                />
                <span data-part="name">{slice.label}</span>
                <span data-part="value">
                  {Math.round((slice.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
          <span data-part="unit">
            {fillTemplate(totalLabel, { total, unit })}
          </span>
        </div>
      </figure>
    </>
  )
}
