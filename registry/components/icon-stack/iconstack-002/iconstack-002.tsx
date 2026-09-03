import type { ComponentProps, CSSProperties } from "react"

export type Iconstack002Props = Omit<ComponentProps<"div">, "children"> & {
  items?: string[]
  caption?: string
  overlap?: number
  /** Пусто — подложки нет, стопка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: стопка технологий с подписью. В отличие от стопки людей
// здесь важен порядок чтения слева направо — первая технология главная,
// поэтому перекрытие сделано обратным флексом, и левая плитка лежит поверх
// правой без z-index на каждом элементе. Плитки скруглённые квадраты, а не
// круги: продуктовые логотипы почти всегда квадратные, круг их обрезает.
const STYLES = `
:where([data-vibeui-block="iconstack-002"]){
--vibeui-iconstack-002-size:2rem;
--vibeui-iconstack-002-overlap:10px;
--vibeui-iconstack-002-surface:transparent;
--vibeui-iconstack-002-ring:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-iconstack-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.01 265));
--vibeui-iconstack-002-fg:light-dark(oklch(0.26 0.014 265),oklch(0.94 0.005 265));
--vibeui-iconstack-002-muted:color-mix(in oklab,var(--vibeui-iconstack-002-fg) 68%,transparent);
--vibeui-iconstack-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="iconstack-002"]{color-scheme:dark}
/* Подложки по умолчанию нет: карточка лежит на фоне страницы. */
[data-vibeui-block="iconstack-002"]{
display:inline-flex;flex-direction:column;gap:0.5rem;
box-sizing:border-box;padding:0.75rem 0.875rem;
background:var(--vibeui-iconstack-002-surface);
border:1px solid var(--vibeui-iconstack-002-border);border-radius:0.875rem;
font-family:var(--vibeui-iconstack-002-font);color:var(--vibeui-iconstack-002-fg);
}
/* Обратный флекс: левая плитка ложится поверх правой без z-index. */
[data-vibeui-block="iconstack-002"] [data-part="stack"]{
display:inline-flex;flex-direction:row-reverse;justify-content:flex-end;
}
[data-vibeui-block="iconstack-002"] [data-part="stack"] > *{
margin-right:calc(var(--vibeui-iconstack-002-overlap) * -1);
}
[data-vibeui-block="iconstack-002"] [data-part="stack"] > *:first-child{margin-right:0}
[data-vibeui-block="iconstack-002"] [data-part="chip"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
box-sizing:border-box;
width:var(--vibeui-iconstack-002-size);height:var(--vibeui-iconstack-002-size);
border-radius:0.5rem;
border:2px solid var(--vibeui-iconstack-002-ring);
background:light-dark(oklch(0.92 0.06 var(--vibeui-iconstack-002-hue,265)),oklch(0.36 0.07 var(--vibeui-iconstack-002-hue,265)));
color:light-dark(oklch(0.36 0.13 var(--vibeui-iconstack-002-hue,265)),oklch(0.89 0.09 var(--vibeui-iconstack-002-hue,265)));
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="iconstack-002"] [data-part="caption"]{
font-size:0.75rem;color:var(--vibeui-iconstack-002-muted);
}
[data-vibeui-block="iconstack-002"] [data-part="names"]{
margin:0;font-size:0.8125rem;font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="iconstack-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = ["React", "Next.js", "TypeScript", "Tailwind"]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function monogram(name: string) {
  const letters = name.replace(/[^\p{L}\p{N}]/gu, "")
  return letters.slice(0, 2).toUpperCase()
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
 * Стопка технологий: перекрытые плитки и подпись со списком названий.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Iconstack002({
  items = DEFAULT_ITEMS,
  caption = "Стек проекта",
  overlap = 10,
  background = "",
  className,
  style,
  ...props
}: Iconstack002Props) {
  // Обводка плитки равна подложке: заданный фон красит и её, иначе между
  // плитками останется контур прежнего фона.
  const palette = {
    "--vibeui-iconstack-002-overlap": `${overlap}px`,
    ...(background
      ? {
          "--vibeui-iconstack-002-surface": background,
          "--vibeui-iconstack-002-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-iconstack-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="icon-stack"
        data-vibeui-block="iconstack-002"
        className={className}
        style={palette}
      >
        <span data-part="stack" aria-hidden="true">
          {[...items].reverse().map((item) => (
            <span
              key={item}
              data-part="chip"
              style={
                { "--vibeui-iconstack-002-hue": hue(item) } as CSSProperties
              }
            >
              {monogram(item)}
            </span>
          ))}
        </span>
        <p data-part="names">{items.join(" · ")}</p>
        <span data-part="caption">{caption}</span>
      </div>
    </>
  )
}
