import type { ComponentProps, CSSProperties } from "react"

export type Activity002Event = {
  name: string
  /** Инициалы для кружка-аватара; по умолчанию берутся из name. */
  initials?: string
  /** Действие: "запушила в main", "открыл pull request" и т. п. */
  action: string
  /** Относительное время справа: "2 мин", "1 ч". */
  meta: string
  /** Нижняя строка: файл, номер PR или число коммитов. */
  detail?: string
}

export type Activity002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: число событий за день. */
  badge?: string
  events?: Activity002Event[]
  accent?: string
  /** Нижние события растворяются к краю карточки. */
  fadeOut?: boolean
  /** Плотная лента: без нижней строки с деталью, теснее отступы. */
  dense?: boolean
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/)

  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
}

// Идея: лента активности из карточек с аватарами-инициалами — кто, что
// сделал и когда, с деталью снизу (файл, номер PR, число коммитов). Цвет
// аватара идёт по кругу из шести оттенков по номеру строки. Анимация
// категории — появление по прокрутке: строка целиком въезжает снизу через
// scroll-driven view-timeline карточки (свой namespace
// --vibeui-activity-002, не пересекается с activity-001 на одной странице),
// а аватар одновременно чуть увеличивается из уменьшенного состояния.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="activity-002"]){
--vibeui-activity-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-activity-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-activity-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-activity-002-muted:color-mix(in oklab,var(--vibeui-activity-002-fg) 60%,transparent);
--vibeui-activity-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-activity-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-activity-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="activity-002"]{color-scheme:dark}
[data-vibeui-block="activity-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-activity-002-fg);font-family:var(--vibeui-activity-002-font);
}
[data-vibeui-block="activity-002"] *{box-sizing:border-box}
[data-vibeui-block="activity-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-activity-002-border);
background:var(--vibeui-activity-002-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
view-timeline:--vibeui-activity-002 block;
}
[data-vibeui-block="activity-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-activity-002-border);
background:var(--vibeui-activity-002-frame);
}
[data-vibeui-block="activity-002"] [data-part="gtitle"]{
margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="activity-002"] [data-part="badge"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-activity-002-accent);
background:color-mix(in oklab,var(--vibeui-activity-002-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-activity-002-accent) 22%,transparent);
}
[data-vibeui-block="activity-002"] [data-part="events"]{
display:flex;flex-direction:column;margin:0;padding:0.75rem;list-style:none;
}
[data-vibeui-block="activity-002"][data-fade="true"] [data-part="events"]{
-webkit-mask-image:linear-gradient(to bottom,#000 45%,transparent 100%);
mask-image:linear-gradient(to bottom,#000 45%,transparent 100%);
}
/* Строка целиком въезжает по мере прокрутки карточки в вид: анимацией
   управляет view-timeline карточки, а не время. Стаггер — сдвигом диапазона
   по номеру строки. Где scroll-driven не поддержан, длительности нет и
   строка сразу в конечном состоянии (видима). */
[data-vibeui-block="activity-002"] [data-part="row"]{
display:flex;align-items:flex-start;gap:0.625rem;padding-bottom:0.75rem;
animation:vibeui-activity-002-rise linear both;
animation-timeline:--vibeui-activity-002;
animation-range:entry 0% entry 42%;
}
[data-vibeui-block="activity-002"] [data-part="row"]:last-child{padding-bottom:0}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(2){animation-range:entry 8% entry 50%}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(3){animation-range:entry 16% entry 58%}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(4){animation-range:entry 24% entry 66%}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(5){animation-range:entry 32% entry 74%}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(6){animation-range:entry 40% entry 82%}
/* Аватар одновременно с рядом слегка увеличивается из уменьшенного
   состояния — те же диапазоны продублированы по номеру строки. */
[data-vibeui-block="activity-002"] [data-part="avatar"]{
position:relative;display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;flex:none;border-radius:9999px;
font-size:0.625rem;font-weight:650;color:#fff;
border:2px solid var(--vibeui-activity-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.12);
animation:vibeui-activity-002-pop linear both;
animation-timeline:--vibeui-activity-002;
animation-range:entry 0% entry 42%;
}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(6n+1) [data-part="avatar"]{background:#ef4444}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(6n+2) [data-part="avatar"]{background:#f97316}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(6n+3) [data-part="avatar"]{background:#eab308;color:#1c1917}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(6n+4) [data-part="avatar"]{background:#22c55e}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(6n+5) [data-part="avatar"]{background:#3b82f6}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(6n+6) [data-part="avatar"]{background:#8b5cf6}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(2) [data-part="avatar"]{animation-range:entry 8% entry 50%}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(3) [data-part="avatar"]{animation-range:entry 16% entry 58%}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(4) [data-part="avatar"]{animation-range:entry 24% entry 66%}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(5) [data-part="avatar"]{animation-range:entry 32% entry 74%}
[data-vibeui-block="activity-002"] [data-part="row"]:nth-child(6) [data-part="avatar"]{animation-range:entry 40% entry 82%}
[data-vibeui-block="activity-002"] [data-part="body"]{flex:1;min-width:0;padding-top:0.1875rem}
[data-vibeui-block="activity-002"] [data-part="top"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="activity-002"] [data-part="text"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:500;line-height:1.35;
}
[data-vibeui-block="activity-002"] [data-part="text"] strong{font-weight:700}
[data-vibeui-block="activity-002"] [data-part="meta"]{
flex:none;font-size:0.625rem;font-weight:550;font-variant-numeric:tabular-nums;
color:var(--vibeui-activity-002-muted);white-space:nowrap;
}
[data-vibeui-block="activity-002"] [data-part="detail"]{
display:flex;align-items:center;gap:0.25rem;margin-top:0.1875rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.625rem;line-height:1.4;color:var(--vibeui-activity-002-muted);
}
[data-vibeui-block="activity-002"] [data-part="detail"] svg{width:0.625rem;height:0.625rem;flex:none}
[data-vibeui-block="activity-002"][data-dense="true"] [data-part="row"]{padding-bottom:0.5rem}
[data-vibeui-block="activity-002"][data-dense="true"] [data-part="avatar"]{width:1.625rem;height:1.625rem;font-size:0.5625rem;border-width:1.5px}
[data-vibeui-block="activity-002"][data-dense="true"] [data-part="detail"]{display:none}
@keyframes vibeui-activity-002-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes vibeui-activity-002-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="activity-002"] [data-part="row"]{animation:none}
[data-vibeui-block="activity-002"] [data-part="avatar"]{animation:none}
}
`

const BRANCH = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="6" x2="6" y1="3" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
)

const DEFAULT_EVENTS: Activity002Event[] = [
  {
    name: "Sarah Chen",
    action: "запушила в main",
    meta: "2 мин",
    detail: "3 коммита · src/api/auth.ts",
  },
  {
    name: "Alex Park",
    action: "открыл pull request",
    meta: "18 мин",
    detail: "#482 Исправление восстановления сессии",
  },
  {
    name: "Maria Lopez",
    action: "оставила комментарий к обзору",
    meta: "1 ч",
    detail: "components/Sidebar.tsx",
  },
  {
    name: "Jonas Weber",
    action: "смержил pull request",
    meta: "3 ч",
    detail: "#479 Обновление зависимостей",
  },
  {
    name: "Sarah Chen",
    action: "создала тег релиза",
    meta: "5 ч",
    detail: "v2.4.0",
  },
]

/**
 * Лента активности с аватарами-инициалами. Один файл, ноль зависимостей,
 * собственная палитра. Строки и аватары появляются по мере прокрутки.
 */
export function Activity002({
  title = "Активность сегодня",
  badge = "5",
  events = DEFAULT_EVENTS,
  accent,
  fadeOut = false,
  dense = false,
  className,
  style,
  ...props
}: Activity002Props) {
  const palette = {
    ...(accent ? { "--vibeui-activity-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-activity-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="activity-002"
        data-slot="activity-feed"
        data-fade={fadeOut ? "true" : undefined}
        data-dense={dense ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="gtitle">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <ol data-part="events">
            {events.map((event, index) => (
              <li data-part="row" key={event.name + index}>
                <span
                  data-part="avatar"
                  role="img"
                  aria-label={event.name}
                >
                  {event.initials ?? initialsOf(event.name)}
                </span>
                <div data-part="body">
                  <div data-part="top">
                    <span data-part="text">
                      <strong>{event.name}</strong> {event.action}
                    </span>
                    <span data-part="meta">{event.meta}</span>
                  </div>
                  {event.detail ? (
                    <span data-part="detail">
                      {BRANCH}
                      {event.detail}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
