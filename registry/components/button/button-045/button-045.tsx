import type { ComponentProps, CSSProperties } from "react"

export type Button045Props = ComponentProps<"button"> & {
  /** Высота нижней грани в пикселях: глубина хода клавиши. */
  depth?: number
  accent?: string
}

// Идея компонента: настоящий ход клавиши. Объём даёт не размытая тень,
// а жёсткая нижняя грань box-shadow без блюра; на :active кнопка опускается
// ровно на её высоту, а грань исчезает — сумма высот постоянна, поэтому
// соседи в ряду не дёргаются. Внутренний блик сверху добавляет пластик.
const STYLES = `
:where([data-vibeui-block="button-045"]){
--vibeui-button-045-depth:5px;
--vibeui-button-045-accent:light-dark(oklch(0.62 0.19 55),oklch(0.7 0.18 55));
--vibeui-button-045-edge:light-dark(oklch(0.44 0.15 55),oklch(0.5 0.15 55));
--vibeui-button-045-fg:light-dark(oklch(0.99 0.02 55),oklch(0.98 0.022 55));
--vibeui-button-045-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-045"]{color-scheme:dark}
[data-vibeui-block="button-045"]{
appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.75rem;padding:0 1.25rem;border-radius:0.75rem;
background:var(--vibeui-button-045-accent);color:var(--vibeui-button-045-fg);
font-family:var(--vibeui-button-045-font);font-size:0.9375rem;font-weight:700;line-height:1;
box-shadow:
0 var(--vibeui-button-045-depth) 0 0 var(--vibeui-button-045-edge),
inset 0 1px 0 0 oklch(1 0 0 / 28%);
transform:translateY(0);
transition:transform .08s ease,box-shadow .08s ease,filter .16s ease;
}
[data-vibeui-block="button-045"]:hover:not(:disabled){filter:brightness(1.05)}
/* Ход клавиши: смещение равно исчезнувшей грани, общая высота не меняется. */
[data-vibeui-block="button-045"]:active:not(:disabled){
transform:translateY(var(--vibeui-button-045-depth));
box-shadow:0 0 0 0 var(--vibeui-button-045-edge),inset 0 1px 0 0 oklch(1 0 0 / 18%);
}
[data-vibeui-block="button-045"]:focus-visible{outline:2px solid var(--vibeui-button-045-edge);outline-offset:3px}
[data-vibeui-block="button-045"]:disabled{cursor:not-allowed;opacity:.55}
[data-vibeui-block="button-045"] [data-part="key"]{
flex:none;width:0.875rem;height:0.875rem;border-radius:0.25rem;
background:oklch(1 0 0 / 30%);box-shadow:inset 0 -1.5px 0 0 oklch(0 0 0 / 18%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-045"]{transition:none!important}}
`

/**
 * Кнопка с эффектом нажатия: жёсткая нижняя грань и настоящий ход клавиши.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button045({
  depth = 5,
  accent,
  type = "button",
  className,
  style,
  children = "Нажми меня",
  ...props
}: Button045Props) {
  const palette = {
    "--vibeui-button-045-depth": `${depth}px`,
    ...(accent ? { "--vibeui-button-045-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-045" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-045"
        className={className}
        style={palette}
      >
        <span data-part="key" aria-hidden="true" />
        {children}
      </button>
    </>
  )
}
