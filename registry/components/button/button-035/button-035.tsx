import type { ComponentProps, CSSProperties, MouseEventHandler } from "react"

export type Button035Props = Omit<
  ComponentProps<"p">,
  "children" | "onClick"
> & {
  children?: string
  /** Текст до кнопки: она рассчитана стоять внутри фразы. */
  before?: string
  after?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  /** Пусто — подложки нет, абзац лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: действие внутри фразы. У кнопки нет ни рамки, ни фона,
// ни своего кегля — font:inherit и baseline-выравнивание берут типографику
// у абзаца, поэтому строка не разъезжается. Подчёркивание нарисовано
// фоновой линейкой, а не text-decoration: его толщину и отступ видно на глаз.
const STYLES = `
:where([data-vibeui-block="button-035"]){
--vibeui-button-035-surface:transparent;
--vibeui-button-035-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-button-035-fg:light-dark(oklch(0.42 0 265),oklch(0.78 0 265));
--vibeui-button-035-accent:light-dark(oklch(0.53 0.19 285),oklch(0.76 0.15 285));
--vibeui-button-035-shade:light-dark(black,white);
--vibeui-button-035-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-035"]{color-scheme:dark}
[data-vibeui-block="button-035"]{
box-sizing:border-box;width:100%;max-width:24rem;margin:0;
padding:0.875rem 1rem;border:1px solid var(--vibeui-button-035-border);
border-radius:0.75rem;background:var(--vibeui-button-035-surface);
font-family:var(--vibeui-button-035-font);font-size:0.9375rem;line-height:1.6;
color:var(--vibeui-button-035-fg);
}
[data-vibeui-block="button-035"] [data-part="button"]{
appearance:none;border:0;background:transparent;padding:0;margin:0;cursor:pointer;
font:inherit;color:var(--vibeui-button-035-accent);font-weight:600;
/* Пунктир как фоновая линейка: толщина и отступ задаются точно. */
background-image:linear-gradient(to right,currentColor 55%,transparent 55%);
background-size:5px 1px;background-repeat:repeat-x;background-position:0 1.15em;
transition:background-size .16s ease,color .16s ease;
}
[data-vibeui-block="button-035"] [data-part="button"]:hover:not(:disabled),
[data-vibeui-block="button-035"] [data-part="button"]:focus-visible{
background-size:5px 2px;
color:color-mix(in oklab,var(--vibeui-button-035-accent) 80%,var(--vibeui-button-035-shade));
}
[data-vibeui-block="button-035"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-button-035-accent);outline-offset:2px;border-radius:2px;
}
[data-vibeui-block="button-035"] [data-part="button"]:disabled{cursor:not-allowed;opacity:.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-035"] *{animation:none!important;transition:none!important}}
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
 * Кнопка-ссылка без рамки: наследует кегль и цвет строки, в которой стоит.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button035({
  children = "изменить способ оплаты",
  before = "Списание произойдёт 30 числа. Можно ",
  after = " в любой момент.",
  onClick,
  background = "",
  accent,
  className,
  style,
  ...props
}: Button035Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-035-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-035-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-035" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-slot="button"
        data-vibeui-block="button-035"
        className={className}
        style={palette}
      >
        {before}
        <button type="button" data-part="button" onClick={onClick}>
          {children}
        </button>
        {after}
      </p>
    </>
  )
}
