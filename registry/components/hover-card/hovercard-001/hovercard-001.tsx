import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Hovercard001Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  name?: string
  handle?: string
  about?: string
  stats?: { label: string; value: string }[]
  accent?: string
  /** Подложка всплывающей карточки. Пусто — цвет по теме окружения. */
  background?: string
}

// Идея компонента: карточка человека рядом с упоминанием. Она раскрывается по
// наведению и по фокусу — иначе с клавиатуры её не увидеть вовсе. Карточка
// только показывает: ни ссылок, ни кнопок внутри, потому что довести до них
// курсор через зазор невозможно без задержек и ловли мыши.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// тёмной темы у компонента нет, он следует за страницей.
const STYLES = `
:where([data-vibeui-block="hovercard-001"]){
--vibeui-hovercard-001-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-hovercard-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-hovercard-001-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-hovercard-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-hovercard-001-hue:250;
--vibeui-hovercard-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.76 0.14 265));
--vibeui-hovercard-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="hovercard-001"]{
position:relative;display:inline-block;
font-family:var(--vibeui-hovercard-001-font);color:var(--vibeui-hovercard-001-fg);
}
[data-vibeui-block="hovercard-001"] [data-part="mention"]{
color:var(--vibeui-hovercard-001-accent);font-weight:650;text-decoration:none;
border-radius:0.25rem;
}
[data-vibeui-block="hovercard-001"] [data-part="mention"]:focus-visible{outline:2px solid var(--vibeui-hovercard-001-accent);outline-offset:2px}
/* Раскрытие и по фокусу: с клавиатуры карточку иначе не увидеть. */
[data-vibeui-block="hovercard-001"] [data-part="card"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:20;
display:flex;flex-direction:column;gap:0.5rem;
width:15rem;box-sizing:border-box;padding:0.75rem;
border:1px solid var(--vibeui-hovercard-001-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-001-bg);
box-shadow:0 20px 44px -26px oklch(0.2 0.02 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .14s ease,translate .14s ease,visibility .14s;
}
[data-vibeui-block="hovercard-001"]:hover [data-part="card"],
[data-vibeui-block="hovercard-001"]:focus-within [data-part="card"]{
opacity:1;visibility:visible;translate:0 0;
}
[data-vibeui-block="hovercard-001"] [data-part="head"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="hovercard-001"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:oklch(0.92 0.05 var(--vibeui-hovercard-001-hue));
color:oklch(0.38 0.09 var(--vibeui-hovercard-001-hue));
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="hovercard-001"] [data-part="name"]{font-size:0.875rem;font-weight:650;line-height:1.2}
[data-vibeui-block="hovercard-001"] [data-part="handle"]{font-size:0.75rem;color:var(--vibeui-hovercard-001-muted)}
[data-vibeui-block="hovercard-001"] [data-part="about"]{margin:0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-hovercard-001-muted)}
[data-vibeui-block="hovercard-001"] [data-part="stats"]{display:flex;gap:0.75rem;font-size:0.75rem;color:var(--vibeui-hovercard-001-muted)}
[data-vibeui-block="hovercard-001"] [data-part="stats"] b{color:var(--vibeui-hovercard-001-fg);font-weight:650;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS = [
  { label: "компонентов", value: "24" },
  { label: "в команде", value: "3 года" },
]

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
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

/**
 * Карточка человека у упоминания: раскрывается по наведению и по фокусу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard001({
  name = "Мария Гурова",
  handle = "@masha",
  about = "Ведёт каталог и дизайн-систему, собирает интерфейсы без лишних слов.",
  stats = DEFAULT_STATS,
  accent,
  background = "",
  className,
  style,
  ...props
}: Hovercard001Props) {
  const id = useId()
  const palette = {
    "--vibeui-hovercard-001-hue": hue(name),
    ...(accent ? { "--vibeui-hovercard-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hovercard-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="hovercard-001"
        className={className}
        style={palette}
      >
        <a data-part="mention" href="#" aria-describedby={`${id}-card`}>
          {handle}
        </a>
        <span data-part="card" id={`${id}-card`} role="tooltip">
          <span data-part="head">
            <span data-part="face" aria-hidden="true">
              {initials(name)}
            </span>
            <span>
              <span data-part="name">{name}</span>
              <br />
              <span data-part="handle">{handle}</span>
            </span>
          </span>
          <span data-part="about">{about}</span>
          <span data-part="stats">
            {stats.map((stat) => (
              <span key={stat.label}>
                <b>{stat.value}</b> {stat.label}
              </span>
            ))}
          </span>
        </span>
      </span>
    </>
  )
}
