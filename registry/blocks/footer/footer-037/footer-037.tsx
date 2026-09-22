import type { CSSProperties, ComponentProps } from "react"

export type Footer037Link = {
  label: string
  href: string
}

export type Footer037Column = {
  title: string
  links: readonly Footer037Link[]
}

export type Footer037Props = {
  brand?: string
  caption?: string
  /** Часы работы: «10:00 — 02:00, без выходных». */
  hours?: string
  phone?: string
  phoneHref?: string
  columns?: readonly Footer037Column[]
  socials?: readonly Footer037Link[]
  legal?: readonly Footer037Link[]
  copyright?: string
  /** Огромное слово внизу; пусто — бренд. */
  giant?: string
  socialsLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал доставки: сверху томатная полоса, лого с пламенем и подпись,
// чип часов работы и телефон крупно, колонки ссылок, соцсети. Внизу —
// огромное слово-контур на всю ширину (outline-текст поверх заливки,
// уходит за нижний край), под ним правовые ссылки и копирайт.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-037"]){
--vibeui-footer-037-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-037-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-037-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-037-on-accent:oklch(from var(--vibeui-footer-037-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-footer-037-muted:color-mix(in oklab,var(--vibeui-footer-037-fg) 62%,var(--vibeui-footer-037-bg));
--vibeui-footer-037-line:color-mix(in oklab,var(--vibeui-footer-037-fg) 14%,transparent);
--vibeui-footer-037-chip:color-mix(in oklab,var(--vibeui-footer-037-fg) 7%,transparent);
--vibeui-footer-037-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-037-font:"Onest",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-037"]{color-scheme:dark}
:where([data-vibeui-block="footer-037"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-037"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-037"]{box-sizing:border-box;position:relative;overflow:hidden;padding:4rem 0 0;background:var(--vibeui-footer-037-bg);color:var(--vibeui-footer-037-fg);font-family:var(--vibeui-footer-037-font);font-size:.92rem;line-height:1.5}
[data-vibeui-block="footer-037"]::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:var(--vibeui-footer-037-accent)}
[data-vibeui-block="footer-037"] *{box-sizing:border-box}
[data-vibeui-block="footer-037"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="footer-037"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.45rem;font-family:var(--vibeui-footer-037-display);font-weight:900;font-size:1.3rem;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="footer-037"] [data-part="brand"] svg{width:1.3rem;height:1.3rem;color:var(--vibeui-footer-037-accent)}
[data-vibeui-block="footer-037"] [data-part="caption"]{margin:.8rem 0 0;max-width:22rem;color:var(--vibeui-footer-037-muted)}
[data-vibeui-block="footer-037"] [data-part="hours"]{display:inline-flex;align-items:center;gap:.5rem;margin:1.2rem 0 0;padding:.5rem .9rem;border-radius:999px;background:var(--vibeui-footer-037-chip);font-size:.84rem;font-weight:600}
[data-vibeui-block="footer-037"] [data-part="hours"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:#22c55e}
[data-vibeui-block="footer-037"] [data-part="phone"]{display:block;margin:1rem 0 0;font-family:var(--vibeui-footer-037-display);font-weight:700;font-size:1.3rem;letter-spacing:-.02em;color:inherit;text-decoration:none;font-variant-numeric:tabular-nums}
[data-vibeui-block="footer-037"] [data-part="phone"]:hover{color:var(--vibeui-footer-037-accent)}
[data-vibeui-block="footer-037"] [data-part="columns"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-037"] [data-part="socials"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.4rem 0 0;padding:0;list-style:none}
[data-vibeui-block="footer-037"] [data-part="socials"] a{display:inline-flex;align-items:center;height:2.3rem;padding:0 .9rem;border-radius:999px;border:1px solid var(--vibeui-footer-037-line);color:var(--vibeui-footer-037-fg);text-decoration:none;font-size:.84rem;font-weight:600;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="footer-037"] [data-part="socials"] a:hover{background:var(--vibeui-footer-037-accent);color:var(--vibeui-footer-037-on-accent);border-color:transparent}
[data-vibeui-block="footer-037"] a:focus-visible{outline:2px solid var(--vibeui-footer-037-accent);outline-offset:2px}
[data-vibeui-block="footer-037"] [data-part="giant"]{margin:3rem 0 0;overflow:hidden;line-height:.78;text-align:center;font-family:var(--vibeui-footer-037-display);font-weight:900;font-size:clamp(3.4rem,15cqi,13.5rem);letter-spacing:-.05em;text-transform:uppercase;color:transparent;-webkit-text-stroke:2px color-mix(in oklab,var(--vibeui-footer-037-fg) 40%,transparent);user-select:none;transform:translateY(.14em)}
[data-vibeui-block="footer-037"] [data-part="giant"] span{display:inline-block;background:linear-gradient(to top,var(--vibeui-footer-037-accent) 0 38%,transparent 38%);-webkit-background-clip:text;background-clip:text}
[data-vibeui-block="footer-037"] [data-part="foot"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-037"] [data-part="bottom"]{position:relative;background:var(--vibeui-footer-037-bg);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem 1.5rem;padding:1.2rem 0 1.4rem;border-top:1px solid var(--vibeui-footer-037-line);font-size:.8rem;color:var(--vibeui-footer-037-muted)}
[data-vibeui-block="footer-037"] [data-part="legal"]{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-037"] [data-part="legal"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-037"] [data-part="legal"] a:hover{color:var(--vibeui-footer-037-fg)}
@container (min-width: 52rem){[data-vibeui-block="footer-037"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1.4fr);gap:3rem}[data-vibeui-block="footer-037"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-037"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="footer-037"] [data-part="column"] h3{margin:0 0 .8rem;font-size:.76rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footer-037-muted)}
[data-vibeui-block="footer-037"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footer-037"] [data-part="column"] a{color:var(--vibeui-footer-037-fg);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="footer-037"] [data-part="column"] a:hover{color:var(--vibeui-footer-037-accent)}
`

export type ColumnLink = {
  label: string
  href: string
}

type ColumnProps = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  links?: readonly ColumnLink[]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Column({
  title = "Меню",
  links = [{ label: "Бургеры", href: "#menu" }, { label: "Азия", href: "#menu" }, { label: "Конструктор боула", href: "#builder" }, { label: "Десерты", href: "#menu" }],
  accent,
  className,
  style,
  ...props
}: ColumnProps) {
  const palette = {
    ...(accent ? { "--vibeui-footer-037-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <li
        {...props}
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </li>
  )
}

/** Подвал доставки с часами работы, телефоном и словом-контуром. */
export function Footer037({
  brand = "Горячо",
  caption = "Дарк-китчен на Бауманской. Готовим после оплаты, везём своими курьерами, в термосумке, без посредников.",
  hours = "Сегодня до 02:00 · без выходных",
  phone = "+7 495 120-28-00",
  phoneHref = "tel:+74951202800",
  columns = [
    { title: "Меню", links: [{ label: "Бургеры", href: "#menu" }, { label: "Азия", href: "#menu" }, { label: "Конструктор боула", href: "#builder" }, { label: "Десерты", href: "#menu" }] },
    { title: "Доставка", links: [{ label: "Зоны и время", href: "#zones" }, { label: "Трекер заказа", href: "#tracker" }, { label: "Приложение", href: "#app" }, { label: "Вопросы", href: "#faq" }] },
    { title: "Компания", links: [{ label: "О кухне", href: "#about" }, { label: "Вакансии курьеров", href: "#jobs" }, { label: "Партнёрам", href: "#partners" }, { label: "Пресса", href: "#press" }] },
  ],
  socials = [
    { label: "Telegram", href: "#telegram" },
    { label: "VK", href: "#vk" },
    { label: "Дзен", href: "#dzen" },
  ],
  legal = [
    { label: "Оферта", href: "#offer" },
    { label: "Конфиденциальность", href: "#privacy" },
    { label: "Состав и аллергены", href: "#allergens" },
  ],
  copyright = "© 2026 ООО «Горячо». Москва, Бауманская, 20с2",
  giant,
  socialsLabel = "Соцсети",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer037Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-037-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-037-fg": ink } : null),
    ...(background ? { "--vibeui-footer-037-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-037" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-037" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            <p data-part="brand">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2 .8-3.3 1.6-4.3.3 1.6 1.2 2.3 2.1 2.3.2-3.4-.6-6.5 1.3-9Z" />
              </svg>
              {brand}
            </p>
            {caption ? <p data-part="caption">{caption}</p> : null}
            {hours ? <p data-part="hours">{hours}</p> : null}
            {phone ? (
              <a data-part="phone" href={phoneHref}>
                {phone}
              </a>
            ) : null}
            {socials.length > 0 ? (
              <ul data-part="socials" aria-label={socialsLabel}>
                {socials.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <ul data-part="columns">
            {columns.map((column) => (
              <Column key={column.title} data-part="column" title={column.title} links={column.links} accent={accent} />
            ))}
          </ul>
        </div>
        <p data-part="giant" aria-hidden="true">
          <span>{giant ?? brand}</span>
        </p>
        <div data-part="foot">
          <div data-part="bottom">
            <ul data-part="legal">
              {legal.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <span>{copyright}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
