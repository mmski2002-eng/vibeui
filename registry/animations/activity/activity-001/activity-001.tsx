import type { ComponentProps, CSSProperties } from "react"

export type Activity001Event = {
  label: string
  /** Вторая строка под заголовком: короткое описание шага. */
  desc?: string
  /** Правая колонка: относительное время или статус словом. */
  meta: string
  state?: "done" | "current" | "todo"
}

export type Activity001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: версия, квартал и т. п. */
  badge?: string
  events?: Activity001Event[]
  accent?: string
  /** Нижние события растворяются к краю карточки. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Идея: лента активности с радужным свечением под карточкой. Свечение —
// размытый спектральный градиент, который дышит по ширине; это и есть
// анимация категории. Состояние шага читается точкой — галочка (пройдено),
// пульсирующее кольцо (текущее), пустой круг (впереди), — а строки въезжают
// по мере прокрутки карточки в вид (scroll-driven, без JS).
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="activity-001"]){
--vibeui-activity-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-activity-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-activity-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-activity-001-muted:color-mix(in oklab,var(--vibeui-activity-001-fg) 62%,transparent);
--vibeui-activity-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-activity-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-activity-001-accent-fg:oklch(from var(--vibeui-activity-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-activity-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="activity-001"]{color-scheme:dark}
[data-vibeui-block="activity-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-activity-001-fg);font-family:var(--vibeui-activity-001-font);
}
[data-vibeui-block="activity-001"] *{box-sizing:border-box}
[data-vibeui-block="activity-001"] [data-part="stage"]{perspective:1400px}
/* Внешняя рамка с паддингом: радужное свечение живёт под карточкой. */
[data-vibeui-block="activity-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-activity-001-border);
background:color-mix(in oklab,var(--vibeui-activity-001-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
view-timeline:--vibeui-activity-001 block;
}
[data-vibeui-block="activity-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-activity-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="activity-001"][data-flat="true"] [data-part="glow"]{display:none}
/* Карточка непрозрачна и лежит поверх свечения — наружу выходит только размытый ореол. */
[data-vibeui-block="activity-001"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-activity-001-border);
background:var(--vibeui-activity-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="activity-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-activity-001-border);
}
[data-vibeui-block="activity-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="activity-001"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-activity-001-accent);
background:color-mix(in oklab,var(--vibeui-activity-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-activity-001-accent) 22%,transparent);
}
[data-vibeui-block="activity-001"] [data-part="events"]{
display:flex;flex-direction:column;margin:0;padding:0.75rem;list-style:none;
}
[data-vibeui-block="activity-001"][data-fade="true"] [data-part="events"]{
-webkit-mask-image:linear-gradient(to bottom,#000 45%,transparent 100%);
mask-image:linear-gradient(to bottom,#000 45%,transparent 100%);
}
/* Строки въезжают по мере прокрутки карточки в вид: анимацией управляет
   view-timeline рамки, а не время. Стаггер — сдвигом диапазона по номеру
   строки. Где scroll-driven не поддержан, длительности нет и строка сразу
   в конечном состоянии (видима). */
[data-vibeui-block="activity-001"] [data-part="row"]{
display:flex;align-items:stretch;gap:0.75rem;
animation:vibeui-activity-001-rise linear both;
animation-timeline:--vibeui-activity-001;
animation-range:entry 0% entry 42%;
}
[data-vibeui-block="activity-001"] [data-part="row"]:nth-child(2){animation-range:entry 8% entry 50%}
[data-vibeui-block="activity-001"] [data-part="row"]:nth-child(3){animation-range:entry 16% entry 58%}
[data-vibeui-block="activity-001"] [data-part="row"]:nth-child(4){animation-range:entry 24% entry 66%}
[data-vibeui-block="activity-001"] [data-part="row"]:nth-child(5){animation-range:entry 32% entry 74%}
[data-vibeui-block="activity-001"] [data-part="row"]:nth-child(6){animation-range:entry 40% entry 82%}
[data-vibeui-block="activity-001"] [data-part="rail"]{
display:flex;flex-direction:column;align-items:center;
}
[data-vibeui-block="activity-001"] [data-part="dot"]{
position:relative;display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;flex:none;border-radius:9999px;
border:1px solid var(--vibeui-activity-001-border);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-activity-001-frame) 45%,transparent);
}
[data-vibeui-block="activity-001"] [data-part="dot"] svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="activity-001"] [data-state="done"] [data-part="dot"]{
background:var(--vibeui-activity-001-frame);color:var(--vibeui-activity-001-muted);
}
[data-vibeui-block="activity-001"] [data-state="current"] [data-part="dot"]{
background:var(--vibeui-activity-001-accent);border-color:var(--vibeui-activity-001-accent);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-activity-001-accent) 15%,transparent);
}
[data-vibeui-block="activity-001"] [data-part="pip"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-activity-001-accent-fg);
}
[data-vibeui-block="activity-001"] [data-part="ping"]{
position:absolute;inset:0;border-radius:9999px;background:var(--vibeui-activity-001-accent);
animation:vibeui-activity-001-ping 2s ease-out infinite;
}
[data-vibeui-block="activity-001"] [data-state="todo"] [data-part="dot"]{
background:var(--vibeui-activity-001-card);box-shadow:none;
}
[data-vibeui-block="activity-001"] [data-part="line"]{
width:1px;flex:1;background:var(--vibeui-activity-001-border);
}
[data-vibeui-block="activity-001"] [data-part="body"]{flex:1;min-width:0;padding-bottom:0.875rem}
[data-vibeui-block="activity-001"] [data-part="row"]:last-child [data-part="body"]{padding-bottom:0}
[data-vibeui-block="activity-001"] [data-part="top"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="activity-001"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:550;line-height:1.35;
}
[data-vibeui-block="activity-001"] [data-part="meta"]{
flex:none;font-size:0.625rem;font-weight:550;font-variant-numeric:tabular-nums;
color:var(--vibeui-activity-001-muted);white-space:nowrap;
}
[data-vibeui-block="activity-001"] [data-state="current"] [data-part="meta"]{color:var(--vibeui-activity-001-accent)}
[data-vibeui-block="activity-001"] [data-part="desc"]{
display:block;margin-top:0.125rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.625rem;line-height:1.4;color:var(--vibeui-activity-001-muted);
}
@keyframes vibeui-activity-001-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-activity-001-ping{0%{transform:scale(1);opacity:.35}80%,100%{transform:scale(1.7);opacity:0}}
@keyframes vibeui-activity-001-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="activity-001"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="activity-001"] [data-part="ping"]{animation:none;opacity:0}
[data-vibeui-block="activity-001"] [data-part="row"]{animation:none}
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

const DEFAULT_EVENTS: Activity001Event[] = [
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
 * Лента активности с радужным свечением. Один файл, ноль зависимостей,
 * собственная палитра. Состояние — пропами, анимации на чистом CSS.
 */
export function Activity001({
  title = "Таймлайн релиза",
  badge = "v3.0",
  events = DEFAULT_EVENTS,
  accent,
  fadeOut = false,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Activity001Props) {
  const palette = {
    ...(accent ? { "--vibeui-activity-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-activity-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="activity-001"
        data-slot="activity-timeline"
        data-fade={fadeOut ? "true" : undefined}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                {badge ? <span data-part="badge">{badge}</span> : null}
              </div>
              <ol data-part="events">
                {events.map((event, index) => {
                  const state = event.state ?? "todo"
                  const last = index === events.length - 1

                  return (
                    <li data-part="row" data-state={state} key={event.label}>
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
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
