import type { CSSProperties } from "react"

export type Dashboard025Stage = {
  label: string
  value: number
  hint?: string
}

export type Dashboard025Props = {
  title?: string
  period?: string
  segments?: string[]
  activeSegment?: string
  stages?: Dashboard025Stage[]
  unit?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись выпадающего списка сегментов для скринридера. */
  segmentLabel?: string
  /** Шаблон доли шага: {percent}. */
  reachedText?: string
  /** Шаблон потерь между шагами: {count}. */
  lostText?: string
  /** Шаблон доли от входа: {percent}. */
  shareText?: string
  /** Шаблон подписи полосы: {label}, {value}, {unit}, {percent}. */
  barLabelText?: string
  /** Подписи итогов: conversion, reached, worst. */
  totalsText?: Record<string, string>
  /** Локаль форматирования чисел. */
  locale?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: воронка, где главное число — не длина ступени, а потеря между
// ступенями. Поэтому между полосами стоит отдельная строка «дошло N %,
// потеряно M»: без неё воронку читают как «много сверху, мало снизу» и не
// видят, на каком шаге рвётся. Ступени считаются от первой, а конверсия шага
// — от предыдущей: две базы намеренно разные, и обе подписаны. Полоса
// нарисована шириной элемента, без графической библиотеки.
const STYLES = `
:where([data-vibeui-block="dashboard-025"]){
--vibeui-dashboard-025-bg:transparent;
--vibeui-dashboard-025-panel:light-dark(oklch(0.985 0.003 265),oklch(0.27 0.012 265));
--vibeui-dashboard-025-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-025-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-025-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.011 265));
--vibeui-dashboard-025-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-dashboard-025-loss:light-dark(oklch(0.6 0.16 25),oklch(0.74 0.15 25));
--vibeui-dashboard-025-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-025"]{color-scheme:dark}
[data-vibeui-block="dashboard-025"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-025-bg);
color:var(--vibeui-dashboard-025-fg);
font-family:var(--vibeui-dashboard-025-sans);
border:1px solid var(--vibeui-dashboard-025-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-025"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-025"] [data-part="shell"]{padding:1.125rem}
[data-vibeui-block="dashboard-025"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;margin-bottom:1rem;
}
[data-vibeui-block="dashboard-025"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-025"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-025-muted)}
[data-vibeui-block="dashboard-025"] select{
appearance:none;font:inherit;font-size:0.75rem;color:inherit;margin-left:auto;
padding:0.375rem 1.75rem 0.375rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-025-border);
background:var(--vibeui-dashboard-025-bg)
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23777' stroke-width='1.6'/%3E%3C/svg%3E")
no-repeat right 0.5rem center/0.625rem;
}
[data-vibeui-block="dashboard-025"] select:focus-visible{outline:2px solid var(--vibeui-dashboard-025-accent);outline-offset:2px}
[data-vibeui-block="dashboard-025"] ol{list-style:none;margin:0;padding:0}
[data-vibeui-block="dashboard-025"] [data-part="stage"]{margin-bottom:0.25rem}
[data-vibeui-block="dashboard-025"] [data-part="line"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem;margin:0 0 0.25rem;
font-size:0.8125rem;
}
[data-vibeui-block="dashboard-025"] [data-part="name"]{font-weight:650}
[data-vibeui-block="dashboard-025"] [data-part="hint"]{font-size:0.6875rem;color:var(--vibeui-dashboard-025-muted)}
[data-vibeui-block="dashboard-025"] [data-part="count"]{
margin-left:auto;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-025"] [data-part="share"]{
font-size:0.75rem;color:var(--vibeui-dashboard-025-muted);
font-variant-numeric:tabular-nums;
}
/* Ширина ступени — единственное динамическое число, приходит переменной. */
[data-vibeui-block="dashboard-025"] [data-part="bar"]{
display:block;height:1.75rem;border-radius:0.375rem;
width:var(--vibeui-dashboard-025-w);min-width:2.5rem;
background:linear-gradient(90deg,var(--vibeui-dashboard-025-accent),color-mix(in oklab,var(--vibeui-dashboard-025-accent) 70%,white));
}
[data-vibeui-block="dashboard-025"] [data-part="drop"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.3125rem 0 0.3125rem 0.75rem;margin:0.125rem 0 0.375rem 0.75rem;
border-left:2px dashed var(--vibeui-dashboard-025-border);
font-size:0.6875rem;color:var(--vibeui-dashboard-025-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-025"] [data-part="lost"]{color:var(--vibeui-dashboard-025-loss);font-weight:650}
[data-vibeui-block="dashboard-025"] [data-part="foot"]{
display:grid;grid-template-columns:1fr;gap:0.625rem;margin-top:1rem;padding-top:0.875rem;
border-top:1px solid var(--vibeui-dashboard-025-border);
}
[data-vibeui-block="dashboard-025"] [data-part="total"]{
background:var(--vibeui-dashboard-025-panel);
border:1px solid var(--vibeui-dashboard-025-border);border-radius:0.75rem;
padding:0.625rem 0.75rem;
}
[data-vibeui-block="dashboard-025"] [data-part="totallabel"]{
display:block;font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-025-muted);
}
[data-vibeui-block="dashboard-025"] [data-part="totalvalue"]{
display:block;margin-top:0.1875rem;font-size:1.125rem;font-weight:700;
font-variant-numeric:tabular-nums;
}
@container (min-width: 40rem){
[data-vibeui-block="dashboard-025"] [data-part="shell"]{padding:1.375rem}
[data-vibeui-block="dashboard-025"] [data-part="foot"]{grid-template-columns:repeat(3,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-025"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STAGES: Dashboard025Stage[] = [
  { label: "Открыли каталог", value: 12480, hint: "уникальные визиты" },
  { label: "Открыли компонент", value: 6210, hint: "страница блока" },
  { label: "Нажали «Copy for AI»", value: 2870, hint: "промпт скопирован" },
  { label: "Запустили установку", value: 1340, hint: "команда выполнена" },
  { label: "Оставили блок в проекте", value: 902, hint: "через 7 дней" },
]

const DEFAULT_TOTALS: Record<string, string> = {
  conversion: "Сквозная конверсия",
  reached: "Дошло до конца",
  worst: "Самый узкий шаг",
}

function percent(part: number, whole: number) {
  return whole === 0 ? 0 : Math.round((part / whole) * 1000) / 10
}

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
 * Воронка по этапам: ступени от первой, конверсия шага от предыдущей и
 * явная строка потерь. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard025({
  title = "Воронка установки",
  period = "1–14 марта",
  segments = ["Все источники", "Поиск", "Рассылка", "Реферальные"],
  activeSegment = "Все источники",
  stages = DEFAULT_STAGES,
  unit = "человек",
  accent,
  background = "",
  segmentLabel = "Сегмент",
  reachedText = "дошло {percent} %,",
  lostText = "потеряно {count}",
  shareText = "{percent} % от входа",
  barLabelText = "{label}: {value} {unit}, {percent} % от входа",
  totalsText = DEFAULT_TOTALS,
  locale = "ru-RU",
  className,
  style,
}: Dashboard025Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-025-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-025-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const top = stages[0]?.value ?? 0
  const bottom = stages[stages.length - 1]?.value ?? 0
  const worst = stages.reduce(
    (found, stage, index) => {
      if (index === 0) {
        return found
      }

      const step = percent(stage.value, stages[index - 1].value)

      return step < found.step ? { label: stage.label, step } : found
    },
    { label: "—", step: 100 },
  )

  return (
    <>
      <style href="vibeui-dashboard-025" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-025"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <p data-part="period">{period}</p>
            <select
              key={activeSegment}
              defaultValue={activeSegment}
              aria-label={segmentLabel}
            >
              {segments.map((segment) => (
                <option key={segment}>{segment}</option>
              ))}
            </select>
          </header>

          <ol>
            {stages.map((stage, index) => {
              const previous =
                index === 0 ? stage.value : stages[index - 1].value
              const step = percent(stage.value, previous)
              const fromTop = percent(stage.value, top)

              return (
                <li key={stage.label} data-part="stage">
                  {index > 0 ? (
                    <p data-part="drop">
                      {fill(reachedText, { percent: step })}{" "}
                      <span data-part="lost">
                        {fill(lostText, {
                          count: (previous - stage.value).toLocaleString(
                            locale,
                          ),
                        })}
                      </span>
                    </p>
                  ) : null}
                  <p data-part="line">
                    <span data-part="name">{stage.label}</span>
                    {stage.hint ? (
                      <span data-part="hint">{stage.hint}</span>
                    ) : null}
                    <span data-part="count">
                      {stage.value.toLocaleString(locale)}
                    </span>
                    <span data-part="share">
                      · {fill(shareText, { percent: fromTop })}
                    </span>
                  </p>
                  <span
                    data-part="bar"
                    role="img"
                    aria-label={fill(barLabelText, {
                      label: stage.label,
                      value: stage.value,
                      unit,
                      percent: fromTop,
                    })}
                    style={
                      {
                        "--vibeui-dashboard-025-w": `${Math.max(6, fromTop)}%`,
                      } as CSSProperties
                    }
                  />
                </li>
              )
            })}
          </ol>

          <div data-part="foot">
            <p data-part="total">
              <span data-part="totallabel">
                {totalsText.conversion ?? DEFAULT_TOTALS.conversion}
              </span>
              <span data-part="totalvalue">{percent(bottom, top)} %</span>
            </p>
            <p data-part="total">
              <span data-part="totallabel">
                {totalsText.reached ?? DEFAULT_TOTALS.reached}
              </span>
              <span data-part="totalvalue">
                {bottom.toLocaleString(locale)} {unit}
              </span>
            </p>
            <p data-part="total">
              <span data-part="totallabel">
                {totalsText.worst ?? DEFAULT_TOTALS.worst}
              </span>
              <span data-part="totalvalue">
                {worst.label} · {worst.step} %
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
