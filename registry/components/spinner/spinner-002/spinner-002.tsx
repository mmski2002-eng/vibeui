import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  speed?: number
}

// Идея компонента: ожидание тремя точками вместо кольца. Точки занимают
// меньше высоты, чем кольцо, и потому встают в строку рядом с текстом, не
// раздвигая её. Волна собрана задержками, посчитанными от одной длительности,
// поэтому темп меняется одним числом. При запрете движения точки замирают
// разной яркостью — сообщение «идёт работа» остаётся, мигание исчезает.
const STYLES = `
:where([data-vibeui-block="spinner-002"]){
--vibeui-spinner-002-speed:1.2s;
--vibeui-spinner-002-dot:0.4375rem;
--vibeui-spinner-002-surface:oklch(1 0 0);
--vibeui-spinner-002-border:oklch(0.9 0.006 265);
--vibeui-spinner-002-fg:oklch(0.26 0.014 265);
--vibeui-spinner-002-accent:oklch(0.55 0.17 262);
--vibeui-spinner-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: подпись тёмная, а ожидание кладут поверх всего. */
[data-vibeui-block="spinner-002"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.625rem 0.875rem;
background:var(--vibeui-spinner-002-surface);
border:1px solid var(--vibeui-spinner-002-border);border-radius:9999px;
font-family:var(--vibeui-spinner-002-font);color:var(--vibeui-spinner-002-fg);
font-size:0.8125rem;
}
[data-vibeui-block="spinner-002"] [data-part="dots"]{
display:inline-flex;align-items:center;gap:0.25rem;flex:none;
}
/* Задержки посчитаны от одной длительности: темп меняется одним числом. */
[data-vibeui-block="spinner-002"] [data-part="dot"]{
width:var(--vibeui-spinner-002-dot);height:var(--vibeui-spinner-002-dot);
border-radius:9999px;background:var(--vibeui-spinner-002-accent);
animation:vibeui-spinner-002-wave var(--vibeui-spinner-002-speed) ease-in-out infinite;
}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(2){
animation-delay:calc(var(--vibeui-spinner-002-speed) / -6);
}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(3){
animation-delay:calc(var(--vibeui-spinner-002-speed) / -3);
}
@keyframes vibeui-spinner-002-wave{
0%,60%,100%{opacity:.28;transform:translateY(0)}
30%{opacity:1;transform:translateY(-0.1875rem)}
}
[data-vibeui-block="spinner-002"] [data-part="label"]{font-weight:600}
/* Без движения точки замирают разной яркостью: состояние читается, мигания нет. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(1){opacity:1}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(2){opacity:.6}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(3){opacity:.3}
}
`

/**
 * Ожидание тремя точками: волна из задержек, посчитанных от одной длительности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner002({
  label = "Собираем каталог",
  speed = 1.2,
  className,
  style,
  ...props
}: Spinner002Props) {
  const palette = {
    "--vibeui-spinner-002-speed": `${speed}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-002"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="dots" aria-hidden="true">
          <span data-part="dot" />
          <span data-part="dot" />
          <span data-part="dot" />
        </span>
        <span data-part="label">{label}</span>
      </div>
    </>
  )
}
