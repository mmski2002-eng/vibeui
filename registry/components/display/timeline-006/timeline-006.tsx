import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline006Kind = "comment" | "upload" | "alert" | "release"

export type Timeline006Event = {
  kind: Timeline006Kind
  title: string
  text?: string
  time: string
}

export type Timeline006Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  events?: Timeline006Event[]
  title?: string
}

// Идея компонента: лента, где тип события узнаётся по значку, а не по чтению.
// Значок — встроенный SVG (иконочная библиотека сюда не тащится) в плитке,
// которая красится оттенком своего типа. Тип продублирован текстовой
// подписью для скринридера: цвет и форма не читаются вслух.
const STYLES = `
:where([data-vibeui-block="timeline-006"]){
--vibeui-timeline-006-bg:oklch(1 0 0);
--vibeui-timeline-006-fg:oklch(0.22 0.014 265);
--vibeui-timeline-006-muted:oklch(0.57 0.014 265);
--vibeui-timeline-006-border:oklch(0.91 0.006 265);
--vibeui-timeline-006-hue:262;
--vibeui-timeline-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-006"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-006-bg);
border:1px solid var(--vibeui-timeline-006-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-006-font);color:var(--vibeui-timeline-006-fg);
}
[data-vibeui-block="timeline-006"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-006"] ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-006"] li{
position:relative;display:grid;grid-template-columns:1.75rem 1fr auto;
gap:0.625rem;padding:0 0 1rem;
}
[data-vibeui-block="timeline-006"] li::before{
content:"";position:absolute;left:0.84375rem;top:2rem;bottom:0;
width:1px;background:var(--vibeui-timeline-006-border);
}
[data-vibeui-block="timeline-006"] li:last-child{padding-bottom:0}
[data-vibeui-block="timeline-006"] li:last-child::before{display:none}
/* Плитка красится оттенком типа: одна переменная вместо четырёх наборов правил. */
[data-vibeui-block="timeline-006"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;box-sizing:border-box;border-radius:0.5rem;
background:oklch(0.95 0.04 var(--vibeui-timeline-006-hue));
color:oklch(0.5 0.14 var(--vibeui-timeline-006-hue));
border:1px solid oklch(0.88 0.05 var(--vibeui-timeline-006-hue));
}
[data-vibeui-block="timeline-006"] [data-part="icon"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="timeline-006"] li[data-kind="comment"]{--vibeui-timeline-006-hue:262}
[data-vibeui-block="timeline-006"] li[data-kind="upload"]{--vibeui-timeline-006-hue:200}
[data-vibeui-block="timeline-006"] li[data-kind="alert"]{--vibeui-timeline-006-hue:35}
[data-vibeui-block="timeline-006"] li[data-kind="release"]{--vibeui-timeline-006-hue:150}
[data-vibeui-block="timeline-006"] [data-part="body"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="timeline-006"] [data-part="name"]{font-size:0.875rem;font-weight:600;line-height:1.35}
[data-vibeui-block="timeline-006"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-timeline-006-muted)}
[data-vibeui-block="timeline-006"] [data-part="time"]{
font-size:0.6875rem;color:var(--vibeui-timeline-006-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;padding-top:0.1875rem;
}
/* Подпись типа только для скринридера: цвет плитки вслух не прочитается. */
[data-vibeui-block="timeline-006"] [data-part="kind"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-006"] *{animation:none!important;transition:none!important}}
`

const KIND_LABEL: Record<Timeline006Kind, string> = {
  comment: "Комментарий",
  upload: "Загрузка",
  alert: "Предупреждение",
  release: "Релиз",
}

const KIND_PATH: Record<Timeline006Kind, string> = {
  comment: "M2 3h12v8H7l-3.5 3v-3H2z",
  upload: "M8 2v9M4.5 5.5 8 2l3.5 3.5M2.5 14h11",
  alert: "M8 2 15 14H1zM8 6.5v3.5M8 12h.01",
  release: "M8 1.5 14 5v6l-6 3.5L2 11V5z",
}

const DEFAULT_EVENTS: Timeline006Event[] = [
  {
    kind: "release",
    title: "Выпущена версия 2.4",
    text: "Каталог, поиск и экспорт в один файл",
    time: "10:40",
  },
  {
    kind: "alert",
    title: "Ответ сервера замедлился",
    text: "Средний отклик вырос до 780 мс",
    time: "09:12",
  },
  {
    kind: "upload",
    title: "Загружено 12 макетов",
    time: "вчера",
  },
  {
    kind: "comment",
    title: "Аня оставила комментарий",
    text: "«Кнопку на втором экране надо назвать иначе»",
    time: "вчера",
  },
]

/**
 * Лента событий со значками типов: цвет плитки плюс подпись для скринридера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline006({
  events = DEFAULT_EVENTS,
  title = "События",
  className,
  style,
  ...props
}: Timeline006Props) {
  return (
    <>
      <style href="vibeui-timeline-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-006"
        className={className}
        style={style as CSSProperties}
      >
        <h3 data-part="title">{title}</h3>
        <ol>
          {events.map((event, index) => (
            <li key={`${event.title}-${index}`} data-kind={event.kind}>
              <span data-part="icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <path
                    d={KIND_PATH[event.kind]}
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div data-part="body">
                <span data-part="name">
                  <span data-part="kind">{KIND_LABEL[event.kind]}: </span>
                  {event.title}
                </span>
                {event.text ? <p data-part="text">{event.text}</p> : null}
              </div>
              <span data-part="time">{event.time}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
