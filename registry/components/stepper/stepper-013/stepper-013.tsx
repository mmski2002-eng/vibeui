import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Stepper013Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: string[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  label?: string
  accent?: string
}

// Идея компонента: в узкой карточке важнее всего два числа — какой шаг
// сейчас и сколько их всего — и одна непрерывная полоса прогресса. Список
// названий остаётся, но только для скринридера: подписи заняли бы больше
// места, чем есть.
const STYLES = `
:where([data-vibeui-block="stepper-013"]){
--vibeui-stepper-013-bg:oklch(1 0 0);
--vibeui-stepper-013-fg:oklch(0.24 0.016 265);
--vibeui-stepper-013-muted:oklch(0.56 0.014 265);
--vibeui-stepper-013-border:oklch(0.92 0.006 265);
--vibeui-stepper-013-track:oklch(0.93 0.008 265);
--vibeui-stepper-013-accent:oklch(0.55 0.2 262);
--vibeui-stepper-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="stepper-013"]{
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-013-font);color:var(--vibeui-stepper-013-fg);
}
[data-vibeui-block="stepper-013"] [data-part="shell"]{
background:var(--vibeui-stepper-013-bg);
border:1px solid var(--vibeui-stepper-013-border);
border-radius:0.875rem;padding:1rem 1.125rem 1.0625rem;
}
[data-vibeui-block="stepper-013"] [data-part="top"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin:0;
}
[data-vibeui-block="stepper-013"] [data-part="count"]{
font-size:0.75rem;color:var(--vibeui-stepper-013-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="stepper-013"] [data-part="count"] b{
font-size:1rem;color:var(--vibeui-stepper-013-fg);font-weight:700;
}
[data-vibeui-block="stepper-013"] [data-part="percent"]{
font-size:0.75rem;font-weight:650;color:var(--vibeui-stepper-013-accent);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="stepper-013"] [data-part="title"]{
margin:0.25rem 0 0.75rem;font-size:1.0625rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="stepper-013"] [data-part="track"]{
height:0.5rem;border-radius:9999px;background:var(--vibeui-stepper-013-track);overflow:hidden;
}
[data-vibeui-block="stepper-013"] [data-part="fill"]{
height:100%;border-radius:9999px;background:var(--vibeui-stepper-013-accent);
transition:width 0.3s ease;
}
[data-vibeui-block="stepper-013"] [data-part="sr-list"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = ["Аккаунт", "Компания", "Команда", "Тариф", "Готово"]

/**
 * Числовой индикатор «Шаг N из M» с полосой прогресса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper013({
  steps = DEFAULT_STEPS,
  current = 1,
  label = "Регистрация",
  accent,
  className,
  style,
  ...props
}: Stepper013Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  const index = Math.min(Math.max(current, 0), steps.length - 1)
  const percent = Math.round(((index + 1) / steps.length) * 100)

  return (
    <>
      <style href="vibeui-stepper-013" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="stepper-013"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="top">
            <span data-part="count">
              Шаг <b>{index + 1}</b> из {steps.length}
            </span>
            <span data-part="percent">{percent}%</span>
          </p>
          <p data-part="title">{steps[index]}</p>
          <div data-part="track" aria-hidden="true">
            <div data-part="fill" style={{ width: `${percent}%` }} />
          </div>
          <ol data-part="sr-list">
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
                  aria-current={state === "current" ? "step" : undefined}
                >
                  {step}
                  {state === "done"
                    ? " — пройден"
                    : state === "current"
                      ? " — текущий шаг"
                      : " — впереди"}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
