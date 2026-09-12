import type { ComponentProps, CSSProperties } from "react"

export type Stepper005Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: string[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  /** Готовность текущего шага в процентах: заполняет соединитель перед ним. */
  progress?: number
  /** Подпись под текущим шагом. {value} — проценты готовности. */
  progressText?: string
  /** Подпись под пройденным шагом. */
  doneText?: string
  label?: string
  /** Пусто — подложки нет, лента лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: прогресс живёт внутри соединителя. Линия перед текущим
// шагом залита не целиком, а на долю готовности — видно, что шаг начат, но
// не закончен. Долю несёт unitless-переменная, ширина считается через
// calc(100% * var(...)), поэтому проценты не приходится складывать с
// процентами. Число продублировано текстом: полоска сама по себе неозвучиваема.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="stepper-005"]){
--vibeui-stepper-005-bg:transparent;
--vibeui-stepper-005-surface:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-stepper-005-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-stepper-005-muted:color-mix(in oklab,var(--vibeui-stepper-005-fg) 68%,transparent);
--vibeui-stepper-005-border:light-dark(oklch(0.92 0 265),oklch(0.32 0 265));
--vibeui-stepper-005-line:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-stepper-005-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-stepper-005-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-stepper-005-size:1.75rem;
--vibeui-stepper-005-fill:0;
--vibeui-stepper-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-005"]{color-scheme:dark}
[data-vibeui-block="stepper-005"]{
container-type:inline-size;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-stepper-005-font);color:var(--vibeui-stepper-005-fg);
}
[data-vibeui-block="stepper-005"] [data-part="shell"]{
background:var(--vibeui-stepper-005-bg);
border:1px solid var(--vibeui-stepper-005-border);
border-radius:1rem;padding:1.125rem 1rem 1rem;
}
[data-vibeui-block="stepper-005"] ol{display:flex;margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-005"] li{
position:relative;flex:1 1 0;min-width:0;
display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.375rem;
}
/* Дорожка соединителя и её заливка — два псевдоэлемента одного пункта. */
[data-vibeui-block="stepper-005"] li:not(:first-child)::before,
[data-vibeui-block="stepper-005"] li:not(:first-child)::after{
content:"";position:absolute;left:-50%;
top:calc(var(--vibeui-stepper-005-size) / 2 - 2px);height:4px;border-radius:9999px;
}
[data-vibeui-block="stepper-005"] li:not(:first-child)::before{
width:100%;background:var(--vibeui-stepper-005-line);
}
[data-vibeui-block="stepper-005"] li:not(:first-child)::after{
width:calc(100% * var(--vibeui-stepper-005-fill));
background:var(--vibeui-stepper-005-accent);
transition:width .25s ease;color:oklch(from var(--vibeui-stepper-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="stepper-005"] [data-part="mark"]{
position:relative;z-index:1;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-005-size);height:var(--vibeui-stepper-005-size);
border-radius:9999px;border:2px solid var(--vibeui-stepper-005-line);
background:var(--vibeui-stepper-005-surface);color:var(--vibeui-stepper-005-muted);
font-size:0.75rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-005"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-005-accent);border-color:var(--vibeui-stepper-005-accent);
color:oklch(from var(--vibeui-stepper-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="stepper-005"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-005-accent);color:var(--vibeui-stepper-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-005-accent) 18%,transparent);
}
[data-vibeui-block="stepper-005"] [data-part="label"]{font-size:0.8125rem;font-weight:500;line-height:1.25}
[data-vibeui-block="stepper-005"] li[data-state="todo"] [data-part="label"]{color:var(--vibeui-stepper-005-muted)}
[data-vibeui-block="stepper-005"] li[data-state="current"] [data-part="label"]{font-weight:650}
[data-vibeui-block="stepper-005"] [data-part="percent"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-stepper-005-accent);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="stepper-005"] [data-part="done-word"]{
font-size:0.6875rem;color:var(--vibeui-stepper-005-muted);
}
@container (max-width: 28rem){
[data-vibeui-block="stepper-005"] [data-part="shell"] [data-part="done-word"]{display:none}
[data-vibeui-block="stepper-005"] [data-part="shell"] [data-part="label"]{font-size:0.6875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = ["Загрузка", "Проверка", "Обработка", "Отчёт"]

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
 * Шаги, где соединитель перед текущим залит на долю готовности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper005({
  steps = DEFAULT_STEPS,
  current = 2,
  progress = 45,
  progressText = "{value}% готово",
  doneText = "Готово",
  label = "Импорт каталога",
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper005Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-005-bg": background,
          "--vibeui-stepper-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const clamped = Math.min(100, Math.max(0, progress))

  return (
    <>
      <style href="vibeui-stepper-005" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-005"
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
              const fill =
                index <= current - 1 ? 1 : index === current ? clamped / 100 : 0

              return (
                <li
                  key={step}
                  data-state={state}
                  style={
                    {
                      "--vibeui-stepper-005-fill": String(fill),
                    } as CSSProperties
                  }
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="mark" aria-hidden="true">
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <span data-part="label">{step}</span>
                  {state === "current" ? (
                    <span data-part="percent">
                      {progressText.replace("{value}", String(clamped))}
                    </span>
                  ) : null}
                  {state === "done" ? (
                    <span data-part="done-word">{doneText}</span>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
