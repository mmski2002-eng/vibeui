import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card008Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "title"
> & {
  title?: string
  hint?: string
  accent?: string
}

// Идея компонента: пустая карточка «добавить» в сетке. Она пунктирная и
// прозрачная, потому что не содержит данных: сплошная карточка в ряду с
// настоящими читается как ещё один элемент. Это кнопка, а не div с onClick —
// клавиатура и объявление роли достаются даром.
const STYLES = `
:where([data-vibeui-block="card-008"]){
--vibeui-card-008-fg:oklch(0.42 0.014 265);
--vibeui-card-008-muted:oklch(0.58 0.014 265);
--vibeui-card-008-border:oklch(0.86 0.008 265);
--vibeui-card-008-hover:oklch(0.97 0.003 265);
--vibeui-card-008-accent:oklch(0.55 0.17 265);
--vibeui-card-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-008"]{
appearance:none;cursor:pointer;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.375rem;
width:100%;max-width:15rem;min-height:9.5rem;box-sizing:border-box;padding:1rem;
/* Пунктир и прозрачный фон: карточка не содержит данных и не должна
   выглядеть как настоящая. */
border:1.5px dashed var(--vibeui-card-008-border);border-radius:0.875rem;
background:transparent;color:var(--vibeui-card-008-fg);
font-family:var(--vibeui-card-008-font);text-align:center;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="card-008"]:hover{background:var(--vibeui-card-008-hover);border-color:var(--vibeui-card-008-accent)}
[data-vibeui-block="card-008"]:focus-visible{outline:2px solid var(--vibeui-card-008-accent);outline-offset:2px}
[data-vibeui-block="card-008"] [data-part="plus"]{
position:relative;width:2rem;height:2rem;border-radius:9999px;
border:1.5px solid var(--vibeui-card-008-border);
}
[data-vibeui-block="card-008"] [data-part="plus"]::before,
[data-vibeui-block="card-008"] [data-part="plus"]::after{
content:"";position:absolute;left:50%;top:50%;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="card-008"] [data-part="plus"]::before{width:0.875rem;height:1.5px;margin:-0.75px 0 0 -0.4375rem}
[data-vibeui-block="card-008"] [data-part="plus"]::after{width:1.5px;height:0.875rem;margin:-0.4375rem 0 0 -0.75px}
[data-vibeui-block="card-008"]:hover [data-part="plus"]{border-color:var(--vibeui-card-008-accent)}
[data-vibeui-block="card-008"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="card-008"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-card-008-muted);max-width:11rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Пустая карточка «добавить»: пунктир, плюс и подпись, что появится.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card008({
  title = "Добавить проект",
  hint = "Пустой проект с одной страницей и вашей темой",
  accent,
  type = "button",
  className,
  style,
  ...props
}: Card008Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-008" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="card-008"
        className={className}
        style={palette}
      >
        <span data-part="plus" aria-hidden="true" />
        <span data-part="title">{title}</span>
        {hint ? <span data-part="hint">{hint}</span> : null}
      </button>
    </>
  )
}
