import type { CSSProperties, ComponentProps } from "react"

export type Footer035Link = {
  label: string
  href: string
}

export type Footer035Props = {
  brand?: string
  tagline?: string
  address?: string
  hours?: string
  phone?: string
  email?: string
  /** Рукописная пометка у контактов. */
  note?: string
  /** URL iframe карты (Яндекс, 2ГИС, OSM). Пусто — карты нет. */
  mapSrc?: string
  mapTitle?: string
  links?: readonly Footer035Link[]
  socials?: readonly Footer035Link[]
  copyright?: string
  /** Подписи контактов и aria навигации. */
  addressLabel?: string
  hoursLabel?: string
  phoneLabel?: string
  emailLabel?: string
  navLabel?: string
  socialsLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал-контакты цветочной мастерской: слева адрес, часы, телефон и
// рукописная пометка «приходите нюхать», справа карта в «бумажной» рамке
// (iframe приглушён фильтром под цвет страницы). Ниже — имя мастерской
// одной строкой во всю ширину, контурной антиквой: при прокрутке она
// проявляется слева направо, будто её пишут пером, при наведении
// заливается чернилами; в самом низу ссылки и копирайт. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-035"]){
--vibeui-footer-035-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-035-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-035-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-035-muted:color-mix(in oklab,var(--vibeui-footer-035-fg) 62%,var(--vibeui-footer-035-bg));
--vibeui-footer-035-line:color-mix(in oklab,var(--vibeui-footer-035-fg) 16%,transparent);
--vibeui-footer-035-paper:color-mix(in oklab,var(--vibeui-footer-035-fg) 5%,var(--vibeui-footer-035-bg));
--vibeui-footer-035-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-footer-035-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-035-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-035"]{color-scheme:dark}
:where([data-vibeui-block="footer-035"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-035"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-035"]{box-sizing:border-box;padding:5rem 0 1.5rem;overflow:hidden;background:var(--vibeui-footer-035-bg);color:var(--vibeui-footer-035-fg);font-family:var(--vibeui-footer-035-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="footer-035"] *{box-sizing:border-box}
[data-vibeui-block="footer-035"] [data-part="socials"]{margin-left:auto}
[data-vibeui-block="footer-035"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-035"] [data-part="top"]{display:grid;gap:2.5rem;align-items:start}
[data-vibeui-block="footer-035"] [data-part="tagline"]{margin:0 0 1.8rem;font-family:var(--vibeui-footer-035-display);font-weight:500;font-size:clamp(1.8rem,4cqi,2.8rem);line-height:1.05;letter-spacing:-.02em;max-width:22rem}
[data-vibeui-block="footer-035"] [data-part="contacts"]{margin:0;display:grid;gap:1rem}
[data-vibeui-block="footer-035"] [data-part="contacts"] div{display:grid;gap:.15rem;padding-top:.8rem;border-top:1px solid var(--vibeui-footer-035-line)}
[data-vibeui-block="footer-035"] [data-part="contacts"] dt{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footer-035-muted)}
[data-vibeui-block="footer-035"] [data-part="contacts"] dd{margin:0;font-size:1.05rem}
[data-vibeui-block="footer-035"] [data-part="contacts"] a{color:inherit;text-decoration:none;border-bottom:1px solid var(--vibeui-footer-035-line);transition:border-color .2s,color .2s}
[data-vibeui-block="footer-035"] [data-part="contacts"] a:hover{color:var(--vibeui-footer-035-accent);border-color:var(--vibeui-footer-035-accent)}
[data-vibeui-block="footer-035"] [data-part="note"]{margin:1.6rem 0 0;font-family:var(--vibeui-footer-035-hand);font-size:1.5rem;line-height:1.05;color:var(--vibeui-footer-035-accent);transform:rotate(-3deg);transform-origin:left}
[data-vibeui-block="footer-035"] [data-part="map"]{position:relative;margin:0;padding:.6rem;background:var(--vibeui-footer-035-paper);border:1px solid var(--vibeui-footer-035-line);transform:rotate(1deg)}
[data-vibeui-block="footer-035"] [data-part="map"] iframe{display:block;width:100%;aspect-ratio:16/10;max-height:calc(100svh - 24rem);border:0;filter:grayscale(.55) sepia(.18) contrast(.92);background:var(--vibeui-footer-035-line)}
[data-vibeui-block="footer-035"] [data-part="map"] figcaption{padding:.5rem .2rem 0;font-family:var(--vibeui-footer-035-hand);font-size:1.2rem;text-align:center}
[data-vibeui-block="footer-035"] [data-part="pin"]{position:absolute;right:-.8rem;top:-.9rem;width:2.4rem;height:2.4rem;color:var(--vibeui-footer-035-accent);transform:rotate(12deg)}
[data-vibeui-block="footer-035"] [data-part="word"]{margin:2.5rem 0 0;padding:0;font-family:var(--vibeui-footer-035-display);font-style:italic;font-weight:600;font-size:clamp(3.5rem,14cqi,10.5rem);line-height:.85;letter-spacing:-.04em;text-align:center;color:transparent;-webkit-text-stroke:1.5px var(--vibeui-footer-035-fg);transition:color .6s cubic-bezier(.2,.7,.2,1);user-select:none;-webkit-user-select:none}
[data-vibeui-block="footer-035"] [data-part="word"]:hover{color:var(--vibeui-footer-035-fg)}
@keyframes vibeui-footer-035-write{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 -5% 0 0)}}
@supports (animation-timeline: view()){[data-vibeui-block="footer-035"] [data-part="word"]{animation:vibeui-footer-035-write linear both;animation-timeline:view();animation-range:entry 10% cover 45%}}
[data-vibeui-block="footer-035"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.6rem;margin:2rem 0 0;padding:1.2rem 0 0;border-top:1px solid var(--vibeui-footer-035-line);font-size:.85rem;color:var(--vibeui-footer-035-muted)}
[data-vibeui-block="footer-035"] [data-part="bottom"] nav{display:flex;flex-wrap:wrap;gap:.6rem 1.4rem}
[data-vibeui-block="footer-035"] [data-part="bottom"] a{color:inherit;text-decoration:none;transition:color .2s}
[data-vibeui-block="footer-035"] [data-part="bottom"] a:hover{color:var(--vibeui-footer-035-fg)}
[data-vibeui-block="footer-035"] [data-part="copy"]{flex-basis:100%;margin:0}
[data-vibeui-block="footer-035"] a:focus-visible{outline:2px solid var(--vibeui-footer-035-accent);outline-offset:3px}
@container (min-width: 60rem){
[data-vibeui-block="footer-035"] [data-part="socials"]{margin-left:0}[data-vibeui-block="footer-035"] [data-part="top"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem}[data-vibeui-block="footer-035"] [data-part="contacts"]{grid-template-columns:repeat(2,minmax(0,1fr))}[data-vibeui-block="footer-035"] [data-part="copy"]{flex-basis:auto;margin-left:auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-035"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="footer-035"] [data-part="socials"]{margin-left:auto}
`

export type SocialsLink = {
  label: string
  href: string
}

type SocialsProps = Omit<ComponentProps<"nav">, "title" | "children"> & {
  socialsLabel?: string
  socials?: readonly SocialsLink[]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Socials({
  socialsLabel = "Соцсети",
  socials = [ { label: "Telegram", href: "https://t.me/" }, { label: "Instagram", href: "https://instagram.com/" }, ],
  accent,
  className,
  style,
  ...props
}: SocialsProps) {
  const palette = {
    ...(accent ? { "--vibeui-footer-035-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <nav
        {...props} aria-label={socialsLabel}
        className={className}
        style={palette}
      >
        {socials.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </nav>
  )
}

/** Подвал с контактами, картой и огромным контурным именем. */
export function Footer035({
  brand = "Стебель",
  tagline = "Цветочная мастерская на Пестеля, 4",
  address = "Санкт-Петербург, ул. Пестеля, 4, вход с улицы",
  hours = "ежедневно 9:00–22:00",
  phone = "+7 812 407-24-14",
  email = "privet@stebel.flowers",
  note = "приходите просто понюхать — не обязательно покупать",
  mapSrc = "https://yandex.ru/map-widget/v1/?ll=30.3460,59.9425&z=16&pt=30.3460,59.9425,pm2rdm&lang=ru_RU",
  mapTitle = "Карта: мастерская «Стебель» на Пестеля",
  links = [
    { label: "Букеты", href: "#catalog" },
    { label: "Конструктор", href: "#builder" },
    { label: "Доставка", href: "#delivery" },
    { label: "Подписка", href: "#subscribe" },
    { label: "Оферта", href: "#offer" },
  ],
  socials = [
    { label: "Telegram", href: "https://t.me/" },
    { label: "Instagram", href: "https://instagram.com/" },
  ],
  copyright = "© 2014–2026 Стебель",
  addressLabel = "Адрес",
  hoursLabel = "Часы",
  phoneLabel = "Телефон",
  emailLabel = "Почта",
  navLabel = "Разделы",
  socialsLabel = "Соцсети",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer035Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-035-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-035-fg": ink } : null),
    ...(background ? { "--vibeui-footer-035-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-035" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-035" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div>
              {tagline ? <p data-part="tagline">{tagline}</p> : null}
              <dl data-part="contacts">
                {address ? (
                  <div>
                    <dt>{addressLabel}</dt>
                    <dd>{address}</dd>
                  </div>
                ) : null}
                {hours ? (
                  <div>
                    <dt>{hoursLabel}</dt>
                    <dd>{hours}</dd>
                  </div>
                ) : null}
                {phone ? (
                  <div>
                    <dt>{phoneLabel}</dt>
                    <dd>
                      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
                    </dd>
                  </div>
                ) : null}
                {email ? (
                  <div>
                    <dt>{emailLabel}</dt>
                    <dd>
                      <a href={`mailto:${email}`}>{email}</a>
                    </dd>
                  </div>
                ) : null}
              </dl>
              {note ? <p data-part="note">{note}</p> : null}
            </div>
            {mapSrc ? (
              <figure data-part="map">
                <svg data-part="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <iframe src={mapSrc} title={mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                <figcaption>{address}</figcaption>
              </figure>
            ) : null}
          </div>
          <p data-part="word" aria-hidden="true">
            {brand}
          </p>
          <div data-part="bottom">
            <nav aria-label={navLabel}>
              {links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
            {socials.length > 0 ? (
              <Socials data-part="socials" socialsLabel={socialsLabel} socials={socials} accent={accent} />
            ) : null}
            <p data-part="copy">{copyright}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
