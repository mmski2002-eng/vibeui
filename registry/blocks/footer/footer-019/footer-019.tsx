import type { CSSProperties } from "react"

export type Footer019Messenger = {
  /** Значок: telegram, whatsapp, vk, max — или свой short-текст. */
  kind?: "telegram" | "whatsapp" | "vk" | "max"
  label: string
  href: string
  short?: string
}

export type Footer019Link = {
  label: string
  href: string
}

export type Footer019Props = {
  brand?: string
  caption?: string
  address?: string
  hours?: string
  phone?: string
  phoneHref?: string
  email?: string
  messengersLabel?: string
  messengers?: readonly Footer019Messenger[]
  links?: readonly Footer019Link[]
  legal?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал агентства на тёмно-зелёном: имя серифом, адрес и часы, телефон
// крупно, почта, мессенджеры настоящими значками (Telegram, WhatsApp, VK,
// Max) с подписями, внизу ссылки и строка с лицензией. Серверный.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-019"]){
--vibeui-footer-019-bg:light-dark(#173b2e,#0f1a15);
--vibeui-footer-019-fg:#eef0ea;
--vibeui-footer-019-muted:color-mix(in oklab,#eef0ea 66%,transparent);
--vibeui-footer-019-line:color-mix(in oklab,#eef0ea 16%,transparent);
--vibeui-footer-019-chip:color-mix(in oklab,#eef0ea 8%,transparent);
--vibeui-footer-019-accent:#b8925a;
--vibeui-footer-019-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-footer-019-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-019"]{color-scheme:dark}
:where([data-vibeui-block="footer-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-019"]{box-sizing:border-box;display:block;background:var(--vibeui-footer-019-bg);color:var(--vibeui-footer-019-fg);font-family:var(--vibeui-footer-019-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="footer-019"] *{box-sizing:border-box}
[data-vibeui-block="footer-019"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-019"] a:focus-visible{outline:2px solid var(--vibeui-footer-019-accent);outline-offset:3px;border-radius:.25rem}
[data-vibeui-block="footer-019"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:3.5rem 1.25rem 2rem}
[data-vibeui-block="footer-019"] [data-part="top"]{display:grid;gap:2.25rem;padding-bottom:2.5rem;border-bottom:1px solid var(--vibeui-footer-019-line)}
[data-vibeui-block="footer-019"] [data-part="brand"]{margin:0;font-family:var(--vibeui-footer-019-display);font-size:2rem;font-weight:600;line-height:1}
[data-vibeui-block="footer-019"] [data-part="caption"]{margin:.5rem 0 0;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footer-019-muted)}
[data-vibeui-block="footer-019"] address{font-style:normal;margin:1.25rem 0 0;color:var(--vibeui-footer-019-muted);max-width:22rem}
[data-vibeui-block="footer-019"] [data-part="hours"]{display:flex;gap:.55rem;align-items:baseline;margin-top:.75rem;font-size:.85rem;color:var(--vibeui-footer-019-accent)}
[data-vibeui-block="footer-019"] [data-part="hours"]::before{content:"";flex:none;width:.45rem;height:.45rem;border-radius:50%;background:currentColor;transform:translateY(-.1rem)}
[data-vibeui-block="footer-019"] [data-part="label"]{display:block;margin:0 0 .5rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footer-019-muted)}
[data-vibeui-block="footer-019"] [data-part="phone"]{display:inline-block;font-family:var(--vibeui-footer-019-display);font-size:1.9rem;font-weight:600;line-height:1.1;letter-spacing:.01em}
[data-vibeui-block="footer-019"] [data-part="email"]{display:inline-block;margin-top:1rem;font-weight:600;border-bottom:1px solid var(--vibeui-footer-019-accent);padding-bottom:.1rem}
[data-vibeui-block="footer-019"] [data-part="messengers"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-019"] [data-part="messenger"]{display:inline-flex;align-items:center;gap:.55rem;height:2.75rem;padding:0 1rem 0 .5rem;border-radius:999px;background:var(--vibeui-footer-019-chip);border:1px solid var(--vibeui-footer-019-line);font-weight:600;font-size:.85rem;transition:background .2s,border-color .2s,transform .2s}
[data-vibeui-block="footer-019"] [data-part="messenger"]:hover{background:var(--vibeui-footer-019-line);border-color:var(--vibeui-footer-019-accent);transform:translateY(-1px)}
[data-vibeui-block="footer-019"] [data-part="icon"]{display:grid;place-items:center;width:1.85rem;height:1.85rem;border-radius:50%;background:var(--vibeui-footer-019-accent);color:#14211b;font-size:.75rem;font-weight:700}
[data-vibeui-block="footer-019"] [data-part="icon"] svg{width:1.05rem;height:1.05rem;fill:currentColor}
[data-vibeui-block="footer-019"] [data-part="bottom"]{display:flex;flex-wrap:wrap;gap:1rem 2rem;align-items:center;justify-content:space-between;padding-top:1.5rem;font-size:.78rem;color:var(--vibeui-footer-019-muted)}
[data-vibeui-block="footer-019"] [data-part="links"]{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-019"] [data-part="links"] a{color:var(--vibeui-footer-019-fg);opacity:.85}
[data-vibeui-block="footer-019"] [data-part="links"] a:hover{opacity:1;color:var(--vibeui-footer-019-accent)}
@container (min-width: 56rem){
[data-vibeui-block="footer-019"] [data-part="shell"]{padding:4.5rem 2rem 2rem}
[data-vibeui-block="footer-019"] [data-part="top"]{grid-template-columns:1.3fr 1fr 1.2fr;gap:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-019"] *{transition:none!important}}`

const ICONS: Record<NonNullable<Footer019Messenger["kind"]>, string | null> = {
  telegram:
    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z",
  vk: "M12.785 16.241s.288-.032.436-.194c.136-.148.131-.427.131-.427s-.019-1.307.577-1.5c.588-.19 1.343 1.264 2.143 1.823.604.422 1.063.33 1.063.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.309-.662-1.588-1.87-1.34-1.264-1.16-1.06.454-3.246.983-1.331 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.311.056c-.13.079-.213.262-.213.262s-.381 1.03-.889 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.518.099.709.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.071-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161c-.112.135-.009.412-.009.412s1.79 4.258 3.817 6.403c1.858 1.967 3.968 1.838 3.968 1.838h.956z",
  max: null,
}

const DEFAULT_MESSENGERS: Footer019Messenger[] = [
  { kind: "telegram", label: "Telegram", href: "https://t.me/" },
  { kind: "whatsapp", label: "WhatsApp", href: "https://wa.me/" },
  { kind: "max", label: "Max", href: "https://max.ru/", short: "M" },
  { kind: "vk", label: "ВКонтакте", href: "https://vk.com/" },
]

const DEFAULT_LINKS: Footer019Link[] = [
  { label: "Политика конфиденциальности", href: "#" },
  { label: "Договор оферты", href: "#" },
]

/** Подвал агентства: адрес, часы, телефон, почта и мессенджеры значками. */
export function Footer019({
  brand = "Дом на Неве",
  caption = "Агентство недвижимости · Петербург",
  address = "Санкт-Петербург, наб. реки Фонтанки, 24, первый этаж",
  hours = "Ежедневно 10:00–20:00, показы по договорённости",
  phone = "+7 812 240-00-40",
  phoneHref = "tel:+78122400040",
  email = "hello@example.com",
  messengersLabel = "Напишите, где удобно",
  messengers = DEFAULT_MESSENGERS,
  links = DEFAULT_LINKS,
  legal = "© 2007–2026 ООО «Дом на Неве». Лицензия РГР № 0412. Не оферта.",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Footer019Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-019-accent": accent } : null),
    ...(background ? { "--vibeui-footer-019-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-019" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-019" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div>
              <p data-part="brand">{brand}</p>
              {caption ? <p data-part="caption">{caption}</p> : null}
              {address ? <address>{address}</address> : null}
              {hours ? <p data-part="hours">{hours}</p> : null}
            </div>
            <div>
              {phone ? (
                <>
                  <span data-part="label">Телефон</span>
                  <a data-part="phone" href={phoneHref}>
                    {phone}
                  </a>
                </>
              ) : null}
              {email ? (
                <div>
                  <a data-part="email" href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              ) : null}
            </div>
            <div>
              {messengersLabel ? <span data-part="label">{messengersLabel}</span> : null}
              <ul data-part="messengers">
                {messengers.map((messenger) => {
                  const icon = messenger.kind ? ICONS[messenger.kind] : null
                  return (
                    <li key={messenger.label}>
                      <a data-part="messenger" href={messenger.href} target="_blank" rel="noreferrer noopener">
                        <span data-part="icon" aria-hidden="true">
                          {icon ? (
                            <svg viewBox="0 0 24 24">
                              <path d={icon} />
                            </svg>
                          ) : (
                            messenger.short ?? messenger.label.slice(0, 2)
                          )}
                        </span>
                        {messenger.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div data-part="bottom">
            {legal ? <p style={{ margin: 0 }}>{legal}</p> : null}
            {links.length > 0 ? (
              <ul data-part="links">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  )
}
