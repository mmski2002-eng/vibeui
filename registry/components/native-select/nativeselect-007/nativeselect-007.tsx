import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Nativeselect007Props = Omit<
  ComponentProps<"select">,
  "children" | "size"
> & {
  label?: string
  size?: "sm" | "md" | "lg"
  options?: string[]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: размер поля — это не три отдельных набора стилей.
// Все три ступени описаны одним набором правил, а data-size на корне
// переопределяет четыре переменные: высоту, кегль, отступ и величину
// стрелки. Добавить ступень — значит добавить четыре строки, а не копию
// компонента.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// блока по умолчанию нет, а поле и границы получают свои пары светлот.
const STYLES = `
:where([data-vibeui-block="nativeselect-007"]){
--vibeui-nativeselect-007-bg:transparent;
--vibeui-nativeselect-007-line:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-nativeselect-007-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-nativeselect-007-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-nativeselect-007-muted:color-mix(in oklab,var(--vibeui-nativeselect-007-fg) 68%,transparent);
--vibeui-nativeselect-007-field-border:light-dark(oklch(0.85 0 265),oklch(0.42 0 265));
--vibeui-nativeselect-007-accent:light-dark(oklch(0.58 0.16 39.8),oklch(0.76 0.14 39.8));
--vibeui-nativeselect-007-height:2.25rem;
--vibeui-nativeselect-007-text:0.875rem;
--vibeui-nativeselect-007-pad:0.75rem;
--vibeui-nativeselect-007-arrow:0.4375rem;
--vibeui-nativeselect-007-radius:0.625rem;
--vibeui-nativeselect-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="nativeselect-007"]{color-scheme:dark}
[data-vibeui-block="nativeselect-007"][data-size="sm"]{
--vibeui-nativeselect-007-height:2rem;
--vibeui-nativeselect-007-text:0.8125rem;
--vibeui-nativeselect-007-pad:0.5rem;
--vibeui-nativeselect-007-arrow:0.375rem;
--vibeui-nativeselect-007-radius:0.5rem;
}
[data-vibeui-block="nativeselect-007"][data-size="lg"]{
--vibeui-nativeselect-007-height:2.75rem;
--vibeui-nativeselect-007-text:1rem;
--vibeui-nativeselect-007-pad:1rem;
--vibeui-nativeselect-007-arrow:0.5rem;
--vibeui-nativeselect-007-radius:0.75rem;
}
[data-vibeui-block="nativeselect-007"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-007-bg);
border:1px solid var(--vibeui-nativeselect-007-line);
font-family:var(--vibeui-nativeselect-007-font);color:var(--vibeui-nativeselect-007-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="nativeselect-007"] label{
font-size:0.8125rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="nativeselect-007"] [data-part="field"]{position:relative;display:flex}
[data-vibeui-block="nativeselect-007"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:100%;
height:var(--vibeui-nativeselect-007-height);
padding:0 calc(var(--vibeui-nativeselect-007-pad) * 2 + var(--vibeui-nativeselect-007-arrow)) 0 var(--vibeui-nativeselect-007-pad);
font:inherit;font-size:var(--vibeui-nativeselect-007-text);line-height:1.2;
color:var(--vibeui-nativeselect-007-fg);
background:var(--vibeui-nativeselect-007-field);
border:1px solid var(--vibeui-nativeselect-007-field-border);
border-radius:var(--vibeui-nativeselect-007-radius);
cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="nativeselect-007"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-007-accent) 22%,transparent);
}
[data-vibeui-block="nativeselect-007"] option{color:var(--vibeui-nativeselect-007-fg)}
/* Chrome рисует свой индикатор поверх appearance:none — гасим, стрелка своя. */
[data-vibeui-block="nativeselect-007"] select::-webkit-calendar-picker-indicator{display:none}
/* Стрелка растёт вместе с полем: её сторона — та же переменная, что
   участвует в правом отступе, поэтому текст никогда не заезжает под неё. */
[data-vibeui-block="nativeselect-007"] [data-part="arrow"]{
position:absolute;right:var(--vibeui-nativeselect-007-pad);top:50%;pointer-events:none;
width:var(--vibeui-nativeselect-007-arrow);height:var(--vibeui-nativeselect-007-arrow);
border-right:1.5px solid var(--vibeui-nativeselect-007-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-007-muted);
translate:0 calc(var(--vibeui-nativeselect-007-arrow) / -2);rotate:45deg;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-007"] *{animation:none!important;transition:none!important}}
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
 * Нативный select с размерной шкалой sm / md / lg: три ступени описаны
 * одним набором правил и четырьмя переменными. Один файл, ноль
 * зависимостей.
 */
export function Nativeselect007({
  label = "Размер упаковки",
  size = "md",
  options = ["Конверт", "Коробка S", "Коробка M", "Паллета"],
  background = "",
  accent,
  className,
  style,
  ...props
}: Nativeselect007Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-nativeselect-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-007" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="native-select"
        data-vibeui-block="nativeselect-007"
        data-size={size}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <select {...props} id={id} name="package">
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </div>
      </div>
    </>
  )
}
