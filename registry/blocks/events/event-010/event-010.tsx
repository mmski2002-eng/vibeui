"use client"

import { useState, type CSSProperties } from "react"

export type Event010Slot = {
  time: string
  title: string
  place?: string
  text?: string
}

export type Event010Day = {
  /** Число: «12». */
  day: string
  /** Подпись дня: «Гавана». */
  label: string
  /** Рукописная строка под подписью: «прилёт и мохито». */
  note?: string
  /** Что надеть в этот день. */
  wear?: string
  /** Главный день — церемония: выделяется. */
  main?: boolean
  /** Фото дня над «что надеть». */
  image?: string
  imageAlt?: string
  slots: readonly Event010Slot[]
}

export type Event010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  days?: readonly Event010Day[]
  wearLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Программа трёх дней табами-билетами: число крупно, подпись дня и
// рукописная строка; главный день (церемония) — коралловый. Под табами —
// расписание дня: время узким капсом, место, пара слов, справа плашка
// «что надеть». Переключение — с проступанием.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-010"]){
--vibeui-event-010-bg:light-dark(#f3e9d2,#1c2a34);
--vibeui-event-010-paper:light-dark(#fffaf0,#14202a);
--vibeui-event-010-fg:light-dark(#123a4b,#eef4f2);
--vibeui-event-010-muted:light-dark(#5b6f78,#9fb2b8);
--vibeui-event-010-line:light-dark(#e3d7bf,#2c3f4a);
--vibeui-event-010-accent:#ff6b57;
--vibeui-event-010-sea:#2aa7a0;
--vibeui-event-010-sun:#f2c14e;
--vibeui-event-010-on-accent:#fffaf0;
--vibeui-event-010-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-event-010-script:"Lobster","Brush Script MT",cursive;
--vibeui-event-010-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-010"]{color-scheme:dark}
:where([data-vibeui-block="event-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-010"]{box-sizing:border-box;display:block;background:var(--vibeui-event-010-bg);color:var(--vibeui-event-010-fg);font-family:var(--vibeui-event-010-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="event-010"] *{box-sizing:border-box}
[data-vibeui-block="event-010"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="event-010"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-event-010-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-event-010-accent)}
[data-vibeui-block="event-010"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-010-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="event-010"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-event-010-muted)}
[data-vibeui-block="event-010"] [data-part="tabs"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;margin:2rem 0 0}
[data-vibeui-block="event-010"] [data-part="tab"]{position:relative;display:grid;gap:.1rem;padding:.9rem 1rem;border:1px solid var(--vibeui-event-010-line);border-radius:.8rem;background:var(--vibeui-event-010-paper);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:transform .25s,border-color .25s,box-shadow .25s}
[data-vibeui-block="event-010"] [data-part="tab"]::before{content:"";position:absolute;left:-.4rem;top:50%;width:.8rem;height:.8rem;margin-top:-.4rem;border-radius:50%;background:var(--vibeui-event-010-bg)}
[data-vibeui-block="event-010"] [data-part="tab"]:hover{transform:translateY(-2px)}
[data-vibeui-block="event-010"] [data-part="tab"][aria-selected="true"]{border-color:var(--vibeui-event-010-fg);box-shadow:0 18px 30px -24px rgb(18 58 75 / .6)}
[data-vibeui-block="event-010"] [data-part="tab"][data-main="true"][aria-selected="true"]{background:var(--vibeui-event-010-accent);border-color:var(--vibeui-event-010-accent);color:var(--vibeui-event-010-on-accent)}
[data-vibeui-block="event-010"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-event-010-sea);outline-offset:3px}
[data-vibeui-block="event-010"] [data-part="tab"] b{font-family:var(--vibeui-event-010-display);font-size:clamp(1.6rem,4cqi,2.4rem);font-weight:700;line-height:1}
[data-vibeui-block="event-010"] [data-part="tab"] span{font-family:var(--vibeui-event-010-display);font-size:.78rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;opacity:.8}
[data-vibeui-block="event-010"] [data-part="tab"] small{font-family:var(--vibeui-event-010-script);font-size:1rem;color:var(--vibeui-event-010-sea)}
[data-vibeui-block="event-010"] [data-part="tab"][data-main="true"][aria-selected="true"] small{color:var(--vibeui-event-010-sun)}
[data-vibeui-block="event-010"] [data-part="panel"]{display:grid;gap:1.5rem;margin-top:1rem;padding:1.5rem;border-radius:1rem;background:var(--vibeui-event-010-paper);animation:vibeui-event-010-in .45s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-event-010-in{from{opacity:0;transform:translateY(.4rem)}}
[data-vibeui-block="event-010"] [data-part="slots"]{margin:0;padding:0;list-style:none}
[data-vibeui-block="event-010"] [data-part="slot"]{display:grid;grid-template-columns:4.2rem minmax(0,1fr);gap:.2rem 1rem;padding:.9rem 0;border-bottom:1px dashed var(--vibeui-event-010-line)}
[data-vibeui-block="event-010"] [data-part="slot"]:last-child{border-bottom:0}
[data-vibeui-block="event-010"] [data-part="slot"] time{font-family:var(--vibeui-event-010-display);font-size:1.2rem;font-weight:600;letter-spacing:.04em;color:var(--vibeui-event-010-sea);font-variant-numeric:tabular-nums}
[data-vibeui-block="event-010"] [data-part="slot"] h3{margin:0;font-family:var(--vibeui-event-010-display);font-size:1.3rem;font-weight:600;line-height:1.15;text-transform:uppercase}
[data-vibeui-block="event-010"] [data-part="slot"] h3 span{margin-left:.6rem;font-family:var(--vibeui-event-010-font);font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-event-010-accent)}
[data-vibeui-block="event-010"] [data-part="slot"] p{grid-column:2;margin:0;font-size:.92rem;color:var(--vibeui-event-010-muted)}
[data-vibeui-block="event-010"] [data-part="side"]{display:grid;gap:1rem;align-self:start}
[data-vibeui-block="event-010"] [data-part="photo"]{margin:0;padding:.5rem .5rem 0;border-radius:.6rem;background:#fff;box-shadow:0 10px 24px -14px rgb(18 58 75 / .4);transform:rotate(-1.2deg)}
[data-vibeui-block="event-010"] [data-part="photo"] img{display:block;width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:.3rem}
[data-vibeui-block="event-010"] [data-part="photo"] figcaption{padding:.5rem .2rem .6rem;font-family:var(--vibeui-event-010-script);font-size:1.05rem;color:var(--vibeui-event-010-muted)}
[data-vibeui-block="event-010"] [data-part="wear"]{padding:1.2rem 1.3rem;border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-event-010-sun) 22%,transparent)}
[data-vibeui-block="event-010"] [data-part="wear"] b{display:block;margin-bottom:.3rem;font-family:var(--vibeui-event-010-display);font-size:.72rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-event-010-muted)}
[data-vibeui-block="event-010"] [data-part="wear"] p{margin:0;font-family:var(--vibeui-event-010-script);font-size:1.35rem;line-height:1.25}
@container (min-width:56rem){
[data-vibeui-block="event-010"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="event-010"] [data-part="tabs"]{gap:1rem}
[data-vibeui-block="event-010"] [data-part="tab"]{padding:1.2rem 1.4rem}
[data-vibeui-block="event-010"] [data-part="panel"]{grid-template-columns:minmax(0,1.6fr) minmax(14rem,.6fr);padding:2rem 2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-010"] *{animation:none!important;transition:none!important}}`

/** Программа трёх дней свадьбы-путешествия табами-билетами с расписанием и «что надеть». */
export function Event010({
  eyebrow = "Три дня",
  title = "Гавана, пляж, отдых",
  lede = "Прилетаем вместе, уезжаем вместе. Между — один вечер в городе, одна церемония на песке и одно утро, чтобы отоспаться.",
  days = [
    {
      day: "12",
      label: "Гавана",
      note: "прилёт и мохито",
      wear: "Лён, кеды и что-нибудь от солнца",
      slots: [
        { time: "14:30", title: "Прилёт", place: "аэропорт Хосе Марти", text: "Трансфер в отель ждёт у выхода — ищите табличку с нашими именами." },
        { time: "18:00", title: "Прогулка", place: "Старая Гавана", text: "Малекон, ретро-машины, первое мороженое." },
        { time: "20:30", title: "Ужин на крыше", place: "бар у собора", text: "Знакомимся друг с другом. Мохито за наш счёт." },
      ],
    },
    {
      day: "13",
      label: "Пляж",
      note: "тот самый день",
      wear: "Beach formal: лён, песок, никаких каблуков",
      main: true,
      slots: [
        { time: "09:00", title: "Перелёт на Кайо-Ларго", place: "маленький самолёт", text: "Сорок минут над бирюзой — и мы на месте." },
        { time: "16:30", title: "Церемония", place: "Playa Paraíso", text: "Босиком, лицом к морю, двадцать минут." },
        { time: "18:00", title: "Ужин на песке", place: "длинный стол у воды", text: "Лобстер, ром, закат и тосты." },
        { time: "21:00", title: "Сон-кубано", place: "там же", text: "Живая группа из Гаваны. Танцевать умеют все — проверено." },
      ],
    },
    {
      day: "14",
      label: "Отдых",
      note: "медленное утро",
      wear: "Что осталось чистым",
      slots: [
        { time: "10:30", title: "Поздний завтрак", place: "терраса отеля", text: "Кофе, папайя, обмен фотографиями." },
        { time: "13:00", title: "Море", place: "пляж у отеля", text: "Последнее купание. Или первое — кто как." },
        { time: "17:00", title: "Обратно в Гавану", place: "самолёт", text: "Вечером — кто в аэропорт, кто остаётся ещё на неделю." },
      ],
    },
  ],
  wearLabel = "Что надеть",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Event010Props) {
  const [active, setActive] = useState(() => Math.max(0, days.findIndex((day) => day.main)))
  const day = days[active] ?? days[0]
  const palette = {
    ...(accent ? { "--vibeui-event-010-accent": accent } : null),
    ...(background ? { "--vibeui-event-010-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-010" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-010" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="tabs" role="tablist">
            {days.map((item, index) => (
              <button key={item.day} type="button" role="tab" data-part="tab" data-main={item.main ? "true" : undefined} aria-selected={index === active} aria-controls={`vibeui-event-010-day-${index}`} onClick={() => setActive(index)}>
                <b>{item.day}</b>
                <span>{item.label}</span>
                {item.note ? <small>{item.note}</small> : null}
              </button>
            ))}
          </div>
          {day ? (
            <div key={active} id={`vibeui-event-010-day-${active}`} role="tabpanel" data-part="panel">
              <ol data-part="slots">
                {day.slots.map((slot) => (
                  <li key={slot.time + slot.title} data-part="slot">
                    <time>{slot.time}</time>
                    <h3>
                      {slot.title}
                      {slot.place ? <span>{slot.place}</span> : null}
                    </h3>
                    {slot.text ? <p>{slot.text}</p> : null}
                  </li>
                ))}
              </ol>
              {day.wear || day.image ? (
                <div data-part="side">
                  {day.image ? (
                    <figure data-part="photo">
                      <img src={day.image} alt={day.imageAlt ?? ""} loading="lazy" />
                      <figcaption>{day.note ?? day.label}</figcaption>
                    </figure>
                  ) : null}
                  {day.wear ? (
                    <aside data-part="wear">
                      <b>{wearLabel}</b>
                      <p>{day.wear}</p>
                    </aside>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
