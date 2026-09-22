import type { CSSProperties } from "react"

import { Card025 } from "@/registry/components/card/card-025/card-025"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

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
const STYLES = `[data-vibeui-block="event-002"] [data-part="heading"]{margin-bottom:0.5rem}
[data-vibeui-block="event-002"] [data-part="cta"]{width:100%}

:where([data-vibeui-block="event-002"]){
--vibeui-event-002-bg:transparent;
--vibeui-event-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-event-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-event-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-event-002-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-event-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-event-002-on-accent:oklch(from var(--vibeui-event-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-event-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-event-002-dur-2:180ms;
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
[data-vibeui-block="event-002"] [data-part="body"]{padding:1.5rem}
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
            <Card025
              data-part="cover"
              src={image}
              alt=""
              ratio="21/9"
              radius="none"
              badge={badge}
              background={image ? undefined : "linear-gradient(140deg,light-dark(oklch(0.2 0 0),oklch(0.92 0 0)),oklch(0.42 0.14 28))"}
              accent={accent}
            />
            <div data-part="body">
              <Heading001
                data-part="heading"
                eyebrow={eyebrow}
                title={title}
                size="sm"
                accent={accent}
              />
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
              <Button016
                data-part="cta"
                label={ctaLabel}
                href={ctaHref}
                external={false}
                size="lg"
                tone="accent"
                accent={accent}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
