import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip016Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  /** Инструкция по формату значения: показывается по фокусу с клавиатуры. */
  hint?: string
  options?: string[]
  name?: string
}

// Идея компонента: подсказка-инструкция, которая раскрывается именно по
// фокусу с клавиатуры, а не по клику мышью. Триггер — select, а не текстовое
// поле: браузер помечает фокус select как «видимый» (:focus-visible) только
// когда до него дошли табом, и оставляет его без пометки при клике мышью —
// в отличие от текстового поля, где :focus-visible сработал бы всегда.
const STYLES = `
:where([data-vibeui-block="tooltip-016"]){
--vibeui-tooltip-016-bg:oklch(1 0 0);
--vibeui-tooltip-016-fg:oklch(0.24 0.014 265);
--vibeui-tooltip-016-muted:oklch(0.54 0.014 265);
--vibeui-tooltip-016-border:oklch(0.88 0.006 265);
--vibeui-tooltip-016-tip:oklch(0.97 0.02 250);
--vibeui-tooltip-016-tipfg:oklch(0.35 0.07 250);
--vibeui-tooltip-016-accent:oklch(0.56 0.17 260);
--vibeui-tooltip-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-016"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
padding:1rem;
border:1px solid var(--vibeui-tooltip-016-border);border-radius:0.875rem;
background:var(--vibeui-tooltip-016-bg);color:var(--vibeui-tooltip-016-fg);
font-family:var(--vibeui-tooltip-016-font);
}
[data-vibeui-block="tooltip-016"] [data-part="label"]{font-size:0.8125rem;font-weight:620}
[data-vibeui-block="tooltip-016"] [data-part="field"]{position:relative;display:flex}
[data-vibeui-block="tooltip-016"] [data-part="select"]{
width:100%;box-sizing:border-box;
height:2.375rem;padding:0 0.6875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-016-border);
background:oklch(0.99 0.002 265);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tooltip-016"] [data-part="select"]:focus{outline:none}
[data-vibeui-block="tooltip-016"] [data-part="select"]:focus-visible{
border-color:var(--vibeui-tooltip-016-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-tooltip-016-accent) 22%,transparent);
}
/* Подсказка привязана к :focus-visible поля, а не к :focus-within обёртки. */
[data-vibeui-block="tooltip-016"] [data-part="hint"]{
position:absolute;left:0;right:0;top:calc(100% + 0.4375rem);z-index:20;
box-sizing:border-box;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-016-tip);color:var(--vibeui-tooltip-016-tipfg);
font-size:0.75rem;line-height:1.45;
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .14s ease,translate .14s ease,visibility .14s;
}
[data-vibeui-block="tooltip-016"] [data-part="hint"]::before{
content:"";position:absolute;left:0.9375rem;top:-0.1875rem;
width:0.5rem;height:0.5rem;background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-016"] [data-part="select"]:focus-visible ~ [data-part="hint"]{
opacity:1;visibility:visible;translate:0 0;
}
[data-vibeui-block="tooltip-016"] [data-part="foot"]{
margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-tooltip-016-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["ЧЧ:ММ, 24 часа", "ЧЧ:ММ AM/PM", "Только часы"]

/**
 * Подсказка-инструкция у поля формы, раскрывающаяся именно по фокусу с
 * клавиатуры — клик мышью её не показывает. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Tooltip016({
  label = "Формат времени",
  hint = "Действует для всех отчётов и уведомлений в аккаунте. Изменение применится со следующего входа.",
  options = DEFAULT_OPTIONS,
  name = "time-format",
  className,
  style,
  ...props
}: Tooltip016Props) {
  return (
    <>
      <style href="vibeui-tooltip-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-016"
        className={className}
        style={style as CSSProperties}
      >
        <label data-part="label" htmlFor="vibeui-tooltip-016-select">
          {label}
        </label>
        <span data-part="field">
          <select
            data-part="select"
            id="vibeui-tooltip-016-select"
            name={name}
            aria-describedby="vibeui-tooltip-016-hint"
            defaultValue={options[0]}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span data-part="hint" id="vibeui-tooltip-016-hint" role="note">
            {hint}
          </span>
        </span>
        <p data-part="foot">
          Подсказка появляется, когда поле получает фокус с клавиатуры — Tab.
          Клик мышью её не раскрывает.
        </p>
      </div>
    </>
  )
}
