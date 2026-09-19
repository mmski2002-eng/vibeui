import type { CSSProperties } from "react"

export type Footer034Link = {
  label: string
  href: string
}

export type Footer034Column = {
  title: string
  links: readonly Footer034Link[]
}

export type Footer034Props = {
  brand?: string
  caption?: string
  phone?: string
  phoneHref?: string
  address?: string
  hours?: string
  columns?: readonly Footer034Column[]
  socials?: readonly Footer034Link[]
  legal?: readonly Footer034Link[]
  /** Строка лицензии — обязательна для клиник, показываем крупно. */
  license?: string
  copyright?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал ветклиники: по верху дорожка следов, которые прошагивают слева
// направо по очереди (animation-delay по индексу) и растворяются, потом
// заново. Бренд с лапой, телефон крупно, адрес и часы, три колонки
// ссылок, лицензия отдельной строкой, соцсети и правовые ссылки. Без
// стейта — серверный компонент.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-034"]){
--vibeui-footer-034-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-034-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-034-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-034-on-accent:oklch(from var(--vibeui-footer-034-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-footer-034-muted:color-mix(in oklab,var(--vibeui-footer-034-fg) 62%,var(--vibeui-footer-034-bg));
--vibeui-footer-034-line:color-mix(in oklab,var(--vibeui-footer-034-fg) 12%,transparent);
--vibeui-footer-034-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-034-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-034"]{color-scheme:dark}
:where([data-vibeui-block="footer-034"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-034"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-034"]{box-sizing:border-box;position:relative;padding:0 0 2rem;background:var(--vibeui-footer-034-bg);color:var(--vibeui-footer-034-fg);font-family:var(--vibeui-footer-034-font);font-size:.92rem;line-height:1.5;overflow:hidden}
[data-vibeui-block="footer-034"] *{box-sizing:border-box}
[data-vibeui-block="footer-034"] [data-part="trail"]{display:flex;justify-content:space-between;max-width:80rem;margin:0 auto;padding:1.5rem 1.25rem 0;border-top:1px solid var(--vibeui-footer-034-line)}
[data-vibeui-block="footer-034"] [data-part="trail"] svg{width:1.5rem;height:1.5rem;color:var(--vibeui-footer-034-accent);opacity:0;transform:rotate(calc(var(--vibeui-footer-034-tilt) * 1deg));animation:vibeui-footer-034-step 6s ease-out infinite;animation-delay:calc(var(--vibeui-footer-034-i) * .35s)}
[data-vibeui-block="footer-034"] [data-part="trail"] svg:nth-child(even){translate:0 .6rem}
[data-vibeui-block="footer-034"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2.5rem 1.25rem 0;display:grid;gap:2.5rem}
[data-vibeui-block="footer-034"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--vibeui-footer-034-display);font-weight:900;font-size:1.5rem;letter-spacing:-.02em}
[data-vibeui-block="footer-034"] [data-part="brand"] svg{width:2.1rem;height:2.1rem;padding:.4rem;border-radius:.8rem;background:var(--vibeui-footer-034-accent);color:var(--vibeui-footer-034-on-accent);transform:rotate(-12deg)}
[data-vibeui-block="footer-034"] [data-part="caption"]{margin:.8rem 0 0;max-width:20rem;color:var(--vibeui-footer-034-muted)}
[data-vibeui-block="footer-034"] [data-part="phone"]{display:inline-block;margin:1.3rem 0 0;color:var(--vibeui-footer-034-fg);text-decoration:none;font-family:var(--vibeui-footer-034-display);font-weight:900;font-size:1.6rem;letter-spacing:-.02em;transition:color .2s}
[data-vibeui-block="footer-034"] [data-part="phone"]:hover{color:var(--vibeui-footer-034-accent)}
[data-vibeui-block="footer-034"] [data-part="where"]{margin:.5rem 0 0;color:var(--vibeui-footer-034-muted)}
[data-vibeui-block="footer-034"] [data-part="where"] b{display:block;color:var(--vibeui-footer-034-fg);font-weight:600}
[data-vibeui-block="footer-034"] [data-part="columns"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem}
[data-vibeui-block="footer-034"] [data-part="columns"] h3{margin:0 0 .7rem;font-family:var(--vibeui-footer-034-display);font-weight:800;font-size:.95rem}
[data-vibeui-block="footer-034"] [data-part="columns"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.4rem}
[data-vibeui-block="footer-034"] [data-part="columns"] a{color:var(--vibeui-footer-034-muted);text-decoration:none;transition:color .2s}
[data-vibeui-block="footer-034"] [data-part="columns"] a:hover{color:var(--vibeui-footer-034-accent)}
[data-vibeui-block="footer-034"] [data-part="license"]{margin:0;padding:1rem 1.2rem;border-radius:1rem;background:color-mix(in oklab,var(--vibeui-footer-034-fg) 5%,transparent);font-size:.82rem;color:var(--vibeui-footer-034-muted)}
[data-vibeui-block="footer-034"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.5rem;padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-034-line);font-size:.8rem;color:var(--vibeui-footer-034-muted)}
[data-vibeui-block="footer-034"] [data-part="socials"]{display:flex;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-034"] [data-part="socials"] a{display:inline-flex;align-items:center;padding:.4rem .8rem;border-radius:999px;border:1px solid var(--vibeui-footer-034-line);color:var(--vibeui-footer-034-fg);text-decoration:none;font-weight:600;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="footer-034"] [data-part="socials"] a:hover{background:var(--vibeui-footer-034-accent);color:var(--vibeui-footer-034-on-accent);border-color:transparent}
[data-vibeui-block="footer-034"] [data-part="legal"]{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:0 0 0 auto;padding:0;list-style:none}
[data-vibeui-block="footer-034"] [data-part="legal"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-034"] [data-part="legal"] a:hover{color:var(--vibeui-footer-034-fg)}
[data-vibeui-block="footer-034"] a:focus-visible{outline:2px solid var(--vibeui-footer-034-accent);outline-offset:2px}
@keyframes vibeui-footer-034-step{0%{opacity:0;scale:.6}6%{opacity:.9;scale:1}45%{opacity:.9}70%,100%{opacity:0}}
@container (min-width: 40rem){[data-vibeui-block="footer-034"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="footer-034"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1.4fr);align-items:start}[data-vibeui-block="footer-034"] [data-part="license"],[data-vibeui-block="footer-034"] [data-part="bottom"]{grid-column:1/-1}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-034"] *{animation:none!important;transition:none!important}[data-vibeui-block="footer-034"] [data-part="trail"] svg{opacity:.6}}`

const DEFAULT_COLUMNS: Footer034Column[] = [
  { title: "Услуги", links: [{ label: "Терапия", href: "#services" }, { label: "Хирургия", href: "#services" }, { label: "Стоматология", href: "#services" }, { label: "Груминг", href: "#grooming" }, { label: "Экзоты", href: "#services" }] },
  { title: "Клиника", links: [{ label: "Врачи", href: "#doctors" }, { label: "Цены", href: "#services" }, { label: "Отзывы", href: "#diary" }, { label: "Вакансии", href: "#" }] },
  { title: "Помощь", links: [{ label: "Симптом-чекер", href: "#symptoms" }, { label: "Что взять с собой", href: "#" }, { label: "Подготовка к операции", href: "#" }, { label: "Вопросы", href: "#" }] },
]

const TRAIL = [-20, 15, -10, 20, -15, 12, -18, 16, -8, 14, -22, 10]

function PawIcon(props: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={props.style}>
      <ellipse cx="7" cy="8.2" rx="2.2" ry="2.9" />
      <ellipse cx="17" cy="8.2" rx="2.2" ry="2.9" />
      <ellipse cx="3.4" cy="13.2" rx="1.9" ry="2.4" />
      <ellipse cx="20.6" cy="13.2" rx="1.9" ry="2.4" />
      <path d="M12 11.3c3.4 0 6.2 2.7 6.2 5.8 0 2-1.6 3.4-3.6 3.4-1 0-1.7-.5-2.6-.5s-1.6.5-2.6.5c-2 0-3.6-1.4-3.6-3.4 0-3.1 2.8-5.8 6.2-5.8Z" />
    </svg>
  )
}

/** Подвал ветклиники с дорожкой следов. */
export function Footer034({
  brand = "Лапа",
  caption = "Ветклиника и груминг на Соколе. Лечим кошек, собак, кроликов и всех, кто поместится в переноску.",
  phone = "+7 495 120-24-24",
  phoneHref = "tel:+74951202424",
  address = "Ленинградский проспект, 62 · м. Сокол",
  hours = "Приём 9:00–21:00 · экстренно — круглосуточно",
  columns = DEFAULT_COLUMNS,
  socials = [
    { label: "Telegram", href: "#" },
    { label: "VK", href: "#" },
    { label: "Карты", href: "#" },
  ],
  legal = [
    { label: "Политика данных", href: "#" },
    { label: "Оферта", href: "#" },
  ],
  license = "Лицензия на ветеринарную деятельность № 77-ВД-004182 от 12.03.2019 · ООО «Лапа» · ОГРН 1197746001234",
  copyright = "© 2017–2026 Лапа",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer034Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-034-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-034-fg": ink } : null),
    ...(background ? { "--vibeui-footer-034-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-034" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-034" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="trail" aria-hidden="true">
          {TRAIL.map((tilt, index) => (
            <PawIcon key={index} style={{ ["--vibeui-footer-034-i" as string]: index, ["--vibeui-footer-034-tilt" as string]: tilt } as CSSProperties} />
          ))}
        </div>
        <div data-part="shell">
          <div>
            <p data-part="brand">
              <PawIcon />
              {brand}
            </p>
            {caption ? <p data-part="caption">{caption}</p> : null}
            {phone ? (
              <a data-part="phone" href={phoneHref}>
                {phone}
              </a>
            ) : null}
            {address || hours ? (
              <p data-part="where">
                {address ? <b>{address}</b> : null}
                {hours}
              </p>
            ) : null}
          </div>
          <div data-part="columns">
            {columns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {license ? <p data-part="license">{license}</p> : null}
          <div data-part="bottom">
            {socials.length > 0 ? (
              <ul data-part="socials">
                {socials.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
            <span>{copyright}</span>
            {legal.length > 0 ? (
              <ul data-part="legal">
                {legal.map((link) => (
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
