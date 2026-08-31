"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters007View = {
  id: string
  name: string
  summary: string
  shared?: boolean
}

export type Filters007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  views?: Filters007View[]
  saveLabel?: string
  onChange?: (id: string) => void
  accent?: string
}

// Идея компонента: набор фильтров как именованный вид. Один и тот же отбор
// собирают заново каждое утро, и это самая частая ручная работа в любой
// таблице. Здесь каждый вид показывает не только имя, но и расшифровку
// условий — по одному имени через неделю не вспомнить, что внутри. Общие
// виды помечены отдельно: их правка меняет экран всей команде.
const STYLES = `
:where([data-vibeui-block="filters-007"]){
--vibeui-filters-007-surface:oklch(1 0 0);
--vibeui-filters-007-fill:oklch(0.975 0.004 265);
--vibeui-filters-007-fg:oklch(0.23 0.014 265);
--vibeui-filters-007-muted:oklch(0.55 0.014 265);
--vibeui-filters-007-border:oklch(0.89 0.008 265);
--vibeui-filters-007-shell:oklch(0.91 0.006 265);
--vibeui-filters-007-accent:oklch(0.5 0.16 210);
--vibeui-filters-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: список показывают поверх любого фона. */
[data-vibeui-block="filters-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-007-surface);
border:1px solid var(--vibeui-filters-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-007-font);color:var(--vibeui-filters-007-fg);
}
[data-vibeui-block="filters-007"] *{box-sizing:border-box}
[data-vibeui-block="filters-007"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-007"] ul{
display:flex;flex-direction:column;gap:0.25rem;margin:0;padding:0;list-style:none;
}
/* Вид — одна кнопка целиком: мишень в строку, а не крошечное имя. */
[data-vibeui-block="filters-007"] [data-part="view"]{
appearance:none;cursor:pointer;width:100%;text-align:start;
display:flex;flex-direction:column;gap:0.125rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-filters-007-border);
background:var(--vibeui-filters-007-surface);color:inherit;font:inherit;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="filters-007"] [data-part="view"]:hover{background:var(--vibeui-filters-007-fill)}
[data-vibeui-block="filters-007"] [data-part="view"]:focus-visible{outline:2px solid var(--vibeui-filters-007-accent);outline-offset:2px}
[data-vibeui-block="filters-007"] [data-part="view"][aria-pressed="true"]{
border-color:var(--vibeui-filters-007-accent);
background:color-mix(in oklab,var(--vibeui-filters-007-accent) 8%,oklch(1 0 0));
}
[data-vibeui-block="filters-007"] [data-part="line"]{
display:flex;align-items:center;gap:0.375rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="filters-007"] [data-part="dot"]{
flex:none;width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-filters-007-border);
}
[data-vibeui-block="filters-007"] [data-part="view"][aria-pressed="true"] [data-part="dot"]{background:var(--vibeui-filters-007-accent)}
/* Расшифровка условий: по одному имени через неделю не вспомнить, что внутри. */
[data-vibeui-block="filters-007"] [data-part="summary"]{
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-filters-007-muted);
}
[data-vibeui-block="filters-007"] [data-part="shared"]{
margin-inline-start:auto;flex:none;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-filters-007-fill);
font-size:0.5625rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;
color:var(--vibeui-filters-007-muted);
}
[data-vibeui-block="filters-007"] [data-part="save"]{
appearance:none;cursor:pointer;align-self:flex-start;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px dashed var(--vibeui-filters-007-border);
background:none;color:var(--vibeui-filters-007-accent);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="filters-007"] [data-part="save"]:hover{border-style:solid;border-color:var(--vibeui-filters-007-accent)}
[data-vibeui-block="filters-007"] [data-part="save"]:focus-visible{outline:2px solid var(--vibeui-filters-007-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VIEWS: Filters007View[] = [
  {
    id: "week",
    name: "Мои за неделю",
    summary: "Автор: я · Обновлён: за 7 дней",
  },
  {
    id: "review",
    name: "Ждут проверки",
    summary: "Статус: на ревью · Приоритет: высокий",
    shared: true,
  },
  {
    id: "free",
    name: "Бесплатные шаблоны",
    summary: "Цена: 0 ₽ · Лицензия: MIT",
    shared: true,
  },
]

/**
 * Сохранённые наборы фильтров: имя, расшифровка условий и метка общего вида.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters007({
  title = "Сохранённые виды",
  views = DEFAULT_VIEWS,
  saveLabel = "Сохранить текущий отбор",
  onChange,
  accent,
  className,
  style,
  ...props
}: Filters007Props) {
  const [list, setList] = useState(views)
  const [active, setActive] = useState(views[0]?.id ?? "")

  const palette = {
    ...(accent ? { "--vibeui-filters-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const pick = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  const save = () => {
    const id = `view-${list.length + 1}`

    setList([
      ...list,
      {
        id,
        name: `Новый вид ${list.length + 1}`,
        summary: "Текущие условия отбора",
      },
    ])
    pick(id)
  }

  return (
    <>
      <style href="vibeui-filters-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-007"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ul>
          {list.map((view) => (
            <li key={view.id}>
              <button
                type="button"
                data-part="view"
                aria-pressed={active === view.id}
                onClick={() => pick(view.id)}
              >
                <span data-part="line">
                  <span data-part="dot" aria-hidden="true" />
                  {view.name}
                  {view.shared ? <span data-part="shared">общий</span> : null}
                </span>
                <span data-part="summary">{view.summary}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" data-part="save" onClick={save}>
          {saveLabel}
        </button>
      </div>
    </>
  )
}
