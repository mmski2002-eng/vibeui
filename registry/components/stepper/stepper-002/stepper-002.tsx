import type { ComponentProps, CSSProperties } from "react"

export type Stepper002Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: string[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  /**
   * Подписи состояний для скринридера: компонент несёт русские, проект
   * подставляет свои.
   */
  stateText?: Record<string, string>
  label?: string
  /** Пусто — подложки нет, лента лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: шаги-шевроны, как хлебные крошки процесса. Стрелка режется
// clip-path, поэтому фигура остаётся одним элементом и не требует лишних
// узлов. Номер и подпись стоят в строку, а не столбиком: такая лента не
// растёт по высоте и помещается в шапку формы.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="stepper-002"]){
--vibeui-stepper-002-bg:transparent;
--vibeui-stepper-002-surface:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-stepper-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-stepper-002-muted:color-mix(in oklab,var(--vibeui-stepper-002-fg) 68%,transparent);
--vibeui-stepper-002-border:light-dark(oklch(0.92 0 265),oklch(0.32 0 265));
--vibeui-stepper-002-step:light-dark(oklch(0.968 0 265),oklch(0.26 0 265));
--vibeui-stepper-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-stepper-002-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-stepper-002-done:light-dark(oklch(0.55 0.14 155),oklch(0.74 0.14 155));
--vibeui-stepper-002-notch:0.75rem;
--vibeui-stepper-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-002"]{color-scheme:dark}
[data-vibeui-block="stepper-002"]{
container-type:inline-size;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
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
background:var(--vibeui-stepper-002-surface);color:var(--vibeui-stepper-002-muted);
border:1px solid var(--vibeui-stepper-002-border);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-002"] [data-part="label"]{
font-size:0.8125rem;font-weight:500;line-height:1.2;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="stepper-002"] li[data-state="todo"] [data-part="label"]{color:var(--vibeui-stepper-002-muted)}
[data-vibeui-block="stepper-002"] li[data-state="done"]{
background:color-mix(in oklab,var(--vibeui-stepper-002-done) 12%,var(--vibeui-stepper-002-surface));
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

const STATE_TEXT: Record<string, string> = {
  done: " — шаг пройден",
  current: " — текущий шаг",
  todo: " — впереди",
}

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Лента шагов-шевронов с номерами: пройденные отмечены галочкой и словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper002({
  steps = DEFAULT_STEPS,
  current = 1,
  stateText = STATE_TEXT,
  label = "Оформление заказа",
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper002Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-002-bg": background,
          "--vibeui-stepper-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-002" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
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
                      {stateText[state] ?? STATE_TEXT[state]}
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
