import type { ComponentProps, CSSProperties } from "react"

export type Stepper012Step = { title: string }

export type Stepper012Line = { label: string; value: string }

export type Stepper012Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: Stepper012Step[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  summary?: Stepper012Line[]
  summaryTitle?: string
  totalLabel?: string
  total?: string
  /** Подписи состояний: компонент несёт русские, проект подставляет свои. */
  stateText?: Record<string, string>
  label?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: во время оформления заказа сумма должна быть на виду
// постоянно, а не только в конце пути. Шаги и сводка стоят рядом в двух
// колонках; на узкой ширине сводка спускается под ленту, а не сжимает её
// до нечитаемого столбца.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="stepper-012"]){
--vibeui-stepper-012-bg:transparent;
--vibeui-stepper-012-surface:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-stepper-012-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-stepper-012-muted:color-mix(in oklab,var(--vibeui-stepper-012-fg) 68%,transparent);
--vibeui-stepper-012-border:light-dark(oklch(0.92 0 265),oklch(0.32 0 265));
--vibeui-stepper-012-line:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-stepper-012-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.16 39.8));
--vibeui-stepper-012-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-stepper-012-panel:light-dark(oklch(0.97 0 265),oklch(0.25 0 265));
--vibeui-stepper-012-dot:1.5rem;
--vibeui-stepper-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-012"]{color-scheme:dark}
[data-vibeui-block="stepper-012"]{
container-type:inline-size;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:40rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-012-font);color:var(--vibeui-stepper-012-fg);
}
[data-vibeui-block="stepper-012"] [data-part="shell"]{
background:var(--vibeui-stepper-012-bg);
border:1px solid var(--vibeui-stepper-012-border);
border-radius:1rem;padding:1.125rem;
}
[data-vibeui-block="stepper-012"] [data-part="layout"]{
display:grid;grid-template-columns:1fr 15rem;gap:1.25rem;align-items:start;
}
[data-vibeui-block="stepper-012"] ol{margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol{
display:grid;grid-template-columns:var(--vibeui-stepper-012-dot) 1fr;
}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol li{
position:relative;grid-column:1 / -1;display:grid;
grid-template-columns:var(--vibeui-stepper-012-dot) 1fr;
gap:0 0.75rem;align-items:center;padding-bottom:0.875rem;
}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol li:last-child{padding-bottom:0}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol li:not(:last-child)::before{
content:"";position:absolute;left:calc(var(--vibeui-stepper-012-dot) / 2 - 1px);
top:var(--vibeui-stepper-012-dot);bottom:-0.125rem;width:2px;
background:var(--vibeui-stepper-012-line);
}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol li[data-state="done"]::before{background:var(--vibeui-stepper-012-accent)}
[data-vibeui-block="stepper-012"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-012-dot);height:var(--vibeui-stepper-012-dot);
border-radius:9999px;border:2px solid var(--vibeui-stepper-012-line);
background:var(--vibeui-stepper-012-surface);color:var(--vibeui-stepper-012-muted);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-012"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-012-accent);border-color:var(--vibeui-stepper-012-accent);
color:var(--vibeui-stepper-012-accent-fg);
}
[data-vibeui-block="stepper-012"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-012-accent);color:var(--vibeui-stepper-012-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-012-accent) 18%,transparent);
}
[data-vibeui-block="stepper-012"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="stepper-012"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-012-muted);
}
[data-vibeui-block="stepper-012"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="stepper-012"] [data-part="summary"]{
background:var(--vibeui-stepper-012-panel);
border:1px solid var(--vibeui-stepper-012-border);
border-radius:0.875rem;padding:1rem;
}
[data-vibeui-block="stepper-012"] [data-part="summary-title"]{
margin:0 0 0.625rem;font-size:0.75rem;font-weight:650;letter-spacing:0.02em;
text-transform:uppercase;color:var(--vibeui-stepper-012-muted);
}
[data-vibeui-block="stepper-012"] [data-part="line"]{
display:flex;justify-content:space-between;gap:0.75rem;
margin:0;padding:0.3125rem 0;font-size:0.8125rem;color:var(--vibeui-stepper-012-muted);
}
[data-vibeui-block="stepper-012"] [data-part="line"] span:last-child{
color:var(--vibeui-stepper-012-fg);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="stepper-012"] [data-part="total"]{
display:flex;justify-content:space-between;gap:0.75rem;
margin:0.5rem 0 0;padding-top:0.625rem;border-top:1px solid var(--vibeui-stepper-012-border);
font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="stepper-012"] [data-part="total"] span:last-child{font-variant-numeric:tabular-nums}
@container (max-width: 28rem){
[data-vibeui-block="stepper-012"] [data-part="layout"]{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-012"] *{animation:none!important;transition:none!important}}
`

const STATE_TEXT: Record<string, string> = {
  done: "Готово",
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

const DEFAULT_STEPS: Stepper012Step[] = [
  { title: "Корзина" },
  { title: "Доставка" },
  { title: "Оплата" },
  { title: "Подтверждение" },
]

const DEFAULT_SUMMARY: Stepper012Line[] = [
  { label: "Товары (3)", value: "7 940 ₽" },
  { label: "Доставка", value: "290 ₽" },
  { label: "Скидка", value: "−500 ₽" },
]

/**
 * Шаги оформления заказа с итогом справа. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Stepper012({
  steps = DEFAULT_STEPS,
  current = 1,
  summary = DEFAULT_SUMMARY,
  summaryTitle = "Ваш заказ",
  totalLabel = "Итого",
  total = "7 730 ₽",
  stateText = STATE_TEXT,
  label = "Оформление заказа",
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper012Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-012-bg": background,
          "--vibeui-stepper-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-012" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-012"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="layout">
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
                    <span data-part="title">
                      {step.title}
                      <span data-part="sr">
                        {" — "}
                        {stateText[state] ?? STATE_TEXT[state]}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
            <aside data-part="summary" aria-label={summaryTitle}>
              <p data-part="summary-title">{summaryTitle}</p>
              {summary.map((line) => (
                <p data-part="line" key={line.label}>
                  <span>{line.label}</span>
                  <span>{line.value}</span>
                </p>
              ))}
              <p data-part="total">
                <span>{totalLabel}</span>
                <span>{total}</span>
              </p>
            </aside>
          </div>
        </div>
      </nav>
    </>
  )
}
