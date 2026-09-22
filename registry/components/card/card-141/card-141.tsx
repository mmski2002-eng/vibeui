import type { ComponentProps, CSSProperties } from "react"

export type Card141Hours = {
  label: string
  value: string
}

export type Card141Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  hours?: readonly Card141Hours[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока map-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-141"]){
--vibeui-card-141-line:color-mix(in oklab,var(--vibeui-card-141-fg) 12%,transparent);
--vibeui-card-141-muted:color-mix(in oklab,var(--vibeui-card-141-fg) 60%,var(--vibeui-card-141-bg));
--vibeui-card-141-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-141-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-141"]{color-scheme:dark}
[data-vibeui-block="card-141"]{box-sizing:border-box}
[data-vibeui-block="card-141"] *{box-sizing:border-box}
[data-vibeui-block="card-141"]{display:grid;gap:.4rem;font-size:.92rem}
[data-vibeui-block="card-141"] div{display:flex;justify-content:space-between;gap:1rem;padding-bottom:.4rem;border-bottom:1px dashed var(--vibeui-card-141-line)}
[data-vibeui-block="card-141"] span{color:var(--vibeui-card-141-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-141"] *{animation:none!important;transition:none!important}}
`

/** Список часов работы: подпись и значение построчно. */
export function Card141({
  hours = [ { label: "Будни", value: "7:00 — 21:00" }, { label: "Выходные", value: "8:00 — 21:00" }, { label: "Коробки к утру", value: "с 7:30" }, ],
  accent,
  className,
  style,
  ...props
}: Card141Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-141-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-141" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-141"
        className={className}
        style={palette}
      >
        {hours.map((line) => (
          <div key={line.label}>
            {line.label} <span>{line.value}</span>
          </div>
        ))}
      </div>
    </>
  )
}
