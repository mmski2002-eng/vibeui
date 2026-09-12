import type { CSSProperties } from "react"

type Contact009Office = {
  city: string
  role: string
  time: string
  zone: string
  address: string
  note?: string
}

export type Contact009Props = {
  eyebrow?: string
  title?: string
  description?: string
  offices?: Contact009Office[]
  footNote?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Карточки офисов, где главный элемент — локальное время крупными
// табличными цифрами. Время статично и приходит пропсами: блок серверный и
// не тикает, зато честно подписывает часовой пояс — по нему читатель сам
// поймёт, рабочий ли сейчас час в этом городе.
const STYLES = `
:where([data-vibeui-block="contact-009"]){
--vibeui-contact-009-bg:transparent;
--vibeui-contact-009-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-009-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-009-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-009-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-009-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-contact-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-009"]{color-scheme:dark}
[data-vibeui-block="contact-009"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-009-bg);color:var(--vibeui-contact-009-ink);
font-family:var(--vibeui-contact-009-font);
}
[data-vibeui-block="contact-009"] [data-part="shell"]{max-width:70rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-009"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-contact-009-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="contact-009"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="contact-009"] [data-part="description"]{
margin:0.875rem 0 0;max-width:52ch;color:var(--vibeui-contact-009-muted);
font-size:1rem;line-height:1.6;
}
[data-vibeui-block="contact-009"] [data-part="grid"]{
display:grid;gap:1rem;margin:2rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="contact-009"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.375rem;
padding:1.5rem;border:1px solid var(--vibeui-contact-009-border);border-radius:1.125rem;
background:var(--vibeui-contact-009-card);
}
[data-vibeui-block="contact-009"] [data-part="role"]{
margin:0;color:var(--vibeui-contact-009-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="contact-009"] [data-part="city"]{
margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em;
}
[data-vibeui-block="contact-009"] [data-part="clock"]{
display:flex;align-items:baseline;gap:0.5rem;margin-top:0.5rem;
}
[data-vibeui-block="contact-009"] [data-part="time"]{
font-size:clamp(1.875rem,8cqi,2.5rem);line-height:1;font-weight:700;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="contact-009"] [data-part="zone"]{
padding:0.1875rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-contact-009-border);
color:var(--vibeui-contact-009-muted);font-size:0.6875rem;font-weight:650;white-space:nowrap;
}
[data-vibeui-block="contact-009"] [data-part="address"]{
margin:0.875rem 0 0;padding-top:0.875rem;
border-top:1px solid var(--vibeui-contact-009-border);
font-style:normal;font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="contact-009"] [data-part="note"]{
margin:0.25rem 0 0;color:var(--vibeui-contact-009-muted);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="contact-009"] [data-part="foot"]{
margin:1.25rem 0 0;color:var(--vibeui-contact-009-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 40rem){
[data-vibeui-block="contact-009"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-009"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 58rem){
[data-vibeui-block="contact-009"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OFFICES: Contact009Office[] = [
  {
    city: "Москва",
    role: "Штаб-квартира",
    time: "14:05",
    zone: "UTC+3",
    address: "Большая Дмитровка, 14, строение 2",
    note: "Приходите после 11:00 — утром команда на планировании.",
  },
  {
    city: "Берлин",
    role: "Дизайн и каталог",
    time: "13:05",
    zone: "UTC+2",
    address: "Rosenthaler Straße 40, Mitte",
    note: "Встречи по записи: коворкинг пускает гостей по списку.",
  },
  {
    city: "Сингапур",
    role: "Поддержка азиатских клиентов",
    time: "19:05",
    zone: "UTC+8",
    address: "8 Marina View, Asia Square Tower 1",
    note: "Вечер здесь — разгар дня в Москве: смены пересекаются.",
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

/** Карточки городов: локальное время крупно, часовой пояс и адрес офиса. */
export function Contact009({
  eyebrow = "Офисы",
  title = "Три города, одна команда",
  description = "Смотрите на местное время, прежде чем звонить: письмо дойдёт всегда, а звонок в ночную смену — нет.",
  offices = DEFAULT_OFFICES,
  footNote = "Время на карточках статично и задаётся в данных блока — это ориентир по поясам, а не живые часы.",
  background = "",
  accent,
  className,
  style,
}: Contact009Props) {
  const palette = {
    ...(accent ? { "--vibeui-contact-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contact-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <ul data-part="grid">
            {offices.map((office) => (
              <li key={office.city} data-part="card">
                <p data-part="role">{office.role}</p>
                <h3 data-part="city">{office.city}</h3>
                <p data-part="clock">
                  <span data-part="time">{office.time}</span>
                  <span data-part="zone">{office.zone}</span>
                </p>
                <address data-part="address">{office.address}</address>
                {office.note ? <p data-part="note">{office.note}</p> : null}
              </li>
            ))}
          </ul>
          <p data-part="foot">{footNote}</p>
        </div>
      </section>
    </>
  )
}
