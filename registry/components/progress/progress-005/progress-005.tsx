import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress005Row = {
  label: string
  value: number
}

export type Progress005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  rows?: Progress005Row[]
  /** Ёмкость, к которой считаются доли. Ноль — берём сумму строк. */
  capacity?: number
  unit?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: расход по категориям читается не одной полосой, а
// столбиком полос с общей шкалой. Все дорожки нормированы на одну ёмкость,
// поэтому длины сравнимы между собой, а не каждая сама себе сто процентов.
// Оттенок каждой строки считается из её имени, поэтому список можно менять,
// не выдавая цвета руками.
const STYLES = `
:where([data-vibeui-block="progress-005"]){
--vibeui-progress-005-bg:transparent;
--vibeui-progress-005-fg:light-dark(oklch(0.25 0.016 265),oklch(0.94 0.006 265));
--vibeui-progress-005-muted:light-dark(oklch(0.56 0.014 265),oklch(0.7 0.012 265));
--vibeui-progress-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-progress-005-track:light-dark(oklch(0.94 0.004 265),oklch(0.3 0.011 265));
--vibeui-progress-005-hue:262;
--vibeui-progress-005-value:0;
--vibeui-progress-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-005"]{
display:flex;flex-direction:column;gap:0.875rem;
width:100%;max-width:28rem;box-sizing:border-box;padding:1rem 1.125rem;
background:var(--vibeui-progress-005-bg);
border:1px solid var(--vibeui-progress-005-border);border-radius:1rem;
font-family:var(--vibeui-progress-005-font);color:var(--vibeui-progress-005-fg);
}
[data-vibeui-block="progress-005"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="progress-005"] [data-part="free"]{
font-weight:500;color:var(--vibeui-progress-005-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-005"] ul{
display:flex;flex-direction:column;gap:0.625rem;margin:0;padding:0;list-style:none;
}
/* Строка: имя, значение и дорожка — сетка, чтобы числа стояли в колонку. */
[data-vibeui-block="progress-005"] li{
display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.75rem;
font-size:0.75rem;
}
[data-vibeui-block="progress-005"] [data-part="name"]{
display:flex;align-items:center;gap:0.4375rem;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="progress-005"] [data-part="chip"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:0.1875rem;
background:oklch(0.62 0.16 var(--vibeui-progress-005-hue));
}
[data-vibeui-block="progress-005"] [data-part="amount"]{
color:var(--vibeui-progress-005-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-005"] [data-part="track"]{
grid-column:1 / -1;
height:0.3125rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-progress-005-track);
}
[data-vibeui-block="progress-005"] [data-part="bar"]{
height:100%;border-radius:inherit;
width:calc(var(--vibeui-progress-005-value) * 1%);
background:oklch(0.62 0.16 var(--vibeui-progress-005-hue));
transition:width .3s cubic-bezier(.32,.72,0,1);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-005"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_ROWS: Progress005Row[] = [
  { label: "Видео", value: 148 },
  { label: "Фотографии", value: 96 },
  { label: "Документы", value: 34 },
  { label: "Кэш приложений", value: 21 },
]

const DEFAULT_TEXT: Record<string, string> = {
  used: "Занято {used} {unit}",
  free: "свободно {free} {unit}",
  value: "{name}: {value} {unit} из {total} {unit}",
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

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

/**
 * Расход по категориям столбиком полос с общей шкалой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress005({
  rows = DEFAULT_ROWS,
  capacity = 512,
  unit = "ГБ",
  text = DEFAULT_TEXT,
  background = "",
  className,
  style,
  ...props
}: Progress005Props) {
  const used = rows.reduce((sum, row) => sum + Math.max(0, row.value), 0)
  const scale = capacity > 0 ? capacity : used || 1
  const say = (key: string) => text[key] ?? DEFAULT_TEXT[key]
  const palette = {
    ...(background
      ? {
          "--vibeui-progress-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-005"
        className={className}
        style={palette}
      >
        <div data-part="total">
          <span>
            {say("used")
              .replace("{used}", String(used))
              .replace("{unit}", unit)}
          </span>
          <span data-part="free">
            {say("free")
              .replace("{free}", String(Math.max(0, scale - used)))
              .replace("{unit}", unit)}
          </span>
        </div>
        <ul>
          {rows.map((row) => {
            const percent = Math.min(
              100,
              Math.max(0, (row.value / scale) * 100),
            )

            return (
              <li
                key={row.label}
                style={
                  {
                    "--vibeui-progress-005-hue": hue(row.label),
                    "--vibeui-progress-005-value": percent,
                  } as CSSProperties
                }
              >
                <span data-part="name">
                  <span data-part="chip" aria-hidden="true" />
                  {row.label}
                </span>
                <span data-part="amount">
                  {row.value} {unit}
                </span>
                <div
                  data-part="track"
                  role="progressbar"
                  aria-label={row.label}
                  aria-valuemin={0}
                  aria-valuemax={scale}
                  aria-valuenow={row.value}
                  aria-valuetext={say("value")
                    .replace("{name}", row.label)
                    .replace("{value}", String(row.value))
                    .replace("{total}", String(scale))
                    .split("{unit}")
                    .join(unit)}
                >
                  <div data-part="bar" />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
