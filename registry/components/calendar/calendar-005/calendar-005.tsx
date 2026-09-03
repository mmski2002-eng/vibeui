import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Calendar005Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  min?: string
  max?: string
  hint?: string
  accent?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: поле даты на нативном input type="date". Календарь,
// клавиатура, локальный формат и мобильный барабан приходят от системы —
// свой виджет пришлось бы переводить на все языки и чинить в каждом
// браузере. Ограничения min и max объявлены и словами: серый день в
// системном календаре не объясняет, почему он недоступен.
const STYLES = `
:where([data-vibeui-block="calendar-005"]){
--vibeui-calendar-005-bg:transparent;
--vibeui-calendar-005-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-calendar-005-muted:color-mix(in oklab,var(--vibeui-calendar-005-fg) 68%,transparent);
--vibeui-calendar-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-calendar-005-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-calendar-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-calendar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-005"]{color-scheme:dark}
[data-vibeui-block="calendar-005"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:18rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-005-bg);
border:1px solid var(--vibeui-calendar-005-border);border-radius:0.875rem;
color:var(--vibeui-calendar-005-fg);font-family:var(--vibeui-calendar-005-font);
}
[data-vibeui-block="calendar-005"] label{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="calendar-005"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-calendar-005-border);border-radius:0.625rem;
background:var(--vibeui-calendar-005-field);color:inherit;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-005"] input:focus-visible{
outline:2px solid var(--vibeui-calendar-005-accent);outline-offset:1px;border-color:transparent;
}
/* Штатный значок календаря — единственное, что можно тронуть у input date:
   красим его в цвет текста, чтобы он не выглядел чужим. */
[data-vibeui-block="calendar-005"] input::-webkit-calendar-picker-indicator{
cursor:pointer;opacity:.55;
}
[data-vibeui-block="calendar-005"] input::-webkit-calendar-picker-indicator:hover{opacity:.85}
[data-vibeui-block="calendar-005"] [data-part="hint"]{font-size:0.875rem;line-height:1.4;color:var(--vibeui-calendar-005-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-005"] *{animation:none!important;transition:none!important}}
`

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
 * Поле даты на нативном input: календарь и формат берутся у системы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar005({
  label = "Дата поездки",
  defaultValue = "2026-03-17",
  min = "2026-03-01",
  max = "2026-12-31",
  hint = "Можно выбрать с 1 марта по 31 декабря 2026 года",
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar005Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-calendar-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-005"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="date"
          defaultValue={defaultValue}
          min={min}
          max={max}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        {hint ? (
          <p data-part="hint" id={`${id}-hint`}>
            {hint}
          </p>
        ) : null}
      </div>
    </>
  )
}
