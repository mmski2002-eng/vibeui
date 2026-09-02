import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  tip?: string
  /** Подписи двух пунктов: верхнего и нижнего в списке. */
  labels?: [string, string]
  /** Пояснение под пунктами: компонент несёт русское, проект подставляет своё. */
  note?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: подсказка меняет сторону по месту на экране, а не по
// горизонтали, как выравнивание у края области. У пункта возле верхнего края
// она раскрывается вниз, у пункта возле нижнего края — вверх, и стрелка
// каждый раз указывает на свой триггер, а не в одну сторону по умолчанию.
//
// Тема берётся из color-scheme окружения через light-dark(): подсказка
// светлеет там, где темнеет страница, и собственной плашки под собой блок
// не выкладывает.
const STYLES = `
:where([data-vibeui-block="tooltip-013"]){
--vibeui-tooltip-013-bg:transparent;
--vibeui-tooltip-013-fg:light-dark(oklch(0.25 0.014 265),oklch(0.93 0.006 265));
--vibeui-tooltip-013-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-tooltip-013-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-tooltip-013-face:light-dark(oklch(0.98 0.003 265),oklch(0.3 0.012 265));
--vibeui-tooltip-013-tip:light-dark(oklch(0.24 0.014 265),oklch(0.9 0.008 265));
--vibeui-tooltip-013-tipfg:light-dark(oklch(0.98 0.002 265),oklch(0.22 0.014 265));
--vibeui-tooltip-013-accent:light-dark(oklch(0.57 0.17 265),oklch(0.75 0.15 265));
--vibeui-tooltip-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-013"]{
display:flex;flex-direction:column;justify-content:space-between;gap:1.5rem;
width:100%;max-width:20rem;height:9rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-tooltip-013-border);border-radius:1rem;
background:var(--vibeui-tooltip-013-bg);color:var(--vibeui-tooltip-013-fg);
font-family:var(--vibeui-tooltip-013-font);
}
[data-vibeui-block="tooltip-013"] [data-part="item"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-013"] [data-part="button"]{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.8125rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-013-border);
background:var(--vibeui-tooltip-013-face);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;
}
[data-vibeui-block="tooltip-013"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-013-accent);outline-offset:2px}
[data-vibeui-block="tooltip-013"] [data-part="tip"]{
position:absolute;left:50%;z-index:20;
width:max-content;max-width:11rem;
padding:0.375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-013-tip);color:var(--vibeui-tooltip-013-tipfg);
font-size:0.75rem;line-height:1.4;text-align:center;
pointer-events:none;opacity:0;
transition:opacity .13s ease,transform .13s ease;
}
[data-vibeui-block="tooltip-013"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;width:0.5rem;height:0.5rem;
margin-left:-0.25rem;background:inherit;transform:rotate(45deg);
}
/* Пункт у верхнего края: подсказке некуда открыться вверх — раскрывается вниз. */
[data-vibeui-block="tooltip-013"] [data-part="item"][data-side="bottom"] [data-part="tip"]{
top:calc(100% + 0.5rem);transform:translate(-50%,-0.25rem);
}
[data-vibeui-block="tooltip-013"] [data-part="item"][data-side="bottom"] [data-part="tip"]::after{top:-0.1875rem}
/* Пункт у нижнего края: раскрывается вверх, чтобы не срезаться о низ области. */
[data-vibeui-block="tooltip-013"] [data-part="item"][data-side="top"] [data-part="tip"]{
bottom:calc(100% + 0.5rem);transform:translate(-50%,0.25rem);
}
[data-vibeui-block="tooltip-013"] [data-part="item"][data-side="top"] [data-part="tip"]::after{bottom:-0.1875rem}
[data-vibeui-block="tooltip-013"] [data-part="item"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-013"] [data-part="item"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
[data-vibeui-block="tooltip-013"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-013-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LABELS: [string, string] = ["У верхнего края", "У нижнего края"]

const DEFAULT_NOTE =
  "Верхний пункт раскрывает подсказку вниз, нижний — вверх: сторону задаёт data-side, а не автоматический замер места."

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
 * Подсказка со стрелкой, которая переключает сторону всплытия по месту на
 * экране: сверху раскрывается вниз, снизу — вверх. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Tooltip013({
  tip = "Добавить в закладки",
  labels = DEFAULT_LABELS,
  note = DEFAULT_NOTE,
  background = "",
  className,
  style,
  ...props
}: Tooltip013Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-013"
        className={className}
        style={palette}
      >
        <span data-part="item" data-side="bottom">
          <button
            data-part="button"
            type="button"
            aria-describedby="vibeui-tooltip-013-0"
          >
            {labels[0]}
          </button>
          <span data-part="tip" role="tooltip" id="vibeui-tooltip-013-0">
            {tip}
          </span>
        </span>
        <span data-part="item" data-side="top">
          <button
            data-part="button"
            type="button"
            aria-describedby="vibeui-tooltip-013-1"
          >
            {labels[1]}
          </button>
          <span data-part="tip" role="tooltip" id="vibeui-tooltip-013-1">
            {tip}
          </span>
        </span>
        <p data-part="note">{note}</p>
      </div>
    </>
  )
}
