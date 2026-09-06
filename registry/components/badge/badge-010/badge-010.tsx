import type { ComponentProps, CSSProperties } from "react"

export type Badge010Props = Omit<ComponentProps<"span">, "children"> & {
  /** 1 — самый высокий приоритет. */
  level?: 1 | 2 | 3 | 4
  label?: string
  total?: number
  /** Подписи уровней: компонент несёт русские, проект подставляет свои. */
  levelText?: Record<number, string>
  /** Подпись неизвестного уровня. `{level}` подставляется номером. */
  levelFallback?: string
  /** Подпись для скринридера. `{label}`, `{filled}` и `{total}` подставляются. */
  ariaText?: string
  /** Пусто — плашка держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: приоритет штрихами, а не цветом. Три залитых полоски из
// четырёх читаются в чёрно-белой печати, при дальтонизме и краем глаза в
// длинном списке, где красный от оранжевого не отличить. Подпись остаётся
// словом: полоски уточняют степень, а не заменяют название.
const STYLES = `
:where([data-vibeui-block="badge-010"]){
--vibeui-badge-010-bg:light-dark(oklch(0.96 0 265),oklch(0.27 0 265));
--vibeui-badge-010-fg:light-dark(oklch(0.32 0 265),oklch(0.93 0 265));
--vibeui-badge-010-border:light-dark(oklch(0.89 0 265),oklch(0.39 0 265));
--vibeui-badge-010-track:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-badge-010-mark:light-dark(oklch(0.45 0 265),oklch(0.82 0 265));
--vibeui-badge-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-010"]{color-scheme:dark}
[data-vibeui-block="badge-010"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:1.5rem;padding:0 0.625rem 0 0.5rem;
border:1px solid var(--vibeui-badge-010-border);border-radius:0.4375rem;
background:var(--vibeui-badge-010-bg);color:var(--vibeui-badge-010-fg);
font-family:var(--vibeui-badge-010-font);font-size:0.75rem;font-weight:600;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-010"][data-level="1"]{--vibeui-badge-010-mark:light-dark(oklch(0.55 0.19 25),oklch(0.7 0.19 25))}
[data-vibeui-block="badge-010"][data-level="2"]{--vibeui-badge-010-mark:light-dark(oklch(0.62 0.16 55),oklch(0.76 0.15 55))}
[data-vibeui-block="badge-010"][data-level="3"]{--vibeui-badge-010-mark:light-dark(oklch(0.6 0.1 230),oklch(0.74 0.1 230))}
/* Полоски: степень видно формой, цвет только усиливает. */
[data-vibeui-block="badge-010"] [data-part="bars"]{display:inline-flex;align-items:flex-end;gap:0.125rem;flex:none}
[data-vibeui-block="badge-010"] [data-part="bar"]{
width:0.1875rem;border-radius:9999px;background:var(--vibeui-badge-010-track);
}
[data-vibeui-block="badge-010"] [data-part="bar"][data-on="true"]{background:var(--vibeui-badge-010-mark)}
[data-vibeui-block="badge-010"] [data-part="bar"]:nth-child(1){height:0.375rem}
[data-vibeui-block="badge-010"] [data-part="bar"]:nth-child(2){height:0.5625rem}
[data-vibeui-block="badge-010"] [data-part="bar"]:nth-child(3){height:0.75rem}
[data-vibeui-block="badge-010"] [data-part="bar"]:nth-child(4){height:0.9375rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-010"] *{animation:none!important;transition:none!important}}
`

const LEVEL_TEXT: Record<number, string> = {
  1: "Критический",
  2: "Высокий",
  3: "Обычный",
  4: "Низкий",
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
 * Приоритет штрихами: степень читается формой, а не цветом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge010({
  level = 1,
  label,
  total = 4,
  levelText = LEVEL_TEXT,
  levelFallback = "Уровень {level}",
  ariaText = "Приоритет: {label}, {filled} из {total}",
  background = "",
  className,
  style,
  ...props
}: Badge010Props) {
  // Первый уровень — самый высокий, поэтому полосок у него больше всех.
  const filled = total - level + 1
  const text =
    label ?? levelText[level] ?? levelFallback.replace("{level}", String(level))
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-010" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-010"
        data-level={level}
        className={className}
        style={palette}
        aria-label={ariaText
          .replace("{label}", text)
          .replace("{filled}", String(filled))
          .replace("{total}", String(total))}
      >
        <span data-part="bars" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <span key={index} data-part="bar" data-on={index < filled} />
          ))}
        </span>
        <span aria-hidden="true">{text}</span>
      </span>
    </>
  )
}
