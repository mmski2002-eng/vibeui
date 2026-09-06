import type { CSSProperties } from "react"

type Changelog001Entry = {
  version: string
  date: string
  tag: string
  title: string
  points: string[]
}

export type Changelog001Props = {
  eyebrow?: string
  title?: string
  entries?: Changelog001Entry[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Лента версий: вертикальная ось слева, релизы под ней от нового к старому.
// Дата и номер версии — на самой оси, тег типа релиза и список изменений —
// в карточке справа. Ось задаёт хронологию визуально: читается сверху вниз
// как «что менялось со временем», а не как разрозненные карточки.
const STYLES = `
:where([data-vibeui-block="changelog-001"]){
--vibeui-changelog-001-bg:transparent;
--vibeui-changelog-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-changelog-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-changelog-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-changelog-001-card:light-dark(oklch(1 0 0),oklch(0.2 0 0));
--vibeui-changelog-001-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-changelog-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-changelog-001-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="changelog-001"]{color-scheme:dark}
[data-vibeui-block="changelog-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-changelog-001-bg);color:var(--vibeui-changelog-001-ink);
font-family:var(--vibeui-changelog-001-font);
}
[data-vibeui-block="changelog-001"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="changelog-001"] [data-part="eyebrow"]{
margin:0 0 0.5rem;color:var(--vibeui-changelog-001-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="changelog-001"] [data-part="title"]{
margin:0 0 2.5rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="changelog-001"] [data-part="list"]{list-style:none;margin:0;padding:0}
[data-vibeui-block="changelog-001"] [data-part="row"]{
position:relative;display:grid;gap:0.75rem;
padding:0 0 2.25rem 1.75rem;
border-left:2px solid var(--vibeui-changelog-001-border);
}
[data-vibeui-block="changelog-001"] [data-part="row"]:last-child{border-left-color:transparent;padding-bottom:0}
/* Точка на оси: кружок с брендовой заливкой, выехавший на линию. */
[data-vibeui-block="changelog-001"] [data-part="row"]::before{
content:"";position:absolute;left:-0.4375rem;top:0.25rem;
width:0.75rem;height:0.75rem;border-radius:999px;
background:var(--vibeui-changelog-001-accent);
box-shadow:0 0 0 4px var(--vibeui-changelog-001-bg);
}
[data-vibeui-block="changelog-001"] [data-part="meta"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;
}
[data-vibeui-block="changelog-001"] [data-part="version"]{
font-family:var(--vibeui-changelog-001-mono);font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="changelog-001"] [data-part="date"]{color:var(--vibeui-changelog-001-muted);font-size:0.8125rem}
[data-vibeui-block="changelog-001"] [data-part="tag"]{
padding:0.125rem 0.5rem;border-radius:0.375rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-changelog-001-accent);
background:color-mix(in oklab,var(--vibeui-changelog-001-accent) 12%,transparent);
}
[data-vibeui-block="changelog-001"] [data-part="head"]{margin:0;font-size:1rem;font-weight:640}
[data-vibeui-block="changelog-001"] [data-part="points"]{
list-style:none;margin:0.25rem 0 0;padding:0;display:grid;gap:0.375rem;
}
[data-vibeui-block="changelog-001"] [data-part="point"]{
position:relative;padding-left:1rem;font-size:0.9375rem;line-height:1.5;color:var(--vibeui-changelog-001-muted);
}
[data-vibeui-block="changelog-001"] [data-part="point"]::before{
content:"";position:absolute;left:0;top:0.5625rem;width:0.375rem;height:0.375rem;border-radius:999px;
background:var(--vibeui-changelog-001-accent);
}
@container (min-width: 40rem){
[data-vibeui-block="changelog-001"] [data-part="shell"]{padding:4rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="changelog-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Changelog001Entry[] = [
  {
    version: "v2.4.0",
    date: "6 сентября 2026",
    tag: "Новое",
    title: "Каталог блоков вырос вдвое",
    points: [
      "Добавили страницы ошибок, команду, кейсы и логотипы клиентов",
      "У шести тонких категорий теперь по пятнадцать вариантов",
      "Поиск подсвечивает совпадения прямо в карточке",
    ],
  },
  {
    version: "v2.3.1",
    date: "28 августа 2026",
    tag: "Исправление",
    title: "Починили тёмную подложку превью",
    points: [
      "Кадр компонента больше не мигает при загрузке",
      "Скролл каталога рисуется в цвет темы, а не белым",
    ],
  },
  {
    version: "v2.3.0",
    date: "14 августа 2026",
    tag: "Улучшение",
    title: "Copy for AI стал точнее",
    points: [
      "Инструкция агенту собирается из метаданных без ручной правки",
      "В команду установки подставляется актуальный реестр",
    ],
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

/** Лента версий: хронологическая ось, релизы карточками от нового к старому. */
export function Changelog001({
  eyebrow = "История изменений",
  title = "Что нового в каталоге",
  entries = DEFAULT_ENTRIES,
  background = "",
  accent,
  className,
  style,
}: Changelog001Props) {
  const palette = {
    ...(accent ? { "--vibeui-changelog-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-changelog-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-changelog-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="changelog-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ol data-part="list">
            {entries.map((entry) => (
              <li key={entry.version} data-part="row">
                <div data-part="meta">
                  <span data-part="version">{entry.version}</span>
                  <span data-part="tag">{entry.tag}</span>
                  <span data-part="date">{entry.date}</span>
                </div>
                <h3 data-part="head">{entry.title}</h3>
                <ul data-part="points">
                  {entry.points.map((point) => (
                    <li key={point} data-part="point">
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
