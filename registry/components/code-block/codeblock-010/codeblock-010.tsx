import { Fragment } from "react"
import type { CSSProperties, ReactNode } from "react"

export type Codeblock010Props = {
  heading?: string
  command?: string
  file?: string
  shortcut?: string
  configFile?: string
  /** Первый абзац: {command} и {file} подставляются чипами. */
  commandText?: string
  /** Второй абзац: {shortcut} и {configFile} подставляются чипами. */
  shortcutText?: string
  /** Пусто — подложки нет, абзац лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: код внутри абзаца, а не блоком. Главная задача — чтобы
// подложка чипа не рвалась при переносе строки: за это отвечает
// box-decoration-break:clone, иначе у перенесённого куска пропадает скругление.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у абзаца
// нет, чипы и клавиша держатся полупрозрачными накладками.
const STYLES = `
:where([data-vibeui-block="codeblock-010"]){
--vibeui-codeblock-010-bg:transparent;
--vibeui-codeblock-010-fg:light-dark(oklch(0.27 0 265),oklch(0.92 0 265));
--vibeui-codeblock-010-muted:color-mix(in oklab,var(--vibeui-codeblock-010-fg) 68%,transparent);
--vibeui-codeblock-010-border:light-dark(oklch(0.9 0 265),oklch(1 0 0 / 16%));
--vibeui-codeblock-010-chip-bg:light-dark(oklch(0.94 0 265),oklch(1 0 0 / 10%));
--vibeui-codeblock-010-chip-fg:light-dark(oklch(0.32 0.09 39.8),oklch(0.85 0.11 39.8));
--vibeui-codeblock-010-path-fg:light-dark(oklch(0.36 0.09 39.8),oklch(0.83 0.1 39.8));
--vibeui-codeblock-010-key-bg:light-dark(oklch(1 0 0),oklch(1 0 0 / 8%));
--vibeui-codeblock-010-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-010"]{color-scheme:dark}
[data-vibeui-block="codeblock-010"]{
display:block;width:100%;box-sizing:border-box;
padding:1.125rem 1.25rem 1.25rem;
border:1px solid var(--vibeui-codeblock-010-border);border-radius:0.875rem;
background:var(--vibeui-codeblock-010-bg);color:var(--vibeui-codeblock-010-fg);
font-family:var(--vibeui-codeblock-010-font);font-size:0.875rem;line-height:1.65;
}
[data-vibeui-block="codeblock-010"] h3{
margin:0 0 0.5rem;font-size:1rem;line-height:1.3;letter-spacing:-0.01em;
}
[data-vibeui-block="codeblock-010"] p{margin:0 0 0.625rem}
[data-vibeui-block="codeblock-010"] p:last-child{margin-bottom:0;color:var(--vibeui-codeblock-010-muted)}
/* clone сохраняет фон и скругление у обеих половин перенесённого чипа. */
[data-vibeui-block="codeblock-010"] code{
font-family:var(--vibeui-codeblock-010-mono);
/* Кегль чипа в rem, а не в em: кегль абзаца задан тут же константой, и em
   уводил код на 0.71rem — мельче, чем моноширинный текст у соседей. */
font-size:0.8125rem;line-height:inherit;
padding:0.125em 0.375em;border-radius:0.3125em;
background:var(--vibeui-codeblock-010-chip-bg);color:var(--vibeui-codeblock-010-chip-fg);
overflow-wrap:break-word;
-webkit-box-decoration-break:clone;box-decoration-break:clone;
}
[data-vibeui-block="codeblock-010"] code[data-kind="path"]{color:var(--vibeui-codeblock-010-path-fg)}
[data-vibeui-block="codeblock-010"] kbd{
font-family:var(--vibeui-codeblock-010-font);font-size:0.6875rem;font-weight:650;
padding:0.1875em 0.4375em;border-radius:0.3125em;
border:1px solid var(--vibeui-codeblock-010-border);
border-bottom-width:2px;
background:var(--vibeui-codeblock-010-key-bg);color:var(--vibeui-codeblock-010-fg);
white-space:nowrap;
}
`

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
 * Шаблон абзаца с чипами. Текст живёт в пропсе, поэтому переводится целиком,
 * а порядок слов вокруг чипа не приходится собирать из кусков в разметке.
 */
function fill(template: string, chips: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{[a-zA-Z]+\})/).map((part, index) => {
    const key = /^\{([a-zA-Z]+)\}$/.exec(part)?.[1]

    return key && key in chips ? (
      <Fragment key={index}>{chips[key]}</Fragment>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  })
}

/** Инлайновый код в абзаце: чипы команды, пути и клавиши. */
export function Codeblock010({
  heading = "Как поставить компонент",
  command = "npx shadcn@latest add codeblock-010",
  file = "components/vibeui/codeblock-010.tsx",
  shortcut = "Ctrl + `",
  configFile = "package.json",
  commandText = "Выполните {command} — файл ляжет в {file} и сразу заработает.",
  shortcutText = "Терминал открывается по {shortcut}; если команда не найдена, проверьте {configFile}.",
  background = "",
  className,
  style,
  ...props
}: Codeblock010Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const chips: Record<string, ReactNode> = {
    command: <code>{command}</code>,
    file: <code data-kind="path">{file}</code>,
    shortcut: <kbd>{shortcut}</kbd>,
    configFile: <code data-kind="path">{configFile}</code>,
  }

  return (
    <>
      <style href="vibeui-codeblock-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-010"
        className={className}
        style={palette}
      >
        <h3>{heading}</h3>
        <p>{fill(commandText, chips)}</p>
        <p>{fill(shortcutText, chips)}</p>
      </div>
    </>
  )
}
