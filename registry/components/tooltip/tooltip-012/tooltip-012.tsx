import type { ComponentProps, CSSProperties } from "react"

export type Tooltip012Props = Omit<ComponentProps<"span">, "children"> & {
  /** Заголовок первой строки: короткое имя термина или поля. */
  heading?: string
  /** Вторая строка: развёрнутое пояснение в одно предложение. */
  detail?: string
  /** Показать подсказку принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Цвет самой подсказки. Пусто — собственный тёмный тон. */
  background?: string
}

// Идея компонента: круглая иконка-вопрос без подписи рядом. Подсказка внутри
// всегда держит две строки — жирный заголовок и обычное пояснение под ним,
// а не один сплошной абзац, как в подсказке с длинным текстом.
const STYLES = `
:where([data-vibeui-block="tooltip-012"]){
--vibeui-tooltip-012-bg:oklch(0.24 0.014 265);
--vibeui-tooltip-012-fg:light-dark(oklch(0.24 0.014 265),oklch(0.97 0.002 265));
--vibeui-tooltip-012-muted:color-mix(in oklab,var(--vibeui-tooltip-012-fg) 68%,transparent);
--vibeui-tooltip-012-mark:light-dark(oklch(0.55 0.014 265),oklch(0.84 0.008 265));
--vibeui-tooltip-012-face:light-dark(oklch(0.95 0.004 265),oklch(0.3 0.012 265));
--vibeui-tooltip-012-line:light-dark(oklch(0.82 0.008 265),oklch(0.44 0.012 265));
--vibeui-tooltip-012-accent:light-dark(oklch(0.6 0.16 265),oklch(0.74 0.15 265));
--vibeui-tooltip-012-width:13.5rem;
--vibeui-tooltip-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-012"]{color-scheme:dark}
[data-vibeui-block="tooltip-012"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-012-font);
}
[data-vibeui-block="tooltip-012"] [data-part="trigger"]{
appearance:none;cursor:help;padding:0;
display:inline-flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:9999px;
border:1px solid var(--vibeui-tooltip-012-line);background:var(--vibeui-tooltip-012-face);
color:var(--vibeui-tooltip-012-mark);font:inherit;font-size:0.6875rem;font-weight:800;
}
[data-vibeui-block="tooltip-012"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-tooltip-012-accent);outline-offset:2px}
/* Ширина фиксирована узко, поэтому пояснение занимает вторую строку само.
   Плашка намеренно тёмная в обеих темах, поэтому у неё своя ветка
   color-scheme: цвет текста считается от плашки, а не от страницы. */
[data-vibeui-block="tooltip-012"] [data-part="tip"]{
color-scheme:dark;
position:absolute;bottom:calc(100% + 0.5625rem);left:50%;z-index:20;
display:flex;flex-direction:column;gap:0.1875rem;
width:var(--vibeui-tooltip-012-width);box-sizing:border-box;
padding:0.5625rem 0.6875rem;border-radius:0.625rem;
background:var(--vibeui-tooltip-012-bg);color:var(--vibeui-tooltip-012-fg);
text-align:left;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="tooltip-012"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-012"] [data-part="heading"]{font-size:0.8125rem;font-weight:700;line-height:1.3}
[data-vibeui-block="tooltip-012"] [data-part="detail"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-tooltip-012-muted)}
[data-vibeui-block="tooltip-012"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-012"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
/* Витринный режим: подсказка раскрыта без наведения — иначе на миниатюре
   каталога виден только круглый значок. Плашка абсолютная, значок не съезжает. */
[data-vibeui-block="tooltip-012"][data-open="true"] [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-012"] *{animation:none!important;transition:none!important}}
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
 * Иконка-вопрос с подсказкой из двух строк: заголовок и пояснение под ним.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip012({
  heading = "Пробный период",
  detail = "14 дней с полным доступом. Карта не требуется, отменить можно в любой момент.",
  open = false,
  background = "",
  className,
  style,
  ...props
}: Tooltip012Props) {
  const palette = {
    ...(background ? { "--vibeui-tooltip-012-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-012" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-012"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        <button
          data-part="trigger"
          type="button"
          aria-describedby="vibeui-tooltip-012-tip"
        >
          ?
        </button>
        <span
          data-part="tip"
          role="tooltip"
          id="vibeui-tooltip-012-tip"
          style={
            background
              ? { colorScheme: schemeForBackground(background) }
              : undefined
          }
        >
          <span data-part="heading">{heading}</span>
          <span data-part="detail">{detail}</span>
        </span>
      </span>
    </>
  )
}
