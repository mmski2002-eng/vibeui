import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip008Props = Omit<
  ComponentPropsWithoutRef<"p">,
  "children"
> & {
  before?: string
  /** Термин: он остаётся частью строки, а не превращается в кнопку. */
  term?: string
  definition?: string
  after?: string
}

// Идея компонента: объяснение термина прямо в тексте. Слово подчёркнуто
// пунктиром — сигнал «здесь есть расшифровка», — но остаётся в строке и не
// ломает набор: подсказка выезжает поверх, ничего не сдвигая.
const STYLES = `
:where([data-vibeui-block="tooltip-008"]){
--vibeui-tooltip-008-bg:oklch(0.99 0.003 90);
--vibeui-tooltip-008-fg:oklch(0.28 0.012 265);
--vibeui-tooltip-008-border:oklch(0.9 0.008 90);
--vibeui-tooltip-008-mark:oklch(0.52 0.13 55);
--vibeui-tooltip-008-tip:oklch(0.25 0.014 265);
--vibeui-tooltip-008-font:ui-serif,Georgia,"Times New Roman",serif;
}
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
 * Термин в тексте на пунктирном подчёркивании с всплывающим объяснением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip008({
  before = "Мы платим за трафик по модели ",
  term = "95-й перцентиль",
  definition = "Из всех замеров за месяц отбрасываются пять процентов самых высоких, и счёт выставляется по следующему значению. Короткие всплески не попадают в оплату.",
  after = ", поэтому ночной бэкап не влияет на счёт.",
  className,
  style,
  ...props
}: Tooltip008Props) {
  return (
    <>
      <style href="vibeui-tooltip-008" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-vibeui-block="tooltip-008"
        className={className}
        style={style as CSSProperties}
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
