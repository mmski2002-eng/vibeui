"use client"

import { useState, type CSSProperties } from "react"

export type Event006Day = {
  /** Ключ дня: «fri». */
  key: string
  /** «Пятница». */
  label: string
  /** «22 авг». */
  date?: string
  /** Цвет капсулы дня. */
  color: string
  ink?: string
}

export type Event006Slot = {
  day: string
  /** «19:30». */
  time: string
  title: string
  stage?: string
  /** Направление для фильтра: «#Музыка». */
  tag?: string
  tagColor?: string
  tagInk?: string
  /** «Бесплатно», «18+». */
  note?: string
  href?: string
}

export type Event006Props = {
  eyebrow?: string
  title?: string
  days?: readonly Event006Day[]
  slots?: readonly Event006Slot[]
  allLabel?: string
  emptyText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Расписание по дням: дни — большие цветные капсулы (активная залита своим
// цветом, остальные контуром), под ними фильтр направлений маленькими
// капсулами, затем список слотов: время крупно слева, цветная вертикальная
// полоска дня, заголовок, сцена и направление. Смена дня перерисовывает
// список с каскадом. Состояние: день и направление.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="event-006"]){
--vibeui-event-006-bg:light-dark(#ffffff,#0e0f12);
--vibeui-event-006-fg:light-dark(#111111,#f4f4f5);
--vibeui-event-006-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-event-006-line:light-dark(#e8e8ea,#26272d);
--vibeui-event-006-chip:light-dark(#f1f1f3,#1f2026);
--vibeui-event-006-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-006-on-accent:oklch(from var(--vibeui-event-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-event-006-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-event-006-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-006"]{color-scheme:dark}
:where([data-vibeui-block="event-006"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-006"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-006"]{box-sizing:border-box;display:block;background:var(--vibeui-event-006-bg);color:var(--vibeui-event-006-fg);font-family:var(--vibeui-event-006-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="event-006"] *{box-sizing:border-box}
[data-vibeui-block="event-006"] a{color:inherit;text-decoration:none}
[data-vibeui-block="event-006"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
[data-vibeui-block="event-006"] [data-part="eyebrow"]{margin:0;padding-top:1.25rem;border-top:1px solid var(--vibeui-event-006-line);font-size:1.05rem}
[data-vibeui-block="event-006"] [data-part="title"]{margin:.5rem 0 1.5rem;font-family:var(--vibeui-event-006-display);font-size:clamp(1.6rem,3.4cqi,2.4rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
[data-vibeui-block="event-006"] [data-part="days"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="event-006"] [data-part="day"]{display:inline-flex;align-items:center;gap:.5rem;height:3.4rem;padding:0 1.3rem;line-height:1;border-radius:999px;border:2px solid var(--vibeui-event-006-day);background:transparent;color:inherit;font:inherit;font-family:var(--vibeui-event-006-display);font-size:1.15rem;font-weight:600;letter-spacing:-.01em;cursor:pointer;transition:background .25s,color .25s,transform .25s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="event-006"] [data-part="day"] small{font-family:var(--vibeui-event-006-font);font-size:.8rem;font-weight:500;opacity:.7;padding-top:.15rem}
[data-vibeui-block="event-006"] [data-part="day"]:hover{transform:translateY(-2px)}
[data-vibeui-block="event-006"] [data-part="day"][aria-selected="true"]{background:var(--vibeui-event-006-day);color:var(--vibeui-event-006-day-ink,#111)}
[data-vibeui-block="event-006"] [data-part="day"]:focus-visible,[data-vibeui-block="event-006"] [data-part="filter"]:focus-visible{outline:2px solid var(--vibeui-event-006-fg);outline-offset:3px}
[data-vibeui-block="event-006"] [data-part="filters"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:1rem 0 0;padding:0;list-style:none}
[data-vibeui-block="event-006"] [data-part="filter"]{height:2.1rem;padding:0 .85rem;border-radius:999px;border:0;background:var(--vibeui-event-006-chip);color:inherit;font:inherit;font-size:.85rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s}
[data-vibeui-block="event-006"] [data-part="filter"][aria-pressed="true"]{background:var(--vibeui-event-006-fg);color:var(--vibeui-event-006-bg)}
[data-vibeui-block="event-006"] [data-part="slots"]{margin:1.75rem 0 0;padding:0;list-style:none;border-top:1px solid var(--vibeui-event-006-line)}
[data-vibeui-block="event-006"] [data-part="slot"]{display:grid;grid-template-columns:4.5rem minmax(0,1fr);gap:.25rem 1rem;padding:1rem 0;border-bottom:1px solid var(--vibeui-event-006-line);animation:vibeui-event-006-in .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-event-006-n) * 40ms);transition:background .2s}
@keyframes vibeui-event-006-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
[data-vibeui-block="event-006"] [data-part="time"]{position:relative;padding-left:.9rem;font-family:var(--vibeui-event-006-display);font-size:1.25rem;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.2}
[data-vibeui-block="event-006"] [data-part="time"]::before{content:"";position:absolute;left:0;top:.15rem;bottom:.1rem;width:4px;border-radius:4px;background:var(--vibeui-event-006-day)}
[data-vibeui-block="event-006"] [data-part="slot-title"]{margin:0;font-family:var(--vibeui-event-006-display);font-size:1.2rem;font-weight:600;line-height:1.25;letter-spacing:-.02em}
[data-vibeui-block="event-006"] [data-part="slot-title"] a:hover{opacity:.7}
[data-vibeui-block="event-006"] [data-part="slot-meta"]{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .6rem;margin:.25rem 0 0;font-size:.9rem;color:var(--vibeui-event-006-muted)}
[data-vibeui-block="event-006"] [data-part="tag"]{padding:.15rem .55rem;border-radius:999px;background:var(--vibeui-event-006-tag,#f1f1f3);color:var(--vibeui-event-006-ink,#111);font-size:.78rem;font-weight:500}
[data-vibeui-block="event-006"] [data-part="note"]{padding:.15rem .55rem;border-radius:999px;background:var(--vibeui-event-006-chip);font-size:.78rem}
[data-vibeui-block="event-006"] [data-part="empty"]{margin:1.5rem 0 0;padding:2rem;border-radius:1rem;background:var(--vibeui-event-006-chip);text-align:center;color:var(--vibeui-event-006-muted)}
@container (min-width: 56rem){
[data-vibeui-block="event-006"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="event-006"] [data-part="slot"]{grid-template-columns:6rem minmax(0,1fr) auto;align-items:baseline;padding:1.1rem 0}
[data-vibeui-block="event-006"] [data-part="slot-meta"]{grid-column:3;margin:0;justify-content:flex-end}
[data-vibeui-block="event-006"] [data-part="slot"]:hover{background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-event-006-day) 14%,transparent),transparent 60%)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-006"] *{animation:none!important;transition:none!important}}`

const DEFAULT_DAYS: Event006Day[] = [
  { key: "fri", label: "Пятница", date: "22 авг", color: "#ffa5b1" },
  { key: "sat", label: "Суббота", date: "23 авг", color: "#c2df37" },
  { key: "sun", label: "Воскресенье", date: "24 авг", color: "#464dff", ink: "#fff" },
]

const DEFAULT_SLOTS: Event006Slot[] = [
  { day: "fri", time: "18:00", title: "Открытие площадок, фуд-корт и маркет", stage: "Все площадки", tag: "#Еда", tagColor: "#c2df37", note: "Бесплатно" },
  { day: "fri", time: "20:00", title: "Оркестр на воде и салют из конфетти", stage: "Главная сцена", tag: "#Музыка", tagColor: "#ffe2d6" },
  { day: "fri", time: "22:00", title: "Диджей-сет на набережной", stage: "Набережная", tag: "#Ночь", tagColor: "#122378", tagInk: "#fff", note: "18+" },
  { day: "sat", time: "08:00", title: "Йога на набережной", stage: "Набережная", tag: "#Утро", tagColor: "#98f5af", note: "Бесплатно" },
  { day: "sat", time: "11:00", title: "Большая картина: полотно 30 метров", stage: "Детская поляна", tag: "#Дети", tagColor: "#9854d1", tagInk: "#fff", note: "0+" },
  { day: "sat", time: "13:00", title: "Мастер-класс: паста от шефов района", stage: "Фуд-корт", tag: "#Еда", tagColor: "#c2df37" },
  { day: "sat", time: "15:00", title: "Как город слышит: лекция о звуке улиц", stage: "Лекторий", tag: "#Лекции", tagColor: "#f1ddbc", note: "Бесплатно" },
  { day: "sat", time: "17:30", title: "Уличный театр: «Трамвай желаний» на колёсах", stage: "Аллея", tag: "#Театр", tagColor: "#d9cafe" },
  { day: "sat", time: "20:00", title: "Хедлайнер: Соня Волна и оркестр", stage: "Главная сцена", tag: "#Музыка", tagColor: "#ffe2d6" },
  { day: "sat", time: "21:30", title: "Кино под небом: короткий метр о городе", stage: "Набережная", tag: "#Кино", tagColor: "#f3c37d" },
  { day: "sat", time: "23:00", title: "Тихая дискотека в наушниках", stage: "Танцпол", tag: "#Ночь", tagColor: "#122378", tagInk: "#fff", note: "18+" },
  { day: "sun", time: "10:00", title: "Велопарад по набережной", stage: "Город", tag: "#Город", tagColor: "#464dff", tagInk: "#fff", note: "Бесплатно" },
  { day: "sun", time: "12:00", title: "Воркшоп: керамика за час", stage: "Аллея", tag: "#Воркшопы", tagColor: "#fdb084" },
  { day: "sun", time: "14:00", title: "Дискуссия: кому принадлежит двор", stage: "Лекторий", tag: "#Лекции", tagColor: "#f1ddbc", note: "Бесплатно" },
  { day: "sun", time: "16:00", title: "Роллер-джем и тренировка", stage: "Набережная", tag: "#Спорт", tagColor: "#ffa5b1" },
  { day: "sun", time: "19:00", title: "Закрытие: сводный хор города", stage: "Главная сцена", tag: "#Музыка", tagColor: "#ffe2d6" },
]

/** Расписание фестиваля: дни цветными капсулами, фильтр направлений и список слотов. */
export function Event006({
  eyebrow = "Расписание",
  title = "По дням и площадкам",
  days = DEFAULT_DAYS,
  slots = DEFAULT_SLOTS,
  allLabel = "Все направления",
  emptyText = "В этот день по выбранному направлению ничего нет — посмотрите соседний.",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Event006Props) {
  const [day, setDay] = useState(days[0]?.key ?? "")
  const [tag, setTag] = useState("")
  const palette = {
    ...(accent ? { "--vibeui-event-006-accent": accent } : null),
    ...(background ? { "--vibeui-event-006-bg": background } : null),
    ...style,
  } as CSSProperties
  const current = days.find((item) => item.key === day)
  const tags = Array.from(new Map(slots.filter((slot) => slot.tag).map((slot) => [slot.tag as string, slot])).values())
  const visible = slots.filter((slot) => slot.day === day && (!tag || slot.tag === tag))

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-006" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-006" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          <ul data-part="days" role="tablist" aria-label="Дни фестиваля">
            {days.map((item) => (
              <li key={item.key} style={{ ["--vibeui-event-006-day" as string]: item.color, ["--vibeui-event-006-day-ink" as string]: item.ink ?? "#111" }}>
                <button type="button" role="tab" data-part="day" aria-selected={item.key === day} onClick={() => setDay(item.key)}>
                  {item.label}
                  {item.date ? <small>{item.date}</small> : null}
                </button>
              </li>
            ))}
          </ul>
          {tags.length > 1 ? (
            <ul data-part="filters" aria-label="Направления">
              <li>
                <button type="button" data-part="filter" aria-pressed={tag === ""} onClick={() => setTag("")}>
                  {allLabel}
                </button>
              </li>
              {tags.map((slot) => (
                <li key={slot.tag}>
                  <button type="button" data-part="filter" aria-pressed={tag === slot.tag} onClick={() => setTag(tag === slot.tag ? "" : (slot.tag as string))}>
                    {slot.tag}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {visible.length > 0 ? (
            <ol key={day + tag} data-part="slots" style={{ ["--vibeui-event-006-day" as string]: current?.color ?? "#111" }}>
              {visible.map((slot, index) => (
                <li key={slot.time + slot.title} data-part="slot" style={{ ["--vibeui-event-006-n" as string]: index }}>
                  <span data-part="time">{slot.time}</span>
                  <div>
                    <h3 data-part="slot-title">{slot.href ? <a href={slot.href}>{slot.title}</a> : slot.title}</h3>
                  </div>
                  <p data-part="slot-meta">
                    {slot.stage ? <span>{slot.stage}</span> : null}
                    {slot.tag ? (
                      <span data-part="tag" style={{ ["--vibeui-event-006-tag" as string]: slot.tagColor, ["--vibeui-event-006-ink" as string]: slot.tagInk ?? "#111" }}>
                        {slot.tag}
                      </span>
                    ) : null}
                    {slot.note ? <span data-part="note">{slot.note}</span> : null}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p data-part="empty">{emptyText}</p>
          )}
        </div>
      </section>
    </>
  )
}
