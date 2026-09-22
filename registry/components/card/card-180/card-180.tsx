"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card180View = {
  id: string
  label: string
  state: { stage: string; sort: Card180Sort }
}

export type Card180Sort = "amount" | "deal" | "stage"

export type ViewState = Card180View["state"]

export type Card180Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  stageLabel?: string
  anyStageText?: string
  stages?: string[]
  sortLabel?: string
  sortText?: Record<string, string>
  views?: Card180View[]
  saveText?: string
  active?: string
  dirty?: unknown
  setEdited?: (value: Card180View[] | null) => void
  setState?: (value: ViewState) => void
  state?: ViewState
  accent?: string
  className?: string
  style?: CSSProperties
}

const STAGES = ["Квалификация", "Предложение", "Переговоры", "Закрыта"]

const SORT_TEXT: Record<string, string> = {
  deal: "по названию",
  amount: "по сумме",
  stage: "по этапу",
}

const VIEWS: Card180View[] = [
  { id: "all", label: "Все сделки", state: { stage: "", sort: "deal" } },
  {
    id: "hot",
    label: "В переговорах",
    state: { stage: "Переговоры", sort: "amount" },
  },
  { id: "new", label: "Новые", state: { stage: "Квалификация", sort: "deal" } },
  { id: "won", label: "Закрытые", state: { stage: "Закрыта", sort: "amount" } },
]

const SORTS: Card180Sort[] = ["deal", "amount", "stage"]

// Часть блока datagrid-020, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-180"]){
--vibeui-card-180-accent:light-dark(oklch(0.27 0 0),oklch(0.91 0 0));
--vibeui-card-180-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-180-muted:color-mix(in oklab,var(--vibeui-card-180-fg) 68%,transparent);
--vibeui-card-180-panel:light-dark(oklch(0.985 0 285),oklch(0.26 0 285));
--vibeui-card-180-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-180"]{color-scheme:dark}
[data-vibeui-block="card-180"]{box-sizing:border-box}
[data-vibeui-block="card-180"] *{box-sizing:border-box}
[data-vibeui-block="card-180"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-card-180-border);
background:var(--vibeui-card-180-panel);}
[data-vibeui-block="card-180"] label{display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-card-180-muted);}
[data-vibeui-block="card-180"] select{font:inherit;font-size:0.75rem;color:inherit;padding:0.25rem 0.4375rem;
border:1px solid var(--vibeui-card-180-border);border-radius:0.4375rem;
background:transparent;}
[data-vibeui-block="card-180"] select:focus-visible{outline:2px solid var(--vibeui-card-180-accent);outline-offset:1px}
[data-vibeui-block="card-180"] [data-part="save"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;margin-inline-start:auto;
padding:0.3125rem 0.625rem;border-radius:0.4375rem;border:1px solid var(--vibeui-card-180-accent);
background:transparent;color:var(--vibeui-card-180-accent);}
[data-vibeui-block="card-180"] [data-part="save"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="card-180"] [data-part="save"]:focus-visible{outline:2px solid var(--vibeui-card-180-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-180"] *{animation:none!important;transition:none!important}}
`

/** Панель над таблицей: выбор стадии и вида, признак несохранённых изменений. */
export function Card180({
  stageLabel = "Этап",
  anyStageText = "любой",
  stages = STAGES,
  sortLabel = "Сортировка",
  sortText = SORT_TEXT,
  views = VIEWS,
  saveText = "Сохранить в представление",
  active,
  dirty,
  setEdited = () => {},
  setState = () => {},
  state = {} as ViewState,
  accent,
  className,
  style,
  ...props
}: Card180Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-180-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-180" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-180"
      className={className}
      style={palette}
      >
        <label>
          {stageLabel}
          <select
            value={state.stage}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                stage: event.target.value,
              }))
            }
          >
            <option value="">{anyStageText}</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>
        <label>
          {sortLabel}
          <select
            value={state.sort}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                sort: event.target.value as ViewState["sort"],
              }))
            }
          >
            {SORTS.map((item) => (
              <option key={item} value={item}>
                {sortText[item] ?? SORT_TEXT[item]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          data-part="save"
          disabled={!dirty}
          onClick={() =>
            setEdited((current) =>
              (current ?? views).map((view) =>
                view.id === active ? { ...view, state } : view,
              ),
            )
          }
        >
          {saveText}
        </button>
      </div>
    </>
  )
}
