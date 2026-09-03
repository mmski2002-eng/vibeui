import type { CSSProperties } from "react"

export type Codeblock015Token = {
  text: string
  kind?: "keyword" | "string" | "comment" | "number" | "type"
}

export type Codeblock015File = {
  name: string
  lines: Codeblock015Token[][]
}

export type Codeblock015Props = {
  root?: string
  activeIndex?: number
  files?: Codeblock015File[]
  group?: string
  /** Подпись списка вкладок для скринридера. */
  railLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: не один файл, а маленькое дерево проекта рядом с кодом.
// Вкладки стоят колонкой слева, как в редакторе, состояние держит радиогруппа,
// а панель выбирается через :has() по индексу — клиентского JS нет вообще.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, подсветка синтаксиса подобрана отдельно для светлой и тёмной ветки.
const STYLES = `
:where([data-vibeui-block="codeblock-015"]){
--vibeui-codeblock-015-bg:transparent;
--vibeui-codeblock-015-rail:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-015-pick:light-dark(oklch(0 0 0 / 7%),oklch(1 0 0 / 10%));
--vibeui-codeblock-015-fg:light-dark(oklch(0.26 0.018 260),oklch(0.93 0.008 260));
--vibeui-codeblock-015-muted:color-mix(in oklab,var(--vibeui-codeblock-015-fg) 68%,transparent);
--vibeui-codeblock-015-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-codeblock-015-accent:light-dark(oklch(0.5 0.16 250),oklch(0.8 0.13 250));
--vibeui-codeblock-015-keyword:light-dark(oklch(0.48 0.19 300),oklch(0.79 0.13 300));
--vibeui-codeblock-015-string:light-dark(oklch(0.45 0.14 145),oklch(0.83 0.12 145));
--vibeui-codeblock-015-comment:light-dark(oklch(0.58 0.02 260),oklch(0.6 0.02 260));
--vibeui-codeblock-015-number:light-dark(oklch(0.52 0.14 72),oklch(0.84 0.12 72));
--vibeui-codeblock-015-type:light-dark(oklch(0.5 0.14 230),oklch(0.83 0.11 230));
--vibeui-codeblock-015-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-015"]{color-scheme:dark}
[data-vibeui-block="codeblock-015"]{
display:block;width:100%;max-width:38rem;box-sizing:border-box;margin:0;
font-family:var(--vibeui-codeblock-015-font);
}
[data-vibeui-block="codeblock-015"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;overflow:hidden;
border:1px solid var(--vibeui-codeblock-015-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-015-bg);color:var(--vibeui-codeblock-015-fg);
}
[data-vibeui-block="codeblock-015"] [data-part="rail"]{
display:flex;flex-wrap:wrap;gap:0.125rem;padding:0.375rem;
background:var(--vibeui-codeblock-015-rail);
border-bottom:1px solid var(--vibeui-codeblock-015-border);
}
[data-vibeui-block="codeblock-015"] [data-part="root"]{
flex:1 0 100%;padding:0.125rem 0.375rem 0.3125rem;
font-size:0.6875rem;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-codeblock-015-muted);
}
[data-vibeui-block="codeblock-015"] label{
flex:1 1 auto;cursor:pointer;display:flex;align-items:center;gap:0.375rem;
padding:0.3125rem 0.5rem;border-radius:0.375rem;
font-family:var(--vibeui-codeblock-015-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-015-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-015"] label::before{
content:"";flex:none;width:0.375rem;height:0.375rem;border-radius:50%;
background:currentColor;opacity:.45;
}
[data-vibeui-block="codeblock-015"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
border:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="codeblock-015"] label:hover{color:var(--vibeui-codeblock-015-fg)}
[data-vibeui-block="codeblock-015"] label:has(input:checked){
background:var(--vibeui-codeblock-015-pick);color:var(--vibeui-codeblock-015-accent);
}
[data-vibeui-block="codeblock-015"] label:has(input:checked)::before{opacity:1}
[data-vibeui-block="codeblock-015"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-codeblock-015-accent);outline-offset:2px;
}
[data-vibeui-block="codeblock-015"] pre{
display:none;margin:0;padding:0.875rem;overflow-x:auto;
}
[data-vibeui-block="codeblock-015"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-015-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-015"] [data-token="keyword"]{color:var(--vibeui-codeblock-015-keyword)}
[data-vibeui-block="codeblock-015"] [data-token="string"]{color:var(--vibeui-codeblock-015-string)}
[data-vibeui-block="codeblock-015"] [data-token="comment"]{color:var(--vibeui-codeblock-015-comment);font-style:italic}
[data-vibeui-block="codeblock-015"] [data-token="number"]{color:var(--vibeui-codeblock-015-number)}
[data-vibeui-block="codeblock-015"] [data-token="type"]{color:var(--vibeui-codeblock-015-type)}
/* Панель выбирает отмеченная радиокнопка: значение — индекс файла, поэтому
   селекторы не зависят от имён и переживают любой список файлов. */
[data-vibeui-block="codeblock-015"] [data-part="shell"]:has(input[value="0"]:checked) pre[data-index="0"],
[data-vibeui-block="codeblock-015"] [data-part="shell"]:has(input[value="1"]:checked) pre[data-index="1"],
[data-vibeui-block="codeblock-015"] [data-part="shell"]:has(input[value="2"]:checked) pre[data-index="2"],
[data-vibeui-block="codeblock-015"] [data-part="shell"]:has(input[value="3"]:checked) pre[data-index="3"],
[data-vibeui-block="codeblock-015"] [data-part="shell"]:has(input[value="4"]:checked) pre[data-index="4"],
[data-vibeui-block="codeblock-015"] [data-part="shell"]:has(input[value="5"]:checked) pre[data-index="5"]{display:block}
@container (min-width: 30rem){
[data-vibeui-block="codeblock-015"] [data-part="shell"]{grid-template-columns:11rem 1fr}
[data-vibeui-block="codeblock-015"] [data-part="rail"]{
flex-direction:column;flex-wrap:nowrap;align-content:start;
border-bottom:0;border-right:1px solid var(--vibeui-codeblock-015-border);
}
[data-vibeui-block="codeblock-015"] label{flex:0 0 auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-015"] *{animation:none!important;transition:none!important}}
`

const FILES: Codeblock015File[] = [
  {
    name: "page.tsx",
    lines: [
      [
        { text: "export default function ", kind: "keyword" },
        { text: "Page", kind: "type" },
        { text: "() {" },
      ],
      [
        { text: "  return", kind: "keyword" },
        { text: " <" },
        { text: "Catalog", kind: "type" },
        { text: " />" },
      ],
      [{ text: "}" }],
    ],
  },
  {
    name: "layout.tsx",
    lines: [
      [{ text: "// общая оболочка каталога", kind: "comment" }],
      [
        { text: "export const ", kind: "keyword" },
        { text: "revalidate = " },
        { text: "3600", kind: "number" },
      ],
    ],
  },
  {
    name: "loading.tsx",
    lines: [
      [
        { text: "export default function ", kind: "keyword" },
        { text: "Loading", kind: "type" },
        { text: "() {" },
      ],
      [
        { text: "  return", kind: "keyword" },
        { text: " <" },
        { text: "Skeleton", kind: "type" },
        { text: " rows={" },
        { text: "6", kind: "number" },
        { text: "} />" },
      ],
      [{ text: "}" }],
    ],
  },
  {
    name: "error.tsx",
    lines: [
      [
        { text: '"use client"', kind: "string" },
        { text: " // ошибки ловим на клиенте", kind: "comment" },
      ],
      [
        { text: "export default function ", kind: "keyword" },
        { text: "Error", kind: "type" },
        { text: "() {" },
      ],
      [
        { text: "  return <p>" },
        { text: "Каталог не загрузился", kind: "string" },
        { text: "</p>" },
      ],
      [{ text: "}" }],
    ],
  },
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

/** Несколько файлов в одном блоке: вкладки колонкой, переключение без JS. */
export function Codeblock015({
  root = "src/app",
  activeIndex = 0,
  files = FILES,
  group = "vibeui-codeblock-015",
  railLabel = "Файлы примера",
  background = "",
  className,
  style,
}: Codeblock015Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-015" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-slot="code-block"
        data-vibeui-block="codeblock-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="rail" role="group" aria-label={railLabel}>
            <span data-part="root">{root}</span>
            {files.slice(0, 6).map((file, index) => (
              <label key={file.name}>
                <input
                  type="radio"
                  name={group}
                  value={index}
                  defaultChecked={index === activeIndex}
                />
                {file.name}
              </label>
            ))}
          </div>
          {files.slice(0, 6).map((file, index) => (
            <pre key={file.name} data-index={index} aria-label={file.name}>
              <code>
                {file.lines.map((line, row) => (
                  <span key={row}>
                    {line.map((token, position) => (
                      <span key={position} data-token={token.kind}>
                        {token.text}
                      </span>
                    ))}
                    {row < file.lines.length - 1 ? "\n" : null}
                  </span>
                ))}
              </code>
            </pre>
          ))}
        </div>
      </figure>
    </>
  )
}
