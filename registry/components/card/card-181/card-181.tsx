"use client"

import type { Dispatch, SetStateAction, ComponentProps, CSSProperties } from "react"

export type Card181Row = {
  id: string
  sku: string
  title: string
  quantity: number
}

export type Parsed = {
  line: number
  sku: string
  title: string
  quantity: number
  problem: string
}

export type Card181Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  pasteLabel?: string
  separatorHint?: string
  rows?: Card181Row[]
  addTemplate?: string
  clearText?: string
  emptyText?: string
  okTemplate?: string
  mixedTemplate?: string
  areaId?: string
  bad?: readonly Parsed[]
  batch?: number
  good?: readonly Parsed[]
  parsed?: Parsed[]
  setAdded?: Dispatch<SetStateAction<Card181Row[] | null>>
  setBatch?: (value: number) => void
  setPasted?: (value: string[]) => void
  setTyped?: (value: string | null) => void
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card181Row[] = [
  { id: "b1", sku: "MTR-100", title: "Мотор редукторный", quantity: 12 },
  { id: "b2", sku: "BLT-220", title: "Ремень приводной", quantity: 40 },
]

// Часть блока datagrid-023, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-181"]){
--vibeui-card-181-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-card-181-bad:light-dark(oklch(0.53 0.19 27),oklch(0.77 0.16 27));
--vibeui-card-181-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-181-muted:color-mix(in oklab,var(--vibeui-card-181-fg) 68%,transparent);
--vibeui-card-181-panel:light-dark(oklch(0.985 0 285),oklch(0.26 0 285));
--vibeui-card-181-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-181"]{color-scheme:dark}
[data-vibeui-block="card-181"]{box-sizing:border-box}
[data-vibeui-block="card-181"] *{box-sizing:border-box}
[data-vibeui-block="card-181"]{padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-181-border);
background:var(--vibeui-card-181-panel);}
[data-vibeui-block="card-181"] label{display:block;margin-bottom:0.375rem;font-size:0.75rem;font-weight:600;}
[data-vibeui-block="card-181"] [data-part="hint"]{margin:0 0 0.5rem;font-size:0.6875rem;color:var(--vibeui-card-181-muted);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
[data-vibeui-block="card-181"] textarea{display:block;width:100%;min-height:4.5rem;resize:vertical;
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem;line-height:1.5;color:inherit;
padding:0.5rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-181-border);background:transparent;}
[data-vibeui-block="card-181"] textarea:focus-visible{outline:2px solid var(--vibeui-card-181-accent);outline-offset:1px}
[data-vibeui-block="card-181"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin-top:0.5rem}
[data-vibeui-block="card-181"] [data-part="commit"]{border-color:transparent;background:var(--vibeui-card-181-accent);color:oklch(from var(--vibeui-card-181-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-181"] [data-part="report"]{margin:0;margin-inline-start:auto;font-size:0.75rem;color:var(--vibeui-card-181-muted)}
[data-vibeui-block="card-181"] [data-part="report"][data-bad="true"]{color:var(--vibeui-card-181-bad);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-181"] *{animation:none!important;transition:none!important}}
`

/** Панель импорта: подпись, подсказка о разделителе, поле вставки и действия. */
export function Card181({
  pasteLabel = "Вставьте строки из таблицы или письма",
  separatorHint = "артикул ⇥ название ⇥ количество",
  rows = DEFAULT_ROWS,
  addTemplate = "Добавить {count} стр.",
  clearText = "Очистить поле",
  emptyText = "Поле пустое",
  okTemplate = "Разобрано строк: {count}, ошибок нет",
  mixedTemplate = "Готово {good}, с ошибками {bad}",
  areaId = "",
  bad = [],
  batch = 0,
  good = [],
  parsed = [],
  setAdded = () => {},
  setBatch = () => {},
  setPasted = () => {},
  setTyped = () => {},
  text,
  accent,
  className,
  style,
  ...props
}: Card181Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-181-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-181" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-181"
      className={className}
      style={palette}
      >
        <label htmlFor={areaId}>{pasteLabel}</label>
        <p data-part="hint">{separatorHint}</p>
        <textarea
          id={areaId}
          value={text}
          spellCheck={false}
          onChange={(event) => setTyped(event.target.value)}
        />
        <div data-part="actions">
          <button
            type="button"
            data-part="commit"
            disabled={good.length === 0}
            onClick={() => {
              const stamp = batch + 1

              setBatch(stamp)
              setAdded((current) => [
                ...(current ?? rows),
                ...good.map((item, index) => ({
                  id: `p${stamp}-${index}`,
                  sku: item.sku,
                  title: item.title,
                  quantity: item.quantity,
                })),
              ])
              setPasted(good.map((_, index) => `p${stamp}-${index}`))
              setTyped("")
            }}
          >
            {addTemplate.replace("{count}", String(good.length))}
          </button>
          <button type="button" onClick={() => setTyped("")}>
            {clearText}
          </button>
          <p
            data-part="report"
            data-bad={bad.length > 0 ? "true" : undefined}
            role="status"
            aria-live="polite"
          >
            {parsed.length === 0
              ? emptyText
              : bad.length === 0
                ? okTemplate.replace("{count}", String(good.length))
                : mixedTemplate
                    .replace("{good}", String(good.length))
                    .replace("{bad}", String(bad.length))}
          </p>
        </div>
      </div>
    </>
  )
}
