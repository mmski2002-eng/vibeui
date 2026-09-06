import type {
  ComponentProps,
  CSSProperties,
  MouseEventHandler,
  ReactNode,
} from "react"

export type Button044Props = Omit<
  ComponentProps<"div">,
  "children" | "onClick"
> & {
  children?: ReactNode
  /** Полный оборот бегунка в секундах. */
  speed?: number
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  accent?: string
}

// Идея компонента: по рамке бежит светлый сектор. Приём — вращающийся
// conic-gradient в подложке-обёртке, поверх которого лежит внутренняя
// поверхность: видимой остаётся только полоска толщиной в рамку. Вращается
// квадрат со стороной больше диагонали, иначе на углах сектор рвётся.
const STYLES = `
:where([data-vibeui-block="button-044"]){
--vibeui-button-044-speed:4s;
--vibeui-button-044-accent:light-dark(oklch(0.66 0.18 39.8),oklch(0.72 0.19 39.8));
--vibeui-button-044-track:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-button-044-inner:light-dark(oklch(0.99 0 265),oklch(0.22 0 265));
--vibeui-button-044-fg:light-dark(oklch(0.24 0 265),oklch(0.97 0 265));
/* Наведение уводит поверхность от фона, а не всегда в белый. */
--vibeui-button-044-hover-mix:light-dark(black,white);
--vibeui-button-044-radius:0.75rem;
--vibeui-button-044-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-044"]{color-scheme:dark}
[data-vibeui-block="button-044"]{
position:relative;display:inline-flex;overflow:hidden;
padding:1.5px;border-radius:var(--vibeui-button-044-radius);
background:var(--vibeui-button-044-track);
font-family:var(--vibeui-button-044-font);
isolation:isolate;
}
[data-vibeui-block="button-044"]::before{
content:"";position:absolute;left:50%;top:50%;
width:220%;aspect-ratio:1;z-index:0;
background:conic-gradient(from 0deg,transparent 0 62%,var(--vibeui-button-044-accent) 78%,transparent 88%);
animation:vibeui-button-044-run var(--vibeui-button-044-speed) linear infinite;
}
@keyframes vibeui-button-044-run{
from{transform:translate(-50%,-50%) rotate(0deg)}
to{transform:translate(-50%,-50%) rotate(360deg)}
}
[data-vibeui-block="button-044"] [data-part="button"]{
position:relative;z-index:1;
appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 1.125rem;
border-radius:calc(var(--vibeui-button-044-radius) - 1.5px);
background:var(--vibeui-button-044-inner);color:var(--vibeui-button-044-fg);
font:inherit;font-size:0.875rem;font-weight:650;line-height:1;
transition:background-color .16s ease;
}
[data-vibeui-block="button-044"] [data-part="button"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-button-044-inner) 92%,var(--vibeui-button-044-hover-mix));
}
[data-vibeui-block="button-044"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-button-044-accent);outline-offset:3px;
}
[data-vibeui-block="button-044"] [data-part="button"]:disabled{cursor:not-allowed;opacity:.55}
[data-vibeui-block="button-044"] [data-part="pulse"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:50%;
background:var(--vibeui-button-044-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-button-044-accent) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-044"] *{animation:none!important;transition:none!important}
[data-vibeui-block="button-044"]::before{animation:none!important;transform:translate(-50%,-50%) rotate(45deg)}
}
`

/**
 * Кнопка с бегущей рамкой: сектор conic-gradient крутится под поверхностью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button044({
  children = "Идёт генерация",
  speed = 4,
  disabled,
  onClick,
  accent,
  className,
  style,
  ...props
}: Button044Props) {
  const palette = {
    "--vibeui-button-044-speed": `${speed}s`,
    ...(accent ? { "--vibeui-button-044-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-044" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-044"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="button"
          disabled={disabled}
          onClick={onClick}
        >
          <span data-part="pulse" aria-hidden="true" />
          {children}
        </button>
      </div>
    </>
  )
}
