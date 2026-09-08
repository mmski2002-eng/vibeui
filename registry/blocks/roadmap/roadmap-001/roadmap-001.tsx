import type { CSSProperties } from "react"

type Roadmap001Item = {
  title: string
  note?: string
}

type Roadmap001Column = {
  status: string
  items: Roadmap001Item[]
}

export type Roadmap001Props = {
  eyebrow?: string
  title?: string
  columns?: Roadmap001Column[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Публичный роадмап тремя колонками: «Запланировано / В работе / Готово».
// Колонка «В работе» выделена брендовой рамкой — это фокус внимания.
// Карточки внутри — короткие пункты с необязательной подписью. Формат
// канбан-доски статусов: читатель сразу видит, что уже сделано и что впереди.
const STYLES = `
:where([data-vibeui-block="roadmap-001"]){
--vibeui-roadmap-001-bg:transparent;
--vibeui-roadmap-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-roadmap-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-roadmap-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-roadmap-001-col:light-dark(oklch(0.98 0 0),oklch(0.19 0 0));
--vibeui-roadmap-001-card:light-dark(oklch(1 0 0),oklch(0.24 0 0));
--vibeui-roadmap-001-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-roadmap-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="roadmap-001"]{color-scheme:dark}
[data-vibeui-block="roadmap-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-roadmap-001-bg);color:var(--vibeui-roadmap-001-ink);
font-family:var(--vibeui-roadmap-001-font);
}
[data-vibeui-block="roadmap-001"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="roadmap-001"] [data-part="eyebrow"]{
margin:0 0 0.5rem;color:var(--vibeui-roadmap-001-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="roadmap-001"] [data-part="title"]{margin:0 0 2rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="roadmap-001"] [data-part="board"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="roadmap-001"] [data-part="col"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.75rem;
padding:1rem;border:1px solid var(--vibeui-roadmap-001-border);border-radius:1rem;
background:var(--vibeui-roadmap-001-col);
}
[data-vibeui-block="roadmap-001"] [data-part="col"][data-active="true"]{
border-color:var(--vibeui-roadmap-001-accent);
box-shadow:0 0 0 1px var(--vibeui-roadmap-001-accent);
}
[data-vibeui-block="roadmap-001"] [data-part="status"]{
display:flex;align-items:center;gap:0.5rem;margin:0;
font-size:0.875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="roadmap-001"] [data-part="dot"]{width:0.625rem;height:0.625rem;border-radius:999px;background:var(--vibeui-roadmap-001-accent);flex:none}
[data-vibeui-block="roadmap-001"] [data-part="cards"]{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem}
[data-vibeui-block="roadmap-001"] [data-part="card"]{
padding:0.75rem 0.875rem;border:1px solid var(--vibeui-roadmap-001-border);border-radius:0.75rem;
background:var(--vibeui-roadmap-001-card);
}
[data-vibeui-block="roadmap-001"] [data-part="card-title"]{margin:0;font-size:0.9375rem;font-weight:600;line-height:1.4}
[data-vibeui-block="roadmap-001"] [data-part="card-note"]{margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-roadmap-001-muted)}
@container (min-width: 44rem){
[data-vibeui-block="roadmap-001"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="roadmap-001"] [data-part="board"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="roadmap-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Roadmap001Column[] = [
  {
    status: "Запланировано",
    items: [
      {
        title: "Раздел анимаций",
        note: "Воссозданные анимированные компоненты",
      },
      { title: "Экспорт в Figma", note: "Токены и обложки макетом" },
      { title: "Поиск по коду блока" },
    ],
  },
  {
    status: "В работе",
    items: [
      { title: "Новые категории блоков", note: "Ошибки, команда, кейсы" },
      { title: "Фирменная палитра", note: "Оранжевый акцент во всём каталоге" },
    ],
  },
  {
    status: "Готово",
    items: [
      { title: "Copy for AI", note: "Инструкция из метаданных" },
      { title: "Тёмная тема оболочки" },
      { title: "Живое превью компонентов" },
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

/** Публичный роадмап тремя колонками статусов; «В работе» выделена. */
export function Roadmap001({
  eyebrow = "Планы развития",
  title = "Над чем мы работаем",
  columns = DEFAULT_COLUMNS,
  background = "",
  accent,
  className,
  style,
}: Roadmap001Props) {
  const palette = {
    ...(accent ? { "--vibeui-roadmap-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-roadmap-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-roadmap-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="roadmap-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="board">
            {columns.map((column, index) => (
              <div
                key={column.status}
                data-part="col"
                data-active={index === 1 ? "true" : undefined}
              >
                <h3 data-part="status">
                  <span data-part="dot" aria-hidden="true" />
                  {column.status}
                </h3>
                <ul data-part="cards">
                  {column.items.map((item) => (
                    <li key={item.title} data-part="card">
                      <p data-part="card-title">{item.title}</p>
                      {item.note ? (
                        <p data-part="card-note">{item.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
