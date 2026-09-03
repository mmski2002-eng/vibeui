import type { ComponentProps, CSSProperties } from "react"

export type Stepper001Step = {
  label: string
  hint?: string
}

export type Stepper001Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: Stepper001Step[]
  /** Номер текущего шага, считая с нуля. Предыдущие показываются пройденными. */
  current?: number
  /** Доступное имя списка шагов для скринридера. */
  label?: string
  /** Состояния словами: галочка и цвет скринридеру ничего не говорят. */
  stateText?: Record<string, string>
  accent?: string
}

// Идея компонента: пройденные шаги отличаются от будущих не только цветом, но
// и знаком — галочкой вместо номера. Линия между шагами заполняется до
// текущего, поэтому прогресс виден одним взглядом, без чтения подписей.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="stepper-001"]){
--vibeui-stepper-001-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265));
--vibeui-stepper-001-muted:color-mix(in oklab,var(--vibeui-stepper-001-fg) 68%,transparent);
--vibeui-stepper-001-line:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-stepper-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-stepper-001-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0.02 262));
--vibeui-stepper-001-surface:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-stepper-001-size:1.75rem;
--vibeui-stepper-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-001"]{color-scheme:dark}
[data-vibeui-block="stepper-001"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-stepper-001-font);color:var(--vibeui-stepper-001-fg);
}
[data-vibeui-block="stepper-001"] ol{display:flex;margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-001"] li{
position:relative;display:flex;flex-direction:column;align-items:center;
flex:1 1 0;min-width:0;text-align:center;gap:0.375rem;
}
/* Линия идёт от центра предыдущего кружка к центру текущего. */
[data-vibeui-block="stepper-001"] li:not(:first-child)::before{
content:"";position:absolute;top:calc(var(--vibeui-stepper-001-size) / 2 - 1px);
right:50%;left:-50%;height:2px;background:var(--vibeui-stepper-001-line);
}
[data-vibeui-block="stepper-001"] li[data-state="done"]::before,
[data-vibeui-block="stepper-001"] li[data-state="current"]::before{background:var(--vibeui-stepper-001-accent)}
[data-vibeui-block="stepper-001"] [data-part="mark"]{
position:relative;z-index:1;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-001-size);height:var(--vibeui-stepper-001-size);
border-radius:9999px;border:2px solid var(--vibeui-stepper-001-line);
background:var(--vibeui-stepper-001-surface);color:var(--vibeui-stepper-001-muted);
font-size:0.75rem;font-weight:600;line-height:1;
}
[data-vibeui-block="stepper-001"] li[data-state="done"] [data-part="mark"],
[data-vibeui-block="stepper-001"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-001-accent);
}
[data-vibeui-block="stepper-001"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-001-accent);color:var(--vibeui-stepper-001-accent-fg);
}
[data-vibeui-block="stepper-001"] li[data-state="current"] [data-part="mark"]{color:var(--vibeui-stepper-001-accent)}
[data-vibeui-block="stepper-001"] [data-part="label"]{font-size:0.8125rem;font-weight:500;line-height:1.3}
[data-vibeui-block="stepper-001"] li[data-state="todo"] [data-part="label"]{color:var(--vibeui-stepper-001-muted);font-weight:400}
[data-vibeui-block="stepper-001"] [data-part="hint"]{font-size:0.75rem;line-height:1.3;color:var(--vibeui-stepper-001-muted)}
[data-vibeui-block="stepper-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
/* В узкой колонке подписи прячутся: остаются кружки и линия. */
@container (max-width: 26rem){
[data-vibeui-block="stepper-001"] [data-part="hint"]{display:none}
[data-vibeui-block="stepper-001"] [data-part="label"]{font-size:0.6875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Stepper001Step[] = [
  { label: "Проект", hint: "Название и адрес" },
  { label: "Дизайн", hint: "Блоки и тема" },
  { label: "Домен", hint: "Свой или наш" },
  { label: "Публикация" },
]

const STATE_TEXT: Record<string, string> = {
  done: " — шаг пройден",
  current: " — текущий шаг",
  todo: " — впереди",
}

/**
 * Индикатор шагов: пройденные отмечены галочкой, линия заполнена до текущего.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper001({
  steps = DEFAULT_STEPS,
  current = 2,
  label = "Шаги",
  stateText = STATE_TEXT,
  accent,
  className,
  style,
  ...props
}: Stepper001Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-001"
        aria-label={label}
        className={className}
        style={palette}
      >
        <ol>
          {steps.map((step, index) => {
            const state =
              index < current ? "done" : index === current ? "current" : "todo"

            return (
              <li
                key={step.label}
                data-state={state}
                aria-current={state === "current" ? "step" : undefined}
              >
                <span data-part="mark" aria-hidden="true">
                  {state === "done" ? "✓" : index + 1}
                </span>
                <span data-part="label">{step.label}</span>
                <span data-part="sr">
                  {stateText[state] ?? STATE_TEXT[state]}
                </span>
                {step.hint ? <span data-part="hint">{step.hint}</span> : null}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
