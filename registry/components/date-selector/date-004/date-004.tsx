import type { ComponentProps, CSSProperties } from "react"

export type Date004Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultDate?: string
  defaultTime?: string
  timezone?: string
  name?: string
  /** Подписи полей: компонент несёт русские, проект подставляет свои. */
  dateLabel?: string
  timeLabel?: string
  /** Пусто — подложки нет, поля лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: дата и время как два поля в одной рамке. Нативный
// datetime-local собирает всё в один контрол, но на телефоне открывает два
// экрана подряд, а на десктопе даёт длинную маску, где легко промахнуться
// мимо сегмента. Два отдельных поля видно по отдельности, они подписаны и
// правятся независимо. Часовой пояс подписан явно: «в 19:00» без пояса —
// самая частая причина сорванных встреч. Состояние не нужно, форма сама
// соберёт оба значения, поэтому компонент серверный.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="date-004"]){
--vibeui-date-004-surface:transparent;
--vibeui-date-004-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-date-004-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-date-004-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-date-004-muted:color-mix(in oklab,var(--vibeui-date-004-fg) 68%,transparent);
--vibeui-date-004-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-date-004-accent:light-dark(oklch(0.52 0.17 39.8),oklch(0.78 0.14 39.8));
--vibeui-date-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-004"]{color-scheme:dark}
/* Подложки по умолчанию нет: рамка держит форму, фон приходит со страницы. */
[data-vibeui-block="date-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-004-surface);
border:1px solid var(--vibeui-date-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-004-font);color:var(--vibeui-date-004-fg);
}
[data-vibeui-block="date-004"] [data-part="title"]{margin:0;font-size:0.8125rem;font-weight:650}
/* Одна рамка на два поля: это одно значение, разделённое на понятные части. */
[data-vibeui-block="date-004"] [data-part="frame"]{
display:flex;align-items:stretch;overflow:hidden;
border:1px solid var(--vibeui-date-004-border);border-radius:0.75rem;
background:var(--vibeui-date-004-field);
}
[data-vibeui-block="date-004"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-date-004-accent);
box-shadow:0 0 0 2px color-mix(in oklch,var(--vibeui-date-004-accent) 22%,transparent);
}
[data-vibeui-block="date-004"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.125rem;justify-content:center;
padding:0.4375rem 0.75rem;min-width:0;
}
[data-vibeui-block="date-004"] [data-part="cell"][data-role="date"]{flex:1 1 60%;border-right:1px solid var(--vibeui-date-004-border)}
[data-vibeui-block="date-004"] [data-part="cell"][data-role="time"]{flex:1 1 40%}
[data-vibeui-block="date-004"] label{
font-size:0.625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-date-004-muted);
}
[data-vibeui-block="date-004"] input{
width:100%;min-width:0;box-sizing:border-box;
appearance:none;border:0;background:none;outline:none;padding:0;
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-004"] input::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.5}
[data-vibeui-block="date-004"] input::-webkit-calendar-picker-indicator:hover{opacity:1}
/* Пояс подписан явно: «в 19:00» без пояса срывает встречи чаще всего. */
[data-vibeui-block="date-004"] [data-part="zone"]{
display:flex;align-items:center;gap:0.375rem;margin:0;
font-size:0.75rem;color:var(--vibeui-date-004-muted);
}
[data-vibeui-block="date-004"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;flex:none;
background:var(--vibeui-date-004-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Дата и время двумя полями в одной рамке, с явной подписью часового пояса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date004({
  label = "Начало встречи",
  defaultDate = "2026-09-08",
  defaultTime = "19:00",
  timezone = "Время московское, UTC+3",
  name = "meeting",
  dateLabel = "Дата",
  timeLabel = "Время",
  background = "",
  accent,
  className,
  style,
  ...props
}: Date004Props) {
  const palette = {
    ...(accent ? { "--vibeui-date-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-004"
        className={className}
        style={palette}
      >
        <p data-part="title">{label}</p>
        <div data-part="frame">
          <div data-part="cell" data-role="date">
            <label htmlFor={`${name}-date`}>{dateLabel}</label>
            <input
              id={`${name}-date`}
              name={`${name}-date`}
              type="date"
              defaultValue={defaultDate}
            />
          </div>
          <div data-part="cell" data-role="time">
            <label htmlFor={`${name}-time`}>{timeLabel}</label>
            <input
              id={`${name}-time`}
              name={`${name}-time`}
              type="time"
              defaultValue={defaultTime}
            />
          </div>
        </div>
        <p data-part="zone">
          <span data-part="dot" aria-hidden="true" />
          {timezone}
        </p>
      </div>
    </>
  )
}
