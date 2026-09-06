import type { ComponentProps, CSSProperties } from "react"

export type Badge007Props = Omit<ComponentProps<"span">, "children"> & {
  value?: number
  /** Что считаем ростом: у расходов и оттока рост — это плохо. */
  goodDirection?: "up" | "down"
  unit?: string
  period?: string
  /** Названия направлений: знак «−» скринридеры проговаривают не всегда. */
  directionText?: Record<"up" | "down" | "flat", string>
  /** Пусто — плашка держит фон, выведенный из направления. */
  background?: string
}

// Идея компонента: изменение показателя со стрелкой. Хорошее направление
// задаётся снаружи: рост выручки — зелёный, рост оттока — красный, и
// компонент не имеет права решать это за вас. Знак и стрелка дублируют цвет,
// поэтому значение читается и в чёрно-белом виде.
const STYLES = `
:where([data-vibeui-block="badge-007"]){
--vibeui-badge-007-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-badge-007-bg:light-dark(oklch(0.96 0 265),oklch(0.27 0 265));
--vibeui-badge-007-fg:light-dark(oklch(0.32 0 265),oklch(0.93 0 265));
--vibeui-badge-007-muted:color-mix(in oklab,var(--vibeui-badge-007-fg) 68%,transparent);
--vibeui-badge-007-good:light-dark(oklch(0.55 0.15 152),oklch(0.77 0.15 152));
--vibeui-badge-007-bad:light-dark(oklch(0.55 0.18 25),oklch(0.73 0.17 25));
--vibeui-badge-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-007"]{color-scheme:dark}
[data-vibeui-block="badge-007"]{
display:inline-flex;align-items:center;gap:0.3125rem;
height:1.5rem;padding:0 0.5625rem;
border-radius:0.4375rem;
background:var(--vibeui-badge-007-bg);color:var(--vibeui-badge-007-fg);
font-family:var(--vibeui-badge-007-font);font-size:0.75rem;font-weight:600;
font-variant-numeric:tabular-nums;line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-007"][data-mood="good"]{color:var(--vibeui-badge-007-good);--vibeui-badge-007-bg:color-mix(in oklab,var(--vibeui-badge-007-good) 12%,var(--vibeui-badge-007-surface))}
[data-vibeui-block="badge-007"][data-mood="bad"]{color:var(--vibeui-badge-007-bad);--vibeui-badge-007-bg:color-mix(in oklab,var(--vibeui-badge-007-bad) 12%,var(--vibeui-badge-007-surface))}
[data-vibeui-block="badge-007"][data-mood="flat"]{color:var(--vibeui-badge-007-muted)}
/* Стрелка из двух бордюров: направление видно и без цвета. */
[data-vibeui-block="badge-007"] [data-part="arrow"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
}
[data-vibeui-block="badge-007"][data-direction="up"] [data-part="arrow"]{transform:rotate(-45deg) translate(0.0625rem,0.0625rem)}
[data-vibeui-block="badge-007"][data-direction="down"] [data-part="arrow"]{transform:rotate(135deg) translate(0.0625rem,0.0625rem)}
[data-vibeui-block="badge-007"][data-direction="flat"] [data-part="arrow"]{
border-top:0;border-right:0;height:0;width:0.5rem;
border-bottom:1.5px solid currentColor;
}
[data-vibeui-block="badge-007"] [data-part="period"]{font-weight:500;color:var(--vibeui-badge-007-muted)}
[data-vibeui-block="badge-007"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-007"] *{animation:none!important;transition:none!important}}
`

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

/**
 * Изменение показателя: стрелка, знак и цвет по заданному направлению.
 * Один файл, ноль зависимостей, собственная палитра.
 */
const DIRECTION_TEXT: Record<"up" | "down" | "flat", string> = {
  up: "рост",
  down: "снижение",
  flat: "без изменений",
}

export function Badge007({
  value = 12.4,
  goodDirection = "up",
  unit = "%",
  period = "за неделю",
  directionText = DIRECTION_TEXT,
  background = "",
  className,
  style,
  ...props
}: Badge007Props) {
  const direction = value > 0 ? "up" : value < 0 ? "down" : "flat"
  const mood =
    direction === "flat" ? "flat" : direction === goodDirection ? "good" : "bad"
  const sign = value > 0 ? "+" : value < 0 ? "−" : ""
  const text = `${sign}${Math.abs(value)}${unit}`
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-007" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-007"
        data-direction={direction}
        data-mood={mood}
        className={className}
        style={palette}
      >
        <span data-part="arrow" aria-hidden="true" />
        <span data-part="sr">{directionText[direction]} </span>
        {text}
        {period ? <span data-part="period">{period}</span> : null}
      </span>
    </>
  )
}
