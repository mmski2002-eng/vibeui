import type { ComponentProps, CSSProperties } from "react"

export type Sparkline003Props = Omit<ComponentProps<"span">, "children"> & {
  values?: number[]
  label?: string
  /** Текущее значение крупно над столбиками. */
  value?: string
  /** Подписи крайних столбиков: начало и конец периода. */
  fromLabel?: string
  toLabel?: string
  /** Подпись для диктора: {label}, {value}, {max} и {count} подставляются. */
  ariaTemplate?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: спарклайн столбиками. Линия хороша там, где величина
// меняется непрерывно; для дискретных отсчётов — заказов за день, релизов за
// неделю — честнее столбик: он показывает, что между отсчётами ничего нет.
//
// Самый высокий столбик выделен цветом и подписан: у ряда без осей это
// единственный способ дать читателю опору в масштабе.
const STYLES = `
:where([data-vibeui-block="sparkline-003"]){
--vibeui-sparkline-003-bg:transparent;
--vibeui-sparkline-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-sparkline-003-muted:color-mix(in oklab,var(--vibeui-sparkline-003-fg) 62%,transparent);
--vibeui-sparkline-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-sparkline-003-bar:color-mix(in oklab,var(--vibeui-sparkline-003-accent) 34%,transparent);
--vibeui-sparkline-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sparkline-003"]{color-scheme:dark}
[data-vibeui-block="sparkline-003"]{
display:inline-flex;flex-direction:column;gap:0.375rem;
min-width:min(100%,9rem);box-sizing:border-box;
background:var(--vibeui-sparkline-003-bg);
color:var(--vibeui-sparkline-003-fg);
font-family:var(--vibeui-sparkline-003-font);
}
[data-vibeui-block="sparkline-003"] *{box-sizing:border-box}
[data-vibeui-block="sparkline-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="sparkline-003"] [data-part="label"]{
font-size:0.75rem;color:var(--vibeui-sparkline-003-muted);
}
[data-vibeui-block="sparkline-003"] [data-part="value"]{
font-size:1.0625rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.2;
}
/* Столбики выстроены гридом по числу отсчётов: ширина делится поровну и не
   зависит от того, сколько значений передали. */
[data-vibeui-block="sparkline-003"] [data-part="bars"]{
display:grid;align-items:end;gap:2px;
grid-template-columns:repeat(var(--vibeui-sparkline-003-count,12),minmax(0,1fr));
block-size:2.25rem;
}
[data-vibeui-block="sparkline-003"] [data-part="bar"]{
align-self:end;display:block;
border-radius:2px 2px 1px 1px;
background:var(--vibeui-sparkline-003-bar);
/* Высота — доля от максимума. Нижняя граница в 2px оставляет видимым и
   нулевой отсчёт: пропуск в ряду читается как сбой данных, а не как ноль. */
block-size:max(2px,calc(var(--share,0) * 100%));
}
[data-vibeui-block="sparkline-003"] [data-part="bar"][data-peak="true"]{
background:var(--vibeui-sparkline-003-accent);
}
[data-vibeui-block="sparkline-003"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.6875rem;color:var(--vibeui-sparkline-003-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sparkline-003"] [data-part="peak"]{
color:var(--vibeui-sparkline-003-accent);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sparkline-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VALUES = [4, 7, 5, 9, 6, 11, 8, 14, 10, 12, 9, 13]

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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Спарклайн столбиками: дискретные отсчёты и подписанный максимум.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sparkline003({
  values = DEFAULT_VALUES,
  label = "Заказы в день",
  value = "13",
  fromLabel = "1 июля",
  toLabel = "12 июля",
  ariaTemplate = "{label}: {value}. Отсчётов: {count}, наибольший — {max}.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Sparkline003Props) {
  const max = Math.max(...values, 1)
  const peak = values.indexOf(max)

  const palette = {
    "--vibeui-sparkline-003-count": String(values.length),
    ...(accent ? { "--vibeui-sparkline-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sparkline-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const description = fillTemplate(ariaTemplate, {
    label,
    value,
    max,
    count: values.length,
  })

  return (
    <>
      <style href="vibeui-sparkline-003" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="sparkline"
        data-vibeui-block="sparkline-003"
        className={className}
        style={palette}
      >
        <span data-part="head">
          <span data-part="label">{label}</span>
          <span data-part="value">{value}</span>
        </span>
        <span data-part="bars" role="img" aria-label={description}>
          {values.map((point, index) => (
            <span
              key={`${index}-${point}`}
              data-part="bar"
              data-peak={index === peak ? "true" : undefined}
              style={{ "--share": point / max } as CSSProperties}
            />
          ))}
        </span>
        <span data-part="foot">
          <span>{fromLabel}</span>
          <span data-part="peak">{max}</span>
          <span>{toLabel}</span>
        </span>
      </span>
    </>
  )
}
