import type { ComponentProps, CSSProperties } from "react"

export type Stepper004State = "done" | "error" | "skipped" | "current" | "todo"

export type Stepper004Step = {
  title: string
  state: Stepper004State
  hint?: string
}

export type Stepper004Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: Stepper004Step[]
  /** Подписи состояний: компонент несёт русские, проект подставляет свои. */
  stateText?: Record<Stepper004State, string>
  label?: string
  /** Пусто — подложки нет, лента лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: состояние шага задаётся не только цветом. У каждого свой
// знак (✓, !, ↷) и своя подпись словом под заголовком, поэтому «ошибка» и
// «пропущен» различимы при дальтонизме и в чёрно-белой печати. Соединитель
// красится по состоянию левого соседа, поэтому разрыв виден на месте ошибки.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="stepper-004"]){
--vibeui-stepper-004-bg:transparent;
--vibeui-stepper-004-surface:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-stepper-004-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265));
--vibeui-stepper-004-muted:color-mix(in oklab,var(--vibeui-stepper-004-fg) 68%,transparent);
--vibeui-stepper-004-border:light-dark(oklch(0.92 0.006 265),oklch(0.32 0.012 265));
--vibeui-stepper-004-line:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-stepper-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
/* Светлые ветки притемнены: этими же цветами набраны подписи состояний под
   кружками, и на прежних 0.55 и 0.65 «Готово» давало 4.1:1, «Пропущен» — 3.0:1. */
--vibeui-stepper-004-done:light-dark(oklch(0.525 0.14 155),oklch(0.74 0.14 155));
--vibeui-stepper-004-error:light-dark(oklch(0.55 0.19 27),oklch(0.72 0.16 27));
--vibeui-stepper-004-skip:light-dark(oklch(0.545 0.03 265),oklch(0.6 0.02 265));
--vibeui-stepper-004-on:light-dark(oklch(1 0 0),oklch(0.18 0.02 265));
--vibeui-stepper-004-size:2rem;
--vibeui-stepper-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-004"]{color-scheme:dark}
[data-vibeui-block="stepper-004"]{
container-type:inline-size;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-stepper-004-font);color:var(--vibeui-stepper-004-fg);
}
[data-vibeui-block="stepper-004"] [data-part="shell"]{
background:var(--vibeui-stepper-004-bg);
border:1px solid var(--vibeui-stepper-004-border);
border-radius:1rem;padding:1.125rem 1rem 1rem;
}
[data-vibeui-block="stepper-004"] ol{
display:flex;margin:0;padding:0;list-style:none;gap:0;
}
[data-vibeui-block="stepper-004"] li{
position:relative;flex:1 1 0;min-width:0;
display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.375rem;
--vibeui-stepper-004-tone:var(--vibeui-stepper-004-line);
}
[data-vibeui-block="stepper-004"] li[data-state="done"]{--vibeui-stepper-004-tone:var(--vibeui-stepper-004-done)}
[data-vibeui-block="stepper-004"] li[data-state="error"]{--vibeui-stepper-004-tone:var(--vibeui-stepper-004-error)}
[data-vibeui-block="stepper-004"] li[data-state="skipped"]{--vibeui-stepper-004-tone:var(--vibeui-stepper-004-skip)}
[data-vibeui-block="stepper-004"] li[data-state="current"]{--vibeui-stepper-004-tone:var(--vibeui-stepper-004-accent)}
/* Соединитель берёт цвет левого соседа: разрыв видно на месте ошибки. */
[data-vibeui-block="stepper-004"] li:not(:first-child)::before{
content:"";position:absolute;top:calc(var(--vibeui-stepper-004-size) / 2 - 1px);
right:50%;left:-50%;height:2px;background:var(--vibeui-stepper-004-line);
}
[data-vibeui-block="stepper-004"] li[data-linked="true"]::before{
background:var(--vibeui-stepper-004-link);
}
[data-vibeui-block="stepper-004"] [data-part="mark"]{
position:relative;z-index:1;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-004-size);height:var(--vibeui-stepper-004-size);
border-radius:9999px;border:2px solid var(--vibeui-stepper-004-tone);
background:var(--vibeui-stepper-004-surface);color:var(--vibeui-stepper-004-tone);
font-size:0.8125rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-004"] li[data-state="done"] [data-part="mark"],
[data-vibeui-block="stepper-004"] li[data-state="error"] [data-part="mark"]{
background:var(--vibeui-stepper-004-tone);color:var(--vibeui-stepper-004-on);
}
[data-vibeui-block="stepper-004"] li[data-state="skipped"] [data-part="mark"]{
border-style:dashed;
}
[data-vibeui-block="stepper-004"] li[data-state="current"] [data-part="mark"]{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-004-accent) 18%,transparent);
}
[data-vibeui-block="stepper-004"] [data-part="title"]{
font-size:0.8125rem;font-weight:600;line-height:1.25;
}
[data-vibeui-block="stepper-004"] li[data-state="todo"] [data-part="title"],
[data-vibeui-block="stepper-004"] li[data-state="skipped"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-004-muted);
}
[data-vibeui-block="stepper-004"] [data-part="state"]{
font-size:0.6875rem;font-weight:650;line-height:1.2;color:var(--vibeui-stepper-004-tone);
}
[data-vibeui-block="stepper-004"] li[data-state="todo"] [data-part="state"]{color:var(--vibeui-stepper-004-muted)}
[data-vibeui-block="stepper-004"] [data-part="hint"]{
font-size:0.6875rem;line-height:1.3;color:var(--vibeui-stepper-004-muted);
}
@container (max-width: 30rem){
[data-vibeui-block="stepper-004"] [data-part="shell"] [data-part="hint"]{display:none}
[data-vibeui-block="stepper-004"] [data-part="shell"] [data-part="title"]{font-size:0.6875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-004"] *{animation:none!important;transition:none!important}}
`

const MARKS: Record<Stepper004State, string> = {
  done: "✓",
  error: "!",
  skipped: "↷",
  current: "•",
  todo: "•",
}

const STATE_TEXT: Record<Stepper004State, string> = {
  done: "Готово",
  error: "Ошибка",
  skipped: "Пропущен",
  current: "Сейчас",
  todo: "Впереди",
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

const DEFAULT_STEPS: Stepper004Step[] = [
  { title: "Аккаунт", state: "done", hint: "почта подтверждена" },
  { title: "Реквизиты", state: "error", hint: "не сходится ИНН" },
  { title: "Логотип", state: "skipped", hint: "можно добавить позже" },
  { title: "Оплата", state: "current", hint: "выберите способ" },
  { title: "Запуск", state: "todo" },
]

/**
 * Шаги с разными состояниями: готово, ошибка, пропущен — знаком и словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper004({
  steps = DEFAULT_STEPS,
  stateText = STATE_TEXT,
  label = "Настройка магазина",
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper004Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-004-bg": background,
          "--vibeui-stepper-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-004" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-004"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <ol>
            {steps.map((step, index) => {
              const previous = steps[index - 1]
              const linked =
                previous?.state === "done" || previous?.state === "skipped"

              return (
                <li
                  key={step.title}
                  data-state={step.state}
                  data-linked={linked ? "true" : undefined}
                  style={
                    {
                      "--vibeui-stepper-004-link":
                        previous?.state === "done"
                          ? "var(--vibeui-stepper-004-done)"
                          : "var(--vibeui-stepper-004-skip)",
                    } as CSSProperties
                  }
                  aria-current={step.state === "current" ? "step" : undefined}
                >
                  <span data-part="mark" aria-hidden="true">
                    {MARKS[step.state]}
                  </span>
                  <span data-part="title">{step.title}</span>
                  <span data-part="state">
                    {stateText[step.state] ?? STATE_TEXT[step.state]}
                  </span>
                  {step.hint ? <span data-part="hint">{step.hint}</span> : null}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
