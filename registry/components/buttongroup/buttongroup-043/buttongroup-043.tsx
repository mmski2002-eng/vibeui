import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup043Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  index?: number
  total?: number
  entity?: string
  label?: string
  accent?: string
}

// Идея компонента: навигация по записям карточной формы — первая, предыдущая,
// следующая, последняя. Переход к краю и переход на шаг различаются не
// подписью, а формой значка: стрелка с планкой упирается в стену. Под
// сцепкой лежит тонкая полоса положения: она показывает, где вы в наборе,
// когда «12 из 340» уже ничего не говорит. Полоса построена на процентной
// ширине от индекса и помечена aria-hidden — то же самое сказано текстом.
// Крайние кнопки гасятся disabled парами: на первой записи бессмысленны обе
// левые, и гасить только одну — значит обмануть.
const STYLES = `
:where([data-vibeui-block="buttongroup-043"]){
--vibeui-buttongroup-043-surface:oklch(1 0 0);
--vibeui-buttongroup-043-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-043-muted:oklch(0.56 0.014 265);
--vibeui-buttongroup-043-border:oklch(0.88 0.008 265);
--vibeui-buttongroup-043-accent:oklch(0.5 0.16 265);
--vibeui-buttongroup-043-radius:0.625rem;
--vibeui-buttongroup-043-progress:0%;
--vibeui-buttongroup-043-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-043"]{
box-sizing:border-box;display:inline-flex;flex-direction:column;gap:0.4375rem;
font-family:var(--vibeui-buttongroup-043-font);
}
[data-vibeui-block="buttongroup-043"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-043"] [data-part="track"]{
display:flex;isolation:isolate;
border:1px solid var(--vibeui-buttongroup-043-border);
border-radius:var(--vibeui-buttongroup-043-radius);
background:var(--vibeui-buttongroup-043-surface);
overflow:hidden;
}
[data-vibeui-block="buttongroup-043"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-043-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-043"] [data-part="track"] > * + *{
border-inline-start:1px solid var(--vibeui-buttongroup-043-border);
}
[data-vibeui-block="buttongroup-043"] svg{
width:1rem;height:1rem;
stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-043"] button:hover:not(:disabled){
background:oklch(0.965 0.005 265);color:var(--vibeui-buttongroup-043-fg);
}
[data-vibeui-block="buttongroup-043"] button:disabled{opacity:.32;cursor:not-allowed}
[data-vibeui-block="buttongroup-043"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-043-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-043"] [data-part="counter"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:5.5rem;height:2.25rem;padding:0 0.625rem;
color:var(--vibeui-buttongroup-043-fg);
font-size:0.8125rem;font-weight:650;line-height:1;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
/* Полоса положения: «12 из 340» цифрами читается, но не ощущается. */
[data-vibeui-block="buttongroup-043"] [data-part="bar"]{
position:relative;height:3px;border-radius:2px;
background:oklch(0.93 0.006 265);overflow:hidden;
}
[data-vibeui-block="buttongroup-043"] [data-part="bar"] i{
position:absolute;inset-block:0;inset-inline-start:0;
width:var(--vibeui-buttongroup-043-progress);
border-radius:2px;background:var(--vibeui-buttongroup-043-accent);
transition:width .2s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-043"] *{animation:none!important;transition:none!important}}
`

const ICONS = {
  first: "M18 5 11 12l7 7M7 5v14",
  prev: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
  last: "M6 5l7 7-7 7M17 5v14",
}

/**
 * Навигация по записям: край и шаг различаются формой значка, снизу — полоса.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup043({
  index = 12,
  total = 340,
  entity = "Запись",
  label = "Навигация по записям",
  accent,
  className,
  style,
  ...props
}: Buttongroup043Props) {
  const current = Math.min(Math.max(1, index), total)
  const atStart = current === 1
  const atEnd = current === total

  const palette = {
    "--vibeui-buttongroup-043-progress": `${total > 1 ? ((current - 1) / (total - 1)) * 100 : 100}%`,
    ...(accent ? { "--vibeui-buttongroup-043-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-043" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="buttongroup-043"
        className={className}
        style={palette}
        aria-label={label}
      >
        <div data-part="track">
          <button type="button" disabled={atStart} aria-label="К первой записи">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS.first} />
            </svg>
          </button>
          <button
            type="button"
            disabled={atStart}
            aria-label="К предыдущей записи"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS.prev} />
            </svg>
          </button>
          <span data-part="counter">
            {entity} {current} из {total}
          </span>
          <button
            type="button"
            disabled={atEnd}
            aria-label="К следующей записи"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS.next} />
            </svg>
          </button>
          <button
            type="button"
            disabled={atEnd}
            aria-label="К последней записи"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS.last} />
            </svg>
          </button>
        </div>
        <div data-part="bar" aria-hidden="true">
          <i />
        </div>
      </nav>
    </>
  )
}
