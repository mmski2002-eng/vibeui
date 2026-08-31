import type { CSSProperties } from "react"

export type Dashboard014Event = {
  time: string
  actor: string
  action: string
  target?: string
  tone?: "info" | "ok" | "warn"
}

export type Dashboard014Group = {
  day: string
  events: Dashboard014Event[]
}

export type Dashboard014Props = {
  title?: string
  hint?: string
  groups?: Dashboard014Group[]
  more?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: лента событий, сгруппированная по дням. Без группировки лента
// превращается в поток, где «10:42» ничего не значит — непонятно, сегодня это
// или три недели назад. Заголовок дня липкий, поэтому при прокрутке видно, к
// какой дате относится строка. Линия ленты — левый бордюр события, у
// последнего он прозрачный: отдельный столбик всегда торчит за последней
// точкой. Действующее лицо выделено начертанием, а не цветом, — цвет здесь
// занят тоном события.
const STYLES = `
:where([data-vibeui-block="dashboard-014"]){
--vibeui-dashboard-014-bg:oklch(1 0 0);
--vibeui-dashboard-014-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-014-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-014-border:oklch(0.91 0.006 265);
--vibeui-dashboard-014-line:oklch(0.93 0.005 265);
--vibeui-dashboard-014-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-014-ok:oklch(0.58 0.14 152);
--vibeui-dashboard-014-warn:oklch(0.7 0.15 75);
--vibeui-dashboard-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-014"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-014-bg);
border:1px solid var(--vibeui-dashboard-014-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-014-sans);color:var(--vibeui-dashboard-014-fg);
}
[data-vibeui-block="dashboard-014"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-014"] [data-part="head"]{padding:0.875rem 1rem 0.5rem}
[data-vibeui-block="dashboard-014"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-014"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-014-muted)}
[data-vibeui-block="dashboard-014"] [data-part="feed"]{max-height:22rem;overflow-y:auto;overscroll-behavior:contain}
/* Липкий заголовок дня: при прокрутке видно, к какой дате относится строка. */
[data-vibeui-block="dashboard-014"] [data-part="day"]{
position:sticky;top:0;z-index:1;
margin:0;padding:0.375rem 1rem;
background:var(--vibeui-dashboard-014-bg);
border-bottom:1px solid var(--vibeui-dashboard-014-border);
font-size:0.6875rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-014-muted);
}
[data-vibeui-block="dashboard-014"] ul{list-style:none;margin:0;padding:0.5rem 1rem 0.25rem}
/* Линия — бордюр события: отдельный столбик торчит за последней точкой. */
[data-vibeui-block="dashboard-014"] li{
position:relative;padding:0 0 0.75rem 1.125rem;
border-left:2px solid var(--vibeui-dashboard-014-line);
}
[data-vibeui-block="dashboard-014"] li:last-child{border-left-color:transparent;padding-bottom:0.5rem}
[data-vibeui-block="dashboard-014"] [data-part="dot"]{
position:absolute;left:-0.3125rem;top:0.3125rem;
width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-dashboard-014-accent);
}
[data-vibeui-block="dashboard-014"] [data-tone="ok"] [data-part="dot"]{background:var(--vibeui-dashboard-014-ok)}
[data-vibeui-block="dashboard-014"] [data-tone="warn"] [data-part="dot"]{
background:none;border-radius:0.125rem;
box-shadow:inset 0 0 0 2px var(--vibeui-dashboard-014-warn);
}
[data-vibeui-block="dashboard-014"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45}
/* Действующее лицо начертанием, а не цветом: цвет занят тоном события. */
[data-vibeui-block="dashboard-014"] [data-part="actor"]{font-weight:650}
[data-vibeui-block="dashboard-014"] [data-part="target"]{font-weight:650}
[data-vibeui-block="dashboard-014"] [data-part="time"]{
margin:0.0625rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-014-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-014"] [data-part="more"]{
display:block;width:100%;padding:0.625rem;
appearance:none;border:0;border-top:1px solid var(--vibeui-dashboard-014-border);
background:none;cursor:pointer;
color:var(--vibeui-dashboard-014-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-014"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-dashboard-014-accent);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Dashboard014Group[] = [
  {
    day: "Сегодня",
    events: [
      {
        time: "10:42",
        actor: "Анна Реброва",
        action: "поставила блок",
        target: "commerce-003",
        tone: "ok",
      },
      {
        time: "10:18",
        actor: "Илья Мохов",
        action: "изменил роль",
        target: "Ким Сон → редактор",
      },
      {
        time: "09:51",
        actor: "Система",
        action: "отклонила установку: истёк ключ доступа",
        tone: "warn",
      },
    ],
  },
  {
    day: "13 марта",
    events: [
      {
        time: "18:04",
        actor: "Пётр Гай",
        action: "создал проект",
        target: "Витрина мебели",
        tone: "ok",
      },
      {
        time: "17:30",
        actor: "Анна Реброва",
        action: "пригласила",
        target: "kim@vibeui.ru",
      },
    ],
  },
]

/**
 * Лента событий по дням: липкий заголовок дня и тон события формой точки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard014({
  title = "Активность",
  hint = "События проекта за последние дни",
  groups = DEFAULT_GROUPS,
  more = "Показать всю историю",
  accent,
  className,
  style,
}: Dashboard014Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-014"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="hint">{hint}</p>
        </header>

        <div
          data-part="feed"
          tabIndex={0}
          role="group"
          aria-label="Лента событий"
        >
          {groups.map((group) => (
            <section key={group.day} aria-label={group.day}>
              <p data-part="day">{group.day}</p>
              <ul>
                {group.events.map((event) => (
                  <li
                    key={`${group.day}-${event.time}`}
                    data-tone={event.tone ?? "info"}
                  >
                    <span data-part="dot" aria-hidden="true" />
                    <p data-part="text">
                      <span data-part="actor">{event.actor}</span>{" "}
                      {event.action}
                      {event.target ? (
                        <>
                          {" "}
                          <span data-part="target">{event.target}</span>
                        </>
                      ) : null}
                    </p>
                    <p data-part="time">{event.time}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <button type="button" data-part="more">
          {more}
        </button>
      </section>
    </>
  )
}
