import type { ComponentProps, CSSProperties } from "react"

export type Eventcalendar006Slot = {
  time: string
  /** Занятый слот показывается, но не выбирается: сетка не должна «дышать». */
  taken?: boolean
}

export type Eventcalendar006Group = {
  /** Заголовок части дня: утро, день, вечер. */
  label: string
  slots: Eventcalendar006Slot[]
}

export type Eventcalendar006Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  heading?: string
  /** Дата над сеткой: её выбирают в другом месте, здесь только показывают. */
  dateLabel?: string
  groups?: Eventcalendar006Group[]
  /** Выбранное время. Должно совпадать с одним из слотов. */
  selected?: string
  /** Пояснение под сеткой: {free} и {total} подставляются. */
  summaryTemplate?: string
  /** Подпись занятого слота для диктора. */
  takenLabel?: string
  /** Часовой пояс строкой: без него время неоднозначно. */
  zoneLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: выбор времени приёма. Занятые слоты остаются на месте
// вычеркнутыми, а не исчезают: сетка, которая «дышит» при каждом обновлении,
// заставляет заново искать глазами нужный час, и по ней не видно, насколько
// день вообще занят.
//
// Слоты — радиогруппа в собственной форме: выбирают один из вариантов, а не
// выполняют команду, и две такие сетки на странице не сольются в одну группу.
const STYLES = `
:where([data-vibeui-block="eventcalendar-006"]){
--vibeui-eventcalendar-006-bg:transparent;
--vibeui-eventcalendar-006-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-eventcalendar-006-muted:color-mix(in oklab,var(--vibeui-eventcalendar-006-fg) 64%,transparent);
--vibeui-eventcalendar-006-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-eventcalendar-006-surface:light-dark(oklch(0.98 0.003 265),oklch(0.28 0.011 265));
--vibeui-eventcalendar-006-accent:light-dark(oklch(0.52 0.19 262),oklch(0.74 0.15 262));
--vibeui-eventcalendar-006-on-accent:oklch(from var(--vibeui-eventcalendar-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-eventcalendar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="eventcalendar-006"]{color-scheme:dark}
[data-vibeui-block="eventcalendar-006"]{
width:100%;max-width:26rem;box-sizing:border-box;
display:flex;flex-direction:column;gap:0.75rem;
background:var(--vibeui-eventcalendar-006-bg);
color:var(--vibeui-eventcalendar-006-fg);
font-family:var(--vibeui-eventcalendar-006-font);
}
[data-vibeui-block="eventcalendar-006"] *{box-sizing:border-box}
[data-vibeui-block="eventcalendar-006"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="eventcalendar-006"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:680;letter-spacing:-0.01em;
}
[data-vibeui-block="eventcalendar-006"] [data-part="date"]{
font-size:0.8125rem;color:var(--vibeui-eventcalendar-006-muted);
}
[data-vibeui-block="eventcalendar-006"] form{display:contents}
[data-vibeui-block="eventcalendar-006"] [data-part="group"]{
border:0;margin:0;padding:0;min-inline-size:0;
display:flex;flex-direction:column;gap:0.75rem;
}
[data-vibeui-block="eventcalendar-006"] [data-part="part"]{
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="eventcalendar-006"] [data-part="part-label"]{
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-eventcalendar-006-muted);
}
/* Сетка сама решает, сколько слотов помещается: auto-fill с минимальной
   шириной ячейки переживает и узкую колонку, и широкую карточку. */
[data-vibeui-block="eventcalendar-006"] [data-part="slots"]{
display:grid;gap:0.375rem;
grid-template-columns:repeat(auto-fill,minmax(4.25rem,1fr));
}
[data-vibeui-block="eventcalendar-006"] [data-part="slot"]{
position:relative;
display:flex;align-items:center;justify-content:center;
min-block-size:2.25rem;padding:0.3125rem 0.5rem;
border:1px solid var(--vibeui-eventcalendar-006-border);border-radius:0.5rem;
background:var(--vibeui-eventcalendar-006-surface);
font-size:0.8125rem;font-weight:600;font-variant-numeric:tabular-nums;
cursor:pointer;
transition:border-color .14s ease,background-color .14s ease,color .14s ease;
}
[data-vibeui-block="eventcalendar-006"] [data-part="slot"] input{
position:absolute;inline-size:1px;block-size:1px;opacity:0;pointer-events:none;
}
[data-vibeui-block="eventcalendar-006"] [data-part="slot"]:hover{
border-color:var(--vibeui-eventcalendar-006-accent);
}
[data-vibeui-block="eventcalendar-006"] [data-part="slot"]:has(input:focus-visible){
outline:2px solid var(--vibeui-eventcalendar-006-accent);outline-offset:2px;
}
[data-vibeui-block="eventcalendar-006"] [data-part="slot"]:has(input:checked){
background:var(--vibeui-eventcalendar-006-accent);
border-color:var(--vibeui-eventcalendar-006-accent);
color:var(--vibeui-eventcalendar-006-on-accent);
}
/* Занятый слот остаётся на месте: сетка не должна перестраиваться от того,
   что кто-то записался, иначе нужный час приходится искать заново. */
[data-vibeui-block="eventcalendar-006"] [data-part="slot"][data-taken="true"]{
cursor:not-allowed;color:var(--vibeui-eventcalendar-006-muted);
background:transparent;border-style:dashed;
text-decoration:line-through;
}
[data-vibeui-block="eventcalendar-006"] [data-part="slot"][data-taken="true"]:hover{
border-color:var(--vibeui-eventcalendar-006-border);
}
[data-vibeui-block="eventcalendar-006"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;justify-content:space-between;
margin:0;font-size:0.75rem;color:var(--vibeui-eventcalendar-006-muted);
}
[data-vibeui-block="eventcalendar-006"] [data-part="reader"]{
position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="eventcalendar-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Eventcalendar006Group[] = [
  {
    label: "Утро",
    slots: [
      { time: "09:00", taken: true },
      { time: "09:30" },
      { time: "10:00" },
      { time: "10:30", taken: true },
      { time: "11:00" },
      { time: "11:30" },
    ],
  },
  {
    label: "День",
    slots: [
      { time: "13:00" },
      { time: "13:30", taken: true },
      { time: "14:00", taken: true },
      { time: "14:30" },
      { time: "15:00" },
      { time: "15:30" },
    ],
  },
  {
    label: "Вечер",
    slots: [
      { time: "17:00" },
      { time: "17:30" },
      { time: "18:00", taken: true },
      { time: "18:30" },
    ],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Выбор времени приёма: слоты сеткой, занятые остаются вычеркнутыми.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Eventcalendar006({
  heading = "Выберите время",
  dateLabel = "Четверг, 17 июля",
  groups = DEFAULT_GROUPS,
  selected = "14:30",
  summaryTemplate = "Свободно {free} из {total} слотов",
  takenLabel = "занято",
  zoneLabel = "Время московское",
  accent,
  background = "",
  className,
  style,
  id = "vibeui-eventcalendar-006",
  ...props
}: Eventcalendar006Props) {
  const slots = groups.flatMap((group) => group.slots)
  const free = slots.filter((slot) => !slot.taken).length
  // Имя группы своё на каждый экземпляр: радиокнопки объединяются по владельцу
  // формы и имени, иначе две сетки на странице стали бы одной группой.
  const group = `${id}-slot`

  const palette = {
    ...(accent ? { "--vibeui-eventcalendar-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-eventcalendar-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-eventcalendar-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        id={id}
        data-slot="event-calendar"
        data-vibeui-block="eventcalendar-006"
        className={className}
        style={palette}
        aria-label={heading}
      >
        <div data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <span data-part="date">{dateLabel}</span>
        </div>
        <form>
          <fieldset data-part="group">
            <legend data-part="reader">{heading}</legend>
            {groups.map((part) => (
              <div key={part.label} data-part="part">
                <span data-part="part-label">{part.label}</span>
                <div data-part="slots">
                  {part.slots.map((slot) => (
                    <label
                      key={slot.time}
                      data-part="slot"
                      data-taken={slot.taken || undefined}
                    >
                      <input
                        type="radio"
                        name={group}
                        value={slot.time}
                        defaultChecked={slot.time === selected}
                        disabled={slot.taken}
                      />
                      {slot.time}
                      {slot.taken ? (
                        <span data-part="reader">{takenLabel}</span>
                      ) : null}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        </form>
        <p data-part="foot">
          <span>
            {fillTemplate(summaryTemplate, { free, total: slots.length })}
          </span>
          <span>{zoneLabel}</span>
        </p>
      </section>
    </>
  )
}
