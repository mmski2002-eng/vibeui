"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card173Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  deltaToggleText?: string
  deltas?: boolean
  setDeltas?: (value: boolean) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-026, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-173"]){
--vibeui-card-173-accent:light-dark(oklch(0.275 0 0),oklch(0.899 0 0));
--vibeui-card-173-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-173-muted:color-mix(in oklab,var(--vibeui-card-173-fg) 68%,transparent);
--vibeui-card-173-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-173"]{color-scheme:dark}
[data-vibeui-block="card-173"]{box-sizing:border-box}
[data-vibeui-block="card-173"] *{box-sizing:border-box}
[data-vibeui-block="card-173"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-173-border);}
[data-vibeui-block="card-173"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-173"] [data-part="mode"]{display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-card-173-muted);cursor:pointer;}
[data-vibeui-block="card-173"] [data-part="mode"] input{accent-color:var(--vibeui-card-173-accent);margin:0;width:0.9375rem;height:0.9375rem}
[data-vibeui-block="card-173"] [data-part="mode"] input:focus-visible{outline:2px solid var(--vibeui-card-173-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-173"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Строка сравнения»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card173({
  heading = "Сравнение моделей",
  deltaToggleText = "Показывать отклонение",
  deltas,
  setDeltas = () => {},
  accent,
  className,
  style,
  ...props
}: Card173Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-173-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-173" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-173"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <label data-part="mode">
          <input
            type="checkbox"
            checked={deltas}
            onChange={(event) => setDeltas(event.target.checked)}
          />
          {deltaToggleText}
        </label>
      </div>
    </>
  )
}
