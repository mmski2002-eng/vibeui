import type { ComponentProps, CSSProperties } from "react"

export type Kbd003Props = Omit<ComponentProps<"p">, "children"> & {
  before?: string
  keys?: string[]
  /** Чем рисовать клавишу "Mod": на macOS это ⌘, на Windows и Linux — Ctrl. */
  mod?: string
  after?: string
  /** Пусто — подложки нет, абзац лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: клавиша внутри строки текста, которая не рвёт интерлиньяж.
// Обычная kbd с паддингом делает строку выше соседних, и абзац «разъезжается».
// Здесь высота клавиши задана в em и вписана в строку: вертикальные отступы
// нулевые, объём даёт padding по горизонтали и рамка, а вертикальное
// выравнивание — сдвиг на 0.05em, а не изменение line-height абзаца.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, абзац лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="kbd-003"]){
--vibeui-kbd-003-surface:transparent;
--vibeui-kbd-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-kbd-003-border:light-dark(oklch(0.87 0.008 265),oklch(0.38 0.012 265));
--vibeui-kbd-003-key:light-dark(oklch(0.97 0.003 265),oklch(0.3 0.012 265));
--vibeui-kbd-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kbd-003"]{color-scheme:dark}
[data-vibeui-block="kbd-003"]{
display:block;box-sizing:border-box;margin:0;
width:100%;max-width:24rem;padding:0.875rem 1rem;
background:var(--vibeui-kbd-003-surface);
border:1px solid var(--vibeui-kbd-003-border);border-radius:0.875rem;
font-family:var(--vibeui-kbd-003-font);color:var(--vibeui-kbd-003-fg);
font-size:0.875rem;line-height:1.7;
}
/* Клавиша вписана в строку: нулевые вертикальные отступы, высота в em. */
[data-vibeui-block="kbd-003"] kbd{
display:inline-block;
height:1.5em;padding:0 0.4em;box-sizing:border-box;
background:var(--vibeui-kbd-003-key);
border:1px solid var(--vibeui-kbd-003-border);border-bottom-width:2px;
border-radius:0.35em;
font-family:inherit;font-size:0.85em;font-weight:650;line-height:1.4;
vertical-align:baseline;transform:translateY(0.05em);
white-space:nowrap;
}
[data-vibeui-block="kbd-003"] [data-part="combo"]{white-space:nowrap}
[data-vibeui-block="kbd-003"] [data-part="plus"]{opacity:.55;padding:0 0.15em}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-003"] *{animation:none!important;transition:none!important}}
`

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
 * Клавиша внутри строки текста без ломки интерлиньяжа абзаца.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd003({
  before = "Нажмите",
  keys = ["Mod", "K"],
  mod = "⌘",
  after = "чтобы открыть поиск по каталогу — строка ввода появится поверх страницы.",
  background = "",
  className,
  style,
  ...props
}: Kbd003Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-kbd-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kbd-003" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-slot="kbd"
        data-vibeui-block="kbd-003"
        className={className}
        style={palette}
      >
        {before}{" "}
        <span data-part="combo">
          {keys.map((key, index) => (
            <span key={key}>
              {index > 0 ? <span data-part="plus">+</span> : null}
              <kbd>{key === "Mod" ? mod : key}</kbd>
            </span>
          ))}
        </span>{" "}
        {after}
      </p>
    </>
  )
}
