import type { ComponentProps, CSSProperties } from "react"

export type Tooltip016Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Инструкция по формату значения: показывается по фокусу с клавиатуры. */
  hint?: string
  options?: string[]
  name?: string
  /** Пояснение под полем: компонент несёт русское, проект подставляет своё. */
  note?: string
  /** Показать инструкцию принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Тема берётся из color-scheme окружения через light-dark(): подсказка и
// поле темнеют вместе со страницей, собственной плашки под собой блок не
// выкладывает.
//
// Идея компонента: подсказка-инструкция, которая раскрывается именно по
// фокусу с клавиатуры, а не по клику мышью. Триггер — select, а не текстовое
// поле: браузер помечает фокус select как «видимый» (:focus-visible) только
// когда до него дошли табом, и оставляет его без пометки при клике мышью —
// в отличие от текстового поля, где :focus-visible сработал бы всегда.
const STYLES = `
:where([data-vibeui-block="tooltip-016"]){
--vibeui-tooltip-016-bg:transparent;
--vibeui-tooltip-016-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-tooltip-016-muted:color-mix(in oklab,var(--vibeui-tooltip-016-fg) 68%,transparent);
--vibeui-tooltip-016-border:light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
--vibeui-tooltip-016-field:light-dark(oklch(0.99 0 265),oklch(0.29 0 265));
--vibeui-tooltip-016-tip:light-dark(oklch(0.97 0 250),oklch(0.36 0 0));
--vibeui-tooltip-016-tipfg:light-dark(oklch(0.35 0 0),oklch(0.92 0 250));
--vibeui-tooltip-016-accent:light-dark(oklch(0.29 0 0),oklch(0.903 0 0));
--vibeui-tooltip-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-016"]{color-scheme:dark}
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
background:var(--vibeui-tooltip-016-field);color:inherit;
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
/* Витринный режим: инструкция раскрыта без фокуса — миниатюра каталога и
   скриншот показывают, о чём компонент. Плашка абсолютная, поле не съезжает. */
[data-vibeui-block="tooltip-016"][data-open="true"] [data-part="hint"]{
opacity:1;visibility:visible;translate:0 0;
}
[data-vibeui-block="tooltip-016"] [data-part="foot"]{
margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-tooltip-016-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["ЧЧ:ММ, 24 часа", "ЧЧ:ММ AM/PM", "Только часы"]

const DEFAULT_NOTE =
  "Подсказка появляется, когда поле получает фокус с клавиатуры — Tab. Клик мышью её не раскрывает."

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
 * Подсказка-инструкция у поля формы, раскрывающаяся именно по фокусу с
 * клавиатуры — клик мышью её не показывает. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Tooltip016({
  label = "Формат времени",
  hint = "Действует для всех отчётов и уведомлений в аккаунте. Изменение применится со следующего входа.",
  options = DEFAULT_OPTIONS,
  name = "time-format",
  note = DEFAULT_NOTE,
  open = false,
  background = "",
  className,
  style,
  ...props
}: Tooltip016Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-016"
        data-open={open || undefined}
        className={className}
        style={palette}
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
        <p data-part="foot">{note}</p>
      </div>
    </>
  )
}
