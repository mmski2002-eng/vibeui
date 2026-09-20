import type { ComponentProps, CSSProperties } from "react"

export type Iconstack004Props = Omit<ComponentProps<"div">, "children"> & {
  names?: string[]
  size?: "sm" | "md" | "lg"
  label?: string
  /** Пусто — подложки нет, стопка лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-iconstack-004-surface:transparent;
--vibeui-iconstack-004-ring:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-iconstack-004-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-iconstack-004-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-iconstack-004-muted:color-mix(in oklab,var(--vibeui-iconstack-004-fg) 68%,transparent);
--vibeui-iconstack-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="iconstack-004"]{color-scheme:dark}
/* Подложки по умолчанию нет: колонка лежит на фоне страницы. */
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
border-radius:9999px;border:2px solid var(--vibeui-iconstack-004-ring);
background:light-dark(oklch(0.9 0.06 var(--vibeui-iconstack-004-hue,265)),oklch(0.36 0.07 var(--vibeui-iconstack-004-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-iconstack-004-hue,265)),oklch(0.88 0.08 var(--vibeui-iconstack-004-hue,265)));
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
 * Вертикальная стопка участников для узкой колонки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Iconstack004({
  names = DEFAULT_NAMES,
  size = "md",
  label = "на смене",
  background = "",
  className,
  style,
  ...props
}: Iconstack004Props) {
  // Обводка кружка равна подложке: заданный фон красит и её, иначе стопка
  // останется в контуре прежнего фона.
  const palette = {
    ...(background
      ? {
          "--vibeui-iconstack-004-surface": background,
          "--vibeui-iconstack-004-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-iconstack-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="icon-stack"
        data-vibeui-block="iconstack-004"
        data-size={size}
        className={className}
        style={palette}
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
