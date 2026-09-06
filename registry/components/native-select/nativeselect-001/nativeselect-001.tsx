import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Nativeselect001Props = Omit<
  ComponentProps<"select">,
  "children" | "size"
> & {
  label?: string
  hint?: string
  options?: string[]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список остаётся системным, а нашего — только оболочка.
// appearance:none снимает штатную стрелку платформы, вместо неё рисуется
// своя из двух граней; сам выпадающий список рисует операционная система,
// поэтому на телефоне он открывается привычным колесом и не ломается
// при масштабировании страницы.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// блока по умолчанию нет, а поле и границы получают свои пары светлот.
const STYLES = `
:where([data-vibeui-block="nativeselect-001"]){
--vibeui-nativeselect-001-bg:transparent;
--vibeui-nativeselect-001-line:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-nativeselect-001-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-nativeselect-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-nativeselect-001-muted:color-mix(in oklab,var(--vibeui-nativeselect-001-fg) 68%,transparent);
--vibeui-nativeselect-001-field-border:light-dark(oklch(0.85 0 265),oklch(0.42 0 265));
--vibeui-nativeselect-001-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.17 39.8));
--vibeui-nativeselect-001-radius:0.625rem;
--vibeui-nativeselect-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="nativeselect-001"]{color-scheme:dark}
[data-vibeui-block="nativeselect-001"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-001-bg);
border:1px solid var(--vibeui-nativeselect-001-line);
font-family:var(--vibeui-nativeselect-001-font);color:var(--vibeui-nativeselect-001-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="nativeselect-001"] label{
font-size:0.8125rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="nativeselect-001"] [data-part="field"]{
position:relative;display:flex;
}
[data-vibeui-block="nativeselect-001"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:100%;height:2.25rem;
padding:0 2.25rem 0 0.75rem;
font:inherit;font-size:0.875rem;line-height:1.2;
color:var(--vibeui-nativeselect-001-fg);
background:var(--vibeui-nativeselect-001-field);
border:1px solid var(--vibeui-nativeselect-001-field-border);
border-radius:var(--vibeui-nativeselect-001-radius);
cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="nativeselect-001"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-001-accent) 22%,transparent);
}
/* Chrome рисует свой индикатор поверх appearance:none — гасим, стрелка своя. */
[data-vibeui-block="nativeselect-001"] select::-webkit-calendar-picker-indicator{display:none}
/* Стрелка — две грани квадрата, повёрнутые на 45°. Клики она не ловит:
   pointer-events:none оставляет всю площадь поля самому select. */
[data-vibeui-block="nativeselect-001"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;pointer-events:none;
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-nativeselect-001-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-001-muted);
translate:0 -0.1875rem;rotate:45deg;
transition:border-color .16s ease;
}
[data-vibeui-block="nativeselect-001"] [data-part="field"]:has(select:focus-visible) [data-part="arrow"]{
border-color:var(--vibeui-nativeselect-001-accent);
}
[data-vibeui-block="nativeselect-001"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-nativeselect-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Нативный select с подписью и собственной стрелкой: оболочка наша,
 * выпадающий список системный. Один файл, ноль зависимостей.
 */
export function Nativeselect001({
  label = "Часовой пояс",
  hint = "По нему считаются напоминания и отчёты.",
  options = [
    "Москва, UTC+3",
    "Екатеринбург, UTC+5",
    "Новосибирск, UTC+7",
    "Владивосток, UTC+10",
  ],
  background = "",
  accent,
  className,
  style,
  ...props
}: Nativeselect001Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-nativeselect-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="native-select"
        data-vibeui-block="nativeselect-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <select {...props} id={id} name="timezone" aria-describedby={hintId}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </div>
        <p data-part="hint" id={hintId}>
          {hint}
        </p>
      </div>
    </>
  )
}
