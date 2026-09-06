import type { ComponentProps, CSSProperties } from "react"

export type Card014Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  label?: string
  value?: string
  /** Изменение в процентах. Знак решает направление стрелки и цвет. */
  delta?: number
  /** Изменение в абсолютных единицах: «+164 000 ₽». Строка, готовая к показу. */
  deltaValue?: string
  /** С чем сравниваем: «против прошлой недели». */
  baseline?: string
  /** true для метрик, где рост — плохая новость: отток, ошибки, время ответа. */
  invert?: boolean
  /** Что читает скринридер перед процентом: рост, снижение, без изменений. */
  directionText?: Record<string, string>
  /** Шаблон процента: {sign} — знак, {value} — величина без знака. */
  deltaTemplate?: string
  /** Локаль для форматирования процента. */
  locale?: string
  /** Пусто — подложки нет, плитка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: показатель, у которого главное — не число, а дельта.
// Дельта дана трижды: знаком, процентом и абсолютной величиной, потому что
// «+12 %» без базы ничего не значит. Цвет считается от invert: рост оттока
// и рост выручки — разные новости, а не разный знак.
const STYLES = `
:where([data-vibeui-block="card-014"]){
--vibeui-card-014-bg:transparent;
--vibeui-card-014-surface:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-card-014-ink:light-dark(oklch(0.2 0 265),oklch(0.97 0 265));
--vibeui-card-014-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-card-014-muted:color-mix(in oklab,var(--vibeui-card-014-fg) 68%,transparent);
--vibeui-card-014-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-014-good:light-dark(oklch(0.55 0.14 152),oklch(0.74 0.13 152));
--vibeui-card-014-bad:light-dark(oklch(0.56 0.19 27),oklch(0.72 0.16 27));
--vibeui-card-014-flat:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-card-014-tone:var(--vibeui-card-014-flat);
--vibeui-card-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-014"]{color-scheme:dark}
[data-vibeui-block="card-014"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:17rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-card-014-bg);color:var(--vibeui-card-014-fg);
border:1px solid var(--vibeui-card-014-border);border-radius:0.875rem;
font-family:var(--vibeui-card-014-font);
}
[data-vibeui-block="card-014"][data-tone="good"]{--vibeui-card-014-tone:var(--vibeui-card-014-good)}
[data-vibeui-block="card-014"][data-tone="bad"]{--vibeui-card-014-tone:var(--vibeui-card-014-bad)}
[data-vibeui-block="card-014"] [data-part="label"]{
margin:0;font-size:0.8125rem;font-weight:600;letter-spacing:0.02em;
color:var(--vibeui-card-014-muted);
}
[data-vibeui-block="card-014"] [data-part="row"]{
display:flex;align-items:baseline;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="card-014"] [data-part="value"]{
font-size:1.75rem;font-weight:680;line-height:1.05;letter-spacing:-0.025em;
font-variant-numeric:tabular-nums;
}
/* Дельта несёт знак и стрелку, а не только цвет: в печати цвет исчезает,
   а при дальтонизме зелёный и красный сливаются. */
[data-vibeui-block="card-014"] [data-part="delta"]{
position:relative;display:inline-flex;align-items:center;gap:0.25rem;
height:1.375rem;padding:0 0.4375rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-card-014-tone) 12%,var(--vibeui-card-014-surface));
color:color-mix(in oklab,var(--vibeui-card-014-tone) 82%,var(--vibeui-card-014-ink));
font-size:0.8125rem;font-weight:680;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-014"] [data-part="arrow"]{width:0.625rem;height:0.625rem;flex:none}
[data-vibeui-block="card-014"][data-direction="down"] [data-part="arrow"]{transform:rotate(180deg)}
[data-vibeui-block="card-014"][data-direction="flat"] [data-part="arrow"]{display:none}
[data-vibeui-block="card-014"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0.1875rem 0 0;padding-top:0.5rem;
border-top:1px solid var(--vibeui-card-014-border);
font-size:0.75rem;color:var(--vibeui-card-014-muted);
}
[data-vibeui-block="card-014"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="card-014"] [data-part="abs"]{
color:var(--vibeui-card-014-fg);font-weight:640;font-variant-numeric:tabular-nums;
}
`

const DIRECTION_TEXT: Record<string, string> = {
  up: "рост на ",
  down: "снижение на ",
  flat: "без изменений, ",
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
 * Плитка показателя с дельтой: знак, процент и абсолютное изменение
 * рядом с базой сравнения. Один файл, ноль зависимостей.
 */
export function Card014({
  label = "Выручка за неделю",
  value = "1 284 000 ₽",
  delta = 12.4,
  deltaValue = "+164 000 ₽",
  baseline = "против прошлой недели",
  invert = false,
  directionText = DIRECTION_TEXT,
  deltaTemplate = "{sign}{value} %",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Card014Props) {
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat"
  const tone =
    direction === "flat"
      ? "flat"
      : (direction === "up") !== invert
        ? "good"
        : "bad"
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : ""
  const printed = deltaTemplate
    .replace("{sign}", sign)
    .replace("{value}", Math.abs(delta).toLocaleString(locale))

  const palette = {
    ...(accent ? { "--vibeui-card-014-good": accent } : null),
    ...(background
      ? {
          "--vibeui-card-014-bg": background,
          "--vibeui-card-014-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-014" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-014"
        data-tone={tone}
        data-direction={direction}
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <p data-part="row">
          <span data-part="value">{value}</span>
          <span data-part="delta">
            <span data-part="sr">
              {directionText[direction] ?? DIRECTION_TEXT[direction]}
            </span>
            <svg
              data-part="arrow"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 8.5V1.5M5 1.5 1.8 4.7M5 1.5l3.2 3.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {printed}
          </span>
        </p>
        <p data-part="foot">
          <span>{baseline}</span>
          {deltaValue ? <span data-part="abs">{deltaValue}</span> : null}
        </p>
      </article>
    </>
  )
}
