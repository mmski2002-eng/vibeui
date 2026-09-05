import type { ComponentProps, CSSProperties } from "react"

export type CalendarAnim002Event = {
  time: string
  label: string
  /** Вторая строка: место или формат встречи. */
  place?: string
  /** Цвет полоски категории: 1–4, ключ в собственной палитре. */
  category?: 1 | 2 | 3 | 4
}

export type CalendarAnim002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  badge?: string
  events?: CalendarAnim002Event[]
  accent?: string
  /** Место и цветная полоска категории под заголовком. */
  showPlace?: boolean
  /** Бесконечный цикл появления строк снизу. false — строки видимы сразу. */
  loop?: boolean
}

// Идея: повестка дня как список карточек-событий с цветной полоской
// категории слева. Строки не просто появляются один раз — они дышат по
// кругу: поднимаются снизу с растяжкой по номеру строки, держатся видимыми,
// затем вместе уходят вниз и цикл начинается заново. Это ближе к живой
// витрине, чем одноразовый въезд: карточку каталога можно смотреть в любой
// момент и видеть движение.
const STYLES = `
:where([data-vibeui-block="calendar-anim-002"]){
--vibeui-calendar-anim-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-calendar-anim-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-calendar-anim-002-muted:color-mix(in oklab,var(--vibeui-calendar-anim-002-fg) 55%,transparent);
--vibeui-calendar-anim-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-calendar-anim-002-row:light-dark(oklch(0.976 0 0),oklch(0.245 0 0));
--vibeui-calendar-anim-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-calendar-anim-002-cat-1:light-dark(oklch(0.6 0.19 265),oklch(0.72 0.16 265));
--vibeui-calendar-anim-002-cat-2:light-dark(oklch(0.62 0.17 165),oklch(0.72 0.15 165));
--vibeui-calendar-anim-002-cat-3:light-dark(oklch(0.68 0.18 70),oklch(0.78 0.15 70));
--vibeui-calendar-anim-002-cat-4:light-dark(oklch(0.6 0.2 20),oklch(0.72 0.17 20));
--vibeui-calendar-anim-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-anim-002"]{color-scheme:dark}
[data-vibeui-block="calendar-anim-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-calendar-anim-002-fg);font-family:var(--vibeui-calendar-anim-002-font);
}
[data-vibeui-block="calendar-anim-002"] *{box-sizing:border-box}
[data-vibeui-block="calendar-anim-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-calendar-anim-002-border);
background:var(--vibeui-calendar-anim-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);overflow:clip;
}
[data-vibeui-block="calendar-anim-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-calendar-anim-002-border);
}
[data-vibeui-block="calendar-anim-002"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-anim-002"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-calendar-anim-002-accent);
background:color-mix(in oklab,var(--vibeui-calendar-anim-002-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-calendar-anim-002-accent) 22%,transparent);
}
[data-vibeui-block="calendar-anim-002"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.375rem;margin:0;padding:0.625rem;list-style:none;
}
[data-vibeui-block="calendar-anim-002"] [data-part="row"]{
position:relative;display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.625rem 0.5rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-calendar-anim-002-row);overflow:clip;
}
[data-vibeui-block="calendar-anim-002"][data-loop="true"] [data-part="row"]{
animation:vibeui-calendar-anim-002-rise 5.5s ease-in-out infinite;
animation-delay:calc(var(--vibeui-calendar-anim-002-i,0) * 160ms);
}
[data-vibeui-block="calendar-anim-002"] [data-part="row"]::before{
content:"";position:absolute;left:0;top:0.375rem;bottom:0.375rem;width:0.1875rem;
border-radius:9999px;background:var(--vibeui-calendar-anim-002-cat,var(--vibeui-calendar-anim-002-accent));
}
[data-vibeui-block="calendar-anim-002"] [data-part="time"]{
flex:none;min-width:2.75rem;font-size:0.625rem;font-weight:650;
font-variant-numeric:tabular-nums;color:var(--vibeui-calendar-anim-002-muted);
}
[data-vibeui-block="calendar-anim-002"] [data-part="text"]{min-width:0}
[data-vibeui-block="calendar-anim-002"] [data-part="label"]{
display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="calendar-anim-002"] [data-part="place"]{
display:block;margin-top:0.0625rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.625rem;line-height:1.3;color:var(--vibeui-calendar-anim-002-muted);
}
@keyframes vibeui-calendar-anim-002-rise{
0%{opacity:0;transform:translateY(10px)}
10%{opacity:1;transform:translateY(0)}
88%{opacity:1;transform:translateY(0)}
100%{opacity:0;transform:translateY(-6px)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="calendar-anim-002"] [data-part="row"]{animation:none;opacity:1;transform:none}
}
`

const CATEGORY_LABELS: Record<number, string> = {
  1: "var(--vibeui-calendar-anim-002-cat-1)",
  2: "var(--vibeui-calendar-anim-002-cat-2)",
  3: "var(--vibeui-calendar-anim-002-cat-3)",
  4: "var(--vibeui-calendar-anim-002-cat-4)",
}

const DEFAULT_EVENTS: CalendarAnim002Event[] = [
  { time: "09:00", label: "Дейли-синк", place: "Zoom", category: 1 },
  {
    time: "11:30",
    label: "Ревью дизайна",
    place: "Переговорная 2",
    category: 2,
  },
  { time: "14:00", label: "Фокус-время", place: "Без звонков", category: 3 },
  {
    time: "16:30",
    label: "Созвон с клиентом",
    place: "Google Meet",
    category: 4,
  },
  { time: "18:00", label: "Итоги недели", place: "Слэк-тред", category: 1 },
]

/**
 * Повестка дня со списком событий и цветными полосками категорий.
 * Один файл, ноль зависимостей, собственная палитра. Строки дышат по
 * кругу: поднимаются снизу с растяжкой, держатся, уходят и повторяют.
 */
export function CalendarAnim002({
  title = "Сегодня",
  badge = `${DEFAULT_EVENTS.length}`,
  events = DEFAULT_EVENTS,
  accent,
  showPlace = true,
  loop = true,
  className,
  style,
  ...props
}: CalendarAnim002Props) {
  const palette = {
    ...(accent ? { "--vibeui-calendar-anim-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-anim-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-anim-002"
        data-slot="calendar-event-list"
        data-loop={loop ? "true" : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="gtitle">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <ol data-part="list">
            {events.map((event, index) => (
              <li
                data-part="row"
                key={`${event.time}-${event.label}`}
                style={
                  {
                    "--vibeui-calendar-anim-002-i": index,
                    ...(event.category
                      ? {
                          "--vibeui-calendar-anim-002-cat":
                            CATEGORY_LABELS[event.category],
                        }
                      : null),
                  } as CSSProperties
                }
              >
                <span data-part="time">{event.time}</span>
                <span data-part="text">
                  <span data-part="label">{event.label}</span>
                  {showPlace && event.place ? (
                    <span data-part="place">{event.place}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
