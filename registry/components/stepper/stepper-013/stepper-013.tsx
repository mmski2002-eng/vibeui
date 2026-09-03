import type { ComponentProps, CSSProperties } from "react"

export type Stepper013Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: string[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  label?: string
  /** Шаблон счётчика: {current} — номер шага, {total} — сколько их всего. */
  countText?: string
  /** Состояния шагов для скринридера: компонент несёт русские подписи. */
  stateText?: Record<string, string>
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: в узкой карточке важнее всего два числа — какой шаг
// сейчас и сколько их всего — и одна непрерывная полоса прогресса. Список
// названий остаётся, но только для скринридера: подписи заняли бы больше
// места, чем есть.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="stepper-013"]){
--vibeui-stepper-013-bg:transparent;
--vibeui-stepper-013-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-stepper-013-muted:color-mix(in oklab,var(--vibeui-stepper-013-fg) 68%,transparent);
--vibeui-stepper-013-border:light-dark(oklch(0.92 0.006 265),oklch(0.35 0.012 265));
--vibeui-stepper-013-track:light-dark(oklch(0.93 0.008 265),oklch(0.32 0.014 265));
--vibeui-stepper-013-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-stepper-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-013"]{color-scheme:dark}
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

const COUNT_TEXT = "Шаг {current} из {total}"

const STATE_TEXT: Record<string, string> = {
  done: "пройден",
  current: "текущий шаг",
  todo: "впереди",
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Числовой индикатор «Шаг N из M» с полосой прогресса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper013({
  steps = DEFAULT_STEPS,
  current = 1,
  label = "Регистрация",
  countText = COUNT_TEXT,
  stateText = STATE_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper013Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const index = Math.min(Math.max(current, 0), steps.length - 1)
  const percent = Math.round(((index + 1) / steps.length) * 100)
  // Номер шага набран крупнее остального счётчика, поэтому шаблон
  // разрезается по {current} и число попадает в собственный <b>.
  const countParts = countText
    .replace("{total}", String(steps.length))
    .split("{current}")

  return (
    <>
      <style href="vibeui-stepper-013" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-013"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="top">
            <span data-part="count">
              {countParts[0]}
              <b>{index + 1}</b>
              {countParts[1] ?? ""}
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
                  {` — ${stateText[state] ?? STATE_TEXT[state]}`}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
