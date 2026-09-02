import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type ActivityTimelineEvent = {
  label: string
  /** Вторая строка под заголовком: короткое описание шага. */
  desc?: string
  /** Правая колонка: относительное время или статус словом. */
  meta: string
  state?: "done" | "current" | "todo"
}

export type ActivityTimelineProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: версия, квартал и т. п. */
  badge?: string
  events?: ActivityTimelineEvent[]
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Нижние события растворяются к краю карточки. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Лента активности: события в колонке с рельсом слева. Состояние читается
// точкой — галочка (пройдено), пульсирующее кольцо (текущее), пустой круг
// (впереди). Под карточкой дышит радужный градиент; это и есть анимация,
// гасится пропом gradient={false}. Тему компонент берёт из окружения через
// light-dark(): темнеет там, где тёмный контекст, своего фона не носит.
const STYLES = `
:where([data-vibeui-block="timeline-activity"]){
--vibeui-ta-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-ta-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-ta-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-ta-muted:light-dark(oklch(0.55 0 0),oklch(0.65 0 0));
--vibeui-ta-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-ta-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-ta-accent-fg:oklch(0.99 0 0);
--vibeui-ta-done-fg:light-dark(oklch(0.45 0 0),oklch(0.72 0 0));
--vibeui-ta-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-activity"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-ta-fg);font-family:var(--vibeui-ta-font);
}
[data-vibeui-block="timeline-activity"] *{box-sizing:border-box}
[data-vibeui-block="timeline-activity"] [data-part="stage"]{perspective:1400px}
/* Внешняя рамка с паддингом: радужное свечение живёт под карточкой. */
[data-vibeui-block="timeline-activity"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-ta-border);
background:color-mix(in oklab,var(--vibeui-ta-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
view-timeline:--vibeui-ta block;
}
[data-vibeui-block="timeline-activity"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-ta-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="timeline-activity"][data-flat="true"] [data-part="glow"]{display:none}
/* Карточка непрозрачна и лежит поверх свечения — наружу выходит только размытый ореол. */
[data-vibeui-block="timeline-activity"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-ta-border);
background:var(--vibeui-ta-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="timeline-activity"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-ta-border);
}
[data-vibeui-block="timeline-activity"] [data-part="gtitle"]{
font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="timeline-activity"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-ta-accent);
background:color-mix(in oklab,var(--vibeui-ta-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-ta-accent) 22%,transparent);
}
[data-vibeui-block="timeline-activity"] [data-part="events"]{
display:flex;flex-direction:column;padding:0.75rem;
}
[data-vibeui-block="timeline-activity"][data-fade="true"] [data-part="events"]{
-webkit-mask-image:linear-gradient(to bottom,#000 45%,transparent 100%);
mask-image:linear-gradient(to bottom,#000 45%,transparent 100%);
}
/* Строки въезжают по мере прокрутки карточки в вид: анимацией управляет
   view-timeline рамки, а не время. Стаггер задаётся сдвигом диапазона по
   номеру строки. Где scroll-driven не поддержан, длительности нет — строка
   сразу в конечном состоянии (видима), анимация просто не проигрывается. */
[data-vibeui-block="timeline-activity"] [data-part="row"]{
display:flex;align-items:stretch;gap:0.75rem;
animation:vibeui-ta-rise linear both;
animation-timeline:--vibeui-ta;
animation-range:entry 0% entry 42%;
}
[data-vibeui-block="timeline-activity"] [data-part="row"]:nth-child(2){animation-range:entry 8% entry 50%}
[data-vibeui-block="timeline-activity"] [data-part="row"]:nth-child(3){animation-range:entry 16% entry 58%}
[data-vibeui-block="timeline-activity"] [data-part="row"]:nth-child(4){animation-range:entry 24% entry 66%}
[data-vibeui-block="timeline-activity"] [data-part="row"]:nth-child(5){animation-range:entry 32% entry 74%}
[data-vibeui-block="timeline-activity"] [data-part="row"]:nth-child(6){animation-range:entry 40% entry 82%}
[data-vibeui-block="timeline-activity"] [data-part="rail"]{
display:flex;flex-direction:column;align-items:center;
}
[data-vibeui-block="timeline-activity"] [data-part="dot"]{
position:relative;display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;flex:none;border-radius:9999px;
border:1px solid var(--vibeui-ta-border);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-ta-frame) 45%,transparent);
}
[data-vibeui-block="timeline-activity"] [data-part="dot"] svg{width:0.75rem;height:0.75rem}
/* Пройдено: заливка и галочка. */
[data-vibeui-block="timeline-activity"] [data-state="done"] [data-part="dot"]{
background:var(--vibeui-ta-frame);color:var(--vibeui-ta-done-fg);
}
/* Текущее: акцентный кружок с точкой и пульсирующим кольцом. */
[data-vibeui-block="timeline-activity"] [data-state="current"] [data-part="dot"]{
background:var(--vibeui-ta-accent);border-color:var(--vibeui-ta-accent);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-ta-accent) 15%,transparent);
}
[data-vibeui-block="timeline-activity"] [data-part="pip"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-ta-accent-fg);
}
[data-vibeui-block="timeline-activity"] [data-part="ping"]{
position:absolute;inset:0;border-radius:9999px;background:var(--vibeui-ta-accent);
animation:vibeui-ta-ping 2s ease-out infinite;
}
/* Впереди: пустой круг. */
[data-vibeui-block="timeline-activity"] [data-state="todo"] [data-part="dot"]{
background:var(--vibeui-ta-card);box-shadow:none;
}
[data-vibeui-block="timeline-activity"] [data-part="line"]{
width:1px;flex:1;background:var(--vibeui-ta-border);
}
[data-vibeui-block="timeline-activity"] [data-part="body"]{flex:1;min-width:0;padding-bottom:0.875rem}
[data-vibeui-block="timeline-activity"] [data-part="row"]:last-child [data-part="body"]{padding-bottom:0}
[data-vibeui-block="timeline-activity"] [data-part="top"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="timeline-activity"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:550;line-height:1.35;
}
[data-vibeui-block="timeline-activity"] [data-part="meta"]{
flex:none;font-size:0.625rem;font-weight:550;font-variant-numeric:tabular-nums;
color:var(--vibeui-ta-muted);white-space:nowrap;
}
[data-vibeui-block="timeline-activity"] [data-state="current"] [data-part="meta"]{color:var(--vibeui-ta-accent)}
[data-vibeui-block="timeline-activity"] [data-part="desc"]{
display:block;margin-top:0.125rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.625rem;line-height:1.4;color:var(--vibeui-ta-muted);
}
@keyframes vibeui-ta-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-ta-ping{0%{transform:scale(1);opacity:.35}80%,100%{transform:scale(1.7);opacity:0}}
@keyframes vibeui-ta-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="timeline-activity"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="timeline-activity"] [data-part="ping"]{animation:none;opacity:0}
[data-vibeui-block="timeline-activity"] [data-part="row"]{animation:none}
}
`

const CHECK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const DEFAULT_EVENTS: ActivityTimelineEvent[] = [
  {
    label: "Спецификация утверждена",
    desc: "Токены, типографика, движение",
    meta: "2 нед",
    state: "done",
  },
  {
    label: "Реализация фронтенда",
    desc: "React + Motion компоненты",
    meta: "4 дн",
    state: "done",
  },
  {
    label: "QA и доступность",
    desc: "Аудит ARIA, клавиатура",
    meta: "В работе",
    state: "current",
  },
  {
    label: "Деплой на стейджинг",
    desc: "Предпросмотр окружения",
    meta: "Дальше",
    state: "todo",
  },
  {
    label: "Продакшн-релиз",
    desc: "Публичный релиз v3.0",
    meta: "Пт",
    state: "todo",
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
 * Лента активности с радужным свечением. Один файл, ноль зависимостей,
 * собственная палитра. Состояние — пропами, анимации на чистом CSS.
 */
export function ActivityTimeline({
  title = "Таймлайн релиза",
  badge = "v3.0",
  events = DEFAULT_EVENTS,
  accent,
  background = "",
  fadeOut = false,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: ActivityTimelineProps) {
  const palette = {
    ...(accent ? { "--vibeui-ta-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ta-frame": background,
          "--vibeui-ta-card": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const isoStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-timeline-activity" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-activity"
        data-slot="activity-timeline"
        data-fade={fadeOut ? "true" : undefined}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={isoStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <span data-part="gtitle">{title}</span>
                {badge ? <span data-part="badge">{badge}</span> : null}
              </div>
              <div data-part="events">
                {events.map((event, index) => {
                  const state = event.state ?? "todo"
                  const last = index === events.length - 1

                  return (
                    <div data-part="row" data-state={state} key={event.label}>
                      <div data-part="rail">
                        <span data-part="dot" aria-hidden="true">
                          {state === "done" ? CHECK : null}
                          {state === "current" ? (
                            <>
                              <span data-part="pip" />
                              <span data-part="ping" />
                            </>
                          ) : null}
                        </span>
                        {last ? null : <span data-part="line" />}
                      </div>
                      <div data-part="body">
                        <div data-part="top">
                          <span data-part="label">{event.label}</span>
                          <span data-part="meta">{event.meta}</span>
                        </div>
                        {event.desc ? (
                          <span data-part="desc">{event.desc}</span>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
