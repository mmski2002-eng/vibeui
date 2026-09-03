import type { ComponentProps, CSSProperties } from "react"

export type Kbd004Hint = { keys: string[]; action: string }

export type Kbd004Props = Omit<ComponentProps<"div">, "children"> & {
  hints?: Kbd004Hint[]
  /** Чем рисовать клавишу "Mod": на macOS это ⌘, на Windows и Linux — Ctrl. */
  mod?: string
  align?: "start" | "center" | "between"
  size?: "sm" | "md"
  /** Пусто — подложки нет, полоса лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: строка подсказок внизу окна или списка. Она читается
// боковым зрением, поэтому подсказки разделены только промежутком, а не
// рамками: рамка вокруг каждой пары превращает служебную полосу в панель
// кнопок. Полоса переносится целыми подсказками, а сама пара «клавиша —
// действие» переноса не допускает: разорванная подсказка бесполезна.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, полоса лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="kbd-004"]){
--vibeui-kbd-004-surface:transparent;
--vibeui-kbd-004-fg:light-dark(oklch(0.3 0.014 265),oklch(0.91 0.006 265));
--vibeui-kbd-004-muted:color-mix(in oklab,var(--vibeui-kbd-004-fg) 68%,transparent);
--vibeui-kbd-004-border:light-dark(oklch(0.89 0.008 265),oklch(0.38 0.012 265));
--vibeui-kbd-004-key:light-dark(oklch(0.97 0.003 265),oklch(0.3 0.012 265));
--vibeui-kbd-004-gap:0.875rem;
--vibeui-kbd-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kbd-004"]{color-scheme:dark}
[data-vibeui-block="kbd-004"]{
display:flex;align-items:center;flex-wrap:wrap;
gap:0.375rem var(--vibeui-kbd-004-gap);
width:100%;max-width:34rem;box-sizing:border-box;padding:0.5rem 0.875rem;
background:var(--vibeui-kbd-004-surface);
border:1px solid var(--vibeui-kbd-004-border);border-radius:0.75rem;
font-family:var(--vibeui-kbd-004-font);color:var(--vibeui-kbd-004-fg);
font-size:0.75rem;
}
[data-vibeui-block="kbd-004"][data-align="center"]{justify-content:center}
[data-vibeui-block="kbd-004"][data-align="between"]{justify-content:space-between}
[data-vibeui-block="kbd-004"][data-size="md"]{font-size:0.8125rem;--vibeui-kbd-004-gap:1.25rem}
/* Пара «клавиша — действие» не переносится: разорванная подсказка бесполезна. */
[data-vibeui-block="kbd-004"] [data-part="hint"]{
display:inline-flex;align-items:center;gap:0.375rem;white-space:nowrap;
}
[data-vibeui-block="kbd-004"] [data-part="keys"]{display:inline-flex;align-items:center;gap:0.1875rem}
[data-vibeui-block="kbd-004"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;height:1.25rem;padding:0 0.3125rem;box-sizing:border-box;
background:var(--vibeui-kbd-004-key);
border:1px solid var(--vibeui-kbd-004-border);border-radius:0.3125rem;
font-family:inherit;font-size:0.6875rem;font-weight:650;line-height:1;
}
[data-vibeui-block="kbd-004"] [data-part="action"]{color:var(--vibeui-kbd-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_HINTS: Kbd004Hint[] = [
  { keys: ["↑", "↓"], action: "перемещение" },
  { keys: ["↵"], action: "выбрать" },
  { keys: ["Mod", "K"], action: "поиск" },
  { keys: ["Esc"], action: "закрыть" },
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
 * Ряд подсказок горячих клавиш для нижней служебной полосы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd004({
  hints = DEFAULT_HINTS,
  mod = "⌘",
  align = "start",
  size = "sm",
  background = "",
  className,
  style,
  ...props
}: Kbd004Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-kbd-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kbd-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="kbd"
        data-vibeui-block="kbd-004"
        data-align={align}
        data-size={size}
        className={className}
        style={palette}
      >
        {hints.map((hint) => (
          <span key={hint.action} data-part="hint">
            <span data-part="keys">
              {hint.keys.map((key) => (
                <kbd key={key}>{key === "Mod" ? mod : key}</kbd>
              ))}
            </span>
            <span data-part="action">{hint.action}</span>
          </span>
        ))}
      </div>
    </>
  )
}
