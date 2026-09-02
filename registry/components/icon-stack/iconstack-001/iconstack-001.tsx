import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Iconstack001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  names?: string[]
  max?: number
  label?: string
  size?: "sm" | "md" | "lg"
  /** Пусто — подложки нет, стопка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: стопка участников с перекрытием. Порядок наложения задан
// не z-index на каждом элементе, а обратным направлением флекса: тогда левый
// кружок лежит поверх правого без единого дополнительного правила. Остаток
// сворачивается в «+N» — иначе десять человек превращаются в полосу, где не
// читается ни один. Кружки декоративны, весь смысл несёт подпись группы.
const STYLES = `
:where([data-vibeui-block="iconstack-001"]){
--vibeui-iconstack-001-size:2rem;
--vibeui-iconstack-001-overlap:0.625rem;
--vibeui-iconstack-001-ring:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-iconstack-001-more-bg:light-dark(oklch(0.93 0.006 265),oklch(0.34 0.012 265));
--vibeui-iconstack-001-more-fg:light-dark(oklch(0.4 0.014 265),oklch(0.8 0.012 265));
--vibeui-iconstack-001-surface:transparent;
--vibeui-iconstack-001-shell:light-dark(oklch(0.91 0.006 265),oklch(0.4 0.012 265));
--vibeui-iconstack-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложки по умолчанию нет: пилюля лежит на фоне страницы, а обводка кружка
   повторяет тот же фон. */
[data-vibeui-block="iconstack-001"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.5rem 0.875rem 0.5rem 0.625rem;
background:var(--vibeui-iconstack-001-surface);
border:1px solid var(--vibeui-iconstack-001-shell);border-radius:9999px;
font-family:var(--vibeui-iconstack-001-font);
}
/* Обратный флекс вместо z-index: левый кружок сам ложится поверх правого. */
[data-vibeui-block="iconstack-001"] [data-part="stack"]{
display:inline-flex;flex-direction:row-reverse;justify-content:flex-end;
}
[data-vibeui-block="iconstack-001"] [data-part="stack"] > *{
margin-right:calc(var(--vibeui-iconstack-001-overlap) * -1);
}
[data-vibeui-block="iconstack-001"] [data-part="stack"] > *:first-child{margin-right:0}
[data-vibeui-block="iconstack-001"] [data-part="face"],
[data-vibeui-block="iconstack-001"] [data-part="more"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-iconstack-001-size);height:var(--vibeui-iconstack-001-size);
box-sizing:border-box;border-radius:9999px;
border:2px solid var(--vibeui-iconstack-001-ring);
font-size:calc(var(--vibeui-iconstack-001-size) * 0.36);
font-weight:650;line-height:1;
}
/* Оттенок из имени: хеш, а не сумма кодов — иначе алфавит красится одинаково. */
[data-vibeui-block="iconstack-001"] [data-part="face"]{
background:oklch(0.9 0.06 var(--vibeui-iconstack-001-hue,265));
color:oklch(0.38 0.12 var(--vibeui-iconstack-001-hue,265));
}
[data-vibeui-block="iconstack-001"] [data-part="more"]{
background:var(--vibeui-iconstack-001-more-bg);color:var(--vibeui-iconstack-001-more-fg);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="iconstack-001"] [data-part="label"]{
font-size:0.8125rem;color:var(--vibeui-iconstack-001-more-fg);
}
[data-vibeui-block="iconstack-001"][data-size="sm"]{--vibeui-iconstack-001-size:1.5rem;--vibeui-iconstack-001-overlap:0.5rem}
[data-vibeui-block="iconstack-001"][data-size="lg"]{--vibeui-iconstack-001-size:2.75rem;--vibeui-iconstack-001-overlap:0.875rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="iconstack-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Реброва",
  "Илья Мохов",
  "Ким Сон",
  "Пётр Гай",
  "Мария Лоза",
  "Олег Дин",
]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
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
 * Стопка участников: перекрытие обратным флексом и остаток в «+N».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Iconstack001({
  names = DEFAULT_NAMES,
  max = 4,
  label = "работают над проектом",
  size = "md",
  background = "",
  className,
  style,
  ...props
}: Iconstack001Props) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  // Обводка кружка равна подложке: заданный фон красит и её, иначе вокруг
  // стопки останется белый контур от прежнего фона.
  const palette = {
    ...(background
      ? {
          "--vibeui-iconstack-001-surface": background,
          "--vibeui-iconstack-001-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-iconstack-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="iconstack-001"
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="stack" aria-hidden="true">
          {rest > 0 ? <span data-part="more">+{rest}</span> : null}
          {[...shown].reverse().map((name) => (
            <span
              key={name}
              data-part="face"
              style={
                { "--vibeui-iconstack-001-hue": hue(name) } as CSSProperties
              }
            >
              {initials(name)}
            </span>
          ))}
        </span>
        <span data-part="label">
          {names.length} {label}
        </span>
      </div>
    </>
  )
}
