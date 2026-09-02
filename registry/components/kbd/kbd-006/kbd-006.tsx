import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Kbd006Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  keys?: string[]
  width?: "auto" | "even"
  caption?: string
  /** Пусто — подложки нет, ряд лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: клавиши с длинными подписями. «Backspace» и «Page Down» не
// влезают в квадрат, а растягивать под них все клавиши — терять сходство с
// клавиатурой. Здесь два честных режима: auto — ширина по содержимому при
// общей минимальной, even — равные колонки на grid, когда ряд должен быть
// строем. Высота и кегль в обоих режимах общие, поэтому ряд остаётся рядом.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, ряд лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="kbd-006"]){
--vibeui-kbd-006-surface:transparent;
--vibeui-kbd-006-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-kbd-006-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-kbd-006-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.012 265));
--vibeui-kbd-006-key:light-dark(oklch(0.975 0.003 265),oklch(0.3 0.012 265));
--vibeui-kbd-006-height:2rem;
--vibeui-kbd-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="kbd-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-kbd-006-surface);
border:1px solid var(--vibeui-kbd-006-border);border-radius:0.875rem;
font-family:var(--vibeui-kbd-006-font);color:var(--vibeui-kbd-006-fg);
}
[data-vibeui-block="kbd-006"] [data-part="row"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
/* even — равные колонки на grid: ряд встаёт строем, а не по содержимому. */
[data-vibeui-block="kbd-006"][data-width="even"] [data-part="row"]{
display:grid;grid-template-columns:repeat(auto-fit,minmax(4.5rem,1fr));
}
[data-vibeui-block="kbd-006"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:2rem;height:var(--vibeui-kbd-006-height);
padding:0 0.625rem;box-sizing:border-box;
background:var(--vibeui-kbd-006-key);
border:1px solid var(--vibeui-kbd-006-border);border-bottom-width:2px;
border-radius:0.4375rem;
font-family:inherit;font-size:0.75rem;font-weight:650;line-height:1;
white-space:nowrap;
}
/* Длинная подпись не переносится: разорванное «Page Down» перестаёт читаться. */
[data-vibeui-block="kbd-006"][data-width="even"] kbd{
overflow:hidden;text-overflow:ellipsis;display:flex;
}
[data-vibeui-block="kbd-006"] [data-part="caption"]{
margin:0;font-size:0.75rem;color:var(--vibeui-kbd-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_KEYS = ["Shift", "Backspace", "Page Down", "Space", "↵"]

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
 * Ряд клавиш с длинными подписями: ширина по содержимому или равными колонками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd006({
  keys = DEFAULT_KEYS,
  width = "auto",
  caption = "Клавиши редактора текста",
  background = "",
  className,
  style,
  ...props
}: Kbd006Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-kbd-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kbd-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kbd-006"
        data-width={width}
        className={className}
        style={palette}
      >
        <div data-part="row">
          {keys.map((key) => (
            <kbd key={key}>{key}</kbd>
          ))}
        </div>
        <p data-part="caption">{caption}</p>
      </div>
    </>
  )
}
