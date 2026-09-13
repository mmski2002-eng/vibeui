import type { CSSProperties, ReactNode } from "react"

type Contact014Hours = {
  days: string
  time: string
  closed?: boolean
}

type Contact014Channel = {
  label: string
  href: string
  icon: "chat" | "mail" | "phone"
  primary?: boolean
}

export type Contact014Props = {
  title?: string
  statusLabel?: string
  statusNote?: string
  hoursCaption?: string
  hours?: Contact014Hours[]
  channels?: Contact014Channel[]
  note?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Одна карточка поддержки: статус «онлайн» точкой, часы работы таблицей и
// кнопки каналов. Зелёный здесь семантический — это статус, а не декор.
// Часы размечены таблицей с заголовками строк: это данные в две колонки,
// и вслух они читаются парами «дни — время».
const STYLES = `
:where([data-vibeui-block="contact-014"]){
--vibeui-contact-014-bg:transparent;
--vibeui-contact-014-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-014-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-014-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-014-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-014-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-contact-014-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-contact-014-on-accent:oklch(from var(--vibeui-contact-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-014-online:light-dark(oklch(0.6 0.15 150),oklch(0.72 0.17 150));
--vibeui-contact-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contact-014-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-014"]{color-scheme:dark}
[data-vibeui-block="contact-014"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-014-bg);color:var(--vibeui-contact-014-ink);
font-family:var(--vibeui-contact-014-font);
}
[data-vibeui-block="contact-014"] [data-part="shell"]{max-width:70rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-014"] [data-part="card"]{
max-width:28rem;margin:0 auto;display:grid;gap:1.125rem;
padding:1.75rem;border:1px solid var(--vibeui-contact-014-border);border-radius:1.25rem;
background:var(--vibeui-contact-014-card);
}
[data-vibeui-block="contact-014"] [data-part="head"]{display:grid;gap:0.5rem}
[data-vibeui-block="contact-014"] [data-part="title"]{
margin:0;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="contact-014"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.4375rem;justify-self:start;
padding:0.3125rem 0.75rem;border-radius:999px;
border:1px solid color-mix(in oklab,var(--vibeui-contact-014-online) 40%,var(--vibeui-contact-014-border));
background:color-mix(in oklab,var(--vibeui-contact-014-online) 10%,var(--vibeui-contact-014-card));
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="contact-014"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:999px;flex:none;
background:var(--vibeui-contact-014-online);
animation:vibeui-contact-014-pulse 2.2s ease-out infinite;
}
@keyframes vibeui-contact-014-pulse{
0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-contact-014-online) 45%,transparent)}
70%{box-shadow:0 0 0 0.5rem transparent}
100%{box-shadow:0 0 0 0 transparent}
}
[data-vibeui-block="contact-014"] [data-part="statusnote"]{
margin:0;color:var(--vibeui-contact-014-muted);font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="contact-014"] [data-part="hours"]{
width:100%;border-collapse:collapse;font-size:0.875rem;
}
[data-vibeui-block="contact-014"] [data-part="hours"] caption{
text-align:left;padding-bottom:0.5rem;
color:var(--vibeui-contact-014-muted);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="contact-014"] [data-part="hours"] th{
text-align:left;font-weight:600;padding:0.4375rem 0;
border-top:1px solid var(--vibeui-contact-014-border);
}
[data-vibeui-block="contact-014"] [data-part="hours"] td{
text-align:right;padding:0.4375rem 0;font-variant-numeric:tabular-nums;
border-top:1px solid var(--vibeui-contact-014-border);
}
[data-vibeui-block="contact-014"] [data-part="hours"] [data-closed] td{color:var(--vibeui-contact-014-muted)}
[data-vibeui-block="contact-014"] [data-part="channels"]{display:grid;gap:0.625rem}
[data-vibeui-block="contact-014"] [data-part="channel"]{
display:flex;align-items:center;justify-content:center;gap:0.5rem;
padding:0.6875rem 1rem;border-radius:0.75rem;text-decoration:none;
border:1px solid var(--vibeui-contact-014-border);
color:inherit;font-size:0.9375rem;font-weight:650;
transition:border-color var(--vibeui-contact-014-dur-2) ease,filter var(--vibeui-contact-014-dur-2) ease;
}
[data-vibeui-block="contact-014"] [data-part="channel"] svg{width:1.125rem;height:1.125rem;flex:none}
[data-vibeui-block="contact-014"] [data-part="channel"]:hover{
border-color:color-mix(in oklab,var(--vibeui-contact-014-accent) 45%,var(--vibeui-contact-014-border));
}
[data-vibeui-block="contact-014"] [data-part="channel"][data-primary]{
border-color:var(--vibeui-contact-014-accent-fill);
background:var(--vibeui-contact-014-accent-fill);
color:var(--vibeui-contact-014-on-accent);
}
[data-vibeui-block="contact-014"] [data-part="channel"][data-primary]:hover{filter:brightness(1.06)}
[data-vibeui-block="contact-014"] [data-part="channel"]:focus-visible{
outline:2px solid var(--vibeui-contact-014-accent);outline-offset:3px;
}
[data-vibeui-block="contact-014"] [data-part="note"]{
margin:0;color:var(--vibeui-contact-014-muted);font-size:0.8125rem;line-height:1.5;text-align:center;
}
@container (min-width: 40rem){
[data-vibeui-block="contact-014"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-014"] [data-part="card"]{padding:2rem}
[data-vibeui-block="contact-014"] [data-part="channels"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-014"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<Contact014Channel["icon"], ReactNode> = {
  chat: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.6-.3-3.7-.8L3 21l1.8-5.8A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  ),
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  ),
}

const DEFAULT_HOURS: Contact014Hours[] = [
  { days: "Понедельник — пятница", time: "10:00 — 19:00" },
  { days: "Суббота", time: "11:00 — 16:00" },
  { days: "Воскресенье", time: "Выходной", closed: true },
]

const DEFAULT_CHANNELS: Contact014Channel[] = [
  { label: "Чат", href: "#chat", icon: "chat", primary: true },
  { label: "Почта", href: "mailto:help@vibeui.ru", icon: "mail" },
  { label: "Звонок", href: "tel:+74951204590", icon: "phone" },
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

/** Карточка поддержки: статус онлайн, часы работы таблицей, кнопки каналов. */
export function Contact014({
  title = "Поддержка VibeUI",
  statusLabel = "Сейчас онлайн",
  statusNote = "Среднее время первого ответа в чате — 10 минут. Статус задаётся данными блока, а не проверкой смены.",
  hoursCaption = "Часы работы",
  hours = DEFAULT_HOURS,
  channels = DEFAULT_CHANNELS,
  note = "Вне смены чат принимает сообщения: утром они разбираются первыми.",
  background = "",
  accent,
  className,
  style,
}: Contact014Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-contact-014-accent": accent,
          "--vibeui-contact-014-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-contact-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <div data-part="head">
              <h2 data-part="title">{title}</h2>
              <p data-part="status">
                <span data-part="dot" aria-hidden="true" />
                {statusLabel}
              </p>
              <p data-part="statusnote">{statusNote}</p>
            </div>
            <table data-part="hours">
              <caption>{hoursCaption}</caption>
              <tbody>
                {hours.map((row) => (
                  <tr key={row.days} data-closed={row.closed ? "" : undefined}>
                    <th scope="row">{row.days}</th>
                    <td>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div data-part="channels">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  data-part="channel"
                  data-primary={channel.primary ? "" : undefined}
                  href={channel.href}
                >
                  {ICONS[channel.icon]}
                  {channel.label}
                </a>
              ))}
            </div>
            <p data-part="note">{note}</p>
          </div>
        </div>
      </section>
    </>
  )
}
