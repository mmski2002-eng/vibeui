import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  MouseEventHandler,
} from "react"

export type Button035Props = Omit<
  ComponentPropsWithoutRef<"p">,
  "children" | "onClick"
> & {
  children?: string
  /** Текст до кнопки: она рассчитана стоять внутри фразы. */
  before?: string
  after?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  accent?: string
}

// Идея компонента: действие внутри фразы. У кнопки нет ни рамки, ни фона,
// ни своего кегля — font:inherit и baseline-выравнивание берут типографику
// у абзаца, поэтому строка не разъезжается. Подчёркивание нарисовано
// фоновой линейкой, а не text-decoration: его толщину и отступ видно на глаз.
const STYLES = `
:where([data-vibeui-block="button-035"]){
--vibeui-button-035-surface:oklch(1 0 0);
--vibeui-button-035-border:oklch(0.91 0.005 265);
--vibeui-button-035-fg:oklch(0.42 0.012 265);
--vibeui-button-035-accent:oklch(0.53 0.19 285);
--vibeui-button-035-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
color:color-mix(in oklab,var(--vibeui-button-035-accent) 80%,black);
}
[data-vibeui-block="button-035"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-button-035-accent);outline-offset:2px;border-radius:2px;
}
[data-vibeui-block="button-035"] [data-part="button"]:disabled{cursor:not-allowed;opacity:.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-035"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка-ссылка без рамки: наследует кегль и цвет строки, в которой стоит.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button035({
  children = "изменить способ оплаты",
  before = "Списание произойдёт 30 числа. Можно ",
  after = " в любой момент.",
  onClick,
  accent,
  className,
  style,
  ...props
}: Button035Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-035-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-035" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
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
