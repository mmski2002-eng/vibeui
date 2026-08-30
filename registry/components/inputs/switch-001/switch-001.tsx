import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch001Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "size"
> & {
  label?: string
  /** Пояснение под подписью: чем включённое состояние отличается от выключенного. */
  description?: string
  /** Сторона, с которой стоит тумблер. По умолчанию справа, как в настройках. */
  align?: "start" | "end"
  accent?: string
}

// Идея компонента: переключатель настройки, а не поле формы. Строка занимает
// всю ширину, подпись слева, тумблер прижат к краю — так он читается рядом с
// соседними настройками. Внутри нативный checkbox: состояние, клавиатура и
// форма достаются даром.
const STYLES = `
:where([data-vibeui-block="switch-001"]){
--vibeui-switch-001-fg:oklch(0.24 0.016 265);
--vibeui-switch-001-muted:oklch(0.54 0.014 265);
--vibeui-switch-001-track:oklch(0.88 0.008 265);
--vibeui-switch-001-thumb:oklch(1 0 0);
--vibeui-switch-001-accent:oklch(0.55 0.2 262);
--vibeui-switch-001-hover:oklch(0.55 0.02 265 / 7%);
--vibeui-switch-001-radius:0.625rem;
--vibeui-switch-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-001"]{
display:flex;align-items:center;gap:1rem;width:100%;box-sizing:border-box;
padding:0.625rem 0.75rem;margin:-0.625rem -0.75rem;
border-radius:var(--vibeui-switch-001-radius);cursor:pointer;
font-family:var(--vibeui-switch-001-font);color:var(--vibeui-switch-001-fg);
transition:background-color .16s ease;
}
[data-vibeui-block="switch-001"][data-align="start"]{flex-direction:row-reverse;justify-content:flex-end}
[data-vibeui-block="switch-001"]:hover:not(:has(input:disabled)){background:var(--vibeui-switch-001-hover)}
[data-vibeui-block="switch-001"]:has(input:disabled){cursor:not-allowed;opacity:.55}
[data-vibeui-block="switch-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-001"] [data-part="title"]{font-size:0.9375rem;line-height:1.35}
[data-vibeui-block="switch-001"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-switch-001-muted)}
[data-vibeui-block="switch-001"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-001"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-001-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-001"] input:checked{background:var(--vibeui-switch-001-accent)}
[data-vibeui-block="switch-001"] input:focus-visible{outline:2px solid var(--vibeui-switch-001-accent);outline-offset:2px}
[data-vibeui-block="switch-001"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-001-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 25%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-001"] input:checked + [data-part="thumb"]{transform:translateX(1.25rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Переключатель настройки: строка целиком, тумблер у края.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch001({
  label = "Двухфакторная защита",
  description = "Запрашивать код из приложения при входе с нового устройства.",
  align = "end",
  accent,
  className,
  style,
  ...props
}: Switch001Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-001" precedence="medium">
        {STYLES}
      </style>
      <label
        data-vibeui-block="switch-001"
        data-align={align}
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="title">{label}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        <span data-part="track">
          <input {...props} type="checkbox" role="switch" />
          <span data-part="thumb" aria-hidden="true" />
        </span>
      </label>
    </>
  )
}
