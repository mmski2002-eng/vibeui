import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Nativeselect002Group = {
  label: string
  options: string[]
}

export type Nativeselect002Props = Omit<
  ComponentProps<"select">,
  "children" | "size"
> & {
  label?: string
  hint?: string
  groups?: Nativeselect002Group[]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длинный плоский список одинаково называющихся пунктов
// не читается — «Основной» есть и у складов, и у офисов. <optgroup> даёт
// системе заголовки разделов: она сама рисует их некликабельными и сама
// произносит название раздела перед пунктом. Своими силами такое в
// кастомном списке приходится городить ролями и разметкой.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// блока по умолчанию нет, а поле и границы получают свои пары светлот.
const STYLES = `
:where([data-vibeui-block="nativeselect-002"]){
--vibeui-nativeselect-002-bg:transparent;
--vibeui-nativeselect-002-line:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-nativeselect-002-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-nativeselect-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-nativeselect-002-muted:color-mix(in oklab,var(--vibeui-nativeselect-002-fg) 68%,transparent);
--vibeui-nativeselect-002-field-border:light-dark(oklch(0.85 0 265),oklch(0.42 0 265));
--vibeui-nativeselect-002-accent:light-dark(oklch(0.5 0.16 165),oklch(0.74 0.14 165));
--vibeui-nativeselect-002-radius:0.625rem;
--vibeui-nativeselect-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="nativeselect-002"]{color-scheme:dark}
[data-vibeui-block="nativeselect-002"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-002-bg);
border:1px solid var(--vibeui-nativeselect-002-line);
font-family:var(--vibeui-nativeselect-002-font);color:var(--vibeui-nativeselect-002-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="nativeselect-002"] label{
font-size:0.8125rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="nativeselect-002"] [data-part="field"]{position:relative;display:flex}
[data-vibeui-block="nativeselect-002"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:100%;height:2.25rem;
padding:0 2.25rem 0 0.75rem;
font:inherit;font-size:0.875rem;line-height:1.2;
color:var(--vibeui-nativeselect-002-fg);
background:var(--vibeui-nativeselect-002-field);
border:1px solid var(--vibeui-nativeselect-002-field-border);
border-radius:var(--vibeui-nativeselect-002-radius);
cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="nativeselect-002"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-002-accent) 22%,transparent);
}
/* Заголовки разделов рисует система, но начертание она берёт отсюда:
   это единственное, на что мы влияем внутри раскрытого списка. */
[data-vibeui-block="nativeselect-002"] optgroup{
font-weight:600;font-style:normal;color:var(--vibeui-nativeselect-002-muted);
}
[data-vibeui-block="nativeselect-002"] option{
font-weight:400;color:var(--vibeui-nativeselect-002-fg);
}
/* Chrome рисует свой индикатор поверх appearance:none — гасим, стрелка своя. */
[data-vibeui-block="nativeselect-002"] select::-webkit-calendar-picker-indicator{display:none}
[data-vibeui-block="nativeselect-002"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;pointer-events:none;
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-nativeselect-002-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-002-muted);
translate:0 -0.1875rem;rotate:45deg;
}
[data-vibeui-block="nativeselect-002"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-nativeselect-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-002"] *{animation:none!important;transition:none!important}}
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
 * Нативный select с разделами на <optgroup>: заголовки групп рисует и
 * произносит сама система. Один файл, ноль зависимостей.
 */
export function Nativeselect002({
  label = "Куда отгружаем",
  hint = "Внутри разделов адреса отсортированы по загрузке.",
  groups = [
    { label: "Склады", options: ["Основной, Химки", "Резервный, Домодедово"] },
    { label: "Офисы", options: ["Основной, Тверская", "Филиал, Казань"] },
    { label: "Партнёры", options: ["Пункт выдачи «Восток»", "Терминал СДЭК"] },
  ],
  background = "",
  accent,
  className,
  style,
  ...props
}: Nativeselect002Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-nativeselect-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-002" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="native-select"
        data-vibeui-block="nativeselect-002"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <select
            {...props}
            id={id}
            name="destination"
            aria-describedby={hintId}
          >
            {groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
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
