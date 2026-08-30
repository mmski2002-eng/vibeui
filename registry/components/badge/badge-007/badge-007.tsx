import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge007Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  value?: number
  /** Что считаем ростом: у расходов и оттока рост — это плохо. */
  goodDirection?: "up" | "down"
  unit?: string
  period?: string
}

// Идея компонента: изменение показателя со стрелкой. Хорошее направление
// задаётся снаружи: рост выручки — зелёный, рост оттока — красный, и
// компонент не имеет права решать это за вас. Знак и стрелка дублируют цвет,
// поэтому значение читается и в чёрно-белом виде.
const STYLES = `
:where([data-vibeui-block="badge-007"]){
--vibeui-badge-007-bg:oklch(0.96 0.004 265);
--vibeui-badge-007-fg:oklch(0.32 0.014 265);
--vibeui-badge-007-muted:oklch(0.55 0.014 265);
--vibeui-badge-007-good:oklch(0.55 0.15 152);
--vibeui-badge-007-bad:oklch(0.55 0.18 25);
--vibeui-badge-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-007"]{
display:inline-flex;align-items:center;gap:0.3125rem;
height:1.5rem;padding:0 0.5625rem;
border-radius:0.4375rem;
background:var(--vibeui-badge-007-bg);color:var(--vibeui-badge-007-fg);
font-family:var(--vibeui-badge-007-font);font-size:0.75rem;font-weight:600;
font-variant-numeric:tabular-nums;line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-007"][data-mood="good"]{color:var(--vibeui-badge-007-good);background:color-mix(in oklab,var(--vibeui-badge-007-good) 12%,oklch(1 0 0))}
[data-vibeui-block="badge-007"][data-mood="bad"]{color:var(--vibeui-badge-007-bad);background:color-mix(in oklab,var(--vibeui-badge-007-bad) 12%,oklch(1 0 0))}
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
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Изменение показателя: стрелка, знак и цвет по заданному направлению.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge007({
  value = 12.4,
  goodDirection = "up",
  unit = "%",
  period = "за неделю",
  className,
  style,
  ...props
}: Badge007Props) {
  const direction = value > 0 ? "up" : value < 0 ? "down" : "flat"
  const mood =
    direction === "flat" ? "flat" : direction === goodDirection ? "good" : "bad"
  const sign = value > 0 ? "+" : value < 0 ? "−" : ""
  const text = `${sign}${Math.abs(value)}${unit}`

  return (
    <>
      <style href="vibeui-badge-007" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-007"
        data-direction={direction}
        data-mood={mood}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="arrow" aria-hidden="true" />
        {text}
        {period ? <span data-part="period">{period}</span> : null}
      </span>
    </>
  )
}
