import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Iconstack004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  names?: string[]
  size?: "sm" | "md" | "lg"
  label?: string
}

// Идея компонента: вертикальная стопка для узкой колонки. Горизонтальная
// стопка в сайдбаре шириной 4rem либо обрезается, либо ломает раскладку, а
// вертикальная растёт вниз и занимает ту же ширину, что один кружок.
// Порядок наложения задан column-reverse: верхний кружок ложится поверх
// нижнего без z-index, а первое имя списка остаётся первым сверху.
const STYLES = `
:where([data-vibeui-block="iconstack-004"]){
--vibeui-iconstack-004-size:2.25rem;
--vibeui-iconstack-004-overlap:0.75rem;
--vibeui-iconstack-004-surface:oklch(1 0 0);
--vibeui-iconstack-004-border:oklch(0.9 0.006 265);
--vibeui-iconstack-004-fg:oklch(0.26 0.014 265);
--vibeui-iconstack-004-muted:oklch(0.55 0.014 265);
--vibeui-iconstack-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: подпись под стопкой тёмная. */
[data-vibeui-block="iconstack-004"]{
display:inline-flex;flex-direction:column;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.875rem 0.75rem;
background:var(--vibeui-iconstack-004-surface);
border:1px solid var(--vibeui-iconstack-004-border);border-radius:0.875rem;
font-family:var(--vibeui-iconstack-004-font);color:var(--vibeui-iconstack-004-fg);
}
/* column-reverse: верхний кружок ложится поверх нижнего без z-index. */
[data-vibeui-block="iconstack-004"] [data-part="stack"]{
display:inline-flex;flex-direction:column-reverse;justify-content:flex-end;
}
[data-vibeui-block="iconstack-004"] [data-part="stack"] > *{
margin-bottom:calc(var(--vibeui-iconstack-004-overlap) * -1);
}
[data-vibeui-block="iconstack-004"] [data-part="stack"] > *:first-child{margin-bottom:0}
[data-vibeui-block="iconstack-004"] [data-part="face"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box;
width:var(--vibeui-iconstack-004-size);height:var(--vibeui-iconstack-004-size);
border-radius:9999px;border:2px solid var(--vibeui-iconstack-004-surface);
background:oklch(0.9 0.06 var(--vibeui-iconstack-004-hue,265));
color:oklch(0.36 0.12 var(--vibeui-iconstack-004-hue,265));
font-size:calc(var(--vibeui-iconstack-004-size) * 0.34);
font-weight:700;line-height:1;
}
[data-vibeui-block="iconstack-004"] [data-part="label"]{
max-width:6rem;text-align:center;
font-size:0.75rem;line-height:1.3;color:var(--vibeui-iconstack-004-muted);
}
[data-vibeui-block="iconstack-004"] [data-part="count"]{
font-weight:700;color:var(--vibeui-iconstack-004-fg);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="iconstack-004"][data-size="sm"]{--vibeui-iconstack-004-size:1.75rem;--vibeui-iconstack-004-overlap:0.5625rem}
[data-vibeui-block="iconstack-004"][data-size="lg"]{--vibeui-iconstack-004-size:2.75rem;--vibeui-iconstack-004-overlap:0.9375rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="iconstack-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = ["Анна Реброва", "Илья Мохов", "Ким Сон", "Пётр Гай"]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Вертикальная стопка участников для узкой колонки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Iconstack004({
  names = DEFAULT_NAMES,
  size = "md",
  label = "на смене",
  className,
  style,
  ...props
}: Iconstack004Props) {
  return (
    <>
      <style href="vibeui-iconstack-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="iconstack-004"
        data-size={size}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="stack" aria-hidden="true">
          {[...names].reverse().map((name) => (
            <span
              key={name}
              data-part="face"
              style={
                { "--vibeui-iconstack-004-hue": hue(name) } as CSSProperties
              }
            >
              {initials(name)}
            </span>
          ))}
        </span>
        <span data-part="label">
          <span data-part="count">{names.length}</span> {label}
        </span>
      </div>
    </>
  )
}
