import type { CSSProperties } from "react"

export type Dashboard082Note = {
  title: string
  body: string
  author: string
  when: string
  tags: string[]
  pinned?: boolean
  todo?: { text: string; done: boolean }[]
}

export type Dashboard082Props = {
  title?: string
  subtitle?: string
  notes?: Dashboard082Note[]
  newLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Заголовок ряда закреплённых заметок. */
  pinnedTitle?: string
  /** Заголовок общего потока заметок. */
  restTitle?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: заметки команды разной длины, и равные по высоте карточки либо
// обрезают текст, либо оставляют пустоту. Поэтому раскладка сделана колонками
// (CSS columns): карточка занимает столько, сколько занимает, и поток
// сам укладывает их плотно. Закреплённые заметки вынесены наверх отдельным
// рядом, а не помечены значком внутри общего потока: в колоночной раскладке
// порядок чтения не строго сверху вниз, и «первая» заметка там не первая.
// Чек-лист внутри заметки показан как есть, с отметками: половина командных
// заметок — это список дел, и прятать его прогрессом бессмысленно.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-082"]){
--vibeui-dashboard-082-bg:transparent;
/* Карточка заметки и чип тега: подложка самого блока прозрачна. */
--vibeui-dashboard-082-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 85));
--vibeui-dashboard-082-inset:light-dark(oklch(0.985 0.004 85),oklch(0.22 0.012 85));
--vibeui-dashboard-082-fg:light-dark(oklch(0.21 0.014 85),oklch(0.94 0.005 85));
--vibeui-dashboard-082-muted:light-dark(oklch(0.54 0.014 85),oklch(0.72 0.012 85));
--vibeui-dashboard-082-border:light-dark(oklch(0.9 0.008 85),oklch(0.36 0.012 85));
--vibeui-dashboard-082-accent:light-dark(oklch(0.56 0.13 65),oklch(0.78 0.12 65));
--vibeui-dashboard-082-accent-line:light-dark(oklch(0.84 0.06 65),oklch(0.52 0.09 65));
--vibeui-dashboard-082-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 65));
--vibeui-dashboard-082-soft:light-dark(oklch(0.965 0.025 85),oklch(0.3 0.035 85));
--vibeui-dashboard-082-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-082"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-082-bg);
color:var(--vibeui-dashboard-082-fg);
font-family:var(--vibeui-dashboard-082-sans);
border:1px solid var(--vibeui-dashboard-082-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-082"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-082"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-082"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-082"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-082"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-082-muted)}
[data-vibeui-block="dashboard-082"] [data-part="new"]{
margin-left:auto;appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.4375rem 0.875rem;border-radius:0.5625rem;
background:var(--vibeui-dashboard-082-accent);color:var(--vibeui-dashboard-082-on-accent);
}
[data-vibeui-block="dashboard-082"] h3{margin:0 0 0.4375rem;font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-082-muted)}
[data-vibeui-block="dashboard-082"] [data-part="pinned"]{
list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0.5rem;
}
/* Колоночная раскладка: карточка занимает ровно свою высоту. */
[data-vibeui-block="dashboard-082"] [data-part="flow"]{
margin:0;padding:0;list-style:none;column-count:1;column-gap:0.5rem;
}
[data-vibeui-block="dashboard-082"] [data-part="flow"] > li{
break-inside:avoid;margin-bottom:0.5rem;display:block;
}
[data-vibeui-block="dashboard-082"] [data-part="note"]{
display:flex;flex-direction:column;gap:0.3125rem;padding:0.75rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-082-card);border:1px solid var(--vibeui-dashboard-082-border);
}
[data-vibeui-block="dashboard-082"] [data-part="note"][data-pinned="true"]{
background:var(--vibeui-dashboard-082-soft);
border-color:var(--vibeui-dashboard-082-accent-line);
}
[data-vibeui-block="dashboard-082"] [data-part="note"] h4{margin:0;font-size:0.875rem;font-weight:750;line-height:1.3}
[data-vibeui-block="dashboard-082"] [data-part="body"]{margin:0;font-size:0.8125rem;line-height:1.5;color:color-mix(in oklab,var(--vibeui-dashboard-082-fg) 88%,light-dark(white,black))}
[data-vibeui-block="dashboard-082"] [data-part="todo"]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="dashboard-082"] [data-part="todo"] li{
display:flex;align-items:flex-start;gap:0.4375rem;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="dashboard-082"] [data-part="todo"] li::before{
content:"";flex:0 0 auto;width:0.75rem;height:0.75rem;margin-top:0.1875rem;border-radius:0.25rem;
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-082-border);
}
[data-vibeui-block="dashboard-082"] [data-part="todo"] li[data-done="true"]{color:var(--vibeui-dashboard-082-muted);text-decoration:line-through}
[data-vibeui-block="dashboard-082"] [data-part="todo"] li[data-done="true"]::before{
background:var(--vibeui-dashboard-082-accent);box-shadow:none;
}
[data-vibeui-block="dashboard-082"] [data-part="tags"]{
margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:0.25rem;
}
[data-vibeui-block="dashboard-082"] [data-part="tags"] li{
font-size:0.625rem;font-weight:700;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-082-inset);border:1px solid var(--vibeui-dashboard-082-border);
color:var(--vibeui-dashboard-082-muted);
}
[data-vibeui-block="dashboard-082"] [data-part="by"]{
margin:0;font-size:0.625rem;color:var(--vibeui-dashboard-082-muted);
display:flex;flex-wrap:wrap;gap:0.25rem 0.5rem;
}
[data-vibeui-block="dashboard-082"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-082-accent);outline-offset:2px;
}
@container (min-width: 34rem){
[data-vibeui-block="dashboard-082"] [data-part="pinned"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="dashboard-082"] [data-part="flow"]{column-count:2}
}
@container (min-width: 58rem){
[data-vibeui-block="dashboard-082"] [data-part="flow"]{column-count:3}
}
`

const DEFAULT_NOTES: Dashboard082Note[] = [
  {
    title: "Договорённости по релизам",
    body: "Выкатываем по вторникам и четвергам до 16:00. В пятницу — только исправления с оценкой «ломает работу». Дежурный не выкатывает свои же изменения.",
    author: "Егор Савельев",
    when: "закреплено 2 июня",
    tags: ["процесс", "релизы"],
    pinned: true,
  },
  {
    title: "Кого звать по инцидентам",
    body: "База и очереди — Павел. Почта и шлюзы — Марина. Всё, что про деньги, — сразу руководителю, без разбирательств внутри дежурства.",
    author: "Ирина Кузнецова",
    when: "закреплено 12 мая",
    tags: ["дежурство"],
    pinned: true,
  },
  {
    title: "Разбор инцидента 6 июня",
    body: "Новый почтовый шлюз не держал повторные отправки: очередь выросла до 40 тысяч писем за 14 минут. Откатились, потерь писем нет.",
    author: "Павел Дорохов",
    when: "9 июня",
    tags: ["инцидент", "почта"],
    todo: [
      { text: "Добавить предел на размер очереди", done: true },
      { text: "Алерт на рост очереди быстрее 1000/мин", done: true },
      { text: "Нагрузочный прогон перед повторным выкатом", done: false },
    ],
  },
  {
    title: "Что спросить у «Северного леса»",
    body: "Уточнить, кто подписывает смету со стороны заказчика и есть ли ограничение по дате поставки: в договоре указан «июнь», без числа.",
    author: "Марина Тюрина",
    when: "вчера",
    tags: ["клиент", "склад"],
  },
  {
    title: "Идеи на следующий квартал",
    body: "Собираем сюда всё, что не влезло в спринт. Раз в две недели разбираем на планировании — из этого списка родились сохранённые представления.",
    author: "Егор Савельев",
    when: "обновлено сегодня",
    tags: ["планы"],
    todo: [
      { text: "Массовое назначение владельцев", done: true },
      { text: "Сверка с бухгалтерией по расписанию", done: false },
      { text: "Отчёт по филиалам с отклонением от среднего", done: false },
      { text: "Экспорт истории изменений записи", done: false },
    ],
  },
  {
    title: "Пароли и доступы",
    body: "В заметках паролям не место. Всё в общем хранилище, доступ выдаёт Ирина. Если нашли ключ в переписке — сообщите, отзовём.",
    author: "Ирина Кузнецова",
    when: "14 апреля",
    tags: ["безопасность"],
  },
]

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
 * Экран заметок команды: закреплённые вынесены наверх, остальные уложены
 * колонками, поэтому карточка занимает ровно свою высоту, а чек-листы
 * показаны с отметками. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard082({
  title = "Заметки команды",
  subtitle = "видят все участники пространства, правки не требуют согласования",
  notes = DEFAULT_NOTES,
  newLabel = "Новая заметка",
  accent,
  background = "",
  pinnedTitle = "Закреплено",
  restTitle = "Остальные заметки",
  className,
  style,
}: Dashboard082Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-082-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-082-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const pinned = notes.filter((note) => note.pinned)
  const rest = notes.filter((note) => !note.pinned)

  const card = (note: Dashboard082Note) => (
    <article data-part="note" data-pinned={note.pinned}>
      <h4>{note.title}</h4>
      <p data-part="body">{note.body}</p>
      {note.todo ? (
        <ul data-part="todo">
          {note.todo.map((item) => (
            <li key={item.text} data-done={item.done}>
              {item.text}
            </li>
          ))}
        </ul>
      ) : null}
      <ul data-part="tags">
        {note.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <p data-part="by">
        <span>{note.author}</span>
        <span>{note.when}</span>
      </p>
    </article>
  )

  return (
    <>
      <style href="vibeui-dashboard-082" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-082"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
            <button type="button" data-part="new">
              {newLabel}
            </button>
          </div>

          {pinned.length > 0 ? (
            <div>
              <h3>{pinnedTitle}</h3>
              <ul data-part="pinned">
                {pinned.map((note) => (
                  <li key={note.title}>{card(note)}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h3>{restTitle}</h3>
            <ul data-part="flow">
              {rest.map((note) => (
                <li key={note.title}>{card(note)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
