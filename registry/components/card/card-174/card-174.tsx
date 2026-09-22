"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card174Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  densityLegend?: string
  densityText?: Record<string, string>
  mode?: (typeof MODES)[number]["value"]
  setMode?: (value: (typeof MODES)[number]["value"]) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

const DENSITY_TEXT: Record<string, string> = {
  compact: "Компактно",
  regular: "Обычно",
  roomy: "Просторно",
}

const MODES = [
  { value: "compact", height: "≈28 px" },
  { value: "regular", height: "≈36 px" },
  { value: "roomy", height: "≈48 px" },
] as const

// Часть блока datagrid-027, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-174"]){
--vibeui-card-174-accent:light-dark(oklch(0.275 0 0),oklch(0.905 0 0));
--vibeui-card-174-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-174-chip:light-dark(oklch(0.96 0.03 145),oklch(0.31 0 0));
--vibeui-card-174-muted:color-mix(in oklab,var(--vibeui-card-174-fg) 68%,transparent);
--vibeui-card-174-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-174"]{color-scheme:dark}
[data-vibeui-block="card-174"]{box-sizing:border-box}
[data-vibeui-block="card-174"] *{box-sizing:border-box}
[data-vibeui-block="card-174"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-174-border);}
[data-vibeui-block="card-174"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-174"] [data-part="switch-form"]{display:contents}
[data-vibeui-block="card-174"] [data-part="switch"]{border:1px solid var(--vibeui-card-174-border);border-radius:0.5rem;
margin:0;padding:0.1875rem;display:flex;gap:0.1875rem;}
[data-vibeui-block="card-174"] [data-part="switch"] legend{padding:0 0.25rem;font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-card-174-muted);}
[data-vibeui-block="card-174"] [data-part="switch"] label{display:inline-flex;align-items:center;gap:0.3125rem;cursor:pointer;
padding:0.25rem 0.5rem;border-radius:0.375rem;font-size:0.75rem;color:var(--vibeui-card-174-muted);}
[data-vibeui-block="card-174"] [data-part="switch"] label:has(input:checked){background:var(--vibeui-card-174-chip);color:var(--vibeui-card-174-accent);font-weight:600;}
[data-vibeui-block="card-174"] [data-part="switch"] input{accent-color:var(--vibeui-card-174-accent);margin:0;width:0.8125rem;height:0.8125rem}
[data-vibeui-block="card-174"] [data-part="switch"] input:focus-visible{outline:2px solid var(--vibeui-card-174-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-174"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Переключатель плотности»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card174({
  heading = "Документы сделки",
  densityLegend = "Плотность",
  densityText = DENSITY_TEXT,
  mode,
  setMode = () => {},
  accent,
  className,
  style,
  ...props
}: Card174Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-174-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-174" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-174"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <form data-part="switch-form">
          <fieldset data-part="switch">
            <legend>{densityLegend}</legend>
            {MODES.map((item) => (
              <label key={item.value}>
                <input
                  type="radio"
                  name="vibeui-datagrid-027-density"
                  value={item.value}
                  checked={mode === item.value}
                  onChange={() => setMode(item.value)}
                />
                {densityText[item.value] ?? DENSITY_TEXT[item.value]}
              </label>
            ))}
          </fieldset>
        </form>
      </div>
    </>
  )
}
