import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Event003Item = {
  title: string
  date: string
  format: string
  spots: string
}

export type Event003Props = {
  eyebrow?: string
  title?: string
  events?: Event003Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сетка предстоящих событий карточками: тёплая полоса-акцент сверху, дата,
// название, формат и остаток мест. Три колонки на широком экране. Формат
// компактной афиши на несколько мероприятий, где важны дата и наличие мест,
// а не обложка.
const STYLES = `[data-vibeui-block="event-003"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="event-003"]){
--vibeui-event-003-bg:transparent;
--vibeui-event-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-event-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-event-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-event-003-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-event-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-event-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-event-003-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-003"]{color-scheme:dark}
[data-vibeui-block="event-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-event-003-bg);color:var(--vibeui-event-003-ink);
font-family:var(--vibeui-event-003-font);
}
[data-vibeui-block="event-003"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="event-003"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="event-003"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;overflow:hidden;text-decoration:none;color:inherit;
border:1px solid var(--vibeui-event-003-border);border-radius:1rem;background:var(--vibeui-event-003-card);
transition:transform var(--vibeui-event-003-dur-2) ease,border-color var(--vibeui-event-003-dur-2) ease;
}
[data-vibeui-block="event-003"] [data-part="card"]:hover{transform:translateY(-3px);border-color:var(--vibeui-event-003-accent)}
[data-vibeui-block="event-003"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-event-003-accent);outline-offset:2px}
[data-vibeui-block="event-003"] [data-part="bar"]{height:0.375rem;background:linear-gradient(90deg,light-dark(oklch(0.2 0 0),oklch(0.92 0 0)),oklch(0.5 0.15 25))}
[data-vibeui-block="event-003"] [data-part="body"]{display:flex;flex-direction:column;gap:0.5rem;padding:1.25rem;flex:1}
[data-vibeui-block="event-003"] [data-part="date"]{font-size:0.8125rem;font-weight:700;color:var(--vibeui-event-003-accent);letter-spacing:0.02em}
[data-vibeui-block="event-003"] [data-part="ev-title"]{margin:0;font-size:1.0625rem;font-weight:640;line-height:1.3;flex:1}
[data-vibeui-block="event-003"] [data-part="foot"]{display:flex;flex-wrap:wrap;justify-content:space-between;gap:0.5rem;font-size:0.8125rem;color:var(--vibeui-event-003-muted)}
[data-vibeui-block="event-003"] [data-part="spots"]{color:var(--vibeui-event-003-accent);font-weight:600}
@container (min-width: 44rem){
[data-vibeui-block="event-003"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="event-003"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EVENTS: Event003Item[] = [
  {
    title: "Вебинар: лендинг за вечер",
    date: "18 сентября",
    format: "Онлайн",
    spots: "Свободно 40 мест",
  },
  {
    title: "Воркшоп по Copy for AI",
    date: "24 сентября",
    format: "Онлайн",
    spots: "Свободно 12 мест",
  },
  {
    title: "Митап вайбкодеров",
    date: "2 октября",
    format: "Москва",
    spots: "Свободно 8 мест",
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

/** Сетка предстоящих событий карточками с датой и остатком мест. */
export function Event003({
  eyebrow = "События",
  title = "Расписание на месяц",
  events = DEFAULT_EVENTS,
  background = "",
  accent,
  className,
  style,
}: Event003Props) {
  const palette = {
    ...(accent ? { "--vibeui-event-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-event-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-event-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="event-003"
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
          <div data-part="grid">
            {events.map((event) => (
              <a key={event.title} href="#" data-part="card">
                <span data-part="bar" aria-hidden="true" />
                <span data-part="body">
                  <span data-part="date">{event.date}</span>
                  <span data-part="ev-title">{event.title}</span>
                  <span data-part="foot">
                    <span>{event.format}</span>
                    <span data-part="spots">{event.spots}</span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
