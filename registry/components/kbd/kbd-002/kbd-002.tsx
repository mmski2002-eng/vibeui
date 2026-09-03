import type { ComponentProps, CSSProperties } from "react"

export type Kbd002Props = Omit<ComponentProps<"div">, "children"> & {
  keys?: string[]
  /** Чем рисовать клавишу "Mod": на macOS это ⌘, на Windows и Linux — Ctrl. */
  mod?: string
  separator?: "plus" | "then" | "arrow"
  caption?: string
  /** Подписи разделителей: компонент несёт русские, проект подставляет свои. */
  separatorText?: Record<string, string>
  /** Пусто — подложки нет, сочетание лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: сочетание клавиш с явным разделителем. «⌘ + K» и «⌘ затем
// K» — разные действия: первое нажимают вместе, второе по очереди, и без
// слова между клавишами пользователь угадывает. Разделитель лежит в разметке
// отдельным элементом, поэтому его слышно при чтении вслух, а не только видно.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, компонент лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="kbd-002"]){
--vibeui-kbd-002-surface:transparent;
--vibeui-kbd-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-kbd-002-muted:color-mix(in oklab,var(--vibeui-kbd-002-fg) 68%,transparent);
--vibeui-kbd-002-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.012 265));
--vibeui-kbd-002-key:light-dark(oklch(0.985 0.002 265),oklch(0.3 0.012 265));
--vibeui-kbd-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kbd-002"]{color-scheme:dark}
[data-vibeui-block="kbd-002"]{
display:inline-flex;flex-direction:column;gap:0.5rem;
box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-kbd-002-surface);
border:1px solid var(--vibeui-kbd-002-border);border-radius:0.875rem;
font-family:var(--vibeui-kbd-002-font);color:var(--vibeui-kbd-002-fg);
}
[data-vibeui-block="kbd-002"] [data-part="caption"]{
margin:0;font-size:0.75rem;color:var(--vibeui-kbd-002-muted);
}
[data-vibeui-block="kbd-002"] [data-part="chord"]{
display:inline-flex;align-items:center;gap:0.375rem;flex-wrap:wrap;
}
[data-vibeui-block="kbd-002"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.75rem;height:1.75rem;padding:0 0.5rem;box-sizing:border-box;
background:var(--vibeui-kbd-002-key);
border:1px solid var(--vibeui-kbd-002-border);border-bottom-width:2px;
border-radius:0.4375rem;
font-family:inherit;font-size:0.8125rem;font-weight:650;line-height:1;
}
/* Разделитель — отдельный узел: его слышно при чтении вслух, а не только видно. */
[data-vibeui-block="kbd-002"] [data-part="sep"]{
font-size:0.75rem;color:var(--vibeui-kbd-002-muted);
}
[data-vibeui-block="kbd-002"][data-separator="then"] [data-part="sep"]{
font-size:0.6875rem;text-transform:lowercase;letter-spacing:0.02em;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-002"] *{animation:none!important;transition:none!important}}
`

const SEPARATOR_TEXT: Record<string, string> = {
  plus: "+",
  then: "затем",
  arrow: "→",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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
 * Сочетание клавиш с разделителем, который читается вслух.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd002({
  keys = ["Mod", "⇧", "P"],
  mod = "⌘",
  separator = "plus",
  caption = "Палитра команд",
  separatorText = SEPARATOR_TEXT,
  background = "",
  className,
  style,
  ...props
}: Kbd002Props) {
  const glue = separatorText[separator] ?? SEPARATOR_TEXT[separator]
  const palette = {
    ...(background
      ? {
          "--vibeui-kbd-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kbd-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="kbd"
        data-vibeui-block="kbd-002"
        data-separator={separator}
        className={className}
        style={palette}
      >
        <span data-part="chord">
          {keys.map((key, index) => (
            <span key={key} data-part="unit">
              {index > 0 ? <span data-part="sep"> {glue} </span> : null}
              <kbd>{key === "Mod" ? mod : key}</kbd>
            </span>
          ))}
        </span>
        <p data-part="caption">{caption}</p>
      </div>
    </>
  )
}
