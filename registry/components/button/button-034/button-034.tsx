import type { ComponentProps, CSSProperties } from "react"

export type Button034Props = ComponentProps<"button"> & {
  /** Толщина обводки: волосяная, обычная или тяжёлая. */
  emphasis?: "hairline" | "regular" | "heavy"
  /** Бумага внутри обводки. Пусто — своя, из палитры. */
  background?: string
  accent?: string
}

// Идея компонента: весь вес кнопки держит обводка, а не заливка. Внутри
// бумажный фон, поэтому кнопка читается на любой подложке; на наведении
// заливка и рамка меняются местами — контур становится пятном.
const STYLES = `
:where([data-vibeui-block="button-034"]){
--vibeui-button-034-paper:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-button-034-accent:light-dark(oklch(0.52 0.14 196),oklch(0.74 0.12 196));
--vibeui-button-034-accent-fg:light-dark(oklch(0.99 0.01 196),oklch(0.19 0.03 196));
--vibeui-button-034-line:1.5px;
--vibeui-button-034-radius:0.5rem;
--vibeui-button-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-034"]{color-scheme:dark}
[data-vibeui-block="button-034"]{
appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 1rem;border-radius:var(--vibeui-button-034-radius);
border:var(--vibeui-button-034-line) solid var(--vibeui-button-034-accent);
background:var(--vibeui-button-034-paper);color:var(--vibeui-button-034-accent);
font-family:var(--vibeui-button-034-font);font-size:0.875rem;font-weight:600;line-height:1;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-034"][data-emphasis="hairline"]{--vibeui-button-034-line:1px;font-weight:550}
[data-vibeui-block="button-034"][data-emphasis="heavy"]{--vibeui-button-034-line:2.5px;font-weight:700;letter-spacing:0.01em}
[data-vibeui-block="button-034"]:hover:not(:disabled){
background:var(--vibeui-button-034-accent);color:var(--vibeui-button-034-accent-fg);
}
[data-vibeui-block="button-034"]:active:not(:disabled){
background:color-mix(in oklab,var(--vibeui-button-034-accent) 85%,black);
border-color:color-mix(in oklab,var(--vibeui-button-034-accent) 85%,black);
}
/* Обводка фокуса вынесена наружу с отступом: иначе она сливается с рамкой. */
[data-vibeui-block="button-034"]:focus-visible{
outline:2px solid var(--vibeui-button-034-accent);outline-offset:3px;
}
[data-vibeui-block="button-034"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="button-034"] [data-part="mark"]{
flex:none;width:0.6875rem;height:0.6875rem;box-sizing:border-box;
border:var(--vibeui-button-034-line) solid currentColor;border-radius:50%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-034"]{transition:none!important}}
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
 * Кнопка на обводке: бумажная внутри, контурная снаружи, на наведении
 * заливается акцентом. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button034({
  emphasis = "regular",
  background = "",
  accent,
  type = "button",
  className,
  style,
  children = "Подробнее о тарифах",
  ...props
}: Button034Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-034-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-034-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-034" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-034"
        data-emphasis={emphasis}
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        {children}
      </button>
    </>
  )
}
