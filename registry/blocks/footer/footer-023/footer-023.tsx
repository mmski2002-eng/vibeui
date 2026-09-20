import type { CSSProperties } from "react"

export type Footer023Link = {
  label: string
  href: string
}

export type Footer023Social = {
  /** telegram | vk | instagram | youtube — иконка; иначе первая буква. */
  kind: string
  label: string
  href: string
}

export type Footer023Props = {
  brand?: string
  brandHref?: string
  address?: string
  hours?: string
  phone?: string
  phoneHref?: string
  columns?: readonly { title: string; links: readonly Footer023Link[] }[]
  socials?: readonly Footer023Social[]
  /** «18+», лицензия, год. */
  legal?: string
  /** Ссылка на карту. */
  mapLabel?: string
  mapHref?: string
  /** aria значка 18+. */
  ageLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал тату-студии: неоновая линия сверху, логотип-вывеска, адрес, часы
// и телефон, две колонки ссылок, соцсети кружками со свечением по
// наведению, внизу «18+», лицензия и год. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-023"]){
--vibeui-footer-023-bg:#050408;
--vibeui-footer-023-fg:#f3eefc;
--vibeui-footer-023-muted:#a39bb5;
--vibeui-footer-023-line:rgb(255 255 255 / .12);
--vibeui-footer-023-accent:#ff2bd6;
--vibeui-footer-023-accent-2:#8b5cff;
--vibeui-footer-023-cyan:#22f3ff;
--vibeui-footer-023-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-023-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-023-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-023"]{color-scheme:dark}
:where([data-vibeui-block="footer-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-023"]{box-sizing:border-box;position:relative;display:block;background:var(--vibeui-footer-023-bg);color:var(--vibeui-footer-023-fg);font-family:var(--vibeui-footer-023-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="footer-023"]::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:linear-gradient(90deg,transparent,var(--vibeui-footer-023-accent) 30%,var(--vibeui-footer-023-accent-2) 70%,transparent);box-shadow:0 0 12px var(--vibeui-footer-023-accent)}
[data-vibeui-block="footer-023"] *{box-sizing:border-box}
[data-vibeui-block="footer-023"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-023"] a:focus-visible{outline:2px solid var(--vibeui-footer-023-cyan);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="footer-023"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:3rem 1.25rem 1.75rem}
[data-vibeui-block="footer-023"] [data-part="top"]{display:grid;gap:2rem;padding-bottom:2rem;border-bottom:1px solid var(--vibeui-footer-023-line)}
[data-vibeui-block="footer-023"] [data-part="brand"]{display:inline-block;font-family:var(--vibeui-footer-023-display);font-size:1.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-footer-023-accent);text-shadow:0 0 6px var(--vibeui-footer-023-accent),0 0 18px color-mix(in oklab,var(--vibeui-footer-023-accent) 70%,transparent)}
[data-vibeui-block="footer-023"] [data-part="address"]{margin:1rem 0 0;color:var(--vibeui-footer-023-muted)}
[data-vibeui-block="footer-023"] [data-part="hours"]{margin:.4rem 0 0;font-family:var(--vibeui-footer-023-mono);font-size:.8rem;letter-spacing:.06em;color:var(--vibeui-footer-023-muted)}
[data-vibeui-block="footer-023"] [data-part="phone"]{display:inline-block;margin-top:.75rem;font-family:var(--vibeui-footer-023-mono);font-size:1.1rem;font-weight:700;color:var(--vibeui-footer-023-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-footer-023-cyan) 60%,transparent)}
[data-vibeui-block="footer-023"] [data-part="map"]{display:inline-block;margin:.75rem 0 0 1rem;font-size:.85rem;color:var(--vibeui-footer-023-muted);border-bottom:1px solid color-mix(in oklab,var(--vibeui-footer-023-accent) 60%,transparent)}
[data-vibeui-block="footer-023"] [data-part="col-title"]{margin:0 0 .75rem;font-family:var(--vibeui-footer-023-mono);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footer-023-cyan)}
[data-vibeui-block="footer-023"] [data-part="links"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.92rem}
[data-vibeui-block="footer-023"] [data-part="links"] a{color:var(--vibeui-footer-023-muted);transition:color .2s,text-shadow .3s}
[data-vibeui-block="footer-023"] [data-part="links"] a:hover{color:var(--vibeui-footer-023-fg);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-footer-023-accent) 70%,transparent)}
[data-vibeui-block="footer-023"] [data-part="socials"]{display:flex;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-023"] [data-part="social"]{display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;border:1px solid var(--vibeui-footer-023-line);font-weight:700;transition:border-color .25s,box-shadow .3s,transform .25s}
[data-vibeui-block="footer-023"] [data-part="social"]:hover{transform:translateY(-3px);border-color:var(--vibeui-footer-023-accent);box-shadow:0 0 16px color-mix(in oklab,var(--vibeui-footer-023-accent) 60%,transparent)}
[data-vibeui-block="footer-023"] [data-part="social"] svg{width:1.1rem;height:1.1rem;fill:currentColor}
[data-vibeui-block="footer-023"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.5rem;padding-top:1.25rem;font-size:.78rem;color:var(--vibeui-footer-023-muted)}
[data-vibeui-block="footer-023"] [data-part="age"]{display:inline-grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:50%;border:2px solid var(--vibeui-footer-023-accent);font-family:var(--vibeui-footer-023-mono);font-size:.75rem;font-weight:700;color:var(--vibeui-footer-023-accent);box-shadow:0 0 10px color-mix(in oklab,var(--vibeui-footer-023-accent) 60%,transparent)}
@container (min-width: 56rem){
[data-vibeui-block="footer-023"] [data-part="shell"]{padding:4rem 2rem 1.75rem}
[data-vibeui-block="footer-023"] [data-part="top"]{grid-template-columns:1.6fr 1fr 1fr auto;gap:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-023"] *{transition:none!important}}`

const ICONS: Record<string, string> = {
  telegram: "M9.04 15.47 8.7 20.1c.5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.6.2 1.8-.8L22 4.8c.3-1.3-.5-1.8-1.3-1.5L2.4 10.3c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5L17.7 6.5c.5-.3 1-.2.6.2z",
  vk: "M12.8 17.4c-5.7 0-9-3.9-9.1-10.4h2.9c.1 4.8 2.2 6.8 3.9 7.2V7h2.7v4.1c1.6-.2 3.4-2.1 4-4.1h2.7c-.5 2.6-2.3 4.5-3.6 5.3 1.3.6 3.4 2.3 4.2 5.1h-3c-.6-2-2.2-3.5-4.3-3.7v3.7z",
  instagram: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21 8.7c-.1-1.6-.4-3-1.6-4.2S16.9 3 15.3 3C13.7 2.9 10.3 2.9 8.7 3 7.1 3.1 5.7 3.4 4.5 4.6S3 7.1 3 8.7c-.1 1.6-.1 5 0 6.6.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 5 .1 6.6 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-5 0-6.6zm-2.2 8.2a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.9s-.1-4.6.4-5.9A3.3 3.3 0 0 1 5.1 3.2c1.3-.5 4.4-.4 5.9-.4s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.9s.1 4.6-.4 5.9z",
  youtube: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z",
}

/** Подвал тату-студии: неоновая линия, адрес и часы, ссылки, соцсети, «18+» и лицензия. */
export function Footer023({
  brand = "Inkra",
  brandHref = "#",
  address = "Санкт-Петербург, Лиговский пр., 50, двор, вход у неоновой стрелки",
  hours = "ежедневно 12:00–22:00",
  phone = "+7 812 240-70-17",
  phoneHref = "tel:+78122407017",
  columns = [
    { title: "Студия", links: [{ label: "Работы", href: "#works" }, { label: "Мастера", href: "#artists" }, { label: "Цены", href: "#pricing" }, { label: "Вопросы", href: "#faq" }] },
    { title: "Клиентам", links: [{ label: "Записаться", href: "#booking" }, { label: "Уход за тату", href: "#" }, { label: "Подарочный сертификат", href: "#" }, { label: "Договор и политика", href: "#" }] },
  ],
  socials = [
    { kind: "telegram", label: "Telegram", href: "https://t.me/" },
    { kind: "instagram", label: "Instagram", href: "https://instagram.com/" },
    { kind: "vk", label: "ВКонтакте", href: "https://vk.com/" },
    { kind: "youtube", label: "YouTube", href: "https://youtube.com/" },
  ],
  legal = "ИП Волкова А. С., лицензия № ЛО-78-01-011245. Только для лиц старше 18 лет. © 2014–2026.",
  mapLabel = "на карте",
  mapHref = "https://yandex.ru/maps/",
  ageLabel = "18 плюс",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Footer023Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-023-accent": accent } : null),
    ...(background ? { "--vibeui-footer-023-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-023" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div>
              <a data-part="brand" href={brandHref}>
                {brand}
              </a>
              {address ? <p data-part="address">{address}</p> : null}
              {hours ? <p data-part="hours">{hours}</p> : null}
              {phone ? (
                <a data-part="phone" href={phoneHref}>
                  {phone}
                </a>
              ) : null}
              {mapLabel ? (
                <a data-part="map" href={mapHref} target="_blank" rel="noreferrer noopener">
                  {mapLabel}
                </a>
              ) : null}
            </div>
            {columns.map((column) => (
              <div key={column.title}>
                <p data-part="col-title">{column.title}</p>
                <ul data-part="links">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <ul data-part="socials">
              {socials.map((social) => (
                <li key={social.label}>
                  <a data-part="social" href={social.href} aria-label={social.label} target="_blank" rel="noreferrer noopener">
                    {ICONS[social.kind] ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d={ICONS[social.kind]} />
                      </svg>
                    ) : (
                      social.label.slice(0, 1)
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div data-part="bottom">
            <span data-part="age" aria-label={ageLabel}>
              18+
            </span>
            {legal ? <span>{legal}</span> : null}
          </div>
        </div>
      </footer>
    </>
  )
}
