import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline003Step = {
  title: string
  note?: string
  state?: "done" | "current" | "todo"
}

export type Timeline003Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  steps?: Timeline003Step[]
  orderLabel?: string
  eta?: string
  /** Метка текущего шага: компонент несёт русскую, проект подставляет свою. */
  nowLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: статус заказа, где будущее нарисовано иначе, чем прошлое.
// Пройденные шаги несут галочку и сплошную линию, будущие — пустой кружок и
// пунктир: покупателю видно не только «где сейчас», но и сколько осталось.
// Текущий шаг вынесен на светлую плашку, поэтому он читается первым, даже
// если весь список прочитать некогда.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-003"]){
--vibeui-timeline-003-bg:transparent;
--vibeui-timeline-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-timeline-003-muted:light-dark(oklch(0.57 0.014 265),oklch(0.69 0.012 265));
--vibeui-timeline-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-timeline-003-done:light-dark(oklch(0.58 0.14 152),oklch(0.72 0.14 152));
--vibeui-timeline-003-on-done:light-dark(oklch(1 0 0),oklch(0.19 0.04 152));
--vibeui-timeline-003-accent:light-dark(oklch(0.55 0.18 262),oklch(0.72 0.16 262));
--vibeui-timeline-003-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.04 262));
--vibeui-timeline-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-003"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-003-bg);
border:1px solid var(--vibeui-timeline-003-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-003-font);color:var(--vibeui-timeline-003-fg);
}
[data-vibeui-block="timeline-003"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="timeline-003"] [data-part="order"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-003"] [data-part="eta"]{font-size:0.75rem;color:var(--vibeui-timeline-003-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="timeline-003"] ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-003"] li{
position:relative;display:grid;grid-template-columns:1.25rem 1fr;gap:0.625rem;
padding:0 0 0.875rem;
}
[data-vibeui-block="timeline-003"] li:last-child{padding-bottom:0}
/* Пунктир на будущем отрезке: «ещё не случилось» читается формой линии. */
[data-vibeui-block="timeline-003"] li::before{
content:"";position:absolute;left:0.5625rem;top:1.375rem;bottom:0.125rem;
width:0;border-left:2px solid var(--vibeui-timeline-003-border);
}
[data-vibeui-block="timeline-003"] li[data-state="done"]::before{border-left-color:var(--vibeui-timeline-003-done)}
[data-vibeui-block="timeline-003"] li[data-state="current"]::before{border-left-style:dashed}
[data-vibeui-block="timeline-003"] li[data-state="todo"]::before{border-left-style:dashed}
[data-vibeui-block="timeline-003"] li:last-child::before{display:none}
[data-vibeui-block="timeline-003"] [data-part="mark"]{
position:relative;box-sizing:border-box;
width:1.25rem;height:1.25rem;border-radius:9999px;
border:2px solid var(--vibeui-timeline-003-border);background:var(--vibeui-timeline-003-bg);
}
[data-vibeui-block="timeline-003"] li[data-state="done"] [data-part="mark"]{
border-color:var(--vibeui-timeline-003-done);background:var(--vibeui-timeline-003-done);
}
/* Галочка нарисована двумя бордюрами: иконочный шрифт сюда не тащим. */
[data-vibeui-block="timeline-003"] li[data-state="done"] [data-part="mark"]::after{
content:"";position:absolute;left:0.3125rem;top:0.125rem;
width:0.25rem;height:0.5rem;
border:solid var(--vibeui-timeline-003-on-done);border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="timeline-003"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-timeline-003-accent);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-timeline-003-accent) 16%,transparent);
}
[data-vibeui-block="timeline-003"] [data-part="body"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="timeline-003"] [data-part="step"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="timeline-003"] li[data-state="todo"] [data-part="step"]{color:var(--vibeui-timeline-003-muted);font-weight:500}
[data-vibeui-block="timeline-003"] [data-part="note"]{margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-timeline-003-muted)}
/* Текущий шаг — плашка: его читают первым и часто единственным. */
[data-vibeui-block="timeline-003"] li[data-state="current"] [data-part="body"]{
padding:0.4375rem 0.625rem;margin-top:-0.3125rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-timeline-003-accent) 8%,transparent);
}
[data-vibeui-block="timeline-003"] [data-part="now"]{
align-self:flex-start;margin-top:0.25rem;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-timeline-003-accent);color:var(--vibeui-timeline-003-on-accent);
font-size:0.625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Timeline003Step[] = [
  { title: "Оплачен", note: "12 марта, 10:02", state: "done" },
  { title: "Собран на складе", note: "12 марта, 18:40", state: "done" },
  { title: "Едет в ваш город", note: "Прибудет 14 марта", state: "current" },
  { title: "В пункте выдачи", state: "todo" },
  { title: "Получен", state: "todo" },
]

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
 * Статус заказа: галочки на пройденном, пунктир на будущем, плашка на текущем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline003({
  steps = DEFAULT_STEPS,
  orderLabel = "Заказ № 4471",
  eta = "Доставим 14 марта",
  nowLabel = "сейчас",
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline003Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-003"
        className={className}
        style={palette}
        aria-label={orderLabel}
      >
        <div data-part="head">
          <h3 data-part="order">{orderLabel}</h3>
          <span data-part="eta">{eta}</span>
        </div>
        <ol>
          {steps.map((step) => {
            const state = step.state ?? "todo"
            return (
              <li key={step.title} data-state={state}>
                <span data-part="mark" aria-hidden="true" />
                <div data-part="body">
                  <span data-part="step">{step.title}</span>
                  {step.note ? <p data-part="note">{step.note}</p> : null}
                  {state === "current" ? (
                    <span data-part="now">{nowLabel}</span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
