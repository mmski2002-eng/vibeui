"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Dashboard011Step = {
  title: string
  hint: string
}

export type Dashboard011Props = {
  title?: string
  steps?: Dashboard011Step[]
  backLabel?: string
  nextLabel?: string
  doneLabel?: string
  /** Поля панели шага: подпись и значение по умолчанию. */
  fields?: { label: string; value: string }[]
  /** Счётчик шагов: {current} и {total} — числа. */
  countText?: string
  /** Подпись полосы продвижения для скринридера. */
  progressText?: string
  /** Пусто — подложки нет, мастер ложится на фон страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: мастер из нескольких шагов. Полоса шагов показывает не только
// текущий, но и весь путь: человек должен видеть, сколько осталось, иначе он
// не понимает, стоит ли начинать. Кнопка «Назад» есть всегда, кроме первого
// шага, и она не прячется — исчезающая кнопка ломает привычку. На последнем
// шаге кнопка меняет подпись на завершающее действие, а не остаётся «Далее»:
// человек должен знать, что следующий клик закончит мастер.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у мастера нет, панель шага держит свою поверхность.
const STYLES = `
:where([data-vibeui-block="dashboard-011"]){
--vibeui-dashboard-011-bg:transparent;
--vibeui-dashboard-011-field:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dashboard-011-panel:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-dashboard-011-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-dashboard-011-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-011-border:light-dark(oklch(0.91 0.006 265),oklch(0.38 0.012 265));
--vibeui-dashboard-011-track:light-dark(oklch(0.93 0.005 265),oklch(0.34 0.01 265));
--vibeui-dashboard-011-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-dashboard-011-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 262));
--vibeui-dashboard-011-done:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-dashboard-011-on-done:light-dark(oklch(1 0 0),oklch(0.2 0.04 152));
--vibeui-dashboard-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-011"]{color-scheme:dark}
[data-vibeui-block="dashboard-011"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-dashboard-011-bg);
border:1px solid var(--vibeui-dashboard-011-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-011-sans);color:var(--vibeui-dashboard-011-fg);
}
[data-vibeui-block="dashboard-011"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-011"] h2{margin:0 0 0.75rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
/* Виден весь путь, а не только текущий шаг: иначе неясно, сколько осталось. */
[data-vibeui-block="dashboard-011"] ol{
list-style:none;display:flex;flex-wrap:wrap;gap:0.5rem 1rem;margin:0 0 0.875rem;padding:0;
}
[data-vibeui-block="dashboard-011"] li{
display:flex;align-items:center;gap:0.375rem;
font-size:0.75rem;color:var(--vibeui-dashboard-011-muted);
}
[data-vibeui-block="dashboard-011"] [data-part="mark"]{
display:inline-flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:9999px;
box-shadow:inset 0 0 0 1.5px var(--vibeui-dashboard-011-border);
font-size:0.625rem;font-weight:700;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-011"] [data-state="done"]{color:var(--vibeui-dashboard-011-fg)}
[data-vibeui-block="dashboard-011"] [data-state="done"] [data-part="mark"]{
background:var(--vibeui-dashboard-011-done);color:var(--vibeui-dashboard-011-on-done);box-shadow:none;
}
[data-vibeui-block="dashboard-011"] [data-state="current"]{color:var(--vibeui-dashboard-011-fg);font-weight:650}
[data-vibeui-block="dashboard-011"] [data-state="current"] [data-part="mark"]{box-shadow:inset 0 0 0 3px var(--vibeui-dashboard-011-accent)}
[data-vibeui-block="dashboard-011"] [data-part="track"]{
height:0.25rem;margin-bottom:0.875rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-011-track);
}
[data-vibeui-block="dashboard-011"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-dashboard-011-progress,0%);
background:var(--vibeui-dashboard-011-accent);
transition:width .2s ease;
}
[data-vibeui-block="dashboard-011"] [data-part="panel"]{
padding:0.875rem;margin-bottom:0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-011-panel);
border:1px solid var(--vibeui-dashboard-011-border);
}
[data-vibeui-block="dashboard-011"] h3{margin:0 0 0.25rem;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="dashboard-011"] [data-part="hint"]{margin:0 0 0.75rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-dashboard-011-muted)}
[data-vibeui-block="dashboard-011"] [data-part="fields"]{display:grid;grid-template-columns:1fr;gap:0.5rem}
@container (min-width: 32rem){[data-vibeui-block="dashboard-011"] [data-part="fields"]{grid-template-columns:1fr 1fr}}
[data-vibeui-block="dashboard-011"] label{display:flex;flex-direction:column;gap:0.25rem;font-size:0.75rem;font-weight:600}
[data-vibeui-block="dashboard-011"] input{
height:2.25rem;padding:0 0.625rem;
border:1px solid var(--vibeui-dashboard-011-border);border-radius:0.5rem;
background:var(--vibeui-dashboard-011-field);color:inherit;font:inherit;font-size:0.8125rem;font-weight:400;
}
[data-vibeui-block="dashboard-011"] input:focus-visible{outline:2px solid var(--vibeui-dashboard-011-accent);outline-offset:1px}
[data-vibeui-block="dashboard-011"] [data-part="actions"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="dashboard-011"] [data-part="count"]{
margin-right:auto;font-size:0.75rem;color:var(--vibeui-dashboard-011-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-011"] button{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-011"] [data-part="next"]{border:0;background:var(--vibeui-dashboard-011-accent);color:var(--vibeui-dashboard-011-on-accent)}
/* «Назад» не исчезает, а гаснет: пропадающая кнопка ломает привычку. */
[data-vibeui-block="dashboard-011"] [data-part="back"]{
border:1px solid var(--vibeui-dashboard-011-border);background:none;color:inherit;
}
[data-vibeui-block="dashboard-011"] [data-part="back"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="dashboard-011"] button:focus-visible{outline:2px solid var(--vibeui-dashboard-011-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Dashboard011Step[] = [
  {
    title: "Проект",
    hint: "Название видно всем участникам, адрес входит в ссылки установки.",
  },
  {
    title: "Команда",
    hint: "Пригласите тех, кто будет ставить компоненты. Роли меняются позже.",
  },
  {
    title: "Ключ доступа",
    hint: "Ключ выдаётся один раз и показывается только сейчас.",
  },
]

const DEFAULT_FIELDS = [
  { label: "Название", value: "Каталог VibeUI" },
  { label: "Адрес", value: "vibeui-catalog" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Мастер из нескольких шагов: виден весь путь, кнопка меняет подпись на конце.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard011({
  title = "Настройка проекта",
  steps = DEFAULT_STEPS,
  backLabel = "Назад",
  nextLabel = "Далее",
  doneLabel = "Создать проект",
  fields = DEFAULT_FIELDS,
  countText = "Шаг {current} из {total}",
  progressText = "Продвижение по шагам",
  background = "",
  accent,
  className,
  style,
}: Dashboard011Props) {
  const [index, setIndex] = useState(1)
  const last = index === steps.length - 1
  const progress = `${((index + 1) / steps.length) * 100}%`

  const palette = {
    "--vibeui-dashboard-011-progress": progress,
    ...(accent ? { "--vibeui-dashboard-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-011"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>

        <ol>
          {steps.map((step, number) => (
            <li
              key={step.title}
              data-state={
                number < index ? "done" : number === index ? "current" : "next"
              }
              aria-current={number === index ? "step" : undefined}
            >
              <span data-part="mark" aria-hidden="true">
                {number < index ? "✓" : number + 1}
              </span>
              {step.title}
            </li>
          ))}
        </ol>

        <div
          data-part="track"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={progressText}
        >
          <span data-part="fill" />
        </div>

        <div data-part="panel">
          <h3>{steps[index].title}</h3>
          <p data-part="hint">{steps[index].hint}</p>
          <div data-part="fields">
            {fields.map((field) => (
              <label key={field.label}>
                {field.label}
                <input type="text" defaultValue={field.value} />
              </label>
            ))}
          </div>
        </div>

        <div data-part="actions">
          <span data-part="count">
            {countText
              .replace("{current}", String(index + 1))
              .replace("{total}", String(steps.length))}
          </span>
          <button
            type="button"
            data-part="back"
            disabled={index === 0}
            onClick={() => setIndex((current) => Math.max(0, current - 1))}
          >
            {backLabel}
          </button>
          <button
            type="button"
            data-part="next"
            onClick={() =>
              setIndex((current) => Math.min(steps.length - 1, current + 1))
            }
          >
            {last ? doneLabel : nextLabel}
          </button>
        </div>
      </section>
    </>
  )
}
