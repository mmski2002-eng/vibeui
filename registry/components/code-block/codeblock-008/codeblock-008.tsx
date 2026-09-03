import type { CSSProperties } from "react"

export type Codeblock008Props = {
  title?: string
  label?: string
  code?: string
  wrapByDefault?: boolean
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: переключатель переноса длинных строк без единой строки JS.
// Состояние держит скрытый чекбокс, а :has() переводит код между
// white-space:pre и pre-wrap — переключение живёт и до гидратации.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, шапка и дорожка переключателя — полупрозрачные накладки.
const STYLES = `
:where([data-vibeui-block="codeblock-008"]){
--vibeui-codeblock-008-bg:transparent;
--vibeui-codeblock-008-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-008-track:light-dark(oklch(0 0 0 / 22%),oklch(1 0 0 / 16%));
--vibeui-codeblock-008-fg:light-dark(oklch(0.27 0.02 250),oklch(0.93 0.008 250));
--vibeui-codeblock-008-muted:color-mix(in oklab,var(--vibeui-codeblock-008-fg) 68%,transparent);
--vibeui-codeblock-008-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-008-accent:light-dark(oklch(0.52 0.16 250),oklch(0.75 0.14 250));
--vibeui-codeblock-008-knob:light-dark(oklch(0.99 0.002 250),oklch(0.98 0.005 250));
--vibeui-codeblock-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-008"]{color-scheme:dark}
[data-vibeui-block="codeblock-008"]{
display:flex;flex-direction:column;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-008-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-008-bg);color:var(--vibeui-codeblock-008-fg);
font-family:var(--vibeui-codeblock-008-font);
}
[data-vibeui-block="codeblock-008"] figcaption{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.4375rem 0.625rem 0.4375rem 0.875rem;
background:var(--vibeui-codeblock-008-head);
border-bottom:1px solid var(--vibeui-codeblock-008-border);
font-size:0.75rem;color:var(--vibeui-codeblock-008-muted);
}
[data-vibeui-block="codeblock-008"] [data-part="name"]{font-family:var(--vibeui-codeblock-008-mono)}
[data-vibeui-block="codeblock-008"] [data-part="toggle"]{
display:inline-flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.1875rem 0.375rem;border-radius:0.5rem;
font-size:0.75rem;user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-008"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
border:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="codeblock-008"] [data-part="track"]{
position:relative;flex:none;width:1.875rem;height:1.0625rem;border-radius:999px;
background:var(--vibeui-codeblock-008-track);
transition:background-color .18s ease;
}
[data-vibeui-block="codeblock-008"] [data-part="track"]::after{
content:"";position:absolute;top:0.1875rem;left:0.1875rem;
width:0.6875rem;height:0.6875rem;border-radius:999px;
background:var(--vibeui-codeblock-008-knob);
transition:transform .18s ease;
}
[data-vibeui-block="codeblock-008"] [data-part="toggle"]:has(input:checked){color:var(--vibeui-codeblock-008-fg)}
[data-vibeui-block="codeblock-008"] [data-part="toggle"]:has(input:checked) [data-part="track"]{background:var(--vibeui-codeblock-008-accent)}
[data-vibeui-block="codeblock-008"] [data-part="toggle"]:has(input:checked) [data-part="track"]::after{transform:translateX(0.8125rem)}
[data-vibeui-block="codeblock-008"] [data-part="toggle"]:has(input:focus-visible){outline:2px solid var(--vibeui-codeblock-008-accent);outline-offset:2px}
[data-vibeui-block="codeblock-008"] pre{margin:0;padding:0.875rem;overflow-x:auto}
[data-vibeui-block="codeblock-008"] code{
display:block;
font-family:var(--vibeui-codeblock-008-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
/* Перенос включается отмеченным чекбоксом: подпись меняет саму раскладку. */
[data-vibeui-block="codeblock-008"]:has(input:checked) code{
white-space:pre-wrap;overflow-wrap:anywhere;
}
[data-vibeui-block="codeblock-008"]:has(input:checked) pre{overflow-x:hidden}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-008"] *{animation:none!important;transition:none!important}}
`

const CODE = `const url = new URL("https://api.vibeui.ru/v1/registry/items?category=codeblock&limit=50&fields=name,title,tags")
const response = await fetch(url, { headers: { accept: "application/json" } })`

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

/** Блок кода с переключателем переноса длинных строк, без JS. */
export function Codeblock008({
  title = "lib/registry.ts",
  label = "Переносить строки",
  code = CODE,
  wrapByDefault = false,
  background = "",
  className,
  style,
}: Codeblock008Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-008" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-slot="code-block"
        data-vibeui-block="codeblock-008"
        className={className}
        style={palette}
      >
        <figcaption>
          <span data-part="name">{title}</span>
          <label data-part="toggle">
            <input type="checkbox" defaultChecked={wrapByDefault} />
            <span data-part="track" aria-hidden="true" />
            {label}
          </label>
        </figcaption>
        <pre>
          <code>{code}</code>
        </pre>
      </figure>
    </>
  )
}
