import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline005Revision = {
  version: string
  author: string
  note: string
  time: string
  added?: number
  removed?: number
  current?: boolean
}

export type Timeline005Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  revisions?: Timeline005Revision[]
  title?: string
  accent?: string
}

// Идея компонента: история правок документа, где объём изменения видно
// глазом. Рядом с каждой версией стоит двухцветная полоска: её левая часть
// пропорциональна добавленным строкам, правая — удалённым. Числа продублированы
// текстом, потому что полоска без подписи — украшение, а не данные.
const STYLES = `
:where([data-vibeui-block="timeline-005"]){
--vibeui-timeline-005-bg:oklch(1 0 0);
--vibeui-timeline-005-fg:oklch(0.22 0.014 265);
--vibeui-timeline-005-muted:oklch(0.57 0.014 265);
--vibeui-timeline-005-border:oklch(0.91 0.006 265);
--vibeui-timeline-005-added:oklch(0.6 0.13 150);
--vibeui-timeline-005-removed:oklch(0.6 0.16 25);
--vibeui-timeline-005-accent:oklch(0.55 0.18 262);
--vibeui-timeline-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
    added: 64,
    removed: 12,
    current: true,
  },
  {
    version: "v11",
    author: "Аня Петрова",
    note: "Правки после юридической проверки",
    time: "вчера, 18:05",
    added: 18,
    removed: 44,
  },
  {
    version: "v10",
    author: "Лиза Ким",
    note: "Добавлены примеры договоров",
    time: "11 марта",
    added: 132,
    removed: 3,
  },
  {
    version: "v9",
    author: "Марк Иванов",
    note: "Первая полная версия",
    time: "6 марта",
    added: 210,
    removed: 0,
  },
]

/**
 * История правок документа: автор, комментарий и объём изменения полоской.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline005({
  revisions = DEFAULT_REVISIONS,
  title = "История документа",
  accent,
  className,
  style,
  ...props
}: Timeline005Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
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
                    {revision.time}
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
                      <span data-part="badge">текущая</span>
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
