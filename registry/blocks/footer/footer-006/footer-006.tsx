import type { CSSProperties } from "react"

type Footer006Contact = {
  label: string
  value: string
  href: string
}

type Footer006Social = {
  label: string
  short: string
  href: string
}

export type Footer006Props = {
  brand?: string
  address?: string
  hours?: string
  contacts?: Footer006Contact[]
  socials?: Footer006Social[]
  legal?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал с контактами и соцсетями. Телефон и почта — настоящие ссылки
// tel: и mailto: с видимым значением: подвал чаще всего открывают именно
// ради них, и «Связаться с нами» вместо номера отнимает лишний шаг.
// Значки соцсетей — буквенные плашки, чтобы блок не тянул иконочный набор.
const STYLES = `
:where([data-vibeui-block="footer-006"]){
--vibeui-footer-006-bg:oklch(0.22 0.024 200);
--vibeui-footer-006-ink:oklch(0.97 0.006 200);
--vibeui-footer-006-muted:oklch(0.75 0.02 200);
--vibeui-footer-006-border:oklch(0.32 0.026 200);
--vibeui-footer-006-accent:oklch(0.76 0.13 190);
--vibeui-footer-006-accent-fg:oklch(0.2 0.05 190);
--vibeui-footer-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="footer-006"]{
display:block;background:var(--vibeui-footer-006-bg);color:var(--vibeui-footer-006-ink);
font-family:var(--vibeui-footer-006-font);
}
[data-vibeui-block="footer-006"] [data-part="shell"]{
display:grid;gap:2rem;
max-width:74rem;margin:0 auto;padding:3rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-006"] [data-part="brand"]{
margin:0;font-size:1.375rem;font-weight:730;letter-spacing:-0.035em;
}
[data-vibeui-block="footer-006"] [data-part="address"]{
margin:0.75rem 0 0;max-width:30ch;font-style:normal;
color:var(--vibeui-footer-006-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="footer-006"] [data-part="hours"]{
margin:0.75rem 0 0;display:inline-flex;align-items:center;gap:0.4375rem;
color:var(--vibeui-footer-006-accent);font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="footer-006"] [data-part="hours"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:999px;background:currentColor;
}
[data-vibeui-block="footer-006"] [data-part="contacts"]{
display:grid;gap:1rem;margin:0;
}
[data-vibeui-block="footer-006"] [data-part="contact-label"]{
color:var(--vibeui-footer-006-muted);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-006"] [data-part="contacts"] dd{margin:0.25rem 0 0}
[data-vibeui-block="footer-006"] [data-part="contacts"] a{
color:var(--vibeui-footer-006-ink);text-decoration:none;
font-size:1.0625rem;font-weight:620;letter-spacing:-0.015em;
border-bottom:1px solid transparent;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="footer-006"] [data-part="contacts"] a:hover{
color:var(--vibeui-footer-006-accent);border-bottom-color:currentColor;
}
[data-vibeui-block="footer-006"] [data-part="socials"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="footer-006"] [data-part="social"]{
display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:0.75rem;
border:1px solid var(--vibeui-footer-006-border);
color:var(--vibeui-footer-006-muted);text-decoration:none;
font-size:0.75rem;font-weight:750;letter-spacing:0.02em;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="footer-006"] [data-part="social"]:hover{
background:var(--vibeui-footer-006-accent);border-color:var(--vibeui-footer-006-accent);
color:var(--vibeui-footer-006-accent-fg);
}
[data-vibeui-block="footer-006"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;gap:0.5rem 1rem;
padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-006-border);
color:var(--vibeui-footer-006-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-006"] a:focus-visible{outline:2px solid var(--vibeui-footer-006-accent);outline-offset:3px}
@container (min-width: 46rem){
[data-vibeui-block="footer-006"] [data-part="shell"]{grid-template-columns:1.2fr 1fr auto;gap:3rem;padding:4rem 2rem 1.75rem}
[data-vibeui-block="footer-006"] [data-part="socials"]{align-content:start}
[data-vibeui-block="footer-006"] [data-part="bottom"]{grid-column:1 / -1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CONTACTS: Footer006Contact[] = [
  { label: "Телефон", value: "+7 495 000-11-22", href: "tel:+74950001122" },
  {
    label: "Почта",
    value: "hello@yasnaya.ru",
    href: "mailto:hello@yasnaya.ru",
  },
  { label: "Телеграм", value: "@yasnaya_support", href: "#telegram" },
]

const DEFAULT_SOCIALS: Footer006Social[] = [
  { label: "Телеграм", short: "TG", href: "#telegram" },
  { label: "ВКонтакте", short: "VK", href: "#vk" },
  { label: "YouTube", short: "YT", href: "#youtube" },
  { label: "Дзен", short: "DZ", href: "#dzen" },
]

/** Подвал с контактами и соцсетями: телефон и почта — настоящие ссылки. */
export function Footer006({
  brand = "Ясная",
  address = "Москва, Пресненская набережная, 12, вход со стороны сквера, второй этаж",
  hours = "Пн–Пт, 9:00–19:00",
  contacts = DEFAULT_CONTACTS,
  socials = DEFAULT_SOCIALS,
  legal = "© 2026 Клиника «Ясная». Лицензия ЛО-77-01-000000",
  accent,
  className,
  style,
}: Footer006Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-006" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            <p data-part="brand">{brand}</p>
            <address data-part="address">{address}</address>
            <p data-part="hours">{hours}</p>
          </div>
          <dl data-part="contacts">
            {contacts.map((contact) => (
              <div key={contact.href}>
                <dt data-part="contact-label">{contact.label}</dt>
                <dd>
                  <a href={contact.href}>{contact.value}</a>
                </dd>
              </div>
            ))}
          </dl>
          <nav data-part="socials" aria-label="Мы в социальных сетях">
            {socials.map((social) => (
              <a
                key={social.href}
                data-part="social"
                href={social.href}
                aria-label={social.label}
              >
                <span aria-hidden="true">{social.short}</span>
              </a>
            ))}
          </nav>
          <div data-part="bottom">
            <span>{legal}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
