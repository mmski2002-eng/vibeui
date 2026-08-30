import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Tooltip001Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "id"
> & {
  /** Текст подсказки. */
  tip?: string
  /** Элемент, к которому она относится: кнопка, иконка, слово в тексте. */
  children?: ReactNode
  side?: "top" | "bottom"
  /** Показать подсказку принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Идентификатор для aria-describedby у вашего триггера. */
  id?: string
}

// Идея компонента: подсказка появляется и по наведению, и по фокусу с
// клавиатуры — второе обычно забывают, и подсказка остаётся недоступной
// половине пользователей. Всё держится на :hover и :focus-within, JS не нужен.
const STYLES = `
:where([data-vibeui-block="tooltip-001"]){
--vibeui-tooltip-001-fg:oklch(0.97 0.002 265);
--vibeui-tooltip-001-bg:oklch(0.26 0.014 265);
--vibeui-tooltip-001-radius:0.4375rem;
--vibeui-tooltip-001-gap:0.5rem;
--vibeui-tooltip-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-001"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-001-font);
}
[data-vibeui-block="tooltip-001"] [data-part="tip"]{
position:absolute;left:50%;z-index:20;
max-width:16rem;width:max-content;
padding:0.375rem 0.5625rem;
border-radius:var(--vibeui-tooltip-001-radius);
background:var(--vibeui-tooltip-001-bg);color:var(--vibeui-tooltip-001-fg);
font-size:0.75rem;line-height:1.4;text-align:center;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="tooltip-001"][data-side="top"] [data-part="tip"]{bottom:calc(100% + var(--vibeui-tooltip-001-gap))}
[data-vibeui-block="tooltip-001"][data-side="bottom"] [data-part="tip"]{top:calc(100% + var(--vibeui-tooltip-001-gap));transform:translate(-50%,-0.25rem)}
/* Хвостик — повёрнутый квадрат того же цвета. */
[data-vibeui-block="tooltip-001"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;width:0.5rem;height:0.5rem;
margin-left:-0.25rem;background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-001"][data-side="top"] [data-part="tip"]::after{bottom:-0.1875rem}
[data-vibeui-block="tooltip-001"][data-side="bottom"] [data-part="tip"]::after{top:-0.1875rem}
/* Наведение и фокус равноправны: подсказка обязана открываться с клавиатуры. */
[data-vibeui-block="tooltip-001"][data-open="true"] [data-part="tip"],
[data-vibeui-block="tooltip-001"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-001"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-001"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-заглушка превью: подсказке нужен триггер, а зависимостей у нас нет. */
const DEFAULT_TRIGGER_STYLE = `
[data-vibeui-block="tooltip-001"] [data-part="sample"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.5rem;
border:1px solid oklch(0.88 0.008 265);background:oklch(1 0 0);
color:oklch(0.35 0.014 265);font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="tooltip-001"] [data-part="sample"]:focus-visible{outline:2px solid oklch(0.55 0.2 262);outline-offset:2px}
`

/**
 * Подсказка, открывающаяся и по наведению, и по фокусу с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip001({
  tip = "Скопировать ссылку на проект",
  children,
  side = "top",
  open = false,
  id = "vibeui-tooltip-001",
  className,
  style,
  ...props
}: Tooltip001Props) {
  return (
    <>
      <style href="vibeui-tooltip-001" precedence="medium">
        {STYLES + DEFAULT_TRIGGER_STYLE}
      </style>
      <span
        {...props}
        data-vibeui-block="tooltip-001"
        data-side={side}
        data-open={open || undefined}
        className={className}
        style={style as CSSProperties}
      >
        {children ?? (
          <button data-part="sample" type="button" aria-describedby={id}>
            ⧉
          </button>
        )}
        <span data-part="tip" role="tooltip" id={id}>
          {tip}
        </span>
      </span>
    </>
  )
}
