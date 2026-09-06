import type { CSSProperties } from "react"

export type Codeblock006Props = {
  path?: string
  visibleCount?: number
  lines?: string[]
  /** Подпись раскрытия: {count} — сколько строк осталось в хвосте. */
  moreText?: string
  /** Подпись сворачивания. */
  lessText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: длинный файл, свёрнутый до первых строк. Хвост лежит
// внутри <details>, а «обрыв» показан маской на видимой части — она гаснет,
// как только details открыт, поэтому состояние читается без иконок.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, шапка и наведение на summary держатся полупрозрачными накладками.
const STYLES = `
:where([data-vibeui-block="codeblock-006"]){
--vibeui-codeblock-006-bg:transparent;
--vibeui-codeblock-006-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-006-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 6%));
--vibeui-codeblock-006-fg:light-dark(oklch(0.27 0 300),oklch(0.93 0 300));
--vibeui-codeblock-006-muted:color-mix(in oklab,var(--vibeui-codeblock-006-fg) 68%,transparent);
--vibeui-codeblock-006-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-006-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.8 0.13 39.8));
--vibeui-codeblock-006-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-006"]{color-scheme:dark}
[data-vibeui-block="codeblock-006"]{
display:block;width:100%;box-sizing:border-box;margin:0;
overflow:hidden;border:1px solid var(--vibeui-codeblock-006-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-006-bg);color:var(--vibeui-codeblock-006-fg);
font-family:var(--vibeui-codeblock-006-font);
}
[data-vibeui-block="codeblock-006"] [data-part="head"]{
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-006-head);
border-bottom:1px solid var(--vibeui-codeblock-006-border);
font-family:var(--vibeui-codeblock-006-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-006-muted);
}
[data-vibeui-block="codeblock-006"] pre{margin:0;padding:0.75rem 0.875rem;overflow-x:auto}
[data-vibeui-block="codeblock-006"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-006-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-006"] [data-part="tail"] pre{padding-top:0}
/* Пока хвост свёрнут, видимая часть гаснет книзу — «здесь ещё есть код». */
[data-vibeui-block="codeblock-006"]:has(details:not([open])) [data-part="peek"]{
mask-image:linear-gradient(to bottom,#000 45%,oklch(0 0 0 / 25%) 100%);
}
[data-vibeui-block="codeblock-006"] summary{
cursor:pointer;list-style:none;
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.875rem;
border-top:1px solid var(--vibeui-codeblock-006-border);
font-size:0.75rem;font-weight:650;color:var(--vibeui-codeblock-006-accent);
transition:background-color .16s ease;
}
[data-vibeui-block="codeblock-006"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="codeblock-006"] summary:hover{background:var(--vibeui-codeblock-006-hover)}
[data-vibeui-block="codeblock-006"] summary:focus-visible{outline:2px solid var(--vibeui-codeblock-006-accent);outline-offset:-2px}
[data-vibeui-block="codeblock-006"] summary::after{content:"▾";transition:transform .18s ease}
[data-vibeui-block="codeblock-006"] details[open] summary::after{transform:rotate(180deg)}
[data-vibeui-block="codeblock-006"] details[open] [data-part="more"]{display:none}
[data-vibeui-block="codeblock-006"] details:not([open]) [data-part="less"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-006"] *{animation:none!important;transition:none!important}}
`

const LINES = [
  "export async function loadUser(id: string) {",
  "  const response = await fetch(`/api/users/${id}`)",
  "",
  "  if (!response.ok) {",
  "    throw new Error(`Пользователь ${id} не найден`)",
  "  }",
  "",
  "  const user = await response.json()",
  "  return { ...user, loadedAt: Date.now() }",
  "}",
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

/** Длинный код, свёрнутый до первых строк, с раскрытием через details. */
export function Codeblock006({
  path = "lib/load-user.ts",
  visibleCount = 4,
  lines = LINES,
  moreText = "Показать ещё {count} строк",
  lessText = "Свернуть",
  background = "",
  className,
  style,
  ...props
}: Codeblock006Props) {
  const head = lines.slice(0, visibleCount)
  const tail = lines.slice(visibleCount)
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-006" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-006"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">{path}</figcaption>
        <pre data-part="peek">
          <code>{head.join("\n")}</code>
        </pre>
        {tail.length > 0 ? (
          <details>
            <summary>
              <span data-part="more">
                {moreText.replace("{count}", String(tail.length))}
              </span>
              <span data-part="less">{lessText}</span>
            </summary>
            <div data-part="tail">
              <pre>
                <code>{tail.join("\n")}</code>
              </pre>
            </div>
          </details>
        ) : null}
      </figure>
    </>
  )
}
