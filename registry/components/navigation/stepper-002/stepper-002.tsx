import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Stepper002Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: string[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  label?: string
  accent?: string
}

// Идея компонента: шаги-шевроны, как хлебные крошки процесса. Стрелка режется
// clip-path, поэтому фигура остаётся одним элементом и не требует лишних
// узлов. Номер и подпись стоят в строку, а не столбиком: такая лента не
// растёт по высоте и помещается в шапку формы.
const STYLES = `
:where([data-vibeui-block="stepper-002"]){
--vibeui-stepper-002-bg:oklch(1 0 0);
--vibeui-stepper-002-fg:oklch(0.24 0.016 265);
--vibeui-stepper-002-muted:oklch(0.56 0.014 265);
--vibeui-stepper-002-border:oklch(0.92 0.006 265);
--vibeui-stepper-002-step:oklch(0.968 0.004 265);
--vibeui-stepper-002-accent:oklch(0.55 0.2 262);
--vibeui-stepper-002-accent-fg:oklch(1 0 0);
--vibeui-stepper-002-done:oklch(0.55 0.14 155);
--vibeui-stepper-002-notch:0.75rem;
--vibeui-stepper-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="stepper-002"]{
container-type:inline-size;width:100%;box-sizing:border-box;
font-family:var(--vibeui-stepper-002-font);color:var(--vibeui-stepper-002-fg);
}
[data-vibeui-block="stepper-002"] [data-part="shell"]{
background:var(--vibeui-stepper-002-bg);
border:1px solid var(--vibeui-stepper-002-border);
border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="stepper-002"] ol{
display:flex;margin:0;padding:0;list-style:none;overflow-x:auto;
}
[data-vibeui-block="stepper-002"] li{
flex:1 1 0;min-width:8rem;position:relative;
background:var(--vibeui-stepper-002-step);
}
/* Шеврон: вырез слева и остриё справа режутся одним clip-path. */
[data-vibeui-block="stepper-002"] li:not(:first-child){
margin-left:calc(var(--vibeui-stepper-002-notch) * -1);
clip-path:polygon(0 0,calc(100% - var(--vibeui-stepper-002-notch)) 0,100% 50%,calc(100% - var(--vibeui-stepper-002-notch)) 100%,0 100%,var(--vibeui-stepper-002-notch) 50%);
padding-left:var(--vibeui-stepper-002-notch);
}
[data-vibeui-block="stepper-002"] li:first-child{
clip-path:polygon(0 0,calc(100% - var(--vibeui-stepper-002-notch)) 0,100% 50%,calc(100% - var(--vibeui-stepper-002-notch)) 100%,0 100%);
}
[data-vibeui-block="stepper-002"] li:last-child{clip-path:none;padding-right:0.5rem}
[data-vibeui-block="stepper-002"] li:last-child:not(:first-child){
clip-path:polygon(0 0,100% 0,100% 100%,0 100%,var(--vibeui-stepper-002-notch) 50%);
}
[data-vibeui-block="stepper-002"] [data-part="body"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem 0.625rem 1rem;min-width:0;
}
[data-vibeui-block="stepper-002"] [data-part="mark"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:1.375rem;height:1.375rem;border-radius:9999px;
background:var(--vibeui-stepper-002-bg);color:var(--vibeui-stepper-002-muted);
border:1px solid var(--vibeui-stepper-002-border);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-002"] [data-part="label"]{
font-size:0.8125rem;font-weight:500;line-height:1.2;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="stepper-002"] li[data-state="todo"] [data-part="label"]{color:var(--vibeui-stepper-002-muted)}
[data-vibeui-block="stepper-002"] li[data-state="done"]{
background:color-mix(in oklab,var(--vibeui-stepper-002-done) 12%,oklch(1 0 0));
}
[data-vibeui-block="stepper-002"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-002-done);color:var(--vibeui-stepper-002-accent-fg);
border-color:var(--vibeui-stepper-002-done);
}
[data-vibeui-block="stepper-002"] li[data-state="current"]{
background:var(--vibeui-stepper-002-accent);
}
[data-vibeui-block="stepper-002"] li[data-state="current"] [data-part="label"]{
color:var(--vibeui-stepper-002-accent-fg);font-weight:650;
}
[data-vibeui-block="stepper-002"] li[data-state="current"] [data-part="mark"]{
background:var(--vibeui-stepper-002-accent-fg);color:var(--vibeui-stepper-002-accent);
border-color:transparent;
}
[data-vibeui-block="stepper-002"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@container (max-width: 32rem){
[data-vibeui-block="stepper-002"] [data-part="shell"] li:not([data-state="current"]) [data-part="label"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="stepper-002"] [data-part="shell"] li{min-width:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = ["Данные", "Доставка", "Оплата", "Готово"]

/**
 * Лента шагов-шевронов с номерами: пройденные отмечены галочкой и словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper002({
  steps = DEFAULT_STEPS,
  current = 1,
  label = "Оформление заказа",
  accent,
  className,
  style,
  ...props
}: Stepper002Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-002" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="stepper-002"
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
                  key={step}
                  data-state={state}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="body">
                    <span data-part="mark" aria-hidden="true">
                      {state === "done" ? "✓" : index + 1}
                    </span>
                    <span data-part="label">{step}</span>
                    <span data-part="sr">
                      {state === "done"
                        ? " — шаг пройден"
                        : state === "current"
                          ? " — текущий шаг"
                          : " — впереди"}
                    </span>
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
