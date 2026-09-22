"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card157Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  collapseAllLabel?: string
  expandAllLabel?: string
  setClosed?: (value: string[]) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-157"]){
--vibeui-card-157-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-card-157-border:light-dark(oklch(0.92 0 300),oklch(0.34 0 300));
--vibeui-card-157-fg:light-dark(oklch(0.23 0 300),oklch(0.93 0 300));
--vibeui-card-157-field:light-dark(oklch(1 0 0),oklch(0.22 0 300));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-157"]{color-scheme:dark}
[data-vibeui-block="card-157"]{box-sizing:border-box}
[data-vibeui-block="card-157"] *{box-sizing:border-box}
[data-vibeui-block="card-157"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-157-border);}
[data-vibeui-block="card-157"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-157"] button{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-157-border);
background:var(--vibeui-card-157-field);color:var(--vibeui-card-157-fg);}
[data-vibeui-block="card-157"] button:focus-visible{outline:2px solid var(--vibeui-card-157-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-157"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Сгруппированные строки»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card157({
  heading = "Трудозатраты, спринт 14",
  collapseAllLabel = "Свернуть все",
  expandAllLabel = "Развернуть все",
  setClosed = () => {},
  accent,
  className,
  style,
  ...props
}: Card157Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-157-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-157" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-157"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <button type="button" onClick={() => setClosed(names)}>
          {collapseAllLabel}
        </button>
        <button type="button" onClick={() => setClosed([])}>
          {expandAllLabel}
        </button>
      </div>
    </>
  )
}
