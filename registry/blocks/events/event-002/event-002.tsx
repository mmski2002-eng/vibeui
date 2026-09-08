import type { CSSProperties } from "react"

export type Event002Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  eyebrow?: string
  badge?: string
  title?: string
  summary?: string
  dateLabel?: string
  timeLabel?: string
  placeLabel?: string
  priceLabel?: string
  speakers?: string[]
  ctaLabel?: string
  ctaHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Карточка одного события: тёплая обложка-градиент с бейджем, под ней
// заголовок, описание, строка деталей (дата, время, место, цена) и список
// спикеров инициалами, кнопка записи. Формат страницы отдельного мероприятия
// или конференции, куда ведёт афиша.
const STYLES = `
:where([data-vibeui-block="event-002"]){
--vibeui-event-002-bg:transparent;
--vibeui-event-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-event-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-event-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-event-002-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-event-002-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-event-002-on-accent:oklch(0.15 0.02 39.8);
--vibeui-event-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-002"]{color-scheme:dark}
[data-vibeui-block="event-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-event-002-bg);color:var(--vibeui-event-002-ink);
font-family:var(--vibeui-event-002-font);
}
[data-vibeui-block="event-002"] [data-part="shell"]{max-width:40rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="event-002"] [data-part="card"]{border:1px solid var(--vibeui-event-002-border);border-radius:1.25rem;overflow:hidden;background:var(--vibeui-event-002-card)}
[data-vibeui-block="event-002"] [data-part="cover"]{
position:relative;aspect-ratio:21 / 9;display:flex;align-items:flex-start;padding:1.25rem;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="event-002"] [data-part="cover"][data-empty="true"]{background:linear-gradient(140deg,oklch(0.62 0.19 39.8),oklch(0.42 0.14 28));}
[data-vibeui-block="event-002"] [data-part="cover"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="event-002"] [data-part="badge"]{
padding:0.25rem 0.75rem;border-radius:999px;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
background:oklch(0.15 0.02 39.8 / 55%);color:oklch(0.98 0 0);
}
[data-vibeui-block="event-002"] [data-part="body"]{padding:1.5rem}
[data-vibeui-block="event-002"] [data-part="eyebrow"]{margin:0 0 0.375rem;color:var(--vibeui-event-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase}
[data-vibeui-block="event-002"] [data-part="title"]{margin:0 0 0.5rem;font-size:clamp(1.375rem,4.5cqi,1.875rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700}
[data-vibeui-block="event-002"] [data-part="summary"]{margin:0 0 1.25rem;color:var(--vibeui-event-002-muted);font-size:0.9375rem;line-height:1.55}
[data-vibeui-block="event-002"] [data-part="facts"]{list-style:none;margin:0 0 1.25rem;padding:0;display:grid;gap:0.5rem;grid-template-columns:1fr 1fr}
[data-vibeui-block="event-002"] [data-part="fact"]{display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="event-002"] [data-part="fact-label"]{font-size:0.6875rem;font-weight:600;letter-spacing:0.02em;text-transform:uppercase;color:var(--vibeui-event-002-muted)}
[data-vibeui-block="event-002"] [data-part="fact-value"]{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="event-002"] [data-part="speakers"]{display:flex;align-items:center;gap:0.5rem;margin-bottom:1.25rem}
[data-vibeui-block="event-002"] [data-part="avatar"]{
width:2rem;height:2rem;border-radius:999px;flex:none;display:grid;place-items:center;
font-size:0.6875rem;font-weight:700;
background:color-mix(in oklab,var(--vibeui-event-002-accent) 16%,var(--vibeui-event-002-card));color:var(--vibeui-event-002-accent);
margin-left:-0.5rem;box-shadow:0 0 0 2px var(--vibeui-event-002-card);
}
[data-vibeui-block="event-002"] [data-part="avatar"]:first-child{margin-left:0}
[data-vibeui-block="event-002"] [data-part="speakers-note"]{font-size:0.8125rem;color:var(--vibeui-event-002-muted)}
[data-vibeui-block="event-002"] [data-part="cta"]{
display:inline-flex;align-items:center;justify-content:center;width:100%;height:2.875rem;border-radius:0.75rem;
background:var(--vibeui-event-002-accent);color:var(--vibeui-event-002-on-accent);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease;
}
[data-vibeui-block="event-002"] [data-part="cta"]:hover{opacity:.9}
[data-vibeui-block="event-002"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-event-002-accent);outline-offset:3px}
@container (min-width: 36rem){[data-vibeui-block="event-002"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SPEAKERS = ["Анна Ковалёва", "Игорь Демидов", "Пётр Ляхов"]

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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Карточка одного события: обложка с бейджем, детали, спикеры, запись. */
export function Event002({
  eyebrow = "Конференция",
  image = "",
  badge = "Открыта регистрация",
  title = "VibeConf: интерфейсы для вайбкодинга",
  summary = "Однодневная конференция о том, как собирать сайты вместе с ИИ-агентами: доклады, воркшопы и живые сборки на сцене.",
  dateLabel = "12 октября 2026",
  timeLabel = "10:00–18:00",
  placeLabel = "Москва + онлайн",
  priceLabel = "Бесплатно",
  speakers = DEFAULT_SPEAKERS,
  ctaLabel = "Зарегистрироваться",
  ctaHref = "#",
  background = "",
  accent,
  className,
  style,
}: Event002Props) {
  const palette = {
    ...(accent ? { "--vibeui-event-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-event-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-event-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="event-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <div data-part="cover" data-empty={image ? undefined : "true"}>
              {image ? (
                <img src={image} alt="" loading="lazy" decoding="async" />
              ) : null}
              <span data-part="badge">{badge}</span>
            </div>
            <div data-part="body">
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">{title}</h2>
              <p data-part="summary">{summary}</p>
              <ul data-part="facts">
                <li data-part="fact">
                  <span data-part="fact-label">Дата</span>
                  <span data-part="fact-value">{dateLabel}</span>
                </li>
                <li data-part="fact">
                  <span data-part="fact-label">Время</span>
                  <span data-part="fact-value">{timeLabel}</span>
                </li>
                <li data-part="fact">
                  <span data-part="fact-label">Место</span>
                  <span data-part="fact-value">{placeLabel}</span>
                </li>
                <li data-part="fact">
                  <span data-part="fact-label">Участие</span>
                  <span data-part="fact-value">{priceLabel}</span>
                </li>
              </ul>
              <div data-part="speakers">
                {speakers.slice(0, 3).map((speaker) => (
                  <span key={speaker} data-part="avatar" aria-hidden="true">
                    {initials(speaker)}
                  </span>
                ))}
                <span data-part="speakers-note">
                  {speakers.length} спикеров
                </span>
              </div>
              <a href={ctaHref} data-part="cta">
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
