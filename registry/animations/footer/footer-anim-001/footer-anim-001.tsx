import type { CSSProperties } from "react"

type FooterAnim001Link = {
  label: string
  href: string
}

type FooterAnim001Column = {
  title: string
  links: FooterAnim001Link[]
}

type FooterAnim001Social = {
  label: string
  short: string
  href: string
}

export type FooterAnim001Props = {
  brand?: string
  tagline?: string
  columns?: FooterAnim001Column[]
  socials?: FooterAnim001Social[]
  /** Подпись группы соцсетей для скринридера. */
  socialsLabel?: string
  legal?: string
  accent?: string
  /** false — весь блок статично на месте, без появления снизу. */
  animate?: boolean
  className?: string
  style?: CSSProperties
}

// Полноценный подвал сайта: бренд с подписью, колонки ссылок и строка
// соцсетей внизу. При появлении секции в вёрстке бренд и каждая колонка
// въезжают снизу вверх (fade+rise) с нарастающей задержкой слева направо,
// нижняя строка с копирайтом и соцсетями въезжает последней.
//
// Значки соцсетей — буквенные плашки, а не иконочный набор: подвал остаётся
// без единой внешней зависимости. container-type делает подвал собственным
// query-контейнером: число колонок и раскладка строки считаются от ширины
// блока, а не окна.
const STYLES = `
:where([data-vibeui-block="footer-anim-001"]){
--vibeui-footer-anim-001-bg:transparent;
--vibeui-footer-anim-001-ink:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-footer-anim-001-muted:light-dark(oklch(0.52 0.014 265),oklch(0.69 0.012 265));
--vibeui-footer-anim-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-footer-anim-001-accent:light-dark(oklch(0.52 0.19 265),oklch(0.74 0.15 265));
--vibeui-footer-anim-001-accent-fg:light-dark(oklch(0.99 0.004 265),oklch(0.14 0.02 265));
--vibeui-footer-anim-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-anim-001"]{color-scheme:dark}
[data-vibeui-block="footer-anim-001"]{
min-width:min(100%,18rem);
background:var(--vibeui-footer-anim-001-bg);color:var(--vibeui-footer-anim-001-ink);
border-top:1px solid var(--vibeui-footer-anim-001-border);
font-family:var(--vibeui-footer-anim-001-sans);
}
[data-vibeui-block="footer-anim-001"] [data-part="frame"]{
max-width:76rem;margin:0 auto;
padding:clamp(2.5rem,8cqi,4rem) clamp(1.25rem,5cqi,3rem) clamp(1.25rem,4cqi,1.75rem);
display:grid;gap:2rem;
}
[data-vibeui-block="footer-anim-001"] [data-part="brand"]{
display:flex;flex-direction:column;gap:0.625rem;max-width:26rem;
animation:vibeui-footer-anim-001-rise .55s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="footer-anim-001"] [data-part="name"]{
display:inline-flex;align-items:center;gap:0.5rem;
font-size:1rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="footer-anim-001"] [data-part="mark"]{
width:1.375rem;height:1.375rem;border-radius:0.4375rem;
background:linear-gradient(140deg,var(--vibeui-footer-anim-001-accent),color-mix(in oklab,var(--vibeui-footer-anim-001-accent) 55%,white));
}
[data-vibeui-block="footer-anim-001"] [data-part="tagline"]{
margin:0;font-size:0.875rem;line-height:1.6;color:var(--vibeui-footer-anim-001-muted);
}
[data-vibeui-block="footer-anim-001"] [data-part="columns"]{display:grid;gap:1.75rem;grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="footer-anim-001"] [data-part="columns"] nav{
animation:vibeui-footer-anim-001-rise .55s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="footer-anim-001"] [data-part="columns"] nav:nth-child(1){animation-delay:90ms}
[data-vibeui-block="footer-anim-001"] [data-part="columns"] nav:nth-child(2){animation-delay:150ms}
[data-vibeui-block="footer-anim-001"] [data-part="columns"] nav:nth-child(3){animation-delay:210ms}
[data-vibeui-block="footer-anim-001"] [data-part="column-title"]{
display:block;margin-bottom:0.625rem;
font-size:0.75rem;font-weight:650;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-footer-anim-001-muted);
}
[data-vibeui-block="footer-anim-001"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="footer-anim-001"] a{
color:var(--vibeui-footer-anim-001-ink);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-anim-001"] a:hover{color:var(--vibeui-footer-anim-001-accent)}
[data-vibeui-block="footer-anim-001"] a:focus-visible{outline:2px solid var(--vibeui-footer-anim-001-accent);outline-offset:3px;border-radius:0.25rem}
[data-vibeui-block="footer-anim-001"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.25rem;
padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-anim-001-border);
font-size:0.8125rem;color:var(--vibeui-footer-anim-001-muted);
animation:vibeui-footer-anim-001-rise .55s cubic-bezier(.16,1,.3,1) both;animation-delay:280ms;
}
[data-vibeui-block="footer-anim-001"] [data-part="socials"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-left:auto}
[data-vibeui-block="footer-anim-001"] [data-part="social"]{
display:grid;place-items:center;width:2.25rem;height:2.25rem;border-radius:0.625rem;
border:1px solid var(--vibeui-footer-anim-001-border);
color:var(--vibeui-footer-anim-001-muted);text-decoration:none;
font-size:0.6875rem;font-weight:750;letter-spacing:0.02em;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="footer-anim-001"] [data-part="social"]:hover{
background:var(--vibeui-footer-anim-001-accent);border-color:var(--vibeui-footer-anim-001-accent);
color:var(--vibeui-footer-anim-001-accent-fg);
}
@keyframes vibeui-footer-anim-001-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
[data-vibeui-block="footer-anim-001"][data-animate="false"] [data-part="brand"],
[data-vibeui-block="footer-anim-001"][data-animate="false"] [data-part="columns"] nav,
[data-vibeui-block="footer-anim-001"][data-animate="false"] [data-part="bottom"]{animation:none}
@container (min-width: 44rem){
[data-vibeui-block="footer-anim-001"] [data-part="columns"]{grid-template-columns:repeat(3,1fr)}
}
@container (min-width: 60rem){
[data-vibeui-block="footer-anim-001"] [data-part="frame"]{
grid-template-columns:20rem 1fr;gap:4rem;
}
[data-vibeui-block="footer-anim-001"] [data-part="bottom"]{grid-column:span 2}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="footer-anim-001"] [data-part="brand"],
[data-vibeui-block="footer-anim-001"] [data-part="columns"] nav,
[data-vibeui-block="footer-anim-001"] [data-part="bottom"]{animation:none}
}
`

const DEFAULT_COLUMNS: FooterAnim001Column[] = [
  {
    title: "Продукт",
    links: [
      { label: "Компоненты", href: "#components" },
      { label: "Блоки", href: "#blocks" },
      { label: "Тарифы", href: "#pricing" },
      { label: "Обновления", href: "#changelog" },
    ],
  },
  {
    title: "Помощь",
    links: [
      { label: "Документация", href: "#docs" },
      { label: "Как работает установка", href: "#install" },
      { label: "Частые вопросы", href: "#faq" },
      { label: "Поддержка", href: "#support" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "#about" },
      { label: "Блог", href: "#blog" },
      { label: "Контакты", href: "#contact" },
    ],
  },
]

const DEFAULT_SOCIALS: FooterAnim001Social[] = [
  { label: "Телеграм", short: "TG", href: "#telegram" },
  { label: "ВКонтакте", short: "VK", href: "#vk" },
  { label: "YouTube", short: "YT", href: "#youtube" },
]

/**
 * Подвал сайта: бренд, колонки ссылок и соцсети въезжают снизу вверх со
 * стаггером слева направо. Один файл, ноль зависимостей, собственная палитра.
 */
export function FooterAnim001({
  brand = "Полёт",
  tagline = "Готовые блоки интерфейса для тех, кто собирает сайты вместе с ИИ-агентом.",
  columns = DEFAULT_COLUMNS,
  socials = DEFAULT_SOCIALS,
  socialsLabel = "Мы в социальных сетях",
  legal = "© 2026 Студия «Полёт»",
  accent,
  animate = true,
  className,
  style,
}: FooterAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-anim-001" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-anim-001"
        data-animate={animate ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="brand">
            <span data-part="name">
              <span data-part="mark" aria-hidden="true" />
              {brand}
            </span>
            {tagline ? <p data-part="tagline">{tagline}</p> : null}
          </div>
          <div data-part="columns">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <span data-part="column-title">{column.title}</span>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div data-part="bottom">
            <span>{legal}</span>
            {socials.length ? (
              <nav data-part="socials" aria-label={socialsLabel}>
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
            ) : null}
          </div>
        </div>
      </footer>
    </>
  )
}
