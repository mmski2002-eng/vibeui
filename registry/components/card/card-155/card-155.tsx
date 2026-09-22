"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card155Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  statusText?: string
  hint?: string
  cancelLabel?: string
  saveLabel?: string
  dirty?: readonly [string, string][]
  save?: () => void
  setEditing?: (value: string | null) => void
  setEdits?: (value: Record<string, string>) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-155"]){
--vibeui-card-155-accent:light-dark(oklch(0.295 0 0),oklch(0.91 0 0));
--vibeui-card-155-border:light-dark(oklch(0.92 0.006 60),oklch(0.34 0.012 60));
--vibeui-card-155-fg:light-dark(oklch(0.23 0.014 60),oklch(0.93 0.006 60));
--vibeui-card-155-field:light-dark(oklch(1 0 0),oklch(0.23 0.012 60));
--vibeui-card-155-muted:color-mix(in oklab,var(--vibeui-card-155-fg) 68%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-155"]{color-scheme:dark}
[data-vibeui-block="card-155"]{box-sizing:border-box}
[data-vibeui-block="card-155"] *{box-sizing:border-box}
[data-vibeui-block="card-155"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-155-border);}
[data-vibeui-block="card-155"] [data-part="bar-text"]{margin-inline-end:auto}
[data-vibeui-block="card-155"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="card-155"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-155-muted);}
[data-vibeui-block="card-155"] [data-part="status"]{margin:0;font-size:0.75rem;font-weight:600;color:var(--vibeui-card-155-accent);}
[data-vibeui-block="card-155"] button{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-155-border);
background:var(--vibeui-card-155-field);color:var(--vibeui-card-155-fg);}
[data-vibeui-block="card-155"] button[data-tone="primary"]{border-color:transparent;background:var(--vibeui-card-155-accent);color:oklch(from var(--vibeui-card-155-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-155"] button:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="card-155"] button:focus-visible{outline:2px solid var(--vibeui-card-155-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-155"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Правка ячейки на месте»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card155({
  heading = "Прайс-лист",
  statusText = "Не сохранено: {count}",
  hint = "Цена и остаток редактируются",
  cancelLabel = "Отменить",
  saveLabel = "Сохранить",
  dirty = [],
  save = () => {},
  setEditing = () => {},
  setEdits = () => {},
  accent,
  className,
  style,
  ...props
}: Card155Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-155-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-155" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-155"
      className={className}
      style={palette}
      >
        <div data-part="bar-text">
          <h3 data-part="title">{heading}</h3>
          {dirty.length > 0 ? (
            <p data-part="status" aria-live="polite">
              {statusText.replace("{count}", String(dirty.length))}
            </p>
          ) : (
            <p data-part="hint">{hint}</p>
          )}
        </div>
        <button
          type="button"
          disabled={dirty.length === 0}
          onClick={() => {
            setEdits({})
            setEditing(null)
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          data-tone="primary"
          disabled={dirty.length === 0}
          onClick={save}
        >
          {saveLabel}
        </button>
      </div>
    </>
  )
}
