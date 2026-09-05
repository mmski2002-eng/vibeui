import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Search002Chip = {
  label: string
  active?: boolean
}

export type Search002Result = {
  title: string
  description: string
  /** Подстрока, которую нужно подсветить в title и description. */
  match: string
}

export type Search002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  chips?: Search002Chip[]
  /** Название items, а не results: HTML-атрибут results зарезервирован под number. */
  items?: Search002Result[]
  countLabel?: string
  showChips?: boolean
  accent?: string
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Разбивает текст по совпадению и заворачивает найденную часть в <mark>. */
function highlight(text: string, match: string): ReactNode {
  if (!match.trim()) {
    return text
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(match)})`, "gi"))

  return parts.map((part, index) =>
    part.toLowerCase() === match.toLowerCase() ? (
      <mark data-part="hit" key={index}>
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

// Идея: панель результатов поиска. Строки въезжают по очереди снизу вверх,
// а подсветка совпадений (mark) загорается акцентным цветом с небольшой
// задержкой после самой строки — обе анимации читают одну переменную
// --vibeui-search-002-row, которую CSS custom property наследует от <li>
// вниз к вложенным <mark>, поэтому второй таймер не нужен.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="search-002"]){
--vibeui-search-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-search-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-search-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-search-002-muted:color-mix(in oklab,var(--vibeui-search-002-fg) 58%,transparent);
--vibeui-search-002-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-search-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-search-002-accent-fg:oklch(from var(--vibeui-search-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-search-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="search-002"]{color-scheme:dark}
[data-vibeui-block="search-002"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-search-002-fg);font-family:var(--vibeui-search-002-font);
}
[data-vibeui-block="search-002"] *{box-sizing:border-box}
[data-vibeui-block="search-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-search-002-border);
background:var(--vibeui-search-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="search-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-search-002-border);
}
[data-vibeui-block="search-002"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="search-002"] [data-part="count"]{
flex:none;font-size:0.625rem;font-weight:600;color:var(--vibeui-search-002-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="search-002"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.375rem;padding:0.625rem 0.875rem 0;
}
[data-vibeui-block="search-002"][data-chips="false"] [data-part="chips"]{display:none}
[data-vibeui-block="search-002"] [data-part="chip"]{
display:inline-flex;align-items:center;padding:0.25rem 0.625rem;border-radius:9999px;
font-size:0.6875rem;font-weight:600;color:var(--vibeui-search-002-muted);
background:var(--vibeui-search-002-frame);
box-shadow:inset 0 0 0 1px var(--vibeui-search-002-border);
}
[data-vibeui-block="search-002"] [data-part="chip"][data-active="true"]{
color:var(--vibeui-search-002-accent-fg);background:var(--vibeui-search-002-accent);
box-shadow:none;
}
[data-vibeui-block="search-002"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0.75rem 0.875rem;list-style:none;
gap:0.75rem;
}
[data-vibeui-block="search-002"] [data-part="row"]{
opacity:0;transform:translateY(6px);
animation:vibeui-search-002-rise 0.42s ease both;
animation-delay:calc(var(--vibeui-search-002-row,0) * 0.12s);
}
[data-vibeui-block="search-002"] [data-part="rtitle"]{
margin:0;font-size:0.75rem;font-weight:600;line-height:1.4;
}
[data-vibeui-block="search-002"] [data-part="rdesc"]{
margin:0.125rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-search-002-muted);
}
[data-vibeui-block="search-002"] [data-part="hit"]{
background:transparent;color:inherit;border-radius:0.25rem;padding:0 0.05em;font:inherit;
animation:vibeui-search-002-highlight 0.3s ease both;
animation-delay:calc(var(--vibeui-search-002-row,0) * 0.12s + 0.32s);
}
@keyframes vibeui-search-002-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes vibeui-search-002-highlight{
from{background:transparent;color:inherit}
to{background:color-mix(in oklab,var(--vibeui-search-002-accent) 22%,transparent);color:var(--vibeui-search-002-accent)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="search-002"] [data-part="row"]{animation:none;opacity:1;transform:none}
[data-vibeui-block="search-002"] [data-part="hit"]{
animation:none;
background:color-mix(in oklab,var(--vibeui-search-002-accent) 22%,transparent);color:var(--vibeui-search-002-accent);
}
}
`

const DEFAULT_CHIPS: Search002Chip[] = [
  { label: "Все", active: true },
  { label: "Настройки" },
  { label: "Документы" },
  { label: "Профиль" },
]

const DEFAULT_RESULTS: Search002Result[] = [
  {
    title: "Настройки уведомлений",
    description: "Управление push- и email-оповещениями в разделе профиля",
    match: "уведомл",
  },
  {
    title: "Уведомления о платежах",
    description: "Включить оповещения об изменении баланса счёта",
    match: "уведомл",
  },
  {
    title: "История уведомлений",
    description: "Архив отправленных системных уведомлений за 30 дней",
    match: "уведомл",
  },
]

/**
 * Панель результатов поиска: фильтр-чипы, счётчик найденного и список с
 * подсветкой совпадений, строки въезжают по очереди. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Search002({
  title = "Результаты поиска",
  chips = DEFAULT_CHIPS,
  items = DEFAULT_RESULTS,
  countLabel = "Найдено",
  showChips = true,
  accent,
  className,
  style,
  ...props
}: Search002Props) {
  const palette = {
    ...(accent ? { "--vibeui-search-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-search-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="search-002"
        data-slot="search-results"
        data-chips={showChips ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            <span data-part="count">
              {countLabel} {items.length}
            </span>
          </div>
          <div data-part="chips">
            {chips.map((chip) => (
              <span
                data-part="chip"
                data-active={chip.active ? "true" : undefined}
                key={chip.label}
              >
                {chip.label}
              </span>
            ))}
          </div>
          <ul data-part="list">
            {items.map((result, index) => {
              const rowStyle = {
                "--vibeui-search-002-row": index,
              } as CSSProperties

              return (
                <li data-part="row" style={rowStyle} key={result.title}>
                  <p data-part="rtitle">
                    {highlight(result.title, result.match)}
                  </p>
                  <p data-part="rdesc">
                    {highlight(result.description, result.match)}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
