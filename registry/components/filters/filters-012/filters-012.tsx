"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Filters012Preset = {
  id: string
  name: string
  summary: string
}

export type Filters012Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  presets?: Filters012Preset[]
  defaultAppliedId?: string
  applyLabel?: string
  onApply?: (id: string) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сохранённый набор условий выбирают радиокнопкой, а
// применяют отдельной кнопкой — выбор и применение здесь разные шаги, и это
// честно, когда смена набора запускает тяжёлый запрос. Кнопка называет,
// какой набор встанет, и выключена, пока выбор совпадает с уже применённым.
// Удаление набора — своя кнопка в строке, а не побочный эффект выбора.
const STYLES = `
:where([data-vibeui-block="filters-012"]){
--vibeui-filters-012-surface:transparent;
--vibeui-filters-012-card:light-dark(oklch(1 0 0),oklch(0.27 0 265));
--vibeui-filters-012-fill:light-dark(oklch(0.975 0 265),oklch(0.31 0 265));
--vibeui-filters-012-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-filters-012-muted:color-mix(in oklab,var(--vibeui-filters-012-fg) 68%,transparent);
--vibeui-filters-012-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-filters-012-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-filters-012-accent:light-dark(oklch(0.52 0.17 145),oklch(0.76 0.14 145));
--vibeui-filters-012-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 145));
--vibeui-filters-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-012"]{color-scheme:dark}
/* Подложки по умолчанию нет: список ложится на фон страницы. */
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
background:color-mix(in oklab,var(--vibeui-filters-012-accent) 6%,var(--vibeui-filters-012-card));
}
[data-vibeui-block="filters-012"] [data-part="row"] input[type="radio"]{
margin:0.1875rem 0 0;flex:none;accent-color:var(--vibeui-filters-012-accent);
width:1rem;height:1rem;
}
[data-vibeui-block="filters-012"] [data-part="row"] input:focus-visible{
outline:2px solid var(--vibeui-filters-012-accent);outline-offset:2px;
}
[data-vibeui-block="filters-012"] [data-part="body"]{flex:1;min-width:0;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="filters-012"] [data-part="body"] b{display:flex;align-items:center;gap:0.375rem;font-size:0.8125rem;font-weight:650}
/* Применённый набор назван словом: выключенная кнопка и рамка выбора говорят
   про выбор, а не про то, что уже стоит в списке. */
[data-vibeui-block="filters-012"] [data-part="applied"]{
flex:none;padding:0.0625rem 0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-filters-012-accent) 16%,transparent);
color:var(--vibeui-filters-012-accent);
font-size:0.6875rem;font-weight:600;
}
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
background:var(--vibeui-filters-012-accent);color:var(--vibeui-filters-012-on-accent);
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

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  empty: "Сохранённых наборов пока нет.",
  remove: "Удалить набор «{name}»",
  applied: "Применён",
}

function label(
  labels: Record<string, string>,
  key: string,
  values?: Record<string, string>,
): string {
  const template = labels[key] ?? DEFAULT_LABELS[key] ?? ""

  if (!values) {
    return template
  }

  return template.replace(
    /\{(\w+)\}/g,
    (match, name: string) => values[name] ?? match,
  )
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

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
  labels = DEFAULT_LABELS,
  background = "",
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
    ...(background
      ? {
          "--vibeui-filters-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="filters"
        data-vibeui-block="filters-012"
        className={className}
        style={palette}
      >
        <fieldset>
          <legend>{title}</legend>

          {list.length === 0 ? (
            <p data-part="empty">{label(labels, "empty")}</p>
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
                    <b>
                      {preset.name}
                      {preset.id === appliedId ? (
                        <span data-part="applied">
                          {label(labels, "applied")}
                        </span>
                      ) : null}
                    </b>
                    <span>{preset.summary}</span>
                  </label>
                  <button
                    type="button"
                    data-part="delete"
                    aria-label={label(labels, "remove", { name: preset.name })}
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
