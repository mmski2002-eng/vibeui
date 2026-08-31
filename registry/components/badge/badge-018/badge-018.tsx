import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge018Position =
  "top-right" | "top-left" | "bottom-right" | "bottom-left"

export type Badge018Props = ComponentPropsWithoutRef<"span"> & {
  content?: string
  position?: Badge018Position
  label?: string
}

// Идея компонента: слот, который вешает плашку на чужой элемент. Обёртка
// сжимается по содержимому и не добавляет отступов, плашка абсолютная и
// вылетает наружу ровно на долю своей высоты, а pointer-events:none снимает
// с неё перехват нажатия: под слотом обычно кнопка, и клик обязан доходить
// до неё, а не до счётчика.
const STYLES = `
:where([data-vibeui-block="badge-018"]){
--vibeui-badge-018-offset:38%;
--vibeui-badge-018-size:1.125rem;
--vibeui-badge-018-bg:oklch(0.57 0.2 25);
--vibeui-badge-018-fg:oklch(0.99 0.01 25);
--vibeui-badge-018-ring:oklch(1 0 0);
--vibeui-badge-018-host-bg:oklch(0.93 0.008 265);
--vibeui-badge-018-host-fg:oklch(0.34 0.016 265);
--vibeui-badge-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-018"]{
position:relative;display:inline-flex;
font-family:var(--vibeui-badge-018-font);vertical-align:middle;
}
[data-vibeui-block="badge-018"] [data-part="badge"]{
position:absolute;z-index:1;
display:inline-flex;align-items:center;justify-content:center;
box-sizing:border-box;
min-width:var(--vibeui-badge-018-size);height:var(--vibeui-badge-018-size);
padding:0 0.3125rem;border-radius:9999px;
background:var(--vibeui-badge-018-bg);color:var(--vibeui-badge-018-fg);
font-size:0.625rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
/* Кольцо цвета подложки отделяет плашку от хоста без выреза в хосте. */
box-shadow:0 0 0 2px var(--vibeui-badge-018-ring);
/* Плашка декоративная: нажатие обязано доходить до элемента под ней. */
pointer-events:none;
}
[data-vibeui-block="badge-018"][data-position="top-right"] [data-part="badge"]{top:0;right:0;transform:translate(var(--vibeui-badge-018-offset),calc(var(--vibeui-badge-018-offset) * -1))}
[data-vibeui-block="badge-018"][data-position="top-left"] [data-part="badge"]{top:0;left:0;transform:translate(calc(var(--vibeui-badge-018-offset) * -1),calc(var(--vibeui-badge-018-offset) * -1))}
[data-vibeui-block="badge-018"][data-position="bottom-right"] [data-part="badge"]{bottom:0;right:0;transform:translate(var(--vibeui-badge-018-offset),var(--vibeui-badge-018-offset))}
[data-vibeui-block="badge-018"][data-position="bottom-left"] [data-part="badge"]{bottom:0;left:0;transform:translate(calc(var(--vibeui-badge-018-offset) * -1),var(--vibeui-badge-018-offset))}
[data-vibeui-block="badge-018"] [data-part="host"]{
display:inline-flex;align-items:center;justify-content:center;
width:2.75rem;height:2.75rem;border-radius:0.875rem;
background:var(--vibeui-badge-018-host-bg);color:var(--vibeui-badge-018-host-fg);
font-size:0.9375rem;font-weight:700;line-height:1;letter-spacing:0.02em;
}
[data-vibeui-block="badge-018"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-018"] *{animation:none!important;transition:none!important}}
`

/**
 * Слот: сажает плашку в угол чужого элемента, не ломая раскладку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge018({
  content = "3",
  position = "top-right",
  label = "новых уведомления",
  className,
  style,
  children,
  ...props
}: Badge018Props) {
  return (
    <>
      <style href="vibeui-badge-018" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-018"
        data-position={position}
        className={className}
        style={style as CSSProperties}
      >
        {children ?? <span data-part="host">ЕК</span>}
        <span data-part="badge" aria-hidden="true">
          {content}
        </span>
        <span data-part="sr">
          {content} {label}
        </span>
      </span>
    </>
  )
}
