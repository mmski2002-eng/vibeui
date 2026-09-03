import type { ComponentProps, CSSProperties } from "react"

export type Tooltip006Props = Omit<ComponentProps<"div">, "children"> & {
  tip?: string
  /** Подписи трёх кнопок: у края, по центру и снова у края. */
  labels?: string[]
  /** Пояснение под рядом кнопок. */
  note?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: подсказка, которая не вылезает за край. У крайних кнопок
// она прижимается к своей стороне, а стрелка съезжает к триггеру — поэтому
// связь подсказки с кнопкой не теряется и обрезки нет ни справа, ни слева.
const STYLES = `
:where([data-vibeui-block="tooltip-006"]){
--vibeui-tooltip-006-bg:transparent;
--vibeui-tooltip-006-fg:light-dark(oklch(0.25 0.014 265),oklch(0.93 0.005 265));
--vibeui-tooltip-006-muted:color-mix(in oklab,var(--vibeui-tooltip-006-fg) 68%,transparent);
--vibeui-tooltip-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-tooltip-006-face:light-dark(oklch(0.98 0.003 265),oklch(0.29 0.012 265));
--vibeui-tooltip-006-tip:light-dark(oklch(0.24 0.014 265),oklch(0.36 0.014 265));
--vibeui-tooltip-006-accent:light-dark(oklch(0.57 0.17 265),oklch(0.72 0.16 265));
--vibeui-tooltip-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-006"]{color-scheme:dark}
[data-vibeui-block="tooltip-006"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;
padding:1.5rem 1rem 1.125rem;
border:1px solid var(--vibeui-tooltip-006-border);border-radius:1rem;
background:var(--vibeui-tooltip-006-bg);color:var(--vibeui-tooltip-006-fg);
font-family:var(--vibeui-tooltip-006-font);
}
[data-vibeui-block="tooltip-006"] [data-part="row"]{display:flex;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="tooltip-006"] [data-part="item"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-006"] [data-part="button"]{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-006-border);
background:var(--vibeui-tooltip-006-face);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;white-space:nowrap;
}
[data-vibeui-block="tooltip-006"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-006-accent);outline-offset:2px}
[data-vibeui-block="tooltip-006"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);z-index:20;
width:max-content;max-width:12rem;
padding:0.375rem 0.5625rem;border-radius:0.5rem;
/* Обе ветки --tip тёмные — плашка подсказки тёмная всегда, поэтому подпись светлая без light-dark(). */
background:var(--vibeui-tooltip-006-tip);color:oklch(0.98 0.002 265);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;translate:0 0.25rem;
transition:opacity .13s ease,translate .13s ease;
}
[data-vibeui-block="tooltip-006"] [data-part="tip"]::after{
content:"";position:absolute;bottom:-0.1875rem;width:0.5rem;height:0.5rem;
background:inherit;transform:rotate(45deg);
}
/* Переворот у края: подсказка прижата к своей стороне, стрелка едет к кнопке. */
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="start"] [data-part="tip"]{left:0}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="start"] [data-part="tip"]::after{left:1rem}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="center"] [data-part="tip"]{left:50%;margin-left:-6rem;width:12rem;text-align:center}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="center"] [data-part="tip"]::after{left:50%;margin-left:-0.25rem}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="end"] [data-part="tip"]{right:0;text-align:right}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="end"] [data-part="tip"]::after{right:1rem}
[data-vibeui-block="tooltip-006"] [data-part="item"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-006"] [data-part="item"]:focus-within [data-part="tip"]{opacity:1;translate:0 0}
[data-vibeui-block="tooltip-006"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-006"] *{animation:none!important;transition:none!important}}
`

const ALIGNMENTS = ["start", "center", "end"] as const
const DEFAULT_LABELS = ["У левого края", "По центру", "У правого края"]

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
 * Подсказка со стрелкой, которая переворачивается у края области.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip006({
  tip = "Экспорт в CSV",
  labels = DEFAULT_LABELS,
  note = "Наведите на крайние кнопки: подсказка прижимается к своей стороне, а стрелка съезжает к кнопке — за границу области ничего не выходит.",
  background = "",
  className,
  style,
  ...props
}: Tooltip006Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-006"
        className={className}
        style={palette}
      >
        <div data-part="row">
          {labels.slice(0, 3).map((label, index) => (
            <span
              data-part="item"
              data-align={ALIGNMENTS[index] ?? "center"}
              key={label}
            >
              <button
                data-part="button"
                type="button"
                aria-describedby={`vibeui-tooltip-006-${index}`}
              >
                {label}
              </button>
              <span
                data-part="tip"
                role="tooltip"
                id={`vibeui-tooltip-006-${index}`}
              >
                {tip}
              </span>
            </span>
          ))}
        </div>
        <p data-part="note">{note}</p>
      </div>
    </>
  )
}
