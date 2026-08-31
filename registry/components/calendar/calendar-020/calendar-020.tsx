import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar020Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  /** Дедлайн строкой без часового пояса: 2026-04-01T18:00. */
  deadline?: string
  /** Опорный «сейчас» строкой: сервер и клиент обязаны посчитать одинаково. */
  now?: string
  startedAt?: string
  heading?: string
  locale?: string
  accent?: string
}

// Идея компонента: остаток до дедлайна словами, а не таймером «17:23:04».
// Секунды на экране требуют клиентского тика и гидрации; для срока в неделях
// они бесполезны. Кольцо показывает, сколько срока уже прошло, — процент
// «сгоревшего» времени пугает точнее, чем оставшиеся дни сами по себе.
const STYLES = `
:where([data-vibeui-block="calendar-020"]){
--vibeui-calendar-020-bg:oklch(1 0 0);
--vibeui-calendar-020-fg:oklch(0.24 0.014 265);
--vibeui-calendar-020-muted:oklch(0.62 0.014 265);
--vibeui-calendar-020-border:oklch(0.91 0.006 265);
--vibeui-calendar-020-track:oklch(0.94 0.005 265);
--vibeui-calendar-020-accent:oklch(0.55 0.16 265);
--vibeui-calendar-020-warn:oklch(0.65 0.16 70);
--vibeui-calendar-020-late:oklch(0.55 0.18 25);
--vibeui-calendar-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-020"]{
display:flex;align-items:center;gap:1rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-020-bg);
border:1px solid var(--vibeui-calendar-020-border);border-radius:1rem;
color:var(--vibeui-calendar-020-fg);font-family:var(--vibeui-calendar-020-font);
}
[data-vibeui-block="calendar-020"][data-tone="warn"]{--vibeui-calendar-020-accent:var(--vibeui-calendar-020-warn)}
[data-vibeui-block="calendar-020"][data-tone="late"]{--vibeui-calendar-020-accent:var(--vibeui-calendar-020-late)}
[data-vibeui-block="calendar-020"] [data-part="ring"]{
position:relative;flex:none;width:5.25rem;height:5.25rem;
display:flex;align-items:center;justify-content:center;
}
/* Дырку в кольце делает маска на отдельном слое, а не кружок-заглушка:
   заглушка обязана совпасть с фоном карточки, а маска работает на любой
   подложке — и не съедает подпись, которая лежит выше слоя. */
[data-vibeui-block="calendar-020"] [data-part="dial"]{
position:absolute;inset:0;border-radius:50%;
background:conic-gradient(var(--vibeui-calendar-020-accent) calc(var(--vibeui-calendar-020-progress,0) * 1%),var(--vibeui-calendar-020-track) 0);
mask-image:radial-gradient(circle,transparent 62%,#000 63%);
}
[data-vibeui-block="calendar-020"] [data-part="ring"] b{
position:relative;font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-calendar-020-fg);
}
[data-vibeui-block="calendar-020"] [data-part="body"]{min-width:0;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="calendar-020"] [data-part="heading"]{
margin:0;font-size:0.75rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-calendar-020-muted);
}
[data-vibeui-block="calendar-020"] [data-part="left"]{
margin:0;font-size:1.375rem;font-weight:700;line-height:1.15;letter-spacing:-0.02em;
color:var(--vibeui-calendar-020-accent);
}
[data-vibeui-block="calendar-020"] [data-part="when"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-calendar-020-muted);
}
[data-vibeui-block="calendar-020"] [data-part="when"] time{color:var(--vibeui-calendar-020-fg);font-weight:600}
[data-vibeui-block="calendar-020"] [data-part="bar"]{
height:0.25rem;border-radius:0.125rem;margin-top:0.1875rem;overflow:hidden;
background:var(--vibeui-calendar-020-track);
}
[data-vibeui-block="calendar-020"] [data-part="bar"] i{
display:block;height:100%;border-radius:inherit;
width:calc(var(--vibeui-calendar-020-progress,0) * 1%);
background:var(--vibeui-calendar-020-accent);
transition:width .3s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-020"] *{animation:none!important;transition:none!important}}
`

const MINUTE = 60000
const HOUR = 3600000
const DAY = 86400000

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) {
    return forms[2]
  }

  if (ones === 1) {
    return forms[0]
  }

  if (ones > 1 && ones < 5) {
    return forms[1]
  }

  return forms[2]
}

function humanize(span: number) {
  const days = Math.floor(span / DAY)
  const hours = Math.floor((span % DAY) / HOUR)
  const minutes = Math.floor((span % HOUR) / MINUTE)

  if (days > 0) {
    const head = `${days} ${pluralize(days, ["день", "дня", "дней"])}`

    return hours > 0
      ? `${head} ${hours} ${pluralize(hours, ["час", "часа", "часов"])}`
      : head
  }

  if (hours > 0) {
    return `${hours} ${pluralize(hours, ["час", "часа", "часов"])} ${minutes} ${pluralize(minutes, ["минута", "минуты", "минут"])}`
  }

  return `${minutes} ${pluralize(minutes, ["минута", "минуты", "минут"])}`
}

/**
 * Дедлайн-карточка: остаток словами, кольцо прогресса и дата сдачи.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar020({
  deadline = "2026-04-01T18:00",
  now = "2026-03-14T09:30",
  startedAt = "2026-02-20T10:00",
  heading = "Сдача макетов",
  locale = "ru-RU",
  accent,
  className,
  style,
  ...props
}: Calendar020Props) {
  const target = new Date(deadline)
  const current = new Date(now)
  const started = new Date(startedAt)

  const span = target.getTime() - current.getTime()
  const whole = Math.max(1, target.getTime() - started.getTime())
  const progress = Math.min(
    100,
    Math.max(0, Math.round(((whole - span) / whole) * 100)),
  )

  const late = span <= 0
  const tone = late ? "late" : span < 3 * DAY ? "warn" : "calm"

  const stamp = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(target)

  const palette = {
    "--vibeui-calendar-020-progress": progress,
    ...(accent ? { "--vibeui-calendar-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-020" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="calendar-020"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <div data-part="ring" aria-hidden="true">
          <span data-part="dial" />
          <b>{progress}%</b>
        </div>
        <div data-part="body">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="left">
            {late
              ? `Просрочено на ${humanize(-span)}`
              : `Осталось ${humanize(span)}`}
          </p>
          <p data-part="when">
            Срок: <time dateTime={deadline}>{stamp}</time>
          </p>
          <div data-part="bar" aria-hidden="true">
            <i />
          </div>
        </div>
      </article>
    </>
  )
}
