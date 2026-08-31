import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Stepper003Step = {
  title: string
  description?: string
  meta?: string
}

export type Stepper003Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: Stepper003Step[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  label?: string
  accent?: string
}

// Идея компонента: вертикальная лента, где у шага есть место для объяснения.
// Линия рисуется псевдоэлементом ::before самого пункта и обрывается на
// последнем, поэтому она не выходит за нижний кружок. Пройденный участок
// линии окрашен, но состояние дублируется словом рядом с заголовком.
const STYLES = `
:where([data-vibeui-block="stepper-003"]){
--vibeui-stepper-003-bg:oklch(1 0 0);
--vibeui-stepper-003-fg:oklch(0.24 0.016 265);
--vibeui-stepper-003-muted:oklch(0.56 0.014 265);
--vibeui-stepper-003-border:oklch(0.92 0.006 265);
--vibeui-stepper-003-line:oklch(0.9 0.006 265);
--vibeui-stepper-003-accent:oklch(0.55 0.2 262);
--vibeui-stepper-003-accent-fg:oklch(1 0 0);
--vibeui-stepper-003-dot:1.5rem;
--vibeui-stepper-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="stepper-003"]{
width:100%;max-width:32rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-003-font);color:var(--vibeui-stepper-003-fg);
}
[data-vibeui-block="stepper-003"] [data-part="shell"]{
background:var(--vibeui-stepper-003-bg);
border:1px solid var(--vibeui-stepper-003-border);
border-radius:1rem;padding:1rem 1.125rem;
}
[data-vibeui-block="stepper-003"] ol{margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-003"] li{
position:relative;display:grid;
grid-template-columns:var(--vibeui-stepper-003-dot) 1fr;
gap:0 0.75rem;padding-bottom:1.125rem;
}
[data-vibeui-block="stepper-003"] li:last-child{padding-bottom:0}
/* Линия идёт от кружка вниз и обрывается на последнем пункте. */
[data-vibeui-block="stepper-003"] li:not(:last-child)::before{
content:"";position:absolute;left:calc(var(--vibeui-stepper-003-dot) / 2 - 1px);
top:var(--vibeui-stepper-003-dot);bottom:0.25rem;width:2px;
background:var(--vibeui-stepper-003-line);
}
[data-vibeui-block="stepper-003"] li[data-state="done"]::before{background:var(--vibeui-stepper-003-accent)}
[data-vibeui-block="stepper-003"] [data-part="mark"]{
grid-column:1;grid-row:1 / span 3;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-003-dot);height:var(--vibeui-stepper-003-dot);
border-radius:9999px;border:2px solid var(--vibeui-stepper-003-line);
background:var(--vibeui-stepper-003-bg);color:var(--vibeui-stepper-003-muted);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-003"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-003-accent);border-color:var(--vibeui-stepper-003-accent);
color:var(--vibeui-stepper-003-accent-fg);
}
[data-vibeui-block="stepper-003"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-003-accent);color:var(--vibeui-stepper-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-003-accent) 18%,transparent);
}
[data-vibeui-block="stepper-003"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.5rem;
min-height:var(--vibeui-stepper-003-dot);
}
[data-vibeui-block="stepper-003"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="stepper-003"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-003-muted);
}
[data-vibeui-block="stepper-003"] [data-part="state"]{
padding:0.0625rem 0.375rem;border-radius:9999px;
border:1px solid var(--vibeui-stepper-003-border);
font-size:0.625rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-stepper-003-muted);
}
[data-vibeui-block="stepper-003"] li[data-state="done"] [data-part="state"]{
color:var(--vibeui-stepper-003-accent);
border-color:color-mix(in oklab,var(--vibeui-stepper-003-accent) 40%,transparent);
}
[data-vibeui-block="stepper-003"] li[data-state="current"] [data-part="state"]{
background:var(--vibeui-stepper-003-accent);border-color:transparent;
color:var(--vibeui-stepper-003-accent-fg);
}
[data-vibeui-block="stepper-003"] [data-part="description"]{
margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-stepper-003-muted);
}
[data-vibeui-block="stepper-003"] [data-part="meta"]{
margin-top:0.25rem;font-size:0.75rem;color:var(--vibeui-stepper-003-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Stepper003Step[] = [
  {
    title: "Заявка принята",
    description: "Мы получили данные и завели дело в системе.",
    meta: "12 августа, 10:04",
  },
  {
    title: "Проверка документов",
    description: "Юрист сверяет реквизиты и подписи. Обычно занимает день.",
    meta: "12 августа, 15:20",
  },
  {
    title: "Подписание",
    description: "Пришлём договор на почту — подпишите электронной подписью.",
    meta: "ожидается сегодня",
  },
  {
    title: "Выплата",
    description: "Деньги уходят на счёт в течение трёх рабочих дней.",
  },
]

const STATES = {
  done: "Готово",
  current: "Сейчас",
  todo: "Впереди",
} as const

/**
 * Вертикальная лента шагов с описанием и подписью состояния словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper003({
  steps = DEFAULT_STEPS,
  current = 2,
  label = "Ход заявки",
  accent,
  className,
  style,
  ...props
}: Stepper003Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-003" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="stepper-003"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
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
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="mark" aria-hidden="true">
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <span data-part="head">
                    <span data-part="title">{step.title}</span>
                    <span data-part="state">{STATES[state]}</span>
                  </span>
                  {step.description ? (
                    <p data-part="description">{step.description}</p>
                  ) : null}
                  {step.meta ? <span data-part="meta">{step.meta}</span> : null}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
