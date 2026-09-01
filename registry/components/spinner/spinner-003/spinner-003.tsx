import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  hint?: string
  height?: number
}

// Идея компонента: полоса неопределённого прогресса. У неё нет aria-valuenow —
// и это принципиально: как только атрибут появляется, скринридер называет
// процент, которого никто не считал. Отрезок ходит по дорожке анимацией
// transform, а не изменением left: браузер не пересчитывает раскладку на
// каждом кадре. При запрете движения отрезок занимает дорожку целиком и
// пульсирует — «работа идёт» остаётся, бег исчезает.
const STYLES = `
:where([data-vibeui-block="spinner-003"]){
--vibeui-spinner-003-height:4px;
--vibeui-spinner-003-surface:oklch(1 0 0);
--vibeui-spinner-003-border:oklch(0.9 0.006 265);
--vibeui-spinner-003-fg:oklch(0.26 0.014 265);
--vibeui-spinner-003-muted:oklch(0.55 0.014 265);
--vibeui-spinner-003-track:oklch(0.93 0.006 265);
--vibeui-spinner-003-accent:oklch(0.55 0.17 262);
--vibeui-spinner-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: подписи тёмные. */
[data-vibeui-block="spinner-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-spinner-003-surface);
border:1px solid var(--vibeui-spinner-003-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-003-font);color:var(--vibeui-spinner-003-fg);
}
[data-vibeui-block="spinner-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
font-size:0.8125rem;
}
[data-vibeui-block="spinner-003"] [data-part="hint"]{
font-size:0.75rem;color:var(--vibeui-spinner-003-muted);
}
[data-vibeui-block="spinner-003"] [data-part="track"]{
position:relative;overflow:hidden;
height:var(--vibeui-spinner-003-height);
border-radius:9999px;background:var(--vibeui-spinner-003-track);
}
/* Отрезок ездит на transform: раскладка не пересчитывается на каждом кадре. */
[data-vibeui-block="spinner-003"] [data-part="beam"]{
position:absolute;inset:0 auto 0 0;
width:40%;border-radius:9999px;
background:var(--vibeui-spinner-003-accent);
animation:vibeui-spinner-003-run 1.4s cubic-bezier(.65,0,.35,1) infinite;
}
@keyframes vibeui-spinner-003-run{
0%{transform:translateX(-100%)}
100%{transform:translateX(250%)}
}
@keyframes vibeui-spinner-003-breathe{0%,100%{opacity:.35}50%{opacity:1}}
/* Без движения отрезок занимает дорожку целиком и дышит. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-003"] [data-part="beam"]{
width:100%;transform:none;
animation:vibeui-spinner-003-breathe 1.8s ease-in-out infinite;
}
}
`

/**
 * Полоса неопределённого прогресса без выдуманных процентов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner003({
  label = "Синхронизация каталога",
  hint = "Осталось немного",
  height = 4,
  className,
  style,
  ...props
}: Spinner003Props) {
  const palette = {
    "--vibeui-spinner-003-height": `${height}px`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-003"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="label">{label}</span>
          {hint ? <span data-part="hint">{hint}</span> : null}
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-busy="true"
        >
          <span data-part="beam" />
        </div>
      </div>
    </>
  )
}
