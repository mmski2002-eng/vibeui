import type { ComponentProps, CSSProperties } from "react"

export type Tooltip002Props = Omit<ComponentProps<"div">, "title"> & {
  /** Текст, который показывают обе подсказки: разница только в механике. */
  tip?: string
  nativeLabel?: string
  customLabel?: string
  /** Подпись под левой кнопкой. */
  nativeCaption?: string
  /** Подпись под правой кнопкой. */
  customCaption?: string
  /** Вывод под обеими ячейками. */
  note?: string
  /** Показать собственную подсказку принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: наглядное сравнение. Слева кнопка с атрибутом title —
// подсказка появляется через секунду с лишним, в системном стиле, без стрелки
// и не читается с клавиатуры. Справа своя: мгновенная, со стрелкой, по фокусу.
const STYLES = `
:where([data-vibeui-block="tooltip-002"]){
--vibeui-tooltip-002-bg:transparent;
--vibeui-tooltip-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-tooltip-002-muted:color-mix(in oklab,var(--vibeui-tooltip-002-fg) 68%,transparent);
--vibeui-tooltip-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-tooltip-002-face:light-dark(oklch(0.98 0.003 265),oklch(0.29 0.012 265));
--vibeui-tooltip-002-tip:light-dark(oklch(0.26 0.014 265),oklch(0.36 0.014 265));
--vibeui-tooltip-002-accent:light-dark(oklch(0.57 0.17 265),oklch(0.72 0.16 265));
--vibeui-tooltip-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-002"]{color-scheme:dark}
[data-vibeui-block="tooltip-002"]{
display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;
padding:1.125rem;
border:1px solid var(--vibeui-tooltip-002-border);border-radius:1rem;
background:var(--vibeui-tooltip-002-bg);color:var(--vibeui-tooltip-002-fg);
font-family:var(--vibeui-tooltip-002-font);
}
[data-vibeui-block="tooltip-002"] [data-part="cell"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
padding:1.25rem 0.75rem 0.875rem;box-sizing:border-box;
border:1px dashed var(--vibeui-tooltip-002-border);border-radius:0.875rem;
text-align:center;
}
[data-vibeui-block="tooltip-002"] [data-part="caption"]{
margin:0;font-size:0.6875rem;line-height:1.4;letter-spacing:0.03em;
text-transform:uppercase;color:var(--vibeui-tooltip-002-muted);
}
[data-vibeui-block="tooltip-002"] [data-part="button"]{
appearance:none;cursor:pointer;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-002-border);
background:var(--vibeui-tooltip-002-face);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;
}
[data-vibeui-block="tooltip-002"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-002-accent);outline-offset:2px}
/* Своя подсказка: мгновенная, со стрелкой, открывается и по фокусу. */
[data-vibeui-block="tooltip-002"] [data-part="own"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-002"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:50%;z-index:20;
width:max-content;max-width:11rem;
padding:0.375rem 0.5625rem;border-radius:0.4375rem;
/* Обе ветки --tip тёмные — плашка подсказки тёмная всегда, поэтому подпись светлая без light-dark(). */
background:var(--vibeui-tooltip-002-tip);color:oklch(0.98 0.002 265);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .12s ease,transform .12s ease;
}
[data-vibeui-block="tooltip-002"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-002"] [data-part="own"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-002"] [data-part="own"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
/* Витринный режим: подсказка раскрыта без наведения — миниатюра каталога и
   скриншот показывают, о чём компонент. Плашка абсолютная, поэтому раскладка
   ячеек не меняется. */
[data-vibeui-block="tooltip-002"][data-open="true"] [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
[data-vibeui-block="tooltip-002"] [data-part="note"]{
grid-column:1 / -1;margin:0;
font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-002"] *{animation:none!important;transition:none!important}}
`

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
 * Сравнение нативного title и собственной подсказки на одном экране.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip002({
  tip = "Скопировать ссылку",
  nativeLabel = "Нативный title",
  customLabel = "Своя подсказка",
  nativeCaption = "задержка ~1 с, стиль системы",
  customCaption = "сразу, со стрелкой, по фокусу",
  note = "Нативная подсказка не появляется по Tab и не читается на телефоне. Своя открывается и по наведению, и по фокусу — и выглядит одинаково во всех системах.",
  open = false,
  background = "",
  className,
  style,
  ...props
}: Tooltip002Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-002"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        <div data-part="cell">
          <button data-part="button" type="button" title={tip}>
            {nativeLabel}
          </button>
          <p data-part="caption">{nativeCaption}</p>
        </div>
        <div data-part="cell">
          <span data-part="own">
            <button
              data-part="button"
              type="button"
              aria-describedby="vibeui-tooltip-002-tip"
            >
              {customLabel}
            </button>
            <span data-part="tip" role="tooltip" id="vibeui-tooltip-002-tip">
              {tip}
            </span>
          </span>
          <p data-part="caption">{customCaption}</p>
        </div>
        <p data-part="note">{note}</p>
      </div>
    </>
  )
}
