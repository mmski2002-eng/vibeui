"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Code001Language = "tsx" | "ts" | "js" | "json" | "bash"

export type Code001Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  code?: string
  /** Язык разбора: от него зависит набор правил подсветки. */
  language?: Code001Language
  showNumbers?: boolean
  /** Переносить длинные строки вместо горизонтальной прокрутки. */
  wrap?: boolean
  copyText?: string
  copiedText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  onCopy?: () => void
}

// Идея компонента: блок кода, которому на вход дают обычную строку, а не
// заранее размеченные токены. Разбор живёт внутри — несколько правил на язык,
// один проход регулярным выражением, — поэтому подсветка не тянет за собой
// библиотеку и успевает отработать на сервере, при первом же рендере.
// Разбор намеренно неглубокий: он красит то, за что цепляется глаз, и не
// притворяется компилятором.
const STYLES = `
:where([data-vibeui-block="code-001"]){
--vibeui-code-001-bg:transparent;
--vibeui-code-001-fg:light-dark(oklch(0.28 0.016 265),oklch(0.94 0.006 265));
--vibeui-code-001-muted:color-mix(in oklab,var(--vibeui-code-001-fg) 68%,transparent);
--vibeui-code-001-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-code-001-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 6%));
--vibeui-code-001-key:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 10%));
--vibeui-code-001-key-hover:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 16%));
--vibeui-code-001-gutter:light-dark(oklch(0.67 0.02 275),oklch(0.52 0.03 275));
--vibeui-code-001-done:light-dark(oklch(0.48 0.14 152),oklch(0.8 0.14 152));
--vibeui-code-001-keyword:light-dark(oklch(0.5 0.19 305),oklch(0.78 0.13 305));
--vibeui-code-001-string:light-dark(oklch(0.45 0.13 145),oklch(0.83 0.13 145));
--vibeui-code-001-comment:light-dark(oklch(0.54 0.02 275),oklch(0.61 0.02 275));
--vibeui-code-001-number:light-dark(oklch(0.53 0.14 62),oklch(0.84 0.12 72));
--vibeui-code-001-entity:light-dark(oklch(0.5 0.15 245),oklch(0.83 0.11 235));
--vibeui-code-001-tag:light-dark(oklch(0.52 0.16 25),oklch(0.82 0.12 25));
--vibeui-code-001-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-code-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="code-001"]{color-scheme:dark}
[data-vibeui-block="code-001"]{
display:flex;flex-direction:column;
width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-code-001-border);border-radius:0.875rem;
background:var(--vibeui-code-001-bg);color:var(--vibeui-code-001-fg);
font-family:var(--vibeui-code-001-font);
}
[data-vibeui-block="code-001"] *{box-sizing:border-box}
[data-vibeui-block="code-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.5rem 0.5rem 0.875rem;
background:var(--vibeui-code-001-head);
border-bottom:1px solid var(--vibeui-code-001-border);
font-size:0.75rem;color:var(--vibeui-code-001-muted);
}
[data-vibeui-block="code-001"] [data-part="name"]{
display:flex;align-items:center;gap:0.5rem;min-width:0;
font-family:var(--vibeui-code-001-mono);
}
[data-vibeui-block="code-001"] [data-part="path"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="code-001"] [data-part="lang"]{
flex:none;padding:0.0625rem 0.375rem;
border-radius:0.3125rem;background:var(--vibeui-code-001-key);
font-size:0.625rem;letter-spacing:0.06em;text-transform:uppercase;
}
/* Подпись кнопки настраивается, поэтому высота набирается содержимым:
   фиксированная обрезала бы длинный перевод. */
[data-vibeui-block="code-001"] button{
appearance:none;border:0;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
min-height:1.75rem;padding:0.25rem 0.625rem;border-radius:0.4375rem;
background:var(--vibeui-code-001-key);color:var(--vibeui-code-001-fg);
font:inherit;font-size:0.75rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="code-001"] button:hover{background:var(--vibeui-code-001-key-hover)}
[data-vibeui-block="code-001"] button:focus-visible{outline:2px solid var(--vibeui-code-001-done);outline-offset:2px}
[data-vibeui-block="code-001"] button[data-done="true"]{color:var(--vibeui-code-001-done)}
[data-vibeui-block="code-001"] pre{
margin:0;padding:0.75rem 0.875rem 0.875rem 0;overflow-x:auto;
counter-reset:line;
}
[data-vibeui-block="code-001"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-code-001-mono);
font-size:0.8125rem;line-height:1.7;white-space:pre;
}
[data-vibeui-block="code-001"] [data-part="row"]{
display:block;padding-inline-start:0.875rem;
}
/* Номер печатает ::before: выделение и копирование его не захватывают. */
[data-vibeui-block="code-001"][data-numbers="true"] [data-part="row"]{
position:relative;padding-inline-start:3.5rem;
}
[data-vibeui-block="code-001"][data-numbers="true"] [data-part="row"]::before{
counter-increment:line;content:counter(line);
position:absolute;left:0;width:2.75rem;
text-align:right;color:var(--vibeui-code-001-gutter);
font-variant-numeric:tabular-nums;
user-select:none;-webkit-user-select:none;pointer-events:none;
}
/* Перенос: длинная команда читается целиком, а не уезжает за край. */
[data-vibeui-block="code-001"][data-wrap="true"] code{
min-width:0;white-space:pre-wrap;overflow-wrap:anywhere;
}
[data-vibeui-block="code-001"] [data-token="keyword"]{color:var(--vibeui-code-001-keyword)}
[data-vibeui-block="code-001"] [data-token="string"]{color:var(--vibeui-code-001-string)}
[data-vibeui-block="code-001"] [data-token="comment"]{color:var(--vibeui-code-001-comment);font-style:italic}
[data-vibeui-block="code-001"] [data-token="number"]{color:var(--vibeui-code-001-number)}
[data-vibeui-block="code-001"] [data-token="entity"]{color:var(--vibeui-code-001-entity)}
[data-vibeui-block="code-001"] [data-token="tag"]{color:var(--vibeui-code-001-tag)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="code-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CODE = `import { useMemo } from "react"

// цены храним в копейках
export function usePrice(value: number) {
  return useMemo(() => (value / 100).toFixed(2) + " ₽", [value])
}`

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "await",
  "async",
  "new",
  "class",
  "extends",
  "type",
  "interface",
  "enum",
  "as",
  "of",
  "in",
  "try",
  "catch",
  "finally",
  "throw",
  "typeof",
  "instanceof",
  "void",
  "null",
  "undefined",
  "true",
  "false",
  "this",
  "super",
  "yield",
  "delete",
  "switch",
  "case",
  "break",
  "continue",
  "do",
  "static",
  "readonly",
  "satisfies",
])

// Правила разбора: порядок альтернатив и есть приоритет. Комментарии и
// строки стоят первыми, иначе ключевое слово внутри строки покрасится само.
// Группы нумерованные, а не именованные: цель сборки — ES2017, а имён групп
// там ещё нет.
type Rule = {
  re: RegExp
  /** Вид токена для каждой группы захвата, по порядку групп. */
  kinds: string[]
}

const SCRIPT: Rule = {
  re: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g,
  kinds: ["comment", "string", "tag", "number", "word"],
}

const RULES: Record<Code001Language, Rule> = {
  tsx: SCRIPT,
  ts: SCRIPT,
  js: SCRIPT,
  json: {
    re: /("(?:[^"\\]|\\.)*"(?=\s*:))|("(?:[^"\\]|\\.)*")|(-?\b\d+(?:\.\d+)?\b)|(\b(?:true|false|null)\b)/g,
    kinds: ["key", "string", "number", "word"],
  },
  bash: {
    re: /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'[^']*')|(\s-{1,2}[\w-]+)|(^[ \t]*[\w./-]+)|(\b\d+(?:\.\d+)?\b)/gm,
    kinds: ["comment", "string", "flag", "command", "number"],
  },
}

type Piece = { text: string; kind?: string }

/**
 * Разбирает код на куски с пометкой вида. Неопознанное остаётся обычным
 * текстом: лучше не покрасить, чем покрасить неверно.
 */
function tokenize(code: string, language: Code001Language): Piece[] {
  const rule = RULES[language]
  const pieces: Piece[] = []
  let last = 0

  rule.re.lastIndex = 0

  for (let match = rule.re.exec(code); match; match = rule.re.exec(code)) {
    if (match.index > last) {
      pieces.push({ text: code.slice(last, match.index) })
    }

    const text = match[0]
    const hit = rule.kinds.findIndex(
      (_, index) => match[index + 1] !== undefined,
    )
    const kind = hit === -1 ? undefined : rule.kinds[hit]

    if (kind === "key" || kind === "flag" || kind === "command") {
      // Ключ объекта, флаг команды и сама команда — всё это «сущность»:
      // отдельные цвета им ничего не добавляют, а палитру раздувают.
      pieces.push({ text, kind: "entity" })
    } else if (kind === "word") {
      // Слово красится только если это ключевое слово или литерал JSON:
      // угадывать «функцию» по скобке — прямой путь к ложным срабатываниям.
      const keyword = language === "json" || KEYWORDS.has(text)
      pieces.push(keyword ? { text, kind: "keyword" } : { text })
    } else if (kind) {
      pieces.push({ text, kind })
    } else {
      pieces.push({ text })
    }

    last = match.index + text.length
  }

  if (last < code.length) {
    pieces.push({ text: code.slice(last) })
  }

  return pieces
}

/** Режет разобранный код по строкам: номер рисуется у каждой строки. */
function toLines(pieces: Piece[]): Piece[][] {
  const lines: Piece[][] = [[]]

  for (const piece of pieces) {
    const parts = piece.text.split("\n")

    parts.forEach((part, index) => {
      if (index > 0) {
        lines.push([])
      }
      if (part !== "") {
        lines[lines.length - 1].push({ text: part, kind: piece.kind })
      }
    })
  }

  return lines
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
 * Блок кода с подсветкой из обычной строки: разбор внутри, без библиотек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Code001({
  title = "hooks/use-price.ts",
  code = DEFAULT_CODE,
  language = "ts",
  showNumbers = true,
  wrap = false,
  copyText = "Копировать",
  copiedText = "Скопировано",
  background = "",
  onCopy,
  className,
  style,
  ...props
}: Code001Props) {
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Буфер недоступен: молча выходим, ложное «скопировано» хуже молчания.
      return
    }
    setDone(true)
    onCopy?.()
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), 2000)
  }

  const palette = {
    ...(background
      ? {
          "--vibeui-code-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const lines = toLines(tokenize(code, language))

  return (
    <>
      <style href="vibeui-code-001" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="code-001"
        data-numbers={showNumbers}
        data-wrap={wrap}
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span data-part="name">
            <span data-part="path">{title}</span>
            <span data-part="lang">{language}</span>
          </span>
          <button type="button" data-done={done} onClick={copy}>
            <span aria-live="polite">{done ? copiedText : copyText}</span>
          </button>
        </figcaption>
        <pre>
          <code>
            {lines.map((line, index) => (
              <span data-part="row" key={index}>
                {line.map((piece, position) => (
                  <span key={position} data-token={piece.kind}>
                    {piece.text}
                  </span>
                ))}
                {"\n"}
              </span>
            ))}
          </code>
        </pre>
      </figure>
    </>
  )
}
