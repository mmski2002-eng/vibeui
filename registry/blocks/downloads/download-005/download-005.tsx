import type { CSSProperties } from "react"

export type Download005Props = {
  version?: string
  date?: string
  /** Что нового в этой версии: три-четыре коротких пункта. */
  changes?: string[]
  primaryLabel?: string
  primaryNote?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  notesLabel?: string
  notesHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Полоса релиза: версия, дата, что нового и кнопка загрузки. Компактный
// формат для страницы продукта, где секция загрузки уже была выше, а внизу
// нужно ещё раз показать, что продукт живой и обновляется.
//
// Полоса — одна карточка, а не секция во весь экран: её ставят между
// разделами, и высокий блок разорвал бы ритм страницы.
const STYLES = `
:where([data-vibeui-block="download-005"]){
--vibeui-download-005-bg:transparent;
--vibeui-download-005-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-download-005-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-download-005-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-download-005-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-download-005-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-download-005-accent-ink:oklch(from var(--vibeui-download-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-download-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-download-005-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="download-005"]{color-scheme:dark}
[data-vibeui-block="download-005"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-download-005-bg);color:var(--vibeui-download-005-ink);
font-family:var(--vibeui-download-005-font);
}
[data-vibeui-block="download-005"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:2.5rem 1.25rem}
[data-vibeui-block="download-005"] [data-part="card"]{
display:grid;gap:1.5rem;align-items:center;grid-template-columns:minmax(0,1fr);
padding:1.5rem;border:1px solid var(--vibeui-download-005-border);border-radius:1.25rem;
background:var(--vibeui-download-005-card);
}
[data-vibeui-block="download-005"] [data-part="body"]{min-inline-size:0;display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="download-005"] [data-part="line"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.625rem}
[data-vibeui-block="download-005"] [data-part="version"]{
padding:0.1875rem 0.5rem;border-radius:0.5rem;
background:color-mix(in oklab, var(--vibeui-download-005-accent) 14%, transparent);
color:var(--vibeui-download-005-accent);
font-family:var(--vibeui-download-005-mono);font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="download-005"] [data-part="date"]{color:var(--vibeui-download-005-muted);font-size:0.875rem}
[data-vibeui-block="download-005"] [data-part="notes"]{color:var(--vibeui-download-005-muted);font-size:0.875rem;text-decoration:none;border-bottom:1px solid var(--vibeui-download-005-border)}
[data-vibeui-block="download-005"] [data-part="notes"]:hover{color:var(--vibeui-download-005-ink);border-color:var(--vibeui-download-005-accent)}
[data-vibeui-block="download-005"] [data-part="changes"]{list-style:none;margin:0;padding:0;display:grid;gap:0.375rem}
[data-vibeui-block="download-005"] [data-part="change"]{position:relative;padding-left:1.125rem;font-size:0.9375rem;line-height:1.5}
[data-vibeui-block="download-005"] [data-part="change"]::before{
content:"";position:absolute;left:0.1875rem;top:0.5rem;
width:0.375rem;height:0.375rem;border-radius:999px;background:var(--vibeui-download-005-accent);color:oklch(from var(--vibeui-download-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="download-005"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem;align-items:flex-start}
[data-vibeui-block="download-005"] [data-part="primary"]{
display:inline-flex;align-items:center;justify-content:center;
padding:0.75rem 1.5rem;border-radius:0.875rem;
background:var(--vibeui-download-005-accent);color:oklch(from var(--vibeui-download-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.9375rem;font-weight:700;text-decoration:none;transition:opacity .18s ease;
}
[data-vibeui-block="download-005"] [data-part="primary"]:hover{opacity:.9}
[data-vibeui-block="download-005"] [data-part="primary"]:focus-visible{outline:2px solid var(--vibeui-download-005-accent);outline-offset:3px}
[data-vibeui-block="download-005"] [data-part="hint"]{color:var(--vibeui-download-005-muted);font-size:0.8125rem}
[data-vibeui-block="download-005"] [data-part="secondary"]{color:var(--vibeui-download-005-ink);font-size:0.875rem;text-decoration:none;border-bottom:1px solid var(--vibeui-download-005-accent)}
[data-vibeui-block="download-005"] [data-part="secondary"]:hover{color:var(--vibeui-download-005-accent)}
@container (min-width: 42rem){
[data-vibeui-block="download-005"] [data-part="shell"]{padding:3rem 2rem}
[data-vibeui-block="download-005"] [data-part="card"]{grid-template-columns:minmax(0,1fr) auto;padding:1.75rem 2rem;gap:2.5rem}
[data-vibeui-block="download-005"] [data-part="actions"]{align-items:flex-end}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHANGES = [
  "Офлайн-режим: заказы отправляются, как только вернётся сеть",
  "Поиск стал находить по артикулу и по штрихкоду",
  "Починили выгрузку отчётов на устройствах с малым экраном",
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

/** Полоса релиза: версия, дата, что нового и кнопка загрузки. */
export function Download005({
  version = "2.4.0",
  date = "12 марта",
  changes = DEFAULT_CHANGES,
  primaryLabel = "Скачать обновление",
  primaryNote = "macOS 12 и новее · 38 МБ",
  primaryHref = "#",
  secondaryLabel = "Другие платформы",
  secondaryHref = "#",
  notesLabel = "Все изменения",
  notesHref = "#",
  background = "",
  accent,
  className,
  style,
}: Download005Props) {
  const palette = {
    ...(accent ? { "--vibeui-download-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-download-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-download-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="download-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <div data-part="body">
              <p data-part="line">
                <span data-part="version">{version}</span>
                <span data-part="date">{date}</span>
                {notesLabel ? (
                  <a data-part="notes" href={notesHref}>
                    {notesLabel}
                  </a>
                ) : null}
              </p>

              <ul data-part="changes">
                {changes.map((change) => (
                  <li key={change} data-part="change">
                    {change}
                  </li>
                ))}
              </ul>
            </div>

            <div data-part="actions">
              <a data-part="primary" href={primaryHref}>
                {primaryLabel}
              </a>
              {primaryNote ? <span data-part="hint">{primaryNote}</span> : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
