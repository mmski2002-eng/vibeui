import type { CSSProperties } from "react"

export type Event025Item = {
  /** День и месяц: «27», «сен». */
  day: string
  month: string
  weekday?: string
  title: string
  text?: string
  place: string
  time: string
  /** Сколько волонтёров нужно и сколько уже записалось. */
  need?: number
  joined?: number
  /** Рукописная пометка: «нужны руки», «с детьми можно». */
  note?: string
  actionLabel?: string
  actionHref?: string
}

export type Event025Props = {
  eyebrow?: string
  title?: string
  lede?: string
  events?: readonly Event025Item[]
  /** Строки счётчика мест. */
  joinedLine?: string
  fullLabel?: string
  leftLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// События фонда как билеты: слева корешок с датой антиквой, между
// корешком и телом — перфорация (пунктир и полукруглые вырезы маской),
// справа название, место, время, шкала «нужны руки: 6 из 10» и рукописная
// пометка на полях. По наведению билет чуть приподнимается и корешок
// подсвечивается акцентом. Без хуков, всё на CSS.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-025"]){
--vibeui-event-025-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-event-025-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-025-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-025-on-accent:oklch(from var(--vibeui-event-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-event-025-muted:color-mix(in oklab,var(--vibeui-event-025-fg) 62%,var(--vibeui-event-025-bg));
--vibeui-event-025-line:color-mix(in oklab,var(--vibeui-event-025-fg) 16%,transparent);
--vibeui-event-025-soft:color-mix(in oklab,var(--vibeui-event-025-fg) 5%,var(--vibeui-event-025-bg));
--vibeui-event-025-paper:color-mix(in oklab,#ffffff 60%,var(--vibeui-event-025-bg));
--vibeui-event-025-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-event-025-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-event-025-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-025"]{color-scheme:dark}
:where([data-vibeui-block="event-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-025"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-event-025-bg);color:var(--vibeui-event-025-fg);font-family:var(--vibeui-event-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="event-025"] *{box-sizing:border-box}
[data-vibeui-block="event-025"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="event-025"] [data-part="head"]{max-width:40rem}
[data-vibeui-block="event-025"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-event-025-accent)}
[data-vibeui-block="event-025"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-025-display);font-weight:500;font-size:clamp(2rem,4.6cqi,3.4rem);line-height:1.08;letter-spacing:-.02em}
[data-vibeui-block="event-025"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-event-025-muted)}
[data-vibeui-block="event-025"] [data-part="list"]{display:grid;gap:1.2rem;margin:2.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="event-025"] [data-part="ticket"]{position:relative;display:grid;grid-template-columns:6rem minmax(0,1fr);background:var(--vibeui-event-025-paper);border:1px solid var(--vibeui-event-025-line);border-radius:1rem;filter:drop-shadow(0 14px 18px rgb(0 0 0 / .12));transition:transform .35s cubic-bezier(.2,.8,.2,1),filter .35s;-webkit-mask:radial-gradient(circle .7rem at 6rem 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle .7rem at 6rem 100%,transparent 98%,#000) bottom/100% 51% no-repeat;mask:radial-gradient(circle .7rem at 6rem 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle .7rem at 6rem 100%,transparent 98%,#000) bottom/100% 51% no-repeat}
[data-vibeui-block="event-025"] [data-part="ticket"]:hover{transform:translateY(-4px) rotate(-.3deg);filter:drop-shadow(0 22px 24px rgb(0 0 0 / .16))}
[data-vibeui-block="event-025"] [data-part="stub"]{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.1rem;padding:1.2rem .5rem;border-right:2px dashed var(--vibeui-event-025-line);text-align:center;transition:background .3s,color .3s}
[data-vibeui-block="event-025"] [data-part="ticket"]:hover [data-part="stub"]{background:var(--vibeui-event-025-accent);color:var(--vibeui-event-025-on-accent)}
[data-vibeui-block="event-025"] [data-part="stub"] b{font-family:var(--vibeui-event-025-display);font-weight:700;font-size:2.4rem;line-height:1;letter-spacing:-.03em}
[data-vibeui-block="event-025"] [data-part="stub"] span{font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="event-025"] [data-part="stub"] small{font-size:.72rem;opacity:.7}
[data-vibeui-block="event-025"] [data-part="body"]{display:grid;gap:.6rem;padding:1.2rem 1.4rem 1.3rem;align-content:start}
[data-vibeui-block="event-025"] [data-part="body"] h3{margin:0;font-family:var(--vibeui-event-025-display);font-weight:700;font-size:1.35rem;line-height:1.15}
[data-vibeui-block="event-025"] [data-part="text"]{margin:0;font-size:.92rem;color:var(--vibeui-event-025-muted)}
[data-vibeui-block="event-025"] [data-part="meta"]{display:flex;flex-wrap:wrap;gap:.3rem 1.2rem;margin:0;padding:0;list-style:none;font-size:.85rem;color:var(--vibeui-event-025-muted)}
[data-vibeui-block="event-025"] [data-part="meta"] li{display:inline-flex;align-items:center;gap:.35rem}
[data-vibeui-block="event-025"] [data-part="meta"] svg{width:.95rem;height:.95rem;color:var(--vibeui-event-025-accent)}
[data-vibeui-block="event-025"] [data-part="hands"]{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:.3rem .8rem;margin:.3rem 0 0;font-size:.82rem;color:var(--vibeui-event-025-muted)}
[data-vibeui-block="event-025"] [data-part="hands"] b{color:var(--vibeui-event-025-fg);font-weight:600}
[data-vibeui-block="event-025"] [data-part="track"]{grid-column:1/-1;height:.4rem;border-radius:999px;background:var(--vibeui-event-025-soft);overflow:hidden}
[data-vibeui-block="event-025"] [data-part="track"] i{display:block;height:100%;width:var(--vibeui-event-025-w);background:var(--vibeui-event-025-accent);border-radius:999px}
[data-vibeui-block="event-025"] [data-part="note"]{padding:.1rem .55rem;font-family:var(--vibeui-event-025-hand);font-size:1.2rem;line-height:1.1;color:var(--vibeui-event-025-accent);border:1px dashed var(--vibeui-event-025-accent);border-radius:.3rem;transform:rotate(-2deg)}
[data-vibeui-block="event-025"] [data-part="action"]{justify-self:start;display:inline-flex;align-items:center;margin-top:.4rem;padding:.65rem 1.1rem;border-radius:999px;border:1px solid var(--vibeui-event-025-fg);color:var(--vibeui-event-025-fg);text-decoration:none;font-weight:600;font-size:.9rem;transition:background .2s,color .2s,transform .18s}
[data-vibeui-block="event-025"] [data-part="action"]:hover{background:var(--vibeui-event-025-fg);color:var(--vibeui-event-025-bg);transform:translateY(-1px)}
[data-vibeui-block="event-025"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-event-025-accent);outline-offset:2px}
@container (min-width: 48rem){[data-vibeui-block="event-025"] [data-part="ticket"]{grid-template-columns:8rem minmax(0,1fr);-webkit-mask:radial-gradient(circle .7rem at 8rem 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle .7rem at 8rem 100%,transparent 98%,#000) bottom/100% 51% no-repeat;mask:radial-gradient(circle .7rem at 8rem 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle .7rem at 8rem 100%,transparent 98%,#000) bottom/100% 51% no-repeat}[data-vibeui-block="event-025"] [data-part="stub"] b{font-size:3rem}[data-vibeui-block="event-025"] [data-part="body"]{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"title action" "text action" "meta action" "hands action";padding:1.4rem 1.8rem}[data-vibeui-block="event-025"] [data-part="body"] h3{grid-area:title}[data-vibeui-block="event-025"] [data-part="text"]{grid-area:text}[data-vibeui-block="event-025"] [data-part="meta"]{grid-area:meta}[data-vibeui-block="event-025"] [data-part="hands"]{grid-area:hands;max-width:22rem}[data-vibeui-block="event-025"] [data-part="action"]{grid-area:action;align-self:center;margin:0 0 0 1.5rem}}
@container (min-width: 64rem){[data-vibeui-block="event-025"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}[data-vibeui-block="event-025"] [data-part="body"]{grid-template-columns:minmax(0,1fr);grid-template-areas:"title" "text" "meta" "hands" "action"}[data-vibeui-block="event-025"] [data-part="action"]{margin:.4rem 0 0;justify-self:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-025"] *{animation:none!important;transition:none!important}}`

const DEFAULT_EVENTS: Event025Item[] = [
  { day: "27", month: "сен", weekday: "суббота", title: "Осенний развоз: продукты и тёплые вещи", text: "Собираемся у склада на Коробкова, 12, грузим и едем в Ржев и Кувшиново. Вернёмся к вечеру.", place: "Тверь, склад фонда", time: "9:00 – 18:00", need: 12, joined: 7, note: "нужны водители", actionLabel: "Поехать", actionHref: "#volunteer" },
  { day: "4", month: "окт", weekday: "суббота", title: "Утепляем окна к зиме", text: "Шесть квартир в Торжке: уплотнитель, плёнка, чай с хозяевами. Инструмент даём.", place: "Торжок", time: "10:00 – 16:00", need: 8, joined: 8, note: "мест нет, спасибо!", actionLabel: "Лист ожидания", actionHref: "#volunteer" },
  { day: "18", month: "окт", weekday: "суббота", title: "День звонков: 300 «как дела?»", text: "Обзваниваем всех подопечных, слушаем, записываем, что нужно. Можно из дома.", place: "Онлайн", time: "11:00 – 15:00", need: 20, joined: 9, note: "можно из дома", actionLabel: "Записаться", actionHref: "#volunteer" },
  { day: "8", month: "ноя", weekday: "суббота", title: "Отчётная встреча и чай с подопечными", text: "Рассказываем, что сделали за год, показываем цифры, знакомим волонтёров с теми, кому они помогают.", place: "Тверь, библиотека Горького", time: "14:00", need: 0, joined: 0, note: "приходите с семьёй", actionLabel: "Прийти", actionHref: "#volunteer" },
]

/** События фонда билетами с перфорацией и шкалой «нужны руки». */
export function Event025({
  eyebrow = "События",
  title = "Ближайшие выезды и встречи",
  lede = "Каждую субботу мы куда-то едем. Билет бесплатный, дресс-код — удобная обувь.",
  events = DEFAULT_EVENTS,
  joinedLine = "Записалось {joined} из {need}",
  fullLabel = "мест нет",
  leftLine = "ещё {n}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Event025Props) {
  const palette = {
    ...(accent ? { "--vibeui-event-025-accent": accent } : null),
    ...(ink ? { "--vibeui-event-025-fg": ink } : null),
    ...(background ? { "--vibeui-event-025-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-025" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-025" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="list">
            {events.map((event) => {
              const need = event.need ?? 0
              const joined = Math.min(need, event.joined ?? 0)
              return (
                <li key={`${event.day}-${event.title}`} data-part="ticket">
                  <div data-part="stub">
                    <b>{event.day}</b>
                    <span>{event.month}</span>
                    {event.weekday ? <small>{event.weekday}</small> : null}
                  </div>
                  <div data-part="body">
                    <h3>{event.title}</h3>
                    {event.text ? <p data-part="text">{event.text}</p> : null}
                    <ul data-part="meta">
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z" />
                          <circle cx="12" cy="10" r="2" />
                        </svg>
                        {event.place}
                      </li>
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                        {event.time}
                      </li>
                      {event.note ? <li data-part="note">{event.note}</li> : null}
                    </ul>
                    {need > 0 ? (
                      <div data-part="hands">
                        <span>
                          {joinedLine.split("{joined}")[0]}
                          <b>{joined}</b>
                          {(joinedLine.split("{joined}")[1] ?? "").replace("{need}", String(need))}
                        </span>
                        <span>{joined >= need ? fullLabel : leftLine.replace("{n}", String(need - joined))}</span>
                        <div data-part="track" aria-hidden="true">
                          <i style={{ ["--vibeui-event-025-w" as string]: `${(joined / need) * 100}%` }} />
                        </div>
                      </div>
                    ) : null}
                    {event.actionLabel ? (
                      <a data-part="action" href={event.actionHref ?? "#"}>
                        {event.actionLabel}
                      </a>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
