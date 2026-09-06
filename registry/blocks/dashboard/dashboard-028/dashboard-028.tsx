import type { CSSProperties } from "react"

export type Dashboard028Ticket = {
  id: string
  subject: string
  from: string
  channel: string
  waiting: string
  due: string
  overdue?: boolean
  priority?: "low" | "normal" | "high"
  assignee?: string
  replies?: number
}

export type Dashboard028Props = {
  title?: string
  queues?: string[]
  activeQueue?: string
  tickets?: Dashboard028Ticket[]
  slaLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Среднее время ответа в шапке. */
  averageReply?: string
  /** Подписи счётчиков: queue, overdue, free, average. */
  countersText?: Record<string, string>
  /** Слова приоритета: low, normal, high. */
  priorityText?: Record<string, string>
  /** Шаблон числа ответов: {count}. */
  repliesText?: string
  /** Слово перед именем исполнителя. */
  assigneeText?: string
  /** Подпись кнопки «взять себе». */
  takeText?: string
  /** Шаблон подписи кнопки для скринридера: {id}. */
  takeAriaText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: очередь обращений, отсортированная не по дате, а по сроку
// ответа. Просроченное обращение помечено полосой, словом «просрочено» и
// сдвинутым сроком — три признака вместо одного красного пятна. Строка без
// исполнителя показывает кнопку «взять себе»: свободное обращение должно
// разбираться в один клик, иначе его перечитывают по кругу. Шапка считает
// счётчики сама из массива, чтобы цифры не разъезжались с содержимым.
const STYLES = `
:where([data-vibeui-block="dashboard-028"]){
--vibeui-dashboard-028-bg:transparent;
--vibeui-dashboard-028-panel:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-dashboard-028-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-028-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-028-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-dashboard-028-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
/* Текст на заливке акцента: в тёмной теме акцент светлее, и белым по нему не прочесть. */
--vibeui-dashboard-028-onaccent:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-dashboard-028-late:light-dark(oklch(0.55 0.18 25),oklch(0.73 0.16 25));
--vibeui-dashboard-028-soon:light-dark(oklch(0.64 0.15 65),oklch(0.79 0.13 65));
--vibeui-dashboard-028-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-028"]{color-scheme:dark}
[data-vibeui-block="dashboard-028"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-028-bg);
color:var(--vibeui-dashboard-028-fg);
font-family:var(--vibeui-dashboard-028-sans);
border:1px solid var(--vibeui-dashboard-028-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-028"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-028"] [data-part="head"]{padding:1.125rem 1.125rem 0.75rem}
[data-vibeui-block="dashboard-028"] [data-part="titlerow"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem 0.75rem;
}
[data-vibeui-block="dashboard-028"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-028"] [data-part="sla"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-028-muted)}
[data-vibeui-block="dashboard-028"] [data-part="counters"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin:0.75rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-028"] [data-part="counter"]{
flex:1 1 7rem;
background:var(--vibeui-dashboard-028-panel);
border:1px solid var(--vibeui-dashboard-028-border);border-radius:0.75rem;
padding:0.5rem 0.625rem;
}
[data-vibeui-block="dashboard-028"] [data-part="cvalue"]{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.2;
}
[data-vibeui-block="dashboard-028"] [data-part="clabel"]{
display:block;font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-028-muted);
}
[data-vibeui-block="dashboard-028"] [data-part="counter"][data-tone="late"] [data-part="cvalue"]{color:var(--vibeui-dashboard-028-late)}
[data-vibeui-block="dashboard-028"] [data-part="queues"]{
display:flex;gap:0.25rem;margin:0.875rem 0 0;padding:0;list-style:none;overflow-x:auto;
}
[data-vibeui-block="dashboard-028"] [data-part="queues"] a{
display:block;padding:0.3125rem 0.625rem;border-radius:9999px;white-space:nowrap;
font-size:0.75rem;font-weight:600;text-decoration:none;
color:var(--vibeui-dashboard-028-muted);
border:1px solid var(--vibeui-dashboard-028-border);
}
[data-vibeui-block="dashboard-028"] [data-part="queues"] a[aria-current="true"]{
color:var(--vibeui-dashboard-028-onaccent);
background:var(--vibeui-dashboard-028-accent);
border-color:var(--vibeui-dashboard-028-accent);
}
[data-vibeui-block="dashboard-028"] ul[data-part="list"]{
margin:0;padding:0;list-style:none;
border-top:1px solid var(--vibeui-dashboard-028-border);
}
[data-vibeui-block="dashboard-028"] [data-part="ticket"]{
display:grid;grid-template-columns:1fr;gap:0.25rem;
padding:0.75rem 1.125rem;border-bottom:1px solid var(--vibeui-dashboard-028-border);
border-left:3px solid transparent;
}
[data-vibeui-block="dashboard-028"] [data-late="true"]{border-left-color:var(--vibeui-dashboard-028-late)}
[data-vibeui-block="dashboard-028"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.5rem;
}
[data-vibeui-block="dashboard-028"] [data-part="id"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-dashboard-028-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-028"] [data-part="subject"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.35}
[data-vibeui-block="dashboard-028"] [data-part="prio"]{
font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
padding:0.0625rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-dashboard-028-muted);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-028-border);
}
[data-vibeui-block="dashboard-028"] [data-priority="high"] [data-part="prio"]{
color:var(--vibeui-dashboard-028-late);box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-028-late);
}
[data-vibeui-block="dashboard-028"] [data-part="meta"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-028-muted);
}
[data-vibeui-block="dashboard-028"] [data-part="due"]{
margin-left:auto;font-size:0.6875rem;font-weight:650;white-space:nowrap;
color:var(--vibeui-dashboard-028-soon);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-028"] [data-late="true"] [data-part="due"]{color:var(--vibeui-dashboard-028-late)}
[data-vibeui-block="dashboard-028"] [data-part="take"]{
justify-self:start;
appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:650;
padding:0.25rem 0.5625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-028-accent);
background:var(--vibeui-dashboard-028-bg);color:var(--vibeui-dashboard-028-accent);
}
[data-vibeui-block="dashboard-028"] [data-part="who"]{font-weight:650;color:var(--vibeui-dashboard-028-fg)}
[data-vibeui-block="dashboard-028"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-028-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-028"] [data-part="ticket"]{padding-inline:1.375rem}
[data-vibeui-block="dashboard-028"] [data-part="head"]{padding-inline:1.375rem}
[data-vibeui-block="dashboard-028"] [data-part="counter"]{flex:1 1 0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-028"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TICKETS: Dashboard028Ticket[] = [
  {
    id: "#4821",
    subject: "После установки блок берёт цвета темы проекта",
    from: "Мария Гринь · maria@shop.ru",
    channel: "почта",
    waiting: "ждёт 3 ч 40 мин",
    due: "просрочено на 40 мин",
    overdue: true,
    priority: "high",
    replies: 2,
  },
  {
    id: "#4820",
    subject: "Не приходит счёт за март на рабочую почту",
    from: "Олег Дан · oleg@studio.io",
    channel: "чат",
    waiting: "ждёт 1 ч 10 мин",
    due: "ответить за 50 мин",
    priority: "normal",
    assignee: "Ким Сон",
    replies: 1,
  },
  {
    id: "#4818",
    subject: "Как обновить блок, если файл уже правили руками",
    from: "Ирина Ким · irina@vibe.dev",
    channel: "почта",
    waiting: "ждёт 25 мин",
    due: "ответить за 3 ч 35 мин",
    priority: "normal",
  },
  {
    id: "#4815",
    subject: "Предложение: добавить категорию для админок",
    from: "Артём Лосев · artem@mail.ru",
    channel: "форма на сайте",
    waiting: "ждёт 6 ч",
    due: "ответить за 1 день",
    priority: "low",
    assignee: "Илья Мохов",
  },
]

const PRIORITY_WORD: Record<string, string> = {
  low: "низкий",
  normal: "обычный",
  high: "срочно",
}

const DEFAULT_COUNTERS: Record<string, string> = {
  queue: "в очереди",
  overdue: "просрочено",
  free: "без исполнителя",
  average: "средний ответ",
}

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
 * Очередь обращений: сортировка по сроку ответа, просрочка тремя признаками,
 * свободное обращение берётся кнопкой. Один файл, ноль зависимостей.
 */
export function Dashboard028({
  title = "Очередь поддержки",
  queues = ["Все", "Мои", "Свободные", "Просроченные"],
  activeQueue = "Все",
  tickets = DEFAULT_TICKETS,
  slaLabel = "Норматив первого ответа — 4 часа в рабочее время",
  accent,
  background = "",
  averageReply = "1 ч 52 м",
  countersText = DEFAULT_COUNTERS,
  priorityText = PRIORITY_WORD,
  repliesText = "ответов {count}",
  assigneeText = "ведёт",
  takeText = "Взять себе",
  takeAriaText = "Взять обращение {id}",
  className,
  style,
}: Dashboard028Props) {
  const counter = (key: string) => countersText[key] ?? DEFAULT_COUNTERS[key]
  const palette = {
    ...(accent ? { "--vibeui-dashboard-028-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-028-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const late = tickets.filter((ticket) => ticket.overdue).length
  const free = tickets.filter((ticket) => !ticket.assignee).length

  return (
    <>
      <style href="vibeui-dashboard-028" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-028"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div data-part="titlerow">
            <h2>{title}</h2>
            <p data-part="sla">{slaLabel}</p>
          </div>

          <ul data-part="counters">
            <li data-part="counter">
              <span data-part="cvalue">{tickets.length}</span>
              <span data-part="clabel">{counter("queue")}</span>
            </li>
            <li data-part="counter" data-tone="late">
              <span data-part="cvalue">{late}</span>
              <span data-part="clabel">{counter("overdue")}</span>
            </li>
            <li data-part="counter">
              <span data-part="cvalue">{free}</span>
              <span data-part="clabel">{counter("free")}</span>
            </li>
            <li data-part="counter">
              <span data-part="cvalue">{averageReply}</span>
              <span data-part="clabel">{counter("average")}</span>
            </li>
          </ul>

          <ul data-part="queues">
            {queues.map((queue) => (
              <li key={queue}>
                <a
                  href="#dashboard-028"
                  aria-current={queue === activeQueue ? "true" : undefined}
                >
                  {queue}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <ul data-part="list">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              data-part="ticket"
              data-priority={ticket.priority ?? "normal"}
              data-late={ticket.overdue ? "true" : "false"}
            >
              <div data-part="row">
                <span data-part="id">{ticket.id}</span>
                <p data-part="subject">{ticket.subject}</p>
                <span data-part="prio">
                  {priorityText[ticket.priority ?? "normal"] ??
                    PRIORITY_WORD[ticket.priority ?? "normal"]}
                </span>
                <span data-part="due">{ticket.due}</span>
              </div>
              <p data-part="meta">
                {ticket.from} · {ticket.channel} · {ticket.waiting}
                {ticket.replies
                  ? ` · ${repliesText.replace("{count}", String(ticket.replies))}`
                  : ""}
                {ticket.assignee ? (
                  <>
                    {` · ${assigneeText} `}
                    <span data-part="who">{ticket.assignee}</span>
                  </>
                ) : null}
              </p>
              {ticket.assignee ? null : (
                <button
                  type="button"
                  data-part="take"
                  aria-label={takeAriaText.replace("{id}", ticket.id)}
                >
                  {takeText}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
