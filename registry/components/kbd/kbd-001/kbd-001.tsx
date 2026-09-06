import type { ComponentProps, CSSProperties } from "react"

export type Kbd001Props = Omit<ComponentProps<"div">, "children"> & {
  rows?: { action: string; keys: string[] }[]
  title?: string
  /** Чем рисовать клавишу "Mod": на macOS это ⌘, на Windows и Linux — Ctrl. */
  mod?: string
  /** Пусто — подложки нет, список лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: список горячих клавиш. Клавиши набраны тегом kbd — это его
// прямое назначение, и скринридер объявит их как ввод, а не как текст.
// Плюс между клавишами нарисован в разметке, а не в CSS: «⌘ + K» надо
// прочитать вслух, иначе сочетание превращается в две отдельные клавиши.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// списка по умолчанию нет, он лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="kbd-001"]){
--vibeui-kbd-001-bg:transparent;
--vibeui-kbd-001-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-kbd-001-muted:color-mix(in oklab,var(--vibeui-kbd-001-fg) 68%,transparent);
--vibeui-kbd-001-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-kbd-001-key:light-dark(oklch(0.985 0 265),oklch(0.3 0 265));
--vibeui-kbd-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kbd-001"]{color-scheme:dark}
[data-vibeui-block="kbd-001"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-kbd-001-bg);
border:1px solid var(--vibeui-kbd-001-border);border-radius:0.875rem;
font-family:var(--vibeui-kbd-001-font);color:var(--vibeui-kbd-001-fg);
}
[data-vibeui-block="kbd-001"] [data-part="title"]{margin:0 0 0.125rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="kbd-001"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
min-height:1.875rem;font-size:0.8125rem;
}
[data-vibeui-block="kbd-001"] [data-part="keys"]{display:inline-flex;align-items:center;gap:0.25rem;flex:none}
/* Клавиша — тег kbd: скринридер объявит её как ввод, а не как текст. */
[data-vibeui-block="kbd-001"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.5rem;height:1.5rem;padding:0 0.375rem;box-sizing:border-box;
border:1px solid var(--vibeui-kbd-001-border);border-bottom-width:2px;border-radius:0.375rem;
background:var(--vibeui-kbd-001-key);
font-family:inherit;font-size:0.75rem;font-weight:650;line-height:1;
}
[data-vibeui-block="kbd-001"] [data-part="plus"]{color:var(--vibeui-kbd-001-muted);font-size:0.6875rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-001"] *{animation:none!important;transition:none!important}}
`

// "Mod" — не клавиша, а место для модификатора: подставляется проп `mod`,
// иначе список с ⌘ на Windows врёт про сочетание.
const DEFAULT_ROWS = [
  { action: "Открыть поиск", keys: ["Mod", "K"] },
  { action: "Скопировать для ИИ", keys: ["Mod", "⇧", "C"] },
  { action: "Следующий компонент", keys: ["J"] },
  { action: "Закрыть окно", keys: ["Esc"] },
]

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
 * Список горячих клавиш: клавиши тегом kbd, плюс между ними в разметке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd001({
  rows = DEFAULT_ROWS,
  title = "Горячие клавиши",
  mod = "⌘",
  background = "",
  className,
  style,
  ...props
}: Kbd001Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-kbd-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kbd-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="kbd"
        data-vibeui-block="kbd-001"
        className={className}
        style={palette}
      >
        {title ? <h3 data-part="title">{title}</h3> : null}
        {rows.map((row) => (
          <p key={row.action} data-part="row">
            <span>{row.action}</span>
            <span data-part="keys">
              {row.keys.map((key, index) => (
                <span key={key} data-part="key">
                  {index > 0 ? <span data-part="plus"> + </span> : null}
                  <kbd>{key === "Mod" ? mod : key}</kbd>
                </span>
              ))}
            </span>
          </p>
        ))}
      </div>
    </>
  )
}
