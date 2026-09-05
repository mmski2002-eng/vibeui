import type { ComponentProps, CSSProperties } from "react"

export type Stepper010Step = {
  title: string
  summary: string
  details?: string[]
}

export type Stepper010Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: Stepper010Step[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  /** Заголовок панели с подробностями текущего шага. */
  detailsTitle?: string
  /** Подписи состояний: компонент несёт русские, проект подставляет свои. */
  stateText?: Record<string, string>
  label?: string
  /** Пусто — подложки нет, лента лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у каждого шага есть сводка в одну строку, но подробности —
// только у текущего. Раскрытая панель со списком деталей появляется
// исключительно на шаге с current, поэтому лента остаётся короткой, а
// внимание не распыляется на детали шагов, которые ещё не наступили.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="stepper-010"]){
--vibeui-stepper-010-bg:transparent;
--vibeui-stepper-010-surface:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-stepper-010-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265));
--vibeui-stepper-010-muted:color-mix(in oklab,var(--vibeui-stepper-010-fg) 68%,transparent);
--vibeui-stepper-010-border:light-dark(oklch(0.92 0.006 265),oklch(0.32 0.012 265));
--vibeui-stepper-010-line:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-stepper-010-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-stepper-010-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0.02 262));
--vibeui-stepper-010-panel:light-dark(oklch(0.97 0.01 262),oklch(0.26 0.022 262));
--vibeui-stepper-010-dot:1.5rem;
--vibeui-stepper-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-010"]{color-scheme:dark}
[data-vibeui-block="stepper-010"]{
width:100%;max-width:32rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-010-font);color:var(--vibeui-stepper-010-fg);
}
[data-vibeui-block="stepper-010"] [data-part="shell"]{
background:var(--vibeui-stepper-010-bg);
border:1px solid var(--vibeui-stepper-010-border);
border-radius:1rem;padding:1rem 1.125rem;
}
[data-vibeui-block="stepper-010"] ol{margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-010"] li{
position:relative;display:grid;
grid-template-columns:var(--vibeui-stepper-010-dot) 1fr;
gap:0 0.75rem;padding-bottom:1.125rem;
}
[data-vibeui-block="stepper-010"] li:last-child{padding-bottom:0}
[data-vibeui-block="stepper-010"] li:not(:last-child)::before{
content:"";position:absolute;left:calc(var(--vibeui-stepper-010-dot) / 2 - 1px);
top:var(--vibeui-stepper-010-dot);bottom:0.25rem;width:2px;
background:var(--vibeui-stepper-010-line);
}
[data-vibeui-block="stepper-010"] li[data-state="done"]::before{background:var(--vibeui-stepper-010-accent)}
/* grid-row:1 / span 3, а не 1 / -1: у пункта нет явных строк, и -1 указывает
   на первую же линию — кружок занимал одну строку, а сводка и панель
   сваливались в колонку кружка и переносились по слову. */
[data-vibeui-block="stepper-010"] [data-part="mark"]{
grid-column:1;grid-row:1 / span 3;align-self:start;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-010-dot);height:var(--vibeui-stepper-010-dot);
border-radius:9999px;border:2px solid var(--vibeui-stepper-010-line);
background:var(--vibeui-stepper-010-surface);color:var(--vibeui-stepper-010-muted);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-010"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-010-accent);border-color:var(--vibeui-stepper-010-accent);
color:var(--vibeui-stepper-010-accent-fg);
}
[data-vibeui-block="stepper-010"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-010-accent);color:var(--vibeui-stepper-010-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-010-accent) 18%,transparent);
}
[data-vibeui-block="stepper-010"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.5rem;
min-height:var(--vibeui-stepper-010-dot);
}
[data-vibeui-block="stepper-010"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="stepper-010"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-010-muted);
}
[data-vibeui-block="stepper-010"] [data-part="state"]{
padding:0.0625rem 0.375rem;border-radius:9999px;
border:1px solid var(--vibeui-stepper-010-border);
font-size:0.625rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-stepper-010-muted);
}
[data-vibeui-block="stepper-010"] li[data-state="done"] [data-part="state"]{
color:var(--vibeui-stepper-010-accent);
border-color:color-mix(in oklab,var(--vibeui-stepper-010-accent) 40%,transparent);
}
[data-vibeui-block="stepper-010"] li[data-state="current"] [data-part="state"]{
background:var(--vibeui-stepper-010-accent);border-color:transparent;
color:var(--vibeui-stepper-010-accent-fg);
}
[data-vibeui-block="stepper-010"] [data-part="summary"]{
margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-stepper-010-muted);
}
[data-vibeui-block="stepper-010"] [data-part="panel"]{
margin-top:0.625rem;padding:0.75rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-stepper-010-panel);
border:1px solid color-mix(in oklab,var(--vibeui-stepper-010-accent) 20%,transparent);
}
[data-vibeui-block="stepper-010"] [data-part="panel-title"]{
margin:0 0 0.375rem;font-size:0.75rem;font-weight:650;color:var(--vibeui-stepper-010-fg);
}
[data-vibeui-block="stepper-010"] [data-part="panel"] ul{margin:0;padding-left:1.125rem;list-style:disc}
[data-vibeui-block="stepper-010"] [data-part="panel"] li{
position:static;display:list-item;padding:0.125rem 0;grid-template-columns:none;
font-size:0.75rem;line-height:1.5;color:var(--vibeui-stepper-010-muted);
}
[data-vibeui-block="stepper-010"] [data-part="panel"] li::before{content:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Stepper010Step[] = [
  {
    title: "Домен",
    summary: "Подключён и проверен, сертификат выпущен автоматически.",
  },
  {
    title: "Оплата",
    summary: "Способ оплаты сохранён для будущих списаний.",
  },
  {
    title: "Импорт данных",
    summary: "Переносим каталог и заказы из прошлой системы.",
    details: [
      "Файл выгрузки принят, идёт разбор строк",
      "Дубликаты товаров помечаются, а не удаляются",
      "После разбора пришлём отчёт на почту",
    ],
  },
  {
    title: "Запуск",
    summary: "Магазин станет виден покупателям.",
  },
]

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

/**
 * Вертикальные шаги, где у текущего раскрыта панель с подробностями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper010({
  steps = DEFAULT_STEPS,
  current = 2,
  detailsTitle = "Что происходит сейчас",
  stateText = STATE_TEXT,
  label = "Перенос магазина",
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper010Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-010-bg": background,
          "--vibeui-stepper-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-010" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-010"
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
                    <span data-part="state">
                      {stateText[state] ?? STATE_TEXT[state]}
                    </span>
                  </span>
                  <p data-part="summary">{step.summary}</p>
                  {state === "current" && step.details?.length ? (
                    <div data-part="panel">
                      <p data-part="panel-title">{detailsTitle}</p>
                      <ul>
                        {step.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </div>
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
