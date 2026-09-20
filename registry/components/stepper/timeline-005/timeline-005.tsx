import type { ComponentProps, CSSProperties } from "react"

export type Timeline005Revision = {
  version: string
  author: string
  note: string
  time: string
  /** Машиночитаемый момент для <time datetime>: «вчера» роботу не дата. */
  dateTime: string
  added?: number
  removed?: number
  current?: boolean
}

export type Timeline005Props = Omit<ComponentProps<"section">, "children"> & {
  revisions?: Timeline005Revision[]
  title?: string
  /** Метка текущей версии: компонент несёт русскую, проект подставляет свою. */
  currentLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: история правок документа, где объём изменения видно
// глазом. Рядом с каждой версией стоит двухцветная полоска: её левая часть
// пропорциональна добавленным строкам, правая — удалённым. Числа продублированы
// текстом, потому что полоска без подписи — украшение, а не данные.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-005"]){
--vibeui-timeline-005-bg:transparent;
--vibeui-timeline-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-timeline-005-muted:color-mix(in oklab,var(--vibeui-timeline-005-fg) 68%,transparent);
--vibeui-timeline-005-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-timeline-005-added:light-dark(oklch(0.6 0.13 150),oklch(0.74 0.13 150));
--vibeui-timeline-005-removed:light-dark(oklch(0.58 0.2 25),oklch(0.72 0.19 25));
--vibeui-timeline-005-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-timeline-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="timeline-005"]{color-scheme:dark}
[data-vibeui-block="timeline-005"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:28rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-005-bg);
border:1px solid var(--vibeui-timeline-005-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-005-font);color:var(--vibeui-timeline-005-fg);
}
[data-vibeui-block="timeline-005"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-005"] ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-005"] li{
position:relative;display:grid;grid-template-columns:2.75rem 1fr;
gap:0.625rem;padding:0 0 0.875rem;
}
[data-vibeui-block="timeline-005"] li::before{
content:"";position:absolute;left:1.3125rem;top:1.5rem;bottom:0;
width:1px;background:var(--vibeui-timeline-005-border);
}
[data-vibeui-block="timeline-005"] li:last-child{padding-bottom:0}
[data-vibeui-block="timeline-005"] li:last-child::before{display:none}
/* Номер версии — не иконка: он и есть смысл строки, и его читают вслух. */
[data-vibeui-block="timeline-005"] [data-part="version"]{
display:flex;align-items:center;justify-content:center;
height:1.375rem;box-sizing:border-box;padding:0 0.375rem;
border:1px solid var(--vibeui-timeline-005-border);border-radius:0.375rem;
background:var(--vibeui-timeline-005-bg);
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-timeline-005-muted);
}
[data-vibeui-block="timeline-005"] li[data-current="true"] [data-part="version"]{
border-color:var(--vibeui-timeline-005-accent);color:var(--vibeui-timeline-005-accent);
}
[data-vibeui-block="timeline-005"] [data-part="body"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
[data-vibeui-block="timeline-005"] [data-part="note"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="timeline-005"] [data-part="by"]{font-size:0.75rem;color:var(--vibeui-timeline-005-muted)}
[data-vibeui-block="timeline-005"] [data-part="who"]{color:var(--vibeui-timeline-005-fg);font-weight:600}
[data-vibeui-block="timeline-005"] [data-part="diff"]{
display:flex;align-items:center;gap:0.4375rem;margin-top:0.125rem;
font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="timeline-005"] [data-part="bar"]{
display:flex;width:4rem;height:0.25rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-timeline-005-border);
}
[data-vibeui-block="timeline-005"] [data-part="plus"]{background:var(--vibeui-timeline-005-added);width:var(--vibeui-timeline-005-share,50%)}
[data-vibeui-block="timeline-005"] [data-part="minus"]{background:var(--vibeui-timeline-005-removed);flex:1}
[data-vibeui-block="timeline-005"] [data-part="count-plus"]{color:var(--vibeui-timeline-005-added);font-weight:650}
[data-vibeui-block="timeline-005"] [data-part="count-minus"]{color:var(--vibeui-timeline-005-removed);font-weight:650}
[data-vibeui-block="timeline-005"] [data-part="badge"]{
margin-left:auto;padding:0.0625rem 0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-timeline-005-accent) 12%,transparent);
color:var(--vibeui-timeline-005-accent);font-size:0.625rem;font-weight:700;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REVISIONS: Timeline005Revision[] = [
  {
    version: "v12",
    author: "Марк Иванов",
    note: "Переписан раздел про тарифы",
    time: "сегодня, 14:20",
    dateTime: "2026-03-14T14:20",
    added: 64,
    removed: 12,
    current: true,
  },
  {
    version: "v11",
    author: "Аня Петрова",
    note: "Правки после юридической проверки",
    time: "вчера, 18:05",
    dateTime: "2026-03-13T18:05",
    added: 18,
    removed: 44,
  },
  {
    version: "v10",
    author: "Лиза Ким",
    note: "Добавлены примеры договоров",
    time: "11 марта",
    dateTime: "2026-03-11",
    added: 132,
    removed: 3,
  },
  {
    version: "v9",
    author: "Марк Иванов",
    note: "Первая полная версия",
    time: "6 марта",
    dateTime: "2026-03-06",
    added: 210,
    removed: 0,
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * История правок документа: автор, комментарий и объём изменения полоской.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline005({
  revisions = DEFAULT_REVISIONS,
  title = "История документа",
  currentLabel = "текущая",
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline005Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="timeline"
        data-vibeui-block="timeline-005"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ol>
          {revisions.map((revision) => {
            const added = revision.added ?? 0
            const removed = revision.removed ?? 0
            const total = added + removed || 1
            return (
              <li key={revision.version} data-current={revision.current}>
                <span data-part="version">{revision.version}</span>
                <div data-part="body">
                  <span data-part="note">{revision.note}</span>
                  <span data-part="by">
                    <span data-part="who">{revision.author}</span> ·{" "}
                    <time dateTime={revision.dateTime}>{revision.time}</time>
                  </span>
                  <p data-part="diff">
                    <span
                      data-part="bar"
                      aria-hidden="true"
                      style={
                        {
                          "--vibeui-timeline-005-share": `${Math.round((added / total) * 100)}%`,
                        } as CSSProperties
                      }
                    >
                      <span data-part="plus" />
                      <span data-part="minus" />
                    </span>
                    <span data-part="count-plus">+{added}</span>
                    <span data-part="count-minus">−{removed}</span>
                    {revision.current ? (
                      <span data-part="badge">{currentLabel}</span>
                    ) : null}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
