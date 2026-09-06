import type { ComponentProps, CSSProperties } from "react"

export type Card002Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  title?: string
  value?: string
  change?: number
  period?: string
  /** Ряд значений для полоски динамики: 6–12 чисел. */
  series?: number[]
  goodDirection?: "up" | "down"
  /**
   * Подпись изменения для скринридера по направлению. {value} — модуль
   * изменения в процентах.
   */
  changeLabel?: Record<"up" | "down" | "flat", string>
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карточка показателя. Число крупно, изменение рядом со
// знаком и стрелкой, а под ними — столбики динамики: одно число без истории
// не отвечает, случайность это или тренд. Столбики нарисованы флексом с
// процентными высотами, поэтому график не тянет за собой библиотеку.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-002"]){
--vibeui-card-002-bg:transparent;
--vibeui-card-002-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-002-muted:color-mix(in oklab,var(--vibeui-card-002-fg) 68%,transparent);
--vibeui-card-002-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-002-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
/* Зелёный светлой ветки притемнён до 0.525: на 0.55 «+12.4%» давало 4.1:1. */
--vibeui-card-002-good:light-dark(oklch(0.525 0.15 152),oklch(0.76 0.14 152));
--vibeui-card-002-bad:light-dark(oklch(0.55 0.18 25),oklch(0.72 0.16 25));
--vibeui-card-002-bar-base:light-dark(oklch(1 0 0),oklch(0.3 0 265));
--vibeui-card-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-002"]{color-scheme:dark}
[data-vibeui-block="card-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:16rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-card-002-bg);
border:1px solid var(--vibeui-card-002-border);border-radius:0.875rem;
color:var(--vibeui-card-002-fg);font-family:var(--vibeui-card-002-font);
}
[data-vibeui-block="card-002"] [data-part="title"]{
margin:0;font-size:0.8125rem;font-weight:600;color:var(--vibeui-card-002-muted);
}
[data-vibeui-block="card-002"] [data-part="row"]{display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="card-002"] [data-part="value"]{
font-size:1.75rem;font-weight:680;line-height:1.05;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-002"] [data-part="change"]{
display:inline-flex;align-items:center;gap:0.25rem;
font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-002"][data-mood="good"] [data-part="change"]{color:var(--vibeui-card-002-good)}
[data-vibeui-block="card-002"][data-mood="bad"] [data-part="change"]{color:var(--vibeui-card-002-bad)}
[data-vibeui-block="card-002"][data-mood="flat"] [data-part="change"]{color:var(--vibeui-card-002-muted)}
[data-vibeui-block="card-002"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
}
[data-vibeui-block="card-002"][data-direction="up"] [data-part="arrow"]{transform:rotate(-45deg)}
[data-vibeui-block="card-002"][data-direction="down"] [data-part="arrow"]{transform:rotate(135deg)}
/* Столбики на флексе с процентными высотами: история показателя без
   библиотеки графиков и без единого пикселя разметки. */
[data-vibeui-block="card-002"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.1875rem;height:2.25rem;margin-top:0.125rem;
}
[data-vibeui-block="card-002"] [data-part="bar"]{
flex:1;border-radius:0.125rem 0.125rem 0 0;
background:color-mix(in oklab,var(--vibeui-card-002-accent) 22%,var(--vibeui-card-002-bar-base));
}
[data-vibeui-block="card-002"] [data-part="bar"]:last-child{background:var(--vibeui-card-002-accent)}
[data-vibeui-block="card-002"] [data-part="period"]{font-size:0.75rem;color:var(--vibeui-card-002-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SERIES = [42, 55, 48, 61, 58, 72, 69, 84]

const CHANGE_LABEL: Record<"up" | "down" | "flat", string> = {
  up: "Изменение плюс {value} процента",
  down: "Изменение минус {value} процента",
  flat: "Без изменений",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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

/**
 * Карточка показателя: число, изменение и столбики динамики.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card002({
  title = "Выручка за неделю",
  value = "1 284 000 ₽",
  change = 12.4,
  period = "против прошлой недели",
  series = DEFAULT_SERIES,
  goodDirection = "up",
  changeLabel = CHANGE_LABEL,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card002Props) {
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat"
  const mood =
    direction === "flat" ? "flat" : direction === goodDirection ? "good" : "bad"
  const max = Math.max(...series, 1)
  const label = (changeLabel[direction] ?? CHANGE_LABEL[direction]).replace(
    "{value}",
    String(Math.abs(change)),
  )

  const palette = {
    ...(accent ? { "--vibeui-card-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-002" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-002"
        data-direction={direction}
        data-mood={mood}
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <p data-part="row">
          <span data-part="value">{value}</span>
          <span data-part="change" aria-label={label}>
            <span data-part="arrow" aria-hidden="true" />
            {change > 0 ? "+" : change < 0 ? "−" : ""}
            {Math.abs(change)}%
          </span>
        </p>
        <div data-part="chart" aria-hidden="true">
          {series.map((point, index) => (
            <span
              key={index}
              data-part="bar"
              style={{ height: `${Math.max(8, (point / max) * 100)}%` }}
            />
          ))}
        </div>
        <p data-part="period">{period}</p>
      </article>
    </>
  )
}
