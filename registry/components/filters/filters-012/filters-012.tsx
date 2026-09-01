"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters012Preset = {
  id: string
  name: string
  summary: string
}

export type Filters012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  presets?: Filters012Preset[]
  defaultAppliedId?: string
  applyLabel?: string
  onApply?: (id: string) => void
  accent?: string
}

// Идея компонента: сохранённый набор условий выбирают радиокнопкой, а
// применяют отдельной кнопкой — выбор и применение здесь разные шаги, и это
// честно, когда смена набора запускает тяжёлый запрос. Кнопка называет,
// какой набор встанет, и выключена, пока выбор совпадает с уже применённым.
// Удаление набора — своя кнопка в строке, а не побочный эффект выбора.
const STYLES = `
:where([data-vibeui-block="filters-012"]){
--vibeui-filters-012-surface:oklch(1 0 0);
--vibeui-filters-012-fill:oklch(0.975 0.004 265);
--vibeui-filters-012-fg:oklch(0.23 0.014 265);
--vibeui-filters-012-muted:oklch(0.55 0.014 265);
--vibeui-filters-012-border:oklch(0.89 0.008 265);
--vibeui-filters-012-shell:oklch(0.91 0.006 265);
--vibeui-filters-012-accent:oklch(0.52 0.17 145);
--vibeui-filters-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: список показывают поверх любого фона. */
[data-vibeui-block="filters-012"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-012-surface);
border:1px solid var(--vibeui-filters-012-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-012-font);color:var(--vibeui-filters-012-fg);
}
[data-vibeui-block="filters-012"] *{box-sizing:border-box}
[data-vibeui-block="filters-012"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="filters-012"] fieldset{border:0;padding:0;margin:0}
[data-vibeui-block="filters-012"] ul{
display:flex;flex-direction:column;gap:0.375rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="filters-012"] [data-part="row"]{
display:flex;align-items:flex-start;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-filters-012-border);
}
[data-vibeui-block="filters-012"] [data-part="row"]:has(input:checked){
border-color:var(--vibeui-filters-012-accent);
background:color-mix(in oklab,var(--vibeui-filters-012-accent) 6%,oklch(1 0 0));
}
[data-vibeui-block="filters-012"] [data-part="row"] input[type="radio"]{
margin:0.1875rem 0 0;flex:none;accent-color:var(--vibeui-filters-012-accent);
width:1rem;height:1rem;
}
[data-vibeui-block="filters-012"] [data-part="row"] input:focus-visible{
outline:2px solid var(--vibeui-filters-012-accent);outline-offset:2px;
}
[data-vibeui-block="filters-012"] [data-part="body"]{flex:1;min-width:0;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="filters-012"] [data-part="body"] b{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-012"] [data-part="body"] span{font-size:0.75rem;color:var(--vibeui-filters-012-muted)}
[data-vibeui-block="filters-012"] [data-part="delete"]{
appearance:none;cursor:pointer;flex:none;
display:grid;place-items:center;width:1.625rem;height:1.625rem;
border:0;border-radius:9999px;background:none;color:var(--vibeui-filters-012-muted);
font:inherit;font-size:0.875rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="filters-012"] [data-part="delete"]:hover{background:var(--vibeui-filters-012-fill);color:var(--vibeui-filters-012-fg)}
[data-vibeui-block="filters-012"] [data-part="delete"]:focus-visible{outline:2px solid var(--vibeui-filters-012-accent);outline-offset:2px}
[data-vibeui-block="filters-012"] [data-part="apply"]{
appearance:none;cursor:pointer;align-self:flex-start;
padding:0.4375rem 0.875rem;border-radius:0.625rem;border:0;
background:var(--vibeui-filters-012-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="filters-012"] [data-part="apply"]:focus-visible{outline:2px solid var(--vibeui-filters-012-accent);outline-offset:2px}
[data-vibeui-block="filters-012"] [data-part="apply"]:disabled{opacity:0.45;cursor:default}
[data-vibeui-block="filters-012"] [data-part="empty"]{margin:0;font-size:0.8125rem;color:var(--vibeui-filters-012-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS: Filters012Preset[] = [
  {
    id: "my-week",
    name: "Мои за неделю",
    summary: "Автор: я · за 7 дней · статус: любой",
  },
  {
    id: "open-bugs",
    name: "Открытые баги",
    summary: "Тип: баг · статус: открыт",
  },
  {
    id: "urgent",
    name: "Срочные",
    summary: "Приоритет: высокий · без исполнителя",
  },
]

/**
 * Сохранённые наборы условий: выбор радиокнопкой, применение отдельной
 * кнопкой, удаление в строке. Один файл, ноль зависимостей, своя палитра.
 */
export function Filters012({
  title = "Сохранённые наборы",
  presets = DEFAULT_PRESETS,
  defaultAppliedId,
  applyLabel = "Применить",
  onApply,
  accent,
  className,
  style,
  ...props
}: Filters012Props) {
  const name = useId().replace(/:/g, "")
  const [list, setList] = useState(presets)
  const [appliedId, setAppliedId] = useState(defaultAppliedId ?? presets[0]?.id)
  const [draftId, setDraftId] = useState(appliedId)

  const palette = {
    ...(accent ? { "--vibeui-filters-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  const remove = (id: string) => {
    const next = list.filter((preset) => preset.id !== id)
    setList(next)
    if (draftId === id) setDraftId(next[0]?.id)
    if (appliedId === id) setAppliedId(next[0]?.id)
  }

  const apply = () => {
    if (!draftId) return
    setAppliedId(draftId)
    onApply?.(draftId)
  }

  return (
    <>
      <style href="vibeui-filters-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-012"
        className={className}
        style={palette}
      >
        <fieldset>
          <legend>{title}</legend>

          {list.length === 0 ? (
            <p data-part="empty">Сохранённых наборов пока нет.</p>
          ) : (
            <ul>
              {list.map((preset) => (
                <li key={preset.id} data-part="row">
                  <input
                    type="radio"
                    name={`${name}-preset`}
                    id={`${name}-${preset.id}`}
                    checked={draftId === preset.id}
                    onChange={() => setDraftId(preset.id)}
                  />
                  <label data-part="body" htmlFor={`${name}-${preset.id}`}>
                    <b>{preset.name}</b>
                    <span>{preset.summary}</span>
                  </label>
                  <button
                    type="button"
                    data-part="delete"
                    aria-label={`Удалить набор «${preset.name}»`}
                    onClick={() => remove(preset.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <button
          type="button"
          data-part="apply"
          disabled={!draftId || draftId === appliedId}
          onClick={apply}
        >
          {applyLabel}
        </button>
      </div>
    </>
  )
}
