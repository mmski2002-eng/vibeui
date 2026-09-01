import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline010Kind = "edit" | "comment" | "permission" | "attachment"

export type Timeline010Entry = {
  time: string
  dateTime: string
  author: string
  kind: Timeline010Kind
  note: string
}

export type Timeline010Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  entries?: Timeline010Entry[]
  title?: string
}

// Идея компонента: история правок документа, где тип правки виден раньше
// текста и не спрятан за одним только цветом. Тип — видимая текстовая
// плашка, а не скрытая подпись и не значок: она читается вслух и с одного
// взгляда, потому что оттенок плашки задан единственной переменной на
// data-kind — четыре типа стоят четырьмя строчками CSS, а не четырьмя
// наборами правил.
const STYLES = `
:where([data-vibeui-block="timeline-010"]){
--vibeui-timeline-010-bg:oklch(1 0 0);
--vibeui-timeline-010-fg:oklch(0.22 0.014 265);
--vibeui-timeline-010-muted:oklch(0.57 0.014 265);
--vibeui-timeline-010-border:oklch(0.91 0.006 265);
--vibeui-timeline-010-hue:262;
--vibeui-timeline-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-010"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-010-bg);
border:1px solid var(--vibeui-timeline-010-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-010-font);color:var(--vibeui-timeline-010-fg);
}
[data-vibeui-block="timeline-010"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-010"] ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-010"] li{
position:relative;display:flex;flex-direction:column;gap:0.3125rem;
padding:0 0 1rem 1.25rem;
border-left:2px solid var(--vibeui-timeline-010-border);
}
[data-vibeui-block="timeline-010"] li:last-child{border-left-color:transparent;padding-bottom:0}
[data-vibeui-block="timeline-010"] [data-part="dot"]{
position:absolute;left:-0.375rem;top:0.25rem;
width:0.625rem;height:0.625rem;border-radius:9999px;
background:oklch(0.6 0.14 var(--vibeui-timeline-010-hue));
}
[data-vibeui-block="timeline-010"] li[data-kind="edit"]{--vibeui-timeline-010-hue:262}
[data-vibeui-block="timeline-010"] li[data-kind="comment"]{--vibeui-timeline-010-hue:200}
[data-vibeui-block="timeline-010"] li[data-kind="permission"]{--vibeui-timeline-010-hue:35}
[data-vibeui-block="timeline-010"] li[data-kind="attachment"]{--vibeui-timeline-010-hue:150}
[data-vibeui-block="timeline-010"] [data-part="row"]{display:flex;align-items:center;flex-wrap:wrap;gap:0.4375rem}
/* Тип правки — видимая плашка со словом, а не скрытая подпись или значок. */
[data-vibeui-block="timeline-010"] [data-part="pill"]{
display:inline-flex;align-items:center;
padding:0.0625rem 0.5rem;border-radius:9999px;
background:oklch(0.95 0.04 var(--vibeui-timeline-010-hue));
color:oklch(0.4 0.14 var(--vibeui-timeline-010-hue));
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="timeline-010"] [data-part="author"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="timeline-010"] [data-part="time"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-timeline-010-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="timeline-010"] [data-part="note"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-timeline-010-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-010"] *{animation:none!important;transition:none!important}}
`

const KIND_LABEL: Record<Timeline010Kind, string> = {
  edit: "Правка текста",
  comment: "Комментарий",
  permission: "Права доступа",
  attachment: "Вложение",
}

const DEFAULT_ENTRIES: Timeline010Entry[] = [
  {
    time: "сегодня, 14:20",
    dateTime: "2026-03-14T14:20",
    author: "Марк Иванов",
    kind: "edit",
    note: "Переписан раздел про тарифы",
  },
  {
    time: "сегодня, 11:05",
    dateTime: "2026-03-14T11:05",
    author: "Лиза Ким",
    kind: "permission",
    note: "Открыт доступ для отдела продаж",
  },
  {
    time: "вчера, 18:05",
    dateTime: "2026-03-13T18:05",
    author: "Аня Петрова",
    kind: "comment",
    note: "«Проверьте цифры в третьем абзаце»",
  },
  {
    time: "вчера, 09:40",
    dateTime: "2026-03-13T09:40",
    author: "Марк Иванов",
    kind: "attachment",
    note: "Добавлен файл прайс-лист.pdf",
  },
]

/**
 * История правок документа: тип правки видимой плашкой, автор и время.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline010({
  entries = DEFAULT_ENTRIES,
  title = "Правки документа",
  className,
  style,
  ...props
}: Timeline010Props) {
  return (
    <>
      <style href="vibeui-timeline-010" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-010"
        className={className}
        style={style as CSSProperties}
      >
        <h3 data-part="title">{title}</h3>
        <ol>
          {entries.map((entry, index) => (
            <li key={`${entry.dateTime}-${index}`} data-kind={entry.kind}>
              <span data-part="dot" aria-hidden="true" />
              <div data-part="row">
                <span data-part="pill">{KIND_LABEL[entry.kind]}</span>
                <span data-part="author">{entry.author}</span>
                <time data-part="time" dateTime={entry.dateTime}>
                  {entry.time}
                </time>
              </div>
              <p data-part="note">{entry.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
