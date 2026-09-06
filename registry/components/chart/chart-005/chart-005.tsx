import type { ComponentProps, CSSProperties } from "react"

export type Chart005Part = {
  label: string
  value: number
  hue?: number
}

export type Chart005Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  parts?: Chart005Part[]
  total?: string
  /** Подпись доли для скринридера: {label} и {percent}. */
  partLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: одна полоса, разложенная на доли. Она отвечает на вопрос
// «из чего состоит целое» и занимает одну строку — там, где кольцо съело бы
// треть карточки. Доли меньше пяти процентов не подписываются внутри: текст
// в них всё равно не помещается, для них есть легенда.
//
// Тема берётся из color-scheme окружения через light-dark(): подписи и рамка
// темнеют вместе со страницей, оттенки долей читаются в обеих темах.
const STYLES = `
:where([data-vibeui-block="chart-005"]){
--vibeui-chart-005-bg:transparent;
--vibeui-chart-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-005-muted:color-mix(in oklab,var(--vibeui-chart-005-fg) 68%,transparent);
--vibeui-chart-005-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-005-accent:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-005"]{color-scheme:dark}
[data-vibeui-block="chart-005"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-005-bg);
border:1px solid var(--vibeui-chart-005-border);border-radius:0.875rem;
color:var(--vibeui-chart-005-fg);font-family:var(--vibeui-chart-005-font);
}
[data-vibeui-block="chart-005"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="chart-005"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-005"] [data-part="total"]{
font-size:0.875rem;font-weight:680;font-variant-numeric:tabular-nums;
color:var(--vibeui-chart-005-accent);
}
/* Полоса — флекс с долями: ширина каждой части задаётся её значением. */
[data-vibeui-block="chart-005"] [data-part="bar"]{
display:flex;height:1.5rem;overflow:hidden;border-radius:0.5rem;
}
/* Цвет доли один на обе темы: он несёт данные, а не подложку, и точка
   легенды обязана совпасть с ним. Подпись поверх насыщенной заливки — белая. */
[data-vibeui-block="chart-005"] [data-part="part"]{
display:flex;align-items:center;justify-content:center;min-width:0;
background:oklch(0.62 0.15 var(--vibeui-chart-005-hue,250));
color:oklch(0.99 0 265);
font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-005"] [data-part="part"] + [data-part="part"]{box-shadow:inset 1px 0 0 oklch(1 0 0 / 55%)}
/* Доля меньше пяти процентов не подписывается: текст в неё не влезает. */
[data-vibeui-block="chart-005"] [data-part="part"][data-narrow="true"] span{display:none}
[data-vibeui-block="chart-005"] ul{display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="chart-005"] li{display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-chart-005-muted)}
[data-vibeui-block="chart-005"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:0.1875rem;
background:oklch(0.62 0.15 var(--vibeui-chart-005-hue,250));
}
[data-vibeui-block="chart-005"] [data-part="legend-value"]{color:var(--vibeui-chart-005-fg);font-weight:650;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PARTS: Chart005Part[] = [
  { label: "Разработка", value: 46, hue: 250 },
  { label: "Дизайн", value: 24, hue: 150 },
  { label: "Поддержка", value: 18, hue: 30 },
  { label: "Инфраструктура", value: 8, hue: 300 },
  { label: "Прочее", value: 4, hue: 200 },
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
 * Полоса, разложенная на доли: «из чего состоит целое» в одну строку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart005({
  title = "Расходы месяца",
  parts = DEFAULT_PARTS,
  total = "1 240 000 ₽",
  partLabel = "{label}: {percent}%",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart005Props) {
  const sum = parts.reduce((value, part) => value + part.value, 0) || 1

  const palette = {
    ...(accent ? { "--vibeui-chart-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-005" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-005"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <span data-part="total">{total}</span>
        </div>
        <div data-part="bar">
          {parts.map((part) => {
            const percent = Math.round((part.value / sum) * 100)

            return (
              <span
                key={part.label}
                data-part="part"
                data-narrow={percent < 8}
                role="img"
                aria-label={fillTemplate(partLabel, {
                  label: part.label,
                  percent,
                })}
                style={
                  {
                    "--vibeui-chart-005-hue": part.hue ?? 250,
                    flexBasis: `${percent}%`,
                  } as CSSProperties
                }
              >
                <span>{percent}%</span>
              </span>
            )
          })}
        </div>
        <ul>
          {parts.map((part) => (
            <li key={part.label}>
              <span
                data-part="dot"
                aria-hidden="true"
                style={
                  { "--vibeui-chart-005-hue": part.hue ?? 250 } as CSSProperties
                }
              />
              {part.label}
              <span data-part="legend-value">
                {Math.round((part.value / sum) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </figure>
    </>
  )
}
