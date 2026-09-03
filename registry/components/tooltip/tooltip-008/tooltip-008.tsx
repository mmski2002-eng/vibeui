import type { ComponentProps, CSSProperties } from "react"

export type Tooltip008Props = Omit<ComponentProps<"p">, "children"> & {
  before?: string
  /** Термин: он остаётся частью строки, а не превращается в кнопку. */
  term?: string
  definition?: string
  after?: string
  /** Пусто — подложки нет, абзац лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: объяснение термина прямо в тексте. Слово подчёркнуто
// пунктиром — сигнал «здесь есть расшифровка», — но остаётся в строке и не
// ломает набор: подсказка выезжает поверх, ничего не сдвигая.
const STYLES = `
:where([data-vibeui-block="tooltip-008"]){
--vibeui-tooltip-008-bg:transparent;
--vibeui-tooltip-008-fg:light-dark(oklch(0.28 0.012 265),oklch(0.92 0.006 265));
--vibeui-tooltip-008-border:light-dark(oklch(0.9 0.008 90),oklch(0.37 0.01 90));
--vibeui-tooltip-008-mark:light-dark(oklch(0.52 0.13 55),oklch(0.76 0.12 55));
--vibeui-tooltip-008-tip:light-dark(oklch(0.25 0.014 265),oklch(0.35 0.014 265));
--vibeui-tooltip-008-font:ui-serif,Georgia,"Times New Roman",serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-008"]{color-scheme:dark}
[data-vibeui-block="tooltip-008"]{
width:100%;max-width:30rem;box-sizing:border-box;
margin:0;padding:1.25rem 1.375rem;
border:1px solid var(--vibeui-tooltip-008-border);border-radius:0.875rem;
background:var(--vibeui-tooltip-008-bg);color:var(--vibeui-tooltip-008-fg);
font-family:var(--vibeui-tooltip-008-font);font-size:1rem;line-height:1.65;
text-wrap:pretty;
}
/* Термин остаётся словом в строке: не кнопка, не ссылка, набор не рвётся. */
[data-vibeui-block="tooltip-008"] [data-part="term"]{
position:relative;
color:var(--vibeui-tooltip-008-mark);font-weight:600;cursor:help;
text-decoration:underline dotted currentColor;
text-underline-offset:0.22em;text-decoration-thickness:from-font;
border-radius:0.1875rem;
}
[data-vibeui-block="tooltip-008"] [data-part="term"]:focus-visible{outline:2px solid var(--vibeui-tooltip-008-mark);outline-offset:2px}
[data-vibeui-block="tooltip-008"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.45em);left:50%;z-index:20;
width:16rem;max-width:70vw;box-sizing:border-box;
padding:0.5rem 0.6875rem;border-radius:0.5rem;
/* Обе ветки --tip тёмные — плашка подсказки тёмная всегда, поэтому подпись светлая без light-dark(). */
background:var(--vibeui-tooltip-008-tip);color:oklch(0.97 0.002 265);
font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
font-size:0.75rem;font-weight:400;line-height:1.5;text-align:left;
box-shadow:0 18px 36px -26px oklch(0.15 0.02 265 / 70%);
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="tooltip-008"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-008"] [data-part="term"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-008"] [data-part="term"]:focus-visible [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-008"] *{animation:none!important;transition:none!important}}
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
 * Термин в тексте на пунктирном подчёркивании с всплывающим объяснением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip008({
  before = "Мы платим за трафик по модели ",
  term = "95-й перцентиль",
  definition = "Из всех замеров за месяц отбрасываются пять процентов самых высоких, и счёт выставляется по следующему значению. Короткие всплески не попадают в оплату.",
  after = ", поэтому ночной бэкап не влияет на счёт.",
  background = "",
  className,
  style,
  ...props
}: Tooltip008Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-008" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-008"
        className={className}
        style={palette}
      >
        {before}
        <span
          data-part="term"
          tabIndex={0}
          aria-describedby="vibeui-tooltip-008-tip"
        >
          {term}
          <span data-part="tip" role="tooltip" id="vibeui-tooltip-008-tip">
            {definition}
          </span>
        </span>
        {after}
      </p>
    </>
  )
}
