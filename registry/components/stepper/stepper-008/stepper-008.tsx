import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Stepper008Step = {
  title: string
  optional?: boolean
}

export type Stepper008Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: Stepper008Step[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  /** Подпись метки у необязательного шага. */
  optionalLabel?: string
  label?: string
  accent?: string
}

// Идея компонента: не все шаги обязательны, и это должно быть видно до того,
// как человек в них зайдёт. Необязательный шаг помечен словом и пунктирным
// кружком, а счётчик сверху считает только обязательные — иначе прогресс
// врёт: «2 из 6» пугает, когда четыре шага можно пропустить.
const STYLES = `
:where([data-vibeui-block="stepper-008"]){
--vibeui-stepper-008-bg:oklch(1 0 0);
--vibeui-stepper-008-fg:oklch(0.24 0.016 265);
--vibeui-stepper-008-muted:oklch(0.56 0.014 265);
--vibeui-stepper-008-border:oklch(0.92 0.006 265);
--vibeui-stepper-008-line:oklch(0.9 0.006 265);
--vibeui-stepper-008-accent:oklch(0.55 0.2 262);
--vibeui-stepper-008-accent-fg:oklch(1 0 0);
--vibeui-stepper-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="stepper-008"]{
width:100%;max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-008-font);color:var(--vibeui-stepper-008-fg);
}
[data-vibeui-block="stepper-008"] [data-part="shell"]{
background:var(--vibeui-stepper-008-bg);
border:1px solid var(--vibeui-stepper-008-border);
border-radius:1rem;padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="stepper-008"] [data-part="counter"]{
margin:0 0 0.75rem;font-size:0.75rem;color:var(--vibeui-stepper-008-muted);
}
[data-vibeui-block="stepper-008"] [data-part="counter"] b{
color:var(--vibeui-stepper-008-fg);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="stepper-008"] ol{
display:flex;flex-wrap:wrap;gap:0.375rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="stepper-008"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.6875rem;border-radius:9999px;
border:1px solid var(--vibeui-stepper-008-border);
background:var(--vibeui-stepper-008-bg);
}
[data-vibeui-block="stepper-008"] li[data-optional="true"]{border-style:dashed}
[data-vibeui-block="stepper-008"] li[data-state="current"]{
border-color:var(--vibeui-stepper-008-accent);
background:color-mix(in oklab,var(--vibeui-stepper-008-accent) 8%,transparent);
}
[data-vibeui-block="stepper-008"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-stepper-008-line);
color:var(--vibeui-stepper-008-muted);font-size:0.625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-008"] li[data-optional="true"] [data-part="mark"]{border-style:dashed}
[data-vibeui-block="stepper-008"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-008-accent);border-color:var(--vibeui-stepper-008-accent);
color:var(--vibeui-stepper-008-accent-fg);
}
[data-vibeui-block="stepper-008"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-008-accent);color:var(--vibeui-stepper-008-accent);
}
[data-vibeui-block="stepper-008"] [data-part="title"]{font-size:0.8125rem;font-weight:600;line-height:1.2}
[data-vibeui-block="stepper-008"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-008-muted);
}
[data-vibeui-block="stepper-008"] [data-part="tag"]{
padding:0.0625rem 0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-stepper-008-line) 45%,transparent);
color:var(--vibeui-stepper-008-muted);
font-size:0.625rem;font-weight:650;letter-spacing:0.01em;white-space:nowrap;
}
[data-vibeui-block="stepper-008"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Stepper008Step[] = [
  { title: "Профиль" },
  { title: "Команда", optional: true },
  { title: "Тариф" },
  { title: "Интеграции", optional: true },
  { title: "Домен", optional: true },
  { title: "Публикация" },
]

/**
 * Шаги, среди которых есть необязательные: они помечены словом и пунктиром.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper008({
  steps = DEFAULT_STEPS,
  current = 2,
  optionalLabel = "Необязательно",
  label = "Настройка рабочего пространства",
  accent,
  className,
  style,
  ...props
}: Stepper008Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  const required = steps.filter((step) => !step.optional)
  const requiredDone = steps.filter(
    (step, index) => !step.optional && index < current,
  )

  return (
    <>
      <style href="vibeui-stepper-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="stepper-008"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="counter">
            Обязательных пройдено{" "}
            <b>
              {requiredDone.length} из {required.length}
            </b>
            . Остальное можно пропустить и вернуться позже.
          </p>
          <ol>
            {steps.map((step, index) => {
              const state =
                index < current
                  ? "done"
                  : index === current
                    ? "current"
                    : "todo"

              return (
                <li
                  key={step.title}
                  data-state={state}
                  data-optional={step.optional ? "true" : undefined}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="mark" aria-hidden="true">
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <span data-part="title">{step.title}</span>
                  {step.optional ? (
                    <span data-part="tag">{optionalLabel}</span>
                  ) : null}
                  <span data-part="sr">
                    {state === "done"
                      ? " — шаг пройден"
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
