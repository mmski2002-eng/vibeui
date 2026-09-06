import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Tooltip001Props = Omit<
  ComponentProps<"span">,
  "children" | "id"
> & {
  /** Текст подсказки. */
  tip?: string
  /** Элемент, к которому она относится: кнопка, иконка, слово в тексте. */
  children?: ReactNode
  side?: "top" | "bottom"
  /** Показать подсказку принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Цвет самой подсказки. Пусто — собственный тёмный тон. */
  background?: string
  /** Идентификатор для aria-describedby у вашего триггера. */
  id?: string
}

// Идея компонента: подсказка появляется и по наведению, и по фокусу с
// клавиатуры — второе обычно забывают, и подсказка остаётся недоступной
// половине пользователей. Всё держится на :hover и :focus-within, JS не нужен.
const STYLES = `
:where([data-vibeui-block="tooltip-001"]){
--vibeui-tooltip-001-fg:light-dark(oklch(0.24 0 265),oklch(0.97 0 265));
--vibeui-tooltip-001-bg:oklch(0.26 0 265);
--vibeui-tooltip-001-radius:0.4375rem;
--vibeui-tooltip-001-gap:0.5rem;
--vibeui-tooltip-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-001"]{color-scheme:dark}
[data-vibeui-block="tooltip-001"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-001-font);
}
/* Подсказка намеренно остаётся тёмной плашкой в обеих темах, поэтому у неё
   своя ветка темы: цвет текста считается от плашки, а не от страницы. */
[data-vibeui-block="tooltip-001"] [data-part="tip"]{
color-scheme:dark;
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
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
background:light-dark(oklch(1 0 0),oklch(0.25 0 265));
color:light-dark(oklch(0.35 0 265),oklch(0.9 0 265));font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="tooltip-001"] [data-part="sample"]:focus-visible{outline:2px solid light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.18 39.8));outline-offset:2px}
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
 * Подсказка, открывающаяся и по наведению, и по фокусу с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip001({
  tip = "Скопировать ссылку на проект",
  children,
  side = "top",
  open = false,
  background = "",
  id = "vibeui-tooltip-001",
  className,
  style,
  ...props
}: Tooltip001Props) {
  const palette = {
    ...(background ? { "--vibeui-tooltip-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-001" precedence="medium">
        {STYLES + DEFAULT_TRIGGER_STYLE}
      </style>
      <span
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-001"
        data-side={side}
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        {children ?? (
          <button data-part="sample" type="button" aria-describedby={id}>
            ⧉
          </button>
        )}
        <span
          data-part="tip"
          role="tooltip"
          id={id}
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
