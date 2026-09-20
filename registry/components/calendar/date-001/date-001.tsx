import type { ComponentProps, CSSProperties } from "react"

export type Date001Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  hint?: string
  defaultValue?: string
  min?: string
  max?: string
  name?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поле даты на нативном input[type=date]. Свой календарь
// пришлось бы учить локалям, часовым поясам и клавиатуре, а нативный уже знает
// их и на телефоне открывает системный выбор. Значение всегда в формате
// ГГГГ-ММ-ДД, а показывается по настройкам системы — подпись поясняет границы,
// а не формат, потому что формат пользователь не набирает вручную.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="date-001"]){
--vibeui-date-001-surface:transparent;
--vibeui-date-001-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-date-001-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-date-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-date-001-muted:color-mix(in oklab,var(--vibeui-date-001-fg) 68%,transparent);
--vibeui-date-001-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-date-001-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-date-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-001"]{color-scheme:dark}
/* Подложки по умолчанию нет: рамка держит форму, фон приходит со страницы. */
[data-vibeui-block="date-001"]{
display:flex;flex-direction:column;gap:0.375rem;
padding:0.875rem;
background:var(--vibeui-date-001-surface);
border:1px solid var(--vibeui-date-001-shell);border-radius:0.875rem;
width:100%;max-width:18rem;box-sizing:border-box;
font-family:var(--vibeui-date-001-font);color:var(--vibeui-date-001-fg);
}
[data-vibeui-block="date-001"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="date-001"] input{
width:100%;box-sizing:border-box;height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-date-001-field);color:inherit;
border:1px solid var(--vibeui-date-001-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="date-001"] input:focus-visible{outline:2px solid var(--vibeui-date-001-accent);outline-offset:1px;border-color:var(--vibeui-date-001-accent)}
/* Иконка календаря — часть контрола: перекрашиваем, а не прячем. */
[data-vibeui-block="date-001"] input::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.55}
[data-vibeui-block="date-001"] input::-webkit-calendar-picker-indicator:hover{opacity:1}
[data-vibeui-block="date-001"] [data-part="hint"]{margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-001"] *{animation:none!important;transition:none!important}}
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
 * Поле даты на нативном input[type=date]: календарь, локаль и клавиатура даром.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date001({
  label = "Дата поездки",
  hint = "Доступны даты до конца сентября.",
  defaultValue = "2026-09-12",
  min = "2026-08-31",
  max = "2026-09-30",
  name = "trip-date",
  background = "",
  accent,
  className,
  style,
  ...props
}: Date001Props) {
  const palette = {
    ...(accent ? { "--vibeui-date-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-001"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-input`}>{label}</label>
        <input
          id={`${name}-input`}
          name={name}
          type="date"
          defaultValue={defaultValue}
          min={min}
          max={max}
          aria-describedby={hint ? `${name}-hint` : undefined}
        />
        {hint ? (
          <p id={`${name}-hint`} data-part="hint">
            {hint}
          </p>
        ) : null}
      </div>
    </>
  )
}
