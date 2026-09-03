"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Filters007View = {
  id: string
  name: string
  summary: string
  shared?: boolean
}

export type Filters007Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  views?: Filters007View[]
  saveLabel?: string
  onChange?: (id: string) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: набор фильтров как именованный вид. Один и тот же отбор
// собирают заново каждое утро, и это самая частая ручная работа в любой
// таблице. Здесь каждый вид показывает не только имя, но и расшифровку
// условий — по одному имени через неделю не вспомнить, что внутри. Общие
// виды помечены отдельно: их правка меняет экран всей команде.
const STYLES = `
:where([data-vibeui-block="filters-007"]){
--vibeui-filters-007-surface:transparent;
--vibeui-filters-007-card:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-filters-007-fill:light-dark(oklch(0.975 0.004 265),oklch(0.31 0.012 265));
--vibeui-filters-007-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-filters-007-muted:color-mix(in oklab,var(--vibeui-filters-007-fg) 68%,transparent);
--vibeui-filters-007-border:light-dark(oklch(0.89 0.008 265),oklch(0.4 0.014 265));
--vibeui-filters-007-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-filters-007-accent:light-dark(oklch(0.5 0.16 210),oklch(0.76 0.13 210));
--vibeui-filters-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-007"]{color-scheme:dark}
/* Подложки по умолчанию нет: список ложится на фон страницы. */
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
background:var(--vibeui-filters-007-card);color:inherit;font:inherit;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="filters-007"] [data-part="view"]:hover{background:var(--vibeui-filters-007-fill)}
[data-vibeui-block="filters-007"] [data-part="view"]:focus-visible{outline:2px solid var(--vibeui-filters-007-accent);outline-offset:2px}
[data-vibeui-block="filters-007"] [data-part="view"][aria-pressed="true"]{
border-color:var(--vibeui-filters-007-accent);
background:color-mix(in oklab,var(--vibeui-filters-007-accent) 8%,var(--vibeui-filters-007-card));
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

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  shared: "общий",
  newName: "Новый вид {index}",
  newSummary: "Текущие условия отбора",
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
 * Сохранённые наборы фильтров: имя, расшифровка условий и метка общего вида.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters007({
  title = "Сохранённые виды",
  views = DEFAULT_VIEWS,
  saveLabel = "Сохранить текущий отбор",
  onChange,
  labels = DEFAULT_LABELS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Filters007Props) {
  const [list, setList] = useState(views)
  const [active, setActive] = useState(views[0]?.id ?? "")

  const palette = {
    ...(accent ? { "--vibeui-filters-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-filters-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        name: label(labels, "newName", { index: String(list.length + 1) }),
        summary: label(labels, "newSummary"),
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
        data-slot="filters"
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
                  {view.shared ? (
                    <span data-part="shared">{label(labels, "shared")}</span>
                  ) : null}
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
