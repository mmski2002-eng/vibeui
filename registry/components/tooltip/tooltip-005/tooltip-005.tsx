import type { ComponentProps, CSSProperties } from "react"

export type Tooltip005Props = Omit<ComponentProps<"span">, "children"> & {
  label?: string
  /** Длинный текст: подсказка рассчитана на два-четыре предложения. */
  tip?: string
  /** Предельная ширина подсказки. Строка длиннее 60 знаков не читается. */
  tipWidth?: string
  /** Показать подсказку принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Цвет самой подсказки. Пусто — собственный тёмный тон. */
  background?: string
}

// Идея компонента: подсказка для длинного объяснения. Ширина ограничена, текст
// выключен по левому краю и переносится по словам с балансировкой строк —
// однострочная подсказка на 400 пикселей нечитаема, а обрезать текст нельзя.
const STYLES = `
:where([data-vibeui-block="tooltip-005"]){
--vibeui-tooltip-005-bg:oklch(0.25 0.014 265);
--vibeui-tooltip-005-fg:light-dark(oklch(0.26 0.014 265),oklch(0.96 0.002 265));
--vibeui-tooltip-005-accent:light-dark(oklch(0.6 0.16 265),oklch(0.74 0.15 265));
--vibeui-tooltip-005-face:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-tooltip-005-line:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-tooltip-005-facefg:light-dark(oklch(0.3 0.014 265),oklch(0.92 0.006 265));
--vibeui-tooltip-005-mark:light-dark(oklch(0.9 0.008 265),oklch(0.36 0.012 265));
--vibeui-tooltip-005-markfg:light-dark(oklch(0.42 0.014 265),oklch(0.88 0.008 265));
--vibeui-tooltip-005-width:17rem;
--vibeui-tooltip-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-005"]{color-scheme:dark}
[data-vibeui-block="tooltip-005"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-005-font);
}
[data-vibeui-block="tooltip-005"] [data-part="trigger"]{
appearance:none;cursor:help;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-005-line);
background:var(--vibeui-tooltip-005-face);color:var(--vibeui-tooltip-005-facefg);
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="tooltip-005"] [data-part="trigger"]::after{
content:"?";display:inline-flex;align-items:center;justify-content:center;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
background:var(--vibeui-tooltip-005-mark);color:var(--vibeui-tooltip-005-markfg);
font-size:0.6875rem;font-weight:800;
}
[data-vibeui-block="tooltip-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-tooltip-005-accent);outline-offset:2px}
/* Ширина ограничена переменной, текст переносится по словам и балансируется.
   Плашка намеренно тёмная в обеих темах, поэтому у неё своя ветка
   color-scheme: цвет текста считается от плашки, а не от страницы. */
[data-vibeui-block="tooltip-005"] [data-part="tip"]{
color-scheme:dark;
position:absolute;bottom:calc(100% + 0.5625rem);left:50%;z-index:20;
width:var(--vibeui-tooltip-005-width);max-width:calc(100vw - 2rem);
box-sizing:border-box;padding:0.5625rem 0.6875rem;border-radius:0.625rem;
background:var(--vibeui-tooltip-005-bg);color:var(--vibeui-tooltip-005-fg);
font-size:0.75rem;line-height:1.5;text-align:left;
white-space:normal;overflow-wrap:anywhere;text-wrap:pretty;hyphens:auto;
box-shadow:0 18px 38px -26px oklch(0.15 0.02 265 / 70%);
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="tooltip-005"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:var(--vibeui-tooltip-005-bg);transform:rotate(45deg);
}
[data-vibeui-block="tooltip-005"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-005"]:focus-within [data-part="tip"]{opacity:1;transform:translate(-50%,0)}
/* Витринный режим: подсказка раскрыта без наведения. Текста здесь на четыре
   строки, и абсолютной плашке над кнопкой не хватает места в кадре витрины —
   поэтому она встаёт в поток под кнопкой, а стрелка переворачивается вверх. */
[data-vibeui-block="tooltip-005"][data-open="true"]{flex-direction:column;align-items:center;gap:0.5625rem}
[data-vibeui-block="tooltip-005"][data-open="true"] [data-part="tip"]{
opacity:1;position:static;transform:none;box-shadow:none;
}
[data-vibeui-block="tooltip-005"][data-open="true"] [data-part="tip"]::after{top:-0.1875rem;bottom:auto}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-005"] *{animation:none!important;transition:none!important}}
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
 * Подсказка с длинным текстом: ограниченная ширина и перенос по словам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip005({
  label = "Как считается остаток",
  tip = "Остаток — это оплаченный объём минус израсходованный за текущий период. Перерасход не блокирует работу: он переносится в следующий счёт отдельной строкой.",
  tipWidth = "17rem",
  open = false,
  background = "",
  className,
  style,
  ...props
}: Tooltip005Props) {
  const palette = {
    "--vibeui-tooltip-005-width": tipWidth,
    ...(background ? { "--vibeui-tooltip-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-005" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-005"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        <button
          data-part="trigger"
          type="button"
          aria-describedby="vibeui-tooltip-005-tip"
        >
          {label}
        </button>
        <span
          data-part="tip"
          role="tooltip"
          id="vibeui-tooltip-005-tip"
          style={
            background
              ? { colorScheme: schemeForBackground(background) }
              : undefined
          }
        >
          {tip}
        </span>
      </span>
    </>
  )
}
