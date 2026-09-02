import type { CSSProperties } from "react"

export type Contact002Hours = {
  days: string
  time: string
}

export type Contact002Props = {
  eyebrow?: string
  title?: string
  address?: string
  addressNote?: string
  mapLabel?: string
  mapHref?: string
  mapCaption?: string
  pinLabel?: string
  phone?: string
  email?: string
  hours?: Contact002Hours[]
  routes?: string[]
  legal?: string
  /** Подписи блока: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница «где мы находимся» без внешней карты. Встроенный
// iframe с картой тянет чужие скрипты, куки и полкилобайта запросов ради
// картинки, которую всё равно открывают в приложении. Здесь стоит
// нарисованная CSS-заглушка с меткой и ссылка «открыть в картах» — ровно
// то действие, ради которого карту и смотрят.
//
// Заглушка помечена aria-hidden и не притворяется картой: рядом полный
// адрес текстом, а он и есть содержательная часть. Часы работы размечены
// таблицей: это данные в две колонки, и на скринридере они читаются парами
// «дни — время». Подсказка про вход и этаж стоит рядом с адресом, потому
// что теряются люди именно на последних тридцати метрах.
const STYLES = `
:where([data-vibeui-block="contact-002"]){
--vibeui-contact-002-bg:transparent;
--vibeui-contact-002-soft:light-dark(oklch(0.97 0.004 265),oklch(0.27 0.01 265));
--vibeui-contact-002-fg:light-dark(oklch(0.2 0.014 265),oklch(0.94 0.005 265));
--vibeui-contact-002-muted:light-dark(oklch(0.52 0.014 265),oklch(0.72 0.012 265));
--vibeui-contact-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-contact-002-accent:light-dark(oklch(0.53 0.18 25),oklch(0.75 0.15 30));
--vibeui-contact-002-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 30));
--vibeui-contact-002-chip:light-dark(oklch(1 0 0 / 92%),oklch(0.26 0.012 265 / 92%));
--vibeui-contact-002-shade:light-dark(oklch(0.2 0.014 265 / 28%),oklch(0 0 0 / 50%));
--vibeui-contact-002-land:light-dark(oklch(0.94 0.014 140),oklch(0.31 0.022 150));
--vibeui-contact-002-road:light-dark(oklch(0.99 0.002 265),oklch(0.4 0.008 265));
--vibeui-contact-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="contact-002"]{
background:var(--vibeui-contact-002-bg);color:var(--vibeui-contact-002-fg);
font-family:var(--vibeui-contact-002-sans);
}
[data-vibeui-block="contact-002"] *{box-sizing:border-box}
[data-vibeui-block="contact-002"] [data-part="frame"]{
max-width:72rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:1.75rem;align-items:start;
}
[data-vibeui-block="contact-002"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-contact-002-accent);
}
[data-vibeui-block="contact-002"] h2{
margin:0.5rem 0 0.875rem;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.5rem,3.6cqi,2.25rem);line-height:1.14;
}
[data-vibeui-block="contact-002"] [data-part="address"]{
margin:0;font-size:1.0625rem;line-height:1.5;font-weight:640;max-width:26ch;
}
/* Подсказка про вход рядом с адресом: теряются на последних метрах. */
[data-vibeui-block="contact-002"] [data-part="address-note"]{
margin:0.375rem 0 0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-contact-002-muted);max-width:34ch;
}
[data-vibeui-block="contact-002"] [data-part="links"]{display:flex;flex-wrap:wrap;gap:1.25rem;margin-top:1.125rem}
[data-vibeui-block="contact-002"] [data-part="link"]{display:grid;gap:0.125rem}
[data-vibeui-block="contact-002"] [data-part="key"]{
font-size:0.6875rem;font-weight:660;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-contact-002-muted);
}
[data-vibeui-block="contact-002"] [data-part="link"] a{
color:inherit;font-size:0.9375rem;font-weight:620;text-decoration:none;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-contact-002-accent) 45%,transparent);
justify-self:start;
}
[data-vibeui-block="contact-002"] [data-part="link"] a:hover{color:var(--vibeui-contact-002-accent)}
[data-vibeui-block="contact-002"] table{
width:100%;margin-top:1.375rem;border-collapse:collapse;font-size:0.875rem;
}
[data-vibeui-block="contact-002"] caption{
text-align:left;padding-bottom:0.4375rem;
font-size:0.6875rem;font-weight:660;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-contact-002-muted);
}
[data-vibeui-block="contact-002"] th,
[data-vibeui-block="contact-002"] td{
padding:0.4375rem 0;text-align:left;border-bottom:1px solid var(--vibeui-contact-002-border);
font-weight:500;
}
[data-vibeui-block="contact-002"] th{color:var(--vibeui-contact-002-muted);font-weight:500}
[data-vibeui-block="contact-002"] td{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="contact-002"] ul{list-style:none;margin:1.125rem 0 0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="contact-002"] li{
display:flex;gap:0.5rem;font-size:0.875rem;line-height:1.5;color:var(--vibeui-contact-002-muted);
}
[data-vibeui-block="contact-002"] li::before{
content:"";flex:none;width:0.5rem;height:0.5rem;margin-top:0.4375rem;border-radius:0.1875rem;
background:color-mix(in oklab,var(--vibeui-contact-002-accent) 35%,transparent);
}
[data-vibeui-block="contact-002"] [data-part="legal"]{
margin:1.25rem 0 0;padding-top:0.875rem;border-top:1px solid var(--vibeui-contact-002-border);
font-size:0.75rem;line-height:1.55;color:var(--vibeui-contact-002-muted);
}
[data-vibeui-block="contact-002"] figure{margin:0;display:grid;gap:0.5rem}
/* Заглушка карты нарисована CSS и не притворяется картой: адрес рядом текстом. */
[data-vibeui-block="contact-002"] [data-part="map"]{
position:relative;aspect-ratio:4 / 3;border-radius:1.125rem;overflow:hidden;
border:1px solid var(--vibeui-contact-002-border);
background:
repeating-linear-gradient(90deg,transparent 0 4.5rem,var(--vibeui-contact-002-road) 4.5rem 5.25rem),
repeating-linear-gradient(0deg,transparent 0 3.5rem,var(--vibeui-contact-002-road) 3.5rem 4.125rem),
linear-gradient(120deg,var(--vibeui-contact-002-land),var(--vibeui-contact-002-soft));
}
[data-vibeui-block="contact-002"] [data-part="highway"]{
position:absolute;left:-10%;right:-10%;top:52%;height:1.125rem;
background:var(--vibeui-contact-002-road);transform:rotate(-8deg);
}
[data-vibeui-block="contact-002"] [data-part="pin"]{
position:absolute;left:50%;top:46%;transform:translate(-50%,-100%);
display:grid;justify-items:center;gap:0.25rem;
}
[data-vibeui-block="contact-002"] [data-part="needle"]{
width:1.375rem;height:1.375rem;border-radius:9999px 9999px 9999px 0;
background:var(--vibeui-contact-002-accent);transform:rotate(-45deg);
box-shadow:0 2px 6px var(--vibeui-contact-002-shade);
}
[data-vibeui-block="contact-002"] [data-part="pin-label"]{
padding:0.125rem 0.5rem;border-radius:9999px;white-space:nowrap;
background:var(--vibeui-contact-002-chip);border:1px solid var(--vibeui-contact-002-border);
font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="contact-002"] figcaption{display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center}
[data-vibeui-block="contact-002"] [data-part="map-caption"]{
font-size:0.75rem;line-height:1.5;color:var(--vibeui-contact-002-muted);
}
[data-vibeui-block="contact-002"] [data-part="map-link"]{
display:inline-flex;align-items:center;gap:0.4375rem;flex:none;
height:2.375rem;padding:0 1rem;border-radius:0.6875rem;text-decoration:none;
background:var(--vibeui-contact-002-accent);color:var(--vibeui-contact-002-on-accent);
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="contact-002"] a:focus-visible{outline:2px solid var(--vibeui-contact-002-accent);outline-offset:2px;border-radius:0.25rem}
@container (min-width: 48rem){
[data-vibeui-block="contact-002"] [data-part="frame"]{padding:4rem 2rem;grid-template-columns:1fr 1fr;column-gap:3.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_HOURS: Contact002Hours[] = [
  { days: "Понедельник — четверг", time: "10:00 — 19:00" },
  { days: "Пятница", time: "10:00 — 17:00" },
  { days: "Суббота, воскресенье", time: "Выходной" },
]

const DEFAULT_ROUTES = [
  "Пять минут пешком от метро «Кузнецкий Мост»",
  "Парковка платная, по будням мест почти нет",
  "Курьеров принимаем на ресепшене до 18:30",
]

const LABELS: Record<string, string> = {
  phone: "Телефон",
  email: "Почта",
  hours: "Часы работы",
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
 * Контакты офиса: адрес, часы работы и нарисованная CSS-заглушка карты.
 * Один файл, ноль зависимостей и ни одного внешнего запроса.
 */
export function Contact002({
  eyebrow = "Офис",
  title = "Приезжайте, мы на месте",
  address = "Москва, Большая Дмитровка, 14, строение 2",
  addressNote = "Вход со двора, синяя дверь без вывески. Второй этаж, направо до конца коридора.",
  mapLabel = "Открыть в картах",
  mapHref = "#",
  mapCaption = "Схема нарисована стилями блока: внешняя карта не грузится и не ставит куки.",
  pinLabel = "Студия",
  phone = "+7 495 120-45-90",
  email = "office@studio.ru",
  hours = DEFAULT_HOURS,
  routes = DEFAULT_ROUTES,
  legal = "ООО «Студия», ИНН 7701234567, ОГРН 1157746000000. Юридический адрес совпадает с фактическим.",
  labels,
  background = "",
  accent,
  className,
  style,
}: Contact002Props) {
  const text = { ...LABELS, ...labels }
  const palette = {
    ...(accent ? { "--vibeui-contact-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contact-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-002"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <div>
            <span data-part="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p data-part="address">{address}</p>
            <p data-part="address-note">{addressNote}</p>

            <div data-part="links">
              <span data-part="link">
                <span data-part="key">{text.phone}</span>
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
              </span>
              <span data-part="link">
                <span data-part="key">{text.email}</span>
                <a href={`mailto:${email}`}>{email}</a>
              </span>
            </div>

            <table>
              <caption>{text.hours}</caption>
              <tbody>
                {hours.map((row) => (
                  <tr key={row.days}>
                    <th scope="row">{row.days}</th>
                    <td>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul>
              {routes.map((route) => (
                <li key={route}>{route}</li>
              ))}
            </ul>

            <p data-part="legal">{legal}</p>
          </div>

          <figure>
            <div data-part="map" aria-hidden="true">
              <span data-part="highway" />
              <span data-part="pin">
                <span data-part="pin-label">{pinLabel}</span>
                <span data-part="needle" />
              </span>
            </div>
            <figcaption>
              <a href={mapHref} data-part="map-link">
                {mapLabel}
              </a>
              <span data-part="map-caption">{mapCaption}</span>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
