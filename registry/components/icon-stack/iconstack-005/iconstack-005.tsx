import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Iconstack005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  names?: string[]
  ring?: string
  label?: string
}

// Идея компонента: обводка кружка — это не «белая рамка», а цвет подложки под
// стопкой. Как только стопку кладут на тёмную панель, белая обводка
// превращается в лишний контур, поэтому цвет обводки вынесен в переменную и
// задаётся полосой, а не самим кружком. Компонент показывает обе полосы
// сразу — светлую и тёмную, — чтобы разница была видна без переключения темы.
const STYLES = `
:where([data-vibeui-block="iconstack-005"]){
--vibeui-iconstack-005-size:2rem;
--vibeui-iconstack-005-overlap:0.625rem;
--vibeui-iconstack-005-ring:oklch(1 0 0);
--vibeui-iconstack-005-surface:oklch(1 0 0);
--vibeui-iconstack-005-dark:oklch(0.26 0.02 265);
--vibeui-iconstack-005-border:oklch(0.9 0.006 265);
--vibeui-iconstack-005-fg:oklch(0.26 0.014 265);
--vibeui-iconstack-005-muted:oklch(0.55 0.014 265);
--vibeui-iconstack-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="iconstack-005"]{
display:inline-flex;flex-direction:column;gap:0.5rem;
box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-iconstack-005-surface);
border:1px solid var(--vibeui-iconstack-005-border);border-radius:1rem;
font-family:var(--vibeui-iconstack-005-font);color:var(--vibeui-iconstack-005-fg);
}
[data-vibeui-block="iconstack-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.625rem 0.875rem;border-radius:0.75rem;
}
/* Обводка берётся у полосы, а не у кружка: цвет подложки задаёт её сама. */
[data-vibeui-block="iconstack-005"] [data-part="row"][data-tone="light"]{
background:var(--vibeui-iconstack-005-ring);
border:1px solid var(--vibeui-iconstack-005-border);
}
[data-vibeui-block="iconstack-005"] [data-part="row"][data-tone="dark"]{
background:var(--vibeui-iconstack-005-dark);
--vibeui-iconstack-005-ring:var(--vibeui-iconstack-005-dark);
color:oklch(0.96 0.004 265);
}
[data-vibeui-block="iconstack-005"] [data-part="stack"]{
display:inline-flex;flex-direction:row-reverse;justify-content:flex-end;flex:none;
}
[data-vibeui-block="iconstack-005"] [data-part="stack"] > *{
margin-right:calc(var(--vibeui-iconstack-005-overlap) * -1);
}
[data-vibeui-block="iconstack-005"] [data-part="stack"] > *:first-child{margin-right:0}
[data-vibeui-block="iconstack-005"] [data-part="face"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box;
width:var(--vibeui-iconstack-005-size);height:var(--vibeui-iconstack-005-size);
border-radius:9999px;
border:2px solid var(--vibeui-iconstack-005-ring);
background:oklch(0.88 0.08 var(--vibeui-iconstack-005-hue,265));
color:oklch(0.34 0.13 var(--vibeui-iconstack-005-hue,265));
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="iconstack-005"] [data-part="caption"]{
font-size:0.75rem;line-height:1.3;
}
[data-vibeui-block="iconstack-005"] [data-part="row"][data-tone="light"] [data-part="caption"]{
color:var(--vibeui-iconstack-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="iconstack-005"] *{animation:none!important;transition:none!important}}
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
 * Стопка с обводкой под цвет подложки: светлая и тёмная полосы рядом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Iconstack005({
  names = DEFAULT_NAMES,
  ring = "#ffffff",
  label = "обводка равна цвету подложки",
  className,
  style,
  ...props
}: Iconstack005Props) {
  const faces = [...names].reverse().map((name) => (
    <span
      key={name}
      data-part="face"
      style={{ "--vibeui-iconstack-005-hue": hue(name) } as CSSProperties}
    >
      {initials(name)}
    </span>
  ))

  return (
    <>
      <style href="vibeui-iconstack-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="iconstack-005"
        className={className}
        style={style as CSSProperties}
      >
        <div
          data-part="row"
          data-tone="light"
          style={{ "--vibeui-iconstack-005-ring": ring } as CSSProperties}
        >
          <span data-part="stack" aria-hidden="true">
            {faces}
          </span>
          <span data-part="caption">На светлой панели</span>
        </div>
        <div data-part="row" data-tone="dark">
          <span data-part="stack" aria-hidden="true">
            {faces}
          </span>
          <span data-part="caption">{label}</span>
        </div>
      </div>
    </>
  )
}
