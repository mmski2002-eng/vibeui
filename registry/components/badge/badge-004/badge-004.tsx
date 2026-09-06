import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Badge004Props = Omit<ComponentProps<"span">, "children"> & {
  children?: ReactNode
  /** Что именно случилось: текст уходит скринридеру, точка — глазу. */
  label?: string
  show?: boolean
  tone?: "accent" | "danger" | "success"
  placement?: "top-right" | "top-left"
  /** Цвет подложки под элементом: им точка вырезает под собой кружок. */
  background?: string
}

// Идея компонента: точка-маркер поверх чужого элемента. Она обёртка, а не
// плашка: внутрь кладут кнопку или иконку, и маркер садится в угол. Обводка
// цветом подложки вырезает под точкой кружок — на любой иконке она остаётся
// отделённой. Смысл маркера идёт текстом: точка вслух не читается.
const STYLES = `
:where([data-vibeui-block="badge-004"]){
--vibeui-badge-004-dot:light-dark(oklch(0.58 0.2 39.8),oklch(0.68 0.2 39.8));
--vibeui-badge-004-cut:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-badge-004-size:0.5rem;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-004"]{color-scheme:dark}
[data-vibeui-block="badge-004"]{position:relative;display:inline-flex;vertical-align:middle}
[data-vibeui-block="badge-004"][data-tone="accent"]{--vibeui-badge-004-dot:light-dark(oklch(0.58 0.16 265),oklch(0.68 0.16 265))}
[data-vibeui-block="badge-004"][data-tone="success"]{--vibeui-badge-004-dot:light-dark(oklch(0.63 0.17 152),oklch(0.74 0.16 152))}
/* Обводка цветом подложки: точка остаётся отделённой на любой иконке. */
[data-vibeui-block="badge-004"] [data-part="dot"]{
position:absolute;
width:var(--vibeui-badge-004-size);height:var(--vibeui-badge-004-size);
border-radius:9999px;background:var(--vibeui-badge-004-dot);
box-shadow:0 0 0 2px var(--vibeui-badge-004-cut);
}
[data-vibeui-block="badge-004"][data-placement="top-right"] [data-part="dot"]{right:-0.125rem;top:-0.125rem}
[data-vibeui-block="badge-004"][data-placement="top-left"] [data-part="dot"]{left:-0.125rem;top:-0.125rem}
[data-vibeui-block="badge-004"] [data-part="text"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
/* Демонстрационная кнопка внутри обёртки: свою вы передаёте детьми. */
[data-vibeui-block="badge-004"] [data-part="sample"]{
display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;border-radius:0.625rem;
border:1px solid light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
background:light-dark(oklch(0.985 0 265),oklch(0.25 0 265));
}
[data-vibeui-block="badge-004"] [data-part="bell"]{
position:relative;width:0.875rem;height:0.75rem;
border:1.5px solid light-dark(oklch(0.42 0 265),oklch(0.84 0 265));border-radius:0.4375rem 0.4375rem 0.125rem 0.125rem;
border-bottom-width:0;
}
[data-vibeui-block="badge-004"] [data-part="bell"]::after{
content:"";position:absolute;left:-0.1875rem;right:-0.1875rem;bottom:-0.125rem;
height:1.5px;background:light-dark(oklch(0.42 0 265),oklch(0.84 0 265));border-radius:9999px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы
 * рисунку тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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
 * Точка-маркер поверх чужого элемента: обёртка, а не плашка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge004({
  children,
  label = "есть непрочитанные уведомления",
  show = true,
  tone = "danger",
  placement = "top-right",
  background = "",
  className,
  style,
  ...props
}: Badge004Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-004-cut": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-004" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-004"
        data-tone={tone}
        data-placement={placement}
        className={className}
        style={palette}
      >
        {children ?? (
          <span data-part="sample" aria-hidden="true">
            <span data-part="bell" />
          </span>
        )}
        {show ? (
          <>
            <span data-part="dot" aria-hidden="true" />
            <span data-part="text" role="status">
              {label}
            </span>
          </>
        ) : null}
      </span>
    </>
  )
}
