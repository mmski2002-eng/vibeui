import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

type Event001Item = {
  day: string
  month: string
  title: string
  meta: string
  format: string
}

export type Event001Props = {
  eyebrow?: string
  title?: string
  events?: Event001Item[]
  ctaLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Афиша списком: строки событий с плашкой даты слева, названием и метаданными
// в центре, кнопкой записи справа. Плашка даты — число крупно и месяц под ним
// на тёплом фоне. Формат списка ближайших мероприятий; строка кликается
// целиком, кнопка дублирует действие визуально.
const STYLES = `[data-vibeui-block="event-001"] [data-part="heading"]{margin-bottom:2rem}
[data-vibeui-block="event-001"] [data-part="cta"]{grid-column:1 / -1;justify-self:start}

:where([data-vibeui-block="event-001"]){
--vibeui-event-001-bg:transparent;
--vibeui-event-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-event-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-event-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-event-001-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-event-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-event-001-on-accent:oklch(from var(--vibeui-event-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-event-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-event-001-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-001"]{color-scheme:dark}
[data-vibeui-block="event-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-event-001-bg);color:var(--vibeui-event-001-ink);
font-family:var(--vibeui-event-001-font);
}
[data-vibeui-block="event-001"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="event-001"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="event-001"] [data-part="row"]{
display:grid;grid-template-columns:auto 1fr;gap:1rem;align-items:center;
padding:1rem;border:1px solid var(--vibeui-event-001-border);border-radius:1rem;background:var(--vibeui-event-001-card);
}
[data-vibeui-block="event-001"] [data-part="date"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;
width:3.75rem;height:3.75rem;flex:none;border-radius:0.875rem;
background:color-mix(in oklab,var(--vibeui-event-001-accent) 14%,transparent);color:var(--vibeui-event-001-accent);
}
[data-vibeui-block="event-001"] [data-part="day"]{font-size:1.375rem;font-weight:750;line-height:1}
[data-vibeui-block="event-001"] [data-part="month"]{font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase}
[data-vibeui-block="event-001"] [data-part="info"]{min-width:0}
[data-vibeui-block="event-001"] [data-part="ev-title"]{margin:0;font-size:1.0625rem;font-weight:640;line-height:1.3}
[data-vibeui-block="event-001"] [data-part="ev-meta"]{margin:0.25rem 0 0;display:flex;flex-wrap:wrap;gap:0.5rem 0.875rem;font-size:0.8125rem;color:var(--vibeui-event-001-muted)}
[data-vibeui-block="event-001"] [data-part="format"]{color:var(--vibeui-event-001-accent);font-weight:600}
@container (min-width: 40rem){
[data-vibeui-block="event-001"] [data-part="cta"]{grid-column:auto;justify-self:end}
[data-vibeui-block="event-001"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="event-001"] [data-part="row"]{grid-template-columns:auto 1fr auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EVENTS: Event001Item[] = [
  {
    day: "18",
    month: "сен",
    title: "Вебинар: собираем лендинг за вечер",
    meta: "19:00 МСК · 45 мин",
    format: "Онлайн",
  },
  {
    day: "24",
    month: "сен",
    title: "Мастер-класс по Copy for AI",
    meta: "18:00 МСК · 90 мин",
    format: "Онлайн",
  },
  {
    day: "02",
    month: "окт",
    title: "Митап сообщества вайбкодеров",
    meta: "Москва · 3 часа",
    format: "Оффлайн",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Афиша списком: строки событий с плашкой даты и кнопкой записи. */
export function Event001({
  eyebrow = "События",
  title = "Ближайшие мероприятия",
  events = DEFAULT_EVENTS,
  ctaLabel = "Записаться",
  background = "",
  accent,
  className,
  style,
}: Event001Props) {
  const palette = {
    ...(accent ? { "--vibeui-event-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-event-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-event-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="event-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
          <ul data-part="list">
            {events.map((event) => (
              <li key={event.title} data-part="row">
                <span data-part="date">
                  <span data-part="day">{event.day}</span>
                  <span data-part="month">{event.month}</span>
                </span>
                <div data-part="info">
                  <p data-part="ev-title">{event.title}</p>
                  <p data-part="ev-meta">
                    <span data-part="format">{event.format}</span>
                    <span>{event.meta}</span>
                  </p>
                </div>
                <Button016
                  data-part="cta"
                  label={ctaLabel}
                  href="#"
                  external={false}
                  size="lg"
                  tone="accent"
                  accent={accent}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
