import type { CSSProperties } from "react"

export type Codeblock026Props = {
  path?: string
  reason?: string
  editInstead?: string
  code?: string
  /** Подпись значка запрета. */
  badgeText?: string
  /** Сноска под кодом; {file} подставляется значением editInstead. */
  noteText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: листинг, который нельзя править руками. Замок в шапке,
// косая штриховка поверх кода и подпись «правьте вот это вместо файла» —
// три сигнала подряд, потому что один читатель всегда пропускает.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, плашка кода и штриховка — полупрозрачные слои поверх страницы.
const STYLES = `
:where([data-vibeui-block="codeblock-026"]){
--vibeui-codeblock-026-bg:transparent;
--vibeui-codeblock-026-code:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-026-fg:light-dark(oklch(0.3 0.014 265),oklch(0.93 0.008 265));
--vibeui-codeblock-026-muted:color-mix(in oklab,var(--vibeui-codeblock-026-fg) 68%,transparent);
--vibeui-codeblock-026-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-026-lock:light-dark(oklch(0.45 0.1 265),oklch(0.83 0.1 265));
--vibeui-codeblock-026-lock-bg:light-dark(oklch(0.6 0.12 265 / 18%),oklch(0.62 0.12 265 / 26%));
--vibeui-codeblock-026-hatch:light-dark(oklch(0.5 0.02 265 / 7%),oklch(1 0 0 / 6%));
--vibeui-codeblock-026-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-026"]{color-scheme:dark}
[data-vibeui-block="codeblock-026"]{
display:flex;flex-direction:column;
width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-026-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-026-bg);color:var(--vibeui-codeblock-026-fg);
font-family:var(--vibeui-codeblock-026-font);
}
[data-vibeui-block="codeblock-026"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;
padding:0.5rem 0.75rem;
border-bottom:1px solid var(--vibeui-codeblock-026-border);
font-family:var(--vibeui-codeblock-026-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-026-muted);
}
[data-vibeui-block="codeblock-026"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.3125rem;flex:none;
padding:0.1875rem 0.5rem;border-radius:999px;
background:var(--vibeui-codeblock-026-lock-bg);
color:var(--vibeui-codeblock-026-lock);
font-family:var(--vibeui-codeblock-026-font);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="codeblock-026"] svg{width:0.75rem;height:0.75rem;flex:none}
[data-vibeui-block="codeblock-026"] [data-part="path"]{margin-inline-start:auto}
/* Штриховка лежит отдельным слоем поверх кода: приглушать сам текст нельзя —
   он должен читаться, просто редактировать его бессмысленно. */
[data-vibeui-block="codeblock-026"] [data-part="body"]{
position:relative;background:var(--vibeui-codeblock-026-code);
}
[data-vibeui-block="codeblock-026"] [data-part="body"]::after{
content:"";position:absolute;inset:0;pointer-events:none;
background:repeating-linear-gradient(
135deg,
transparent 0 0.5rem,
var(--vibeui-codeblock-026-hatch) 0.5rem 0.625rem
);
}
[data-vibeui-block="codeblock-026"] pre{margin:0;padding:0.75rem 0.875rem;overflow-x:auto}
[data-vibeui-block="codeblock-026"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-026-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-026"] [data-part="note"]{
margin:0;padding:0.625rem 0.75rem;
border-top:1px solid var(--vibeui-codeblock-026-border);
font-size:0.75rem;line-height:1.5;color:var(--vibeui-codeblock-026-muted);
}
[data-vibeui-block="codeblock-026"] [data-part="note"] b{
display:block;margin-bottom:0.125rem;
color:var(--vibeui-codeblock-026-fg);font-weight:650;
}
[data-vibeui-block="codeblock-026"] [data-part="note"] code{
display:inline;min-width:0;
padding:0.0625rem 0.3125rem;border-radius:0.3125rem;
background:var(--vibeui-codeblock-026-code);
border:1px solid var(--vibeui-codeblock-026-border);
font-size:0.75rem;
}
`

const CODE = `// сгенерировано, не править
export const ITEMS = [
  "codeblock-001",
  "codeblock-002",
  "codeblock-003",
]`

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

const NOTE =
  "Правки внесите в {file} и пересоберите: ручные изменения здесь пропадут при следующей сборке."

/** Листинг сгенерированного файла с пометкой «только для чтения». */
export function Codeblock026({
  path = "registry/index.ts",
  reason = "Файл собирает команда npm run indexes",
  editInstead = "registry/components/*/registry.json",
  code = CODE,
  badgeText = "только для чтения",
  noteText = NOTE,
  background = "",
  className,
  style,
  ...props
}: Codeblock026Props) {
  // Сноска приходит одной строкой с {file}: разрезаем её, чтобы имя файла
  // осталось моноширинным, а перевод не тащил за собой разметку.
  const [notePrefix, noteSuffix] = noteText.split("{file}")
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-026-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-026" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-026"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span data-part="badge">
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <rect
                x="2.5"
                y="5"
                width="7"
                height="5.5"
                rx="1.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M4.25 5V3.75a1.75 1.75 0 0 1 3.5 0V5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            {badgeText}
          </span>
          <span data-part="path">{path}</span>
        </figcaption>
        <div data-part="body">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
        <p data-part="note" role="note">
          <b>{reason}</b>
          {notePrefix}
          {noteSuffix === undefined ? null : (
            <>
              <code>{editInstead}</code>
              {noteSuffix}
            </>
          )}
        </p>
      </figure>
    </>
  )
}
