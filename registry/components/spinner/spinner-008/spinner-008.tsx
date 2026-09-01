import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  height?: number
}

// Идея компонента: полоса неопределённого прогресса без отдельного бегущего
// отрезка. Вместо узкой дорожки с уезжающим сегментом вся полоса залита
// диагональными полосами и движется целиком через background-position —
// «полосатый конвейер», а не бегунок. aria-valuenow по-прежнему не ставим:
// без него скринридер не назовёт процент, которого никто не считал.
const STYLES = `
:where([data-vibeui-block="spinner-008"]){
--vibeui-spinner-008-height:6px;
--vibeui-spinner-008-surface:oklch(1 0 0);
--vibeui-spinner-008-border:oklch(0.9 0.006 265);
--vibeui-spinner-008-fg:oklch(0.26 0.014 265);
--vibeui-spinner-008-muted:oklch(0.55 0.014 265);
--vibeui-spinner-008-track:oklch(0.93 0.006 265);
--vibeui-spinner-008-accent:oklch(0.55 0.17 262);
--vibeui-spinner-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: подпись и подсказка тёмные. */
[data-vibeui-block="spinner-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-spinner-008-surface);
border:1px solid var(--vibeui-spinner-008-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-008-font);color:var(--vibeui-spinner-008-fg);
}
[data-vibeui-block="spinner-008"] [data-part="label"]{
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="spinner-008"] [data-part="hint"]{
font-size:0.75rem;color:var(--vibeui-spinner-008-muted);
}
/* Вся полоса — движущийся конвейер полос, а не дорожка с бегунком. */
[data-vibeui-block="spinner-008"] [data-part="track"]{
height:var(--vibeui-spinner-008-height);border-radius:9999px;
background-color:var(--vibeui-spinner-008-track);
background-image:repeating-linear-gradient(
135deg,
var(--vibeui-spinner-008-accent) 0,
var(--vibeui-spinner-008-accent) 10px,
transparent 10px,
transparent 20px
);
background-size:200% 100%;
animation:vibeui-spinner-008-drift 1s linear infinite;
}
@keyframes vibeui-spinner-008-drift{to{background-position:-40px 0}}
/* Без движения полосы замирают на месте: узор виден, конвейер не едет. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-008"] [data-part="track"]{animation:none!important;background-position:0 0}
}
`

/**
 * Полоса неопределённого прогресса из движущихся диагональных полос.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner008({
  label = "Проверяем соединение",
  height = 6,
  className,
  style,
  ...props
}: Spinner008Props) {
  const palette = {
    "--vibeui-spinner-008-height": `${height}px`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-008"
        className={className}
        style={palette}
      >
        <span data-part="label">{label}</span>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-busy="true"
        />
        <span data-part="hint">Доля неизвестна, работа продолжается</span>
      </div>
    </>
  )
}
