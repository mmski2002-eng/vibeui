import type { ComponentProps, CSSProperties } from "react"

export type Stepper006Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: string[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  /** Приставка к названию следующего шага. */
  nextPrefix?: string
  /** Счётчик сверху. {current} — номер шага, {total} — сколько всего. */
  counterText?: string
  /** Сколько шагов осталось. {left} — число оставшихся. */
  leftText?: string
  /** Подпись вместо счётчика остатка на последнем шаге. */
  lastText?: string
  /** Подписи состояний: компонент несёт русские, проект подставляет свои. */
  stateText?: Record<string, string>
  label?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: на телефоне не хватает ширины на пять подписей, поэтому
// вместо ленты выводится счётчик «шаг 2 из 5», название текущего шага и
// подсказка про следующий. Полоски-сегменты остаются списком: каждая —
// пункт со своим состоянием и словом для озвучки, а не декоративный div.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="stepper-006"]){
--vibeui-stepper-006-bg:transparent;
--vibeui-stepper-006-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265));
--vibeui-stepper-006-muted:color-mix(in oklab,var(--vibeui-stepper-006-fg) 68%,transparent);
--vibeui-stepper-006-border:light-dark(oklch(0.92 0.006 265),oklch(0.32 0.012 265));
--vibeui-stepper-006-track:light-dark(oklch(0.93 0.008 265),oklch(0.3 0.012 265));
--vibeui-stepper-006-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-stepper-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-006"]{color-scheme:dark}
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

const STATE_TEXT: Record<string, string> = {
  done: " — пройден",
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
 * Компактный счётчик шагов для телефона: «шаг 2 из 5» и полоски-сегменты.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper006({
  steps = DEFAULT_STEPS,
  current = 1,
  nextPrefix = "Далее",
  counterText = "Шаг {current} из {total}",
  leftText = "осталось {left}",
  lastText = "последний",
  stateText = STATE_TEXT,
  label = "Оформление заказа",
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper006Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="stepper"
        data-vibeui-block="stepper-006"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="top">
            <span data-part="counter">
              {counterText
                .replace("{current}", String(index + 1))
                .replace("{total}", String(steps.length))}
            </span>
            <span data-part="left">
              {left > 0 ? leftText.replace("{left}", String(left)) : lastText}
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
                    {stateText[state] ?? STATE_TEXT[state]}
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
