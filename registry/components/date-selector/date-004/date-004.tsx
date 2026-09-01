import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Date004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultDate?: string
  defaultTime?: string
  timezone?: string
  name?: string
  accent?: string
}

// Идея компонента: дата и время как два поля в одной рамке. Нативный
// datetime-local собирает всё в один контрол, но на телефоне открывает два
// экрана подряд, а на десктопе даёт длинную маску, где легко промахнуться
// мимо сегмента. Два отдельных поля видно по отдельности, они подписаны и
// правятся независимо. Часовой пояс подписан явно: «в 19:00» без пояса —
// самая частая причина сорванных встреч. Состояние не нужно, форма сама
// соберёт оба значения, поэтому компонент серверный.
const STYLES = `
:where([data-vibeui-block="date-004"]){
--vibeui-date-004-surface:oklch(1 0 0);
--vibeui-date-004-field:oklch(0.985 0.002 265);
--vibeui-date-004-shell:oklch(0.9 0.006 265);
--vibeui-date-004-fg:oklch(0.23 0.014 265);
--vibeui-date-004-muted:oklch(0.55 0.014 265);
--vibeui-date-004-border:oklch(0.88 0.008 265);
--vibeui-date-004-accent:oklch(0.52 0.17 300);
--vibeui-date-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
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
box-shadow:0 0 0 2px oklch(0.52 0.17 300 / 18%);
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
 * Дата и время двумя полями в одной рамке, с явной подписью часового пояса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date004({
  label = "Начало встречи",
  defaultDate = "2026-09-08",
  defaultTime = "19:00",
  timezone = "Время московское, UTC+3",
  name = "meeting",
  accent,
  className,
  style,
  ...props
}: Date004Props) {
  const palette = {
    ...(accent ? { "--vibeui-date-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="date-004"
        className={className}
        style={palette}
      >
        <p data-part="title">{label}</p>
        <div data-part="frame">
          <div data-part="cell" data-role="date">
            <label htmlFor={`${name}-date`}>Дата</label>
            <input
              id={`${name}-date`}
              name={`${name}-date`}
              type="date"
              defaultValue={defaultDate}
            />
          </div>
          <div data-part="cell" data-role="time">
            <label htmlFor={`${name}-time`}>Время</label>
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
