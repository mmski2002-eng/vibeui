import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline002Entry = {
  /** Имя автора: из него берутся инициалы и оттенок кружка. */
  author: string
  action: string
  target?: string
  time: string
}

export type Timeline002Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  entries?: Timeline002Entry[]
  title?: string
  accent?: string
}

// Идея компонента: лента активности, где отправитель узнаётся раньше текста.
// Кружок с инициалами стоит на линии и красится оттенком, посчитанным из
// имени, поэтому одного человека видно в ленте как повторяющееся пятно цвета.
// Время вынесено в отдельный столбец с табличными цифрами: в ленте из
// двадцати строк «2 мин» и «12 мин» обязаны стоять по одной вертикали.
const STYLES = `
:where([data-vibeui-block="timeline-002"]){
--vibeui-timeline-002-bg:oklch(1 0 0);
--vibeui-timeline-002-fg:oklch(0.22 0.014 265);
--vibeui-timeline-002-muted:oklch(0.56 0.014 265);
--vibeui-timeline-002-border:oklch(0.91 0.006 265);
--vibeui-timeline-002-line:oklch(0.93 0.005 265);
--vibeui-timeline-002-accent:oklch(0.55 0.17 265);
--vibeui-timeline-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная светлая подложка: текст тёмный и обязан читаться на любой странице. */
[data-vibeui-block="timeline-002"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-timeline-002-bg);
border:1px solid var(--vibeui-timeline-002-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-002-font);color:var(--vibeui-timeline-002-fg);
}
[data-vibeui-block="timeline-002"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-002"] [data-part="feed"]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-002"] [data-part="row"]{
position:relative;display:grid;grid-template-columns:1.75rem 1fr auto;
align-items:start;gap:0.625rem;padding-bottom:0.875rem;
}
/* Линия — псевдоэлемент строки, а не отдельный столбик: она обрывается
   ровно на последнем аватаре и не свисает под лентой. */
[data-vibeui-block="timeline-002"] [data-part="row"]::before{
content:"";position:absolute;left:0.8125rem;top:2rem;bottom:0;
width:1px;background:var(--vibeui-timeline-002-line);
}
[data-vibeui-block="timeline-002"] [data-part="row"]:last-child{padding-bottom:0}
[data-vibeui-block="timeline-002"] [data-part="row"]:last-child::before{display:none}
[data-vibeui-block="timeline-002"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:oklch(0.92 0.05 var(--vibeui-timeline-002-hue,250));
color:oklch(0.35 0.09 var(--vibeui-timeline-002-hue,250));
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="timeline-002"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-timeline-002-muted)}
[data-vibeui-block="timeline-002"] [data-part="author"]{color:var(--vibeui-timeline-002-fg);font-weight:600}
/* Цель правки помечена цветом акцента: в потоке одинаковых фраз глаз
   цепляется за объект, а не за глагол. */
[data-vibeui-block="timeline-002"] [data-part="target"]{color:var(--vibeui-timeline-002-accent);font-weight:600}
[data-vibeui-block="timeline-002"] [data-part="time"]{
font-size:0.6875rem;color:var(--vibeui-timeline-002-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;padding-top:0.125rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Timeline002Entry[] = [
  {
    author: "Аня Петрова",
    action: "оставила комментарий в",
    target: "Главная страница",
    time: "2 мин",
  },
  {
    author: "Марк Иванов",
    action: "закрыл задачу",
    target: "Экспорт в CSV",
    time: "18 мин",
  },
  { author: "Аня Петрова", action: "загрузила 6 файлов", time: "1 ч" },
  {
    author: "Лиза Ким",
    action: "пригласила в проект",
    target: "Олег С.",
    time: "3 ч",
  },
]

/** Оттенок из имени: один человек всегда получает один и тот же кружок. */
function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Лента активности: аватар с инициалами, действие и время в отдельном столбце.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline002({
  entries = DEFAULT_ENTRIES,
  title = "Активность",
  accent,
  className,
  style,
  ...props
}: Timeline002Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-002"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ol data-part="feed">
          {entries.map((entry, index) => (
            <li data-part="row" key={`${entry.author}-${index}`}>
              <span
                data-part="avatar"
                aria-hidden="true"
                style={
                  {
                    "--vibeui-timeline-002-hue": hue(entry.author),
                  } as CSSProperties
                }
              >
                {initials(entry.author)}
              </span>
              <p data-part="text">
                <span data-part="author">{entry.author}</span> {entry.action}
                {entry.target ? (
                  <>
                    {" "}
                    <span data-part="target">{entry.target}</span>
                  </>
                ) : null}
              </p>
              <span data-part="time">{entry.time}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
