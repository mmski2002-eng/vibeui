"use client"

import { useState, type CSSProperties } from "react"

type Changelog003Entry = {
  version: string
  date: string
  type: string
  text: string
}

export type Changelog003Props = {
  eyebrow?: string
  title?: string
  entries?: Changelog003Entry[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Лента изменений с фильтром по типу: чипы «Все / Новое / Исправления /
// Улучшения» скрывают ненужные записи. Фильтр клиентский и работает на
// data-атрибуте типа, без перерисовки списка — состояние держит только
// активный чип, а видимость строк решает CSS по совпадению атрибутов.
const STYLES = `
:where([data-vibeui-block="changelog-003"]){
--vibeui-changelog-003-bg:transparent;
--vibeui-changelog-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-changelog-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-changelog-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-changelog-003-chip:light-dark(oklch(0.97 0 0),oklch(0.24 0 0));
--vibeui-changelog-003-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-changelog-003-on-accent:oklch(0.15 0.02 39.8);
--vibeui-changelog-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-changelog-003-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="changelog-003"]{color-scheme:dark}
[data-vibeui-block="changelog-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-changelog-003-bg);color:var(--vibeui-changelog-003-ink);
font-family:var(--vibeui-changelog-003-font);
}
[data-vibeui-block="changelog-003"] [data-part="shell"]{max-width:48rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="changelog-003"] [data-part="eyebrow"]{
margin:0 0 0.5rem;color:var(--vibeui-changelog-003-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="changelog-003"] [data-part="title"]{margin:0 0 1.5rem;font-size:clamp(1.5rem,4.5cqi,2.25rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="changelog-003"] [data-part="filters"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.75rem}
[data-vibeui-block="changelog-003"] [data-part="chip"]{
appearance:none;cursor:pointer;border:1px solid var(--vibeui-changelog-003-border);
background:var(--vibeui-changelog-003-chip);color:var(--vibeui-changelog-003-ink);
padding:0.375rem 0.875rem;border-radius:999px;font:inherit;font-size:0.8125rem;font-weight:600;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="changelog-003"] [data-part="chip"]:hover{border-color:var(--vibeui-changelog-003-accent)}
[data-vibeui-block="changelog-003"] [data-part="chip"][aria-pressed="true"]{
background:var(--vibeui-changelog-003-accent);color:var(--vibeui-changelog-003-on-accent);border-color:transparent;
}
[data-vibeui-block="changelog-003"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-changelog-003-accent);outline-offset:2px}
[data-vibeui-block="changelog-003"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;gap:1rem}
[data-vibeui-block="changelog-003"] [data-part="row"]{
display:grid;gap:0.5rem;padding-bottom:1rem;border-bottom:1px solid var(--vibeui-changelog-003-border);
}
[data-vibeui-block="changelog-003"] [data-part="row"]:last-child{border-bottom:0;padding-bottom:0}
[data-vibeui-block="changelog-003"] [data-part="row"][hidden]{display:none}
[data-vibeui-block="changelog-003"] [data-part="meta"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem}
[data-vibeui-block="changelog-003"] [data-part="version"]{font-family:var(--vibeui-changelog-003-mono);font-size:0.875rem;font-weight:650}
[data-vibeui-block="changelog-003"] [data-part="type"]{
padding:0.125rem 0.5rem;border-radius:0.375rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-changelog-003-accent);background:color-mix(in oklab,var(--vibeui-changelog-003-accent) 12%,transparent);
}
[data-vibeui-block="changelog-003"] [data-part="date"]{color:var(--vibeui-changelog-003-muted);font-size:0.8125rem}
[data-vibeui-block="changelog-003"] [data-part="text"]{font-size:0.9375rem;line-height:1.55}
[data-vibeui-block="changelog-003"] [data-part="empty"]{color:var(--vibeui-changelog-003-muted);font-size:0.9375rem}
@container (min-width: 40rem){[data-vibeui-block="changelog-003"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="changelog-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Changelog003Entry[] = [
  {
    version: "v2.4.0",
    date: "6 сен 2026",
    type: "Новое",
    text: "Шесть новых категорий блоков в каталоге.",
  },
  {
    version: "v2.4.0",
    date: "6 сен 2026",
    type: "Улучшение",
    text: "Поиск подсвечивает совпадение в карточке.",
  },
  {
    version: "v2.3.1",
    date: "28 авг 2026",
    type: "Исправление",
    text: "Тёмная подложка превью больше не мигает.",
  },
  {
    version: "v2.3.0",
    date: "14 авг 2026",
    type: "Улучшение",
    text: "Copy for AI собирает инструкцию из метаданных.",
  },
  {
    version: "v2.3.0",
    date: "14 авг 2026",
    type: "Новое",
    text: "Переключатель темы оболочки каталога.",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Лента изменений с клиентским фильтром по типу релиза. */
export function Changelog003({
  eyebrow = "История изменений",
  title = "Все обновления каталога",
  entries = DEFAULT_ENTRIES,
  background = "",
  accent,
  className,
  style,
}: Changelog003Props) {
  const types = Array.from(new Set(entries.map((entry) => entry.type)))
  const [active, setActive] = useState<string | null>(null)
  const shown = entries.filter(
    (entry) => active === null || entry.type === active,
  )

  const palette = {
    ...(accent ? { "--vibeui-changelog-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-changelog-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-changelog-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="changelog-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="filters" role="group" aria-label="Фильтр по типу">
            <button
              type="button"
              data-part="chip"
              aria-pressed={active === null}
              onClick={() => setActive(null)}
            >
              Все
            </button>
            {types.map((type) => (
              <button
                key={type}
                type="button"
                data-part="chip"
                aria-pressed={active === type}
                onClick={() => setActive(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <ul data-part="list">
            {entries.map((entry, index) => (
              <li
                key={`${entry.version}-${index}`}
                data-part="row"
                hidden={active !== null && entry.type !== active}
              >
                <div data-part="meta">
                  <span data-part="version">{entry.version}</span>
                  <span data-part="type">{entry.type}</span>
                  <span data-part="date">{entry.date}</span>
                </div>
                <p data-part="text">{entry.text}</p>
              </li>
            ))}
          </ul>
          {shown.length === 0 ? (
            <p data-part="empty">Записей этого типа пока нет.</p>
          ) : null}
        </div>
      </section>
    </>
  )
}
