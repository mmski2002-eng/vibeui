import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Stepper006Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: string[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  /** Приставка к названию следующего шага. */
  nextPrefix?: string
  label?: string
  accent?: string
}

// Идея компонента: на телефоне не хватает ширины на пять подписей, поэтому
// вместо ленты выводится счётчик «шаг 2 из 5», название текущего шага и
// подсказка про следующий. Полоски-сегменты остаются списком: каждая —
// пункт со своим состоянием и словом для озвучки, а не декоративный div.
const STYLES = `
:where([data-vibeui-block="stepper-006"]){
--vibeui-stepper-006-bg:oklch(1 0 0);
--vibeui-stepper-006-fg:oklch(0.24 0.016 265);
--vibeui-stepper-006-muted:oklch(0.56 0.014 265);
--vibeui-stepper-006-border:oklch(0.92 0.006 265);
--vibeui-stepper-006-track:oklch(0.93 0.008 265);
--vibeui-stepper-006-accent:oklch(0.55 0.2 262);
--vibeui-stepper-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="stepper-006"]{
width:100%;max-width:24rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-006-font);color:var(--vibeui-stepper-006-fg);
}
[data-vibeui-block="stepper-006"] [data-part="shell"]{
background:var(--vibeui-stepper-006-bg);
border:1px solid var(--vibeui-stepper-006-border);
border-radius:0.875rem;padding:0.875rem 1rem 0.9375rem;
}
[data-vibeui-block="stepper-006"] [data-part="top"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="stepper-006"] [data-part="counter"]{
font-size:0.6875rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-stepper-006-accent);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="stepper-006"] [data-part="left"]{
font-size:0.6875rem;color:var(--vibeui-stepper-006-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="stepper-006"] [data-part="title"]{
margin:0.25rem 0 0;font-size:1.0625rem;font-weight:650;line-height:1.25;
}
[data-vibeui-block="stepper-006"] [data-part="next"]{
margin:0.125rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-stepper-006-muted);
}
[data-vibeui-block="stepper-006"] ol{
display:flex;gap:0.25rem;margin:0.75rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="stepper-006"] li{
flex:1 1 0;height:0.3125rem;border-radius:9999px;
background:var(--vibeui-stepper-006-track);
}
[data-vibeui-block="stepper-006"] li[data-state="done"]{
background:color-mix(in oklab,var(--vibeui-stepper-006-accent) 55%,var(--vibeui-stepper-006-track));
}
[data-vibeui-block="stepper-006"] li[data-state="current"]{
background:var(--vibeui-stepper-006-accent);flex-grow:1.6;
}
[data-vibeui-block="stepper-006"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = ["Корзина", "Доставка", "Оплата", "Проверка", "Готово"]

/**
 * Компактный счётчик шагов для телефона: «шаг 2 из 5» и полоски-сегменты.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper006({
  steps = DEFAULT_STEPS,
  current = 1,
  nextPrefix = "Далее",
  label = "Оформление заказа",
  accent,
  className,
  style,
  ...props
}: Stepper006Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const index = Math.min(Math.max(current, 0), steps.length - 1)
  const next = steps[index + 1]
  const left = steps.length - index - 1

  return (
    <>
      <style href="vibeui-stepper-006" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="stepper-006"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="top">
            <span data-part="counter">
              Шаг {index + 1} из {steps.length}
            </span>
            <span data-part="left">
              {left > 0 ? `осталось ${left}` : "последний"}
            </span>
          </p>
          <p data-part="title">{steps[index]}</p>
          {next ? (
            <p data-part="next">
              {nextPrefix}: {next}
            </p>
          ) : null}
          <ol>
            {steps.map((step, position) => {
              const state =
                position < index
                  ? "done"
                  : position === index
                    ? "current"
                    : "todo"

              return (
                <li
                  key={step}
                  data-state={state}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="sr">
                    {step}
                    {state === "done"
                      ? " — пройден"
                      : state === "current"
                        ? " — текущий шаг"
                        : " — впереди"}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
