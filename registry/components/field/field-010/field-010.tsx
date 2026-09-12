import type { ComponentProps, CSSProperties } from "react"

export type Field010Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  legend?: string
  error?: string
  hint?: string
  /** Подписи клеток и список месяцев: компонент несёт русские. */
  dayLabel?: string
  monthLabel?: string
  yearLabel?: string
  months?: string[]
  defaultMonth?: string
  name?: string
  /** Пусто — подложки нет, группа лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: несколько полей — одна ошибка. Дата, разбитая на день,
// месяц и год, ломается целиком: «31 февраля» неверно, хотя каждое поле по
// отдельности заполнено правильно. Поэтому сообщение живёт на группе, а не
// под одним из полей, группа объявлена <fieldset> с <legend>, и ошибка
// связана с ней через aria-describedby — вслух её слышно при входе в любое поле.
const STYLES = `
:where([data-vibeui-block="field-010"]){
--vibeui-field-010-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-field-010-surface:transparent;
--vibeui-field-010-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-field-010-muted:color-mix(in oklab,var(--vibeui-field-010-fg) 68%,transparent);
--vibeui-field-010-border:light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
--vibeui-field-010-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-field-010-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-field-010-danger:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-field-010-on-danger:light-dark(oklch(1 0 0),oklch(0.21 0.03 25));
--vibeui-field-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="field-010"]{color-scheme:dark}
/* Подложки по умолчанию нет: группа ложится на фон страницы. */
[data-vibeui-block="field-010"]{
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-010-surface);
border:1px solid var(--vibeui-field-010-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-010-font);color:var(--vibeui-field-010-fg);
}
[data-vibeui-block="field-010"] *{box-sizing:border-box}
/* Настоящий fieldset: min-inline-size сбрасываем, иначе он не сжимается. */
[data-vibeui-block="field-010"] fieldset{
margin:0;padding:0;border:0;min-inline-size:0;
}
[data-vibeui-block="field-010"] legend{
padding:0;margin-bottom:0.5rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="field-010"] [data-part="row"]{
display:flex;align-items:flex-end;gap:0.5rem;
}
[data-vibeui-block="field-010"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.25rem;min-width:0;
}
[data-vibeui-block="field-010"] [data-part="cell"][data-size="day"]{flex:1 1 3.5rem}
[data-vibeui-block="field-010"] [data-part="cell"][data-size="month"]{flex:1.6 1 6rem}
[data-vibeui-block="field-010"] [data-part="cell"][data-size="year"]{flex:1.1 1 4.5rem}
[data-vibeui-block="field-010"] [data-part="cell"] label{
font-size:0.6875rem;font-weight:600;color:var(--vibeui-field-010-muted);
}
[data-vibeui-block="field-010"] :is(input,select){
width:100%;height:2.375rem;padding:0 0.5rem;
background:var(--vibeui-field-010-bg);color:inherit;
border:1px solid var(--vibeui-field-010-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="field-010"] input{font-variant-numeric:tabular-nums;text-align:center}
[data-vibeui-block="field-010"] :is(input,select):focus-visible{
outline:2px solid var(--vibeui-field-010-accent);outline-offset:1px;
border-color:var(--vibeui-field-010-accent);
}
[data-vibeui-block="field-010"] input::-webkit-outer-spin-button,
[data-vibeui-block="field-010"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Ошибка красит всю группу: неверна дата целиком, а не одно из трёх полей. */
[data-vibeui-block="field-010"][data-invalid="true"] :is(input,select){
border-color:color-mix(in oklab,var(--vibeui-field-010-danger) 55%,var(--vibeui-field-010-border));
}
[data-vibeui-block="field-010"][data-invalid="true"] :is(input,select):focus-visible{outline-color:var(--vibeui-field-010-danger)}
[data-vibeui-block="field-010"] [data-part="note"]{
margin:0.5rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-010-muted);
}
[data-vibeui-block="field-010"] [data-part="error"]{
display:flex;align-items:flex-start;gap:0.375rem;margin:0.5rem 0 0;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-field-010-danger) 12%,transparent);
font-size:0.75rem;line-height:1.4;font-weight:600;
color:var(--vibeui-field-010-danger);
}
[data-vibeui-block="field-010"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:0.875rem;height:0.875rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-field-010-danger);color:var(--vibeui-field-010-on-danger);
font-size:0.625rem;font-weight:700;line-height:1;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-010"] *{animation:none!important;transition:none!important}}
`

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
]

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
 * Группа полей даты с одной общей ошибкой на fieldset.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field010({
  legend = "Дата рождения",
  error = "31 февраля не существует — проверьте день и месяц.",
  hint = "Нужна, чтобы подтвердить совершеннолетие. Никому не показываем.",
  dayLabel = "День",
  monthLabel = "Месяц",
  yearLabel = "Год",
  months = MONTHS,
  defaultMonth = "февраля",
  name = "birth",
  background = "",
  accent,
  className,
  style,
  ...props
}: Field010Props) {
  const noteId = `${name}-note`

  const palette = {
    ...(accent ? { "--vibeui-field-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-field-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="field"
        data-vibeui-block="field-010"
        data-invalid={error ? "true" : undefined}
        className={className}
        style={palette}
      >
        {/* Сообщение связано с группой, а не с одним полем: вслух его слышно
            при входе в любое из трёх. */}
        <fieldset
          aria-describedby={noteId}
          aria-invalid={error ? true : undefined}
        >
          <legend>{legend}</legend>
          <div data-part="row">
            <span data-part="cell" data-size="day">
              <label htmlFor={`${name}-day`}>{dayLabel}</label>
              <input
                id={`${name}-day`}
                name={`${name}-day`}
                type="number"
                inputMode="numeric"
                min={1}
                max={31}
                defaultValue={31}
              />
            </span>
            <span data-part="cell" data-size="month">
              <label htmlFor={`${name}-month`}>{monthLabel}</label>
              <select
                id={`${name}-month`}
                name={`${name}-month`}
                defaultValue={defaultMonth}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </span>
            <span data-part="cell" data-size="year">
              <label htmlFor={`${name}-year`}>{yearLabel}</label>
              <input
                id={`${name}-year`}
                name={`${name}-year`}
                type="number"
                inputMode="numeric"
                min={1900}
                max={2026}
                defaultValue={1994}
              />
            </span>
          </div>
          {error ? (
            <p id={noteId} data-part="error" role="alert">
              <span data-part="mark" aria-hidden="true">
                !
              </span>
              {error}
            </p>
          ) : (
            <p id={noteId} data-part="note">
              {hint}
            </p>
          )}
        </fieldset>
      </div>
    </>
  )
}
