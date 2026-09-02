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
  /** Формы единиц времени: ключ «day.one», «hour.few» и так далее. {count} подставляется. */
  unitsText?: Record<string, string>
  /** Строка остатка. {span} подставляется. */
  remainingText?: string
  /** Строка просрочки. {span} подставляется. */
  overdueText?: string
  /** Строка срока. {value} подставляется датой в теге time. */
  dueText?: string
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: остаток до дедлайна словами, а не таймером «17:23:04».
// Секунды на экране требуют клиентского тика и гидрации; для срока в неделях
// они бесполезны. Кольцо показывает, сколько срока уже прошло, — процент
// «сгоревшего» времени пугает точнее, чем оставшиеся дни сами по себе.
const STYLES = `
:where([data-vibeui-block="calendar-020"]){
--vibeui-calendar-020-bg:transparent;
--vibeui-calendar-020-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-calendar-020-muted:light-dark(oklch(0.62 0.014 265),oklch(0.67 0.013 265));
--vibeui-calendar-020-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-calendar-020-track:light-dark(oklch(0.94 0.005 265),oklch(0.3 0.011 265));
--vibeui-calendar-020-accent:light-dark(oklch(0.55 0.16 265),oklch(0.73 0.14 265));
--vibeui-calendar-020-warn:light-dark(oklch(0.65 0.16 70),oklch(0.78 0.14 70));
--vibeui-calendar-020-late:light-dark(oklch(0.55 0.18 25),oklch(0.74 0.15 25));
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

const DEFAULT_UNITS_TEXT: Record<string, string> = {
  "day.one": "{count} день",
  "day.few": "{count} дня",
  "day.many": "{count} дней",
  "day.other": "{count} дней",
  "hour.one": "{count} час",
  "hour.few": "{count} часа",
  "hour.many": "{count} часов",
  "hour.other": "{count} часов",
  "minute.one": "{count} минута",
  "minute.few": "{count} минуты",
  "minute.many": "{count} минут",
  "minute.other": "{count} минут",
}

function fillText(template: string, values: Record<string, string | number>) {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key) => `${values[key] ?? match}`,
  )
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Дедлайн-карточка: остаток словами, кольцо прогресса и дата сдачи.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar020({
  deadline = "2026-04-01T18:00",
  now = "2026-03-14T09:30",
  startedAt = "2026-02-20T10:00",
  heading = "Сдача макетов",
  unitsText = DEFAULT_UNITS_TEXT,
  remainingText = "Осталось {span}",
  overdueText = "Просрочено на {span}",
  dueText = "Срок: {value}",
  locale = "ru-RU",
  accent,
  background = "",
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

  // Формы единиц выбираются по правилам самого языка, а не по русским:
  // словарь приходит пропсом, а категорию называет Intl.
  const plural = new Intl.PluralRules(locale)
  const unit = (name: string, count: number) =>
    fillText(
      unitsText[`${name}.${plural.select(count)}`] ??
        unitsText[`${name}.other`] ??
        DEFAULT_UNITS_TEXT[`${name}.other`],
      { count },
    )

  const humanize = (value: number) => {
    const days = Math.floor(value / DAY)
    const hours = Math.floor((value % DAY) / HOUR)
    const minutes = Math.floor((value % HOUR) / MINUTE)

    if (days > 0) {
      return hours > 0
        ? `${unit("day", days)} ${unit("hour", hours)}`
        : unit("day", days)
    }

    if (hours > 0) {
      return `${unit("hour", hours)} ${unit("minute", minutes)}`
    }

    return unit("minute", minutes)
  }

  const [dueBefore, dueAfter = ""] = dueText.split("{value}")

  const palette = {
    "--vibeui-calendar-020-progress": progress,
    ...(accent ? { "--vibeui-calendar-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
              ? fillText(overdueText, { span: humanize(-span) })
              : fillText(remainingText, { span: humanize(span) })}
          </p>
          <p data-part="when">
            {dueBefore}
            <time dateTime={deadline}>{stamp}</time>
            {dueAfter}
          </p>
          <div data-part="bar" aria-hidden="true">
            <i />
          </div>
        </div>
      </article>
    </>
  )
}
