import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  speed?: number
}

// Идея компонента: индикатор набора сообщения — форма чат-пузыря с тремя
// точками, которые подсвечиваются по очереди, а не волной. В отличие от
// общей точечной загрузки, здесь только одна точка ярка в любой момент
// времени: это читается как «идёт набор», а не как абстрактное ожидание.
// Тайминг — steps(), а не ease: подсветка перескакивает, а не перетекает.
const STYLES = `
:where([data-vibeui-block="spinner-007"]){
--vibeui-spinner-007-speed:1.05s;
--vibeui-spinner-007-dot:0.375rem;
--vibeui-spinner-007-surface:oklch(1 0 0);
--vibeui-spinner-007-border:oklch(0.9 0.006 265);
--vibeui-spinner-007-track:oklch(0.95 0.006 265);
--vibeui-spinner-007-fg:oklch(0.26 0.014 265);
--vibeui-spinner-007-muted:oklch(0.55 0.014 265);
--vibeui-spinner-007-accent:oklch(0.55 0.17 262);
--vibeui-spinner-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: подпись рядом с пузырём тёмная. */
[data-vibeui-block="spinner-007"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-spinner-007-surface);
border:1px solid var(--vibeui-spinner-007-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-007-font);color:var(--vibeui-spinner-007-fg);
font-size:0.8125rem;
}
/* Форма чат-пузыря с хвостиком: точки читаются как «печатает», а не «грузится». */
[data-vibeui-block="spinner-007"] [data-part="bubble"]{
position:relative;display:inline-flex;align-items:center;gap:0.3125rem;
padding:0.5rem 0.6875rem;border-radius:9999px;
background:var(--vibeui-spinner-007-track);
}
[data-vibeui-block="spinner-007"] [data-part="bubble"]::after{
content:"";position:absolute;left:0.5rem;bottom:-0.25rem;
width:0.5rem;height:0.5rem;border-radius:1px;
background:var(--vibeui-spinner-007-track);
transform:rotate(45deg);
}
[data-vibeui-block="spinner-007"] [data-part="dot"]{
width:var(--vibeui-spinner-007-dot);height:var(--vibeui-spinner-007-dot);
border-radius:9999px;background:var(--vibeui-spinner-007-accent);
opacity:.25;
animation:vibeui-spinner-007-chase var(--vibeui-spinner-007-speed) steps(1,end) infinite;
}
/* Точки перескакивают по очереди: подсвечена ровно одна из трёх. */
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(2){
animation-delay:calc(var(--vibeui-spinner-007-speed) / 3);
}
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(3){
animation-delay:calc(var(--vibeui-spinner-007-speed) / 3 * 2);
}
@keyframes vibeui-spinner-007-chase{
0%,33%{opacity:1}
34%,100%{opacity:.25}
}
[data-vibeui-block="spinner-007"] [data-part="label"]{font-weight:600;color:var(--vibeui-spinner-007-muted)}
/* Без движения точки замирают разной яркостью: «идёт набор» остаётся видимым. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-007"] [data-part="dot"]{animation:none!important}
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(1){opacity:1}
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(2){opacity:.55}
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(3){opacity:.25}
}
`

/**
 * Индикатор набора сообщения: точки в пузыре подсвечиваются по очереди.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner007({
  label = "Собеседник печатает",
  speed = 1.05,
  className,
  style,
  ...props
}: Spinner007Props) {
  const palette = {
    "--vibeui-spinner-007-speed": `${speed}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-007"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="bubble" aria-hidden="true">
          <span data-part="dot" />
          <span data-part="dot" />
          <span data-part="dot" />
        </span>
        <span data-part="label">{label}</span>
      </div>
    </>
  )
}
